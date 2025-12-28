import { ActionFormData } from "@minecraft/server-ui";
import { CountryManager } from "../../../../../../../../api/country/country";
import { CheckPermission } from "../../../../../../../../lib/util";
import { AllianceListDefaultForm } from "../alliance_list";
import { Player } from "@minecraft/server";
import { checkAddAllianceDefaultForm } from "./check";

/**
 * 同盟国候補一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function addAllianceCountryFromListDefaultForm(player, countryId) {
    try {
        const countryManager = new CountryManager(countryId)
        const countryData = countryManager.countryData;
        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.send` });
        form.show(player).then(rs => {
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
                    return;
                };
                case 1: {
                    checkAddAllianceDefaultForm(player, countryData.id);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
