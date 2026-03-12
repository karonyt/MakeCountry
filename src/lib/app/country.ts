import { Player, system, world } from "@minecraft/server";
import { ActionForm } from "../form_class.js";
import { SmartPhoneHomeScreen } from "../smartphone.js";
import { CheckPermissionFromLocation, GetAndParsePropertyData } from "../util.js";
import { DynamicProperties } from "../../api/dyp.js";
import { FormCancelationReason } from "@minecraft/server-ui";
import { CountryManager } from "../../api/country/country.js";
const ActionFormData = ActionForm;

/**
 * @type {DynamicProperties}
 */
let countryDataBase: any;

world.afterEvents.worldLoad.subscribe(() => {
    countryDataBase = new DynamicProperties("country")
})

/**
 * @param {Player} player 
 */
export function CountryApp(player: any, al = false) {
    try {
        const form = new ActionFormData();
        form.title({ translate: `form.countrylist.title` });
        let countryIds
        if (!al) countryIds = countryDataBase.idList;
        if (al) countryIds = GetAndParsePropertyData('country_' + GetAndParsePropertyData('player_' + player.id).country).alliance.map((alliance: any) => `country_${alliance}`);
        let countries: any = [];
        countryIds.forEach((id: any) => {
            countries[countries.length] = GetAndParsePropertyData(id);
        });
        if (countries.length === 0) {
            form.body({ translate: `no.countries.world` });
            form.button({ translate: `mc.button.close` });
        };
        // @ts-ignore TS(7006): Parameter 'country' implicitly has an 'any' type.
        countries.forEach(country => {
            form.button(`${country?.name} \n§rID: ${country?.id}`);
        });
        form.show(player).then((rs: any) => {
            if (rs.canceled) {
                if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                    system.runTimeout(() => {
                        CountryApp(player, al);
                        return;
                    }, 10);
                    return;
                };
                SmartPhoneHomeScreen(player);
                return;
            };
            if (countries.length === 0) {
                return;
            };
            showCountryInfo(player, countries[rs.selection], al);
        });
    } catch (error) {
        console.warn(error);
    };
};

/**
 * 国の情報を表示
 * @param {Player} player 
 * @param {any} countryData 
 */
function showCountryInfo(player: any, countryData: any, al = false) {
    try {
        const defaultSpawn = countryData?.spawn?.default;

        const countryManager = new CountryManager(countryData.id);
        countryData = countryManager.countryData;

        const form = new ActionFormData();
        form.title(countryData.name);
        form.body(countryManager.getCountryInfoRawText());

        form.button({ translate: `mc.button.close` });

        if (countryData.publicSpawn && defaultSpawn?.enabled) {
            form.button({ translate: `button.publichome.tp` });
        }

        form.show(player).then((rs: any) => {
            if (rs.canceled) {
                CountryApp(player, al);
                return;
            }

            if (rs.selection === 1) {

                if (!defaultSpawn) {
                    player.sendMessage({ translate: "command.spawn.error.spawn_not_found" });
                    return;
                }

                if (!defaultSpawn.enabled) {
                    player.sendMessage({ translate: "command.spawn.error.spawn_disabled" });
                    return;
                }

                const [x, y, z, rx, ry, dimensionId] = defaultSpawn.pos.split("_");

                if (
                    CheckPermissionFromLocation(
                        player,
                        Number(x),
                        Number(z),
                        dimensionId,
                        "publicHomeUse"
                    )
                ) {
                    player.sendMessage({ translate: "no.permission" });
                    return;
                }

                player.teleport(
                    { x: Number(x), y: Number(y), z: Number(z) },
                    {
                        dimension: world.getDimension(dimensionId.replace("minecraft:", "")),
                        rotation: { x: Number(rx), y: Number(ry) }
                    }
                );
            }
        });
    } catch (e) {
        console.warn(e);
    }
}
