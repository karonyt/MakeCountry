import { Player } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import { sendMoneyDefaultForm } from "./send_money.js";

/**
 * 送金するプレイヤーの条件絞り込み検索
 * @param {Player} player 
 * @param {string} keyword 
 */
export function searchSendMoneyDefaultForm(player: any, keyword: any) {
    const form = new ModalFormData();
    form.title({ translate: `form.serchsendmoney.title` });
    form.textField({ translate: `form.serchsendmoney.word.label` }, { translate: `form.serchsendmoney.word.input` }, { defaultValue: keyword });
    form.submitButton({ translate: `mc.button.serch` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            sendMoneyDefaultForm(player, true, keyword);
            return;
        };
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        sendMoneyDefaultForm(player, true, rs.formValues[0]);
        return;
    });
};