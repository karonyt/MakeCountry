import { CommandPermissionLevel, CustomCommandParamType, ItemStack, Player, system, world } from "@minecraft/server";
import config from "../../config";

function priceExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const container = sender.getComponent(`inventory`).container;
    /**
     * @type {ItemStack}
     */
    const item = container.getItem(sender.selectedSlotIndex);
    if (item) {
        if (item.typeId == "mc:penname_after" || item.typeId == "mc:penname_before") {
            return;
        };
        const price = args[0];
        if (price <= 0) {
            return;
        };
        let loreArray = item.getRawLore();

        loreArray = loreArray.filter(lore => lore?.translate != `item.lore.price`)

        loreArray.push({ translate: 'item.lore.price', with: [`${price}`, `${config.MoneyName}`] });
        item.setLore(loreArray);
        container.setItem(sender.selectedSlotIndex, item);
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:price',
            description: 'command.help.price.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: 'price', type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                priceExecuter(origin, args);
            })
        })
    )
});