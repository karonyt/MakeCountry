export const ARTISAN_RANK_ORDER = [
    "F",
    "E",
    "D",
    "C",
    "B",
    "A",
    "S",
    "SS",
    "SSS",
    "LEGENDARY",
    "EXTRA",
    "IMPOSSIBLE",
    "KARON",
] as const;

export type ArtisanRank = typeof ARTISAN_RANK_ORDER[number];

export type RecipeMasteryProfile = {
    levelAboveRequirement: number;
    maxRank: ArtisanRank;
    nextRank?: ArtisanRank;
    levelsToNext?: number;
};

const MASTERY_THRESHOLDS: ReadonlyArray<{ surplus: number; rank: ArtisanRank }> = [
    { surplus: 0, rank: "E" },
    { surplus: 3, rank: "D" },
    { surplus: 7, rank: "C" },
    { surplus: 12, rank: "B" },
    { surplus: 20, rank: "A" },
    { surplus: 35, rank: "S" },
    { surplus: 55, rank: "SS" },
    { surplus: 80, rank: "SSS" },
    { surplus: 110, rank: "LEGENDARY" },
    { surplus: 150, rank: "EXTRA" },
    { surplus: 200, rank: "IMPOSSIBLE" },
    { surplus: 260, rank: "KARON" },
];

export function normalizeArtisanRank(rank: string): string {
    return rank === "LEGEND" ? "LEGENDARY" : rank;
}

/**
 * Recipe-specific proficiency. Unlocking a recipe only grants an E ceiling;
 * repeated profession levels after that unlock progressively raise its cap.
 */
export function getRecipeMasteryProfile(level: unknown, requiredLevel: unknown): RecipeMasteryProfile {
    const professionLevel = Math.max(0, Math.floor(Number(level) || 0));
    const requirement = Math.max(0, Math.floor(Number(requiredLevel) || 0));
    const surplus = professionLevel - requirement;

    if (surplus < 0) {
        return {
            levelAboveRequirement: surplus,
            maxRank: "F",
            nextRank: "E",
            levelsToNext: Math.abs(surplus),
        };
    }

    let currentIndex = 0;
    for (let index = 0; index < MASTERY_THRESHOLDS.length; index++) {
        if (surplus >= MASTERY_THRESHOLDS[index].surplus) currentIndex = index;
    }

    const current = MASTERY_THRESHOLDS[currentIndex];
    const next = MASTERY_THRESHOLDS[currentIndex + 1];
    return {
        levelAboveRequirement: surplus,
        maxRank: current.rank,
        nextRank: next?.rank,
        levelsToNext: next ? next.surplus - surplus : undefined,
    };
}

export function capRankByRecipeMastery(
    rank: string,
    level: unknown,
    requiredLevel: unknown,
): string {
    const normalized = normalizeArtisanRank(rank);
    const currentIndex = ARTISAN_RANK_ORDER.indexOf(normalized as ArtisanRank);
    if (currentIndex < 0) return rank;

    const maxRank = getRecipeMasteryProfile(level, requiredLevel).maxRank;
    const maxIndex = ARTISAN_RANK_ORDER.indexOf(maxRank);
    return currentIndex > maxIndex ? maxRank : normalized;
}

