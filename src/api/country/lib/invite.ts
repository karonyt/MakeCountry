import { Player } from "@minecraft/server";
import { CheckPermission } from "../../../lib/util.js";
import { DynamicProperties } from "../../dyp.js";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プレイヤーに招待を送る
 * @param {Player|string} receivePlayer 
 * @param {(Player|string)|undefined} sendPlayer 
 * @param {number} countryId 
 */
export function inviteFunction(countryId: any, receivePlayer: any, sendPlayer = undefined) {
    try {
        if (sendPlayer) {
            if (CheckPermission(sendPlayer, `invite`)) {
                // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
                if (sendPlayer instanceof Player) {
                    // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
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
            // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
            if (sendPlayer instanceof Player) {
                // @ts-ignore TS(2339): Property 'id' does not exist on type 'never'.
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
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
        receivePlayerData.invite = receivePlayerData?.invite.filter((v: any) => v != countryId).concat(countryId);
        if (sendPlayer) {
            playerDataBase.set(`player_${sendPlayerId}`, sendPlayerData)
            // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
            if (sendPlayer instanceof Player) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
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

