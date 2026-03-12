import { world } from "@minecraft/server";

world.afterEvents.itemUse.subscribe((ev) => {
    const { itemStack, source: player } = ev;
    switch (itemStack?.typeId) {
        case `mc:penname_before`: {
            const lore = itemStack.getLore();
            if (lore.length < 1) {
                return;
            };
            if (player.hasTag(`mcPenNameBefore${lore[0]}`)) {
                return;
            };
            player.addTag(`mcPenNameBefore${lore[0]}`);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const container = player.getComponent(`inventory`).container;
            if (itemStack.amount < 2) {
                container.setItem(player.selectedSlotIndex)
            } else {
                itemStack.amount -= 1;
                container.setItem(player.selectedSlotIndex, itemStack);
            };
            break;
        };
        case `mc:penname_after`: {
            const lore = itemStack.getLore();
            if (lore.length < 1) {
                return;
            };
            if (player.hasTag(`mcPenNameAfter${lore[0]}`)) {
                return;
            };
            player.addTag(`mcPenNameAfter${lore[0]}`);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const container = player.getComponent(`inventory`).container;
            if (itemStack.amount < 2) {
                container.setItem(player.selectedSlotIndex)
            } else {
                itemStack.amount -= 1;
                container.setItem(player.selectedSlotIndex, itemStack);
            };
            break;
        };
    };
});