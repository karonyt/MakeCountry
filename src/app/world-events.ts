import { cancelGateBlockEdit, cancelGateTerrainInteraction } from "@/shared/integration/standalone.js";
import { cancelIncident16BlockEvent } from "@/domain/protection/incident16.js";
import { type Block, EntityDamageCause, GameMode, Player, system, world } from "@minecraft/server";
import { CheckPermissionFromLocation, GetAndParsePropertyData, getRandomInteger, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import config from "@/config/server.js";
import jobs_config from "@/config/jobs.js";
import { chestShopConfig } from "@/config/chest-shop.js";
import { getShopData, getSignTexts, isShopOwner } from "@/features/shops/chest-shop.js";
import { nameSet } from "@/domain/player/name-tag.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { chestLockDefaultForm } from "@/features/forms/default/chest_lock/main.js";
import national_tier_level from "@/config/national-tier-level.js";
import { updateRecipe } from "@/domain/recipes/recipe-service.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { GrowthPlantReward } from "@/domain/jobs/job-events.js";
import { itemUseItems, projectileUseItems } from "@/config/use-items.js";
import { ensureMarriageData, migrateMarriageReferences } from "@/domain/player/marriage.js";
import { ensureBountyData } from "@/domain/player/bounty.js";
import { isEntityAttackDenied } from "@/domain/protection/entity-attack.js";
import { ensureGroupChatData, migrateGroupChatReferences } from "@/domain/player/group-chat.js";
import { isUnsafeToPlay } from "@/shared/integration/standalone.js";
import { getDetailedBlockUsePermission, getDetailedItemUsePermission, getDetailedEntityUsePermission } from "@/domain/country/detailed-permissions.js";
import { isSpawnEgg } from "@/domain/protection/spawner.js";

const startFallYByPlayer = new Map<string, number>();
const breakTeleportingPlayers = new Set<string>();

/** Lock keys stay coordinate-based so lighting/unlighting a furnace preserves its owner. */
function isLockableContainer(typeId: string): boolean {
    return typeId.includes('chest') || [
        'minecraft:furnace', 'minecraft:lit_furnace',
        'minecraft:blast_furnace', 'minecraft:lit_blast_furnace',
        'minecraft:smoker', 'minecraft:lit_smoker',
        'minecraft:brewing_stand',
    ].includes(typeId);
}

type ChestLock = { player: string; admin?: string[] };

function isChestLockMember(lock: ChestLock, playerId: string): boolean {
    return lock.player === playerId || (lock.admin ? lock.admin.includes(playerId) : false);
}

/** 東西南北の隣のブロック。読み込まれていない・世界の外なら返さない */
function horizontalNeighbors(block: Block): Block[] {
    const neighbors: Block[] = [];
    for (const step of [() => block.north(), () => block.south(), () => block.east(), () => block.west()]) {
        try {
            const neighbor = step();
            if (neighbor) neighbors.push(neighbor);
        } catch {
            // 読み込まれていないチャンクの隣は見ない
        }
    }
    return neighbors;
}

function isLargeChest(block: Block): boolean {
    try {
        return (block.getComponent('inventory')?.container?.size ?? 0) > 27;
    } catch {
        return false;
    }
}

/**
 * ラージチェストのもう片方に、この人が触れない保護が掛かっていればその保護を返す。
 * 保護は片側だけに掛かっていることが多く、保護の無い側を開けると両方の中身が見えてしまう (#ticket-1309)
 */
function lockedLargeChestPartner(block: Block, playerId: string): ChestLock | undefined {
    if (!isLargeChest(block)) return undefined;
    for (const neighbor of horizontalNeighbors(block)) {
        if (neighbor.typeId !== block.typeId || !isLargeChest(neighbor)) continue;
        const lock = GetAndParsePropertyData(`chest_${neighbor.x}_${neighbor.y}_${neighbor.z}_${neighbor.dimension.id}`) as ChestLock | undefined;
        if (lock && !isChestLockMember(lock, playerId)) return lock;
    }
    return undefined;
}

/** Legacy broad permissions remain an umbrella so existing country settings keep working. */
function cannotUseDetailedPermission(player: Player, x: number, z: number, dimensionId: string, broadPermission: string, detailedPermission?: string) {
    const cannotUseBroad = CheckPermissionFromLocation(player, x, z, dimensionId, broadPermission);
    if (!detailedPermission || !cannotUseBroad) return cannotUseBroad;
    return CheckPermissionFromLocation(player, x, z, dimensionId, detailedPermission);
}

world.beforeEvents.itemUse.subscribe((ev) => {
    const { source, itemStack } = ev;
    const itemTypeId = itemStack?.typeId;
    if (!itemTypeId) return;

    const checksItemUse = itemUseItems.includes(itemTypeId);
    const checksProjectileUse = projectileUseItems.includes(itemTypeId);

    if (!checksItemUse && !checksProjectileUse) return;

    const { x, z } = source.location;
    const dimensionId = source.dimension.id;

    if (source.dimension.getEntities({ location: source.location, maxDistance: config.maxDropDistance, type: `mc:core` }).length > 0) {
        return;
    };

    if (checksItemUse) {
        const detailedPermission = getDetailedItemUsePermission(itemTypeId);
        ev.cancel = cannotUseDetailedPermission(source, x, z, dimensionId, 'itemUse', detailedPermission);
        return;
    };

    if (checksProjectileUse) {
        ev.cancel = CheckPermissionFromLocation(source, x, z, dimensionId, 'projectileUse');
        return;
    };
});

// Cancel the attack before Fire Aspect, knockback and other hit effects occur.
world.beforeEvents.playerItemAttackEntity.subscribe((ev) => {
    try {
        if (isEntityAttackDenied(ev.player, ev.target)) ev.cancel = true;
    } catch {
        ev.cancel = true;
    }
});

// Keep the damage guard for projectiles and scripted damage as well.
world.beforeEvents.entityHurt.subscribe((ev) => {
    const { hurtEntity, damageSource } = ev;
    if (!(damageSource.damagingEntity instanceof Player)) return;
    // Preserve cancellations made by another protection handler.
    try {
        if (isEntityAttackDenied(damageSource.damagingEntity, hurtEntity)) ev.cancel = true;
    } catch {
        ev.cancel = true;
    }
});

/** 足元から下へ 1 段ずつ見て、最初に固いものが現れた段で止める。その段 (足元と四方) に守られた畑があれば落下をゆっくりにする */
function protectFarmlandBelow(player: Player, px: number, py: number, pz: number, permission: string) {
    const dimension = player.dimension;
    const offsets = [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]];
    for (let j = 1; j < 15; j++) {
        let solid = false;
        for (const [dx, dz] of offsets) {
            let block;
            try {
                block = dimension.getBlock({ x: px + dx, y: py - j, z: pz + dz });
            } catch {
                continue;
            };
            if (!block?.isValid || block.isAir) continue;
            // 作物や草は畑の上にあって踏み抜けるので「止まる段」に数えない (畑そのものは数える)
            const isFarmland = block.typeId === "minecraft:farmland";
            if (block.isSolid || isFarmland) solid = true;
            if (!isFarmland) continue;
            if (!CheckPermissionFromLocation(player, block.x, block.z, dimension.id, permission)) continue;
            player.addEffect(`slow_falling`, 1, { amplifier: 15 / j, showParticles: false });
            if (!startFallYByPlayer.has(player.id)) {
                startFallYByPlayer.set(player.id, py);
            };
            return;
        };
        // 何かに当たる段まで来たら、それより下には落ちないので見なくてよい
        if (solid) return;
    };
}

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        const permission = 'break';
        for (const player of world.getPlayers()) {
            const { x: px, y: py, z: pz } = player.location;
            // 他人の畑を踏み荒らさないよう、落ちている先に「壊してはいけない畑」があれば落下をゆっくりにする。
            // 2026-09-24: 以前は空中にいる全員を毎 tick、下 14 段 × 5 マスずつ調べ続けていた (途中で止める処理も効いていなかった)。
            // 70 人時に Earth のスクリプト時間の約 4 割を使っていたので、落ちているときだけ調べ、最初に当たる固い段で止める。
            if (!player.isOnGround && !player.isInWater && !player.isGliding && player.getVelocity().y < -0.1) {
                protectFarmlandBelow(player, px, py, pz, permission);
            };
            if (player.isOnGround && !player.isInWater && !player.isGliding) {
                const startFallY = startFallYByPlayer.get(player.id);
                if (startFallY !== undefined) {
                    let damage = Math.floor(startFallY - py - 3);
                    if (damage > 0) {
                        player.applyDamage(damage, { cause: EntityDamageCause.fall });
                    };
                    startFallYByPlayer.delete(player.id);
                };
            };
            if (player.isInWater) {
                startFallYByPlayer.delete(player.id);
            };
            if (player.isGliding) {
                startFallYByPlayer.delete(player.id);
            };
        };
    });
});

