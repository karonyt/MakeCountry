import { Player, ScriptEventSource, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { uiManager } from "@minecraft/server-ui";
import { tax } from "@/app/intervals.js";
import { fixCountryData } from "@/maintenance/fix-data.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import config from "@/config/server.js";
import { ensureMarriageData } from "@/domain/player/marriage.js";
import { ensureBountyData } from "@/domain/player/bounty.js";
import { ensureGroupChatData } from "@/domain/player/group-chat.js";

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.sourceType !== ScriptEventSource.Entity || !(ev.sourceEntity instanceof Player)) return;
    const { sourceEntity, message } = ev;
    const playerData = GetAndParsePropertyData(`player_${sourceEntity.id}`);
    switch (ev.id) {
        case `mc:add`: {
            playerData.money += Number(message);
            StringifyAndSavePropertyData(`player_${sourceEntity.id}`, playerData);
            break;
        };
        case `mc:remove`: {
            playerData.money -= Number(message);
            StringifyAndSavePropertyData(`player_${sourceEntity.id}`, playerData);
            break;
        };
        case `mc:set`: {
            playerData.money = Number(message);
            StringifyAndSavePropertyData(`player_${sourceEntity.id}`, playerData);
            break;
        };
        case `mc:close_form`: {
            // @ts-ignore TS(2379): Argument of type 'import("C:/Users/karon/node_modu... Remove this comment to see the full error message
            uiManager.closeAllForms(sourceEntity);
            break;
        };
        case `mc:setup`: {
            sourceEntity.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `system.setup.complete` }] });
            sourceEntity.addTag("mc_admin");
            world.setDynamicProperty(`start`, `true`);
            break;
        };
        case `mc:tax_time`: {
            tax();
            break;
        };
        case `mc:lore`: {
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const container = sourceEntity.getComponent(`inventory`).container;
            const item = container.getItem(sourceEntity.selectedSlotIndex);
            if (item) {
                item.setLore([`${message}`]);
                container.setItem(sourceEntity.selectedSlotIndex, item);
            };
            break;
        };
        case 'mc:fixcountrydata': {
            fixCountryData();
            break;
        };
        case 'mc:resetplayerdata': {
            const player = world.getPlayers({ name: message })[0];
            if (!player) return;

            const newPlayerData = {
                name: player.name,
                id: player.id,
                country: undefined,
                money: config.initialMoney,
                bountyLastSetAt: undefined,
                bountyDailySetDate: undefined,
                bountyDailySetCount: 0,
                roles: [],
                chunks: [],
                days: 0,
                invite: [],
                settings: {
                    inviteReceiveMessage: true,
                },
                marriage: {
                    spouseId: undefined,
                    since: undefined,
                    requests: [],
                },
                groupChat: {
                    currentOwnerId: undefined,
                    ownedGroup: undefined,
                }
            };

            const playerDataBase = new DynamicProperties('player');
            ensureMarriageData(newPlayerData);
            ensureBountyData(newPlayerData);
            ensureGroupChatData(newPlayerData);
            playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));

            break;
        };
    };
});
