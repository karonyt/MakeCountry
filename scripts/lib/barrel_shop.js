import { system, world, ItemStack, Player, Block, EnchantmentTypes } from '@minecraft/server';
import { DynamicProperties } from '../api/dyp.js';
import { ActionFormData, ModalFormData } from '@minecraft/server-ui';
import { ChestFormData } from './chest-ui.js';
import { itemIdToPath } from '../texture_config.js';
import config from '../config.js';
import { PlayerManager } from '../api/player/player.js';
import { enchantIdToLang, langChangeItemName } from './util.js';

system.beforeEvents.startup.subscribe((ev) => {
    ev.blockComponentRegistry.registerCustomComponent('mc:shop_block', {
        onBreak: (event) => {
            const { block, dimension } = event;
            const x = block.x;
            const y = block.y;
            const z = block.z;
            const dimId = dimension.id;

            const barrelShopDB = new DynamicProperties('barrelShop');
            const playerDB = new DynamicProperties('player');

            const raw = barrelShopDB.get(`shop_${dimId}_${x}_${y}_${z}`);
            if (raw) {
                const barrelShopData = JSON.parse(raw);
                const rawPlayerData = playerDB.get(`player_${barrelShopData.owner}`);
                if (rawPlayerData) {
                    const playerData = JSON.parse(rawPlayerData);
                    playerData.money = (playerData.money || 0) + (barrelShopData.money || 0);

                    if (barrelShopData.mode === 'buyback' && barrelShopData.prepaidMoney) {
                        playerData.money = (playerData.money || 0) + (barrelShopData.prepaidMoney || 0);
                    }

                    playerDB.set(`player_${barrelShopData.owner}`, JSON.stringify(playerData));
                };
            };
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
        name: `${player.name}'s shop`,
        mode: 'sell',
        buybackConfig: {
            fundingSource: 'owner',
            prepaidMoney: 0,
            minTreasuryAmount: 0,
            buybackItems: []
        },
        transactionLog: []
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

            if (shopData.mode === 'buyback') {
                sellItemsToShopForm(player, block, `shop_${dimId}_${x}_${y}_${z}`);
            } else {
                buyMainForm(player, block, `shop_${dimId}_${x}_${y}_${z}`);
            }
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

        if (shopData.owner == player.id && !player.isSneaking) {
            system.runTimeout(() => {
                editMainForm(player, `shop_${dimId}_${x}_${y}_${z}`, true);
            });
            return;
        };
        if (shopData.admins.includes(player.id) && !player.isSneaking) {
            system.runTimeout(() => {
                editMainForm(player, `shop_${dimId}_${x}_${y}_${z}`, false);
            });
            return;
        };
        system.runTimeout(() => {
            if (shopData.mode === 'buyback') {
                sellItemsToShopForm(player, barrel, `shop_${dimId}_${x}_${y}_${z}`);
            } else {
                buyMainForm(player, barrel, `shop_${dimId}_${x}_${y}_${z}`);
            }
        });
        return;
    };
});

function addTransactionLogToData(shopData, entry) {
    shopData.transactionLog = shopData.transactionLog || [];

    shopData.transactionLog.push(entry);

    if (shopData.transactionLog.length > 50) {
        shopData.transactionLog.shift();
    }
}

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

    let bodyText = [
        { translate: 'barrelshop.name', with: [shopData.name] }, { text: '\n' },
        { text: '' }, { translate: 'barrelshop.mode' }, { text: ': §f' },
        { translate: shopData.mode === 'buyback' ? 'barrelshop.mode.buyback' : 'barrelshop.mode.sell' },
        { text: '§r\n' },
        { translate: 'barrelshop.sales', with: [`${shopData.money} ${config.MoneyName}`] }, { text: '\n' }
    ];

    if (shopData.mode === 'buyback') {
        const fundingSourceKey = shopData.buybackConfig.fundingSource === 'owner' ? 'barrelshop.fundingsource.owner' :
            shopData.buybackConfig.fundingSource === 'prepaid' ? 'barrelshop.fundingsource.prepaid' : 'barrelshop.fundingsource.treasury';
        bodyText.push(
            { text: '' }, { translate: 'barrelshop.fundingsource' }, { text: ': §f' }, { translate: fundingSourceKey }, { text: '§r\n' }
        );
        if (shopData.buybackConfig.fundingSource === 'prepaid') {
            bodyText.push(
                { text: '' }, { translate: 'barrelshop.prepaidmoney' }, { text: `: §f${shopData.buybackConfig.prepaidMoney || 0} ${config.MoneyName}§r\n` }
            );
        }
    }

    bodyText.push(
        { translate: 'barrelshop.owner', with: [`${JSON.parse(playerDB.get(`player_${shopData.owner}`)).name}`] }, { text: '\n' },
        { translate: 'barrelshop.admins', with: [`${adminNames.join(' , ')}`] }, { text: '\n' }
    );

    form.body({ rawtext: bodyText });

    form.button({ translate: 'form.button.barrelshop.editname' });
    form.button({ translate: 'form.button.barrelshop.sales' });
    form.button({ translate: 'form.button.barrelshop.togglemode' });
    form.button({ translate: 'form.button.barrelshop.transactionlog' });
    if (shopData.mode === 'buyback') {
        form.button({ translate: 'form.button.barrelshop.buybackconfig' });
    }
    if (isOwner) form.button({ translate: 'form.button.barrelshop.admins' });

    form.show(player).then(rs => {
        if (rs.canceled) {
            return;
        };

        let buttonIndex = 0;

        if (rs.selection === buttonIndex++) {
            editNameForm(player, dbKey, isOwner);
            return;
        }

        if (rs.selection === buttonIndex++) {
            salesForm(player, dbKey, isOwner);
            return;
        }

        if (rs.selection === buttonIndex++) {
            toggleShopModeForm(player, dbKey, isOwner);
            return;
        }

        if (rs.selection === buttonIndex++) {
            viewTransactionLogForm(player, dbKey, isOwner);
            return;
        }

        if (shopData.mode === 'buyback') {
            if (rs.selection === buttonIndex++) {
                buybackConfigForm(player, dbKey, isOwner);
                return;
            }
        }

        if (isOwner && rs.selection === buttonIndex++) {
            adminsForm(player, dbKey, isOwner);
            return;
        }
    });
};

function toggleShopModeForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.modeselect' });
    form.body({
        rawtext: [
            { translate: 'barrelshop.currentmode' },
            { text: ': ' },
            { translate: shopData.mode === 'buyback' ? 'barrelshop.mode.buyback' : 'barrelshop.mode.sell' },
            { text: '\n\n' },
            { translate: 'barrelshop.selectnewmode' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§a' },
            { translate: 'barrelshop.mode.sell' },
            { text: '§r\n§7' },
            { translate: 'barrelshop.mode.sell.desc' },
            { text: '§r' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§e' },
            { translate: 'barrelshop.mode.buyback' },
            { text: '§r\n§7' },
            { translate: 'barrelshop.mode.buyback.desc' },
            { text: '§r' }
        ]
    });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (rs.canceled || rs.selection === 2) {
            editMainForm(player, dbKey, isOwner);
            return;
        }

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        if (rs.selection === 0) {
            newShopData.mode = 'sell';
        } else if (rs.selection === 1) {
            newShopData.mode = 'buyback';
            if (!newShopData.buybackConfig) {
                newShopData.buybackConfig = {
                    fundingSource: 'owner',
                    prepaidMoney: 0,
                    minTreasuryAmount: 0,
                    buybackItems: []
                };
            }
        }

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));
        editMainForm(player, dbKey, isOwner);
    });
}

function buybackConfigForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.buybackconfig' });

    const fundingSourceKey = shopData.buybackConfig.fundingSource === 'owner' ? 'barrelshop.fundingsource.owner' :
        shopData.buybackConfig.fundingSource === 'prepaid' ? 'barrelshop.fundingsource.prepaid' : 'barrelshop.fundingsource.treasury';

    form.body({
        rawtext: [
            { text: '§7' }, { translate: 'barrelshop.fundingsource' }, { text: ': §f' }, { translate: fundingSourceKey }, { text: '§r\n§7' },
            { translate: 'barrelshop.prepaidmoney' }, { text: `: §f${shopData.buybackConfig.prepaidMoney || 0} ${config.MoneyName}§r\n§7` },
            { translate: 'barrelshop.buybackitems.count' }, { text: `: §f${shopData.buybackConfig.buybackItems?.length || 0}§r` }
        ]
    });

    form.button({ translate: 'form.button.barrelshop.changefundingsource' });
    form.button({ translate: 'form.button.barrelshop.depositprepaid' });
    form.button({ translate: 'form.button.barrelshop.configurebuyback' });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (rs.canceled || rs.selection === 3) {
            editMainForm(player, dbKey, isOwner);
            return;
        }

        switch (rs.selection) {
            case 0:
                changeFundingSourceForm(player, dbKey, isOwner);
                break;
            case 1:
                depositPrepaidMoneyForm(player, dbKey, isOwner);
                break;
            case 2:
                configureBuybackItemsForm(player, dbKey, isOwner);
                break;
        }
    });
}

function changeFundingSourceForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.selectfundingsource' });
    form.body({ translate: 'barrelshop.selectfundingsource.desc' });
    form.button({
        rawtext: [
            { text: '§a' },
            { translate: 'barrelshop.fundingsource.owner' },
            { text: '§r\n§7' },
            { translate: 'barrelshop.fundingsource.owner.desc' },
            { text: '§r' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§e' },
            { translate: 'barrelshop.fundingsource.prepaid' },
            { text: '§r\n§7' },
            { translate: 'barrelshop.fundingsource.prepaid.desc' },
            { text: '§r' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§b' },
            { translate: 'barrelshop.fundingsource.treasury' },
            { text: '§r\n§7' },
            { translate: 'barrelshop.fundingsource.treasury.desc' },
            { text: '§r' }
        ]
    });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (rs.canceled || rs.selection === 3) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        if (rs.selection === 0) {
            newShopData.buybackConfig.fundingSource = 'owner';
        } else if (rs.selection === 1) {
            newShopData.buybackConfig.fundingSource = 'prepaid';
        } else if (rs.selection === 2) {
            newShopData.buybackConfig.fundingSource = 'treasury';
        }

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        if (rs.selection === 2) {
            setMinTreasuryAmountForm(player, dbKey, isOwner);
        } else {
            buybackConfigForm(player, dbKey, isOwner);
        }
    });
}

function setMinTreasuryAmountForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    const form = new ModalFormData();
    form.title({ translate: 'form.title.barrelshop.treasuryconfig' });
    form.textField(
        {
            rawtext: [
                { text: '§7' },
                { translate: 'barrelshop.mintreasury' },
                { text: '\n§r' },
                { translate: 'barrelshop.mintreasury.desc' }
            ]
        },
        { translate: 'barrelshop.mintreasury.placeholder' },
        `${shopData.buybackConfig.minTreasuryAmount || 0}`
    );

    form.show(player).then(rs => {
        if (rs.canceled) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);
        const minAmount = parseInt(rs.formValues[0]) || 0;
        newShopData.buybackConfig.minTreasuryAmount = minAmount;

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));
        buybackConfigForm(player, dbKey, isOwner);
    });
}

