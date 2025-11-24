import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:countrychat',
            description: 'command.help.countrychat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (!playerData?.country || playerData.country < 1) {
                    sender.sendMessage({ rawtext: [{ rawtext: `cannnot.use.nojoin.country` }] })
                    return;
                };
                sender.setDynamicProperty(`chatType`, `country`);
                sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `country.chat` }] } }] })
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:cchat',
            description: 'command.help.countrychat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (!playerData?.country || playerData.country < 1) {
                    sender.sendMessage({ rawtext: [{ rawtext: `cannnot.use.nojoin.country` }] })
                    return;
                };
                sender.setDynamicProperty(`chatType`, `country`);
                sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `country.chat` }] } }] })
            })
        })
    )
});