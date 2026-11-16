// MakeCountry 機能パック (life): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import "@/modules/life.js";
import "@/packs/life/services.js";

setupModuleRuntime("life", __MC_VERSION__);
