import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CountryManager } from "./country";
/**@typedef {import("../../jsdoc/role").RoleData} RoleData*/
/**@typedef {import("../../jsdoc/permission").CountryPermissionList} CountryPermissionList*/
/**@typedef {import("../../jsdoc/player").PlayerData} PlayerData*/

export class RoleManager {
    constructor() {
        this.roleDataBase = new DynamicProperties('role');
        this.playerDataBase = new DynamicProperties('player');
        const roleIdStr = world.getDynamicProperty('roleId') ?? '1';
        this.roleNum = Number(roleIdStr);
    };

    /**
     * @param {Array<RoleData>} roleDatas 
     * @returns {Array<number>}
     */
    createRole(roleDatas = [{ name: 'newRole', permissions: [], icon: 'textures/blocks/stone', color: '§e' }]) {
        let id = this.getRoleNum();
        let returns = [];
        for (const role of roleDatas) {
            const roleData = {
                name: role.name,
                color: `${role.color}`,
                icon: `${role.icon}`,
                id: id,
                members: [],
                permissions: role.permissions
            };
            this.roleDataBase.set(`role_${id}`, roleData);
            returns.push(roleData.id);
            id++;
        };
        this.setRoleNum(id++);
        return returns;
    };

    /**
     * @param {RoleData} roleData 
     * @param {number} countryId 
     * @returns {number}
     */
    createRoleToCountry(roleData, countryId) {
        const countryDataBase = new DynamicProperties('country');
        const roleId = this.createRole([roleData])[0];
        const countryRawData = countryDataBase.get(`country_${countryId}`);
        const countryData = JSON.parse(countryRawData);
        countryData.roles.push(roleId);
        countryDataBase.set(`country_${countryId}`, JSON.stringify(countryData));
        return roleId;
    };

    /**
     * 
     * @param {number} roleId
     * @returns {RoleData|undefined} 
     */
    getRole(roleId) {
        const rawRoleData = this.roleDataBase.get(`role_${roleId}`);
        if (!rawRoleData) return undefined;
        const roleData = JSON.parse(rawRoleData);
        return roleData;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {string} value 
     */
    setIcon(roleId, value) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.icon = value;
        this.setRole(roleId, roleData);
        return true;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {string} value 
     */
    setColor(roleId, value) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.color = value;
        this.setRole(roleId, roleData);
        return true;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {string} value 
     */
    setName(roleId, value) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.name = value;
        this.setRole(roleId, roleData);
        return true;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {CountryPermissionList} value 
     */
    setPermissions(roleId, value) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.permissions = value;
        this.setRole(roleId, roleData);
        return true;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {Player|string} member 
     */
    addMember(roleId, member) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        let memberId = '';
        if (member instanceof Player) {
            memberId = member.id;
        } else if (typeof member == 'string') {
            memberId = member;
        } else {
            return false;
        };
        if (roleData.members.includes(memberId)) {
            return false;
        };
        roleData.members.push(memberId);
        /**
         * @type {PlayerData}
         */
        const playerData = JSON.parse(this.playerDataBase.get(`player_${memberId}`));
        playerData.roles.push(memberId);
        this.playerDataBase.set(`player_${memberId}`, playerData);
        this.setRole(roleId, roleData);
        return true;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {Player|string} member 
     */
    removeMember(roleId, member) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        let memberId = '';
        if (member instanceof Player) {
            memberId = member.id;
        } else if (typeof member == 'string') {
            memberId = member;
        } else {
            return false;
        };
        if (!roleData.members.includes(memberId)) {
            return false;
        };
        roleData.members = roleData.members.filter(id => id != memberId);
        /**
         * @type {PlayerData}
         */
        const playerData = JSON.parse(this.playerDataBase.get(`player_${memberId}`));
        playerData.roles = playerData.roles.filter(id => id != memberId);
        this.playerDataBase.set(`player_${memberId}`, playerData);
        this.setRole(roleId, roleData);
        return true;
    };

    /**
     * 
     * @param {number} roleId 
     * @param {number} countryId 
     */
    deleteRole(roleId, countryId) {
        const roleData = this.getRole(roleId);
        for (const memberId of roleData.members) {
            this.removeMember(roleId, memberId);
        };
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        countryData.roles = countryData.roles.filter(role => role != roleId);
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(countryData);
        this.roleDataBase.delete(`role_${roleId}`);
    };

    /**
     * 
     * @param {number} roleId 
     * @param {roleData} roleData 
     */
    setRole(roleId, roleData) {
        this.roleDataBase.set(`role_${roleId}`, roleData);
        return true;
    };

    /**
     * 
     * @returns {number}
     */
    getRoleNum() {
        return this.roleNum;
    };

    /**
     * 
     * @returns {number}
     */
    addRoleNum(add = 1) {
        this.roleNum = this.roleNum + add;
        world.setDynamicProperty('roleId', String(this.roleNum));
        return this.roleNum;
    };

    /**
     * 
     * @returns {number}
     */
    setRoleNum(num) {
        this.roleNum = num;
        world.setDynamicProperty('roleId', String(this.roleNum));
        return this.roleNum;
    };
};