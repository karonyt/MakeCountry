import { IS_SPLIT_BUILD } from "@/shared/build-flags.js";
import { payPendingRewardRemotely } from "@/domain/jobs/remote-job-pay.js";
import { Entity, GameMode, Player, system, world } from "@minecraft/server";
import jobs_config from "@/config/jobs.js";
import { applyDailyLimit } from "@/domain/jobs/daily-limit.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { formatJobRewardValues, getDailyEarning } from "@/domain/jobs/job-reward-display.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { getRandomInteger } from "@/shared/utils/minecraft.js";
import { showPlayerActionBar } from "@/shared/ui/player-feedback.js";
import { PendingJobRewards, type PendingJobReward } from "@/domain/jobs/pending-job-rewards.js";
import { storageReadReady } from "@/shared/storage/write-hook.js";

// Persist on the animal so unloading or restarting cannot allow a second reward.
const REWARDED_PROPERTY = "mc_tamer_rewarded";
// Keep the World receipt until the animal itself confirms that the claim is used.
const pendingTames = new PendingJobRewards("tamer", entry => {
    if (!entry.sourceId) return false;
    try {
        const entity = world.getEntity(entry.sourceId);
        if (!entity?.isValid || entity instanceof Player) return false;
        if (entity.getDynamicProperty(REWARDED_PROPERTY) !== true) entity.setDynamicProperty(REWARDED_PROPERTY, true);
        return entity.getDynamicProperty(REWARDED_PROPERTY) === true;
    } catch { return false; }
});
let flushScheduled = false;
let playerDB: DynamicProperties;
let buff: RewardBuff;

function canEarn(player: Player): boolean {
    return jobs_config.validity && player.isValid && player.hasTag("mcjobs_tamer")
        && player.getGameMode() === GameMode.Survival;
}

function scheduleFlush(delay = 1) {
    if (flushScheduled) return;
    flushScheduled = true;
    if (delay === 1) system.run(flushTameRewards);
    else system.runTimeout(flushTameRewards, delay);
}

function queueTameReward(entity: Entity, player: Player) {
    if (!entity.isValid || entity.getDynamicProperty(REWARDED_PROPERTY) === true) return;
    // An ineligible first tame must never become a reward on a later re-tame.
    if (entity.hasTag("pet") || !canEarn(player)) {
        entity.setDynamicProperty(REWARDED_PROPERTY, true);
        return;
    }
    try {
        // The stable source claim must exist before setting the animal's marker.
        // A duplicate event after a VM restart returns the same claim.
        pendingTames.enqueue(player.id, 1, entity.id);
        entity.setDynamicProperty(REWARDED_PROPERTY, true);
    } catch {
        // Failed receipt writes retain the work in memory. Do not mark an animal
        // before its receipt exists; settled receipts also retry marker repair.
        console.warn("[jobs] tamer claim could not be fully persisted; retaining work");
    } finally {
        if (pendingTames.needsWork()) scheduleFlush();
    }
}

function settle(entries: PendingJobReward[], outcome: "paid" | "skipped") {
    for (const entry of entries) pendingTames.settle(entry, outcome);
}

