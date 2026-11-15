/**
 * MakeCountry のパック同士 (Lite と機能パック) のやり取り。
 *
 * - すべて system.sendScriptEvent で送り、ScriptEventSource.Server 以外 (プレイヤーの /scriptevent など) は無視する。
 * - 1 通 (2048 文字) に収まらないメッセージは `makecountry:chunk` で分割して送る。
 * - フル版では使わない (すべての機能が 1 つのパックにあり、直接呼び出す)。
 *
 * 詳しくは docs/dev/lite-modules.md を参照。
 */
import { ScriptEventSource, system, world } from "@minecraft/server";

export const BRIDGE_PROTOCOL = 1;

export const BRIDGE_IDS = {
    hello: "makecountry:hello",
    discover: "makecountry:discover",
    rpc: "makecountry:rpc",
    rpcResult: "makecountry:rpc_result",
    event: "makecountry:event",
    chunk: "makecountry:chunk",
} as const;

/** scriptevent 1 通の上限 (余裕を持たせる)。 */
const MESSAGE_LIMIT = 1900;
/** 依頼の返事を待つ既定のティック数 (5 秒)。 */
const DEFAULT_TIMEOUT_TICKS = 100;
/** 他のパックから名乗りが途絶えたとみなすまでの時間 (ミリ秒)。 */
const PRESENCE_TTL_MS = 5 * 60_000;

export interface PackInfo { pack: string; version: string; protocol: number; seenAt: number }
type RpcHandler = (args: any, from: string) => unknown | Promise<unknown>;
type EventHandler = (data: any, from: string) => void;
interface Pending { resolve(value: any): void; reject(error: Error): void; timer: number }
interface Assembly { total: number; parts: string[]; received: number; id: string; expires: number }

let self = "";
let selfVersion = "";
const packs = new Map<string, PackInfo>();
const rpcHandlers = new Map<string, RpcHandler>();
const eventHandlers = new Map<string, EventHandler[]>();
const presenceListeners: ((pack: PackInfo, joined: boolean) => void)[] = [];
const pending = new Map<string, Pending>();
const assemblies = new Map<string, Assembly>();
let sequence = 0;
const instance = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/** このパックの ID (`lite` / `jobs` など)。未初期化なら空文字。 */
export function selfPack(): string { return self; }

/**
 * パックの起動時に 1 回呼ぶ。worldLoad 後に名乗り、他のパックにも名乗りを求める。
 */
export function initBridge(pack: string, version: string): void {
    if (self) throw new Error(`bridge already initialized as ${self}`);
    self = pack;
    selfVersion = version;
    world.afterEvents.worldLoad.subscribe(() => {
        system.run(() => {
            announce();
            send(BRIDGE_IDS.discover, { from: self });
        });
    });
    // 他のパックが後から読み込まれた (/reload など) 場合に備えて定期的に名乗る
    system.runInterval(() => announce(), 20 * 60);
}

/** 依頼を受け付ける。 */
export function onRpc(method: string, handler: RpcHandler): void {
    rpcHandlers.set(method, handler);
}

/** 通知を受け取る。 */
export function onBridgeEvent(name: string, handler: EventHandler): void {
    const list = eventHandlers.get(name) ?? [];
    list.push(handler);
    eventHandlers.set(name, list);
}

/** 他のパックの起動・停止を受け取る。 */
export function onPackPresence(listener: (pack: PackInfo, joined: boolean) => void): void {
    presenceListeners.push(listener);
}

/** 指定したパックが起動しているか。 */
export function isPackPresent(pack: string): boolean {
    const info = packs.get(pack);
    return !!info && Date.now() - info.seenAt < PRESENCE_TTL_MS;
}

/** 起動している他のパックの一覧。 */
export function presentPacks(): PackInfo[] {
    return [...packs.values()].filter(info => Date.now() - info.seenAt < PRESENCE_TTL_MS);
}

/** 指定したパックに依頼し、返事を待つ。相手がいない・時間切れのときは失敗する。 */
export function rpc<T = unknown>(to: string, method: string, args: unknown = {}, timeoutTicks = DEFAULT_TIMEOUT_TICKS): Promise<T> {
    if (!self) return Promise.reject(new Error("bridge not initialized"));
    const id = `${instance}-${++sequence}`;
    return new Promise<T>((resolve, reject) => {
        const timer = system.runTimeout(() => {
            pending.delete(id);
            reject(new Error(`rpc timeout: ${to}.${method}`));
        }, timeoutTicks);
        pending.set(id, { resolve, reject, timer });
        send(BRIDGE_IDS.rpc, { id, from: self, to, method, args });
    });
}

