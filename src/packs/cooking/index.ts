// MakeCountry 機能パック (cooking): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import { setupModuleMigration } from "@/packs/migration.js";
import "@/modules/cooking.js";

setupModuleRuntime("cooking", __MC_VERSION__);
setupModuleMigration({
    // レシピの絞り込みの設定
    playerPrefixes: ["artisan:recipe_filter:"],
});
