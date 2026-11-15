import { GameMode, ScriptEventSource, system, world } from "@minecraft/server";
import { PendingJobRewards, type PendingJobReward } from "@/domain/jobs/pending-job-rewards.js";
import jobs_config from "@/config/jobs.js";
import { applyDailyLimit } from "@/domain/jobs/job-events.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { formatJobRewardValues, getDailyEarning } from "@/domain/jobs/job-reward-display.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { storageReadReady } from "@/shared/storage/write-hook.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { getRandomInteger } from "@/shared/utils/minecraft.js";
import { showPlayerActionBar } from "@/shared/ui/player-feedback.js";

let pendingCrafts: PendingJobRewards;
let flushScheduled = false;
let playerDB: DynamicProperties;
let buff: RewardBuff;
const rejectedCrafts = { disabled: 0, invalidPlayer: 0, notCrafter: 0, nonSurvival: 0 };
const craftSources = { withoutBlock: 0, craftingTable: 0, stonecutter: 0, otherBlock: 0, unreadableBlock: 0 };
let lastCraftAt: number | undefined;
const craftDiagnostics = { received: 0, ineligible: 0, missingItem: 0, queued: 0, missingPlayer: 0, invalidMoney: 0, limited: 0, saved: 0, flushErrors: 0 };

function scheduleCraftRewards(delay = 0) {
    if (flushScheduled) return;
    flushScheduled = true;
    if (delay) system.runTimeout(flushCraftRewards, delay);
    else system.run(flushCraftRewards);
}

function flushCraftRewards() {
    try {
        pendingCrafts.sync();
        if (!storageReadReady("player")) return;
        const online = new Map(world.getPlayers().map(player => [player.id, player]));
        const entries = pendingCrafts.entries();
        const blocked = new Set(entries.filter(e => e.phase === "blocked" || e.phase === "executing").map(e => e.playerId));
        const groups = new Map<string, PendingJobReward[]>();
        for (const entry of entries) if (entry.phase === "pending" && !blocked.has(entry.playerId)) {
            const group = groups.get(entry.playerId) ?? [];
            group.push(entry); groups.set(entry.playerId, group);
        }
        for (const [playerId, group] of groups) {
            const settle = (outcome: "paid" | "skipped") => { for (const entry of group) pendingCrafts.settle(entry, outcome); };
            const block = (reason: string) => { for (const entry of group) pendingCrafts.block(entry, reason); blocked.add(playerId); };
            let committed = false;
            let begun = false;
            try {
                const player = online.get(playerId);
                // Resolve a new Player wrapper after reconnect; loading work stays queued.
                if (!player?.isValid || player.hasTag("status:loading") || player.hasTag("status:transferring")) continue;
                if (!jobs_config.validity || !player.hasTag("mcjobs_crafter") || player.getGameMode() !== GameMode.Survival) { settle("skipped"); continue; }
                const raw = playerDB.get(`player_${player.id}`);
                if (!raw) { craftDiagnostics.missingPlayer++; block("player_record_missing"); continue; }
                let playerData: any;
                try { playerData = JSON.parse(raw); }
                catch { block("player_record_invalid"); continue; }
                if (!playerData || !Number.isFinite(playerData.money)) { craftDiagnostics.invalidMoney++; block("player_money_invalid"); continue; }
                const amount = group.reduce((sum, entry) => sum + entry.amount, 0);
                if (!Number.isSafeInteger(amount) || amount <= 0) { block("invalid_work_amount"); continue; }
                const job = new JobLevel(player, "crafter");
                const multiplier = buff.getMultiplier("crafter");
                const reward = getRandomInteger(jobs_config.craftReward.min, jobs_config.craftReward.max)
                    * amount * job.getReward(job.getLevel()) * multiplier;
                const finalReward = applyDailyLimit(playerData, "crafter", reward, jobs_config.dailyLimit.crafter);
                if (finalReward <= 0) { craftDiagnostics.limited++; settle("skipped"); continue; }
                const xpReward = jobs_config.craftReward.xp * amount * multiplier;
                playerData.money += finalReward;
                pendingCrafts.beginMany(group);
                begun = true;
                const progress = job.addXp(xpReward, () => playerDB.set(`player_${player.id}`, playerData));
                committed = true;
                settle("paid");
                craftDiagnostics.saved++;
                if (jobs_config.showRewardMessage) {
                    const display = formatJobRewardValues(finalReward, getDailyEarning(playerData, "crafter"), jobs_config.dailyLimit.crafter, xpReward, progress);
                    showPlayerActionBar(player, `§6[Money]${display.money} §e[XP]${display.xp}`);
                }
            } catch (error) {
                if (!committed) {
                    if (begun) for (const entry of group) pendingCrafts.retry(entry, error);
                    craftDiagnostics.flushErrors++;
                    if (group.some(entry => entry.phase === "blocked")) blocked.add(playerId);
                }
                console.warn("[jobs] crafter " + (committed ? "display failed after payment" : group.some(entry => entry.phase === "blocked") ? "progress rollback failed; reward retained for review" : "payment failed; retaining work for retry"));
            }
        }
    } catch {
        craftDiagnostics.flushErrors++;
        console.warn("[jobs] crafter retry deferred; receipts retained");
    } finally {
        flushScheduled = false;
        if (pendingCrafts.needsWork()) scheduleCraftRewards(20);
    }
}

