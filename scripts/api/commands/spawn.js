import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermissionFromLocation, GetAndParsePropertyData } from "../../lib/util";
import config from "../../config";

system.beforeEvents.startup.subscribe((event) => {
    //const countryDataBaseTop = new DynamicProperties("country");
    /*const countryStr = [];
    for (const countryKey of countryDataBaseTop.idList) {
        const countryRawData = countryDataBaseTop.get(countryKey);
        const countryData = JSON.parse(countryRawData);
        countryStr.push(`${countryData.id}_${countryData.name}`);
    }*/

    //event.customCommandRegistry.registerEnum("makecountry:country", countryStr);

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:spawn',
            description: 'command.help.spawn.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "countryID", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {

                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                system.runTimeout(() => {
                    const countryDataBase = new DynamicProperties("country");

                    const rawCountryData = countryDataBase.get(`country_${args[0]}`);
                    if (!rawCountryData) return
                    const countryData = JSON.parse(rawCountryData);

                    if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
                        sender.sendMessage({ translate: "teleport.error.combattag" });
                        return;
                    }
                    if (config.invaderNoTeleportValidity && sender.getTags().find(tag => tag.startsWith("war"))) {
                        sender.sendMessage({ translate: "teleport.error.invader" });
                        return;
                    }
                    if (sender.hasTag(`mc_notp`)) return;

                    if (!countryData?.spawn || !countryData?.publicSpawn) return;

                    let [x, y, z, rx, ry, dimensionId] = countryData.spawn.split(`_`);
                    if (CheckPermissionFromLocation(sender, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
                        sender.sendMessage({ translate: `no.permission` });
                        return;
                    }

                    sender.teleport(
                        { x: Number(x), y: Number(y), z: Number(z) },
                        {
                            dimension: world.getDimension(dimensionId.replace(`minecraft:`, ``)),
                            rotation: { x: Number(rx), y: Number(ry) }
                        }
                    );
                    sender.sendMessage({ translate: `command.chome.result` });
                })
            });
        })
    );
})