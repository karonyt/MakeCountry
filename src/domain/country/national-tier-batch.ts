type TierNeed = { item: { typeId: string; amount: number }[]; point: number };

/** Sum every intermediate tier, merging repeated materials. */
export function planNationalTierUpgrade(current: number, count: number, needs: Record<number, TierNeed>) {
    if (!Number.isSafeInteger(current) || current < 0 || !Number.isSafeInteger(count)
        || count < 1 || count > Object.keys(needs).length || !Number.isSafeInteger(current + count)) return undefined;
    const amounts = new Map<string, number>();
    let point = 0;
    for (let level = current + 1; level <= current + count; level++) {
        const need = needs[level];
        if (!need) return undefined;
        point += need.point;
        for (const item of need.item) amounts.set(item.typeId, (amounts.get(item.typeId) ?? 0) + item.amount);
    }
    return { from: current, to: current + count, point,
        item: [...amounts].map(([typeId, amount]) => ({ typeId, amount })) };
}
