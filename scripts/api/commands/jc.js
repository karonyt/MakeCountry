import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { callJoinTypeSelectForm } from "../../forms/form";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:joincountry',
            description: '国に参加します',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (playerData?.country) {
                    sender.sendMessage({ translate: `already.country.join` });
                    return;
                };
                callJoinTypeSelectForm(sender);

            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:jc',
            description: '国に参加します',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (playerData?.country) {
                    sender.sendMessage({ translate: `already.country.join` });
                    return;
                };
                callJoinTypeSelectForm(sender);
            })
        })
    )
});