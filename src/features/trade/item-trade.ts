import { normalizeTradePresentation } from '../../../localization/item-presentation.js';
import { CommerceActionForm as ActionForm, CommerceModalForm as ModalForm } from "@/shared/ui/purpose-forms.js";
import { EnchantmentTypes, ItemComponentTypes, ItemLockMode, ItemStack, Player, Potions, system, world
} from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
import * as DyProp from "@/shared/storage/chunked-dynamic-properties.js";
import { itemIdToPath } from "@/config/textures.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";
import { readItemStackPotionData } from "@/shared/minecraft/item-presentation.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";


const ActionFormData = ActionForm;
const ModalFormData = ModalForm;

const TRADE_LIST_KEY = "item_trade_listings";
const TRADE_ID_KEY = "item_trade_next_id";
const PAGE_SIZE = 45;
const MAX_LISTINGS_PER_PLAYER = 20;
const tradeLocks = new Set<number>();

// バックパックと同様、内部データを完全復元できないアイテムだけを除外する。
const unsupportedTradeItems = new Set([
    "minecraft:banner",
    "minecraft:decorated_pot",
    "minecraft:suspicious_stew",
    "minecraft:writable_book",
    "minecraft:written_book",
    "minecraft:goat_horn",
    "minecraft:map",
    "minecraft:empty_map",
    "minecraft:filled_map",
    "minecraft:bee_nest"
]);

type TradeItem = {
    typeId: string;
    amount: number;
    name?: string;
    lore: any[];
    enchantments?: { typeId: string; level: number }[];
    durability?: { damage?: number; unbreakable?: boolean };
    dyeColor?: { red: number; green: number; blue: number };
    dynamicProperties?: { id: string; data: any }[];
    potion?: { id?: string; deliveryType?: string; durationTicks?: number; amplifier?: number };
    canDestroy?: string[];
    canPlaceOn?: string[];
    keepOnDeath?: boolean;
    lockMode?: ItemLockMode;
};

type TradeListing = {
    id: number;
    ownerId: string;
    ownerName: string;
    offered: TradeItem;
    requested: TradeItem;
    createdAt: number;
};

type TradeReceipt = {
    listingId: number;
    buyerName: string;
    item: TradeItem;
    completedAt: number;
};

type InventoryChoice = {
    slot: number;
    item: ItemStack;
};

world.afterEvents.worldLoad.subscribe(() => {
    if (DyProp.getDynamicProperty(TRADE_LIST_KEY) === undefined) {
        DyProp.setDynamicProperty(TRADE_LIST_KEY, "[]");
    }
});

function reportUnreadableTradeData(player: Player, key: string) {
    console.warn(`[ItemTrade] unreadable data: ${key}`);
    try { if (player.isValid) player.sendMessage('§cトレードの保存データを確認できません。上書きせずに処理を中止しました。運営へ連絡してください。'); } catch { }
}

function readJson<T>(key: string, fallback: T, player: Player): T | undefined {
    if (!player.isValid) return undefined;
    try {
        const raw = DyProp.getDynamicProperty(key);
        if (raw === undefined) return fallback;
        const value = JSON.parse(raw);
        if (!Array.isArray(value)) throw Error('invalid_trade_array');
        return value as T;
    } catch {
        reportUnreadableTradeData(player, key);
        return undefined;
    }
}

function writeJson(key: string, value: unknown) {
    DyProp.setDynamicProperty(key, JSON.stringify(value));
}

function validTradeItem(value: unknown): value is TradeItem {
    if (!value || typeof value !== 'object') return false;
    const item = value as TradeItem;
    return typeof item.typeId === 'string' && item.typeId.length > 0
        && Number.isSafeInteger(item.amount) && item.amount > 0
        && (item.lore === undefined || Array.isArray(item.lore));
}

