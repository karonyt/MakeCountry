import { CommerceActionFormData as ActionFormData, CommerceModalForm as ModalForm } from "@/shared/ui/purpose-forms.js";
import { Player, world } from "@minecraft/server";

import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { getMoneyTransferBalance, sendMoneyBetweenPlayers } from "@/domain/player/money-transfer.js";
import { getInteractiveFormValues } from "@/shared/ui/form-class.js";
import { SmartPhoneHomeScreen } from "@/features/smartphone/smartphone.js";


/**
 * @type {DynamicProperties}
 */
let playerDataBase: any;

world.afterEvents.worldLoad.subscribe(() => {
    playerDataBase = new DynamicProperties("player");
});

/**
 * 
 * @param {Player} player 
 */
export function KayKayApp(player: any) {
    const form = new ActionFormData();
    form.title('KayKay');
    const playerData = GetAndParsePropertyData(`player_${player.id}`, playerDataBase);
    const showProfile = [
        { translate: `msg.havemoney` }, { text: `${playerData?.money} §r\n` },
    ];
    form.body({ rawtext: showProfile });
    form.button({ translate: `form.mainmenu.button.sendmoney` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            SmartPhoneHomeScreen(player);
        }
        switch (rs.selection) {
            case 0: {
                sendMoneyForm(player);
                break;
            }
        }
    })

}

function sendMoneyForm(player: any, serch = false, keyword = ``) {
    const form = new ActionFormData();
    let players = world.getPlayers().filter(p => p.id != player.id);
    form.title({ rawtext: [{ text: 'KayKay - ' }, { translate: `form.sendmoney.list.title` }] });
    form.button({ translate: `form.sendmoney.button.serch` });
    if (serch) {
        players = players.filter(p => p.name.includes(keyword));
    };
    for (const p of players) {
        if (p.id === player.id) continue;
        form.button(`${p.name}§r\n${p.id}`);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            KayKayApp(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form
                serchSendMoneyForm(player, keyword);
                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                sendMoneyCheckForm(player, players[rs.selection - 1]);
                break;
            };
        };
    });
};


/**
 * 送金するプレイヤーの条件絞り込み検索
 * @param {Player} player 
 * @param {string} keyword 
 */
function serchSendMoneyForm(player: any, keyword: any) {
    const form = new ModalForm();
    form.title({ rawtext: [{ text: 'KayKay - ' }, { translate: `form.serchsendmoney.title` }] });
    form.textField({ translate: `form.serchsendmoney.word.label` }, { translate: `form.serchsendmoney.word.input` }, keyword);
    form.submitButton({ translate: `mc.button.serch` });
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            sendMoneyForm(player, true, keyword);
            return;
        };
        sendMoneyForm(player, true, rs.formValues[0]);
        return;
    });
};

/**
 * 送金チェックフォーム
 * @param {Player} sendPlayer 
 * @param {Player} receivePlayer 
 */
function sendMoneyCheckForm(sendPlayer: any, receivePlayer: any) {
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
    const form = new ModalForm();
    form.title({ rawtext: [{ text: 'KayKay - ' }, { translate: 'form.sendmoney.check.title' }] });
    form.textField({ rawtext: [{ translate: 'form.sendmoney.check.label' }, { text: `: ${balance}` }] }, { translate: 'input.number' });
    form.submitButton({ translate: 'mc.button.sendmoney' });
    form.show(sendPlayer).then((rs: any) => {
        if (!sendPlayer.isValid) return;
        if (rs.canceled) return sendMoneyForm(sendPlayer);
        sendMoneyBetweenPlayers(sendPlayer, receivePlayer, Number(getInteractiveFormValues(rs)[0]));
    });
}