function depositPrepaidMoneyForm(player, dbKey, isOwner) {
    const playerDB = new DynamicProperties('player');
    const playerData = JSON.parse(playerDB.get(`player_${player.id}`));

    const form = new ModalFormData();
    form.title({ translate: 'form.title.barrelshop.depositprepaid' });
    form.textField(
        {
            rawtext: [
                { text: '§7' },
                { translate: 'barrelshop.currentmoney' },
                { text: `: §f${playerData.money} ${config.MoneyName}§r\n\n` },
                { translate: 'barrelshop.depositamount' }
            ]
        },
        { translate: 'barrelshop.depositamount.placeholder' },
        ''
    );

    form.show(player).then(rs => {
        if (rs.canceled) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const depositAmount = parseInt(rs.formValues[0]) || 0;

        if (depositAmount <= 0) {
            player.sendMessage({ translate: 'error.barrelshop.invalidamount' });
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const newPlayerData = JSON.parse(playerDB.get(`player_${player.id}`));

        if (newPlayerData.money < depositAmount) {
            player.sendMessage({ translate: 'error.notenough.money' });
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const barrelShopDB = new DynamicProperties('barrelShop');
        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        newPlayerData.money -= depositAmount;
        newShopData.buybackConfig.prepaidMoney = (newShopData.buybackConfig.prepaidMoney || 0) + depositAmount;

        playerDB.set(`player_${player.id}`, JSON.stringify(newPlayerData));
        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        player.sendMessage({ translate: 'success.barrelshop.deposited', with: [`${depositAmount} ${config.MoneyName}`] });
        buybackConfigForm(player, dbKey, isOwner);
    });
}

function configureBuybackItemsForm(player, dbKey, isOwner) {
    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.configurebuyback' });
    form.body({ translate: 'barrelshop.configurebuyback.desc' });
    form.button({ translate: 'form.button.barrelshop.registeritem' });
    form.button({ translate: 'form.button.barrelshop.viewitems' });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (rs.canceled || rs.selection === 2) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        if (rs.selection === 0) {
            registerBuybackItemForm(player, dbKey, isOwner);
        } else if (rs.selection === 1) {
            viewBuybackItemsForm(player, dbKey, isOwner);
        }
    });
}

function registerBuybackItemForm(player, dbKey, isOwner) {
    const equipment = player.getComponent('equippable');
    const mainhand = equipment.getEquipment('Mainhand');

    if (!mainhand) {
        player.sendMessage({ translate: 'error.barrelshop.noitem' });
        return;
    }

    const form = new ModalFormData();
    form.title({ translate: 'form.title.barrelshop.registeritem' });
    form.textField(
        {
            rawtext: [
                { text: '§7' },
                { translate: 'barrelshop.item' },
                { text: `: §f${mainhand.typeId}§r\n§7` },
                { translate: 'barrelshop.amount' },
                { text: `: §f${mainhand.amount}§r\n\n` },
                { translate: 'barrelshop.setprice.desc' }
            ]
        },
        { translate: 'barrelshop.setprice.placeholder' },
        { defaultValue: '' }
    );

    form.show(player).then(rs => {
        if (rs.canceled) {
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        const price = parseInt(rs.formValues[0]) || 0;

        if (price <= 0) {
            player.sendMessage({ translate: 'error.barrelshop.invalidprice' });
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        const barrelShopDB = new DynamicProperties('barrelShop');
        const rawShopData = barrelShopDB.get(dbKey);
        if (!rawShopData) return;

        const shopData = JSON.parse(rawShopData);
        shopData.buybackConfig.buybackItems = shopData.buybackConfig.buybackItems || [];

        const enchantments = [];
        if (mainhand.getComponent('enchantable')?.isValid) {
            for (const enchant of mainhand.getComponent('enchantable').getEnchantments()) {
                enchantments.push({
                    id: enchant.type.id,
                    level: enchant.level
                });
            }
        }

        const lore = mainhand.getLore();

        shopData.buybackConfig.buybackItems.push({
            typeId: mainhand.typeId,
            amount: mainhand.amount,
            price: price,
            enchantments: enchantments,
            nameTag: mainhand.nameTag || null,
            lore: lore
        });

        barrelShopDB.set(dbKey, JSON.stringify(shopData));

        player.sendMessage({ translate: 'success.barrelshop.registered' });
    });
}

function viewBuybackItemsForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);
    const items = shopData.buybackConfig.buybackItems || [];

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.viewitems' });

    if (items.length === 0) {
        form.body({ translate: 'barrelshop.noitems' });
        form.button({ translate: 'mc.button.back' });
    } else {
        form.body({ translate: 'barrelshop.selectitemtodelete' });
        form.button({ translate: 'mc.button.back' });

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const enchantText = item.enchantments && item.enchantments.length > 0;
            const loreText = item.lore && item.lore.length > 0;
            const nameText = item.nameTag ? ` §7"${item.nameTag}"§r` : '';

            let buttonText = [
                { translate: langChangeItemName(item.typeId) }, { text: `§r${nameText} x${item.amount}\n§a${item.price} ${config.MoneyName}§r` }
            ];

            if (enchantText) {
                buttonText.push({ text: ' §7(' }, { translate: 'barrelshop.hasenchant' }, { text: ')§r' });
            }
            if (loreText) {
                buttonText.push({ text: ' §7(' }, { translate: 'barrelshop.haslore' }, { text: ')§r' });
            }

            form.button({ rawtext: buttonText });
        }
    }

    form.show(player).then(rs => {
        if (rs.canceled || rs.selection === 0) {
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        const itemIndex = rs.selection - 1;
        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);
        newShopData.buybackConfig.buybackItems.splice(itemIndex, 1);

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        player.sendMessage({ translate: 'success.barrelshop.deleted' });
        viewBuybackItemsForm(player, dbKey, isOwner);
    });
}

