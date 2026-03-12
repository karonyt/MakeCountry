import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { CompePlayerForm } from "../player/compensation.js";

function compensationExecuter(origin: any, args: any) {
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                compensationExecuter(origin, args);
            })
        })
    )
});