import { Player, system, world } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { playerMainMenuDefaultForm } from "@/features/forms/default/menu/player_main_menu.js";
import { getMutedPlayerNames, resolvePlayerName, setMutedPlayerNames, unmutePlayer } from "@/domain/chat/mute.js";

export function playerChatMuteMenuForm(player: Player) {
    const form = new ActionFormData();
    const mutedPlayers = getMutedPlayerNames(player);

    form.title({ translate: "chatmute.title" });
    form.body({ translate: "chatmute.menu.body", with: [`${mutedPlayers.length}`] });
    form.button({ translate: "chatmute.button.manage_online" });
    form.button({ translate: "chatmute.button.list" });
    form.button({ translate: "settings.button.back_to_main_menu" });

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
        player.sendMessage({ translate: "chatmute.error.no_online_candidates" });
        playerChatMuteMenuForm(player);
        return;
    }

    const currentMuted = getMutedPlayerNames(player);
    const form = new ModalFormData();
    form.title({ translate: "chatmute.title" });

    for (const target of candidates) {
        const isMuted = currentMuted.some(name => name.trim().toLowerCase() === target.name.trim().toLowerCase());
        form.toggle(target.name, { defaultValue: isMuted });
    }

    form.submitButton({ translate: "mc.button.update" });
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
        player.sendMessage({ translate: "chatmute.updated", with: [`${saved.length}`] });
        playerChatMuteMenuForm(player);
    });
}

function showMutedPlayerListForm(player: Player) {
    const mutedPlayers = getMutedPlayerNames(player);

    if (mutedPlayers.length < 1) {
        player.sendMessage({ translate: "chatmute.empty" });
        playerChatMuteMenuForm(player);
        return;
    }

    const form = new ActionFormData();
    form.title({ translate: "chatmute.title" });
    form.body({ translate: "chatmute.list.body" });

    for (const name of mutedPlayers) {
        form.button(name);
    }

    form.button({ translate: "mc.button.back" });
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
        player.sendMessage(result.changed
            ? { translate: "chatmute.unmuted", with: [targetName] }
            : { translate: "chatmute.not_muted", with: [targetName] });
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
        ? { translate: "chatmute.unmuted", with: [resolvedName] }
        : { translate: "chatmute.muted", with: [resolvedName] });

    system.runTimeout(() => {
        player.sendMessage({ translate: "chatmute.current_count", with: [`${saved.length}`] });
    }, 1);
}
