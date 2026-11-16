// MakeCountry 機能パック (jobs): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import { setupModuleMigration } from "@/packs/migration.js";
import jobs_config from "@/config/jobs.js";
import "@/modules/jobs.js";
import "@/packs/jobs/services.js";

setupModuleRuntime("jobs", __MC_VERSION__);
setupModuleMigration({
    // 職業ランキング・報酬ブースト・フル版で支払い待ちのまま残っていた報酬の票
    collections: ["jobsrank", "rewardBuff"],
    worldPrefixes: ["karo:artisan_reward#", "karo:job_reward#", "karo:normal_job_reward#"],
    // 職業レベルと経験値
    playerKeys: jobs_config.jobsList.flatMap((job: { id: string }) => [`${job.id}_level`, `${job.id}_xp`]),
});
