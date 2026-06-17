import { world } from "@minecraft/server";

const version = "ver.2.3.3-beta";

world.afterEvents.worldLoad.subscribe(() => {
    world.sendMessage({ translate: "world.message.addon", with: [version] });
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;

    player.sendMessage({
        rawtext: [
            { text: "§6------------------------------------------------------------------------------------------\n\n" },
            { translate: "world.message.addon", with: [version] },
            { text: "\n\n§9" },
            { translate: "world.message.support_discord" },
            { text: "\n§ahttps://discord.gg/8S9YhNaHjD\n\n§cYoutube\n§ahttps://youtube.com/@KaronDAAA\n\n§bTwitter\n§ahttps://twitter.com/KaronDAAA\n\n§6------------------------------------------------------------------------------------------\n" },
        ],
    });
});
