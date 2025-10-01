import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../../api/country/plotgroup";
import { plotGroupCountryPermissionsEditDefaultForm } from "./permissions/permissions";
import { plotGroupEditCountriesListDefaultForm } from "../countries_list";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../../../jsdoc/country").CountryData} CountryData*/

/**
 * 
 * @param {Player} player 
 * @param {CountryData} targetData 
 * @param {boolean} isPlotAdmin 
 * @param {number} plotGroupId 
 */
export function plotGroupCountrySelectedShowDefaultForm(player, targetData, plotGroupId, isPlotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditCountriesListDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotGroupEditCountriesListDefaultForm(player, plotGroupId, isPlotAdmin);
                break;
            };
            case 1: {
                plotGroupCountryPermissionsEditDefaultForm(player, plotGroupId, targetData, isPlotAdmin);
                break;
            };
            case 2: {
                const plotGroupManager = new PlotGroupManager();
                let plotGroupData = plotGroupManager.get(plotGroupId);
                if (!plotGroupData) {
                    return;
                };
                if (!plotGroupData?.countries) plotGroupData.countries = [];
                plotGroupData.countries = plotGroupData.countries.filter(d => d.id != targetData.id);
                plotGroupManager.set(plotGroupId, plotGroupData);
                plotGroupEditCountriesListDefaultForm(player, plotGroupId, isPlotAdmin);
                break;
            };
            case 3: {
                break;
            };
        };
    });
};