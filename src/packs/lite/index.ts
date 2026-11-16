// MakeCountryLite: 建国と経済の基本 (本体)。機能パックとは scriptevent でつながる。
import { setupLiteRuntime } from "@/packs/runtime.js";
import { setupLiteMigrationService } from "@/packs/migration.js";
import "@/core/bootstrap.js";
import "@/packs/lite/services.js";

setupLiteRuntime(__MC_VERSION__);
setupLiteMigrationService();
