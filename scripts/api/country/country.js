import { DynamicProperties } from "../../api/dyp";
import { CheckPermission, GetAndParsePropertyData, GetChunkPropertyId, GetPlayerChunkPropertyId, StringifyAndSavePropertyData } from "../../lib/util";
import { nameSet } from "../../lib/nameset";
import { country } from "../api";
import { ItemStack, Player, system, world } from "@minecraft/server";
import config from "../../config";
import { acceptFriendlyRequestFunction, denyFriendlyRequestFunction, removeFriendlyFunction, sendFriendlyRequestFunction } from "./lib/friendly";
import { acceptApplicationRequestFunction, denyApplicationRequestFunction, sendApplicationRequestFunction } from "./lib/application";
import { acceptAllianceRequestFunction, denyAllianceRequestFunction, removeAllianceFunction, sendAllianceRequestFunction } from "./lib/alliance";
import { addHostilityFunction } from "./lib/hostility";
import { denyMergeRequestFunction, sendMergeRequestFunction } from "./lib/merge";
import { inviteFunction } from "./lib/invite";
import { setNewOwnerFunction } from "./lib/owner";
import { RoleManager } from "./role";
import { DeleteCountry, MergeCountry } from "../../lib/land";
import national_tier_level from "../../national_tier_level";
import { updateRecipe } from "../../lib/recipe";
import jobs_config from "../../jobs_config";
/**
 * @typedef {import("../../jsdoc/player").PlayerData} PlayerData
 * @typedef {import("../../jsdoc/country").CountryData} CountryData 
 * @typedef {import("../../jsdoc/player").PlayerSetting} PlayerSetting
 * @typedef {import("../../jsdoc/role").RoleData} RoleData
 * @typedef {import("../../jsdoc/chunk").ChunkData} ChunkData
 */

class CountryMemberManager {
    /**
     * 
     * @param {number|string} id 
     */
    constructor(id) {
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
    };

    isVaild() {
        return this.isVaildProperty;
    };


    /**
     * 
     * @param {string} id 
     * @returns 
     */
    get(id) {
        const rawPlayerData = this.playerDataBase.get(`player_${id}`);
        if (!rawPlayerData) return undefined;
        /**
         * @type {PlayerData}
         */
        const playerData = JSON.parse(rawPlayerData);
        return playerData;
    };

    /**
     * 
     * @param {string|Player} player 
     */
    has(player) {
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
    };

    /**
     * 
     * @param {Player|string} targetMember 
     * @param {number} roleId 
     */
    setRole(targetMember, roleId) {
        return this.roleManager.addMember(roleId, targetMember);
    };

    /**
     * 
     * @param {Player|string} targetMember 
     * @param {number} roleId 
     */
    removeRole(targetMember, roleId) {
        return this.roleManager.removeMember(roleId, targetMember);
    };

