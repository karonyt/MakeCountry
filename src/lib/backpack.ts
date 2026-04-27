import {
    world,
    ItemStack,
    ItemComponentTypes,
    EnchantmentTypes,
    Potions
} from "@minecraft/server";
import { ChestFormData } from "./chest-ui.js";
import { getToolQuality } from "./item.js";
import { itemIdToPath } from "../texture_config.js";
import { enchantIdToLang, langChangeItemName } from "./util.js";
import { ModalFormData } from "@minecraft/server-ui";

const CHUNK_LIMIT = 20000;

const outItems = [
    //'minecraft:arrow',
    'minecraft:bundle',
    'minecraft:black_bundle',
    'minecraft:blue_bundle',
    'minecraft:brown_bundle',
    'minecraft:cyan_bundle',
    'minecraft:gray_bundle',
    'minecraft:green_bundle',
    'minecraft:light_blue_bundle',
    'minecraft:light_gray_bundle',
    'minecraft:lime_bundle',
    'minecraft:magenta_bundle',
    'minecraft:orange_bundle',
    'minecraft:pink_bundle',
    'minecraft:purple_bundle',
    'minecraft:red_bundle',
    'minecraft:white_bundle',
    'minecraft:banner',
    'minecraft:decorated_pot',
    'minecraft:suspicious_stew',
    'minecraft:black_shulker_box',
    'minecraft:blue_shulker_box',
    'minecraft:brown_shulker_box',
    'minecraft:cyan_shulker_box',
    'minecraft:gray_shulker_box',
    'minecraft:green_shulker_box',
    'minecraft:light_blue_shulker_box',
    'minecraft:light_gray_shulker_box',
    'minecraft:lime_shulker_box',
    'minecraft:magenta_shulker_box',
    'minecraft:orange_shulker_box',
    'minecraft:pink_shulker_box',
    'minecraft:purple_shulker_box',
    'minecraft:red_shulker_box',
    'minecraft:white_shulker_box',
    'minecraft:undyed_shulker_box',
    'minecraft:writable_book',
    'minecraft:written_book',
    'minecraft:goat_horn',
    'minecraft:map',
    'minecraft:empty_map',
    'minecraft:filled_map',
    //'minecraft:firework_rocket',
    'minecraft:bee_nest',
    //'minecraft:firework_star',
];

function saveSplit(item: any, key: any, obj: any) {
    const json = JSON.stringify(obj);
    const chunks = json.match(new RegExp(`.{1,${CHUNK_LIMIT}}`, "g")) || [];
    item.setDynamicProperty(`${key}:len`, chunks.length);
    chunks.forEach((c, i) => {
        item.setDynamicProperty(`${key}_${i}`, c);
    });
    return item;
}

function loadSplit(item: any, key: any, fallback: any) {
    const len = item.getDynamicProperty(`${key}:len`);
    if (!len) return fallback;
    let json = "";
    for (let i = 0; i < len; i++) {
        json += item.getDynamicProperty(`${key}_${i}`) || "";
    }
    return JSON.parse(json);
}

function getCurrentBackpack(player: any) {
    const inv = player.getComponent("inventory").container;
    const slot = player.selectedSlotIndex;
    const item = inv.getItem(slot);

    if (!item) return null;
    if (item.typeId !== "mc:backpack") return null;
    const cap = getBackpackCapacity(item);

    return { item, slot, cap };
}

function getBackpackName(bp: any) {
    if (bp.nameTag && bp.nameTag.trim().length > 0) {
        return bp.nameTag;
    }
    return langChangeItemName(bp.typeId);
}

function getBackpackCapacity(bp: any) {
    const q = Math.floor(getToolQuality(bp) + 1);
    return {
        quality: q,
        maxSlots: q * 9,
        maxTotal: q * 10000
    };
}

