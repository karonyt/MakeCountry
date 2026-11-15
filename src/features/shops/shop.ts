import { AdminShopActionFormData as ActionFormData, AdminShopModalForm as ModalForm } from "@/shared/ui/purpose-forms.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { ItemStack, Player, system } from "@minecraft/server";
import { GetAndParsePropertyData, langChangeItemName, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { FormCancelationReason } from "@minecraft/server-ui";
import { getInteractiveFormValues, usesClassicFormUI } from "@/shared/ui/form-class.js";

const ModalFormData = ModalForm;
import config from "@/config/server.js";
import { itemIdToPath } from "@/config/textures.js";
import shop_config from "@/config/shop.js";
import national_tier_level from "@/config/national-tier-level.js";
import { PlayerManager } from "@/domain/player/player-manager.js";
import { annotateNextMoneyWrite } from "@/shared/integration/standalone.js";

const SHOP_DETAIL_MARKER = "§s§h§o§p§d§e§t§a§i§l";
const ADMIN_SHOP_CHEST_MARKER = "§a§d§m§i§n§g§r§i§d";
const ADMIN_SHOP_PAGE_SIZE = 45;

const adminShopItemNames = new Map<string, string>();
const adminShopPreparedButtons = new Map<any, ReturnType<typeof ChestFormData.prepareButton>>();
const adminShopPreparedPages = new Map<any, { items: any[], buttons: ReturnType<typeof ChestFormData.prepareButton>[] }[]>();
const adminShopCategoryButtons = new Map<any, { normal: ReturnType<typeof ChestFormData.prepareButton>, selected: ReturnType<typeof ChestFormData.prepareButton> }>();
let adminShopCloseButton: ReturnType<typeof ChestFormData.prepareButton> | undefined;
let adminShopPresentationReady = false;

function prepareAdminShopPresentation() {
    if (adminShopPresentationReady) return;
    adminShopItemNames.clear();
    adminShopPreparedButtons.clear();
    adminShopPreparedPages.clear();
    adminShopCategoryButtons.clear();
    adminShopCloseButton = ChestFormData.prepareButton({
        name: `§4閉じる`,
        iconPath: itemIdToPath["minecraft:barrier"] ?? "minecraft:barrier",
        lore: [`画面を閉じます`],
        editedName: true,
    }, true);
    for (const category of shop_config) {
        for (const item of category.items ?? []) {
            if (!adminShopItemNames.has(item.id)) adminShopItemNames.set(item.id, langChangeItemName(item.id));
            adminShopPreparedButtons.set(item, ChestFormData.prepareButton({
                name: [{ translate: adminShopItemNames.get(item.id) ?? item.id }],
                iconPath: (itemIdToPath as Record<string, string>)[item.id] ?? item.id,
                stackAmount: 1,
                lore: [`§6価格: ${config.MoneyName}${item.price}`, `§7クリックして購入`],
                editedName: true,
            }, true));
        }
        adminShopCategoryButtons.set(category, {
            normal: ChestFormData.prepareButton({
                name: [translatedOrLiteral(category.name)],
                iconPath: (itemIdToPath as Record<string, string>)[category.icon] ?? category.icon,
                lore: [`§7クリックして切り替え`],
                editedName: true,
            }, true),
            selected: ChestFormData.prepareButton({
                name: [translatedOrLiteral(category.name)],
                iconPath: (itemIdToPath as Record<string, string>)[category.icon] ?? category.icon,
                lore: [`§a選択中`],
                editedName: true,
                isGlint: true,
            }, true),
        });
        const pages = [];
        for (let offset = 0; offset < category.items.length; offset += ADMIN_SHOP_PAGE_SIZE) {
            const items = category.items.slice(offset, offset + ADMIN_SHOP_PAGE_SIZE);
            pages.push({
                items,
                buttons: items.map((item: any) => adminShopPreparedButtons.get(item)!),
            });
        }
        adminShopPreparedPages.set(category, pages);
    }
    adminShopPresentationReady = true;
}

// ItemStack.localizationKey is reliable after the first server tick. Preparing
// here keeps the first player open fast without caching raw identifiers.
system.run(prepareAdminShopPresentation);

function getAdminShopContext(player: any) {
    const playerManager = new PlayerManager(player.id);
    let lv = 0;
    if (national_tier_level.enabled) {
        if (playerManager.country) lv = playerManager.country.lv ?? 0;
        if (lv < national_tier_level.releaseAdminShop) {
            player.sendMessage({ translate: `no.release.shop`, with: [`${national_tier_level.releaseAdminShop}`] });
            return undefined;
        }
    }
    return {
        categories: shop_config.filter(common => common.lv <= lv),
        money: playerManager.data?.money ?? 0,
    };
}

function translatedOrLiteral(value: string) {
    return value.includes(".") ? { translate: value } : { text: value };
}

export function ShopCommonsMenu(player: any, page = 0) {
    prepareAdminShopPresentation();
    const context = getAdminShopContext(player);
    if (!context || context.categories.length === 0) return;
    if (usesClassicFormUI(player)) {
        showClassicAdminShopCategories(player, context.categories, page);
        return;
    }
    showAdminShop(player, context.categories, 0, page, ``, 0, context.money);
};

/**
 * 
 * @param {Player} player 
 */
export function ShopCommonsMenuCategory(player: any, categoryCommons: any, page = 0, keyword = ``, type = 0) {
    prepareAdminShopPresentation();
    const context = getAdminShopContext(player);
    if (!context || context.categories.length === 0) return;
    if (usesClassicFormUI(player)) {
        showClassicAdminShopCategory(player, categoryCommons, page, keyword, type);
        return;
    }
    const categoryIndex = Math.max(0, context.categories.findIndex(category => category.items === categoryCommons));
    showAdminShop(player, context.categories, categoryIndex, page, keyword, type, context.money);
};

function showAdminShop(player: any, categories: any[], categoryIndex: number, page: number, keyword: string, type: number, money: number) {
    categoryIndex = Math.max(0, Math.min(Math.floor(categoryIndex), categories.length - 1));
    const category = categories[categoryIndex];
    let allCommons = Array.isArray(category?.items) ? category.items : [];
    if (keyword != `` && type === 0) {
        allCommons = allCommons.filter((com: any) => com.id.includes(keyword));
    }

    const cachedPages = keyword === `` && type === 0 ? adminShopPreparedPages.get(category) : undefined;
    const pageCount = Math.max(1, cachedPages?.length ?? Math.ceil(allCommons.length / ADMIN_SHOP_PAGE_SIZE));
    page = Math.max(0, Math.min(Math.floor(page), pageCount - 1));
    const cachedPage = cachedPages?.[page];
    const commons = cachedPage?.items ?? allCommons.slice(ADMIN_SHOP_PAGE_SIZE * page, ADMIN_SHOP_PAGE_SIZE * (page + 1));

    const form = new ChestFormData("large");
    form.enableLoreLineBreaks();
    form.trimTrailingEmptySlots();
    form.setTitle([
        { text: ADMIN_SHOP_CHEST_MARKER },
        { translate: `shop.title.admin` },
        { text: `  §8${page + 1}/${pageCount}  §6${config.MoneyName}${money}` },
    ]);

    if (adminShopCloseButton) form.setPreparedButton(0, adminShopCloseButton);
    for (let i = 0; i < 4; i++) {
        const entry = categories[i];
        if (!entry) continue;
        const prepared = adminShopCategoryButtons.get(entry);
        if (prepared) form.setPreparedButton(i + 1, i === categoryIndex ? prepared.selected : prepared.normal);
    }

    if (page > 0) form.setButton(7, { name: `§6前のページ`, iconPath: "textures/ui/arrow_left", lore: [`${page} / ${pageCount}`], editedName: true });
    const hasNext = page + 1 < pageCount;
    if (hasNext) form.setButton(8, { name: `§6次のページ`, iconPath: "textures/ui/arrow_right", lore: [`${page + 2} / ${pageCount}`], editedName: true });

    const pageButtons = cachedPage?.buttons ?? commons.map((common: any) => adminShopPreparedButtons.get(common)!).filter(Boolean);
    form.setPreparedButtons(9, pageButtons);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => showAdminShop(player, categories, categoryIndex, page, keyword, type, money), 10);
            }
            return;
        }
        const selection = rs.selection ?? -1;
        if (selection === 0) return;
        if (selection >= 1 && selection <= 4 && categories[selection - 1]) {
            return void showAdminShop(player, categories, selection - 1, 0, ``, 0, money);
        }
        if (selection === 7 && page > 0) return void showAdminShop(player, categories, categoryIndex, page - 1, keyword, type, money);
        if (selection === 8 && hasNext) return void showAdminShop(player, categories, categoryIndex, page + 1, keyword, type, money);
        if (selection >= 9 && selection < 9 + commons.length) {
            system.run(() => ShopSelectCommonForm(player, commons[selection - 9], category.items, page));
        }
    });
}

