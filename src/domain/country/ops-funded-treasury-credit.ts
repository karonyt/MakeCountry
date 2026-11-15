/** Fixed-scope credit funded by the matching Core wallet debit and edit queue transaction. */
const KIND = "ops-funded-treasury-credit-20261104";
const OPERATION = "ops-transfer-eesuutoo2a-country99-20261104-v1";
const MARKER = "opsFundedTreasuryCredit20261104";
const SOURCE = "EESUUTOO2A";
const AMOUNT = 50000;
type Prepared = { id: string; namespace: string; previous: string; value: string };
function plain(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function prepareOpsFundedTreasuryCredit(
    patches: unknown,
    read: (namespace: string, id: string) => string | undefined,
    now = Date.now(),
): Prepared[] {
    if (!Array.isArray(patches) || patches.length !== 1 || !Number.isSafeInteger(now) || now <= 0) throw Error("Invalid funded treasury credit batch");
    const p = patches[0];
    if (!plain(p) || Object.keys(p).some(k => !["kind", "id", "amount", "operationId", "source", "debitOperationId"].includes(k))
        || p.kind !== KIND || p.id !== "country_99" || p.amount !== AMOUNT || p.source !== SOURCE
        || p.operationId !== OPERATION || p.debitOperationId !== `${OPERATION}:debit`) throw Error("Unapproved funded treasury credit");
    const previous = read("country", p.id);
    if (previous === undefined) throw Error("Missing country 99");
    const data: unknown = JSON.parse(previous);
    if (!plain(data) || data.id !== 99 || typeof data.name !== "string"
        || data.name.replace(/§./g, "") !== "イギリス西インド会社植民地") throw Error("Country identity mismatch");
    const receipt = data[MARKER];
    if (receipt !== undefined) {
        if (!plain(receipt) || receipt.operationId !== OPERATION || receipt.debitOperationId !== `${OPERATION}:debit`
            || receipt.source !== SOURCE || receipt.amount !== AMOUNT || !Number.isFinite(receipt.before) || !Number.isFinite(receipt.after)
            || Math.round((receipt.after - receipt.before) * 100) !== AMOUNT * 100
            || !Number.isSafeInteger(receipt.appliedAt) || receipt.appliedAt <= 0) throw Error("Existing funded credit receipt needs review");
        return [{ id: p.id, namespace: "country", previous, value: previous }];
    }
    if (typeof data.money !== "number" || !Number.isFinite(data.money) || data.money < 0) throw Error("Invalid live treasury balance");
    const cents = Math.round(data.money * 100), afterCents = cents + AMOUNT * 100;
    if (!Number.isSafeInteger(cents) || !Number.isSafeInteger(afterCents) || Math.abs(cents / 100 - data.money) > 0.000001) throw Error("Unsafe treasury precision");
    const log = data.treasuryBudgetLog ?? [];
    if (!Array.isArray(log) || log.some(entry => String(entry?.reason ?? "").includes(OPERATION))) throw Error("Treasury credit log needs review");
    const before = data.money;
    data.money = afterCents / 100;
    data[MARKER] = { operationId: OPERATION, debitOperationId: `${OPERATION}:debit`, source: SOURCE, amount: AMOUNT, before, after: data.money, appliedAt: now };
    data.treasuryBudgetLog = [...log.slice(-49), { timestamp: now, actor: `OPS:${SOURCE}`, action: "deposit", amount: AMOUNT, reason: `OPS_FUNDED_TRANSFER:${OPERATION}` }];
    return [{ id: p.id, namespace: "country", previous, value: JSON.stringify(data) }];
}
