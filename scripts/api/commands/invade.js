import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { Invade } from "../../lib/war";
import { CheckPermission } from "../../lib/util";
import config from "../../config";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:invade',
            description: 'command.help.invade.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties("player");

                const rawData = playerDataBase.get(`player_${sender.id}`);
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
            })
        })
    )
});