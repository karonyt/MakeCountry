import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { transferPlayer } from "@minecraft/server-admin";

function karonNetWorkExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    transferPlayer(sender, { hostname: "play.karon.jp", port: 19132 });
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:karonnetwork',
            description: 'command.help.karonnetwork.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                karonNetWorkExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:knw',
            description: 'command.help.karonnetwork.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                karonNetWorkExecuter(origin, args);
            })
        })
    )
});