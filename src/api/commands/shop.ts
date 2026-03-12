import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import config from "../../config.js";
import { ShopCommonsMenu } from "../../lib/shop.js";

function shopExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (!config.shopValidity) {
        sender.sendMessage({ translate: `no.available.shop` });
        return;
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                shopExecuter(origin, args);
            })
        })
    )
});