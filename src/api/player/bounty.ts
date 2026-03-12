import { Player, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import config from "../../config.js";
import { DynamicProperties } from "../dyp.js";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "../../lib/util.js";

/**
 * @typedef {import("../../jsdoc/player").PlayerData} PlayerData
 */

const bountyDB = new DynamicProperties("bounty");
const DEFAULT_BOUNTY_DAILY_LIMIT = 10;
const DEFAULT_BOUNTY_TARGET_RESPAWN_COOLDOWN_HOURS = 1;

/**
 * @typedef {{
 *   targetId: string,
 *   targetName: string,
 *   placerId: string,
 *   placerName: string,
 *   amount: number,
 *   createdAt: number
 * }} BountyData
 */

/**
 * @param {PlayerData | undefined} playerData
 * @returns {PlayerData | undefined}
 */
export function ensureBountyData(playerData: any) {
    if (!playerData) return playerData;
    if (playerData.bountyLastSetAt === null) {
        playerData.bountyLastSetAt = undefined;
    }
    if (playerData.bountyDailySetDate === null) {
        playerData.bountyDailySetDate = undefined;
    }
    if (typeof playerData.bountyDailySetCount !== "number") {
        playerData.bountyDailySetCount = 0;
    }
    return playerData;
}

function getTodayByUTCOffset(offsetHours: any) {
    const now = new Date();
    const localOffsetMinutes = now.getTimezoneOffset();
    const target = new Date(now.getTime() + (offsetHours * 60 + localOffsetMinutes) * 60 * 1000);
    return target.toISOString().slice(0, 10);
}

function formatRemainingMs(remainingMs: number) {
    const totalSeconds = Math.ceil(remainingMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}時間${minutes}分`;
    if (minutes > 0) return `${minutes}分${seconds}秒`;
    return `${seconds}秒`;
}

function getTargetRespawnCooldownUntil(targetId: any) {
    const raw = bountyDB.get(`bounty_cooldown_${targetId}`);
    if (!raw) return 0;
    const timestamp = Number(raw);
    return Number.isFinite(timestamp) ? timestamp : 0;
}

function setTargetRespawnCooldown(targetId: any, timestamp: number) {
    bountyDB.set(`bounty_cooldown_${targetId}`, `${timestamp}`);
}

/**
 * @param {string} playerId
 */
function getPlayerData(playerId: any) {
    const playerData = GetAndParsePropertyData(`player_${playerId}`);
    return ensureBountyData(playerData);
}

/**
 * @param {string} playerId
 * @param {PlayerData} playerData
 */
function savePlayerData(playerId: any, playerData: any) {
    ensureBountyData(playerData);
    StringifyAndSavePropertyData(`player_${playerId}`, playerData);
}

/**
 * @param {string} targetId
 * @returns {BountyData | undefined}
 */
export function getBounty(targetId: any) {
    const raw = bountyDB.get(`bounty_${targetId}`);
    return raw ? JSON.parse(raw) : undefined;
}

export function getAllBounties() {
    return bountyDB.idList
        .filter((id: any) => /^bounty_[^_]+$/.test(id))
        .map((id: any) => bountyDB.get(id))
        .filter((raw: any) => typeof raw === "string")
        .map((raw: any) => {
            try {
                return JSON.parse(raw);
            } catch {
                return undefined;
            }
        })
        .filter((bounty: any) =>
            !!bounty &&
            typeof bounty.targetId === "string" &&
            typeof bounty.targetName === "string" &&
            typeof bounty.placerId === "string" &&
            typeof bounty.placerName === "string" &&
            typeof bounty.amount === "number" &&
            Number.isFinite(bounty.amount)
        );
}

/**
 * @param {string} targetId
 */
function clearBounty(targetId: any) {
    bountyDB.delete(`bounty_${targetId}`);
}

/**
 * @param {BountyData} bounty
 * @param {boolean} notifyOnline
 */
function refundBountyToPlacer(bounty: any, notifyOnline = true) {
    const placerData = getPlayerData(bounty.placerId);
    if (!placerData) return false;
    placerData.money += Math.floor(bounty.amount);
    savePlayerData(bounty.placerId, placerData);

    if (notifyOnline) {
        const placer = world.getPlayers({ name: bounty.placerName })[0];
        placer?.sendMessage({ translate: "bounty.refund.cancelled", with: [`${config.MoneyName} ${Math.floor(bounty.amount)}`, bounty.targetName] });
    }
    return true;
}

/**
 * @param {Player} player
 */
function isInWar(player: any) {
    return player.getTags().some((tag: any) => tag.startsWith("war"));
}

/**
 * @param {Player} attacker
 * @param {Player} target
 */
export function canAttackBountyTarget(attacker: any, target: any) {
    if (!(attacker instanceof Player) || !(target instanceof Player)) return false;
    if (attacker.id === target.id) return false;
    if (isInWar(attacker) || isInWar(target)) return false;
    return !!getBounty(target.id);
}

/**
 * @param {Player} setter
 * @param {Player} target
 * @param {number} amount
 */
export function placeBounty(setter: any, target: any, amount: any) {
    /*if (!config.bountyValidity) {
        setter.sendMessage("Bounty is disabled.");
        return false;
    }*/
    if (!(setter instanceof Player) || !(target instanceof Player)) {
        return false;
    }
    if (setter.id === target.id) {
        setter.sendMessage({ translate: "bounty.error.self" });
        return false;
    }
    if (!Number.isInteger(amount) || amount < (config.bountyMinAmount ?? 10000)) {
        setter.sendMessage({ translate: "bounty.error.min_amount", with: [`${config.MoneyName} ${(config.bountyMinAmount ?? 10000)}`] });
        return false;
    }
    if (isInWar(setter) || isInWar(target)) {
        setter.sendMessage({ translate: "bounty.error.war" });
        return false;
    }

    const setterData = getPlayerData(setter.id);
    const targetData = getPlayerData(target.id);
    if (!setterData || !targetData) {
        setter.sendMessage({ translate: "bounty.error.load_data" });
        return false;
    }
    if ((targetData.days ?? 0) < (config.bountyTargetMinDays ?? 7)) {
        setter.sendMessage({ translate: "bounty.error.new_player", with: [`${(config.bountyTargetMinDays ?? 7)}`] });
        return false;
    }
    if (setterData.money < amount) {
        setter.sendMessage({ translate: "bounty.error.not_enough_money", with: [`${config.MoneyName} ${setterData.money}`] });
        return false;
    }
    if (getBounty(target.id)) {
        setter.sendMessage({ translate: "bounty.error.already_exists", with: [target.name] });
        return false;
    }

    const now = Date.now();
    const today = getTodayByUTCOffset(config.timeDifference ?? 9);
    const dailyLimit = config.bountyDailyLimit ?? DEFAULT_BOUNTY_DAILY_LIMIT;
    if (setterData.bountyDailySetDate !== today) {
        setterData.bountyDailySetDate = today;
        setterData.bountyDailySetCount = 0;
    }
    if ((setterData.bountyDailySetCount ?? 0) >= dailyLimit) {
        setter.sendMessage({ translate: "bounty.error.daily_limit", with: [`${dailyLimit}`] });
        return false;
    }

    const targetCooldownUntil = getTargetRespawnCooldownUntil(target.id);
    if (targetCooldownUntil > now) {
        setter.sendMessage({ translate: "bounty.error.target_cooldown", with: [target.name, formatRemainingMs(targetCooldownUntil - now)] });
        return false;
    }

    setterData.money -= amount;
    setterData.bountyLastSetAt = now;
    setterData.bountyDailySetDate = today;
    setterData.bountyDailySetCount = (setterData.bountyDailySetCount ?? 0) + 1;
    savePlayerData(setter.id, setterData);

    /** @type {BountyData} */
    const bountyData = {
        targetId: target.id,
        targetName: target.name,
        placerId: setter.id,
        placerName: setter.name,
        amount,
        createdAt: now,
    };
    bountyDB.set(`bounty_${target.id}`, JSON.stringify(bountyData));

    setter.sendMessage({ translate: "bounty.place.success.setter", with: [`${config.MoneyName} ${amount}`, target.name] });
    target.sendMessage({ translate: "bounty.place.success.target", with: [`${config.MoneyName} ${amount}`] });
    return true;
}

/**
 * @param {Player} player
 * @param {Player} target
 */
export function cancelOwnBounty(player: any, target: any) {
    const bounty = getBounty(target.id);
    if (!bounty) {
        player.sendMessage({ translate: "bounty.error.no_active_target", with: [target.name] });
        return false;
    }
    if (bounty.placerId !== player.id) {
        player.sendMessage({ translate: "bounty.error.cancel_own_only" });
        return false;
    }

    refundBountyToPlacer(bounty, false);
    clearBounty(target.id);
    player.sendMessage({ translate: "bounty.cancel.success", with: [target.name, `${config.MoneyName} ${Math.floor(bounty.amount)}`] });
    target.sendMessage({ translate: "bounty.cancel.target" });
    return true;
}

/**
 * @param {Player} admin
 * @param {Player} target
 */
export function clearBountyAsAdmin(admin: any, target: any) {
    const bounty = getBounty(target.id);
    if (!bounty) {
        admin.sendMessage({ translate: "bounty.error.no_active_target", with: [target.name] });
        return false;
    }

    refundBountyToPlacer(bounty, true);
    clearBounty(target.id);
    admin.sendMessage({ translate: "bounty.admin.clear.success", with: [target.name] });
    target.sendMessage({ translate: "bounty.admin.clear.target" });
    return true;
}

world.afterEvents.entityDie.subscribe((ev) => {
    const { deadEntity, damageSource } = ev;
    if (!(deadEntity instanceof Player)) return;
    const killer = damageSource.damagingEntity;
    if (!(killer instanceof Player)) return;
    if (killer.id === deadEntity.id) return;
    if (isInWar(killer) || isInWar(deadEntity)) return;

    const bounty = getBounty(deadEntity.id);
    if (!bounty) return;

    const killerData = getPlayerData(killer.id);
    if (!killerData) return;

    killerData.money += Math.floor(bounty.amount);
    savePlayerData(killer.id, killerData);
    clearBounty(deadEntity.id);
    setTargetRespawnCooldown(
        deadEntity.id,
        Date.now() + (config.bountyTargetRespawnCooldownHours ?? DEFAULT_BOUNTY_TARGET_RESPAWN_COOLDOWN_HOURS) * 60 * 60 * 1000
    );

    killer.sendMessage({ translate: "bounty.claim.killer", with: [`${config.MoneyName} ${Math.floor(bounty.amount)}`, deadEntity.name] });
    deadEntity.sendMessage({ translate: "bounty.claim.target", with: [killer.name] });
    const placer = world.getPlayers({ name: bounty.placerName })[0];
    placer?.sendMessage({ translate: "bounty.claim.placer", with: [killer.name, deadEntity.name] });
});

function getOnlineBountyTargets(player: any) {
    return world.getPlayers()
        .filter((target: any) => target.id !== player.id)
        .sort((a: any, b: any) => a.name.localeCompare(b.name));
}

function getOwnActiveBounties(player: any) {
    return getAllBounties()
        .filter((bounty: any) => bounty.placerId === player.id)
        .sort((a: any, b: any) => b.amount - a.amount);
}

function showBountyListForm(player: any) {
    const bounties = getAllBounties().sort((a: any, b: any) => b.amount - a.amount);
    const form = new ActionFormData().title({ translate: "bounty.form.list.title" }).button({ translate: "mc.button.back" });

    if (!bounties.length) {
        form.body({ translate: "bounty.form.list.empty" });
    } else {
        form.body({ translate: "bounty.form.list.body", with: [`${bounties.length}`] });
        for (const bounty of bounties) {
            form.button({ translate: "bounty.form.list.entry", with: [bounty.targetName, `${config.MoneyName} ${Math.floor(bounty.amount)}`, bounty.placerName] });
        }
    }

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) return showBountyListForm(player);
            return;
        }
        showBountyMainForm(player);
    });
}

function showPlaceBountyForm(player: any) {
    const candidates = getOnlineBountyTargets(player);
    if (!candidates.length) {
        player.sendMessage({ translate: "bounty.form.place.no_candidates" });
        return showBountyMainForm(player);
    }

    new ModalFormData()
        .title({ translate: "bounty.form.place.title" })
        .dropdown({ translate: "bounty.form.place.target" }, candidates.map((target: any) => target.name), { defaultValueIndex: 0 })
        .textField({ translate: "bounty.form.place.amount", with: [`${config.MoneyName} ${(config.bountyMinAmount ?? 10000)}`] }, { translate: "bounty.form.place.amount.placeholder" })
        .show(player)
        .then((rs: any) => {
            if (rs.canceled) {
                if (rs.cancelationReason === FormCancelationReason.UserBusy) return showPlaceBountyForm(player);
                return showBountyMainForm(player);
            }

            const targetIndex = rs.formValues?.[0];
            const amount = Number(rs.formValues?.[1]);
            const target = typeof targetIndex === "number" ? candidates[targetIndex] : undefined;
            if (!(target instanceof Player)) {
                player.sendMessage({ translate: "bounty.error.resolve_target" });
                return showPlaceBountyForm(player);
            }
            if (!Number.isInteger(amount)) {
                player.sendMessage({ translate: "bounty.error.amount_integer" });
                return showPlaceBountyForm(player);
            }

            placeBounty(player, target, amount);
            showBountyMainForm(player);
        });
}

function showCancelOwnBountyForm(player: any) {
    const bounties = getOwnActiveBounties(player);
    if (!bounties.length) {
        player.sendMessage({ translate: "bounty.form.cancel.empty" });
        return showBountyMainForm(player);
    }

    const form = new ActionFormData()
        .title({ translate: "bounty.form.cancel.title" })
        .body({ translate: "bounty.form.cancel.body", with: [`${bounties.length}`] })
        .button({ translate: "mc.button.back" });

    for (const bounty of bounties) {
        form.button({ translate: "bounty.form.cancel.entry", with: [bounty.targetName, `${config.MoneyName} ${Math.floor(bounty.amount)}`] });
    }

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) return showCancelOwnBountyForm(player);
            return;
        }
        if (rs.selection === 0) return showBountyMainForm(player);

        const bounty = bounties[(rs.selection ?? 1) - 1];
        const target = bounty ? world.getPlayers({ name: bounty.targetName })[0] : undefined;
        if (!(target instanceof Player)) {
            player.sendMessage({ translate: "bounty.error.target_offline" });
            return showCancelOwnBountyForm(player);
        }

        cancelOwnBounty(player, target);
        showCancelOwnBountyForm(player);
    });
}

function showAdminClearBountyForm(player: any) {
    const bounties = getAllBounties().sort((a: any, b: any) => b.amount - a.amount);
    if (!bounties.length) {
        player.sendMessage({ translate: "bounty.form.clear.empty" });
        return showBountyMainForm(player);
    }

    const form = new ActionFormData()
        .title({ translate: "bounty.form.clear.title" })
        .body({ translate: "bounty.form.clear.body", with: [`${bounties.length}`] })
        .button({ translate: "mc.button.back" });

    for (const bounty of bounties) {
        form.button({ translate: "bounty.form.clear.entry", with: [bounty.targetName, `${config.MoneyName} ${Math.floor(bounty.amount)}`, bounty.placerName] });
    }

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) return showAdminClearBountyForm(player);
            return;
        }
        if (rs.selection === 0) return showBountyMainForm(player);

        const bounty = bounties[(rs.selection ?? 1) - 1];
        const target = bounty ? world.getPlayers({ name: bounty.targetName })[0] : undefined;
        if (!(target instanceof Player)) {
            player.sendMessage({ translate: "bounty.error.target_offline" });
            return showAdminClearBountyForm(player);
        }

        clearBountyAsAdmin(player, target);
        showAdminClearBountyForm(player);
    });
}

export function showBountyMainForm(player: any) {
    const ownBounties = getOwnActiveBounties(player);
    const activeCount = getAllBounties().length;
    const form = new ActionFormData()
        .title({ translate: "bounty.form.main.title" })
        .body({ translate: "bounty.form.main.body", with: [`${activeCount}`, `${ownBounties.length}`, `${config.MoneyName} ${(config.bountyMinAmount ?? 10000)}`] })
        .button({ translate: "bounty.form.main.place" })
        .button({ translate: "bounty.form.main.list", with: [`${activeCount}`] })
        .button({ translate: "bounty.form.main.cancel", with: [`${ownBounties.length}`] });

    if (player.hasTag("mc_admin")) {
        form.button({ translate: "bounty.form.main.clear" });
    }
    form.button({ translate: "mc.button.close" });

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) return showBountyMainForm(player);
            return;
        }

        let selection = rs.selection ?? 0;
        if (selection === 0) return showPlaceBountyForm(player);
        if (selection === 1) return showBountyListForm(player);
        if (selection === 2) return showCancelOwnBountyForm(player);
        if (player.hasTag("mc_admin")) {
            if (selection === 3) return showAdminClearBountyForm(player);
        }
    });
}
