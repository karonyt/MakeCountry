import { system, world } from "@minecraft/server";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId, getTimeBefore, StringifyAndSavePropertyData } from "./util";
import * as DyProp from "./DyProp";
import config from "../config";
import { DeleteCountry } from "./land";
import { DynamicProperties } from "../api/dyp";

let taxTimerString

const nowCountryId = new Map();
const nowChunkPlotName = new Map();

world.afterEvents.worldLoad.subscribe(() => {
    taxTimerString = world.getDynamicProperty(`taxTimer`) ?? `${config.taxTimer}`;
    world.setDynamicProperty(`taxTimer`, taxTimerString);
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        if (!world.getDynamicProperty(`start2`)) return;
        for (const p of world.getPlayers()) {
            const playerLastInCountryId = nowCountryId.get(p.id) ?? 0;
            const chunkId = GetPlayerChunkPropertyId(p);
            if (playerLastInCountryId == chunkId) {
                if (nowChunkPlotName.has(p.id)) {
                    p.onScreenDisplay.setActionBar(nowChunkPlotName.get(p.id));
                };
                continue;
            };
            const chunkData = GetAndParsePropertyData(chunkId);
            const nowChunkCountryData = GetAndParsePropertyData(`country_${chunkData?.countryId}`) ?? { "id": 0, "name": "wilderness.name", plot: { name: `` } };
            const countryChunkDataId = nowChunkCountryData?.id;
            if (countryChunkDataId !== playerLastInCountryId) {
                if (countryChunkDataId == 0) {
                    p.onScreenDisplay.setActionBar({ translate: `wilderness.name` });
                } else {
                    p.onScreenDisplay.setTitle({ translate: nowChunkCountryData.name });
                    p.onScreenDisplay.updateSubtitle(`${nowChunkCountryData.lore ?? ``}`);
                };
            };
            if (chunkData?.plot) {
                const plot = chunkData?.plot?.group ? GetAndParsePropertyData(`plotgroup_${chunkData?.plot?.group}`) : chunkData?.plot
                if (countryChunkDataId != 0 && plot?.enable) {
                    const plotName = plot?.name ?? ``;
                    switch (plot?.type ?? `public`) {
                        case `public`: {
                            p.onScreenDisplay.setActionBar({ rawtext: [{ text: `§6~§b${plotName} §6[` }, { translate: `plot.${plot?.type ?? `public`}` }, { text: `]` }] });
                            nowChunkPlotName.set(p.id, { rawtext: [{ text: `§6~§e${plotName} §r§7- §6[` }, { translate: `plot.${plot?.type ?? `public`}` }, { text: `]` }] });
                            break;
                        };
                        case `private`: {
                            p.onScreenDisplay.setActionBar({ rawtext: [{ text: `§6~§a${plotName}` }] });
                            nowChunkPlotName.set(p.id, { rawtext: [{ text: `§6~§e${plotName} §r§7- §6[` }, { translate: `plot.${plot?.type ?? `public`}` }, { text: `]` }] });
                            break;
                        };
                        case `embassy`: {
                            p.onScreenDisplay.setActionBar({ rawtext: [{ text: `§6~§e${plotName} §r§7- §6[` }, { translate: `plot.${plot?.type ?? `public`}` }, { text: `]` }] });
                            nowChunkPlotName.set(p.id, { rawtext: [{ text: `§6~§e${plotName} §r§7- §6[` }, { translate: `plot.${plot?.type ?? `public`}` }, { text: `]` }] });
                            break;
                        };
                    };
                    //if(nowChunkPlotName.get(p.id) != plotName && plotName != ``) {
                    //};
                } else {
                    nowChunkPlotName.delete(p.id);
                };
            } else {
                nowChunkPlotName.delete(p.id);
            };
            nowCountryId.set(p.id, countryChunkDataId);
        };
    }, 30);
})

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        if (!config.taxValidity) return;
        if (!world.getDynamicProperty(`start2`)) return;
        if (config.taxTypeIsTimeSet) {
            const zikan = new Date();
            const hour = zikan.getHours();
            const min = zikan.getMinutes();
            const msgTime = getTimeBefore(config.taxTime, config.taxMessageBeforeTime);
            if (hour == msgTime.hour && min == msgTime.min) {
                world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n§r税回収&維持費徴収まで残り10分です\n建国から3日が経過した国は維持費が徴収されます\n平和主義は${config.MaintenanceFeePacifistCountries}$/1チャンク\n非平和主義国は${config.MaintenanceFeeNonPeacefulCountries}$/1チャンク\n維持費は国庫の国家予算から引かれるため予め入金しておいてください` }] });
            };
            if (hour == config.taxTime.hour && min == config.taxTime.min) {
                tax();
            };
        } else {
            let taxTimer = Number(taxTimerString) - 1;
            world.setDynamicProperty(`taxTimer`, `${taxTimer}`);
            taxTimerString = `${taxTimer}`;
            if (taxTimer == config.taxMessageBeforeTime) {
                world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n§r` }, { translate: `tax.before.message1`, with: [`${config.taxMessageBeforeTime}`] }, { text: `\n` }, { translate: `tax.before.message2`, with: [`${config.NonMaintenanceCostAccrualPeriod}`] }, { text: `\n` }, { translate: `tax.before.message3`, with: [`${config.MaintenanceFeePacifistCountries}`] }, { text: `\n` }, { translate: `tax.before.message4`, with: [`${config.MaintenanceFeeNonPeacefulCountries}`] }, { text: `\n` }, { translate: `tax.before.message5` }] });
                return;
            };
            if (taxTimer <= 0) {
                world.setDynamicProperty(`taxTimer`, `${config.taxTimer}`);
                taxTimerString = `${config.taxTimer}`;
                tax();
            };
        };
    }, 20 * 60);
})