function readListings(player: Player): TradeListing[] | undefined {
    const rows = readJson<TradeListing[]>(TRADE_LIST_KEY, [], player);
    if (!rows) return undefined;
    const ids = new Set<number>();
    for (const row of rows) {
        if (!row || !Number.isSafeInteger(row.id) || row.id < 1 || ids.has(row.id)
            || typeof row.ownerId !== 'string' || !row.ownerId
            || !validTradeItem(row.offered) || !validTradeItem(row.requested)) {
            reportUnreadableTradeData(player, TRADE_LIST_KEY);
            return undefined;
        }
        ids.add(row.id);
    }
    return rows;
}

function readReceipts(player: Player, ownerId = player.id): TradeReceipt[] | undefined {
    const key = receiptKey(ownerId);
    const rows = readJson<TradeReceipt[]>(key, [], player);
    if (!rows) return undefined;
    const ids = new Set<number>();
    for (const row of rows) {
        if (!row || !Number.isSafeInteger(row.listingId) || row.listingId < 1 || ids.has(row.listingId) || !validTradeItem(row.item)) {
            reportUnreadableTradeData(player, key);
            return undefined;
        }
        ids.add(row.listingId);
    }
    return rows;
}

function receiptKey(playerId: string) {
    return `item_trade_receipts_${playerId}`;
}

function getContainer(player: Player): any {
    return player.getComponent("inventory")?.container;
}

function displayName(item: TradeItem) {
    return item.name || langChangeItemName(item.typeId);
}

function iconPath(item: TradeItem) {
    return (itemIdToPath as Record<string, string>)[item.typeId] ?? item.typeId;
}

function snapshotItem(item: ItemStack, amount: number): TradeItem {
    const enchantments = item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().map(enchantment => ({
        typeId: enchantment.type.id,
        level: enchantment.level
    })) ?? [];
    const durabilityComponent = item.getComponent(ItemComponentTypes.Durability);
    const dyeColor = item.getComponent(ItemComponentTypes.Dyeable)?.color;
    const potion = readItemStackPotionData(item);
    return {
        typeId: item.typeId,
        amount,
        name: item.nameTag || undefined,
        lore: item.getRawLore?.() ?? item.getLore(),
        enchantments,
        durability: durabilityComponent ? {
            damage: durabilityComponent.damage,
            unbreakable: durabilityComponent.unbreakable
        } : undefined,
        dyeColor: dyeColor ? { ...dyeColor } : undefined,
        dynamicProperties: item.getDynamicPropertyIds().sort().map(id => ({ id, data: item.getDynamicProperty(id) })),
        potion,
        canDestroy: item.getCanDestroy(),
        canPlaceOn: item.getCanPlaceOn(),
        keepOnDeath: item.keepOnDeath,
        lockMode: item.lockMode
    };
}

function createItem(data: TradeItem) {
    let item = new ItemStack(data.typeId, data.amount);
    if (data.potion) {
        if (!data.potion.id || !data.potion.deliveryType) throw Error('invalid_trade_potion');
        item = Potions.resolve(data.potion.id, data.potion.deliveryType);
        if (item.typeId !== data.typeId) throw Error('trade_potion_type_mismatch');
        item.amount = data.amount;
    }
    if (data.name) item.nameTag = data.name;
    if (data.lore?.length > 0) item.setLore(data.lore);

    const durability = item.getComponent(ItemComponentTypes.Durability);
    if (data.durability && !durability) throw Error('missing_trade_durability');
    if (durability && typeof data.durability?.damage === "number") {
        const damage = data.durability.damage;
        if (!Number.isInteger(damage) || damage < 0 || damage > durability.maxDurability) throw Error('invalid_trade_damage');
        durability.damage = damage;
    }
    if (durability && typeof data.durability?.unbreakable === "boolean") {
        durability.unbreakable = data.durability.unbreakable;
    }
    const dyeable = item.getComponent(ItemComponentTypes.Dyeable);
    if (data.dyeColor && !dyeable) throw Error("missing_trade_dyeable");
    if (dyeable && data.dyeColor) dyeable.color = data.dyeColor;

    const enchantable = item.getComponent(ItemComponentTypes.Enchantable);
    if (data.enchantments?.length && !enchantable) throw Error('missing_trade_enchantable');
    for (const enchantment of data.enchantments ?? []) {
        const type = EnchantmentTypes.get(enchantment.typeId);
        if (!type) throw Error('unknown_trade_enchantment');
        enchantable!.addEnchantment({ type, level: enchantment.level });
    }

    for (const property of data.dynamicProperties ?? []) {
        if (!property?.id) throw Error('invalid_trade_dynamic_property');
        item.setDynamicProperty(property.id, property.data);
    }
    if (data.canDestroy?.length) item.setCanDestroy(data.canDestroy);
    if (data.canPlaceOn?.length) item.setCanPlaceOn(data.canPlaceOn);
    if (typeof data.keepOnDeath === "boolean") item.keepOnDeath = data.keepOnDeath;
    item.lockMode = data.lockMode ?? ItemLockMode.none;
    return item;
}

