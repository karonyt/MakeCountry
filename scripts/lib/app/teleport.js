import { world, system, Player } from '@minecraft/server';
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm, ModalForm } from "../form_class";
const ActionFormData = ActionForm;
const ModalFormData = ModalForm;
import config from '../../config.js';
import { SmartPhoneHomeScreen } from '../smartphone.js';

const teleportRequests = new Map();
const timeoutHandlers = new Map();

world.afterEvents.worldLoad.subscribe(() => {
    const players = world.getPlayers();
    for (const player of players) {
        teleportRequests.set(player.name, []);
    };
});

/**
 * @param {Player} sender
 * @returns {string[]}
 */
function getOtherPlayers(sender) {
    return world.getPlayers().filter(player => player.name !== sender.name).map(player => player.name);
};

/**
 * @param {string} name
 * @returns {Player}
 */
function findPlayerByName(name) {
    return world.getPlayers({ name: name })[0];
};

/**
 * @param {Player} player
 */
export function TeleportApp(player) {
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
        if (player.getTags().find(tag => tag.startsWith(`war`))) {
            player.sendMessage({ translate: `teleport.error.invader` });
            return;
        };
    };
    const form = new ActionFormData()
        .title({ translate: `form.title.teleport` })
        .button({ translate: `form.teleport.button.send` })
        .button({ translate: `form.teleport.button.receive` });

    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                TeleportApp(player);
                return;
            };
            SmartPhoneHomeScreen(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                showRequestSendMenu(player);
                break;
            };
            case 1: {
                showRequestAcceptMenu(player);
                break;
            };
        };
    });
};

/**
 * @param {Player} sender
 */
const showRequestSendMenu = (sender) => {
    const otherPlayers = getOtherPlayers(sender);

    if (otherPlayers.length === 0) {
        sender.sendMessage({ translate: `command.error.notarget.player` });
        return;
    };

    const modalForm = new ModalFormData()
    modalForm.title({ translate: `form.teleport.button.send` })
    modalForm.dropdown({ translate: `players.list` }, otherPlayers, 0);

    modalForm.show(sender).then((rs) => {
        if (rs.canceled) {
            TeleportApp(sender);
            return;
        };
        const selectedPlayerName = otherPlayers[rs.formValues[0]];
        const requests = teleportRequests.get(selectedPlayerName) || [];

        if (!requests.includes(sender.name)) {
            sender.sendMessage({ rawtext: [{ translate: `teleport.request.send.message`, with: [`${selectedPlayerName}`] }] });
            findPlayerByName(selectedPlayerName)?.sendMessage({ rawtext: [{ translate: `teleport.request.receive.message`, with: [`${sender.name}`] }, { text: `\n` }, { translate: `teleport.request.limit.message`, with: [`${config.tpaValiditySeconds}`] }] });;

            requests.push(sender.name);
            teleportRequests.set(selectedPlayerName, requests);

            const timeoutId = system.runTimeout(() => {
                const requests = teleportRequests.get(selectedPlayerName) || [];
                const updatedRequests = requests.filter((value) => value !== sender.name);

                teleportRequests.set(selectedPlayerName, updatedRequests);
                timeoutHandlers.delete(`${sender.name}=>${selectedPlayerName}`);
            }, config.tpaValiditySeconds * 20);

            timeoutHandlers.set(`${sender.name}=>${selectedPlayerName}`, timeoutId);
        } else {
            sender.sendMessage({ translate: `teleport.request.already.send` });
        };
    });
};

/**
 * @param {Player} sender
 */
function showRequestAcceptMenu(sender) {
    const requests = teleportRequests.get(sender.name) || [];

    const form = new ActionFormData()
    form.title({ translate: `form.teleport.button.receive` });
    form.button({ translate: `mc.button.back` });
    for (const playerName of requests) {
        form.button({ translate: `mc.button.accept.request`, with: [`${playerName}`] });
    };

    form.show(sender).then((rs) => {
        if (rs.canceled) {
            TeleportApp(sender);
            return;
        };
        switch (rs.selection) {
            case 0: {
                TeleportApp(sender);
                return;
            };
            default: {
                const playerName = requests[rs.selection - 1];
                if (teleportRequests.get(sender.name).includes(playerName)) {
                    const player = findPlayerByName(playerName);
                    if (!player) return;
                    if (config.combatTagNoTeleportValidity && player.hasTag("mc_combat")) {
                        player.sendMessage({ translate: "teleport.error.combattag" });
                        return;
                    }
                    if (config.invaderNoTeleportValidity && player.getTags().find(tag => tag.startsWith("war"))) {
                        player.sendMessage({ translate: "teleport.error.invader" });
                        return;
                    }
                    if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
                        sender.sendMessage({ translate: "teleport.error.combattag" });
                        return;
                    }
                    if (config.invaderNoTeleportValidity && sender.getTags().find(tag => tag.startsWith("war"))) {
                        sender.sendMessage({ translate: "teleport.error.invader" });
                        return;
                    }

                    player.teleport(sender.location, { dimension: sender.dimension });

                    sender.sendMessage({ translate: `accept.request.message` });

                    const updatedRequests = requests.filter((value) => value !== playerName);
                    teleportRequests.set(sender.name, updatedRequests);

                    const timeoutId = timeoutHandlers.get(`${playerName}=>${sender.name}`);
                    system.clearRun(timeoutId);
                    timeoutHandlers.delete(`${playerName}=>${sender.name}`);
                } else {
                    sender.sendMessage({ translate: `application.deadline.message` });
                };
            };
        };
    });
};