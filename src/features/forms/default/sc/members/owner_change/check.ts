import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ActionFormData } from "@minecraft/server-ui";
import { memberSelectedShowDefaultForm } from "@/features/forms/default/sc/members/member_show.js";
import { CountryManager } from "@/domain/country/country-manager.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

/**
 * 所有権譲渡チェック
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData 
 */
export function playerOwnerChangeCheckDefaultForm(player: any, member: any, countryData: any) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
