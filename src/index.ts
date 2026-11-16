// フル版 MakeCountry: 本体 (Lite と同じ機能) とすべての機能を 1 つのパックに入れる。
import { initBridge } from "@/shared/bridge/bridge.js";
import "@/core/bootstrap.js";
import "@/modules/jobs.js";
import "@/modules/cooking.js";
import "@/modules/industry.js";
import "@/modules/fishing.js";
import "@/modules/life.js";
import "@/modules/deco.js";

// 機能パック (分割版) と一緒に入れられたときに、機能パック側が気付けるように名乗る
initBridge("full", "full");