function isSupportedTradeItem(item: ItemStack) {
    // シュルカー等の内部インベントリは Script API から完全復元できないため対象外。
    const hasInventory = Boolean(item.getComponent(ItemComponentTypes.Inventory));
    return !hasInventory
        && !unsupportedTradeItems.has(item.typeId)
        && !item.typeId.includes("shulker_box")
        && !item.typeId.includes("bundle")
        && !isVirtualStorageItem(item);
}

function isVirtualStorageItem(item: ItemStack) {
    try {
        return item.getDynamicProperty("karo:virtual_storage_item") !== undefined;
    } catch {
        return false;
    }
}

function sameItem(item: ItemStack, expected: TradeItem) {
    return tradeItemKey(snapshotItem(item, 1)) === tradeItemKey(expected);
}

function tradeItemKey(item: TradeItem) {
    const presentation = normalizeTradePresentation(item);
    return stableStringify({
        typeId: item.typeId,
        name: presentation.name,
        lore: presentation.lore.map(normalizeLoreLine),
        enchantments: [...(item.enchantments ?? [])]
            .map(enchantment => ({ typeId: enchantment.typeId, level: enchantment.level }))
            .sort((a, b) => `${a.typeId}:${a.level}`.localeCompare(`${b.typeId}:${b.level}`)),
        durability: item.durability,
        dyeColor: item.dyeColor,
        dynamicProperties: [...(item.dynamicProperties ?? [])]
            .filter(property => property?.id)
            .sort((a, b) => a.id.localeCompare(b.id)),
        potion: item.potion,
        canDestroy: [...(item.canDestroy ?? [])].sort(),
        canPlaceOn: [...(item.canPlaceOn ?? [])].sort(),
        keepOnDeath: item.keepOnDeath === true,
        lockMode: item.lockMode ?? ItemLockMode.none
    });
}

function normalizeLoreLine(line: any) {
    if (line && typeof line === "object" && Object.keys(line).length === 1 && typeof line.text === "string") return line.text;
    return line;
}

