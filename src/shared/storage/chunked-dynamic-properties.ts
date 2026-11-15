import { splitUtf8 } from "@/shared/storage/utf8-chunks.js";
import { world } from "@minecraft/server";

// =====================
// 設定
// =====================
const CHUNK_SIZE = 20000;
const CACHE_LIMIT = 50;

// =====================
// LRU（頻度ベース）
// =====================
class SmartCache<K, V> {
    private map = new Map<K, { value: V; hits: number }>();

    get(key: K): V | undefined {
        const entry = this.map.get(key);
        if (!entry) return undefined;

        entry.hits++;
        this.map.delete(key);
        this.map.set(key, entry);
        return entry.value;
    }

    set(key: K, value: V) {
        if (this.map.has(key)) this.map.delete(key);

        this.map.set(key, { value, hits: 1 });

        if (this.map.size > CACHE_LIMIT) {
            let minKey: K | undefined;
            let minHits = Infinity;

            for (const [k, v] of this.map) {
                if (v.hits < minHits) {
                    minHits = v.hits;
                    minKey = k;
                }
            }

            if (minKey !== undefined) this.map.delete(minKey);
        }
    }

    delete(key: K) {
        this.map.delete(key);
    }
}

const valueCache = new SmartCache<string, string | undefined>();
const chunkCache = new Map<string, number>();

// =====================
// ユーティリティ
// =====================
function safeStringify(v: any): string {
    if (v === undefined) return "__UNDEFINED__";
    return JSON.stringify(v);
}

// =====================
// chunk削除
// =====================
function deleteChunks(id: string) {
    writeChunks(id, '');
}

// =====================
// 書き込み
// =====================
function writeChunks(id: string, value: string) {
    const pattern = `DyProp_${id}_dy`;
    const lenKey = `DyProp_${id}_len`;

    const oldLength =
        chunkCache.get(id) ??
        (world.getDynamicProperty(lenKey) as number ?? 0);
    if (!Number.isSafeInteger(oldLength) || oldLength < 0) throw Error('invalid_dynamic_property_length');
    const chunks = splitUtf8(value, CHUNK_SIZE);
    const newLength = chunks.length;
    const previousLength = world.getDynamicProperty(lenKey);
    const previous = Array.from({ length: oldLength }, (_, i) => world.getDynamicProperty(`${pattern}${i}`));
    try {
        for (let i = 0; i < newLength; i++) {
            world.setDynamicProperty(`${pattern}${i}`, chunks[i]);
        }
        for (let i = newLength; i < oldLength; i++) {
            world.setDynamicProperty(`${pattern}${i}`, undefined);
        }
        world.setDynamicProperty(lenKey, newLength);
        chunkCache.set(id, newLength);
        valueCache.delete(id);
    } catch (error) {
        // The logical cache must never conceal partially written native chunks.
        valueCache.delete(id);
        chunkCache.delete(id);
        let restored = true;
        for (let i = 0; i < Math.max(oldLength, newLength); i++) {
            try {
                if (world.getDynamicProperty(`${pattern}${i}`) !== previous[i]) world.setDynamicProperty(`${pattern}${i}`, previous[i]);
            } catch { restored = false; }
        }
        try {
            if (world.getDynamicProperty(lenKey) !== previousLength) world.setDynamicProperty(lenKey, previousLength);
        } catch { restored = false; }
        if (!restored) console.warn(`[DynamicProperties] failed to restore ${id} after a native write failure`);
        throw error;
    }
}

// =====================
// 読み込み（互換 + 自動移行）
// =====================
function readChunks(id: string): string | undefined {
    // =====================
    // 新形式
    // =====================
    const pattern = `DyProp_${id}_dy`;
    const lenKey = `DyProp_${id}_len`;

    let length = chunkCache.get(id);

    if (length === undefined) {
        const len = world.getDynamicProperty(lenKey);

        if (len !== undefined) {
            if (typeof len !== 'number' || !Number.isSafeInteger(len) || len < 0) throw Error('invalid_dynamic_property_length');
            length = len;
            chunkCache.set(id, length);
        }
    }

    // Zero is an explicit deletion, not an invitation to revive legacy chunks.
    if (length === 0) return undefined;

    if (length !== undefined && length > 0) {
        const parts: string[] = [];

        for (let i = 0; i < length; i++) {
            const val = world.getDynamicProperty(`${pattern}${i}`);
            if (typeof val !== 'string' || val.length === 0) throw Error('incomplete_dynamic_property_chunks');
            parts.push(val);
        }

        if (length !== undefined) {
            return parts.join("");
        }
    }

    // =====================
    // 旧形式 fallback
    // =====================
    const oldPatterns = [
        `dyp#${id}#dy`,
    ];

    if (id.includes("_")) {
        const key = id.split("_")[0];
        oldPatterns.push(`dyp#${key}#${id}#dy`);
    }

    for (const oldPattern of oldPatterns) {
        const parts: string[] = [];

        for (let i = 0; i < 10000; i++) {
            const val = world.getDynamicProperty(`${oldPattern}${i}`);
            if (val === undefined) break;
            if (typeof val !== 'string' || val.length === 0) throw Error('invalid_legacy_dynamic_property_chunk');
            parts.push(val);
        }

        if (parts.length > 0) {
            const joined = parts.join("");

            writeChunks(id, joined);

            return joined;
        }
    }

    return undefined;
}

