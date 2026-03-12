import { Player, world } from "@minecraft/server";
import { CheckPermission } from "../../../lib/util.js";
import { DynamicProperties } from "../../dyp.js";
import { CountryManager } from "../country.js";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * プレイヤーに招待を送る
 * @param {Player|string} newOwner 
 * @param {(Player|string)|undefined} player 
 * @param {number} countryId 
 */
export function setNewOwnerFunction(countryId: any, newOwner: any, player = undefined) {
    try {
        if (player) {
            if (CheckPermission(player, `invite`)) {
                // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
                if (player instanceof Player) {
                    // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'nev... Remove this comment to see the full error message
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§c\n` }, { translate: `send.invite.error.permission.message` }] });
                };
                return;
            };
        };
        let newOwnerId = '';
        if (newOwner instanceof Player) {
            newOwnerId = newOwner.id;
        } else if (typeof newOwner == 'string') {
            newOwnerId = newOwner;
        } else {
            return false;
        };

        let playerId = '';
        if (player) {
            // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
            if (player instanceof Player) {
                // @ts-ignore TS(2339): Property 'id' does not exist on type 'never'.
                playerId = player.id;
            } else if (typeof player == 'string') {
                playerId = player;
            } else {
                return false;
            };
        };
        const playerDataBase = new DynamicProperties('player');
        /**
         * @type {PlayerData|undefined}
         */
        let playerData = undefined;
        if (player) {
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            playerData = JSON.parse(playerDataBase.get(`player_${playerId}`));
        };
        const rawNewOwnerData = playerDataBase.get(`player_${newOwnerId}`);
        if (!rawNewOwnerData) {
            return false
        };

        const countryDataBase = new DynamicProperties('country');
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        countryData.owner = newOwnerId;
        countryDataBase.set(`country_${countryId}`, countryData);

        /**
         * @type {PlayerData}
         */
        const newOwnerData = JSON.parse(rawNewOwnerData);
        if (player) {
            const playerEntity = world.getEntity(playerId);
            //playerDataBase.set(`player_${playerId}`, playerData)
            if (playerEntity && playerEntity instanceof Player) {
                playerEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.sender`, with: [newOwnerData.name] }] });
            };
        };
        //playerDataBase.set(`player_${newOwnerId}`, newOwnerData);
        const newOwnerEntity = world.getEntity(newOwnerId);
        if (newOwnerEntity && newOwnerEntity instanceof Player) {
            newOwnerEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `changed.owner.message.newowner` }] });
        };
        return true;
    } catch (error) {
        console.warn(error);
    };
};