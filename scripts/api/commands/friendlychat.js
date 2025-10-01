import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:friendlychat',
            description: 'フレンドリーチャット(友好国とのチャット)に切り替えます',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                sender.setDynamicProperty(`chatType`, `friendly`);
                sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `friendly.chat` }] } }] })
            })
        })
    )
});
system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:fc',
            description: 'フレンドリーチャット(友好国とのチャット)に切り替えます',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                sender.setDynamicProperty(`chatType`, `friendly`);
                sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `friendly.chat` }] } }] })
            })
        })
    )
});