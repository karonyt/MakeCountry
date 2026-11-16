// 職業報酬の「1 日の上限」の計算 (Lite と職業パックの両方で使う。イベント登録は持たない)。
import config from "@/config/server.js";
import { ensureDailyEarning } from "@/domain/jobs/job-reward-display.js";

export function getTodayByUTCOffset(offsetHours: any) {
    const now = Date.now();
    const offsetMs = offsetHours * 60 * 60 * 1000;
    return new Date(now + offsetMs).toISOString().slice(0, 10);
}

export function applyDailyLimit(playerData: any, jobName: any, reward: any, dailyLimit: any) {
    reward = Math.floor(reward * 100) / 100

    const today = getTodayByUTCOffset(config.timeDifference);

    const data = ensureDailyEarning(playerData, jobName, today);

    const remaining = dailyLimit - data.amount;
    if (remaining <= 0) return 0;

    const finalReward = Math.min(reward, remaining);
    data.amount = Math.floor((data.amount + finalReward) * 100) / 100;

    // Stage the limit together with money; the payout commits this record once.
    playerData.dailyEarnings[jobName] = data;

    return finalReward;
}
