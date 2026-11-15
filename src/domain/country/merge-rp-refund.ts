/** One-time, fixed-scope refund of the RP that MergeCountry zeroed on 2026-09-27 (Country24 -> Country6). */
const approvals = new Map([
    ["country_6", { countryId: 6, owner: "-14010183319482", amount: 483800 }],
]);
const kind = "merge-rp-refund";
const marker = "mergeRpRefund20260927";
const prefix = "merge-rp-refund-20260927-v1";
type Prepared = { id: string; namespace: string; previous: string; value: string };

function plain(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Validate the entire batch before any caller writes. Always add to the latest live RP. */
export function prepareMergeRpRefund(
    patches: unknown,
    read: (namespace: string, id: string) => string | undefined,
    now = Date.now(),
): Prepared[] {
    if (!Array.isArray(patches) || patches.length !== 1) throw Error("Invalid merge refund batch");
    if (!Number.isSafeInteger(now) || now <= 0) throw Error("Invalid refund time");
    const seen = new Set<string>();
    return patches.map(patch => {
        if (!plain(patch) || patch.kind !== kind || typeof patch.id !== "string") throw Error("Invalid merge refund operation");
        if (Object.keys(patch).some(key => !["kind", "id", "amount", "operationId"].includes(key))) throw Error("Unexpected refund field");
        if (seen.has(patch.id)) throw Error("Duplicate refund target");
        seen.add(patch.id);
        const approval = approvals.get(patch.id);
        if (!approval) throw Error("Unapproved refund target");
        const operationId = `${prefix}:${approval.countryId}`;
        if (patch.operationId !== operationId || patch.amount !== approval.amount) throw Error("Unapproved refund amount or operation");
        const previous = read("country", patch.id);
        if (previous === undefined) throw Error(`Missing country: ${patch.id}`);
        const data: unknown = JSON.parse(previous);
        if (!plain(data) || data.id !== approval.countryId) throw Error("Country identity mismatch");
        const receipt = data[marker];
        if (receipt !== undefined) {
            if (!plain(receipt) || receipt.operationId !== operationId || receipt.amount !== approval.amount
                || receipt.owner !== approval.owner
                || !Number.isFinite(receipt.before) || !Number.isFinite(receipt.after)
                || Math.round((receipt.after - receipt.before) * 100) !== approval.amount * 100
                || !Number.isSafeInteger(receipt.appliedAt) || receipt.appliedAt <= 0) {
                throw Error("Existing refund marker needs review");
            }
            // Even after spending, log rollover or a king change, replay must never credit again.
            return { id: patch.id, namespace: "country", previous, value: previous };
        }
        if (data.owner !== approval.owner) throw Error("Country owner changed before refund");
        if (typeof data.resourcePoint !== "number" || !Number.isFinite(data.resourcePoint) || data.resourcePoint < 0) throw Error("Invalid live RP");
        const cents = Math.round(data.resourcePoint * 100);
        const afterCents = cents + approval.amount * 100;
        if (!Number.isSafeInteger(cents) || !Number.isSafeInteger(afterCents)
            || Math.abs(cents / 100 - data.resourcePoint) > 0.000001) throw Error("Unsafe live RP precision");
        const log = data.resourcePointLog ?? [];
        if (!Array.isArray(log)) throw Error("Invalid RP audit log");
        if (log.some(entry => String(entry?.reason ?? "").includes(operationId))) throw Error("Refund log exists without its marker");
        const before = data.resourcePoint;
        data.resourcePoint = afterCents / 100;
        data[marker] = { operationId, amount: approval.amount,
            owner: approval.owner, before, after: data.resourcePoint, appliedAt: now };
        data.resourcePointLog = [...log.slice(-50), { timestamp: now, actor: "SYSTEM_COMPENSATION",
            action: "add", amount: approval.amount, reason: `MERGE_RP_REFUND:${operationId}` }];
        return { id: patch.id, namespace: "country", previous, value: JSON.stringify(data) };
    });
}
