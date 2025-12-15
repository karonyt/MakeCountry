import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { callPlayerMainMenuForm } from "../../forms/form";

function menuExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    callPlayerMainMenuForm(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:menu',
            description: 'command.help.menu.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                menuExecuter(origin, args);
            })
        })
    )
});