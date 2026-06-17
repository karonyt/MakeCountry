import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";

/**
 * 連邦政府作成フォーム
 * @param {Player} player
 */
export function CreateFederationDefaultForm(player: any) {
    const form = new ModalFormData();
    form.title({ translate: `form.federation.create.title` });
    form.textField({ translate: `federation.government.name` }, { translate: `input.string` });
    form.submitButton({ translate: `mc.button.create` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            FederationMainDefaultForm(player);
            return;
        }
        const playerDataBase = new DynamicProperties("player");
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
        const countryManager = new CountryManager(playerData?.country);
        countryManager.createFederation(rs.formValues?.[0], player);
        FederationMainDefaultForm(player);
    });
}
