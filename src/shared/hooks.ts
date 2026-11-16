/**
 * Lite (本体) から機能パックの処理を呼ぶための差し込み口。
 *
 * - フル版: 機能のコードが provideHook で自分の処理を登録し、本体は callHook で直接呼ぶ。
 * - 分割版: 本体 (Lite) は機能パックが起動していれば scriptevent で転送する処理を登録し、
 *           機能パック側は受け取ったら自分のパック内の callHook で実際の処理を呼ぶ。
 *
 * 引数のプレイヤー・ブロックは転送できる形 (ID・座標) に直してから送る。
 */
import { Block, Player, world } from "@minecraft/server";

/** 差し込み口の名前と、それを持つパック。 */
export const HOOKS = {
    /** 骨粉などで作物を育てた (職業: 庭師の報酬) */
    "jobs.growthPlant": "jobs",
    /** 魚図鑑を開く */
    "fishing.openEncyclopedia": "fishing",
    /** 二つ名の画面を開く */
    "life.openPenName": "life",
    /** 結婚の画面を開く */
    "life.openMarriage": "life",
    /** プレイヤーデータに結婚・懸賞金の項目を用意する (フル版のみ。分割版では生活パックが自分で持つ) */
    "life.ensurePlayerData": "life",
    /** プレイヤー ID が変わった (再参加などで ID が付け替わった) */
    "life.migratePlayerId": "life",
    /** メニューに戻る (機能パックの画面から本体のメニューへ) */
    "lite.openMainMenu": "lite",
} as const;
export type HookName = keyof typeof HOOKS;

type Handler = (...args: any[]) => void;
const handlers = new Map<string, Handler>();
const availability = new Map<string, () => boolean>();

/** 差し込み口に処理を登録する。available を渡すと、使えるかどうかをその都度判定する。 */
export function provideHook(name: HookName, handler: Handler, available?: () => boolean): void {
    handlers.set(name, handler);
    if (available) availability.set(name, available); else availability.delete(name);
}

/** 差し込み口が使えるか (メニューにボタンを出すかどうかなど)。 */
export function hasHook(name: HookName): boolean {
    if (!handlers.has(name)) return false;
    const check = availability.get(name);
    return check ? check() : true;
}

/** 差し込み口を呼ぶ。使えなければ false。 */
export function callHook(name: HookName, ...args: any[]): boolean {
    if (!hasHook(name)) return false;
    try {
        handlers.get(name)!(...args);
    } catch (error) {
        console.warn(`[MakeCountry hook] ${name}: ${error instanceof Error ? error.message : error}`);
    }
    return true;
}

/**
 * Lite が表示などのために、機能パックの値をその場で読むための読み取り口。
 *
 * - フル版: 機能のコードが provideValue で計算する関数を登録し、readValue はその場で計算する。
 * - 分割版: Lite は機能パックから受け取った値を覚えておき、それを返す。
 *           古くなった値・まだ無い値は、裏で機能パックに更新を依頼する (remote-values.ts)。
 */
export const VALUES = {
    /** 職業ごとの報酬ブースト一覧 */
    "jobs.buffs": "jobs",
    /** 魚のランキング看板の内容 (キー: 魚の ID) */
    "fishing.board": "fishing",
    /** 配偶者のプレイヤー ID (キー: プレイヤー ID) */
    "life.spouseId": "life",
    /** 配偶者の名前 (キー: プレイヤー ID) */
    "life.spouseName": "life",
    /** 懸賞金がかかっていて攻撃してよい相手か (キー: 攻撃される側のプレイヤー ID) */
    "life.isBountyTarget": "life",
} as const;
export type ValueName = keyof typeof VALUES;

type ValueProvider = (key: string) => unknown;
const valueProviders = new Map<string, ValueProvider>();
let remoteReader: ((name: ValueName, key: string) => unknown) | undefined;

/** 値を計算する関数を登録する (その値を持つパック内で)。 */
export function provideValue(name: ValueName, provider: ValueProvider): void {
    valueProviders.set(name, provider);
}

/** 値を持つパック内で、その場で計算する。登録が無ければ undefined。 */
export function computeValue(name: string, key: string): unknown {
    const provider = valueProviders.get(name);
    return provider ? provider(key) : undefined;
}

/** 分割版の Lite が、覚えている値を返す読み取り方を差し込む。 */
export function setRemoteValueReader(reader: (name: ValueName, key: string) => unknown): void {
    remoteReader = reader;
}

/** 値を読む。手元に計算する関数があればその場で計算し、無ければ覚えている値。どちらも無ければ fallback。 */
export function readValue<T>(name: ValueName, key: string, fallback: T): T {
    try {
        if (valueProviders.has(name)) return (computeValue(name, key) as T) ?? fallback;
        return (remoteReader?.(name, key) as T) ?? fallback;
    } catch (error) {
        console.warn(`[MakeCountry value] ${name}: ${error instanceof Error ? error.message : error}`);
        return fallback;
    }
}

/** scriptevent で送れる形に直す。 */
export function serializeHookArgs(args: any[]): unknown[] {
    return args.map(arg => {
        if (arg instanceof Player) return { $player: arg.id };
        if (arg instanceof Block) return { $block: { dimension: arg.dimension.id, x: arg.location.x, y: arg.location.y, z: arg.location.z } };
        return arg;
    });
}

/** serializeHookArgs で直したものを元に戻す。プレイヤーがいない・ブロックが読み込まれていなければ undefined。 */
export function deserializeHookArgs(args: unknown[]): any[] {
    return args.map(arg => {
        if (arg && typeof arg === "object") {
            const value = arg as Record<string, any>;
            if (typeof value.$player === "string") return world.getEntity(value.$player);
            if (value.$block && typeof value.$block === "object") {
                const { dimension, x, y, z } = value.$block;
                try { return world.getDimension(dimension).getBlock({ x, y, z }); } catch { return undefined; }
            }
        }
        return arg;
    });
}
