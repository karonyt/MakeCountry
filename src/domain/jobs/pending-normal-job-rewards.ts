import { IS_SPLIT_BUILD } from "@/shared/build-flags.js";
import { remoteJobPay } from "@/domain/jobs/remote-job-pay.js";
import { Player, ScriptEventSource, system, world } from "@minecraft/server";
import jobs_config from "@/config/jobs.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { storageReadReady } from "@/shared/storage/write-hook.js";
import { applyDailyLimit } from "@/domain/jobs/daily-limit.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { formatJobRewardValues, getDailyEarning } from "@/domain/jobs/job-reward-display.js";
import { showPlayerActionBar } from "@/shared/ui/player-feedback.js";

const JOBS = ["woodcutter", "dirtdigger", "sanddigger", "gardener", "netherdigger", "miner", "farmer", "builder", "hunter", "fisherman"] as const;
type NormalJob = typeof JOBS[number];
type RewardPlan = { money: number; xp: number };
type Receipt = RewardPlan & {
    version: 1;
    id: string;
    order: number;
    playerId: string;
    job: NormalJob;
    phase: "pending" | "executing" | "settled" | "blocked";
    reason?: string;
};
type StoredReceipt = Receipt & { dirty: boolean; owned: boolean };
type UnplannedWork = { id: string; order: number; playerId: string; job: NormalJob; calculate: (player: Player) => RewardPlan };

// Native-only receipts must survive Core mirror refreshes and legacy-property pruning.
const PREFIX = "karo:normal_job_reward#";
const records = new Map<string, StoredReceipt>();
// Completed after-events cannot be undone. Until a plan reaches Native storage,
// memory can retry failures, but a VM loss cannot recover this unfinished acceptance.
const unplanned = new Map<string, UnplannedWork>();
let sequence = 0;
let acceptedSequence = 0;
let loaded = false;
let invalidReceipts = 0;
let storageFailures = 0;
let processing = false;
let playerDB: DynamicProperties;
const keyFor = (id: string) => `${PREFIX}${id}`;

function warnStorage() {
    storageFailures++;
    if (storageFailures === 1 || storageFailures % 20 === 0) console.warn("[jobs] normal receipt storage unavailable; retaining work");
}
function validPlan(value: any): boolean {
    return value && Number.isFinite(value.money) && value.money >= 0 && value.money <= Number.MAX_SAFE_INTEGER
        && Number.isFinite(value.xp) && value.xp >= 0 && value.xp <= Number.MAX_SAFE_INTEGER;
}
function persist(entry: StoredReceipt) {
    if (!entry.owned) {
        if (world.getDynamicProperty(keyFor(entry.id)) !== undefined) throw Error("normal_reward_receipt_collision");
        entry.owned = true;
    }
    entry.dirty = true;
    const { dirty, owned, ...data } = entry;
    world.setDynamicProperty(keyFor(entry.id), JSON.stringify(data));
    entry.dirty = false;
}
function load(): boolean {
    if (loaded) return true;
    try {
        invalidReceipts = 0;
        for (const key of world.getDynamicPropertyIds().filter(key => key.startsWith(PREFIX))) {
            if (records.has(key.slice(PREFIX.length))) continue;
            const raw = world.getDynamicProperty(key); // Native read errors are retried, not treated as malformed JSON.
            try {
                if (typeof raw !== "string") throw Error("invalid_normal_reward_receipt");
                const e = JSON.parse(raw);
                const fields = ["version", "id", "order", "playerId", "job", "money", "xp", "phase", "reason"];
                if (!validPlan(e) || e.version !== 1 || Object.keys(e).some(k => !fields.includes(k))
                    || !JOBS.includes(e.job) || typeof e.id !== "string" || !/^[a-z0-9-]{1,100}$/.test(e.id) || key !== keyFor(e.id)
                    || !Number.isSafeInteger(e.order) || e.order < 1
                    || typeof e.playerId !== "string" || e.playerId.length < 1 || e.playerId.length > 256
                    || !["pending", "executing", "settled", "blocked"].includes(e.phase)
                    || (e.reason !== undefined && (typeof e.reason !== "string" || e.reason.length > 100))) throw Error("invalid_normal_reward_receipt");
                const entry: StoredReceipt = { ...e, dirty: false, owned: true };
                if (entry.phase === "executing") {
                    // 分割版: 支払いは Lite が ID ごとに一度だけ行うので、送り直して確かめられる
                    if (IS_SPLIT_BUILD) { entry.phase = "pending"; entry.dirty = true; }
                    else { entry.phase = "blocked"; entry.reason = "payment_unconfirmed_after_restart"; entry.dirty = true; }
                }
                records.set(entry.id, entry);
                acceptedSequence = Math.max(acceptedSequence, entry.order);
            } catch { invalidReceipts++; } // Keep unknown/corrupt records intact for review.
        }
        loaded = true;
        return true;
    } catch { warnStorage(); return false; }
}
function changePhase(entry: StoredReceipt, phase: Receipt["phase"], reason?: string) {
    entry.phase = phase;
    if (reason === undefined) delete entry.reason; else entry.reason = reason;
    entry.dirty = true;
    try { persist(entry); } catch { warnStorage(); }
}
function cleanup(entry: StoredReceipt) {
    if (entry.dirty) return;
    try { world.setDynamicProperty(keyFor(entry.id), undefined); records.delete(entry.id); }
    catch { warnStorage(); }
}
function sync(): boolean {
    if (!load()) return false;
    for (const entry of records.values()) {
        if (entry.dirty) { try { persist(entry); } catch { warnStorage(); } }
        if (entry.phase === "settled") cleanup(entry);
    }
    return true;
}
function livePlayer(player: Player | undefined): player is Player {
    return !!player?.isValid && !player.hasTag("status:loading") && !player.hasTag("status:transferring");
}
function notify(player: Player, entry: Receipt, money: number, progress: ReturnType<JobLevel["get"]>, data: any) {
    if (!jobs_config.showRewardMessage || !player.isValid) return;
    try {
        const display = formatJobRewardValues(money, getDailyEarning(data, entry.job), jobs_config.dailyLimit[entry.job], entry.xp, progress);
        showPlayerActionBar(player, `§6[Money]${display.money} §e[XP]${display.xp}`);
    } catch { console.warn("[jobs] normal reward display failed after payment"); }
}

