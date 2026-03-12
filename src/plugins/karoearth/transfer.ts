import { world, system, Player, EntityComponentTypes, ItemStack, EquipmentSlot, ItemLockMode, GameMode, EnchantmentTypes, ItemComponentTypes, Potions } from "@minecraft/server";
import { FormCancelationReason, ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net";
import { transferPlayer } from "@minecraft/server-admin";
import { langChangeItemName } from "../../lib/util.js";
import config from "../../config.js";
import jobs_config from "../../jobs_config.js";
import { JobLevel } from "../../lib/jobslevel.js";

// --- 險ｭ螳夐・岼 ---
const PLAYER_DATA_SERVER_URL = "http://192.168.100.4:10015";
const LOGIN_SERVER_URL = "http://192.168.100.4:10016";
const CURRENT_SERVER_ID = config.world; // NOTE: 縺薙・ID縺ｯ蜷・し繝ｼ繝舌・縺ｧ螟画峩縺励※縺ｭ
const ERROR_LOG_WEBHOOK_URL = "https://discord.com/api/webhooks/1421381729733705825/TR4gklDkMooxzRv2kwMEcdIpr2bBBQQvZp5EsMhozWf1UH5tWYLzLo9VzVwN6TKc_oxJ"; // 笘・・笘・縺薙％縺ｫWebhook URL繧定ｨｭ螳・笘・・笘・
const DEBUG_MODE = true;

const servers = {
    resource1: { name: "資源1\n§cアイテムロストワールド", id: "resource1", address: "play.karon.jp", port: 19135 },
    resource2: { name: "資源2\nおすすめ", id: "resource2", address: "play.karon.jp", port: 19136 },
    resource3: { name: "資源3\nモブ湧かない", id: "resource3", address: "play.karon.jp", port: 19137 },
    resource4: { name: "資源4\n§c1日と15日にリセット", id: "resource4", address: "play.karon.jp", port: 19138 },
    earth: { name: "Earth", id: "karoearth", address: "play.karon.jp", port: 19134 },
};

const warnItems = [
    'minecraft:chainmail_helmet',
    'minecraft:chainmail_leggings',
    'minecraft:chainmail_chestplate',
    'minecraft:chainmail_boots',
    'minecraft:wooden_helmet',
    'minecraft:wooden_leggings',
    'minecraft:wooden_chestplate',
    'minecraft:wooden_boots',
    'minecraft:diamond_helmet',
    'minecraft:diamond_leggings',
    'minecraft:diamond_chestplate',
    'minecraft:diamond_boots',
    'minecraft:netherite_helmet',
    'minecraft:netherite_leggings',
    'minecraft:netherite_chestplate',
    'minecraft:netherite_boots',
    'minecraft:iron_helmet',
    'minecraft:iron_leggings',
    'minecraft:iron_chestplate',
    'minecraft:iron_boots',
    'minecraft:golden_helmet',
    'minecraft:golden_leggings',
    'minecraft:golden_chestplate',
    'minecraft:golden_boots',
    'minecraft:leather_helmet',
    'minecraft:leather_leggings',
    'minecraft:leather_chestplate',
    'minecraft:leather_boots',
    'minecraft:shield',
    'minecraft:arrow',
    'minecraft:bed',
    'minecraft:firework_star',
    'minecraft:firework_rocket',
];
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

const STATUS_TAG = {
    TRANSFERRING: "status:transferring",
    LOADING: "status:loading",
};

/**
 * @param {...any} args 
 */
function debugLog(...args: any[]) {
    if (DEBUG_MODE) {
        console.warn("[TransferDebug]", ...args);
    }
}

/**
 * DiscordにエラーログをEmbed形式で送信します。
 * @param {string} title エラーのタイトル
 * @param {Player | null} player エラーが発生したプレイヤー
 * @param {Error} error 発生したエラーオブジェクト
 * @param {string} [additionalInfo=''] 追加情報
 */
async function sendErrorLogToDiscord(title: any, player: any, error: any, additionalInfo = '') {
    if (!ERROR_LOG_WEBHOOK_URL) return;
    try {
        const playerName = player ? player.name : "N/A";
        const playerId = player ? player.id : "N/A";
        const stack = error ? (error.stack || error.message) : "No error object provided";
        const header = "**Player:** `" + playerName + "` (`" + playerId + "`)\n" +
            "**Server ID:** `" + CURRENT_SERVER_ID + "`\n" +
            (additionalInfo ? "\n**Additional Info:**\n```\n" + additionalInfo + "\n```" : "");
        const stackHeader = "\n**Stack Trace:**\n```\n";
        const stackFooter = "\n```";
        const maxStackLength = 4096 - header.length - stackHeader.length - stackFooter.length;
        const stackChunks = [];
        for (let i = 0; i < stack.length; i += maxStackLength) {
            stackChunks.push(stack.substring(i, i + maxStackLength));
        }
        for (let i = 0; i < stackChunks.length; i++) {
            const isFirstPage = i === 0;
            const pageTitle = stackChunks.length > 1 ? `Error: ${title} (${i + 1}/${stackChunks.length})` : `Error: ${title}`;
            const description = (isFirstPage ? header : '') + stackHeader + stackChunks[i] + stackFooter;
            const payload = { embeds: [{ title: pageTitle, description, color: 15158332, timestamp: new Date().toISOString(), footer: { text: `Server: ${CURRENT_SERVER_ID}` } }] };
            const req = new HttpRequest(ERROR_LOG_WEBHOOK_URL);
            req.method = HttpRequestMethod.Post;
            req.headers = [new HttpHeader("Content-Type", "application/json")];
            req.body = JSON.stringify(payload);
            await http.request(req);
            if (stackChunks.length > 1) await system.waitTicks(20);
        }
    } catch (e) {
        console.error("[DiscordWebhook] Failed to send error log itself:", e);
    }
}

/**
 * @param {Player} player
 * @param {boolean} shouldLock
 */
function lockItems(player: any, shouldLock: any) {
    const lockMode = shouldLock ? ItemLockMode.slot : ItemLockMode.none;
    try {
        const inventory = player.getComponent('inventory').container;
        const equippable = player.getComponent('equippable');
        const equipmentSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand, EquipmentSlot.Mainhand];
        for (let i = 0; i < inventory.size; i++) {
            const item = inventory.getItem(i);
            if (item) {
                item.lockMode = lockMode;
                inventory.setItem(i, item);
            }
        }
        for (const es of equipmentSlots) {
            const item = equippable.getEquipment(es);
            if (item) {
                item.lockMode = lockMode;
                equippable.setEquipment(es, item);
            }
        }
        debugLog(`All items for player ${player.name} have been ${shouldLock ? 'locked' : 'unlocked'}.`);
    } catch (e) {
        sendErrorLogToDiscord("Item Lock/Unlock Failed", player, e);
        console.error(`[LockItems] Error for ${player.name}:`, e);
    }
}

