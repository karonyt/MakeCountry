import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { countryListDefaultForm } from "./list.js";
import { CountryManager } from "../../../api/country/country.js";
import { CheckPermissionFromLocation } from "../../../lib/util.js";
import config from "../../../config.js";
/**@typedef {import("../../../jsdoc/country").CountryData} CountryData*/

/**
 * 国の情報を表示（新システム対応・defaultスポーンのみ）
 * @param {Player} player 
 * @param {CountryData} countryData
 * @param {string|undefined} type 
 * @param {string} query
 * @param {number} page
 * @param {string} filterMode
 */
export function showCountryInfoDefaultForm(player: any, countryData: any, type = undefined, query = "", page = 0, filterMode = "all") {
    try {
        const countryManager = new CountryManager(countryData.id);
        countryData = countryManager.countryData;

        const showBody = countryManager.getCountryInfoRawText();
        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(showBody);

        form.button({ translate: `mc.button.close` });

        // 新システム対応: default スポーンが存在し、有効な場合のみテレポートボタン表示
        const defaultSpawn = countryData.spawn?.default;
        if (countryData?.publicSpawn && defaultSpawn?.enabled) {
            form.button({ translate: `button.publichome.tp` });
        }

        form.show(player).then(rs => {
            if (rs.canceled) {
                countryListDefaultForm(player, type, query, page, filterMode);
                return;
            }

            switch (rs.selection) {
                case 0:
                    // 閉じる
                    break;
                case 1:
                    // テレポート
                    if (player.hasTag(`mc_notp`)) return;

                    if (config.invaderNoTeleportValidity && player.getTags().find((tag: any) => tag.startsWith("war"))) {
                        player.sendMessage({ translate: "teleport.error.invader" });
                        return;
                    }

                    if (config.combatTagNoTeleportValidity && player.hasTag(`mc_combat`)) {
                        player.sendMessage({ translate: `teleport.error.combattag` });
                        return;
                    }

                    if (!defaultSpawn) return; // 存在確認
                    const [x, y, z, rx, ry, dimensionId] = defaultSpawn.pos.split("_");

                    if (CheckPermissionFromLocation(player, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
                        player.sendMessage({ translate: `no.permission` });
                        return;
                    }

                    player.teleport(
                        { x: Number(x), y: Number(y), z: Number(z) },
                        {
                            dimension: world.getDimension(dimensionId.replace(`minecraft:`, ``)),
                            rotation: { x: Number(rx), y: Number(ry) }
                        }
                    );
                    break;
            }
        });
    } catch (error) {
        console.warn(error);
    }
}
