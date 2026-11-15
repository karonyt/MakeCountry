import { world } from "@minecraft/server";

// サンプル: 参加時に指定したプレイヤーをキックする
const blackList = [
    'ExamplePlayerName',
];

const blackListXuid: string[] = [
    // '0000000000000000',
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
