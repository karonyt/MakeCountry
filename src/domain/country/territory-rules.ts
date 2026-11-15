/**
 * 建国規約 第3条 (2026-10-06 改正) のうち、取る前に止められるものをここで止める。
 *  - 第3項: 建国・新しい飛び地は、他国の領土から距離 5 以上 (間に空き地 4 チャンク以上) 離す
 *  - 第4項: 飛び地を新しく作れるのは、今ある飛び地が 2 か所以下のときだけ
 * 本土や今ある飛び地から続けて広げる分は止めない (広げた先で他国と接するのは早い者勝ち)。
 * Earth の overworld だけに効かせる。資源鯖には適用しない。
 */

/** 他国の領土からこの距離 (チェビシェフ距離) 未満には、建国も新しい飛び地も置けない */
export const NEW_PIECE_MIN_DISTANCE = 5;
/** 今ある飛び地がこの数以上なら、新しい飛び地は作れない */
export const MAX_ENCLAVES_BEFORE_NEW = 3;
/** 島と海の改正案: 建国直後の保護の長さと距離 (その国の領土からこの距離以内を、ほかの国は取れない) */
export const NEWCOMER_PROTECTION_MS = 3 * 24 * 60 * 60 * 1000;
export const NEWCOMER_PROTECTION_DISTANCE = 5;
/** 島と海の改正案: 海チャンクは自国の陸チャンクからこの距離以内だけ */
export const SEA_REACH = 20;

export type Cell = [number, number];
/** (x, z) のチャンクを持っている国の ID。空き地なら undefined */
export type OwnerAt = (x: number, z: number) => number | undefined;

const N8: Cell[] = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
const cellKey = (x: number, z: number) => `${x},${z}`;

/** "chunk_12_-34_overworld" → [12, -34]。overworld 以外と読めないものは捨てる */
export function parseOverworldTerritories(ids: unknown): Cell[] {
    if (!Array.isArray(ids)) return [];
    const cells: Cell[] = [];
    for (const id of ids) {
        const m = typeof id === "string" ? /^chunk_(-?\d+)_(-?\d+)_(?:minecraft:)?overworld$/.exec(id) : null;
        if (m) cells.push([Number(m[1]), Number(m[2])]);
    }
    return cells;
}

/** 一続き (辺または角で接する) の塊の数 */
export function countPieces(cells: Cell[]): number {
    const remaining = new Set(cells.map(([x, z]) => cellKey(x, z)));
    let pieces = 0;
    for (const start of [...remaining]) {
        if (!remaining.delete(start)) continue;
        pieces += 1;
        const stack = [start];
        while (stack.length > 0) {
            const [x, z] = stack.pop()!.split(",").map(Number) as Cell;
            for (const [dx, dz] of N8) {
                const k = cellKey(x + dx, z + dz);
                if (remaining.delete(k)) stack.push(k);
            }
        }
    }
    return pieces;
}

/** 新しく取るチャンクの集まりが、自国の領土に (角も含めて) 接しているか */
export function touchesOwn(targets: Cell[], own: Cell[]): boolean {
    const mine = new Set(own.map(([x, z]) => cellKey(x, z)));
    return targets.some(([x, z]) => mine.has(cellKey(x, z)) ||
        N8.some(([dx, dz]) => mine.has(cellKey(x + dx, z + dz))));
}

/** 距離 NEW_PIECE_MIN_DISTANCE 未満にある他国のチャンクを 1 つ返す。無ければ undefined */
export function nearbyForeign(targets: Cell[], countryId: number | undefined, ownerAt: OwnerAt): { x: number; z: number; countryId: number } | undefined {
    const r = NEW_PIECE_MIN_DISTANCE - 1;
    const checked = new Set<string>();
    for (const [tx, tz] of targets) {
        for (let dx = -r; dx <= r; dx += 1) {
            for (let dz = -r; dz <= r; dz += 1) {
                const x = tx + dx, z = tz + dz, k = cellKey(x, z);
                if (checked.has(k)) continue;
                checked.add(k);
                const holder = ownerAt(x, z);
                if (holder !== undefined && holder !== countryId) return { x, z, countryId: holder };
            }
        }
    }
    return undefined;
}

export type Refusal = { reason: "too-close"; x: number; z: number; countryId: number }
    | { reason: "too-many-enclaves"; enclaves: number }
    | { reason: "newcomer"; countryId: number; until: number }
    | { reason: "sea-too-far"; x: number; z: number }
    | { reason: "found-on-sea" };

/** 島と海の改正案で使う材料。渡されたときだけ判定する (施行前は渡さない) */
export type IslandRules = {
    now: number;
    /** 陸チャンク (半分以上が元からある陸) か */
    isLand: (x: number, z: number) => boolean;
    /** 国の建国時刻と同盟。分からなければ undefined */
    countryMeta: (countryId: number) => { foundedAt?: number; alliance?: number[]; newcomerProtectionLifted?: boolean } | undefined;
    /** 運営が認めた例外で、海の距離を見ない場所か */
    seaReachExempt?: (countryId: number | undefined, x: number, z: number) => boolean;
};

