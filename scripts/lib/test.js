import { Player, ScriptEventSource, StructureManager, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "./util";
import { changeOwnerScriptEvent, DeleteCountry, playerCountryJoin } from "./land";
import * as DyProp from "./DyProp";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm } from "./form_class";
const ActionFormData = ActionForm;
import { itemIdToPath } from "../texture_config";
import { updateRanking } from "./ranking";
import { fixCountryData, resetRoleData } from "./fixdata";
import { DynamicProperties } from "../api/dyp";

let playerDataBase
world.afterEvents.worldLoad.subscribe(() => {
    playerDataBase = new DynamicProperties("player");
})

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.sourceType !== ScriptEventSource.Entity || !(ev.sourceEntity instanceof Player)) return;
    const { sourceEntity, message } = ev;
    const playerData = GetAndParsePropertyData(`player_${sourceEntity?.id}`);
    switch (ev.id) {
        case `karo:add`: {
            playerData.money += Number(message);
            StringifyAndSavePropertyData(`player_${sourceEntity.id}`, playerData);
            break;
        };
        case `karo:remove`: {
            playerData.money -= Number(message);
            StringifyAndSavePropertyData(`player_${sourceEntity.id}`, playerData);
            break;
        };
        case `karo:set`: {
            playerData.money = Number(message);
            StringifyAndSavePropertyData(`player_${sourceEntity.id}`, playerData);
            break;
        };
        case `karo:reset`: {
            world.clearDynamicProperties();
            break;
        };
        case `karo:list`: {
            const dyp = []
            world.getDynamicPropertyIds().forEach(id => {
                dyp.push(`§6${id}§r\n${world.getDynamicProperty(id)}\n`)
            })
            world.sendMessage(`${dyp.join(`\n`)}`);
            break;
        };
        case `karo:taxtimer`: {
            world.setDynamicProperty(`taxTimer`, message);
            break;
        };
        case `karo:newowner`: {
            changeOwnerScriptEvent(sourceEntity);
            break;
        };
        case `karo:deletecountry`: {
            DeleteCountry(Number(message));
            break;
        };
        case `karo:countrydata`: {
            const countryDataBase = new DynamicProperties('country');
            sourceEntity.sendMessage(`${countryDataBase.get(`country_${message}`)}`);
            break;
        };
        case `karo:addcountrydata`: {
            const [messageSplit1, ...messageSplit2] = message.split(` `, 2);
            const countryData = GetAndParsePropertyData(`country_${messageSplit1}`);
            Object.assign(countryData, JSON.parse(messageSplit2.join(``)));
            StringifyAndSavePropertyData(`country_${messageSplit1}`, countryData);
            break;
        };
        case `karo:roledata`: {
            const roleDataBase = new DynamicProperties('role');
            sourceEntity.sendMessage(`${roleDataBase.get(`role_${message}`)}`);
            break;
        };
        case `karo:playerdata`: {
            const player = world.getPlayers({ name: message })[0];
            const playerDataBase = new DynamicProperties('player');
            sourceEntity.sendMessage(`${playerDataBase.get(`player_${message}`)}`);
            break;
        };
        case `karo:addroledata`: {
            const [messageSplit1, ...messageSplit2] = message.split(` `, 2);
            const roleData = GetAndParsePropertyData(`role_${messageSplit1}`);
            Object.assign(roleData, JSON.parse(messageSplit2.join(``)));
            StringifyAndSavePropertyData(`role_${messageSplit1}`, roleData);
            break;
        };
        case `karo:createroledata`: {
            const [messageSplit1, ...messageSplit2] = message.split(` `, 2);
            const roleData = {
                name: `new Role`,
                color: `§a`,
                icon: `textures/blocks/stone`,
                id: Number(messageSplit1),
                members: [],
                permissions: []
            };
            StringifyAndSavePropertyData(`role_${messageSplit1}`, roleData);
            break;
        };
        case `karo:countryjoin`: {
            playerCountryJoin(sourceEntity, Number(message));
            break;
        };
        case `karo:item`: {
            const container = sourceEntity.getComponent(`inventory`).container;
            sourceEntity.sendMessage(`${container.getItem(sourceEntity.selectedSlotIndex)?.typeId}`);
            break;
        };
        case `karo:itemtest`: {
            itemTestForm(sourceEntity);
            break;
        };
        case `karo:getdeta`: {
            sourceEntity.sendMessage(`${DyProp.getDynamicProperty(message).length}`);
            break;
        };
        case `karo:mobtest`: {
            if (message.length === 0) {
                sourceEntity.sendMessage(`読み込まれているエンティティ数は${sourceEntity.dimension.getEntities().length}体です`);
                break;
            };
            const [messageSplit1, ...messageSplit2] = message.split(` `, 2);
            if (messageSplit2.length === 0) {
                sourceEntity.sendMessage(`半径${messageSplit1}m以内にいるエンティティは${sourceEntity.dimension.getEntities({ location: sourceEntity.location, maxDistance: Number(messageSplit1) }).length}体です`);
                break;
            };
            sourceEntity.sendMessage(`半径${messageSplit1}m以内にいる${messageSplit2}は${sourceEntity.dimension.getEntities({ location: sourceEntity.location, maxDistance: Number(messageSplit1), type: messageSplit2.join(``) }).length}`);
            break;
        };
        case `karo:keylistnum`: {
            sourceEntity.sendMessage(`${world.getDynamicPropertyIds().length}`);
            break;
        };
        case `karo:keylist`: {
            sourceEntity.sendMessage(`${world.getDynamicPropertyIds()}`);
            break;
        };
        case `karo:get`: {
            sourceEntity.sendMessage(`${world.getDynamicProperty(message)}`);
            break;
        };
        case `karo:getdyprop`: {
            sourceEntity.sendMessage(`${DyProp.getDynamicProperty(message)}`);
            break;
        };
        case `karo:delete`: {
            sourceEntity.sendMessage(`${world.setDynamicProperty(message)}`);
            break;
        };
        case `karo:lore`: {
            const container = sourceEntity.getComponent(`inventory`).container;
            const item = container.getItem(sourceEntity.selectedSlotIndex);
            if (item) {
                item.setLore([`${message}`]);
                container.setItem(sourceEntity.selectedSlotIndex, item);
            };
            break;
        };
        case `karo:deletedyprop`: {
            sourceEntity.sendMessage(`${DyProp.setDynamicProperty(message)}`);
            break;
        };
        case `karo:byte`: {
            sourceEntity.sendMessage(`${world.getDynamicPropertyTotalByteCount()}`);
            break;
        };
        case `karo:playercount`: {
            const playerDataBase = new DynamicProperties('player');
            const count = playerDataBase.idList.length;
            console.log(`${count}`);
            sourceEntity?.sendMessage(`${count}`);
            break;
        };
        case `karo:account`: {
            sourceEntity.sendMessage(`${world.getPlayers({ name: message })[0]?.getDynamicProperty(`accountData`)}`);
            break;
        }
        case `karo:deletedyp`: {
            DyProp.setDynamicProperty(`${message}`);
            break;
        }
        /*case `karo:form`: {
            for(const player of world.getAllPlayers()) {
                uiManager.closeAllForms(player);
            };
            break;
        };*/
        case 'karo:mergechunk': {
            const [from, to] = message.split(' ');
            const fromNum = Number(from);
            const toNum = Number(to);
            const chunkDataBase = new DynamicProperties('chunk');
            chunkDataBase.idList.map(id => {
                /**
                 * @type {{plot: {},countryId: undefined|number}}
                 */
                const chunkData = GetAndParsePropertyData(id);
                if (chunkData?.countryId && chunkData?.countryId == fromNum) {
                    chunkData.countryId = toNum;
                    chunkData.plot = undefined;
                    StringifyAndSavePropertyData(id, chunkData);
                };
            });
            break;
        };
        case 'karo:chunkdeleter': {
            const chunkDataBase = new DynamicProperties('chunk')
            const countryDataBase = new DynamicProperties('country')
            const ids = chunkDataBase.idList;
            const countryIds = countryDataBase.idList;
            const aliveCountryIds = [];
            for (const id of countryIds) {
                const rawData = countryDataBase.get(id);
                if (rawData) {
                    aliveCountryIds.push(Number(id.split(`_`)[1]))
                }
            }
            for (let i = 0; i < ids.length; i++) {
                system.runTimeout(() => {
                    const id = ids[i];
                    const chunkRawData = chunkDataBase.get(id);
                    if (chunkRawData) {
                        /**
                         * @type {{plot: {},countryId: undefined|number}}
                         */
                        const chunkData = JSON.parse(chunkRawData);
                        if (!chunkData?.countryId || chunkData?.countryId == 0) {
                            if (!chunkData?.special) {
                                chunkDataBase.delete(id);
                            };
                        };
                        if (!aliveCountryIds.includes(chunkData?.countryId) && chunkData?.countryId != 0) {
                            if (!chunkData?.special) {
                                chunkDataBase.delete(id);
                            };
                        }
                    };
                }, Math.floor(i / 50));
            };
            break;
        };
        case 'karo:updaterank': {
            updateRanking();
            break;
        };
        case 'karo:fixcountry': {
            fixCountryData();
            break;
        }
        case 'karo:resetservermoney': {
            system.runJob(resetMoney(playerDataBase.idList));
            break;
        }
        case 'karo:structure': {
            const ids = world.structureManager.getWorldStructureIds();
            sourceEntity.sendMessage(`${ids.join(' , ')}`)
            break;
        }
        case 'karo:resetrole': {
            resetRoleData();
            break;
        };
    };
});

/**
 * プレイヤーのお金をリセットするジェネレーター関数
 * @param {Array<string>} keys 
 */
function* resetMoney(keys) {
    for (const key of keys) {
        const rawData = playerDataBase.get(key);
        if (!rawData) continue;
        const data = JSON.parse(rawData);
        data.money = 0;
        playerDataBase.set(key, JSON.stringify(data));
        console.log(data.name)
        yield key; // 処理済みのキーを返す
    }
}

/**
 * 
 * @param {Player} player 
 */
function itemTestForm(player) {
    const form = new ActionFormData();
    const items = Object.keys(itemIdToPath);
    for (let i = 0; i < items.length; i++) {
        form.button(items[i], itemIdToPath[items[i]]);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                itemTestForm(player);
            };
            return;
        };
    });
};

/*
world.afterEvents.worldInitialize.subscribe(() => {
    const dyp = world.getDynamicPropertyIds()
    world.sendMessage(`${dyp}`)
    dyp.forEach(d => {
        world.sendMessage(`${d}\n${world.getDynamicProperty(d)}`)
    })
    world.sendMessage(`${DyProp.DynamicPropertyIds().filter(c => c.startsWith(`country_`))}`)
})
*/