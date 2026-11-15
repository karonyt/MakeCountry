import { hasHunterHudLease } from "@/shared/integration/standalone.js";
import { system, world } from "@minecraft/server";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId, getTimeBefore, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import * as DyProp from "@/shared/storage/chunked-dynamic-properties.js";
import config from "@/config/server.js";
import { DeleteCountry } from "@/domain/country/land-service.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { collectFederationTaxes, normalizeFederationData } from "@/domain/country/relationships/federation.js";
import { isCoreReady } from "@/shared/integration/standalone.js";
import { recoverStorageBatch } from "@/shared/storage/recoverable-batch.js";

let taxTimerString: any

const nowCountryId = new Map();
const nowChunkPlotName = new Map();

function resolveTaxSetting(playerData: any, countryData: any, roleDataBase: any) {
    const fallback = {
        taxInstitutionIsPer: Boolean(countryData?.taxInstitutionIsPer),
        taxPer: Math.max(0, Number(countryData?.taxPer ?? 0) || 0)
    };
    const countryRoleIds = Array.isArray(countryData?.roles) ? countryData.roles : [];
    const playerRoleIds = new Set(playerData?.roles ?? []);

    for (const roleId of countryRoleIds) {
        if (!playerRoleIds.has(roleId)) continue;
        const rawRoleData = roleDataBase.get(`role_${roleId}`);
        if (!rawRoleData) continue;
        const roleData = JSON.parse(rawRoleData);
        const roleTax = roleData?.taxOverride;
        if (!roleTax?.enabled) continue;
        return {
            taxInstitutionIsPer: Boolean(roleTax.taxInstitutionIsPer),
            taxPer: Math.max(0, Number(roleTax.taxPer ?? 0) || 0)
        };
    }

    return fallback;
}

function calculateTaxAmount(playerMoney: any, taxSetting: any) {
    if (playerMoney < 0) return 0;
    const taxPer = Math.max(0, Number(taxSetting.taxPer ?? 0) || 0);
    if (taxSetting.taxInstitutionIsPer) {
        return playerMoney * (taxPer / 100);
    }
    return Math.min(playerMoney, taxPer);
}

function addTaxTreasuryBudgetLog(countryData: any, amount: any) {
    countryData.treasuryBudgetLog ||= [];

    if (countryData.treasuryBudgetLog.length > 50) {
        countryData.treasuryBudgetLog.shift();
    }

    countryData.treasuryBudgetLog.push({
        timestamp: Date.now(),
        actor: 'SYSTEM',
        action: 'add',
        amount: amount,
        reason: 'TAX'
    });
}

