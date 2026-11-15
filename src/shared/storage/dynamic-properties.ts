import { splitUtf8 } from "@/shared/storage/utf8-chunks.js";
import { world } from "@minecraft/server";
import {
    notifyWrite,
    readOverride,
    keysOverride,
    shouldSkipDynamicProperty,
    assertStorageWriteAllowed,
} from "@/shared/storage/write-hook.js";
import {
    LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE,
    legacyCollectionEntryKey,
    legacyCollectionIdsKey,
    legacyDynamicPropertyChunkKey,
    legacyDynamicPropertyMetaKey,
} from "@/shared/storage/legacy-schema.js";
import config from "@/config/server.js";
import { MoneyWriteTracker, StaleMoneyWriteError } from "@/shared/storage/money-write-merge.js";

// player JSON を読んだ呼び出し元だけが持つ一時値。保存前に必ず取り除く。
// 古いフォームが後から player 全体を保存しても、その処理が意図した money の
// 差額だけを現在残高へ合成できる。
const MONEY_WRITE_BASE = "__karoMoneyWriteBase";
const moneyWriteTracker = new MoneyWriteTracker();
let staleMoneyMergeCount = 0;
let lastStaleMoneyWarnAt = 0;

function attachMoneyWriteBase(raw: string | undefined): string | undefined {
    if (!raw) return raw;
    try {
        const data = JSON.parse(raw);
        const money = Number(data?.money);
        if (!data || typeof data !== "object" || !Number.isFinite(money)) return raw;
        data[MONEY_WRITE_BASE] = moneyWriteTracker.createMarker(money);
        return JSON.stringify(data);
    } catch {
        return raw;
    }
}

function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

function warnStaleMoneyMerge(key: string, base: number, current: number, delta: number): void {
    staleMoneyMergeCount += 1;
    const now = Date.now();
    if (now - lastStaleMoneyWarnAt < 60_000) return;
    console.warn(
        `[storage] stale player money writes merged: count=${staleMoneyMergeCount} ` +
        `latest=${key} base=${base} current=${current} delta=${delta}`,
    );
    staleMoneyMergeCount = 0;
    lastStaleMoneyWarnAt = now;
}

function readCollectionIds(name: string): any[] {
    const raw = getDynamicProperty(legacyCollectionIdsKey(name));
    const ids = raw === undefined ? [] : JSON.parse(raw);
    if (!Array.isArray(ids)) throw Error('invalid_dynamic_property_index');
    return ids;
}

/** Distinguish an unconfirmed restore from an ordinary, safely retryable save failure. */
function nativeRollbackFailure(cause: unknown, rollbackErrors: unknown[]): Error {
    const failure = new Error("native_property_rollback_failed");
    Object.assign(failure, { cause, rollbackErrors });
    return failure;
}

/** Keep a native collection entry and its lookup index consistent on failure. */
function writeCollectionEntry(name: string, key: string, value: string | null, ids = readCollectionIds(name)): void {
    const entryKey = legacyCollectionEntryKey(name, key);
    const exists = ids.includes(key);
    const changesIndex = value === null ? exists : !exists;
    const previous = changesIndex ? getDynamicProperty(entryKey) : undefined;
    if (value === null) deleteDynamicProperty(entryKey);
    else setDynamicProperty(entryKey, value);
    if (!changesIndex) return;
    try {
        setDynamicProperty(legacyCollectionIdsKey(name), JSON.stringify(value === null ? ids.filter(id => id != key) : [...ids, key]));
    } catch (error) {
        try {
            if (previous === undefined) deleteDynamicProperty(entryKey);
            else setDynamicProperty(entryKey, previous);
        } catch (rollbackError) {
            throw nativeRollbackFailure(error, [rollbackError]);
        }
        throw error;
    }
}

export class DynamicProperties {
    name: any;
    /**
     * @param {string} name
     */
    constructor(name: any) {
        this.name = name;
    }

    /**
     * @type {Array<string>}
     */
    // 戻り値は元の実装 (JSON.parse の結果) と同じ緩さのままにしてある。
    // 厳密にすると呼び出し側の既存の未確認アクセスが一斉に型エラーになるため
    get idList(): Array<any> {
        // メモリ上の写しが受け持っていればそちらを正とする
        const mirrored = keysOverride(this.name);
        if (mirrored !== undefined) return mirrored;
        return this.dpIdList();
    }

