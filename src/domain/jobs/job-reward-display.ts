export type JobProgress = {
    xp: number;
    xpRequired: number;
};

export type DailyEarning = {
    date: string;
    amount: number;
};

function roundForDisplay(value: number): number {
    if (!Number.isFinite(value)) return 0;
    return Math.floor((value + Number.EPSILON) * 100) / 100;
}

export function ensureDailyEarning(playerData: any, jobName: string, today: string): DailyEarning {
    playerData.dailyEarnings ??= {};

    const current = playerData.dailyEarnings[jobName];
    if (!current || current.date !== today) {
        const reset = { date: today, amount: 0 };
        playerData.dailyEarnings[jobName] = reset;
        return reset;
    }

    return current;
}

export function getDailyEarning(playerData: any, jobName: string): number {
    return roundForDisplay(Number(playerData?.dailyEarnings?.[jobName]?.amount ?? 0));
}

export function formatJobRewardValues(
    moneyGained: number,
    dailyEarning: number,
    dailyLimit: number,
    xpGained: number,
    progress: JobProgress,
    moneySuffix = ""
) {
    return {
        money: `+${roundForDisplay(moneyGained)}${moneySuffix}(${roundForDisplay(dailyEarning)}/${roundForDisplay(dailyLimit)})`,
        xp: `+${roundForDisplay(xpGained)}(${roundForDisplay(progress.xp)}/${roundForDisplay(progress.xpRequired)})`
    };
}
