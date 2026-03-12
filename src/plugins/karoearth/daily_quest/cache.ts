import { getQuests } from "./api.js";

const playerQuestCache = new Map();

export const questCache = {
    async updateCacheForPlayer(player: any) {
        try {
            const quests = await getQuests(player);
            if (quests && Array.isArray(quests)) {
                const activeActionTypes = new Set();
                let allCompleted = true;
                
                quests.forEach(quest => {
                    if (!quest.completed) {
                        allCompleted = false;
                        if (quest.type === 'daily_large') {
                             activeActionTypes.add('walk'); // 移動クエストは常に監視
                             activeActionTypes.add(quest.action_type);
                        } else {
                             activeActionTypes.add(quest.action_type);
                        }
                    }
                });

                playerQuestCache.set(player.id, { allCompleted, activeActionTypes });
                console.log(`[QuestCache] Updated for ${player.name}. AllComplete: ${allCompleted}, Active: ${[...activeActionTypes].join(',')}`);
            } else {
                 console.warn(`[QuestCache] Failed to get quests for ${player.name}`);
                 playerQuestCache.set(player.id, { allCompleted: false, activeActionTypes: new Set() }); // エラー時は空キャッシュ
            }
        } catch (e) {
            console.warn(`[QuestCache] Failed to update for ${player.name}: ${e}`);
        }
    },

    hasActiveQuest(playerId: any, actionType: any) {
        const cache = playerQuestCache.get(playerId);
        if (!cache) return true; 
        if (cache.allCompleted) return false;
        
        // 移動クエストは常にチェック
        if (actionType === 'walk') return true;
        
        return cache.activeActionTypes.has(actionType);
    },
    
    updateCacheFromActionResponse(playerId: any, response: any) {
        if (!response || !response.updated) return;
        
        const { allCompleted, activeActionTypes } = response;
        playerQuestCache.set(playerId, {
            allCompleted,
            activeActionTypes: new Set(activeActionTypes)
        });
        console.log(`[QuestCache] Updated from action for ${playerId}. AllComplete: ${allCompleted}, Active: ${activeActionTypes.join(',')}`);
    },

    clearCacheForPlayer(playerId: any) {
        playerQuestCache.delete(playerId);
    },
};