    /** 動的プロパティ側の一覧。写しに関係なく、保存の帳尻合わせに使う */
    dpIdList(): Array<any> {
        return readCollectionIds(this.name);
    }

    /**
     * 
     * @param {string} key
     * @returns {string|undefined} 
     */
    rawGet(key: any) {
        // 写しが受け持つ名前空間では動的プロパティを読まない。
        // null は「無いことが確定」で、undefined は担当外 (従来経路へ)
        const mirrored = readOverride(this.name, `${key}`);
        if (mirrored !== undefined) return mirrored === null ? undefined : mirrored;
        return getDynamicProperty(legacyCollectionEntryKey(this.name, `${key}`));
    }

    get(key: any) {
        const raw = this.rawGet(key);
        return this.name === "player" ? attachMoneyWriteBase(raw) : raw;
    }

    /**
     * 
     * @param {string} key
     * @param {string} value
     */
    set(key: any, value: any) {
        assertStorageWriteAllowed(this.name, String(key));
        let stored = typeof value == 'string' ? value : JSON.stringify(value);
        const skip = shouldSkipDynamicProperty(this.name);
        const ids = skip ? undefined : this.dpIdList();
        let commitMoneyWrite: (() => void) | undefined;
        let savedMoney: number | undefined;
        // wallet 同期が初回の書き込みでも正確な差分を取れるよう、player だけ
        // 書き換え前の値も通知する。他の名前空間に余分な読み取りは増やさない。
        const previous = this.name === "player" ? this.rawGet(key) : undefined;
        if (this.name === "player") {
            try {
                const before = previous ? JSON.parse(previous) : undefined;
                const after = JSON.parse(stored);
                const currentMoney = Number(before?.money);
                const requestedMoney = Number(after?.money);
                const moneyDelta = Number.isFinite(requestedMoney)
                    ? moneyWriteTracker.pendingDelta(`${key}`, after?.[MONEY_WRITE_BASE], requestedMoney)
                    : undefined;
                if (Number.isFinite(currentMoney)) {
                    if (moneyDelta) {
                        // `requested - base` の未適用分が、この呼び出し元が意図した増減。
                        // 最新残高そのものを古いスナップショットで上書きしない。
                        after.money = roundMoney(currentMoney + moneyDelta.delta);
                        if (Math.abs(currentMoney - moneyDelta.baseMoney) >= 0.01) {
                            warnStaleMoneyMerge(
                                `${key}`,
                                moneyDelta.baseMoney,
                                currentMoney,
                                moneyDelta.delta,
                            );
                        }
                    } else if (!Number.isFinite(requestedMoney)) {
                        // money を扱わない部分更新が、既存残高を消さないようにする。
                        after.money = currentMoney;
                    }
                }
                delete after[MONEY_WRITE_BASE];
                stored = JSON.stringify(after);
                commitMoneyWrite = moneyDelta?.commit;
                savedMoney = after.money;
            } catch (error) {
                if (error instanceof StaleMoneyWriteError) throw error;
                // 従来どおり保存する。壊れた JSON は既存の診断へ任せる。
            }
        }
        if (config.world === "karoearth" && this.name === "player" && previous) {
            try {
                const before = JSON.parse(previous);
                const after = JSON.parse(stored);
                const beforeCountry = Number(before?.country) || 0;
                const afterCountry = Number(after?.country) || 0;
                if (beforeCountry !== afterCountry) {
                    // 加入は先に country.members へ追加、脱退は先にそこから削除する。
                    // この条件を満たさない player 全体の保存は、古いフォームが
                    // country/roles を巻き戻そうとしているため所属だけ温存する。
                    const checkCountry = afterCountry || beforeCountry;
                    const countryKey = `country_${checkCountry}`;
                    const mirroredCountry = readOverride("country", countryKey);
                    const rawCountry = mirroredCountry !== undefined
                        ? (mirroredCountry === null ? undefined : mirroredCountry)
                        : getDynamicProperty(legacyCollectionEntryKey("country", countryKey));
                    const countryData = rawCountry ? JSON.parse(rawCountry) : undefined;
                    const isMember = Array.isArray(countryData?.members)
                        && countryData.members.includes(`${key}`.replace(/^player_/, ""));
                    const transitionReady = afterCountry ? isMember : !isMember;
                    if (!transitionReady) {
                        after.country = before.country;
                        after.roles = before.roles;
                        stored = JSON.stringify(after);
                        console.warn(`[storage] stale player country write blocked: ${key}`);
                    }
                }
            } catch {
                // 従来どおり保存する。壊れた JSON の診断は既存の呼び出し側に任せる。
            }
        }
        // 切り離しモードでは動的プロパティへ書かない (ストアを縮めるため)。
        // 既定は書く。判定できないときも必ず書く側へ倒してある
        if (!skip) writeCollectionEntry(this.name, key, stored, ids);
        // Failed native/index writes must leave the money marker reusable.
        commitMoneyWrite?.();
        if (value && typeof value === 'object' && savedMoney !== undefined) {
            try {
                value.money = savedMoney;
                value[MONEY_WRITE_BASE] = moneyWriteTracker.createMarker(savedMoney);
            } catch { /* A frozen caller snapshot cannot undo a committed save. */ }
        }
        notifyWrite(this.name, `${key}`, stored, previous);
        return this;
    }

