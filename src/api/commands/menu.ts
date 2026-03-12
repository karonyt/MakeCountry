import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { callPlayerMainMenuForm } from "../../forms/form.js";

function menuExecuter(origin: any, args: any) {
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                menuExecuter(origin, args);
            })
        })
    )
});