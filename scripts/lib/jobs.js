import { EnchantmentType, EnchantmentTypes, Player, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, getRandomInteger, StringifyAndSavePropertyData } from "./util";
import jobs_config from "../jobs_config";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionFormData } from "@minecraft/server-ui";
import playerFishingAfterEvent from "./fishingEvent";
import { JobLevel } from "./jobslevel";
import { RewardBuff } from "../api/rewardbuff";
import { DynamicProperties } from "../api/dyp";
import { CountryManager } from "../api/country/country";
import national_tier_level from "../national_tier_level";

let buff

world.afterEvents.worldLoad.subscribe(() => {
    buff = new RewardBuff();
});

world.afterEvents.playerBreakBlock.subscribe((ev) => {
    if (!jobs_config.validity) return;
    const { brokenBlockPermutation, player } = ev;

    //木こり
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (brokenBlockPermutation.hasTag(`log`) && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:mangrove_log` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:mangrove_roots` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:pale_oak_log` && player.hasTag(`mcjobs_woodcutter`)) {
        const jobs = new JobLevel(player, "woodcutter");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.woodCutReward.xp * buff.getMultiplier('woodcutter'));
        const random = Math.floor(getRandomInteger(jobs_config.woodCutReward.min, jobs_config.woodCutReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('woodcutter')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //土掘り士
    if (brokenBlockPermutation.type.id === `minecraft:dirt` && player.hasTag(`mcjobs_dirtdigger`)) {
        const jobs = new JobLevel(player, "dirtdigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger'));
        const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:grass` && player.hasTag(`mcjobs_dirtdigger`)) {
        const jobs = new JobLevel(player, "dirtdigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger'));
        const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:grass_block` && player.hasTag(`mcjobs_dirtdigger`)) {
        const jobs = new JobLevel(player, "dirtdigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.dirtdiggerReward.xp * buff.getMultiplier('dirtdigger'));
        const random = Math.floor(getRandomInteger(jobs_config.dirtdiggerReward.min, jobs_config.dirtdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('dirtdigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //砂掘り士
    if (brokenBlockPermutation.type.id.endsWith(`sand`) && player.hasTag(`mcjobs_sanddigger`)) {
        const jobs = new JobLevel(player, "sanddigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.sanddiggerReward.xp * buff.getMultiplier('sanddigger'));
        const random = Math.floor(getRandomInteger(jobs_config.sanddiggerReward.min, jobs_config.sanddiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('sanddigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:gravel` && player.hasTag(`mcjobs_sanddigger`)) {
        const jobs = new JobLevel(player, "sanddigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.sanddiggerReward.xp * buff.getMultiplier('sanddigger'));
        const random = Math.floor(getRandomInteger(jobs_config.sanddiggerReward.min, jobs_config.sanddiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('sanddigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //庭師
    if (brokenBlockPermutation.type.id.includes('leaves') && player.hasTag(`mcjobs_gardener`)) {
        const jobs = new JobLevel(player, "gardener");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.gardeningReward.xp * buff.getMultiplier('gardener'));
        const random = Math.floor(getRandomInteger(jobs_config.gardeningReward.min, jobs_config.gardeningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('gardener')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //ネザー掘り士
    if (brokenBlockPermutation.type.id === `minecraft:netherrack` && player.hasTag(`mcjobs_netherdigger`)) {
        const jobs = new JobLevel(player, "netherdigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger'));
        const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:basalt` && player.hasTag(`mcjobs_netherdigger`)) {
        const jobs = new JobLevel(player, "netherdigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger'));
        const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:soul_soil` && player.hasTag(`mcjobs_netherdigger`)) {
        const jobs = new JobLevel(player, "netherdigger");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.netherdiggerReward.xp * buff.getMultiplier('netherdigger'));
        const random = Math.floor(getRandomInteger(jobs_config.netherdiggerReward.min, jobs_config.netherdiggerReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('netherdigger')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //鉱夫
    if (player.hasTag(`mcjobs_miner`) && player.getComponent(`inventory`).container.getItem(player.selectedSlotIndex)?.getComponent(`enchantable`)?.getEnchantment(`silk_touch`)) {
        return;
    };
    if (brokenBlockPermutation.type.id == `minecraft:stone` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.normalStoneMiningReward.xp * buff.getMultiplier('miner'));
        const random = Math.floor(getRandomInteger(jobs_config.normalStoneMiningReward.min, jobs_config.normalStoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id.endsWith(`_ore`) && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.oreMiningReward.xp * buff.getMultiplier('miner'));
        const random = Math.floor(getRandomInteger(jobs_config.oreMiningReward.min, jobs_config.oreMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:ancient_debris` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.oreMiningReward.xp * buff.getMultiplier('miner'));
        const random = Math.floor(getRandomInteger(jobs_config.oreMiningReward.min, jobs_config.oreMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:deepslate` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner'));
        const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:tuff` && player.hasTag(`mcjobs_miner`)) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner'));
        const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.hasTag(`stone`) && player.hasTag(`mcjobs_miner`) && brokenBlockPermutation.type.id != `minecraft:cobblestone`) {
        const jobs = new JobLevel(player, "miner");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.stoneMiningReward.xp * buff.getMultiplier('miner'));
        const random = Math.floor(getRandomInteger(jobs_config.stoneMiningReward.min, jobs_config.stoneMiningReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('miner')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };

    //農家
    if (brokenBlockPermutation.getTags().includes(`minecraft:crop`) && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`growth`) == 7) {
        const jobs = new JobLevel(player, "farmer");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer'));
        const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `minecraft:cocoa` && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`age`) === 2) {
        const jobs = new JobLevel(player, "farmer");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.cocoaHarvestReward.xp * buff.getMultiplier('farmer'));
        const random = Math.floor(getRandomInteger(jobs_config.cocoaHarvestReward.min, jobs_config.cocoaHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
    if (brokenBlockPermutation.type.id === `mc:rice_crop` && player.hasTag(`mcjobs_farmer`) && brokenBlockPermutation.getState(`mc:growth_stage`) === 3) {
        const jobs = new JobLevel(player, "farmer");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.cropHarvestReward.xp * buff.getMultiplier('farmer'));
        const random = Math.floor(getRandomInteger(jobs_config.cropHarvestReward.min, jobs_config.cropHarvestReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('farmer')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
});

world.afterEvents.playerPlaceBlock.subscribe((ev) => {
    const { player, block } = ev;

    if (!jobs_config.validity) return;
    const playerData = GetAndParsePropertyData(`player_${player.id}`);

    //建築士
    if (player.hasTag(`mcjobs_builder`)) {
        const jobs = new JobLevel(player, "builder");
        const jobsLevel = jobs.getLevel();
        jobs.addXp(jobs_config.buildReward.xp * buff.getMultiplier('builder'));
        const random = Math.floor(getRandomInteger(jobs_config.buildReward.min, jobs_config.buildReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('builder')) / 100;
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        if (jobs_config.showRewardMessage) ev.player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`);
        return;
    };
});

world.afterEvents.entityDie.subscribe((ev) => {
    if (!jobs_config.validity) return;

    try {
        if (!(ev.damageSource.damagingEntity instanceof Player)) { return };
        const player = ev.damageSource.damagingEntity;
        //狩人
        if (!player.hasTag(`mcjobs_hunter`)) return;
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        try {
            const id = ev.deadEntity.typeId.split(`:`)[1];
            const jobs = new JobLevel(player, "hunter");
            const jobsLevel = jobs.getLevel();
            jobs.addXp(jobs_config[`${id}KillReward`].xp * buff.getMultiplier('hunter'));
            const random = Math.floor(getRandomInteger(jobs_config[`${id}KillReward`].min, jobs_config[`${id}KillReward`].max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('hunter')) / 100
            if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`)
            playerData.money += random;
            StringifyAndSavePropertyData(`player_${player.id}`, playerData);
        } catch (error) {
            const jobs = new JobLevel(player, "hunter");
            const jobsLevel = jobs.getLevel();
            jobs.addXp(jobs_config.otherMobkillReward.xp * buff.getMultiplier('hunter'));
            const random = Math.floor(getRandomInteger(jobs_config.otherMobkillReward.min, jobs_config.otherMobkillReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('hunter')) / 100
            if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`)
            playerData.money += random;
            StringifyAndSavePropertyData(`player_${player.id}`, playerData);
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
        jobs.addXp(jobs_config.fishingReward.xp * buff.getMultiplier('fisherman'));
        const random = Math.floor(getRandomInteger(jobs_config.fishingReward.min, jobs_config.fishingReward.max) * 100 * jobs.getReward(jobsLevel) * buff.getMultiplier('fisherman')) / 100
        if (jobs_config.showRewardMessage) player.onScreenDisplay.setActionBar(`§6[Money] +${random} §e[XP] ${jobs.getXp()}/${jobs.getXpRequired(jobsLevel)}`)
        playerData.money += random;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData);
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
    if (national_tier_level.enabled) {
        const playerDataBase = new DynamicProperties('player');
        const countryId = JSON.parse(playerDataBase.get(`player_${player.id}`))?.country;
        const lv = countryId ? (countryId > 0 ? new CountryManager(countryId).countryData?.lv : 0) : 0;
        jobsList = jobs_config.jobsList.filter(job => job.lv <= (lv ?? 0));
    };
    for (const job of jobsList) {
        let isEmploy = player.hasTag(`mcjobs_${job.id}`);
        let employMessage = `not.yet.employed`;
        const jobs = new JobLevel(player, job.id);
        const level = jobs.getLevel();
        let pushElement = [{ translate: job.id }, { text: `§f Lv: ${level} XP: [${jobs.getXp()}/${jobs.getXpRequired(level)}]§f\n` }]
        if (isEmploy) {
            employMessage = `already.found.employment`;
            pushElement = [{ text: '§a' }, { translate: job.id }, { text: `§a Lv: ${level} XP: [${jobs.getXp()}/${jobs.getXpRequired(level)}]§f\n` }]
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