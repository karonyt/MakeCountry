import { ActionFormData } from "@minecraft/server-ui";
import { getQuests, claimReward } from "./api.js";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "../../../lib/util.js";
import config from "../../../config.js";

export async function showQuestMainForm(player: any) {
    const form = new ActionFormData();
    form.title("デイリークエスト");

    const quests = await getQuests(player);

    if (quests.error || !Array.isArray(quests) || quests.length === 0) {
        form.body(quests.error || "現在受注しているクエストはありません。");
        form.button("§c閉じる");
    } else {
        let body = "今日のクエストを達成して報酬を獲得しましょう！\n\n";
        
        quests.sort((a, b) => (a.type === 'daily_large' ? -1 : 1));

        quests.forEach(q => {
            const statusIcon = q.claimed ? '§a✔§r' : q.completed ? '§e☑§r' : '§7☐§r';
            const color = q.type === 'daily_large' ? '§e' : '§f';
            const symbol = q.type === 'daily_large' ? '◆' : '◇';
            body += `${color}${symbol} ${statusIcon} ${q.description} §7(${q.progress}/${q.target_value})\n`;
        });
        form.body(body);
        
        quests.forEach((quest) => {
            let status = "§l(未達成)";
            if (quest.completed && quest.claimed) {
                status = "§l§a(報酬受取済)";
            } else if (quest.completed) {
                status = "§l§e(達成！)";
            }
            form.button(`${quest.description}\n${status}`);
        });
    }

    const res = await form.show(player);
    if (res.canceled || quests.error || !Array.isArray(quests) || quests.length === 0) {
        return;
    }
    
    // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
    const selectedQuest = quests[res.selection];
    showQuestDetailForm(player, selectedQuest);
}

async function showQuestDetailForm(player: any, quest: any) {
    const form = new ActionFormData(); // 標準のクラスをインスタンス化
    form.title(quest.description);
    
    let body = `進捗: ${quest.progress} / ${quest.target_value}\n`;
    body += `報酬: ${config.MoneyName} ${quest.reward}`;
    form.body(body);

    form.button("§l戻る");
    if (quest.completed && !quest.claimed) {
        form.button("§l§a報酬を受け取る");
    }

    const res = await form.show(player);
    if (res.canceled || res.selection === 0) {
        showQuestMainForm(player);
        return;
    }

    if (res.selection === 1) {
        const result = await claimReward(player, quest.quest_id, quest.assignment_date);
        
        if (result.error) {
            player.sendMessage(`§c報酬の受け取りに失敗しました: ${result.error}`);
        } else {
            const playerData = GetAndParsePropertyData(`player_${player.id}`);
            playerData.money += result.reward;
            StringifyAndSavePropertyData(`player_${player.id}`, playerData);
            player.sendMessage(`§aクエスト達成！ ${config.MoneyName}${result.reward} を獲得しました！`);
        }
        showQuestMainForm(player);
    }
}