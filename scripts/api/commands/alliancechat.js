import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "../dyp";

function allianceChatExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const playerDataBase = new DynamicProperties('player');
    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);

    if (!playerData?.country || playerData.country < 1) {
        sender.sendMessage({ rawtext: [{ rawtext: `cannnot.use.nojoin.country` }] })
        return;
    };
    sender.setDynamicProperty(`chatType`, `alliance`);
    sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `alliance.chat` }] } }] })
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:alliancechat',
            description: 'command.help.alliancechat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                allianceChatExecuter(origin, args)
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:ac',
            description: 'command.help.alliancechat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                allianceChatExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:inalliancecountrychatcommand',
            description: 'command.help.alliancechat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                allianceChatExecuter(origin, args);
            })
        })
    )
});