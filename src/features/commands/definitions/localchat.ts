import { CommandPermissionLevel, Player, system } from "@minecraft/server";

function localChatExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    sender.setDynamicProperty(`chatType`, `local`);
    sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `local.chat` }] } }] });
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:localchat',
            description: 'command.help.localchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                localChatExecuter(origin, args);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:lc',
            description: 'command.help.localchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                localChatExecuter(origin, args)
            })
        })
    )
});