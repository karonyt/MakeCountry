import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { getFederationMemberIds } from "@/domain/country/relationships/federation.js";

/**
 * 連邦首都設定フォーム
 * @param {Player} player
 */
export function FederationCapitalDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const countryManager = new CountryManager(playerData?.country);
    const countryData = countryManager.countryData;
    const form = new ActionFormData();
    const lands: any = [];
    form.title({ translate: `federation.capital.set` });
    form.button({ translate: `mc.button.close` });

    for (const countryId of getFederationMemberIds(countryData)) {
        const memberCountryManager = new CountryManager(countryId);
        if (!memberCountryManager.isVaildProperty) continue;
        lands.push(memberCountryManager.countryData.id);
        form.button(`${memberCountryManager.countryData.name}\nID: ${memberCountryManager.countryData.id}`);
    }

    form.show(player).then((rs) => {
        if (rs.canceled) {
            FederationMainDefaultForm(player);
            return;
        }
        if (rs.selection === 0) return;
        countryManager.setFederationCapital(lands[(rs.selection ?? 0) - 1], player);
        FederationMainDefaultForm(player);
    });
}
