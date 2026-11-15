import { cancelIncident16BlockEvent } from "@/domain/protection/incident16.js";
import { Player, world, system } from "@minecraft/server";
import { openRecipeSelect } from "@/features/forms/default/smelting/furnace.js";
import "@/domain/smelting/forged-traits.js";

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (cancelIncident16BlockEvent(ev)) return;
    const { block, player } = ev;
    const isEnabled = player.getDynamicProperty('isUseOldCookingSystem') ?? false;
    if (isEnabled ? (isEnabled == 'true' ? true : false) : false) {
        return;
    }
    if (block.typeId == 'mc:blacksmith') {
        ev.cancel = true;
        system.runTimeout(() => {
            openRecipeSelect(player);
        });
    };
});
