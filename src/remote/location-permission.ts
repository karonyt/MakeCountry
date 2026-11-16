/**
 * 機能パック用: 場所に対する権限の確認。土地データは Lite が持っているので、Lite に問い合わせる。
 *
 * - runAfterPermissionCheck: 必要な場所の権限を Lite に問い合わせ、答えを覚えてから fn を実行する
 * - isLocationDenied: 覚えている答えで判定する。分からないときは「禁止」として扱い、裏で問い合わせる
 *   (設置の権限は Lite がすべてのブロックについて設置時に確かめているので、ここでは確かめない)
 */
import { system, type Player } from "@minecraft/server";
import { rpc } from "@/shared/bridge/bridge.js";

export type LocationCheck = { x: number; z: number; dimension: string; permission: string };

const TTL_MS = 10_000;
const cache = new Map<string, { denied: boolean; at: number }>();
const keyOf = (playerId: string, c: LocationCheck) => `${playerId}|${c.dimension}|${Math.floor(c.x / 16)}|${Math.floor(c.z / 16)}|${c.permission}`;

function fetch(player: Player, checks: LocationCheck[]): Promise<void> {
    const unique = new Map<string, LocationCheck>();
    for (const c of checks) unique.set(keyOf(player.id, c), c);
    const list = [...unique.values()];
    if (!list.length) return Promise.resolve();
    return rpc<boolean[]>("lite", "perm.check", { playerId: player.id, checks: list }).then(result => {
        const now = Date.now();
        list.forEach((c, i) => cache.set(keyOf(player.id, c), { denied: result?.[i] !== false, at: now }));
    });
}

export function isLocationDenied(player: Player, x: number, z: number, dimension: string, permission: string): boolean {
    if (permission === "place") return false;
    const check = { x, z, dimension, permission };
    const hit = cache.get(keyOf(player.id, check));
    if (hit && Date.now() - hit.at < TTL_MS) return hit.denied;
    void fetch(player, [check]).catch(() => { /* Lite がいない: 禁止のまま */ });
    return true;
}

export function runAfterPermissionCheck(player: Player, checks: LocationCheck[], fn: () => void): void {
    fetch(player, checks)
        .catch(() => { /* 答えが無ければ isLocationDenied が禁止として扱う */ })
        .finally(() => system.run(fn));
}
