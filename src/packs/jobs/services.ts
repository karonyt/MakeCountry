/**
 * 職業パックが他のパックからの依頼に応える処理と、スコアボードへの書き出し (分割版のみ)。
 *
 * - jobs.artisanReward: 料理・生産パックから届いた制作報酬を受け付ける (同じ ID は一度だけ)
 * - 職業レベル (`mcjob_<職業>`) と報酬ブーストの倍率 (`mcjob_buff`) をスコアボードに書き出す
 */
import { Player, system, world } from "@minecraft/server";
import jobs_config from "@/config/jobs.js";
import { onRpc } from "@/shared/bridge/bridge.js";
import { acceptRemoteArtisanReward } from "@/domain/jobs/pending-artisan-rewards.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { writeMirroredBuff, writeMirroredJobLevel } from "@/shared/scoreboard-mirror.js";

onRpc("jobs.artisanReward", (args: any) => acceptRemoteArtisanReward(args?.id, args?.playerId, args?.plan));

const jobIds: string[] = jobs_config.jobsList.map((job: { id: string }) => job.id);

function mirrorLevels(player: Player) {
    for (const job of jobIds) {
        try { writeMirroredJobLevel(player, job, new JobLevel(player, job).getLevel()); } catch { /* 次の回に書く */ }
    }
}
function mirrorBuffs() {
    const buff = new RewardBuff();
    for (const job of jobIds) writeMirroredBuff(job, buff.getMultiplier(job));
}

world.afterEvents.playerSpawn.subscribe(({ player }) => system.runTimeout(() => { if (player.isValid) mirrorLevels(player); }, 20));
world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        for (const player of world.getPlayers()) mirrorLevels(player);
        mirrorBuffs();
    }, 40);
});
