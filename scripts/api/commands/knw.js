import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermissionFromLocation, GetAndParsePropertyData } from "../../lib/util";
import { transferPlayer } from "@minecraft/server-admin";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:karonnetwork',
            description: 'KaronNetWorkのサーバーに転送',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                transferPlayer(sender, { hostname: "play.karon.jp", port: 19132 })
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:knw',
            description: 'KaronNetWorkのサーバーに転送',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                transferPlayer(sender, { hostname: "play.karon.jp", port: 19132 })
            })
        })
    )
});