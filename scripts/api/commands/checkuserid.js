import { CommandPermissionLevel, CustomCommandParamType, ItemStack, Player, system, world } from "@minecraft/server";

function checkUserIdExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    sender.sendMessage(`§a${sender.name}'s ID: ${sender.id}`);
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:checkuserid',
            description: 'command.help.checkuserid.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                checkUserIdExecuter(origin, args);
            })
        })
    )
});