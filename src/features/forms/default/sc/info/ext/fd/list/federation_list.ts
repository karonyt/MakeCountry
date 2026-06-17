import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { FederationCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/country/list.js";
import { getFederationMemberIds } from "@/domain/country/relationships/federation.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 連邦構成国リストフォーム
 * @param {Player} player
 */
export function FederationListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const countryManager = new CountryManager(playerData?.country);
    const playerCountryData = countryManager.countryData;
    const federationCountryIds = getFederationMemberIds(playerCountryData);
    const form = new ActionFormData();
    const lands: any = [];
    form.title({ translate: `form.federation.list.title` });
    form.button({ translate: `mc.button.close` });

    for (const countryId of federationCountryIds) {
        const federationCountryManager = new CountryManager(countryId);
        if (!federationCountryManager.isVaildProperty) continue;
        const countryData = federationCountryManager.countryData;
        lands.push(countryData.id);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    }

    form.show(player).then((rs) => {
        if (rs.canceled) {
            FederationMainDefaultForm(player);
            return;
        }
        switch (rs.selection) {
            case 0: {
                FederationMainDefaultForm(player);
                break;
            }
            default: {
                FederationCountryFromListDefaultForm(player, lands[(rs.selection ?? 0) - 1]);
                break;
            }
        }
    });
}
