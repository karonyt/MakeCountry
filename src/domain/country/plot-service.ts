import { GATE_USE_DENIED } from "./permissions.js";
import { Player, world } from "@minecraft/server";
import config from "@/config/server.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import {
    CheckPermissionFromLocation,
    GetAndParsePropertyData,
    HasPermission,
    StringifyAndSavePropertyData,
} from "@/shared/utils/minecraft.js";
import { PlotGroupManager } from "@/domain/country/plot-group.js";

/**
 * プロットとプロットグループの操作。/plot・/plotgroup とフォームの両方がここを呼ぶ。
 *
 * どの操作も「何を・どこに・どう変えたか」を 1 行で返す (Towny のように、打った結果が必ず言葉で分かるように)。
 * 失敗は理由を言う。画面は持たない。
 *
 * データの形は元のまま:
 *   チャンクの plot = { group, name, type, price, is_selling, enable, owner, permissions[], players[], roles[], countries[] }
 *   グループは plotgroup_<id> に同じ形。チャンク側は plot.group = id だけを持つ (グループ → チャンクの逆引きは無いので、国の領土から数える)
 */

export const PLOT_TYPES = ["public", "private", "embassy"] as const;
export type PlotType = (typeof PLOT_TYPES)[number];

/** 土地の上でできること。権限の名前は CheckPermissionFromLocation が見ているものと同じ */
export const LAND_PERMISSIONS = [
    "place", "break", "openContainer", "pistonPlace", "setHome", "blockUse", "entityUse", "gateUse", "lavaUse", "shopBuy", "shopSell", "noTarget", "publicHomeUse",
] as const;

/** /plot trust で一括して渡すもの (建てる・壊す・開ける・使う) */
export const TRUST_PERMISSIONS = ["place", "break", "openContainer", "blockUse", "entityUse", "gateUse"];

export const MAX_PRICE = 100_000_000_000;
export const MAX_RANGE_CHUNKS = 100;
const TYPE_NAMES: Record<string, string> = { public: "公開", private: "私有地", embassy: "大使館" };
const PERMISSION_NAMES: Record<string, string> = {
    place: "設置", break: "破壊", openContainer: "チェスト", pistonPlace: "ピストン", setHome: "ホーム設定",
    blockUse: "ブロックの使用", entityUse: "エンティティの使用", gateUse: "ゲートの使用", shopBuy: "shopから購入", shopSell: "shopへ売却",
    noTarget: "敵に狙われない", publicHomeUse: "公開ホーム",
};

export type Result = { ok: boolean; message: string };
const ok = (message: string): Result => ({ ok: true, message: `§a[プロット] §f${message}` });
const fail = (message: string): Result => ({ ok: false, message: `§c[プロット] ${message}` });

const plain = (value: unknown) => String(value ?? "").replace(/§./g, "");
const money = (value: number) => `${config.MoneyName} ${Math.floor(value).toLocaleString("ja-JP")}`;

/** 値段。0 以上 1,000 億以下の整数だけ通す (元の画面は、正しい値を 0 にしたり、文字をそのまま通したりしていた) */
export function parsePrice(input: unknown): number | null {
    const text = String(input ?? "").trim().replace(/,/g, "");
    if (!/^\d+$/.test(text)) return null;
    const value = Number(text);
    return Number.isSafeInteger(value) && value <= MAX_PRICE ? value : null;
}

export function chunkLabel(chunkId: string): string {
    const [, x, z, dimension] = chunkId.split("_");
    return `チャンク (${x}, ${z})${dimension && dimension !== "overworld" ? ` ${dimension}` : ""}`;
}

function emptyPlot(name: string, type: PlotType = "public") {
    return {
        group: undefined, is_selling: false, name, owner: null, players: [], permissions: [],
        type, price: 0, countries: [], roles: [], enable: true,
    };
}

type Context = {
    player: Player;
    playerData: any;
    chunkId: string;
    chunkData: any;
    /** 国の plotAdmin (国王・admin を含む)。土地の上で判定する */
    isAdmin: boolean;
};

function contextAt(player: Player, chunkId: string): Context | Result {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData) return fail("プレイヤーのデータを読めませんでした。入り直してからお試しください。");
    const chunkData = GetAndParsePropertyData(chunkId);
    if (!chunkData?.countryId) return fail(`${chunkLabel(chunkId)} はどの国の領土でもありません。`);
    const [, cx, cz, dimension] = chunkId.split("_");
    const isAdmin = chunkData.countryId === playerData.country
        && !CheckPermissionFromLocation(player, Number(cx) * 16, Number(cz) * 16, dimension, "plotAdmin");
    return { player, playerData, chunkId, chunkData, isAdmin };
}

