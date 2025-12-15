import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { GenerateChunkData } from "../../lib/land";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId, isNumber, StringifyAndSavePropertyData } from "../../lib/util";
import config from "../../config";
import { country } from "../api";

/**
 * 
 * @param {CustomCommandOrigin} origin 
 * @param {Array} args 
 * @returns 
 */
function buyChunkExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const chunkDataBase = new DynamicProperties("chunk");
    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");

    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);

    if (!playerData?.country) {
        sender.sendMessage({ translate: `command.buychunk.error.notjoin.country` });
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
        if (chunks.length > 300) {
            sender.sendMessage({ translate: 'command.error.chunks.limit.buy', with: ['300'] });
            return;
        };
        let chunkPrice = config.defaultChunkPrice;
        for (let i = 0; i < chunks.length; i++) {
            system.runTimeout(() => {
                let chunkData = GetAndParsePropertyData(`chunk_${chunks[i].chunkX}_${chunks[i].chunkZ}_${dimension.replace(`minecraft:`, ``)}`, chunkDataBase);
                if (!chunkData) chunkData = GenerateChunkData(chunks[i].chunkX * 16, chunks[i].chunkZ * 16, dimension);
                if (chunkData && chunkData.price) chunkPrice = chunkData.price;
                const cannotBuy = CheckPermission(sender, `buyChunk`);
                if (cannotBuy) {
                    sender.sendMessage({ translate: `command.permission.error` });
                    return;
                };
                if (!chunkData) {
                    sender.sendMessage({ translate: `command.buychunk.error.thischunk.wilderness`, with: { rawtext: [{ translate: `wilderness.name` }] } });
                    return;
                };
                if (chunkData.special) {
                    sender.sendMessage({ translate: `command.buychunk.error.thischunk.special`, with: { rawtext: [{ translate: `special.name` }] } });
                    return;
                };
                if (chunkData.owner) {
                    const ownerData = GetAndParsePropertyData(`player_${chunkData.owner}`, playerDataBase);
                    sender.sendMessage({ translate: `command.buychunk.error.thischunk.hasowner`, with: [ownerData.name] });
                    return;
                };
                if (chunkData.countryId) {
                    if (chunkData.countryId === playerData.country) {
                        sender.sendMessage({ translate: `command.buychunk.error.thischunk.yourcountry` });
                        return;
                    };
                    sender.sendMessage({ translate: `command.buychunk.error.thischunk.othercountry`, with: { rawtext: [{ translate: `${chunkData.countryId}` }] } });
                    return;
                };
                if (chunkData?.countryId) {
                    if (chunkData.countryId === playerData.country) {
                        sender.sendMessage({ translate: `command.buychunk.error.thischunk.yourcountry` });
                        return;
                    };
                    sender.sendMessage({ translate: `command.buychunk.error.thischunk.othercountry`, with: { rawtext: [{ translate: `${chunkData.countryId}` }] } });
                    return;
                };
                const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
                const limit = config.chunkLimit || 3200;
                if (playerCountryData?.territories.length >= limit) {
                    sender.sendMessage({ translate: 'chunk.limit', with: [`${limit}`] });
                    return;
                };
                const eventData = {
                    player: sender,
                    cancel: false,
                    type: 'player',
                    territoryCount: playerCountryData.territories.length,
                    countryName: playerCountryData.name
                };
                const isCanceled = country.beforeEvents.chunkbuy.emit(eventData);
                if (isCanceled) return;
                eventData.cancel = undefined;
                country.afterEvents.chunkbuy.emit(eventData);
                if (playerCountryData.resourcePoint < chunkPrice) {
                    sender.sendMessage({ translate: `command.buychunk.error.not.enough.money`, with: [`${chunkPrice}`] });
                    return;
                };

                chunkData.countryId = playerData.country;
                playerCountryData.resourcePoint -= chunkPrice;
                playerCountryData.territories.push(chunkData.id);
                StringifyAndSavePropertyData(chunkData.id, chunkData, chunkDataBase);
                StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData, countryDataBase);
                sender.sendMessage({ translate: `command.buychunk.result`, with: [`${playerCountryData.resourcePoint}`] });
                return;
            }, i);
        };
        return;
    };
    let chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(sender), chunkDataBase);
    const { x, z } = sender.location;
    if (!chunkData) chunkData = GenerateChunkData(x, z, dimension);
    let chunkPrice = config.defaultChunkPrice;
    if (chunkData && chunkData.price) chunkPrice = chunkData.price;
    const cannotBuy = CheckPermission(sender, `buyChunk`);
    if (cannotBuy) {
        sender.sendMessage({ translate: `command.permission.error` });
        return;
    };
    if (!chunkData) {
        sender.sendMessage({ translate: `command.buychunk.error.thischunk.wilderness`, with: { rawtext: [{ translate: `wilderness.name` }] } });
        return;
    };
    if (chunkData.special) {
        sender.sendMessage({ translate: `command.buychunk.error.thischunk.special`, with: { rawtext: [{ translate: `special.name` }] } });
        return;
    };
    if (chunkData.owner) {
        const ownerData = GetAndParsePropertyData(`player_${chunkData.owner}`, playerDataBase);
        sender.sendMessage({ translate: `command.buychunk.error.thischunk.hasowner`, with: [ownerData.name] });
        return;
    };
    if (chunkData.countryId) {
        if (chunkData.countryId === playerData.country) {
            sender.sendMessage({ translate: `command.buychunk.error.thischunk.yourcountry` });
            return;
        };
        sender.sendMessage({ translate: `command.buychunk.error.thischunk.othercountry`, with: { rawtext: [{ translate: `${chunkData.countryId}` }] } });
        return;
    };
    if (chunkData?.countryId) {
        if (chunkData.countryId === playerData.country) {
            sender.sendMessage({ translate: `command.buychunk.error.thischunk.yourcountry` });
            return;
        };
        sender.sendMessage({ translate: `command.buychunk.error.thischunk.othercountry`, with: { rawtext: [{ translate: `${chunkData.countryId}` }] } });
        return;
    };
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
    const limit = config.chunkLimit || 3200;
    if (playerCountryData?.territories.length >= limit) {
        sender.sendMessage({ translate: 'chunk.limit', with: [`${limit}`] });
        return;
    };
    const eventData = {
        player: sender,
        cancel: false,
        type: 'player',
        territoryCount: playerCountryData.territories.length,
        countryName: playerCountryData.name
    };
    const isCanceled = country.beforeEvents.chunkbuy.emit(eventData);
    if (isCanceled) return;
    eventData.cancel = undefined;
    country.afterEvents.chunkbuy.emit(eventData);
    if (playerCountryData.resourcePoint < chunkPrice) {
        sender.sendMessage({ translate: `command.buychunk.error.not.enough.money`, with: [`${chunkPrice}`] });
        return;
    };

    chunkData.countryId = playerData.country;
    playerCountryData.resourcePoint -= chunkPrice;
    playerCountryData.territories.push(chunkData.id);
    StringifyAndSavePropertyData(chunkData.id, chunkData, chunkDataBase);
    StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData, countryDataBase);
    sender.sendMessage({ translate: `command.buychunk.result`, with: [`${playerCountryData.resourcePoint}`] });
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:buychunk',
            description: 'command.help.buychunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                buyChunkExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:buyc',
            description: 'command.help.buychunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                buyChunkExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:getland',
            description: 'command.help.buychunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                buyChunkExecuter(origin, args);
            });
        })
    );
});

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
            if (chunks.length > 301) return chunks;
            chunks.push({ chunkX: cx, chunkZ: cz });
        }
    }
    return chunks;
}