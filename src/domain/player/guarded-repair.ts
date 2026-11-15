/** Explicit administrative repairs. Never replaces money or a whole profile. */
const allowed: Record<string, Set<string>> = {
    player: new Set(["country", "roles", "days", "marriage"]),
    country: new Set(["members", "territories"]),
    role: new Set(["members"]),
};

function plain(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function equivalent(a: any, b: any): boolean {
    if (a == null && b == null) return true;
    if (Object.is(a, b)) return true;
    if (Array.isArray(a) || Array.isArray(b)) {
        return Array.isArray(a) && Array.isArray(b) && a.length === b.length
            && a.every((value, index) => equivalent(value, b[index]));
    }
    if (!plain(a) || !plain(b)) return false;
    const aKeys = Object.keys(a).sort(), bKeys = Object.keys(b).sort();
    return aKeys.length === bKeys.length && aKeys.every((key, index) =>
        key === bKeys[index] && equivalent(a[key], b[key]));
}

function validateField(field: string, value: any): void {
    if (field === "country" && value !== null && !(Number.isSafeInteger(value) && value > 0)) throw Error("Invalid country");
    if (field === "days" && !(Number.isSafeInteger(value) && value >= 0)) throw Error("Invalid days");
    if (field === "roles" && (!Array.isArray(value) || value.some(v => !Number.isSafeInteger(v) || v <= 0))) throw Error("Invalid roles");
    if (field === "members" && (!Array.isArray(value) || value.some(v => typeof v !== "string" || !/^-?\d+$/.test(v)))) throw Error("Invalid members");
    if (field === "territories" && (!Array.isArray(value) || value.some(v => typeof v !== "string" || !/^chunk_-?\d+_-?\d+_[\w:]+$/.test(v)))) throw Error("Invalid territories");
    if (field === "marriage" && (!plain(value) || !Array.isArray(value.requests)
        || (value.spouseId != null && !/^-?\d+$/.test(value.spouseId))
        || (value.since != null && (!Number.isSafeInteger(value.since) || value.since <= 0)))) throw Error("Invalid marriage");
}

export type PreparedRepair = { id: string; namespace: string; previous: string; value: string };

/** Validate EVERY record before the caller writes ANY of them. Replays are safe. */
export function prepareGuardedRepairs(
    patches: unknown,
    read: (namespace: string, id: string) => string | undefined,
): PreparedRepair[] {
    if (!Array.isArray(patches) || patches.length === 0 || patches.length > 100) throw Error("Invalid repair batch");
    const seen = new Set<string>();
    return patches.map(patch => {
        if (!plain(patch) || typeof patch.id !== "string" || !/^(player|country|role)_-?\d+$/.test(patch.id)) throw Error("Invalid repair target");
        if (seen.has(patch.id)) throw Error("Duplicate repair target");
        seen.add(patch.id);
        const namespace = patch.id.slice(0, patch.id.indexOf("_"));
        if (!plain(patch.changes) || !plain(patch.expected) || Object.keys(patch.changes).length === 0) throw Error("Missing guarded changes");
        const previous = read(namespace, patch.id);
        if (previous === undefined) throw Error(`Missing repair target: ${patch.id}`);
        const data: unknown = JSON.parse(previous);
        if (!plain(data)) throw Error("Repair target is not an object");
        for (const [field, value] of Object.entries(patch.expected)) {
            if (!Object.prototype.hasOwnProperty.call(patch.changes, field) && !equivalent(data[field], value)) {
                throw Error(`Repair precondition changed: ${patch.id}.${field}`);
            }
        }
        for (const [field, value] of Object.entries(patch.changes)) {
            if (!allowed[namespace].has(field)) throw Error(`Repair field is not allowed: ${field}`);
            if (!Object.prototype.hasOwnProperty.call(patch.expected, field)) throw Error(`Missing expected field: ${field}`);
            validateField(field, value);
            if (!equivalent(data[field], patch.expected[field]) && !equivalent(data[field], value)) throw Error(`Repair conflict: ${patch.id}.${field}`);
        }
        for (const [field, value] of Object.entries(patch.changes)) {
            if (value === null) delete data[field];
            else data[field] = value;
        }
        return { id: patch.id, namespace, previous, value: JSON.stringify(data) };
    });
}
