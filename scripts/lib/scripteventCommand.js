import { Player, ScriptEventSource, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "./util";
import { uiManager } from "@minecraft/server-ui";
import { tax } from "./interval";
import { fixCountryData } from "./fixdata";
import { DynamicProperties } from "../api/dyp";
import config from "../config";

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
                roles: [],
                chunks: [],
                days: 0,
                invite: [],
                settings: {
                    inviteReceiveMessage: true,
                }
            };

            const playerDataBase = new DynamicProperties('player');
            playerDataBase.set(`player_${player.id}`, JSON.stringify(newPlayerData));

            break;
        };
    };
});