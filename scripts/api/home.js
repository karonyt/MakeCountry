import { Player, world } from "@minecraft/server";
import { CheckPermission, CheckPermissionFromLocation, GetAndParsePropertyData, GetPlayerChunkPropertyId } from "../lib/util";
import config from "../config";

export class HomeManager {
    /**
     * @param {Player} player
     */
    constructor(player) {
        this.player = player;
        this.homes = this.loadHomes();
        this.maxHomes = config.maxHomeCount; // 最大ホーム数を制限
    }

    loadHomes() {
        const homesData = this.player.getDynamicProperty("homes");
        return homesData ? JSON.parse(homesData) : {};
    }

    saveHomes() {
        this.player.setDynamicProperty("homes", JSON.stringify(this.homes));
    }

    /**
     * 
     * @param {string} name
     */
    setHome(name = "default") {
        if (this.player.hasTag("mc_notp")) return;
        const location = this.player.location;
        if (CheckPermissionFromLocation(this.player, location.x, location.z, this.player.dimension.id, "setHome")) return;

        if (!/^[\w\dぁ-んァ-ヶ一-龠]+$/.test(name) || name.length > 12) {
            this.player.sendMessage({ translate: "command.sethome.error.invalidname" });
            return;
        }

        if (Object.keys(this.homes).length >= this.maxHomes) {
            if (!this.homes[name]) {
                this.player.sendMessage({ translate: "command.sethome.error.limit", with: [`${config.maxHomeCount}`] });
                return;
            }
        }

        const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(this.player));
        if (chunkData?.special) {
            this.player.sendMessage({ translate: "command.sethome.error.special", with: [{ translate: "special.name" }] });
            return;
        }

        this.homes[name] = {
            x: Math.floor(this.player.location.x),
            y: Math.floor(this.player.location.y),
            z: Math.floor(this.player.location.z),
            dimension: this.player.dimension.id
        };
        this.saveHomes();

        this.player.sendMessage({
            translate: "command.sethome.result", with: [
                `${this.homes[name].x} ${this.homes[name].y} ${this.homes[name].z}(${this.homes[name].dimension.replace("minecraft:", "")})`,
                '/'
            ]
        });
    }

    /**
     * 
     * @param {string} name
     */
    teleportHome(name = "default") {
        if (config.combatTagNoTeleportValidity && this.player.hasTag("mc_combat")) {
            this.player.sendMessage({ translate: "teleport.error.combattag" });
            return;
        }
        if (config.invaderNoTeleportValidity && this.player.getTags().find(tag => tag.startsWith("war"))) {
            this.player.sendMessage({ translate: "teleport.error.invader" });
            return;
        }
        if (this.player.hasTag("mc_notp")) return;

        if (!this.homes[name]) {
            this.player.sendMessage({ translate: "command.error.nosethome" });
            return;
        }

        const { x, y, z, dimension } = this.homes[name];
        if (CheckPermissionFromLocation(this.player, x, z, dimension, "setHome")) {
            this.player.sendMessage({ translate: "command.home.error.thischunk" });
            return;
        }

        this.player.teleport({ x, y, z }, { dimension: world.getDimension(dimension.replace("minecraft:", "")) });
    }

    listHomes() {
        if (Object.keys(this.homes).length === 0) {
            this.player.sendMessage({ translate: "command.error.nosethome" });
            return;
        }

        const homeKeyList = Object.keys(this.homes);
        const lists = [`§a[HomeList]`];
        for (const key of homeKeyList) {
            const home = this.homes[key];
            lists.push(`§6- §a${key} §r§b[${Math.floor(home.x)}, ${Math.floor(home.y)}, ${Math.floor(home.z)}]§e(${home.dimension.replace('minecraft:', '')})§r`);
        };
        this.player.sendMessage(`${lists.join('\n')}`);
    }

    /**
     * @param {string} name
     */
    deleteHome(name = "default") {
        if (!this.homes[name]) {
            this.player.sendMessage({ translate: "command.error.nosethome" });
            return;
        }

        delete this.homes[name];
        this.saveHomes();
        this.player.sendMessage({ translate: "command.deletehome.result", with: [name] });
    }
}