/** 建国直後の保護 (第3項の追加): 3 日以内に建国した他国の 5 チャンク以内なら、その国を返す */
export function protectedNewcomer(targets: Cell[], countryId: number | undefined, ownerAt: OwnerAt, rules: IslandRules): { countryId: number; until: number } | undefined {
    const r = NEWCOMER_PROTECTION_DISTANCE;
    const mine = countryId === undefined ? undefined : rules.countryMeta(countryId);
    const checked = new Set<number>();
    for (const [tx, tz] of targets) {
        for (let dx = -r; dx <= r; dx += 1) {
            for (let dz = -r; dz <= r; dz += 1) {
                const holder = ownerAt(tx + dx, tz + dz);
                if (holder === undefined || holder === countryId || checked.has(holder)) continue;
                checked.add(holder);
                const meta = rules.countryMeta(holder);
                const foundedAt = meta?.foundedAt;
                if (typeof foundedAt !== "number" || !Number.isFinite(foundedAt)) continue;
                if (rules.now - foundedAt >= NEWCOMER_PROTECTION_MS) continue;
                // 運営が建国保護を外した国 (karoearth:ops_liftnewcomer)
                if (meta?.newcomerProtectionLifted === true) continue;
                // 同盟国どうしは止めない
                if (countryId !== undefined && (meta?.alliance?.includes(countryId) || mine?.alliance?.includes(holder))) continue;
                return { countryId: holder, until: foundedAt + NEWCOMER_PROTECTION_MS };
            }
        }
    }
    return undefined;
}

/** 海と島 (第2項の改正案): 海チャンクは自国の陸チャンク (同じ買い物で取る陸を含む) から SEA_REACH 以内だけ。建国は陸だけ */
export function seaRefusal(targets: Cell[], own: Cell[], founding: boolean, rules: IslandRules, countryId?: number): Refusal | undefined {
    const seaTargets = targets.filter(([x, z]) => !rules.isLand(x, z));
    if (seaTargets.length === 0) return undefined;
    if (founding) return { reason: "found-on-sea" };
    const anchors = [...own, ...targets].filter(([x, z]) => rules.isLand(x, z));
    for (const [x, z] of seaTargets) {
        if (rules.seaReachExempt?.(countryId, x, z)) continue;
        const ok = anchors.some(([ax, az]) => Math.max(Math.abs(ax - x), Math.abs(az - z)) <= SEA_REACH);
        if (!ok) return { reason: "sea-too-far", x, z };
    }
    return undefined;
}

/**
 * 取ってよいか。countryId / own が無いのは建国 (最初のチャンク)。
 * 自国に接する取得は広げているだけなので止めない。
 */
/**
 * @param capEnclaves 飛び地の数の上限 (3 か所) を当てるか。2026-10-06 の調整で、戦争ができる国 (非平和主義) だけに当てる
 */
export function checkNewTerritory(targets: Cell[], countryId: number | undefined, own: Cell[], ownerAt: OwnerAt, island?: IslandRules, capEnclaves = true): Refusal | undefined {
    if (targets.length === 0) return undefined;
    if (island) {
        const newcomer = protectedNewcomer(targets, countryId, ownerAt, island);
        if (newcomer) return { reason: "newcomer", ...newcomer };
        const sea = seaRefusal(targets, own, countryId === undefined, island, countryId);
        if (sea) return sea;
    }
    if (own.length > 0 && touchesOwn(targets, own)) return undefined;
    if (own.length > 0 && capEnclaves) {
        const enclaves = countPieces(own) - 1;
        if (enclaves >= MAX_ENCLAVES_BEFORE_NEW) return { reason: "too-many-enclaves", enclaves };
    }
    const near = nearbyForeign(targets, countryId, ownerAt);
    if (near) return { reason: "too-close", ...near };
    return undefined;
}

/** 取れなかったときに必ず添える、例外の申請先 */
export const EXCEPTION_NOTE = "\n§7事情があって例外を申請したい場合は、サポートサーバー (discord.gg/AxuCJNGK5G) のチケットへお願いします。";

/** プレイヤーに見せる文 */
export function refusalMessage(refusal: Refusal, founding: boolean): string {
    return refusalText(refusal, founding) + EXCEPTION_NOTE;
}

function refusalText(refusal: Refusal, founding: boolean): string {
    if (refusal.reason === "newcomer") {
        const hours = Math.max(1, Math.ceil((refusal.until - Date.now()) / 3_600_000));
        return `§cここはまだ取れません。建国したばかりの国（ID ${refusal.countryId}）の 5 チャンク以内です（建国規約 第3条：建国から 3 日間は保護。あと約 ${hours} 時間）。`;
    }
    if (refusal.reason === "sea-too-far") {
        return `§cこの海チャンク (チャンク ${refusal.x}, ${refusal.z}) は取れません。海は、自国の陸チャンク（陸が 13 マス以上あるチャンク）から 20 チャンク以内だけ取れます（建国規約 第3条 第2項）。`;
    }
    if (refusal.reason === "found-on-sea") {
        return "§c建国は陸チャンク（陸が 13 マス以上あるチャンク）でだけできます（建国規約 第3条 第2項）。";
    }
    if (refusal.reason === "too-many-enclaves") {
        return `§c飛び地はすでに ${refusal.enclaves} か所あります。新しい飛び地は作れません（建国規約 第3条 第4項：非平和主義の国は、今ある飛び地が 2 か所以下のときだけ作れます）。本土か今ある飛び地から続けて広げてください。`;
    }
    const what = founding ? "建国" : "新しい飛び地を作ること";
    return `§cここでは${what}はできません。他国（ID ${refusal.countryId}）の領土 (チャンク ${refusal.x}, ${refusal.z}) が近すぎます（建国規約 第3条 第3項：他国の領土から 5 チャンク以上、間に空き地を 4 チャンク以上あけてください）。`;
}
