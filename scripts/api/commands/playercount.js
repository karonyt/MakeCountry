import { CommandPermissionLevel, Player, system } from "@minecraft/server";

function playerCountExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };

    sender.runCommand(`scriptevent karo:playercount`)
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:playercount',
            description: 'command.help.playercount.message',
            permissionLevel: CommandPermissionLevel.Admin,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                playerCountExecuter(origin, args);
            })
        })
    )
});