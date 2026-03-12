import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp.js";
import { CountryManager } from "./country.js";
/**@typedef {import("../../jsdoc/role").RoleData} RoleData*/
/**@typedef {import("../../jsdoc/permission").CountryPermissionList} CountryPermissionList*/
/**@typedef {import("../../jsdoc/player").PlayerData} PlayerData*/

export class RoleManager {
    playerDataBase: any;
    roleDataBase: any;
    roleNum: any;
    constructor() {
        this.roleDataBase = new DynamicProperties('role');
        this.playerDataBase = new DynamicProperties('player');
        const roleIdStr = world.getDynamicProperty('roleId') ?? '1';
        this.roleNum = Number(roleIdStr);
    }

    /**
     * @param {Array<RoleData>} roleDatas 
     * @returns {Array<number>}
     */
    createRole(roleDatas = [{ name: 'newRole', permissions: [], icon: 'textures/blocks/stone', color: '§e' }]) {
        let id = this.getRoleNum();
        let returns = [];
        for (const role of roleDatas) {
            const roleData = {
                name: role.name ?? 'newRole',
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
        this.setRoleNum(id);
        return returns;
    }

    /**
     * @param {RoleData} roleData 
     * @param {number} countryId 
     * @returns {number}
     */
    createRoleToCountry(roleData: any, countryId: any) {
        const countryDataBase = new DynamicProperties('country');
        const roleId = this.createRole([roleData])[0];
        const countryRawData = countryDataBase.get(`country_${countryId}`);
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const countryData = JSON.parse(countryRawData);
        countryData.roles.push(roleId);
        countryDataBase.set(`country_${countryId}`, JSON.stringify(countryData));
        return roleId;
    }

    /**
     * 
     * @param {number} roleId
     * @returns {RoleData|undefined} 
     */
    getRole(roleId: any) {
        const rawRoleData = this.roleDataBase.get(`role_${roleId}`);
        if (!rawRoleData) return undefined;
        const roleData = JSON.parse(rawRoleData);
        return roleData;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {string} value 
     */
    setIcon(roleId: any, value: any) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.icon = value;
        this.setRole(roleId, roleData);
        return true;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {string} value 
     */
    setColor(roleId: any, value: any) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.color = value;
        this.setRole(roleId, roleData);
        return true;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {string} value 
     */
    setName(roleId: any, value: any) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.name = value;
        this.setRole(roleId, roleData);
        return true;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {CountryPermissionList} value 
     */
    setPermissions(roleId: any, value: any) {
        const roleData = this.getRole(roleId);
        if (!roleData) return false;
        roleData.permissions = value;
        this.setRole(roleId, roleData);
        return true;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {Player|string} member 
     */
    addMember(roleId: any, member: any) {
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
        playerData.roles.push(roleId);
        this.playerDataBase.set(`player_${memberId}`, playerData);
        this.setRole(roleId, roleData);
        return true;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {Player|string} member 
     */
    removeMember(roleId: any, member: any) {
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
        roleData.members = roleData.members.filter((id: any) => id != memberId);
        /**
         * @type {PlayerData}
         */
        const playerData = JSON.parse(this.playerDataBase.get(`player_${memberId}`));
        playerData.roles = playerData.roles.filter((id: any) => id != roleId);
        this.playerDataBase.set(`player_${memberId}`, playerData);
        this.setRole(roleId, roleData);
        return true;
    }

    /**
     * 
     * @param {number} roleId 
     * @param {number} countryId 
     */
    deleteRole(roleId: any, countryId: any) {
        const roleData = this.getRole(roleId);
        for (const memberId of roleData.members) {
            this.removeMember(roleId, memberId);
        };
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        countryData.roles = countryData.roles.filter((role: any) => role != roleId);
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${countryId}`, JSON.stringify(countryData));
        this.roleDataBase.delete(`role_${roleId}`);
    }

    /**
     * 
     * @param {number} roleId 
     * @param {roleData} roleData 
     */
    setRole(roleId: any, roleData: any) {
        this.roleDataBase.set(`role_${roleId}`, roleData);
        return true;
    }

    /**
     * 
     * @returns {number}
     */
    getRoleNum() {
        return this.roleNum;
    }

    /**
     * 
     * @returns {number}
     */
    addRoleNum(add = 1) {
        this.roleNum = this.roleNum + add;
        world.setDynamicProperty('roleId', String(this.roleNum));
        return this.roleNum;
    }

    /**
     * 
     * @returns {number}
     */
    setRoleNum(num: any) {
        this.roleNum = num;
        world.setDynamicProperty('roleId', String(this.roleNum));
        return this.roleNum;
    }
};