import { EnchantmentTypes, ItemStack, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { ChestFormData } from "../../lib/chest-ui";
import { itemIdToPath } from "../../texture_config";

/**
 * @type {DynamicProperties} */
let compeDB;
world.afterEvents.worldLoad.subscribe(() => {
    compeDB = new DynamicProperties('compe');
});

/**
 * 
 * @param {Player} player 
 * @param {string} userId 
 */
export function CompeAdminMainForm(player, userId = undefined) {
    if (userId) {

        return;
    };
};

/**
 * 
 * @param {Player} player 
 * @param {number} page
 */
export function CompePlayerForm(player, page = 0) {
    const beforeRawCompeData = compeDB.get(`player_${player.id}`) || '[]';
    const beforeCompeData = JSON.parse(beforeRawCompeData);

    const form = new ChestFormData('large');
    form.setTitle('§lCompensation');

    /**
     * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
     */
    const allCommons = beforeCompeData;
    if (allCommons.length < page * 36 + 1) {
        CompePlayerForm(player, page - 1);
        return;
    };
    const commonsAll = allCommons;
    const commons = allCommons.slice(0 + (45 * page), 45 + (45 * page));
    for (let i = 0; i < commons.length; i++) {
        const common = dataToItemStack(commons[i]);
        form.setButton(i + 9, { name: common.nameTag ? [{ text: `${common.nameTag}§r(` }, { translate: `${common.localizationKey}` }, { text: `§r)` }] : common.typeId, iconPath: itemIdToPath[common.typeId] ?? common.typeId, lore: common.getRawLore(), stackAmount: common.amount, editedName: common.nameTag ? true : false })
    };
    form.setButton(0, { name: "§l§4Close", iconPath: "minecraft:barrier", lore: ["Push here"], editedName: true });
    if ((page + 1) * 45 < commonsAll.length) form.setButton(5, { name: ">>", iconPath: "textures/ui/arrow_right", lore: ["Next Page"], editedName: true });
    if (0 < page) form.setButton(3, { name: "<<", iconPath: "textures/ui/arrow_left", lore: ["Previous Page"], editedName: true });

    form.show(player).then(rs => {
        if (rs.canceled) {
            CompePlayerForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            case 5: {
                //進む
                CompePlayerForm(player, page + 1);
                break;
            };
            case 3: {
                //戻る
                CompePlayerForm(player, page - 1);
                break;
            };
            default: {
                const afterRawCompeData = compeDB.get(`player_${player.id}`) || '[]';
                /**
                 * @type {Array}
                 */
                let afterCompeData = JSON.parse(afterRawCompeData);
                if (afterCompeData[rs.selection - 9] != beforeCompeData[rs.selection - 9]) {
                    CompePlayerForm(player, page);
                    return;
                };
                const item = dataToItemStack(afterCompeData[rs.selection - 9])
                const playerInventory = player.getComponent('inventory').container;
                if (playerInventory.emptySlotsCount == 0) {
                    player.dimension.spawnItem(item, player.location);
                } else {
                    playerInventory.addItem(item);
                };
                afterCompeData = afterCompeData.filter(
                    (_, index) => index !== rs.selection - 9
                );
                compeDB.set(`player_${player.id}`, JSON.stringify(afterCompeData));
                break;
            };
        };
    });
};


/**
 * 
 * @param {userId} userId 
 * @param {ItemStack} itemStack 
 * @param {boolean?} onlyContents
 */
export function addCompeByItemStack(userId, itemStack, onlyContents = false) {
    const rawCompeData = compeDB.get(`player_${userId}`) || '[]';
    const compeData = JSON.parse(rawCompeData);

    if (onlyContents && itemStack.getComponent('minecraft:inventory')?.isValid) {
        const container = itemStack.getComponent('minecraft:inventory').container;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item) {
                compeData.push(itemToData(item));
            };
        };
        compeDB.set(`player_${userId}`, JSON.stringify(compeData));
        return;
    };

    compeData.push(itemToData(itemStack));
    compeDB.set(`player_${userId}`, JSON.stringify(compeData));
    return;
};

/**
 * 
 * @param {ItemStack} itemStack 
 * @returns {string}
 */
function itemToData(itemStack) {

    let dypData = [];
    for (const dypKey of itemStack.getDynamicPropertyIds()) {
        dypData.push({ key: dypKey, value: itemStack.getDynamicProperty(dypKey) });
    };

    let enchantData = [];
    if (itemStack.getComponent('minecraft:enchantable')?.isValid) {
        for (const enchantment of itemStack.getComponent('minecraft:enchantable').getEnchantments()) {
            enchantData.push({ type: enchantment.type.id, level: enchantment.level });
        };
    };

    let inventoryData = [];
    if (itemStack.getComponent('minecraft:inventory')?.isValid) {
        const container = itemStack.getComponent('minecraft:inventory').container;
        for (let i = 0; i < container.size; i++) {
            const item = container.getItem(i);
            if (item) {
                inventoryData.push({ slot: i, data: JSON.stringify(itemToData(item)) });
            };
        };
    };

    let bookData = [];
    if (itemStack.getComponent('minecraft:book')?.isValid) {
        const book = itemStack.getComponent('minecraft:book');
        let pages = [];
        for (let i = 0; i < book.pageCount; i++) {
            const content = book.getRawPageContent(i);
            if (content) {
                pages.push({ page: i, content: content });
            };
        };
        bookData.push({ author: book?.author, pages: pages, title: book?.title, isSigned: book.isSigned });
    };

    const data = {
        typeId: itemStack.typeId,
        amount: itemStack.amount,
        name: itemStack?.nameTag,
        lore: itemStack.getRawLore(),
        dyp: dypData,
        inventory: inventoryData,
        enchant: enchantData,
        book: bookData,
    }

    return JSON.stringify(data);
};

/**
 * 
 * @param {string} itemDataString 
 * @returns {ItemStack}
 */
function dataToItemStack(itemDataString) {
    const itemData = JSON.parse(itemDataString);

    const itemStack = new ItemStack(itemData.typeId, itemData.amount);
    if (itemData?.name) itemStack.nameTag = itemData.name;
    itemStack.setLore(itemData.lore);

    if (itemStack.getComponent('minecraft:inventory')?.isValid) {
        const container = itemStack.getComponent('minecraft:inventory').container;

        for (const inventory of itemData.inventory) {
            container.setItem(inventory.slot, dataToItemStack(inventory.data))
        };
    };

    for (const dypData of itemData.dyp) {
        itemStack.setDynamicProperty(dypData.key, dypData.value)
    };

    if (itemStack.getComponent('minecraft:enchantable')?.isValid) {
        const enchantable = itemStack.getComponent('minecraft:enchantable');

        for (const enchantment of itemData.enchant) {
            enchantable.addEnchantment({ type: EnchantmentTypes.get(enchantment.type), level: enchantment.level })
        };
    };

    if (itemStack.getComponent('minecraft:book')?.isValid) {
        const book = itemStack.getComponent('minecraft:book');
        const bookData = itemData.book;

        for (const page of bookData.pages) {
            book.setPageContent(page.page, page.content);
        };

        if (bookData.isSigned) {
            book.signBook(bookData.title, bookData.author);
        };
    };

    return itemStack;
};