function showClassicAdminShopCategories(player: any, categories: any[], page: number) {
    const pageSize = 45;
    const pageCount = Math.max(1, Math.ceil(categories.length / pageSize));
    page = Math.max(0, Math.min(Math.floor(page), pageCount - 1));
    const entries = categories.slice(page * pageSize, (page + 1) * pageSize);
    const form = new ChestFormData("large");
    form.setTitle(`shop.title.admin`);
    entries.forEach((entry, index) => form.setButton(index + 9, {
        name: entry.name,
        iconPath: (itemIdToPath as Record<string, string>)[entry.icon] ?? entry.icon,
        lore: [`${entry.lore}`],
        editedName: true,
    }));
    form.setButton(0, { name: "shop.button.close", iconPath: itemIdToPath["minecraft:barrier"], lore: ["shop.button.close.lore"], editedName: true });
    if (page > 0) form.setButton(3, { name: "shop.button.previous", iconPath: "textures/ui/arrow_left", lore: ["shop.button.previous.lore"], editedName: true });
    if (page + 1 < pageCount) form.setButton(5, { name: "shop.button.next", iconPath: "textures/ui/arrow_right", lore: ["shop.button.next.lore"], editedName: true });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => showClassicAdminShopCategories(player, categories, page), 10);
            return;
        }
        if (rs.selection === 0) return;
        if (rs.selection === 3 && page > 0) return void showClassicAdminShopCategories(player, categories, page - 1);
        if (rs.selection === 5 && page + 1 < pageCount) return void showClassicAdminShopCategories(player, categories, page + 1);
        const category = entries[(rs.selection ?? -1) - 9];
        if (category) showClassicAdminShopCategory(player, category.items, 0, ``, 0);
    });
}

