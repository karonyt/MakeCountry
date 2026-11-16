// MakeCountry 機能パック (jobs): MakeCountryLite と一緒に使う。
import { setupModuleRuntime } from "@/packs/runtime.js";
import "@/modules/jobs.js";
import "@/packs/jobs/services.js";

setupModuleRuntime("jobs", __MC_VERSION__);
