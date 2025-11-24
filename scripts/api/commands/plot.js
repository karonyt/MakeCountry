import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { plotMainForm } from "../../lib/plot_from";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:plot',
            description: 'command.help.plot.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                plotMainForm(sender);
            })
        })
    )
});