world.afterEvents.entityHurt.subscribe(ev => {
    if (!(ev.damageSource?.damagingEntity instanceof Player)) return;
    const player = ev.damageSource.damagingEntity;
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const container = player.getComponent(`inventory`).container;
    const mace = container.getItem(player.selectedSlotIndex);
    if (mace) {
        if (mace.typeId == "minecraft:mace") {
            startFallYByPlayer.delete(player.id);
            return;
        };
    };
});

world.beforeEvents.playerBreakBlock.subscribe((ev) => {
    if (cancelGateBlockEdit(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
    const permission = 'break';
    const { player, block, dimension } = ev;
    const x = block.x;
    const y = block.y;
    const z = block.z;
    const chestId = `chest_${x}_${y}_${z}_${dimension.id}`;
    const chestLockData = GetAndParsePropertyData(chestId);
    const isLockable = isLockableContainer(block.typeId);
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
        if (isLockable && (chestLockData.player === player.id || (chestLockData?.admin ? chestLockData.admin.includes(player.id) : false))) {
            system.runTimeout(() => chestDataBase.delete(chestId));
            return;
        } else if (isLockable) {
            if (player.hasTag(`adminmode`)) return;
            ev.cancel = true;
            if (!breakTeleportingPlayers.has(player.id)) {
                breakTeleportingPlayers.add(player.id);
                system.run(() => {
                    player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} 1000 ${Math.floor(pL.z * 100) / 100}`);
                    player.setGameMode(GameMode.Adventure);
                });
                system.runTimeout(() => {
                    breakTeleportingPlayers.delete(player.id);
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
        if (!breakTeleportingPlayers.has(player.id)) {
            breakTeleportingPlayers.add(player.id);
            system.run(() => {
                player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} 1000 ${Math.floor(pL.z * 100) / 100}`);
                player.setGameMode(GameMode.Adventure);
            });
            system.runTimeout(() => {
                breakTeleportingPlayers.delete(player.id);
                player.runCommand(`tp ${Math.floor(pL.x * 100) / 100} ${Math.floor(pL.y * 100) / 100} ${Math.floor(pL.z * 100) / 100}`);
                player.setGameMode(GameMode.Survival);
            }, 5);
        };
        return;
    }
});

