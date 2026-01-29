import { EntityComponentTypes, system, world, BlockComponentTypes, SignSide, Direction } from '@minecraft/server';
import { chestShopConfig } from '../chest_shop_config.js';
import { GetAndParsePropertyData, StringifyAndSavePropertyData, playerNameToId } from './util.js';

/**
 *
 * @param {string} playerName
 * @returns {number | undefined}
 */
function getPlayerMoney(playerName) {
    const id = playerNameToId(playerName);
    let playerData = GetAndParsePropertyData(`player_${id}`);

    if (playerData === undefined) return;
    if (playerData.money === undefined) return;
    return playerData.money;
}

/**
 *
 * @param {string} playerName
 * @param {number} money
 */
function setPlayerMoney(playerName, money) {
    const id = playerNameToId(playerName);
    const playerData = GetAndParsePropertyData(`player_${id}`);
    playerData.money = money;
    StringifyAndSavePropertyData(`player_${id}`, playerData);
    return;
}

/**
 *
 * @param {import('@minecraft/server').Block} block
 * @returns {Array<string> | undefined}
 */
export function getSignTexts(block) {
    if (!block.typeId.startsWith('minecraft:')) return;
    if (!block.typeId.endsWith('wall_sign')) return;

    const sign = block.getComponent(BlockComponentTypes.Sign);
    if (sign === undefined) return;

    const frontString = sign.getText(SignSide.Front);
    const backString = sign.getText(SignSide.Back);

    if (frontString === undefined || backString === undefined) return;

    return [frontString, backString];
}

/**
 *
 * @param {import('@minecraft/server').Block} block
 * @param {string} frontString
 * @param {string} backString
 */