world.afterEvents.worldLoad.subscribe(() => {
    playerDB = new DynamicProperties("player");
    buff = new RewardBuff();
    pendingCrafts = new PendingJobRewards("crafter");
    pendingCrafts.load();
    if (pendingCrafts.needsWork()) scheduleCraftRewards(20);

    const event = world.afterEvents.playerCraftRecipe;
    if (!event) {
        console.warn("[jobs] Crafter requires the playerCraftRecipe after-event supported by newer servers.");
        return;
    }

    event.subscribe(event => {
        const { player, itemStack } = event;
        craftDiagnostics.received++;
        lastCraftAt = Date.now();
        // Optional Native block access must never interrupt an otherwise valid reward.
        try {
            const block = event.block;
            if (!block) craftSources.withoutBlock++;
            else if (block.typeId === "minecraft:crafting_table") craftSources.craftingTable++;
            else if (block.typeId === "minecraft:stonecutter_block" || block.typeId === "minecraft:stonecutter") craftSources.stonecutter++;
            else craftSources.otherBlock++;
        } catch { craftSources.unreadableBlock++; }
        let rejection: keyof typeof rejectedCrafts | undefined;
        if (!jobs_config.validity) rejection = "disabled";
        else if (!player.isValid) rejection = "invalidPlayer";
        else if (!player.hasTag("mcjobs_crafter")) rejection = "notCrafter";
        else if (player.getGameMode() !== GameMode.Survival) rejection = "nonSurvival";
        if (rejection) { craftDiagnostics.ineligible++; rejectedCrafts[rejection]++; return; }
        const amount = itemStack?.amount ?? 0;
        if (!Number.isSafeInteger(amount) || amount <= 0) { craftDiagnostics.missingItem++; return; }
        craftDiagnostics.queued++;

        try { pendingCrafts.enqueue(player.id, amount); }
        catch { craftDiagnostics.flushErrors++; }
        scheduleCraftRewards();
    });
});

// Aggregate diagnostics expose only counts, a timestamp and fixed block categories.
system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id !== "karo:craftdiag" || event.sourceType !== ScriptEventSource.Server || event.sourceEntity || event.sourceBlock || event.initiator) return;
    console.warn("[crafter-diagnostics] " + JSON.stringify({ eventAvailable: !!world.afterEvents.playerCraftRecipe, enabled: jobs_config.validity, ...craftDiagnostics, rejected: rejectedCrafts, sources: craftSources, lastCraftAt, ...(pendingCrafts?.stats() ?? {}) }));
});
