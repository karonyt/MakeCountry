import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import {
    LAND_PERMISSIONS,
    chunksInRange,
    groupAddChunks,
    groupCreate,
    groupDelete,
    groupEvict,
    groupInfo,
    groupList,
    groupRemoveChunks,
    groupRename,
    groupSetMapColor,
    groupSetMapPattern,
    groupSetEnabled,
    groupSetPermission,
    groupSetSelling,
    groupSetType,
    groupTrust,
} from "@/domain/country/plot-service.js";
import type { Result } from "@/domain/country/plot-service.js";

/**
 * /plotgroup <操作> [グループ名] [値] [値2] — プロットグループを、打った言葉どおりに操作する。
 * これまでは /sc の奥の画面でしか触れず、チャンクを入れるのも 1 つずつだった。
 *
 * グループ名に空白があるときは "…" で囲む。同じ名前が 2 つあるときは #ID で指定する。
 * add / remove は /buychunk と同じ範囲指定 (いまの位置から x z までの長方形、100 チャンクまで)。
 */
const ACTIONS = [
    "help", "list", "info", "create", "delete", "rename", "add", "remove", "type",
    "forsale", "notforsale", "evict", "trust", "untrust", "perm", "enable", "disable",
    // 思いつきやすい言い方も受ける (中身は同じ)
    "sell", "unsell", "mapcolor", "mappattern",
];

const ALIASES: Record<string, string> = { sell: "forsale", unsell: "notforsale" };

const HELP = [
    "§e[プロットグループ] §f同じ決まりをまとめて付けるチャンクの集まりです",
    "§f/plotgroup list§7 — 自国のグループと、それぞれのチャンク数",
    "§f/plotgroup info <名前>§7 — 設定と、入っているチャンクの座標",
    "§f/plotgroup create <名前> [public|private|embassy]§7 ／ §fdelete <名前>§7 ／ §frename <名前> <新しい名前>",
    "§f/plotgroup add <名前> [x] [z]§7 — いまのチャンクを入れる。x z を付けると、そこまでの長方形をまとめて (100 チャンクまで)",
    "§f/plotgroup remove [x] [z]§7 — グループから外す (同じく範囲で指定できます)",
    "§f/plotgroup sell <名前> <値段>§7 ／ §funsell <名前>§7 — グループごと売る (買うのは、その土地で /plot buy) §8(forsale / notforsale でも同じ)",
    "§f/plotgroup type <名前> <種類>§7 ／ §fenable <名前>§7 ／ §fdisable <名前>§7 ／ §fevict <名前>",
    "§f/plotgroup mapcolor <名前> [#RRGGBB|default]§7 — 色を指定。省略・default は本国の色",
    "§f/plotgroup mappattern <名前> diagonal|vertical|horizontal|crosshatch|grid|dots§7 — 斜線・縦線・横線・交差斜線・格子・水玉",
    "§f/plotgroup trust <名前> <プレイヤー>§7 ／ §funtrust <名前> <プレイヤー>",
    `§f/plotgroup perm <名前> <権限> on|off§7 §8(${LAND_PERMISSIONS.join(" ")})§7。§f/pgperm <名前>§7 なら権限が候補に出ます`,
    "§7名前に空白があるときは \"…\" で囲みます。同じ名前が複数あるときは #ID で。境目は /chunkborder で見られます",
];

function toNumber(word?: string): number | undefined {
    if (word === undefined || word === null || String(word).trim() === "") return undefined;
    return Number(word);
}

function run(player: Player, action: string, a?: string, b?: string, c?: string): Result {
    switch (ALIASES[action] ?? action) {
        case "list": return groupList(player);
        case "info": return groupInfo(player, a ?? "");
        case "create": return groupCreate(player, a ?? "", b ?? "public");
        case "delete": return groupDelete(player, a ?? "");
        case "rename": return groupRename(player, a ?? "", b ?? "");
        case "add": {
            const chunks = chunksInRange(player, toNumber(b), toNumber(c));
            return Array.isArray(chunks) ? groupAddChunks(player, a ?? "", chunks) : chunks;
        }
        case "remove": {
            // remove はグループ名が要らないので、値は 1 つ前へ詰めて受ける
            const chunks = chunksInRange(player, toNumber(a), toNumber(b));
            return Array.isArray(chunks) ? groupRemoveChunks(player, chunks) : chunks;
        }
        case "mapcolor": return groupSetMapColor(player, a ?? "", b ?? "");
        case "mappattern": return groupSetMapPattern(player, a ?? "", b ?? "");
        case "type": return groupSetType(player, a ?? "", b ?? "");
        case "forsale": return groupSetSelling(player, a ?? "", b ?? "");
        case "notforsale": return groupSetSelling(player, a ?? "", null);
        case "evict": return groupEvict(player, a ?? "");
        case "trust": return groupTrust(player, a ?? "", b ?? "", true);
        case "untrust": return groupTrust(player, a ?? "", b ?? "", false);
        case "perm": {
            const word = String(c).toLowerCase();
            if (!["on", "off"].includes(word)) return { ok: false, message: "§c[プロット] 例: /plotgroup perm 商店街 openContainer on" };
            return groupSetPermission(player, a ?? "", b ?? "", word === "on");
        }
        case "enable": return groupSetEnabled(player, a ?? "", true);
        case "disable": return groupSetEnabled(player, a ?? "", false);
        default: return { ok: true, message: HELP.join("\n") };
    }
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum("makecountry:plotgroupaction", ACTIONS);

    for (const name of ["makecountry:plotgroup", "makecountry:pg"]) {
        event.customCommandRegistry.registerCommand(
            {
                name,
                description: "プロットグループを操作します (/plotgroup help で使い方)",
                permissionLevel: CommandPermissionLevel.Any,
                mandatoryParameters: [
                    { name: "action", type: CustomCommandParamType.Enum, enumName: "makecountry:plotgroupaction" },
                ],
                optionalParameters: [
                    { name: "group", type: CustomCommandParamType.String },
                    { name: "value", type: CustomCommandParamType.String },
                    { name: "value2", type: CustomCommandParamType.String },
                ],
            },
            // @ts-ignore TS(2345): registerCommand の型が origin を受ける形と合わない
            ((origin: any, action: string, a?: string, b?: string, c?: string) => {
                system.run(() => {
                    const sender = origin?.sourceEntity;
                    if (!(sender instanceof Player)) return;
                    try {
                        sender.sendMessage(run(sender, String(action), a, b, c).message);
                    } catch (error) {
                        sender.sendMessage("§c[プロット] 処理に失敗しました。少し待ってからお試しください。");
                        console.warn(`[plotgroup] ${action} failed: ${error instanceof Error ? error.stack ?? error.message : String(error)}`);
                    }
                });
            }),
        );
    }
});
