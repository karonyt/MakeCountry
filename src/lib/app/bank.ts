import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { GetAndParsePropertyData, isDecimalNumber, StringifyAndSavePropertyData } from "../util.js";
import { DynamicProperties } from "../../api/dyp.js";
import config from "../../config.js";
import { SmartPhoneHomeScreen } from "../smartphone.js";
import { ModalForm } from "../form_class.js";

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
    const sendPlayerData = GetAndParsePropertyData(`player_${sendPlayer.id}`, playerDataBase);
    const form = new ModalForm();
    form.title({ rawtext: [{ text: 'KayKay - ' }, { translate: `form.sendmoney.check.title` }] });
    form.textField({ rawtext: [{ translate: `form.sendmoney.check.label` }, { text: `: ${sendPlayerData?.money}` }] }, { translate: `input.number` });
    form.submitButton({ translate: `mc.button.sendmoney` });
    form.show(sendPlayer).then((rs: any) => {
        if (rs.canceled) {
            sendMoneyForm(sendPlayer);
            return;
        };
        const value = Number(rs.formValues[0]);;
        if (!isDecimalNumber(value)) {
            sendPlayer.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        const receivePlayerData = GetAndParsePropertyData(`player_${receivePlayer.id}`, playerDataBase);
        const sendPlayerData2 = GetAndParsePropertyData(`player_${sendPlayer.id}`, playerDataBase);
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
        StringifyAndSavePropertyData(`player_${receivePlayer.id}`, receivePlayerData, playerDataBase);
        StringifyAndSavePropertyData(`player_${sendPlayer.id}`, sendPlayerData2, playerDataBase);
        return;
    });
};