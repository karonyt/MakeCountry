import { system, type PlayerInteractWithBlockBeforeEvent } from "@minecraft/server";
import { getArtisanQuality } from "@/domain/professions/artisan-quality.js";
import { getFertilizerSpec } from "@/domain/chemical/fertilizer-rules.js";
import { CheckPermissionFromLocation } from '@/shared/utils/minecraft.js';
import { deniesIncident16 } from '@/domain/protection/incident16.js';
import { gateBlockProtectedByCenters, gateProtectionCenters } from "@/shared/integration/standalone.js";

const VANILLA_GROWTH_MAX: Readonly<Record<string, number>> = {
    "minecraft:wheat": 7,
    "minecraft:carrots": 7,
    "minecraft:potatoes": 7,
    "minecraft:beetroot": 7,
    "minecraft:cocoa": 2,
    "minecraft:nether_wart": 3,
    "minecraft:sweet_berry_bush": 3,
};

function getGrowthState(block: PlayerInteractWithBlockBeforeEvent["block"]) {
    const states = block.permutation.getAllStates() as Record<string, string | number | boolean>;
    if (typeof states["mc:growth_stage"] === "number") {
        return { name: "mc:growth_stage", value: states["mc:growth_stage"], maximum: 3 };
    }

    const maximum = VANILLA_GROWTH_MAX[block.typeId];
    if (maximum === undefined) return undefined;
    for (const name of ["growth", "age"] as const) {
        if (typeof states[name] === "number") return { name, value: states[name], maximum };
    }

    return undefined;
}

function canFertilize(player: PlayerInteractWithBlockBeforeEvent['player'], block: PlayerInteractWithBlockBeforeEvent['block']) {
    const { x, z } = block.location;
    const dimension = block.dimension.id;
    return !deniesIncident16(player, x, z, dimension)
        && !CheckPermissionFromLocation(player, x, z, dimension, 'break')
        && !CheckPermissionFromLocation(player, x, z, dimension, 'itemUse');
}

/** All affected plots are checked individually, including after deferral. */
export function tryUseChemicalFertilizer(event: PlayerInteractWithBlockBeforeEvent): boolean {
    if (event.cancel) return false;
    const item = event.itemStack;
    if (!item || !getFertilizerSpec(item.typeId, 0)) return false;
    if (!event.isFirstEvent) {
        event.cancel = true;
        return true;
    }

    const growth = getGrowthState(event.block);
    if (!growth || growth.value >= growth.maximum) return false;
    if (!canFertilize(event.player, event.block)) {
        event.cancel = true;
        return true;
    }

    event.cancel = true;
    const block = event.block;
    const player = event.player;
    const selectedSlot = player.selectedSlotIndex;
    const itemId = item.typeId;

    system.run(() => {
        if (!player.isValid || !block.isValid || !canFertilize(player, block)) return;
        const current = player.getComponent("inventory")?.container?.getItem(selectedSlot);
        if (!current || current.typeId !== itemId) return;
        const currentGrowth = getGrowthState(block);
        if (!currentGrowth || currentGrowth.value >= currentGrowth.maximum) return;

        // Re-read purity from the stack that will actually be consumed. This
        // prevents swapping a pristine stack out during the deferred callback.
        const quality = getArtisanQuality(current);
        const spec = getFertilizerSpec(itemId, quality);
        if (!spec) return;
        const gateCenters = gateProtectionCenters(block.dimension);
        let changed = 0;
        let centerAdvance = 0;
        for (let dx = -spec.radius; dx <= spec.radius; dx++) {
            for (let dz = -spec.radius; dz <= spec.radius; dz++) {
                try {
                    const target = block.dimension.getBlock({ x: block.x + dx, y: block.y, z: block.z + dz });
                    if (!target?.isValid || !canFertilize(player, target)) continue;
                    if (gateBlockProtectedByCenters(target.location, gateCenters)) continue;
                    const growth = getGrowthState(target);
                    if (!growth || growth.value >= growth.maximum) continue;
                    const next = Math.min(growth.maximum, growth.value + spec.steps);
                    // @ts-ignore Runtime-validated custom crop state.
                    target.setPermutation(target.permutation.withState(growth.name, next));
                    changed++;
                    if (dx === 0 && dz === 0) centerAdvance = next - growth.value;
                } catch {
                    // Ignore unloaded neighbours and continue within this 3x3.
                }
            }
        }
        if (!changed) return;

        const container = player.getComponent("inventory")?.container;
        if (!container) return;
        if (current.amount <= 1) container.setItem(selectedSlot);
        else {
            current.amount -= 1;
            container.setItem(selectedSlot, current);
        }

        player.playSound("item.bone_meal.use", { volume: 0.8, pitch: 1 + quality * 0.02 });
        player.onScreenDisplay.setActionBar({
            rawtext: [
                { text: "§a" },
                spec.radius ? { translate: 'chemical.fertilizer.area_applied', with: [String(changed)] }
                    : { translate: 'chemical.fertilizer.applied' },
                { text: spec.radius ? '' : ` §7(+${centerAdvance})` },
            ],
        });
    });

    return true;
}
