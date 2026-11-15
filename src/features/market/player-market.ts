import { PlayerMarketActionForm as ActionForm, PlayerMarketModalForm as ModalForm } from "@/shared/ui/purpose-forms.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { ItemStack, Player, system, world, type Entity } from "@minecraft/server";
import { GetAndParsePropertyData, isDecimalNumber, langChangeItemName, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import * as DyProp from "@/shared/storage/chunked-dynamic-properties.js";
import { FormCancelationReason } from "@minecraft/server-ui";
import { getInteractiveFormValues, usesClassicFormUI } from "@/shared/ui/form-class.js";

const ActionFormData = ActionForm;
const ModalFormData = ModalForm;
import config from "@/config/server.js";
import { itemIdToPath } from "@/config/textures.js";
import { typeIdToID } from "@/shared/minecraft/type-ids.js";
import { isUnsafeToPlay } from "@/shared/integration/standalone.js";
import { sameMarketItem, supportsMarketItem } from "@/domain/shop/market-item.js";

const SHOP_DETAIL_MARKER = "§s§h§o§p§d§e§t§a§i§l";
const PLAYER_MARKET_CHEST_MARKER = "§m§a§r§k§e§t§g§r§i§d";
const PLAYER_MARKET_PAGE_SIZE = 45;
const marketItemNameCache = new Map<string, string>();
const marketButtonCache = new Map<number, { fingerprint: string, button: ReturnType<typeof ChestFormData.prepareButton> }>();

function marketNotify(player: Player, message: Parameters<Player['sendMessage']>[0]) {
    try { if (player.isValid) player.sendMessage(message); } catch { }
}

function marketFailure(player: Player, error: unknown) {
    console.warn('[PlayerMarket] Transaction aborted', error);
    marketNotify(player, '§c取引を完了できませんでした。保存データを確認し、続く場合は運営へ連絡してください。');
}

function marketCents(value: unknown): number | undefined {
    if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) return undefined;
    const cents = Math.round(value * 100);
    return Number.isSafeInteger(cents) ? cents : undefined;
}

function ensureMarketReady(player: Player) {
    if (isUnsafeToPlay() || player.hasTag('status:loading') || player.hasTag('status:transferring')) throw Error('market_temporarily_unavailable');
}

function readMarketListings(player: Player): any[] | undefined {
    try {
        ensureMarketReady(player);
        const stored = GetAndParsePropertyData('player_market_commons');
        const rows = stored === undefined ? [] : stored;
        if (!Array.isArray(rows)) throw Error('invalid_market_listings');
        const ids = new Set<number>();
        for (const row of rows) {
            if (!row || !Number.isSafeInteger(row.id) || row.id < 1 || ids.has(row.id)
                || typeof row.playerId !== 'string' || !row.playerId || !Number.isSafeInteger(row.price) || row.price < 1
                || !row.item || typeof row.item.typeId !== 'string' || !row.item.typeId
                || !Number.isSafeInteger(row.item.amount) || row.item.amount < 1) throw Error('invalid_market_listing');
            ids.add(row.id);
        }
        return rows;
    } catch (error) { marketFailure(player, error); return undefined; }
}

function readMarketAccount(player: Player, id: string): any | undefined {
    try {
        ensureMarketReady(player);
        const account = GetAndParsePropertyData(`player_${id}`);
        if (!account || marketCents(account.money) === undefined) throw Error('invalid_market_wallet');
        if (account.soldhistory !== undefined && !Array.isArray(account.soldhistory)) throw Error('invalid_market_history');
        return account;
    } catch (error) { marketFailure(player, error); return undefined; }
}

/** Use fresh wallet markers when undoing a previously committed balance write. */
function restoreMarketWallet(id: string, money: number, history?: { value: any }) {
    const account = GetAndParsePropertyData(`player_${id}`);
    if (!account) throw Error('missing_market_rollback_wallet');
    account.money = money;
    if (history) {
        if (history.value === undefined) delete account.soldhistory;
        else account.soldhistory = history.value;
    }
    return account;
}

function commitMarketRecords(writes: { key: string; value: any; restore: () => any }[]) {
    const applied: typeof writes = [];
    try {
        for (const write of writes) {
            StringifyAndSavePropertyData(write.key, write.value);
            applied.push(write);
        }
    } catch (error) {
        for (const write of applied.reverse()) {
            try { StringifyAndSavePropertyData(write.key, write.restore()); }
            catch (restoreError) { console.error('[PlayerMarket] Failed to restore saved record', restoreError); }
        }
        throw error;
    }
}

