import { Dimension, Entity, ItemStack, Player, system, Vector3, world } from "@minecraft/server";

type PlayerFishingAfterEvent = {
    result: boolean;
    player?: Player;
    itemEntity?: Entity;
    itemStack?: ItemStack;
    dimension?: Dimension;
};

type PlayerFishingAfterEventCallback = (event: PlayerFishingAfterEvent) => void;

type PendingFishingHook = {
    hookId: string;
    playerId: string;
    dimension: Dimension;
    location: Vector3;
    removedAt: number;
};

const fishingPlayerQueue: string[] = [];
const fishingEntityIds = new Map<string, string>();
const callbacks = new Set<PlayerFishingAfterEventCallback>();
const itemSpawnTimes = new Map<string, number>();
const pendingFishingHooks = new Map<string, PendingFishingHook>();

const FISHED_ITEM_MAX_AGE_MS = 2500;
const FISHED_ITEM_SEARCH_MAX_DISTANCE = 5;
const FISHED_ITEM_SEARCH_RETRIES = 3;
const ITEM_SPAWN_TIME_KEEP_MS = 10000;
const ITEM_SPAWN_TIME_SKEW_MS = 250;

export default class playerFishingAfterEvent {
    callback: PlayerFishingAfterEventCallback;

    constructor(callback: PlayerFishingAfterEventCallback) {
        this.callback = callback;
        callbacks.add(this.callback);
    }

    static subscribe(callback: PlayerFishingAfterEventCallback) {
        new playerFishingAfterEvent(callback);
    }

    static unsubscribe(callback: PlayerFishingAfterEventCallback) {
        callbacks.delete(callback);
    }
}

world.beforeEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;

    if (!(source instanceof Player)) return;
    if (itemStack.typeId !== "minecraft:fishing_rod") return;
    if (fishingEntityIds.has(source.id)) return;
    if (fishingPlayerQueue.includes(source.id)) return;

    fishingPlayerQueue.push(source.id);
});

world.afterEvents.entitySpawn.subscribe(ev => {
    const { entity } = ev;

    if (entity.typeId === "minecraft:item") {
        itemSpawnTimes.set(entity.id, Date.now());
        dispatchPendingHookNearItem(entity);
        return;
    }

    if (entity.typeId !== "minecraft:fishing_hook") return;

    const playerId = getFishingHookOwnerId(entity) ?? fishingPlayerQueue.shift();
    if (!playerId) return;

    removeQueuedPlayer(playerId);
    fishingEntityIds.set(playerId, entity.id);
});

world.beforeEvents.entityRemove.subscribe(ev => {
    const { removedEntity } = ev;

    if (removedEntity.typeId === "minecraft:item") {
        itemSpawnTimes.delete(removedEntity.id);
        return;
    }

    if (removedEntity.typeId !== "minecraft:fishing_hook") return;

    const playerId = getPlayerIdFromHookId(removedEntity.id);
    if (!playerId) return;

    const pendingHook: PendingFishingHook = {
        hookId: removedEntity.id,
        playerId,
        dimension: removedEntity.dimension,
        location: { ...removedEntity.location },
        removedAt: Date.now(),
    };

    fishingEntityIds.delete(playerId);
    pendingFishingHooks.set(pendingHook.hookId, pendingHook);
    scheduleFishingEvent(pendingHook, 0);
});

system.runInterval(() => {
    const now = Date.now();
    for (const [entityId, spawnTime] of itemSpawnTimes) {
        if (now - spawnTime > ITEM_SPAWN_TIME_KEEP_MS) itemSpawnTimes.delete(entityId);
    }
}, 200);

function getFishingHookOwnerId(entity: Entity) {
    try {
        const projectile = entity.getComponent("minecraft:projectile");
        const owner = projectile?.owner;
        return owner instanceof Player ? owner.id : undefined;
    } catch {
        return undefined;
    }
}

function getPlayerIdFromHookId(hookId: string) {
    for (const [playerId, storedHookId] of fishingEntityIds) {
        if (storedHookId === hookId) return playerId;
    }

    return undefined;
}

function removeQueuedPlayer(playerId: string) {
    const queueIndex = fishingPlayerQueue.indexOf(playerId);
    if (queueIndex >= 0) fishingPlayerQueue.splice(queueIndex, 1);
}

function scheduleFishingEvent(pendingHook: PendingFishingHook, attempt: number) {
    system.runTimeout(() => {
        if (!pendingFishingHooks.has(pendingHook.hookId)) return;

        const event = createFishingEvent(pendingHook);
        if (!event.result && attempt < FISHED_ITEM_SEARCH_RETRIES) {
            scheduleFishingEvent(pendingHook, attempt + 1);
            return;
        }

        pendingFishingHooks.delete(pendingHook.hookId);
        dispatchEvent(event);
    }, 1);
}

function dispatchPendingHookNearItem(itemEntity: Entity) {
    const now = Date.now();
    let nearestHook: PendingFishingHook | undefined;
    let nearestDistance = Number.MAX_SAFE_INTEGER;

    for (const pendingHook of pendingFishingHooks.values()) {
        if (pendingHook.dimension.id !== itemEntity.dimension.id) continue;
        if (now - pendingHook.removedAt > FISHED_ITEM_MAX_AGE_MS) continue;

        const distance = getDistanceSquared(pendingHook.location, itemEntity.location);
        if (distance > FISHED_ITEM_SEARCH_MAX_DISTANCE ** 2) continue;
        if (distance >= nearestDistance) continue;

        nearestHook = pendingHook;
        nearestDistance = distance;
    }

    if (!nearestHook) return;

    pendingFishingHooks.delete(nearestHook.hookId);
    system.run(() => {
        dispatchEvent(createFishingEvent(nearestHook, itemEntity));
    });
}

function createFishingEvent(pendingHook: PendingFishingHook, knownItem?: Entity): PlayerFishingAfterEvent {
    const player = getPlayerFromId(pendingHook.playerId);
    if (!player) return { result: false };

    const itemEntity = knownItem ?? findFishedItem(pendingHook);
    if (!itemEntity) return { result: false, player };

    const itemComponent = itemEntity.getComponent("item");
    const itemStack = itemComponent?.itemStack;
    if (!itemStack) return { result: false, player };

    return {
        result: true,
        player,
        itemEntity,
        itemStack,
        dimension: itemEntity.dimension,
    };
}

function findFishedItem(pendingHook: PendingFishingHook) {
    const now = Date.now();
    const items = pendingHook.dimension.getEntities({
        type: "item",
        location: pendingHook.location,
        maxDistance: FISHED_ITEM_SEARCH_MAX_DISTANCE,
        closest: 8,
    });

    return items.find(item => {
        const spawnTime = itemSpawnTimes.get(item.id);
        if (!spawnTime) return false;
        if (spawnTime < pendingHook.removedAt - ITEM_SPAWN_TIME_SKEW_MS) return false;
        return now - spawnTime <= FISHED_ITEM_MAX_AGE_MS;
    });
}

function dispatchEvent(event: PlayerFishingAfterEvent) {
    callbacks.forEach(callback => callback(event));
}

function getDistanceSquared(a: Vector3, b: Vector3) {
    const x = a.x - b.x;
    const y = a.y - b.y;
    const z = a.z - b.z;
    return x * x + y * y + z * z;
}

function getPlayerFromId(id: string) {
    return world.getAllPlayers().find(player => player.id === id);
}