/** Retry durable completed work; an unconfirmed payment after restart requires review. */
export function flushNormalJobRewards() {
    if (processing || !playerDB) return;
    processing = true;
    try {
        if (!sync()) return;
        const online = new Map(world.getPlayers().map(player => [player.id, player]));
        // Work accepted during an unavailable Native load follows all recovered receipts.
        for (const work of unplanned.values()) {
            if (!work.order) work.order = ++acceptedSequence;
        }
        const queue = [...records.values(), ...unplanned.values()].sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
        const canPay = jobs_config.validity && storageReadReady("player");
        const blocked = new Set([...records.values()].filter(e => e.phase === "blocked" || e.phase === "executing").map(e => e.playerId));
        const planningBlocked = new Set<string>();
        for (const work of queue) {
            let entry: StoredReceipt;
            if ("calculate" in work) {
                if (planningBlocked.has(work.playerId)) continue;
                const player = online.get(work.playerId);
                // Loading/transfer tags postpone payment, not the durable receipt of completed work.
                if (!player?.isValid) { planningBlocked.add(work.playerId); continue; }
                try {
                    const plan = work.calculate(player);
                    if (!validPlan(plan)) throw Error("invalid_normal_reward_plan");
                    entry = { money: plan.money, xp: plan.xp, version: 1, id: work.id, order: work.order, playerId: work.playerId, job: work.job, phase: "pending", dirty: true, owned: false };
                    records.set(entry.id, entry);
                    // Retain the exact amounts even when the first Native save throws.
                    unplanned.delete(work.id);
                    try { persist(entry); } catch { warnStorage(); }
                } catch {
                    // No later calculation/payment may overtake this unpriced work.
                    planningBlocked.add(work.playerId); warnStorage(); continue;
                }
            } else entry = work;
            if (entry.phase !== "pending" || blocked.has(entry.playerId) || planningBlocked.has(entry.playerId)) continue;
            if (entry.dirty) { blocked.add(entry.playerId); continue; }
            // Persist the receipt before consulting Core, including during a cold mirror load.
            if (!canPay) continue;
            const player = online.get(entry.playerId);
            if (!livePlayer(player)) continue;
            if (IS_SPLIT_BUILD) { payNormalRemotely(entry, player); blocked.add(entry.playerId); continue; }
            let begun = false;
            let committed = false;
            const block = (reason: string) => { changePhase(entry, "blocked", reason); blocked.add(entry.playerId); };
            try {
                const raw = playerDB.get(`player_${player.id}`);
                if (!raw) { block("player_record_missing"); continue; }
                let data: any;
                try { data = JSON.parse(raw); } catch { block("player_record_invalid"); continue; }
                if (!data || !Number.isFinite(data.money)) { block("player_money_invalid"); continue; }
                const finalReward = applyDailyLimit(data, entry.job, entry.money, jobs_config.dailyLimit[entry.job]);
                if (finalReward <= 0) { changePhase(entry, "settled", "daily_limit"); cleanup(entry); continue; }
                const nextMoney = data.money + finalReward;
                if (!Number.isFinite(nextMoney)) { block("player_money_overflow"); continue; }
                // Both money and XP remain untouched until executing is durable.
                entry.phase = "executing"; entry.dirty = true;
                try { persist(entry); }
                catch { changePhase(entry, "pending"); warnStorage(); blocked.add(entry.playerId); continue; }
                begun = true;
                data.money = nextMoney;
                const progress = new JobLevel(player, entry.job).addXp(entry.xp, () => playerDB.set(`player_${player.id}`, JSON.stringify(data)));
                committed = true;
                changePhase(entry, "settled", "paid"); cleanup(entry);
                notify(player, entry, finalReward, progress, data);
            } catch (error) {
                if (committed) continue;
                if (begun) {
                    const uncertain = error instanceof Error && ["job_progress_rollback_failed", "native_property_rollback_failed"].includes(error.message);
                    changePhase(entry, uncertain ? "blocked" : "pending", uncertain ? "rollback_failed" : undefined);
                }
                // Preserve work order if this player's preceding payment failed.
                blocked.add(entry.playerId);
                console.warn("[jobs] normal payment unavailable; retaining receipt");
            }
        }
    } catch { console.warn("[jobs] normal retry unavailable; retaining receipts"); }
    finally { processing = false; }
}

