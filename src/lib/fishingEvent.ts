import { world, system, Player, ItemStack, Entity, Dimension } from "@minecraft/server";

/**
 * @callback PlayerFishingAfterEventCallback
 * @param {PlayerFishingAfterEvent} event - event object
 */

/**
 * @typedef {Object} PlayerFishingAfterEvent
 * @property {boolean} result - Whether the fishing was successful or not
 * @property {Player | undefined} player - The player who caused the event
 * @property {Entity | undefined} itemEntity - Entity of the item caught
 * @property {ItemStack | undefined} itemStack - Fished items
 * @property {Dimension | undefined} dimension - Fished items
 */

/** @type {Player[]} */
const fishingPlayerQueue: any = [];

/** @type {Map<string, string>} */
const fishingEntityIds = new Map();

/** @type {Map<PlayerFishingAfterEventCallback, boolean>} */
const callbacks = new Map();

export default class playerFishingAfterEvent {
    callback: any;
    /**
     * @param {PlayerFishingAfterEventCallback} callback 
     */
    constructor(callback: any) {
        this.callback = callback;
        callbacks.set(this.callback, true);
    }

    /**
     * @param {PlayerFishingAfterEventCallback} callback 
     */
    static subscribe(callback: any) {
        new playerFishingAfterEvent(callback);
    }

    /**
     * @param {PlayerFishingAfterEventCallback} callback 
     */
    static unsubscribe(callback: any) {
        callbacks.delete(callback);
    }
}

world.beforeEvents.itemUse.subscribe(ev => {
    const { source, itemStack } = ev;

    if (itemStack.typeId === "minecraft:fishing_rod") {
        if (!fishingEntityIds.has(source.id) && !fishingPlayerQueue.includes(source)) {
            // キューに追加
            fishingPlayerQueue.push(source);
        }
    }
});

world.afterEvents.entitySpawn.subscribe(ev => {
    const { entity } = ev;
    
    //スポーンしたアイテムに時間のプロパティを追加
    if (entity.typeId === "minecraft:item") {
        // @ts-ignore TS(2339): Property 'time' does not exist on type 'Entity'.
        entity.time = Date.now();
    };
});

world.afterEvents.entitySpawn.subscribe(ev => {
    const { entity } = ev;

    if (entity.typeId === "minecraft:fishing_hook") {
        const player = fishingPlayerQueue[0];

        // Mapに保存
        fishingEntityIds.set(player.id, entity.id);

        // キューから削除
        fishingPlayerQueue.splice(0, 1);
    }
});

world.beforeEvents.entityRemove.subscribe(ev => {
    const { removedEntity } = ev;

    if (removedEntity.typeId === "minecraft:fishing_hook") {
        // アイテムを取得
        const item = removedEntity.dimension.getEntities({
            type: "item",
            location: removedEntity.location,
            minDistance: 0,
            maxDistance: 0.2
        })[0];

        //既にあるアイテムに釣竿が当たってた場合、終了
        // @ts-ignore TS(2339): Property 'time' does not exist on type 'Entity'.
        if (item?.time) return;

        /** @type {PlayerFishingAfterEvent} */
        let events = {};

        const ids = fishingEntityIds.keys();

        // プレイヤーをセット
        for (const id of ids) {
            if (fishingEntityIds.get(id) === removedEntity.id) {
                // @ts-ignore TS(2339): Property 'player' does not exist on type '{}'.
                events.player = getPlayerFromId(id);
                fishingEntityIds.delete(id);
            }
        }

        if (item) {
            // @ts-ignore TS(2339): Property 'result' does not exist on type '{}'.
            events.result = true;
            // @ts-ignore TS(2339): Property 'itemEntity' does not exist on type '{}'.
            events.itemEntity = item;
            // @ts-ignore TS(2339): Property 'itemStack' does not exist on type '{}'.
            events.itemStack = item.getComponent("item").itemStack;
            // @ts-ignore TS(2339): Property 'dimension' does not exist on type '{}'.
            events.dimension = item.dimension;
        } else {
            // @ts-ignore TS(2339): Property 'result' does not exist on type '{}'.
            events.result = false;
        }

        system.run(() => {
            callbacks.forEach((_, callback) => callback(events));
        });
    }
});

/**
 * @param {string} id 
 * @returns {Player | undefined}
 */
function getPlayerFromId(id: any) {
    return world.getAllPlayers().filter(player => player.id === id)[0];
}