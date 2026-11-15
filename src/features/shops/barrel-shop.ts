import { cancelGateTerrainInteraction } from "@/shared/integration/standalone.js";
import { CommerceActionFormData as ActionFormData, CommerceModalFormData as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { cancelIncident16BlockEvent } from "@/domain/protection/incident16.js";
import { system, world, ItemStack, Player, Block, EnchantmentTypes, type Entity } from '@minecraft/server';
import { isUnsafeToPlay } from "@/shared/integration/standalone.js";
import { DynamicProperties } from '@/shared/storage/dynamic-properties.js';

import { ChestFormData } from '@/shared/ui/chest-form.js';
import { appendChestPresentationLore, getChestItemDataPresentation, getChestItemStackPresentation, getPotionSummaryRawText, readItemStackPotionData } from '@/shared/minecraft/item-presentation.js';
import config from '@/config/server.js';
import { CheckPermission, CheckPermissionFromLocation, enchantIdToLang, langChangeItemName } from '@/shared/utils/minecraft.js';

type ShopTransactionPermission = 'shopBuy' | 'shopSell';

function canUseShopAt(player: Player, block: Block, permission: ShopTransactionPermission) {
    if (!CheckPermissionFromLocation(player, block.x, block.z, block.dimension.id, permission)) return true;
    player.sendMessage({ translate: `error.barrelshop.permission.${permission}` });
    return false;
}

function normalizeMoney(value: any) {
    return Math.round((Number(value) || 0) * 100) / 100;
}

function parseMoneyInput(value: any) {
    const amount = Number(value);
    if (!Number.isFinite(amount) || !Number.isSafeInteger(Math.round(amount * 100))) return undefined;
    const scaled = amount * 100;
    // Amount input keeps whole cents; wallet arithmetic rounds binary noise.
    return Math.floor(scaled + Math.abs(scaled) * Number.EPSILON) / 100;
}

function shopMoneyCents(value: unknown): number {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || !Number.isSafeInteger(Math.round(value * 100))) throw Error('invalid_shop_money');
    return Math.round(value * 100);
}

function shopNotify(player: Player, message: Parameters<Player['sendMessage']>[0]) {
    try { if (player.isValid) player.sendMessage(message); } catch { }
}

function restoreShopWallet(database: DynamicProperties, key: string, money: number) {
    const current = JSON.parse(database.get(key)!);
    current.money = money;
    return current;
}

function commitShopRecords(writes: { database: DynamicProperties; key: string; value: any; remove?: boolean; restore: () => any }[]) {
    const applied: typeof writes = [];
    try {
        for (const write of writes) {
            if (write.remove) write.database.delete(write.key); else write.database.set(write.key, write.value);
            applied.push(write);
        }
    } catch (error) {
        for (const write of applied.reverse()) {
            try { write.database.set(write.key, write.restore()); }
            catch (restoreError) { console.error('[BarrelShop] Failed to restore saved record', restoreError); }
        }
        throw error;
    }
}

function withShopInventories(containers: any[], action: () => void, undoExternal?: () => void) {
    const snapshots = containers.map(container => Array.from({ length: container.size }, (_, slot) => container.getItem(slot)));
    try { action(); }
    catch (error) {
        try { undoExternal?.(); } catch (restoreError) { console.error('[BarrelShop] Failed to undo external delivery', restoreError); }
        try {
            for (const container of containers) container.clearAll();
            containers.forEach((container, i) => snapshots[i].forEach((item, slot) => { if (item) container.setItem(slot, item); }));
        } catch (restoreError) { console.error('[BarrelShop] Failed to restore inventories', restoreError); }
        throw error;
    }
}

function canManageShop(player: Player, shopData: any, ownerOnly = false): boolean {
    if (!player.isValid || isUnsafeToPlay() || player.hasTag('status:loading') || player.hasTag('status:transferring')) return false;
    if (shopData.owner === player.id || (!ownerOnly && Array.isArray(shopData.admins) && shopData.admins.includes(player.id))) return true;
    shopNotify(player, { translate: 'no.permission' });
    return false;
}

function canConfigureShopTreasury(player: Player, shopData: any): boolean {
    try {
        const players = new DynamicProperties('player');
        const actor = JSON.parse(players.get(`player_${player.id}`)!);
        const owner = JSON.parse(players.get(`player_${shopData.owner}`)!);
        if (actor.country && actor.country === owner.country
            && !CheckPermission(player, 'withDrawTreasurybudget') && !CheckPermission(shopData.owner, 'withDrawTreasurybudget')) return true;
    } catch { }
    shopNotify(player, { translate: 'no.permission' });
    return false;
}

function moveShopMoney(player: Player, dbKey: string, direction: 'deposit' | 'prepaid' | 'sales', amount?: number): number | undefined {
    try {
        const shopDB = new DynamicProperties('barrelShop'), playerDB = new DynamicProperties('player');
        const rawShop = shopDB.get(dbKey);
        if (!rawShop) return undefined;
        const shop = JSON.parse(rawShop);
        if (!canManageShop(player, shop)) return undefined;
        const walletKey = `player_${player.id}`;
        const wallet = JSON.parse(playerDB.get(walletKey)!);
        const beforeWallet = wallet.money, walletCents = shopMoneyCents(beforeWallet);
        const available = direction === 'sales' ? shopMoneyCents(shop.money ?? 0) : shopMoneyCents(shop.buybackConfig.prepaidMoney ?? 0);
        const amountCents = direction === 'sales' ? available : shopMoneyCents(amount);
        if (direction !== 'sales' && amountCents < 1) throw Error('invalid_shop_amount');
        if ((direction === 'deposit' ? walletCents : available) < amountCents) {
            shopNotify(player, { translate: direction === 'deposit' ? 'error.notenough.money' : 'error.barrelshop.notenough.prepaid' });
            return undefined;
        }
        const newWallet = walletCents + (direction === 'deposit' ? -amountCents : amountCents);
        const newShop = available + (direction === 'deposit' ? amountCents : -amountCents);
        if (!Number.isSafeInteger(newWallet) || !Number.isSafeInteger(newShop)) throw Error('shop_money_overflow');
        wallet.money = newWallet / 100;
        if (direction === 'sales') shop.money = newShop / 100;
        else shop.buybackConfig.prepaidMoney = newShop / 100;
        commitShopRecords([
            { database: shopDB, key: dbKey, value: shop, restore: () => JSON.parse(rawShop) },
            { database: playerDB, key: walletKey, value: wallet, restore: () => restoreShopWallet(playerDB, walletKey, beforeWallet) },
        ]);
        return amountCents / 100;
    } catch (error) {
        console.warn('[BarrelShop] Money movement aborted', error);
        shopNotify(player, '§c資金の移動を完了できませんでした。続く場合は運営へ連絡してください。');
        return undefined;
    }
}

