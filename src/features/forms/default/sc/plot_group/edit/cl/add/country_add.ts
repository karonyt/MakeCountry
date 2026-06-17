import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { plotGroupEditCountriesListDefaultForm } from "@/features/forms/default/sc/plot_group/edit/cl/countries_list.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

/**
 * 
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin 
 * @param {boolean} search 
 * @param {string} keyword 
 */
export function countryAddPlotGroupDefaultForm(player: any, plotGroupId: any, isPlotAdmin: any, search = false, keyword = ``) {
    const form = new ActionFormData();
    form.title({ translate: `form.plot.addplayer.list.title` });
    form.button({ translate: `form.plot.addplayer.button.serch` });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.countries) plotGroupData.countries = [];
    const countryDataBase = new DynamicProperties('country');
    const countryIds = countryDataBase.idList;
    let aliveCountries: any = [];
    let aliveCountriesData: any = [];
    for (const id of countryIds) {
        const rawCountryData = countryDataBase.get(id);
        if (!rawCountryData) continue;
        /**
         * @type {CountryData}
         */
        const countryData = JSON.parse(rawCountryData);

        if (search) {
            if (!countryData.name.includes(keyword)) continue;
        };

        aliveCountries.push(countryData.id);
        aliveCountriesData.push(countryData);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };

    plotGroupData.countries = plotGroupData.countries.filter((d: any) => aliveCountries.includes(d.id));
    plotGroupManager.set(plotGroupId, plotGroupData);

    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditCountriesListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form

                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                const target = aliveCountriesData[rs.selection - 1];
                plotGroupData.countries.push({ id: target.id, permissions: [] });
                plotGroupManager.set(plotGroupId, plotGroupData);
                plotGroupEditCountriesListDefaultForm(player, plotGroupId, isPlotAdmin);
                return;
            };
        };
    });
};