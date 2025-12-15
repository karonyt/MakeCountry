import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId, isNumber, StringifyAndSavePropertyData } from "../../lib/util";
import config from "../../config";
import { GenerateChunkData } from "../../lib/land";
import { country } from "../api";

function sellChunkExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const chunkDataBase = new DynamicProperties("chunk");
    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");

    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);

    if (!playerData.country) {
        sender.sendMessage({ translate: `command.sellchunk.error.notjoin.country` });
        return;
    };
    const dimension = sender.dimension.id;
    if (args.length == 2) {
        const [ix, iz] = args.map(str => Math.floor(Number(str)));
        const { x, z } = sender.location;
        const chunks = getChunksInRange(Math.floor(x), Math.floor(z), ix, iz);
        if (!isNumber(ix) || !isNumber(iz)) {
            sender.sendMessage({ translate: 'command.error.coordinates.incorrect' });
            return;
        };
        if (chunks.length > 100) {
            sender.sendMessage({ translate: 'command.error.chunks.limit.sell', with: ['100'] });
            return;
        };
        let chunkPrice = config.defaultChunkPrice / 2;
        for (let i = 0; i < chunks.length; i++) {
            system.runTimeout(() => {
                let chunkData = GetAndParsePropertyData(`chunk_${chunks[i].chunkX}_${chunks[i].chunkZ}_${dimension.replace(`minecraft:`, ``)}`, chunkDataBase);
                if (!chunkData) chunkData = GenerateChunkData(chunks[i].chunkX * 16, chunks[i].chunkZ * 16, dimension);
                if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
                const cannotSell = CheckPermission(sender, `sellChunk`);
                if (!chunkData || !chunkData.countryId) {
                    sender.sendMessage({ translate: `command.sellchunk.error.thischunk.notterritory` });
                    return;
                };
                if (chunkData && chunkData.countryId && chunkData.countryId != playerData.country) {
                    sender.sendMessage({ translate: `command.sellchunk.error.thischunk.notterritory` });
                    return;
                };
                if (cannotSell) {
                    sender.sendMessage({ translate: `command.permission.error` });
                    return;
                };
                const cores = sender.dimension.getEntities({ type: `mc:core` });
                let coresChunks = [];
                for (let i = 0; i < cores.length; i++) {
                    coresChunks[coresChunks.length] = GetPlayerChunkPropertyId(cores[i]);
                };
                if (coresChunks.includes(GetPlayerChunkPropertyId(sender))) {
                    sender.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.already` }] });
                    return;
                };
                const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
                if (playerCountryData.territories.length < 2) {
                    sender.sendMessage({ translate: `command.sellchunk.error.morechunk`, with: [`${chunkPrice}`] });
                    return;
                };

                chunkData.countryId = undefined;
                playerCountryData.resourcePoint += chunkPrice;
                playerCountryData.territories.splice(playerCountryData.territories.indexOf(chunkData.id), 1);
                StringifyAndSavePropertyData(chunkData.id, chunkData, chunkDataBase);
                StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData, countryDataBase);
                sender.sendMessage({ translate: `command.sellchunk.result`, with: [`${playerCountryData.resourcePoint}`] });
                return;
            }, i)
        }
        return;
    }
    const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(sender));
    let chunkPrice = config.defaultChunkPrice / 2;
    if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
    const cannotSell = CheckPermission(sender, `sellChunk`);
    if (!chunkData || !chunkData.countryId) {
        sender.sendMessage({ translate: `command.sellchunk.error.thischunk.notterritory` });
        return;
    };
    if (chunkData && chunkData.countryId && chunkData.countryId != playerData.country) {
        sender.sendMessage({ translate: `command.sellchunk.error.thischunk.notterritory` });
        return;
    };
    if (cannotSell) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };
    const cores = sender.dimension.getEntities({ type: `mc:core` });
    let coresChunks = [];
    for (let i = 0; i < cores.length; i++) {
        coresChunks[coresChunks.length] = GetPlayerChunkPropertyId(cores[i]);
    };
    if (coresChunks.includes(GetPlayerChunkPropertyId(sender))) {
        sender.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.already` }] });
        return;
    };
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
    if (playerCountryData.territories.length < 2) {
        sender.sendMessage({ translate: `command.sellchunk.error.morechunk`, with: [`${chunkPrice}`] });
        return;
    };

    chunkData.countryId = undefined;
    playerCountryData.resourcePoint += chunkPrice;
    playerCountryData.territories.splice(playerCountryData.territories.indexOf(chunkData.id), 1);
    StringifyAndSavePropertyData(chunkData.id, chunkData, chunkDataBase);
    StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData, countryDataBase);
    sender.sendMessage({ translate: `command.sellchunk.result`, with: [`${playerCountryData.resourcePoint}`] });
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sellchunk',
            description: 'command.help.sellchunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                sellChunkExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sellc',
            description: 'command.help.sellchunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                sellChunkExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:releaseland',
            description: 'command.help.sellchunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                sellChunkExecuter(origin, args);
            })
        })
    )
})

/**
 * 
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns {Array<{chunkX: number,chunkZ: number}>}
 * @returns 
 */
function getChunksInRange(x1, z1, x2, z2) {
    // 小さい座標を開始点にする
    let startX = Math.floor(Math.min(x1, x2) / 16);
    let endX = Math.floor(Math.max(x1, x2) / 16);
    let startZ = Math.floor(Math.min(z1, z2) / 16);
    let endZ = Math.floor(Math.max(z1, z2) / 16);

    let chunks = [];

    // 範囲内のすべてのチャンク座標を取得
    for (let cx = startX; cx <= endX; cx++) {
        for (let cz = startZ; cz <= endZ; cz++) {
            if (chunks.length > 101) return chunks;
            chunks.push({ chunkX: cx, chunkZ: cz });
        }
    }
    return chunks;
}