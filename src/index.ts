import { system, world } from "@minecraft/server";

import "./lib/commands.js";

import "./lib/events.js";

import "./lib/interval.js";

import "./lib/jobs.js";

import "./lib/scripteventCommand.js";

import "./lib/combattag.js";

import "./lib/test.js";

import "./lib/item.js";

import "./lib/custom_component.js";

import "./lib/war.js";

import "./lib/penname.js";

import "./lib/barrel_shop.js";

import "./lib/ranking.js";

import "./lib/fixdata.js";

import "./lib/datamove.js";

import "./api/command.js";

import "./lib/smartphone.js";

import "./api/fishing/index.js";

import "./api/player/playtime.js";

import "./api/chat/index.js";

import "./api/cooking/index.js";

import "./api/smelting/index.js";

import "./api/chemical/index.js";

import "./lib/backpack.js";

const version = "ver.KaroEarth"

world.afterEvents.worldLoad.subscribe(() => {
    world.sendMessage({ translate: `world.message.addon`, with: [version] });
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;
    player.sendMessage({
        rawtext: [
            { text: `§6------------------------------------------------------------------------------------------\n\n` },
            { translate: `world.message.addon`, with: [version] },
            { text: `\n\n§9Support Discord Server\n§ahttps://discord.gg/8S9YhNaHjD\n\n§cYoutube\n§ahttps://youtube.com/@KaronDAAA\n\n§bTwitter\n§ahttps://twitter.com/KaronDAAA\n\n§6------------------------------------------------------------------------------------------\n` }
        ]
    });
});

import "./plugin_config.js";