function refundRemovedShop(dbKey: string): boolean {
    if (isUnsafeToPlay()) return false;
    try {
        const shopDB = new DynamicProperties('barrelShop'), players = new DynamicProperties('player');
        const raw = shopDB.get(dbKey);
        if (!raw) return true;
        const shop = JSON.parse(raw), walletKey = `player_${shop.owner}`;
        const wallet = JSON.parse(players.get(walletKey)!);
        const beforeMoney = wallet.money;
        const refundCents = shopMoneyCents(shop.money ?? 0) + shopMoneyCents(shop.buybackConfig?.prepaidMoney ?? shop.prepaidMoney ?? 0);
        const finalCents = shopMoneyCents(beforeMoney) + refundCents;
        if (!Number.isSafeInteger(finalCents)) throw Error('shop_refund_overflow');
        wallet.money = finalCents / 100;
        commitShopRecords([
            { database: shopDB, key: dbKey, value: null, remove: true, restore: () => shop },
            { database: players, key: walletKey, value: wallet, restore: () => restoreShopWallet(players, walletKey, beforeMoney) },
        ]);
        return true;
    } catch (error) {
        // Keep an indexed shop record so its funds remain recoverable.
        console.warn('[BarrelShop] Removal refund aborted; retained shop record', error);
        return false;
    }
}

function buybackMetadata(item: any) {
    const durability = item.getComponent('durability');
    const enchantments = item.getComponent('enchantable')?.getEnchantments() ?? [];
    const potion = readItemStackPotionData(item);
    return {
        typeId: item.typeId, nameTag: item.nameTag || null, lore: item.getRawLore(),
        durability: durability ? { max: durability.maxDurability, now: durability.damage } : null,
        enchantments: enchantments.map((e: any) => ({ id: e.type.id, level: e.level })).sort((a: any, b: any) => a.id.localeCompare(b.id)),
        potion: potion ? [potion] : [],
        dynamicProperties: item.getDynamicPropertyIds().sort().map((id: string) => ({ id, data: item.getDynamicProperty(id) })),
        dyeColor: item.getComponent('dyeable')?.color,
        durabilityUnbreakable: durability?.unbreakable ?? false,
        keepOnDeath: item.keepOnDeath, lockMode: item.lockMode,
        canDestroy: item.getCanDestroy().sort(), canPlaceOn: item.getCanPlaceOn().sort(),
    };
}

function matchesBuybackItem(item: any, expected: any): boolean {
    const actual = buybackMetadata(item);
    const normalize = (data: any) => ({
        typeId: data.typeId, nameTag: data.nameTag || null, lore: data.lore ?? [], durability: data.durability ?? null,
        enchantments: [...(data.enchantments ?? [])].sort((a: any, b: any) => a.id.localeCompare(b.id)),
        potion: (data.potion ?? []).map((p: any) => ({ id: p.id, deliveryType: p.deliveryType, durationTicks: p.durationTicks, amplifier: p.amplifier })),
        dynamicProperties: data.dynamicProperties ?? [], dyeColor: data.dyeColor,
        durabilityUnbreakable: data.durabilityUnbreakable ?? false,
        keepOnDeath: data.keepOnDeath ?? false, lockMode: data.lockMode ?? 'none',
        canDestroy: [...(data.canDestroy ?? [])].sort(), canPlaceOn: [...(data.canPlaceOn ?? [])].sort(),
    });
    return JSON.stringify(normalize(actual)) === JSON.stringify(normalize(expected));
}

function normalizePlayerName(name: any) {
    return `${name ?? ''}`.trim().toLowerCase();
}

function getBlockedPlayerNames(shopData: any) {
    if (!Array.isArray(shopData.blockedPlayerNames)) {
        shopData.blockedPlayerNames = [];
    }
    return shopData.blockedPlayerNames;
}

function isBlockedPlayerName(shopData: any, player: Player) {
    const playerName = normalizePlayerName(player.name);
    if (!playerName) return false;
    return getBlockedPlayerNames(shopData).some((name: any) => normalizePlayerName(name) === playerName);
}

function sendBlockedShopMessage(player: Player) {
    player.sendMessage({ translate: 'error.barrelshop.blockedplayer' });
}

function customNamedItemRawText(nameTag: string, fallbackName: any) {
    return [{ text: `${nameTag}§r(` }, ...rawItemName(fallbackName), { text: '§r)' }];
}

function rawItemName(name: any) {
    return Array.isArray(name) ? name : [{ translate: `${name}` }];
}

system.beforeEvents.startup.subscribe((ev) => {
    ev.blockComponentRegistry.registerCustomComponent('mc:shop_block', {
        onBreak: (event) => {
            const { block, dimension } = event;
            const x = block.x;
            const y = block.y;
            const z = block.z;
            const dimId = dimension.id;

            refundRemovedShop(`shop_${dimId}_${x}_${y}_${z}`);
        }
    })
});

