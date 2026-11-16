/**
 * 機能パック (分割版) から Lite のお金を動かす。お金は Lite のプレイヤーデータにある。
 *
 * - debitMoney: 引き落とし。残高が足りなければ false。依頼には ID を付け、Lite は同じ ID を一度しか処理しない
 * - creditMoney: 入金。送信待ちとしてこのパックに保存し、Lite が受け取るまで送り直す (二重には入金されない)
 * - viewMoney / viewDays: 表示・判定用に Lite がスコアボードへ書き出した値 (オンラインのプレイヤーのみ)
 */
import { system, world, type Entity } from "@minecraft/server";
import { isPackPresent, rpc } from "@/shared/bridge/bridge.js";

export const MONEY_VIEW_OBJECTIVE = "mc_money_view";
export const DAYS_VIEW_OBJECTIVE = "mc_days_view";

const OUTBOX = "mc:credit_outbox#";
const EXPIRE_MS = 30 * 24 * 60 * 60 * 1000;
const inFlight = new Set<string>();
let sequence = 0;

const newId = () => `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.floor(Math.random() * 0x100000000).toString(36)}`;

/** Lite に引き落としを依頼する。成功なら true、残高不足・失敗なら false。 */
export function debitMoney(playerId: string, amount: number, reason: string): Promise<boolean> {
    return rpc<boolean>("lite", "economy.debit", { id: newId(), playerId, amount, reason }, 200).catch(() => false);
}

/** Lite への入金を確実に行う (送信待ちに保存して送る)。 */
export function creditMoney(playerId: string, amount: number, reason: string): void {
    if (!(amount > 0)) return;
    const id = newId();
    try {
        world.setDynamicProperty(`${OUTBOX}${id}`, JSON.stringify({ id, playerId, amount, reason, createdAt: Date.now() }));
    } catch {
        console.warn(`[MakeCountry] credit could not be queued: ${reason} ${amount} -> ${playerId}`);
        return;
    }
    flushCredits();
}

/** 送信待ちの入金を Lite へ送る。 */
export function flushCredits(): void {
    if (!isPackPresent("lite")) return;
    const now = Date.now();
    for (const key of world.getDynamicPropertyIds()) {
        if (!key.startsWith(OUTBOX)) continue;
        let entry: any;
        try { entry = JSON.parse(String(world.getDynamicProperty(key))); } catch { world.setDynamicProperty(key, undefined); continue; }
        if (!entry?.id || now - Number(entry.createdAt) > EXPIRE_MS) { world.setDynamicProperty(key, undefined); continue; }
        if (inFlight.has(entry.id)) continue;
        inFlight.add(entry.id);
        rpc<boolean>("lite", "economy.credit", { id: entry.id, playerId: entry.playerId, amount: entry.amount, reason: entry.reason }, 200)
            .then(ok => { if (ok) world.setDynamicProperty(key, undefined); })
            .catch(() => { /* 次の回に送り直す */ })
            .finally(() => inFlight.delete(entry.id));
    }
}

function readView(objective: string, player: Entity): number | undefined {
    try { return world.scoreboard.getObjective(objective)?.getScore(player); } catch { return undefined; }
}
/** 表示用の所持金 (Lite が書き出したもの)。分からなければ undefined。 */
export function viewMoney(player: Entity): number | undefined { return readView(MONEY_VIEW_OBJECTIVE, player); }
/** プレイ日数 (Lite が書き出したもの)。分からなければ undefined。 */
export function viewDays(player: Entity): number | undefined { return readView(DAYS_VIEW_OBJECTIVE, player); }

world.afterEvents.worldLoad.subscribe(() => { system.runInterval(flushCredits, 100); });
