import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";

function deleteCountryExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };

    sender.runCommand(`scriptevent karo:deletecountry ${args[0]}`)
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:deletecountry',
            description: 'command.help.deletecountry.message',
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [{ name: "CountryID", type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                deleteCountryExecuter(origin, args);
            })
        })
    )
});