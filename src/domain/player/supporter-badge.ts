/**
 * 月額サポーターの印と、国家ブーストの台帳。
 *
 * だれがサポーターか・どの国に何ブースト付いているかは plugins/karoearth/supporter.ts が
 * ストア (KaronPoint) から定期的に受け取って、ここへ入れる。
 * チャット・頭上の名前・国の情報画面はここを読むだけなので、ストアに繋がらないときは「印が出ない」だけで、遊びは止まらない。
 *
 * 色は階級ごと (銅・鉄・金・アメジストの文字色)。続けている月数が 2 か月以上なら、星の横に数字が付く。
 */
export type SupporterEntry = { tier: string; months: number };
export type CountryBoostEntry = {
    countryId: number;
    name: string;
    boosts: number;
    level: number;
    backers: Array<{ playerName: string; boosts: number }>;
    anonymous: number;
    channelId: string | null;
};

const TIER_COLORS: Record<string, string> = { bronze: "§n", silver: "§i", gold: "§p", patron: "§u" };
const TIER_ORDER = ["bronze", "silver", "gold", "patron"];

// 発言と名前に選べる色。シルバーは前の 6 色、ゴールド以上は 12 色。読みにくい暗い色は入れない
export const CHAT_COLORS: Array<{ code: string; name: string }> = [
    { code: "§e", name: "黄" },
    { code: "§b", name: "水色" },
    { code: "§a", name: "黄緑" },
    { code: "§d", name: "ピンク" },
    { code: "§h", name: "白 (クォーツ)" },
    { code: "§s", name: "ダイヤ" },
    { code: "§g", name: "ゴールド (ミネコイン)" },
    { code: "§q", name: "エメラルド" },
    { code: "§u", name: "アメジスト" },
    { code: "§v", name: "レジン (オレンジ)" },
    { code: "§6", name: "金" },
    { code: "§9", name: "青" },
];
export const FLOW_COLOR = "flow";
// 「色なし」を選んだ印。何も選んでいない (undefined) のとは区別する (パトロンは何も選んでいなければ流れる色)
export const NO_COLOR = "none";
// パトロンの「流れる色」: 名前の 1 文字ずつに順番に当てて、少しずつずらす
const FLOW_PALETTE = ["§d", "§5", "§9", "§b", "§3", "§a", "§e", "§6", "§c"];

let supporters = new Map<string, SupporterEntry>();
let countries = new Map<number, CountryBoostEntry>();
// 流れる色のずれ。plugins/karoearth/supporter.ts が数 tick ごとに進める
let flowOffset = 0;

export function advanceFlow(): number {
    flowOffset = (flowOffset + 1) % 1000;
    return flowOffset;
}

export function currentFlowOffset(): number {
    return flowOffset;
}

const keyOf = (playerName: string) => playerName.trim().toLowerCase();

export function setSupporters(entries: Array<SupporterEntry & { playerName: string }>): void {
    supporters = new Map(entries.filter((e) => TIER_COLORS[e.tier]).map((e) => [keyOf(e.playerName), { tier: e.tier, months: e.months }]));
}

export function setCountryBoosts(entries: CountryBoostEntry[]): void {
    countries = new Map(entries.filter((e) => Number.isFinite(e.countryId)).map((e) => [Number(e.countryId), e]));
}

export function supporterOf(playerName: string): SupporterEntry | undefined {
    return supporters.get(keyOf(playerName));
}

export function countryBoostOf(countryId: number | string | undefined): CountryBoostEntry | undefined {
    return countries.get(Number(countryId));
}

export function allCountryBoosts(): CountryBoostEntry[] {
    return [...countries.values()];
}

/** 階級の高さ (0 = ブロンズ … 3 = パトロン)。サポーターでなければ -1 */
export function tierRank(tier: string | undefined): number {
    return tier ? TIER_ORDER.indexOf(tier) : -1;
}

export function tierColor(tier: string | undefined): string {
    return (tier && TIER_COLORS[tier]) || "§7";
}

/** 名前の前に置く文字。サポーターでなければ空。after には、印のあとに戻す色を渡す (チャットの名前は §7) */
export function supporterBadge(playerName: string, after = "§7"): string {
    const entry = supporterOf(playerName);
    if (!entry) return "";
    const months = entry.months >= 2 ? String(Math.min(99, Math.floor(entry.months))) : "";
    return `${TIER_COLORS[entry.tier]}★${months}${after} `;
}

/** その階級で選べる色の数 (シルバー 6・ゴールド以上 12・それ以外 0) */
export function colorChoicesFor(tier: string | undefined): Array<{ code: string; name: string }> {
    const rank = tierRank(tier);
    if (rank >= 2) return CHAT_COLORS;
    if (rank === 1) return CHAT_COLORS.slice(0, 6);
    return [];
}

/** 選んだ色が、その階級で使えるものか (階級が下がったら前の色は無効になる) */
export function allowedColor(tier: string | undefined, code: unknown): string | undefined {
    if (typeof code !== "string") return undefined;
    return colorChoicesFor(tier).some((c) => c.code === code) ? code : undefined;
}

/** 流れる色を使うか: パトロンで、「流れる色」を選んだか、まだ何も選んでいない */
export function usesFlowingName(tier: string | undefined, nameColor: unknown): boolean {
    return tierRank(tier) >= 3 && (nameColor === FLOW_COLOR || nameColor === undefined);
}

/** パトロンの流れる色。offset を進めると色がずれていく */
export function flowingName(name: string, offset: number): string {
    let out = "";
    for (let i = 0; i < name.length; i++) {
        out += FLOW_PALETTE[(i + offset) % FLOW_PALETTE.length] + name[i];
    }
    return out;
}

/**
 * 頭上の表示。サポーターでなければ undefined (元の形のまま)。
 *  1 行め: [国名] ★ 二つ名 (二つ名はシルバーから)
 *  2 行め: 名前 (ゴールドから色、パトロンは流れる色)
 */
export function headDisplay(input: {
    playerName: string;
    countryLine: string;
    penName?: string;
    nameColor?: unknown;
    flowOffset?: number;
}): string | undefined {
    const entry = supporterOf(input.playerName);
    if (!entry) return undefined;
    const rank = tierRank(entry.tier);
    const star = `${TIER_COLORS[entry.tier]}★${entry.months >= 2 ? Math.min(99, Math.floor(entry.months)) : ""}§r`;
    const penName = rank >= 1 && input.penName ? ` §7${input.penName}§r` : "";
    const first = `${input.countryLine}${input.countryLine ? " " : ""}${star}${penName}`;
    let second = input.playerName;
    if (usesFlowingName(entry.tier, input.nameColor)) second = flowingName(input.playerName, input.flowOffset ?? 0);
    else if (rank >= 2) {
        const color = allowedColor(entry.tier, input.nameColor);
        if (color) second = `${color}${input.playerName}`;
    }
    return `${first}\n${second}`;
}