const isResult = (value: Context | Result): value is Result => "ok" in value;

function hasPlot(chunkData: any): boolean {
    return Boolean(chunkData?.plot?.name || chunkData?.plot?.owner || chunkData?.plot?.group);
}

function groupOf(chunkData: any): any | undefined {
    const id = chunkData?.plot?.group;
    return id === undefined || id === null ? undefined : new PlotGroupManager().get(id);
}

/** グループに入っているチャンクの設定は、グループのものが効く。個別には変えさせず、行き先を言う */
function refuseIfGrouped(context: Context): Result | undefined {
    const group = groupOf(context.chunkData);
    return group
        ? fail(`${chunkLabel(context.chunkId)} はグループ「${plain(group.name)}」に入っています。設定は /plotgroup で変えてください (外すなら /plotgroup remove)。`)
        : undefined;
}

function requireAdmin(context: Context): Result | undefined {
    return context.isAdmin ? undefined : fail("この操作には、この国の plotAdmin の権限が要ります。");
}

function requireAdminOrOwner(context: Context, plot: any): Result | undefined {
    if (context.isAdmin || (plot?.owner && plot.owner === context.player.id)) return undefined;
    return fail("この操作ができるのは、プロットの持ち主か、この国の plotAdmin だけです。");
}

function ownerName(plot: any): string {
    return plot?.owner ? plain(GetAndParsePropertyData(`player_${plot.owner}`)?.name ?? "(不明)") : "なし (国のもの)";
}

function describe(plot: any, countryId: number): string[] {
    const lines = [
        `種類: §f${TYPE_NAMES[plot.type] ?? plot.type}§7 / 決まり: ${plot.enable ? "§a有効" : "§c無効 (国の決まりのまま)"}`,
        `持ち主: §f${ownerName(plot)}§7 / ${plot.is_selling ? `§e販売中 ${money(plot.price ?? 0)}` : "販売していません"}`,
    ];
    const who = plot.type === "private" ? "だれでも" : plot.type === "embassy" ? "持ち主の国の人" : "国民";
    lines.push(`${who}ができること: §f${(plot.permissions ?? []).map((p: string) => PERMISSION_NAMES[p] ?? p).join("・") || "なし"}`);
    const players = (plot.players ?? []).map((p: any) => plain(GetAndParsePropertyData(`player_${p.id}`)?.name ?? p.id));
    if (players.length) lines.push(`個別に許可した人: §f${players.join("、")}`);
    const countries = (plot.countries ?? []).map((c: any) => plain(GetAndParsePropertyData(`country_${c.id}`)?.name ?? c.id));
    if (countries.length) lines.push(`個別に許可した国: §f${countries.join("、")}`);
    if ((plot.roles ?? []).length) lines.push(`個別に許可したロール: §f${plot.roles.length} 個`);
    void countryId;
    return lines.map((line) => `§7${line}`);
}

// ============================ /plot ============================

export function plotInfo(player: Player, chunkId: string): Result {
    const context = contextAt(player, chunkId);
    if (isResult(context)) return context;
    const country = GetAndParsePropertyData(`country_${context.chunkData.countryId}`);
    const header = `§e${chunkLabel(chunkId)}§7 — ${plain(country?.name ?? "?")}§7 の領土`;
    if (!hasPlot(context.chunkData)) {
        return { ok: true, message: `${header}\n§7プロットは設定されていません (国の決まりがそのまま効きます)。` };
    }
    const group = groupOf(context.chunkData);
    const plot = group ?? context.chunkData.plot;
    const title = group
        ? `§7グループ: §f${plain(group.name)} §8(#${group.id}・${groupChunks(context.chunkData.countryId, group.id).length} チャンク)`
        : `§7プロット: §f${plain(plot.name ?? "new Plot")}`;
    return { ok: true, message: [header, title, ...describe(plot, context.chunkData.countryId)].join("\n") };
}

export function plotCreate(player: Player, chunkId: string, name: string, type: PlotType = "public"): Result {
    const context = contextAt(player, chunkId);
    if (isResult(context)) return context;
    const denied = requireAdmin(context);
    if (denied) return denied;
    if (hasPlot(context.chunkData)) return fail(`${chunkLabel(chunkId)} には、すでにプロットがあります (/plot info で確認できます)。`);
    const plotName = plain(name).trim().slice(0, 32) || "new Plot";
    context.chunkData.plot = emptyPlot(plotName, type);
    StringifyAndSavePropertyData(chunkId, context.chunkData);
    return ok(`${chunkLabel(chunkId)} にプロット「${plotName}」(${TYPE_NAMES[type]}) を作りました。`);
}

