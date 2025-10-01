import { Player, system } from "@minecraft/server";
import jobs_config from "../jobs_config";

export class JobLevel {
    /**
     * 
     * @param {Player} player 
     * @param {string} key 
     */
    constructor(player, key) {
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

    setLevel(level) {
        system.runTimeout(() => {
            this.player.setDynamicProperty(`${this.key}_level`, `${level}`);
        })
    }

    setXp(xp) {
        system.runTimeout(() => {
            this.player.setDynamicProperty(`${this.key}_xp`, `${xp}`);
        });
    }

    getXpRequired(level) {
        return (4 * level ^ 2) + (10 * level); // 計算結果を返す
    }

    getReward(level) {
        return 0.9 * (1 + (level - 1) / 100);
    }

    addXp(amount) {
        let xp = this.getXp() + amount;
        let level = this.getLevel();

        while (level < this.maxLevel && xp >= this.getXpRequired(level)) {
            xp -= this.getXpRequired(level);
            level++;
            this.player.onScreenDisplay.setTitle({ rawtext: [{ text: "§2" }, { translate: this.key }] });
            this.player.onScreenDisplay.updateSubtitle(`§e${level - 1}Lv --> ${level}Lv`);
            this.player.playSound(`random.levelup`);

            /* if (level >= 300 && this.key === "woodcutter") {
                if (!this.player.hasTag("mcPenNameAfter木こりスト")) {
                    this.player.addTag("mcPenNameAfter木こりスト");
                }
                if (!this.player.hasTag("mcPenNameBeforeもはや木そのものな")) {
                    this.player.addTag("mcPenNameBeforeもはや木そのものな");
                }
                break;
            }*/
        }
        this.setXp(xp);
        this.setLevel(level);
    }

    removeXp(amount) {
        let xp = this.getXp() - amount;
        if (xp < 0) xp = 0;
        this.setXp(xp);
    }

    reset() {
        this.setLevel(1);
        this.setXp(0);
    }

    get() {
        return {
            level: this.getLevel(),
            xp: this.getXp(),
            xpRequired: this.getXpRequired(this.getLevel())
        };
    }
}
