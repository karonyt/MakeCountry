import { EntityDamageCause, EquipmentSlot, Player, system, world } from "@minecraft/server";
import { getArtisanQuality, getArtisanRank } from "@/domain/professions/artisan-quality.js";
import {
    getForgedMaterial,
    getForgedTraitCooldownTicks,
    getForgedTraitProcChance,
    FORGED_TRAIT_TRANSLATION_KEYS,
} from "@/domain/smelting/forged-trait-data.js";

const nextProcTick = new Map<string, number>();

function showTraitProc(player: Player, translationKey: string) {
    player.onScreenDisplay.setActionBar({
        rawtext: [
            { text: "§6✦ §f" },
            { translate: translationKey },
        ],
    });
    player.playSound("random.orb", { volume: 0.45, pitch: 1.25 });
}

world.afterEvents.entityHitEntity.subscribe((event) => {
    const player = event.damagingEntity;
    if (!(player instanceof Player)) return;

    const item = player.getComponent("equippable")?.getEquipment(EquipmentSlot.Mainhand);
    if (!item || !getArtisanRank(item)) return;

    const material = getForgedMaterial(item.typeId);
    if (!material) return;

    const quality = getArtisanQuality(item);
    // Share one cooldown across materials so swapping weapons cannot bypass it.
    const cooldownKey = player.id;
    if ((nextProcTick.get(cooldownKey) ?? 0) > system.currentTick) return;

    // Even a low-rank forge can reveal its material identity. Better work makes
    // the signature effect more reliable, while the cooldown keeps PvP sane.
    const procChance = getForgedTraitProcChance(quality);
    if (Math.random() > procChance) return;

    nextProcTick.set(cooldownKey, system.currentTick + getForgedTraitCooldownTicks(quality));
    const target = event.hitEntity;

    try {
        switch (material) {
            case "aluminum":
                player.addEffect("speed", 60 + quality * 4, {
                    amplifier: quality >= 9 ? 1 : 0,
                    showParticles: true,
                });
                break;
            case "vanadium":
                target.applyDamage(0.75 + quality * 0.15, {
                    cause: EntityDamageCause.magic,
                    damagingEntity: player,
                });
                break;
            case "titanium":
                player.addEffect("resistance", 45 + quality * 3, {
                    amplifier: quality >= 10 ? 1 : 0,
                    showParticles: true,
                });
                break;
            case "tungsten":
                target.addEffect("slowness", 55 + quality * 4, {
                    amplifier: quality >= 8 ? 1 : 0,
                    showParticles: true,
                });
                break;
            case "mithril":
                player.addEffect("regeneration", 35 + quality * 3, {
                    amplifier: quality >= 10 ? 1 : 0,
                    showParticles: true,
                });
                break;
            case "orichalcum":
                target.applyDamage(1 + quality * 0.16, {
                    cause: EntityDamageCause.magic,
                    damagingEntity: player,
                });
                player.addEffect("regeneration", 30 + quality * 2, {
                    amplifier: quality >= 11 ? 1 : 0,
                    showParticles: true,
                });
                break;
        }
        showTraitProc(player, FORGED_TRAIT_TRANSLATION_KEYS[material]);
    } catch {
        // An entity may disappear between the hit event and an effect call.
    }
});

world.afterEvents.playerLeave.subscribe((event) => {
    nextProcTick.delete(event.playerId);
});