world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block, dimension } = ev;
    if (block.typeId != 'mc:shop_block') return;
    if (isUnsafeToPlay()) {
        dimension.spawnItem(new ItemStack('mc:shop_block'), { x: block.x, y: block.y, z: block.z });
        block.setType('minecraft:air');
        return;
    }
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
    const dbKey = `shop_${dimId}_${x}_${y}_${z}`;
    if (barrelShopDB.get(dbKey) !== undefined && !refundRemovedShop(dbKey)) {
        dimension.spawnItem(new ItemStack('mc:shop_block'), { x: block.x, y: block.y, z: block.z });
        block.setType('minecraft:air');
        shopNotify(player, '§c以前の店の資金を返還できないため、設置を中止しました。運営へ連絡してください。');
        return;
    }
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
        blockedPlayerNames: [],
        transactionLog: []
    };

    barrelShopDB.set(dbKey, JSON.stringify(initialData));
    return;
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (cancelGateTerrainInteraction(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
    const { player, block, isFirstEvent } = ev;
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
            if (player.hasTag('adminmode')) {
                ev.cancel = false;
                return;
            };
            if (shopData.admins.includes(player.id)) {
                ev.cancel = false;
                return;
            };
            ev.cancel = true;
            if (!isFirstEvent) return;
            if (isBlockedPlayerName(shopData, player)) {
                sendBlockedShopMessage(player);
                return;
            }

            if (shopData.mode === 'buyback') {
                if (!canUseShopAt(player, shopBlock, 'shopSell')) return;
                sellItemsToShopForm(player, block, `shop_${dimId}_${x}_${y}_${z}`);
            } else {
                if (!canUseShopAt(player, shopBlock, 'shopBuy')) return;
                buyMainForm(player, block, `shop_${dimId}_${x}_${y}_${z}`);
            }
            return;
        };
    };

    if (block.typeId == 'mc:shop_block') {
        ev.cancel = true;
        if (!isFirstEvent) return;
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
        if (isBlockedPlayerName(shopData, player)) {
            sendBlockedShopMessage(player);
            return;
        }
        const transactionPermission = shopData.mode === 'buyback' ? 'shopSell' : 'shopBuy';
        if (!canUseShopAt(player, block, transactionPermission)) return;
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

function addTransactionLogToData(shopData: any, entry: any) {
    shopData.transactionLog = shopData.transactionLog || [];

    shopData.transactionLog.push(entry);

    if (shopData.transactionLog.length > 50) {
        shopData.transactionLog.shift();
    }
}

/** Potion effect and enchantments kept with a transaction so the history can tell potions and books apart. */
function transactionLogItemDetail(data: any) {
    const detail: { potion?: any[]; enchantments?: { id: string; level: number }[] } = {};
    const potion = Array.isArray(data?.potion) ? data.potion[0] : undefined;
    if (potion && typeof potion.id === 'string' && potion.id) {
        detail.potion = [{ id: potion.id, deliveryType: potion.deliveryType, durationTicks: potion.durationTicks, amplifier: potion.amplifier }];
    }
    const enchantments = (Array.isArray(data?.enchantments) ? data.enchantments : [])
        .filter((enchant: any) => typeof enchant?.id === 'string' && enchant.id && Number.isSafeInteger(enchant.level))
        .map((enchant: any) => ({ id: enchant.id, level: enchant.level }));
    if (enchantments.length > 0) detail.enchantments = enchantments;
    return detail;
}

function transactionLogItemRawText(log: any) {
    const potionName = getPotionSummaryRawText(log.itemName, log.potion);
    const parts: any[] = potionName ? [...potionName] : [{ translate: langChangeItemName(log.itemName) }];
    const enchantments = Array.isArray(log.enchantments) ? log.enchantments : [];
    if (enchantments.length > 0) {
        parts.push({ text: '§d (' });
        enchantments.forEach((enchant: any, index: number) => {
            const enchantId = String(enchant?.id ?? '').replace('minecraft:', '');
            const langKey = (enchantIdToLang as Record<string, string>)[enchantId] || enchantId;
            if (index > 0) parts.push({ text: ', ' });
            parts.push({ text: langKey.includes('.curse.') ? '§c' : '§d' }, { translate: langKey }, { text: ' ' },
                { translate: `enchantment.level.${enchant?.level}` });
        });
        parts.push({ text: '§d)§f' });
    }
    return parts;
}

function editMainForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (!canManageShop(player, shopData)) return;

    const playerDB = new DynamicProperties('player');

    const adminNames = [];
    for (const admin of shopData.admins) {
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const adminPlayerData = safeParse(playerDB.get(`player_${admin}`));
        adminNames.push(adminPlayerData.name ?? admin);
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
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        { translate: 'barrelshop.owner', with: [`${JSON.parse(playerDB.get(`player_${shopData.owner}`)).name}`] }, { text: '\n' },
        { translate: 'barrelshop.admins', with: [`${adminNames.join(' , ')}`] }, { text: '\n' },
        { translate: 'barrelshop.blockedplayers', with: [`${getBlockedPlayerNames(shopData).join(' , ') || '-'}`] }, { text: '\n' }
    );

    form.body({ rawtext: bodyText });

    form.button({ translate: 'form.button.barrelshop.editname' });
    form.button({ translate: 'form.button.barrelshop.sales' });
    form.button({ translate: 'form.button.barrelshop.togglemode' });
    form.button({ translate: 'form.button.barrelshop.transactionlog' });
    if (shopData.mode === 'buyback') {
        form.button({ translate: 'form.button.barrelshop.buybackconfig' });
    }
    form.button({ translate: 'form.button.barrelshop.blockedplayers' });
    if (isOwner) form.button({ translate: 'form.button.barrelshop.admins' });

    form.show(player).then(rs => {
        if (!player.isValid) return;
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

        if (rs.selection === buttonIndex++) {
            blockedPlayersForm(player, dbKey, isOwner);
            return;
        }

        if (isOwner && rs.selection === buttonIndex++) {
            adminsForm(player, dbKey, isOwner);
            return;
        }
    });
};

function toggleShopModeForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;

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
            { text: '§2' },
            { translate: 'barrelshop.mode.sell' },
            { text: '§r\n' },
            { translate: 'barrelshop.mode.sell.desc' },
            { text: '§r' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§4' },
            { translate: 'barrelshop.mode.buyback' },
            { text: '§r\n' },
            { translate: 'barrelshop.mode.buyback.desc' },
            { text: '§r' }
        ]
    });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled || rs.selection === 2) {
            editMainForm(player, dbKey, isOwner);
            return;
        }

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        if (!canManageShop(player, newShopData)) return;

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

function buybackConfigForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;

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
    form.button({ translate: 'form.button.barrelshop.withdrawprepaid' });
    form.button({ translate: 'form.button.barrelshop.configurebuyback' });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled || rs.selection === 4) {
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
                withdrawPrepaidMoneyForm(player, dbKey, isOwner);
                break;
            case 3:
                configureBuybackItemsForm(player, dbKey, isOwner);
                break;
        }
    });
}

function changeFundingSourceForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.selectfundingsource' });
    form.body({ translate: 'barrelshop.selectfundingsource.desc' });
    form.button({
        rawtext: [
            { text: '§2' },
            { translate: 'barrelshop.fundingsource.owner' },
            { text: '§r\n' },
            { translate: 'barrelshop.fundingsource.owner.desc' },
            { text: '§r' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§6' },
            { translate: 'barrelshop.fundingsource.prepaid' },
            { text: '§r\n' },
            { translate: 'barrelshop.fundingsource.prepaid.desc' },
            { text: '§r' }
        ]
    });
    form.button({
        rawtext: [
            { text: '§9' },
            { translate: 'barrelshop.fundingsource.treasury' },
            { text: '§r\n' },
            { translate: 'barrelshop.fundingsource.treasury.desc' },
            { text: '§r' }
        ]
    });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled || rs.selection === 3) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        if (!canManageShop(player, newShopData)) return;

        if (rs.selection === 0) {
            newShopData.buybackConfig.fundingSource = 'owner';
        } else if (rs.selection === 1) {
            newShopData.buybackConfig.fundingSource = 'prepaid';
        } else if (rs.selection === 2) {
            const playerDB = new DynamicProperties('player');
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
            if (!playerData.country || playerData.country == 0) {
                player.sendMessage({ translate: 'cannnot.use.nojoin.country' });
                return;
            };
            if (!canConfigureShopTreasury(player, newShopData)) return;
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

function setMinTreasuryAmountForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;

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
        { defaultValue: `${shopData.buybackConfig.minTreasuryAmount || 0}` }
    );

    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        if (!canManageShop(player, newShopData)) return;
        if (!canConfigureShopTreasury(player, newShopData)) return;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const minAmount = Math.max(parseMoneyInput(rs.formValues[0]) || 0, 0);
        newShopData.buybackConfig.minTreasuryAmount = minAmount;

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));
        buybackConfigForm(player, dbKey, isOwner);
    });
}

function depositPrepaidMoneyForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const playerDB = new DynamicProperties('player');
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        { defaultValue: '0' }
    );

    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const depositAmount = parseMoneyInput(rs.formValues[0]) || 0;

        if (depositAmount <= 0) {
            player.sendMessage({ translate: 'error.barrelshop.invalidamount' });
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        if (moveShopMoney(player, dbKey, 'deposit', depositAmount) === undefined) return;
        shopNotify(player, { translate: 'success.barrelshop.deposited', with: [`${depositAmount} ${config.MoneyName}`] });
        buybackConfigForm(player, dbKey, isOwner);
    });
}

function withdrawPrepaidMoneyForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;
    const prepaidMoney = normalizeMoney(shopData.buybackConfig.prepaidMoney || 0);

    const form = new ModalFormData();
    form.title({ translate: 'form.title.barrelshop.withdrawprepaid' });
    form.textField(
        {
            rawtext: [
                { text: '§7' },
                { translate: 'barrelshop.prepaidmoney' },
                { text: `: §f${prepaidMoney} ${config.MoneyName}§r\n\n` },
                { translate: 'barrelshop.withdrawamount' }
            ]
        },
        { translate: 'barrelshop.withdrawamount.placeholder' },
        { defaultValue: '0' }
    );

    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled) {
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        // @ts-ignore TS(2532)
        const withdrawAmount = parseMoneyInput(rs.formValues[0]) || 0;
        if (withdrawAmount <= 0) {
            player.sendMessage({ translate: 'error.barrelshop.invalidamount' });
            buybackConfigForm(player, dbKey, isOwner);
            return;
        }

        if (moveShopMoney(player, dbKey, 'prepaid', withdrawAmount) === undefined) return;
        shopNotify(player, { translate: 'success.barrelshop.withdrawprepaid', with: [`${withdrawAmount} ${config.MoneyName}`] });
        buybackConfigForm(player, dbKey, isOwner);
    });
}

function configureBuybackItemsForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.configurebuyback' });
    form.body({ translate: 'barrelshop.configurebuyback.desc' });
    form.button({ translate: 'form.button.barrelshop.registeritem' });
    form.button({ translate: 'form.button.barrelshop.viewitems' });
    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (!player.isValid) return;
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

/**
 * 
 * @param {Player} player 
 * @param {*} dbKey 
 * @param {boolean} isOwner 
 * @returns 
 */
function registerBuybackItemForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
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
        if (!player.isValid) return;
        if (rs.canceled) {
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const price = parseMoneyInput(rs.formValues[0]) || 0;

        if (price <= 0) {
            player.sendMessage({ translate: 'error.barrelshop.invalidprice' });
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        const barrelShopDB = new DynamicProperties('barrelShop');
        const rawShopData = barrelShopDB.get(dbKey);
        if (!rawShopData) return;

        const shopData = JSON.parse(rawShopData);

        if (!canManageShop(player, shopData)) return;
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

        let durability = null;

        if (mainhand.getComponent('durability')?.isValid) {
            const durabilityComponent = mainhand.getComponent('durability');
            durability = { max: durabilityComponent.maxDurability, now: durabilityComponent.damage };
        }

        const lore = mainhand.getRawLore();
        const potion = readItemStackPotionData(mainhand);

        shopData.buybackConfig.buybackItems = shopData.buybackConfig.buybackItems || [];

        if (shopData.buybackConfig.buybackItems.length >= 27) {
            player.sendMessage({ translate: 'error.barrelshop.limitreached' });
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        shopData.buybackConfig.buybackItems.push({
            ...buybackMetadata(mainhand),
            typeId: mainhand.typeId,
            amount: mainhand.amount,
            price: price,
            enchantments: enchantments,
            nameTag: mainhand.nameTag || null,
            durability: durability,
            lore: lore,
            potion: potion ? [potion] : []
        });

        barrelShopDB.set(dbKey, JSON.stringify(shopData));

        player.sendMessage({ translate: 'success.barrelshop.registered' });
    });
}

function viewBuybackItemsForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;
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
        if (!player.isValid) return;
        if (rs.canceled || rs.selection === 0) {
            configureBuybackItemsForm(player, dbKey, isOwner);
            return;
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const itemIndex = rs.selection - 1;
        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) return;

        const newShopData = JSON.parse(newRawShopData);

        if (!canManageShop(player, newShopData)) return;
        newShopData.buybackConfig.buybackItems.splice(itemIndex, 1);

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        player.sendMessage({ translate: 'success.barrelshop.deleted' });
        viewBuybackItemsForm(player, dbKey, isOwner);
    });
}

function safeParse(raw: any, fallback = {}) {
    try { return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
}

function buildBuybackLore(item: any) {

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

    if (item.durability) {
        lines.push({
            rawtext: [
                { text: "\n§9" },
                { text: `Durability: (${item.durability.max - item.durability.now}/${item.durability.max})` }
            ]
        })
    };

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
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            const langKey = (enchantIdToLang as Record<string, string>)[enchantId] || enchantId;
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
                { translate: "networkWorld.description" },
                { text: "\n" }
            ]
        });

        for (const line of item.lore) {
            lines.push({
                rawtext: [
                    line,
                    { text: '\n' }
                ]
            });
        }
    }

    return lines;
}

function sellItemsToShopForm(player: any, barrel: any, dbKey: any) {
    if (!canUseShopAt(player, barrel, 'shopSell')) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = safeParse(rawShopData);
    const buybackItems = shopData.buybackConfig?.buybackItems || [];

    if (isBlockedPlayerName(shopData, player)) {
        sendBlockedShopMessage(player);
        return;
    }

    if (buybackItems.length === 0) {
        player.sendMessage({ translate: 'error.barrelshop.noitemsset' });
        return;
    }

    const form = new ChestFormData('small');
    form.setTitle([{ text: '§4[' }, { translate: 'barrelshop.action.sell' }, { text: `]§r ${shopData.name}` }]);

    buybackItems.forEach((item: any, i: any) => {
        const presentation = getChestItemDataPresentation(item);
        form.setButton(i, {
            name: presentation.name,
            iconPath: presentation.iconPath,
            lore: appendChestPresentationLore(buildBuybackLore(item), presentation.lore),
            stackAmount: item.amount,
            editedName: true
        });
    });

    form.show(player).then(rs => {
        if (rs.canceled) return;

        const selectedItem = buybackItems[rs.selection];
        processSellToShop(player, barrel, dbKey, selectedItem);
    });
}

