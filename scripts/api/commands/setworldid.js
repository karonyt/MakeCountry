import { CommandPermissionLevel, CustomCommandParamType, Player, PlayerPermissionLevel, system, world } from "@minecraft/server";

function setWorldIdExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    sender.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `system.setworldid.complete`, with: [args[0]] }] });
    world.setDynamicProperty(`worldId`, args[0])
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:setworldid',
            description: 'command.help.setworldid.message',
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [{ type: CustomCommandParamType.String, name: 'worldId' }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                setWorldIdExecuter(origin, args);
            })
        })
    )
});