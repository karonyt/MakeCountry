import type { PreparedRepair } from "./guarded-repair.js";

const chestId = /^chest_-?\d+_-?\d+_-?\d+_minecraft:(overworld|nether|the_end)$/;
const playerId = /^-?\d+$/;
const fields = new Set(["kind", "id", "from", "to", "fromName", "toName", "expectedAdmin"]);

function plain(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

/** Account migrations only: validate all identities and locks before writing any. */
export function prepareChestOwnerTransfers(
    patches: unknown,
    read: (namespace: string, id: string) => string | undefined,
): PreparedRepair[] {
    if (!Array.isArray(patches) || patches.length === 0 || patches.length > 100) throw Error("Invalid chest transfer batch");
    const seen = new Set<string>();
    return patches.map(patch => {
        if (!plain(patch) || patch.kind !== "chest-owner-transfer"
            || Object.keys(patch).some(key => !fields.has(key))
            || typeof patch.id !== "string" || !chestId.test(patch.id)
            || typeof patch.from !== "string" || !playerId.test(patch.from)
            || typeof patch.to !== "string" || !playerId.test(patch.to) || patch.from === patch.to
            || typeof patch.fromName !== "string" || !patch.fromName
            || typeof patch.toName !== "string" || !patch.toName
            || !Array.isArray(patch.expectedAdmin)
            || patch.expectedAdmin.some((id: unknown) => typeof id !== "string" || !playerId.test(id))
            || new Set(patch.expectedAdmin).size !== patch.expectedAdmin.length) throw Error("Invalid chest transfer");
        if (seen.has(patch.id)) throw Error("Duplicate chest transfer target");
        seen.add(patch.id);
        for (const [id, name] of [[patch.from, patch.fromName], [patch.to, patch.toName]]) {
            const raw = read("player", `player_${id}`);
            const profile: unknown = raw === undefined ? undefined : JSON.parse(raw);
            if (!plain(profile) || profile.name !== name) throw Error(`Chest transfer identity changed: ${id}`);
        }
        const previous = read("chest", patch.id);
        if (previous === undefined) throw Error(`Missing chest transfer target: ${patch.id}`);
        const data: unknown = JSON.parse(previous);
        if (!plain(data) || data.id !== patch.id) throw Error("Invalid chest transfer record");
        if (data.player !== patch.from && data.player !== patch.to) throw Error(`Chest owner changed: ${patch.id}`);
        if (JSON.stringify(data.admin) !== JSON.stringify(patch.expectedAdmin)) throw Error(`Chest administrators changed: ${patch.id}`);
        // Preserve every other field, and make successful retries a byte-for-byte no-op.
        return { id: patch.id, namespace: "chest", previous,
            value: data.player === patch.to ? previous : JSON.stringify({ ...data, player: patch.to }) };
    });
}
