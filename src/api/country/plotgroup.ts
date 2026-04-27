import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp.js";
import { CountryManager } from "./country.js";
import { PlotGroupData } from "@/jsdoc/plot.js";
/**@typedef {import("../../jsdoc/plot").PlotTypes} PlotTypes*/
/**@typedef {import("../../jsdoc/plot").PlotGroupData} PlotGroupData*/
/**@typedef {import("../../jsdoc/player").PlayerData} PlayerData*/

export class PlotGroupManager {
    countryDataBase: any;
    playerDataBase: any;
    plotGroupDataBase: any;
    plotGroupNum: any;
    roleDataBase: any;
    constructor() {
        this.plotGroupDataBase = new DynamicProperties('plotgroup');
        this.countryDataBase = new DynamicProperties('country');
        this.playerDataBase = new DynamicProperties('player');
        this.roleDataBase = new DynamicProperties('role');
        const plotGroupNumStr = world.getDynamicProperty('plotgroupId') ?? '1';
        this.plotGroupNum = Number(plotGroupNumStr);
    }

    /**
     * 
     * @param {number} countryId 
     * @param {string} name 
     * @param {PlotTypes} type 
     * @param {Player|undefined} player 
     * @returns 
     */
    create(countryId: any, name: any, type = 'public', player = undefined) {
        if (player) {
            /**
             * @type {PlayerData}
             */
            // @ts-ignore TS(2339): Property 'id' does not exist on type 'never'.
            const playerData = JSON.parse(this.playerDataBase.get(`player_${player.id}`));

            if (!playerData?.country) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
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
            // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
            player.sendMessage({ rawtext: [{ translate: `plotgroup.created`, with: [`${name}`] }] });
        };
        return plotGroupData;
    }

    delete(plotGroupId: any, countryId: any) {
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        if (!countryData) {
            return;
        };
        if (!countryData?.plotgroup) countryData.plotgroup = [];
        countryData.plotgroup = countryData?.plotgroup.filter((id: any) => id != plotGroupId);
        this.countryDataBase.set(`country_${countryId}`, countryData);
        this.plotGroupDataBase.delete(`plotgroup_${plotGroupId}`);
    }

    /**
     * 
     * @param {number} plotGroupId 
     * @returns {PlotGroupData|undefined}
     */
    get(plotGroupId: number) {
        const rawPlotGroupData = this.plotGroupDataBase.get(`plotgroup_${plotGroupId}`);
        if (!rawPlotGroupData) return undefined;
        const plotGroupData: PlotGroupData = JSON.parse(rawPlotGroupData);
        return plotGroupData
    }

    /**
     * 
     * @param {number} plotGroupId 
     * @param {PlotGroupData} plotGroupData 
     */
    set(plotGroupId: any, plotGroupData: any) {
        this.plotGroupDataBase.set(`plotgroup_${plotGroupId}`, plotGroupData);
        return;
    }

    /**
     * 
     * @returns {number}
     */
    getPlotGroupNum() {
        return this.plotGroupNum;
    }

    /**
     * 
     * @returns {number}
     */
    addPlotGroupNum(add = 1) {
        this.plotGroupNum = this.plotGroupNum + add;
        world.setDynamicProperty('plotgroupId', String(this.plotGroupNum));
        return this.plotGroupNum;
    }

    /**
     * 
     * @returns {number}
     */
    setPlotGroupNum(num: any) {
        this.plotGroupNum = num;
        world.setDynamicProperty('plotgroupId', String(this.plotGroupNum));
        return this.plotGroupNum;
    }
};