import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { ActionFormData } from "@minecraft/server-ui";
import { settingCountryDefaultForm } from "../setting_country";
import { CountryManager } from "../../../../api/country/country";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 国を消す前の確認
 * @param {Player} player 
 */
export function countryDeleteCheckDefaultForm(player) {
    try {
        const playerDataBase = new DynamicProperties('player');
        /**
         * @type {PlayerData}
         */
        const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
        const form = new ActionFormData();
        form.title({ translate: `form.dismantle.check` });
        form.body({ rawtext: [{ translate: `mc.warning` }, { text: `\n§r` }, { translate: `form.dismantle.body` }] });
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.dismantle` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                settingCountryDefaultForm(player);
                return;
            };
            switch (rs.selection) {
                case 0: {
                    break;
                };
                case 1: {
                    const countryManager = new CountryManager(playerData.country);
                    countryManager.delete();
                    player.sendMessage({ translate: `form.dismantle.complete` })
                    break;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};
