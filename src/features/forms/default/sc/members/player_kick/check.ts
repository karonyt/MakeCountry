import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { memberSelectedShowDefaultForm } from "@/features/forms/default/sc/members/member_show.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { settingCountryMembersDefaultForm } from "@/features/forms/default/sc/members/setting_members.js";
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * 追放チェックホーム
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData 
 */
export function playerKickCheckDefaultForm(player: any, member: any, countryData: any) {
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
