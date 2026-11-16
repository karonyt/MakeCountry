import { readLiteFlag } from "@/shared/shared-player-props.js";
import { cancelIncident16BlockEvent } from "@/domain/protection/incident16.js";
import { Player, world, system } from "@minecraft/server";
import { openRecipeSelect } from "@/features/forms/default/chemical/chemical.js";
import { tryUseChemicalFertilizer } from "@/domain/chemical/fertilizer.js";

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (cancelIncident16BlockEvent(ev)) return;
    // Other guards may already have denied this interaction. Do not let the
    // deferred fertiliser mutation or lab form bypass that veto.
    if (ev.cancel) return;
    if (tryUseChemicalFertilizer(ev)) return;
    const { block, player } = ev;
    const isEnabled = readLiteFlag(player, 'isUseOldCookingSystem');
    if (isEnabled) {
        return;
    }
    if (block.typeId == 'mc:chemical_lab') {
        ev.cancel = true;
        system.runTimeout(() => {
            openRecipeSelect(player);
        });
    };
});
