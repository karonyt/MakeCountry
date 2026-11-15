import { Player, type Entity } from "@minecraft/server";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";
import { currentFlowOffset, headDisplay } from "@/domain/player/supporter-badge.js";
import config from "@/config/server.js";

/**
 * プレイヤーの名前に国名セット
 * 月額サポーターは 1 行めに ★ (シルバー以上は二つ名も)、2 行めの名前に色 (ゴールド以上。パトロンは流れる色)
 * @param {Player} player
 */
export function nameSet(player: Entity | undefined) {
    if (!(player instanceof Player) || !player.isValid) return;
    try {
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        let countryLine = ``;
        if (playerData?.country && playerData.country >= 1) {
            const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
            if (playerCountryData?.name) {
                const federation = normalizeFederationData(playerCountryData);
                const federationName = isFederationActive(federation) ? ` / ${federation.name}` : ``;
                countryLine = `[${playerCountryData.name}${federationName}]`;
            }
        }
        const decorated = headDisplay({
            playerName: player.name,
            countryLine,
            penName: penNameOf(player),
            nameColor: player.getDynamicProperty(`supporterNameColor`),
            flowOffset: currentFlowOffset(),
        });
        if (decorated !== undefined) {
            player.nameTag = decorated;
            return;
        }
        player.nameTag = countryLine ? `${countryLine}\n${player.name}` : player.name;
    } catch (error) {
        if (player.isValid && !(error instanceof Error && error.name === "InvalidEntityError")) throw error;
    }
};

/** いまの二つ名 (前 + 後)。二つ名の仕組みが無効なら undefined */
function penNameOf(player: Player): string | undefined {
    if (!config.pennameEnable) return undefined;
    const before = player.getDynamicProperty(`pennameBefore`) ?? config.initialPennameBefore;
    const after = player.getDynamicProperty(`pennameAfter`) ?? config.initialPennameAfter;
    const text = `${before ?? ""}§r${after ?? ""}`;
    return text.replace(/§./g, "").trim().length > 0 ? text : undefined;
}