function fillGlass(ui: any, slots: any, start: any, end: any, type: any, name: any) {
    for (let i = start; i <= end; i++) {
        if (slots.has(i)) continue;
        ui.setButton(i, {
            iconPath: type,
            name,
            stackAmount: 1,
            editedName: true
        });
    }
}

function getEnchantLore(enchantments: any, prefix: any) {
    const lore = [...prefix];
    for (const enchant of enchantments ?? []) {
        const enchantId = `${enchant.typeId ?? enchant.type?.id ?? ""}`.replace("minecraft:", "");
        const langKey = enchantIdToLang[enchantId as keyof typeof enchantIdToLang] || enchant.typeId || enchant.type?.id || enchantId;
        lore.push(
            { text: "\n\u00A7r" },
            { text: enchantId.includes("curse") ? "\u00A7c" : "\u00A77" },
            { translate: `${langKey}` },
            { text: " " },
            { translate: `enchantment.level.${enchant.level}` },
            { text: "\u00A7r" }
        );
    }
    return lore;
}

function reopenBackpackList(player: any, page = 0, keyword = "", mode = "single") {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: 'backpack.error.notfound' });
        return;
    }

    const meta = loadSplit(current.item, "bp:meta", { total: 0 });
    const data = loadSplit(current.item, "bp:data", []);
    openList(player, current.item, data, meta, page, keyword, mode);
}

function reopenBackpackStore(player: any, mode = "single") {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: 'backpack.error.notfound' });
        return;
    }

    const meta = loadSplit(current.item, "bp:meta", { total: 0 });
    const data = loadSplit(current.item, "bp:data", []);
    openStoreUI(player, current.item, data, meta, mode);
}

function makeItemKey(d: any) {
    return JSON.stringify({
        typeId: d.typeId,
        nameTag: d.nameTag ?? null,
        lore: d.lore ?? [],
        enchantments: d.enchantments ?? [],
        potion: d.potion ?? [],
        nbt: d.nbt ?? null,
        dyp: d.dyp ?? []
    });
}

world.afterEvents.itemUse.subscribe(ev => {
    const { itemStack, source: player } = ev;
    if (itemStack.typeId !== "mc:backpack") return;

    const quality = getToolQuality(itemStack);
    const slots = Math.max(9, quality * 9);

    const meta = loadSplit(itemStack, "bp:meta", { total: 0 });
    const data = loadSplit(itemStack, "bp:data", []);

    // @ts-ignore TS(2554): Expected 4 arguments, but got 5.
    openRoot(player, itemStack, data, meta, slots);
});

