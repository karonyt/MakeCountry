import type { Container, ItemStack } from "@minecraft/server";

/** A capacity estimate cannot account for every native inventory rule. */
export function addItemsExactly(container: Container, items: Iterable<ItemStack>): boolean {
    let before: (ItemStack | undefined)[];
    try {
        before = Array.from({ length: container.size }, (_, slot) => container.getItem(slot));
    } catch {
        return false;
    }
    try {
        for (const item of items) {
            if (container.addItem(item)) throw new Error('partial_inventory_delivery');
        }
        return true;
    } catch {
        // Drop the inserted items before restoring the original weight/slots.
        container.clearAll();
        before.forEach((item, slot) => { if (item) container.setItem(slot, item); });
        return false;
    }
}
