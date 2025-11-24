import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import config from "../../config";
import { ShopCommonsMenu } from "../../lib/shop";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:shop',
            description: 'command.help.shop.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                if (!config.shopValidity) {
                    sender.sendMessage({ translate: `no.available.shop` });
                    return;
                };
                ShopCommonsMenu(sender);
            })
        })
    )
});