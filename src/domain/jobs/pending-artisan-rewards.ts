import { Player, ScriptEventSource, system, world } from "@minecraft/server";
import jobs_config from "@/config/jobs.js";
import config from "@/config/server.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { storageReadReady } from "@/shared/storage/write-hook.js";
import { applyDailyLimit } from "@/domain/jobs/job-events.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { formatJobRewardValues, getDailyEarning } from "@/domain/jobs/job-reward-display.js";

type ArtisanJob = "chef" | "chemist" | "blacksmith";
export type ArtisanRewardPlan = {
    job: ArtisanJob;
    money: number;
    xp: number;
    rank: string;
    display: "cooking" | "mixer" | "chemistry" | "smelting";
};
type Receipt = ArtisanRewardPlan & {
    version: 1 | 2;
    order?: number;
    id: string;
    playerId: string;
    phase: "prepared" | "pending" | "executing" | "settled" | "blocked";
    reason?: string;
};
type StoredReceipt = Receipt & { dirty: boolean; owned: boolean };
export type ArtisanCraftSession = {
    artisanRewardPlan?: ArtisanRewardPlan | null;
    artisanRewardId?: string;
    artisanCraftStarted?: boolean;
};

const PREFIX = "karo:artisan_reward#";
const records = new Map<string, StoredReceipt>();
let sequence = 0;
let acceptedOrder = 0;
let loaded = false;
let invalidReceipts = 0;
let storageFailures = 0;
let processing = false;
let playerDB: DynamicProperties;
const keyFor = (id: string) => `${PREFIX}${id}`;
function warnStorage() {
    storageFailures++;
    if (storageFailures === 1 || storageFailures % 20 === 0) console.warn("[jobs] artisan receipt storage unavailable; retaining work");
}
function validPlan(value: any): boolean {
    return value && ["chef", "chemist", "blacksmith"].includes(value.job)
        && Number.isFinite(value.money) && value.money >= 0 && value.money <= Number.MAX_SAFE_INTEGER
        && Number.isFinite(value.xp) && value.xp >= 0 && value.xp <= Number.MAX_SAFE_INTEGER
        && typeof value.rank === "string" && /^[A-Z][A-Z0-9_+-]{0,31}$/.test(value.rank)
        && ["cooking", "mixer", "chemistry", "smelting"].includes(value.display);
}
function persist(entry: StoredReceipt) {
    if (!entry.owned) {
        if (world.getDynamicProperty(keyFor(entry.id)) !== undefined) throw Error("artisan_reward_receipt_collision");
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
            const raw = world.getDynamicProperty(key); // A Native read exception is transient, not corrupt JSON.
            try {
                if (typeof raw !== "string") throw Error("invalid_artisan_reward_receipt");
                const e = JSON.parse(raw);
                const fields = ["version", "id", "playerId", "phase", "job", "money", "xp", "rank", "display", "reason", "order"];
                if (!validPlan(e) || ![1, 2].includes(e.version) || Object.keys(e).some(k => !fields.includes(k))
                    || (e.version === 1 && e.order !== undefined)
                    || (e.version === 2 && (!Number.isSafeInteger(e.order) || e.order <= 0))
                    || typeof e.id !== "string" || !/^[a-z0-9-]{1,100}$/.test(e.id) || key !== keyFor(e.id)
                    || typeof e.playerId !== "string" || e.playerId.length < 1 || e.playerId.length > 256
                    || !["prepared", "pending", "executing", "settled", "blocked"].includes(e.phase)
                    || (e.reason !== undefined && (typeof e.reason !== "string" || e.reason.length > 100))) throw Error("invalid_artisan_reward_receipt");
                const entry: StoredReceipt = { ...e, dirty: false, owned: true };
                if (entry.version === 2) acceptedOrder = Math.max(acceptedOrder, entry.order!);
                if (entry.phase === "prepared" || entry.phase === "executing") {
                    entry.reason = entry.phase === "prepared" ? "craft_completion_unconfirmed_after_restart" : "payment_unconfirmed_after_restart";
                    entry.phase = "blocked"; entry.dirty = true;
                }
                records.set(entry.id, entry);
            } catch { invalidReceipts++; } // Unreadable receipts are retained for review.
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
function prepare(player: Player, session: ArtisanCraftSession, plan: ArtisanRewardPlan): StoredReceipt | undefined {
    if (!validPlan(plan) || !load()) return undefined;
    let entry = session.artisanRewardId ? records.get(session.artisanRewardId) : undefined;
    if (session.artisanRewardId && (!entry || entry.playerId !== player.id || entry.phase !== "prepared")) return undefined;
    if (!entry) {
        const id = `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.floor(Math.random() * 0x100000000).toString(36)}`;
        if (acceptedOrder >= Number.MAX_SAFE_INTEGER) return undefined;
        entry = { ...plan, version: 2, order: ++acceptedOrder, id, playerId: player.id, phase: "prepared", dirty: true, owned: false };
        records.set(id, entry); session.artisanRewardId = id;
    }
    if (entry.dirty) { try { persist(entry); } catch { warnStorage(); return undefined; } }
    return entry;
}
// V1 receipts predate every V2 acceptance. Their generated IDs retain the
// original timestamp/counter; never use Native property enumeration as work order.
function compareReceiptOrder(a: Receipt, b: Receipt): number {
    if (a.version !== b.version) return a.version === 1 ? -1 : 1;
    if (a.version === 2) return a.order! - b.order!;
    const left = a.id.split("-").slice(0, 2).map(value => parseInt(value, 36));
    const right = b.id.split("-").slice(0, 2).map(value => parseInt(value, 36));
    if (left.length === 2 && right.length === 2 && [...left, ...right].every(value => Number.isSafeInteger(value) && value >= 0)) {
        if (left[0] !== right[0]) return left[0] - right[0];
        if (left[1] !== right[1]) return left[1] - right[1];
    }
    return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}
function notify(player: Player, entry: Receipt, money: number, xp: number, progress: ReturnType<JobLevel["get"]>, playerData: any) {
    if (!player.isValid) return;
    try {
        const display = formatJobRewardValues(money, getDailyEarning(playerData, entry.job), jobs_config.dailyLimit[entry.job], xp, progress, config.MoneyName);
        player.onScreenDisplay.setActionBar({ rawtext: [
            { translate: `${entry.display}.reward.prefix` }, { text: ` ${entry.rank} ` },
            { translate: `${entry.display}.reward.money` }, { text: display.money },
            { translate: `${entry.display}.reward.xp` }, { text: display.xp },
        ] });
    } catch { console.warn("[jobs] artisan display failed after payment"); }
}

/** Retry only confirmed completed crafts. Prepared/executing work after a VM restart requires review. */
export function flushArtisanRewards() {
    if (processing || !playerDB) return;
    processing = true;
    try {
        if (!sync() || !jobs_config.validity || !storageReadReady("player")) return;
        const online = new Map(world.getPlayers().map(player => [player.id, player]));
        const blocked = new Set([...records.values()].filter(e => e.phase === "blocked" || e.phase === "executing").map(e => e.playerId));
        for (const entry of [...records.values()].sort(compareReceiptOrder)) {
            if (entry.phase !== "pending" || blocked.has(entry.playerId)) continue;
            if (entry.dirty) { blocked.add(entry.playerId); continue; }
            const player = online.get(entry.playerId);
            if (!player?.isValid || player.hasTag("status:loading") || player.hasTag("status:transferring")) continue;
            let begun = false;
            let committed = false;
            try {
                const raw = playerDB.get(`player_${player.id}`);
                if (!raw) { changePhase(entry, "blocked", "player_record_missing"); blocked.add(entry.playerId); continue; }
                let data: any;
                try { data = JSON.parse(raw); }
                catch { changePhase(entry, "blocked", "player_record_invalid"); blocked.add(entry.playerId); continue; }
                if (!data || !Number.isFinite(data.money)) { changePhase(entry, "blocked", "player_money_invalid"); blocked.add(entry.playerId); continue; }
                const finalReward = applyDailyLimit(data, entry.job, entry.money, jobs_config.dailyLimit[entry.job]);
                const job = new JobLevel(player, entry.job);
                if (finalReward <= 0) {
                    changePhase(entry, "settled", "daily_limit"); cleanup(entry);
                    notify(player, entry, 0, 0, job.get(), data); continue;
                }
                const nextMoney = data.money + finalReward;
                if (!Number.isFinite(nextMoney)) { changePhase(entry, "blocked", "player_money_overflow"); blocked.add(entry.playerId); continue; }
                // Do not touch XP/money until this claim's executing state is durable.
                entry.phase = "executing"; entry.dirty = true;
                try { persist(entry); }
                catch { changePhase(entry, "pending"); warnStorage(); blocked.add(entry.playerId); continue; }
                begun = true;
                data.money = nextMoney;
                const progress = job.addXp(entry.xp, () => playerDB.set(`player_${player.id}`, JSON.stringify(data)));
                committed = true;
                changePhase(entry, "settled", "paid"); cleanup(entry);
                notify(player, entry, finalReward, entry.xp, progress, data);
            } catch (error) {
                if (committed) continue;
                if (begun) {
                    const uncertain = error instanceof Error && ["job_progress_rollback_failed", "native_property_rollback_failed"].includes(error.message);
                    changePhase(entry, uncertain ? "blocked" : "pending", uncertain ? "rollback_failed" : undefined);
                    if (uncertain) blocked.add(entry.playerId);
                }
                blocked.add(entry.playerId);
                console.warn("[jobs] artisan payment unavailable; retaining receipt");
            }
        }
    } catch { console.warn("[jobs] artisan retry unavailable; retaining receipts"); }
    finally { processing = false; }
}

/** Reserve the exact reward before consuming ingredients. A failed reserve keeps the session intact. */
export function runArtisanCraft(player: Player, session: ArtisanCraftSession, reward: () => ArtisanRewardPlan | undefined, produce: () => void): boolean {
    if (session.artisanCraftStarted || !player.isValid) return false;
    let entry: StoredReceipt | undefined;
    try {
        if (session.artisanRewardPlan === undefined) session.artisanRewardPlan = reward() ?? null;
        // Preparation failures have not completed any work. Preserve the original
        // finish-time qualification if the player leaves the job before retrying.
        if (session.artisanRewardPlan && (!jobs_config.validity || !player.hasTag(`mcjobs_${session.artisanRewardPlan.job}`))) {
            cancelArtisanCraft(session);
            session.artisanRewardPlan = null;
            delete session.artisanRewardId;
        }
        if (session.artisanRewardPlan) {
            entry = prepare(player, session, session.artisanRewardPlan);
            if (!entry) return false;
        }
    } catch { warnStorage(); return false; }
    session.artisanCraftStarted = true;
    try { produce(); }
    catch (error) {
        if (entry) changePhase(entry, "blocked", "craft_completion_failed");
        throw error;
    }
    if (entry) {
        // If this save fails, dirty work cannot pay until pending is durably confirmed.
        changePhase(entry, "pending");
        flushArtisanRewards();
    }
    return true;
}

/** A rejected retry which has not consumed anything can safely release its preparation. */
export function cancelArtisanCraft(session: ArtisanCraftSession | undefined) {
    if (!session || session.artisanCraftStarted || !session.artisanRewardId) return;
    const entry = records.get(session.artisanRewardId);
    if (!entry || entry.phase !== "prepared") return;
    changePhase(entry, "settled", "cancelled_before_production"); cleanup(entry);
    delete session.artisanRewardId;
    delete session.artisanRewardPlan;
}

export function artisanRewardStatus() {
    return { receipts: records.size, pending: [...records.values()].filter(e => e.phase === "pending").length,
        blocked: [...records.values()].filter(e => e.phase === "blocked").length, dirty: [...records.values()].filter(e => e.dirty).length,
        invalidReceipts, storageFailures };
}
world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new DynamicProperties("player");
    // Let every worldLoad handler register its cold-mirror readiness gate first.
    system.run(flushArtisanRewards);
    system.runInterval(flushArtisanRewards, 20);
});
world.afterEvents.playerSpawn.subscribe(() => { system.run(flushArtisanRewards); });
system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id !== "karo:artisanrewarddiag" || event.sourceType !== ScriptEventSource.Server || event.sourceEntity || event.sourceBlock || event.initiator) return;
    console.warn("[artisan-reward-diagnostics] " + JSON.stringify(artisanRewardStatus()));
});