function openRoot(player: any, bp: any, data: any, meta: any) {
    const cap = getBackpackCapacity(bp);

    const ui = new ChestFormData("single")
        .setTitle(getBackpackName(bp));

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.setButton(11, {
        iconPath: itemIdToPath["minecraft:chest"],
        name: "backpack.item.take",
        lore: [{
            rawtext: [
                { text: '\u00A77' },
                { translate: "backpack.item.saveamount", with: [`${meta.total}/${cap.maxTotal}`] }
            ]
        }],
        stackAmount: 1,
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.setButton(12, {
        iconPath: itemIdToPath["minecraft:hopper"],
        name: "backpack.button.takeall",
        stackAmount: 1,
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.setButton(13, {
        iconPath: itemIdToPath["minecraft:name_tag"],
        name: "backpack.button.rename",
        stackAmount: 1,
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.setButton(15, {
        iconPath: itemIdToPath["minecraft:cauldron"],
        name: "backpack.item.store",
        stackAmount: 1,
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.setButton(16, {
        iconPath: itemIdToPath["minecraft:barrel"],
        name: "backpack.button.storeall",
        stackAmount: 1,
        editedName: true
    });

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.show(player).then(r => {
        if (r.canceled) return;
        if (r.selection === 11) openList(player, bp, data, meta, 0, "", "single");
        if (r.selection === 12) openList(player, bp, data, meta, 0, "", "all");
        if (r.selection === 13) openRenameUI(player);
        if (r.selection === 15) openStoreUI(player, bp, data, meta, "single");
        if (r.selection === 16) openStoreUI(player, bp, data, meta, "all");
    });
}

function openRenameUI(player: any) {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: "backpack.error.notfound" });
        return;
    }

    const { item: bp, slot } = current;

    const modal = new ModalFormData()
        .title({ translate: "backpack.button.rename" })
        .textField(
            { translate: "backpack.button.rename" },
            { translate: 'input.string' },
            { defaultValue: bp.nameTag ?? "" }
        );

    modal.show(player).then(r => {
        if (r.canceled) return;

        const again = getCurrentBackpack(player);
        if (!again || again.slot !== slot) {
            player.sendMessage({ translate: "backpack.error.notfound" });
            return;
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const name = r.formValues[0]?.trim();

        if (!name || name.length === 0) {
            again.item.nameTag = undefined;
        } else {
            again.item.nameTag = name.slice(0, 50);
        }

        player.getComponent("inventory").container.setItem(slot, again.item);
    });
}

function hasInventorySpace(player: any) {
    const inv = player.getComponent("inventory").container;
    for (let i = 0; i < inv.size; i++) {
        if (!inv.getItem(i)) return true;
    }
    return false;
}

function getAddableAmount(player: any, itemData: any) {
    const inv = player.getComponent("inventory").container;
    const temp = createItemStackFromData(itemData, 1);
    const targetKey = makeItemKey(containerToData(temp));
    let amount = 0;

    for (let i = 0; i < inv.size; i++) {
        const current = inv.getItem(i);
        if (!current) {
            amount += temp.maxAmount;
            continue;
        }

        if (makeItemKey(containerToData(current)) !== targetKey) continue;
        amount += Math.max(0, current.maxAmount - current.amount);
    }

    return amount;
}

function openList(player: any, bp: any, data: any, meta: any, page: any, keyword = "", mode = "single") {
    const current = getCurrentBackpack(player);
    // @ts-ignore TS(2531): Object is possibly 'null'.
    const cap = current.cap;

    const perPage = 45;
    const maxPage = Math.max(0, Math.ceil(cap.maxSlots / perPage) - 1);

    page = Math.max(0, Math.min(page, maxPage));

    let list = data;
    if (keyword) list = list.filter((d: any) => d.data.typeId.includes(keyword));
    list.sort((a: any, b: any) => b.count - a.count);

    const startIndex = page * perPage;
    const endIndex = Math.min(startIndex + perPage, cap.maxSlots);
    const items = list.slice(startIndex, endIndex);

    const pageAvailableSlots = Math.max(
        0,
        Math.min(perPage, cap.maxSlots - startIndex)
    );

    const ui = new ChestFormData("large")
        .setTitle([{ rawtext: [{ translate: getBackpackName(bp) }, { text: ` [${page + 1}/${maxPage + 1}]` }] }]);

    const usedSlots = new Set();

    items.forEach((d: any, i: any) => {
        usedSlots.add(i);
        const itemData = d.data;

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        ui.setButton(i, {
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            iconPath: itemIdToPath[itemData.typeId] || itemData.typeId,
            name: itemData.nameTag ?? langChangeItemName(itemData.typeId),
            stackAmount: Math.min(d.count, 64),
            lore: getEnchantLore(
                itemData.enchantments,
                [{ text: '\u00A77' }, { translate: "backpack.item.hasamount", with: [`${d.count}`] }]
            ),
            editedName: true,
            isGlint: (itemData.enchantments?.length ?? 0) > 0
        });
    });

    for (let i = pageAvailableSlots; i < perPage; i++) {
        usedSlots.add(i);
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        ui.setButton(i, {
            iconPath: itemIdToPath["minecraft:red_stained_glass_pane"],
            name: "backpack.button.locked",
            stackAmount: 1,
            editedName: true
        });
    }

    if (page > 0) {
        usedSlots.add(45);
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        ui.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "backpack.button.before",
            stackAmount: 1,
            editedName: true
        });
    }

    if (page < maxPage) {
        usedSlots.add(53);
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        ui.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "backpack.button.after",
            stackAmount: 1,
            editedName: true
        });
    }

    fillGlass(ui, usedSlots, 45, 53, itemIdToPath["minecraft:black_stained_glass_pane"], " ");

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.show(player).then(r => {
        if (r.canceled) return;
        if (r.selection === 45) return openList(player, bp, data, meta, page - 1, keyword, mode);
        if (r.selection === 53) return openList(player, bp, data, meta, page + 1, keyword, mode);

        const entry = items[r.selection];
        if (!entry) return;

        if (mode === "all") {
            takeAllItem(player, bp, data, meta, entry);
            return;
        }
        takeItem(player, bp, data, meta, entry);
    });
}

function takeItemAmount(player: any, entry: any, maxAmount: any) {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: 'backpack.error.notfound' });
        return false;
    }

    const { item: bp, slot } = current;

    const meta = loadSplit(bp, "bp:meta", { total: 0 });
    const data = loadSplit(bp, "bp:data", []);

    const realEntry = data.find((e: any) => e.key === entry.key);
    if (!realEntry) return false;

    const amount = Math.min(realEntry.count, maxAmount, getAddableAmount(player, realEntry.data));
    if (amount <= 0) {
        player.sendMessage({ translate: 'backpack.error.notenough.inventory' });
        return false;
    }

    const inv = player.getComponent("inventory").container;
    const maxStackAmount = createItemStackFromData(realEntry.data, 1).maxAmount;
    let remaining = amount;

    while (remaining > 0) {
        const stackAmount = Math.min(remaining, maxStackAmount);
        inv.addItem(createItemStackFromData(realEntry.data, stackAmount));
        remaining -= stackAmount;
    }

    realEntry.count -= amount;
    meta.total -= amount;

    if (realEntry.count <= 0) {
        data.splice(data.indexOf(realEntry), 1);
    }

    saveSplit(bp, "bp:data", data);
    saveSplit(bp, "bp:meta", meta);
    inv.setItem(slot, bp);

    return true;
}

