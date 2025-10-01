import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:itemid',
            description: '手持ちのアイテムのIDを調べます',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const container = sender.getComponent(`inventory`).container;
                const item = container.getItem(sender.selectedSlotIndex);
                if (item) {
                    sender.sendMessage(`§aID: ${item.typeId}`)
                };
            })
        })
    )
});