function withMarketInventory(player: Player, container: any, action: (deliver: (item: ItemStack) => void) => void): boolean {
    let before: (ItemStack | undefined)[] | undefined;
    const drops: Entity[] = [];
    try {
        before = Array.from({ length: container.size }, (_, slot) => container.getItem(slot));
        action(item => {
            const remaining = container.addItem(item);
            if (remaining) drops.push(player.dimension.spawnItem(remaining, player.location));
        });
        return true;
    } catch (error) {
        for (const drop of drops) {
            try { drop.remove(); } catch (restoreError) { console.error('[PlayerMarket] Failed to remove rolled back delivery', restoreError); }
        }
        if (before) {
            try { container.clearAll(); before.forEach((item, slot) => { if (item) container.setItem(slot, item); }); }
            catch (restoreError) { console.error('[PlayerMarket] Failed to restore inventory', restoreError); }
        }
        marketFailure(player, error);
        return false;
    }
}

function restoreMarketItem(player: Player, common: any): ItemStack | undefined {
    try {
        const item = new ItemStack(common.item.typeId, common.item.amount);
        item.nameTag = common.item?.name;
        item.setLore(common.item?.rawLore ?? common.item?.lore ?? []);
        return item;
    } catch {
        player.sendMessage("§c商品を復元できませんでした。取引は行われていません。運営へお問い合わせください。");
        return undefined;
    }
}

function preparedMarketButton(common: any) {
    const lore = common.item.lore ?? [];
    const fingerprint = JSON.stringify([
        common.item.typeId,
        common.item.name ?? "",
        common.item.amount,
        common.price,
        common.playerName,
        lore,
    ]);
    const cached = marketButtonCache.get(common.id);
    if (cached?.fingerprint === fingerprint) return cached.button;

    let translatedName = marketItemNameCache.get(common.item.typeId);
    if (!translatedName) {
        translatedName = langChangeItemName(common.item.typeId);
        marketItemNameCache.set(common.item.typeId, translatedName ?? common.item.typeId);
    }
    translatedName ??= common.item.typeId;
    const itemName = common.item.name
        ? [{ text: `${common.item.name}§r (` }, { translate: translatedName }, { text: `§r)` }]
        : [{ translate: translatedName }];
    const button = ChestFormData.prepareButton({
        name: itemName,
        iconPath: (itemIdToPath as Record<string, string>)[common.item.typeId] ?? common.item.typeId,
        stackAmount: common.item.amount,
        lore: [`§6価格: ${config.MoneyName}${common.price}`, `§7出品者: ${common.playerName}`, ...lore],
        editedName: true,
    }, true);
    marketButtonCache.set(common.id, { fingerprint, button });
    return button;
}

function marketItemTexture(typeId: string) {
    const texture = (itemIdToPath as Record<string, string>)[typeId] ?? typeIdToID.get(typeId) ?? typeId;
    return typeof texture === "number" ? String(texture * 65536) : String(texture);
}

world.afterEvents.worldLoad.subscribe(() => {
    // @ts-ignore TS(2345): Argument of type '"[]"' is not assignable to param... Remove this comment to see the full error message
    if (!DyProp.getDynamicProperty(`player_market_commons`)) DyProp.setDynamicProperty(`player_market_commons`, `[]`);
});

/**
 * 
 * @param {Player} player 
 */
export function PlayerMarketMainMenu(player: any) {
    if (!player?.isValid) return;
    if (usesClassicFormUI(player)) {
        const form = new ActionFormData();
        form.title({ translate: `playermarket.title` });
        form.button({ translate: `view.products` });
        form.button({ translate: `sell.products` });
        form.button({ translate: `withdrawal.goods` });
        form.button({ translate: `sale.history` });
        form.show(player).then((rs: any) => {
            if (!player.isValid) return;
            if (rs.canceled) {
                if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => PlayerMarketMainMenu(player), 10);
                return;
            }
            if (rs.selection === 0) PlayerMarketCommonsMenu(player);
            if (rs.selection === 1) PlayerMarketExhibitMainMenu(player);
            if (rs.selection === 2) PlayerMarketWithdrawalGoodsMainMenu(player);
            if (rs.selection === 3) PlayerMarketCheckSold(player);
        });
        return;
    }
    PlayerMarketCommonsMenu(player);
};

