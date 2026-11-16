/**
 * MakeCountryLite が機能パックからの依頼を受け付ける処理 (分割版のみ)。
 *
 * - 国家ランクの書き出し: 各プレイヤーの所属国の国家ランクをスコアボード `mc_country_lv` に書く
 * - jobs.playerInfo: 職業画面に出す「今日の稼ぎ」
 * - jobs.pay: 職業報酬の支払い (1 日の上限を当てはめてお金を足す)。同じ ID は一度しか払わない
 */
import { Player, system, world } from "@minecraft/server";
import { onRpc } from "@/shared/bridge/bridge.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { applyDailyLimit } from "@/domain/jobs/daily-limit.js";
import { getPlayerCountryLevel } from "@/domain/country/player-country-level.js";
import { COUNTRY_LEVEL_OBJECTIVE } from "@/remote/player-country-level.js";
import { CheckPermissionFromLocation } from "@/shared/utils/minecraft.js";

const JOB_PAY_LEDGER = "mc:jobpay#";
const LEDGER_KEEP_MS = 7 * 24 * 60 * 60 * 1000;

// ---- 国家ランクの書き出し ----
function mirrorCountryLevel(player: Player) {
    try {
        const board = world.scoreboard.getObjective(COUNTRY_LEVEL_OBJECTIVE) ?? world.scoreboard.addObjective(COUNTRY_LEVEL_OBJECTIVE);
        const value = getPlayerCountryLevel(player) ?? -1;
        if (board.getScore(player) !== value) board.setScore(player, value);
    } catch { /* プレイヤーデータがまだ無いときなど */ }
}
world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => { for (const player of world.getPlayers()) mirrorCountryLevel(player); }, 100);
});
world.afterEvents.playerSpawn.subscribe(({ player }) => system.runTimeout(() => { if (player.isValid) mirrorCountryLevel(player); }, 40));

// ---- 職業 ----
function readPlayerData(db: DynamicProperties, playerId: string): any | undefined {
    const raw = db.get(`player_${playerId}`);
    if (!raw) return undefined;
    try { return JSON.parse(raw); } catch { return undefined; }
}

onRpc("jobs.playerInfo", (args: any) => {
    const data = readPlayerData(new DynamicProperties("player"), String(args?.playerId ?? ""));
    return { playerData: { dailyEarnings: data?.dailyEarnings ?? {} } };
});

type JobPayResult = { paid: number; dailyEarning: number; playerData: { dailyEarnings: any } };

onRpc("jobs.pay", (args: any): JobPayResult => {
    const id = String(args?.id ?? "");
    const playerId = String(args?.playerId ?? "");
    const job = String(args?.job ?? "");
    const money = Number(args?.money);
    const dailyLimit = Number(args?.dailyLimit);
    if (!/^[a-z0-9-]{1,100}$/.test(id) || !playerId || !job || !Number.isFinite(money) || money < 0 || !Number.isFinite(dailyLimit)) {
        throw new Error("invalid_payment");
    }
    // 同じ ID は前回の結果を返す (送り直しで二重に払わない)
    const done = world.getDynamicProperty(`${JOB_PAY_LEDGER}${id}`);
    if (typeof done === "string") return JSON.parse(done).result;

    const db = new DynamicProperties("player");
    const data = readPlayerData(db, playerId);
    if (!data || !Number.isFinite(data.money)) throw new Error("player_record_missing");
    const paid = applyDailyLimit(data, job, money, dailyLimit);
    if (paid > 0) {
        const next = data.money + paid;
        if (!Number.isFinite(next)) throw new Error("player_money_overflow");
        data.money = next;
    }
    const result: JobPayResult = { paid, dailyEarning: data.dailyEarnings?.[job]?.amount ?? 0, playerData: { dailyEarnings: data.dailyEarnings ?? {} } };
    // 台帳を先に書き、そのあとお金を保存する。保存に失敗したら台帳も消して失敗を返す
    world.setDynamicProperty(`${JOB_PAY_LEDGER}${id}`, JSON.stringify({ at: Date.now(), result }));
    try {
        db.set(`player_${playerId}`, JSON.stringify(data));
    } catch (error) {
        world.setDynamicProperty(`${JOB_PAY_LEDGER}${id}`, undefined);
        throw error;
    }
    return result;
});

// 古い台帳を消す
world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        const now = Date.now();
        for (const key of world.getDynamicPropertyIds()) {
            if (!key.startsWith(JOB_PAY_LEDGER)) continue;
            try {
                const entry = JSON.parse(String(world.getDynamicProperty(key)));
                if (!(now - Number(entry?.at) < LEDGER_KEEP_MS)) world.setDynamicProperty(key, undefined);
            } catch { world.setDynamicProperty(key, undefined); }
        }
    }, 20 * 60 * 10);
});

// ---- 場所の権限 ----
// 機能パックからの問い合わせ: 各場所でその操作が禁止されているか (true = 禁止)
onRpc("perm.check", (args: any) => {
    const player = world.getEntity(String(args?.playerId ?? ""));
    if (!(player instanceof Player)) throw new Error("player_not_found");
    const checks: any[] = Array.isArray(args?.checks) ? args.checks.slice(0, 256) : [];
    return checks.map(c => !!CheckPermissionFromLocation(player, Number(c?.x), Number(c?.z), String(c?.dimension ?? ""), String(c?.permission ?? "")));
});
