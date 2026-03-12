import { world } from "@minecraft/server";
import { beforeEvents } from "@minecraft/server-admin";

const bannedPfids = [
    //null6667034
    '56cfba8f2a68ddb7',
    //Dinnerbone89489
    '6cddb1f5d387cecb',
];

world.afterEvents.worldLoad.subscribe(() => {
    beforeEvents.asyncPlayerJoin.subscribe( async (ev) => {
        const pfid = ev.persistentId;

        if (bannedPfids.includes(pfid)) {
            ev.disconnect(`§cYou're PFID BANNED!!`);
        }
        return;
    });
});