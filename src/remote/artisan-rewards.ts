/**
 * 料理・生産パック用の制作報酬 (職人系: 料理人・化学者・鍛冶職人)。
 *
 * フル版では「完成品を渡す」と「報酬を払う」を同じパック内で確実にそろえていた。
 * 分割版では報酬は職業パックが払うので、
 *   1. 完成品はすぐ渡す
 *   2. 報酬はこのパックに送信待ちとして保存し、職業パックへ送る
 *   3. 職業パックが受け取ったら (返事が来たら) 消す。届かなければ後で送り直す
 * という流れにする。職業パックは同じ ID を一度しか受け付けないので、送り直しても二重には払われない。
 * 職業パックが入っていなければ報酬は無し (送信待ちは 7 日で消える)。
 */
import { Player, system, world } from "@minecraft/server";
import jobs_config from "@/config/jobs.js";
import { isPackPresent, rpc } from "@/shared/bridge/bridge.js";

type ArtisanJob = "chef" | "chemist" | "blacksmith";
export type ArtisanRewardPlan = {
    job: ArtisanJob;
    money: number;
    xp: number;
    rank: string;
    display: "cooking" | "mixer" | "chemistry" | "smelting";
};
export type ArtisanCraftSession = {
    artisanRewardPlan?: ArtisanRewardPlan | null;
    artisanRewardId?: string;
    artisanCraftStarted?: boolean;
};
type Outgoing = { id: string; playerId: string; plan: ArtisanRewardPlan; createdAt: number };

const PREFIX = "mc:artisan_outbox#";
const EXPIRE_MS = 7 * 24 * 60 * 60 * 1000;
const inFlight = new Set<string>();
let sequence = 0;

function save(entry: Outgoing) {
    world.setDynamicProperty(`${PREFIX}${entry.id}`, JSON.stringify(entry));
}
function remove(id: string) {
    try { world.setDynamicProperty(`${PREFIX}${id}`, undefined); } catch { /* retry on next flush */ }
}
function pending(): Outgoing[] {
    const list: Outgoing[] = [];
    for (const key of world.getDynamicPropertyIds()) {
        if (!key.startsWith(PREFIX)) continue;
        try {
            const value = JSON.parse(String(world.getDynamicProperty(key)));
            if (value && typeof value.id === "string" && typeof value.playerId === "string" && value.plan) list.push(value);
            else world.setDynamicProperty(key, undefined);
        } catch { world.setDynamicProperty(key, undefined); }
    }
    return list.sort((a, b) => a.createdAt - b.createdAt);
}

/** 送信待ちの報酬を職業パックへ送る。 */
export function flushArtisanRewards() {
    let list: Outgoing[];
    try { list = pending(); } catch { return; }
    const now = Date.now();
    for (const entry of list) {
        if (now - entry.createdAt > EXPIRE_MS) { remove(entry.id); continue; }
        if (inFlight.has(entry.id) || !isPackPresent("jobs")) continue;
        inFlight.add(entry.id);
        rpc<boolean>("jobs", "jobs.artisanReward", { id: entry.id, playerId: entry.playerId, plan: entry.plan })
            .then(accepted => { if (accepted) remove(entry.id); })
            .catch(() => { /* 次の flush で送り直す */ })
            .finally(() => inFlight.delete(entry.id));
    }
}

/** 完成品を作り (produce)、報酬を職業パックへ送る。完成品を渡せたら true。 */
export function runArtisanCraft(player: Player, session: ArtisanCraftSession, reward: () => ArtisanRewardPlan | undefined, produce: () => void): boolean {
    if (session.artisanCraftStarted || !player.isValid) return false;
    if (session.artisanRewardPlan === undefined) session.artisanRewardPlan = reward() ?? null;
    const plan = session.artisanRewardPlan;
    const paid = !!plan && jobs_config.validity && player.hasTag(`mcjobs_${plan.job}`);
    session.artisanCraftStarted = true;
    produce();
    if (paid && plan) {
        const id = `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.floor(Math.random() * 0x100000000).toString(36)}`;
        try {
            save({ id, playerId: player.id, plan, createdAt: Date.now() });
            session.artisanRewardId = id;
        } catch {
            console.warn("[MakeCountry] artisan reward could not be queued");
        }
        flushArtisanRewards();
    }
    return true;
}

/** 分割版では作る前に報酬を予約しないので、取り消すものは無い。 */
export function cancelArtisanCraft(_session: ArtisanCraftSession | undefined) {}

export function artisanRewardStatus() {
    let count = 0;
    try { count = pending().length; } catch { /* storage unavailable */ }
    return { receipts: count, pending: count, blocked: 0, dirty: 0, invalidReceipts: 0, storageFailures: 0 };
}

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(flushArtisanRewards, 100);
});
