import { Player } from "@minecraft/server";
import { JobLevel } from "@/domain/jobs/job-level.js";
import {
    capRankByRecipeMastery,
    getRecipeMasteryProfile,
} from "@/domain/professions/recipe-mastery.js";

const rankOrder = ["F", "E", "D", "C", "B", "A", "S", "SS", "SSS", "LEGENDARY", "EXTRA", "IMPOSSIBLE", "KARON"];
const rankAliases: Record<string, string> = {
    LEGEND: "LEGENDARY",
};

const rankRequiredChefLevel: Record<string, number> = {
    F: 0,
    E: 1,
    D: 5,
    C: 10,
    B: 20,
    A: 35,
    S: 55,
    SS: 80,
    SSS: 110,
    LEGENDARY: 150,
    EXTRA: 190,
    IMPOSSIBLE: 240,
    KARON: 290,
};

type RankResult = {
    rank: string;
    mul: number;
};

type RankMultiplierTable = Partial<Record<string, number>>;

export type CookingQualityCapProfile = {
    maxRank: string;
    nextRank?: string;
    levelsToNext?: number;
};

const cappedRankMultiplier: RankMultiplierTable = {
    F: 0.4,
    E: 1.0,
    D: 1.2,
    C: 1.3,
    B: 1.4,
    A: 1.5,
    S: 1.6,
    SS: 1.7,
    SSS: 1.8,
    LEGENDARY: 2.0,
    EXTRA: 3.0,
    IMPOSSIBLE: 5.0,
    KARON: 10.0,
};

function normalizeRank(rank: string) {
    return rankAliases[rank] ?? rank;
}

function getRankIndex(rank: string) {
    return rankOrder.indexOf(normalizeRank(rank));
}

function getRankMultiplier(rankMultiplier: RankMultiplierTable, rank: string) {
    return rankMultiplier[rank] ?? rankMultiplier[normalizeRank(rank)];
}

function getMaxRankForChefLevel(level: number) {
    let maxRank = "F";
    for (const rank of rankOrder) {
        if (level >= rankRequiredChefLevel[rank]) {
            maxRank = rank;
        }
    }
    return maxRank;
}

function capRankByChefLevel(rank: string, chefLevel: number) {
    const currentIndex = getRankIndex(rank);
    const maxRank = getMaxRankForChefLevel(chefLevel);
    const maxIndex = getRankIndex(maxRank);
    return currentIndex !== -1 && currentIndex > maxIndex ? maxRank : normalizeRank(rank);
}

function getCookingMaxRankForLevels(chefLevel: number, requiredLevel: number) {
    const masteryRank = getRecipeMasteryProfile(chefLevel, requiredLevel).maxRank;
    return capRankByChefLevel(masteryRank, chefLevel);
}

/** The effective cap shown in cooking UIs, including both cooking restrictions. */
export function getCookingQualityCapProfile(chefLevel: number, requiredLevel: number): CookingQualityCapProfile {
    const level = Math.max(0, Math.floor(Number(chefLevel) || 0));
    const requirement = Math.max(0, Math.floor(Number(requiredLevel) || 0));
    const maxRank = getCookingMaxRankForLevels(level, requirement);
    const currentIndex = getRankIndex(maxRank);
    const maximumLevel = Math.max(requirement + 260, rankRequiredChefLevel.KARON);

    for (let candidateLevel = level + 1; candidateLevel <= maximumLevel; candidateLevel++) {
        const candidateRank = getCookingMaxRankForLevels(candidateLevel, requirement);
        if (getRankIndex(candidateRank) > currentIndex) {
            return {
                maxRank,
                nextRank: candidateRank,
                levelsToNext: candidateLevel - level,
            };
        }
    }

    return { maxRank };
}

/**
 * Applies both the absolute Chef-level ceiling and the recipe-specific mastery
 * ceiling. Reward multipliers are always looked up again from the final rank so
 * a capped result can never retain the payout of its uncapped rank.
 */
export function capCookingRankForLevels(
    result: RankResult,
    chefLevel: number,
    requiredLevel: number,
    rankMultiplier: RankMultiplierTable = cappedRankMultiplier,
) {
    const rawRank = result.rank;
    const masteryCappedRank = capRankByRecipeMastery(rawRank, chefLevel, requiredLevel);
    const rank = capRankByChefLevel(masteryCappedRank, chefLevel);
    return {
        rank,
        mul: getRankMultiplier(rankMultiplier, rank) ?? result.mul,
    };
}

export function capCookingRankByChefLevel(player: Player, result: RankResult, rankMultiplier = cappedRankMultiplier) {
    const chefLevel = new JobLevel(player, "chef").getLevel();
    const rank = capRankByChefLevel(result.rank, chefLevel);
    return {
        rank,
        mul: getRankMultiplier(rankMultiplier, rank) ?? result.mul,
    };
}

export function capCookingRankByRecipe(
    player: Player,
    result: RankResult,
    requiredLevel: number,
    rankMultiplier = cappedRankMultiplier,
) {
    const chefLevel = new JobLevel(player, "chef").getLevel();
    return capCookingRankForLevels(result, chefLevel, requiredLevel, rankMultiplier);
}
