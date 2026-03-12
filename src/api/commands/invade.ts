import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp.js";
import { Invade } from "../../lib/war.js";
import { CheckPermission } from "../../lib/util.js";
import config from "../../config.js";

function invadeExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const playerDataBase = new DynamicProperties("player");

    const rawData = playerDataBase.get(`player_${sender.id}`);
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(rawData);

    if (!config.invadeValidity) {
        sender.sendMessage({ translate: `command.error.invade.novalidity` });
        return;
    };
    if (!playerData?.country) {
        sender.sendMessage({ translate: `command.sellchunk.error.notjoin.country` });
        return;
    };
    const cancel = CheckPermission(sender, `warAdmin`);
    if (cancel) {
        sender.sendMessage({ translate: `command.error.permission` });
        return;
    };
    Invade(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:invade',
            description: 'command.help.invade.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                invadeExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:startinvasion',
            description: 'command.help.invade.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                invadeExecuter(origin, args);
            })
        })
    )
});