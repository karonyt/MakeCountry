import { EntityComponentTypes, Player, system, world } from "@minecraft/server";
import config from "@/config/server.js";

const combatSeconds = new Map<string, number>();
const loginCombatTagSeconds = 5;

function refreshCombatTag(player: Player): void {
    if (!player.isValid) return;
    const nearCore = player.dimension.getEntities({
        location: player.location, maxDistance: config.maxDropDistance, type: "mc:core",
    }).length > 0;
    combatSeconds.set(player.id, config.combatTagSeconds * (nearCore ? 2 : 1));
    player.addTag("mc_combat");
}

world.afterEvents.entityHurt.subscribe(ev => {
    if (!config.combatTagValidity || !Number.isFinite(ev.damage) || ev.damage <= 0) return;
    const { hurtEntity, damageSource } = ev;
    if (!(hurtEntity instanceof Player) || !hurtEntity.isValid) return;
    const direct = damageSource.damagingEntity;
    const projectile = damageSource.damagingProjectile;
    const attacker = direct instanceof Player ? direct
        : projectile?.isValid ? projectile.getComponent(EntityComponentTypes.Projectile)?.owner : undefined;
    if (config.combatTagValidityOnlyPvP && !(attacker instanceof Player)) return;
    refreshCombatTag(hurtEntity);
    // Scripted melee (including Iaido) also reaches this successful native
    // after-event. Tag both PvP participants through the same expiry map,
    // including the delayed native replay used by hunter health.
    if (attacker instanceof Player && attacker.id !== hurtEntity.id) refreshCombatTag(attacker);
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
    if (!config.combatTagValidity) {
        combatSeconds.delete(player.id);
        player.removeTag(`mc_combat`);
        return;
    };
    combatSeconds.set(player.id, loginCombatTagSeconds);
    player.addTag(`mc_combat`);
});

world.afterEvents.worldLoad.subscribe(() => {
    console.warn(`[CombatTag] ready confirmed-pvp=both enabled=${config.combatTagValidity} seconds=${config.combatTagSeconds}`);
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
