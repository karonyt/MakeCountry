import { readLiteFlag } from "@/shared/shared-player-props.js";
import { cancelIncident16BlockEvent } from "@/domain/protection/incident16.js";
import { Player, world, system } from "@minecraft/server";
import { openRecipeSelect as OpenPan } from "@/features/forms/default/cooking/fryingpan.js";
import { openRecipeSelect as OpenStew } from "@/features/forms/default/cooking/stew.js";
import { openDeepStewRecipeSelect as OpenDeepStew } from "@/features/forms/default/cooking/deepstew.js";
import { openFryStewRecipeSelect as OpenFryStew } from "@/features/forms/default/cooking/frystew.js";
import { openRecipeSelect as OpenOven } from "@/features/forms/default/cooking/ovenrange.js";
import { openRecipeSelect as OpenMixer } from "@/features/forms/default/cooking/mixer.js";
import { openRecipeSelect as OpenCuttingBoard } from "@/features/forms/default/cooking/cuttingboard.js";
import { openRecipeSelect as OpenFermentationMachine } from "@/features/forms/default/cooking/fermentationmachine.js";
import { openRecipeSelect as OpenIronBoard } from "@/features/forms/default/cooking/ironboard.js";
import { openRecipeSelect as OpenRiceCooker } from "@/features/forms/default/cooking/ricecooker.js";
import { openRecipeSelect as OpenShavedIceMachine } from "@/features/forms/default/cooking/shavedicemachine.js";
import { openRecipeSelect as OpenSteamer } from "@/features/forms/default/cooking/steamer.js";
import { COOKWARE } from '@/content/minerals/cookware-data.js';
import { rememberCookingEquipment, forgetCookingEquipment } from './cookware.js';
import { openFoodFinishing } from '@/features/forms/default/cooking/food-finishing.js';

const cookingForms: Record<string, (player: Player) => void> = {
    "mc:fryingpan": OpenPan,
    "mc:red_fryingpan": OpenPan,
    "mc:blue_fryingpan": OpenPan,
    "mc:green_fryingpan": OpenPan,
    "mc:white_fryingpan": OpenPan,
    "mc:stew": OpenStew,
    "mc:deep_stew": OpenDeepStew,
    "mc:fry_stew": OpenFryStew,
    "mc:oven_range": OpenOven,
    "mc:mixer": OpenMixer,
    "mc:cutting_board": OpenCuttingBoard,
    "mc:fermentation_machine": OpenFermentationMachine,
    "mc:iron_board": OpenIronBoard,
    "mc:rice_cooker": OpenRiceCooker,
    "mc:shaved_ice_machine": OpenShavedIceMachine,
    "mc:steamer": OpenSteamer,
};

for (const [tool, openForm] of Object.entries({
    stew: OpenStew,
    fry_stew: OpenFryStew,
    deep_stew: OpenDeepStew,
    oven_range: OpenOven,
    mixer: OpenMixer,
    rice_cooker: OpenRiceCooker,
    shaved_ice_machine: OpenShavedIceMachine,
    fermentation_machine: OpenFermentationMachine,
    steamer: OpenSteamer,
    cutting_board: OpenCuttingBoard,
    iron_board: OpenIronBoard,
})) {
    for (const color of ["red", "blue", "green", "white"]) {
        cookingForms[`mc:${color}_${tool}`] = openForm;
    }
}

for (const [id, equipment] of Object.entries(COOKWARE)) {
    cookingForms[id] = cookingForms[`mc:${equipment.base}`];
}

const openingCookingForm = new Set<string>();

world.afterEvents.playerLeave.subscribe(event => forgetCookingEquipment(event.playerId));

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.cancel || cancelIncident16BlockEvent(ev)) return;
    const { block, player } = ev;
    const isEnabled = readLiteFlag(player, 'isUseOldCookingSystem');
    /*if (isEnabled ? (isEnabled == 'true' ? true : false) : false) {
        return;
    }*/
    const openForm = cookingForms[block.typeId];
    if (!openForm) return;

    ev.cancel = true;
    // Blocks without an interactive component (e.g. brass/bronze cookware) repeat this event while use is held.
    if (ev.isFirstEvent === false || openingCookingForm.has(player.id)) return;
    openingCookingForm.add(player.id);
    const finishing = player.isSneaking && (block.typeId === 'mc:cutting_board'
        || block.typeId.endsWith('_cutting_board') || COOKWARE[block.typeId as keyof typeof COOKWARE]?.base === 'cutting_board');
    system.runTimeout(() => {
        openingCookingForm.delete(player.id);
        if (!player.isValid || !block.isValid) return;
        if (finishing) { void openFoodFinishing(player, block); return; }
        rememberCookingEquipment(player, block);
        openForm(player);
    });
});
