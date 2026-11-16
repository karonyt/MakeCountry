/**
 * 機能パック用の RewardBuff (職業パック以外)。
 * 報酬ブーストは職業パックが持っているので、スコアボードに書き出された倍率を読むだけにする。
 */
import { readMirroredBuff } from "@/shared/scoreboard-mirror.js";

export class RewardBuff {
    getMultiplier(job: any): number {
        return readMirroredBuff(String(job));
    }
    getAllBuffs(): Record<string, { multiplier: number; remainingTime: number }[]> {
        return {};
    }
    getBuffList(_job: any): { multiplier: number; remainingTime: number }[] {
        return [];
    }
}