function safeParse(raw, fallback = {}) {
    try { return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
}

function buildBuybackLore(item) {

    const lines = [];

    lines.push({
        rawtext: [
            { text: "§7" },
            { translate: "barrelshop.amount" },
            { text: `: §f${item.amount}\n` }
        ]
    });

    lines.push({
        rawtext: [
            { text: "§a" },
            { translate: "barrelshop.price.sell" },
            { text: `: §f${item.price} ${config.MoneyName}\n` }
        ]
    });

    if (item.enchantments?.length > 0) {

        lines.push({
            rawtext: [
                { text: "\n§d" },
                { translate: "container.enchant" },
                { text: ":" }
            ]
        });

        for (const enchant of item.enchantments) {

            const enchantId = enchant.id.replace("minecraft:", "");
            const langKey = enchantIdToLang[enchantId] || enchantId;
            const isCurse = langKey.includes(".curse.");
            const color = isCurse ? "§c" : "§7";

            lines.push({
                rawtext: [
                    { text: `\n${color}` },
                    { translate: langKey },
                    { text: " " },
                    { translate: `enchantment.level.${enchant.level}` },
                    { text: "§r" }
                ]
            });
        }
    }

    if (item.lore?.length > 0) {

        lines.push({
            rawtext: [
                { text: "\n§6" },
                { translate: "barrelshop.label.lore" },
                { text: ":" }
            ]
        });

        for (const line of item.lore) {
            lines.push({
                rawtext: [
                    { text: `\n§7${line}` }
                ]
            });
        }
    }

    return lines;
}

function sellItemsToShopForm(player, barrel, dbKey) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = safeParse(rawShopData);
    const buybackItems = shopData.buybackConfig?.buybackItems || [];

    if (buybackItems.length === 0) {
        player.sendMessage({ translate: 'error.barrelshop.noitemsset' });
        return;
    }

    const form = new ChestFormData('large');
    form.setTitle([{text: '§4['},{translate: 'barrelshop.action.sell'},{text: `]§r ${shopData.name}`}]);

    buybackItems.forEach((item, i) => {
        form.setButton(i, {
            name: langChangeItemName(item.typeId),
            iconPath: itemIdToPath[item.typeId],
            lore: buildBuybackLore(item),
            stackAmount: new ItemStack(item.typeId, item.amount),
            editedName: true
        });
    });

    form.show(player).then(rs => {
        if (rs.canceled) return;

        const selectedItem = buybackItems[rs.selection];
        processSellToShop(player, barrel, dbKey, selectedItem);
    });
}

