import { EntityDamageCause, GameMode, Player, system, world } from "@minecraft/server";
import { CheckPermissionFromLocation, GetAndParsePropertyData, getRandomInteger, StringifyAndSavePropertyData } from "./util";
import config from "../config";
import jobs_config from "../jobs_config";
import { chestShopConfig } from "../chest_shop_config";
import { getShopData, getSignTexts, isShopOwner } from "./chest_shop";
import { nameSet } from "./nameset";
import { JobLevel } from "./jobslevel";
import { DynamicProperties } from "../api/dyp";
import { chestLockDefaultForm } from "../forms/default/chest_lock/main";
import national_tier_level from "../national_tier_level";
import { updateRecipe } from "./recipe";
import { CountryManager } from "../api/country/country";
import { GrowthPlantReward } from "./jobs";
import { itemUseItems, projectileUseItems } from "../useitems_config";

world.beforeEvents.itemUse.subscribe((ev) => {
    const { source, itemStack } = ev;

    const { x, z } = source.location;
    const dimensionId = source.dimension.id;

    if (source.dimension.getEntities({ location: source.location, maxDistance: config.maxDropDistance, type: `mc:core` }).length > 0) {
        return;
    };

    if (itemUseItems.includes(itemStack?.typeId)) {
        ev.cancel = CheckPermissionFromLocation(source, x, z, dimensionId, 'itemUse');
        return;
    };

    if (projectileUseItems.includes(itemStack?.typeId)) {
        ev.cancel = CheckPermissionFromLocation(source, x, z, dimensionId, 'projectileUse');
        return;
    };
});

world.beforeEvents.entityHurt.subscribe((ev) => {
    const { hurtEntity, damageSource } = ev;
    const { x, z } = hurtEntity.location;
    if (damageSource.damagingEntity && (damageSource.damagingEntity instanceof Player)) {
        if (hurtEntity instanceof Player) {
            if (hurtEntity.dimension.getEntities({ location: hurtEntity.location, maxDistance: config.maxDropDistance, type: `mc:core` }).length > 0) {
                return;
            };

            ev.cancel = CheckPermissionFromLocation(damageSource.damagingEntity, x, z, hurtEntity.dimension.id, 'playerAttack');
            return;
        } else {
            if (hurtEntity.typeId == 'mc:core') {
                return;
            };

            if (hurtEntity.dimension.getEntities({ location: hurtEntity.location, maxDistance: config.maxDropDistance, type: `mc:core` }).length > 0) {
                return;
            };

            ev.cancel = CheckPermissionFromLocation(damageSource.damagingEntity, x, z, hurtEntity.dimension.id, 'entityAttack');
            return;
        };
    };
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        const permission = 'break';
        for (const player of world.getPlayers()) {
            const { x: px, y: py, z: pz } = player.location;
            if (!player.isOnGround) {
                for (let j = 1; j < 15; j++) {
                    let finish = false;
                    if (finish) break;
                    for (let i = -1; i < 2; i += 2) {
                        try {
                            const block = player.dimension.getBlock({ x: px + i, y: py - j, z: pz });
                            if (block?.isValid) {
                                const x = block.x;
                                const z = block.z;
                                if (block.typeId == "minecraft:farmland") {
                                    const cannot = CheckPermissionFromLocation(player, x, z, block.dimension.id, permission);
                                    if (cannot) {
                                        player.addEffect(`slow_falling`, 1, { amplifier: 15 / j, showParticles: false });
                                        if (!player?.startFallY) {
                                            player.startFallY = py;
                                        };
                                        finish = true;
                                        break;
                                    };
                                };
                            }
                        } catch (error) {
                        };
                        try {
                            const block2 = player.dimension.getBlock({ x: px, y: py - j, z: pz + i });
                            if (block2?.isValid) {
                                const x2 = block2.x;
                                const z2 = block2.z;
                                if (block2.typeId == "minecraft:farmland") {
                                    const cannot = CheckPermissionFromLocation(player, x2, z2, block.dimension.id, permission);
                                    if (cannot) {
                                        player.addEffect(`slow_falling`, 1, { amplifier: 15 / j, showParticles: false });
                                        if (!player?.startFallY) {
                                            player.startFallY = py;
                                        };
                                        finish = true;
                                        break;
                                    };
                                };
                            };
                        } catch (error) {
                        };
                    };
                    try {
                        const block = player.dimension.getBlock({ x: px, y: py - j, z: pz });
                        if (block?.isValid) {
                            const x = block.x;
                            const z = block.z;

                            if (block.typeId == "minecraft:farmland") {
                                const cannot = CheckPermissionFromLocation(player, x, z, block.dimension.id, permission);
                                if (cannot) {
                                    player.addEffect(`slow_falling`, 1, { amplifier: 15 / j, showParticles: false });
                                    if (!player?.startFallY) {
                                        player.startFallY = py;
                                    };
                                    finish = true;
                                    break;
                                };
                            };
                        };
                    } catch (error) {
                    };
                };
            };
            if (player.isOnGround && !player.isInWater && !player.isGliding) {
                if (player?.startFallY) {
                    let damage = Math.floor(player.startFallY - py - 3);
                    if (damage > 0) {
                        player.applyDamage(damage, { cause: EntityDamageCause.fall });
                    };
                    player.startFallY = null;
                };
            };
            if (player.isInWater) {
                player.startFallY = null;
            };
            if (player.isGliding) {
                player.startFallY = null;
            };
        };
    });
});

