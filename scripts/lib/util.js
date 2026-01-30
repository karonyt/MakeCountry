import { Block, BlockTypes, Entity, Player, ItemStack } from "@minecraft/server";
import * as Dyprop from "./DyProp";
import config from "../config";
import jobs_config from "../jobs_config";
import { DynamicProperties } from "../api/dyp";
import { checkOnlyRole } from "../data/permission";

/**
 * 指定した座標、ディメンションのチャンクのダイプロのプロパティを取得
 * @param {number} rawX マイクラのX座標
 * @param {number} rawZ マイクラのZ座標 
 * @param {string} dimension ディメンションID
 * @returns {string}
 */
export function GetChunkPropertyId(rawX, rawZ, dimension = `overworld`) {
    const x = Math.floor(rawX / 16);
    const z = Math.floor(rawZ / 16);
    return `chunk_${x}_${z}_${dimension.replace(`minecraft:`, ``)}`;
};

/**
 * プレイヤーがいるチャンクのダイプロのidを取得
 * @param {Player|Entity|Block} player
 * @returns {string}
 */
export function GetPlayerChunkPropertyId(player) {
    let { x: rawX, z: rawZ } = player.location;
    const x = Math.floor(rawX / 16);
    const z = Math.floor(rawZ / 16);
    return `chunk_${x}_${z}_${player.dimension.id.replace(`minecraft:`, ``)}`;
};

/**
 * 指定したIDのダイプロのデータをJSON.parseして取得
 * @param {string} id
 * @param {DynamicProperties} database 
 * @returns {any|undefined}
 */
export function GetAndParsePropertyData(id, database = undefined) {
    if (!database) {
        if (id.includes('_')) {
            const database = new DynamicProperties(id.split('_')[0]);
            const data = database.get(id);
            return data ? JSON.parse(data) : undefined;
        }
        const data = Dyprop.getDynamicProperty(id);
        return data ? JSON.parse(data) : undefined;
    }
    let dataString = database.get(id);
    if (!dataString || typeof dataString !== "string") return undefined;
    try {
        const parseData = JSON.parse(dataString);
        return parseData;
    } catch (error) {
        console.warn(error);
        return undefined;
    }
};

/**
 * 指定したIDのダイプロにデータをJSON形式にして保存
 * @param {string} id
 * @param {any} data
 * @param {DynamicProperties} database 
 * @returns 
 */
export function StringifyAndSavePropertyData(id, data, database = undefined) {
    if (!database) {
        if (id.includes('_')) {
            const database = new DynamicProperties(id.split('_')[0]);
            database.set(id, JSON.stringify(data));
            return;
        }
        Dyprop.setDynamicProperty(id, JSON.stringify(data));
        return;
    }
    database.set(id, JSON.stringify(data));
    return;
};

/**
 * x座標とz座標をチャンクデータに変換
 * @param {*} rawX 
 * @param {*} rawZ 
 * @returns {{x: number, z: number}}
 */
export function ConvertChunk(rawX, rawZ) {
    const x = Math.floor(rawX / 16);
    const z = Math.floor(rawZ / 16);
    return { x, z }
};

/**
 * 権限確認
 * @param {Player|string} player 
 * @param {string} permission 
 * @returns {boolean} true = キャンセル / false = 許可
 */
