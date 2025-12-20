import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import config from "../../config";
import { ShopCommonsMenu } from "../../lib/shop";
import { PlayerManager } from "../player/player";
import national_tier_level from "../../national_tier_level";

function shopExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (!config.shopValidity) {
        sender.sendMessage({ translate: `no.available.shop` });
        return;
    };
    if (national_tier_level.enabled) {
        const playerManager = new PlayerManager(sender.id);
        let lv = 0;
        if (playerManager.country) lv = playerManager.country.lv ?? 0;
        if (lv < national_tier_level.releaseAdminShop) {
            sender.sendMessage({ translate: `no.release.shop`, with: [`${national_tier_level.releaseAdminShop}`] });
            return;
        };
    };
    ShopCommonsMenu(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:shop',
            description: 'command.help.shop.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                shopExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:adminshop',
            description: 'command.help.shop.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                shopExecuter(origin, args);
            })
        })
    )
});