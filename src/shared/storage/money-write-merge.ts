export type MoneyWriteMarker = {
    token: string;
    balance: number;
};

type MoneyWriteProgress = {
    key: string;
    appliedDelta: number;
};

export type MoneyWriteDelta = {
    baseMoney: number;
    delta: number;
    commit: () => void;
};

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

export class StaleMoneyWriteError extends Error {
    constructor() { super('stale_money_write_marker'); this.name = 'StaleMoneyWriteError'; }
}

/**
 * player 全体の古いスナップショットを保存するとき、money だけは差分として
 * 最新値へ合成する。同じスナップショットを複数回保存しても、適用済み差分は
 * 二重に足さない。
 */
export class MoneyWriteTracker {
    private readonly progress = new Map<string, MoneyWriteProgress>();
    private readonly maxTrackedWrites: number;
    private nextToken = 1;
    private retiredThrough = 0;

    constructor(maxTrackedWrites = 10_000) {
        this.maxTrackedWrites = maxTrackedWrites;
    }

    createMarker(balance: number): MoneyWriteMarker {
        return {
            token: `${Date.now().toString(36)}:${this.nextToken++}`,
            balance,
        };
    }

    pendingDelta(key: string, marker: unknown, requestedMoney: number): MoneyWriteDelta | undefined {
        if (!marker || typeof marker !== "object") return undefined;
        const token = `${(marker as MoneyWriteMarker).token ?? ""}`;
        const baseMoney = Number((marker as MoneyWriteMarker).balance);
        if (!token || !Number.isFinite(baseMoney) || !Number.isFinite(requestedMoney)) return undefined;

        const totalDelta = roundMoney(requestedMoney - baseMoney);
        const prior = this.progress.get(token);
        const sequence = Number(token.slice(token.lastIndexOf(':') + 1));
        if (!prior && Number.isSafeInteger(sequence) && sequence > 0 && sequence <= this.retiredThrough) throw new StaleMoneyWriteError();
        const alreadyApplied = prior?.key === key ? prior.appliedDelta : 0;
        return {
            baseMoney,
            delta: roundMoney(totalDelta - alreadyApplied),
            commit: () => {
                this.progress.delete(token);
                this.progress.set(token, { key, appliedDelta: totalDelta });
                while (this.progress.size > this.maxTrackedWrites) {
                    const oldest = this.progress.keys().next().value;
                    if (typeof oldest !== 'string') break;
                    const sequence = Number(oldest.slice(oldest.lastIndexOf(':') + 1));
                    if (Number.isSafeInteger(sequence)) this.retiredThrough = Math.max(this.retiredThrough, sequence);
                    this.progress.delete(oldest);
                }
            },
        };
    }
}
