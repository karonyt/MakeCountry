import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { HomeManager } from "../home";

function deleteHomeExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const home = new HomeManager(sender);
    const name = args.length == 0 ? 'default' : args[0];
    home.deleteHome(name);
    return;

};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:deletehome',
            description: 'command.help.deletehome.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "HomeName", type: CustomCommandParamType.String }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                deleteHomeExecuter(origin, args);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:delhome',
            description: 'command.help.deletehome.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "HomeName", type: CustomCommandParamType.String }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                deleteHomeExecuter(origin, args);
            })
        })
    )
});