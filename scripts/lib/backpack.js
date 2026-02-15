import {
    world,
    ItemStack,
    ItemComponentTypes,
    EnchantmentTypes,
    Potions
} from "@minecraft/server";
import { ChestFormData } from "./chest-ui";
import { getToolQuality } from "./item";
import { itemIdToPath } from "../texture_config";
import { langChangeItemName } from "./util";
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

function saveSplit(item, key, obj) {
    const json = JSON.stringify(obj);
    const chunks = json.match(new RegExp(`.{1,${CHUNK_LIMIT}}`, "g")) || [];
    item.setDynamicProperty(`${key}:len`, chunks.length);
    chunks.forEach((c, i) => {
        item.setDynamicProperty(`${key}_${i}`, c);
    });
    return item;
}

function loadSplit(item, key, fallback) {
    const len = item.getDynamicProperty(`${key}:len`);
    if (!len) return fallback;
    let json = "";
    for (let i = 0; i < len; i++) {
        json += item.getDynamicProperty(`${key}_${i}`) || "";
    }
    return JSON.parse(json);
}

function getCurrentBackpack(player) {
    const inv = player.getComponent("inventory").container;
    const slot = player.selectedSlotIndex;
    const item = inv.getItem(slot);

    if (!item) return null;
    if (item.typeId !== "mc:backpack") return null;
    const cap = getBackpackCapacity(item);

    return { item, slot, cap };
}

function getBackpackName(bp) {
    if (bp.nameTag && bp.nameTag.trim().length > 0) {
        return bp.nameTag;
    }
    return langChangeItemName(bp.typeId);
}

function getBackpackCapacity(bp) {
    const q = Math.floor(getToolQuality(bp) + 1);
    return {
        quality: q,
        maxSlots: q * 9,
        maxTotal: q * 10000
    };
}

function fillGlass(ui, slots, start, end, type, name) {
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

function makeItemKey(d) {
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

    openRoot(player, itemStack, data, meta, slots);
});

function openRoot(player, bp, data, meta) {
    const cap = getBackpackCapacity(bp);

    const ui = new ChestFormData("single")
        .setTitle(getBackpackName(bp));

    ui.setButton(11, {
        iconPath: itemIdToPath["minecraft:chest"],
        name: "backpack.item.take",
        lore: [{
            rawtext: [
                { text: '§7' },
                { translate: "backpack.item.saveamount", with: [`${meta.total}/${cap.maxTotal}`] }
            ]
        }],
        stackAmount: 1,
        editedName: true
    });

    ui.setButton(13, {
        iconPath: itemIdToPath["minecraft:name_tag"],
        name: "backpack.button.rename",
        stackAmount: 1,
        editedName: true
    });

    ui.setButton(15, {
        iconPath: itemIdToPath["minecraft:cauldron"],
        name: "backpack.item.store",
        stackAmount: 1,
        editedName: true
    });

    ui.show(player).then(r => {
        if (r.canceled) return;
        if (r.selection === 11) openList(player, bp, data, meta, 0);
        if (r.selection === 13) openRenameUI(player);
        if (r.selection === 15) openStoreUI(player, bp, data, meta);
    });
}

function openRenameUI(player) {
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

        const name = r.formValues[0]?.trim();

        if (!name || name.length === 0) {
            again.item.nameTag = undefined;
        } else {
            again.item.nameTag = name.slice(0, 50);
        }

        player.getComponent("inventory").container.setItem(slot, again.item);
    });
}

function hasInventorySpace(player) {
    const inv = player.getComponent("inventory").container;
    for (let i = 0; i < inv.size; i++) {
        if (!inv.getItem(i)) return true;
    }
    return false;
}

function openList(player, bp, data, meta, page, keyword = "") {
    const current = getCurrentBackpack(player);
    const cap = current.cap;

    const perPage = 45;
    const maxPage = Math.max(0, Math.ceil(cap.maxSlots / perPage) - 1);

    page = Math.max(0, Math.min(page, maxPage));

    let list = data;
    if (keyword) list = list.filter(d => d.data.typeId.includes(keyword));
    list.sort((a, b) => b.count - a.count);

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

    items.forEach((d, i) => {
        usedSlots.add(i);
        const itemData = d.data;

        ui.setButton(i, {
            iconPath: itemIdToPath[itemData.typeId] || itemData.typeId,
            name: itemData.nameTag ?? langChangeItemName(itemData.typeId),
            stackAmount: Math.min(d.count, 64),
            lore: [{ rawtext: [{ text: '§7' }, { translate: "backpack.item.hasamount", with: [`${d.count}`] }] }],
            editedName: true
        });
    });

    for (let i = pageAvailableSlots; i < perPage; i++) {
        usedSlots.add(i);
        ui.setButton(i, {
            iconPath: itemIdToPath["minecraft:red_stained_glass_pane"],
            name: "§cLOCKED",
            stackAmount: 1,
            editedName: true
        });
    }

    if (page > 0) {
        usedSlots.add(45);
        ui.setButton(45, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "backpack.button.before",
            stackAmount: 1,
            editedName: true
        });
    }

    if (page < maxPage) {
        usedSlots.add(53);
        ui.setButton(53, {
            iconPath: itemIdToPath["minecraft:arrow"],
            name: "backpack.button.after",
            stackAmount: 1,
            editedName: true
        });
    }

    fillGlass(ui, usedSlots, 45, 53, itemIdToPath["minecraft:black_stained_glass_pane"], " ");

    ui.show(player).then(r => {
        if (r.canceled) return;
        if (r.selection === 45) return openList(player, bp, data, meta, page - 1);
        if (r.selection === 53) return openList(player, bp, data, meta, page + 1);

        const entry = items[r.selection];
        if (!entry) return;

        takeItem(player, bp, data, meta, entry);
    });
}

