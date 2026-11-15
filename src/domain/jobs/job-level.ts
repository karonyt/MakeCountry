import jobs_config from "@/config/jobs.js";
import { getJobXpRequired } from "@/domain/jobs/job-progression.js";

/**
 * 報酬の倍率が伸びなくなるレベル。
 * ここから先はレベルだけ伸びる (記録と称号のため)。
 */
const REWARD_CAP_LEVEL = 300;

/**
 * 到達を知らせる差し込み口。
 *
 * core-jobs が入れる。ここから直接 import すると、Core を使わない
 * ワールドでも読み込まれてしまうので、後から差してもらう形にする。
 */
let milestoneHook: ((player: any, job: string, level: number) => void) | null = null;
export function setMilestoneHook(fn: (player: any, job: string, level: number) => void) {
    milestoneHook = fn;
}

export class JobLevel {
    key: any;
    maxLevel: any;
    player: any;
    /**
     * 
     * @param {Player} player 
     * @param {string} key 
     */
    constructor(player: any, key: any) {
        this.player = player;
        this.key = key;
        this.maxLevel = jobs_config.jobsLevelMax;
    }

    getLevel() {
        return Math.floor(Number(this.player.getDynamicProperty(`${this.key}_level`) ?? "1") * 100) / 100 || 1;
    }

    getXp() {
        return Math.floor(Number(this.player.getDynamicProperty(`${this.key}_xp`) ?? "0") * 100) / 100 || 0;
    }

    /** Keep later awards and explicit edits in the same tick in call order. */
    private saveProgress(updates: [string, string][], commitReward?: () => void) {
        const previous = updates.map(([key]) => [key, this.player.getDynamicProperty(key)] as const);
        let attempted = 0;
        try {
            for (const [key, value] of updates) {
                // Include the current key even if the Native setter throws after changing it.
                attempted++;
                this.player.setDynamicProperty(key, value);
            }
            commitReward?.();
        } catch (error) {
            const rollbackErrors: unknown[] = [];
            for (let index = attempted - 1; index >= 0; index--) {
                const [key, value] = previous[index];
                try { this.player.setDynamicProperty(key, value); }
                catch (rollbackError) { rollbackErrors.push(rollbackError); }
            }
            if (rollbackErrors.length) {
                const failure = new Error("job_progress_rollback_failed");
                Object.assign(failure, { cause: error, rollbackErrors });
                throw failure;
            }
            throw error;
        }
    }

    setLevel(level: any) {
        this.saveProgress([[`${this.key}_level`, `${level}`]]);
    }

    setXp(xp: any) {
        this.saveProgress([[`${this.key}_xp`, `${xp}`]]);
    }

    getXpRequired(level: any) {
        return getJobXpRequired(level);
    }

    /**
     * 報酬の倍率。
     *
     * **300 で頭打ちにしてある。**式が青天井なので、上限を外したまま
     * 伸ばすと Lv1000 で 9.9 倍になり経済が壊れる。
     * 300 から先で伸びるのは記録と称号だけ。
     */
    getReward(level: any) {
        const capped = Math.min(Number(level) || 1, REWARD_CAP_LEVEL);
        return 0.9 * (1 + (capped - 1) / 100);
    }

    /**
     * Save Native progress synchronously, then commit the caller's reward record.
     * A synchronous save failure restores the old raw progress before reporting it.
     * Callers must keep commitReward to one protected storage write, without UI effects.
     */
    addXp(amount: any, commitReward?: () => void) {
        let xp = this.getXp() + amount;
        let level = this.getLevel();
        const reachedLevels: number[] = [];

        // 上限で止めない。倍率は getReward が 300 で頭打ちにしている
        while (xp >= this.getXpRequired(level)) {
            xp -= this.getXpRequired(level);
            level++;
            reachedLevels.push(level);
        }
        this.saveProgress([
            [`${this.key}_xp`, `${xp}`],
            [`${this.key}_level`, `${level}`],
        ], commitReward);

        // Notifications cannot undo a successfully saved payment or leave XP unsaved.
        const notify = (stage: string, callback: () => void) => {
            if (this.player.isValid === false) return;
            try { callback(); }
            catch (error) {
                console.warn(`[jobs] Job level ${stage} notification failed (${error instanceof Error ? error.name : typeof error}).`);
            }
        };
        for (const reached of reachedLevels) {
            notify("title", () => this.player.onScreenDisplay.setTitle({ rawtext: [{ text: "§2" }, { translate: this.key }] }));
            notify("subtitle", () => this.player.onScreenDisplay.updateSubtitle(`§e${reached - 1}Lv --> ${reached}Lv`));
            notify("sound", () => this.player.playSound(`random.levelup`));
            if (milestoneHook) notify("milestone", () => milestoneHook?.(this.player, this.key, reached));
        }

        return {
            level,
            xp: Math.floor(xp * 100) / 100,
            xpRequired: this.getXpRequired(level)
        };
    }

    removeXp(amount: any) {
        let xp = this.getXp() - amount;
        if (xp < 0) xp = 0;
        this.setXp(xp);
    }

    reset() {
        this.saveProgress([
            [`${this.key}_xp`, "0"],
            [`${this.key}_level`, "1"],
        ]);
    }

    get() {
        return {
            level: this.getLevel(),
            xp: this.getXp(),
            xpRequired: this.getXpRequired(this.getLevel())
        };
    }
}
