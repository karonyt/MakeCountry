import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";

function generalChatExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    sender.setDynamicProperty(`chatType`, `general`);
    sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `general.chat` }] } }] })
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:generalchat',
            description: 'command.help.generalchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                generalChatExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:g',
            description: 'command.help.generalchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                generalChatExecuter(origin, args)
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:gc',
            description: 'command.help.generalchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                generalChatExecuter(origin, args)
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:generalchatcommand ',
            description: 'command.help.generalchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                generalChatExecuter(origin, args)
            })
        })
    )
});