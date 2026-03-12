import { world } from "@minecraft/server";
import * as DyProp from "./DyProp.js";
import { GetAndParsePropertyData } from "./util.js";
import config from "../config.js";
import { DynamicProperties } from "../api/dyp.js";
import { FishManager } from "../api/fishing/fishing.js";

world.afterEvents.entityLoad.subscribe((ev) => {
    if (ev.entity.typeId != "mc:text") return;
    updateRanking();
});

export function updateRanking() {
    const texts = world.getDimension(`overworld`).getEntities({ type: `mc:text` });
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const playTimeDB = new DynamicProperties('playtime');
    const players = playerDataBase.idList.map((key: any) => GetAndParsePropertyData(key)).filter((p: any) => p?.name && !isNaN(parseInt(p?.money)));
    const countries = countryDataBase.idList.map((key: any) => GetAndParsePropertyData(key));
    const fishManager = new FishManager();
    const loginPlayers = JSON.parse(playTimeDB.get('worldLoginPlayers') || '[]');
    for (const text of texts) {
        switch (true) {
            case text.hasTag(`text:baltop`): {
                let allMoney = 0;
                for (const data of players) {
                    allMoney += parseInt(data.money);
                };
                const top20Players = players
                    .filter((player: any) => !player?.moneyPrivate) // moneyPrivateがfalse
                    .sort((a: any, b: any) => b.money - a.money) // moneyで降順ソート
                    .slice(0, 20); // 上位20件を取得
                let rankText = `§6Money Ranking TOP20\n§fTotal in server: ${allMoney}${config.MoneyName}§6`;
                for (const playerIndex in top20Players) {
                    const player = top20Players[parseInt(playerIndex)];
                    rankText += `\n§6${parseInt(playerIndex) + 1}. ${player.name}: ${parseInt(player.money)}${config.MoneyName}`
                };
                text.nameTag = rankText;
                break;
            };
            case text.hasTag(`text:playtime`): {
                const playtimePlayers = players.map((player: any) => {
                    const savedMinutes = Number(JSON.parse(playTimeDB.get(`player_${player.id}_total`) || '0')) || 0;
                    const loginData = loginPlayers.find((p: any) => p.id === player.id);
                    const currentSessionMinutes = loginData
                        ? Math.floor((Date.now() - loginData.loginTime) / 1000 / 60)
                        : 0;
                    return {
                        ...player,
                        totalPlayTimeMinutes: savedMinutes + currentSessionMinutes,
                    };
                });

                const totalMinutes = playtimePlayers.reduce((sum: any, player: any) => sum + (player.totalPlayTimeMinutes || 0), 0);
                const top20Players = playtimePlayers
                    .sort((a: any, b: any) => b.totalPlayTimeMinutes - a.totalPlayTimeMinutes)
                    .slice(0, 20);

                let rankText = `§6PlayTime Ranking TOP20\n§fTotal in server: ${formatMinutes(totalMinutes)}§6`;
                for (const playerIndex in top20Players) {
                    const player = top20Players[parseInt(playerIndex)];
                    rankText += `\n§6${parseInt(playerIndex) + 1}. ${player.name}: ${formatMinutes(player.totalPlayTimeMinutes)}`;
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
                    .sort((a: any, b: any) => b?.territories?.length - a?.territories?.length) // moneyで降順ソート
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
                    .sort((a: any, b: any) => b?.members?.length - a?.members?.length) // moneyで降順ソート
                    .slice(0, 20); // 上位20件を取得
                let rankText = `§6Members Ranking TOP20\n§fTotal in server: ${allMembers} Members§6`;
                for (const countryIndex in top20countries) {
                    const country = top20countries[parseInt(countryIndex)];
                    rankText += `\n§6${parseInt(countryIndex) + 1}. ${country.name}: §r§f${parseInt(country?.members?.length ?? 0)}`
                };
                text.nameTag = rankText;
                break;
            };
            default: {
                const tag = text.getTags().find(t => t.startsWith("text:fish_size_"));
                if (!tag) break;

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

function formatMinutes(min: any) {
    const hours = Math.floor(min / 60);
    const minutes = min % 60;
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
}
