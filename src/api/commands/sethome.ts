import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { HomeManager } from "../home.js";

function setHomeExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const home = new HomeManager(sender);
    const name = args.length == 0 ? 'default' : args[0];
    home.setHome(name);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sethome',
            description: 'command.help.sethome.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "HomeName", type: CustomCommandParamType.String }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                setHomeExecuter(origin, args);
            })
        })
    )
});