import { Player, world, system } from "@minecraft/server";
import { openRecipeSelect as OpenPan } from "../../forms/default/cooking/fryingpan";
import { openRecipeSelect as OpenStew } from "../../forms/default/cooking/stew";
import { openDeepStewRecipeSelect as OpenDeepStew } from "../../forms/default/cooking/deepstew";
import { openFryStewRecipeSelect as OpenFryStew } from "../../forms/default/cooking/frystew";
import { openRecipeSelect as OpenOven } from "../../forms/default/cooking/ovenrange";
import { openRecipeSelect as OpenMixer } from "../../forms/default/cooking/mixer";

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { block, player } = ev;
    const isEnabled = player.getDynamicProperty('isUseOldCookingSystem') ?? false;
    /*if (isEnabled ? (isEnabled == 'true' ? true : false) : false) {
        return;
    }*/
    if (block.typeId == 'mc:fryingpan') {
        ev.cancel = true;
        system.runTimeout(() => {
            OpenPan(player);
        });
        return;
    };
    if (block.typeId == 'mc:stew') {
        ev.cancel = true;
        system.runTimeout(() => {
            OpenStew(player);
        });
        return;
    };
    if (block.typeId == 'mc:deep_stew') {
        ev.cancel = true;
        system.runTimeout(() => {
            OpenDeepStew(player);
        });
        return;
    };
    if (block.typeId == 'mc:fry_stew') {
        ev.cancel = true;
        system.runTimeout(() => {
            OpenFryStew(player);
        });
        return;
    };
    if (block.typeId == 'mc:oven_range') {
        ev.cancel = true;
        system.runTimeout(() => {
            OpenOven(player);
        });
        return;
    };
    if (block.typeId == 'mc:mixer') {
        ev.cancel = true;
        system.runTimeout(() => {
            OpenMixer(player);
        });
        return;
    };
});