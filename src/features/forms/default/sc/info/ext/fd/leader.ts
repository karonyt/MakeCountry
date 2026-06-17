import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";
import { getFederationMemberIds } from "@/domain/country/relationships/federation.js";

/**
 * 連邦代表譲渡フォーム
 * @param {Player} player
 */
export function FederationLeaderDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const countryManager = new CountryManager(playerData?.country);
    const countryData = countryManager.countryData;
    const form = new ActionFormData();
    const members: any = [];
    form.title({ translate: `federation.leader.transfer` });
    form.button({ translate: `mc.button.close` });

    for (const countryId of getFederationMemberIds(countryData)) {
        const memberCountryManager = new CountryManager(countryId);
        if (!memberCountryManager.isVaildProperty) continue;
        for (const memberId of memberCountryManager.countryData.members ?? []) {
            const rawMemberData = playerDataBase.get(`player_${memberId}`);
            if (!rawMemberData) continue;
            const memberData = JSON.parse(rawMemberData);
            members.push(memberData.id);
            form.button(`${memberData.name}\n${memberCountryManager.countryData.name}`);
        }
    }

    form.show(player).then((rs) => {
        if (rs.canceled) {
            FederationMainDefaultForm(player);
            return;
        }
        if (rs.selection === 0) return;
        countryManager.transferFederationLeader(members[(rs.selection ?? 0) - 1], player);
        FederationMainDefaultForm(player);
    });
}
