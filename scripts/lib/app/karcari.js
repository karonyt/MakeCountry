import { ItemStack, Player, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData, isDecimalNumber, langChangeItemName } from "../util";
import { DynamicProperties } from "../../api/dyp";
import config from "../../config";
import { SmartPhoneHomeScreen } from "../smartphone";
import { ChestFormData } from "../chest-ui";
import * as DyProp from "../DyProp";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm, ModalForm } from "../form_class";
const ActionFormData = ActionForm;
const ModalFormData = ModalForm;
import { itemIdToPath } from "../../texture_config";
import { typeIdToID } from "../typeIds";

/**
 * @type {DynamicProperties}
 */
let playerDataBase;

world.afterEvents.worldLoad.subscribe(() => {
    playerDataBase = new DynamicProperties("player");
});

/**
 * 
 * @param {Player} player 
 */
export function KarcariApp(player) {
    const form = new ActionFormData();
    form.title(`Karcari`);
    form.button({ translate: `view.products` });
    form.button({ translate: `sell.products` });
    form.button({ translate: `withdrawal.goods` });
    form.button({ translate: `sale.history` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    KarcariApp(player);
                }, 10);
            };
            //閉じる
            SmartPhoneHomeScreen(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //商品一覧を見る
                PlayerMarketCommonsMenu(player);
                break;
            };
            case 1: {
                //出品する
                PlayerMarketExhibitMainMenu(player);
                break;
            };
            case 2: {
                //出品を取り下げる
                PlayerMarketWithdrawalGoodsMainMenu(player);
                break;
            };
            case 3: {
                //売上確認
                PlayerMarketCheckSold(player);
                break;
            };
        };
    });
};

/**
 * 売却履歴
 * @param {Player} player 
 */
