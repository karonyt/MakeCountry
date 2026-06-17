import { world } from "@minecraft/server";

const blackList = [
    'teruko2022',
];

const blackListXuid = [
    '2535466281074450',
    '2535426288675628'
];

world.afterEvents.playerSpawn.subscribe((ev) => {
    if(!ev.initialSpawn) return;
    if(blackList.includes(ev.player.name)) {
        ev.player.runCommand('kick @s');
        return;
    };
    for(const xuid of blackListXuid) {
        ev.player.runCommand(`kick "${xuid}"`);
    };
});