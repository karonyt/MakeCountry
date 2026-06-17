import { ActionFormData } from "@minecraft/server-ui";
import { CountryManager } from "@/domain/country/country-manager.js";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { FriendlyListDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/friendly_list.js";
import { Player } from "@minecraft/server";
import { checkAddFriendlyDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/add/add.js";

/**
 * 友好国候補一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function addFriendlyCountryFromListDefaultForm(player: any, countryId: any) {
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
                FriendlyListDefaultForm(player);
                return;
            };
            switch (rs.selection) {
                case 0: {
                    //閉じる
                    return;
                };
                case 1: {
                    checkAddFriendlyDefaultForm(player, countryData.id);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
