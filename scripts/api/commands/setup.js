import { CommandPermissionLevel, Player, PlayerPermissionLevel, system, world } from "@minecraft/server";

function setUpExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    sender.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `system.setup.complete` }] });
    sender.addTag("mc_admin");
    world.setDynamicProperty(`start2`, `true`)
    return;
};

system.beforeEFvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:setup',
            description: 'command.help.setup.message',
            permissionLevel: CommandPermissionLevel.Admin
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                setUpExecuter(origin, args);
            })
        })
    )
});