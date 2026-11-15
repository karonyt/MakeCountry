import { cancelIncident16BlockEvent } from "@/domain/protection/incident16.js";
import { EntityComponentTypes, system, world, BlockComponentTypes, SignSide, Direction } from '@minecraft/server';
import { chestShopConfig } from '@/config/chest-shop.js';
import { CheckPermissionFromLocation, GetAndParsePropertyData, StringifyAndSavePropertyData, playerNameToId } from '@/shared/utils/minecraft.js';
import { addItemsExactly } from '@/shared/minecraft/inventory-delivery.js';

/**
 *
 * @param {string} playerId
 * @returns {number | undefined}
 */
function getPlayerMoney(playerId: string) {
    const playerData = GetAndParsePropertyData(`player_${playerId}`);

    if (playerData === undefined) return;
    if (playerData.money === undefined) return;
    return playerData.money;
}

/**
 *
 * @param {string} playerId
 * @param {number} money
 */
function setPlayerMoney(playerId: string, money: any) {
    const playerData = GetAndParsePropertyData(`player_${playerId}`);
    playerData.money = money;
    StringifyAndSavePropertyData(`player_${playerId}`, playerData);
    return;
}

/**
 *
 * @param {import('@minecraft/server').Block} block
 * @returns {Array<string> | undefined}
 */
export function getSignTexts(block: any) {
    if (!block.typeId.startsWith('minecraft:')) return;
    if (!block.typeId.endsWith('wall_sign')) return;

    const sign = block.getComponent(BlockComponentTypes.Sign);
    if (sign === undefined) return;

    const frontString = sign.getText(SignSide.Front);
    const backString = sign.getText(SignSide.Back);

    return [frontString ?? '', backString ?? ''];
}

/**
 *
 * @param {import('@minecraft/server').Block} block
 * @param {string} frontString
 * @param {string} backString
 */
function setSignTexts(block: any, frontString: any, backString: any) {
    if (!block.typeId.startsWith('minecraft:')) return;
    if (!block.typeId.endsWith('wall_sign')) return;

    const sign = block.getComponent(BlockComponentTypes.Sign);
    if (sign === undefined) return;

    sign.setText(frontString, SignSide.Front);
    sign.setText(backString, SignSide.Back);
}

/**
 *
 * @param {ShopData} shopData
 * @param {import('@minecraft/server').Player} player
 * @param {Array<string>} signTexts
 */
function shopDataToSignTexts(shopData: any) {
    const signTexts = ['', ''];
    const data = [];
    data.push(shopData.player);
    data.push(shopData.amount);

    let priceData = '';
    if (shopData.buyPrice > 0) priceData += `B ${shopData.buyPrice.toString()}`;
    if (shopData.buyPrice > 0 && shopData.sellPrice > 0) priceData += ' : ';
    if (shopData.sellPrice > 0) priceData += `S ${shopData.sellPrice.toString()}`;
    data.push(priceData);
    data.push(shopData.item);
    data.push(chestShopConfig.shopId);

    signTexts[0] = data.join('\n');
    signTexts[1] = chestShopConfig.shopId;

    return signTexts;
}

/** Move the complete order, restoring the source if the native delivery refuses it. */
function moveShopItems(source: any, destination: any, itemId: string, amount: number): boolean {
    const before = Array.from({ length: source.size }, (_, slot) => source.getItem(slot));
    let moved = false;
    try {
        const items = removeItems(source, itemId, amount);
        if (items.reduce((total: number, item: any) => total + item.amount, 0) !== amount) return false;
        if (!addItemsExactly(destination, items)) return false;
        moved = true;
        return true;
    } finally {
        if (!moved) {
            source.clearAll();
            before.forEach((item, slot) => { if (item) source.setItem(slot, item); });
        }
    }
}

/**
 *
 * @param {import('@minecraft/server').Container} container
 * @param {string} itemId

 * @returns {number}
 */
function getItemStock(container: any, itemId: any) {
    let stock = 0;

    for (let index = 0; index < container.size; index++) {
        const item = container.getItem(index);
        if (item === undefined) continue;
        if (item.typeId.replace('minecraft:', '') === itemId) stock += item.amount;
    }

    return stock;
}

/**
 *
 * @typedef  {Object} ShopData
 * @property {string} player
 * @property {string} item
 * @property {number} amount
 * @property {number} buyPrice
 * @property {number} sellPrice
 * @property {import('@minecraft/server').Vector3} location
 * @property {import('@minecraft/server').Container} container
 */

/**
 *
 * @param {string[]} signTexts
 * @param {import('@minecraft/server').Block} block
 * @returns {ShopData | undefined}
 */