world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    if (cancelGateBlockEdit(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
    const permission = `place`
    const { player, block, permutationToPlace: permutationBeingPlaced } = ev;
    const x = block.x;
    const z = block.z;
    if (permutationBeingPlaced?.type.id.includes(`hopper`)) return;
    if (permutationBeingPlaced?.type.id.includes(`piston`)) return;
    const cannot = CheckPermissionFromLocation(player, x, z, player.dimension.id, permission);
    ev.cancel = cannot;
    if (!cannot) {
        return
    };
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    if (cancelGateBlockEdit(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
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
    if (cancelGateBlockEdit(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
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

    // 保護された収納・設備からの吸い出しを防ぐ
    if (!isLockableContainer(chest.typeId)) return;
    const chestId = `chest_${chest.x}_${chest.y}_${chest.z}_${chest.dimension.id}`;
    const chestLockData = GetAndParsePropertyData(chestId);
    // ラージチェストの保護の無い側の下に置くと、保護された側の中身も吸い出せる
    if (chestLockData || lockedLargeChestPartner(chest, player.id)) {
        if (player.hasTag(`adminmode`)) return;
        ev.cancel = true;
        //保護されているチェストの下にホッパーを置くことはできません
        player.sendMessage({ translate: `cannot.place.hopper.below.lockchest` });
    };
    return;
});

// 他人の保護チェストの横にチェストを置くとラージチェストになり、保護の無い側から中身を取れてしまう (#ticket-1309)
world.beforeEvents.playerPlaceBlock.subscribe((ev) => {
    if (cancelGateBlockEdit(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
    const { player, block, permutationToPlace: permutationBeingPlaced } = ev;
    const placedTypeId = permutationBeingPlaced?.type.id;
    if (!placedTypeId || !placedTypeId.includes('chest') || placedTypeId.includes('ender_chest')) return;
    if (player.hasTag(`adminmode`)) return;
    for (const neighbor of horizontalNeighbors(block)) {
        if (neighbor.typeId !== placedTypeId) continue;
        const lock = GetAndParsePropertyData(`chest_${neighbor.x}_${neighbor.y}_${neighbor.z}_${neighbor.dimension.id}`) as ChestLock | undefined;
        if (!lock || isChestLockMember(lock, player.id)) continue;
        ev.cancel = true;
        player.sendMessage({ translate: 'message.thischest.islocked', with: [GetAndParsePropertyData(`player_${lock.player}`)?.name ?? '?'] });
        return;
    }
});

world.beforeEvents.playerInteractWithBlock.subscribe((ev) => {
    if (cancelGateTerrainInteraction(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
    const permission = `place`
    const { player, block } = ev;

    if (config.spawnerSpawnEggBlock && block.typeId == 'minecraft:mob_spawner' && isSpawnEgg(ev.itemStack?.typeId)) {
        ev.cancel = true;
        return;
    };
    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const container = player.getComponent("inventory").container;
    if (!container.getItem(player.selectedSlotIndex)) return;
    const x = block.x;
    const z = block.z;
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
    if (cancelGateTerrainInteraction(ev)) return;
    if (cancelIncident16BlockEvent(ev)) return;
    const permission2 = 'openContainer'; // コンテナの開放権限
    const permission = 'blockUse'; // ブロックの使用権限
    const { player, block } = ev;

    const isShopBlock = block.typeId.includes('shop_block'); // ショップブロックかどうか
    if (isShopBlock) return;
    if (block.typeId == 'minecraft:barrel') {
        const shopBlock = block.above();
        if (shopBlock && shopBlock.typeId == 'mc:shop_block') return;
    }

    const now = Date.now();
    const x = block.x;
    const y = block.y;
    const z = block.z;

    if (config.spawnerSpawnEggBlock && block.typeId == 'minecraft:mob_spawner' && isSpawnEgg(ev.itemStack?.typeId)) {
        ev.cancel = true;
        return;
    };

    const dimensionId = player.dimension.id;
    const chestId = `chest_${x}_${y}_${z}_${dimensionId}`;
    const isChest = block.typeId.includes('chest'); // チェストかどうか
    const isLockable = isLockableContainer(block.typeId);
    const playerId = player.id;
    const isSneaking = player.isSneaking; // スニーク状態かどうか
    const container = player.getComponent('inventory')?.container;
    const selectedItem = container?.getItem(player.selectedSlotIndex);

    // インベントリの操作確認
    if (block.getComponent('inventory')) {
        const cannot2 = CheckPermissionFromLocation(player, x, z, dimensionId, permission2);
        if (!cannot2) {
            // ラージチェストは保護の無い側から開けても両方の中身が見えるので、もう片方の保護も見る
            if (isChest && !player.hasTag(`adminmode`)) {
                const partnerLock = lockedLargeChestPartner(block, playerId);
                if (partnerLock) {
                    ev.cancel = true;
                    player.sendMessage({ translate: 'message.thischest.islocked', with: [GetAndParsePropertyData(`player_${partnerLock.player}`)?.name ?? '?'] });
                    return;
                }
            }
            const chestLockData = GetAndParsePropertyData(chestId);
            if (chestLockData) {
                const isOwner = (chestLockData.player === playerId || (chestLockData?.admin ? chestLockData.admin.includes(player.id) : false)); // 所有者かどうか
                const chestDataBase = new DynamicProperties("chest");
                if (isLockable) {
                    if (isOwner && !isSneaking) return;
                    if (isOwner && isSneaking && !selectedItem) {
                        ev.cancel = true;
                        system.runTimeout(() => chestLockDefaultForm(player, chestId));
                        return;
                    }
                    if (player.hasTag(`adminmode`)) return;
                    ev.cancel = true;
                    player.sendMessage({ translate: 'message.thischest.islocked', with: [GetAndParsePropertyData(`player_${chestLockData.player}`)?.name ?? '?'] });
                    return;
                }
                if (!isLockable) {
                    chestDataBase.delete(chestId);
                }
            } else if (isSneaking && isLockable && !selectedItem) {
                ev.cancel = true;
                system.runTimeout(() => chestLockDefaultForm(player, chestId));
                return;
            }
        }
        ev.cancel = cannot2;
        return;
    }
    if (block.typeId == "minecraft:ender_chest") {
        const cannot2 = CheckPermissionFromLocation(player, x, z, dimensionId, permission2);
        if (cannot2) ev.cancel = true;
        return;
    };

    // 一般的なブロック操作の権限確認
    const detailedPermission = getDetailedBlockUsePermission(block.typeId);
    const cannot = cannotUseDetailedPermission(player, x, z, dimensionId, permission, detailedPermission);
    ev.cancel = cannot;
    if (!cannot) {
        GrowthPlantReward(player, block);
        return;
    }

    if (ev.isFirstEvent) player.sendMessage({ translate: `cannot.permission.${detailedPermission ?? permission}` });
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
    const { player, target } = ev;
    // The training scarecrow's settings menu is public in the lobby.
    if (target.typeId === 'mc:training_dummy') return;
    const permission = getDetailedEntityUsePermission(target.typeId) ?? 'entityUse';
    const { x, z } = target.location;

    const cannot = CheckPermissionFromLocation(player, x, z, target.dimension.id, permission);
    if (cannot) ev.cancel = true;
    if (!cannot) return;
    player.sendMessage({ translate: `cannot.permission.${permission}` });
    return;
});

// The Core mirror is empty during worldLoad/reload. Empty is not proof that a
// connected player is new. Keep initialization pending until all namespaces load.
const pendingPlayerDataChecks = new Map<string, Player>();

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        playerDataCheck(player);
    };
});

world.afterEvents.worldLoad.subscribe(() => {
    for (const player of world.getPlayers()) {
        playerDataCheck(player);
    };
    system.runInterval(() => {
        if (isUnsafeToPlay()) return;
        for (const player of pendingPlayerDataChecks.values()) playerDataCheck(player);
    }, 20);
})

world.afterEvents.playerLeave.subscribe((ev) => {
    pendingPlayerDataChecks.delete(ev.playerId);
});

/**
 * 
 * @param {Player} player 
 */
function playerDataCheck(player: any) {
    if (!player.isValid) {
        pendingPlayerDataChecks.delete(player.id);
        return;
    }
    if (isUnsafeToPlay()) {
        pendingPlayerDataChecks.set(player.id, player);
        return;
    }
    pendingPlayerDataChecks.delete(player.id);
    const playerDataBase = new DynamicProperties("player");
    const dataCheck = playerDataBase.get(`player_${player.id}`);
    if (dataCheck) {
        const playerData = JSON.parse(dataCheck);
        ensureMarriageData(playerData);
        ensureBountyData(playerData);
        ensureGroupChatData(playerData);
        playerData.name = player.name;
        playerData.lastLogined = Date.now();
        playerData.money = Math.floor((Number(playerData.money) || 0) * 100) / 100;
        playerDataBase.set(`player_${player.id}`, JSON.stringify(playerData));
        if (config.countryNameDisplayOnPlayerNameTag) {
            nameSet(player);
        };
        if (national_tier_level.enabled) {
            const countryId = playerData?.country;
            const lv = countryId ? new CountryManager(countryId).countryData?.lv || 0 : 0;

            const jobsList = jobs_config.jobsList.filter(job => job.lv > lv);
            for (const job of jobsList) {
                if (player.hasTag(`mcjobs_${job.id}`)) {
                    player.removeTag(`mcjobs_${job.id}`);
                };
            }

        };

        updateRecipe(player);

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
            bountyLastSetAt: undefined,
            bountyDailySetDate: undefined,
            bountyDailySetCount: 0,
            roles: [],
            chunks: [],
            days: 0,
            invite: [],
            settings: {
                inviteReceiveMessage: true,
            },
            marriage: {
                spouseId: undefined,
                since: undefined,
                requests: [],
            },
            groupChat: {
                currentOwnerId: undefined,
                ownedGroup: undefined,
            }
        };

        playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));
        // @ts-ignore TS(2345): Argument of type '0' is not assignable to paramete... Remove this comment to see the full error message
        updateRecipe(player, 0);
        return;
    } else {
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const newPlayerData = exist[0].data;
        const oldId = newPlayerData.id;

        ensureMarriageData(newPlayerData);
        ensureBountyData(newPlayerData);
        ensureGroupChatData(newPlayerData);
        newPlayerData.id = player.id;
        playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));
        playerDataBase.delete(`player_${oldId}`);
        migrateMarriageReferences(playerDataBase, oldId, player.id);
        migrateGroupChatReferences(playerDataBase, oldId, player.id);
        //プレイ時間の移行
        const playTimeDB = new DynamicProperties('playtime');
        playTimeDB.set(`player_${player.id}_total`, playTimeDB.get(`player_${oldId}_total`) || '0');
        playTimeDB.set(`player_${player.id}_daily`, playTimeDB.get(`player_${oldId}_daily`) || '{}');
        playTimeDB.set(`player_${player.id}_monthly`, playTimeDB.get(`player_${oldId}_monthly`) || '{}');
        playTimeDB.set(`player_${player.id}_yearly`, playTimeDB.get(`player_${oldId}_yearly`) || '{}');
    };
};

/**
 * 
 * @param {string} name 
 * @returns {Array<{id: string, data: any}>}
 */
function getDataFromName(name: any) {
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
