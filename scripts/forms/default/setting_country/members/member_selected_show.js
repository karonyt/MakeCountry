import { Player } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "../../../../lib/util";
import { settingCountryMembersDefaultForm } from "./setting_country_members";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { playerKickCheckDefaultForm } from "./player_kick/check";
import { playerRoleChangeDefaultForm } from "./player_role_change/change";
import { playerOwnerChangeCheckDefaultForm } from "./owner_change/check";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../../jsdoc/country").CountryData} CountryData*/

/**
 * 選んだメンバーを表示
 * @param {Player} player 
 * @param {PlayerData} member 
 * @param {CountryData} countryData
 */
export function memberSelectedShowDefaultForm(player, member, countryData) {
    /**
     * @type {RawMessage}
     */
    const bodyData = [
        { translate: `` }
    ];
    const form = new ActionFormData();
    form.title({ translate: `form.memberselectedshow.title`, with: [member.name] });
    form.body({ rawtext: bodyData });
    form.button({ translate: `mc.button.close` });
    if (!CheckPermission(player, `kick`)) form.button({ translate: `form.memberselectedshow.button.kick` });
    if (!CheckPermission(player, `admin`)) form.button({ translate: `form.memberselectedshow.button.role` });
    if (!CheckPermission(player, `owner`)) form.button({ translate: `form.memberselectedshow.button.owner` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryMembersDefaultForm(player);
            return;
        };
        const playerDataBase = new DynamicProperties('player');
        switch (rs.selection) {
            case 0: {
                break;
            };
            case 1: {
                if (player.id === member.id) {
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.same` }] });
                    return;
                };

                const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
                const countryManager = new CountryManager(countryData.id);
                countryManager.reload();
                countryData = countryManager.countryData;
                if (member.id === countryData.owner) {
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.owner` }] });
                    return;
                };
                /*if (player.id != countryData.owner && !CheckPermission(world.getPlayers().find(p => p.id == member.id), `admin`)) {
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.kick.error.admin` }] });
                };*/
                playerKickCheckDefaultForm(player, member, countryData);
                break;
            };
            case 2: {
                playerRoleChangeDefaultForm(player, member, countryData);
                break;
            };
            case 3: {
                //オーナー権限の譲渡
                if (player.id === member.id) {
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `form.owner.error.same` }] });
                    return;
                };
                playerOwnerChangeCheckDefaultForm(player, member, countryData);
                break;
            };
        };
    });
};