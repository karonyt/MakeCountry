import { JobsActionFormData as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { Player, world } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import jobs_config from "@/config/jobs.js";
import { JobLevel } from "@/domain/jobs/job-level.js";


/**
 * @type {DynamicProperties}
 */
let jobsRankDB: any;

export type JobRankingEntry = {
    playerName: string;
    playerId: string;
    level: number;
};

export type JobRankingSnapshot = Record<string, JobRankingEntry[]>;

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
        const rankData: JobRankingEntry[] = JSON.parse(jobsRankDB.get(`rank_${jobId}`) || '[]');
        //ランクが20位未満の場合、または自分のレベルが20位以内に入る場合、ランクデータを更新
        if (rankData.length < 20 || jobLevel > rankData[rankData.length - 1].level) {
            //既にランクに存在する場合は削除
            const existingIndex = rankData.findIndex((entry: any) => entry.playerId === player.id);
            if (existingIndex !== -1) {
                rankData.splice(existingIndex, 1);
            }
            //新しいデータを追加
            rankData.push({ playerName: player.name, playerId: player.id, level: jobLevel });
            //レベルでソート（降順）
            rankData.sort((a: any, b: any) => b.level - a.level);
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
export function showJobRanking(player: any, jobId: any) {
    const rankData: JobRankingEntry[] = JSON.parse(jobsRankDB.get(`rank_${jobId}`) || '[]');
    const body: any[] = [
        { text: "§a=== " },
        { translate: jobId },
        { text: " " },
        { translate: "jobs.ranking.title" },
        { text: " ===\n" },
    ];
    if (rankData.length === 0) {
        body.push({ translate: "no.data" }, { text: "\n" });
    } else {
        let displayedRank = 0;
        rankData.forEach((entry: JobRankingEntry, index: number) => {
            // 競技順位。例: 同率首位が2人なら 1, 1, 3 位。
            if (index === 0 || entry.level !== rankData[index - 1].level) displayedRank = index + 1;
            body.push({ text: `§b${displayedRank}. §f${entry.playerName} - Lv ${entry.level}\n` });
        });
    }
    const form = new ActionFormData();
    form.title({ translate: "jobs.ranking.form.title", with: { rawtext: [{ translate: jobId }] } });
    form.body({ rawtext: body });
    form.button({ translate: "mc.button.close" });
    form.show(player);
}

/**
 * Core が隔週の順位称号を確定するためのスナップショット。
 *
 * 動的プロパティの生データを外へ渡さず、必要な3項目だけに絞る。
 * 壊れた行や Lv0 は称号対象にならないよう、ここでも除外する。
 */
export function getJobRankingSnapshot(): JobRankingSnapshot {
    if (!jobsRankDB) return {};

    const snapshot: JobRankingSnapshot = {};
    for (const job of jobs_config.jobsList) {
        let stored: unknown = [];
        try {
            stored = JSON.parse(jobsRankDB.get(`rank_${job.id}`) || "[]");
        } catch {
            stored = [];
        }

        const seen = new Set<string>();
        snapshot[job.id] = (Array.isArray(stored) ? stored : [])
            .filter((entry: any) => {
                const valid = typeof entry?.playerId === "string"
                    && typeof entry?.playerName === "string"
                    && Number.isFinite(Number(entry?.level))
                    && Number(entry.level) > 0
                    && !seen.has(entry.playerId);
                if (valid) seen.add(entry.playerId);
                return valid;
            })
            .map((entry: any) => ({
                playerId: entry.playerId,
                playerName: entry.playerName,
                level: Math.floor(Number(entry.level)),
            }))
            .sort((a: JobRankingEntry, b: JobRankingEntry) => b.level - a.level)
            .slice(0, 20);
    }
    return snapshot;
}
