import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";

function updateRankExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };

    sender.runCommand(`scriptevent karo:updaterank`);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:updaterank',
            description: 'command.help.updaterank.message',
            permissionLevel: CommandPermissionLevel.GameDirectors,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                updateRankExecuter(origin, args);
            })
        })
    )
});