/**
 * 売却履歴
 * @param {Player} player 
 */
export function PlayerMarketCheckSold(player: any) {
    if (!player?.isValid) return;
    const playerData = readMarketAccount(player, player.id);
    if (!playerData) return;
    const soldHistory = playerData.soldhistory ?? [];
    let string = '';
    let total = marketCents(playerData.money)!;
    try {
        for (const history of soldHistory) {
            if (!history || !Number.isSafeInteger(history.price) || history.price < 1 || !history.item || typeof history.item.typeId !== 'string') throw Error('invalid_market_history');
            total += history.price * 100;
            if (!Number.isSafeInteger(total)) throw Error('market_history_overflow');
            string += `>>${history.user}§r §a+§e${history.price}§r\n${history.item.name || history.item.typeId} * ${history.item.amount}\n${(history.item.lore ?? []).join('§r\n')}\n\n\n`;
        }
        playerData.soldhistory = [];
        playerData.money = total / 100;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
    } catch (error) { marketFailure(player, error); return; }
    const form = new ActionFormData();
    form.title({ translate: 'sale.history' });
    form.body(string);
    form.button({ translate: 'mc.button.close' });
    form.show(player).then((rs: any) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            PlayerMarketMainMenu(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
        };

    });
};

/**
 * 出品したアイテム一覧
 * @param {Player} player 
 */
export function PlayerMarketWithdrawalGoodsMainMenu(player: any) {
    if (!player?.isValid) return;
    const form = new ActionFormData();
    form.title({ translate: `playermarket.title` });
    form.button({ translate: `mc.button.close` });
    const data = readMarketListings(player);
    if (!data) return;
    /**
     * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
     */
    const allCommons = data.filter((com: any) => com.playerId == player.id);
    for (let i = 0; i < allCommons.length; i++) {
        const item = allCommons[i];
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let itemPath = itemIdToPath[item.item.typeId] ?? typeIdToID.get(item.item.typeId) ?? item.item.typeId
        const texture = typeof itemPath === "number" ? (itemPath * 65536) : itemPath;
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        form.button({ rawtext: [{ text: `` }, { translate: `${langChangeItemName(item.item.typeId)}` }, { text: `\n${item.item.typeId} x${item.item.amount} (${config.MoneyName}${item.price})` }] }, String(texture));
    };
    form.show(player).then((rs: any) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            PlayerMarketMainMenu(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            default: {
                const newcommonsdata = readMarketListings(player);
                if (!newcommonsdata) return;
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                const selected = allCommons[rs.selection - 1];
                const result = selected && newAllCommons.find((com: any) => com.id == selected.id && com.playerId === player.id);
                if (!result) {
                    PlayerMarketWithdrawalGoodsMainMenu(player);
                    break;
                };
                PlayerMarketWithdrawalGoodsSelectMenu(player, result);
                break;
            };
        };
    });
};

/**
 * 出品アイテムの取り下げ
 * @param {Player} player 
 * @param {{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}} common
 */
