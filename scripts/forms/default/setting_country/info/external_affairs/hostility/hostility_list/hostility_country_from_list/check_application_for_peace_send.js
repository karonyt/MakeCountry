import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../../../../../lib/util";
import { HostilityCountryFromListDefaultForm } from "./hostility_country_from_list";
import { CountryManager } from "../../../../../../../../api/country/country";

/**
 * 講和申請送信チェックフォーム
 * @param {Player} player 
 * @param {number} countryId 
 */
export function checkApplicationForPeaceSendDefaultForm(player, countryId) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.application.send.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.send` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `hostilityAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            HostilityCountryFromListDefaultForm(player, countryId);
            return;
        };
        switch (rs.selection) {
            case 0: {
                return;
            };
            case 1: {
                const countryManager = new CountryManager(countryId);
                countryManager.sendApplicationRequest(countryId, player);
                return;
            };
        };
    });
};