function takeAllItem(player: any, bp: any, data: any, meta: any, entry: any) {
    takeItemAmount(player, entry, entry.count);
    reopenBackpackList(player, 0, "", "all");
}

function takeItem(player: any, bp: any, data: any, meta: any, entry: any) {
    const addable = getAddableAmount(player, entry.data);
    const maxTake = Math.min(entry.count, addable);

    if (maxTake <= 0) {
        player.sendMessage({ translate: 'backpack.error.notenough.inventory' });
        reopenBackpackList(player, 0, "", "single");
        return;
    }

    if (maxTake === 1) {
        takeItemAmount(player, entry, 1);
        reopenBackpackList(player, 0, "", "single");
        return;
    }

    const maxStack = createItemStackFromData(entry.data, 1).maxAmount;
    const modal = new ModalFormData()
        .title({ translate: 'backpack.slider.take' })
        .slider({ translate: 'backpack.slider.amount' }, 1, maxTake, { valueStep: 1, defaultValue: Math.min(maxStack, maxTake) });

    modal.show(player).then(r => {
        if (r.canceled) {
            reopenBackpackList(player, 0, "", "single");
            return;
        }
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const amount = r.formValues[0];
        takeItemAmount(player, entry, amount);
        reopenBackpackList(player, 0, "", "single");
    });
}

function containerToData(item: any) {
    if (!item) return null;
    const dyp = (item.getDynamicPropertyIds() || []).map((id: any) => ({
        id,
        data: item.getDynamicProperty(id)
    }));
    const ench = item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().map((e: any) => ({
        typeId: e.type.id,
        level: e.level
    })) ?? [];
    const potionComp = item.getComponent(ItemComponentTypes.Potion);
    const potion = potionComp?.isValid ? [{ id: potionComp.potionEffectType.id, deliveryType: potionComp.potionDeliveryType.id }] : [];
    return {
        typeId: item.typeId, amount: item.amount, nameTag: item.nameTag, lore: item.getLore(), enchantments: ench, nbt: item.getComponent(ItemComponentTypes.Durability)?.damage, dyp, potion
    };
}