world.afterEvents.entityHurt.subscribe(ev => {
    if (!(ev.damageSource?.damagingEntity instanceof Player)) return;
    const player = ev.damageSource.damagingEntity;
    const container = player.getComponent(`inventory`).container;
    const mace = container.getItem(player.selectedSlotIndex);
    if (mace) {
        if (mace.typeId == "minecraft:mace") {
            player.startFallY = null;
            return;
        };
    };
});

world.beforeEvents.playerBreakBlock.subscribe(async (ev) => {
    const permission = 'break';
    const { player, block, dimension } = ev;
    const x = block.x;
    const y = block.y;
    const z = block.z;
    const now = Date.now();

    const chestId = `chest_${x}_${y}_${z}_${dimension.id}`;
    const chestLockData = GetAndParsePropertyData(chestId);
    const isChest = block.typeId.includes('chest');
    let pL = player.location;

    const dimId = dimension.id;

    if (block.typeId == 'minecraft:barrel') {
        const shopBlock = block.above();
        if (shopBlock && shopBlock?.typeId == 'mc:shop_block') {
            const barrelShopDB = new DynamicProperties('barrelShop');
            const x = shopBlock.x;
            const y = shopBlock.y;
            const z = shopBlock.z;
            const rawShopData = barrelShopDB.get(`shop_${dimId}_${x}_${y}_${z}`);
            if (!rawShopData) {
                return;
            };
            const shopData = JSON.parse(rawShopData);

            if (shopData.owner == player.id) {
                ev.cancel = false;
                return;
            };
            if (shopData.admins.includes(player.id)) {
                ev.cancel = false;
                return;
            };
            ev.cancel = true;
            return;
        };
    };

    if (block.typeId == 'mc:shop_block') {
        const barrel = block.below();
        if (!barrel || barrel?.typeId != 'minecraft:barrel') {
            return;
        };

        const barrelShopDB = new DynamicProperties('barrelShop');
        const x = block.x;
        const y = block.y;
        const z = block.z;
        const rawShopData = barrelShopDB.get(`shop_${dimId}_${x}_${y}_${z}`);
        if (!rawShopData) {
            return;
        };

        const shopData = JSON.parse(rawShopData);

        if (shopData.owner == player.id) {
            ev.cancel = false;
            return;
        };
        if (shopData.admins.includes(player.id)) {
            ev.cancel = false;
            return;
        };
        ev.cancel = true;
        return;
    };


    if (chestLockData) {
        const chestDataBase = new DynamicProperties("chest");
        if (isChest && (chestLockData.player === player.id || (chestLockData?.admin ? chestLockData.admin.includes(player.id) : false))) {
            system.runTimeout(() => chestDataBase.delete(chestId));
            return;
        } else if (isChest) {
            if (player.hasTag(`adminmode`)) return;
            ev.cancel = true;
            if (!player?.breaktp) {
                player.breaktp = true;
                system.run(() => {
                    player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} 1000 ${Math.floor(pL.z * 100) / 100}`);
                    player.setGameMode(GameMode.Adventure);
                });
                system.runTimeout(() => {
                    player.breaktp = false;
                    player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} ${Math.floor(pL.y * 100) / 100} ${Math.floor(pL.z * 100) / 100}`);
                    player.setGameMode(GameMode.Survival);
                }, 5);
            };
            const ownerName = GetAndParsePropertyData(`player_${chestLockData.player}`).name;
            player.sendMessage({ translate: 'message.thischest.islocked', with: [ownerName] });
        } else {
            system.runTimeout(() => chestDataBase.delete(chestId));
        }
        return;
    }

    const cannot = CheckPermissionFromLocation(player, x, z, dimension.id, permission);
    player.breakInfo = {
        time: Date.now(),
        typeId: block.typeId,
        location: { x: block.x, y: block.y, z: block.z },
        cancel: cannot
    };
    if (cannot) {
        /*if ('upper_block_bit' in states && states['upper_block_bit'] === true) {
            system.run(() => {
                system.run(() => {
                    const item = block.dimension.getEntities({ location: block.location, maxDistance: 5, type: `minecraft:item` }).find(item => item.getComponent(`item`).isValid && item.getComponent(`item`).itemStack.typeId == itemTypeId);
                    if (item) item.remove();
                });
                const door = block.below();
                const { x: bx, y: by, z: bz } = door.location;
                door.dimension.runCommand(`setblock ${bx} ${by} ${bz} ${typeId.replace(`minecraft:`, ``)} ["door_hinge_bit"=${doorPermutation['door_hinge_bit']},"open_bit"=${doorPermutation['open_bit']},"direction"=${doorPermutation['direction']}]`)
                return;
            });
            if (!player?.breaktp) {
                player.breaktp = true;
                system.run(() => {
                    player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} 1000 ${Math.floor(pL.z * 100) / 100}`);
                    player.setGameMode(GameMode.adventure);
                });
                system.runTimeout(() => {
                    player.breaktp = false;
                    player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} ${Math.floor(pL.y * 100) / 100} ${Math.floor(pL.z * 100) / 100}`);
                    player.setGameMode(GameMode.survival);
                }, 5);
            };
            return;
        };*/
    };
    ev.cancel = cannot;

    if (cannot) {
        player.sendMessage({ translate: `cannot.permission.${permission}` });
        if (!player?.breaktp) {
            player.breaktp = true;
            system.run(() => {
                player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} 1000 ${Math.floor(pL.z * 100) / 100}`);
                player.setGameMode(GameMode.Adventure);
            });
            system.runTimeout(() => {
                player.breaktp = false;
                player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} ${Math.floor(pL.y * 100) / 100} ${Math.floor(pL.z * 100) / 100}`);
                player.setGameMode(GameMode.Survival);
            }, 5);
        };
        return;
    }
});

