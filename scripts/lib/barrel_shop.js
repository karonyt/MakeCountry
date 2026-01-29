import { system, world, ItemStack, Player, Block } from '@minecraft/server';
import { DynamicProperties } from '../api/dyp.js';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from './chest-ui.js';
import { itemIdToPath } from '../texture_config.js';
import config from '../config.js';
import { PlayerManager } from '../api/player/player.js';

system.beforeEvents.startup.subscribe((ev) => {
    ev.blockComponentRegistry.registerCustomComponent('mc:shop_block', {
        onBreak: (event) => {
            const { block, dimension } = event;
            const x = block.x;
            const y = block.y;
            const z = block.z;
            const dimId = dimension.id;

            const barrelShopDB = new DynamicProperties('barrelShop');

            barrelShopDB.delete(`shop_${dimId}_${x}_${y}_${z}`);
        }
    })
});

world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block, dimension } = ev;
    if (block.typeId != 'mc:shop_block') return;
    const barrel = block.below();
    if (!barrel || barrel?.typeId != 'minecraft:barrel') {
        dimension.spawnItem(new ItemStack('mc:shop_block'), { x: block.x, y: block.y, z: block.z });
        block.setType('minecraft:air'); return;
    };
    const dimId = dimension.id;

    const barrelShopDB = new DynamicProperties('barrelShop');

    const x = block.x;
    const y = block.y;
    const z = block.z;
    const initialData = {
        owner: player.id,
        admins: [],
        location: { x: block.x, y: block.y, z: block.z },
        dimension: dimId,
        money: 0,
        name: `${player.name}'s shop`
    };

    barrelShopDB.set(`shop_${dimId}_${x}_${y}_${z}`, JSON.stringify(initialData));
    return;
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player, block } = ev;
    const dimId = block.dimension.id;

    if (block.typeId == 'minecraft:barrel') {
        const shopBlock = block.above();
        if (shopBlock && shopBlock?.typeId == 'mc:shop_block') {
            const barrelShopDB = new DynamicProperties('barrelShop');
            const x = shopBlock.x;
            const y = shopBlock.y;
            const z = shopBlock.z;
            const rawShopData = barrelShopDB.get(`shop_${dimId}_${x}_${y}_${z}`);
            if (!rawShopData) {
                system.runTimeout(() => {
                    block.dimension.spawnItem(new ItemStack('mc:shop_block'), { x: shopBlock.x, y: shopBlock.y, z: shopBlock.z });
                    shopBlock.setType('minecraft:air');
                });
                return;
            };
            const shopData = JSON.parse(rawShopData);

            if (shopData.owner == player.id) {
                ev.cancel = false;
                return;
            };
            if (shopData.admins.includes(player.id)) {
                ev.cancel = false;
                return;
            };
            ev.cancel = true;
            buyMainForm(player, block, `shop_${dimId}_${x}_${y}_${z}`);
            return;
        };
    };

    if (block.typeId == 'mc:shop_block') {
        ev.cancel = true;
        const barrel = block.below();
        if (!barrel || barrel?.typeId != 'minecraft:barrel') {
            system.runTimeout(() => {
                block.dimension.spawnItem(new ItemStack('mc:shop_block'), { x: block.x, y: block.y, z: block.z });
                block.setType('minecraft:air');
            });
            return;
        };

        const barrelShopDB = new DynamicProperties('barrelShop');
        const x = block.x;
        const y = block.y;
        const z = block.z;
        const rawShopData = barrelShopDB.get(`shop_${dimId}_${x}_${y}_${z}`);
        if (!rawShopData) {
            system.runTimeout(() => {
                block.dimension.spawnItem(new ItemStack('mc:shop_block'), { x: block.x, y: block.y, z: block.z });
                block.setType('minecraft:air');
            });
            return;
        };

        const shopData = JSON.parse(rawShopData);

        if (shopData.owner == player.id) {
            system.runTimeout(() => {
                editMainForm(player, `shop_${dimId}_${x}_${y}_${z}`, true);
            });
            return;
        };
        if (shopData.admins.includes(player.id)) {
            system.runTimeout(() => {

                editMainForm(player, `shop_${dimId}_${x}_${y}_${z}`, false);
            });
            return;
        };
        system.runTimeout(() => {
            buyMainForm(player, barrel, `shop_${dimId}_${x}_${y}_${z}`);
        });
        return;
    };
});

