import { ItemStack } from "@minecraft/server";

export function resolveRecipeResult(result: any) {
    if (typeof result === "string") {
        return { id: result, count: 1 };
    }

    return {
        id: result.id,
        count: result.count ?? 1
    };
}

export function createResultStacks(id: any, count: any) {
    const stacks = [];

    while (count > 0) {
        const stack = new ItemStack(id);
        const stackSize = Math.min(stack.maxAmount, count);
        stack.amount = stackSize;
        stacks.push(stack);
        count -= stackSize;
    }

    return stacks;
}