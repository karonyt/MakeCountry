import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import config from "../../config";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:selfkill',
            description: '自身をkillします',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;
                if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
                    return;
                }
                if (config.invaderNoTeleportValidity && sender.getTags().find(tag => tag.startsWith("war"))) {
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
            })
        })
    )
});