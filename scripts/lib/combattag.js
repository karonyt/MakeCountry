import { Player, system, world } from "@minecraft/server";
import config from "../config";

const combatSeconds = new Map();

world.afterEvents.entityHurt.subscribe(ev => {
    if (!config.combatTagValidity) return;
    const { hurtEntity, damageSource } = ev;
    if (!(hurtEntity instanceof Player)) return;
    if (config.combatTagValidityOnlyPvP) {
        if (!(damageSource.damagingEntity instanceof Player)) return;
    };
    combatSeconds.set(hurtEntity.id, config.combatTagSeconds);
    if (hurtEntity.dimension.getEntities({ location: hurtEntity.location, maxDistance: config.maxDropDistance, type: `mc:core` }).length > 0) {
        combatSeconds.set(hurtEntity.id, config.combatTagSeconds * 2);
    };
    hurtEntity.addTag(`mc_combat`);
    return;
});

world.afterEvents.entityDie.subscribe((ev) => {
    const player = ev.deadEntity;
    if (!(player instanceof Player)) return;
    combatSeconds.delete(player.id);
    player.removeTag(`mc_combat`);
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { initialSpawn, player } = ev;
    if (!initialSpawn) return;
    combatSeconds.delete(player.id);
    player.removeTag(`mc_combat`);
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        if (!config.combatTagValidity) return;
        const players = world.getPlayers({ tags: [`mc_combat`] });
        for (const player of players) {
            const value = combatSeconds.get(player.id);
            if (!value) {
                player.removeTag(`mc_combat`);
                continue;
            };
            if (value <= 0) {
                player.playSound(`random.levelup`, { location: player.location });
                combatSeconds.delete(player.id);
                player.removeTag(`mc_combat`);
                continue;
            };
            if (0 < value) {
                combatSeconds.set(player.id, value - 1);
                continue;
            };
        };
    }, 20);
})