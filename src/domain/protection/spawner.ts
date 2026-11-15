/** Returns whether an item can change a mob spawner's spawned entity. */
export function isSpawnEgg(typeId: string | undefined): boolean {
    return typeId === "minecraft:spawn_egg" || typeId?.endsWith("_spawn_egg") === true;
}
