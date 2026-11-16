// MakeCountry 機能パック (life): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import { setupModuleMigration } from "@/packs/migration.js";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import "@/modules/life.js";
import "@/packs/life/services.js";

setupModuleRuntime("life", __MC_VERSION__);
setupModuleMigration({
    // 懸賞金・夫婦の財布・夫婦のホーム
    collections: ["bounty", "marriagebank", "marriagehome"],
    // 二つ名
    playerKeys: ["pennameBefore", "pennameAfter"],
    // バックパックの中身 (アイテムに保存されている)
    itemTypes: typeId => typeId === "mc:backpack",
    // フル版のプレイヤーデータにあった結婚・懸賞金の項目
    playerDataFields: {
        fields: ["name", "days", "marriage", "bountyDailySetCount", "bountyDailySetDate", "bountyLastSetAt"],
        apply(playerId, fields) {
            const key = `player_${playerId}`;
            const data = GetAndParsePropertyData(key) ?? { id: playerId };
            for (const [field, value] of Object.entries(fields)) if (data[field] === undefined || field === "marriage") data[field] = value;
            StringifyAndSavePropertyData(key, data);
        },
    },
});
