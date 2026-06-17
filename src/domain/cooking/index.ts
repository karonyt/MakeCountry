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

const cookingForms: Record<string, (player: Player) => void> = {
    "mc:fryingpan": OpenPan,
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

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { block, player } = ev;
    const isEnabled = player.getDynamicProperty('isUseOldCookingSystem') ?? false;
    /*if (isEnabled ? (isEnabled == 'true' ? true : false) : false) {
        return;
    }*/
    const openForm = cookingForms[block.typeId];
    if (!openForm) return;

    ev.cancel = true;
    system.runTimeout(() => {
        openForm(player);
    });
});
