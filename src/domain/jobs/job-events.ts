import { JobsActionFormData as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { Block, EnchantmentType, EnchantmentTypes, Player, system, world } from "@minecraft/server";
import { getRandomInteger, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { isLocationDenied } from "@/domain/country/location-permission.js";
import jobs_config from "@/config/jobs.js";
import { FormCancelationReason } from "@minecraft/server-ui";

import playerFishingAfterEvent from "@/domain/fishing/vanilla-events.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { RewardBuff } from "@/domain/rewards/reward-buff.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { getPlayerCountryLevel } from "@/domain/country/player-country-level.js";
import { IS_SPLIT_BUILD } from "@/shared/build-flags.js";
import { rpc } from "@/shared/bridge/bridge.js";
import national_tier_level from "@/config/national-tier-level.js";
import config from "@/config/server.js";
import { ensureDailyEarning } from "@/domain/jobs/job-reward-display.js";
import { enqueueNormalJobReward } from "@/domain/jobs/pending-normal-job-rewards.js";

let buff: any;

world.afterEvents.worldLoad.subscribe(() => {
    buff = new RewardBuff();
});

export { applyDailyLimit } from "@/domain/jobs/daily-limit.js";
import { getTodayByUTCOffset } from "@/domain/jobs/daily-limit.js";

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    if (!jobs_config.validity) return;
    const { brokenBlockPermutation, player, itemStackBeforeBreak } = ev;
    const brokenBlockTypeId = brokenBlockPermutation.type.id;
    const isStrippedLog = brokenBlockTypeId.startsWith('minecraft:stripped_') && brokenBlockTypeId.endsWith('_log');

    //木こり
    if ((brokenBlockPermutation.hasTag(`log`) || isStrippedLog || brokenBlockTypeId == 'minecraft:poplar_log' || brokenBlockTypeId == 'minecraft:pale_oak_log') && player.hasTag(`mcjobs_woodcutter`)) {
        enqueueNormalJobReward(player, "woodcutter", (player) => {
            const jobs = new JobLevel(player, "woodcutter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
            return { money: random, xp: jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:mangrove_log` && player.hasTag(`mcjobs_woodcutter`)) {
        enqueueNormalJobReward(player, "woodcutter", (player) => {
            const jobs = new JobLevel(player, "woodcutter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
            return { money: random, xp: jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:cherry_log` && player.hasTag(`mcjobs_woodcutter`)) {
        enqueueNormalJobReward(player, "woodcutter", (player) => {
            const jobs = new JobLevel(player, "woodcutter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
            return { money: random, xp: jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:mangrove_roots` && player.hasTag(`mcjobs_woodcutter`)) {
        enqueueNormalJobReward(player, "woodcutter", (player) => {
            const jobs = new JobLevel(player, "woodcutter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
            return { money: random, xp: jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:pale_oak_log` && player.hasTag(`mcjobs_woodcutter`)) {
        enqueueNormalJobReward(player, "woodcutter", (player) => {
            const jobs = new JobLevel(player, "woodcutter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
            return { money: random, xp: jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter') };
        });
        return;
    };

    //土掘り士
    if (brokenBlockPermutation.type.id === `minecraft:dirt` && player.hasTag(`mcjobs_dirtdigger`)) {
        enqueueNormalJobReward(player, "dirtdigger", (player) => {
            const jobs = new JobLevel(player, "dirtdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
            return { money: random, xp: jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:grass` && player.hasTag(`mcjobs_dirtdigger`)) {
        enqueueNormalJobReward(player, "dirtdigger", (player) => {
            const jobs = new JobLevel(player, "dirtdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
            return { money: random, xp: jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:grass_block` && player.hasTag(`mcjobs_dirtdigger`)) {
        enqueueNormalJobReward(player, "dirtdigger", (player) => {
            const jobs = new JobLevel(player, "dirtdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
            return { money: random, xp: jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger') };
        });
        return;
    };

    //砂掘り士
    if (brokenBlockPermutation.type.id.endsWith(`sand`) && player.hasTag(`mcjobs_sanddigger`)) {
        enqueueNormalJobReward(player, "sanddigger", (player) => {
            const jobs = new JobLevel(player, "sanddigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.sanddiggerReward.min, jobs_config.sanddiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('sanddigger')) / 100;
            return { money: random, xp: jobs_config.sanddiggerReward.xp * buff.getMultiplier('sanddigger') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:gravel` && player.hasTag(`mcjobs_sanddigger`)) {
        enqueueNormalJobReward(player, "sanddigger", (player) => {
            const jobs = new JobLevel(player, "sanddigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.sanddiggerReward.min, jobs_config.sanddiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('sanddigger')) / 100;
            return { money: random, xp: jobs_config.sanddiggerReward.xp * buff.getMultiplier('sanddigger') };
        });
        return;
    };

    //庭師
    if (brokenBlockPermutation.type.id.includes('leaves') && player.hasTag(`mcjobs_gardener`)) {
        enqueueNormalJobReward(player, "gardener", (player) => {
            const jobs = new JobLevel(player, "gardener");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.gardeningReward.min, jobs_config.gardeningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('gardener')) / 100;
            return { money: random, xp: jobs_config.gardeningReward.xp * buff.getMultiplier('gardener') };
        });
        return;
    };

    //ネザー掘り士
    if (brokenBlockPermutation.type.id === `minecraft:netherrack` && player.hasTag(`mcjobs_netherdigger`)) {
        enqueueNormalJobReward(player, "netherdigger", (player) => {
            const jobs = new JobLevel(player, "netherdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
            return { money: random, xp: jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger') };
        });
        return;
    };
    if (
        (brokenBlockPermutation.type.id === `minecraft:basalt` || brokenBlockPermutation.type.id === `minecraft:blackstone`)
        && player.hasTag(`mcjobs_netherdigger`)
    ) {
        enqueueNormalJobReward(player, "netherdigger", (player) => {
            const jobs = new JobLevel(player, "netherdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
            return { money: random, xp: jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:soul_soil` && player.hasTag(`mcjobs_netherdigger`)) {
        enqueueNormalJobReward(player, "netherdigger", (player) => {
            const jobs = new JobLevel(player, "netherdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
            return { money: random, xp: jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:nether_wart` && player.hasTag(`mcjobs_netherdigger`) && brokenBlockPermutation.getState("age") === 3) {
        enqueueNormalJobReward(player, "netherdigger", (player) => {
            const jobs = new JobLevel(player, "netherdigger");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
            return { money: random, xp: jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger') };
        });
        return;
    };

    //鉱夫
    // The selected slot may already be empty (tool broke) or changed by another
    // handler. Only the event snapshot describes the tool that broke this block.
    if (player.hasTag(`mcjobs_miner`) && itemStackBeforeBreak?.getComponent(`enchantable`)?.getEnchantment(`silk_touch`)) {
        return;
    };
    if (brokenBlockPermutation.type.id == `minecraft:stone` && player.hasTag(`mcjobs_miner`)) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.normalStoneMiningReward.min, jobs_config.normalStoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.normalStoneMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:end_stone` && player.hasTag(`mcjobs_miner`)) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.endStoneMiningReward.min, jobs_config.endStoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.endStoneMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id.endsWith(`_ore`) && player.hasTag(`mcjobs_miner`)) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.oreMiningReward.min, jobs_config.oreMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.oreMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:ancient_debris` && player.hasTag(`mcjobs_miner`)) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.oreMiningReward.min, jobs_config.oreMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.oreMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:deepslate` && player.hasTag(`mcjobs_miner`)) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:tuff` && player.hasTag(`mcjobs_miner`)) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };
    if (brokenBlockPermutation.hasTag(`stone`) && player.hasTag(`mcjobs_miner`) && brokenBlockPermutation.type.id != `minecraft:cobblestone`) {
        enqueueNormalJobReward(player, "miner", (player) => {
            const jobs = new JobLevel(player, "miner");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
            return { money: random, xp: jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner') };
        });
        return;
    };

    //農家
    if (brokenBlockPermutation.getTags().includes(`minecraft:crop`) && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`growth`) == 7) {
        enqueueNormalJobReward(player, "farmer", (player) => {
            const jobs = new JobLevel(player, "farmer");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
            return { money: random, xp: jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:melon_block` && player.hasTag(`mcjobs_farmer`)) {
        // シルクタッチで回収・再設置したスイカから繰り返し報酬を得ることを防ぐ。
        if (itemStackBeforeBreak?.getComponent(`enchantable`)?.getEnchantment(`silk_touch`)) return;

        enqueueNormalJobReward(player, "farmer", (player) => {
            const jobs = new JobLevel(player, "farmer");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
            return { money: random, xp: jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer') };
        });
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:cocoa` && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`age`) === 2) {
        enqueueNormalJobReward(player, "farmer", (player) => {
            const jobs = new JobLevel(player, "farmer");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.cocoaHarvestReward.min, jobs_config.cocoaHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
            return { money: random, xp: jobs_config.cocoaHarvestReward.xp * buff.getMultiplier('farmer') };
        });
        return;
    };
    // @ts-ignore TS(2345): Argument of type '"mc:growth_stage"' is not assign... Remove this comment to see the full error message
    if (player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`mc:growth_stage`) === 3) {
        enqueueNormalJobReward(player, "farmer", (player) => {
            const jobs = new JobLevel(player, "farmer");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
            return { money: random, xp: jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer') };
        });
        return;
    };
});

world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block } = ev;

    if (!jobs_config.validity) return;

    // @ts-ignore TS(2532): Object is possibly 'undefined'.
    const container = player.getComponent("inventory").container;
    const item = container.getItem(player.selectedSlotIndex);
    if (item && item?.typeId.includes("bucket")) {
        return;
    };

    //建築士
    if (player.hasTag(`mcjobs_builder`)) {
        enqueueNormalJobReward(player, "builder", (player) => {
            const jobs = new JobLevel(player, "builder");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.buildReward.min, jobs_config.buildReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('builder')) / 100;
            return { money: random, xp: jobs_config.buildReward.xp * buff.getMultiplier('builder') };
        });
        return;
    };
});

/**
 * 
 * @param {Player} player 
 * @param {Block} block 
 */
export function GrowthPlantReward(player: any, block: any) {
    const growth = block.permutation.getState('growth');
    system.run(() => {
        // 農家ジョブの報酬
        if (block.typeId === 'minecraft:sweet_berry_bush' && player.hasTag('mcjobs_farmer') && growth > 1 && !player.isSneaking) {
            const container = player.getComponent("inventory").container;
            const item = container.getItem(player.selectedSlotIndex);
            if (growth != 3) {
                if (item && item?.typeId == "minecraft:bone_meal") {
                    return;
                }
            }
            if (item && item?.typeId.includes("minecraft:bucket")) {
                return;
            }
            if (isLocationDenied(player, block.x, block.z, block.dimension.id, `place`)) return;
            //block.setPermutation(block.permutation.withState(`growth`, 0));

            enqueueNormalJobReward(player, "farmer", (player) => {
                const jobs = new JobLevel(player, "farmer");
                const jobsLevel = jobs.getLevel();
                const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel)) / 100;
                const reward = Math.ceil((random / 10 * growth) * 100) / 100;
                return { money: reward, xp: jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer') };
            });
            return;
        }
    });
};

world.afterEvents.entityDie.subscribe((ev) => {
    if (!jobs_config.validity) return;

    try {
        if (!(ev.damageSource.damagingEntity instanceof Player)) { return };
        const player = ev.damageSource.damagingEntity;
        //狩人
        if (!player.hasTag(`mcjobs_hunter`)) return;

        const id = ev.deadEntity.typeId.split(`:`)[1];
        const configured = jobs_config[`${id}KillReward` as keyof typeof jobs_config];
        // A missing mob configuration selects the fallback before payment.
        // Save failures must never be interpreted as a second reward attempt.
        const reward = configured && typeof configured === "object" && "min" in configured
            && "max" in configured && "xp" in configured
            ? configured : jobs_config.otherMobkillReward;
        enqueueNormalJobReward(player, "hunter", (player) => {
            const jobs = new JobLevel(player, "hunter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(reward.min, reward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('hunter')) / 100;
            return { money: random, xp: reward.xp * buff.getMultiplier('hunter') };
        });
    } catch (error) {
        return;
    };
});

playerFishingAfterEvent.subscribe((event: any) => {
    system.runTimeout(() => {
        if (!jobs_config.validity) return;
        if (!event.result) return;
        // 漁師
        /**
         * @type {Player}
         */
        const player = event.player;
        if (!player.hasTag(`mcjobs_fisherman`)) return;
        enqueueNormalJobReward(player, "fisherman", (player) => {
            const jobs = new JobLevel(player, "fisherman");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.fishingReward.min, jobs_config.fishingReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('fisherman')) / 100
            return { money: random, xp: jobs_config.fishingReward.xp * buff.getMultiplier('fisherman') };
        });
    });
});

/**
 * 職業メニュー
 * @param {Player} player 
 */
export function jobsForm(player: any) {
    if (IS_SPLIT_BUILD) {
        // 分割版: 「今日の稼ぎ」は Lite のプレイヤーデータにあるので問い合わせる
        rpc<any>("lite", "jobs.playerInfo", { playerId: player.id })
            .then(info => { if (player.isValid) showJobsForm(player, info?.playerData ?? {}, false); })
            .catch(() => player.sendMessage({ translate: "makecountry.module.lite_missing", with: { rawtext: [{ translate: "makecountry.module.jobs" }] } }));
        return;
    }
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "{}");
    showJobsForm(player, playerData, true);
}

function showJobsForm(player: any, playerData: any, persist: boolean) {
    const form = new ActionFormData();
    form.title({ translate: `jobs.title` });
    const body = [];
    let jobsList = jobs_config.jobsList
    if (national_tier_level.enabled) {
        const lv = getPlayerCountryLevel(player) ?? 0;
        jobsList = jobs_config.jobsList.filter(job => job.lv <= lv);
    };
    const today = getTodayByUTCOffset(config.timeDifference);
    let dailyEarningsReset = false;
    for (const job of jobsList) {
        let isEmploy = player.hasTag(`mcjobs_${job.id}`);
        let employMessage = `not.yet.employed`;
        const jobs = new JobLevel(player, job.id);
        const level = jobs.getLevel();
        const storedDailyEarning = playerData.dailyEarnings?.[job.id];
        if (storedDailyEarning && storedDailyEarning.date !== today) dailyEarningsReset = true;
        const dailyEarning = ensureDailyEarning(playerData, job.id, today);
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        let pushElement = [{ translate: job.id }, { text: `§f Lv: ${level} XP: [${jobs.getXp()}/${jobs.getXpRequired(level)}]§f Limit: [${dailyEarning.amount}/${jobs_config.dailyLimit[job.id]}]\n` }]
        if (isEmploy) {
            employMessage = `already.found.employment`;

            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            pushElement = [{ text: '§a' }, { translate: job.id }, { text: `§a Lv: ${level} XP: [${jobs.getXp()}/${jobs.getXpRequired(level)}]§f Limit: [${dailyEarning.amount}/${jobs_config.dailyLimit[job.id]}]\n` }]
        };
        body.push(...pushElement)
        form.button({ rawtext: [{ text: `§l` }, { translate: job.name }, { text: `\n` }, { translate: employMessage }] });
    };
    if (dailyEarningsReset && persist) new DynamicProperties('player').set(`player_${player.id}`, playerData);
    form.body({ rawtext: body });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                jobsForm(player);
                return;
            };
            return;
        };
        const selected = rs.selection;
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        let isEmploy = player.hasTag(`mcjobs_${jobsList[selected].id}`);
        if (isEmploy) {
            // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
            player.removeTag(`mcjobs_${jobsList[selected].id}`);
            jobsForm(player);
            return;
        };
        let employAmount = player.getTags().filter((t: any) => t.startsWith(`mcjobs_`)).length;
        if (employAmount === jobs_config.maxEmploymentNum) {
            player.sendMessage({ translate: `message.max.employment.num.over`, with: [`${employAmount}`] });
            return;
        };
        // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
        player.addTag(`mcjobs_${jobsList[selected].id}`);
        jobsForm(player);
        return;
    });
};

/**
 * /scriptevent mc:addjobsbuff hunter 1.2 100
 * /scriptevent mc:removejobsbuff hunter 1.2
 * /scriptevent mc:clearjobsbuff hunter
 */
system.afterEvents.scriptEventReceive.subscribe((ev) => {
    switch (ev.id) {
        case `mc:addjobsbuff`: {
            const args = ev.message.split(' ');
            buff.addBuff(args[0], Number(args[1]), Number(args[2]));
            break;
        }
        case `mc:removejobsbuff`: {
            const args = ev.message.split(' ');
            buff.removeBuff(args[0], Number(args[1]));
            break;
        }
        case `mc:clearjobsbuff`: {
            const args = ev.message.split(' ');
            buff.clearBuffs(args[0]);
            break;
        }
    }
});
