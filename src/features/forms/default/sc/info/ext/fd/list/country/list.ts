import { Player } from "@minecraft/server";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { FederationListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/federation_list.js";
import { checkFederationRemoveDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/country/remove.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";

/**
 * 連邦構成国一覧から選んだ国
 * @param {Player} player
 * @param {number} countryId
 */
export function FederationCountryFromListDefaultForm(player: any, countryId: any) {
    try {
        const playerDataBase = new DynamicProperties("player");
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
        const playerCountryManager = new CountryManager(playerData?.country);
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        const showBody = countryManager.getCountryInfoRawText();

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        form.button({ translate: countryId === playerData.country ? `federation.member.leave` : `mc.button.remove.federation` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                FederationListDefaultForm(player);
                return;
            }
            switch (rs.selection) {
                case 0: {
                    FederationListDefaultForm(player);
                    return;
                }
                case 1: {
                    if (countryId === playerData.country || canManageFederation(player, playerCountryManager.countryData)) {
                        checkFederationRemoveDefaultForm(player, countryId);
                    } else {
                        player.sendMessage({ translate: `no.permission` });
                    }
                    return;
                }
            }
        });
    } catch (error) {
        console.warn(error);
    }
}