/**
 * 
 * @param {Player} player 
 * @param {string} dbKey 
 * @param {boolean} isOwner 
 */
function editMainForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);

    const playerDB = new DynamicProperties('player');

    const adminNames = [];
    for (const admin of shopData.admins) {
        const adminPlayerData = JSON.parse(playerDB.get(`player_${admin}`));
        adminNames.push(adminPlayerData.name);
    };

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.editmain' });
    form.body({
        rawtext: [
            { translate: 'barrelshop.name', with: [shopData.name] }, { text: '\n' },
            { translate: 'barrelshop.sales', with: [`${shopData.money} ${config.MoneyName}`] }, { text: '\n' },
            { translate: 'barrelshop.owner', with: [`${JSON.parse(playerDB.get(`player_${shopData.owner}`)).name}`] }, { text: '\n' },
            { translate: 'barrelshop.admins', with: [`${adminNames.join(' , ')}`] }, { text: '\n' },
        ]
    });
    form.button({ translate: 'form.button.barrelshop.editname' });
    form.button({ translate: 'form.button.barrelshop.sales' });
    if (isOwner) form.button({ translate: 'form.button.barrelshop.admins' });

    form.show(player).then(rs => {
        if (rs.canceled) {
            return;
        };
        switch (rs.selection) {
            case 0: {
                editNameForm(player, dbKey, isOwner);
                break;
            };
            case 1: {
                salesForm(player, dbKey, isOwner);
                break;
            };
            case 2: {
                adminsForm(player, dbKey, isOwner);
                break;
            };
        };
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} dbKey 
 * @param {boolean} isOwner 
 */
function editNameForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);

    const form = new ModalFormData();
    form.title({ translate: 'form.button.barrelshop.editname' });
    form.textField({ translate: 'barrelshop.name.label' }, { translate: 'barrelshop.name.placeholder' }, { defaultValue: `${shopData.name}` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            editMainForm(player, dbKey, isOwner);
            return;
        };
        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) {
            return;
        };
        const newShopData = JSON.parse(newRawShopData);
        newShopData.name = `${rs.formValues[0]}`;

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        editMainForm(player, dbKey, isOwner);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} dbKey 
 * @param {boolean} isOwner 
 */
function salesForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);

    const money = shopData.money;


    const playerDB = new DynamicProperties('player');

    const playerData = JSON.parse(playerDB.get(`player_${player.id}`));

    shopData.money = 0;
    playerData.money = Math.floor(playerData.money + money);

    playerDB.set(`player_${player.id}`, playerData)
    barrelShopDB.set(dbKey, shopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.sales' });
    form.body({ rawtext: [{ translate: 'barrelshop.sales.receive', with: [`${money}${config.MoneyName}`] }] });
    form.button({ translate: 'mc.button.back' });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            editMainForm(player, dbKey, isOwner);
            return;
        };
        editMainForm(player, dbKey, isOwner);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} dbKey 
 * @param {boolean} isOwner 
 */
function adminsForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.admins' });
    form.button({ translate: 'form.button.barrelshop.addadmins' });
    const playerDB = new DynamicProperties('player');

    const adminNames = [];
    const adminIds = [];
    for (const admin of shopData.admins) {
        const adminPlayerData = JSON.parse(playerDB.get(`player_${admin}`));
        form.button(adminPlayerData.name)
        adminNames.push(adminPlayerData.name);
        adminIds.push(admin);
    };

    form.show(player).then((rs) => {
        if (rs.canceled) {
            editMainForm(player, dbKey, isOwner);
            return;
        };
        switch (rs.selection) {
            case 0: {
                adminAddForm(player, dbKey, isOwner);
                break;
            };
            default: {
                adminRemoveForm(player, dbKey, isOwner)
                break;
            };
        };
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} dbKey 
 * @param {boolean} isOwner 
 */
function adminRemoveForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);

    const playerDB = new DynamicProperties('player');

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.admins' });
    form.button({ translate: 'mc.button.back' });

    const adminNames = [];
    const adminIds = [];
    for (const admin of shopData.admins.filter(a => a != player.id)) {
        const adminPlayerData = JSON.parse(playerDB.get(`player_${admin}`));
        form.button(adminPlayerData.name);
        adminNames.push(adminPlayerData.name);
        adminIds.push(admin);
    };

    form.show(player).then((rs) => {
        if (rs.canceled) {
            adminsForm(player, dbKey, isOwner);
            return;
        };
        switch (rs.selection) {
            case 0: {
                adminsForm(player, dbKey, isOwner);
                break;
            };
            default: {

                const newRawShopData = barrelShopDB.get(dbKey);
                if (!newRawShopData) {
                    return;
                };
                const newShopData = JSON.parse(newRawShopData);
                const removeAdmin = adminIds[rs.selection - 1];
                newShopData.admins = newShopData.admins.filter(a => a != removeAdmin);

                barrelShopDB.set(dbKey, JSON.stringify(newShopData));

                adminsForm(player, dbKey, isOwner);
                break;
            };
        };
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} dbKey 
 * @param {boolean} isOwner 
 */
function adminAddForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.admins' });
    form.button({ translate: 'mc.button.back' });
    const playerIds = [];
    const playerNames = [];
    for (const p of world.getPlayers().filter(p => !shopData.admins.includes(p.id) && shopData.owner != p.id)) {
        form.button(`${p.name}`);
        playerNames.push(p.name);
        playerIds.push(p.id);
    };

    form.show(player).then((rs) => {
        if (rs.canceled) {
            adminsForm(player, dbKey, isOwner);
            return;
        };
        switch (rs.selection) {
            case 0: {
                adminsForm(player, dbKey, isOwner);
                break;
            };
            default: {

                const newRawShopData = barrelShopDB.get(dbKey);
                if (!newRawShopData) {
                    return;
                };
                const newShopData = JSON.parse(newRawShopData);
                const newAdmin = playerIds[rs.selection - 1];
                newShopData.admins = newShopData.admins.filter(a => a != newAdmin);
                newShopData.admins.push(newAdmin);

                barrelShopDB.set(dbKey, JSON.stringify(newShopData));

                adminsForm(player, dbKey, isOwner);
                break;
            };
        };
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {Block} barrel 
 * @param {string} dbKey 
 */
function buyMainForm(player, barrel, dbKey) {
    const block = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
    if (block?.typeId != 'minecraft:barrel') return;
    const container = block.getComponent('inventory')?.container;
    if (!container) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    const form = new ChestFormData('small');
    form.setTitle(`${shopData?.name}`);
    const itemExistIndex = [];
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (item) {
            const loreArray = item.getRawLore();
            const price = loreArray.find(v => v?.translate === 'item.lore.price');
            if (price) {
                form.setButton(i, {
                    iconPath: itemIdToPath[item.typeId],
                    name: item?.nameTag ? [{ text: `${item.nameTag}§r(` }, { translate: item.localizationKey }, { text: '§r)' }] : [{ translate: item.localizationKey }],
                    lore: loreArray,
                    stackAmount: item.amount,
                    isGlint: item.getComponent('enchantable')?.isValid ? item.getComponent('enchantable')?.getEnchantments()?.length > 0 : false,
                    editedName: true
                });
                itemExistIndex.push(i);
            };
        };
    };

    form.show(player).then(rs => {
        if (rs.canceled) {
            return;
        };
        if (itemExistIndex.includes(rs.selection)) {
            buyCheckForm(player, block, dbKey, rs.selection);
            return;
        } else {
            buyMainForm(player, barrel, dbKey);
            return;
        }
    })
};

/**
 * 
 * @param {Player} player 
 * @param {Block} barrel 
 * @param {string} dbKey 
 * @param {number} index 
 * @returns 
 */
function buyCheckForm(player, barrel, dbKey, index) {
    const block = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
    if (block?.typeId != 'minecraft:barrel') return;
    const container = block.getComponent('inventory')?.container;
    if (!container) return;

    const item = container.getItem(index);
    if (!item) return;

    const form = new ChestFormData('single');
    const loreArray = item.getRawLore();
    const price = loreArray.find(v => v?.translate === 'item.lore.price');
    if (price) {
        form.setTitle(`${price.with[0]} x ${item.amount} = ${price.with[0] * item.amount}${config.MoneyName}`);
        form.setButton(13, {
            iconPath: itemIdToPath[item.typeId],
            name: item?.nameTag ? [{ text: `${item.nameTag}§r(` }, { translate: item.localizationKey }, { text: '§r)' }] : [{ translate: item.localizationKey }],
            lore: loreArray,
            stackAmount: item.amount,
            isGlint: item.getComponent('enchantable')?.isValid ? item.getComponent('enchantable')?.getEnchantments()?.length > 0 : false,
            editedName: true
        });
    };
    if (!price) return;

    form.show(player).then(rs => {
        if (rs.canceled) {
            buyMainForm(player, barrel, dbKey);
            return;
        };
        switch (rs.selection) {
            case 9: {
                buyMainForm(player, barrel, dbKey);
                break;
            };
            case 13: {
                const barrelShopDB = new DynamicProperties('barrelShop');
                const rawShopData = barrelShopDB.get(dbKey);
                if (!rawShopData) return;
                const newBlock = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
                if (newBlock?.typeId != 'minecraft:barrel') return;
                const newContainer = newBlock.getComponent('inventory')?.container;
                if (!newContainer) return;

                const newItem = newContainer.getItem(index);
                if (!newItem) return;
                if (newItem.amount != item.amount || newItem.typeId != item.typeId || JSON.stringify(newItem.getRawLore()) != JSON.stringify(item.getRawLore())) return;
                const playerManager = new PlayerManager(player.id);
                const playerDB = new DynamicProperties('player');
                const playerData = playerManager.data
                if ((price.with[0] * item.amount) > playerData.money) {
                    player.sendMessage({ translate: 'error.notenough.money' });
                    return;
                };

                let result = (price.with[0] * item.amount)

                playerData.money = Math.floor(playerData.money - result);

                const shopData = JSON.parse(rawShopData);

                const chunkDB = new DynamicProperties('chunk');
                const countryDB = new DynamicProperties('country');
                const rawChunkData = chunkDB.get(`chunk_${Math.floor(newBlock.x / 16)}_${Math.floor(newBlock.z / 16)}_${player.dimension.id.replace('minecraft:', '')}`)
                let tax = 0;

                if (rawChunkData) {
                    const chunkData = JSON.parse(rawChunkData);
                    if (chunkData?.countryId && chunkData?.countryId > 0) {
                        const rawCountryData = countryDB.get(`country_${chunkData?.countryId}`);
                        if (rawCountryData) {
                            const countryData = JSON.parse(rawCountryData);
                            tax = Math.floor((result / 100) * (countryData?.consumptionTax ?? 0));

                            if (tax !== 0) {
                                countryData.money = countryData.money + tax;

                                countryData.treasuryBudgetLog ||= [];

                                if (countryData.treasuryBudgetLog.length > 50) {
                                    countryData.treasuryBudgetLog.shift();
                                }

                                countryData.treasuryBudgetLog.push({
                                    timestamp: Date.now(),
                                    actor: player.name,
                                    action: 'add',
                                    amount: tax,
                                    reason: 'Consumption TAX'
                                });

                                countryDB.set(`country_${chunkData?.countryId}`, countryData);
                            }
                        };
                    };
                };
                shopData.money = shopData.money + (result - tax);

                playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
                barrelShopDB.set(dbKey, JSON.stringify(shopData));

                newContainer.setItem(index);
                const playerContainer = player.getComponent('inventory').container;
                if (playerContainer.emptySlotsCount == 0) {
                    player.dimension.spawnItem(newItem, player.location);
                } else {
                    playerContainer.addItem(newItem);
                };
                player.sendMessage({ translate: 'finish.bought' });
                break;
            };
            default: {
                buyCheckForm(player, barrel, dbKey, index);
                break;
            };
        };
    });
};