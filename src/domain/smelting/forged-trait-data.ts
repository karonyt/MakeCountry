export type ForgedMaterial = "aluminum" | "vanadium" | "titanium" | "tungsten" | "mithril" | "orichalcum";

export const FORGED_TRAIT_TRANSLATION_KEYS: Readonly<Record<ForgedMaterial, string>> = {
    aluminum: "smelting.trait.aluminum",
    vanadium: "smelting.trait.vanadium",
    titanium: "smelting.trait.titanium",
    tungsten: "smelting.trait.tungsten",
    mithril: "smelting.trait.mithril",
    orichalcum: "smelting.trait.orichalcum",
};

const COMBAT_TOOL_SUFFIXES = ["_sword", "_axe"] as const;

export function getForgedMaterial(itemId: string): ForgedMaterial | undefined {
    if (!itemId.startsWith("mc:") || !COMBAT_TOOL_SUFFIXES.some((suffix) => itemId.endsWith(suffix))) {
        return undefined;
    }

    const material = itemId.slice(3).split("_", 1)[0] as ForgedMaterial;
    return material in FORGED_TRAIT_TRANSLATION_KEYS ? material : undefined;
}

export function getForgedTraitTranslationKey(itemId: string): string | undefined {
    const material = getForgedMaterial(itemId);
    return material ? FORGED_TRAIT_TRANSLATION_KEYS[material] : undefined;
}

export function getForgedTraitProcChance(quality: unknown): number {
    const normalized = Number.isFinite(Number(quality))
        ? Math.max(0, Math.min(12, Math.trunc(Number(quality))))
        : 0;
    return Math.min(0.34, 0.07 + normalized * 0.0225);
}

export function getForgedTraitCooldownTicks(quality: unknown): number {
    const normalized = Number.isFinite(Number(quality))
        ? Math.max(0, Math.min(12, Math.trunc(Number(quality))))
        : 0;
    return Math.max(32, 72 - normalized * 2);
}
