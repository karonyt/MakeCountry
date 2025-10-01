import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { playerCountryLeave } from "../../lib/land";
import { GetAndParsePropertyData } from "../../lib/util";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:leavecountry',
            description: '国から抜けます',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                const countryDataBase = new DynamicProperties("country");
                if (!playerData?.country) {
                    sender.sendMessage({ translate: `command.leavecountry.error.no.belong.country` })
                    return;
                };
                const countryData = GetAndParsePropertyData(`country_${playerData?.country}`, countryDataBase);
                if (playerData.id === countryData?.owner) {
                    sender.sendMessage({ translate: `command.leavecountry.error.your.owner` })
                    return;
                };
                playerCountryLeave(sender);
            })
        })
    )
});
