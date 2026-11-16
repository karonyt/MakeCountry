/**
 * 機能パック用の JobLevel (職業パック以外)。
 * 職業レベルは職業パックが持っているので、スコアボードに書き出された値を読むだけにする。
 * 経験値の加算などは職業パックが行う (ここからは変更しない)。
 */
import { readMirroredJobLevel } from "@/shared/scoreboard-mirror.js";

export function setMilestoneHook(_fn: (player: any, job: string, level: number) => void) {}

export class JobLevel {
    player: any;
    key: any;
    constructor(player: any, key: any) {
        this.player = player;
        this.key = key;
    }
    /** 職業パックが入っていない・まだ書き出されていないときは 1。 */
    getLevel(): number {
        return readMirroredJobLevel(this.player, this.key) ?? 1;
    }
}
