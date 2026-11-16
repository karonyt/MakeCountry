// MakeCountry 機能パック (fishing): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import { setupModuleMigration } from "@/packs/migration.js";
import "@/modules/fishing.js";

setupModuleRuntime("fishing", __MC_VERSION__);
setupModuleMigration({
    // 魚図鑑・魚の記録
    collections: ["fishEncyclopedia"],
});