function calculateAvailableSpace(container, itemStack) {
    let space = 0;

    for (let i = 0; i < container.size; i++) {
        const slotItem = container.getItem(i);

        if (!slotItem) {
            space += itemStack.maxAmount;
            continue;
        }

        if (slotItem.isStackableWith(itemStack)) {
            space += itemStack.maxAmount - slotItem.amount;
        }
    }
    return space;
}


function processSellToShop(player, barrel, dbKey, buybackItem) {
    const playerContainer = player.getComponent('inventory').container;

    const barrelContainer = barrel.getComponent('inventory')?.container;
    if (!barrelContainer) {
        player.sendMessage({ translate: 'error.barrelshop.nobarrelinventory' });
        return;
    }

    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    let shopData;
    try {
        shopData = JSON.parse(rawShopData);
    } catch {
        console.warn(`Invalid shop JSON: ${dbKey}`);
        return;
    }

    let foundItems = [];
    for (let i = 0; i < playerContainer.size; i++) {
        const item = playerContainer.getItem(i);
        if (!item) continue;

        if (item.typeId !== buybackItem.typeId) continue;

        if (buybackItem.nameTag && item.nameTag !== buybackItem.nameTag) continue;

        if (buybackItem.lore?.length > 0) {
            const itemLore = item.getLore();
            if (JSON.stringify(itemLore) !== JSON.stringify(buybackItem.lore)) continue;
        }

        if (buybackItem.enchantments?.length > 0) {
            const enchComp = item.getComponent('enchantable');
            if (!enchComp?.isValid) continue;

            const itemEnchants = enchComp.getEnchantments();

            if (itemEnchants.length !== buybackItem.enchantments.length) continue;

            let enchantsMatch = true;
            for (const reqEnchant of buybackItem.enchantments) {
                const hasEnchant = itemEnchants.find(
                    e => e.type.id === reqEnchant.id && e.level === reqEnchant.level
                );
                if (!hasEnchant) {
                    enchantsMatch = false;
                    break;
                }
            }
            if (!enchantsMatch) continue;
        }

        foundItems.push({ slot: i, item });
    }

    if (foundItems.length === 0) {
        player.sendMessage({ translate: 'error.barrelshop.itemnotfound' });
        return;
    }

    let totalFound = 0;
    for (const found of foundItems) totalFound += found.item.amount;

    const setsAvailable = Math.floor(totalFound / buybackItem.amount);

    if (setsAvailable === 0) {
        player.sendMessage({
            translate: 'error.barrelshop.notenoughitems',
            with: [`${buybackItem.amount}`]
        });
        return;
    }

    const totalItemsToStore = buybackItem.amount * setsAvailable;
    const totalPrice = buybackItem.price * setsAvailable;

    const sellStack = new ItemStack(buybackItem.typeId, buybackItem.amount);

    if (buybackItem.nameTag) sellStack.nameTag = buybackItem.nameTag;
    if (buybackItem.lore) sellStack.setLore(buybackItem.lore);

    if (buybackItem.enchantments?.length > 0) {
        const ench = sellStack.getComponent('enchantable');

        if (ench?.isValid) {
            for (const e of buybackItem.enchantments) {

                const enchantType = EnchantmentTypes.get(e.id);
                if (!enchantType) {
                    console.warn(`Invalid enchantment: ${e.id}`);
                    continue;
                }

                ench.addEnchantment({
                    type: enchantType,
                    level: e.level
                });
            }
        }
    }

    const spaceAvailable = calculateAvailableSpace(barrelContainer, sellStack);
    if (spaceAvailable < totalItemsToStore) {
        player.sendMessage({
            translate: 'error.barrelshop.barrel_full',
            with: [`${spaceAvailable}`, `${totalItemsToStore}`]
        });
        return;
    }

    const playerDB = new DynamicProperties('player');
    const rawOwner = playerDB.get(`player_${shopData.owner}`);
    if (!rawOwner) return;

    const ownerData = JSON.parse(rawOwner);

    let canAfford = false;
    let fundSourceKey = '';

    if (shopData.buybackConfig.fundingSource === 'owner') {
        canAfford = ownerData.money >= totalPrice;
        fundSourceKey = 'barrelshop.fundingsource.owner';

    } else if (shopData.buybackConfig.fundingSource === 'prepaid') {
        canAfford = (shopData.buybackConfig.prepaidMoney || 0) >= totalPrice;
        fundSourceKey = 'barrelshop.fundingsource.prepaid';

    } else if (shopData.buybackConfig.fundingSource === 'treasury') {
        const block = player.dimension.getBlock(barrel.location);
        const chunkDB = new DynamicProperties('chunk');
        const countryDB = new DynamicProperties('country');

        const rawChunkData = chunkDB.get(
            `chunk_${Math.floor(block.x / 16)}_${Math.floor(block.z / 16)}_${player.dimension.id.replace('minecraft:', '')}`
        );

        if (rawChunkData) {
            const chunkData = JSON.parse(rawChunkData);
            const rawCountryData = countryDB.get(`country_${chunkData?.countryId}`);
            if (rawCountryData) {
                const countryData = JSON.parse(rawCountryData);
                const minAmount = shopData.buybackConfig.minTreasuryAmount || 0;

                canAfford = (countryData.money - totalPrice) >= minAmount;
                fundSourceKey = 'barrelshop.fundingsource.treasury';
            }
        }
    }

    if (!canAfford) {
        player.sendMessage({
            translate: 'error.barrelshop.insufficientfunds',
            with: [{ rawtext: [{ translate: fundSourceKey }] }]
        });
        return;
    }

    let itemsToRemove = totalItemsToStore;

    for (const found of foundItems) {
        if (itemsToRemove <= 0) break;

        if (found.item.amount <= itemsToRemove) {
            itemsToRemove -= found.item.amount;
            playerContainer.setItem(found.slot);

        } else {
            const newItem = found.item.clone();
            newItem.amount -= itemsToRemove;
            playerContainer.setItem(found.slot, newItem);
            itemsToRemove = 0;
        }
    }

    let remaining = totalItemsToStore;

    for (let i = 0; i < barrelContainer.size; i++) {
        if (remaining <= 0) break;

        const slotItem = barrelContainer.getItem(i);

        if (!slotItem) {
            const stack = sellStack.clone();
            stack.amount = Math.min(stack.maxAmount, remaining);
            barrelContainer.setItem(i, stack);
            remaining -= stack.amount;
            continue;
        }

        if (slotItem.isStackableWith(sellStack)) {
            const addable = sellStack.maxAmount - slotItem.amount;
            if (addable <= 0) continue;

            const newItem = slotItem.clone();
            const addAmount = Math.min(addable, remaining);

            newItem.amount += addAmount;
            barrelContainer.setItem(i, newItem);

            remaining -= addAmount;
        }
    }

    const buyerData = JSON.parse(playerDB.get(`player_${player.id}`));
    buyerData.money = (buyerData.money || 0) + totalPrice;

    if (shopData.buybackConfig.fundingSource === 'owner') {
        ownerData.money -= totalPrice;
        playerDB.set(`player_${shopData.owner}`, JSON.stringify(ownerData));

    } else if (shopData.buybackConfig.fundingSource === 'prepaid') {
        shopData.buybackConfig.prepaidMoney =
            Math.max(0, (shopData.buybackConfig.prepaidMoney || 0) - totalPrice);
    }

    playerDB.set(`player_${player.id}`, JSON.stringify(buyerData));

    addTransactionLogToData(shopData, {
        timestamp: Date.now(),
        playerId: player.id,
        playerName: player.name,
        action: 'sell',
        itemName: buybackItem.typeId,
        amount: totalItemsToStore,
        price: totalPrice
    });

    barrelShopDB.set(dbKey, JSON.stringify(shopData));

    player.sendMessage({
        translate: 'success.barrelshop.sold',
        with: {
            rawtext: [
                {
                    rawtext: [
                        { translate: langChangeItemName(buybackItem.typeId) },
                        { text: ` x ${totalItemsToStore}` }
                    ]
                },
                { text: `${totalPrice} ${config.MoneyName}` }
            ]
        }
    });
}

