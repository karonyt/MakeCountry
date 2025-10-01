import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "../../../../../../api/country/plotgroup";
import { plotGroupEditMainPlotAdminDefaultForm } from "../edit_main_admin";
import { plotGroupEditMainPlotOwnerDefaultForm } from "../edit_main_owner";
import { countryAddPlotGroupDefaultForm } from "./add/country_add";
import { plotGroupCountrySelectedShowDefaultForm } from "./show/selected_show";
/**@typedef {import("../../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../../jsdoc/country").CountryData} CountryData*/

/**
 * プロット国リストフォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin 
 */
export function plotGroupEditCountriesListDefaultForm(player, plotGroupId, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.country` }] });
    const plotGroupManager = new PlotGroupManager();
    let plotGroupData = plotGroupManager.get(plotGroupId);
    if (!plotGroupData) {
        return;
    };
    if (!plotGroupData?.countries) plotGroupData.countries = [];
    form.button({ translate: `mc.button.country.add` });
    let aliveCountries = [];
    let aliveCountriesData = [];
    for (const plotGroupDataCountry of plotGroupData.countries) {
        const rawCountryData = countryDataBase.get(`country_${plotGroupDataCountry.id}`);
        if (rawCountryData) {
            /**
             * @type {CountryData}
             */
            const countryData = JSON.parse(rawCountryData);
            aliveCountries.push(countryData.id);
            aliveCountriesData.push(countryData);
            form.button(`${countryData.name}\n${countryData.id}`);
        };
    };
    plotGroupData.countries = plotGroupData.countries.filter(d => aliveCountries.includes(d.id));
    plotGroupManager.set(plotGroupId, plotGroupData);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (isPlotAdmin) {
                plotGroupEditMainPlotAdminDefaultForm(player, plotGroupId);
                return;
            };
            plotGroupEditMainPlotOwnerDefaultForm(player, plotGroupId);
            return;
        };
        if (rs.selection == 0) {
            countryAddPlotGroupDefaultForm(player, plotGroupId, isPlotAdmin);
            return;
        };
        plotGroupCountrySelectedShowDefaultForm(player, aliveCountriesData[rs.selection - 1], plotGroupId, isPlotAdmin);
        return;
    });
};
