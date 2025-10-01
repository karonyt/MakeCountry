import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { countryListDefaultForm } from "./list";
import { CountryManager } from "../../../api/country/country";
import { CheckPermissionFromLocation } from "../../../lib/util";
import config from "../../../config";
/**@typedef {import("../../../jsdoc/country").CountryData} CountryData*/

/**
 * 国の情報を表示
 * @param {Player} player 
 * @param {CountryData} countryData
 * @param {string|undefined} type 
 */
export function showCountryInfoDefaultForm(player, countryData, type = undefined) {
    try {
        const countryManager = new CountryManager(countryData.id);
        countryData = countryManager.countryData;
        const showBody = countryManager.getCountryInfoRawText();
        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);
        form.button({ translate: `mc.button.close` });
        if (countryData?.publicSpawn && countryData?.spawn) {
            form.button({ translate: `button.publichome.tp` });
        };
        form.show(player).then(rs => {
            if (rs.canceled) {
                countryListDefaultForm(player, type);
                return;
            };
            switch (rs.selection) {
                case 0: {
                    //閉じる
                    break;
                };
                case 1: {
                    if (player.hasTag(`mc_notp`)) {
                        return;
                    };
                    if (config.invaderNoTeleportValidity && player.getTags().find(tag => tag.startsWith("war"))) {
                        player.sendMessage({ translate: "teleport.error.invader" });
                        return;
                    }
                    if (config.combatTagNoTeleportValidity) {
                        if (player.hasTag(`mc_combat`)) {
                            player.sendMessage({ translate: `teleport.error.combattag` });
                            return;
                        };
                    };
                    /**
                     * @type {Array<string>}
                     */
                    let [x, y, z, rx, ry, dimensionId] = countryData?.spawn.split(`_`);
                    if (CheckPermissionFromLocation(player, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
                        player.sendMessage({ translate: `no.permission` });
                        return
                    };
                    //tp
                    player.teleport({ x: Number(x), y: Number(y), z: Number(z) }, { dimension: world.getDimension(`${dimensionId.replace(`minecraft:`, ``)}`), rotation: { x: Number(rx), y: Number(ry) } });
                    break;
                };
            };
        });
    } catch (error) {
        console.warn(error);
    };
};