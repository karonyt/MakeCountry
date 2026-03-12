import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import config from "../../config.js";
import { PlayerMarketMainMenu } from "../../lib/player_market.js";

function playerMarketExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!config.playerMarketValidity) {
        sender.sendMessage({ translate: `command.error.playermarket.novalidity` });
        return;
    };
    PlayerMarketMainMenu(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:playermarket',
            description: 'command.help.playermarket.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                playerMarketExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:pm',
            description: 'command.help.playermarket.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                playerMarketExecuter(origin, args);
            })
        })
    )
});