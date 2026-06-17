import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { HostilityCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/hos/list/list/list.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";

/**
 * 講和申請送信チェックフォーム
 * @param {Player} player 
 * @param {number} countryId 
 */
export function checkApplicationForPeaceSendDefaultForm(player: any, countryId: any) {
    const form = new ActionFormData();
    form.title({ translate: `form.check.application.send.title` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.send` });
    form.show(player).then((rs) => {
        if (CheckPermission(player, `hostilityAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            HostilityCountryFromListDefaultForm(player, countryId);
            return;
        };
        switch (rs.selection) {
            case 0: {
                return;
            };
            case 1: {
                const playerDB = new DynamicProperties('player');
                const rawPlayerData = playerDB.get(`player_${player.id}`);
                if (!rawPlayerData) return;
                const playerData = JSON.parse(rawPlayerData);
                if (!playerData.country || playerData.country == 0) return;
                const countryManager = new CountryManager(playerData.country);
                countryManager.sendApplicationRequest(countryId, player);
                return;
            };
        };
    });
};