export function getShopData(signTexts: any, block: any) {
    if (signTexts == undefined) return;
    const data = signTexts[0].split('\n');

    if (data.length !== 4 && data.length !== 5) return;
    if (signTexts[1] !== chestShopConfig.shopId && data[0] !== chestShopConfig.shopId) return;

    /** @type {ShopData} */
    const shopData = {
        player: data[0],
        item: '?',
        amount: 0,
        buyPrice: 0,
        sellPrice: 0,
        location: { x: 0, y: 0, z: 0 },
        container: undefined,
    };

    if (!/^\d+$/.test(data[1])) return;
    const amount = Number(data[1]);
    if (!Number.isSafeInteger(amount) || amount < 1) return;
    shopData.amount = amount;

    const prices = data[2].replace(/ /g, '').split(':');

    for (const price of prices) {
        if (price.startsWith(chestShopConfig.buyPrefix) || price.endsWith(chestShopConfig.buyPrefix)) {
            const rawPrice = price.replace(chestShopConfig.buyPrefix, '');
            const buyPrice = Number(rawPrice);
            if (!/^\d+$/.test(rawPrice) || !Number.isSafeInteger(buyPrice)) return;

            shopData.buyPrice = buyPrice;
            continue;
        }
        if (price.startsWith(chestShopConfig.sellPrefix) || price.endsWith(chestShopConfig.sellPrefix)) {
            const rawPrice = price.replace(chestShopConfig.sellPrefix, '');
            const sellPrice = Number(rawPrice);
            if (!/^\d+$/.test(rawPrice) || !Number.isSafeInteger(sellPrice)) return;

            shopData.sellPrice = sellPrice;
            continue;
        }
    }

    if (shopData.buyPrice <= 0 && shopData.sellPrice <= 0) return;

    shopData.item = data[3];

    shopData.location = getShopLocation(block);

    const shopBlock = block.dimension.getBlock(shopData.location);
    if (shopBlock === undefined) return;
    if (!chestShopConfig.shopBlockIds.includes(shopBlock.typeId)) return;

    const shop = shopBlock.getComponent(BlockComponentTypes.Inventory);
    if (shop === undefined) return;
    if (shop.container === undefined) return;
    shopData.container = shop.container;

    return shopData;
}

/**
 *
 * @param {import('@minecraft/server').Block} signBlock
 * @returns {import('@minecraft/server').Vector3}
 */
function getShopLocation(signBlock: any) {
    const directions = ['Down', 'Up', 'South', 'North', 'East', 'West'];
    const direction = signBlock.permutation.getState('facing_direction');

    switch (directions[direction]) {
        case Direction.Down: {
            const block = signBlock.above();
            return { x: block.x, y: block.y, z: block.z };
        }
        case Direction.Up: {
            const block = signBlock.below();
            return { x: block.x, y: block.y, z: block.z };
        }
        case Direction.South: {
            const block = signBlock.south();
            return { x: block.x, y: block.y, z: block.z };
        }
        case Direction.North: {
            const block = signBlock.north();
            return { x: block.x, y: block.y, z: block.z };
        }
        case Direction.West: {
            const block = signBlock.west();
            return { x: block.x, y: block.y, z: block.z };
        }
        case Direction.East: {
            const block = signBlock.east();
            return { x: block.x, y: block.y, z: block.z };
        }

        default:
            return { x: signBlock.x, y: signBlock.y, z: signBlock.z };
            ;
    }
}

/**
 *
 * @param {import('@minecraft/server').Container} container
 * @param {string} itemId
 * @param {number} amount
 * @returns {Array<import('@minecraft/server').ItemStack>}
 */
function removeItems(container: any, itemId: any, amount: any) {
    const itemStacks = [];

    for (let index = 0; index < container.size; index++) {
        const item = container.getItem(index);
        if (item === undefined) continue;
        if (item.typeId.replace('minecraft:', '') !== itemId) continue;

        const slot = container.getSlot(index);

        if (amount >= item.amount) {
            itemStacks.push(item.clone());
            slot.setItem(undefined);
            amount -= item.amount;
        } else {
            const removeItem = item.clone();
            removeItem.amount = amount;
            itemStacks.push(removeItem);
            slot.amount -= amount;
            return itemStacks;
        }

        if (amount <= 0) return itemStacks;
    }
    return itemStacks;
}

/**
 *
 * @param {ShopData} shopData
 * @param {import('@minecraft/server').ItemStack | undefined} itemStack
 * @param {string} playerName
 */
