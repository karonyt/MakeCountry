import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { addFederationCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/add/add.js";
import { isFederationActive, listFederationGovernments, normalizeFederationData } from "@/domain/country/relationships/federation.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 加盟申請を送信できる連邦政府のリスト
 * @param {Player} player
 */
export function AddFederationListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const countryManager = new CountryManager(playerData?.country);
    const playerCountryData = countryManager.countryData;
    const playerFederation = normalizeFederationData(playerCountryData);
    const form = new ActionFormData();
    const federationCountryIds: any = [];
    form.title({ translate: `form.federation.join.title` });
    form.button({ translate: `mc.button.close` });

    if (!isFederationActive(playerFederation)) {
        for (const { countryData, federation } of listFederationGovernments(countryDataBase)) {
            if (federation.members.includes(Number(playerData.country))) continue;
            if (federation.requests.includes(Number(playerData.country))) continue;
            federationCountryIds.push(countryData.id);
            form.button(`${federation.name}\n${countryData.name}`);
        }
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
                addFederationCountryFromListDefaultForm(player, federationCountryIds[(rs.selection ?? 0) - 1]);
                break;
            }
        }
    });
}
