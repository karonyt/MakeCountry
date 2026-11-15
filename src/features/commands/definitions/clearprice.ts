import { CommandPermissionLevel, ItemStack, Player, system } from "@minecraft/server";

function clearPriceExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const container = sender.getComponent(`inventory`).container;
    /**
     * @type {ItemStack}
     */
    const item = container.getItem(sender.selectedSlotIndex);
    if (item) {
        if (item.typeId == "mc:penname_after" || item.typeId == "mc:penname_before") {
            sender.sendMessage({ translate: 'command.error.cannot.this.item' });
            return;
        };
        let loreArray = item.getRawLore();

        loreArray = loreArray.filter((lore: any) => lore?.translate != `item.lore.price`)

        item.setLore(loreArray);
        container.setItem(sender.selectedSlotIndex, item);
    };
};

function inventoryClearPriceExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const container = sender.getComponent(`inventory`).container;
    let clearedItems = 0;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;
        if (item.typeId == "mc:penname_after" || item.typeId == "mc:penname_before") continue;

        const rawLore = item.getRawLore();
        const loreArray = rawLore.filter((lore: any) => lore?.translate != `item.lore.price`);
        if (loreArray.length == rawLore.length) continue;

        item.setLore(loreArray);
        container.setItem(slot, item);
        clearedItems++;
    };

    sender.sendMessage(`§aインベントリ内の ${clearedItems} 個のアイテムから価格を解除しました`);
};

system.beforeEvents.startup.subscribe((event) => {
    for (const name of ['makecountry:allclearprice', 'makecountry:clearallprice']) {
        event.customCommandRegistry.registerCommand(
            {
                name,
                description: 'インベントリ内のすべてのアイテムから価格を解除します',
                permissionLevel: CommandPermissionLevel.Any
            },
            // @ts-ignore TS(2345): Custom command callback arguments are supplied by Bedrock at runtime.
            ((origin, ...args) => {
                system.runTimeout(() => {
                    inventoryClearPriceExecuter(origin, args);
                })
            })
        )
    }

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:clearprice',
            description: 'command.help.clearprice.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                clearPriceExecuter(origin, args);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:delprice',
            description: 'command.help.clearprice.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                clearPriceExecuter(origin, args);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:cprice',
            description: 'command.help.clearprice.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                clearPriceExecuter(origin, args);
            })
        })
    )
});