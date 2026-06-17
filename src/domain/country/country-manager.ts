import { DynamicProperties, describeDynamicPropertyEntry } from "@/shared/storage/dynamic-properties.js";
import { CheckPermission, GetAndParsePropertyData, GetChunkPropertyId, GetPlayerChunkPropertyId, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { nameSet } from "@/domain/player/name-tag.js";
import { country } from "@/shared/events/make-country-events.js";
import { ItemStack, Player, system, world } from "@minecraft/server";
import config from "@/config/server.js";
import { acceptFriendlyRequestFunction, denyFriendlyRequestFunction, removeFriendlyFunction, sendFriendlyRequestFunction } from "@/domain/country/relationships/friendly.js";
import { acceptApplicationRequestFunction, denyApplicationRequestFunction, sendApplicationRequestFunction } from "@/domain/country/relationships/application.js";
import { acceptAllianceRequestFunction, denyAllianceRequestFunction, removeAllianceFunction, sendAllianceRequestFunction } from "@/domain/country/relationships/alliance.js";
import { acceptFederationRequestFunction, addFederationSubLeaderFunction, createFederationFunction, denyFederationRequestFunction, disbandFederationFunction, getFederationMemberIds, getFederationRequestCountryIds, leaveFederationFunction, normalizeFederationData, removeFederationFunction, removeFederationSubLeaderFunction, sendFederationRequestFunction, setFederationCapitalFunction, setFederationTaxRateFunction, transferFederationLeaderFunction, updateFederationBasicFunction, updateFederationSettingsFunction } from "@/domain/country/relationships/federation.js";
import { addHostilityFunction } from "@/domain/country/relationships/hostility.js";
import { denyMergeRequestFunction, sendMergeRequestFunction } from "@/domain/country/relationships/merge.js";
import { inviteFunction } from "@/domain/country/relationships/invite.js";
import { setNewOwnerFunction } from "@/domain/country/relationships/owner.js";
import { RoleManager } from "@/domain/country/role-manager.js";
import { DeleteCountry, MergeCountry } from "@/domain/country/land-service.js";
import national_tier_level from "@/config/national-tier-level.js";
import { updateRecipe } from "@/domain/recipes/recipe-service.js";
import jobs_config from "@/config/jobs.js";
/**
 * @typedef {import("@/types/legacy/player").PlayerData} PlayerData
 * @typedef {import("@/types/legacy/country").CountryData} CountryData 
 * @typedef {import("@/types/legacy/player").PlayerSetting} PlayerSetting
 * @typedef {import("@/types/legacy/role").RoleData} RoleData
 * @typedef {import("@/types/legacy/chunk").ChunkData} ChunkData
 */

function stringifyDebugValue(value: any) {
    if (value === undefined) return "undefined";
    if (value === null) return "null";
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return `${value}`;

    try {
        return JSON.stringify(value);
    } catch {
        return `${value}`;
    }
}

function warnCountryInfoData(message: any, context: any = {}) {
    const details = Object.entries(context)
        .map(([key, value]) => `${key}=${stringifyDebugValue(value)}`)
        .join(" | ");
    console.warn(`[MakeCountry CountryInfo] ${message}${details ? ` | ${details}` : ""}`);
}

function describeCountryProperty(countryId: any) {
    return describeDynamicPropertyEntry("country", `country_${countryId}`);
}

function describePlayerProperty(playerId: any) {
    return describeDynamicPropertyEntry("player", `player_${playerId}`);
}

function removeItemsFromContainer(container: any, typeId: any, amount: any) {
    if (amount <= 0) return 0;

    let remaining = amount;

    for (let i = 0; i < container.size; i++) {
        const slot = container.getItem(i);
        if (!slot || slot.typeId !== typeId) continue;

        if (slot.amount <= remaining) {
            remaining -= slot.amount;
            container.setItem(i);
        } else {
            slot.amount -= remaining;
            container.setItem(i, slot);
            return 0;
        };

        if (remaining <= 0) return 0;
    };

    return remaining;
}

class CountryMemberManager {
    countryData: any;
    countryDataBase: any;
    countryRawData: any;
    id: any;
    isVaildProperty: any;
    name: any;
    owner: any;
    playerDataBase: any;
    roleDataBase: any;
    roleManager: any;
    /**
     * 
     * @param {number|string} id 
     */
    constructor(id: any) {
        this.countryDataBase = new DynamicProperties('country');
        this.playerDataBase = new DynamicProperties('player');
        this.roleDataBase = new DynamicProperties('role');
        this.countryRawData = this.countryDataBase.get(`country_${id}`);
        /**
         * @type {CountryData|undefined}
         */
        this.countryData = this.countryRawData ? JSON.parse(this.countryRawData) : undefined;
        this.isVaildProperty = this.countryData ? true : false;
        this.owner = this.countryData.owner;
        this.id = id;
        this.name = this.countryData.name;
        this.roleManager = new RoleManager();
    }

    isVaild() {
        return this.isVaildProperty;
    }


    /**
     * 
     * @param {string} id 
     * @returns 
     */
    get(id: any) {
        const rawPlayerData = this.playerDataBase.get(`player_${id}`);
        if (!rawPlayerData) return undefined;
        /**
         * @type {PlayerData}
         */
        const playerData = JSON.parse(rawPlayerData);
        return playerData;
    }

    /**
     * 
     * @param {string|Player} player 
     */
    has(player: any) {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryMemberManager] The Country ${this.id} is not vaild.`)
            return false;
        };
        let playerId = '';
        if (player instanceof Player) {
            playerId = player.id;
        } else if (typeof player == 'string') {
            playerId = player;
        } else {
            return false;
        }

        return this.countryData.members.includes(playerId);
    }

    /**
     * 
     * @param {Player|string} targetMember 
     * @param {number} roleId 
     */
    setRole(targetMember: any, roleId: any) {
        return this.roleManager.addMember(roleId, targetMember);
    }

    /**
     * 
     * @param {Player|string} targetMember 
     * @param {number} roleId 
     */
    removeRole(targetMember: any, roleId: any) {
        return this.roleManager.removeMember(roleId, targetMember);
    }

    /**
     * 
     * @param {string|Player} targetMember
     * @param {Player|undefined} player 
     */
    kick(targetMember: any, player = undefined) {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryMemberManager] The Country ${this.id} is not vaild.`)
            return;
        };
        let playerId = '';
        if (targetMember instanceof Player) {
            playerId = targetMember.id;
        } else if (typeof targetMember == 'string') {
            playerId = targetMember;
        } else {
            return;
        }

        if (player) {
            // @ts-ignore TS(2339): Property 'id' does not exist on type 'never'.
            if (player.id === playerId) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
                player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.same` }] });
                return;
            }
        };

        if (playerId === this.owner) {
            if (player) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
                player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.owner` }] });
            };
            return;
        };

        /**
         * @type {PlayerData}
         */
        const targetMemberData = JSON.parse(this.playerDataBase.get(`player_${playerId}`));
        this.countryData.members = this.countryData.members.filter((m: any) => m != playerId);
        this.countryDataBase.set(`country_${this.id}`, this.countryData);

        try {
            const playerRoles = targetMemberData?.roles || [];
            for (const roleId of playerRoles) {
                const role = this.roleDataBase.get(`role_${roleId}`);
                if (role) {
                    /**
                     * @type {RoleData}
                     */
                    const roleData = JSON.parse(role);
                    roleData.members = roleData.members.filter((m: any) => m != targetMemberData.id);
                    this.roleDataBase.set(`role_${roleId}`, roleData);
                };
            };
            targetMemberData.roles = [];
            targetMemberData.country = undefined;
            this.playerDataBase.set(`player_${playerId}`, targetMemberData);
            this.countryDataBase.set(`country_${this.id}`, this.countryData);

            if (player) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
                player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `kicked.finish.message.sender`, with: [targetMemberData.name] }] });
            }
            const kickedMemberEntity = world.getEntity(playerId);
            if (kickedMemberEntity && kickedMemberEntity instanceof Player) {
                kickedMemberEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `kicked.country` }] });
                system.runTimeout(() => {
                    if (config.countryNameDisplayOnPlayerNameTag) {
                        nameSet(kickedMemberEntity);
                    };

                    // @ts-ignore TS(2345): Argument of type '0' is not assignable to paramete... Remove this comment to see the full error message
                    updateRecipe(kickedMemberEntity, 0);

                    const jobsList = jobs_config.jobsList.filter(job => job.lv > 0);
                    for (const job of jobsList) {
                        if (kickedMemberEntity.hasTag(`mcjobs_${job.id}`)) {
                            kickedMemberEntity.removeTag(`mcjobs_${job.id}`);
                        };
                    }
                }, 2);
            };
        } catch (error) {
            console.warn(error);
        };
    }

    /**
     * 引数に入れたプレイヤーを国民にする
     * @param {string|Player} newMember
     * @param {Player|undefined} player 
     */
    add(newMember: any, player = undefined) {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryMemberManager] The Country ${this.id} is not vaild.`)
            return;
        };
        let playerId = '';
        if (newMember instanceof Player) {
            playerId = newMember.id;
        } else if (typeof newMember == 'string') {
            playerId = newMember;
        } else {
            return;
        }

        /**
         * @type {PlayerData}
         */
        const newMemberData = JSON.parse(this.playerDataBase.get(`player_${playerId}`));
        if (newMemberData.country) {
            //既に所属しているプレイヤーは加入させない
            return;
        };

        const isCanceled = country.beforeEvents.addMember.emit({
            countryId: this.id,
            targetPlayerId: playerId,
            type: player ? 'player' : 'system',
            player: player,
            isForced: false,
            cancel: false
        });
        if (isCanceled) return;

        /**
         * @type {Player}
         */
        const newMemberEntity = world.getEntity(playerId);
        if (newMemberData.money < 0) {
            if (newMemberEntity) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
                newMemberEntity.sendMessage({ translate: 'error.cannnot.in.money.minus' });
            }
            return;
        };

        this.countryData.members.push(playerId);
        newMemberData.roles.push(this.countryData.peopleRole);
        newMemberData.country = this.countryData.id;
        newMemberData.invite = [];
        const roleRawData = this.roleDataBase.get(`role_${this.countryData.peopleRole}`);
        const memberRoleData = roleRawData ? JSON.parse(roleRawData) : {
            id: this.countryData.peopleRole,
            members: [],
            permissions: []
        };
        memberRoleData.members.push(`${playerId}`);
        this.roleDataBase.set(`role_${memberRoleData.id}`, memberRoleData);
        this.playerDataBase.set(`player_${playerId}`, newMemberData);
        this.countryDataBase.set(`country_${this.countryData.id}`, this.countryData);
        if (newMemberEntity) {
            // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
            newMemberEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `joined.country` }] });
            system.runTimeout(() => {
                if (config.countryNameDisplayOnPlayerNameTag) {
                    nameSet(newMemberEntity);
                };
            }, 2);
        }
        country.afterEvents.addMember.emit({
            countryId: this.id,
            targetPlayerId: playerId,
            type: player ? 'player' : 'system',
            player: player,
            isForced: false,
        });
    }

    /**
     * 引数に入れたプレイヤーを強制的に国民にする
     * @param {player|string} targetMember 
     * @param {player|undefined} player 
     */
    forceAdd(targetMember: any, player = undefined) {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryMemberManager] The Country ${this.id} is not vaild.`)
            return;
        };
        let playerId = '';
        if (targetMember instanceof Player) {
            playerId = targetMember.id;
        } else if (typeof targetMember == 'string') {
            playerId = targetMember;
        } else {
            return;
        }

        country.beforeEvents.addMember.emit({
            countryId: this.id,
            targetPlayerId: playerId,
            type: player ? 'player' : 'system',
            player: player,
            isForced: true,
            cancel: false
        });

        /**
         * @type {PlayerData}
         */
        const targetMemberData = JSON.parse(this.playerDataBase.get(`player_${playerId}`));
        if (targetMemberData.country) {
            const targetMemberCountryRawData = this.countryDataBase.get(`country_${targetMemberData.country}`);
            if (targetMemberCountryRawData) {
                /**
                 * @type {CountryData}
                 */
                const targetMemberCountryData = JSON.parse(targetMemberCountryRawData);
                targetMemberCountryData.members = this.countryData.members.filter((m: any) => m != playerId);
                this.countryDataBase.set(`country_${targetMemberCountryData.id}`, targetMemberCountryData);

                try {
                    const playerRoles = targetMemberData.roles ?? [];
                    for (const roleId of playerRoles) {
                        const role = JSON.parse(this.roleDataBase.get(`role_${roleId}`));
                        if (role) {
                            role.members = role.members.filter((m: any) => m != targetMemberData.id);
                            this.roleDataBase.set(`role_${roleId}`, role);
                        };
                    };
                    targetMemberData.roles = [];
                } catch (error) { }
            };
        };

        /**
         * @type {Player}
         */
        const targetMemberEntity = world.getEntity(playerId);
        if (targetMemberData.money < 0) {
            if (targetMemberEntity) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
                targetMemberEntity.sendMessage({ translate: 'error.cannnot.in.money.minus' });
            }
            return;
        };

        this.countryData.members.push(playerId);
        targetMemberData.roles.push(this.countryData.peopleRole);
        targetMemberData.country = this.countryData.id;
        targetMemberData.invite = [];

        /**
         * @type {RoleData}
         */
        const memberRoleData = JSON.parse(this.roleDataBase.get(`role_${this.countryData.peopleRole}`));
        memberRoleData.members.push(`${playerId}`);
        this.roleDataBase.set(`role_${memberRoleData.id}`, memberRoleData);
        this.playerDataBase.set(`player_${playerId}`, targetMemberData);
        this.countryDataBase.set(`country_${this.countryData.id}`, this.countryData);
        if (targetMemberEntity) {
            // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
            targetMemberEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `joined.country` }] });
            system.runTimeout(() => {
                if (config.countryNameDisplayOnPlayerNameTag) {
                    nameSet(targetMemberEntity);
                };
            }, 2);
        };

        country.afterEvents.addMember.emit({
            countryId: this.id,
            targetPlayerId: playerId,
            type: player ? 'player' : 'system',
            player: player,
            isForced: true,
        });
    }
};