function viewTransactionLogForm(player, dbKey, isOwner) {
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);
    const logs = shopData.transactionLog || [];

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.transactionlog' });

    if (logs.length === 0) {
        form.body({ translate: 'barrelshop.notransactions' });
    } else {
        let bodyText = [{ text: '§7' }, { translate: 'barrelshop.recenttransactions' }, { text: '§r\n\n' }];

        const recentLogs = logs.slice(-20).reverse();

        for (const log of recentLogs) {
            const date = new Date(log.timestamp);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
            const actionKey = log.action === 'buy' ? 'barrelshop.action.buy' : 'barrelshop.action.sell';
            const itemName = log.itemName;

            bodyText.push(
                { text: `§f${dateStr}§r ` },
                { text: log.action === 'buy' ? '§a' : '§c' },
                { translate: actionKey },
                { text: `§r\n§7${log.playerName}§r\n§f` }, { translate: langChangeItemName(itemName) }, { text: `x${log.amount}§r  ${log.action === 'buy' ? '§a' : '§c-'}${log.price} ${config.MoneyName}§r\n\n` }
            );
        }

        form.body({ rawtext: bodyText });
    }

    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        editMainForm(player, dbKey, isOwner);
    });
}

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

    playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
    barrelShopDB.set(dbKey, JSON.stringify(shopData));

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
    form.setTitle([{text: '§2['},{translate: 'barrelshop.action.buy'},{text: `]§r ${shopData.name}`}]);
    const itemExistIndex = [];
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (item) {
            const loreArray = item.getRawLore();

            if (item.getComponent('enchantable')?.isValid) {
                for (const enchant of item.getComponent('enchantable')?.getEnchantments()) {
                    loreArray.push(...[{ text: `\n§r${enchantIdToLang[enchant.type.id].includes('.curse.') ? '§c' : '§7'}` }, { translate: enchantIdToLang[enchant.type.id] || enchant.type.id }, { text: ' ' }, { translate: `enchantment.level.${enchant.level}` }, { text: '§r' }]);
                };
            };

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

function buyCheckForm(player, barrel, dbKey, index) {
    const block = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
    if (block?.typeId != 'minecraft:barrel') return;
    const container = block.getComponent('inventory')?.container;
    if (!container) return;

    const item = container.getItem(index);
    if (!item) return;

    const form = new ChestFormData('single');
    const loreArray = item.getRawLore();

    if (item.getComponent('enchantable')?.isValid) {
        for (const enchant of item.getComponent('enchantable')?.getEnchantments()) {
            loreArray.push(...[{ text: `\n§r${enchantIdToLang[enchant.type.id].includes('.curse.') ? '§c' : '§7'}` }, { translate: enchantIdToLang[enchant.type.id] || enchant.type.id }, { text: ' ' }, { translate: `enchantment.level.${enchant.level}` }, { text: '§r' }]);
        };
    };

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

                                countryDB.set(`country_${chunkData?.countryId}`, JSON.stringify(countryData));
                            }
                        };
                    };
                };
                shopData.money = shopData.money + (result - tax);

                playerDB.set(`player_${player.id}`, JSON.stringify(playerData));

                addTransactionLogToData(shopData, {
                    timestamp: Date.now(),
                    playerId: player.id,
                    playerName: player.name,
                    action: 'buy',
                    itemName: item.typeId,
                    amount: item.amount,
                    price: result
                });

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