function flushTameRewards() {
    try {
        pendingTames.sync();
        if (!storageReadReady("player")) return;
        const entries = pendingTames.entries();
        const blockedPlayers = new Set(entries.filter(entry => entry.phase === "blocked" || entry.phase === "executing").map(entry => entry.playerId));
        const grouped = new Map<string, PendingJobReward[]>();
        for (const entry of entries) {
            if (entry.phase !== "pending" || blockedPlayers.has(entry.playerId)) continue;
            const group = grouped.get(entry.playerId) ?? [];
            group.push(entry); grouped.set(entry.playerId, group);
        }
        for (const [playerId, group] of grouped) {
            let begun = false;
            let committed = false;
            try {
                // IDs are opaque: let Native reject malformed IDs without assuming a numeric format.
                // Missing/unloaded sources are valid accepted work; retain their settled claim later.
                let invalidSource = false;
                for (const entry of group) {
                    try {
                        if (world.getEntity(entry.sourceId!) instanceof Player) {
                            pendingTames.block(entry, "invalid_source_entity"); invalidSource = true;
                        }
                    } catch {
                        pendingTames.block(entry, "invalid_source_id"); invalidSource = true;
                    }
                }
                if (invalidSource) { blockedPlayers.add(playerId); continue; }

                let player: Entity | undefined;
                try { player = world.getEntity(playerId); }
                catch {
                    for (const entry of group) pendingTames.block(entry, "invalid_player_id");
                    blockedPlayers.add(playerId); continue;
                }
                // An offline player has no usable wrapper. Keep their claim for login.
                if (!(player instanceof Player) || !player.isValid) continue;
                if (player.hasTag("status:loading") || player.hasTag("status:transferring")) continue;
                if (!canEarn(player)) { settle(group, "skipped"); continue; }
                if (IS_SPLIT_BUILD) {
                    // 分割版: 票を 1 枚ずつ Lite に払ってもらう
                    const entry = group[0];
                    const job = new JobLevel(player, "tamer");
                    const multiplier = buff.getMultiplier("tamer");
                    const money = getRandomInteger(jobs_config.tameReward.min, jobs_config.tameReward.max) * entry.amount * job.getReward(job.getLevel()) * multiplier;
                    payPendingRewardRemotely(pendingTames, entry, player, "tamer", { money, xp: jobs_config.tameReward.xp * entry.amount * multiplier });
                    continue;
                }
                const raw = playerDB.get(`player_${playerId}`);
                if (!raw) { for (const entry of group) pendingTames.block(entry, "missing_player_record"); continue; }
                let playerData: any;
                try { playerData = JSON.parse(raw); }
                catch { for (const entry of group) pendingTames.block(entry, "invalid_player_record"); continue; }
                if (!playerData || !Number.isFinite(playerData.money)) {
                    for (const entry of group) pendingTames.block(entry, "invalid_player_money");
                    continue;
                }
                const amount = group.reduce((sum, entry) => sum + entry.amount, 0);
                if (!Number.isSafeInteger(amount) || amount <= 0) {
                    for (const entry of group) pendingTames.block(entry, "invalid_work_amount");
                    continue;
                }
                const job = new JobLevel(player, "tamer");
                const multiplier = buff.getMultiplier("tamer");
                const reward = getRandomInteger(jobs_config.tameReward.min, jobs_config.tameReward.max)
                    * amount * job.getReward(job.getLevel()) * multiplier;
                const finalReward = applyDailyLimit(playerData, "tamer", reward, jobs_config.dailyLimit.tamer);
                if (finalReward <= 0) { settle(group, "skipped"); continue; }

                // All claims enter executing before a single combined payment.
                pendingTames.beginMany(group);
                begun = true;
                const xpReward = jobs_config.tameReward.xp * amount * multiplier;
                playerData.money = Math.round((playerData.money + finalReward) * 100) / 100;
                const progress = job.addXp(xpReward, () => playerDB.set(`player_${playerId}`, playerData));
                committed = true;
                settle(group, "paid");

                if (jobs_config.showRewardMessage) {
                    const display = formatJobRewardValues(
                        finalReward, getDailyEarning(playerData, "tamer"),
                        jobs_config.dailyLimit.tamer, xpReward, progress
                    );
                    showPlayerActionBar(player, `§6[Money]${display.money} §e[XP]${display.xp}`);
                }
            } catch (error) {
                if (!committed && begun) for (const entry of group) pendingTames.retry(entry, error);
                console.warn("[jobs] tamer " + (committed ? "display failed after payment" : "payment deferred; retaining work"));
            }
        }
    } finally {
        flushScheduled = false;
        if (pendingTames.needsWork()) scheduleFlush(20);
    }
}

world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new DynamicProperties("player");
    buff = new RewardBuff();
    pendingTames.load();
    if (pendingTames.needsWork()) scheduleFlush();

    const event = world.afterEvents.entityTamed;
    if (event) {
        event.subscribe(({ entity, tamingEntity }) => {
            if (tamingEntity instanceof Player) queueTameReward(entity, tamingEntity);
        });
        return;
    }

    // Older servers expose the vanilla success event instead. Wait for owner
    // components to settle, and use the actual owner rather than a nearby player.
    world.afterEvents.dataDrivenEntityTrigger.subscribe(({ entity }) => {
        system.run(() => {
            if (!entity.isValid) return;
            const tameable = entity.getComponent("tameable");
            const mount = entity.getComponent("tamemount");
            const owner = tameable?.isTamed ? tameable.tamedToPlayer
                : mount?.isTamedToPlayer ? mount.tamedToPlayer : undefined;
            if (owner) queueTameReward(entity, owner);
        });
    }, { eventTypes: ["minecraft:on_tame"] });
});
