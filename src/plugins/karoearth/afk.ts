import { InputButton, system, world } from "@minecraft/server";

const time = new Map();

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const afkTime = time.get(player.name) || 0;
        time.set(player.name, afkTime + 1);
        const move = player.getComponent("movement");
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        if (move.currentValue != 0) time.delete(player.name);
        if ((afkTime + 1) >= 600) {
            player.runCommand("kick @s 放置していたためキックされました")
            time.delete(player.name);
        }
    }
}, 20);

world.afterEvents.playerInteractWithBlock.subscribe((ev) => {
    const { player } = ev;
    time.delete(player.name);
});

world.afterEvents.playerInteractWithEntity.subscribe((ev) => {
    const { player } = ev;
    time.delete(player.name);
});

world.afterEvents.playerHotbarSelectedSlotChange.subscribe((ev) => {
    const { player } = ev;
    time.delete(player.name);
});

world.beforeEvents.chatSend.subscribe((ev) => {
    const { sender: player } = ev;
    time.delete(player.name);
});