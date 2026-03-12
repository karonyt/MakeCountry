// teleport.js
import { world, system, Player } from '@minecraft/server';
import { ActionFormData, ModalFormData, FormCancelationReason } from "@minecraft/server-ui";
import config from '../../config.js';
import { SmartPhoneHomeScreen } from '../../lib/smartphone.js';

const teleportRequests = new Map();
const timeoutHandlers = new Map();

// -------------------- 初期化 -------------------- //
world.afterEvents.worldLoad.subscribe(() => world.getPlayers().forEach(p => teleportRequests.set(p.name, [])));
world.afterEvents.playerJoin.subscribe(ev => teleportRequests.set(ev.playerName, []));

// -------------------- 共通関数 -------------------- //
function getOtherPlayers(sender: any) {
    return world.getPlayers().filter(p => p.name !== sender.name).map(p => p.name);
}

function findPlayerByName(name: any) {
    return world.getPlayers({ name })[0];
}

function canTeleport(sender: any, target: any) {
    if (config.combatTagNoTeleportValidity && (sender.hasTag("mc_combat") || target.hasTag("mc_combat"))) return false;
    if (config.invaderNoTeleportValidity && (sender.getTags().some((t: any) => t.startsWith("war")) || target.getTags().some((t: any) => t.startsWith("war")))) return false;
    return true;
}

// タイムアウト付きリクエスト送信
function sendTeleportRequest(sender: any, targetName: any) {
    const requests = teleportRequests.get(targetName) || [];
    if (requests.includes(sender.name)) return false;

    requests.push(sender.name);
    teleportRequests.set(targetName, requests);

    const timeoutId = system.runTimeout(() => {
        const updatedRequests = teleportRequests.get(targetName).filter((n: any) => n !== sender.name);
        teleportRequests.set(targetName, updatedRequests);
        timeoutHandlers.delete(`${sender.name}=>${targetName}`);
    }, config.tpaValiditySeconds * 20);

    timeoutHandlers.set(`${sender.name}=>${targetName}`, timeoutId);
    return true;
}

// リクエスト承認
function acceptTeleportRequest(sender: any, requesterName: any) {
    const player = findPlayerByName(requesterName);
    if (!player || !teleportRequests.get(sender.name)?.includes(requesterName)) return false;
    if (!canTeleport(sender, player)) return false;

    player.teleport(sender.location, { dimension: sender.dimension });

    const updatedRequests = teleportRequests.get(sender.name).filter((n: any) => n !== requesterName);
    teleportRequests.set(sender.name, updatedRequests);

    const timeoutId = timeoutHandlers.get(`${requesterName}=>${sender.name}`);
    system.clearRun(timeoutId);
    timeoutHandlers.delete(`${requesterName}=>${sender.name}`);
    return true;
}

// -------------------- UI / フォーム -------------------- //

// キャンセル時の挙動を統一（スマホフラグ追加）
function onFormCancel(player: any, reason: any, isSmartPhone = false) {
    if (reason === FormCancelationReason.UserBusy) return tpaMainForm(player, isSmartPhone);
    if (isSmartPhone) return SmartPhoneHomeScreen(player);
}

// メインフォーム
export function tpaMainForm(player: any, isSmartPhone = false) {
    if (!config.tpaValidity) {
        player.sendMessage({ translate: `command.error.tpa.novalidity` });
        return;
    };
    if (player.hasTag(`mc_notp`)) {
        return;
    };
    if (config.combatTagNoTeleportValidity) {
        if (player.hasTag(`mc_combat`)) {
            player.sendMessage({ translate: `teleport.error.combattag` });
            return;
        };
    };
    if (config.invaderNoTeleportValidity) {
        if (player.getTags().find((tag: any) => tag.startsWith(`war`))) {
            player.sendMessage({ translate: `teleport.error.invader` });
            return;
        };
    };

    const form = new ActionFormData()
        .title({ translate: `form.title.teleport` })
        .button({ translate: `form.teleport.button.send` })
        .button({ translate: `form.teleport.button.receive` });

    form.show(player).then(rs => {
        if (rs.canceled) return onFormCancel(player, rs.cancelationReason, isSmartPhone);

        if (rs.selection === 0) showRequestSendMenu(player, isSmartPhone);
        if (rs.selection === 1) showRequestAcceptMenu(player, isSmartPhone);
    });
}

// リクエスト送信フォーム
function showRequestSendMenu(sender: any, isSmartPhone = false) {
    const others = getOtherPlayers(sender);
    if (!others.length) return sender.sendMessage({ translate: `command.error.notarget.player` });

    const form = new ModalFormData()
        .title({ translate: `form.teleport.button.send` })
        // @ts-ignore TS(2345): Argument of type '{ defaultValue: number; }' is no... Remove this comment to see the full error message
        .dropdown({ translate: `players.list` }, others, { defaultValue: 0 });

    form.show(sender).then(rs => {
        if (rs.canceled) return onFormCancel(sender, rs.cancelationReason, isSmartPhone);

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const targetName = others[rs.formValues[0]];
        if (sendTeleportRequest(sender, targetName)) {
            sender.sendMessage({ rawtext: [{ translate: `teleport.request.send.message`, with: [targetName] }] });
            findPlayerByName(targetName)?.sendMessage({
                rawtext: [
                    { translate: `teleport.request.receive.message`, with: [sender.name] },
                    { text: `\n` },
                    { translate: `teleport.request.limit.message`, with: [`${config.tpaValiditySeconds}`] }
                ]
            });
        } else {
            sender.sendMessage({ translate: `teleport.request.already.send` });
        }
    });
}

// リクエスト承認フォーム
function showRequestAcceptMenu(sender: any, isSmartPhone = false) {
    const requests = teleportRequests.get(sender.name) || [];
    if (!requests.length) return tpaMainForm(sender, isSmartPhone);

    const form = new ActionFormData()
        .title({ translate: `form.teleport.button.receive` })
        .button({ translate: `mc.button.back` });

    for (const name of requests) {
        form.button({ translate: `mc.button.accept.request`, with: [name] });
    }

    form.show(sender).then(rs => {
        if (rs.canceled) return onFormCancel(sender, rs.cancelationReason, isSmartPhone);
        if (rs.selection === 0) return tpaMainForm(sender, isSmartPhone);

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const requesterName = requests[rs.selection - 1];
        if (!acceptTeleportRequest(sender, requesterName)) {
            sender.sendMessage({ translate: `application.deadline.message` });
        }
    });
}

// -------------------- コマンド用関数 -------------------- //

export function teleportRequest(player: any, targetName: any) {
    const target = findPlayerByName(targetName);
    if (!target) return player.sendMessage({ translate: `command.error.notarget.player` });

    if (sendTeleportRequest(player, target.name)) {
        player.sendMessage({ rawtext: [{ translate: `teleport.request.send.message`, with: [target.name] }] });
        target.sendMessage({
            rawtext: [
                { translate: `teleport.request.receive.message`, with: [player.name] },
                { text: `\n` },
                { translate: `teleport.request.limit.message`, with: [`${config.tpaValiditySeconds}`] }
            ]
        });
    } else {
        player.sendMessage({ translate: `teleport.request.already.send` });
    }
}

export function AcceptTeleportRequest(sender: any) {
    const requests = teleportRequests.get(sender.name) || [];
    const requesterName = requests[requests.length - 1];
    if (!acceptTeleportRequest(sender, requesterName)) {
        sender.sendMessage({ translate: `application.deadline.message` });
    }
}