/**
 * @param {string} url
 * @param {HttpRequestMethod} method
 * @param {object} data
 * @returns {Promise<any>}
 */
async function sendHttpRequest(url: any, method: any, data: any) {
    const req = new HttpRequest(url);
    req.body = JSON.stringify(data);
    req.method = method;
    req.headers = [new HttpHeader("Content-Type", "application/json")];
    const response = await http.request(req);
    if (response.status === 200) {
        return JSON.parse(response.body);
    } else if (response.status === 404) {
        console.warn(`${url} returned 404 Not Found.`);
        return null;
    } else {
        throw new Error(`HTTP Error: ${response.status} - ${response.body}`);
    }
}

/**
 * @param {Player} player
 * @returns {Promise<string | null>}
 */
async function getLastKnownServer(player: any) {
    try {
        const response = await sendHttpRequest(`${LOGIN_SERVER_URL}/getserver`, HttpRequestMethod.Post, { player_name: player.name });
        return response ? response.server_id : null;
    } catch (e) {
        await sendErrorLogToDiscord("Get Last Known Server Failed", player, e);
        console.error(`[LoginManager] Failed to get last known server for ${player.name}:`, e);
        return null;
    }
}

/**
 * @param {Player} player
 * @param {string} serverId
 * @returns {Promise<boolean>}
 */
async function updateLastKnownServer(player: any, serverId: any) {
    try {
        await sendHttpRequest(`${LOGIN_SERVER_URL}/update`, HttpRequestMethod.Post, { player_name: player.name, server_id: serverId });
        console.log(`[LoginManager] Updated last known server for ${player.name} to ${serverId}`);
        return true;
    } catch (e) {
        await sendErrorLogToDiscord("Update Last Known Server Failed", player, e, `Target Server ID: ${serverId}`);
        console.error(`[LoginManager] Failed to update last known server for ${player.name}:`, e);
        return false;
    }
}

/**
 * @param {Player} player
 */
