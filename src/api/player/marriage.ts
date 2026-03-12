import { Player, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, MessageFormData, ModalFormData } from "@minecraft/server-ui";
import config from "../../config.js";
import { DynamicProperties } from "../dyp.js";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "../../lib/util.js";
import { playerMainMenuDefaultForm } from "../../forms/default/menu/player_main_menu.js";

/**
 * @typedef {import("../../jsdoc/player").PlayerData} PlayerData
 */

const marriageBankDB = new DynamicProperties("marriagebank");

function createDefaultMarriageData() {
    return {
        spouseId: undefined,
        since: undefined,
        requests: [],
    };
}

/**
 * @param {string} playerId
 * @param {string} spouseId
 * @returns {string}
 */
function getMarriageBankKey(playerId: any, spouseId: any) {
    return `wallet_${[playerId, spouseId].sort().join("_")}`;
}

/**
 * @param {PlayerData | undefined} playerData
 * @returns {PlayerData | undefined}
 */
export function ensureMarriageData(playerData: any) {
    if (!playerData) return playerData;
    playerData.invite ??= [];
    playerData.roles ??= [];
    playerData.chunks ??= [];
    playerData.settings ??= { inviteReceiveMessage: true };
    playerData.marriage ??= createDefaultMarriageData();
    playerData.marriage.requests ??= [];
    if (playerData.marriage.spouseId === null) playerData.marriage.spouseId = undefined;
    if (playerData.marriage.since === null) playerData.marriage.since = undefined;
    return playerData;
}

/**
 * @param {string} playerId
 * @returns {PlayerData | undefined}
 */
export function getPlayerDataById(playerId: any) {
    const playerData = GetAndParsePropertyData(`player_${playerId}`);
    return ensureMarriageData(playerData);
}

/**
 * @param {string} playerId
 * @param {PlayerData} playerData
 */
function savePlayerData(playerId: any, playerData: any) {
    ensureMarriageData(playerData);
    StringifyAndSavePropertyData(`player_${playerId}`, playerData);
}

/**
 * @param {string | undefined} playerId
 * @returns {string}
 */
export function getPlayerNameById(playerId: any) {
    if (!playerId) return "None";
    return getPlayerDataById(playerId)?.name ?? "Unknown";
}

/**
 * @param {PlayerData | undefined} playerData
 * @returns {boolean}
 */
export function isMarried(playerData: any) {
    return !!playerData?.marriage?.spouseId;
}

/**
 * @param {PlayerData | undefined} playerData
 * @returns {number}
 */
export function getSharedWalletBalance(playerData: any) {
    const spouseId = playerData?.marriage?.spouseId;
    if (!playerData?.id || !spouseId) return 0;
    const raw = marriageBankDB.get(getMarriageBankKey(playerData.id, spouseId));
    return raw ? Number(raw) || 0 : 0;
}

/**
 * @param {string} playerId
 * @param {string} spouseId
 * @param {number} amount
 */
function setSharedWalletBalance(playerId: any, spouseId: any, amount: any) {
    marriageBankDB.set(getMarriageBankKey(playerId, spouseId), `${Math.max(0, Math.floor(amount))}`);
}

/**
 * @param {number | undefined} since
 * @returns {string}
 */
