// MakeCountry 機能パック (fishing): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import "@/modules/fishing.js";

setupModuleRuntime("fishing", __MC_VERSION__);
