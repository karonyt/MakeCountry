import { Player } from "@minecraft/server";

function getInventory(player: Player): any {
    return (player.getComponent("inventory") as any)?.container;
}

export function countComplexCookingIngredient(player: Player, itemId: string) {
    const inventory = getInventory(player);
    if (!inventory) return 0;
    let total = 0;
    for (let slot = 0; slot < inventory.size; slot++) {
        const item = inventory.getItem(slot);
        if (item?.typeId === itemId) total += item.amount;
    }
    return total;
}

export function hasUnreservedCookingIngredientCount(total: unknown, reserved: unknown) {
    const available = Math.max(0, Number(total) || 0);
    const requiredAtSettlement = Math.max(0, Number(reserved) || 0);
    return available > requiredAtSettlement;
}

/**
 * Base ingredients are only consumed at settlement, so optional mid-cook
 * additions may use inventory strictly above the reserved base quantity.
 */
export function hasUnreservedCookingIngredient(
    player: Player,
    itemId: string,
    reservedIngredients: Record<string, number> | undefined,
) {
    return hasUnreservedCookingIngredientCount(
        countComplexCookingIngredient(player, itemId),
        reservedIngredients?.[itemId],
    );
}

export function hasAnyUnreservedCookingIngredient(
    player: Player,
    itemIds: string[],
    reservedIngredients: Record<string, number> | undefined,
) {
    return itemIds.some((itemId) => hasUnreservedCookingIngredient(player, itemId, reservedIngredients));
}