/** グループに入っていないプロットの設定を 1 つ変える */
function editPlot(player: Player, chunkId: string, allowOwner: boolean, change: (plot: any, context: Context) => Result): Result {
    const context = contextAt(player, chunkId);
    if (isResult(context)) return context;
    const grouped = refuseIfGrouped(context);
    if (grouped) return grouped;
    if (!hasPlot(context.chunkData)) return fail(`${chunkLabel(chunkId)} にプロットがありません。先に /plot create <名前> で作ってください。`);
    const plot = context.chunkData.plot;
    const denied = allowOwner ? requireAdminOrOwner(context, plot) : requireAdmin(context);
    if (denied) return denied;
    const result = change(plot, context);
    if (result.ok) {
        context.chunkData.plot = plot;
        StringifyAndSavePropertyData(chunkId, context.chunkData);
    }
    return result;
}

export function plotRename(player: Player, chunkId: string, name: string): Result {
    return editPlot(player, chunkId, true, (plot) => {
        const next = plain(name).trim().slice(0, 32);
        if (!next) return fail("名前を入れてください。例: /plot name 商店街");
        const before = plain(plot.name ?? "new Plot");
        plot.name = next;
        return ok(`${chunkLabel(chunkId)} のプロットの名前を「${before}」→「${next}」に変えました。`);
    });
}

export function plotSetType(player: Player, chunkId: string, type: string): Result {
    return editPlot(player, chunkId, false, (plot) => applyType(plot, type, chunkLabel(chunkId)));
}

export function plotSetSelling(player: Player, chunkId: string, priceInput: unknown | null): Result {
    return editPlot(player, chunkId, true, (plot) => applySelling(plot, priceInput, chunkLabel(chunkId)));
}

export function plotSetEnabled(player: Player, chunkId: string, enabled: boolean): Result {
    return editPlot(player, chunkId, true, (plot) => applyEnabled(plot, enabled, chunkLabel(chunkId)));
}

export function plotSetPermission(player: Player, chunkId: string, permission: string, enabled: boolean): Result {
    return editPlot(player, chunkId, true, (plot) => applyPermission(plot, permission, enabled, chunkLabel(chunkId)));
}

export function plotTrust(player: Player, chunkId: string, targetName: string, trusted: boolean): Result {
    return editPlot(player, chunkId, true, (plot) => applyTrust(plot, targetName, trusted, chunkLabel(chunkId)));
}

export function plotEvict(player: Player, chunkId: string): Result {
    return editPlot(player, chunkId, false, (plot) => applyEvict(plot, chunkLabel(chunkId)));
}

export function plotDelete(player: Player, chunkId: string): Result {
    const context = contextAt(player, chunkId);
    if (isResult(context)) return context;
    const denied = requireAdmin(context);
    if (denied) return denied;
    const grouped = refuseIfGrouped(context);
    if (grouped) return grouped;
    if (!hasPlot(context.chunkData)) return fail(`${chunkLabel(chunkId)} にプロットはありません。`);
    if (context.chunkData.plot?.owner) return fail(`持ち主 (${ownerName(context.chunkData.plot)}) がいます。先に /plot evict で外してください。`);
    const name = plain(context.chunkData.plot?.name ?? "new Plot");
    delete context.chunkData.plot;
    StringifyAndSavePropertyData(chunkId, context.chunkData);
    return ok(`${chunkLabel(chunkId)} のプロット「${name}」を消しました。この土地は国の決まりに戻ります。`);
}

// ============================ 設定の中身 (プロットとグループで共通) ============================

function applyType(plot: any, type: string, where: string): Result {
    if (!PLOT_TYPES.includes(type as PlotType)) return fail("種類は public (公開) / private (私有地) / embassy (大使館) のどれかです。");
    if (plot.owner && type === "public") return fail("持ち主のいるプロットは公開にできません。先に /plot evict で持ち主を外してください。");
    const before = TYPE_NAMES[plot.type] ?? plot.type;
    plot.type = type;
    return ok(`${where} の種類を ${before} → ${TYPE_NAMES[type]} に変えました。`);
}

