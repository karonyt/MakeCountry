import type { Player } from "@minecraft/server";
import { PlayerMarketMainMenu } from "@/features/market/player-market.js";

// The phone must use the same inventory and transaction checks as /market.
export {
    PlayerMarketCheckSold,
    PlayerMarketWithdrawalGoodsMainMenu,
    PlayerMarketWithdrawalGoodsSelectMenu,
    PlayerMarketExhibitMainMenu,
    PlayerMarketExhibitSelectItemMenu,
    PlayerMarketSelectCommonForm,
} from "@/features/market/player-market.js";

export function KarcariApp(player: Player) {
    PlayerMarketMainMenu(player);
}