export function CheckPermission(player, permission) {
    // ====== playerId 解決 ======
    let playerId;
    if (player instanceof Player) playerId = player.id;
    else if (typeof player === "string") playerId = player;
    else return true;

    // ====== AdminMode ======
    if (player instanceof Player && player.hasTag("adminmode")) return false;

    // ====== 関数スコープキャッシュ ======
    const roleCache = new Map();
    const countryCache = new Map();
    const getRole = (id) => {
        if (!roleCache.has(id)) {
            roleCache.set(id, GetAndParsePropertyData(`role_${id}`));
        }
        return roleCache.get(id);
    };
    const getCountry = (id) => {
        if (!countryCache.has(id)) {
            countryCache.set(id, GetAndParsePropertyData(`country_${id}`));
        }
        return countryCache.get(id);
    };

    // ====== 共通権限判定 ======
    const hasRolePermission = (playerData, perm) => {
        for (const roleId of playerData.roles ?? []) {
            const perms = getRole(roleId)?.permissions ?? [];
            if (
                perms.includes(perm) ||
                perms.includes("admin") ||
                perms.includes("owner")
            ) return true;
        }
        return false;
    };

    // ====== データ取得 ======
    const playerData = GetAndParsePropertyData(`player_${playerId}`);
    const chunkData = player instanceof Player
        ? GetAndParsePropertyData(GetPlayerChunkPropertyId(player))
        : undefined;

    // ====== ロールのみチェック ======
    if (checkOnlyRole.includes(permission)) {
        const countryData = getCountry(playerData?.country);
        if (countryData?.owner === playerId) return false;
        return !hasRolePermission(playerData, permission);
    }

    // ====== チャンクなし / 荒野 ======
    if (!chunkData || (!chunkData.countryId && !chunkData.owner && !chunkData.special)) {
        return !config.wildernessAllowPermissions.includes(permission);
    }

    // ====== 特別区 ======
    if (chunkData.special) {
        return !config.specialAllowPermissions.includes(permission);
    }

    // ====== plot 解決 ======
    const plot = chunkData.plot?.group
        ? GetAndParsePropertyData(`plotgroup_${chunkData.plot.group}`)
        : chunkData.plot;

    // ====== private plot ======
    if (plot?.enable && plot.type === "private") {
        if (plot.owner === playerData?.id) return false;
        if (plot.permissions?.includes(permission)) return false;

        const playerEntry = plot.players?.find(p => p.id === playerData?.id);
        if (playerEntry?.permissions?.includes(permission)) return false;

        if (playerData?.country === chunkData.countryId) {
            const countryData = getCountry(chunkData.countryId);
            if (countryData?.owner === playerData?.id) return false;
            if (hasRolePermission(playerData, permission)) return false;
        }
        return true;
    }

    // ====== embassy plot ======
    if (plot?.enable && plot.type === "embassy" && plot.owner) {
        const ownerData = GetAndParsePropertyData(`player_${plot.owner}`);
        const plotCountryData = getCountry(ownerData?.country);

        if (playerData?.country === plotCountryData?.id) {
            if (plot.permissions?.includes(permission)) return false;
            if (plotCountryData?.owner === playerData?.id) return false;
            if (hasRolePermission(playerData, permission)) return false;
            return true;
        }

        if (chunkData.countryId === playerData?.country) {
            const countryData = getCountry(chunkData.countryId);
            if (countryData?.owner === playerData?.id) return false;
            if (hasRolePermission(playerData, "admin")) return false;
        }

        if (plot.countries?.some(c => c.id === playerData?.country && c.permissions.includes(permission))) {
            return false;
        }
        return true;
    }

    // ====== public plot ======
    if (plot?.enable && plot.type === "public") {
        if (plot.players?.some(p => p.id === playerData?.id && p.permissions.includes(permission))) {
            return false;
        }

        if (playerData?.country === chunkData.countryId) {
            if (plot.permissions?.includes(permission)) return false;
            if (plot.roles?.some(r => r.permissions.includes(permission) && playerData.roles.includes(r.id))) {
                return false;
            }
            const countryData = getCountry(chunkData.countryId);
            if (countryData?.owner === playerData?.id) return false;
            if (hasRolePermission(playerData, "admin")) return false;
            return true;
        }

        if (plot.countries?.some(c => c.id === playerData?.country && c.permissions.includes(permission))) {
            return false;
        }
        return true;
    }

    // ====== 国単位 ======
    if (chunkData.countryId) {
        const countryData = getCountry(chunkData.countryId);

        if (countryData?.id === playerData?.country) {
            if (countryData?.owner === playerData?.id) return false;
            if (hasRolePermission(playerData, "admin")) return false;
            return true;
        }

        if (countryData.alliance?.includes(playerData.country)) {
            return !countryData.alliancePermission.includes(permission);
        }
        if (countryData.hostility?.includes(playerData.country)) {
            return !countryData.hostilityPermission.includes(permission);
        }
        if (countryData.friendly?.includes(playerData.country)) {
            return !countryData.friendlyPermission.includes(permission);
        }

        return !countryData.neutralityPermission.includes(permission);
    }

    return false;
}

/**
 * 権限確認（座標指定）
 * @param {Player} player
 * @param {number} x
 * @param {number} z
 * @param {string} dimensionId
 * @param {string} permission
 * @returns {boolean} true = キャンセル / false = 許可
 */
