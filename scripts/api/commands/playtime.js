import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { showPlayTimeStats } from "../player/playtime";

function playTimeExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    showPlayTimeStats(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:playtime',
            description: 'command.help.playtime.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                playTimeExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:pt',
            description: 'command.help.playtime.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                playTimeExecuter(origin, args);
            })
        })
    )
});