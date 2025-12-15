import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { callMakeCountryForm } from "../../forms/form";

function MakeCountryExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const playerDataBase = new DynamicProperties('player');
    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);

    if (playerData?.country) {
        sender.sendMessage({ translate: `command.makecountry.error.belong.country` });
        return;
    };
    callMakeCountryForm(sender);
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:makecountry',
            description: 'command.help.makecountry.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                MakeCountryExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:mc',
            description: 'command.help.makecountry.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                MakeCountryExecuter(origin, args)
            })
        })
    )


    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:create',
            description: 'command.help.makecountry.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                MakeCountryExecuter(origin, args)
            })
        })
    )
});