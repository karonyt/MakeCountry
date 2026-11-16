/**
 * 分割版の職業パックで、職業報酬のお金を Lite に払ってもらう。
 *
 * お金と「1 日の上限」は Lite のプレイヤーデータにあるので、職業パックは Lite に `jobs.pay` を依頼する。
 * 依頼には受け取り票の ID を付ける。Lite は同じ ID を一度しか払わず、送り直しには前回の結果を返す。
 * 支払いが確認できてから、職業パック側で経験値を足して票を閉じる。
 */
import type { Player } from "@minecraft/server";
import jobs_config from "@/config/jobs.js";
import { rpc } from "@/shared/bridge/bridge.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { formatJobRewardValues } from "@/domain/jobs/job-reward-display.js";
import { showPlayerActionBar } from "@/shared/ui/player-feedback.js";
import type { PendingJobRewards, PendingJobReward } from "@/domain/jobs/pending-job-rewards.js";

export type RemotePayResult = { paid: number; dailyEarning: number; playerData: { dailyEarnings: any } };

/** Lite にお金の支払いを依頼する。 */
export function remoteJobPay(id: string, playerId: string, job: string, money: number): Promise<RemotePayResult> {
    const dailyLimit = (jobs_config.dailyLimit as Record<string, number>)[job];
    return rpc<RemotePayResult>("lite", "jobs.pay", { id, playerId, job, money, dailyLimit: Number.isFinite(dailyLimit) ? dailyLimit : Number.MAX_SAFE_INTEGER }, 200);
}

/**
 * PendingJobRewards (クラフター・テイマー) の票を 1 枚、Lite 経由で支払う。
 * 支払いが済むまで票は「支払い中」のまま。失敗したら「保留」に戻し、次の回に送り直す。
 */
export function payPendingRewardRemotely(store: PendingJobRewards, entry: PendingJobReward, player: Player, job: string, plan: { money: number; xp: number }) {
    store.begin(entry);
    remoteJobPay(entry.id, player.id, job, plan.money)
        .then(result => {
            if (result.paid <= 0) { store.settle(entry, "skipped"); return; }
            if (!player.isValid) throw new Error("player_left_before_xp");
            const progress = new JobLevel(player, job).addXp(plan.xp);
            store.settle(entry, "paid");
            if (jobs_config.showRewardMessage) {
                const display = formatJobRewardValues(result.paid, result.dailyEarning, (jobs_config.dailyLimit as Record<string, number>)[job], plan.xp, progress);
                showPlayerActionBar(player, `§6[Money]${display.money} §e[XP]${display.xp}`);
            }
        })
        .catch(error => store.retry(entry, error));
}
