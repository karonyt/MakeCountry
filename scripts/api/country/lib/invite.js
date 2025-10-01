import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../lib/util";
import { DynamicProperties } from "../../dyp";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プレイヤーに招待を送る
 * @param {Player|string} receivePlayer 
 * @param {(Player|string)|undefined} sendPlayer 
 * @param {number} countryId 
 */
export function inviteFunction(countryId, receivePlayer, sendPlayer = undefined) {
    try {
        if (sendPlayer) {
            if (CheckPermission(sendPlayer, `invite`)) {
                if (sendPlayer instanceof Player) {
                    sendPlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§c\n` }, { translate: `send.invite.error.permission.message` }] });
                };
                return;
            };
        };
        let receivePlayerId = '';
        if (receivePlayer instanceof Player) {
            receivePlayerId = receivePlayer.id;
        } else if (typeof receivePlayer == 'string') {
            receivePlayerId = receivePlayer;
        } else {
            return false;
        };

        let sendPlayerId = '';
        if (sendPlayer) {
            if (sendPlayer instanceof Player) {
                sendPlayerId = sendPlayer.id;
            } else if (typeof sendPlayer == 'string') {
                sendPlayerId = sendPlayer;
            } else {
                return false;
            };
        };
        const playerDataBase = new DynamicProperties('player');
        /**
         * @type {PlayerData|undefined}
         */
        let sendPlayerData = undefined;
        if (sendPlayer) {
            sendPlayerData = JSON.parse(playerDataBase.get(`player_${sendPlayerId}`));
        };
        const rawReceivePlayerData = playerDataBase.get(`player_${receivePlayerId}`);
        if (!rawReceivePlayerData) {
            return false
        };
        /**
         * @type {PlayerData}
         */
        const receivePlayerData = JSON.parse(rawReceivePlayerData);
        receivePlayerData.invite = receivePlayerData?.invite.filter(v => v != countryId).concat(countryId);
        if (sendPlayer) {
            playerDataBase.set(`player_${sendPlayerId}`, sendPlayerData)
            if (sendPlayer instanceof Player) {
                sendPlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `send.invite.message` }] });
            };
        };
        playerDataBase.set(`player_${receivePlayerId}`, receivePlayerData);
        if (receivePlayer instanceof Player) {
            if (receivePlayerData?.settings?.inviteReceiveMessage) {
                receivePlayer.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `receive.invite.message` }] })
            }
        };
        return true;
    } catch (error) {
        console.warn(error);
    };
};