function applySelling(plot: any, priceInput: unknown | null, where: string): Result {
    if (priceInput === null) {
        if (!plot.is_selling) return fail(`${where} は、もともと販売していません。`);
        plot.is_selling = false;
        return ok(`${where} の販売を取り下げました。`);
    }
    if (plot.type === "public") return fail("公開プロットは売れません。先に種類を private か embassy に変えてください (/plot type private)。");
    const price = parsePrice(priceInput);
    if (price === null) return fail(`値段は 0 〜 ${MAX_PRICE.toLocaleString("ja-JP")} の整数で入れてください。例: /plot forsale 5000`);
    plot.price = price;
    plot.is_selling = true;
    const buyer = plot.type === "embassy" ? "他国の人" : "国民";
    const seller = plot.owner ? `持ち主の ${ownerName(plot)}` : "国庫";
    return ok(`${where} を ${money(price)} で売りに出しました。買えるのは${buyer}で、代金は${seller}に入ります。`);
}

function applyEnabled(plot: any, enabled: boolean, where: string): Result {
    plot.enable = enabled;
    return ok(enabled
        ? `${where} のプロットの決まりを有効にしました。`
        : `${where} のプロットの決まりを止めました。止めている間は国の決まりが効きます。`);
}

function applyPermission(plot: any, permission: string, enabled: boolean, where: string): Result {
    if (!(LAND_PERMISSIONS as readonly string[]).includes(permission)) {
        return fail(`権限は ${LAND_PERMISSIONS.join(" / ")} のどれかです。`);
    }
    const set = new Set<string>(plot.permissions ?? []);
    if (enabled) set.add(permission); else set.delete(permission);
    if (permission === "gateUse") {
        if (enabled) set.delete(GATE_USE_DENIED); else set.add(GATE_USE_DENIED);
    }
    plot.permissions = [...set];
    const who = plot.type === "private" ? "だれでも" : plot.type === "embassy" ? "持ち主の国の人" : "国民";
    return ok(`${where}: ${who}の「${PERMISSION_NAMES[permission]}」を ${enabled ? "§a許可" : "§c禁止"}§f にしました。`);
}

function applyTrust(plot: any, targetName: string, trusted: boolean, where: string): Result {
    if (plot.type === "embassy") return fail("大使館は人ごとの許可を見ません (持ち主の国の人と、許可した国で決まります)。");
    if (!plain(targetName).trim()) return fail("プレイヤーの名前を入れてください。例: /plot trust Steve (空白を含む名前は \"…\" で囲みます)");
    const target = findPlayerByName(targetName);
    if (!target) return fail(`「${plain(targetName)}」というプレイヤーが見つかりません。名前を正確に入れてください。`);
    const players = (plot.players ?? []).filter((entry: any) => entry.id !== target.id);
    if (trusted) players.push({ id: target.id, permissions: [...TRUST_PERMISSIONS] });
    else if (players.length === (plot.players ?? []).length) return fail(`${target.name} さんは、もともと許可されていません。`);
    plot.players = players;
    return ok(trusted
        ? `${where}: ${target.name} さんに 設置・破壊・チェスト・使用 を許可しました。`
        : `${where}: ${target.name} さんへの許可を取り消しました。`);
}

function applyEvict(plot: any, where: string): Result {
    if (!plot.owner) return fail(`${where} に持ち主はいません。`);
    const before = ownerName(plot);
    plot.owner = null;
    plot.is_selling = false;
    return ok(`${where} の持ち主 (${before}) を外しました。代金は戻りません。`);
}

/** いま居る人から探し、居なければ保存されている名前から探す (大文字小文字は見ない) */
export function findPlayerByName(name: string): { id: string; name: string } | undefined {
    const wanted = plain(name).trim().toLowerCase();
    if (!wanted) return undefined;
    const online = world.getAllPlayers().find((p) => p.name.toLowerCase() === wanted);
    if (online) return { id: online.id, name: online.name };
    const database = new DynamicProperties("player");
    for (const id of database.idList) {
        const raw = database.get(id);
        if (!raw || !raw.toLowerCase().includes(wanted)) continue;
        try {
            const data = JSON.parse(raw);
            if (String(data?.name ?? "").toLowerCase() === wanted) return { id: String(data.id), name: String(data.name) };
        } catch { /* 壊れた 1 件で全体を止めない */ }
    }
    return undefined;
}

// ============================ 購入 ============================

type Offer = { kind: "plot" | "group"; key: string; price: number; label: string; countryId: number };

