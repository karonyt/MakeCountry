import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util";
import { HostilityListDefaultForm } from "../hostility_list";
import { addHostilityCountryFromListDefaultForm } from "./add_hostility_country_from_list";
/** @typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 新たに敵対国にする国のリスト
 * @param {Player} player 
 */
export function AddHostilityListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    let hostilityCountryIds = playerCountryData.hostility;
    let allianceCountryIds = playerCountryData.alliance;
    const form = new ActionFormData();
    form.title({ translate: `form.hostility.add.title` });
    let countryIds = countryDataBase.idList.filter(id => id.startsWith(`country_`)).filter(id => id != `country_${playerData.country}`);
    let filtered1 = countryIds.filter(id => !hostilityCountryIds.includes(id));
    let filtered2 = filtered1.filter(id => !allianceCountryIds.includes(id));
    let lands = [];
    form.button({ translate: `mc.button.close` });
    for (const countryId of filtered2) {
        const targetCountryManager = new CountryManager(countryId)
        if(!targetCountryManager.isVaildProperty) continue;
        const countryData = targetCountryManager.countryData;
        lands.push(countryData.id);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (CheckPermission(player, `hostilityAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            HostilityListDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                return;
            };
            default: {
                addHostilityCountryFromListDefaultForm(player, lands[rs.selection - 1]);
                return;
            };
        };
    });
};