    /**
     * @param {string} key
     */
    has(key: any) {
        return this.idList.includes(key);
    }

    /**
     * 
     * @param {string} key
     */
    delete(key: any) {
        assertStorageWriteAllowed(this.name, String(key));
        const skip = shouldSkipDynamicProperty(this.name);
        if (!skip) writeCollectionEntry(this.name, key, null);
        notifyWrite(this.name, `${key}`, null);
    }

    clear() {
        // Each committed deletion updates its index and mirror together. An
        // interrupted clear leaves the remaining entries indexed and retryable.
        for (const id of this.idList) this.delete(id);
    }
}

export function describeDynamicPropertyEntry(name: any, key: any) {
    const entryKey = legacyCollectionEntryKey(name, `${key}`);
    return `${entryKey} (chunk0=${legacyDynamicPropertyChunkKey(entryKey, 0)}, meta=${legacyDynamicPropertyMetaKey(entryKey)})`;
}

/**
 * 
 * @param {string} id
 * @param {string} value
 */
function readNativeProperty(id: string): { meta: unknown; chunks: string[] } {
    const meta = world.getDynamicProperty(legacyDynamicPropertyMetaKey(id));
    const chunks: string[] = [];
    if (meta !== undefined) {
        if (typeof meta !== 'string') throw Error('invalid_dynamic_property_metadata');
        const parsed = JSON.parse(meta);
        if (!parsed || !Number.isSafeInteger(parsed.chunks) || parsed.chunks < 0) throw Error('invalid_dynamic_property_metadata');
        for (let i = 0; i < parsed.chunks; i++) {
            const part = world.getDynamicProperty(legacyDynamicPropertyChunkKey(id, i));
            if (typeof part !== 'string' || part.length === 0) throw Error('incomplete_dynamic_property_chunks');
            chunks.push(part);
        }
    } else {
        for (let i = 0; i < 10000; i++) {
            const part = world.getDynamicProperty(legacyDynamicPropertyChunkKey(id, i));
            if (part === undefined) break;
            if (typeof part !== 'string' || part.length === 0) throw Error('invalid_dynamic_property_chunk');
            chunks.push(part);
        }
    }
    return { meta, chunks };
}

/** Restore the exact native values if any write in a logical update fails. */
function commitNativeProperties(changes: Map<string, Parameters<typeof world.setDynamicProperty>[1]>): void {
    const before = new Map(Array.from(changes.keys(), key => [key, world.getDynamicProperty(key)]));
    try {
        for (const [key, value] of changes) world.setDynamicProperty(key, value);
    } catch (error) {
        const rollbackErrors: unknown[] = [];
        for (const [key, previous] of before) {
            try {
                // If comparison itself fails, a successful setter can still restore
                // the known old value. Keep trying the remaining keys after failure.
                let needsRestore = true;
                try { needsRestore = world.getDynamicProperty(key) !== previous; } catch { }
                if (needsRestore) world.setDynamicProperty(key, previous);
            } catch (rollbackError) { rollbackErrors.push(rollbackError); }
        }
        if (rollbackErrors.length) throw nativeRollbackFailure(error, rollbackErrors);
        throw error;
    }
}

