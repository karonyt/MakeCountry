import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { callCountryListForm } from "../../forms/form";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:countrylist',
            description: 'command.help.countrylist.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                callCountryListForm(sender);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:cl',
            description: 'command.help.countrylist.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                callCountryListForm(sender);
            })
        })
    )
});