function showClassicAdminShopCategory(player: any, categoryCommons: any[], page: number, keyword: string, type: number) {
    let allCommons = Array.isArray(categoryCommons) ? categoryCommons : [];
    if (keyword && type === 0) allCommons = allCommons.filter((entry: any) => entry.id.includes(keyword));
    const pageSize = 45;
    const pageCount = Math.max(1, Math.ceil(allCommons.length / pageSize));
    page = Math.max(0, Math.min(Math.floor(page), pageCount - 1));
    const entries = allCommons.slice(page * pageSize, (page + 1) * pageSize);
    const form = new ChestFormData("large");
    form.setTitle(`shop.title.admin`);
    entries.forEach((entry, index) => form.setButton(index + 9, {
        name: entry.id,
        iconPath: (itemIdToPath as Record<string, string>)[entry.id] ?? entry.id,
        lore: [`${config.MoneyName}${entry.price}`],
    }));
    form.setButton(0, { name: "shop.button.close", iconPath: itemIdToPath["minecraft:barrier"], lore: ["shop.button.close.lore"], editedName: true });
    if (page > 0) form.setButton(3, { name: "shop.button.previous", iconPath: "textures/ui/arrow_left", lore: ["shop.button.previous.lore"], editedName: true });
    if (page + 1 < pageCount) form.setButton(5, { name: "shop.button.next", iconPath: "textures/ui/arrow_right", lore: ["shop.button.next.lore"], editedName: true });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => showClassicAdminShopCategory(player, categoryCommons, page, keyword, type), 10);
            else ShopCommonsMenu(player);
            return;
        }
        if (rs.selection === 0) return;
        if (rs.selection === 3 && page > 0) return void showClassicAdminShopCategory(player, categoryCommons, page - 1, keyword, type);
        if (rs.selection === 5 && page + 1 < pageCount) return void showClassicAdminShopCategory(player, categoryCommons, page + 1, keyword, type);
        const entry = entries[(rs.selection ?? -1) - 9];
        if (entry) system.run(() => ShopSelectCommonForm(player, entry, categoryCommons, page));
    });
}

/**
 * 
 * @param {Player} player 
 * @param {{id: string,price: number}} common 
 */
