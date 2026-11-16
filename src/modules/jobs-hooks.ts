// 職業パックが Lite からの呼び出しに応える処理。
import { provideHook, provideValue } from "@/shared/hooks.js";
import { GrowthPlantReward } from "@/domain/jobs/job-events.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";

provideHook("jobs.growthPlant", (player, block) => {
    if (player && block) GrowthPlantReward(player, block);
});
provideValue("jobs.buffs", () => new RewardBuff().getAllBuffs());
