import { world } from "@minecraft/server";
import * as DyProp from "./DyProp";
import { GetAndParsePropertyData } from "./util";
import config from "../config";
import { DynamicProperties } from "../api/dyp";
import { FishManager } from "../api/fishing/fishing";

world.afterEvents.entityLoad.subscribe((ev) => {
    if (ev.entity.typeId != "mc:text") return;
    updateRanking();
});

export function updateRanking() {
    const texts = world.getDimension(`overworld`).getEntities({ type: `mc:text` });
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const players = playerDataBase.idList.map(key => GetAndParsePropertyData(key)).filter(p => p?.name && !isNaN(parseInt(p?.money)));
    const countries = countryDataBase.idList.map(key => GetAndParsePropertyData(key));
    const fishManager = new FishManager();
    for (const text of texts) {
        const tag = text.getTags().find(t => t.startsWith("text:fish_size_"));
        if (!tag) break;

        const fishTypeId = tag.substring("text:fish_size_".length);
        switch (true) {
            case text.hasTag(`text:baltop`): {
                let allMoney = 0;
                for (const data of players) {
                    allMoney += parseInt(data.money);
                };
                const top20Players = players
                    .filter(player => !player?.moneyPrivate) // moneyPrivateがfalse
                    .sort((a, b) => b.money - a.money) // moneyで降順ソート
                    .slice(0, 20); // 上位20件を取得
                let rankText = `§6Money Ranking TOP20\n§fTotal in server: ${allMoney}${config.MoneyName}§6`;
                for (const playerIndex in top20Players) {
                    const player = top20Players[parseInt(playerIndex)];
                    rankText += `\n§6${parseInt(playerIndex) + 1}. ${player.name}: ${parseInt(player.money)}${config.MoneyName}`
                };
                text.nameTag = rankText;
                break;
            };
            case text.hasTag(`text:chunk`): {
                let allChunks = 0;
                for (const data of countries) {
                    allChunks += parseInt(data?.territories?.length ?? 0);
                };
                const top20countries = countries
                    //.filter(country => !country?.moneyPrivate) // moneyPrivateがfalse
                    .sort((a, b) => b?.territories?.length - a?.territories?.length) // moneyで降順ソート
                    .slice(0, 20); // 上位20件を取得
                let rankText = `§6Territory Ranking TOP20\n§fTotal in server: ${allChunks} Chunks§6`;
                for (const countryIndex in top20countries) {
                    const country = top20countries[parseInt(countryIndex)];
                    rankText += `\n§6${parseInt(countryIndex) + 1}. ${country.name}: §r§f${parseInt(country?.territories?.length ?? 0)}`
                };
                text.nameTag = rankText;
                break;
            };
            case text.hasTag(`text:member`): {
                let allMembers = 0;
                for (const data of countries) {
                    allMembers += parseInt(data?.members?.length ?? 0);
                };
                const top20countries = countries
                    //.filter(country => !country?.moneyPrivate) // moneyPrivateがfalse
                    .sort((a, b) => b?.members?.length - a?.members?.length) // moneyで降順ソート
                    .slice(0, 20); // 上位20件を取得
                let rankText = `§6Members Ranking TOP20\n§fTotal in server: ${allMembers} Members§6`;
                for (const countryIndex in top20countries) {
                    const country = top20countries[parseInt(countryIndex)];
                    rankText += `\n§6${parseInt(countryIndex) + 1}. ${country.name}: §r§f${parseInt(country?.members?.length ?? 0)}`
                };
                text.nameTag = rankText;
                break;
            };
            case tag.startsWith('text:fish_size_'): {
                const fishTypeId = tag.substring("text:fish_size_".length);

                const rank = fishManager.getServerFishRanking(fishTypeId);

                let rankText = `§6${fishTypeId.split(':')[1]} Size Ranking TOP${rank.top.length}\n`;
                for (let i = 0; i < rank.top.length; i++) {
                    const r = rank.top[i];

                    const pRaw = playerDataBase.get(`player_${r.playerId}`);
                    const p = pRaw ? JSON.parse(pRaw) : { name: r.playerId };

                    rankText += `\n§e${i + 1}. §f${p.name} - ${r.size}cm`;
                }

                text.nameTag = rankText;
                break;
            }
        };

    };
};