function setSignTexts(block, frontString, backString) {
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
function shopDataToSignTexts(shopData) {
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

/**
 *
 * @param {import('@minecraft/server').Container} container
 * @param {Array<import('@minecraft/server').ItemStack>} itemStacks
 */
function addItems(container, itemStacks) {
    for (const itemStack of itemStacks) {
        container.addItem(itemStack);
    }
}

/**
 *
 * @param {import('@minecraft/server').Container} container
 * @param {Array<import('@minecraft/server').ItemStack>} itemStacks
 * @returns {boolean}
 */
function canAddItems(container, itemStacks) {
    const items = cloneItems(itemStacks);

    items.sort((a, b) => {
        return a.amount > b.amount;
    });

    for (let cIndex = 0; cIndex < container.size; cIndex++) {
        const item = container.getItem(cIndex);
        if (item === undefined) continue;
        let stackableAmount = item.maxAmount - item.amount;
        if (stackableAmount <= 0) continue;

        for (let iIndex = 0; iIndex < items.length; iIndex++) {
            if (!item.isStackableWith(items[iIndex])) continue;

            if (stackableAmount > items[iIndex].amount) {
                stackableAmount -= items[iIndex].amount;
                items.splice(iIndex, 1);
                iIndex -= 1;
                continue;
            } else if (stackableAmount === items[iIndex].amount) {
                items.splice(iIndex, 1);
                break;
            } else if (stackableAmount < items[iIndex].amount) {
                items[iIndex].amount -= stackableAmount;
                break;
            }
        }
    }

    return container.emptySlotsCount >= items.length;
}

/**
 *
 * @param {Array<import('@minecraft/server').ItemStack>} itemStacks
 * @returns {Array<import('@minecraft/server').ItemStack>}
 */
function cloneItems(itemStacks) {
    const newItemStacks = [];

    for (let index = 0; index < itemStacks.length; index++) {
        newItemStacks.push(itemStacks[index].clone());
    }

    return newItemStacks;
}

/**
 *
 * @param {import('@minecraft/server').Container} container
 * @param {string} itemId

 * @returns {number}
 */
function getItemStock(container, itemId) {
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
export function getShopData(signTexts, block) {
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

    const amount = parseInt(data[1]);
    if (amount === NaN || amount < 1) return;
    shopData.amount = amount;

    const prices = data[2].replace(/ /g, '').split(':');

    for (const price of prices) {
        if (price.startsWith(chestShopConfig.buyPrefix) || price.endsWith(chestShopConfig.buyPrefix)) {
            const buyPrice = parseInt(price.replace(chestShopConfig.buyPrefix, ''));
            if (isNaN(buyPrice) || typeof buyPrice !== 'number') continue;

            shopData.buyPrice = buyPrice;
            continue;
        }
        if (price.startsWith(chestShopConfig.sellPrefix) || price.endsWith(chestShopConfig.sellPrefix)) {
            const sellPrice = parseInt(price.replace(chestShopConfig.sellPrefix, ''));
            if (isNaN(sellPrice) || typeof sellPrice !== 'number') continue;

            shopData.sellPrice = sellPrice;
            continue;
        }
    }

    if (shopData.buyPrice <= 0 && shopData.sellPrice <= 0) return;

    shopData.item = data[3];

    shopData.location = getShopLocation(block);

    const shopBlock = block.dimension.getBlock(shopData.location);
    if (shopBlock === undefined) return;

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
function getShopLocation(signBlock) {
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
function removeItems(container, itemId, amount) {
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
function setShopData(shopData, itemStack, playerName) {
    if (shopData.player === chestShopConfig.shopId) shopData.player = playerName;

    if (shopData.item !== '?') return;
    if (itemStack === undefined) return;

    shopData.item = itemStack.typeId.replace('minecraft:', '');
}

/**
 * @param {import('@minecraft/server').Block} block
 * @param {string} playerName
 * @returns {boolean | undefined}
 */
export function isShopOwner(block, playerName) {
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
    const signTexts = getSignTexts(ev.block);
    if (signTexts === undefined) return;

    if (signTexts[0].split('\n')[0] === chestShopConfig.shopId) ev.cancel = true;
    if (signTexts[0].split('\n')[4] === chestShopConfig.shopId) ev.cancel = true;
    if (signTexts[1] === chestShopConfig.shopId) ev.cancel = true;
    const shopData = getShopData(signTexts, ev.block);
    if (shopData === undefined) return;

    await system.waitTicks(1);
    if (shopData.player === chestShopConfig.shopId) {
        setShopData(shopData, ev.itemStack, ev.player.name);
        const signTexts = shopDataToSignTexts(shopData);

        setSignTexts(ev.block, signTexts[0], signTexts[1]);
        return;
    }
    if (signTexts[0].split('\n')[4] !== chestShopConfig.shopId) return;
    if (signTexts[1] !== chestShopConfig.shopId) return;

    if (shopData.buyPrice <= 0) return;

    let money = getPlayerMoney(ev.player.name);

    if (money === undefined) return;
    let shopMoney = getPlayerMoney(shopData.player);
    if (shopMoney === undefined) return;

    if (shopData.buyPrice > shopMoney) return;

    const playerInventory = ev.player.getComponent(EntityComponentTypes.Inventory);
    if (playerInventory === undefined) return;

    const playerContainer = playerInventory.container;
    if (playerContainer === undefined) return;
    if (shopData.amount > getItemStock(playerContainer, shopData.item)) return;

    const itemStacks = removeItems(playerContainer, shopData.item, shopData.amount);

    if (!canAddItems(shopData.container, itemStacks)) {
        addItems(playerContainer, itemStacks);
        return;
    }

    addItems(shopData.container, itemStacks);

    // if(shopData.player === ev.player.name) return

    shopMoney -= shopData.buyPrice;
    setPlayerMoney(shopData.player, shopMoney);

    money = getPlayerMoney(ev.player.name);
    money += shopData.buyPrice;
    setPlayerMoney(ev.player.name, money);
});

// sell
world.afterEvents.entityHitBlock.subscribe(async (ev) => {
    if (ev.damagingEntity.typeId !== 'minecraft:player') return;

    const signTexts = getSignTexts(ev.hitBlock);
    if (signTexts === undefined) return;

    const shopData = getShopData(signTexts, ev.hitBlock);
    if (shopData === undefined) return;

    if (signTexts[0].split('\n')[4] !== chestShopConfig.shopId) return;
    if (signTexts[1] !== chestShopConfig.shopId) return;

    if (shopData.sellPrice <= 0) return;

    await system.waitTicks(1);

    let money = getPlayerMoney(ev.damagingEntity.name);
    if (money === undefined) return;
    let shopMoney = getPlayerMoney(shopData.player);
    if (shopMoney === undefined) return;

    if (shopData.sellPrice > money) return;
    if (shopData.amount > getItemStock(shopData.container, shopData.item)) return;

    const playerInventory = ev.damagingEntity.getComponent(EntityComponentTypes.Inventory);
    if (playerInventory === undefined) return;

    const playerContainer = playerInventory.container;
    if (playerContainer === undefined) return;

    const itemStacks = removeItems(shopData.container, shopData.item, shopData.amount);

    if (!canAddItems(playerContainer, itemStacks)) {
        addItems(shopData.container, itemStacks);
        return;
    }

    addItems(playerContainer, itemStacks);

    // if(shopData.player === ev.player.name) return

    shopMoney += shopData.sellPrice;
    setPlayerMoney(shopData.player, shopMoney);

    money = getPlayerMoney(ev.damagingEntity.name);

    money -= shopData.sellPrice;
    setPlayerMoney(ev.damagingEntity.name, money);

});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (ev.player.hasTag('mc_admin')) return;
    if (!chestShopConfig.shopBlockIds.includes(ev.block.typeId)) return;

    const isOwner = isShopOwner(ev.block, ev.player.name);
    if (isOwner == undefined) return;
    if (!isOwner) ev.cancel = true;
});