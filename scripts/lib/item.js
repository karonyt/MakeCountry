import { ItemStack, world } from "@minecraft/server";

world.afterEvents.itemCompleteUse.subscribe((ev) => {
    const { source } = ev;
    switch (ev.itemStack.typeId) {
        case `mc:beer`: {
            source.addEffect(`nausea`, 200, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 0 });
            break;
        };
        case `mc:white_wine`: {
            source.addEffect(`nausea`, 400, { amplifier: 20 });
            source.addEffect(`jump_boost`, 100, { amplifier: 3 });
            source.addEffect(`weakness`, 200, { amplifier: 3 });
            break;
        };
        case `mc:red_wine`: {
            source.addEffect(`nausea`, 400, { amplifier: 20 });
            source.addEffect(`slowness`, 100, { amplifier: 1 });
            source.addEffect(`weakness`, 200, { amplifier: 3 });
            break;
        };
        case `mc:whiskey`: {
            source.addEffect(`nausea`, 200, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 0 });
            break;
        };
        case `mc:vodka`: {
            source.addEffect(`nausea`, 250, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 1 });
            break;
        };
        case `mc:sake`: {
            source.addEffect(`nausea`, 300, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 2 });
            break;
        };
        case `mc:abisinthe`: {
            source.addEffect(`nausea`, 300, { amplifier: 20 });
            source.addEffect(`regeneration`, 100, { amplifier: 2 });
            break;
        };
        case `mc:aoziru`: {
            source.addEffect(`resistance`, 200, { amplifier: 1 });
            source.addEffect(`regeneration`, 100, { amplifier: 0 });
            break;
        };
        default: {
            break;
        };
    };
});

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    const { brokenBlockPermutation, player } = ev;
    if (brokenBlockPermutation.type.id === `minecraft:cocoa` && brokenBlockPermutation.getState(`age`) === 2) {
        const randomNum = getWeight(1, 10000);
        if (randomNum < 50) {
            const coffee_beans = new ItemStack(`mc:coffee_beans`);
            player.dimension.spawnItem(coffee_beans, player.location);
        };
    };
});

function getWeight(min, max) {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        throw new TypeError("getWeight: min/max must be integers");
    }
    if (min > max) {
        throw new RangeError("getWeight: min must be <= max");
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}