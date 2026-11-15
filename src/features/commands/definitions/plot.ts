import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { plotMainForm } from "@/features/forms/country/plot-form.js";
import { GetPlayerChunkPropertyId } from "@/shared/utils/minecraft.js";
import {
    LAND_PERMISSIONS,
    plotCreate,
    plotDelete,
    plotEvict,
    plotInfo,
    plotOffer,
    plotPurchase,
    plotRename,
    plotSetEnabled,
    plotSetPermission,
    plotSetSelling,
    plotSetType,
    plotTrust,
} from "@/domain/country/plot-service.js";
import { togglePlotHud } from "@/features/plot/plot-hud.js";
import type { Result } from "@/domain/country/plot-service.js";

/**
 * /plot <操作> [値] [値2] — いま立っているチャンクのプロットを、打った言葉どおりに操作する。
 * 操作を付けなければ、これまでどおりフォームが開く。
 *
 * 統合版のカスタムコマンドはサブコマンドの木を作れないので、操作を enum にして入力補完へ出している。
 * どの操作も、何をどこにどう変えたかを 1 行で返す (中身は domain/country/plot-service.ts)。
 */
const ACTIONS = [
    "help", "info", "create", "name", "type", "forsale", "notforsale", "buy", "evict",
    "trust", "untrust", "perm", "enable", "disable", "delete", "hud",
    // 思いつきやすい言い方も受ける (中身は同じ)
    "sell", "unsell", "claim",
];

const ALIASES: Record<string, string> = { sell: "forsale", unsell: "notforsale", claim: "buy" };

const HELP = [
    "§e[プロット] §fいま立っているチャンクが対象です",
    "§f/plot info§7 — 種類・値段・持ち主・だれが何をできるか",
    "§f/plot create <名前> [public|private|embassy]§7 — プロットを作る §8(plotAdmin)",
    "§f/plot name <名前>§7 ／ §f/plot type <種類>§7 — 名前・種類を変える",
    "§f/plot sell <値段>§7 ／ §f/plot unsell§7 — 売りに出す・取り下げる §8(forsale / notforsale でも同じ)",
    "§f/plot buy§7 — 買う (値段を確かめてから /plot buy confirm で確定) §8(claim でも同じ)",
    "§f/plot trust <プレイヤー>§7 ／ §f/plot untrust <プレイヤー>§7 — 設置・破壊・チェスト・使用をまとめて許可",
    `§f/plot perm <権限> on|off§7 — 権限を 1 つずつ §8(${LAND_PERMISSIONS.join(" ")})§7。§f/plotperm§7 なら権限の名前が候補に出ます`,
    "§f/plot enable§7 ／ §f/plot disable§7 — プロットの決まりを効かせる・止める",
    "§f/plot evict§7 — 持ち主を外す ／ §f/plot delete§7 — プロットをやめる §8(plotAdmin)",
    "§f/plot hud§7 — いま居る場所で 国民・同盟・友好・中立・敵対 が何をできるかを出し続ける (もう一度で消える)",
    "§7グループは §f/plotgroup help§7、境目は §f/chunkborder§7、フォームは §f/plot§7 だけ",
];

/** 買う前の確かめ。30 秒以内に /plot buy confirm と打った人だけが確定できる */
const CONFIRM_TICKS = 20 * 30;
const pendingOffers = new Map<string, { offer: any; until: number }>();

function buy(player: Player, chunkId: string, word?: string): Result {
    if (word === "confirm") {
        const pending = pendingOffers.get(player.id);
        pendingOffers.delete(player.id);
        if (!pending || system.currentTick > pending.until) {
            return { ok: false, message: "§c[プロット] 確かめの時間が切れました。もう一度 /plot buy から始めてください。" };
        }
        return plotPurchase(player, pending.offer);
    }
    const offer = plotOffer(player, chunkId);
    if ("ok" in offer) return offer;
    pendingOffers.set(player.id, { offer, until: system.currentTick + CONFIRM_TICKS });
    return {
        ok: true,
        message: `§e[プロット] §f${offer.label} を §e${offer.price.toLocaleString("ja-JP")}§f で買います。\n§7よければ 30 秒以内に §f/plot buy confirm§7 と打ってください。`,
    };
}

function onOff(word?: string): boolean | undefined {
    if (["on", "true", "allow", "許可"].includes(String(word).toLowerCase())) return true;
    if (["off", "false", "deny", "禁止"].includes(String(word).toLowerCase())) return false;
    return undefined;
}

function run(player: Player, action: string, value?: string, value2?: string): Result {
    const chunkId = GetPlayerChunkPropertyId(player);
    switch (ALIASES[action] ?? action) {
        case "info": return plotInfo(player, chunkId);
        case "create": return plotCreate(player, chunkId, value ?? "", (value2 ?? "public") as any);
        case "name": return plotRename(player, chunkId, value ?? "");
        case "type": return plotSetType(player, chunkId, value ?? "");
        case "forsale": return plotSetSelling(player, chunkId, value ?? "");
        case "notforsale": return plotSetSelling(player, chunkId, null);
        case "buy": return buy(player, chunkId, value);
        case "evict": return plotEvict(player, chunkId);
        case "trust": return plotTrust(player, chunkId, value ?? "", true);
        case "untrust": return plotTrust(player, chunkId, value ?? "", false);
        case "perm": {
            const enabled = onOff(value2);
            if (enabled === undefined) return { ok: false, message: "§c[プロット] 例: /plot perm openContainer on" };
            return plotSetPermission(player, chunkId, value ?? "", enabled);
        }
        case "enable": return plotSetEnabled(player, chunkId, true);
        case "disable": return plotSetEnabled(player, chunkId, false);
        case "delete": return plotDelete(player, chunkId);
        case "hud": return { ok: true, message: togglePlotHud(player) };
        default: return { ok: true, message: HELP.join("\n") };
    }
}

function plotExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const [action, value, value2] = args;
    if (!action) {
        plotMainForm(sender);
        return;
    }
    try {
        sender.sendMessage(run(sender, String(action), value, value2).message);
    } catch (error) {
        sender.sendMessage("§c[プロット] 処理に失敗しました。少し待ってからお試しください。");
        console.warn(`[plot] ${action} failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
    }
};

world.afterEvents.playerLeave.subscribe((event) => pendingOffers.delete(event.playerId));

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("makecountry:plotaction", ACTIONS);

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:plot',
            // 入力の途中に出る説明。操作の一覧は補完に出るが、値の意味までは出せないので help へ案内する
            description: 'プロットを操作します。/plot help で使い方、何も付けなければ画面が開きます',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [
                { name: "action", type: CustomCommandParamType.Enum, enumName: "makecountry:plotaction" },
                { name: "value", type: CustomCommandParamType.String },
                { name: "value2", type: CustomCommandParamType.String },
            ],
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                plotExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:selectstates',
            description: 'command.help.plot.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                plotExecuter(origin, []);
            })
        })
    )
});
