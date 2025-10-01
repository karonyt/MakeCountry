import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../../../api/dyp";
import { CountryManager } from "../../../../../../../api/country/country";
import { ActionFormData } from "@minecraft/server-ui";
import { FriendlyMainDefaultForm } from "../friendly_main";
import { AddFriendlyListDefaultForm } from "./add/list";
import { FriendlyCountryFromListDefaultForm } from "./list/list";
/**@typedef {import("../../../../../../../jsdoc/player").PlayerData} PlayerData */

/**
 * 友好国リストフォーム
 * @param {Player} player 
 */
export function FriendlyListDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
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
                FriendlyCountryFromListDefaultForm(player, FriendlyCountryIds[rs.selection - 1]);
                break;
            };
        };
    });
};
