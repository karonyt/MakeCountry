import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../../api/dyp.js";
import { CountryManager } from "../../../../../../../../api/country/country.js";
import { CheckPermission } from "../../../../../../../../lib/util.js";
import { HostilityListDefaultForm } from "../hostility_list.js";
import { checkAddHostilityDefaultForm } from "./check.js";
import { ActionFormData } from "@minecraft/server-ui";

/**
 * 敵対国候補一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function addHostilityCountryFromListDefaultForm(player: any, countryId: any) {
    try {
        const playerDataBase = new DynamicProperties('player');
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;

        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.add` });
        form.show(player).then(rs => {
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
                case 1: {
                    checkAddHostilityDefaultForm(player, countryData.id);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};