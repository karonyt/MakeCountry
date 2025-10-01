import { Dimension, Entity, ItemStack, Player, system, world } from "@minecraft/server";
import PlayerFishingAfterEvent from "./fishingEvent";
import itemConfig from "../item_plugin_config";
import jobs_config from "../jobs_config";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "./util";
import { JobLevel } from "./jobslevel";

PlayerFishingAfterEvent.subscribe(ev => {
    if (!itemConfig.customFishing) return;
    /**
     * @type {{player: Player,itemStack: ItemStack,dimension: Dimension,result: boolean,itemEntity: Entity}}
     */
    const { player, itemStack, dimension, result, itemEntity } = ev;
    if (result) {
        const selectedItem = getFishingItem(itemConfig.fishingWeights);
        if (!selectedItem) return;
        system.run(() => {
            const item = dimension.spawnItem(new ItemStack(selectedItem.itemId), itemEntity.location);
            itemEntity.remove();
            item.clearVelocity()
            let { x, y, z } = player.location;
            let { x: ix, y: iy, z: iz } = item.location;
            item.applyImpulse({ x: Math.ceil(x - ix), y: Math.ceil(y - iy), z: Math.ceil(z - iz) });
            if (!jobs_config.validity) return;
            // 漁師
            /**
             * @type {Player}
             */
            if (!player.hasTag(`mcjobs_fisherman`)) return;
            const playerData = GetAndParsePropertyData(`player_${player.id}`);
            const jobs = new JobLevel(player, "fisherman");
            const jobsLevel = jobs.getLevel();
            jobs.addXp(jobs_config.jobsXp);
            if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${selectedItem.reward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
            playerData.money += selectedItem.reward;
            StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        })
    }
});

function getWeight(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFishingItem(fishingWeights) {
    // 1から10000までのランダムな整数を生成
    const randomNum = getWeight(1, 10000);

    // 現在のweightの累積値
    let currentWeight = 0;

    // 各アイテムのweightを確認し、ランダムな数字に対応するアイテムを見つける
    for (const item of fishingWeights) {
        currentWeight += item.weight;
        if (randomNum <= currentWeight && currentWeight - item.weight <= randomNum) {
            return item;
        }
    }

    // 万が一対応するアイテムが見つからない場合はnullを返す
    return undefined;
}

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
