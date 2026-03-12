import { world, system } from "@minecraft/server";
import { hasJoinedInPeriodWithinDailyRetention } from "../../api/player/playtime.js";
import config from "../../config.js";

world.afterEvents.playerSpawn.subscribe((ev) => {
    if (config.world != "karoearth") return;
    const { player, initialSpawn } = ev;
    if (initialSpawn) {
        system.runTimeout(() => {
            const joined = hasJoinedInPeriodWithinDailyRetention(
                player.id,
                "2026-01-11",
                "2026-01-25"
            );

            if (joined && !player.hasTag("hoten20260125")) {
                player.runCommand("scriptevent karo:add 100000");
                player.sendMessage({ translate: "hoten.20260125.message" });
                player.addTag("hoten20260125");
            }
        }, 60);
    }
});
