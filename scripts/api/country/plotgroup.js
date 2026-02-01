import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CountryManager } from "./country";
/**@typedef {import("../../jsdoc/plot").PlotTypes} PlotTypes*/
/**@typedef {import("../../jsdoc/plot").PlotGroupData} PlotGroupData*/
/**@typedef {import("../../jsdoc/player").PlayerData} PlayerData*/

export class PlotGroupManager {
    constructor() {
        this.plotGroupDataBase = new DynamicProperties('plotgroup');
        this.countryDataBase = new DynamicProperties('country');
        this.playerDataBase = new DynamicProperties('player');
        this.roleDataBase = new DynamicProperties('role');
        const plotGroupNumStr = world.getDynamicProperty('plotgroupId') ?? '1';
        this.plotGroupNum = Number(plotGroupNumStr);
    };

    /**
     * 
     * @param {number} countryId 
     * @param {string} name 
     * @param {PlotTypes} type 
     * @param {Player|undefined} player 
     * @returns 
     */
    create(countryId, name, type = 'public', player = undefined) {
        if (player) {
            /**
             * @type {PlayerData}
             */
            const playerData = JSON.parse(this.playerDataBase.get(`player_${player.id}`));

            if (!playerData?.country) {
                player.sendMessage({ translate: `cannnot.use.nojoin.country` });
                return;
            };
        };
        const id = this.getPlotGroupNum();
        const countryManager = new CountryManager(countryId);
        let countryData = countryManager.countryData;
        const plotGroup = countryData?.plotgroup ?? [];
        /**
         * @type {PlotGroupData}
         */
        const plotGroupData = {
            id: id,
            is_selling: false,
            name: name,
            owner: null,
            players: [],
            permissions: [],
            type: type,
            price: 0,
            countries: [],
        };
        plotGroup.push(id);
        countryData.plotgroup = plotGroup;
        this.plotGroupDataBase.set(`plotgroup_${id}`, plotGroupData);
        this.countryDataBase.set(`country_${countryId}`, countryData);
        this.addPlotGroupNum(1);
        if (player) {
            player.sendMessage({ rawtext: [{ translate: `plotgroup.created`, with: [`${name}`] }] });
        };
        return plotGroupData;
    };

    delete(plotGroupId, countryId) {
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        if (!countryData) {
            return;
        };
        if (!countryData?.plotgroup) countryData.plotgroup = [];
        countryData.plotgroup = countryData?.plotgroup.filter(id => id != plotGroupId);
        this.countryDataBase.set(`country_${countryId}`, countryData);
        this.plotGroupDataBase.delete(`plotgroup_${plotGroupId}`);
    };

    /**
     * 
     * @param {number} plotGroupId 
     * @returns {PlotGroupData|undefined}
     */
    get(plotGroupId) {
        const rawPlotGroupData = this.plotGroupDataBase.get(`plotgroup_${plotGroupId}`);
        if (!rawPlotGroupData) return undefined;
        const plotGroupData = JSON.parse(rawPlotGroupData);
        return plotGroupData
    };

    /**
     * 
     * @param {number} plotGroupId 
     * @param {PlotGroupData} plotGroupData 
     */
    set(plotGroupId, plotGroupData) {
        this.plotGroupDataBase.set(`plotgroup_${plotGroupId}`, plotGroupData);
        return;
    };

    /**
     * 
     * @returns {number}
     */
    getPlotGroupNum() {
        return this.plotGroupNum;
    };

    /**
     * 
     * @returns {number}
     */
    addPlotGroupNum(add = 1) {
        this.plotGroupNum = this.plotGroupNum + add;
        world.setDynamicProperty('plotgroupId', String(this.plotGroupNum));
        return this.plotGroupNum;
    };

    /**
     * 
     * @returns {number}
     */
    setPlotGroupNum(num) {
        this.plotGroupNum = num;
        world.setDynamicProperty('plotgroupId', String(this.plotGroupNum));
        return this.plotGroupNum;
    };
};