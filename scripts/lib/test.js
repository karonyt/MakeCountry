import { ItemStack, Player, ScriptEventSource, StructureManager, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "./util";
import { changeOwnerScriptEvent, DeleteCountry, playerCountryJoin } from "./land";
import * as DyProp from "./DyProp";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm } from "./form_class";
const ActionFormData = ActionForm;
import { itemIdToPath } from "../texture_config";
import { updateRanking } from "./ranking";
import { fixCountryData, resetPlotData, resetRoleData } from "./fixdata";
import { DynamicProperties } from "../api/dyp";
import { addCompeByItemStack } from "../api/player/compensation";

let playerDataBase
world.afterEvents.worldLoad.subscribe(() => {
    playerDataBase = new DynamicProperties("player");
})

const needs = {
    1: {
        item: [
            { typeId: 'minecraft:oak_fence', amount: 21 }
        ],
        //必要なリソースポイント
        point: 1000
    },
    2: {
        item: [
            { typeId: 'minecraft:oak_boat', amount: 5 }
        ],
        point: 1000
    },
    3: {
        item: [
            { typeId: 'minecraft:wooden_door', amount: 18 }
        ],
        point: 1000
    },
    4: {
        item: [
            { typeId: 'minecraft:wooden_pressure_plate', amount: 32 },
            { typeId: 'minecraft:oak_sapling', amount: 32 }

        ],
        point: 1000
    },
    5: {
        item: [
            { typeId: 'minecraft:apple', amount: 10 }

        ],
        point: 5000
    },
    6: {
        item: [
            { typeId: 'minecraft:oak_sapling', amount: 64 },
            { typeId: 'minecraft:oak_log', amount: 64 }
        ],
        point: 2000
    },
    7: {
        item: [
            { typeId: 'minecraft:oak_sapling', amount: 96 },
            { typeId: 'minecraft:oak_log', amount: 96 }
        ],
        point: 2000
    },
    8: {
        item: [
            { typeId: 'minecraft:oak_sapling', amount: 128 },
            { typeId: 'minecraft:oak_log', amount: 128 }
        ],
        point: 2000
    },
    7: {
        item: [
            { typeId: 'minecraft:chest', amount: 8 },
            { typeId: 'minecraft:oak_fence', amount: 16 },
            { typeId: 'minecraft:oak_log', amount: 64 }
        ],
        point: 2000
    },
    8: {
        item: [
            { typeId: 'minecraft:chest', amount: 16 },
            { typeId: 'minecraft:oak_fence', amount: 32 },
            { typeId: 'minecraft:oak_log', amount: 64 }
        ],
        point: 2000
    },
    9: {
        item: [
            { typeId: 'minecraft:chest', amount: 32 },
            { typeId: 'minecraft:oak_fence', amount: 48 },
            { typeId: 'minecraft:oak_log', amount: 64 }
        ],
        point: 2000
    },
    10: {
        item: [
            { typeId: 'minecraft:chest', amount: 64 },
            { typeId: 'minecraft:oak_fence', amount: 64 },
            { typeId: 'minecraft:oak_log', amount: 64 },
            { typeId: 'minecraft:coal', amount: 64 }
        ],
        point: 10000
    },
    11: {
        item: [
            { typeId: 'minecraft:leaf_litter', amount: 64 * 2 },
            { typeId: 'minecraft:oak_fence', amount: 64 },
            { typeId: 'minecraft:oak_log', amount: 64 },
            { typeId: 'minecraft:coal', amount: 64 }
        ],
        point: 3000
    },
    12: {
        item: [
            { typeId: 'minecraft:leaf_litter', amount: 64 * 2 },
            { typeId: 'minecraft:gravel', amount: 64 },
            { typeId: 'minecraft:oak_log', amount: 64 },
            { typeId: 'minecraft:coal', amount: 64 }
        ],
        point: 3000
    },
    13: {
        item: [
            { typeId: 'minecraft:leaf_litter', amount: 64 * 3 },
            { typeId: 'minecraft:gravel', amount: 64 },
            { typeId: 'minecraft:charcoal', amount: 64 },
            { typeId: 'minecraft:coal', amount: 64 }
        ],
        point: 3000
    },
    14: {
        item: [
            { typeId: 'minecraft:leaf_litter', amount: 64 * 4 },
            { typeId: 'minecraft:gravel', amount: 96 },
            { typeId: 'minecraft:charcoal', amount: 64 },
            { typeId: 'minecraft:coal', amount: 64 }
        ],
        point: 3000
    },
    15: {
        item: [
            { typeId: 'minecraft:gravel', amount: 128 },
            { typeId: 'minecraft:charcoal', amount: 128 },
            { typeId: 'minecraft:coal', amount: 128 }
        ],
        point: 15000
    },
    16: {
        item: [
            { typeId: 'minecraft:flint', amount: 32 },
            { typeId: 'minecraft:coal_block', amount: 16 }
        ],
        point: 4000
    },
    17: {
        item: [
            { typeId: 'minecraft:flint', amount: 48 },
            { typeId: 'minecraft:coal_block', amount: 24 }
        ],
        point: 4000
    },
    18: {
        item: [
            { typeId: 'minecraft:flint', amount: 64 },
            { typeId: 'minecraft:coal_block', amount: 32 },
            { typeId: 'minecraft:tnt', amount: 16 }
        ],
        point: 4000
    },
    19: {
        item: [
            { typeId: 'minecraft:flint', amount: 96 },
            { typeId: 'minecraft:coal_block', amount: 40 },
            { typeId: 'minecraft:tnt', amount: 24 },
            { typeId: 'minecraft:polished_basalt', amount: 64 * 2 },
        ],
        point: 4000
    },
    20: {
        item: [
            { typeId: 'minecraft:flint', amount: 128 },
            { typeId: 'minecraft:raw_iron_block', amount: 32 },
            { typeId: 'minecraft:seagrass', amount: 128 },
            { typeId: 'minecraft:saddle', amount: 5 },
        ],
        point: 20000
    },
    21: {
        item: [
            { typeId: 'minecraft:raw_iron_block', amount: 32 },
            { typeId: 'minecraft:slime_ball', amount: 64 },
            { typeId: 'minecraft:redstone_block', amount: 64 },
        ],
        point: 5000
    },
    22: {
        item: [
            { typeId: 'minecraft:raw_iron_block', amount: 64 },
            { typeId: 'minecraft:slime_ball', amount: 64 * 2 },
            { typeId: 'minecraft:redstone_block', amount: 64 * 2 },
        ],
        point: 5000
    },
    23: {
        item: [
            { typeId: 'minecraft:raw_iron_block', amount: 64 },
            { typeId: 'minecraft:gravel', amount: 64 },
            { typeId: 'minecraft:slime_ball', amount: 64 * 3 },
            { typeId: 'minecraft:redstone_block', amount: 64 * 3 },
            { typeId: 'minecraft:egg', amount: 64 },
        ],
        point: 5000
    },
    24: {
        item: [
            { typeId: 'minecraft:charcoal', amount: 64 * 3 },
            { typeId: 'minecraft:coal', amount: 128 },
            { typeId: 'minecraft:slime_ball', amount: 64 * 3 },
            { typeId: 'minecraft:redstone_block', amount: 64 * 3 },
            { typeId: 'minecraft:ender_pearl', amount: 64 },

        ],
        point: 5000
    },
    25: {
        item: [
            { typeId: 'minecraft:raw_iron_block', amount: 96 },
            { typeId: 'minecraft:gravel', amount: 64 },
            { typeId: 'minecraft:flint', amount: 64 },
            { typeId: 'minecraft:charcoal', amount: 32 },
            { typeId: 'minecraft:coal', amount: 32 }
        ],
        point: 25000
    },
    26: {
        item: [
            { typeId: 'minecraft:raw_copper_block', amount: 32 },
            { typeId: 'minecraft:coal_block', amount: 16 },
            { typeId: 'minecraft:andesite', amount: 64 }
        ],
        point: 6000
    },
    27: {
        item: [
            { typeId: 'minecraft:raw_copper_block', amount: 128 },
            { typeId: 'minecraft:coal_block', amount: 64 },
            { typeId: 'minecraft:raw_iron_block', amount: 32 },
            { typeId: 'minecraft:smooth_stone', amount: 64 },
        ],
        point: 6000
    },
    28: {
        item: [
            { typeId: 'minecraft:coal_block', amount: 64 },
            { typeId: 'minecraft:raw_iron_block', amount: 64 },
            { typeId: 'minecraft:apple', amount: 64 },
        ],
        point: 6000
    },
    29: {
        item: [
            { typeId: 'minecraft:sand', amount: 128 },
            { typeId: 'minecraft:stone', amount: 128 },
            { typeId: 'minecraft:gravel', amount: 128 },
        ],
        point: 6000
    },
    30: {
        item: [
            { typeId: 'minecraft:acacia_log', amount: 64 },
            { typeId: 'minecraft:birch_log', amount: 64 },
            { typeId: 'minecraft:cherry_log', amount: 64 },
            { typeId: 'minecraft:dark_oak_log', amount: 64 },
            { typeId: 'minecraft:jungle_log', amount: 64 },
        ],
        point: 30000
    },
    31: {
        item: [
            { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
            { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
            { typeId: 'minecraft:carrot', amount: 64 * 4 },
        ],
        point: 7000
    },
    32: {
        item: [
            { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
            { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
            { typeId: 'minecraft:potato', amount: 64 * 4 },
        ],
        point: 7000
    },
    33: {
        item: [
            { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
            { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
            { typeId: 'minecraft:bone', amount: 64 * 2 },
        ],
        point: 7000
    },
    34: {
        item: [
            { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
            { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
            { typeId: 'minecraft:fermented_spider_eye', amount: 64 * 2 },
        ],
        point: 7000
    },
    35: {
        item: [
            { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
            { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
            { typeId: 'minecraft:gunpowder', amount: 64 * 2 },
            { typeId: 'minecraft:allium', amount: 32 },
            { typeId: 'minecraft:poppy', amount: 32 },
            { typeId: 'minecraft:dandelion', amount: 32 },
        ],
        point: 35000
    },
    36: {
        item: [
            { typeId: 'minecraft:cherry_sapling', amount: 64 * 4 },
            { typeId: 'minecraft:white_wool', amount: 64 },
            { typeId: 'minecraft:beef', amount: 64 * 2 },
        ],
        point: 8000
    },
    37: {
        item: [
            { typeId: 'minecraft:dark_oak_sapling', amount: 64 * 4 },
            { typeId: 'minecraft:orange_wool', amount: 64 },
            { typeId: 'minecraft:porkchop', amount: 64 * 2 },
        ],
        point: 8000
    },
    38: {
        item: [
            { typeId: 'minecraft:spruce_sapling', amount: 64 * 4 },
            { typeId: 'minecraft:cyan_wool', amount: 64 },
            { typeId: 'minecraft:string', amount: 64 * 2 },
        ],
        point: 8000
    },
    39: {
        item: [
            { typeId: 'minecraft:pale_oak_sapling', amount: 64 * 4 },
            { typeId: 'minecraft:lime_wool', amount: 64 },
            { typeId: 'minecraft:black_dye', amount: 64 * 2 },
        ],
        point: 8000
    },
    40: {
        item: [
            { typeId: 'minecraft:apple', amount: 64 },
            { typeId: 'minecraft:lime_stained_glass', amount: 128 },
            { typeId: 'minecraft:amethyst_shard', amount: 128 },
            { typeId: 'minecraft:tall_grass', amount: 64 * 3 },
            { typeId: 'minecraft:glow_ink_sac', amount: 64 },
        ],
        point: 40000
    },
}
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
        case `karo:deleteplayerdata`: {
            const playerDataBase = new DynamicProperties('player');
            const playerDataRaw = playerDataBase.get(`player_${message}`);
            sourceEntity.sendMessage(`delete: ${playerDataRaw}`);
            playerDataBase.delete(`player_${message}`);
            console.log(playerDataRaw);
            break;
        };
        case `karo:searthplayerdata`: {
            const playerDataBase = new DynamicProperties('player');
            let resultData = [];
            for (const id of playerDataBase.idList) {
                const dataraw = playerDataBase.get(id);
                if (dataraw) {
                    const data = JSON.parse(dataraw);
                    if (data.name == message) {
                        resultData.push({ id: id, data: data });
                        const entity = world.getEntity(data.id);
                        if (entity) {
                            const lv = entity.getDynamicProperty('miner_level');
                            resultData.push(`miner: ${lv}Lv`)
                        };
                    };
                };
            };
            sourceEntity.sendMessage(`${JSON.stringify(resultData)}`);
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
        case 'karo:resetplot': {
            resetPlotData();
            break;
        };
        case 'karo:forcepeace': {
            const countryDB = new DynamicProperties('country');
            const idList = countryDB.idList;
            for (const id of idList) {
                const rawCountryData = countryDB.get(id);
                if (!rawCountryData) continue;
                const countryData = JSON.parse(rawCountryData);
                countryData.peace = true;
                countryData.peaceChangeCooltime = 0;
                countryDB.set(id, JSON.stringify(countryData));
            };
            break;
        };
        case 'karo:lvreset': {
            const countryDB = new DynamicProperties('country');
            const idList = countryDB.idList;
            for (const id of idList) {
                const rawCountryData = countryDB.get(id);
                if (!rawCountryData) continue;
                const countryData = JSON.parse(rawCountryData);
                const lv = countryData?.lv ?? 0;
                for (let i = 1; i <= lv; i++) {
                    const need = needs[i];
                    if (!need) continue;

                    // リソースポイント加算（数値保証）
                    countryData.resourcePoint =
                        Number(countryData.resourcePoint ?? 0) + Number(need.point ?? 0);

                    if (!Array.isArray(need.item)) continue;

                    for (const itemId of need.item) {
                        if (!itemId?.typeId || !itemId?.amount) continue;

                        const base = new ItemStack(itemId.typeId);
                        const max = base.maxAmount;

                        let remain = Number(itemId.amount);

                        while (remain > 0) {
                            const give = Math.min(max, remain);
                            const item = new ItemStack(itemId.typeId, give);
                            addCompeByItemStack(countryData.owner, item, false);
                            remain -= give;
                        }
                    }
                }

                countryData.lv = 0;
                countryDB.set(id, JSON.stringify(countryData));
            };
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