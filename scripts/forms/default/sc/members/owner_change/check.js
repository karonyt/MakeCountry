import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { memberSelectedShowDefaultForm } from "../member_show";
import { CountryManager } from "../../../../../api/country/country";
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../../jsdoc/country").CountryData} CountryData*/

/**
 * 所有権譲渡チェック
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData 
 */
export function playerOwnerChangeCheckDefaultForm(player, member, countryData) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const form = new ActionFormData();
    form.body({ translate: `ownerchange.check.body`, with: [member.name] });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.ownerchange` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            memberSelectedShowDefaultForm(player, member, countryData);
            return;
        };
        const countryManager = new CountryManager(playerData.country);
        switch (rs.selection) {
            case 0: {
                break;
            };
            case 1: {
                countryManager.setNewOwner(member.id, player);
                break;
            };
        };
    });
};
