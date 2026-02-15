import { Player, world, system } from "@minecraft/server";
import { openRecipeSelect } from "../../forms/default/chemical/chemical";

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { block, player } = ev;
    const isEnabled = player.getDynamicProperty('isUseOldCookingSystem') ?? false;
    if (isEnabled ? (isEnabled == 'true' ? true : false) : false) {
        return;
    }
    if (block.typeId == 'mc:chemical_lab') {
        ev.cancel = true;
        system.runTimeout(() => {
            openRecipeSelect(player);
        });
    };
});