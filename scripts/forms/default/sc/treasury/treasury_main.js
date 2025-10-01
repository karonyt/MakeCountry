import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "../setting_country";
import { treasurybudgetSelectDefaultForm } from "./treasury_budget/treasury_budget_select";
import { resourcepointSelectDefaultForm } from "./resource_point/resource_point_select";
import config from "../../../../config";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 国庫メイン
 * @param {Player} player 
 */
export function treasuryMainDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    const form = new ActionFormData();
    form.title({ translate: `form.treasurymain.title` });
    form.body({ rawtext: [{ translate: `treasurybudget.body` }, { text: `${config.MoneyName} ${countryData.money}\n` }, { translate: `resourcepoint.body` }, { text: `${countryData.resourcePoint}` }] });
    form.button({ translate: `treasurybudget` });
    form.button({ translate: `resourcepoint` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                treasurybudgetSelectDefaultForm(player);
                break;
            };
            case 1: {
                 resourcepointSelectDefaultForm(player);
                break;
            };
        };
    });
};