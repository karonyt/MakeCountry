export function getFertilizerGrowthSteps(quality: unknown): number {
    const normalized = Number.isFinite(Number(quality))
        ? Math.max(0, Math.min(12, Math.trunc(Number(quality))))
        : 0;
    return 1 + Number(normalized >= 6) + Number(normalized >= 10);
}

export function advanceFertilizedGrowth(current: number, maximum: number, quality: unknown): number {
    return Math.min(maximum, current + getFertilizerGrowthSteps(quality));
}

export function getFertilizerSpec(itemId: string, quality: unknown) {
    const steps = getFertilizerGrowthSteps(quality);
    switch (itemId) {
        case 'mc:ammonium_sulfate': return { radius: 0, steps };
        case 'mc:phosphate_fertilizer': return { radius: 0, steps: Math.min(2, steps) };
        case 'mc:potassium_fertilizer': return { radius: 0, steps: 1 };
        case 'mc:compound_fertilizer': return { radius: 1, steps: steps >= 3 ? 2 : 1 };
        default: return undefined;
    }
}