export function setDynamicProperty(id: any, value: any) {
    if (typeof value !== 'string') throw ReferenceError('Input must be a string');
    readNativeProperty(id); // Refuse to overwrite an unreadable existing record.
    const parts = splitUtf8(value, LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE);
    const chunks = parts.length;
    const changes = new Map<string, Parameters<typeof world.setDynamicProperty>[1]>();
    for (let i = 0; i < chunks; i++) {
        changes.set(legacyDynamicPropertyChunkKey(id, i), parts[i]);
    }
    for (let i = chunks; ; i++) {
        const key = legacyDynamicPropertyChunkKey(id, i);
        if (world.getDynamicProperty(key) === undefined) break;
        changes.set(key, undefined);
    }
    changes.set(legacyDynamicPropertyMetaKey(id), JSON.stringify({ chunks }));
    commitNativeProperties(changes);
}

export function deleteDynamicProperty(id: any) {
    const { chunks } = readNativeProperty(id);
    const changes = new Map<string, Parameters<typeof world.setDynamicProperty>[1]>();
    for (let i = 0; ; i++) {
        const key = legacyDynamicPropertyChunkKey(id, i);
        if (i >= chunks.length && world.getDynamicProperty(key) === undefined) break;
        changes.set(key, undefined);
    }
    changes.set(legacyDynamicPropertyMetaKey(id), undefined);
    commitNativeProperties(changes);
}

export function getDynamicProperty(id: any): string | undefined {
    const { meta, chunks } = readNativeProperty(id);
    if (chunks.length === 0) return undefined;
    if (meta === undefined) world.setDynamicProperty(legacyDynamicPropertyMetaKey(id), JSON.stringify({ chunks: chunks.length }));
    return chunks.join('');
}

/**
 * 
 * @returns {string[]}
 */
export function getDynamicPropertyIds() {
    const inputArray = world.getDynamicPropertyIds();
    const pattern = /^dyp#(.+)#dy\d+$/;
    const result = new Set<string>();

    inputArray.forEach(item => {
        const match = item.match(pattern);
        if (match) result.add(match[1]);
    });

    return [...result];
}

/**
 * 名前空間の動的プロパティを消す。切り離し後の後始末専用。
 *
 * 写しへ移した後も動的プロパティ側には元の値が残り続ける。
 * ストアの総量が減らないと毎分の書き戻し費用も減らないため、
 * 移し終えたものを消す必要がある。
 *
 * 一度に全部消すと 1 tick を占有するので、少しずつ呼ぶ前提。
 * ids 一覧は消した分だけ縮めるので、途中で止めても不整合にならない。
 *
 * @param name 名前空間
 * @param limit 1 回で消す最大件数
 */
export function purgeNamespace(name: string, limit: number): { removed: number; remaining: number } {
    const ids = readCollectionIds(name);
    if (ids.length === 0) return { removed: 0, remaining: 0 };

    const take = ids.slice(0, Math.max(1, limit));
    for (const id of take) {
        deleteDynamicProperty(legacyCollectionEntryKey(name, `${id}`));
    }
    const rest = ids.slice(take.length);
    setDynamicProperty(legacyCollectionIdsKey(name), JSON.stringify(rest));
    return { removed: take.length, remaining: rest.length };
}

/**
 * 切り離し中でも動的プロパティへ確実に書く。
 *
 * Core へ送れない分の退避先。ここへ残しておけば、次回の写し読み込み時に
 * 「未送信の書き込み」として拾い直せる (recoverLeftovers)。
 * 捨てるより残す方を選ぶための出口。
 */
export function forceWriteEntry(name: string, key: string, value: string | null): void {
    writeCollectionEntry(name, key, value);
}

/**
 * 名前空間に残っている動的プロパティを取り出す。
 *
 * 切り離し後にここへ値が残っているのは、Core へ送れなかった書き込みだけ。
 * 写しの読み込み後に拾い直して Core へ送るために使う。
 */
export function dpEntries(name: string, limit: number): Array<{ key: string; value: string }> {
    const ids = readCollectionIds(name);
    const out: Array<{ key: string; value: string }> = [];
    for (const id of ids.slice(0, Math.max(1, limit))) {
        const value = getDynamicProperty(legacyCollectionEntryKey(name, `${id}`));
        if (typeof value === "string") out.push({ key: `${id}`, value });
    }
    return out;
}
