import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { FriendlyListDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/friendly_list.js";
import { checkFriendlyRemoveDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/list/remove.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 友好国一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function FriendlyCountryFromListDefaultForm(player: any, countryId: any) {
    try {
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.remove.friendly` });
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
                    checkFriendlyRemoveDefaultForm(player, countryId);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