/** 全パックに通知する (返事は無い)。 */
export function emitBridgeEvent(name: string, data: unknown = {}): void {
    if (!self) return;
    send(BRIDGE_IDS.event, { from: self, name, data });
}

function announce(): void {
    if (!self) return;
    send(BRIDGE_IDS.hello, { pack: self, version: selfVersion, protocol: BRIDGE_PROTOCOL });
}

function send(id: string, payload: unknown): void {
    const text = JSON.stringify(payload);
    if (text.length <= MESSAGE_LIMIT) {
        system.sendScriptEvent(id, text);
        return;
    }
    // 長いメッセージは分割する。受け取った側で組み立ててから元の ID として処理する
    const chunkId = `${instance}-c${++sequence}`;
    const size = MESSAGE_LIMIT - 200;
    const total = Math.ceil(text.length / size);
    for (let seq = 0; seq < total; seq++) {
        system.sendScriptEvent(BRIDGE_IDS.chunk, JSON.stringify({ id: chunkId, target: id, seq, total, data: text.slice(seq * size, (seq + 1) * size) }));
    }
}

function receive(id: string, message: unknown): void {
    if (!message || typeof message !== "object") return;
    const m = message as Record<string, any>;
    switch (id) {
        case BRIDGE_IDS.hello: {
            if (typeof m.pack !== "string" || m.pack === self) return;
            const joined = !isPackPresent(m.pack);
            const info: PackInfo = { pack: m.pack, version: String(m.version ?? ""), protocol: Number(m.protocol) || 0, seenAt: Date.now() };
            packs.set(m.pack, info);
            if (joined) for (const listener of presenceListeners) safe(() => listener(info, true));
            return;
        }
        case BRIDGE_IDS.discover:
            if (m.from !== self) announce();
            return;
        case BRIDGE_IDS.rpc: {
            if (m.to !== self || typeof m.id !== "string" || typeof m.method !== "string") return;
            const handler = rpcHandlers.get(m.method);
            const reply = (ok: boolean, value: unknown) => send(BRIDGE_IDS.rpcResult, ok ? { id: m.id, to: m.from, ok, value } : { id: m.id, to: m.from, ok, error: String(value) });
            if (!handler) { reply(false, `unknown method: ${m.method}`); return; }
            Promise.resolve().then(() => handler(m.args, String(m.from))).then(value => reply(true, value), error => reply(false, error instanceof Error ? error.message : error));
            return;
        }
        case BRIDGE_IDS.rpcResult: {
            if (m.to !== self) return;
            const waiting = pending.get(m.id);
            if (!waiting) return;
            pending.delete(m.id);
            system.clearRun(waiting.timer);
            if (m.ok) waiting.resolve(m.value); else waiting.reject(new Error(String(m.error ?? "rpc failed")));
            return;
        }
        case BRIDGE_IDS.event: {
            if (m.from === self || typeof m.name !== "string") return;
            for (const handler of eventHandlers.get(m.name) ?? []) safe(() => handler(m.data, String(m.from)));
            return;
        }
        case BRIDGE_IDS.chunk: {
            if (typeof m.id !== "string" || typeof m.target !== "string") return;
            const now = Date.now();
            for (const [key, a] of assemblies) if (a.expires < now) assemblies.delete(key);
            const total = Number(m.total), seq = Number(m.seq);
            if (!Number.isInteger(total) || total < 1 || total > 512 || !Number.isInteger(seq) || seq < 0 || seq >= total) return;
            const a = assemblies.get(m.id) ?? { id: m.target, total, parts: new Array<string>(total), received: 0, expires: now + 30_000 };
            if (a.parts[seq] === undefined) { a.parts[seq] = String(m.data ?? ""); a.received++; }
            assemblies.set(m.id, a);
            if (a.received < a.total) return;
            assemblies.delete(m.id);
            try { receive(a.id, JSON.parse(a.parts.join(""))); } catch { /* broken message */ }
            return;
        }
    }
}

function safe(fn: () => void): void {
    try { fn(); } catch (error) { console.warn(`[MakeCountry bridge] ${error instanceof Error ? error.message : error}`); }
}

system.afterEvents.scriptEventReceive.subscribe(event => {
    if (!self) return;
    if (event.sourceType !== ScriptEventSource.Server || event.sourceEntity || event.sourceBlock || event.initiator) return;
    let message: unknown;
    try { message = JSON.parse(event.message); } catch { return; }
    receive(event.id, message);
}, { namespaces: ["makecountry"] });