function setShopData(shopData: any, itemStack: any, playerName: any) {
    if (shopData.player === chestShopConfig.shopId) shopData.player = playerName;

    if (shopData.item !== '?') return;
    if (itemStack === undefined) return;

    shopData.item = itemStack.typeId.replace('minecraft:', '');
}

function canManageShopContainer(playerId: string, block: any, adminMode = false): boolean {
    if (adminMode) return true;
    const containers = [block];
    if (block.typeId.includes('chest') && (block.getComponent('inventory')?.container?.size ?? 0) > 27) {
        for (const direction of ['north', 'south', 'east', 'west']) {
            try {
                const neighbor = block[direction]();
                if (neighbor?.typeId === block.typeId && (neighbor.getComponent('inventory')?.container?.size ?? 0) > 27) containers.push(neighbor);
            } catch {
                // A neighboring chunk can be outside the loaded world.
            }
        }
    }
    return containers.every(container => {
        const lock = GetAndParsePropertyData(`chest_${container.x}_${container.y}_${container.z}_${container.dimension.id}`);
        return !lock || lock.player === playerId || lock.admin?.includes(playerId);
    });
}

function shopOwnerCanUseContainer(ownerId: string, shopData: any, dimension: any): boolean {
    const block = dimension.getBlock(shopData.location);
    return !!block && ownerId !== undefined && canManageShopContainer(ownerId, block);
}

/**
 * @param {import('@minecraft/server').Block} block
 * @param {string} playerName
 * @returns {boolean | undefined}
 */
export function isShopOwner(block: any, playerName: any) {
    let shopData;
    switch (true) {
        case getSignTexts(block.east()) != undefined:
            shopData = getShopData(getSignTexts(block.east()), block.east());
            if (shopData != undefined)
                if (shopData.location.x == block.location.x && shopData.location.z == block.location.z) return shopData.player == playerName;

        case getSignTexts(block.north()) != undefined:
            shopData = getShopData(getSignTexts(block.north()), block.north());
            if (shopData != undefined)
                if (shopData.location.x == block.location.x && shopData.location.z == block.location.z) return shopData.player == playerName;

        case getSignTexts(block.south()) != undefined:
            shopData = getShopData(getSignTexts(block.south()), block.south());
            if (shopData != undefined)
                if (shopData.location.x == block.location.x && shopData.location.z == block.location.z) return shopData.player == playerName;
        case getSignTexts(block.west()) != undefined:
            shopData = getShopData(getSignTexts(block.west()), block.west());
            if (shopData != undefined)
                if (shopData.location.x == block.location.x && shopData.location.z == block.location.z) return shopData.player == playerName;
        default:
            return undefined;
    }
}

// buy
world.beforeEvents.playerInteractWithBlock.subscribe(async (ev) => {
    if (cancelIncident16BlockEvent(ev)) return;
    try {
        const signTexts = getSignTexts(ev.block);
        if (signTexts === undefined) return;

        if (signTexts[0].split('\n')[0] === chestShopConfig.shopId) ev.cancel = true;
        if (signTexts[0].split('\n')[4] === chestShopConfig.shopId) ev.cancel = true;
        if (signTexts[1] === chestShopConfig.shopId) ev.cancel = true;
        let shopData = getShopData(signTexts, ev.block);
        if (shopData === undefined) return;

        await system.waitTicks(1);
        if (!ev.player.isValid || !ev.block.isValid || ev.player.dimension.id !== ev.block.dimension.id) return;
        if (JSON.stringify(getSignTexts(ev.block)) !== JSON.stringify(signTexts)) return;
        shopData = getShopData(signTexts, ev.block);
        if (!shopData) return;
        if (shopData.player === chestShopConfig.shopId) {
            if (CheckPermissionFromLocation(ev.player, shopData.location.x, shopData.location.z, ev.block.dimension.id, 'openContainer')) return;
            const shopBlock = ev.block.dimension.getBlock(shopData.location);
            if (!shopBlock || !canManageShopContainer(ev.player.id, shopBlock, ev.player.hasTag('adminmode'))) return;
            if (shopData.item === '?' && !ev.itemStack) return;
            setShopData(shopData, ev.itemStack, ev.player.name);
            const signTexts = shopDataToSignTexts(shopData);

            setSignTexts(ev.block, signTexts[0], signTexts[1]);
            return;
        }
        if (signTexts[0].split('\n')[4] !== chestShopConfig.shopId) return;
        if (signTexts[1] !== chestShopConfig.shopId) return;

        if (shopData.buyPrice <= 0) return;
        if (CheckPermissionFromLocation(ev.player, shopData.location.x, shopData.location.z, ev.block.dimension.id, 'shopSell')) return;
        const ownerId = playerNameToId(shopData.player);
        if (!ownerId) return;
        if (!shopOwnerCanUseContainer(ownerId, shopData, ev.block.dimension)) return;

        let money = getPlayerMoney(ev.player.id);

        if (money === undefined) return;
        let shopMoney = getPlayerMoney(ownerId);
        if (shopMoney === undefined) return;
        if (!Number.isFinite(money) || !Number.isFinite(shopMoney)) return;

        if (shopData.buyPrice > shopMoney) return;

        const playerInventory = ev.player.getComponent(EntityComponentTypes.Inventory);
        if (playerInventory === undefined) return;

        // @ts-ignore TS(2339): Property 'container' does not exist on type 'never... Remove this comment to see the full error message
        const playerContainer = playerInventory.container;
        if (playerContainer === undefined) return;
        if (shopData.amount > getItemStock(playerContainer, shopData.item)) return;

        if (!moveShopItems(playerContainer, shopData.container, shopData.item, shopData.amount)) return;

        // if(shopData.player === ev.player.name) return

        shopMoney -= shopData.buyPrice;
        setPlayerMoney(ownerId, shopMoney);

        money = getPlayerMoney(ev.player.id);
        money += shopData.buyPrice;
        setPlayerMoney(ev.player.id, money);
    } catch (error) {
        // An unloaded sign/container or a departing player must not complete a trade.
        console.warn('[ChestShop] transaction aborted', error);
    }
});

