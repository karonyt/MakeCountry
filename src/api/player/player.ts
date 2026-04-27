import { DynamicProperties } from "../dyp.js";
import { Player } from "@minecraft/server";

/**
 * @typedef {import("../../jsdoc/player").PlayerData} PlayerData
 * @typedef {import("../../jsdoc/country").CountryData} CountryData 
 * @typedef {import("../../jsdoc/player").PlayerSetting} PlayerSetting
 * @typedef {import("../../jsdoc/role").RoleData} RoleData
 * @typedef {import("../../jsdoc/chunk").ChunkData} ChunkData
 */

export class PlayerManager {
    country: any;
    countryDB: any;
    data: any;
    exists: any;
    id: any;
    playerDB: any;
    constructor(id: any) {
        this.id = id instanceof Player ? id.id : id;

        this.playerDB = new DynamicProperties('player');
        this.countryDB = new DynamicProperties('country');

        this._load();
    }

    _load() {
        const raw = this.playerDB.get(`player_${this.id}`);
        if (!raw) {
            this.data = this._createDefaultData();
            this.exists = false;
            return;
        }

        try {
            this.data = JSON.parse(raw);
            this.exists = true;
        } catch {
            /**
             * @type {PlayerData}
             */
            this.data = this._createDefaultData();
            this.exists = false;
        }

        if (this.data.country) {
            const cRaw = this.countryDB.get(`country_${this.data.country}`);
            /**
             * @type {CountryData|null}
             */
            this.country = cRaw ? JSON.parse(cRaw) : null;
        } else {
            this.country = null;
        }
    }

    _createDefaultData() {
        return {
            id: this.id,
            country: null,
            roles: [],
            bountyLastSetAt: undefined,
            bountyDailySetDate: undefined,
            bountyDailySetCount: 0,
            settings: {
            },
            money: 0,
            marriage: {
                spouseId: undefined,
                since: undefined,
                requests: [],
            },
            groupChat: {
                currentOwnerId: undefined,
                ownedGroup: undefined,
            }
        };
    }

    isValid() {
        return this.exists;
    }

    update(patch: any) {
        Object.assign(this.data, patch);
    }

    save() {
        this.playerDB.set(`player_${this.id}`, JSON.stringify(this.data));
    }

    refresh() {
        this._load();
    }
}
