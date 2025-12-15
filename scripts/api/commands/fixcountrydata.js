import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";

function fixCountryDataExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };

    sender.runCommand(`scriptevent karo:fixcountry`)
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:fixcountrydata',
            description: 'command.help.fixcountrydata.message',
            permissionLevel: CommandPermissionLevel.Admin,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                fixCountryDataExecuter(origin, args);
            })
        })
    );
});