function takeItem(player, _bp, _data, _meta, entry) {
    const current = getCurrentBackpack(player);
    if (!current) {
        player.sendMessage({ translate: 'backpack.error.notfound' });
        return;
    }

    const { item: bp, slot } = current;

    const meta = loadSplit(bp, "bp:meta", { total: 0 });
    const data = loadSplit(bp, "bp:data", []);

    const realEntry = data.find(e => e.key === entry.key);
    if (!realEntry) return;

    if (!hasInventorySpace(player)) {
        player.sendMessage({ translate: 'backpack.error.notenough.inventory' });
        return;
    };

    const temp = createItemStackFromData(realEntry.data, 1);
    const amount = Math.min(temp.maxAmount, realEntry.count);

    player.getComponent("inventory").container.addItem(
        createItemStackFromData(realEntry.data, amount)
    );

    realEntry.count -= amount;
    meta.total -= amount;

    if (realEntry.count <= 0) {
        data.splice(data.indexOf(realEntry), 1);
    }

    saveSplit(bp, "bp:data", data);
    saveSplit(bp, "bp:meta", meta);
    player.getComponent("inventory").container.setItem(slot, bp);

    openList(player, bp, data, meta, 0);
}

function containerToData(item) {
    if (!item) return null;
    const dyp = (item.getDynamicPropertyIds() || []).map(id => ({ id, data: item.getDynamicProperty(id) }));
    const ench = item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().map(e => ({ typeId: e.type.id, level: e.level })) ?? [];
    const potionComp = item.getComponent(ItemComponentTypes.Potion);
    const potion = potionComp?.isValid ? [{ id: potionComp.potionEffectType.id, deliveryType: potionComp.potionDeliveryType.id }] : [];
    return {
        typeId: item.typeId, amount: item.amount, nameTag: item.nameTag, lore: item.getLore(), enchantments: ench, nbt: item.getComponent(ItemComponentTypes.Durability)?.damage, dyp, potion
    };
}

function createItemStackFromData(d, amount) {
    let stack = new ItemStack(d.typeId);
    if (d.potion?.length) {
        const p = d.potion[0]; stack = Potions.resolve(p.id, p.deliveryType);
    }
    stack.amount = amount;
    if (d.nameTag) stack.nameTag = d.nameTag;
    if (d.lore?.length) stack.setLore(d.lore);
    const dur = stack.getComponent(ItemComponentTypes.Durability);
    if (dur && typeof d.nbt === "number") dur.damage = d.nbt;
    const ench = stack.getComponent(ItemComponentTypes.Enchantable);
    if (ench) {
        for (const e of d.enchantments ?? []) {
            const t = EnchantmentTypes.get(e.typeId); if (t) ench.addEnchantment({ type: t, level: e.level });
        }
    } if (d.dyp) {
        for (const dp of d.dyp) {
            stack.setDynamicProperty(dp.id, dp.data);
        }
    } return stack;
}

function openStoreUI(player, bp, data, meta) {
    const inv = player.getComponent("inventory").container;
    const ui = new ChestFormData("large").setTitle([{ translate: 'backpack.item.store' }]);

    const map = [];

    let uiSlot = 0;
    for (let i = 0; i < inv.size && uiSlot < 54; i++) {
        const it = inv.getItem(i);
        if (!it) continue;
        if (it.typeId.includes('backpack')) continue;
        if (outItems.includes(it.typeId)) continue;

        ui.setButton(uiSlot, {
            iconPath: itemIdToPath[it.typeId],
            name: it.nameTag ?? langChangeItemName(it.typeId),
            stackAmount: it.amount,
            lore: [{ rawtext: [{ text: '§7' }, { translate: 'backpack.lore.click.to.store' }] }],
            editedName: true
        });

        map[uiSlot] = i;
        uiSlot++;
    }

    if (uiSlot === 0) {
        player.sendMessage({ translate: 'backpack.error.noitem' });
        return;
    }

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
            openRoot(player, bp, data, meta);
            return;
        }

        const invIndex = map[r.selection];
        if (invIndex === undefined) return;

        const inv = player.getComponent("inventory").container;
        const item = inv.getItem(invIndex);
        if (!item) return;

        if (meta.total + item.amount > cap.maxTotal) {
            player.sendMessage({ translate: 'backpack.error.full' });
            return;
        }

        const d = containerToData(item);
        const key = makeItemKey(d);

        let entry = data.find(e => e.key === key);

        if (!entry && data.length >= cap.maxSlots) {
            player.sendMessage({ translate: 'backpack.error.full' });
            return;
        }

        if (!entry) {
            entry = {
                key,
                data: d,
                count: 0
            };
            data.push(entry);
        }

        entry.count += item.amount;
        meta.total += item.amount;

        inv.setItem(invIndex, undefined);

        saveSplit(realBp, "bp:data", data);
        saveSplit(realBp, "bp:meta", meta);
        inv.setItem(slot, realBp);

        openStoreUI(player, realBp, data, meta);
    });
}