export function PlayerMarketCheckSold(player) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    /**
     * @type {Array<{ price: number, user: string, item: {name: undefined|string, typeId: string,amount: number,lore: [string] } }>}
     */
    let soldHistory = playerData?.soldhistory ?? [];
    let string = '';
    let addMoney = 0;
    for (const history of soldHistory) {
        if (!history.item?.lore) history.item.lore = []
        string += `>>${history.user}§r §a+§e${history.price}§r\n${history.item?.name ? `${history.item.name}§r(${history.item.typeId})` : history.item.typeId} * ${history.item.amount}\n${history.item?.lore.join('§r\n')}\n\n\n`;
        addMoney += history.price;
    };
    playerData.soldhistory = [];
    playerData.money += addMoney;
    StringifyAndSavePropertyData(`player_${player.id}`, playerData);
    const form = new ActionFormData();
    form.title({ rawtext: [{ text: 'Karcari - ' }, { translate: 'sale.history' }] });
    form.body(string);
    form.button({ translate: 'mc.button.close' });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            KarcariApp(player);
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
export function PlayerMarketWithdrawalGoodsMainMenu(player) {
    const form = new ActionFormData();
    form.title(`Karcari`)
    form.button({ translate: `mc.button.close` });
    const data = GetAndParsePropertyData(`player_market_commons`) ?? [];
    /**
     * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
     */
    const allCommons = data.filter(com => com.playerId == player.id);
    for (let i = 0; i < allCommons.length; i++) {
        const item = allCommons[i];
        let itemPath = itemIdToPath[item.item.typeId] ?? typeIdToID.get(item.item.typeId) ?? item.item.typeId
        const texture = typeof itemPath === "number" ? (itemPath * 65536) : itemPath;
        form.button({ rawtext: [{ text: `` }, { translate: `${langChangeItemName(item.item.typeId)}` }, { text: `\n${item.item.typeId} x${item.item.amount} (${config.MoneyName}${item.price})` }] }, String(texture));
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            KarcariApp(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            default: {
                const newcommonsdata = GetAndParsePropertyData(`player_market_commons`) ?? [];
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                const result = newAllCommons.find(com => com.id == allCommons[rs.selection - 1].id);
                if (!newAllCommons) {
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
export function PlayerMarketWithdrawalGoodsSelectMenu(player, common) {
    const form = new ActionFormData();
    form.title(`Karcari`);
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.withdrawal.goods` });
    form.show(player).then(rs => {
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
                const newcommonsdata = GetAndParsePropertyData(`player_market_commons`) ?? [];
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                if (!newAllCommons.find(com => com.id == common.id)) {
                    player.sendMessage({ translate: `playermarket.error.already.buy` })
                    return;
                };
                StringifyAndSavePropertyData(`player_market_commons`, newAllCommons.filter(com => com.id != common.id));
                player.sendMessage({ translate: `finish.goods.withdrawal.message` })
                const item = new ItemStack(common.item.typeId, common.item.amount);
                item.nameTag = common.item?.name;
                item.setLore(common?.item?.lore);
                const container = player.getComponent(`inventory`).container;
                if (container.emptySlotsCount < 1) {
                    player.dimension.spawnItem(item, player.location);
                    break;
                };
                container.addItem(item);
                break;
            };
        };
    });
};

/**
 * 出品アイテムの選択
 * @param {Player} player 
 */
export function PlayerMarketExhibitMainMenu(player) {
    const data = GetAndParsePropertyData(`player_market_commons`) ?? [];
    /**
 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
 */
    const allCommons = data.filter(com => com.playerId == player.id);

    if (config.maxMarketAmount <= allCommons.filter(common => common.playerId == player.id).length) {
        player.sendMessage({ translate: `error.maxmarketamount`, with: [`${config.maxMarketAmount}`] });
        return;
    };
    let items = [];
    const container = player.getComponent(`inventory`).container;
    const form = new ActionFormData();
    form.button({ translate: `mc.button.back` });
    let itemStackArray = [];
    for (let i = 0; i < container.size; i++) {
        const item = container.getItem(i);
        if (!item) continue;
        if (item.getComponent(`enchantable`) || item.getComponent(`durability`) || item.typeId.includes(`shulker_box`) || item.typeId.includes(`potion`)) continue;
        itemStackArray.push(item);
        items.push({ slot: i, itemStack: item });
        let itemPath = itemIdToPath[item.typeId] ?? typeIdToID.get(item.typeId) ?? item.typeId
        const texture = typeof itemPath === "number" ? (itemPath * 65536) : itemPath;
        form.button({ rawtext: [{ translate: langChangeItemName(item.typeId) }, { text: `\n${item.typeId} x ${item.amount}` }] }, String(texture));
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            KarcariApp(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                KarcariApp(player);
                return;
            };
            default: {
                const playerData = GetAndParsePropertyData(`player_${player.id}`);
                if (playerData.money < config.playerMarketCommission) {
                    player.sendMessage({ translate: `error.notenough.money` });
                    return;
                };
                playerData.money = playerData.money - config.playerMarketCommission;
                StringifyAndSavePropertyData(`player_${player.id}`, playerData);
                const newContainer = player.getComponent(`inventory`).container;
                const item2 = newContainer.getItem(items[rs.selection - 1].slot);
                if (item2.typeId != itemStackArray[rs.selection - 1].typeId || item2.amount != itemStackArray[rs.selection - 1].amount) {
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
export function PlayerMarketExhibitSelectItemMenu(player, itemData, itemStack) {
    const form = new ModalFormData();
    form.title(`Karcari`);
    form.slider(``, 1, itemData.itemStack.amount, 1);
    form.textField({ translate: `input.price` }, { translate: `price.label` });
    form.toggle({ translate: `form.button.notify` });
    form.show(player).then(rs => {
        const newContainer = player.getComponent(`inventory`).container;
        const item = newContainer.getItem(itemData.slot);
        if (item.typeId != itemData.itemStack.typeId || item.amount != itemData.itemStack.amount) {
            PlayerMarketExhibitMainMenu(player);
            return;
        };
        const priceValue = Number(rs.formValues[1])
        if (!isDecimalNumber(priceValue) || rs.formValues[1] === ``) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        if (priceValue < 1) {
            player.sendMessage({ translate: `command.error.canuse.number.more`, with: [`1`] });
            return;
        };

        if (rs.formValues[2]) {
            world.sendMessage({ rawtext: [{ text: `§a[PlayerMarket]\n` }, { translate: `exhibited.message`, with: { rawtext: [{ translate: `${langChangeItemName(itemData.itemStack.typeId)}` }] } }] });
        };
        let id = world.getDynamicProperty(`playermarketId`) ?? "0";
        world.setDynamicProperty(`playermarketId`, `${Number(id) + 1}`);
        /**
         * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
         */
        const itemAmount = rs.formValues[0];
        const commonsdata = GetAndParsePropertyData(`player_market_commons`) ?? [];
        const allCommons = commonsdata;
        const data = {
            id: Number(id) + 1,
            playerName: player.name,
            playerId: player.id,
            price: priceValue,
            item: {
                name: itemData.itemStack?.nameTag,
                typeId: itemData.itemStack.typeId,
                lore: itemData.itemStack.getLore(),
                amount: itemAmount
            }
        };
        const editItem = itemData.itemStack;
        if (editItem.amount - itemAmount == 0) {
            newContainer.setItem(itemData.slot);
        } else {
            editItem.amount -= itemAmount;
            newContainer.setItem(itemData.slot, editItem);
        };
        allCommons.unshift(data);
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        player.sendMessage({ rawtext: [{ text: `§a[PlayerMarket]\n` }, { translate: `success.exhibited.message`, with: { rawtext: [{ translate: `${langChangeItemName(itemData.itemStack.typeId)}` }] } }] });
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        StringifyAndSavePropertyData(`player_market_commons`, allCommons);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 */
function PlayerMarketCommonsMenu(player, page = 0, keyword = ``, type = 0) {
    const form = new ChestFormData("large").setTitle(`Karcari`);
    const data = GetAndParsePropertyData(`player_market_commons`) ?? [];

    /**
     * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
     */
    const allCommons = data;
    if (allCommons.length < page * 36 + 1) {
        PlayerMarketCommonsMenu(player, page - 1);
        return;
    };
    if (keyword != ``) {
        switch (type) {
            //アイテムのIDで絞り込み
            case 0: {
                allCommons.filter(com => com.item.typeId.includes(keyword));
                break;
            };
            //アイテムの名前で絞り込み
            case 1: {
                allCommons.filter(com => com.item?.name?.includes(keyword));
                break;
            };
            //出品者の名前で絞り込み
            case 2: {
                allCommons.filter(com => com.playerName.includes(keyword));
                break;
            };
        };
    };
    const commonsAll = allCommons;
    const commons = allCommons.slice(0 + (45 * page), 45 + (45 * page));
    for (let i = 0; i < commons.length; i++) {
        const common = commons[i];
        common.item.lore = common.item.lore ?? [];
        form.setButton(i + 9, { name: common.item.name ? [{ text: `${common.item.name}§r(` }, { translate: `${langChangeItemName(common.item.typeId)}` }, { text: `§r)` }] : common.item.typeId, iconPath: itemIdToPath[common.item.typeId] ?? common.item.typeId, lore: [`${config.MoneyName}${common.price}`, `${common.playerName}`, ...common.item.lore], stackAmount: common.item.amount, editedName: common.item.name ? true : false })
    };
    form.setButton(0, { name: "§l§4Close", iconPath: "minecraft:barrier", lore: ["Push here"], editedName: true });
    if ((page + 1) * 45 < commonsAll.length) form.setButton(5, { name: ">>", iconPath: "textures/ui/arrow_right", lore: ["Next Page"], editedName: true });
    if (0 < page) form.setButton(3, { name: "<<", iconPath: "textures/ui/arrow_left", lore: ["Previous Page"], editedName: true });

    form.show(player).then(rs => {
        if (rs.canceled) {
            KarcariApp(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            case 5: {
                //進む
                PlayerMarketCommonsMenu(player, page + 1);
                break;
            };
            case 3: {
                //戻る
                PlayerMarketCommonsMenu(player, page - 1);
                break;
            };
            default: {
                //商品のチェック
                const newcommonsdata = GetAndParsePropertyData(`player_market_commons`) ?? [];
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                if (!newAllCommons.find(com => com.id == commons[rs.selection - 9].id)) {
                    PlayerMarketCommonsMenu(player, page);
                    break;
                };
                system.run(() => {
                    PlayerMarketSelectCommonForm(player, commons[rs.selection - 9]);
                    return;
                });
                break;
            };
        };
    });
};

/**
 * @param {Player} player 
 * @param {{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}} common
 */
export function PlayerMarketSelectCommonForm(player, common) {
    if (player.id == common.playerId) {
        player.sendMessage({ translate: `playermarket.error.sameplayer` });
        return;
    };
    const form = new ActionFormData();
    form.title(`Karcari`);
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.buy` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            //閉じる
            return;
        };
        switch (rs.selection) {
            case 0: {
                PlayerMarketCommonsMenu(player);
                break;
            };
            case 1: {
                //商品のチェック
                const newcommonsdata = GetAndParsePropertyData(`player_market_commons`) ?? [];
                /**
                 * @type {Array<{id: number,playerName: string,playerId: string,price: number, item: {name: undefined|string,typeId: string,amount: number}}>}
                 */
                const newAllCommons = newcommonsdata;
                if (!newAllCommons.find(com => com.id == common.id)) {
                    player.sendMessage({ translate: `playermarket.error.already.buy` })
                    return;
                };
                const playerData = GetAndParsePropertyData(`player_${player.id}`);
                if (playerData.money < common.price) {
                    player.sendMessage({ translate: `error.notenough.money` });
                    return;
                };
                const exhibitorData = GetAndParsePropertyData(`player_${common.playerId}`);
                let soldHistory = exhibitorData?.soldhistory ?? [];
                soldHistory.push({ price: common.price, user: player.name, item: common.item });
                exhibitorData.soldhistory = soldHistory;
                playerData.money -= common.price;
                StringifyAndSavePropertyData(`player_market_commons`, newAllCommons.filter(com => com.id != common.id));
                StringifyAndSavePropertyData(`player_${player.id}`, playerData);
                StringifyAndSavePropertyData(`player_${common.playerId}`, exhibitorData);
                player.sendMessage({ translate: `finish.bought` });
                const item = new ItemStack(common.item.typeId, common.item.amount);
                item.nameTag = common.item?.name;
                item.setLore(common.item?.lore);
                const container = player.getComponent(`inventory`).container;
                if (container.emptySlotsCount < 1) {
                    player.dimension.spawnItem(item, player.location);
                    break;
                };
                container.addItem(item);
                break;
            };
        };
    });
};