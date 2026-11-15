import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { showTradeMainMenu } from "@/features/trade/item-trade.js";

function openTrade(origin: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const player = origin.sourceEntity;
    system.run(() => showTradeMainMenu(player));
}

system.beforeEvents.startup.subscribe(event => {
    for (const name of ["makecountry:trade", "makecountry:torihiki"]) {
        event.customCommandRegistry.registerCommand(
            {
                name,
                description: "求・出形式のアイテムトレードを開きます",
                permissionLevel: CommandPermissionLevel.Any
            },
            // @ts-ignore Custom command callback types differ between API beta versions.
            origin => openTrade(origin)
        );
    }
});
