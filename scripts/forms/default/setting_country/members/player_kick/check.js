import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { memberSelectedShowDefaultForm } from "../member_show";
import { CountryManager } from "../../../../../api/country/country";
import { settingCountryMembersDefaultForm } from "../setting_members";
/**@typedef {import("../../../../../jsdoc/country").CountryData} CountryData*/
/**@typedef {import("../../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 追放チェックホーム
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData 
 */
export function playerKickCheckDefaultForm(player, member, countryData) {
    const form = new ActionFormData();
    form.body({ translate: `kick.check.body`, with: [member.name] });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `mc.button.kick` });
    form.show(player).then(rs => {
        const countryManager = new CountryManager(countryData.id);
        if (rs.canceled) {
            memberSelectedShowDefaultForm(player, member, countryManager.countryData);
            return;
        };
        switch (rs.selection) {
            case 0: {
                break;
            };
            case 1: {
                countryManager.memberManager.kick(member.id, player);
                settingCountryMembersDefaultForm(player);
                break;
            };
        };
    });
};
