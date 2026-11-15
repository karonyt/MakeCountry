import { CommandPermissionLevel, CustomCommandParamType, ItemStack, Player, system, world } from "@minecraft/server";
import config from "@/config/server.js";

function priceExecuter(origin: any, args: any) {
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
        const price = Math.floor((Number(args[0]) || 0) * 100) / 100;
        if (price <= 0 || 1000000000000 < price) {
            sender.sendMessage({ translate: 'command.number.limit.range', with: ['1', '1,000,000,000,000'] });
            return;
        };
        let loreArray = item.getRawLore();

        loreArray = loreArray.filter((lore: any) => lore?.translate != `item.lore.price`)

        loreArray.push({ translate: 'item.lore.price', with: [`${price}`, `${config.MoneyName}`] });
        item.setLore(loreArray);
        container.setItem(sender.selectedSlotIndex, item);
    };
};

function inventoryPriceExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const price = Math.floor((Number(args[0]) || 0) * 100) / 100;

    if (price <= 0 || 1000000000000 < price) {
        sender.sendMessage({ translate: 'command.number.limit.range', with: ['1', '1,000,000,000,000'] });
        return;
    };

    const container = sender.getComponent(`inventory`).container;
    let updatedItems = 0;
    let skippedItems = 0;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item) continue;

        if (item.typeId == "mc:penname_after" || item.typeId == "mc:penname_before") {
            skippedItems++;
            continue;
        };

        const loreArray = item.getRawLore().filter((lore: any) => lore?.translate != `item.lore.price`);
        loreArray.push({ translate: 'item.lore.price', with: [`${price}`, `${config.MoneyName}`] });
        item.setLore(loreArray);
        container.setItem(slot, item);
        updatedItems++;
    };

    sender.sendMessage({
        translate: 'command.allprice.success',
        with: [`${updatedItems}`, `${price}`, `${config.MoneyName}`, `${skippedItems}`]
    });
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:price',
            description: 'command.help.price.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: 'price', type: CustomCommandParamType.Float }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                priceExecuter(origin, args);
            })
        })
    )

    for (const name of ['makecountry:allprice', 'makecountry:inventoryprice']) {
        event.customCommandRegistry.registerCommand(
            {
                name,
                description: 'command.help.allprice.message',
                permissionLevel: CommandPermissionLevel.Any,
                mandatoryParameters: [{ name: 'price', type: CustomCommandParamType.Float }]
            },
            // @ts-ignore TS(2345): Custom command callback arguments are supplied by Bedrock at runtime.
            ((origin, ...args) => {
                system.runTimeout(() => {
                    inventoryPriceExecuter(origin, args);
                })
            })
        )
    }
});
