import { Player, system, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "../player_main_menu.js";
import { getMutedPlayerNames, resolvePlayerName, setMutedPlayerNames, unmutePlayer } from "../../../../lib/chat_mute.js";

export function playerChatMuteMenuForm(player: Player) {
    const form = new ActionFormData();
    const mutedPlayers = getMutedPlayerNames(player);

    form.title("個別チャットミュート");
    form.body(`ミュート中: ${mutedPlayers.length}人`);
    form.button("オンラインプレイヤーを管理");
    form.button("ミュート一覧を見る");
    form.button("メインメニューに戻る");

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => playerChatMuteMenuForm(player), 10);
            }
            return;
        }

        switch (rs.selection) {
            case 0:
                showOnlinePlayerMuteForm(player);
                break;
            case 1:
                showMutedPlayerListForm(player);
                break;
            default:
                playerMainMenuDefaultForm(player);
                break;
        }
    });
}

function showOnlinePlayerMuteForm(player: Player) {
    const candidates = world.getPlayers()
        .filter(target => target.id !== player.id)
        .sort((a, b) => a.name.localeCompare(b.name));

    if (candidates.length < 1) {
        player.sendMessage("§e個別ミュート対象にできるオンラインプレイヤーがいません");
        playerChatMuteMenuForm(player);
        return;
    }

    const currentMuted = getMutedPlayerNames(player);
    const form = new ModalFormData();
    form.title("個別チャットミュート");

    for (const target of candidates) {
        const isMuted = currentMuted.some(name => name.trim().toLowerCase() === target.name.trim().toLowerCase());
        form.toggle(target.name, { defaultValue: isMuted });
    }

    form.submitButton("更新");
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => showOnlinePlayerMuteForm(player), 10);
                return;
            }
            playerChatMuteMenuForm(player);
            return;
        }

        const onlineNameMap = new Map(candidates.map(target => [target.name.trim().toLowerCase(), target.name]));
        const nextMuted = currentMuted.filter(name => !onlineNameMap.has(name.trim().toLowerCase()));

        for (let i = 0; i < candidates.length; i++) {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (rs.formValues[i]) nextMuted.push(candidates[i].name);
        }

        const saved = setMutedPlayerNames(player, nextMuted);
        player.sendMessage(`§a個別ミュート設定を更新しました (${saved.length}人)`);
        playerChatMuteMenuForm(player);
    });
}

function showMutedPlayerListForm(player: Player) {
    const mutedPlayers = getMutedPlayerNames(player);

    if (mutedPlayers.length < 1) {
        player.sendMessage("§e個別ミュート中のプレイヤーはいません");
        playerChatMuteMenuForm(player);
        return;
    }

    const form = new ActionFormData();
    form.title("個別チャットミュート");
    form.body("解除したいプレイヤーを選んでください");

    for (const name of mutedPlayers) {
        form.button(name);
    }

    form.button("戻る");
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => showMutedPlayerListForm(player), 10);
                return;
            }
            playerChatMuteMenuForm(player);
            return;
        }

        if (rs.selection === mutedPlayers.length) {
            playerChatMuteMenuForm(player);
            return;
        }

        const targetName = mutedPlayers[rs.selection ?? -1];
        if (!targetName) {
            playerChatMuteMenuForm(player);
            return;
        }

        const result = unmutePlayer(player, targetName);
        player.sendMessage(result.changed ? `§a${targetName} の個別ミュートを解除しました` : `§e${targetName} は個別ミュートされていません`);
        showMutedPlayerListForm(player);
    });
}

export function openChatMuteFormFromName(player: Player, rawName?: string) {
    const name = rawName?.trim();
    if (!name) {
        playerChatMuteMenuForm(player);
        return;
    }

    const resolvedName = resolvePlayerName(name, world.getPlayers());
    const currentMuted = getMutedPlayerNames(player);
    const exists = currentMuted.some(entry => entry.trim().toLowerCase() === resolvedName.trim().toLowerCase());
    const nextMuted = exists
        ? currentMuted.filter(entry => entry.trim().toLowerCase() !== resolvedName.trim().toLowerCase())
        : [...currentMuted, resolvedName];

    const saved = setMutedPlayerNames(player, nextMuted);
    player.sendMessage(exists
        ? `§a${resolvedName} の個別ミュートを解除しました`
        : `§a${resolvedName} を個別ミュートしました`);

    system.runTimeout(() => {
        player.sendMessage(`§7現在の個別ミュート数: ${saved.length}`);
    }, 1);
}
