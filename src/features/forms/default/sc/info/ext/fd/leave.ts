import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";

/**
 * 連邦脱退確認フォーム
 * @param {Player} player
 */
export function checkFederationLeaveDefaultForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: `federation.member.leave` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `federation.member.leave` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            FederationMainDefaultForm(player);
            return;
        }
        if (rs.selection !== 1) return;
        const playerDataBase = new DynamicProperties("player");
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
        const countryManager = new CountryManager(playerData?.country);
        countryManager.leaveFederation(player);
        FederationMainDefaultForm(player);
    });
}
