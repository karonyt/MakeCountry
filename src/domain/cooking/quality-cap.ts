import { Player } from "@minecraft/server";
import { JobLevel } from "@/domain/jobs/job-level.js";

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

export function capCookingRankByChefLevel(player: Player, result: RankResult, rankMultiplier = cappedRankMultiplier) {
    const chefLevel = new JobLevel(player, "chef").getLevel();
    const currentIndex = getRankIndex(result.rank);
    const maxRank = getMaxRankForChefLevel(chefLevel);
    const maxIndex = getRankIndex(maxRank);

    if (currentIndex === -1 || currentIndex <= maxIndex) return result;

    return {
        rank: maxRank,
        mul: getRankMultiplier(rankMultiplier, maxRank) ?? result.mul,
    };
}
