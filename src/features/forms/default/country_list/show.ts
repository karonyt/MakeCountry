import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { countryListDefaultForm } from "@/features/forms/default/country_list/list.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { CheckPermissionFromLocation } from "@/shared/utils/minecraft.js";
import { describeDynamicPropertyEntry } from "@/shared/storage/dynamic-properties.js";
import config from "@/config/server.js";
/**@typedef {import("@/types/legacy/country").CountryData} CountryData*/

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
        if (countryData?.id === undefined || countryData?.id === null) {
            console.warn(`[MakeCountry CountryList] Cannot open country info: selected country data has no id | player=${player?.name ?? "unknown"}(${player?.id ?? "unknown"}) | selected=${JSON.stringify(countryData)} | type=${type ?? "all"} | query=${query} | page=${page} | filterMode=${filterMode}`);
            countryListDefaultForm(player, type, query, page, filterMode);
            return;
        }

        const countryManager = new CountryManager(countryData.id);
        if (!countryManager.isVaildProperty || !countryManager.countryData) {
            console.warn(`[MakeCountry CountryList] Cannot open country info: missing country dynamic property | player=${player?.name ?? "unknown"}(${player?.id ?? "unknown"}) | countryId=${countryData.id} | countryName=${countryData?.name ?? "unknown"} | property=${describeDynamicPropertyEntry("country", `country_${countryData.id}`)} | type=${type ?? "all"} | query=${query} | page=${page} | filterMode=${filterMode}`);
            countryListDefaultForm(player, type, query, page, filterMode);
            return;
        }
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
        const selectedCountryId = countryData?.id ?? "unknown";
        const selectedCountryName = countryData?.name ?? "unknown";
        const property = selectedCountryId === "unknown"
            ? "unknown"
            : describeDynamicPropertyEntry("country", `country_${selectedCountryId}`);
        console.warn(`[MakeCountry CountryList] Failed to open country info | player=${player?.name ?? "unknown"}(${player?.id ?? "unknown"}) | countryId=${selectedCountryId} | countryName=${selectedCountryName} | property=${property} | type=${type ?? "all"} | query=${query} | page=${page} | filterMode=${filterMode}`);
        console.warn(error);
    }
}
