import { system, world } from "@minecraft/server";

import "./lib/commands";

import "./lib/events";

import "./lib/interval";

import "./lib/jobs";

import "./lib/scripteventCommand";

import "./lib/combattag";

import "./lib/test";

import "./lib/item";

import "./lib/custom_component";

import "./lib/war";

import "./lib/penname";

import "./lib/barrel_shop";

import "./lib/ranking";

import "./lib/fixdata";

import "./lib/datamove";

import "./api/command";

import "./lib/smartphone";

import "./api/fishing/index";

import "./api/player/playtime";

import "./api/chat/index";

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

import "./plugin_config";