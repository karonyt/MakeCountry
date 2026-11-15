import { DynamicProperties, getDynamicProperty, setDynamicProperty, deleteDynamicProperty, forceWriteEntry } from "./dynamic-properties.js";
import { storageReadReady, setStorageWriteGuard, setStorageBatchActiveCheck, setStorageBatchRecoveryCheck } from "./write-hook.js";

// A single native intent survives a restart even if Core received only a prefix.
// Entries contain final values; replay never computes or charges a fee twice.
const JOURNAL = "karo:storage-batch:v1";
export interface BatchEntry { namespace: string; key: string; value: string }
let applying = false;
let loaded = false;
let pending: BatchEntry[] | undefined;

function load(): BatchEntry[] | undefined {
    if (loaded) return pending;
    const raw = getDynamicProperty(JOURNAL);
    if (raw !== undefined) {
        const data = JSON.parse(raw);
        if (!Array.isArray(data) || !data.length || data.length > 2000
            || data.some(e => !e || !["country", "chunk", "plotgroup"].includes(e.namespace)
                || typeof e.key !== "string" || !e.key.startsWith(e.namespace + "_") || typeof e.value !== "string")) {
            throw new Error("invalid_storage_batch_journal");
        }
        const keys = new Set(data.map(e => e.namespace + ":" + e.key));
        if (keys.size !== data.length) throw new Error("duplicate_storage_batch_key");
        for (const entry of data) JSON.parse(entry.value);
        pending = data;
    }
    loaded = true;
    return pending;
}

export function assertBatchWriteAllowed(namespace: string, key: string): void {
    if (applying) return;
    if (load()) throw new Error("storage_batch_recovery_pending");
}

export function isRecoverableBatchApplying(): boolean { return applying; }

setStorageWriteGuard(assertBatchWriteAllowed);
setStorageBatchActiveCheck(isRecoverableBatchApplying);
setStorageBatchRecoveryCheck(() => !applying && load() !== undefined);

export function recoverStorageBatch(): boolean {
    const entries = load();
    if (!entries) return true;
    if (applying || entries.some(e => !storageReadReady(e.namespace))) return false;
    applying = true;
    try {
        for (const entry of entries) {
            // Keep a native leftover until Core acknowledges this exact value.
            // The normal write hook also journals batch entries durably.
            forceWriteEntry(entry.namespace, entry.key, entry.value);
            new DynamicProperties(entry.namespace).set(entry.key, entry.value);
        }
        deleteDynamicProperty(JOURNAL);
        pending = undefined;
        return true;
    } finally { applying = false; }
}

export function commitStorageBatch(entries: BatchEntry[]): void {
    if (load()) throw new Error("storage_batch_recovery_pending");
    if (!entries.length || entries.length > 2000 || new Set(entries.map(e => e.namespace + ":" + e.key)).size !== entries.length
        || entries.some(e => !["country", "chunk", "plotgroup"].includes(e.namespace) || !e.key.startsWith(e.namespace + "_") || !storageReadReady(e.namespace))) {
        throw new Error("invalid_storage_batch");
    }
    for (const entry of entries) JSON.parse(entry.value);
    // Do not mutate any business data until the complete intent was saved.
    setDynamicProperty(JOURNAL, JSON.stringify(entries));
    pending = entries;
    if (!recoverStorageBatch()) throw new Error("storage_batch_not_ready");
}