function createItemStackFromData(d: any, amount: any) {
    let stack = new ItemStack(d.typeId);
    if (d.potion?.length) {
        const p = d.potion[0]; stack = Potions.resolve(p.id, p.deliveryType);
    }
    stack.amount = amount;
    if (d.nameTag) stack.nameTag = d.nameTag;
    if (d.lore?.length) stack.setLore(d.lore);
    const dur = stack.getComponent(ItemComponentTypes.Durability);
    // @ts-ignore TS(2339): Property 'damage' does not exist on type 'never'.
    if (dur && typeof d.nbt === "number") dur.damage = d.nbt;
    const ench = stack.getComponent(ItemComponentTypes.Enchantable);
    if (ench) {
        for (const e of d.enchantments ?? []) {
            // @ts-ignore TS(2339): Property 'addEnchantment' does not exist on type '... Remove this comment to see the full error message
            const t = EnchantmentTypes.get(e.typeId); if (t) ench.addEnchantment({ type: t, level: e.level });
        }
    } if (d.dyp) {
        for (const dp of d.dyp) {
            stack.setDynamicProperty(dp.id, dp.data);
        }
    } return stack;
}

function storeMatchingItems(player: any, selectedSlot: any) {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: 'backpack.error.notfound' });
        return false;
    }

    const { item: bp, slot, cap } = current;
    const meta = loadSplit(bp, "bp:meta", { total: 0 });
    const data = loadSplit(bp, "bp:data", []);
    const inv = player.getComponent("inventory").container;
    const selectedItem = inv.getItem(selectedSlot);
    if (!selectedItem) return false;

    const itemData = containerToData(selectedItem);
    const key = makeItemKey(itemData);
    let entry = data.find((e: any) => e.key === key);

    if (!entry && data.length >= cap.maxSlots) {
        player.sendMessage({ translate: 'backpack.error.full' });
        return false;
    }

    if (!entry) {
        entry = {
            key,
            data: itemData,
            count: 0
        };
        data.push(entry);
    }

    let remain = cap.maxTotal - meta.total;
    if (remain <= 0) {
        player.sendMessage({ translate: 'backpack.error.full' });
        return false;
    }

    let stored = 0;
    for (let i = 0; i < inv.size && remain > 0; i++) {
        if (i === slot) continue;
        const currentItem = inv.getItem(i);
        if (!currentItem) continue;
        if (currentItem.typeId.includes('backpack')) continue;
        if (outItems.includes(currentItem.typeId)) continue;

        if (makeItemKey(containerToData(currentItem)) !== key) continue;

        const moveAmount = Math.min(currentItem.amount, remain);
        entry.count += moveAmount;
        meta.total += moveAmount;
        stored += moveAmount;
        remain -= moveAmount;

        if (moveAmount >= currentItem.amount) {
            inv.setItem(i, undefined);
        } else {
            currentItem.amount -= moveAmount;
            inv.setItem(i, currentItem);
        }
    }

    if (stored <= 0) {
        if (entry.count <= 0) data.splice(data.indexOf(entry), 1);
        player.sendMessage({ translate: 'backpack.error.full' });
        return false;
    }

    saveSplit(bp, "bp:data", data);
    saveSplit(bp, "bp:meta", meta);
    inv.setItem(slot, bp);
    return true;
}

