import { hasHunterHudLease } from "@/shared/integration/standalone.js";
import { Player, system, world } from "@minecraft/server";
import config from "@/config/server.js";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { buildHud, renderHud } from "@/domain/country/plot-hud.js";

/**
 * /plot hud — いま立っているチャンクで「国民・連邦・同盟・友好・中立・敵対」がそれぞれ何をできるかを、
 * アクションバーに出し続ける (Towny のサイドバーの代わり。統合版のサイドバーは全員共通の 1 枚しか無いため)。
 * もう一度 /plot hud で消える。設定はプレイヤーごとに残る (入り直しても続く)。
 */
const PROPERTY = "plotHud";
const REFRESH_TICKS = 20;
const users = new Set<string>();

export function isPlotHudOn(player: Player): boolean {
    return player.getDynamicProperty(PROPERTY) === true;
}

export function togglePlotHud(player: Player): string {
    if (isPlotHudOn(player)) {
        player.setDynamicProperty(PROPERTY, undefined);
        users.delete(player.id);
        if(!hasHunterHudLease(player)) player.onScreenDisplay.setActionBar("");
        return "§7[プロット] 権限の表示を消しました。";
    }
    player.setDynamicProperty(PROPERTY, true);
    users.add(player.id);
    draw(player);
    return [
        "§a[プロット] 権限の表示をオンにしました §7(もう一度 /plot hud で消えます)",
        "§fいま立っているチャンクで、立場ごとに何ができるかを画面下に出し続けます。",
        "§e国民§7 = この国の人 (国の既定の役職だけを持つ人) ／ §e連邦・同盟・友好・中立・敵対§7 = この国から見た相手国の人",
        "§a緑§7 = できる　§4赤§7 = できない　§7(設置・破壊・チェスト・使用 = ボタンやドア・生物 = 動物や村人)",
        "§7プロットがあればプロットの決まり、無ければ国の決まりで判定します。個別に許可された人・国・役職は下に件数だけ出ます",
    ].join("\n");
}

function nameOfPlayer(id: unknown): string | undefined {
    if (!id) return undefined;
    return GetAndParsePropertyData(`player_${id}`)?.name;
}

function draw(player: Player): void {
    if(hasHunterHudLease(player)) return;
    const chunkId = GetPlayerChunkPropertyId(player);
    const chunk = GetAndParsePropertyData(chunkId);
    let plot = chunk?.plot;
    let groupName: string | undefined;
    if (plot?.group) {
        const raw = new DynamicProperties("plotgroup").get(`plotgroup_${plot.group}`);
        if (raw) {
            plot = JSON.parse(raw);
            groupName = plot?.name;
        }
    }
    const country = chunk?.countryId ? GetAndParsePropertyData(`country_${chunk.countryId}`) : undefined;
    const peopleRole = country?.peopleRole ? GetAndParsePropertyData(`role_${country.peopleRole}`) : undefined;
    const embassyCountry = plot?.type === "embassy" && plot?.owner
        ? GetAndParsePropertyData(`country_${GetAndParsePropertyData(`player_${plot.owner}`)?.country}`)
        : undefined;
    const view = buildHud(
        {
            chunk,
            plot,
            country,
            peopleRolePermissions: peopleRole?.permissions ?? [],
            wildernessAllow: config.wildernessAllowPermissions ?? [],
            specialAllow: config.specialAllowPermissions ?? [],
        },
        { owner: nameOfPlayer(plot?.owner), embassyCountry: embassyCountry?.name, group: groupName },
    );
    player.onScreenDisplay.setActionBar(renderHud(view));
}

system.runInterval(() => {
    if (users.size === 0) return;
    for (const id of users) {
        const player = world.getEntity(id);
        if (!(player instanceof Player) || !player.isValid) {
            users.delete(id);
            continue;
        }
        try {
            draw(player);
        } catch {
            // 読み込み途中の場所などは次の回に
        }
    }
}, REFRESH_TICKS);

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn && isPlotHudOn(event.player)) users.add(event.player.id);
});
world.afterEvents.playerLeave.subscribe((event) => users.delete(event.playerId));