export async function savePlayerData(player: any) {
    try {
        const health = player.getComponent("health");
        const inventoryComponent = player.getComponent(EntityComponentTypes.Inventory);
        const jobsData = [];
        for (const job of jobs_config.jobsList) {
            const jobData = new JobLevel(player, job.id);
            const data = {
                id: job.id,
                lv: jobData.getLevel(),
                xp: jobData.getXp()
            }
            jobsData.push(data);
        };
        const playerData = {
            health: health.currentValue,
            inventory: getInventoryData(inventoryComponent.container),
            equipment: getEquipmentData(player),
            attributes: getAttributesData(player),
            effects: getEffectsData(player),
            experience: {
                totalXp: player.getTotalXp(),
                level: player.level,
                xpEarnedAtCurrentLevel: player.xpEarnedAtCurrentLevel,
            },
            jobs: jobsData,
            lastServer: CURRENT_SERVER_ID,
        };
        debugLog(`Saving data for player: ${player.name}`);
        await sendHttpRequest(`${PLAYER_DATA_SERVER_URL}/save`, HttpRequestMethod.Post, {
            playerName: player.name,
            data: playerData,
        });
        debugLog(`Player data for ${player.name} saved successfully.`);
    } catch (error) {
        await sendErrorLogToDiscord("Save Player Data Failed", player, error);
        console.error(`[SaveData] Error saving player data for ${player.name}:`, error);
        if (player.isValid) player.sendMessage({ translate: "transfer.error.save_failed" });
        throw error;
    }
}

/**
 * @param {Player} player
 */
async function loadPlayerData(player: any) {
    try {
        let playerData = null;
        for (let attempt = 1; attempt <= 3; attempt++) {
            playerData = await sendHttpRequest(`${PLAYER_DATA_SERVER_URL}/load`, HttpRequestMethod.Post, { playerName: player.name });
            if (playerData) break;
            if (attempt < 3 && player.isValid) {
                player.sendMessage({ translate: "transfer.retry.load_missing", with: [`${attempt}`] });
                await system.waitTicks(40);
            }
        }

        if (!playerData || playerData.lastServer === CURRENT_SERVER_ID) {
            console.warn(`[LoadData] Skipping data load for ${player.name}. Reason: No data found or rejoining the same server.`);
            await savePlayerData(player);
            return;
        }

        player.sendMessage({ translate: "transfer.sync.progress" });
        await applyPlayerData(player, playerData);
        player.sendMessage({ translate: "transfer.sync.completed" });
        await savePlayerData(player);
    } catch (error) {
        await sendErrorLogToDiscord("Load Player Data Failed", player, error);
        console.error(`[LoadData] Error in loadPlayerData for ${player.name}:`, error);
        if (player.isValid) {
            player.runCommand('kick "' + player.name + '" §cFailed to load player data. Please contact staff.');
        }
    }
}

/**
 * @param {Player} player
 * @param {object} playerData
 */
async function applyPlayerData(player: any, playerData: any) {
    debugLog("Applying data for player:", player.name);
    await clearInventoryAndEquipment(player);
    const health = player.getComponent("health");
    if (health && playerData.health !== undefined) health.setCurrentValue(playerData.health);
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    if (inventory?.container && playerData.inventory) {
        await applyItemsToContainer(inventory.container, playerData.inventory.contents);
    }
    const equippable = player.getComponent(EntityComponentTypes.Equippable);
    if (equippable && playerData.equipment) {
        for (const slotName in playerData.equipment) {
            const itemData = playerData.equipment[slotName];
            if (itemData) {
                const slot = stringToEquipmentSlot(slotName);
                if (slot) equippable.setEquipment(slot, createItemStackFromData(itemData));
            }
        }
    }
    if (playerData.attributes) {
        for (const attr of playerData.attributes) {
            const component = player.getComponent(attr.id);
            if (component && 'setCurrentValue' in component) {
                component.setCurrentValue(attr.currentValue);
            }
        }
    }
    if (playerData.effects) {
        player.getEffects().forEach((effect: any) => player.removeEffect(effect.typeId));
        for (const effect of playerData.effects) {
            let duration = effect.duration;
            if (duration === -1) duration = 20000000;
            player.addEffect(effect.typeId, duration, { amplifier: effect.amplifier, showParticles: true });
        }
    }
    if (playerData.experience) {
        player.resetLevel();
        player.addLevels(playerData.experience.level);
        player.addExperience(playerData.experience.totalXp - player.getTotalXp());
    }
    if (playerData.jobs) {
        const jobsData = playerData.jobs ?? [];
        for (const job of jobsData) {
            const jobData = new JobLevel(player, job.id);
            jobData.setLevel(Math.max((job.lv ?? 0), jobData.getLevel()));
            jobData.setXp(Math.max(job.xp ?? 0));
        };
    };
}