/** Accept after-events only. Before-event callers must defer with system.run first. */
export function enqueueNormalJobReward(player: Player, job: NormalJob, calculate: (player: Player) => RewardPlan) {
    // Previous work may level this player up; calculate this reward afterwards.
    flushNormalJobRewards();
    const id = `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.floor(Math.random() * 0x100000000).toString(36)}`;
    unplanned.set(id, { id, order: loaded ? ++acceptedSequence : 0, playerId: player.id, job, calculate });
    flushNormalJobRewards();
}

export function normalJobRewardStatus() {
    return { receipts: records.size, unplanned: unplanned.size, pending: [...records.values()].filter(e => e.phase === "pending").length,
        blocked: [...records.values()].filter(e => e.phase === "blocked").length, dirty: [...records.values()].filter(e => e.dirty).length,
        invalidReceipts, storageFailures };
}
world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new DynamicProperties("player");
    system.run(flushNormalJobRewards);
    system.runInterval(flushNormalJobRewards, 20);
});
world.afterEvents.playerSpawn.subscribe(() => { system.run(flushNormalJobRewards); });
system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id !== "karo:normaljobrewarddiag" || event.sourceType !== ScriptEventSource.Server || event.sourceEntity || event.sourceBlock || event.initiator) return;
    console.warn("[normal-job-reward-diagnostics] " + JSON.stringify(normalJobRewardStatus()));
});

/** 分割版: 票を Lite に払ってもらい、支払いを確認してから経験値を足して閉じる。 */
function payNormalRemotely(entry: StoredReceipt, player: Player) {
    entry.phase = "executing"; entry.dirty = true;
    try { persist(entry); } catch { changePhase(entry, "pending"); warnStorage(); return; }
    remoteJobPay(entry.id, player.id, entry.job, entry.money)
        .then(result => {
            if (result.paid <= 0) { changePhase(entry, "settled", "daily_limit"); cleanup(entry); return; }
            if (!player.isValid) throw new Error("player_left_before_xp");
            const progress = new JobLevel(player, entry.job).addXp(entry.xp);
            changePhase(entry, "settled", "paid"); cleanup(entry);
            notify(player, entry, result.paid, progress, result.playerData);
        })
        .catch(() => { if (entry.phase === "executing") changePhase(entry, "pending"); });
}