export function ShopSelectCommonForm(player: any, common: any, categoryCommons: any, page: any) {
    const classic = usesClassicFormUI(player);
    const form = new ModalFormData();
    form.title({ translate: `mc.button.buy` });
    if (!classic) {
        form.header({ translate: adminShopItemNames.get(common.id) ?? common.id });
        form.label(`§6単価  ${config.MoneyName}${common.price} / 1個`);
    }
    form.toggle({ translate: `stack.buy` });
    form.slider({ translate: `buy.amount` }, 1, 64, 1, 1);
    form.submitButton({ translate: `mc.button.buy` });
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            ShopCommonsMenuCategory(player, categoryCommons, page);
            return;
        };
        const values = getInteractiveFormValues(rs);
        const stackBuy = values.find((value: any) => typeof value === "boolean") === true;
        const sliderValue = values.find((value: any) => typeof value === "number");
        const amountChoice = Math.floor(Number(sliderValue));
        if (!Number.isFinite(amountChoice) || amountChoice < 1 || amountChoice > 64) {
            player.sendMessage(`§c購入数を取得できませんでした。もう一度お試しください。`);
            ShopCommonsMenuCategory(player, categoryCommons, page);
            return;
        }
        const quantity = amountChoice * (stackBuy ? 64 : 1);
        const price = common.price * quantity;
        if (classic) {
            completeAdminShopPurchase(player, common, quantity, price, categoryCommons, page);
            return;
        }
        const showConfirmation = () => {
            const playerData = GetAndParsePropertyData(`player_${player.id}`);
            const confirm = new ActionFormData()
                .title({ rawtext: [{ text: SHOP_DETAIL_MARKER }, { translate: `mc.button.buy` }] })
                .body({
                    rawtext: [
                        { translate: new ItemStack(common.id).localizationKey },
                        { text: `\n\n§6単価  ${config.MoneyName}${common.price}\n§0個数  ${quantity}\n§6合計  ${config.MoneyName}${price}\n§0所持金  ${config.MoneyName}${playerData?.money ?? 0}` },
                    ],
                })
                .button(`§7戻る`)
                .button(`§a購入する`)
                .button({ translate: new ItemStack(common.id).localizationKey }, (itemIdToPath as Record<string, string>)[common.id] ?? common.id);
            confirm.show(player).then((confirmation: any) => {
                if (confirmation.canceled || confirmation.selection === 0) {
                    ShopCommonsMenuCategory(player, categoryCommons, page);
                    return;
                }
                if (confirmation.selection === 2) {
                    showConfirmation();
                    return;
                }
                if (confirmation.selection === 1) completeAdminShopPurchase(player, common, quantity, price, categoryCommons, page);
            });
        };
        showConfirmation();
    });
};

function completeAdminShopPurchase(
    player: any,
    common: any,
    quantity: number,
    price: number,
    categoryCommons: any,
    page: any,
) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData || playerData.money < price) {
        player.sendMessage({ translate: `error.notenough.money` });
        return;
    };
    const container = player.getComponent(`inventory`)?.container;
    if (!container) return;
    const probe = new ItemStack(common.id, 1);
    let capacity = 0;
    for (let slotIndex = 0; slotIndex < container.size; slotIndex++) {
        const slot = container.getItem(slotIndex);
        if (!slot) capacity += probe.maxAmount;
        else if (slot.isStackableWith(probe)) capacity += Math.max(0, slot.maxAmount - slot.amount);
    }
    if (capacity < quantity) {
        player.sendMessage({ translate: `no.available.slots` });
        return;
    };

    // Slot capacity alone cannot predict container weight/rule limits. addItem may
    // insert only part of a stack, or fail after earlier stacks were inserted.
    const before = Array.from({ length: container.size }, (_, slot) => container.getItem(slot));
    try {
        let remaining = quantity;
        while (remaining > 0) {
            const amount = Math.min(probe.maxAmount, remaining);
            if (container.addItem(new ItemStack(common.id, amount))) throw Error('partial_inventory_delivery');
            remaining -= amount;
        }
    } catch {
        // Clear inserted items first so rules/weight cannot obstruct restoration.
        container.clearAll();
        before.forEach((item, slot) => { if (item) container.setItem(slot, item); });
        player.sendMessage({ translate: `no.available.slots` });
        return;
    }
    playerData.money -= price;
    annotateNextMoneyWrite(playerData.name ?? player.name, `adminshop:${common.id}:${quantity}`);
    StringifyAndSavePropertyData(`player_${player.id}`, playerData);
    console.log(
        `[admin-shop] player=${player.name} item=${common.id} quantity=${quantity} ` +
            `total=${price} balance=${playerData.money}`,
    );
    player.sendMessage({ translate: `finish.bought` });
    ShopCommonsMenuCategory(player, categoryCommons, page);
}
