import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe((ev) => {
    const { blockComponentRegistry } = ev;

    blockComponentRegistry.registerCustomComponent("mc:grow", {
        onRandomTick(ev) {
            // @ts-ignore TS(2345): Argument of type '"mc:growth_stage"' is not assign... Remove this comment to see the full error message
            const growth_stage = ev.block.permutation.getState('mc:growth_stage');
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            if (growth_stage < 3) {
                const randomNum = RandomInt(1, 25);
                if (randomNum != 2) return;
                // @ts-ignore TS(2345): Argument of type '"mc:growth_stage"' is not assign... Remove this comment to see the full error message
                const new_permutation = ev.block.permutation.withState('mc:growth_stage', growth_stage + 1);
                ev.block.setPermutation(new_permutation);
            }
        },
    });
});


function RandomInt(min: any, max: any) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};