export function CheckPermissionFromLocation(player, x, z, dimensionId, permission) {
    // ===== AdminMode =====
    if (player.hasTag("adminmode")) return false;

    // ===== キャッシュ =====
    const roleCache = new Map();
    const countryCache = new Map();

    const getRole = (id) => {
        if (!roleCache.has(id)) {
            roleCache.set(id, GetAndParsePropertyData(`role_${id}`));
        }
        return roleCache.get(id);
    };

    const getCountry = (id) => {
        if (!countryCache.has(id)) {
            countryCache.set(id, GetAndParsePropertyData(`country_${id}`));
        }
        return countryCache.get(id);
    };

    const hasRolePermission = (playerData, perm) => {
        for (const roleId of playerData.roles ?? []) {
            const perms = getRole(roleId)?.permissions ?? [];
            if (
                perms.includes(perm) ||
                perms.includes("admin") ||
                perms.includes("owner") ||
                perms.includes("plotAdmin")
            ) return true;
        }
        return false;
    };

    // ===== データ取得 =====

    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const chunkData = GetAndParsePropertyData(
        GetChunkPropertyId(x, z, dimensionId)
    );

    // ===== チャンクなし(荒野) =====
    if (!chunkData) {
        if (config.isNoPiston && permission === "placePiston") return true;
        return !config.wildernessAllowPermissions.includes(permission);
    }

    // ===== 荒野 =====
    if (!chunkData?.countryId && !chunkData.owner && !chunkData.special) {
        if (config.isNoPiston && permission === "placePiston") return true;
        return !config.wildernessAllowPermissions.includes(permission);
    }

    // ===== 特別区 =====
    if (chunkData?.special) {
        return !config.specialAllowPermissions.includes(permission);
    }

    // ===== plot 解決 =====
    const plotGroupDB = new DynamicProperties('plotgroup');

    const plot = chunkData.plot?.group
        ? plotGroupDB.get(`plotgroup_${chunkData.plot.group}`) ? JSON.parse(plotGroupDB.get(`plotgroup_${chunkData.plot.group}`)) : chunkData.plot
        : chunkData.plot;

    // ===== private plot =====
    if (plot?.enable && plot.type === "private") {
        if (plot.owner === playerData.id) return false;
        if (plot.permissions?.includes(permission)) return false;

        const playerEntry = plot.players?.find(p => p.id === playerData.id);
        if (playerEntry?.permissions?.includes(permission)) return false;

        if (playerData.country === chunkData.countryId) {
            const countryData = getCountry(chunkData.countryId);
            if (countryData?.owner === playerData.id) return false;
            if (hasRolePermission(playerData, permission)) return false;
        }
        return true;
    }

    // ===== embassy plot =====
    if (plot?.enable && plot.type === "embassy" && plot.owner) {
        const ownerData = GetAndParsePropertyData(`player_${plot.owner}`);
        const plotCountryData = getCountry(ownerData?.country);

        if (playerData.country === plotCountryData?.id) {
            if (plot.permissions?.includes(permission)) return false;
            if (plotCountryData?.owner === playerData.id) return false;
            if (hasRolePermission(playerData, permission)) return false;
            return true;
        }

        if (chunkData.countryId === playerData.country) {
            const countryData = getCountry(chunkData.countryId);
            if (countryData?.owner === playerData.id) return false;
            if (hasRolePermission(playerData, "admin")) return false;
        }

        if (plot.countries?.some(c => c.id === playerData.country && c.permissions.includes(permission))) {
            return false;
        }
        return true;
    }

    // ===== public plot =====
    if (plot?.enable && plot.type === "public") {
        if (plot.players?.some(p => p.id === playerData.id && p.permissions.includes(permission))) {
            return false;
        }

        if (playerData.country === chunkData.countryId) {
            if (plot.permissions?.includes(permission)) return false;
            if (plot.roles?.some(r =>
                r.permissions.includes(permission) &&
                playerData.roles.includes(r.id)
            )) return false;

            const countryData = getCountry(chunkData.countryId);
            if (countryData?.owner === playerData.id) return false;
            if (hasRolePermission(playerData, "admin")) return false;
            return true;
        }

        if (plot.countries?.some(c => c.id === playerData.country && c.permissions.includes(permission))) {
            return false;
        }
        return true;
    }

    // ===== 国単位 =====
    if (chunkData?.countryId) {
        const countryData = getCountry(chunkData.countryId);

        if (countryData?.id === playerData.country) {
            if (countryData.owner === playerData.id) return false;
            if (hasRolePermission(playerData, permission)) return false;
            return true;
        }

        if (countryData.alliance?.includes(playerData.country)) {
            return !countryData.alliancePermission.includes(permission);
        }
        if (countryData.hostility?.includes(playerData.country)) {
            return !countryData.hostilityPermission.includes(permission);
        }
        if (countryData.friendly?.includes(playerData.country)) {
            return !countryData.friendlyPermission.includes(permission);
        }

        return !countryData.neutralityPermission?.includes(permission);
    }

    return false;
}

/**
 * 権限があるか確認
 * @param {Player} player 
 * @param {string} permission 
 * @returns {boolean}
 */
export function HasPermission(player, permission) {
    if (player.hasTag(`adminmode`)) return true;
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const countryData = GetAndParsePropertyData(`country_${playerData?.country}`);
    if (countryData?.owner == player.id) return true;
    for (const role of playerData.roles) {
        if (GetAndParsePropertyData(`role_${role}`)?.permissions.includes(`admin`) || GetAndParsePropertyData(`role_${role}`)?.permissions.includes(permission)) return true;
    };
    return false;
};

export function getRandomInteger(min, max) {
    return Math.floor((Math.random() * (max - min) + min) * 100 * jobs_config.jobRewardMagnification) / 100;
};

