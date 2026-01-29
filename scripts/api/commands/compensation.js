import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { CompePlayerForm } from "../player/compensation";

function compensationExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    CompePlayerForm(sender);
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:compensation',
            description: 'command.help.compensation.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                compensationExecuter(origin, args);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:compe',
            description: 'command.help.compensation.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                compensationExecuter(origin, args);
            })
        })
    )
});