/**
 * @param {import("@minecraft/server").Container} container
 * @returns {object}
 */
function getInventoryData(container: any) {
    const contents: any = [];
    if (!container) return { contents };
    for (let i = 0; i < container.size; i++) {
        contents.push(containerToData(container.getItem(i)));
    }
    return { contents };
}

/**
 * @param {Player} player
 * @returns {object}
 */
function getEquipmentData(player: any) {
    const equipment = {};
    const equippable = player.getComponent(EntityComponentTypes.Equippable);
    if (equippable) {
        for (const slotKey in EquipmentSlot) {
            if (isNaN(parseInt(slotKey))) {
                if (slotKey != EquipmentSlot.Mainhand) {
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    const slot = EquipmentSlot[slotKey];
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    equipment[slot.toLowerCase()] = containerToData(equippable.getEquipment(slot));
                };
            }
        }
    }
    return equipment;
}

/**
 * @param {ItemStack | undefined} item
 * @returns {object | undefined}
 */
function containerToData(item: any) {
    if (!item) return undefined;
    const dyp = (item.getDynamicPropertyIds() || []).map((id: any) => ({
        id,
        data: item.getDynamicProperty(id)
    }));
    const enchantments = item.getComponent(ItemComponentTypes.Enchantable)?.getEnchantments().map((ench: any) => ({
        typeId: ench.type.id,
        level: ench.level
    }));
    const potionComponent = item.getComponent(ItemComponentTypes.Potion);
    let potion = [];
    if (potionComponent?.isValid) {
        potion.push({ id: potionComponent.potionEffectType.id, durationTicks: potionComponent.potionEffectType?.durationTicks, deliveryType: potionComponent.potionDeliveryType.id })
    };
    const damage = item.getComponent(ItemComponentTypes.Durability)?.damage;
    return {
        typeId: item.typeId,
        amount: item.amount,
        nameTag: item.nameTag,
        lore: item.getLore(),
        enchantments: enchantments,
        nbt: damage,
        dyp: dyp,
        potion: potion,
    };
}

/**
 * @param {Player} player
 * @returns {object[]}
 */
function getAttributesData(player: any) {
    const attributes = [];
    const movement = player.getComponent("movement");
    if (movement) attributes.push({ id: "minecraft:movement", currentValue: movement.currentValue });
    return attributes;
}

/**
 * @param {Player} player
 * @returns {object[]}
 */
function getEffectsData(player: any) {
    return player.getEffects().map((effect: any) => ({
        typeId: effect.typeId,
        amplifier: effect.amplifier,
        duration: effect.duration,
        displayName: effect.displayName
    }));
}

/**
 * @param {Player} player
 */
async function clearInventoryAndEquipment(player: any) {
    const inventory = player.getComponent(EntityComponentTypes.Inventory);
    if (inventory?.container) {
        inventory.container.clearAll();
    }
    const equippable = player.getComponent(EntityComponentTypes.Equippable);
    if (equippable) {
        for (const slotKey in EquipmentSlot) {
            if (slotKey != EquipmentSlot.Mainhand) {
                if (isNaN(parseInt(slotKey))) {
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    equippable.setEquipment(EquipmentSlot[slotKey], undefined);
                }
            }
        }
    }
}

/**
 * @param {object} itemData
 * @returns {ItemStack}
 */
