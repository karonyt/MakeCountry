import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import config from "../../config";
import { PlayerMarketMainMenu } from "../../lib/player_market";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:playermarket',
            description: 'command.help.playermarket.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                if (!config.playerMarketValidity) {
                    sender.sendMessage({ translate: `command.error.playermarket.novalidity` });
                    return;
                };
                PlayerMarketMainMenu(sender);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:pm',
            description: 'command.help.playermarket.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                if (!config.playerMarketValidity) {
                    sender.sendMessage({ translate: `command.error.playermarket.novalidity` });
                    return;
                };
                PlayerMarketMainMenu(sender);
            })
        })
    )
});