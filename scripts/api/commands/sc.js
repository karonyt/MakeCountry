import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { callSettingCountryForm } from "../../forms/form";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:settingcountry',
            description: '国の設定メニューを開きます',
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
                    sender.sendMessage({ translate: `command.settingcountry.error.nobelong.country` });
                    return;
                };
                callSettingCountryForm(sender);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sc',
            description: '国の設定メニューを開きます',
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
                    sender.sendMessage({ translate: `command.settingcountry.error.nobelong.country` });
                    return;
                };
                callSettingCountryForm(sender);
            })
        })
    )
});