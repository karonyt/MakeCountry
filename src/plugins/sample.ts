import { world } from "@minecraft/server";

world.afterEvents.playerSpawn.subscribe((ev) => {
    if (ev.initialSpawn) {
        ev.player.sendMessage({
            rawtext: [
                { text: "§l§a" },
                { translate: "plugin.sample.enabled" }
            ]
        });
    };
});