/** いま立っているチャンク (グループならグループごと) が買えるか確かめて、買えるなら値段つきで返す */
export function plotOffer(player: Player, chunkId: string): Offer | Result {
    const context = contextAt(player, chunkId);
    if (isResult(context)) return context;
    if (!hasPlot(context.chunkData)) return fail(`${chunkLabel(chunkId)} にプロットはありません。`);
    const group = groupOf(context.chunkData);
    const plot = group ?? context.chunkData.plot;
    if (!plot.is_selling) return fail("このプロットは販売していません。");
    if (plot.owner === player.id) return fail("自分のプロットです (取り下げるなら /plot notforsale)。");
    const citizen = context.chunkData.countryId === context.playerData.country;
    if (plot.type === "public") return fail("公開プロットは買えません。");
    if (plot.type === "private" && !citizen) return fail("私有地を買えるのは、この国の国民だけです。");
    if (plot.type === "embassy" && citizen) return fail("大使館を買えるのは、他国の人だけです。");
    const price = Math.max(0, Math.floor(Number(plot.price) || 0));
    const label = group
        ? `グループ「${plain(group.name)}」(${groupChunks(context.chunkData.countryId, group.id).length} チャンクまとめて)`
        : `${chunkLabel(chunkId)} のプロット「${plain(plot.name ?? "new Plot")}」`;
    return { kind: group ? "group" : "plot", key: group ? `plotgroup_${group.id}` : chunkId, price, label, countryId: context.chunkData.countryId };
}

/**
 * 購入を確定する。代金は、国が売ったものは国庫へ、持ち主が売ったものはその人へ入る
 * (元の画面は買い手から引くだけで、代金がどこにも入らず消えていた)。
 */
export function plotPurchase(player: Player, offer: Offer): Result {
    const document = GetAndParsePropertyData(offer.key);
    if (!document) return fail("プロットが見つかりません。もう一度 /plot buy からやり直してください。");
    const plot = offer.kind === "group" ? document : document.plot;
    if (!plot?.is_selling) return fail("たったいま販売が取り下げられました。");
    const price = Math.max(0, Math.floor(Number(plot.price) || 0));
    if (price !== offer.price) return fail(`値段が ${money(offer.price)} → ${money(price)} に変わりました。もう一度 /plot buy で確かめてください。`);
    if (plot.owner === player.id) return fail("自分のプロットです。");

    const buyer = GetAndParsePropertyData(`player_${player.id}`);
    if (!buyer) return fail("プレイヤーのデータを読めませんでした。");
    if ((buyer.money ?? 0) < price) return fail(`所持金が足りません (${money(price)} 必要、いま ${money(buyer.money ?? 0)})。`);

    const sellerId = plot.owner ?? null;
    buyer.money = (buyer.money ?? 0) - price;
    StringifyAndSavePropertyData(`player_${player.id}`, buyer);

    let paidTo = "国庫";
    if (sellerId) {
        const seller = GetAndParsePropertyData(`player_${sellerId}`);
        if (seller) {
            seller.money = (seller.money ?? 0) + price;
            StringifyAndSavePropertyData(`player_${sellerId}`, seller);
            paidTo = `${plain(seller.name)} さん`;
            const online = world.getAllPlayers().find((p) => p.id === sellerId);
            online?.sendMessage(`§a[プロット] §f${offer.label} が ${player.name} さんに売れました。${money(price)} を受け取りました。`);
        }
    }
    if (paidTo === "国庫") {
        const country = GetAndParsePropertyData(`country_${offer.countryId}`);
        if (country) {
            country.money = (country.money ?? 0) + price;
            country.treasuryBudgetLog ||= [];
            if (country.treasuryBudgetLog.length > 50) country.treasuryBudgetLog.shift();
            country.treasuryBudgetLog.push({ timestamp: Date.now(), actor: player.name, action: "add", amount: price, reason: "PLOT SALE" });
            StringifyAndSavePropertyData(`country_${offer.countryId}`, country);
        }
    }

    plot.owner = player.id;
    plot.is_selling = false;
    if (offer.kind === "group") StringifyAndSavePropertyData(offer.key, plot);
    else { document.plot = plot; StringifyAndSavePropertyData(offer.key, document); }
    return ok(`${offer.label} を ${money(price)} で買いました。代金は${paidTo}に入りました。`);
}

// ============================ /plotgroup ============================

/** その国の領土のうち、このグループに入っているチャンク */
export function groupChunks(countryId: number, groupId: number | string): string[] {
    const country = GetAndParsePropertyData(`country_${countryId}`);
    const chunks: string[] = [];
    for (const chunkId of country?.territories ?? []) {
        const group = GetAndParsePropertyData(chunkId)?.plot?.group;
        if (group !== undefined && group !== null && String(group) === String(groupId)) chunks.push(chunkId);
    }
    return chunks;
}

type GroupContext = { player: Player; playerData: any; country: any; manager: PlotGroupManager };

function groupContext(player: Player): GroupContext | Result {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return fail("国に入っていません。プロットグループは国のものです。");
    const country = GetAndParsePropertyData(`country_${playerData.country}`);
    if (!country) return fail("国のデータを読めませんでした。");
    return { player, playerData, country, manager: new PlotGroupManager() };
}

