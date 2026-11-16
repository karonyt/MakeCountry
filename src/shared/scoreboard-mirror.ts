/**
 * パックをまたいでその場で読む必要がある値を、スコアボードに書き出す・読む。
 * スコアボードはアドオンの UUID に関係なくワールドで共有される。
 *
 * - 職業レベル: `mcjob_<職業ID>` (プレイヤーごと、レベルの 100 倍の整数)
 * - 報酬ブーストの倍率: `mcjob_buff` (参加者名が職業ID、倍率の 100 倍の整数)
 */
import { world, type Entity, type ScoreboardObjective } from "@minecraft/server";

export const JOB_LEVEL_OBJECTIVE_PREFIX = "mcjob_";
export const JOB_BUFF_OBJECTIVE = "mcjob_buff";

function objective(id: string, create: boolean): ScoreboardObjective | undefined {
    try {
        return world.scoreboard.getObjective(id) ?? (create ? world.scoreboard.addObjective(id) : undefined);
    } catch {
        return undefined;
    }
}

/** 職業レベルを読む。書き出されていなければ undefined。 */
export function readMirroredJobLevel(player: Entity, job: string): number | undefined {
    try {
        const score = objective(`${JOB_LEVEL_OBJECTIVE_PREFIX}${job}`, false)?.getScore(player);
        return score === undefined ? undefined : score / 100;
    } catch {
        return undefined;
    }
}

/** 職業レベルを書き出す。 */
export function writeMirroredJobLevel(player: Entity, job: string, level: number): void {
    try {
        const value = Math.max(0, Math.min(2_000_000_000, Math.round(level * 100)));
        const board = objective(`${JOB_LEVEL_OBJECTIVE_PREFIX}${job}`, true);
        if (board && board.getScore(player) !== value) board.setScore(player, value);
    } catch { /* スコアボードが使えないときは書き出さない */ }
}

/** 報酬ブーストの倍率を読む。書き出されていなければ 1。 */
export function readMirroredBuff(job: string): number {
    try {
        const score = objective(JOB_BUFF_OBJECTIVE, false)?.getScore(job);
        return score === undefined ? 1 : score / 100;
    } catch {
        return 1;
    }
}

/** 報酬ブーストの倍率を書き出す。 */
export function writeMirroredBuff(job: string, multiplier: number): void {
    try {
        const value = Math.max(0, Math.round(multiplier * 100));
        const board = objective(JOB_BUFF_OBJECTIVE, true);
        if (board && board.getScore(job) !== value) board.setScore(job, value);
    } catch { /* スコアボードが使えないときは書き出さない */ }
}