function createItemStackFromData(itemData: any) {
    let itemStack = new ItemStack(itemData.typeId);
    const potionComponent = itemStack.getComponent(ItemComponentTypes.Potion);
    if (potionComponent && itemData.potion) {
        if (itemData.potion.length > 0) {
            const potion = itemData.potion[0]
            console.log(JSON.stringify(itemData.potion[0]))
            //itemStack = Potions.resolve({ id: potion.id, durationTicks: potion?.durationTicks }, { id: potion.deliveryType });
            itemStack = Potions.resolve(potion.id, potion.deliveryType);
        };
    };
    itemStack.amount = itemData.amount;
    if (itemData.nameTag) itemStack.nameTag = itemData.nameTag;
    if (itemData.lore) itemStack.setLore(itemData.lore);
    const durability = itemStack.getComponent("durability");
    if (durability && itemData.nbt) durability.damage = itemData.nbt;
    const enchantable = itemStack.getComponent(ItemComponentTypes.Enchantable);
    if (enchantable && itemData.enchantments) {
        for (const enchData of itemData.enchantments) {
            const type = EnchantmentTypes.get(enchData.typeId);
            // @ts-ignore TS(2339): Property 'addEnchantment' does not exist on type '... Remove this comment to see the full error message
            if (type) enchantable.addEnchantment({ type, level: enchData.level });
        }
    }

    if (itemData.dyp) {
        for (const dypData of itemData.dyp) {
            itemStack.setDynamicProperty(dypData.id, dypData.data);
        }
    }
    return itemStack;
}

/**
 * @param {import("@minecraft/server").Container} container
 * @param {object[]} itemsData
 */
async function applyItemsToContainer(container: any, itemsData: any) {
    for (let i = 0; i < itemsData.length; i++) {
        const itemData = itemsData[i];
        if (itemData && i < container.size) {
            container.setItem(i, createItemStackFromData(itemData));
        }
    }
}

/**
 * @param {string} slotName
 * @returns {EquipmentSlot | undefined}
 */
function stringToEquipmentSlot(slotName: any) {
    const capitalized = slotName.charAt(0).toUpperCase() + slotName.slice(1);
    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    return EquipmentSlot[capitalized] || undefined;
}

/**
 * @param {Player} player
 */
export async function formshow(player: any) {
    await showServerTransferForm(player);
}

/**
 * @param {Player} player
 */
async function showServerTransferForm(player: any) {
    if (player.hasTag(STATUS_TAG.TRANSFERRING) || player.hasTag(STATUS_TAG.LOADING)) {
        player.sendMessage({ translate: "transfer.error.busy" });
        return;
    }
    player.sendMessage({ translate: "transfer.menu.opening" });
    lockItems(player, true);
    try {
        const form = new ActionFormData();
        form.title({ translate: "transfer.form.title" });
        form.body({ translate: "transfer.form.body" });
        const availableServers = Object.values(servers).filter(s => s.id !== CURRENT_SERVER_ID);
        availableServers.forEach(s => form.button(s.name));
        const res = await form.show(player);
        if (res.canceled) {
            player.sendMessage({ translate: "transfer.form.cancelled" });
            return;
        }
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        const selectedServer = availableServers[res.selection];
        if (selectedServer) {
            await handleServerTransfer(player, selectedServer);
        }
    } catch (error) {
        await sendErrorLogToDiscord("Server Transfer Form Failed", player, error);
        console.error("[showServerTransferForm] Error:", error);
        player.sendMessage({ translate: "transfer.form.error" });
    } finally {
        if (player.isValid && !player.hasTag(STATUS_TAG.TRANSFERRING)) {
            lockItems(player, false);
            player.sendMessage({ translate: "transfer.lock.released" });
        }
    }
}

/**
 * @param {Player} player
 * @param {object} serverInfo
 */
async function handleServerTransfer(player: any, serverInfo: any) {
    const { warnItems, outItems } = checkPlayerInventoryForTransfer(player);
    if (outItems.length > 0) {
        const body = [{ translate: 'transfer.error.prohibited_items' }];
        // @ts-ignore TS(2345): Argument of type '{ translate: string; }' is not a... Remove this comment to see the full error message
        outItems.forEach(itemName => body.push({ text: '§r§c\n・' }, { translate: langChangeItemName(itemName) }));
        player.sendMessage({ rawtext: body });
        return;
    }
    if (warnItems.length > 0) {
        const proceed = await showWarningConfirmationForm(player, warnItems);
        if (!proceed) {
            player.sendMessage({ translate: "transfer.move.cancelled" });
            return;
        }
    }
    player.addTag(STATUS_TAG.TRANSFERRING);
    try {
        player.sendMessage({ translate: "transfer.move.starting" });
        const updateSuccess = await updateLastKnownServer(player, serverInfo.id);
        if (!updateSuccess) throw new Error("Failed to update login server information.");
        await savePlayerData(player);
        player.sendMessage({ translate: "transfer.move.target", with: [String(serverInfo.name)] });
        transferPlayer(player, { hostname: serverInfo.address, port: serverInfo.port });
    } catch (error) {
        await sendErrorLogToDiscord("Server Transfer Failed", player, error, "Target Server: " + serverInfo.name + " (" + serverInfo.id + ")");
        console.error("[Transfer] Error:", error);
        player.sendMessage({ translate: "transfer.move.error" });
        await updateLastKnownServer(player, CURRENT_SERVER_ID);
        if (player.isValid) {
            player.removeTag(STATUS_TAG.TRANSFERRING);
        }
    }
}

