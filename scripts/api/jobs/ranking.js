import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import jobs_config from "../../jobs_config";
import { JobLevel } from "../../lib/jobslevel";
import { ActionFormData } from "@minecraft/server-ui";

/**
 * @type {DynamicProperties}
 */
let jobsRankDB;

world.afterEvents.worldLoad.subscribe(() => {
    jobsRankDB = new DynamicProperties("jobsrank");
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;
    const jobList = jobs_config.jobsList;
    for (const jobData of jobList) {
        const jobId = jobData.id;
        const jobLevelManager = new JobLevel(player, jobId);
        const jobLevel = jobLevelManager.getLevel();

        //上位20位までのランクを取得 [{playerName: string, playerId: string,level: number}]
        const rankData = JSON.parse(jobsRankDB.get(`rank_${jobId}`) || '[]');
        //ランクが20位未満の場合、または自分のレベルが20位以内に入る場合、ランクデータを更新
        if (rankData.length < 20 || jobLevel > rankData[rankData.length - 1].level) {
            //既にランクに存在する場合は削除
            const existingIndex = rankData.findIndex(entry => entry.playerId === player.id);
            if (existingIndex !== -1) {
                rankData.splice(existingIndex, 1);
            }
            //新しいデータを追加
            rankData.push({ playerName: player.name, playerId: player.id, level: jobLevel });
            //レベルでソート（降順）
            rankData.sort((a, b) => b.level - a.level);
            //上位20位に制限
            if (rankData.length > 20) {
                rankData.length = 20;
            }
            //データを保存
            jobsRankDB.set(`rank_${jobId}`, JSON.stringify(rankData));
        }
    };
});

/**
 * 
 * @param {Player} player 
 * @param {string} jobId 
 */
export function showJobRanking(player, jobId) {
    const rankData = JSON.parse(jobsRankDB.get(`rank_${jobId}`) || '[]');
    let message = `§a=== ${jobId} Jobs Ranking ===\n`;
    if (rankData.length === 0) {
        message += "§cNo Data\n";
    } else {
        rankData.forEach((entry, index) => {
            //同率順位の処理
            if (index > 0 && entry.level === rankData[index - 1].level) {
                message += `§b${index}. §f${entry.playerName} - Lv ${entry.level}\n`;
            } else {
                message += `§b${index + 1}. §f${entry.playerName} - Lv ${entry.level}\n`;
            }
        });
    }
    const form = new ActionFormData();
    form.title(`${jobId} Jobs Ranking`);
    form.body(message);
    form.button("§aOK");
    form.show(player);
}