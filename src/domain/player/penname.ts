import { recordCurrentSeasonTitle } from "@/shared/integration/standalone.js";
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
            try { recordCurrentSeasonTitle(player, `mcPenNameBefore${penName}`); }
            catch { player.sendMessage("§e二つ名の取得記録を保存できませんでした。アイテムは消費していません。もう一度お試しください。"); return; }
            if (player.hasTag(`mcPenNameBefore${penName}`)) {
                return;
            };
            if (!player.addTag(`mcPenNameBefore${penName}`)) return;
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
            try { recordCurrentSeasonTitle(player, `mcPenNameAfter${penName}`); }
            catch { player.sendMessage("§e二つ名の取得記録を保存できませんでした。アイテムは消費していません。もう一度お試しください。"); return; }
            if (player.hasTag(`mcPenNameAfter${penName}`)) {
                return;
            };
            if (!player.addTag(`mcPenNameAfter${penName}`)) return;
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
