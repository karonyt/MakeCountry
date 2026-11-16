// MakeCountry 機能パック (industry): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import "@/modules/industry.js";

setupModuleRuntime("industry", __MC_VERSION__);
