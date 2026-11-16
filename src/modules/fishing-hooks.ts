// 釣りパックが Lite からの呼び出しに応える処理。
import type { RawMessage } from "@minecraft/server";
import fishingConfig from "@/config/fishing.js";
import { getFishManager } from "@/domain/fishing/fishing.js";
import { showFishEncyclopedia } from "@/features/fishing/fish-encyclopedia.js";
import { boardMessage } from "@/domain/ranking/board-message.js";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { provideHook, provideValue } from "@/shared/hooks.js";

provideHook("fishing.openEncyclopedia", player => {
    if (player) showFishEncyclopedia(player);
});

/** 魚のランキング看板の内容。 */
function fishBoard(fishTypeId: string): RawMessage {
    const fish = fishingConfig.allFishes.find(entry => entry.typeId === fishTypeId);
    const fishName: RawMessage = fish ? { translate: fish.name } : { text: fishTypeId.split(":").at(-1) ?? fishTypeId };
    const rank = getFishManager().getServerFishRanking(fishTypeId);
    const top = rank.top.map((entry: { playerId: string; playerName?: string; size: number }) => {
        // フル版ではプレイヤーデータの最新の名前を使う (分割版では記録時の名前)
        const player = GetAndParsePropertyData(`player_${entry.playerId}`);
        return { name: player?.name ?? entry.playerName ?? entry.playerId, value: { text: `${entry.size} cm` } };
    });
    return boardMessage({
        translate: "game.ui.ranking.fish",
        with: { rawtext: [fishName, { text: String(top.length) }] },
    }, top);
}
provideValue("fishing.board", fishBoard);
