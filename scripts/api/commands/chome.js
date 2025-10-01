import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermissionFromLocation, GetAndParsePropertyData } from "../../lib/util";
import config from "../../config";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:countryhome',
            description: '国のパブリックホームにテレポートします',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties("player");
                const countryDataBase = new DynamicProperties("country");

                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
                    sender.sendMessage({ translate: "teleport.error.combattag" });
                    return;
                }
                if (config.invaderNoTeleportValidity && sender.getTags().find(tag => tag.startsWith("war"))) {
                    sender.sendMessage({ translate: "teleport.error.invader" });
                    return;
                }
                if (sender.hasTag(`mc_notp`)) {
                    return;
                };
                if (!playerData?.country) {
                    sender.sendMessage({ translate: `command.chome.error.notjoin.country` });
                    return;
                };
                const countryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
                if (!countryData?.spawn || !countryData?.publicSpawn) {
                    return;
                };
                let [x, y, z, rx, ry, dimensionId] = countryData?.spawn.split(`_`);
                if (CheckPermissionFromLocation(sender, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
                    //権限がない！！
                    sender.sendMessage({ translate: `no.permission` });
                    return
                };
                //tp
                sender.teleport({ x: Number(x), y: Number(y), z: Number(z) }, { dimension: world.getDimension(`${dimensionId.replace(`minecraft:`, ``)}`), rotation: { x: Number(rx), y: Number(ry) } });
                sender.sendMessage({ translate: `command.chome.result` })
                return;
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:chome',
            description: '国のパブリックホームにテレポートします',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties("player");
                const countryDataBase = new DynamicProperties("country");

                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
                    sender.sendMessage({ translate: "teleport.error.combattag" });
                    return;
                }
                if (config.invaderNoTeleportValidity && sender.getTags().find(tag => tag.startsWith("war"))) {
                    sender.sendMessage({ translate: "teleport.error.invader" });
                    return;
                }
                if (sender.hasTag(`mc_notp`)) {
                    return;
                };
                if (!playerData?.country) {
                    sender.sendMessage({ translate: `command.chome.error.notjoin.country` });
                    return;
                };
                const countryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
                if (!countryData?.spawn || !countryData?.publicSpawn) {
                    return;
                };
                let [x, y, z, rx, ry, dimensionId] = countryData?.spawn.split(`_`);
                if (CheckPermissionFromLocation(sender, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
                    //権限がない！！
                    sender.sendMessage({ translate: `no.permission` });
                    return
                };
                //tp
                sender.teleport({ x: Number(x), y: Number(y), z: Number(z) }, { dimension: world.getDimension(`${dimensionId.replace(`minecraft:`, ``)}`), rotation: { x: Number(rx), y: Number(ry) } });
                sender.sendMessage({ translate: `command.chome.result` })
                return;
            })
        })
    )
});