world.afterEvents.worldLoad.subscribe(() => {
    taxTimerString = world.getDynamicProperty(`taxTimer`) ?? `${config.taxTimer}`;
    world.setDynamicProperty(`taxTimer`, taxTimerString);
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        if (!world.getDynamicProperty(`start2`)) return;
        // 領土表示は karoearth-core が担う。Core が応答している間はここで
        // 動的プロパティを読まない (1 人あたり最大 3 回の読込が消える)。
        // Core が落ちている間だけ、この従来処理が受け持つ。
        if (isCoreReady()) return;
        for (const p of world.getPlayers()) {
            if(hasHunterHudLease(p)) continue;
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
                    const federationData = normalizeFederationData(nowChunkCountryData);
                    const federationSubtitle = federationData.name && federationData.settings?.showOnTerritoryEnter
                        ? `§9${federationData.name}§r\n`
                        : ``;
                    p.onScreenDisplay.setTitle({ translate: nowChunkCountryData.name });
                    p.onScreenDisplay.updateSubtitle(`${federationSubtitle}${nowChunkCountryData.lore ?? ``}`);
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
        if (!config.taxValidity) return; // 徴税が有効でないなら先に進まない
        if (!world.getDynamicProperty(`start2`)) return;
        if (config.taxTypeIsTimeSet) { // 徴税の時間を設定しているなら
            const zikan = new Date();
            const hour = zikan.getHours();
            const min = zikan.getMinutes();
            const msgTime = getTimeBefore(config.taxTime, config.taxMessageBeforeTime);
            if (hour == msgTime.hour && min == msgTime.min) { // 時間になったら「税回収&維持費徴収まで残り10分です」を送信する
                world.sendMessage({
                    rawtext: [
                        { text: `§a[MakeCountry]\n§r` },
                        { translate: `tax.before.message0`, with: [`${config.MaintenanceFeePacifistCountries}`, `${config.MaintenanceFeeNonPeacefulCountries}`] }
                    ]
                });
            };
            // 徴税の時間になった時に徴税を開始する
            if (hour == config.taxTime.hour && min == config.taxTime.min) {
                tax();
            };
        } else { // 時間を設定していなければタイマーを使用する
            let taxTimer = Number(taxTimerString) - 1;
            world.setDynamicProperty(`taxTimer`, `${taxTimer}`);
            taxTimerString = `${taxTimer}`;
            if (taxTimer == config.taxMessageBeforeTime) { // 時間になったら「税回収&維持費徴収まで残り ～～ 分です」の細かい版を送信する
                world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n§r` }, { translate: `tax.before.message1`, with: [`${config.taxMessageBeforeTime}`] }, { text: `\n` }, { translate: `tax.before.message2`, with: [`${config.NonMaintenanceCostAccrualPeriod}`] }, { text: `\n` }, { translate: `tax.before.message3`, with: [`${config.MaintenanceFeePacifistCountries}`] }, { text: `\n` }, { translate: `tax.before.message4`, with: [`${config.MaintenanceFeeNonPeacefulCountries}`] }, { text: `\n` }, { translate: `tax.before.message5` }] });
                return;
            };
            if (taxTimer <= 0) { // タイマーが0以下になった場合、タイマーを更新し徴税を開始する
                world.setDynamicProperty(`taxTimer`, `${config.taxTimer}`);
                taxTimerString = `${config.taxTimer}`;
                tax();
            };
        };
    }, 20 * 60);
})

// 全ての国に対して徴税を行う関数
export function tax() {
    if (!recoverStorageBatch()) return;
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const roleDataBase = new DynamicProperties('role');
    // 徴税の通知をワールドに送信する
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `tax.time` }] });

    for (const pId of playerDataBase.idList) {
        const rawData = playerDataBase.get(pId);
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
        const playerData = JSON.parse(rawData);
        playerData.days += 1;
        playerDataBase.set(pId, JSON.stringify(playerData));
        if (!playerData.country) continue;
        const rawCountryData = countryDataBase.get(`country_${playerData.country}`);
        if (!rawCountryData) continue;
        const countryData = JSON.parse(rawCountryData);
        if (!countryData) continue;
        const taxSetting = resolveTaxSetting(playerData, countryData, roleDataBase);
        const taxAmount = calculateTaxAmount(playerData.money, taxSetting);
        if (taxAmount == 0) continue;
        playerData.money -= taxAmount;
        countryData.money += taxAmount;
        addTaxTreasuryBudgetLog(countryData, taxAmount);
        playerDataBase.set(pId, JSON.stringify(playerData));
        countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData))
    };
    let deleteCount = 0;
    for (const cId of countryDataBase.idList) {
        const rawCountryData = countryDataBase.get(cId);
        // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
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
            let upkeepCosts = config.MaintenanceFeeNonPeacefulCountries * countryData.territories.length; // 非平和主義の1チャンクあたりのコスト × その国の持つ総チャンク数 で払う維持費を計算する
            if (countryData?.peace) upkeepCosts = config.MaintenanceFeePacifistCountries * countryData.territories.length; // 平和主義の場合はそのコストにして維持費を計算する
            if (typeof countryData?.money == "number") {
                // 国家予算よりも維持費が大きかった場合
                if (countryData.money < upkeepCosts) {
                    countryData.money = 0; // 国家予算を0にする
                    countryDataBase.set(`country_${countryData.id}`, JSON.stringify(countryData));
                    system.runTimeout(() => { // その国を削除する
                        DeleteCountry(countryData.id);
                    }, deleteCount);
                    deleteCount++;
                    continue;
                };
                // 国家予算で払える範囲なら、国家予算から維持費を引く
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
    collectFederationTaxes(countryDataBase);
    // A failed/partial collection must never unlock pending land transfers.
    world.setDynamicProperty("karo:land-transfer:last-tax", Date.now());
};

world.afterEvents.worldLoad.subscribe(() => {
    if (!config.getMoneyByScoreboard) return;
    if (!world.scoreboard.getObjective(config.moneyScoreboardName)) world.scoreboard.addObjective(config.moneyScoreboardName)
    system.runInterval(() => {
        for (const player of world.getPlayers()) {
            const playerDataBase = new DynamicProperties('player');
            // @ts-ignore TS(2304): Cannot find name 'sender'.
            const rawData = playerDataBase.get(`player_${sender.id}`);
            // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
            const playerData = JSON.parse(rawData);
            player.runCommand(`scoreboard players set money ${Math.floor(playerData.money)}`);
        };
    });
});
