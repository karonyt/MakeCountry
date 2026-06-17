import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ActionFormData } from "@minecraft/server-ui";
import { PlotGroupManager } from "@/domain/country/plot-group.js";
import { plotGroupEditMainPlotAdminDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_admin.js";
import { plotGroupEditMainPlotOwnerDefaultForm } from "@/features/forms/default/sc/plot_group/edit/edit_main_owner.js";
import { countryAddPlotGroupDefaultForm } from "@/features/forms/default/sc/plot_group/edit/cl/add/country_add.js";
import { plotGroupCountrySelectedShowDefaultForm } from "@/features/forms/default/sc/plot_group/edit/cl/show/selected_show.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

/**
 * プロット国リストフォーム
 * @param {Player} player 
 * @param {number} plotGroupId 
 * @param {boolean} isPlotAdmin 
 */
export function plotGroupEditCountriesListDefaultForm(player: any, plotGroupId: any, isPlotAdmin = false) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
    let aliveCountries: any = [];
    let aliveCountriesData: any = [];
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
    plotGroupData.countries = plotGroupData.countries.filter((d: any) => aliveCountries.includes(d.id));
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
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        plotGroupCountrySelectedShowDefaultForm(player, aliveCountriesData[rs.selection - 1], plotGroupId, isPlotAdmin);
        return;
    });
};
