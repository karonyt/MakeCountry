import { ItemStack, Player, system } from "@minecraft/server";
import { ChestFormData } from "../chest-ui";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "../util";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ModalForm } from "../form_class";
const ModalFormData = ModalForm;
import config from "../../config";
import { itemIdToPath } from "../../texture_config";
import shop_config from "../../shop_config";
import { SmartPhoneHomeScreen } from "../smartphone";
import { PlayerManager } from "../../api/player/player";
import national_tier_level from "../../national_tier_level";

export function KarozonApp(player) {
    if (!config.shopValidity) {
        player.sendMessage({ translate: `no.available.shop` });
        return;
    };
    if (national_tier_level.enabled) {
        const playerManager = new PlayerManager(player.id);
        let lv = 0;
        if (playerManager.country) lv = playerManager.country.lv ?? 0;
        if (lv < national_tier_level.releaseAdminShop) {
            player.sendMessage({ translate: `no.release.shop`, with: [`${national_tier_level.releaseAdminShop}`] });
            return;
        };
    };
    ShopCommonsMenu(player);
};

function ShopCommonsMenu(player, page = 0) {
    const form = new ChestFormData("large").setTitle(`Admin Shop`);
    const allCommons = shop_config;
    if (allCommons.length < page * 36 + 1) {
        ShopCommonsMenu(player, page - 1);
        return;
    };
    const commonsAll = allCommons;
    const commons = allCommons.slice(0 + (45 * page), 45 + (45 * page));
    for (let i = 0; i < commons.length; i++) {
        const common = commons[i];
        form.setButton(i + 9, { name: common.name, iconPath: itemIdToPath[common.icon] ?? common.icon, lore: [`${common.lore}`], editedName: true });
    };
    form.setButton(0, { name: "§l§4Close", iconPath: "minecraft:barrier", lore: ["Push here"], editedName: true });
    if ((page + 1) * 45 < commonsAll.length) form.setButton(5, { name: ">>", iconPath: "textures/ui/arrow_right", lore: ["Next Page"], editedName: true });
    if (0 < page) form.setButton(3, { name: "<<", iconPath: "textures/ui/arrow_left", lore: ["Previous Page"], editedName: true });

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                ShopCommonsMenu(player);
                return;
            };
            SmartPhoneHomeScreen(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            case 5: {
                //進む
                ShopCommonsMenu(player, page + 1);
                break;
            };
            case 3: {
                //戻る
                ShopCommonsMenu(player, page - 1);
                break;
            };
            default: {
                system.run(() => {
                    ShopCommonsMenuCategory(player, commons[rs.selection - 9].items, 0, ``, 0);
                    return;
                });
                break;
            };
        };
    });
};

/**
 * 
 * @param {Player} player 
 */
function ShopCommonsMenuCategory(player, categoryCommons, page = 0, keyword = ``, type = 0) {
    const form = new ChestFormData("large").setTitle(`Admin Shop`);
    /**
     * @type {Array<{id: string,price: number}>}
     */
    const allCommons = categoryCommons;
    if (allCommons.length < page * 36 + 1) {
        ShopCommonsMenuCategory(player, categoryCommons, page - 1);
        return;
    };
    if (keyword != ``) {
        switch (type) {
            //アイテムのIDで絞り込み
            case 0: {
                allCommons.filter(com => com.item.typeId.includes(keyword));
                break;
            };
        };
    };
    const commonsAll = allCommons;
    const commons = allCommons.slice(0 + (45 * page), 45 + (45 * page));
    for (let i = 0; i < commons.length; i++) {
        const common = commons[i];
        form.setButton(i + 9, { name: common.id, iconPath: itemIdToPath[common.id] ?? common.id, lore: [`${config.MoneyName}${common.price}`] });
    };
    form.setButton(0, { name: "§l§4Close", iconPath: "minecraft:barrier", lore: ["Push here"], editedName: true });
    if ((page + 1) * 45 < commonsAll.length) form.setButton(5, { name: ">>", iconPath: "textures/ui/arrow_right", lore: ["Next Page"], editedName: true });
    if (0 < page) form.setButton(3, { name: "<<", iconPath: "textures/ui/arrow_left", lore: ["Previous Page"], editedName: true });

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                ShopCommonsMenuCategory(player, categoryCommons);
                return;
            };
            ShopCommonsMenu(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            case 5: {
                //進む
                ShopCommonsMenuCategory(player, categoryCommons, page + 1);
                break;
            };
            case 3: {
                //戻る
                ShopCommonsMenuCategory(player, categoryCommons, page - 1);
                break;
            };
            default: {
                system.run(() => {
                    ShopSelectCommonForm(player, commons[rs.selection - 9], categoryCommons, page);
                    return;
                });
                break;
            };
        };
    });
};

/**
 * 
 * @param {Player} player 
 * @param {{id: string,price: number}} common 
 */
function ShopSelectCommonForm(player, common, categoryCommons, page) {
    const form = new ModalFormData();
    form.title({ translate: `mc.button.buy` });
    form.toggle({ translate: `stack.buy` });
    form.slider({ translate: `buy.amount` }, 1, 64, 1);
    form.submitButton({ translate: `mc.button.buy` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            ShopCommonsMenuCategory(player, categoryCommons);
            return;
        };
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        let price = common.price * rs.formValues[1];
        if (rs.formValues[0]) {
            price = price * 64
        };
        if (playerData.money < price) {
            player.sendMessage({ translate: `error.notenough.money` });
            return;
        };
        const container = player.getComponent(`inventory`).container;
        if (container.emptySlotsCount <= Math.ceil((price / common.price) / 64)) {
            player.sendMessage({ translate: `no.available.slots` });
            return;
        };
        for (let i = (price / common.price); 0 < i; i -= 64) {
            if (i < 64) {
                container.addItem(new ItemStack(common.id, i));
                break;
            };
            container.addItem(new ItemStack(common.id, 64));
        };
        playerData.money -= price;
        player.sendMessage({ translate: `finish.bought` });
        ShopCommonsMenuCategory(player, categoryCommons, page);
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        return;
    });
};