import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { AllianceListDefaultForm } from "@/features/forms/default/sc/info/ext/al/list/alliance_list.js";
import { checkAllianceRemoveDefaultForm } from "@/features/forms/default/sc/info/ext/al/list/country/remove.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 同盟国一覧から選んだ国
 * @param {Player} player 
 * @param {number} countryId 
 */
export function AllianceCountryFromListDefaultForm(player: any, countryId: any) {
    try {
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.remove.alliance` });
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
                    checkAllianceRemoveDefaultForm(player, countryId);
                    return;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
