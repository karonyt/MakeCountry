import "./anticheat.js";
import "./chat.js";
import "./war.js";
import "./server_net.js";
import "./transfer.js";
import "./ban.js";
import "./cloudbank.js"
import "./rewardbuff.js"
import "./casino.js";
import "./haken.js";
import "./afk.js";
import "./webhook-make-country.js";
//import "./daily_quest/index.js";
//import "./help.js";
import "./voice.js";
import "./midiplayer.js";
import "./selfclear.js";
import "./superban.js";
import "./quest.js";
import "./recovery/source.js";
import "./recovery/target.js";

import { world } from "@minecraft/server";

import config from "../../config.js";

console.log("[KaroEarth] New Map plugin is enabled. Initializing...");
import("./map/main.js");
import("./map/sync.js")

const whiteListEntity = [
    "minecraft:painting",
    "minecraft:armor_stand",
    "minecraft:item",
    "minecraft:npc",
    "minecraft:thrawn_trident",
];
world.afterEvents.entityLoad.subscribe((ev) => {
    if (config.world != 'karoearth') return;
    const { entity } = ev;
    if (entity.typeId == 'mc:rsk') {
        entity.remove();
        return;
    };
    if (entity.hasTag("dungeonmob")) return;
    if (!entity.typeId.includes('minecraft:')) return;
    if (whiteListEntity.includes(entity.typeId)) return;
    entity.remove();
});