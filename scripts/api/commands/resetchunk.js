import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId, isNumber, StringifyAndSavePropertyData } from "../../lib/util";
import config from "../../config";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:resetchunk',
            description: 'command.help.resetchunk.message',
            permissionLevel: CommandPermissionLevel.Admin,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const chunkDataBase = new DynamicProperties("chunk");
                const countryDataBase = new DynamicProperties("country");
                if (!sender.hasTag("mc_admin")) {
                    sender.sendMessage({ translate: `command.permission.error` });
                    return;
                };
                const dimension = sender.dimension.id;
                if (args.length == 2) {
                    const [ix, iz] = args.map(str => Math.floor(Number(str)));
                    const { x, z } = this.sender.location;
                    const chunks = getChunksInRange(Math.floor(x), Math.floor(z), ix, iz);
                    if (!isNumber(ix) || !isNumber(iz)) {
                        this.sender.sendMessage({ translate: '§c座標が間違っています' });
                        return;
                    };
                    if (chunks.length > 100) {
                        sender.sendMessage({ translate: '1度にリセット可能なチャンクは100チャンクまでです' });
                        return;
                    };
                    for (let i = 0; i < chunks.length; i++) {
                        system.runTimeout(() => {
                            const chunkId = `chunk_${chunks[i].chunkX}_${chunks[i].chunkZ}_${dimension.replace(`minecraft:`, ``)}`;
                            let chunkData = GetAndParsePropertyData(chunkId, chunkDataBase);
                            if (chunkData) {
                                if (chunkData?.countryId) {
                                    const countryData = GetAndParsePropertyData(`country_${chunkData?.countryId}`, countryDataBase);
                                    if (countryData) {
                                        countryData.territories.splice(countryData.territories.indexOf(chunkId), 1);
                                        let chunkPrice = config.defaultChunkPrice / 2;
                                        if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
                                        countryData.money += chunkPrice;
                                        StringifyAndSavePropertyData(`country_${chunkData?.countryId}`, countryData, countryDataBase);
                                    };
                                };
                            };
                            chunkDataBase.delete(chunkId);
                            sender.sendMessage({ translate: `command.resetchunk.result`, with: { rawtext: [{ translate: `wilderness.name` }] } });
                        }, i)
                    }
                    return;
                }
                const chunkId = GetPlayerChunkPropertyId(sender);
                const chunkData = GetAndParsePropertyData(chunkId, chunkDataBase);
                if (chunkData) {
                    if (chunkData?.countryId) {
                        const countryData = GetAndParsePropertyData(`country_${chunkData?.countryId}`, countryDataBase);
                        if (countryData) {
                            countryData.territories.splice(countryData.territories.indexOf(chunkId), 1);
                            let chunkPrice = config.defaultChunkPrice / 2;
                            if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
                            countryData.money += chunkPrice;
                            StringifyAndSavePropertyData(`country_${chunkData?.countryId}`, countryData, countryDataBase);
                        };
                    };
                };
                chunkDataBase.delete(chunkId);
                sender.sendMessage({ translate: `command.resetchunk.result`, with: { rawtext: [{ translate: `wilderness.name` }] } });
                return;
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:resetc',
            description: 'command.help.resetchunk.message',
            permissionLevel: CommandPermissionLevel.Admin,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const chunkDataBase = new DynamicProperties("chunk");
                const countryDataBase = new DynamicProperties("country");
                if (!sender.hasTag("mc_admin")) {
                    sender.sendMessage({ translate: `command.permission.error` });
                    return;
                };
                const dimension = sender.dimension.id;
                if (args.length == 2) {
                    const [ix, iz] = args.map(str => Math.floor(Number(str)));
                    const { x, z } = this.sender.location;
                    const chunks = getChunksInRange(Math.floor(x), Math.floor(z), ix, iz);
                    if (!isNumber(ix) || !isNumber(iz)) {
                        this.sender.sendMessage({ translate: '§c座標が間違っています' });
                        return;
                    };
                    if (chunks.length > 100) {
                        sender.sendMessage({ translate: '1度にリセット可能なチャンクは100チャンクまでです' });
                        return;
                    };
                    for (let i = 0; i < chunks.length; i++) {
                        system.runTimeout(() => {
                            const chunkId = `chunk_${chunks[i].chunkX}_${chunks[i].chunkZ}_${dimension.replace(`minecraft:`, ``)}`;
                            let chunkData = GetAndParsePropertyData(chunkId, chunkDataBase);
                            if (chunkData) {
                                if (chunkData?.countryId) {
                                    const countryData = GetAndParsePropertyData(`country_${chunkData?.countryId}`, countryDataBase);
                                    if (countryData) {
                                        countryData.territories.splice(countryData.territories.indexOf(chunkId), 1);
                                        let chunkPrice = config.defaultChunkPrice / 2;
                                        if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
                                        countryData.money += chunkPrice;
                                        StringifyAndSavePropertyData(`country_${chunkData?.countryId}`, countryData, countryDataBase);
                                    };
                                };
                            };
                            chunkDataBase.delete(chunkId);
                            sender.sendMessage({ translate: `command.resetchunk.result`, with: { rawtext: [{ translate: `wilderness.name` }] } });
                        }, i)
                    }
                    return;
                }
                const chunkId = GetPlayerChunkPropertyId(sender);
                const chunkData = GetAndParsePropertyData(chunkId, chunkDataBase);
                if (chunkData) {
                    if (chunkData?.countryId) {
                        const countryData = GetAndParsePropertyData(`country_${chunkData?.countryId}`, countryDataBase);
                        if (countryData) {
                            countryData.territories.splice(countryData.territories.indexOf(chunkId), 1);
                            let chunkPrice = config.defaultChunkPrice / 2;
                            if (chunkData && chunkData.price) chunkPrice = chunkData.price / 2;
                            countryData.money += chunkPrice;
                            StringifyAndSavePropertyData(`country_${chunkData?.countryId}`, countryData, countryDataBase);
                        };
                    };
                };
                chunkDataBase.delete(chunkId);
                sender.sendMessage({ translate: `command.resetchunk.result`, with: { rawtext: [{ translate: `wilderness.name` }] } });
                return;
            })
        })
    )
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
            if (chunks.length > 101) return chunks;
            chunks.push({ chunkX: cx, chunkZ: cz });
        }
    }
    return chunks;
}