function calculateAvailableSpace(container: any, itemStack: any) {
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


function processSellToShop(player: any, barrel: any, dbKey: any, buybackItem: any) {
    if (!player?.isValid) return;
    try {
        if (isUnsafeToPlay() || player.hasTag('status:loading') || player.hasTag('status:transferring')) throw Error('shop_temporarily_unavailable');
        barrel = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
        if (barrel?.typeId !== 'minecraft:barrel' || !canUseShopAt(player, barrel, 'shopSell')) return;
        const playerContainer = player.getComponent('inventory')?.container;
        const barrelContainer = barrel.getComponent('inventory')?.container;
        if (!playerContainer || !barrelContainer) return;
        const barrelShopDB = new DynamicProperties('barrelShop');
        const rawShopData = barrelShopDB.get(dbKey);
        if (!rawShopData) return;
        const shopData = JSON.parse(rawShopData);
        if (shopData.mode !== 'buyback' || !Array.isArray(shopData.buybackConfig?.buybackItems)
            || !buybackItem || !shopData.buybackConfig.buybackItems.some((row: any) => JSON.stringify(row) === JSON.stringify(buybackItem))) return;
        if (isBlockedPlayerName(shopData, player)) { sendBlockedShopMessage(player); return; }
        if (!Number.isSafeInteger(buybackItem.amount) || buybackItem.amount < 1) throw Error('invalid_buyback_amount');
        const unitCents = shopMoneyCents(buybackItem.price);
        if (unitCents < 1) throw Error('invalid_buyback_price');
        const found: { slot: number; item: any }[] = [];
        for (let slot = 0; slot < playerContainer.size; slot++) {
            const item = playerContainer.getItem(slot);
            if (item && matchesBuybackItem(item, buybackItem)) found.push({ slot, item });
        }
        const sets = Math.floor(found.reduce((count, row) => count + row.item.amount, 0) / buybackItem.amount);
        if (sets < 1) { shopNotify(player, { translate: 'error.barrelshop.itemnotfound' }); return; }
        const totalItems = sets * buybackItem.amount, totalCents = sets * unitCents;
        if (!Number.isSafeInteger(totalCents)) throw Error('buyback_price_overflow');
        const playerDB = new DynamicProperties('player');
        const countryDB = new DynamicProperties('country');
        const ownerKey = `player_${shopData.owner}`, sellerKey = `player_${player.id}`;
        const ownerData = JSON.parse(playerDB.get(ownerKey)!);
        const sellerData = JSON.parse(playerDB.get(sellerKey)!);
        const ownerMoney = ownerData.money, sellerMoney = sellerData.money;
        shopMoneyCents(ownerMoney); shopMoneyCents(sellerMoney);
        const originalShop = JSON.parse(rawShopData);
        const writes: Parameters<typeof commitShopRecords>[0] = [];
        const source = shopData.buybackConfig.fundingSource;
        if (source === 'owner') {
            if (shopMoneyCents(ownerMoney) < totalCents) throw Error('insufficient_shop_money');
            if (player.id !== shopData.owner) {
                ownerData.money = (shopMoneyCents(ownerMoney) - totalCents) / 100;
                writes.push({ database: playerDB, key: ownerKey, value: ownerData, restore: () => restoreShopWallet(playerDB, ownerKey, ownerMoney) });
            }
        } else if (source === 'prepaid') {
            const prepaid = shopMoneyCents(shopData.buybackConfig.prepaidMoney ?? 0);
            if (prepaid < totalCents) throw Error('insufficient_shop_prepaid');
            shopData.buybackConfig.prepaidMoney = (prepaid - totalCents) / 100;
        } else if (source === 'treasury') {
            if (!ownerData.country || CheckPermission(shopData.owner, 'withDrawTreasurybudget')) throw Error('shop_treasury_permission');
            const countryKey = `country_${ownerData.country}`;
            const countryData = JSON.parse(countryDB.get(countryKey)!);
            const beforeMoney = countryData.money;
            if (shopMoneyCents(beforeMoney) - totalCents < shopMoneyCents(shopData.buybackConfig.minTreasuryAmount ?? 0)) throw Error('insufficient_shop_treasury');
            countryData.money = (shopMoneyCents(beforeMoney) - totalCents) / 100;
            writes.push({ database: countryDB, key: countryKey, value: countryData, restore: () => ({ ...countryData, money: beforeMoney }) });
        } else throw Error('invalid_shop_funding_source');
        if (player.id !== shopData.owner || source !== 'owner') {
            const finalCents = shopMoneyCents(sellerMoney) + totalCents;
            if (!Number.isSafeInteger(finalCents)) throw Error('seller_money_overflow');
            sellerData.money = finalCents / 100;
            writes.push({ database: playerDB, key: sellerKey, value: sellerData, restore: () => restoreShopWallet(playerDB, sellerKey, sellerMoney) });
        }
        addTransactionLogToData(shopData, { timestamp: Date.now(), playerId: player.id, playerName: player.name,
            action: 'sell', itemName: buybackItem.typeId, ...transactionLogItemDetail(buybackItem), amount: totalItems, price: totalCents / 100 });
        writes.push({ database: barrelShopDB, key: dbKey, value: shopData, restore: () => originalShop });
        withShopInventories([playerContainer, barrelContainer], () => {
            let remaining = totalItems;
            for (const row of found) {
                if (remaining === 0) break;
                const amount = Math.min(row.item.amount, remaining);
                const moving = row.item.clone(); moving.amount = amount;
                if (amount === row.item.amount) playerContainer.setItem(row.slot);
                else { const leftover = row.item.clone(); leftover.amount -= amount; playerContainer.setItem(row.slot, leftover); }
                if (barrelContainer.addItem(moving)) throw Error('shop_barrel_delivery_refused');
                remaining -= amount;
            }
            if (remaining !== 0) throw Error('shop_inventory_changed');
            commitShopRecords(writes);
        });
        shopNotify(player, { translate: 'success.barrelshop.sold', with: { rawtext: [
            { rawtext: [{ translate: langChangeItemName(buybackItem.typeId) }, { text: ` x ${totalItems}` }] },
            { text: `${totalCents / 100} ${config.MoneyName}` },
        ] } });
    } catch (error) {
        console.warn('[BarrelShop] Buyback aborted', error);
        shopNotify(player, '§c買取を完了できませんでした。所持品・店の空き・資金を確認し、続く場合は運営へ連絡してください。');
    }
}

function viewTransactionLogForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) return;

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;
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

            bodyText.push(
                { text: `§f${dateStr}§r ` },
                { text: log.action === 'buy' ? '§a' : '§c' },
                { translate: actionKey },
                { text: `§r\n§7${log.playerName}§r\n§f` }, ...transactionLogItemRawText(log), { text: ` x${log.amount}§r  ${log.action === 'buy' ? '§a' : '§c-'}${log.price} ${config.MoneyName}§r\n\n` }
            );
        }

        form.body({ rawtext: bodyText });
    }

    form.button({ translate: 'mc.button.back' });

    form.show(player).then(rs => {
        if (!player.isValid) return;
        editMainForm(player, dbKey, isOwner);
    });
}

function editNameForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (!canManageShop(player, shopData)) return;

    const form = new ModalFormData();
    form.title({ translate: 'form.button.barrelshop.editname' });
    form.textField({ translate: 'barrelshop.name.label' }, { translate: 'barrelshop.name.placeholder' }, { defaultValue: `${shopData.name}` });
    form.show(player).then((rs) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            editMainForm(player, dbKey, isOwner);
            return;
        };
        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) {
            return;
        };
        const newShopData = JSON.parse(newRawShopData);
        if (!canManageShop(player, newShopData)) return;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        newShopData.name = `${rs.formValues[0]}`;

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        editMainForm(player, dbKey, isOwner);
        return;
    });
};

function salesForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (!canManageShop(player, shopData)) return;

    const money = moveShopMoney(player, dbKey, 'sales');
    if (money === undefined) return;

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.sales' });
    form.body({ rawtext: [{ translate: 'barrelshop.sales.receive', with: [`${money}${config.MoneyName}`] }] });
    form.button({ translate: 'mc.button.back' });
    form.show(player).then((rs) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            editMainForm(player, dbKey, isOwner);
            return;
        };
        editMainForm(player, dbKey, isOwner);
        return;
    });
};

function blockedPlayersForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;
    const blockedPlayerNames = getBlockedPlayerNames(shopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.blockedplayers' });
    form.body(blockedPlayerNames.length > 0 ? {
        rawtext: [
            { translate: 'barrelshop.blockedplayers.list' },
            { text: `\n§f${blockedPlayerNames.join('\n')}§r` }
        ]
    } : { translate: 'barrelshop.blockedplayers.empty' });

    form.button({ translate: 'form.button.barrelshop.addblockedplayer' });
    if (blockedPlayerNames.length > 0) {
        form.button({ translate: 'form.button.barrelshop.removeblockedplayer' });
    }
    form.button({ translate: 'mc.button.back' });

    form.show(player).then((rs) => {
        if (!player.isValid) return;
        const removeButtonIndex = blockedPlayerNames.length > 0 ? 1 : -1;
        const backButtonIndex = blockedPlayerNames.length > 0 ? 2 : 1;

        if (rs.canceled || rs.selection === backButtonIndex) {
            editMainForm(player, dbKey, isOwner);
            return;
        };

        if (rs.selection === 0) {
            blockedPlayerAddForm(player, dbKey, isOwner);
            return;
        };

        if (rs.selection === removeButtonIndex) {
            blockedPlayerRemoveForm(player, dbKey, isOwner);
            return;
        };
    });
};

function blockedPlayerAddForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const form = new ModalFormData();
    form.title({ translate: 'form.title.barrelshop.addblockedplayer' });
    form.textField(
        { translate: 'barrelshop.blockedplayer.name.label' },
        { translate: 'barrelshop.blockedplayer.name.placeholder' },
        { defaultValue: '' }
    );
    form.submitButton({ translate: 'mc.button.add' });

    form.show(player).then((rs) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            blockedPlayersForm(player, dbKey, isOwner);
            return;
        };

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const targetName = `${rs.formValues[0] ?? ''}`.trim();
        const normalizedTargetName = normalizePlayerName(targetName);
        if (!normalizedTargetName) {
            player.sendMessage({ translate: 'error.barrelshop.invalidblockedplayername' });
            blockedPlayersForm(player, dbKey, isOwner);
            return;
        };

        const barrelShopDB = new DynamicProperties('barrelShop');
        const rawShopData = barrelShopDB.get(dbKey);
        if (!rawShopData) {
            return;
        };

        const shopData = JSON.parse(rawShopData);

        if (!canManageShop(player, shopData)) return;
        const blockedPlayerNames = getBlockedPlayerNames(shopData);
        if (blockedPlayerNames.some((name: any) => normalizePlayerName(name) === normalizedTargetName)) {
            player.sendMessage({ translate: 'error.barrelshop.blockedplayeralreadyexists' });
            blockedPlayersForm(player, dbKey, isOwner);
            return;
        };

        blockedPlayerNames.push(targetName);
        barrelShopDB.set(dbKey, JSON.stringify(shopData));

        player.sendMessage({ translate: 'success.barrelshop.blockedplayer.added', with: [targetName] });
        blockedPlayersForm(player, dbKey, isOwner);
    });
};

function blockedPlayerRemoveForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };

    const shopData = JSON.parse(rawShopData);

    if (!canManageShop(player, shopData)) return;
    const blockedPlayerNames = getBlockedPlayerNames(shopData);

    const form = new ActionFormData();
    form.title({ translate: 'form.title.barrelshop.removeblockedplayer' });
    form.button({ translate: 'mc.button.back' });

    for (const blockedPlayerName of blockedPlayerNames) {
        form.button(`${blockedPlayerName}`);
    };

    form.show(player).then((rs) => {
        if (!player.isValid) return;
        if (rs.canceled || rs.selection === 0) {
            blockedPlayersForm(player, dbKey, isOwner);
            return;
        };

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const removeName = blockedPlayerNames[rs.selection - 1];
        if (!removeName) {
            blockedPlayersForm(player, dbKey, isOwner);
            return;
        };

        const newRawShopData = barrelShopDB.get(dbKey);
        if (!newRawShopData) {
            return;
        };
        const newShopData = JSON.parse(newRawShopData);
        if (!canManageShop(player, newShopData)) return;
        const normalizedRemoveName = normalizePlayerName(removeName);
        newShopData.blockedPlayerNames = getBlockedPlayerNames(newShopData).filter((name: any) => normalizePlayerName(name) !== normalizedRemoveName);

        barrelShopDB.set(dbKey, JSON.stringify(newShopData));

        player.sendMessage({ translate: 'success.barrelshop.blockedplayer.removed', with: [removeName] });
        blockedPlayersForm(player, dbKey, isOwner);
    });
};

function adminsForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (!canManageShop(player, shopData, true)) return;

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.admins' });
    form.button({ translate: 'form.button.barrelshop.addadmins' });
    const playerDB = new DynamicProperties('player');

    const adminNames = [];
    const adminIds = [];
    for (const admin of shopData.admins) {
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const adminPlayerData = safeParse(playerDB.get(`player_${admin}`));
        form.button(adminPlayerData.name ?? admin)
        adminNames.push(adminPlayerData.name ?? admin);
        adminIds.push(admin);
    };

    form.show(player).then((rs) => {
        if (!player.isValid) return;
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

function adminRemoveForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (!canManageShop(player, shopData, true)) return;

    const playerDB = new DynamicProperties('player');

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.admins' });
    form.button({ translate: 'mc.button.back' });

    const adminNames = [];
    const adminIds: any = [];
    for (const admin of shopData.admins.filter((a: any) => a != player.id)) {
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const adminPlayerData = safeParse(playerDB.get(`player_${admin}`));
        form.button(adminPlayerData.name ?? admin);
        adminNames.push(adminPlayerData.name ?? admin);
        adminIds.push(admin);
    };

    form.show(player).then((rs) => {
        if (!player.isValid) return;
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
                if (!canManageShop(player, newShopData, true)) return;
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                const removeAdmin = adminIds[rs.selection - 1];
                if (typeof removeAdmin !== 'string' || !newShopData.admins.includes(removeAdmin)) return;
                newShopData.admins = newShopData.admins.filter((a: any) => a != removeAdmin);

                barrelShopDB.set(dbKey, JSON.stringify(newShopData));

                adminsForm(player, dbKey, isOwner);
                break;
            };
        };
        return;
    });
};

function adminAddForm(player: any, dbKey: any, isOwner: any) {
    if (!player?.isValid) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (!canManageShop(player, shopData, true)) return;

    const form = new ActionFormData();
    form.title({ translate: 'form.button.barrelshop.admins' });
    form.button({ translate: 'mc.button.back' });
    const playerIds: any = [];
    const playerNames = [];
    for (const p of world.getPlayers().filter(p => !shopData.admins.includes(p.id) && shopData.owner != p.id)) {
        form.button(`${p.name}`);
        playerNames.push(p.name);
        playerIds.push(p.id);
    };

    form.show(player).then((rs) => {
        if (!player.isValid) return;
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
                if (!canManageShop(player, newShopData, true)) return;
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                const newAdmin = playerIds[rs.selection - 1];
                if (typeof newAdmin !== 'string' || !newAdmin || newAdmin === newShopData.owner) return;
                newShopData.admins = newShopData.admins.filter((a: any) => a != newAdmin);
                newShopData.admins.push(newAdmin);

                barrelShopDB.set(dbKey, JSON.stringify(newShopData));

                adminsForm(player, dbKey, isOwner);
                break;
            };
        };
        return;
    });
};

