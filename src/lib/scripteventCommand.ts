import { Player, ScriptEventSource, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "./util.js";
import { uiManager } from "@minecraft/server-ui";
import { tax } from "./interval.js";
import { fixCountryData } from "./fixdata.js";
import { DynamicProperties } from "../api/dyp.js";
import config from "../config.js";
import { ensureMarriageData } from "../api/player/marriage.js";
import { ensureBountyData } from "../api/player/bounty.js";

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
                }
            };

            const playerDataBase = new DynamicProperties('player');
            ensureMarriageData(newPlayerData);
            ensureBountyData(newPlayerData);
            playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));

            break;
        };
    };
});