export class CountryManager {
    countryData: any;
    countryDataBase: any;
    countryRawData: any;
    id: any;
    isVaildProperty: any;
    memberManager: any;
    name: any;
    playerDataBase: any;
    roleManager: any;
    /**
     * 
     * @param {number|string} id 
     */
    constructor(id: any) {
        this.countryDataBase = new DynamicProperties('country');
        this.playerDataBase = new DynamicProperties('player');
        this.countryRawData = this.countryDataBase.get(`country_${id}`);
        /**
         * @type {CountryData|undefined}
         */
        this.countryData = this.countryRawData ? JSON.parse(this.countryRawData) : undefined;
        this.isVaildProperty = this.countryData ? true : false;
        this.id = id;
        this.name = this.isVaildProperty ? this.countryData?.name : undefined;
        this.memberManager = this.isVaildProperty ? new CountryMemberManager(id) : undefined;
        this.roleManager = this.isVaildProperty ? new RoleManager() : undefined;
    }

    /**
     * 国が有効かどうか
     * @returns 
     */
    isVaild() {
        return this.isVaildProperty;
    }

    /**
     * 国名の変更
     * @param {string} newName 
     * @param {Player|undefined} player 
     */
    reName(newName: any, player = undefined) {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        const beforeName = this.countryData.name;

        const isCanceled = country.beforeEvents.rename.emit({
            countryId: this.id,
            oldName: beforeName,
            newName: newName,
            type: player ? 'player' : 'system',
            cancel: false
        });

        if (isCanceled) return;
        this.countryData.name = newName;
        this.countryDataBase.set(`country_${this.id}`, this.countryData);
        if (player) {
            // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
            player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.countryname` }, { text: `\n§r${beforeName} ->§r ${newName}` }] });
        };

        country.afterEvents.rename.emit({
            countryId: this.id,
            oldName: beforeName,
            newName: newName,
            type: player ? 'player' : 'system',
            cancel: false
        });
    }

    /**
     * 同盟国のIDを取得
     * @returns {Array<number>}
     */
    getAllianceCountryIds() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.alliance;
    }

    /**
     * 連邦国のIDを取得
     * @returns {Array<number>}
     */
    getFederationCountryIds() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return getFederationMemberIds(this.countryData).filter((id: any) => Number(id) !== Number(this.id));
    }

    /**
     * 敵対国のIDを取得
     * @returns {Array<number>}
     */
    getHostilityCountryIds() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.hostility;
    }

    /**
     * 友好国のIDを取得
     * @returns {Array<number>}
     */
    getFriendlyCountryIds() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.friendly;
    }

    /**
     * 受信した友好申請を取得
     * @returns {Array<number>}
     */
    getFriendlyRequestReceive() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.friendlyRequestReceive;
    }

    /**
     * 送信した友好申請を取得
     * @returns {Array<number>}
     */
    getFriendlyRequestSend() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.friendlyRequestSend;
    }

    /**
     * 受信した同盟申請を取得
     * @returns {Array<number>}
     */
    getAllianceRequestReceive() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.allianceRequestReceive;
    }

    /**
     * 送信した同盟申請を取得
     * @returns {Array<number>}
     */
    getAllianceRequestSend() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.allianceRequestSend;
    }

    /**
     * 受信した連邦申請を取得
     * @returns {Array<number>}
     */
    getFederationRequestReceive() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return getFederationRequestCountryIds(this.countryData);
    }

    /**
     * 送信した連邦申請を取得
     * @returns {Array<number>}
     */
    getFederationRequestSend() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return [];
    }

    /**
     * 受信した併合申請を取得
     * @returns {Array<number>}
     */
    getMergeRequestReceive() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.mergeRequestReceive;
    }

    /**
     * 送信した併合申請を取得
     * @returns {Array<number>}
     */
    getMergeRequestSend() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.mergeRequestSend;
    }

    /**
     * 受信した講和申請を取得
     * @returns {Array<number>}
     */
    getApplicationPeaceRequestReceive() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.applicationPeaceRequestReceive;
    }

    /**
     * 送信した講和申請を取得
     * @returns {Array<number>}
     */
    getApplicationPeaceRequestSend() {
        if (!this.isVaildProperty) {
            console.error(`[MakeCountry CountryManager] The Country ${this.id} is not vaild.`);
            return;
        };
        return this.countryData.applicationPeaceRequestSend;
    }

    /**
     * 同盟申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendAllianceRequest(countryId: any, player = undefined) {
        return sendAllianceRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 同盟申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptAllianceRequest(countryId: any, player = undefined) {
        return acceptAllianceRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 同盟申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyAllianceRequest(countryId: any, player = undefined) {
        return denyAllianceRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 同盟を解除
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    removeAlliance(countryId: any, player = undefined) {
        return removeAllianceFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦政府を作成
     * @param {string} federationName
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    createFederation(federationName: any, player = undefined) {
        return createFederationFunction(federationName, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦加盟申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendFederationRequest(countryId: any, player = undefined) {
        return sendFederationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptFederationRequest(countryId: any, player = undefined) {
        return acceptFederationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyFederationRequest(countryId: any, player = undefined) {
        return denyFederationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦を解除
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    removeFederation(countryId: any, player = undefined) {
        return removeFederationFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦から脱退
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    leaveFederation(player = undefined) {
        return leaveFederationFunction(this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦首都を設定
     * @param {number} countryId
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    setFederationCapital(countryId: any, player = undefined) {
        return setFederationCapitalFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦代表を譲渡
     * @param {string} playerId
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    transferFederationLeader(playerId: any, player = undefined) {
        return transferFederationLeaderFunction(playerId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦基本設定を更新
     * @param {string} name
     * @param {string} description
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    updateFederationBasic(name: any, description: any, player = undefined) {
        return updateFederationBasicFunction(name, description, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦表示設定を更新
     * @param {any} settings
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    updateFederationSettings(settings: any, player = undefined) {
        return updateFederationSettingsFunction(settings, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦税率を設定
     * @param {number|string} taxRate
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    setFederationTaxRate(taxRate: any, player = undefined) {
        return setFederationTaxRateFunction(taxRate, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦副代表を追加
     * @param {string} playerId
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    addFederationSubLeader(playerId: any, player = undefined) {
        return addFederationSubLeaderFunction(playerId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦副代表を削除
     * @param {string} playerId
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    removeFederationSubLeader(playerId: any, player = undefined) {
        return removeFederationSubLeaderFunction(playerId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 連邦を解散
     * @param {Player|undefined} player
     * @returns {boolean}
     */
    disbandFederation(player = undefined) {
        return disbandFederationFunction(this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 友好申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendFriendlyRequest(countryId: any, player = undefined) {
        return sendFriendlyRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 友好国申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptFriendlyRequest(countryId: any, player = undefined) {
        return acceptFriendlyRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 友好申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyFriendlyRequest(countryId: any, player = undefined) {
        return denyFriendlyRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 友好を解除
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    removeFriendly(countryId: any, player = undefined) {
        return removeFriendlyFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 講和申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendApplicationRequest(countryId: any, player = undefined) {
        return sendApplicationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 講和申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptApplicationRequest(countryId: any, player = undefined) {
        return acceptApplicationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 講和申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyApplicationRequest(countryId: any, player = undefined) {
        return denyApplicationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 併合申請の送信
     * @param {number|string} countryId 
     * @param {Player} player 
     */
    sendMergeRequest(countryId: any, player = undefined) {
        return sendMergeRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 併合申請の受諾
     * @param {number|string} countryId 
     * @param {Player} player 
     */
    acceptMergeRequest(countryId: any, player = undefined) {
        MergeCountry(countryId, this.id, player)
        //return acceptMergeRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 併合申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyMergeRequest(countryId: any, player = undefined) {
        return denyMergeRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 敵対する
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    AddHostility(countryId: any, player = undefined) {
        return addHostilityFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    }

    /**
     * 国力の取得
     * @returns {number}
     */
    getCountryPower() {
        let countryPower = 0;
        const federationMembers = getFederationMemberIds(this.countryData).filter((id: any) => Number(id) !== Number(this.id));
        countryPower = this.countryData.money + this.countryData.members.length * 20 + this.countryData.territories.length * 10 + this.countryData.resourcePoint + this.countryData.alliance.length * 5 + federationMembers.length * 8 + this.countryData.friendly.length * 3 - this.countryData.hostility.length * 15;
        return countryPower;
    }

    /**
     * データの更新
     */
    reload() {
        const raw = this.countryDataBase.get(`country_${this.id}`);
        this.countryData = raw ? JSON.parse(raw) : undefined;
        this.isVaildProperty = !!this.countryData;
        this.name = this.countryData?.name;
    }

    /**
     * プレイヤーを招待
     * @param {Player|string} receivePlayer 
     * @param {(Player|string)|undefined} sendPlayer 
     * @returns 
     */
    invite(receivePlayer: any, sendPlayer = undefined) {
        return inviteFunction(this.id, receivePlayer, sendPlayer);
    }

    /**
     * 
     * @param {Player|string} newOwner 
     * @param {(Player|string)|undefined} player 
     */
    setNewOwner(newOwner: any, player = undefined) {
        return setNewOwnerFunction(this.id, newOwner, player);
    }

    /**
     * 
     * @param {RoleData} roleData 
     * @returns {number}
     */
    createRole(roleData: any) {
        return this.roleManager.createRoleToCountry(roleData, this.id);
    }

    /**
     * 
     * @param {number} roleId 
     */
    deleteRole(roleId: any) {
        this.roleManager.deleteRole(roleId, this.id);
        return;
    }

    /**
     * 
     * @returns {import("@minecraft/server").RawText}
     */
    getCountryInfoRawText() {
        if (!this.isVaildProperty || !this.countryData || !this.memberManager) {
            warnCountryInfoData("Cannot build country info: missing country dynamic property", {
                countryId: this.id,
                property: describeCountryProperty(this.id),
            });
            return { rawtext: [{ text: "Country data is missing." }] };
        }

        const countryContext = {
            countryId: this.id,
            countryName: this.countryData?.name ?? "unknown",
            property: describeCountryProperty(this.id),
        };
        const getArrayField = (fieldName: any, value: any) => {
            if (Array.isArray(value)) return value;
            warnCountryInfoData("Country field is missing or not an array", {
                ...countryContext,
                field: fieldName,
                value,
            });
            return [];
        };
        const getRelatedCountryName = (relation: any, countryId: any) => {
            const relatedCountryManager = new CountryManager(countryId);
            if (!relatedCountryManager.isVaildProperty) {
                warnCountryInfoData("Referenced country dynamic property is missing", {
                    ...countryContext,
                    relation,
                    referencedCountryId: countryId,
                    referencedProperty: describeCountryProperty(countryId),
                });
                return undefined;
            }
            return relatedCountryManager.name;
        };

        const ownerId = this.countryData.owner;
        const ownerData = ownerId === undefined || ownerId === null
            ? undefined
            : this.memberManager.get(ownerId);
        if (ownerId === undefined || ownerId === null) {
            warnCountryInfoData("Country owner field is missing", countryContext);
        } else if (!ownerData) {
            warnCountryInfoData("Owner player dynamic property is missing", {
                ...countryContext,
                ownerId,
                ownerProperty: describePlayerProperty(ownerId),
            });
        }
        const ownerName = ownerData?.name || 'None';

        const countryMemberIds = getArrayField("members", this.countryData.members);
        const territoryIds = getArrayField("territories", this.countryData.territories);
        const membersId = countryMemberIds.filter((m: any) => m != ownerId);
        const memberManager = this.memberManager;
        let membersName = [];
        for (const member of membersId) {
            const memberData = memberManager.get(member);
            if (!memberData) {
                warnCountryInfoData("Member player dynamic property is missing", {
                    ...countryContext,
                    memberId: member,
                    memberProperty: describePlayerProperty(member),
                });
                continue;
            }
            membersName.push(memberData.name);
        };

        const allianceIds = getArrayField("alliance", this.getAllianceCountryIds());
        let allianceCountryName = [];
        for (const id of allianceIds) {
            const allianceCountryNameValue = getRelatedCountryName("alliance", id);
            if (!allianceCountryNameValue) continue;
            allianceCountryName.push(allianceCountryNameValue);
        };

        const federation = normalizeFederationData(this.countryData);
        const federationIds = getArrayField("federation", this.getFederationCountryIds());
        let federationCountryName = [];
        for (const id of federationIds) {
            const federationCountryNameValue = getRelatedCountryName("federation", id);
            if (!federationCountryNameValue) continue;
            federationCountryName.push(federationCountryNameValue);
        };
        const federationLeaderData = federation.leader === undefined || federation.leader === null
            ? undefined
            : this.memberManager.get(federation.leader);
        if ((federation.leader !== undefined && federation.leader !== null) && !federationLeaderData) {
            warnCountryInfoData("Federation leader player dynamic property is missing", {
                ...countryContext,
                leaderId: federation.leader,
                leaderProperty: describePlayerProperty(federation.leader),
            });
        }
        const federationLeaderName = federationLeaderData?.name ?? "None";
        const federationSubLeaderNames = getArrayField("federation.subLeaders", federation.subLeaders)
            .map((id: any) => {
                const subLeaderData = this.memberManager.get(id);
                if (!subLeaderData) {
                    warnCountryInfoData("Federation sub leader player dynamic property is missing", {
                        ...countryContext,
                        subLeaderId: id,
                        subLeaderProperty: describePlayerProperty(id),
                    });
                }
                return subLeaderData?.name ?? id;
            })
            .filter(Boolean);
        const federationCapitalManager = federation.capital ? new CountryManager(federation.capital) : undefined;
        if (federation.capital && !federationCapitalManager?.isVaildProperty) {
            warnCountryInfoData("Federation capital country dynamic property is missing", {
                ...countryContext,
                capitalCountryId: federation.capital,
                capitalProperty: describeCountryProperty(federation.capital),
            });
        }
        const federationCapitalName = federationCapitalManager?.isVaildProperty ? federationCapitalManager.name : "None";

        const hostilityIds = getArrayField("hostility", this.getHostilityCountryIds());
        let hostilityCountryName = [];
        for (const id of hostilityIds) {
            const hostilityCountryNameValue = getRelatedCountryName("hostility", id);
            if (!hostilityCountryNameValue) continue;
            hostilityCountryName.push(hostilityCountryNameValue);
        };

        const friendlyIds = getArrayField("friendly", this.getFriendlyCountryIds());
        let friendlyCountryName = [];
        for (const id of friendlyIds) {
            const friendlyCountryNameValue = getRelatedCountryName("friendly", id);
            if (!friendlyCountryNameValue) continue;
            friendlyCountryName.push(friendlyCountryNameValue);
        };

        const warNowIds = getArrayField("warNowCountries", this.countryData.warNowCountries);
        let warNowCountryName = [];
        for (const id of warNowIds) {
            const warNowCountryNameValue = getRelatedCountryName("warNowCountries", id);
            if (!warNowCountryNameValue) continue;
            warNowCountryName.push(warNowCountryNameValue);
        };

        return {
            rawtext: [
                { translate: `form.showcountry.option.name`, with: [this.countryData.name] }, { text: `\n§r` },
                { translate: `form.showcountry.option.lore`, with: [this.countryData.lore] }, { text: `\n§r` },
                { translate: `form.showcountry.option.id`, with: [`${this.countryData.id}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.lv`, with: [`${this.countryData?.lv ?? 0}`] }, { text: `\n§r` },
                { text: `${this.roleManager.getRole(this.countryData.ownerRole)?.name || 'None'}: ${ownerName}` }, { text: `\n§r` },
                { translate: `form.showcountry.option.memberscount`, with: [`${countryMemberIds.length}`] }, { text: `\n§r` },
                { text: `${this.roleManager.getRole(this.countryData.peopleRole)?.name || 'None'}: ${membersName.join(`§r , `)}` }, { text: `\n§r` },
                { translate: `form.showcountry.option.territories`, with: [`${territoryIds.length}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.money`, with: { rawtext: [{ translate: this.countryData.hideMoney ? 'show.private' : `${config.MoneyName} ${this.countryData.money}` }] } }, { text: `\n§r` },
                { translate: `form.showcountry.option.resourcepoint`, with: { rawtext: [{ translate: this.countryData.hideMoney ? 'show.private' : `${this.countryData.resourcePoint}` }] } }, { text: `\n§r` },
                { translate: `form.showcountry.option.peace`, with: [`${this.countryData.peace}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.invite`, with: [`${this.countryData.invite}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.taxper`, with: [`${this.countryData.taxPer}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.consumptiontax`, with: [`${this.countryData?.consumptionTax ?? 0}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.taxinstitutionisper`, with: [`${this.countryData.taxInstitutionIsPer}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation`, with: [`${federationCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation.name`, with: [`${federation.name || "None"}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation.leader`, with: [`${federationLeaderName}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation.subleaders`, with: [`${federationSubLeaderNames.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation.capital`, with: [`${federationCapitalName}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation.treasury`, with: [`${federation.treasury ?? 0}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.federation.taxrate`, with: [`${federation.taxRate ?? 0}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.alliance`, with: [`${allianceCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.hostility`, with: [`${hostilityCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.friendly`, with: [`${friendlyCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: 'form.showcountry.option.days', with: [`${this.countryData.days}`] }, { text: `\n§r` },
            ]
        }
    }

    /**
     * 
     * @param {Player} player 
     */
    nationTierLevelTryUp(player: any) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const need = national_tier_level.needs[(this.countryData.lv ?? 0) + 1];
        const needItems = need.item;
        const needPoint = need.point;
        const needItemId = needItems.map((a: any) => a.typeId);
        const container = player.getComponent('inventory').container;
        const itemMap = new Map();
        for (let i = 0; i < container.size; i++) {
            const slot = container.getItem(i);
            if (slot) {
                const index = needItemId.indexOf(slot.typeId);
                if (index != -1) {
                    itemMap.set(needItemId[index], (itemMap.get(needItemId[index]) ?? 0) + slot.amount);
                };
            };
        };
        const notEnough = [];
        for (const item of needItems) {
            const enough = item.amount - (itemMap.get(item.typeId) ?? 0);
            if (enough > 0) {
                notEnough.push({ typeId: item.typeId, need: item.amount, amount: (itemMap.get(item.typeId) ?? 0), notEnough: enough });
            };
        };
        if (needPoint > this.countryData.resourcePoint) {
            notEnough.push({ typeId: 'resourcepoint', need: needPoint, amount: this.countryData.resourcePoint, notEnough: needPoint - this.countryData.resourcePoint });
        } else if (notEnough.length == 0) {
            for (const item of needItems) {
                removeItemsFromContainer(container, item.typeId, item.amount);
            };
            this.countryData.resourcePoint = this.countryData.resourcePoint - needPoint;
            this.countryData.lv = (this.countryData.lv ?? 0) + 1;
            this.countryDataBase.set(`country_${this.countryData.id}`, this.countryData);
            player.onScreenDisplay.setTitle({ text: `§a§lLevel UP!!` });
            player.onScreenDisplay.updateSubtitle({ text: `§e${this.countryData.lv - 1} §f>> §e${this.countryData.lv}` });
            player.sendMessage({ translate: 'national.tier.level.up', with: [`${this.countryData.lv}`] });
            player.playSound('random.levelup', { location: player.location });
            for (const memberId of this.countryData.members) {
                const player = world.getEntity(memberId);
                if (player && (player instanceof Player)) {
                    updateRecipe(player, this.countryData.lv);

                    const jobsList = jobs_config.jobsList.filter(job => job.lv > this.countryData.lv);
                    for (const job of jobsList) {
                        if (player.hasTag(`mcjobs_${job.id}`)) {
                            player.removeTag(`mcjobs_${job.id}`);
                        };
                    }
                };
            };
            return;
        };

        if (notEnough.length != 0) {
            const result = [];
            result.push({ translate: 'next.level.need.notenough', with: [`${(this.countryData.lv ?? 0) + 1}`] }, { text: '\n\n' })
            for (const item of notEnough) {
                if (item.typeId == 'resourcepoint') {
                    result.push({ text: '§c･' }, { translate: 'resourcepoint' }, { text: ` (${item.amount}/${item.need})\n` })
                } else {
                    result.push({ text: '§c･' }, { translate: new ItemStack(item.typeId).localizationKey }, { text: ` (${item.amount}/${item.need})\n` })
                };
            }
            player.sendMessage({ rawtext: result });
            player.playSound('note.guitar', { location: player.location });
            return;
        };
    }

    /**
     * 国家レベルを設定(管理者向け)
     * @param {number} lv 
     */
    nationTierLevelSet(lv: any) {
        this.countryData.lv = lv;
        this.countryDataBase.set(`country_${this.countryData.id}`, this.countryData);
        for (const memberId of this.memberManager.members) {
            const player = world.getEntity(memberId);
            if (player && (player instanceof Player)) {
                updateRecipe(player, lv);

                const jobsList = jobs_config.jobsList.filter(job => job.lv > lv);
                for (const job of jobsList) {
                    if (player.hasTag(`mcjobs_${job.id}`)) {
                        player.removeTag(`mcjobs_${job.id}`);
                    };
                }
            };
        };
    }

    /**
     * 国家レベルを増やす
     * @param {number} add
     * @param {Player|undefined} player 
     */
    nationTierLevelUp(add = 1, player = undefined) {
        this.countryData.lv = (this.countryData.lv ?? 0) + add;
        this.countryDataBase.set(`country_${this.countryData.id}`, this.countryData);
        for (const memberId of this.memberManager.members) {
            const player = world.getEntity(memberId);
            if (player && (player instanceof Player)) {
                updateRecipe(player, this.countryData.lv);

                const jobsList = jobs_config.jobsList.filter(job => job.lv > this.countryData.lv);
                for (const job of jobsList) {
                    if (player.hasTag(`mcjobs_${job.id}`)) {
                        player.removeTag(`mcjobs_${job.id}`);
                    };
                }
            };
        };
        if (player) {
            // @ts-ignore TS(2339): Property 'onScreenDisplay' does not exist on type ... Remove this comment to see the full error message
            player.onScreenDisplay.setTitle({ text: `§a§lLevel UP!!` });
            // @ts-ignore TS(2339): Property 'onScreenDisplay' does not exist on type ... Remove this comment to see the full error message
            player.onScreenDisplay.updateSubtitle({ text: `§e${this.countryData.lv - add} §f>> §e${this.countryData.lv}` });
            // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
            player.sendMessage({ translate: 'national.tier.level.up', with: [`${this.countryData.lv}`] });
            // @ts-ignore TS(2339): Property 'playSound' does not exist on type 'never... Remove this comment to see the full error message
            player.playSound('random.levelup', { location: player.location });
        };
    }

    /**
     * 何が必要かのRawMessageを返す
     * @param {number} lv 
     * @returns {import("@minecraft/server").RawMessage}
     */
    nationTierLevelNeed(lv = (this.countryData.lv ?? 0) + 1) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const need = national_tier_level.needs[lv];
        if (!need) return 'max';
        const needItems = need.item;
        const needPoint = need.point;
        const result = [];
        result.push({ translate: 'next.level.need.title', with: [`${lv}`] }, { text: '\n\n' })
        for (const item of needItems) {
            result.push({ text: '･' }, { translate: new ItemStack(item.typeId).localizationKey }, { text: ` x ${item.amount}\n` })
        }
        result.push({ text: '\n･' }, { translate: 'resourcepoint' }, { text: ` x ${needPoint}` });
        return result
    }

    /**
     * 国家レベルを上げられるか確認
     * @param {Player} player 
     * @param {number} lv 
     */
    nationTierLevelCheck(player: any, lv = (this.countryData.lv ?? 0)) {
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const need = national_tier_level.needs[(this.countryData.lv ?? 0) + 1];
        const needItems = need.item;
        const needPoint = need.point;
        const needItemId = needItems.map((a: any) => a.typeId);
        const container = player.getComponent('inventory').container;
        const itemMap = new Map();
        for (let i = 0; i < container.size; i++) {
            const slot = container.getItem(i);
            if (slot) {
                const index = needItemId.indexOf(slot.typeId);
                if (index != -1) {
                    itemMap.set(needItemId[index], (itemMap.get(needItemId[index]) ?? 0) + slot.amount);
                };
            };
        };
        const notEnough = [];
        for (const item of needItems) {
            const enough = item.amount - (itemMap.get(item.typeId) ?? 0);
            if (enough > 0) {
                notEnough.push({ typeId: item.typeId, need: item.amount, amount: (itemMap.get(item.typeId) ?? 0), notEnough: enough });
            };
        };
        if (needPoint > this.countryData.resourcePoint) {
            notEnough.push({ typeId: 'resourcepoint', need: needPoint, amount: this.countryData.resourcePoint, notEnough: needPoint - this.countryData.resourcePoint });
        } else if (notEnough.length == 0) {
            player.sendMessage({ translate: 'next.level.need.can' });
            return;
        };

        if (notEnough.length != 0) {
            const result = [];
            result.push({ translate: 'next.level.need.notenough', with: [`${lv}`] }, { text: '\n\n' })
            for (const item of notEnough) {
                if (item.typeId == 'resourcepoint') {
                    result.push({ text: '§c･' }, { translate: 'resourcepoint' }, { text: ` (${item.amount}/${item.need})\n` })
                } else {
                    result.push({ text: '§c･' }, { translate: new ItemStack(item.typeId).localizationKey }, { text: ` (${item.amount}/${item.need})\n` })
                };
            }
            player.sendMessage({ rawtext: result });
            player.playSound('note.guitar', { location: player.location });
            return;
        };
    }

    /**
     * 国を削除
     */
    delete() {
        DeleteCountry(this.id);
    }
}
