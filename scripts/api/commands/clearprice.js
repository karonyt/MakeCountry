import { CommandPermissionLevel, ItemStack, Player, system } from "@minecraft/server";

function clearPriceExecuter(origin, args) {
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

        loreArray = loreArray.filter(lore => lore?.translate != `item.lore.price`)

        item.setLore(loreArray);
        container.setItem(sender.selectedSlotIndex, item);
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:clearprice',
            description: 'command.help.clearprice.message',
            permissionLevel: CommandPermissionLevel.Any
        },
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
        ((origin, ...args) => {
            system.runTimeout(() => {
                clearPriceExecuter(origin, args);
            })
        })
    )
});