/**
 * @param {Player} player
 * @returns {{warnItems: string[], outItems: string[]}}
 */
function checkPlayerInventoryForTransfer(player: any) {
    const warnItemData = new Set();
    const outItemData = new Set();
    const inventory = player.getComponent('inventory').container;
    const equippable = player.getComponent('equippable');
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (!item) continue;
        if (warnItems.includes(item.typeId)) warnItemData.add(item.typeId);
        if (outItems.includes(item.typeId)) {
            outItemData.add(item.typeId);
        }
    }
    const equipmentSlots = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand];
    for (const slot of equipmentSlots) {
        const item = equippable.getEquipment(slot);
        if (!item) continue;
        if (warnItems.includes(item.typeId)) warnItemData.add(item.typeId);
        if (outItems.includes(item.typeId)) outItemData.add(item.typeId);
    }
    return { warnItems: [...warnItemData], outItems: [...outItemData] };
}

/**
 * @param {Player} player
 * @param {string[]} items
 * @returns {Promise<boolean>}
 */
function showWarningConfirmationForm(player: any, items: any) {
    return new Promise((resolve) => {
        const form = new ActionFormData();
        form.title({ translate: 'transfer.warning.title' });
        const body = [{ translate: 'transfer.warning.body' }];
        // @ts-ignore TS(2345): Argument of type '{ translate: string; }' is not a... Remove this comment to see the full error message
        items.forEach((itemName: any) => body.push({ text: '§r§e\n・' }, { translate: langChangeItemName(itemName) }));
        form.body({ rawtext: body });
        form.button({ translate: 'common.no' });
        form.button({ translate: 'common.yes' });
        form.show(player).then(res => resolve(res.selection === 1));
    });
}

// --- 繧､繝吶Φ繝医ワ繝ｳ繝峨Λ ---

world.afterEvents.playerSpawn.subscribe((ev) => {
    if (config.world == 'dev') {
        return;
    };
    if (!ev.initialSpawn) return;
    const player = ev.player;
    player.removeTag(STATUS_TAG.TRANSFERRING);
    player.removeTag(STATUS_TAG.LOADING);
    system.run(async () => {
        player.addTag(STATUS_TAG.LOADING);
        lockItems(player, true);
        try {
            player.sendMessage({ translate: "transfer.login.checking" });
            const expectedServerId = await getLastKnownServer(player);
            if (expectedServerId === null) {
                const err = new Error("Player connected without login server entry. Expected Hub server registration first.");
                await sendErrorLogToDiscord("Anomalous Connection", player, err);
                player.runCommand('kick "' + player.name + '" §cLogin verification failed.');
                return;
            }
            else if (expectedServerId === CURRENT_SERVER_ID) {
                await loadPlayerData(player);
            }
            else {
                const serverName = Object.values(servers).find(s => s.id === expectedServerId)?.name ?? "Unknown";
                player.sendMessage({ translate: "transfer.login.wrong_server", with: [String(serverName)] });
                const targetServerInfo = Object.values(servers).find(s => s.id === expectedServerId);
                if (targetServerInfo) {
                    // @ts-ignore TS(2379): Argument of type 'import("C:/Users/karon/node_modu... Remove this comment to see the full error message
                    transferPlayer(player, { hostname: targetServerInfo.address, port: targetServerInfo.port });
                } else {
                    // @ts-ignore TS(2379): Argument of type 'import("C:/Users/karon/node_modu... Remove this comment to see the full error message
                    transferPlayer(player, { hostname: servers.earth.address, port: servers.earth.port });
                }
                return;
            }
        } catch (e) {
            await sendErrorLogToDiscord("Player Login Process Failed", player, e);
            if (player.isValid) {
                player.runCommand('kick "' + player.name + '" §cAn unexpected error occurred during login processing.');
            }
        } finally {
            if (player.isValid && player.hasTag(STATUS_TAG.LOADING)) {
                lockItems(player, false);
                player.removeTag(STATUS_TAG.LOADING);
                player.sendMessage({ translate: "transfer.login.completed" });
            }
        }
    });
});
