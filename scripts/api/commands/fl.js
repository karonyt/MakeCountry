import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { callCountryListForm } from "../../forms/form";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:friendlylist',
            description: '友好リストを開きます',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (!playerData?.country) {
                    sender.sendMessage({ translate: 'cannnot.use.nojoin.country' });
                    return;
                };
                callCountryListForm(sender, 'fl');
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:fl',
            description: '友好リストを開きます',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                if (!playerData?.country) {
                    sender.sendMessage({ translate: 'cannnot.use.nojoin.country' });
                    return;
                };
                callCountryListForm(sender, 'fl');
            })
        })
    )
});