const isGroupResult = (value: GroupContext | Result): value is Result => "ok" in value;

/** /sc のプロットグループ画面と同じ確かめ方 (国王・admin・plotAdmin) */
function isCountryPlotAdmin(context: GroupContext): boolean {
    return Boolean(HasPermission(context.player, "plotAdmin"));
}

/** 名前か #ID でグループを引く。自国のものだけ */
function findGroup(context: GroupContext, nameOrId: string): any | Result {
    const wanted = plain(nameOrId).trim();
    if (!wanted) return fail("グループの名前を入れてください (空白を含む名前は \"…\" で囲みます)。/plotgroup list で一覧が見られます。");
    const groups = (context.country.plotgroup ?? []).map((id: any) => context.manager.get(id)).filter(Boolean);
    const byId = /^#?\d+$/.test(wanted) ? groups.filter((g: any) => String(g.id) === wanted.replace("#", "")) : [];
    const matches = byId.length ? byId : groups.filter((g: any) => plain(g.name).toLowerCase() === wanted.toLowerCase());
    if (matches.length === 0) return fail(`グループ「${wanted}」は見つかりません。/plotgroup list で確かめてください。`);
    if (matches.length > 1) return fail(`「${wanted}」という名前のグループが ${matches.length} つあります。#ID で指定してください (例: /plotgroup info #${matches[0].id})。`);
    return matches[0];
}

export function groupList(player: Player): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    const ids = context.country.plotgroup ?? [];
    if (ids.length === 0) return { ok: true, message: "§e[プロットグループ]§7 まだありません。/plotgroup create <名前> で作れます。" };
    const counts = new Map<string, number>();
    for (const chunkId of context.country.territories ?? []) {
        const group = GetAndParsePropertyData(chunkId)?.plot?.group;
        if (group !== undefined && group !== null) counts.set(String(group), (counts.get(String(group)) ?? 0) + 1);
    }
    const lines = ids.map((id: any) => {
        const group = context.manager.get(id);
        if (!group) return `§8#${id} (データなし)`;
        const state = group.is_selling ? `§e販売中 ${money(group.price ?? 0)}` : group.owner ? `§b持ち主 ${ownerName(group)}` : "§7国のもの";
        return `§8#${group.id} §f${plain(group.name)} §7${TYPE_NAMES[group.type] ?? group.type}・${counts.get(String(group.id)) ?? 0} チャンク・${state}`;
    });
    return { ok: true, message: [`§e[プロットグループ] §f${plain(context.country.name)}§7 の ${ids.length} 個`, ...lines].join("\n") };
}

export function groupInfo(player: Player, nameOrId: string): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    const group = findGroup(context, nameOrId);
    if ("ok" in group) return group;
    const chunks = groupChunks(context.country.id, group.id);
    const coordinates = chunks.slice(0, 40).map((id) => { const [, x, z] = id.split("_"); return `(${x},${z})`; }).join(" ");
    return {
        ok: true,
        message: [
            `§e[プロットグループ] §f${plain(group.name)} §8#${group.id}`,
            ...describe(group, context.country.id),
            `§7Webマップ: §f${group.mapColor || "本国の色"}・${PLOT_MAP_PATTERN_NAMES[PLOT_MAP_PATTERNS.indexOf(group.mapPattern)] || "斜線"}`,
            `§7チャンク ${chunks.length} 個: §f${coordinates || "なし"}${chunks.length > 40 ? " …" : ""}`,
        ].join("\n"),
    };
}

export function groupCreate(player: Player, name: string, type: string = "public"): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    if (!isCountryPlotAdmin(context)) return fail("この操作には plotAdmin の権限が要ります。");
    const groupName = plain(name).trim().slice(0, 32);
    if (!groupName) return fail("名前を入れてください。例: /plotgroup create 商店街");
    if (!PLOT_TYPES.includes(type as PlotType)) return fail("種類は public / private / embassy のどれかです。");
    const created = context.manager.create(context.country.id, groupName, type);
    if (!created) return fail("グループを作れませんでした。");
    return ok(`グループ「${groupName}」(#${created.id}・${TYPE_NAMES[type]}) を作りました。チャンクを入れるには、その場所で /plotgroup add ${groupName}`);
}

