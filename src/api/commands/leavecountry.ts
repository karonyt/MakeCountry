import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "../dyp.js";
import { playerCountryLeave } from "../../lib/land.js";
import { GetAndParsePropertyData } from "../../lib/util.js";

function leaveCountryExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const playerDataBase = new DynamicProperties('player');
    const rawData = playerDataBase.get(`player_${sender.id}`);
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(rawData);

    const countryDataBase = new DynamicProperties("country");
    if (!playerData?.country) {
        sender.sendMessage({ translate: `command.leavecountry.error.no.belong.country` })
        return;
    };
    // @ts-ignore TS(2345): Argument of type 'DynamicProperties' is not assign... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                leaveCountryExecuter(origin, args)
            })
        })
    )
});