export function PlayerMarketWithdrawalGoodsSelectMenu(player: any, common: any) {
    if (!player?.isValid) return;
    const form = new ActionFormData();
    form.title({ translate: `playermarket.title` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.withdrawal.goods` });
    form.show(player).then((rs: any) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            //閉じる
            return;
        };
        switch (rs.selection) {
            case 0: {
                PlayerMarketWithdrawalGoodsMainMenu(player);
                break;
            };
            case 1: {
                //商品のチェック
                const newcommonsdata = readMarketListings(player);
                if (!newcommonsdata) return;
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                const current = newAllCommons.find((com: any) => com.id == common.id && com.playerId === player.id);
                if (!current) {
                    player.sendMessage({ translate: `playermarket.error.already.buy` })
                    return;
                };
                // Construct before deleting the listing: an unknown/broken item must remain claimable.
                const item = restoreMarketItem(player, current);
                if (!item) return;
                const container = player.getComponent(`inventory`).container;
                if (!withMarketInventory(player, container, deliver => {
                    deliver(item);
                    StringifyAndSavePropertyData('player_market_commons', newAllCommons.filter((com: any) => com.id !== current.id));
                })) return;
                marketNotify(player, { translate: 'finish.goods.withdrawal.message' });
                break;
            };
        };
    });
};

/**
 * 出品アイテムの選択
 * @param {Player} player 
 */
export function PlayerMarketExhibitMainMenu(player: any) {
    if (!player?.isValid) return;
    const data = readMarketListings(player);
    if (!data) return;
    /**
 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
 */
    const allCommons = data.filter((com: any) => com.playerId == player.id);

    if (config.maxMarketAmount <= allCommons.filter((common: any) => common.playerId == player.id).length) {
        player.sendMessage({ translate: `error.maxmarketamount`, with: [`${config.maxMarketAmount}`] });
        return;
    };
    let items: any = [];
    const container = player.getComponent(`inventory`).container;
    const form = new ActionFormData();
    form.title({ translate: `playermarket.title` });
    form.body(`§8出品するアイテムを選んでください`);
    form.button({ translate: `mc.button.back` });
    let itemStackArray: any = [];
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        if (!supportsMarketItem(item)) continue;
        itemStackArray.push(item);
        items.push({ slot: i, itemStack: item });
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let itemPath = itemIdToPath[item.typeId] ?? typeIdToID.get(item.typeId) ?? item.typeId
        const texture = typeof itemPath === "number" ? (itemPath * 65536) : itemPath;
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        form.button({ rawtext: [{ translate: langChangeItemName(item.typeId) }, { text: `\n${item.typeId} x ${item.amount}` }] }, String(texture));
    };
    form.show(player).then((rs: any) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            PlayerMarketMainMenu(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                PlayerMarketMainMenu(player);
                return;
            };
            default: {
                const playerData = GetAndParsePropertyData(`player_${player.id}`);
                if (playerData.money < config.playerMarketCommission) {
                    player.sendMessage({ translate: `error.notenough.money` });
                    return;
                };
                const newContainer = player.getComponent(`inventory`).container;
                const selected = items[rs.selection - 1];
                if (!selected) return;
                const item2 = newContainer.getItem(selected.slot);
                if (!sameMarketItem(item2, itemStackArray[rs.selection - 1])) {
                    PlayerMarketExhibitMainMenu(player);
                    return;
                };
                PlayerMarketExhibitSelectItemMenu(player, items[rs.selection - 1], itemStackArray[rs.selection - 1]);
                return;
            };
        };
    });
};

/**
 * 出品
 * @param {{ slot: number,itemStack: ItemStack }} itemData 
 * @param {ItemStack} itemStack 
 * @param {Player} player 
 */
export function PlayerMarketExhibitSelectItemMenu(player: any, itemData: any, itemStack: any) {
    if (!player?.isValid) return;
    const form = new ModalFormData();
    form.title({ translate: `playermarket.title` });
    form.slider(``, 1, itemData.itemStack.amount, 1);
    form.textField({ translate: `input.price` }, { translate: `price.label` });
    form.toggle({ translate: `form.button.notify` });
    form.label({ translate: `form.label.commission`, with: [`${config.playerMarketCommission}${config.MoneyName}`] });
    form.show(player).then((rs: any) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            PlayerMarketExhibitMainMenu(player);
            return;
        }
        const values = getInteractiveFormValues(rs);
        const newContainer = player.getComponent(`inventory`).container;
        const item = newContainer.getItem(itemData.slot);
        if (!sameMarketItem(item, itemData.itemStack)) {
            PlayerMarketExhibitMainMenu(player);
            return;
        };
        const priceValue = Number(values[1])
        if (!Number.isSafeInteger(priceValue) || !Number.isSafeInteger(priceValue * 100) || !isDecimalNumber(priceValue) || values[1] === ``) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        if (priceValue < 1) {
            player.sendMessage({ translate: `command.error.canuse.number.more`, with: [`1`] });
            return;
        };

        const itemAmount = values[0];
        if (!Number.isSafeInteger(itemAmount) || itemAmount < 1 || itemAmount > item.amount) return;
        const allCommons = readMarketListings(player);
        if (!allCommons) return;
        if (allCommons.filter((common: any) => common.playerId === player.id).length >= config.maxMarketAmount) {
            player.sendMessage({ translate: `error.maxmarketamount`, with: [`${config.maxMarketAmount}`] });
            return;
        }
        const playerData = readMarketAccount(player, player.id);
        if (!playerData) return;
        const originalMoney = playerData.money;
        const fee = marketCents(config.playerMarketCommission);
        if (fee === undefined || marketCents(playerData.money)! < fee) {
            marketNotify(player, { translate: 'error.notenough.money' });
            return;
        }
        playerData.money = (marketCents(playerData.money)! - fee) / 100;
        let id: number;
        try {
            const previous = Number(world.getDynamicProperty('playermarketId') ?? '0');
            if (!Number.isSafeInteger(previous) || previous < 0) throw Error('invalid_market_id');
            id = previous + 1;
            for (const listing of allCommons) id = Math.max(id, listing.id + 1);
            if (!Number.isSafeInteger(id)) throw Error('exhausted_market_id');
            world.setDynamicProperty('playermarketId', String(id));
        } catch (error) { marketFailure(player, error); return; }
        /**
         * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
         */
        const potionComponent = itemData.itemStack.getComponent("potion");
        const data = {
            id,
            playerName: player.name,
            playerId: player.id,
            price: priceValue,
            item: {
                name: itemData.itemStack?.nameTag,
                typeId: itemData.itemStack.typeId,
                lore: itemData.itemStack.getLore(),
                rawLore: itemData.itemStack.getRawLore(),
                amount: itemAmount,
                potion: potionComponent?.isValid ? {
                    delivery: potionComponent.potionDeliveryType.id,
                    effect: potionComponent.potionEffectType.id,
                    duration: potionComponent.potionEffectType?.durationTicks
                } : undefined,
            }
        };
        if (!withMarketInventory(player, newContainer, () => {
            if (item.amount === itemAmount) newContainer.setItem(itemData.slot);
            else { item.amount -= itemAmount; newContainer.setItem(itemData.slot, item); }
            commitMarketRecords([
                { key: `player_${player.id}`, value: playerData, restore: () => restoreMarketWallet(player.id, originalMoney) },
                { key: 'player_market_commons', value: [data, ...allCommons], restore: () => allCommons },
            ]);
        })) return;
        marketNotify(player, { rawtext: [{ text: '§a[PlayerMarket]\n' }, { translate: 'success.exhibited.message', with: { rawtext: [{ translate: langChangeItemName(itemData.itemStack.typeId) }] } }] });
        if (values[2]) {
            try { world.sendMessage({ rawtext: [{ text: '§a[PlayerMarket]\n' }, { translate: 'exhibited.message', with: { rawtext: [{ translate: langChangeItemName(itemData.itemStack.typeId) }] } }] }); } catch { }
        }
        return;
    });
};

/**
 * 
 * @param {Player} player 
 */
export function PlayerMarketCommonsMenu(player: any, page = 0, keyword = ``, type = 0) {
    if (!player?.isValid) return;
    const data = readMarketListings(player);
    if (!data) return;

    /**
     * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
     */
    let allCommons = Array.isArray(data) ? data : [];
    if (keyword != ``) {
        switch (type) {
            //アイテムのIDで絞り込み
            case 0: {
                allCommons = allCommons.filter((com: any) => com.item.typeId.includes(keyword));
                break;
            };
            //アイテムの名前で絞り込み
            case 1: {
                allCommons = allCommons.filter((com: any) => com.item?.name?.includes(keyword));
                break;
            };
            //出品者の名前で絞り込み
            case 2: {
                allCommons = allCommons.filter((com: any) => com.playerName.includes(keyword));
                break;
            };
        };
    };
    if (usesClassicFormUI(player)) {
        showClassicPlayerMarket(player, allCommons, page, keyword, type);
        return;
    }
    const pageCount = Math.max(1, Math.ceil(allCommons.length / PLAYER_MARKET_PAGE_SIZE));
    page = Math.max(0, Math.min(Math.floor(page), pageCount - 1));
    const commonsAll = allCommons;
    const commons = allCommons.slice(PLAYER_MARKET_PAGE_SIZE * page, PLAYER_MARKET_PAGE_SIZE * (page + 1));
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const form = new ChestFormData("large");
    form.enableLoreLineBreaks();
    form.trimTrailingEmptySlots();
    form.setTitle([
        { text: PLAYER_MARKET_CHEST_MARKER },
        { translate: `playermarket.title` },
        { text: `  §8${page + 1}/${pageCount}  §6${config.MoneyName}${playerData?.money ?? 0}` },
    ]);

    form.setButton(0, { name: `§4閉じる`, iconPath: itemIdToPath["minecraft:barrier"] ?? "minecraft:barrier", lore: [`画面を閉じます`], editedName: true });
    form.setButton(1, { name: [{ translate: `sell.products` }], iconPath: itemIdToPath["minecraft:emerald"] ?? "minecraft:emerald", lore: [`商品を出品します`], editedName: true });
    form.setButton(2, { name: [{ translate: `withdrawal.goods` }], iconPath: itemIdToPath["minecraft:chest"] ?? "minecraft:chest", lore: [`出品を取り下げます`], editedName: true });
    if (page > 0) form.setButton(3, { name: `§6前のページ`, iconPath: "textures/ui/arrow_left", lore: [`${page} / ${pageCount}`], editedName: true });
    form.setButton(4, { name: `§e商品一覧を更新`, iconPath: itemIdToPath["minecraft:compass"] ?? "minecraft:compass", lore: [`出品 ${commonsAll.length}件`, `ページ ${page + 1} / ${pageCount}`], editedName: true });
    const hasNext = page + 1 < pageCount;
    if (hasNext) form.setButton(5, { name: `§6次のページ`, iconPath: "textures/ui/arrow_right", lore: [`${page + 2} / ${pageCount}`], editedName: true });
    form.setButton(6, { name: [{ translate: `sale.history` }], iconPath: itemIdToPath["minecraft:paper"] ?? "minecraft:paper", lore: [`売上履歴を確認します`], editedName: true });

    form.setPreparedButtons(9, commons.map(preparedMarketButton));
    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => PlayerMarketCommonsMenu(player, page, keyword, type), 10);
            }
            return;
        };
        const selection = rs.selection ?? -1;
        if (selection === 0) return;
        if (selection === 1) return void PlayerMarketExhibitMainMenu(player);
        if (selection === 2) return void PlayerMarketWithdrawalGoodsMainMenu(player);
        if (selection === 3 && page > 0) return void PlayerMarketCommonsMenu(player, page - 1, keyword, type);
        if (selection === 4) return void PlayerMarketCommonsMenu(player, page, keyword, type);
        if (selection === 5 && hasNext) return void PlayerMarketCommonsMenu(player, page + 1, keyword, type);
        if (selection === 6) return void PlayerMarketCheckSold(player);
        if (selection >= 9 && selection < 9 + commons.length) {
                const selected = commons[selection - 9];
                //商品のチェック
                const newcommonsdata = readMarketListings(player);
                if (!newcommonsdata) return;
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = Array.isArray(newcommonsdata) ? newcommonsdata : [];
                if (!newAllCommons.find((com: any) => com.id == selected.id)) {
                    PlayerMarketCommonsMenu(player, page);
                    return;
                };
                system.run(() => {
                    PlayerMarketSelectCommonForm(player, selected, page, keyword, type);
                    return;
                });
        };
    });
};

function showClassicPlayerMarket(player: any, allCommons: any[], page: number, keyword: string, type: number) {
    if (!player?.isValid) return;
    const pageSize = 45;
    const pageCount = Math.max(1, Math.ceil(allCommons.length / pageSize));
    page = Math.max(0, Math.min(Math.floor(page), pageCount - 1));
    const commons = allCommons.slice(page * pageSize, (page + 1) * pageSize);
    const form = new ChestFormData("large");
    form.setTitle(`playermarket.title`);
    commons.forEach((common, index) => {
        common.item.lore = common.item.lore ?? [];
        form.setButton(index + 9, {
            name: common.item.name
                ? [{ text: `${common.item.name}§r(` }, { translate: langChangeItemName(common.item.typeId) }, { text: `§r)` }]
                : common.item.typeId,
            iconPath: (itemIdToPath as Record<string, string>)[common.item.typeId] ?? common.item.typeId,
            lore: [`${config.MoneyName}${common.price}`, `${common.playerName}`, ...common.item.lore],
            stackAmount: common.item.amount,
            editedName: !!common.item.name,
        });
    });
    form.setButton(0, { name: "§l§4Close", iconPath: itemIdToPath["minecraft:barrier"], lore: ["Push here"], editedName: true });
    if (page > 0) form.setButton(3, { name: "<<", iconPath: "textures/ui/arrow_left", lore: ["Previous Page"], editedName: true });
    if (page + 1 < pageCount) form.setButton(5, { name: ">>", iconPath: "textures/ui/arrow_right", lore: ["Next Page"], editedName: true });
    form.show(player).then(rs => {
        if (!player.isValid) return;
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => showClassicPlayerMarket(player, allCommons, page, keyword, type), 10);
            else PlayerMarketMainMenu(player);
            return;
        }
        if (rs.selection === 0) return;
        if (rs.selection === 3 && page > 0) return void showClassicPlayerMarket(player, allCommons, page - 1, keyword, type);
        if (rs.selection === 5 && page + 1 < pageCount) return void showClassicPlayerMarket(player, allCommons, page + 1, keyword, type);
        const selected = commons[(rs.selection ?? -1) - 9];
        if (!selected) return;
        const current = readMarketListings(player);
        if (!current) return;
        if (!current.find((entry: any) => entry.id === selected.id)) return void PlayerMarketCommonsMenu(player, page, keyword, type);
        system.run(() => PlayerMarketSelectCommonForm(player, selected, page, keyword, type));
    });
}

/**
 * @param {Player} player 
 * @param {{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}} common
 */
export function PlayerMarketSelectCommonForm(player: any, common: any, page = 0, keyword = ``, type = 0) {
    if (!player?.isValid) return;
    if (player.id == common.playerId) {
        player.sendMessage({ translate: `playermarket.error.sameplayer` });
        return;
    };
    const classic = usesClassicFormUI(player);
    const form = new ActionFormData();
    form.title(classic ? { translate: `playermarket.title` } : { rawtext: [{ text: SHOP_DETAIL_MARKER }, { translate: `playermarket.title` }] });
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!classic) form.body({
        rawtext: [
            { translate: `${langChangeItemName(common.item.typeId)}` },
            { text: ` §8×${common.item.amount}\n\n§6価格  ${config.MoneyName}${common.price}\n§8出品者  ${common.playerName}\n§0所持金  ${config.MoneyName}${playerData?.money ?? 0}` },
        ],
    });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.buy` });
    if (!classic) form.button({ translate: `${langChangeItemName(common.item.typeId)}` }, marketItemTexture(common.item.typeId));
    form.show(player).then((rs: any) => {
        if (!player.isValid) return;
        if (rs.canceled) {
            PlayerMarketCommonsMenu(player, page, keyword, type);
            return;
        };
        switch (rs.selection) {
            case 0: {
                PlayerMarketCommonsMenu(player, page, keyword, type);
                break;
            };
            case 1: {
                //商品のチェック
                const newcommonsdata = readMarketListings(player);
                if (!newcommonsdata) return;
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                const current = newAllCommons.find((com: any) => com.id == common.id);
                if (!current || current.playerId !== common.playerId || current.price !== common.price
                    || JSON.stringify(current.item) !== JSON.stringify(common.item)) {
                    player.sendMessage({ translate: `playermarket.error.already.buy` })
                    return;
                };
                const playerData = readMarketAccount(player, player.id);
                const exhibitorData = readMarketAccount(player, common.playerId);
                if (!playerData || !exhibitorData) return;
                const buyerMoney = playerData.money, sellerMoney = exhibitorData.money;
                const cost = common.price * 100;
                if (!Number.isSafeInteger(cost) || marketCents(buyerMoney)! < cost) {
                    marketNotify(player, { translate: 'error.notenough.money' });
                    return;
                }
                const item = restoreMarketItem(player, common);
                if (!item) return;
                const container = player.getComponent('inventory')?.container;
                if (!container) return;
                const originalHistory = exhibitorData.soldhistory;
                exhibitorData.soldhistory = [...(originalHistory ?? []), { price: common.price, user: player.name, item: common.item }];
                playerData.money = (marketCents(buyerMoney)! - cost) / 100;
                if (!withMarketInventory(player, container, deliver => {
                    deliver(item);
                    commitMarketRecords([
                        { key: 'player_market_commons', value: newAllCommons.filter((com: any) => com.id !== common.id), restore: () => newAllCommons },
                        { key: `player_${player.id}`, value: playerData, restore: () => restoreMarketWallet(player.id, buyerMoney) },
                        { key: `player_${common.playerId}`, value: exhibitorData, restore: () => restoreMarketWallet(common.playerId, sellerMoney, { value: originalHistory }) },
                    ]);
                })) return;
                marketNotify(player, { translate: 'finish.bought' });
                break;
            };
            case 2: {
                if (!classic) PlayerMarketSelectCommonForm(player, common, page, keyword, type);
                break;
            };
        };
    });
};
