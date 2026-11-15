import { CommerceModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { sendMoneyDefaultForm } from "@/features/forms/default/menu/send_money/send_money.js";
import { getInteractiveFormValues } from "@/shared/ui/form-class.js";
import { getMoneyTransferBalance, sendMoneyBetweenPlayers } from "@/domain/player/money-transfer.js";

export function sendMoneyCheckDefaultForm(sendPlayer: any, receivePlayer: any) {
    if (!sendPlayer?.isValid) return;
    if (!receivePlayer?.isValid) {
        sendPlayer.sendMessage('§c送金先のプレイヤーが見つかりません。');
        return;
    }
    const balance = getMoneyTransferBalance(sendPlayer);
    if (balance === undefined) {
        sendPlayer.sendMessage('§c残高データを確認できないため、送金を中止しました。');
        return;
    }
    const form = new ModalFormData();
    form.title({ translate: 'form.sendmoney.check.title' });
    form.textField({ rawtext: [{ translate: 'form.sendmoney.check.label' }, { text: `: ${balance}` }] }, { translate: 'input.number' });
    form.submitButton({ translate: 'mc.button.sendmoney' });
    form.show(sendPlayer).then((rs: any) => {
        if (!sendPlayer.isValid) return;
        if (rs.canceled) return sendMoneyDefaultForm(sendPlayer);
        sendMoneyBetweenPlayers(sendPlayer, receivePlayer, Number(getInteractiveFormValues(rs)[0]));
    });
}
