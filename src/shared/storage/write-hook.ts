/**
 * 保存処理の差し込み口。
 *
 * 保存の実装 (storage 層) が plugins 層を直接呼ぶと依存が逆流するため、
 * ここに口だけを置き、実際の中身は plugins 側から登録する。
 * 何も登録されていなければ完全に無害で、既存の動作は変わらない。
 *
 * 書き込みの通知、読み取りの差し替え、読み取りの準備確認を扱う。
 * 読み取りの差し替えは「動的プロパティを使わず、メモリ上の写しから
 * 同期で返す」ために要る。MakeCountry の読み取りは同期前提で
 * 書かれており、非同期の問い合わせには置き換えられない。
 */

export type WriteListener = (
    namespace: string,
    key: string,
    value: string | null,
    previous?: string | null,
) => void;

/**
 * 読み取りの差し替え。
 *   string    : その値を返す
 *   null      : 「無い」ことが確定している (動的プロパティを見に行かない)
 *   undefined : この名前空間は担当外 (従来どおり動的プロパティを読む)
 */
export type ReadOverride = (namespace: string, key: string) => string | null | undefined;

/** 名前空間の全キーを返す差し替え。担当外なら undefined */
export type KeysOverride = (namespace: string) => string[] | undefined;

/** 名前空間の読み取りを確定情報として扱ってよいかを確認する */
export type StorageReadReadyChecker = (namespace: string) => boolean;

const writeListeners: WriteListener[] = [];
let writeGuard: ((namespace: string, key: string) => void) | undefined;
let batchActiveCheck: (() => boolean) | undefined;
let batchRecoveryCheck: (() => boolean) | undefined;

export function setStorageWriteGuard(guard: (namespace: string, key: string) => void): void { writeGuard = guard; }
export function assertStorageWriteAllowed(namespace: string, key: string): void { writeGuard?.(namespace, key); }
export function setStorageBatchActiveCheck(check: () => boolean): void { batchActiveCheck = check; }
export function isRecoverableBatchApplying(): boolean { return batchActiveCheck?.() === true; }
export function setStorageBatchRecoveryCheck(check: () => boolean): void { batchRecoveryCheck = check; }
export function isStorageBatchRecoveryPending(): boolean {
    try { return batchRecoveryCheck?.() === true; } catch { return true; }
}
let readOverrideFn: ReadOverride | undefined;
let keysOverrideFn: KeysOverride | undefined;
let storageReadReadyFn: StorageReadReadyChecker | undefined;

/** 書き込みの通知先を足す。複数登録できる */
export function addWriteListener(listener: WriteListener): void {
    if (!writeListeners.includes(listener)) writeListeners.push(listener);
}

export function removeWriteListener(listener: WriteListener): void {
    const i = writeListeners.indexOf(listener);
    if (i >= 0) writeListeners.splice(i, 1);
}

export function setReadOverride(fn: ReadOverride | undefined): void {
    readOverrideFn = fn;
}

export function setKeysOverride(fn: KeysOverride | undefined): void {
    keysOverrideFn = fn;
}

/** 読み取り準備の確認先を登録する。未指定なら従来の扱いへ戻す。 */
export function setStorageReadReady(check?: StorageReadReadyChecker): void {
    storageReadReadyFn = check;
}

/** 未登録なら準備済み。初期読込中や確認失敗を「記録が無い」と判定しない。 */
export function storageReadReady(namespace: string): boolean {
    if (!storageReadReadyFn) return true;
    try { return storageReadReadyFn(namespace) === true; }
    catch { return false; }
}

/**
 * 保存が起きたことを知らせる。
 * ゲームの処理を止めないよう、登録側は必ず即座に返すこと。
 */
export function notifyWrite(
    namespace: string,
    key: string,
    value: string | null,
    previous?: string | null,
): void {
    for (const listener of writeListeners) {
        try {
            listener(namespace, key, value, previous);
        } catch {
            // 通知の失敗でゲーム側の保存を巻き添えにしない
        }
    }
}

/** 読み取りを差し替える。担当外なら undefined が返り、呼び出し元は従来どおり読む */
export function readOverride(namespace: string, key: string): string | null | undefined {
    if (!readOverrideFn) return undefined;
    try {
        return readOverrideFn(namespace, key);
    } catch {
        // 差し替えが壊れても読み取り自体は止めない。従来の経路へ落ちる
        return undefined;
    }
}

/** キー一覧を差し替える。担当外なら undefined */
export function keysOverride(namespace: string): string[] | undefined {
    if (!keysOverrideFn) return undefined;
    try {
        return keysOverrideFn(namespace);
    } catch {
        return undefined;
    }
}

/** その名前空間を写しが受け持っているか */
export type NamespaceOwner = (namespace: string) => boolean;

let ownerFn: NamespaceOwner | undefined;

/**
 * 切り離しモード。
 *
 * 立てると、写しが受け持つ名前空間では動的プロパティへ書かなくなる。
 * ストアが縮む代わりに、保存先が Core だけになる。
 * 読み込みが完了していない名前空間では決して立てないこと
 * (書き先が無くなり、データが消える)。
 */
let authoritative = false;

export function setNamespaceOwner(fn: NamespaceOwner | undefined): void {
    ownerFn = fn;
}

export function setAuthoritative(on: boolean): void {
    authoritative = on;
}

export function isAuthoritative(): boolean {
    return authoritative;
}

/** 動的プロパティへの書き込みを省いてよいか */
export function shouldSkipDynamicProperty(namespace: string): boolean {
    if (!authoritative || !ownerFn) return false;
    try {
        return ownerFn(namespace);
    } catch {
        // 判定できないときは必ず書く。消えるより二重に持つ方が安全
        return false;
    }
}
