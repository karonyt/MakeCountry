// MakeCountry 機能パック (cooking): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import "@/modules/cooking.js";

setupModuleRuntime("cooking", __MC_VERSION__);