export function groupDelete(player: Player, nameOrId: string): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    if (!isCountryPlotAdmin(context)) return fail("この操作には plotAdmin の権限が要ります。");
    const group = findGroup(context, nameOrId);
    if ("ok" in group) return group;
    if (group.owner) return fail(`持ち主 (${ownerName(group)}) がいます。先に /plotgroup evict ${plain(group.name)} で外してください。`);
    const chunks = groupChunks(context.country.id, group.id);
    for (const chunkId of chunks) {
        const chunkData = GetAndParsePropertyData(chunkId);
        if (!chunkData?.plot) continue;
        delete chunkData.plot;
        StringifyAndSavePropertyData(chunkId, chunkData);
    }
    context.manager.delete(group.id, context.country.id);
    return ok(`グループ「${plain(group.name)}」を消しました。入っていた ${chunks.length} チャンクは国の決まりに戻ります。`);
}

/** グループの設定を 1 つ変える。持ち主にも許すものは allowOwner */
function editGroup(player: Player, nameOrId: string, allowOwner: boolean, change: (group: any, where: string) => Result): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    const group = findGroup(context, nameOrId);
    if ("ok" in group) return group;
    const owner = allowOwner && group.owner && group.owner === player.id;
    if (!owner && !isCountryPlotAdmin(context)) {
        return fail(allowOwner ? "この操作ができるのは、グループの持ち主か plotAdmin だけです。" : "この操作には plotAdmin の権限が要ります。");
    }
    const result = change(group, `グループ「${plain(group.name)}」`);
    if (result.ok) context.manager.set(group.id, group);
    return result;
}

export const PLOT_MAP_PATTERNS = ["diagonal", "vertical", "horizontal", "crosshatch", "grid", "dots"] as const;
export const PLOT_MAP_PATTERN_NAMES = ["斜線", "縦線", "横線", "交差する斜線", "格子", "水玉"];

/** 空欄は本国色。保存前に両項目を検証して、一方だけの更新を防ぐ。 */
export function groupSetMapAppearance(player: Player, nameOrId: string, color: string, pattern: string): Result {
    return editGroup(player, nameOrId, false, (group, where) => {
        const nextColor = String(color).trim().toLowerCase();
        if (nextColor && !/^#[0-9a-f]{6}$/.test(nextColor)) return fail("地図の色は #RRGGBB で入れてください。空欄なら本国の色です。");
        if (!PLOT_MAP_PATTERNS.includes(pattern as any)) return fail(`地図の柄は ${PLOT_MAP_PATTERNS.join(" / ")} から選んでください。`);
        if (nextColor) group.mapColor = nextColor;
        else delete group.mapColor;
        group.mapPattern = pattern;
        return ok(`${where} の地図表示を ${nextColor || "本国の色"}・${PLOT_MAP_PATTERN_NAMES[PLOT_MAP_PATTERNS.indexOf(pattern as any)]} にしました。公開グループは約1〜2分でWebマップに反映されます。`);
    });
}
export function groupSetMapColor(player: Player, nameOrId: string, color: string): Result {
    // 他の設定を保持し、変更・権限確認は共通処理へ渡す。
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    const group = findGroup(context, nameOrId);
    if ("ok" in group) return group;
    return groupSetMapAppearance(player, nameOrId, ["default", "country"].includes(color.toLowerCase()) ? "" : color, PLOT_MAP_PATTERNS.includes(group.mapPattern) ? group.mapPattern : "diagonal");
}
export function groupSetMapPattern(player: Player, nameOrId: string, pattern: string): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    const group = findGroup(context, nameOrId);
    if ("ok" in group) return group;
    return groupSetMapAppearance(player, nameOrId, /^#[0-9a-f]{6}$/i.test(group.mapColor ?? "") ? group.mapColor : "", pattern.toLowerCase());
}

export function groupRename(player: Player, nameOrId: string, nextName: string): Result {
    return editGroup(player, nameOrId, false, (group) => {
        const next = plain(nextName).trim().slice(0, 32);
        if (!next) return fail("新しい名前を入れてください。例: /plotgroup rename 商店街 中央商店街");
        const before = plain(group.name);
        group.name = next;
        return ok(`グループの名前を「${before}」→「${next}」に変えました。`);
    });
}

export const groupSetType = (player: Player, nameOrId: string, type: string) => editGroup(player, nameOrId, false, (g, where) => applyType(g, type, where));
export const groupSetSelling = (player: Player, nameOrId: string, price: unknown | null) => editGroup(player, nameOrId, true, (g, where) => applySelling(g, price, where));
export const groupSetEnabled = (player: Player, nameOrId: string, enabled: boolean) => editGroup(player, nameOrId, true, (g, where) => applyEnabled(g, enabled, where));
export const groupSetPermission = (player: Player, nameOrId: string, permission: string, enabled: boolean) => editGroup(player, nameOrId, true, (g, where) => applyPermission(g, permission, enabled, where));
export const groupTrust = (player: Player, nameOrId: string, target: string, trusted: boolean) => editGroup(player, nameOrId, true, (g, where) => applyTrust(g, target, trusted, where));
export const groupEvict = (player: Player, nameOrId: string) => editGroup(player, nameOrId, false, (g, where) => applyEvict(g, where));

/** いまの位置から (x, z) までの長方形に入るチャンク。/buychunk と同じ決まり (世界座標で指定、100 チャンクまで) */
export function chunksInRange(player: Player, x?: number, z?: number): string[] | Result {
    const dimension = player.dimension.id.replace("minecraft:", "");
    const fromX = Math.floor(player.location.x / 16);
    const fromZ = Math.floor(player.location.z / 16);
    if (x === undefined || z === undefined) return [`chunk_${fromX}_${fromZ}_${dimension}`];
    if (!Number.isFinite(x) || !Number.isFinite(z)) return fail("座標は数字で入れてください。例: /plotgroup add 商店街 120 -340");
    const toX = Math.floor(x / 16);
    const toZ = Math.floor(z / 16);
    const count = (Math.abs(toX - fromX) + 1) * (Math.abs(toZ - fromZ) + 1);
    if (count > MAX_RANGE_CHUNKS) return fail(`一度に指定できるのは ${MAX_RANGE_CHUNKS} チャンクまでです (いまの指定は ${count} チャンク)。`);
    const chunks: string[] = [];
    for (let cx = Math.min(fromX, toX); cx <= Math.max(fromX, toX); cx += 1) {
        for (let cz = Math.min(fromZ, toZ); cz <= Math.max(fromZ, toZ); cz += 1) chunks.push(`chunk_${cx}_${cz}_${dimension}`);
    }
    return chunks;
}

export function groupAddChunks(player: Player, nameOrId: string, chunkIds: string[]): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    if (!isCountryPlotAdmin(context)) return fail("この操作には plotAdmin の権限が要ります。");
    const group = findGroup(context, nameOrId);
    if ("ok" in group) return group;
    let added = 0;
    const skipped: string[] = [];
    for (const chunkId of chunkIds) {
        const chunkData = GetAndParsePropertyData(chunkId);
        if (!chunkData || chunkData.countryId !== context.country.id) { skipped.push("自国の領土ではない"); continue; }
        if (chunkData.plot?.owner) { skipped.push("持ち主のいるプロット"); continue; }
        if (String(chunkData.plot?.group ?? "") === String(group.id)) { skipped.push("すでに入っている"); continue; }
        chunkData.plot = { ...(chunkData.plot ?? emptyPlot("new Plot")), group: group.id };
        StringifyAndSavePropertyData(chunkId, chunkData);
        added += 1;
    }
    return summarize(`グループ「${plain(group.name)}」に ${added} チャンクを入れました`, added, skipped);
}

