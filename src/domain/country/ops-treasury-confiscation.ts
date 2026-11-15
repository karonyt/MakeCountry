/** One explicitly approved treasury confiscation; not a general money editor. */
const KIND = "ops-treasury-confiscation-20261113";
const OPERATION = "ops-france-alt-treasury-confiscation-20261113-v1";
const AMOUNT = 12_107_840;
const SOURCES = ["Momiji0510", "Leader09227623"];
const RECEIPT = "opsTreasuryConfiscation20261113";

function plain(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function cents(value: unknown): number {
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) throw Error("Invalid treasury balance");
    const result = Math.round(value * 100);
    if (!Number.isSafeInteger(result) || Math.abs(value - result / 100) > 0.000001) throw Error("Invalid treasury precision");
    return result;
}

export function prepareOpsTreasuryConfiscation(
    patches: unknown,
    read: (namespace: string, id: string) => string | undefined,
    now = Date.now(),
): { namespace: string; id: string; previous: string; value: string }[] {
    if (!Array.isArray(patches) || patches.length !== 1) throw Error("Invalid confiscation batch");
    const patch = patches[0];
    if (!plain(patch) || patch.kind !== KIND || patch.id !== "country_3" || patch.operationId !== OPERATION
        || patch.amount !== AMOUNT || JSON.stringify(patch.sources) !== JSON.stringify(SOURCES)) {
        throw Error("Unapproved treasury confiscation");
    }
    if (!Number.isSafeInteger(now) || now <= 0) throw Error("Invalid confiscation timestamp");
    const previous = read("country", "country_3");
    if (previous === undefined) throw Error("Country missing");
    const country = JSON.parse(previous);
    if (!plain(country) || country.id !== 3 || country.owner !== "-14010183319307"
        || String(country.name).replace(/§./g, "") !== "フランス帝国") throw Error("Country identity changed");
    const currentCents = cents(country.money);
    if (country[RECEIPT] !== undefined) {
        const receipt = country[RECEIPT];
        if (!plain(receipt) || receipt.operationId !== OPERATION || receipt.amount !== AMOUNT
            || JSON.stringify(receipt.sources) !== JSON.stringify(SOURCES)
            || cents(receipt.before) - cents(receipt.after) !== AMOUNT * 100
            || !Number.isSafeInteger(receipt.at) || receipt.at <= 0) throw Error("Invalid confiscation receipt");
        return [{ namespace: "country", id: "country_3", previous, value: previous }];
    }
    const logs = country.treasuryBudgetLog ?? [];
    if (!Array.isArray(logs) || logs.some((entry: any) => entry?.operationId === OPERATION || entry?.reason === OPERATION)) {
        throw Error("Confiscation history requires review");
    }
    if (currentCents < AMOUNT * 100) throw Error("Insufficient treasury balance");
    const after = (currentCents - AMOUNT * 100) / 100;
    const result = {
        ...country,
        money: after,
        [RECEIPT]: { operationId: OPERATION, amount: AMOUNT, sources: SOURCES, before: currentCents / 100, after, at: now },
        treasuryBudgetLog: [...logs.slice(-50), {
            timestamp: now, actor: "SYSTEM", action: "withdraw", amount: -AMOUNT,
            reason: "treasurybudget.withdraw", operationId: OPERATION,
        }],
    };
    return [{ namespace: "country", id: "country_3", previous, value: JSON.stringify(result) }];
}
