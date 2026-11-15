export const NON_STACKABLE_SMITHING_BATCH_LIMIT = 3;

/**
 * Stackable forge results retain their normal stack limit. Tools, backpacks,
 * and other non-stackable forge results can be produced in small batches.
 */
export function getSmithingQuantityLimit(maxStackSize: unknown): number {
    const stackLimit = Number(maxStackSize);
    if (!Number.isInteger(stackLimit) || stackLimit < 1) return 1;

    return stackLimit === 1
        ? NON_STACKABLE_SMITHING_BATCH_LIMIT
        : stackLimit;
}
