/**
 * One-time, fixed-scope repair after restoring country 294 (ticket #1406, 2026-11-15).
 * - Refund the RP country 278 paid for chunks it took after 294 was dissolved: 56 returned to 294 and 53 made wilderness (2000 x 109 = 218000).
 * - Put 294 back into the friendly lists of countries 6 and 14 (removed when 294 was dissolved).
 * Each entry reads the latest live value and is safe to replay.
 */
const kind = "ticket1406-restore-repair";
const operationId = "ticket1406-restore-repair-20261115-v1";
const marker = "ticket1406RpRefund20261115";
const RP_REFUND = { id: "country_278", countryId: 278, owner: "-14577118960361", amount: 218000 };
const FRIENDLY = new Map([["country_6", 6], ["country_14", 14]]);
const RESTORED = 294;
type Prepared = { id: string; namespace: string; previous: string; value: string };

function plain(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function prepareTicket1406RestoreRepair(
    patches: unknown,
    read: (namespace: string, id: string) => string | undefined,
    now = Date.now(),
): Prepared[] {
    const expected = [RP_REFUND.id, ...FRIENDLY.keys()].sort();
    if (!Array.isArray(patches) || patches.length !== expected.length) throw Error("Invalid ticket1406 batch");
    if (!Number.isSafeInteger(now) || now <= 0) throw Error("Invalid repair time");
    const ids = patches.map(p => (plain(p) ? p.id : undefined));
    if (JSON.stringify([...ids].sort()) !== JSON.stringify(expected)) throw Error("Unexpected ticket1406 targets");
    return patches.map(patch => {
        if (!plain(patch) || patch.kind !== kind || patch.operationId !== operationId) throw Error("Invalid ticket1406 operation");
        if (Object.keys(patch).some(key => !["kind", "id", "operationId"].includes(key))) throw Error("Unexpected ticket1406 field");
        const previous = read("country", patch.id);
        if (previous === undefined) throw Error(`Missing country: ${patch.id}`);
        const data: unknown = JSON.parse(previous);
        if (!plain(data)) throw Error("Invalid country data");
        if (patch.id === RP_REFUND.id) {
            if (data.id !== RP_REFUND.countryId) throw Error("Country identity mismatch");
            const receipt = data[marker];
            if (receipt !== undefined) {
                if (!plain(receipt) || receipt.operationId !== operationId || receipt.amount !== RP_REFUND.amount) throw Error("Existing refund marker needs review");
                return { id: patch.id, namespace: "country", previous, value: previous };
            }
            if (String(data.owner) !== RP_REFUND.owner) throw Error("Country owner changed before refund");
            if (typeof data.resourcePoint !== "number" || !Number.isFinite(data.resourcePoint) || data.resourcePoint < 0) throw Error("Invalid live RP");
            const log = data.resourcePointLog ?? [];
            if (!Array.isArray(log)) throw Error("Invalid RP audit log");
            const before = data.resourcePoint;
            data.resourcePoint = before + RP_REFUND.amount;
            data[marker] = { operationId, amount: RP_REFUND.amount, before, after: data.resourcePoint, appliedAt: now };
            data.resourcePointLog = [...log.slice(-49), { timestamp: now, actor: "SYSTEM_COMPENSATION",
                action: "add", amount: RP_REFUND.amount, reason: `TICKET1406_RP_REFUND:${operationId}` }];
            return { id: patch.id, namespace: "country", previous, value: JSON.stringify(data) };
        }
        const countryId = FRIENDLY.get(patch.id);
        if (data.id !== countryId) throw Error("Country identity mismatch");
        const friendly = data.friendly ?? [];
        if (!Array.isArray(friendly)) throw Error("Invalid friendly list");
        if (friendly.includes(RESTORED)) return { id: patch.id, namespace: "country", previous, value: previous };
        data.friendly = [...friendly, RESTORED];
        return { id: patch.id, namespace: "country", previous, value: JSON.stringify(data) };
    });
}