world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    const permission = `place`
    const { player, block, permutationToPlace: permutationBeingPlaced } = ev;
    const x = block.x;
    const z = block.z;
    const now = Date.now();

    if (permutationBeingPlaced?.type.id.includes(`hopper`)) return;
    if (permutationBeingPlaced?.type.id.includes(`piston`)) return;
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    player.placeInfo = {
        time: now,
        typeId: permutationBeingPlaced?.type?.id,
        location: { x: block.x, y: block.y, z: block.z },
        cancel: cannot
    };
    ev.cancel = cannot;
    if (!cannot) {
        return
    };
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    const permission = `pistonPlace`
    const { player, block, permutationToPlace: permutationBeingPlaced } = ev;
    if (!permutationBeingPlaced?.type.id.includes(`piston`)) return;
    const x = block.x;
    const z = block.z;
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    ev.cancel = cannot;
    if (!cannot) return;
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block, permutationToPlace: permutationBeingPlaced } = ev;
    if (!permutationBeingPlaced?.type.id.includes(`hopper`)) return;
    const permission = `place`;
    const x = block.x;
    const z = block.z;
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    if (cannot) {
        ev.cancel = true;
        return;
    };
    const chest = block.above();
    if (!chest) return;
    //ショップ
    if (chest.typeId == 'minecraft:barrel') {
        const shopBlock = chest.above();
        if (shopBlock && shopBlock?.typeId == 'mc:shop_block') {
            const barrelShopDB = new DynamicProperties('barrelShop');
            const rawShopData = barrelShopDB.get(`shop_${shopBlock.dimension.id}_${shopBlock.x}_${shopBlock.y}_${shopBlock.z}_`);
            if (rawShopData) {
                const shopData = JSON.parse(rawShopData);
                const isOwner = shopData.owner == player.id;
                if (typeof isOwner != "undefined") {
                    if (isOwner == false && !player.hasTag(`adminmode`)) {
                        ev.cancel = true;
                        return;
                    };
                    if (isOwner == true) {
                        ev.cancel = false;
                    };
                };
            };
        }
    };

    //保護チェスト
    if (!chest.typeId.includes('chest')) return;
    const chestId = `chest_${chest.x}_${chest.y}_${chest.z}_${chest.dimension.id}`;
    const chestLockData = GetAndParsePropertyData(chestId);
    if (chestLockData) {
        if (player.hasTag(`adminmode`)) return;
        ev.cancel = true;
        //保護されているチェストの下にホッパーを置くことはできません
        player.sendMessage({ translate: `cannot.place.hopper.below.lockchest` });
    };
    return;
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const permission = `place`
    const { player, block } = ev;

    if (config.spawnerSpawnEggBlock && block.typeId == 'minecraft:mob_spawner') {
        ev.cancel = true;
        return;
    };
    const container = player.getComponent("inventory").container;
    if (!container.getItem(player.selectedSlotIndex)) return;
    const x = block.x;
    const z = block.z;
    const now = Date.now();
    /*if (player?.itemUseOnInfo) {
        if ((now - player?.itemUseOnInfo?.time) < 5000 && ev.block.typeId == player?.itemUseOnInfo?.typeId && ev.block.location == player?.itemUseOnnfo?.location) {
            ev.cancel = player?.itemUseOnInfo?.cancel;
            return;
        };
    };*/
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    /*player.itemUseOnInfo = {
        time: now,
        typeId: block?.typeId,
        location: { x: block.x, y: block.y, z: block.z },
        cancel: cannot
    };*/
    ev.cancel = cannot;
    if (!cannot) return;
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const permission2 = 'openContainer'; // コンテナの開放権限
    const permission = 'blockUse'; // ブロックの使用権限
    const { player, block } = ev;

    const isShopBlock = block.typeId.includes('shop_block'); // ショップブロックかどうか
    if (isShopBlock) return;

    const now = Date.now();
    const x = block.x;
    const y = block.y;
    const z = block.z;

    if (config.spawnerSpawnEggBlock && block.typeId == 'minecraft:mob_spawner') {
        ev.cancel = true;
        return;
    };

    const dimensionId = player.dimension.id;
    const chestId = `chest_${x}_${y}_${z}_${dimensionId}`;
    const isChest = block.typeId.includes('chest'); // チェストかどうか
    const playerId = player.id;
    const isSneaking = player.isSneaking; // スニーク状態かどうか
    const container = player.getComponent('inventory')?.container;
    const selectedItem = container?.getItem(player.selectedSlotIndex);

    // インベントリの操作確認
    if (block.getComponent('inventory')) {
        const cannot2 = CheckPermissionFromLocation(player, x, z, dimensionId, permission2);
        if (!cannot2) {
            const chestLockData = GetAndParsePropertyData(chestId);
            if (chestLockData) {
                const isOwner = (chestLockData.player === playerId || (chestLockData?.admin ? chestLockData.admin.includes(player.id) : false)); // 所有者かどうか
                const chestDataBase = new DynamicProperties("chest");
                if (isChest) {
                    if (isOwner && !isSneaking) return;
                    if (isOwner && isSneaking && !selectedItem) {
                        player.interactWithBlockInfo = {
                            time: now,
                            typeId: block?.typeId,
                            location: { x: block.x, y: block.y, z: block.z },
                            cancel: true
                        };
                        ev.cancel = true;
                        system.runTimeout(() => chestLockDefaultForm(player, chestId));
                        return;
                    }
                    if (player.hasTag(`adminmode`)) return;
                    player.interactWithBlockInfo = {
                        time: now,
                        typeId: block?.typeId,
                        location: { x: block.x, y: block.y, z: block.z },
                        cancel: true
                    };
                    ev.cancel = true;
                    player.sendMessage({ translate: 'message.thischest.islocked', with: [GetAndParsePropertyData(`player_${chestLockData.player}`).name] });
                    return;
                }
                if (!isChest) {
                    chestDataBase.delete(chestId);
                }
            } else if (isSneaking && isChest && !selectedItem) {
                ev.cancel = true;
                player.interactWithBlockInfo = {
                    time: now,
                    typeId: block?.typeId,
                    location: { x: block.x, y: block.y, z: block.z },
                    cancel: true
                };
                system.runTimeout(() => chestLockDefaultForm(player, chestId));
                return;
            }
        }
        ev.cancel = cannot2;
        player.interactWithBlockInfo = {
            time: now,
            typeId: block?.typeId,
            location: { x: block.x, y: block.y, z: block.z },
            cancel: cannot2
        };
        return;
    }
    if (block.typeId == "minecraft:ender_chest") {
        const cannot2 = CheckPermissionFromLocation(player, x, z, dimensionId, permission2);
        ev.cancel == cannot2;
        player.interactWithBlockInfo = {
            time: now,
            typeId: block?.typeId,
            location: { x: block.x, y: block.y, z: block.z },
            cancel: cannot2
        };
        return;
    };

    // 一般的なブロック操作の権限確認
    const cannot = CheckPermissionFromLocation(player, x, z, dimensionId, permission);
    ev.cancel = cannot;
    player.interactWithBlockInfo = {
        time: now,
        typeId: block?.typeId,
        location: { x: block.x, y: block.y, z: block.z },
        cancel: cannot
    };
    if (!cannot) {
        GrowthPlantReward(player, block);
        return;
    }

    if (ev.isFirstEvent) player.sendMessage({ translate: `cannot.permission.${permission}` });
    /*if ('open_bit' in block.permutation.getAllStates()) {
        const playerLocation = player.location;
        player.runCommand(`tp ${Math.floor(playerLocation.x * 100) / 100} 1000 ${Math.floor(playerLocation.z * 100) / 100}`);
        if (!player?.clicktp) {
            player.clicktp = true;
            system.runTimeout(() => {
                player.clicktp = false;
                player.teleport(playerLocation);
            }, 5);
        };
    };*/
});

