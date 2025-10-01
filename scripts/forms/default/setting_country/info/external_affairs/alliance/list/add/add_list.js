import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util";
import { AllianceListDefaultForm } from "../alliance_list";
import { addAllianceCountryFromListDefaultForm } from "./add";
/**@typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 新たに同盟国にする国のリスト
 * @param {Player} player 
 */
export function AddAllianceListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const playerCountryData = countryManager.countryData;
    let hostilityCountryIds = playerCountryData.hostility;
    let allianceCountryIds = playerCountryData.alliance;
    let friendlyCountryIds = playerCountryData.friendly;
    const form = new ActionFormData();
    form.title({ translate: `form.check.alliance.send.title` });
    let countryIds = countryDataBase.idList.filter(id => id.startsWith(`country_`)).filter(id => id != `country_${playerData.country}`);
    let filtered1 = countryIds.filter(id => !hostilityCountryIds.includes(Number(id.split('_')[1])));
    let filtered2 = filtered1.filter(id => !allianceCountryIds.includes(Number(id.split('_')[1])));
    let filtered3 = filtered2.filter(id => !friendlyCountryIds.includes(Number(id.split('_')[1])));
    form.button({ translate: `mc.button.close` });
    let lands = [];
    for (const countryId of filtered3) {
        const countryData = new CountryManager(countryId.split('_')[1]).countryData;
        if (!countryData?.id) {
            countryDataBase.delete(countryId);
            continue;
        }
        lands.push(countryData.id);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            AllianceListDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            default: {
                addAllianceCountryFromListDefaultForm(player, lands[rs.selection - 1]);
                break;
            };
        };
    });
};
