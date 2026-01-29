import { Block, EnchantmentType, EnchantmentTypes, Player, system, world } from "@minecraft/server";
import { CheckPermissionFromLocation, GetAndParsePropertyData, getRandomInteger, StringifyAndSavePropertyData } from "./util";
import jobs_config from "../jobs_config";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionFormData } from "@minecraft/server-ui";
import playerFishingAfterEvent from "./fishingEvent";
import { JobLevel } from "./jobslevel";
import { RewardBuff } from "../api/rewardbuff";
import { DynamicProperties } from "../api/dyp";
import { CountryManager } from "../api/country/country";
import national_tier_level from "../national_tier_level";
import config from "../config";

let buff;
let playerDB;

world.afterEvents.worldLoad.subscribe(() => {
    buff = new RewardBuff();
    playerDB = new DynamicProperties('player');
});

function getTodayByUTCOffset(offsetHours) {
    const now = Date.now();
    const offsetMs = offsetHours * 60 * 60 * 1000;
    return new Date(now + offsetMs).toISOString().slice(0, 10);
}

function applyDailyLimit(playerData, jobName, reward, dailyLimit) {
    const today = getTodayByUTCOffset(config.timeDifference);

    playerData.dailyEarnings ??= {};
    playerData.dailyEarnings[jobName] ??= { date: today, amount: 0 };

    const data = playerData.dailyEarnings[jobName];

    // 日付が変わってたらリセット
    if (data.date !== today) {
        data.date = today;
        data.amount = 0;
    }

    const remaining = dailyLimit - data.amount;
    if (remaining <= 0) return 0;

    const finalReward = Math.min(reward, remaining);
    data.amount += finalReward;

    playerData.dailyEarnings[jobName] = data;
    playerDB.set(`player_${playerData.id}`, playerData);

    return finalReward;
}

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    if (!jobs_config.validity) return;
    const { brokenBlockPermutation, player } = ev;

    //木こり
    const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
    if (brokenBlockPermutation.hasTag(`log`) && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "woodcutter",
            random,
            jobs_config.dailyLimit.woodcutter
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:mangrove_log` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "woodcutter",
            random,
            jobs_config.dailyLimit.woodcutter
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:cherry_log` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "woodcutter",
            random,
            jobs_config.dailyLimit.woodcutter
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:mangrove_roots` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "woodcutter",
            random,
            jobs_config.dailyLimit.woodcutter
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:pale_oak_log` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "woodcutter",
            random,
            jobs_config.dailyLimit.woodcutter
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //土掘り士
    if (brokenBlockPermutation.type.id === `minecraft:dirt` && player.hasTag(`mcjobs_dirtdigger`)) {
        const jobs = new JobLevel(player, "dirtdigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
        const finalReward = applyDailyLimit(
            playerData,
            "dirtdigger",
            random,
            jobs_config.dailyLimit.dirtdigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:grass` && player.hasTag(`mcjobs_dirtdigger`)) {
        const jobs = new JobLevel(player, "dirtdigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "dirtdigger",
            random,
            jobs_config.dailyLimit.dirtdigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:grass_block` && player.hasTag(`mcjobs_dirtdigger`)) {
        const jobs = new JobLevel(player, "dirtdigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "dirtdigger",
            random,
            jobs_config.dailyLimit.dirtdigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //砂掘り士
    if (brokenBlockPermutation.type.id.endsWith(`sand`) && player.hasTag(`mcjobs_sanddigger`)) {
        const jobs = new JobLevel(player, "sanddigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.sanddiggerReward.min, jobs_config.sanddiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('sanddigger')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "sanddigger",
            random,
            jobs_config.dailyLimit.sanddigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.sanddiggerReward.xp * buff.getMultiplier('sanddigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:gravel` && player.hasTag(`mcjobs_sanddigger`)) {
        const jobs = new JobLevel(player, "sanddigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.sanddiggerReward.min, jobs_config.sanddiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('sanddigger')) / 100;
        const finalReward = applyDailyLimit(
            playerData,
            "sanddigger",
            random,
            jobs_config.dailyLimit.sanddigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.sanddiggerReward.xp * buff.getMultiplier('sanddigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //庭師
    if (brokenBlockPermutation.type.id.includes('leaves') && player.hasTag(`mcjobs_gardener`)) {
        const jobs = new JobLevel(player, "gardener");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.gardeningReward.min, jobs_config.gardeningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('gardener')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "gardener",
            random,
            jobs_config.dailyLimit.gardener
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.gardeningReward.xp * buff.getMultiplier('gardener'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //ネザー掘り士
    if (brokenBlockPermutation.type.id === `minecraft:netherrack` && player.hasTag(`mcjobs_netherdigger`)) {
        const jobs = new JobLevel(player, "netherdigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "netherdigger",
            random,
            jobs_config.dailyLimit.netherdigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:basalt` && player.hasTag(`mcjobs_netherdigger`)) {
        const jobs = new JobLevel(player, "netherdigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "netherdigger",
            random,
            jobs_config.dailyLimit.netherdigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:soul_soil` && player.hasTag(`mcjobs_netherdigger`)) {
        const jobs = new JobLevel(player, "netherdigger");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "netherdigger",
            random,
            jobs_config.dailyLimit.netherdigger
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //鉱夫
    if (player.hasTag(`mcjobs_miner`) && player.getComponent(`inventory`).container.getItem(player.selectedSlotIndex)?.getComponent(`enchantable`)?.getEnchantment(`silk_touch`)) {
        return;
    };
    if (brokenBlockPermutation.type.id == `minecraft:stone` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.normalStoneMiningReward.min, jobs_config.normalStoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "miner",
            random,
            jobs_config.dailyLimit.miner
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.normalStoneMiningReward.xp * buff.getMultiplier('miner'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id.endsWith(`_ore`) && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.oreMiningReward.min, jobs_config.oreMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "miner",
            random,
            jobs_config.dailyLimit.miner
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.oreMiningReward.xp * buff.getMultiplier('miner'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:ancient_debris` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.oreMiningReward.min, jobs_config.oreMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "miner",
            random,
            jobs_config.dailyLimit.miner
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.oreMiningReward.xp * buff.getMultiplier('miner'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:deepslate` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "miner",
            random,
            jobs_config.dailyLimit.miner
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:tuff` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "miner",
            random,
            jobs_config.dailyLimit.miner
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.hasTag(`stone`) && player.hasTag(`mcjobs_miner`) && brokenBlockPermutation.type.id != `minecraft:cobblestone`) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "miner",
            random,
            jobs_config.dailyLimit.miner
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //農家
    if (brokenBlockPermutation.getTags().includes(`minecraft:crop`) && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`growth`) == 7) {
        const jobs = new JobLevel(player, "farmer");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "farmer",
            random,
            jobs_config.dailyLimit.farmer
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:cocoa` && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`age`) === 2) {
        const jobs = new JobLevel(player, "farmer");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.cocoaHarvestReward.min, jobs_config.cocoaHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "farmer",
            random,
            jobs_config.dailyLimit.farmer
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.cocoaHarvestReward.xp * buff.getMultiplier('farmer'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `mc:rice_crop` && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`mc:growth_stage`) === 3) {
        const jobs = new JobLevel(player, "farmer");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "farmer",
            random,
            jobs_config.dailyLimit.farmer
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
});

world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block } = ev;

    if (!jobs_config.validity) return;
    const playerData = JSON.parse(playerDB.get(`player_${player.id}`));

    const container = player.getComponent("inventory").container;
    const item = container.getItem(player.selectedSlotIndex);
    if (item && item?.typeId.includes("bucket")) {
        return;
    };

    //建築士
    if (player.hasTag(`mcjobs_builder`)) {
        const jobs = new JobLevel(player, "builder");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.buildReward.min, jobs_config.buildReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('builder')) / 100;

        const finalReward = applyDailyLimit(
            playerData,
            "builder",
            random,
            jobs_config.dailyLimit.builder
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.buildReward.xp * buff.getMultiplier('builder'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
});

/**
 * 
 * @param {Player} player 
 * @param {Block} block 
 */
export function GrowthPlantReward(player, block) {
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
            if (CheckPermissionFromLocation(player, block.x, block.z, block.dimension.id, `place`)) return;
            //block.setPermutation(block.permutation.withState(`growth`, 0));
            const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
            const jobs = new JobLevel(player, "farmer");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel)) / 100;
            const reward = Math.ceil((random / 10 * growth) * 100) / 100;

            const finalReward = applyDailyLimit(
                playerData,
                "farmer",
                reward,
                jobs_config.dailyLimit.farmer
            );

            if (finalReward <= 0) return;

            jobs.addXp(jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer'));
            playerData.money += finalReward;
            playerDB.set(`player_${player.id}`, JSON.stringify(playerData));

            if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
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
        const playerData = JSON.parse(playerDB.get(`player_${player.id}`));
        try {
            const id = ev.deadEntity.typeId.split(`:`)[1];
            const jobs = new JobLevel(player, "hunter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config[`${id}KillReward`].min, jobs_config[`${id}KillReward`].max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('hunter')) / 100

            const finalReward = applyDailyLimit(
                playerData,
                "hunter",
                random,
                jobs_config.dailyLimit.hunter
            );

            if (finalReward <= 0) return;

            jobs.addXp(jobs_config[`${id}KillReward`].xp * buff.getMultiplier('hunter'));
            playerData.money += finalReward;
            playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
            if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`)
        } catch (error) {
            const jobs = new JobLevel(player, "hunter");
            const jobsLevel = jobs.getLevel();
            const random = Math.floor(getRandomInteger(jobs_config.otherMobkillReward.min, jobs_config.otherMobkillReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('hunter')) / 100
            const finalReward = applyDailyLimit(
                playerData,
                "hunter",
                random,
                jobs_config.dailyLimit.hunter
            );

            if (finalReward <= 0) return;

            jobs.addXp(jobs_config.otherMobkillReward.xp * buff.getMultiplier('hunter'));
            playerData.money += finalReward;
            playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
            if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`)
        };
    } catch (error) {
        return;
    };
});

playerFishingAfterEvent.subscribe((event) => {
    system.runTimeout(() => {
        if (!jobs_config.validity) return;
        if (!event.result) return;
        // 漁師
        /**
         * @type {Player}
         */
        const player = event.player;
        if (!player.hasTag(`mcjobs_fisherman`)) return;
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const jobs = new JobLevel(player, "fisherman");
        const jobsLevel = jobs.getLevel();
        const random = Math.floor(getRandomInteger(jobs_config.fishingReward.min, jobs_config.fishingReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('fisherman')) / 100

        const finalReward = applyDailyLimit(
            playerData,
            "fisherman",
            random,
            jobs_config.dailyLimit.fisherman
        );

        if (finalReward <= 0) return;

        jobs.addXp(jobs_config.fishingReward.xp * buff.getMultiplier('fisherman'));
        playerData.money += finalReward;
        playerDB.set(`player_${player.id}`, JSON.stringify(playerData));
        if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${finalReward} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`)
    });
});

/**
 * 職業メニュー
 * @param {Player} player 
 */
export function jobsForm(player) {
    const form = new ActionFormData();
    form.title({ translate: `jobs.title` });
    const body = [];
    let jobsList = jobs_config.jobsList
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`))
    if (national_tier_level.enabled) {
        const countryId = playerData?.country;
        const lv = countryId ? (countryId > 0 ? new CountryManager(countryId).countryData?.lv : 0) : 0;
        jobsList = jobs_config.jobsList.filter(job => job.lv <= (lv ?? 0));
    };
    const today = getTodayByUTCOffset(config.timeDifference);
    for (const job of jobsList) {
        let isEmploy = player.hasTag(`mcjobs_${job.id}`);
        let employMessage = `not.yet.employed`;
        const jobs = new JobLevel(player, job.id);
        const level = jobs.getLevel();
        playerData.dailyEarnings ??= {};
        const dailyEarning = playerData.dailyEarnings[job.id] ??= { date: today, amount: 0 };
        let pushElement = [{ translate: job.id }, { text: `§f Lv: ${level} XP: [${jobs.getXp()}/${jobs.getXpRequired(level)}]§f Limit: [${dailyEarning.amount}/${jobs_config.dailyLimit[job.id]}]\n` }]
        if (isEmploy) {
            employMessage = `already.found.employment`;

            pushElement = [{ text: '§a' }, { translate: job.id }, { text: `§a Lv: ${level} XP: [${jobs.getXp()}/${jobs.getXpRequired(level)}]§f Limit: [${dailyEarning.amount}/${jobs_config.dailyLimit[job.id]}]\n` }]
        };
        body.push(...pushElement)
        form.button({ rawtext: [{ text: `§l` }, { translate: job.name }, { text: `\n` }, { translate: employMessage }] });
    };
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
        let isEmploy = player.hasTag(`mcjobs_${jobsList[selected].id}`);
        if (isEmploy) {
            player.removeTag(`mcjobs_${jobsList[selected].id}`);
            jobsForm(player);
            return;
        };
        let employAmount = player.getTags().filter(t => t.startsWith(`mcjobs_`)).length;
        if (employAmount === jobs_config.maxEmploymentNum) {
            player.sendMessage({ translate: `message.max.employment.num.over`, with: [`${employAmount}`] });
            return;
        };
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