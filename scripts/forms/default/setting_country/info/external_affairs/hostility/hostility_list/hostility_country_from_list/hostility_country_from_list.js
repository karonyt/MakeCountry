import { Player } from "@minecraft/server";
import { CountryManager } from "../../../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util";
import { HostilityListDefaultForm } from "../hostility_list";
import { checkApplicationForPeaceSendDefaultForm } from "./check_application_for_peace_send";

/**
 * 敵対国一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function HostilityCountryFromListDefaultForm(player, countryId) {
    try {
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;

        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.application` });
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
                    return;
                };
                case 1: {
                    checkApplicationForPeaceSendDefaultForm(player, countryId);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};