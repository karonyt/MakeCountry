// 容器 (コップ・ビーカー・フラスコ) を使ったときの処理。
// 元は 1 つの switch で、ケースの終わりで次のケースへ流れる書き方になっている。
// 動きを変えないよう switch はそのまま共通にし、始まりのアイテムで担当のパックを分ける。
import { BlockPermutation, ItemStack, world, type ItemUseAfterEvent } from "@minecraft/server";
function handleContainerUse(ev: ItemUseAfterEvent) {
    const { source: player, itemStack } = ev;
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const container = player.getComponent('inventory').container;
    const block = player.getBlockFromViewDirection({ maxDistance: 5, includeLiquidBlocks: true })?.block;
    const entities = player.getEntitiesFromViewDirection({ maxDistance: 5, includeLiquidBlocks: true });
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const entity = entities.length == 0 ? undefined : entities[0].entity;
    if (itemStack) {
        switch (itemStack.typeId) {
            case 'mc:beaker': {
                if (block) {
                    if (block.typeId == 'minecraft:water') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:water_beaker'), player.location);
                        break;
                    };
                };
            };
            case 'mc:cup': {
                if (block) {
                    if (block.typeId == 'minecraft:water') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:water_cup'), player.location);
                        break;
                    };
                };
            };
            case 'mc:flask': {
                if (block) {
                    if (block.typeId == 'mc:oil_block') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:crude_oil'), player.location);
                        block.setPermutation(BlockPermutation.resolve('minecraft:air'));
                        break;
                    };
                };
                if (entity) {
                    if (entity.typeId == 'minecraft:cow') {
                        if (itemStack.amount == 1) {
                            container.setItem(player.selectedSlotIndex);
                        } else {
                            itemStack.amount--;
                            container.setItem(player.selectedSlotIndex, itemStack);
                        };
                        player.dimension.spawnItem(new ItemStack('mc:raw_milk'), player.location);
                        break;
                    };
                };
            };
        };
    };
}

/** 担当する容器 (使い始めのアイテム ID) を登録する。 */
export function registerContainerUse(itemIds: readonly string[]) {
    const ids = new Set(itemIds);
    world.afterEvents.itemUse.subscribe(ev => {
        if (!ev.itemStack || !ids.has(ev.itemStack.typeId)) return;
        handleContainerUse(ev);
    });
}
