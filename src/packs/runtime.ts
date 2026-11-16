/**
 * 分割版 (MakeCountryLite と機能パック) で、差し込み口・読み取り口を scriptevent でつなぐ。
 * フル版では使わない。
 */
import { system, world } from "@minecraft/server";
import { emitBridgeEvent, initBridge, isPackPresent, onBridgeEvent, onPackPresence } from "@/shared/bridge/bridge.js";
import { HOOKS, VALUES, callHook, computeValue, deserializeHookArgs, provideHook, serializeHookArgs, setRemoteValueReader, type HookName, type ValueName } from "@/shared/hooks.js";

/** 分割版では転送しない差し込み口 (フル版の中だけで使うもの)。 */
const LOCAL_ONLY_HOOKS = new Set<HookName>(["life.ensurePlayerData"]);

/** 覚えている値を古いとみなすまでのミリ秒。 */
const VALUE_TTL_MS = 10_000;

/** Lite (本体) として起動する。 */
export function setupLiteRuntime(version: string): void {
    initBridge("lite", version);

    // 機能パックの差し込み口: そのパックが起動していれば転送する
    for (const [name, owner] of Object.entries(HOOKS) as [HookName, string][]) {
        if (owner === "lite" || LOCAL_ONLY_HOOKS.has(name)) continue;
        provideHook(name, (...args) => emitBridgeEvent("hook", { name, args: serializeHookArgs(args) }), () => isPackPresent(owner));
    }

    // 機能パックの値: 受け取った値を覚えておき、古ければ裏で更新を依頼する
    const cache = new Map<string, { value: unknown; at: number }>();
    const requested = new Map<string, number>();
    setRemoteValueReader((name, key) => {
        const owner = VALUES[name];
        if (!isPackPresent(owner)) return undefined;
        const id = `${name}\0${key}`;
        const hit = cache.get(id);
        const now = Date.now();
        if ((!hit || now - hit.at > VALUE_TTL_MS) && now - (requested.get(id) ?? 0) > 1000) {
            requested.set(id, now);
            emitBridgeEvent("value.request", { name, key });
        }
        return hit?.value;
    });
    onBridgeEvent("value.update", data => {
        if (!data || typeof data.name !== "string" || !(data.name in VALUES)) return;
        cache.set(`${data.name}\0${String(data.key ?? "")}`, { value: data.value, at: Date.now() });
    });
    onPackPresence((pack, joined) => {
        if (joined) return;
        for (const key of cache.keys()) if (VALUES[key.split("\0")[0] as ValueName] === pack.pack) cache.delete(key);
    });

    // 機能パックからの差し込み口の呼び出し (例: 機能パックの画面からメニューへ戻る)
    serveHooks("lite");
}

/** 機能パックとして起動する。 */
export function setupModuleRuntime(pack: string, version: string): void {
    initBridge(pack, version);
    serveHooks(pack);

    // Lite から値を求められたら、自分のパック内で計算して返す
    onBridgeEvent("value.request", data => {
        if (!data || typeof data.name !== "string" || VALUES[data.name as ValueName] !== pack) return;
        const key = String(data.key ?? "");
        let value: unknown;
        try { value = computeValue(data.name, key); } catch (error) { console.warn(`[MakeCountry ${pack}] value ${data.name}: ${error}`); return; }
        emitBridgeEvent("value.update", { name: data.name, key, value });
    });

    // 本体 (Lite) の差し込み口: Lite が起動していれば転送する
    for (const [name, owner] of Object.entries(HOOKS) as [HookName, string][]) {
        if (owner !== "lite") continue;
        provideHook(name, (...args) => emitBridgeEvent("hook", { name, args: serializeHookArgs(args) }), () => isPackPresent("lite"));
    }

    // Lite が入っていないときはプレイヤーに知らせる
    world.afterEvents.playerSpawn.subscribe(({ player, initialSpawn }) => {
        if (!initialSpawn) return;
        system.runTimeout(() => {
            if (!player.isValid || isPackPresent("lite")) return;
            player.sendMessage({ translate: "makecountry.module.lite_missing", with: { rawtext: [{ translate: `makecountry.module.${pack}` }] } });
        }, 200);
    });
}

/** 他のパックから転送されてきた、このパックの差し込み口の呼び出しを実行する。 */
function serveHooks(pack: string): void {
    onBridgeEvent("hook", data => {
        if (!data || typeof data.name !== "string" || HOOKS[data.name as HookName] !== pack || !Array.isArray(data.args)) return;
        const args = deserializeHookArgs(data.args);
        // プレイヤーが抜けた・ブロックが読み込まれていないなどで引数が欠けたら実行しない
        if (args.some((arg, i) => arg === undefined && data.args[i] !== undefined && data.args[i] !== null)) return;
        callHook(data.name as HookName, ...args);
    });
}