export function groupRemoveChunks(player: Player, chunkIds: string[]): Result {
    const context = groupContext(player);
    if (isGroupResult(context)) return context;
    if (!isCountryPlotAdmin(context)) return fail("この操作には plotAdmin の権限が要ります。");
    let removed = 0;
    let restored = 0;
    const skipped: string[] = [];
    for (const chunkId of chunkIds) {
        const chunkData = GetAndParsePropertyData(chunkId);
        if (!chunkData || chunkData.countryId !== context.country.id) { skipped.push("自国の領土ではない"); continue; }
        if (chunkData.plot?.group === undefined || chunkData.plot?.group === null) { skipped.push("グループに入っていない"); continue; }
        // 入れる前から自分の名前つきプロットだった土地は、その設定に戻す。グループのために作られただけの空のプロットは消す
        if (chunkData.plot.name && chunkData.plot.name !== "new Plot") {
            chunkData.plot.group = undefined;
            restored += 1;
        } else {
            delete chunkData.plot;
        }
        StringifyAndSavePropertyData(chunkId, chunkData);
        removed += 1;
    }
    const after = restored > 0 ? `うち ${restored} チャンクは元のプロット設定に、残りは国の決まりに戻ります` : "国の決まりに戻ります";
    return summarize(`${removed} チャンクをグループから外しました (${after})`, removed, skipped);
}

function summarize(done: string, count: number, skipped: string[]): Result {
    const reasons = new Map<string, number>();
    for (const reason of skipped) reasons.set(reason, (reasons.get(reason) ?? 0) + 1);
    const detail = [...reasons].map(([reason, n]) => `${reason} ${n}`).join("、");
    const message = `${done}。${skipped.length ? `飛ばしたもの: ${detail}。` : ""}`;
    return count > 0 ? ok(message) : fail(`変えたチャンクはありません。${detail ? `(${detail})` : ""}`);
}
