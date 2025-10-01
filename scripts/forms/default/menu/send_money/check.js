import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { ModalFormData } from "@minecraft/server-ui";
import { sendMoneyDefaultForm } from "./send_money";
import config from "../../../../config";
import { isDecimalNumber } from "../../../../lib/util";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/**
 * 送金チェックフォーム
 * @param {Player} sendPlayer 
 * @param {Player} receivePlayer 
 */
export function sendMoneyCheckDefaultForm(sendPlayer, receivePlayer) {
    const playerDataBase = new DynamicProperties('player');
    /**
     * @type {PlayerData}
     */
    const sendPlayerData = JSON.parse(playerDataBase.get(`player_${sendPlayer.id}`));
    const form = new ModalFormData();
    form.title({ translate: `form.sendmoney.check.title` });
    form.textField({ rawtext: [{ translate: `form.sendmoney.check.label` }, { text: `: ${sendPlayerData?.money}` }] }, { translate: `input.number` });
    form.submitButton({ translate: `mc.button.sendmoney` });
    form.show(sendPlayer).then(rs => {
        if (rs.canceled) {
            sendMoneyDefaultForm(sendPlayer);
            return;
        };
        const value = Number(rs.formValues[0]);;
        if (!isDecimalNumber(value)) {
            sendPlayer.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        /**
         * @type {PlayerData}
         */
        const receivePlayerData = JSON.parse(playerDataBase.get(`player_${receivePlayer.id}`));
        /**
         * @type {PlayerData}
         */
        const sendPlayerData2 = JSON.parse(playerDataBase.get(`player_${sendPlayer.id}`));
        if (sendPlayerData2.money < value) {
            sendPlayer.sendMessage({ translate: `command.error.trysend.moremoney.youhave`, with: [`${sendPlayerData2.money}`] });
            return;
        };
        receivePlayerData.money += value;
        sendPlayerData2.money -= value;
        sendPlayerData2.money = Math.floor(sendPlayerData2.money * 100) / 100;
        receivePlayerData.money = Math.floor(receivePlayerData.money * 100) / 100;
        sendPlayer.sendMessage({ translate: `command.sendmoney.result.sender`, with: [receivePlayer.name, `${config.MoneyName} ${value}`] });
        receivePlayer.sendMessage({ translate: `command.sendmoney.result.receiver`, with: [sendPlayer.name, `${config.MoneyName} ${value}`] });
        playerDataBase.set(`player_${receivePlayer.id}`, receivePlayerData);
        playerDataBase.set(`player_${sendPlayer.id}`, sendPlayerData2);
        return;
    });
};