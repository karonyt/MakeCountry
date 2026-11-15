import { ItemStack } from "@minecraft/server";

/** Exclude data that the market record cannot faithfully restore. */
export function supportsMarketItem(item: ItemStack): boolean {
    if (item.getDynamicPropertyIds().length || item.keepOnDeath || item.lockMode !== "none") return false;
    if (item.getCanDestroy().length || item.getCanPlaceOn().length) return false;
    if (["enchantable", "durability", "potion", "inventory", "book", "dyeable"]
        .some(component => item.getComponent(component as any))) return false;
    // Native contents/variants are not all exposed as Script API components.
    return !/(?:shulker_box|bundle|backpack|potion|(?:^|:)\w*map$|banner|firework|(?:writable|written)_book|goat_horn|decorated_pot|suspicious_stew|bee_nest|beehive|tropical_fish_bucket|axolotl_bucket)/.test(item.typeId);
}

export function sameMarketItem(current: ItemStack | undefined, shown: ItemStack): boolean {
    return !!current && supportsMarketItem(current) && current.typeId === shown.typeId
        && current.amount === shown.amount && current.nameTag === shown.nameTag
        && JSON.stringify(current.getRawLore()) === JSON.stringify(shown.getRawLore());
}