// sell
world.afterEvents.entityHitBlock.subscribe(async (ev) => {
    try {
        if (ev.damagingEntity.typeId !== 'minecraft:player') return;

        const signTexts = getSignTexts(ev.hitBlock);
        if (signTexts === undefined) return;

        let shopData = getShopData(signTexts, ev.hitBlock);
        if (shopData === undefined) return;

        if (signTexts[0].split('\n')[4] !== chestShopConfig.shopId) return;
        if (signTexts[1] !== chestShopConfig.shopId) return;

        if (shopData.sellPrice <= 0) return;

        await system.waitTicks(1);
        if (!ev.damagingEntity.isValid || !ev.hitBlock.isValid || ev.damagingEntity.dimension.id !== ev.hitBlock.dimension.id) return;
        if (JSON.stringify(getSignTexts(ev.hitBlock)) !== JSON.stringify(signTexts)) return;
        shopData = getShopData(signTexts, ev.hitBlock);
        if (!shopData) return;
        if (CheckPermissionFromLocation(ev.damagingEntity, shopData.location.x, shopData.location.z, ev.hitBlock.dimension.id, 'shopBuy')) return;
        const ownerId = playerNameToId(shopData.player);
        if (!ownerId) return;
        if (!shopOwnerCanUseContainer(ownerId, shopData, ev.hitBlock.dimension)) return;

        // @ts-ignore TS(2339): Property 'name' does not exist on type 'Entity'.
        let money = getPlayerMoney(ev.damagingEntity.id);
        if (money === undefined) return;
        let shopMoney = getPlayerMoney(ownerId);
        if (shopMoney === undefined) return;
        if (!Number.isFinite(money) || !Number.isFinite(shopMoney)) return;

        if (shopData.sellPrice > money) return;
        if (shopData.amount > getItemStock(shopData.container, shopData.item)) return;

        const playerInventory = ev.damagingEntity.getComponent(EntityComponentTypes.Inventory);
        if (playerInventory === undefined) return;

        // @ts-ignore TS(2339): Property 'container' does not exist on type 'never... Remove this comment to see the full error message
        const playerContainer = playerInventory.container;
        if (playerContainer === undefined) return;

        if (!moveShopItems(shopData.container, playerContainer, shopData.item, shopData.amount)) return;

        // if(shopData.player === ev.player.name) return

        shopMoney += shopData.sellPrice;
        setPlayerMoney(ownerId, shopMoney);

        // @ts-ignore TS(2339): Property 'name' does not exist on type 'Entity'.
        money = getPlayerMoney(ev.damagingEntity.id);

        money -= shopData.sellPrice;
        // @ts-ignore TS(2339): Property 'name' does not exist on type 'Entity'.
        setPlayerMoney(ev.damagingEntity.id, money);
    } catch (error) {
        console.warn('[ChestShop] transaction aborted', error);
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (cancelIncident16BlockEvent(ev)) return;
    if (ev.player.hasTag('mc_admin')) return;
    if (!chestShopConfig.shopBlockIds.includes(ev.block.typeId)) return;

    const isOwner = isShopOwner(ev.block, ev.player.name);
    if (isOwner == undefined) return;
    if (!isOwner) ev.cancel = true;
});
