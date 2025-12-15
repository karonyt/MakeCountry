import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { playerCountryLeave } from "../../lib/land";
import { GetAndParsePropertyData } from "../../lib/util";

function leaveCountryExecuter(origin, args) {
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
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:leavecountry',
            description: 'command.help.leavecountry.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                leaveCountryExecuter(origin, args)
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:leavecountryandvillage',
            description: 'command.help.leavecountry.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                leaveCountryExecuter(origin, args)
            })
        })
    )
});