function storeItemAmount(player: any, selectedSlot: any, amount: any) {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: 'backpack.error.notfound' });
        return false;
    }

    const { item: bp, slot, cap } = current;
    const meta = loadSplit(bp, "bp:meta", { total: 0 });
    const data = loadSplit(bp, "bp:data", []);
    const inv = player.getComponent("inventory").container;
    const item = inv.getItem(selectedSlot);
    if (!item) return false;

    const storeAmount = Math.min(amount, item.amount);
    if (meta.total + storeAmount > cap.maxTotal) {
        player.sendMessage({ translate: 'backpack.error.full' });
        return false;
    }

    const itemData = containerToData(item);
    const key = makeItemKey(itemData);
    let entry = data.find((e: any) => e.key === key);

    if (!entry && data.length >= cap.maxSlots) {
        player.sendMessage({ translate: 'backpack.error.full' });
        return false;
    }

    if (!entry) {
        entry = {
            key,
            data: itemData,
            count: 0
        };
        data.push(entry);
    }

    entry.count += storeAmount;
    meta.total += storeAmount;

    if (storeAmount >= item.amount) {
        inv.setItem(selectedSlot, undefined);
    } else {
        item.amount -= storeAmount;
        inv.setItem(selectedSlot, item);
    }

    saveSplit(bp, "bp:data", data);
    saveSplit(bp, "bp:meta", meta);
    inv.setItem(slot, bp);
    return true;
}

function openStoreAmountUI(player: any, invIndex: any) {
    const inv = player.getComponent("inventory").container;
    const item = inv.getItem(invIndex);
    if (!item) {
        reopenBackpackStore(player, "single");
        return;
    }

    if (item.amount === 1) {
        storeItemAmount(player, invIndex, 1);
        reopenBackpackStore(player, "single");
        return;
    }

    const modal = new ModalFormData()
        .title({ translate: 'backpack.slider.store' })
        .slider({ translate: 'backpack.slider.amount' }, 1, item.amount, { valueStep: 1, defaultValue: item.amount });

    modal.show(player).then(r => {
        if (r.canceled) {
            reopenBackpackStore(player, "single");
            return;
        }
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const amount = r.formValues[0];
        storeItemAmount(player, invIndex, amount);
        reopenBackpackStore(player, "single");
    });
}

function openStoreUI(player: any, bp: any, data: any, meta: any, mode = "single") {
    const inv = player.getComponent("inventory").container;
    const ui = new ChestFormData("large").setTitle([{ translate: 'backpack.item.store' }]);

    const map: any = [];

    let uiSlot = 0;
    for (let i = 0; i < inv.size && uiSlot < 54; i++) {
        const it = inv.getItem(i);
        if (!it) continue;
        if (it.typeId.includes('backpack')) continue;
        if (outItems.includes(it.typeId)) continue;

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        ui.setButton(uiSlot, {
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            iconPath: itemIdToPath[it.typeId],
            name: it.nameTag ?? langChangeItemName(it.typeId),
            stackAmount: it.amount,
            lore: getEnchantLore(
                it.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().map((enchant: any) => ({
                    typeId: enchant.type.id,
                    level: enchant.level
                })) ?? [],
                [{ text: '\u00A77' }, { translate: 'backpack.lore.click.to.store' }]
            ),
            editedName: true,
            isGlint: (it.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments()?.length ?? 0) > 0
        });

        map[uiSlot] = i;
        uiSlot++;
    }

    if (uiSlot === 0) {
        player.sendMessage({ translate: 'backpack.error.noitem' });
        return;
    }

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    ui.show(player).then(r => {
        const current = getCurrentBackpack(player);
        if (!current) {
            player.sendMessage({ translate: 'backpack.error.notfound' });
            return;
        }

        const { item: realBp, slot, cap } = current;
        const meta = loadSplit(realBp, "bp:meta", { total: 0 });

        const data = loadSplit(realBp, "bp:data", []);
        if (r.canceled) {
            openRoot(player, realBp, data, meta);
            return;
        }

        const invIndex = map[r.selection];
        if (invIndex === undefined) return;

        if (mode === "all") {
            storeMatchingItems(player, invIndex);
            reopenBackpackStore(player, "all");
            return;
        }

        openStoreAmountUI(player, invIndex);
    });
}