/**
 * 数値かどうか
 * @param {number|string} value 
 * @returns 
 */
export function isDecimalNumber(value) {
    const integerRegex = /^[1-9]\d*$/;
    return integerRegex.test(value);
};

/**
 * 
 * @param {number} value 
 * @returns {boolean}
 */
export function isDecimalNumberZeroOK(value) {
    if (value == 0) {
        return true;
    };
    const integerRegex = /^[1-9]\d*$/;
    return integerRegex.test(value);
};

/**
 * 
 * @param {number} value 
 * @returns {boolean}
 */
export function isNumber(value) {
    if (value == 0) {
        return true;
    };
    const integerRegex = /^[1-9]\d*$/;
    return integerRegex.test(Math.abs(value));
};

export function isWithinTimeRange(startTime, endTime) {
    const date = new Date();
    const currentHour = date.getHours();
    const currentMinute = date.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const startMinutes = startTime.hour * 60 + startTime.min;
    const endMinutes = endTime.hour * 60 + endTime.min;

    if (startMinutes <= endMinutes) {
        // 同じ日内の範囲
        return currentTime >= startMinutes && currentTime <= endMinutes;
    } else {
        // 日付をまたぐ範囲
        return currentTime >= startMinutes || currentTime <= endMinutes;
    };
};

export function getTimeBefore(time, minutesBefore) {
    // 与えられた時間と分から、合計分を計算
    let totalMinutes = time.hour * 60 + time.min;

    // 指定された時間よりも前に戻す
    totalMinutes -= minutesBefore;

    // 時間が0よりも小さい場合、日付を巻き戻す
    if (totalMinutes < 0) {
        totalMinutes += 24 * 60; // 24時間分の分数を加算
    };

    // 時間と分に変換し直す
    const newHour = Math.floor(totalMinutes / 60);
    const newMin = totalMinutes % 60;

    // 新しい時間を返す
    return { hour: newHour, min: newMin };
};

/**
 * プレイヤー名からIDを取得
 * @param {string} playerName 
 * @returns {string}
 */
export function playerNameToId(playerName) {
    const playerDataBase = new DynamicProperties('player');
    const playerIds = playerDataBase.idList;
    return playerIds.find(id => playerName === GetAndParsePropertyData(id).name).split('_')[1];
};

/**
 * アイテムの名前をLangに変換
 * @param {string} itemName 
 * @returns {string}
 */
export function langChangeItemName(itemName) {
    return new ItemStack(itemName).localizationKey;
};

export const enchantIdToLang = {
    'protection': 'enchantment.protect.all',
    'fire_protection': 'enchantment.protect.fire',
    'feather_falling': 'enchantment.protect.fall',
    'blast_protection': 'enchantment.protect.explosion',
    'projectile_protection': 'enchantment.protect.projectile',
    'thorns': 'enchantment.thorns',
    'respiration': 'enchantment.oxygen',
    'depth_strider': 'enchantment.waterWalker',
    'depth_strider': 'enchantment.waterWorker',
    'aqua_affinity': 'enchantment.damage.all',
    'sharpness': 'enchantment.damage.all',
    'smite': 'enchantment.damage.undead',
    'bane_of_arthropods': 'enchantment.damage.arthropods',
    'knockback': 'enchantment.knockback',
    'fire_aspect': 'enchantment.fire',
    'looting': 'enchantment.lootBonus',
    'efficiency': 'enchantment.digging',
    'silk_touch': 'enchantment.untouching',
    'unbreaking': 'enchantment.durability',
    'fortune': 'enchantment.lootBonusDigger',
    'power': 'enchantment.arrowDamage',
    'punch': 'enchantment.arrowKnockback',
    'flame': 'enchantment.arrowFire',
    'infinity': 'enchantment.arrowInfinite',
    'luck_of_the_sea': 'enchantment.lootBonusFishing',
    'lure': 'enchantment.fishingSpeed',
    'frost_walker': 'enchantment.frostwalker',
    'mending': 'enchantment.mending',
    'binding': 'enchantment.curse.binding',
    'vanishing': 'enchantment.curse.vanishing',
    'impaling': 'enchantment.tridentImpaling',
    'riptide': 'enchantment.tridentRiptide',
    'loyalty': 'enchantment.tridentLoyalty',
    'channeling': 'enchantment.tridentChanneling',
    'multishot': 'enchantment.crossbowMultishot',
    'piercing': 'enchantment.crossbowPiercing',
    'quick_charge': 'enchantment.crossbowQuickCharge',
    'soul_speed': 'enchantment.soul_speed',
    'swift_sneak': 'enchantment.swift_sneak',
    'wind_burst': 'enchantment.heavy_weapon.windburst',
    'density': 'enchantment.heavy_weapon.density',
    'breach': 'enchantment.heavy_weapon.breach',
    'lunge': 'enchantment.lunge',
}