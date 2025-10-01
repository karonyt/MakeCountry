import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { ModalFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "./info";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId } from "../../../../lib/util";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * パブリックホーム設定画面
 * @param {Player} player 
 */
export function publicSpawnDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;
    const toggleValue = countryData.publicSpawn;
    const form = new ModalFormData();
    form.title({ translate: `form.setting.info.button.publicspawn` });
    form.toggle({ translate: `publicspawn.button.validity` }, { defaultValue: toggleValue });
    form.toggle({ translate: `publicspawn.button.set` });
    form.submitButton({ translate: `mc.button.update` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player);
            return;
        };
        if (CheckPermission(player, `publicHomeAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.formValues[1]) {
            const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(player));
            if (!chunkData) {
                player.sendMessage({ translate: `publichome.set.error.within.country` });
                return;
            };
            if (!chunkData?.countryId) {
                player.sendMessage({ translate: `publichome.set.error.within.country` });
                return;
            };
            if (chunkData?.countryId != playerData?.country) {
                player.sendMessage({ translate: `publichome.set.error.within.country` });
                return;
            };
            let { x, y, z } = player.location;
            let { x: rx, y: ry } = player.getRotation();
            let spawnString = `${Math.ceil(x) - 0.5}_${Math.ceil(y)}_${Math.ceil(z) - 0.5}_${Math.ceil(rx)}_${Math.ceil(ry)}_${player.dimension.id}`;
            countryData[`spawn`] = spawnString;
        };
        countryData.publicSpawn = rs.formValues[0];
        const countryDataBase = new DynamicProperties('country');
        countryDataBase.set(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        return;
    });
};

