import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../../../api/country/country.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util.js";
import { HostilityListDefaultForm } from "../hostility_list.js";
import { addHostilityCountryFromListDefaultForm } from "./add_list.js";
/** @typedef {import("../../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 新たに敵対国にする国のリスト
 * @param {Player} player 
 */
export function AddHostilityListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const playerCountryManager = new CountryManager(playerData.country);
    const playerCountryData = playerCountryManager.countryData;
    let hostilityCountryIds = playerCountryData.hostility;
    let allianceCountryIds = playerCountryData.alliance;
    const form = new ActionFormData();
    form.title({ translate: `form.hostility.add.title` });
    let countryIds = countryDataBase.idList.filter((id: any) => id.startsWith(`country_`)).filter((id: any) => id != `country_${playerData.country}`);
    let filtered1 = countryIds.filter((id: any) => !hostilityCountryIds.includes(Number(id.split('_')[1])));
    let filtered2 = filtered1.filter((id: any) => !allianceCountryIds.includes(Number(id.split('_')[1])));
    let lands: any = [];
    form.button({ translate: `mc.button.close` });
    for (const countryId of filtered2) {
        const targetCountryManager = new CountryManager(countryId.split('_')[1])
        if (!targetCountryManager.isVaildProperty) continue;
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
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                addHostilityCountryFromListDefaultForm(player, lands[rs.selection - 1]);
                return;
            };
        };
    });
};