function formatMarriageDate(since: any) {
    if (!since) return "Unknown";
    const date = new Date(since);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}/${month}/${day}`;
}

/**
 * @param {Player} player
 * @returns {PlayerData | undefined}
 */
function getPlayerData(player: any) {
    return getPlayerDataById(player.id);
}

/**
 * @param {Player} sender
 * @param {Player} target
 * @returns {boolean}
 */
function canTeleportLikeTpa(sender: any, target: any) {
    if (!config.tpaValidity) {
        sender.sendMessage({ translate: "command.error.tpa.novalidity" });
        return false;
    }
    if (sender.hasTag("mc_notp")) {
        return false;
    }
    if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
        sender.sendMessage({ translate: "teleport.error.combattag" });
        return false;
    }
    if (config.invaderNoTeleportValidity && sender.getTags().some((tag: any) => tag.startsWith("war"))) {
        sender.sendMessage({ translate: "teleport.error.invader" });
        return false;
    }
    if (config.combatTagNoTeleportValidity && (sender.hasTag("mc_combat") || target.hasTag("mc_combat"))) {
        sender.sendMessage({ translate: "marriage.teleport.error.combat_blocked" });
        return false;
    }
    if (config.invaderNoTeleportValidity && (sender.getTags().some((tag: any) => tag.startsWith("war")) || target.getTags().some((tag: any) => tag.startsWith("war")))) {
        sender.sendMessage({ translate: "marriage.teleport.error.war_blocked" });
        return false;
    }
    return true;
}

/**
 * @param {Player} sender
 */
export function teleportToSpouse(sender: any) {
    const senderData = getPlayerData(sender);
    const spouseId = senderData?.marriage?.spouseId;
    if (!spouseId) {
        sender.sendMessage({ translate: "marriage.error.not_married" });
        return false;
    }

    const spouseData = getPlayerDataById(spouseId);
    const spouse = spouseData ? world.getPlayers({ name: spouseData.name })[0] : undefined;
    if (!spouse) {
        sender.sendMessage({ translate: "marriage.error.spouse_offline" });
        return false;
    }

    if (!canTeleportLikeTpa(sender, spouse)) {
        return false;
    }

    sender.teleport(spouse.location, { dimension: spouse.dimension });
    sender.sendMessage({ translate: "marriage.teleport.success", with: [spouse.name] });
    return true;
}

/**
 * @param {Player} player
 * @param {number} amount
 */
function depositSharedWallet(player: any, amount: any) {
    const playerData = getPlayerData(player);
    const spouseId = playerData?.marriage?.spouseId;
    if (!playerData || !spouseId) {
        player.sendMessage({ translate: "marriage.error.not_married" });
        return false;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
        player.sendMessage({ translate: "marriage.wallet.error.positive_integer" });
        return false;
    }
    if (playerData.money < amount) {
        player.sendMessage({ translate: "marriage.wallet.error.not_enough_money", with: [`${config.MoneyName} ${playerData.money}`] });
        return false;
    }

    playerData.money -= amount;
    const balance = getSharedWalletBalance(playerData) + amount;
    savePlayerData(player.id, playerData);
    setSharedWalletBalance(player.id, spouseId, balance);
    player.sendMessage({ translate: "marriage.wallet.deposit.success", with: [`${config.MoneyName} ${amount}`, `${config.MoneyName} ${balance}`] });
    return true;
}

/**
 * @param {Player} player
 * @param {number} amount
 */
function withdrawSharedWallet(player: any, amount: any) {
    const playerData = getPlayerData(player);
    const spouseId = playerData?.marriage?.spouseId;
    if (!playerData || !spouseId) {
        player.sendMessage({ translate: "marriage.error.not_married" });
        return false;
    }
    if (!Number.isInteger(amount) || amount <= 0) {
        player.sendMessage({ translate: "marriage.wallet.error.positive_integer" });
        return false;
    }

    const balance = getSharedWalletBalance(playerData);
    if (balance < amount) {
        player.sendMessage({ translate: "marriage.wallet.error.shared_balance", with: [`${config.MoneyName} ${balance}`] });
        return false;
    }

    playerData.money += amount;
    savePlayerData(player.id, playerData);
    setSharedWalletBalance(player.id, spouseId, balance - amount);
    player.sendMessage({ translate: "marriage.wallet.withdraw.success", with: [`${config.MoneyName} ${amount}`, `${config.MoneyName} ${balance - amount}`] });
    return true;
}

/**
 * @param {Player} sender
 * @param {Player} target
 */
export function sendMarriageRequest(sender: any, target: any) {
    if (sender.id === target.id) {
        sender.sendMessage({ translate: "marriage.request.error.self" });
        return false;
    }

    const senderData = getPlayerData(sender);
    const targetData = getPlayerData(target);
    if (!senderData || !targetData) {
        sender.sendMessage({ translate: "marriage.error.load_player" });
        return false;
    }

    if (isMarried(senderData)) {
        sender.sendMessage({ translate: "marriage.error.already_married" });
        return false;
    }
    if (isMarried(targetData)) {
        sender.sendMessage({ translate: "marriage.request.error.target_married", with: [target.name] });
        return false;
    }

    if (targetData.marriage.requests.includes(sender.id)) {
        sender.sendMessage({ translate: "marriage.request.error.already_sent", with: [target.name] });
        return false;
    }

    if (senderData.marriage.requests.includes(target.id)) {
        return acceptMarriageRequest(target, sender.id, true);
    }

    targetData.marriage.requests.push(sender.id);
    savePlayerData(target.id, targetData);

    sender.sendMessage({ translate: "marriage.request.sent.sender", with: [target.name] });
    target.sendMessage({ translate: "marriage.request.sent.target", with: [sender.name] });
    target.sendMessage({ translate: "marriage.request.sent.hint" });
    return true;
}

/**
 * @param {Player} player
 * @param {string} requesterId
 * @param {boolean} [silent]
 */
export function acceptMarriageRequest(player: any, requesterId: any, silent = false) {
    const playerData = getPlayerData(player);
    const requesterData = getPlayerDataById(requesterId);
    if (!playerData || !requesterData) {
        player.sendMessage({ translate: "marriage.error.load_player" });
        return false;
    }

    if (isMarried(playerData)) {
        player.sendMessage({ translate: "marriage.error.already_married" });
        return false;
    }
    if (isMarried(requesterData)) {
        player.sendMessage({ translate: "marriage.request.error.target_married", with: [requesterData.name] });
        playerData.marriage.requests = playerData.marriage.requests.filter((id: any) => id !== requesterId);
        savePlayerData(player.id, playerData);
        return false;
    }
    if (!playerData.marriage.requests.includes(requesterId)) {
        player.sendMessage({ translate: "marriage.request.error.missing" });
        return false;
    }

    const marriedAt = Date.now();
    playerData.marriage.requests = playerData.marriage.requests.filter((id: any) => id !== requesterId);
    playerData.marriage.spouseId = requesterId;
    playerData.marriage.since = marriedAt;

    requesterData.marriage.requests = requesterData.marriage.requests.filter((id: any) => id !== player.id);
    requesterData.marriage.spouseId = player.id;
    requesterData.marriage.since = marriedAt;

    savePlayerData(player.id, playerData);
    savePlayerData(requesterId, requesterData);
    setSharedWalletBalance(player.id, requesterId, getSharedWalletBalance(playerData));

    if (!silent) {
        player.sendMessage({ translate: "marriage.request.accepted.self", with: [requesterData.name] });
    }

    const requester = world.getPlayers({ name: requesterData.name })[0];
    requester?.sendMessage({ translate: "marriage.request.accepted.self", with: [player.name] });
    return true;
}

/**
 * @param {Player} player
 * @param {string} requesterId
 */
export function rejectMarriageRequest(player: any, requesterId: any) {
    const playerData = getPlayerData(player);
    if (!playerData) {
        player.sendMessage({ translate: "marriage.error.load_player" });
        return false;
    }
    if (!playerData.marriage.requests.includes(requesterId)) {
        player.sendMessage({ translate: "marriage.request.error.missing" });
        return false;
    }

    playerData.marriage.requests = playerData.marriage.requests.filter((id: any) => id !== requesterId);
    savePlayerData(player.id, playerData);

    const requesterData = getPlayerDataById(requesterId);
    player.sendMessage({ translate: "marriage.request.rejected.self", with: [requesterData?.name ?? "target"] });
    const requester = requesterData ? world.getPlayers({ name: requesterData.name })[0] : undefined;
    requester?.sendMessage({ translate: "marriage.request.rejected.target", with: [player.name] });
    return true;
}

/**
 * @param {Player} player
 */
export function divorce(player: any) {
    const playerData = getPlayerData(player);
    if (!playerData?.marriage?.spouseId) {
        player.sendMessage({ translate: "marriage.error.not_married" });
        return false;
    }

    const spouseId = playerData.marriage.spouseId;
    const spouseData = getPlayerDataById(spouseId);
    const balance = getSharedWalletBalance(playerData);
    const shareA = Math.floor(balance / 2);
    const shareB = balance - shareA;

    playerData.money += shareA;
    playerData.marriage.spouseId = undefined;
    playerData.marriage.since = undefined;
    savePlayerData(player.id, playerData);

    if (spouseData?.marriage?.spouseId === player.id) {
        spouseData.money = (spouseData.money ?? 0) + shareB;
        spouseData.marriage.spouseId = undefined;
        spouseData.marriage.since = undefined;
        savePlayerData(spouseId, spouseData);
    }

    marriageBankDB.delete(getMarriageBankKey(player.id, spouseId));

    player.sendMessage({ translate: "marriage.divorce.self", with: [`${config.MoneyName} ${shareA}`] });
    const spouse = spouseData ? world.getPlayers({ name: spouseData.name })[0] : undefined;
    spouse?.sendMessage({ translate: "marriage.divorce.target", with: [player.name, `${config.MoneyName} ${shareB}`] });
    return true;
}

/**
 * @param {DynamicProperties} playerDataBase
 * @param {string} oldId
 * @param {string} newId
 */
export function migrateMarriageReferences(playerDataBase: any, oldId: any, newId: any) {
    for (const key of playerDataBase.idList) {
        const raw = playerDataBase.get(key);
        if (!raw) continue;
        const playerData = ensureMarriageData(JSON.parse(raw));
        let updated = false;

        if (playerData.marriage.spouseId === oldId) {
            playerData.marriage.spouseId = newId;
            updated = true;
        }

        if (playerData.marriage.requests.includes(oldId)) {
            playerData.marriage.requests = playerData.marriage.requests.map((id: any) => id === oldId ? newId : id);
            updated = true;
        }

        if (updated) {
            playerDataBase.set(key, JSON.stringify(playerData));
        }
    }

    for (const key of marriageBankDB.idList) {
        if (!key.includes(oldId)) continue;
        const raw = marriageBankDB.get(key);
        if (raw === undefined) continue;
        const newKey = key.replace(oldId, newId);
        marriageBankDB.set(newKey, raw);
        marriageBankDB.delete(key);
    }
}

/**
 * @param {Player} player
 */
function showMarriageWalletAmountForm(player: any, mode: "deposit" | "withdraw") {
    const playerData = getPlayerData(player);
    const balance = getSharedWalletBalance(playerData);
    const ownMoney = playerData?.money ?? 0;
    const title = mode === "deposit" ? { translate: "marriage.wallet.amount.deposit.title" } : { translate: "marriage.wallet.amount.withdraw.title" };

    new ModalFormData()
        .title(title)
        .textField(
            mode === "deposit"
                ? { translate: "marriage.wallet.amount.deposit.body", with: [`${config.MoneyName} ${ownMoney}`, `${config.MoneyName} ${balance}`] }
                : { translate: "marriage.wallet.amount.withdraw.body", with: [`${config.MoneyName} ${balance}`, `${config.MoneyName} ${ownMoney}`] },
            { translate: "marriage.wallet.amount.input" }
        )
        .show(player)
        .then((rs: any) => {
            if (rs.canceled) {
                return showMarriageWalletForm(player);
            }
            const value = Number(rs.formValues?.[0]);
            if (!Number.isInteger(value) || value <= 0) {
                player.sendMessage({ translate: "marriage.wallet.error.positive_integer" });
                return showMarriageWalletAmountForm(player, mode);
            }
            if (mode === "deposit") {
                depositSharedWallet(player, value);
            } else {
                withdrawSharedWallet(player, value);
            }
            showMarriageWalletForm(player);
        });
}

/**
 * @param {Player} player
 */
function showMarriageWalletForm(player: any) {
    const playerData = getPlayerData(player);
    if (!playerData?.marriage?.spouseId) {
        player.sendMessage({ translate: "marriage.error.not_married" });
        return showMarriageMainForm(player);
    }

    const spouseName = getPlayerNameById(playerData.marriage.spouseId);
    const balance = getSharedWalletBalance(playerData);

    new ActionFormData()
        .title({ translate: "marriage.wallet.title" })
        .body({ translate: "marriage.wallet.body", with: [spouseName, `${config.MoneyName} ${balance}`, `${config.MoneyName} ${playerData.money}`] })
        .button({ translate: "marriage.wallet.button.deposit" })
        .button({ translate: "marriage.wallet.button.withdraw" })
        .button({ translate: "mc.button.back" })
        .show(player)
        .then((rs: any) => {
            if (rs.canceled) {
                if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                    return showMarriageWalletForm(player);
                }
                return;
            }
            if (rs.selection === 0) {
                return showMarriageWalletAmountForm(player, "deposit");
            }
            if (rs.selection === 1) {
                return showMarriageWalletAmountForm(player, "withdraw");
            }
            showMarriageMainForm(player);
        });
}

/**
 * @param {Player} player
 */
function showMarriageRequestListForm(player: any) {
    const playerData = getPlayerData(player);
    if (!playerData) {
        player.sendMessage({ translate: "marriage.error.load_player" });
        return;
    }

    const requests = playerData.marriage.requests.map((id: any) => ({ id, name: getPlayerNameById(id) }));
    const form = new ActionFormData().title({ translate: "marriage.request.list.title" }).button({ translate: "mc.button.back" });

    if (!requests.length) {
        form.body({ translate: "marriage.request.list.empty" });
    } else {
        form.body({ translate: "marriage.request.list.body", with: [`${requests.length}`] });
        for (const request of requests) {
            form.button(request.name);
        }
    }

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                return showMarriageRequestListForm(player);
            }
            return;
        }
        if (rs.selection === 0 || !requests.length) {
            return showMarriageMainForm(player);
        }
        showMarriageRequestDetailForm(player, requests[rs.selection - 1].id);
    });
}

/**
 * @param {Player} player
 * @param {string} requesterId
 */
function showMarriageRequestDetailForm(player: any, requesterId: any) {
    const requesterName = getPlayerNameById(requesterId);
    new ActionFormData()
        .title({ translate: "marriage.request.detail.title" })
        .body({ translate: "marriage.request.detail.body", with: [requesterName] })
        .button({ translate: "marriage.request.button.accept" })
        .button({ translate: "marriage.request.button.reject" })
        .button({ translate: "mc.button.back" })
        .show(player)
        .then((rs: any) => {
            if (rs.canceled) {
                if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                    return showMarriageRequestDetailForm(player, requesterId);
                }
                return;
            }

            if (rs.selection === 0) {
                acceptMarriageRequest(player, requesterId);
                return showMarriageMainForm(player);
            }
            if (rs.selection === 1) {
                rejectMarriageRequest(player, requesterId);
                return showMarriageRequestListForm(player);
            }
            showMarriageRequestListForm(player);
        });
}

/**
 * @param {Player} player
 */
function showMarriageProposalForm(player: any) {
    const candidates = world.getPlayers()
        .filter((target: any) => target.id !== player.id)
        .map((target: any) => ({ player: target, data: getPlayerData(target) }))
        .filter((target: any) => !isMarried(target.data));

    if (!candidates.length) {
        player.sendMessage({ translate: "marriage.request.error.no_candidates" });
        return showMarriageMainForm(player);
    }

    const names = candidates.map((target: any) => target.player.name);
    new ModalFormData()
        .title({ translate: "marriage.request.proposal.title" })
        .dropdown({ translate: "marriage.request.proposal.dropdown" }, names, { defaultValueIndex: 0 })
        .show(player)
        .then((rs: any) => {
            if (rs.canceled) {
                if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                    return showMarriageProposalForm(player);
                }
                return showMarriageMainForm(player);
            }

            const selection = rs.formValues?.[0];
            const target = typeof selection === "number" ? candidates[selection]?.player : undefined;
            if (!target) {
                player.sendMessage({ translate: "marriage.request.error.resolve_player" });
                return showMarriageMainForm(player);
            }

            sendMarriageRequest(player, target);
            showMarriageMainForm(player);
        });
}

/**
 * @param {Player} player
 */
function showDivorceConfirmForm(player: any) {
    const playerData = getPlayerData(player);
    const spouseName = getPlayerNameById(playerData?.marriage?.spouseId);
    const balance = getSharedWalletBalance(playerData);

    new MessageFormData()
        .title({ translate: "marriage.divorce.title" })
        .body({ translate: "marriage.divorce.body", with: [spouseName, `${config.MoneyName} ${balance}`] })
        .button1({ translate: "marriage.divorce.button.confirm" })
        .button2({ translate: "mc.button.back" })
        .show(player)
        .then((rs: any) => {
            if (rs.canceled) {
                return showMarriageMainForm(player);
            }
            if (rs.selection === 0) {
                divorce(player);
                return;
            }
            showMarriageMainForm(player);
        });
}

/**
 * @param {Player} player
 */
export function showMarriageMainForm(player: any) {
    const playerData = getPlayerData(player);
    if (!playerData) {
        player.sendMessage({ translate: "marriage.error.load_player" });
        return;
    }

    const spouseName = getPlayerNameById(playerData.marriage.spouseId);
    const since = formatMarriageDate(playerData.marriage.since);
    const requestCount = playerData.marriage.requests.length;
    const married = isMarried(playerData);
    const balance = getSharedWalletBalance(playerData);

    const form = new ActionFormData()
        .title({ translate: "marriage.title" })
        .body(
            married
                ? { translate: "marriage.body.married", with: [spouseName, since, `${config.MoneyName} ${balance}`] }
                : { translate: "marriage.body.single", with: [`${requestCount}`] }
        );

    if (married) {
        form.button({ translate: "marriage.button.wallet" });
        form.button({ translate: "marriage.button.teleport" });
        form.button({ translate: "marriage.button.divorce" });
    } else {
        form.button({ translate: "marriage.button.send_request" });
        form.button({ translate: "marriage.button.requests", with: [`${requestCount}`] });
    }

    form.button({ translate: "marriage.button.back_to_menu" });

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                return showMarriageMainForm(player);
            }
            return;
        }

        if (married) {
            if (rs.selection === 0) {
                return showMarriageWalletForm(player);
            }
            if (rs.selection === 1) {
                teleportToSpouse(player);
                return showMarriageMainForm(player);
            }
            if (rs.selection === 2) {
                return showDivorceConfirmForm(player);
            }
            return playerMainMenuDefaultForm(player);
        }

        if (rs.selection === 0) {
            return showMarriageProposalForm(player);
        }
        if (rs.selection === 1) {
            return showMarriageRequestListForm(player);
        }
        playerMainMenuDefaultForm(player);
    });
}
