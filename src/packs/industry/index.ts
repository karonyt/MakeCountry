// MakeCountry 機能パック (industry): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import { setupModuleMigration } from "@/packs/migration.js";
import { PACKAGES } from "@/content/packaging/catalog.js";
import "@/modules/industry.js";

const packageItems = new Set<string>(PACKAGES.map(p => p.item));

setupModuleRuntime("industry", __MC_VERSION__);
setupModuleMigration({
    // 置いてある梱包の中身
    worldPrefixes: ["mc:package_payload_"],
    // レシピの絞り込みの設定
    playerPrefixes: ["artisan:recipe_filter:"],
    // 梱包アイテムの ID (アイテムに保存されている)
    itemTypes: typeId => packageItems.has(typeId),
});