    /**
     * 
     * @param {string|Player} targetMember
     * @param {Player|undefined} player 
     */
    kick(targetMember, player = undefined) {
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
            if (player.id === playerId) {
                player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.same` }] });
                return;
            }
        };

        if (playerId === this.owner) {
            if (player) {
                player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.owner` }] });
            };
            return;
        };

        /**
         * @type {PlayerData}
         */
        const targetMemberData = JSON.parse(this.playerDataBase.get(`player_${playerId}`));
        this.countryData.members = this.countryData.members.filter(m => m != playerId);
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
                    roleData.members = roleData.members.filter(m => m != targetMemberData.id);
                    this.roleDataBase.set(`role_${roleId}`, roleData);
                };
            };
            targetMemberData.roles = [];
            targetMemberData.country = undefined;
            this.playerDataBase.set(`player_${playerId}`, targetMemberData);
            this.countryDataBase.set(`country_${this.id}`, this.countryData);

            if (player) {
                player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `kicked.finish.message.sender`, with: [targetMemberData.name] }] });
            }
            const kickedMemberEntity = world.getEntity(playerId);
            if (kickedMemberEntity && kickedMemberEntity instanceof Player) {
                kickedMemberEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `kicked.country` }] });
                system.runTimeout(() => {
                    if (config.countryNameDisplayOnPlayerNameTag) {
                        nameSet(kickedMemberEntity);
                    };

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
    };

    /**
     * 引数に入れたプレイヤーを国民にする
     * @param {string|Player} newMember
     * @param {Player|undefined} player 
     */
    add(newMember, player = undefined) {
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
    forceAdd(targetMember, player = undefined) {
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
            const targetMemberCountryRawData = this.countryDataBase.get(targetMemberData.country);
            if (targetMemberCountryRawData) {
                /**
                 * @type {CountryData}
                 */
                const targetMemberCountryData = JSON.parse(targetMemberCountryRawData);
                targetMemberCountryData.members = this.countryData.members.filter(m => m != playerId);
                this.countryDataBase.set(`country_${targetMemberCountryData.id}`, targetMemberCountryData);

                try {
                    const playerRoles = targetMemberData.roles ?? [];
                    for (const roleId of playerRoles) {
                        const role = JSON.parse(this.roleDataBase.get(`role_${roleId}`));
                        if (role) {
                            role.members = role.members.filter(m => m != targetMemberData.id);
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
    };
};

export class CountryManager {
    /**
     * 
     * @param {number|string} id 
     */
    constructor(id) {
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
    };

    /**
     * 国名の変更
     * @param {string} newName 
     * @param {Player|undefined} player 
     */
    reName(newName, player = undefined) {
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
            player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.countryname` }, { text: `\n§r${beforeName} ->§r ${newName}` }] });
        };

        country.afterEvents.rename.emit({
            countryId: this.id,
            oldName: beforeName,
            newName: newName,
            type: player ? 'player' : 'system',
            cancel: false
        });
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

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
    };

    /**
     * 同盟申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendAllianceRequest(countryId, player = undefined) {
        return sendAllianceRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 同盟申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptAllianceRequest(countryId, player = undefined) {
        return acceptAllianceRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 同盟申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyAllianceRequest(countryId, player = undefined) {
        return denyAllianceRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 同盟を解除
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    removeAlliance(countryId, player = undefined) {
        return removeAllianceFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 友好申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendFriendlyRequest(countryId, player = undefined) {
        return sendFriendlyRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 友好国申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptFriendlyRequest(countryId, player = undefined) {
        return acceptFriendlyRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 友好申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyFriendlyRequest(countryId, player = undefined) {
        return denyFriendlyRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 友好を解除
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    removeFriendly(countryId, player = undefined) {
        return removeFriendlyFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 講和申請を送信
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    sendApplicationRequest(countryId, player = undefined) {
        return sendApplicationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 講和申請を受諾
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    acceptApplicationRequest(countryId, player = undefined) {
        return acceptApplicationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 講和申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyApplicationRequest(countryId, player = undefined) {
        return denyApplicationRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 併合申請の送信
     * @param {number|string} countryId 
     * @param {Player} player 
     */
    sendMergeRequest(countryId, player = undefined) {
        return sendMergeRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 併合申請の受諾
     * @param {number|string} countryId 
     * @param {Player} player 
     */
    acceptMergeRequest(countryId, player = undefined) {
        MergeCountry(this.id, countryId, player)
        //return acceptMergeRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 併合申請を拒否
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    denyMergeRequest(countryId, player = undefined) {
        return denyMergeRequestFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 敵対する
     * @param {number} countryId 
     * @param {Player|undefined} player 
     * @returns {boolean}
     */
    AddHostility(countryId, player = undefined) {
        return addHostilityFunction(countryId, this.countryData, this.id, this.isVaildProperty, this.countryDataBase, player);
    };

    /**
     * 国力の取得
     * @returns {number}
     */
    getCountryPower() {
        let countryPower = 0;
        countryPower = this.countryData.money + this.countryData.members.length * 20 + this.countryData.territories.length * 10 + this.countryData.resourcePoint + this.countryData.alliance.length * 5 + this.countryData.friendly.length * 3 - this.countryData.hostility.length * 15;
        return countryPower;
    };

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
    invite(receivePlayer, sendPlayer = undefined) {
        return inviteFunction(this.id, receivePlayer, sendPlayer);
    };

    /**
     * 
     * @param {Player|string} newOwner 
     * @param {(Player|string)|undefined} player 
     */
    setNewOwner(newOwner, player = undefined) {
        return setNewOwnerFunction(this.id, newOwner, player);
    };

    /**
     * 
     * @param {RoleData} roleData 
     * @returns {number}
     */
    createRole(roleData) {
        return this.roleManager.createRoleToCountry(roleData, this.id);
    };

    /**
     * 
     * @param {number} roleId 
     */
    deleteRole(roleId) {
        this.roleManager.deleteRole(roleId, this.id);
        return;
    };

    /**
     * 
     * @returns {import("@minecraft/server").RawText}
     */
    getCountryInfoRawText() {
        const ownerData = this.memberManager.get(this.countryData.owner);
        const ownerName = ownerData?.name || 'None';

        const membersId = this.countryData.members.filter(m => m != ownerData.id);
        const memberManager = this.memberManager;
        let membersName = [];
        for (const member of membersId) {
            const memberData = memberManager.get(member);
            if (!memberData) continue;
            membersName.push(memberData.name);
        };

        const allianceIds = this.getAllianceCountryIds();
        let allianceCountryName = [];
        for (const id of allianceIds) {
            const allianceCountryManager = new CountryManager(id);
            if (!allianceCountryManager.isVaildProperty) continue;
            allianceCountryName.push(allianceCountryManager.name);
        };

        const hostilityIds = this.getHostilityCountryIds();
        let hostilityCountryName = [];
        for (const id of hostilityIds) {
            const hostilityCountryManager = new CountryManager(id);
            if (!hostilityCountryManager.isVaildProperty) continue;
            hostilityCountryName.push(hostilityCountryManager.name);
        };

        const friendlyIds = this.getFriendlyCountryIds();
        let friendlyCountryName = [];
        for (const id of friendlyIds) {
            const friendlyCountryManager = new CountryManager(id);
            if (!friendlyCountryManager.isVaildProperty) continue;
            friendlyCountryName.push(friendlyCountryManager.name);
        };

        const warNowIds = this.countryData.warNowCountries;
        let warNowCountryName = [];
        for (const id of warNowIds) {
            const warNowCountryManager = new CountryManager(id);
            if (!warNowCountryManager.isVaildProperty) continue;
            warNowCountryName.push(warNowCountryManager.name);
        };

        return {
            rawtext: [
                { translate: `form.showcountry.option.name`, with: [this.countryData.name] }, { text: `\n§r` },
                { translate: `form.showcountry.option.lore`, with: [this.countryData.lore] }, { text: `\n§r` },
                { translate: `form.showcountry.option.id`, with: [`${this.countryData.id}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.lv`, with: [`${this.countryData?.lv ?? 0}`] }, { text: `\n§r` },
                { text: `${this.roleManager.getRole(this.countryData.ownerRole)?.name || 'None'}: ${ownerName}` }, { text: `\n§r` },
                { translate: `form.showcountry.option.memberscount`, with: [`${this.countryData.members.length}`] }, { text: `\n§r` },
                { text: `${this.roleManager.getRole(this.countryData.peopleRole)?.name || 'None'}: ${membersName.join(`§r , `)}` }, { text: `\n§r` },
                { translate: `form.showcountry.option.territories`, with: [`${this.countryData.territories.length}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.money`, with: { rawtext: [{ translate: this.countryData.hideMoney ? 'show.private' : `${config.MoneyName} ${this.countryData.money}` }] } }, { text: `\n§r` },
                { translate: `form.showcountry.option.resourcepoint`, with: { rawtext: [{ translate: this.countryData.hideMoney ? 'show.private' : `${this.countryData.resourcePoint}` }] } }, { text: `\n§r` },
                { translate: `form.showcountry.option.peace`, with: [`${this.countryData.peace}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.invite`, with: [`${this.countryData.invite}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.taxper`, with: [`${this.countryData.taxPer}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.consumptiontax`, with: [`${this.countryData?.consumptionTax ?? 0}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.taxinstitutionisper`, with: [`${this.countryData.taxInstitutionIsPer}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.alliance`, with: [`${allianceCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.hostility`, with: [`${hostilityCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: `form.showcountry.option.friendly`, with: [`${friendlyCountryName.join(`§r , `)}`] }, { text: `\n§r` },
                { translate: 'form.showcountry.option.days', with: [`${this.countryData.days}`] }, { text: `\n§r` },
            ]
        }
    };

    /**
     * 
     * @param {Player} player 
     */
    nationTierLevelTryUp(player) {
        const need = national_tier_level.needs[(this.countryData.lv ?? 0) + 1];
        const needItems = need.item;
        const needPoint = need.point;
        const needItemId = needItems.map(a => a.typeId);
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
                player.runCommand(`clear @s ${item.typeId} -1 ${item.amount}`);
            };
            this.countryData.resourcePoint = this.countryData.resourcePoint - needPoint;
            this.countryData.lv = (this.countryData.lv ?? 0) + 1;
            this.countryDataBase.set(`country_${this.countryData.id}`, this.countryData);
            player.onScreenDisplay.setTitle({ text: `§a§lLevel UP!!` });
            player.onScreenDisplay.updateSubtitle({ text: `§e${this.countryData.lv - 1} §f>> §e${this.countryData.lv}` });
            player.sendMessage({ translate: 'national.tier.level.up', with: [`${this.countryData.lv}`] });
            player.playSound('random.levelup', { location: player.location });
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
    nationTierLevelSet(lv) {
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
    };

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
            player.onScreenDisplay.setTitle({ text: `§a§lLevel UP!!` });
            player.onScreenDisplay.updateSubtitle({ text: `§e${this.countryData.lv - add} §f>> §e${this.countryData.lv}` });
            player.sendMessage({ translate: 'national.tier.level.up', with: [`${this.countryData.lv}`] });
            player.playSound('random.levelup', { location: player.location });
        };
    };

    /**
     * 何が必要かのRawMessageを返す
     * @param {number} lv 
     * @returns {import("@minecraft/server").RawMessage}
     */
    nationTierLevelNeed(lv = (this.countryData.lv ?? 0) + 1) {
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
    nationTierLevelCheck(player, lv = (this.countryData.lv ?? 0)) {
        const need = national_tier_level.needs[(this.countryData.lv ?? 0) + 1];
        const needItems = need.item;
        const needPoint = need.point;
        const needItemId = needItems.map(a => a.typeId);
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
    };
}