function buyMainForm(player: any, barrel: any, dbKey: any) {
    const block = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
    if (block?.typeId != 'minecraft:barrel') return;
    if (!canUseShopAt(player, block, 'shopBuy')) return;
    const container = block.getComponent('inventory')?.container;
    if (!container) return;
    const barrelShopDB = new DynamicProperties('barrelShop');
    const rawShopData = barrelShopDB.get(dbKey);
    if (!rawShopData) {
        return;
    };
    const shopData = JSON.parse(rawShopData);
    if (isBlockedPlayerName(shopData, player)) {
        sendBlockedShopMessage(player);
        return;
    }
    const form = new ChestFormData('small');
    form.setTitle([{ text: '§2[' }, { translate: 'barrelshop.action.buy' }, { text: `]§r ${shopData.name}` }]);
    const itemExistIndex: any = [];
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (item) {
            const loreArray = [...item.getRawLore()];

            if (item.getComponent('enchantable')?.isValid) {
                for (const enchant of item.getComponent('enchantable')?.getEnchantments()) {
                    const enchantId = enchant.type.id.replace(/^minecraft:/, '');
            const langKey = (enchantIdToLang as Record<string, string>)[enchantId] || enchantId;
            loreArray.push(...[{ text: `\n§r${langKey.includes('.curse.') ? '§c' : '§7'}` }, { translate: langKey }, { text: ' ' }, { translate: `enchantment.level.${enchant.level}` }, { text: '§r' }]);
                };
            };

            if (item.getComponent('durability')?.isValid) {
                const durabilityComponent = item.getComponent('durability');
                loreArray.push({ text: `\n\n§9Durability: (${durabilityComponent.maxDurability - durabilityComponent.damage}/${durabilityComponent.maxDurability})§r` })
            };

            if (item.getRawLore().filter((v: any) => v?.translate != 'item.lore.price')?.length != 0) {
                loreArray.push(...[{ text: '\n\n§6' }, { translate: 'networkWorld.description' }])
                for (const line of item.getRawLore().filter((v: any) => v?.translate != 'item.lore.price')) {
                    loreArray.push(...[{ text: '§r\n' }, line])
                };
            }

            const price = loreArray.find((v: any) => v?.translate === 'item.lore.price');
            if (price) {
                const presentation = getChestItemStackPresentation(item);
                form.setButton(i, {
                    iconPath: presentation.iconPath,
                    name: item?.nameTag ? customNamedItemRawText(item.nameTag, presentation.name) : presentation.name,
                    lore: appendChestPresentationLore(loreArray, presentation.lore),
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
 * @param {*} dbKey 
 * @param {number} index 
 * @returns 
 */
function barrelPriceCents(item: any): number {
    const price = item.getRawLore().find((line: any) => line?.translate === 'item.lore.price');
    const input = Array.isArray(price?.with) ? price.with[0] : undefined;
    if ((typeof input !== 'string' && typeof input !== 'number') || String(input).trim() === '') throw Error('invalid_barrel_price');
    const value = Number(input), cents = shopMoneyCents(value);
    if (value !== cents / 100) throw Error('invalid_barrel_price_precision');
    return cents;
}

function completeShopPurchase(player: Player, barrel: any, dbKey: string, index: number, shown: any) {
    if (!player.isValid) return;
    try {
        if (isUnsafeToPlay() || player.hasTag('status:loading') || player.hasTag('status:transferring')) throw Error('shop_temporarily_unavailable');
        if (barrel.dimension?.id && barrel.dimension.id !== player.dimension.id) return;
        const block = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
        if (block?.above()?.typeId !== 'mc:shop_block') return;
        if (block?.typeId !== 'minecraft:barrel' || !canUseShopAt(player, block, 'shopBuy')) return;
        const stock = block.getComponent('inventory')?.container;
        const inventory = player.getComponent('inventory')?.container;
        if (!stock || !inventory || !Number.isSafeInteger(index) || index < 0 || index >= stock.size) return;
        const item = stock.getItem(index);
        if (!item || item.amount !== shown.amount || JSON.stringify(buybackMetadata(item)) !== JSON.stringify(buybackMetadata(shown))) return;
        if (!Number.isSafeInteger(item.amount) || item.amount < 1) throw Error('invalid_barrel_item_amount');
        const costCents = barrelPriceCents(item) * item.amount;
        if (!Number.isSafeInteger(costCents)) throw Error('barrel_price_overflow');
        const shops = new DynamicProperties('barrelShop'), players = new DynamicProperties('player');
        const rawShop = shops.get(dbKey);
        if (!rawShop) return;
        const shop = JSON.parse(rawShop), originalShop = JSON.parse(rawShop);
        if (shop.mode !== undefined && shop.mode !== 'sell') return;
        if (shop.dimension !== undefined && shop.dimension !== player.dimension.id) return;
        if (shop.location && (shop.location.x !== block.x || shop.location.z !== block.z || shop.location.y !== block.y + 1)) return;
        if (isBlockedPlayerName(shop, player)) { sendBlockedShopMessage(player); return; }
        const walletKey = `player_${player.id}`, wallet = JSON.parse(players.get(walletKey)!);
        const beforeMoney = wallet.money, moneyCents = shopMoneyCents(beforeMoney);
        if (moneyCents < costCents) { shopNotify(player, { translate: 'error.notenough.money' }); return; }
        const writes: Parameters<typeof commitShopRecords>[0] = [];
        const chunks = new DynamicProperties('chunk'), countries = new DynamicProperties('country');
        const rawChunk = chunks.get(`chunk_${Math.floor(block.x / 16)}_${Math.floor(block.z / 16)}_${player.dimension.id.replace('minecraft:', '')}`);
        let taxCents = 0;
        if (rawChunk) {
            const chunk = JSON.parse(rawChunk);
            const countryKey = `country_${chunk.countryId}`;
            const rawCountry = chunk.countryId > 0 ? countries.get(countryKey) : undefined;
            if (rawCountry) {
                const country = JSON.parse(rawCountry), rate = country.consumptionTax ?? 0;
                if (typeof rate !== 'number' || !Number.isFinite(rate) || rate < 0 || rate > 100) throw Error('invalid_consumption_tax');
                taxCents = shopMoneyCents(parseMoneyInput((costCents / 10000) * rate));
                if (taxCents > costCents) throw Error('barrel_tax_overflow');
                if (taxCents > 0) {
                    const finalCents = shopMoneyCents(country.money) + taxCents;
                    if (!Number.isSafeInteger(finalCents)) throw Error('treasury_money_overflow');
                    country.money = finalCents / 100;
                    if (country.treasuryBudgetLog !== undefined && !Array.isArray(country.treasuryBudgetLog)) throw Error('invalid_treasury_log');
                    country.treasuryBudgetLog = [...(country.treasuryBudgetLog ?? []).slice(-49), { timestamp: Date.now(), actor: player.name,
                        action: 'add', amount: taxCents / 100, reason: 'Consumption TAX' }];
                    writes.push({ database: countries, key: countryKey, value: country, restore: () => JSON.parse(rawCountry) });
                }
            }
        }
        const shopCents = shopMoneyCents(shop.money ?? 0) + costCents - taxCents;
        if (!Number.isSafeInteger(shopCents)) throw Error('shop_money_overflow');
        wallet.money = (moneyCents - costCents) / 100; shop.money = shopCents / 100;
        addTransactionLogToData(shop, { timestamp: Date.now(), playerId: player.id, playerName: player.name, action: 'buy', itemName: item.typeId,
            ...transactionLogItemDetail(buybackMetadata(item)), amount: item.amount, price: costCents / 100 });
        writes.push({ database: players, key: walletKey, value: wallet, restore: () => restoreShopWallet(players, walletKey, beforeMoney) },
            { database: shops, key: dbKey, value: shop, restore: () => originalShop });
        const drops: Entity[] = [];
        withShopInventories([stock, inventory], () => {
            stock.setItem(index);
            const remaining = inventory.addItem(item);
            if (remaining) drops.push(player.dimension.spawnItem(remaining, player.location));
            commitShopRecords(writes);
        }, () => { for (const entity of drops) if (entity.isValid) entity.remove(); });
        shopNotify(player, { translate: 'finish.bought' });
    } catch (error) {
        console.warn('[BarrelShop] Purchase aborted', error);
        shopNotify(player, '§c購入を完了できませんでした。続く場合は運営へ連絡してください。');
    }
}

function buyCheckForm(player: any, barrel: any, dbKey: any, index: any) {
    if (!player?.isValid) return;
    if (barrel.dimension?.id && barrel.dimension.id !== player.dimension.id) return;
    const block = player.dimension.getBlock({ x: barrel.x, y: barrel.y, z: barrel.z });
    if (block?.typeId != 'minecraft:barrel') return;
    const container = block.getComponent('inventory')?.container;
    if (!container) return;

    const item = container.getItem(index);
    if (!item) return;

    const form = new ChestFormData('single');
    const loreArray = [...item.getRawLore()];

    if (item.getComponent('enchantable')?.isValid) {
        for (const enchant of item.getComponent('enchantable')?.getEnchantments()) {
            const enchantId = enchant.type.id.replace(/^minecraft:/, '');
            const langKey = (enchantIdToLang as Record<string, string>)[enchantId] || enchantId;
            loreArray.push(...[{ text: `\n§r${langKey.includes('.curse.') ? '§c' : '§7'}` }, { translate: langKey }, { text: ' ' }, { translate: `enchantment.level.${enchant.level}` }, { text: '§r' }]);
        };
    };

    if (item.getComponent('durability')?.isValid) {
        const durabilityComponent = item.getComponent('durability');
        loreArray.push({ text: `\n\n§9Durability: (${durabilityComponent.maxDurability - durabilityComponent.damage}/${durabilityComponent.maxDurability})§r` })
    };

    if (item.getRawLore().filter((v: any) => v?.translate != 'item.lore.price')?.length != 0) {
        loreArray.push(...[{ text: '\n\n§6' }, { translate: 'networkWorld.description' }])
        for (const line of item.getRawLore().filter((v: any) => v?.translate != 'item.lore.price')) {
            loreArray.push(...[{ text: '§r\n' }, line])
        };
    }

    const price = loreArray.find((v: any) => v?.translate === 'item.lore.price');
    if (price) {
        try { barrelPriceCents(item); } catch { shopNotify(player, '§c商品の価格を確認できません。店主へ連絡してください。'); return; }
        form.setTitle(`${price.with[0]} x ${item.amount} = ${normalizeMoney(Number(price.with[0]) * item.amount)}${config.MoneyName}`);
        const presentation = getChestItemStackPresentation(item);
        form.setButton(13, {
            iconPath: presentation.iconPath,
            name: item?.nameTag ? customNamedItemRawText(item.nameTag, presentation.name) : presentation.name,
            lore: appendChestPresentationLore(loreArray, presentation.lore),
            stackAmount: item.amount,
            isGlint: item.getComponent('enchantable')?.isValid ? item.getComponent('enchantable')?.getEnchantments()?.length > 0 : false,
            editedName: true
        });
    };
    if (!price) return;

    form.show(player).then(rs => {
        if (!player.isValid) return;
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
                completeShopPurchase(player, barrel, dbKey, index, item);
                break;
            };
            default: {
                buyCheckForm(player, barrel, dbKey, index);
                break;
            };
        };
    });
};
