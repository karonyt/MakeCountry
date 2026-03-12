import { world, system, Player, EntityInitializationCause } from "@minecraft/server";
import { sendQuestActionEvent, getQuests } from "./api.js";
import { questCache } from "./cache.js";
import PlayerFishingAfterEvent from "../../../lib/fishingEvent.js";
import { questConfig } from "./config.js"; 

const LAST_UPDATE_KEY = "dailyQuestUpdatedDate";
const JST_OFFSET = 9 * 60;

function getJSTDate() {
    const now = new Date();
    const utcMinutes = now.getTime() / 60000;
    return new Date((utcMinutes + JST_OFFSET) * 60000);
}

// --- イベントリスナー ---

world.afterEvents.worldLoad.subscribe(() => {
    const nowJST = getJSTDate();
    const todayJSTString = nowJST.toISOString().slice(0, 10);
    const lastUpdateDateString = world.getDynamicProperty(LAST_UPDATE_KEY);

    if (lastUpdateDateString === todayJSTString) {
        console.log(`[DailyQuest] 本日のクエストは既に更新済みです。`);
        return;
    }

    const currentHour = nowJST.getHours();
    const currentMinute = nowJST.getMinutes();
    const startTimeInMinutes = questConfig.RESET_HOUR_JST * 60 + questConfig.RESET_MINUTE_JST;
    const endTimeInMinutes = startTimeInMinutes + questConfig.RESET_WINDOW_MINUTES;
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    if (currentTimeInMinutes >= startTimeInMinutes && currentTimeInMinutes < endTimeInMinutes) {
        console.log(`[DailyQuest] 更新時間内の初回起動を検知。クエスト日付を更新します。`);
        world.setDynamicProperty(LAST_UPDATE_KEY, todayJSTString);
        world.sendMessage("§e[サーバー] §fデイリークエストが更新されました！");
    }
});

world.afterEvents.playerSpawn.subscribe(async (event) => {
    if (event.initialSpawn) {
        await questCache.updateCacheForPlayer(event.player);
    }
});

world.afterEvents.playerLeave.subscribe(ev => {
    questCache.clearCacheForPlayer(ev.playerId);
    playerLastLocations.delete(ev.playerId);
    playerAccumulatedDistance.delete(ev.playerId);
});

PlayerFishingAfterEvent.subscribe(async (ev: any) => {
    if (ev.result && ev.player && questCache.hasActiveQuest(ev.player.id, 'fish')) {
        const response = await sendQuestActionEvent(ev.player, 'fish', 1);
        questCache.updateCacheFromActionResponse(ev.player.id, response);
    }
});

world.afterEvents.playerBreakBlock.subscribe(async (ev) => {
    const { player, brokenBlockPermutation } = ev;
    const blockId = brokenBlockPermutation.type.id;
    
    if (blockId.endsWith('_ore') && questCache.hasActiveQuest(player.id, 'mine_ore')) {
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        const response = await sendQuestActionEvent(player, 'mine_ore', 1, blockId);
        questCache.updateCacheFromActionResponse(player.id, response);
    } else if ((blockId.endsWith('_log') || blockId.endsWith('_stem')) && questCache.hasActiveQuest(player.id, 'break_block')) {
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        const response = await sendQuestActionEvent(player, 'break_block', 1, blockId);
        questCache.updateCacheFromActionResponse(player.id, response);
    } else if (brokenBlockPermutation.hasTag('minecraft:crop') && questCache.hasActiveQuest(player.id, 'harvest_crop')) {
        if (brokenBlockPermutation.getState('growth') === 7) {
            // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
            const response = await sendQuestActionEvent(player, 'harvest_crop', 1, blockId);
            questCache.updateCacheFromActionResponse(player.id, response);
        }
    } else if (['minecraft:dirt', 'minecraft:sand', 'minecraft:gravel', 'minecraft:stone'].includes(blockId) && questCache.hasActiveQuest(player.id, 'break_block')) {
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        const response = await sendQuestActionEvent(player, 'break_block', 1, blockId);
        questCache.updateCacheFromActionResponse(player.id, response);
    }
});

world.afterEvents.itemCompleteUse.subscribe(async (ev) => {
    if (questCache.hasActiveQuest(ev.source.id, 'eat_item')) {
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        const response = await sendQuestActionEvent(ev.source, 'eat_item', 1, ev.itemStack.typeId);
        questCache.updateCacheFromActionResponse(ev.source.id, response);
    }
});

world.afterEvents.entityDie.subscribe(async (ev) => {
    if (!(ev.damageSource?.damagingEntity instanceof Player)) return;
    
    const player = ev.damageSource.damagingEntity;
    if (questCache.hasActiveQuest(player.id, 'kill_mob')) {
        const deadEntityId = ev.deadEntity.typeId;
        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
        const response = await sendQuestActionEvent(player, 'kill_mob', 1, deadEntityId);
        questCache.updateCacheFromActionResponse(player.id, response);
    }
});

// 移動距離計測
const playerLastLocations = new Map();
const playerAccumulatedDistance = new Map();
const TELEPORT_THRESHOLD = 50;

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        const currentLoc = player.location;
        const lastLocData = playerLastLocations.get(player.id);

        if (lastLocData && player.dimension.id === lastLocData.dimension.id) {
            const distance = Math.sqrt(
                Math.pow(currentLoc.x - lastLocData.location.x, 2) +
                Math.pow(currentLoc.z - lastLocData.location.z, 2)
            );
            
            if (distance < TELEPORT_THRESHOLD) {
                const accumulated = (playerAccumulatedDistance.get(player.id) || 0) + distance;
                playerAccumulatedDistance.set(player.id, accumulated);
            }
        }
        playerLastLocations.set(player.id, { location: currentLoc, dimension: player.dimension });
    }
}, 10);

system.runInterval(async () => {
    for (const [playerId, distance] of playerAccumulatedDistance.entries()) {
        if (distance >= 1) {
            const player = world.getAllPlayers().find(p => p.id === playerId);
            if (player && questCache.hasActiveQuest(playerId, 'walk')) {
                const response = await sendQuestActionEvent(player, 'walk', Math.floor(distance));
                questCache.updateCacheFromActionResponse(playerId, response);
            }
        }
        playerAccumulatedDistance.set(playerId, 0);
    }
}, 20);