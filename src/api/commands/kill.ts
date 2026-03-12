import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import config from "../../config.js";

function selfKillExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
        return;
    }
    if (config.invaderNoTeleportValidity && sender.getTags().find((tag: any) => tag.startsWith("war"))) {
        return;
    }
    if (!config.killValidity) {
        sender.sendMessage({ translate: `command.error.kill.novalidity` });
        return;
    };
    if (sender.hasTag(`mc_notp`)) {
        return;
    };
    sender.runCommand(`kill @s`);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:selfkill',
            description: 'command.help.selfkill.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                selfKillExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:killme',
            description: 'command.help.selfkill.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                selfKillExecuter(origin, args);
            })
        })
    )
});