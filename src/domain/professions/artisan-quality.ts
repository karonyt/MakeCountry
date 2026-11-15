export const ARTISAN_RANK_QUALITY = {
    F: 0,
    E: 1,
    D: 2,
    C: 3,
    B: 4,
    A: 5,
    S: 6,
    SS: 7,
    SSS: 8,
    LEGENDARY: 9,
    MASTERWORK: 10,
    MYTHICAL: 11,
    KARON: 12,
} as const;

export type ArtisanRank = keyof typeof ARTISAN_RANK_QUALITY;

const RANK_ALIASES: Readonly<Record<string, ArtisanRank>> = {
    IMPOSSIBLE: "MYTHICAL",
    EXTRA: "MASTERWORK",
    LEGEND: "LEGENDARY",
};

const RANK_TOKENS = [
    "IMPOSSIBLE",
    "MASTERWORK",
    "LEGENDARY",
    "MYTHICAL",
    "KARON",
    "LEGEND",
    "EXTRA",
    "SSS",
    "SS",
    "S",
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
] as const;

const QUALITY_HINT = /(?:quality|purity|rank|品質|純度|품질|순도|品质|纯度)/i;

function normalizeRankToken(value: unknown, allowEmbedded = false): ArtisanRank | undefined {
    if (typeof value !== "string") return undefined;

    const upper = value
        .replace(/\u00a7[0-9a-fk-or]/gi, "")
        .trim()
        .toUpperCase();

    if (upper in ARTISAN_RANK_QUALITY) return upper as ArtisanRank;
    if (upper in RANK_ALIASES) return RANK_ALIASES[upper];

    if (!allowEmbedded) return undefined;

    for (const token of RANK_TOKENS) {
        const match = upper.match(new RegExp(`(?:^|[^A-Z])${token}(?:$|[^A-Z])`));
        if (!match) continue;
        return RANK_ALIASES[token] ?? token as ArtisanRank;
    }

    return undefined;
}

function findRank(value: unknown, visited: Set<object>, rankContext = false): ArtisanRank | undefined {
    if (typeof value === "string") {
        return normalizeRankToken(value, rankContext || QUALITY_HINT.test(value));
    }
    const direct = normalizeRankToken(value, rankContext);
    if (direct) return direct;
    if (!value || typeof value !== "object") return undefined;
    if (visited.has(value)) return undefined;
    visited.add(value);

    if (Array.isArray(value)) {
        for (const entry of value) {
            const rank = findRank(entry, visited, rankContext);
            if (rank) return rank;
        }
        return undefined;
    }

    const message = value as Record<string, unknown>;
    // Ranks are stored in the `with` argument of a translated quality/purity
    // line. Only enter rank context for those keys, otherwise normal prose such
    // as "A fine tool" would be mistaken for the A rank.
    const translate = typeof message.translate === "string" ? message.translate : "";
    const isQualityLine = /(?:quality|purity|rank)/i.test(translate);
    if (isQualityLine && message.with !== undefined) {
        const rank = findRank(message.with, visited, true);
        if (rank) return rank;
    }
    if (message.rawtext !== undefined) {
        const rank = findRank(message.rawtext, visited, rankContext);
        if (rank) return rank;
    }
    if (message.text !== undefined) {
        const text = typeof message.text === "string" ? message.text : "";
        const looksLikeQualityLine = QUALITY_HINT.test(text);
        return normalizeRankToken(text, rankContext || looksLikeQualityLine);
    }

    return undefined;
}

export function getArtisanRankFromLore(lore: readonly unknown[] | undefined): ArtisanRank | undefined {
    if (!lore?.length) return undefined;
    return findRank(lore, new Set<object>());
}

export function getArtisanRank(item: { getRawLore(): readonly unknown[] } | undefined): ArtisanRank | undefined {
    if (!item) return undefined;
    try {
        return getArtisanRankFromLore(item.getRawLore());
    } catch {
        return undefined;
    }
}

export function getArtisanQuality(item: { getRawLore(): readonly unknown[] } | undefined): number {
    const rank = getArtisanRank(item);
    return rank ? ARTISAN_RANK_QUALITY[rank] : 0;
}

export function isArtisanRankAtLeast(rank: unknown, minimum: ArtisanRank): boolean {
    const normalized = normalizeRankToken(rank);
    if (!normalized) return false;
    return ARTISAN_RANK_QUALITY[normalized] >= ARTISAN_RANK_QUALITY[minimum];
}