function stableStringify(value: any): string {
    if (value === undefined) return "undefined";
    if (value === null || typeof value !== "object") return JSON.stringify(value);
    if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
    const keys = Object.keys(value).filter(key => value[key] !== undefined).sort();
    return `{${keys.map(key => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
}

function formLoreLine(line: any) {
    return typeof line === "string" ? { text: line } : line;
}

function listingLore(listing: TradeListing) {
    return [
        { text: `§e求: ${displayName(listing.requested)} ×${listing.requested.amount}` },
        ...(listing.requested.lore ?? []).flatMap(line => [{ text: "\n§r§8  " }, formLoreLine(line)]),
        { text: `\n§7出: ${displayName(listing.offered)} ×${listing.offered.amount}` },
        ...(listing.offered.lore ?? []).flatMap(line => [{ text: "\n§r§8  " }, formLoreLine(line)]),
        { text: `\n§8出品者: ${listing.ownerName}` }
    ];
}

function countItem(container: any, expected: TradeItem) {
    let total = 0;
    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (item && sameItem(item, expected)) total += item.amount;
    }
    return total;
}

function removeItem(container: any, expected: TradeItem, amount: number) {
    if (countItem(container, expected) < amount) return false;
    let remaining = amount;
    for (let slot = 0; slot < container.size && remaining > 0; slot++) {
        const item = container.getItem(slot);
        if (!item || !sameItem(item, expected)) continue;
        const take = Math.min(item.amount, remaining);
        remaining -= take;
        if (take === item.amount) container.setItem(slot);
        else {
            item.amount -= take;
            container.setItem(slot, item);
        }
    }
    return remaining === 0;
}

/** Prepare all metadata before removing payment or clearing an escrow record. */
function deliverAndCommit(player: Player, data: TradeItem, commit: () => void, payment?: TradeItem): boolean {
    const container = getContainer(player);
    if (!container) return false;
    let before: (ItemStack | undefined)[] | undefined;
    let mutated = false;
    try {
        const prototype = createItem({ ...data, amount: 1 });
        if (!validTradeItem(data) || data.amount > container.size * prototype.maxAmount) throw Error('trade_delivery_capacity');
        const stacks: ItemStack[] = [];
        for (let remaining = data.amount; remaining > 0;) {
            const amount = Math.min(remaining, prototype.maxAmount);
            const stack = prototype.clone();
            stack.amount = amount;
            stacks.push(stack);
            remaining -= amount;
        }
        before = Array.from({ length: container.size }, (_, slot) => container.getItem(slot));
        mutated = true;
        if (payment && !removeItem(container, payment, payment.amount)) throw Error('trade_payment_changed');
        for (const stack of stacks) {
            if (container.addItem(stack)) throw Error('trade_delivery_refused');
        }
        commit();
        return true;
    } catch (error) {
        if (mutated && before) {
            try {
                container.clearAll();
                before.forEach((item, slot) => { if (item) container.setItem(slot, item); });
            } catch (restoreError) { console.error('[ItemTrade] Failed to restore inventory', restoreError); }
        }
        console.warn('[ItemTrade] Delivery aborted', error);
        try { if (player.isValid) player.sendMessage('§cアイテムの復元・受取・保存を完了できませんでした。空きを確認し、続く場合は運営へ連絡してください。'); } catch { }
        return false;
    }
}

function removeFromSlot(container: any, choice: InventoryChoice, amount: number) {
    const current = container.getItem(choice.slot);
    if (!current || !sameItem(current, snapshotItem(choice.item, choice.item.amount)) || current.amount < amount) return false;
    if (current.amount === amount) container.setItem(choice.slot);
    else {
        current.amount -= amount;
        container.setItem(choice.slot, current);
    }
    return true;
}

function menuButton(form: ChestFormData, slot: number, name: string, icon: string, lore: string[] = []) {
    form.setButton(slot, { name, iconPath: icon, lore, editedName: true, stackAmount: 1 });
}

function createChestForm(size: "small" | "large", title: string) {
    const form = new ChestFormData(size);
    form.setTitle([{ text: title }]);
    return form;
}

function showAgainWhenBusy(player: Player, callback: () => void, reason: FormCancelationReason | undefined) {
    if (reason === FormCancelationReason.UserBusy) system.runTimeout(callback, 10);
}

export function showTradeMainMenu(player: Player) {
    if (!player.isValid) return;
    const listings = readListings(player);
    if (!listings) return;
    const mine = listings.filter(listing => listing.ownerId === player.id).length;
    const receipts = readReceipts(player);
    if (!receipts) return;
    const form = createChestForm("small", "§rアイテムトレード");

    menuButton(form, 10, "§aトレード一覧", "minecraft:emerald", ["求・出の条件から交換します"]);
    menuButton(form, 12, "§e出品する", "minecraft:chest", [`出品中: ${mine}/${MAX_LISTINGS_PER_PLAYER}`]);
    menuButton(form, 14, "§b自分の出品", "minecraft:paper", ["出品の確認・取り消し"]);
    menuButton(form, 16, "§6受取箱", "minecraft:hopper", [`未受取: ${receipts.length}件`]);
    menuButton(form, 22, "§c閉じる", "minecraft:barrier");

    form.show(player).then((result: any) => {
            if (!player.isValid) return;
        if (result.canceled) {
            showAgainWhenBusy(player, () => showTradeMainMenu(player), result.cancelationReason);
            return;
        }
        if (result.selection === 10) showTradeListings(player);
        else if (result.selection === 12) beginTradeCreation(player);
        else if (result.selection === 14) showMyListings(player);
        else if (result.selection === 16) showReceipts(player);
    });
}

export function showTradeListings(player: Player, page = 0) {
    if (!player.isValid) return;
    const current = readListings(player);
    if (!current) return;
    const allListings = current.filter(listing => listing.ownerId !== player.id);
    const maxPage = Math.max(0, Math.ceil(allListings.length / PAGE_SIZE) - 1);
    page = Math.max(0, Math.min(Math.floor(page), maxPage));
    const listings = allListings.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
    const form = createChestForm("large", `§rトレード一覧 ${page + 1}/${maxPage + 1}`);

    menuButton(form, 0, "§c戻る", "minecraft:barrier");
    if (page > 0) menuButton(form, 3, "§e前のページ", "textures/ui/arrow_left");
    if (page < maxPage) menuButton(form, 5, "§e次のページ", "textures/ui/arrow_right");
    for (let index = 0; index < listings.length; index++) {
        const listing = listings[index];
        form.setButton(index + 9, {
            name: `§a出: ${displayName(listing.offered)}`,
            iconPath: iconPath(listing.offered),
            stackAmount: listing.offered.amount,
            lore: listingLore(listing),
            editedName: true,
            isGlint: (listing.offered.enchantments?.length ?? 0) > 0
        });
    }

    form.show(player).then((result: any) => {
            if (!player.isValid) return;
        if (result.canceled) {
            showAgainWhenBusy(player, () => showTradeListings(player, page), result.cancelationReason);
            return;
        }
        if (result.selection === 0) return showTradeMainMenu(player);
        if (result.selection === 3 && page > 0) return showTradeListings(player, page - 1);
        if (result.selection === 5 && page < maxPage) return showTradeListings(player, page + 1);
        const listing = listings[(result.selection ?? -1) - 9];
        if (listing) confirmTrade(player, listing.id, page);
        else showTradeListings(player, page);
    });
}

function confirmTrade(player: Player, listingId: number, returnPage: number) {
    if (!player.isValid) return;
    const current = readListings(player);
    if (!current) return;
    const listing = current.find(entry => entry.id === listingId);
    if (!listing) {
        player.sendMessage("§cこの出品はすでに終了しています。");
        return showTradeListings(player, returnPage);
    }
    const form = new ActionFormData()
        .title("アイテムトレード")
        .body(`§e求: §f${displayName(listing.requested)} ×${listing.requested.amount}\n§a出: §f${displayName(listing.offered)} ×${listing.offered.amount}\n§7出品者: ${listing.ownerName}`)
        .button("§a交換を確定")
        .button("§7戻る");

    form.show(player).then((result: any) => {
            if (!player.isValid) return;
        if (result.canceled || result.selection === 1) return showTradeListings(player, returnPage);
        if (result.selection === 0) executeTrade(player, listingId, returnPage);
    });
}

function executeTrade(player: Player, listingId: number, returnPage: number) {
    if (!player.isValid) return;
    if (tradeLocks.has(listingId)) {
        player.sendMessage("§cほかのプレイヤーがこの取引を処理中です。");
        return showTradeListings(player, returnPage);
    }
    tradeLocks.add(listingId);
    try {
        const listings = readListings(player);
        if (!listings) return;
        const listing = listings.find(entry => entry.id === listingId);
        if (!listing) {
            player.sendMessage("§cこの出品はすでに終了しています。");
            return showTradeListings(player, returnPage);
        }
        if (listing.ownerId === player.id) {
            player.sendMessage("§c自分の出品とは交換できません。");
            return showTradeListings(player, returnPage);
        }
        const receipts = readReceipts(player, listing.ownerId);
        if (!receipts) return;
        const container = getContainer(player);
        if (!container || countItem(container, listing.requested) < listing.requested.amount) {
            player.sendMessage(`§c「求」のアイテムが不足しています: ${displayName(listing.requested)} ×${listing.requested.amount}`);
            return showTradeListings(player, returnPage);
        }
        const updatedReceipts = [...receipts, { listingId, buyerName: player.name, item: listing.requested, completedAt: Date.now() }];
        if (!deliverAndCommit(player, listing.offered, () => {
            try {
                writeJson(receiptKey(listing.ownerId), updatedReceipts);
                writeJson(TRADE_LIST_KEY, listings.filter(entry => entry.id !== listingId));
            } catch (error) {
                try { writeJson(receiptKey(listing.ownerId), receipts); } catch (restoreError) { console.error('[ItemTrade] Failed to restore receipts', restoreError); }
                try { writeJson(TRADE_LIST_KEY, listings); } catch (restoreError) { console.error('[ItemTrade] Failed to restore listings', restoreError); }
                throw error;
            }
        }, listing.requested)) return;
        player.sendMessage(`§a交換が成立しました。§7 出: ${displayName(listing.offered)} ×${listing.offered.amount}`);
    } finally {
        tradeLocks.delete(listingId);
    }
}

function beginTradeCreation(player: Player) {
    if (!player.isValid) return;
    const current = readListings(player);
    if (!current) return;
    const mine = current.filter(listing => listing.ownerId === player.id).length;
    if (mine >= MAX_LISTINGS_PER_PLAYER) {
        player.sendMessage(`§c出品上限（${MAX_LISTINGS_PER_PLAYER}件）に達しています。`);
        return showTradeMainMenu(player);
    }
    chooseInventoryItem(player, "§a「出」にするアイテム", choice => chooseAmount(player, "出", choice.item.amount, offeredAmount => {
        chooseInventoryItem(player, "§e「求」にするアイテム", requestedChoice => chooseAmount(player, "求", requestedChoice.item.maxAmount, requestedAmount => {
            confirmCreation(player, choice, offeredAmount, requestedChoice.item, requestedAmount);
        }), () => beginTradeCreation(player));
    }), () => showTradeMainMenu(player));
}

function chooseInventoryItem(player: Player, title: string, onSelect: (choice: InventoryChoice) => void, onBack: () => void) {
    if (!player.isValid) return;
    const container = getContainer(player);
    if (!container) return;
    const choices: InventoryChoice[] = [];
    const form = createChestForm("large", title);
    menuButton(form, 0, "§c戻る", "minecraft:barrier");
    for (let slot = 0; slot < container.size && choices.length < PAGE_SIZE; slot++) {
        const item = container.getItem(slot);
        if (!item || !isSupportedTradeItem(item)) continue;
        choices.push({ slot, item: item.clone() });
        form.setButton(choices.length + 8, {
            name: item.nameTag || langChangeItemName(item.typeId),
            iconPath: (itemIdToPath as Record<string, string>)[item.typeId] ?? item.typeId,
            stackAmount: item.amount,
            lore: [`§7${item.typeId}`, ...item.getLore()],
            editedName: Boolean(item.nameTag),
            isGlint: (item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().length ?? 0) > 0
        });
    }
    form.show(player).then((result: any) => {
            if (!player.isValid) return;
        if (result.canceled || result.selection === 0) return onBack();
        const choice = choices[(result.selection ?? -1) - 9];
        if (choice) onSelect(choice);
        else chooseInventoryItem(player, title, onSelect, onBack);
    });
}

function chooseAmount(player: Player, label: string, maximum: number, onSubmit: (amount: number) => void) {
    if (!player.isValid) return;
    const form = new ModalFormData();
    form.title(`「${label}」の個数`);
    form.slider(`${label}の個数`, 1, Math.max(1, maximum), 1, 1);
    form.show(player).then((result: any) => {
            if (!player.isValid) return;
        if (result.canceled) return showTradeMainMenu(player);
        const amount = Number(result.formValues?.[0]);
        if (!Number.isInteger(amount) || amount < 1 || maximum < amount) {
            player.sendMessage("§c個数が正しくありません。");
            return showTradeMainMenu(player);
        }
        onSubmit(amount);
    });
}

function confirmCreation(player: Player, offeredChoice: InventoryChoice, offeredAmount: number, requestedItem: ItemStack, requestedAmount: number) {
    if (!player.isValid) return;
    const offered = snapshotItem(offeredChoice.item, offeredAmount);
    const requested = snapshotItem(requestedItem, requestedAmount);
    const form = new ActionFormData()
        .title("トレード出品確認")
        .body(`§e求: §f${displayName(requested)} ×${requested.amount}\n§a出: §f${displayName(offered)} ×${offered.amount}\n\n§7「出」のアイテムは成立・取消まで預けられます。`)
        .button("§aこの内容で出品")
        .button("§7キャンセル");

    form.show(player).then((result: any) => {
            if (!player.isValid) return;
        if (result.canceled || result.selection !== 0) return showTradeMainMenu(player);
        createListing(player, offeredChoice, offered, requested);
    });
}

function createListing(player: Player, choice: InventoryChoice, offered: TradeItem, requested: TradeItem) {
    if (!player.isValid) return;
    const listings = readListings(player);
    if (!listings) return;
    if (listings.filter(listing => listing.ownerId === player.id).length >= MAX_LISTINGS_PER_PLAYER) {
        player.sendMessage("§c出品上限に達しています。");
        return showTradeMainMenu(player);
    }
    const container = getContainer(player);
    if (!container) return;
    let id: number;
    try {
        const previous = Number(world.getDynamicProperty(TRADE_ID_KEY) ?? 0);
        id = previous + 1;
        if (!Number.isSafeInteger(previous) || previous < 0 || !Number.isSafeInteger(id)) throw Error('invalid_trade_id');
        for (const listing of listings) {
            if (!Number.isSafeInteger(listing.id) || listing.id < 0) throw Error('invalid_existing_trade_id');
            id = Math.max(id, listing.id + 1);
        }
        if (!Number.isSafeInteger(id)) throw Error('exhausted_trade_id');
        // Reserve the ID before removing anything. A failed counter write must
        // not leave an item removed without a listing or refund path.
        world.setDynamicProperty(TRADE_ID_KEY, id);
    } catch (error) {
        console.warn('[ItemTrade] Failed to reserve listing id', error);
        player.sendMessage('§c出品番号を保存できないため、出品を中止しました。');
        return;
    }
    const originalItem = container.getItem(choice.slot);
    if (!removeFromSlot(container, choice, offered.amount)) {
        player.sendMessage("§c所持品が変更されたため、出品を中止しました。");
        return showTradeMainMenu(player);
    }

    listings.unshift({ id, ownerId: player.id, ownerName: player.name, offered, requested, createdAt: Date.now() });
    try {
        writeJson(TRADE_LIST_KEY, listings);
    } catch (error) {
        container.setItem(choice.slot, originalItem);
        console.error("[ItemTrade] Failed to save listing", error);
        player.sendMessage("§c出品の保存に失敗したため、アイテムを返却しました。");
        return;
    }
    try {
        player.sendMessage(`§aトレードを出品しました。§e 求: ${displayName(requested)} ×${requested.amount} §a 出: ${displayName(offered)} ×${offered.amount}`);
        showTradeMainMenu(player);
    } catch {
        // The listing is already committed. A failed notification never refunds it.
    }
}

function showMyListings(player: Player) {
    if (!player.isValid) return;
    const current = readListings(player);
    if (!current) return;
    const listings = current.filter(listing => listing.ownerId === player.id).slice(0, PAGE_SIZE);
    const form = createChestForm("large", "§r自分のトレード出品");
    menuButton(form, 0, "§c戻る", "minecraft:barrier");
    listings.forEach((listing, index) => form.setButton(index + 9, {
        name: `§a出: ${displayName(listing.offered)}`,
        iconPath: iconPath(listing.offered),
        stackAmount: listing.offered.amount,
        lore: [
            { text: `§e求: ${displayName(listing.requested)} ×${listing.requested.amount}` },
            ...(listing.requested.lore ?? []).flatMap(line => [{ text: "\n§r§8  " }, formLoreLine(line)]),
            { text: "\n§c選択すると出品を取り消します" }
        ],
        editedName: true,
        isGlint: (listing.offered.enchantments?.length ?? 0) > 0
    }));
    form.show(player).then(result => {
        if (!player.isValid) return;
        if (result.canceled || result.selection === 0) return showTradeMainMenu(player);
        const listing = listings[(result.selection ?? -1) - 9];
        if (listing) confirmCancellation(player, listing.id);
        else showMyListings(player);
    });
}

function confirmCancellation(player: Player, listingId: number) {
    if (!player.isValid) return;
    const listings = readListings(player);
    if (!listings) return;
    const listing = listings.find(entry => entry.id === listingId && entry.ownerId === player.id);
    if (!listing) {
        player.sendMessage("§cこの出品はすでに終了しています。");
        return showMyListings(player);
    }
    new ActionFormData()
        .title("出品の取り消し")
        .body(`§a出: §f${displayName(listing.offered)} ×${listing.offered.amount}\n§e求: §f${displayName(listing.requested)} ×${listing.requested.amount}`)
        .button("§c取り消して返却")
        .button("§7戻る")
        .show(player).then((result: any) => {
            if (!player.isValid) return;
            if (result.canceled || result.selection !== 0) return showMyListings(player);
            if (tradeLocks.has(listingId)) return showMyListings(player);
            tradeLocks.add(listingId);
            try {
                const current = readListings(player);
                if (!current) return;
                const target = current.find(entry => entry.id === listingId && entry.ownerId === player.id);
                if (!target) {
                    player.sendMessage("§cこの出品はすでに終了しています。");
                    return showMyListings(player);
                }
                if (!deliverAndCommit(player, target.offered, () => {
                    writeJson(TRADE_LIST_KEY, current.filter(entry => entry.id !== listingId));
                })) return;
                player.sendMessage("§a出品を取り消し、「出」のアイテムを返却しました。");
            } finally {
                tradeLocks.delete(listingId);
            }
            showMyListings(player);
        });
}

function showReceipts(player: Player) {
    if (!player.isValid) return;
    const receipts = readReceipts(player);
    if (!receipts) return;
    const form = createChestForm("large", "§rトレード受取箱");
    menuButton(form, 0, "§c戻る", "minecraft:barrier");
    receipts.slice(0, PAGE_SIZE).forEach((receipt, index) => form.setButton(index + 9, {
        name: `§e受取: ${displayName(receipt.item)}`,
        iconPath: iconPath(receipt.item),
        stackAmount: receipt.item.amount,
        lore: [
            { text: `§7交換相手: ${receipt.buyerName}` },
            ...(receipt.item.lore ?? []).flatMap(line => [{ text: "\n§r§8  " }, formLoreLine(line)]),
            { text: "\n§a選択して受け取る" }
        ],
        editedName: true,
        isGlint: (receipt.item.enchantments?.length ?? 0) > 0
    }));
    form.show(player).then(result => {
        if (!player.isValid) return;
        if (result.canceled || result.selection === 0) return showTradeMainMenu(player);
        const receipt = receipts[(result.selection ?? -1) - 9];
        if (!receipt) return showReceipts(player);
        const current = readReceipts(player);
        if (!current) return;
        const targetIndex = current.findIndex(entry => entry.listingId === receipt.listingId);
        if (targetIndex < 0) return showReceipts(player);
        const target = current[targetIndex];
        if (!deliverAndCommit(player, target.item, () => {
            writeJson(receiptKey(player.id), current.filter((_, index) => index !== targetIndex));
        })) return;
        player.sendMessage(`§a「求」のアイテムを受け取りました: ${displayName(target.item)} ×${target.item.amount}`);
        showReceipts(player);
    });
}
