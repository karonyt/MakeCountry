import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:setup',
            description: 'セットアップします',
            permissionLevel: CommandPermissionLevel.Admin
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                if (!sender.isOp()) {
                    this.sendMessage({ translate: `command.permission.error` });
                    return;
                }
                sender.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `system.setup.complete` }] });
                sender.addTag("mc_admin");
                world.setDynamicProperty(`start2`, `true`)
                return;
            })
        })
    )
});