// =====================
// JSONキー
// =====================
function jsonKey(id: string, key: string) {
    return `Json_${id}_${key}`;
}

// =====================
// 差分更新（安全版）
// =====================
function updateJsonDiff(id: string, newObj: any, oldRaw = readChunks(id), journal?: Map<string, string | undefined>) {
    let oldObj: any = Object.create(null);

    try {
        if (oldRaw) {
            const parsed = JSON.parse(oldRaw);
            if (parsed !== null && typeof parsed === "object" && !Array.isArray(parsed)) oldObj = parsed;
        }
    } catch { }

    const allKeys = new Set([
        ...Object.keys(oldObj),
        ...Object.keys(newObj),
    ]);

    for (const key of allKeys) {
        const oldVal = safeStringify(Object.prototype.hasOwnProperty.call(oldObj, key) ? oldObj[key] : undefined);
        const hasNew = Object.prototype.hasOwnProperty.call(newObj, key);
        const newVal = safeStringify(hasNew ? newObj[key] : undefined);

        if (oldVal !== newVal) {
            const subId = jsonKey(id, key);
            if (journal) journal.set(subId, readChunks(subId));
            if (!hasNew) {
                deleteChunks(jsonKey(id, key));
            } else {
                writeChunks(jsonKey(id, key), JSON.stringify(newObj[key]));
            }
        }
    }
}

// =====================
// SET
// =====================
export function setDynamicProperty(id: string, value?: string) {
    if (!value) {
        deleteChunks(id);
        valueCache.delete(id);
        return;
    }

    let parsed: any;
    try {
        parsed = JSON.parse(value);
    } catch {
        writeChunks(id, value);
        valueCache.set(id, value);
        return;
    }

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        const journal = new Map<string, string | undefined>();
        const oldRaw = readChunks(id);
        try {
            updateJsonDiff(id, parsed, oldRaw, journal);
            writeChunks(id, value);
        } catch (error) {
            // A root object and all changed field chunks form one logical write.
            valueCache.delete(id);
            for (const [subId, previous] of journal) {
                try { writeChunks(subId, previous ?? ''); }
                catch { console.warn(`[DynamicProperties] failed to restore ${subId} after an object write failure`); }
            }
            throw error;
        }
        valueCache.set(id, value);
        return;
    }

    writeChunks(id, value);
    valueCache.set(id, value);
}

export function getDynamicProperty(id: string): string | undefined {
    const cached = valueCache.get(id);
    if (cached !== undefined) return cached;

    const raw = readChunks(id);
    if (raw === undefined) {
        valueCache.set(id, undefined);
        return undefined;
    }

    let parsed: any;
    try {
        parsed = JSON.parse(raw);
    } catch {
        valueCache.set(id, raw);
        return raw;
    }

    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
        const result: any = Object.create(null);

        for (const key of Object.keys(parsed)) {
            const sub = readChunks(jsonKey(id, key));

            if (sub !== undefined) {
                try {
                    result[key] = JSON.parse(sub);
                    continue;
                } catch {}
            }

            result[key] = parsed[key];
        }

        const final = JSON.stringify(result);
        valueCache.set(id, final);
        return final;
    }

    valueCache.set(id, raw);
    return raw;
}

// =====================
// ID一覧
// =====================
export function DynamicPropertyIds(): string[] {
    const inputArray = world.getDynamicPropertyIds();
    const pattern = /^DyProp_(.+)_dy\d+$/;
    const result = new Set<string>();

    for (const item of inputArray) {
        const match = item.match(pattern);
        if (match && !match[1].startsWith("Json_")) {
            result.add(match[1]);
        }
    }

    return Array.from(result);
}

function repairDynamicProperty(id: string): string | undefined {
    const baseRaw = readChunks(id);

    let baseObj: any = {};

    try {
        if (baseRaw) baseObj = JSON.parse(baseRaw);
    } catch {
        return baseRaw;
    }
    if (typeof baseObj !== "object" || baseObj === null) {
        return baseRaw;
    }

    const result: any = Object.create(null);

    // ベースキー全部走査
    for (const key of Object.keys(baseObj)) {
        const subRaw = readChunks(jsonKey(id, key));

        if (subRaw !== undefined) {
            try {
                result[key] = JSON.parse(subRaw);
                continue;
            } catch {
                // 壊れてたらベース優先
            }
        }

        result[key] = baseObj[key];
    }

    // ★Json側にしかないキーも拾う
    const allIds = world.getDynamicPropertyIds();
    const prefix = `DyProp_Json_${id}_`;

    for (const propId of allIds) {
        if (!propId.startsWith(prefix)) continue;

        const match = propId.match(/^DyProp_Json_(.+)_(.+)_dy\d+$/);
        if (!match) continue;

        const key = match[2];

        if (result[key] !== undefined) continue;

        const subRaw = readChunks(jsonKey(id, key));
        if (subRaw === undefined) continue;

        try {
            result[key] = JSON.parse(subRaw);
        } catch { }
    }

    const fixed = JSON.stringify(result);

    // ★完全上書き（これが一番重要）
    writeChunks(id, fixed);

    // ★Json側も再同期（壊れた差分修正）
    updateJsonDiff(id, result);

    // キャッシュ更新
    valueCache.set(id, fixed);

    return fixed;
}
