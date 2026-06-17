import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { HostilityListDefaultForm } from "@/features/forms/default/sc/info/ext/hos/list/hostility_list.js";
import { checkApplicationForPeaceSendDefaultForm } from "@/features/forms/default/sc/info/ext/hos/list/list/check.js";

/**
 * 敵対国一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function HostilityCountryFromListDefaultForm(player: any, countryId: any) {
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
                    checkApplicationForPeaceSendDefaultForm(player, Number(countryId));
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};