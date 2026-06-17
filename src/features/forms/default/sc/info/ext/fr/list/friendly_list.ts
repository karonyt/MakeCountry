import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { FriendlyMainDefaultForm } from "@/features/forms/default/sc/info/ext/fr/friendly_main.js";
import { AddFriendlyListDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/add/list.js";
import { FriendlyCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/fr/list/list/list.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 友好国リストフォーム
 * @param {Player} player 
 */
export function FriendlyListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const playerCountryData = countryManager.countryData;
    let FriendlyCountryIds = playerCountryData.friendly;
    const form = new ActionFormData();
    form.title({ translate: `form.friendly.list.title` });
    form.button({ translate: `form.check.friendly.send.title` });
    for (const countryId of FriendlyCountryIds) {
        const countryData = new CountryManager(countryId).countryData;
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            FriendlyMainDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //追加フォーム
                AddFriendlyListDefaultForm(player);
                break;
            };
            default: {
                //詳細表示＆選択肢
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                FriendlyCountryFromListDefaultForm(player, FriendlyCountryIds[rs.selection - 1]);
                break;
            };
        };
    });
};
