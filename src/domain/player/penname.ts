import { world } from "@minecraft/server";

function getPenNameText(itemStack: any) {
    const lore = itemStack.getLore();
    return lore[0] ?? itemStack.nameTag?.trim();
}

world.afterEvents.itemUse.subscribe((ev) => {
    const { itemStack, source: player } = ev;
    switch (itemStack?.typeId) {
        case `mc:penname_before`: {
            const penName = getPenNameText(itemStack);
            if (!penName) {
                return;
            };
            if (player.hasTag(`mcPenNameBefore${penName}`)) {
                return;
            };
            player.addTag(`mcPenNameBefore${penName}`);
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
            const penName = getPenNameText(itemStack);
            if (!penName) {
                return;
            };
            if (player.hasTag(`mcPenNameAfter${penName}`)) {
                return;
            };
            player.addTag(`mcPenNameAfter${penName}`);
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