world.beforeEvents.playerInteractWithEntity.subscribe((ev) => {
    const permission = `entityUse`
    const { player, target } = ev;
    const { x, z } = target.location;

    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    ev.cancel = cannot;
    if (!cannot) return;
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        playerDataCheck(player);
    };
});

world.afterEvents.worldLoad.subscribe(() => {
    for (const player of world.getPlayers()) {
        playerDataCheck(player);
        return;
    };
})

/**
 * 
 * @param {Player} player 
 */
function playerDataCheck(player) {
    const playerDataBase = new DynamicProperties("player");
    const dataCheck = playerDataBase.get(`player_${player.id}`);
    if (dataCheck) {
        const playerData = JSON.parse(dataCheck);
        playerData.name = player.name;
        playerData.lastLogined = Date.now();
        playerData.money = Math.floor(playerData.money);
        playerDataBase.set(`player_${player.id}`, JSON.stringify(playerData));
        if (config.countryNameDisplayOnPlayerNameTag) {
            nameSet(player);
        };
        if (national_tier_level.enabled) {
            const playerDataBase = new DynamicProperties('player');
            const countryId = JSON.parse(playerDataBase.get(`player_${player.id}`))?.country;
            const lv = countryId ? new CountryManager(countryId).countryData?.lv || 0 : 0;

            const jobsList = jobs_config.jobsList.filter(job => job.lv > lv);
            for (const job of jobsList) {
                if (player.hasTag(`mcjobs_${job.id}`)) {
                    player.removeTag(`mcjobs_${job.id}`);
                };
            }

            updateRecipe(player, lv);
        };

        return;
    };

    //同名の既存データがないか確認
    const exist = getDataFromName(player.name);
    if (exist.length == 0) {
        const newPlayerData = {
            name: player.name,
            id: player.id,
            country: undefined,
            money: config.initialMoney,
            roles: [],
            chunks: [],
            days: 0,
            invite: [],
            settings: {
                inviteReceiveMessage: true,
            }
        };

        playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));
        updateRecipe(player, 0);
        return;
    } else {
        const newPlayerData = exist[0].data;
        const oldId = newPlayerData.id;

        newPlayerData.id = player.id;
        playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));
        playerDataBase.delete(`player_${oldId}`);
        //プレイ時間の移行
        const playTimeDB = new DynamicProperties('playtime');
        playTimeDB.set(`player_${player.id}_total`, playTimeDB.get(`player_${oldId}_total`) || '0');
        playTimeDB.set(`player_${player.id}_daily`, playTimeDB.get(`player_${oldId}_daily`) || '{}');
        playTimeDB.set(`player_${player.id}_monthly`, playTimeDB.get(`player_${oldId}_monthly` || '{}'));
        playTimeDB.set(`player_${player.id}_yearly`, playTimeDB.get(`player_${oldId}_yearly`) || '{}');
    };
};

/**
 * 
 * @param {string} name 
 * @returns {Array<{id: string, data: any}>}
 */
function getDataFromName(name) {
    const playerDataBase = new DynamicProperties('player');
    let resultData = [];
    for (const id of playerDataBase.idList) {
        const dataraw = playerDataBase.get(id);
        if (dataraw) {
            const data = JSON.parse(dataraw);
            if (data.name == name) {
                resultData.push({ id: id, data: data });
            };
        };
    };
    return resultData;
};