export function tax() {
    const playerDataBase = new DynamicProperties('player');
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `tax.time` }] });
    for (const pId of playerDataBase.idList) {
        const rawData = playerDataBase.get(pId);
        const playerData = JSON.parse(rawData);
        playerData.days += 1;
        playerDataBase.set(pId, JSON.stringify(playerData));
        if (!playerData.country) continue;
        const countryDataBase = new DynamicProperties('country');
        const rawCountryData = countryDataBase.get(`country_${playerData.country}`);
        if (!rawCountryData) continue;
        const countryData = JSON.parse(rawCountryData);
        if (!countryData) continue;
        if (countryData?.taxInstitutionIsPer) {
            if (playerData.money < 0) {
                continue;
            }
            let taxValue = playerData.money * (countryData.taxPer / 100);
            if (taxValue == 0) continue;
            playerData.money -= taxValue;
            countryData.money += taxValue;

            countryData.treasuryBudgetLog ||= [];

            if (countryData.treasuryBudgetLog.length > 50) {
                countryData.treasuryBudgetLog.shift();
            }

            countryData.treasuryBudgetLog.push({
                timestamp: Date.now(),
                actor: 'SYSTEM',
                action: 'add',
                amount: taxValue,
                reason: 'TAX'
            });

            playerDataBase.set(pId, JSON.stringify(playerData));
            countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData))
        } else {
            if (playerData.money < countryData.taxPer) {
                if (playerData.money < 0) {
                    continue;
                } else {
                    let addmoney = playerData.money;
                    if (addmoney == 0) continue;

                    playerData.money -= addmoney;
                    countryData.money += addmoney;

                    countryData.treasuryBudgetLog ||= [];

                    if (countryData.treasuryBudgetLog.length > 50) {
                        countryData.treasuryBudgetLog.shift();
                    }

                    countryData.treasuryBudgetLog.push({
                        timestamp: Date.now(),
                        actor: 'SYSTEM',
                        action: 'add',
                        amount: addmoney,
                        reason: 'TAX'
                    });

                };
            } else {
                playerData.money -= countryData.taxPer;
                countryData.money += countryData.taxPer;

                let addmoney = countryData.taxPer;

                if (addmoney == 0) continue;

                countryData.treasuryBudgetLog ||= [];

                if (countryData.treasuryBudgetLog.length > 50) {
                    countryData.treasuryBudgetLog.shift();
                }

                countryData.treasuryBudgetLog.push({
                    timestamp: Date.now(),
                    actor: 'SYSTEM',
                    action: 'add',
                    amount: addmoney,
                    reason: 'TAX'
                });
            };
            playerDataBase.set(pId, JSON.stringify(playerData));
            countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData))
        };
    };
    let deleteCount = 0;
    const countryDataBase = new DynamicProperties('country');
    for (const cId of countryDataBase.idList) {
        const rawCountryData = countryDataBase.get(cId);
        const countryData = JSON.parse(rawCountryData);
        if (0 < countryData?.peaceChangeCooltime) {
            countryData.peaceChangeCooltime -= 1;
        };
        if (!countryData?.days) countryData.days = 0;
        countryData.days += 1;
        if (countryData.days < config.NonMaintenanceCostAccrualPeriod) {
            countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData));
            continue;
        };
        const ownerRawData = playerDataBase.get(`player_${countryData?.owner}`);
        if (ownerRawData) {
            const ownerData = JSON.parse(ownerRawData)
            if (ownerData?.lastLogined) {
                if (Date.now() - ownerData.lastLogined >= config.autoDeleteAfterFinalLogined * 24 * 60 * 60 * 1000) {
                    system.runTimeout(() => {
                        DeleteCountry(countryData.id);
                    }, deleteCount);
                    deleteCount++;
                    continue;
                };
            };
            let upkeepCosts = config.MaintenanceFeeNonPeacefulCountries * countryData.territories.length;
            if (countryData?.peace) upkeepCosts = config.MaintenanceFeePacifistCountries * countryData.territories.length;
            if (typeof countryData?.money == "number") {
                if (countryData.money < upkeepCosts) {
                    countryData.money = 0;
                    countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData));
                    system.runTimeout(() => {
                        DeleteCountry(countryData.id);
                    }, deleteCount);
                    deleteCount++;
                    continue;
                };
                countryData.money -= upkeepCosts;

                if (upkeepCosts != 0) {
                    countryData.treasuryBudgetLog ||= [];

                    if (countryData.treasuryBudgetLog.length > 50) {
                        countryData.treasuryBudgetLog.shift();
                    }

                    countryData.treasuryBudgetLog.push({
                        timestamp: Date.now(),
                        actor: 'SYSTEM',
                        action: 'remove',
                        amount: -upkeepCosts,
                        reason: 'Maintenance Cost'
                    });

                };
            } else {
                countryData.money = 0;
            };
            countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData));
        };
    };
};

world.afterEvents.worldLoad.subscribe(() => {
    if (!config.getMoneyByScoreboard) return;
    if (!world.scoreboard.getObjective(config.moneyScoreboardName)) world.scoreboard.addObjective(config.moneyScoreboardName)
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            const playerDataBase = new DynamicProperties('player');
            const rawData = playerDataBase.get(`player_${sender.id}`);
            const playerData = JSON.parse(rawData);
            player.runCommand(`scoreboard players set money ${Math.floor(playerData.money)}`);
        };
    });
});