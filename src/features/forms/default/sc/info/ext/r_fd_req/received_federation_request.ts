import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { federationRequestCountryDefaultForm } from "@/features/forms/default/sc/info/ext/r_fd_req/federation_request_country.js";
import { getFederationRequestCountryIds } from "@/domain/country/relationships/federation.js";
import { canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 受信した連邦加盟申請
 * @param {Player} player
 */
export function ReceivedFederationRequestDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const playerCountryManager = new CountryManager(playerData?.country);
    const playerCountryData = playerCountryManager.countryData;
    const receivedFederationRequests = getFederationRequestCountryIds(playerCountryData);
    const form = new ActionFormData();
    const lands: any = [];
    form.title({ translate: `received.federation.request` });
    form.button({ translate: `mc.button.close` });

    for (const countryId of receivedFederationRequests) {
        const countryManager = new CountryManager(countryId);
        if (!countryManager.isVaildProperty) continue;
        const countryData = countryManager.countryData;
        lands.push(countryData.id);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    }

    form.show(player).then((rs) => {
        if (!canManageFederation(player, playerCountryData)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        }
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
                federationRequestCountryDefaultForm(player, lands[(rs.selection ?? 0) - 1]);
                break;
            }
        }
    });
}
