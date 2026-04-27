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
    const pattern = `DyProp_${id}_dy`;
    const lenKey = `DyProp_${id}_len`;

    const length =
        chunkCache.get(id) ??
        (world.getDynamicProperty(lenKey) as number ?? 0);

    for (let i = 0; i < length; i++) {
        world.setDynamicProperty(`${pattern}${i}`, undefined);
    }

    world.setDynamicProperty(lenKey, 0);
    chunkCache.set(id, 0);
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

    const newLength = Math.ceil(value.length / CHUNK_SIZE);

    for (let i = 0; i < newLength; i++) {
        world.setDynamicProperty(
            `${pattern}${i}`,
            value.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
        );
    }

    for (let i = newLength; i < oldLength; i++) {
        world.setDynamicProperty(`${pattern}${i}`, undefined);
    }

    world.setDynamicProperty(lenKey, newLength);
    chunkCache.set(id, newLength);
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

        if (typeof len === "number") {
            length = len;
            chunkCache.set(id, length);
        }
    }

    if (length !== undefined && length > 0) {
        const parts: string[] = [];

        for (let i = 0; i < length; i++) {
            const val = world.getDynamicProperty(`${pattern}${i}`);
            if (val === undefined) {
                length = undefined;
                break;
            }
            parts.push(val as string);
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
            parts.push(val as string);
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
function updateJsonDiff(id: string, newObj: any) {
    const oldRaw = readChunks(id);
    let oldObj: any = {};

    try {
        if (oldRaw) oldObj = JSON.parse(oldRaw);
    } catch { }

    const allKeys = new Set([
        ...Object.keys(oldObj),
        ...Object.keys(newObj),
    ]);

    for (const key of allKeys) {
        const oldVal = safeStringify(oldObj[key]);
        const newVal = safeStringify(newObj[key]);

        if (oldVal !== newVal) {
            if (!(key in newObj)) {
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
        updateJsonDiff(id, parsed);
        writeChunks(id, value);
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
        const result: any = {};

        for (const key in parsed) {
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

    const result: any = {};

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