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
                                const { x, z } = block.location;
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
                                const { x: x2, z: z2 } = block2.location;
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
                            const { x, y, z } = block.location;
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
    const { x, y, z } = block.location;
    const now = Date.now();
    if (player?.breakInfo) {
        if ((now - player?.breakInfo?.time) < 10000 && ev.block.typeId == player?.breakInfo?.typeId && ev.block.location == player?.breakInfo?.location) {
            ev.cancel = player?.breakInfo?.cancel;
            return;
        };
    };

    const chestId = `chest_${x}_${y}_${z}_${dimension.id}`;
    const chestLockData = GetAndParsePropertyData(chestId);
    const isChest = block.typeId.includes('chest');
    let pL = player.location;
    const doorPermutation = block.below().permutation.getAllStates();
    const permutation = block.permutation;
    const states = permutation.getAllStates();
    const typeId = block.typeId;
    const itemTypeId = block.getItemStack().typeId;


    const signTexts = getSignTexts(block);
    if (signTexts) {
        if (signTexts[1] == chestShopConfig.shopId) {
            const shopData = getShopData(signTexts, block);
            if (shopData != undefined) {
                if (shopData.player != player.name && !player.hasTag(`adminmode`)) {
                    player.breakInfo = {
                        time: now,
                        typeId: block.typeId,
                        location: block.location,
                        cancel: true
                    };
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
                    return;
                };
            };
        };
    };

    if (chestShopConfig.shopBlockIds.includes(block.typeId)) {
        const isOwner = isShopOwner(block, player.name);
        if (isOwner == false && !player.hasTag(`adminmode`)) {
            player.breakInfo = {
                time: now,
                typeId: block.typeId,
                location: block.location,
                cancel: true
            };
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
            return;
        };
        if (isOwner == true) {
            player.breakInfo = {
                time: now,
                typeId: block.typeId,
                location: block.location,
                cancel: false
            };
            ev.cancel = false;
        };
    };

    if (chestLockData) {
        const chestDataBase = new DynamicProperties("chest");
        if (isChest && chestLockData.player === player.id) {
            system.runTimeout(() => chestDataBase.delete(chestId));
        } else if (isChest) {
            if (player.hasTag(`adminmode`)) return;
            player.breakInfo = {
                time: Date.now(),
                typeId: block.typeId,
                location: block.location,
                cancel: true
            };
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
        location: block.location,
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
    const { player, block, permutationBeingPlaced } = ev;
    const { x, z } = block.location;
    const now = Date.now();
    if (player?.placeInfo) {
        if ((now - player?.placeInfo?.time) < 5000 && ev.block.typeId == player?.placeInfo?.typeId && ev.block.location == player?.placeInfo?.location) {
            ev.cancel = player?.placeInfo?.cancel;
            return;
        };
    };

    if (permutationBeingPlaced?.type.id.includes(`hopper`)) return;
    if (permutationBeingPlaced?.type.id.includes(`piston`)) return;
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    player.placeInfo = {
        time: now,
        typeId: permutationBeingPlaced?.type?.id,
        location: block.location,
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
    const { player, block, permutationBeingPlaced } = ev;
    if (!permutationBeingPlaced?.type.id.includes(`piston`)) return;
    const { x, z } = block.location;
    const now = Date.now();
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    player.placeInfo = {
        time: now,
        typeId: permutationBeingPlaced?.type?.id,
        location: block.location,
        cancel: cannot
    };
    ev.cancel = cannot;
    if (!cannot) return;
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block, permutationBeingPlaced } = ev;
    if (!permutationBeingPlaced?.type.id.includes(`hopper`)) return;
    const permission = `place`;
    const { x, z } = block.location;
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    const now = Date.now();
    if (cannot) {
        ev.cancel = true;
        player.placeInfo = {
            time: now,
            typeId: permutationBeingPlaced?.type?.id,
            location: block.location,
            cancel: true
        };
        return;
    };
    const chest = block.above();
    if (!chest) return;
    //ショップ
    if (chestShopConfig.shopBlockIds.includes(chest.typeId)) {
        const isOwner = isShopOwner(chest, player.name);
        if (typeof isOwner != "undefined") {
            if (isOwner == false && !player.hasTag(`adminmode`)) {
                ev.cancel = true;
                player.placeInfo = {
                    time: now,
                    typeId: permutationBeingPlaced?.type?.id,
                    location: block.location,
                    cancel: true
                };
                player.sendMessage({ translate: `cannot.place.hopper.below.lockchest` });
                return;
            };
            if (isOwner == true) {
                player.placeInfo = {
                    time: now,
                    typeId: permutationBeingPlaced?.type?.id,
                    location: block.location,
                    cancel: false
                };
                ev.cancel = false;
            };
        };
    };

    //保護チェスト
    if (!chest.typeId.includes('chest')) return;
    const chestId = `chest_${chest.location.x}_${chest.location.y}_${chest.location.z}_${chest.dimension.id}`;
    const chestLockData = GetAndParsePropertyData(chestId);
    if (chestLockData) {
        if (player.hasTag(`adminmode`)) return;
        ev.cancel = true;
        player.placeInfo = {
            time: now,
            typeId: permutationBeingPlaced?.type?.id,
            location: block.location,
            cancel: true
        };
        //保護されているチェストの下にホッパーを置くことはできません
        player.sendMessage({ translate: `cannot.place.hopper.below.lockchest` });
    };
    return;
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const permission = `place`
    const { player, block } = ev;

    if (config.spawnerSpawnEggBlock && block.typeId == 'minecraft:spawner') {
        ev.cancel = true;
        return;
    };
    const container = player.getComponent("inventory").container;
    if (!container.getItem(player.selectedSlotIndex)) return;
    const { x, z } = block.location;
    const now = Date.now();
    if (player?.itemUseOnInfo) {
        if ((now - player?.itemUseOnInfo?.time) < 5000 && ev.block.typeId == player?.itemUseOnInfo?.typeId && ev.block.location == player?.itemUseOnnfo?.location) {
            ev.cancel = player?.itemUseOnInfo?.cancel;
            return;
        };
    };
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    player.itemUseOnInfo = {
        time: now,
        typeId: block?.typeId,
        location: block.location,
        cancel: cannot
    };
    ev.cancel = cannot;
    if (!cannot) return;
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    const permission2 = 'openContainer'; // コンテナの開放権限
    const permission = 'blockUse'; // ブロックの使用権限
    const { player, block } = ev;
    const now = Date.now();
    const { x, y, z } = block.location;
    if (player?.interactWithBlockInfo) {
        if ((now - player?.interactWithBlockInfo?.time) < 5000 && ev.block.typeId == player?.interactWithBlockInfo?.typeId && ev.block.location == player?.interactWithBlockInfo?.location) {
            ev.cancel = player?.interactWithBlockInfo?.cancel;
            return;
        };
    };
    const dimensionId = player.dimension.id;
    const chestId = `chest_${x}_${y}_${z}_${dimensionId}`;
    const isChest = block.typeId.includes('chest'); // チェストかどうか
    const playerId = player.id;
    const isSneaking = player.isSneaking; // スニーク状態かどうか
    const container = player.getComponent('inventory')?.container;
    const selectedItem = container?.getItem(player.selectedSlotIndex);
    const signTexts = getSignTexts(block);
    if (signTexts) {
        if (signTexts[0].split('\n')[0] === chestShopConfig.shopId || signTexts[0].split('\n')[4] === chestShopConfig.shopId || signTexts[1] === chestShopConfig.shopId) {
            ev.cancel = true;
            player.interactWithBlockInfo = {
                time: now,
                typeId: block?.typeId,
                location: block.location,
                cancel: true
            };
            return;
        };
    };

    if (chestShopConfig.shopBlockIds.includes(block.typeId)) {
        const isOwner = isShopOwner(block, player.name);
        if (typeof isOwner != "undefined") {
            if (isOwner == false && !player.hasTag(`adminmode`)) {
                ev.cancel = true;
                player.interactWithBlockInfo = {
                    time: now,
                    typeId: block?.typeId,
                    location: block.location,
                    cancel: true
                };
                return;
            };
            if (isOwner == true) {
                player.interactWithBlockInfo = {
                    time: now,
                    typeId: block?.typeId,
                    location: block.location,
                    cancel: false
                };
                ev.cancel = false;
            };
        };
    };

    // インベントリの操作確認
    if (block.getComponent('inventory')) {
        const cannot2 = CheckPermissionFromLocation(player, x, z, dimensionId, permission2);
        if (!cannot2) {
            const chestLockData = GetAndParsePropertyData(chestId);
            if (chestLockData) {
                const isOwner = chestLockData.player === playerId; // 所有者かどうか
                const chestDataBase = new DynamicProperties("chest");
                if (isChest) {
                    if (isOwner && !isSneaking) return;
                    if (isOwner && isSneaking && !selectedItem) {
                        player.interactWithBlockInfo = {
                            time: now,
                            typeId: block?.typeId,
                            location: block.location,
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
                        location: block.location,
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
                    location: block.location,
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
            location: block.location,
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
            location: block.location,
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
        location: block.location,
        cancel: cannot
    };
    if (!cannot) {
        const growth = block.permutation.getState('growth');
        system.run(() => {
            // 農家ジョブの報酬
            if (block.typeId === 'minecraft:sweet_berry_bush' && player.hasTag('mcjobs_farmer') && growth > 1 && !player.isSneaking) {
                const container = player.getComponent("inventory").container;
                const item = container.getItem(player.selectedSlotIndex);
                if (growth != 3) {
                    if (item && item?.typeId == "minecraft:bone_meal") {
                        return;
                    }
                }
                if (item && item?.typeId.includes("minecraft:bucket")) {
                    return;
                }
                if (CheckPermissionFromLocation(player, x, z, dimensionId, `place`)) return;
                //block.setPermutation(block.permutation.withState(`growth`, 0));
                const playerData = GetAndParsePropertyData(`player_${playerId}`);
                const jobs = new JobLevel(player, "farmer");
                const jobsLevel = jobs.getLevel();
                jobs.addXp(jobs_config.jobsXp);
                const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel)) / 100;
                const reward = Math.ceil((random / 10 * growth) * 100) / 100;
                playerData.money += reward;
                StringifyAndSavePropertyData(`player_${playerId}`, playerData);
                if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${reward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
                return;
            }
        });
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
        const playerDataBase = new DynamicProperties("player");
        const dataCheck = playerDataBase.get(`player_${player.id}`);
        if (dataCheck) {
            const playerData = JSON.parse(dataCheck);
            playerData.name = player.name;
            playerData.lastLogined = Date.now();
            playerData.money = Math.floor(playerData.money);
            StringifyAndSavePropertyData(`player_${player.id}`, playerData, playerDataBase);
            if (config.countryNameDisplayOnPlayerNameTag) {
                nameSet(player);
            };
            return;
        };
        const beforeData = playerDataBase.get(`player_${player.id}`);
        if (beforeData) {
            playerDataBase.set(`player_${player.id}`, beforeData);
            return;
        };

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
        StringifyAndSavePropertyData(`player_${player.id}`, newPlayerData, playerDataBase);
    };
});