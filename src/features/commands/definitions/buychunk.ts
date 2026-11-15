import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { GenerateChunkData } from "@/domain/country/land-service.js";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId, isNumber, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import config from "@/config/server.js";
import { country } from "@/shared/events/make-country-events.js";
import { deniesIncident16, noticeIncident16 } from "@/domain/protection/incident16.js";
import { runWithGateTerritoryCheck, deniesLoadedGateTerritory } from "@/domain/country/gate-territory.js";
import { deniesNewTerritory } from "@/domain/country/territory-rules-gate.js";

/**
 * 
 * @param {CustomCommandOrigin} origin 
 * @param {Array} args 
 * @returns 
 */
function buyChunkExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (!sender.isValid) return;
    if (args.length !== 0 && args.length !== 2) { sender.sendMessage({ translate: "command.error.coordinates.incorrect" }); return; }
    const chunkDataBase = new DynamicProperties("chunk");
    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");
    const playerData = GetAndParsePropertyData(`player_${sender.id}`, playerDataBase);
    if (!playerData?.country) {
        sender.sendMessage({ translate: "command.buychunk.error.notjoin.country" });
        return;
    }
    const dimension = sender.dimension.id;

    function purchaseChunk(id: string, x: number, z: number, checkTerritory: boolean): void {
        if (!sender.isValid || sender.dimension.id !== dimension) return;
        const currentPlayer = GetAndParsePropertyData(`player_${sender.id}`, playerDataBase);
        if (currentPlayer?.country !== playerData.country) return;
        if (deniesIncident16(sender, x, z, dimension, true)) return;
        const rawChunk = chunkDataBase.get(id);
        let chunkData = GetAndParsePropertyData(id, chunkDataBase);
        if (!chunkData) chunkData = GenerateChunkData(x, z, dimension);
        if (CheckPermission(sender, "buyChunk")) {
            sender.sendMessage({ translate: "command.permission.error" });
            return;
        }
        if (!chunkData) return;
        if (chunkData.special) {
            sender.sendMessage({ translate: "command.buychunk.error.thischunk.special", with: { rawtext: [{ translate: "special.name" }] } });
            return;
        }
        if (chunkData.owner) {
            const ownerData = GetAndParsePropertyData(`player_${chunkData.owner}`, playerDataBase);
            sender.sendMessage({ translate: "command.buychunk.error.thischunk.hasowner", with: [ownerData?.name ?? `${chunkData.owner}`] });
            return;
        }
        if (chunkData.countryId) {
            if (chunkData.countryId === playerData.country) sender.sendMessage({ translate: "command.buychunk.error.thischunk.yourcountry" });
            else sender.sendMessage({ translate: "command.buychunk.error.thischunk.othercountry", with: { rawtext: [{ translate: `${chunkData.countryId}` }] } });
            return;
        }
        const countryKey = `country_${playerData.country}`;
        const rawCountry = countryDataBase.get(countryKey);
        const playerCountryData = GetAndParsePropertyData(countryKey, countryDataBase);
        // Keep the established zero-price fallback; reject corrupt prices and
        // balances before arithmetic can create RP or store NaN/null.
        const chunkPrice = chunkData.price || config.defaultChunkPrice;
        if (chunkData.id !== id || !playerCountryData || `${playerCountryData.id}` !== `${playerData.country}`
            || !Array.isArray(playerCountryData.territories) || playerCountryData.territories.includes(id)
            || !Number.isFinite(chunkPrice) || chunkPrice < 0
            || !Number.isFinite(playerCountryData.resourcePoint) || playerCountryData.resourcePoint < 0
            || (chunkPrice > 0 && playerCountryData.resourcePoint - chunkPrice === playerCountryData.resourcePoint)
            || (playerCountryData.resourcePointLog !== undefined && !Array.isArray(playerCountryData.resourcePointLog))) {
            throw new Error("invalid_chunk_purchase_data");
        }
        const limit = config.chunkLimit || 3200;
        if (playerCountryData.territories.length >= limit) {
            sender.sendMessage({ translate: "chunk.limit", with: [`${limit}`] });
            return;
        }
        if (checkTerritory && deniesNewTerritory(sender, [[Math.floor(x / 16), Math.floor(z / 16)]], dimension, playerCountryData)) return;
        if (playerCountryData.resourcePoint < chunkPrice) {
            sender.sendMessage({ translate: "command.buychunk.error.not.enough.money", with: [`${chunkPrice}`] });
            return;
        }
        const eventData = {
            player: sender, cancel: false, type: "player", countryId: playerCountryData.id,
            territoryCount: playerCountryData.territories.length, countryName: playerCountryData.name,
        };
        if (country.beforeEvents.chunkbuy.emit(eventData)) return;
        // A before listener can change membership, protection or saved records.
        // Never charge or overwrite the state that replaced our quote.
        if (!sender.isValid || sender.dimension.id !== dimension
            || GetAndParsePropertyData(`player_${sender.id}`, playerDataBase)?.country !== playerData.country
            || CheckPermission(sender, "buyChunk") || deniesIncident16(sender, x, z, dimension, true)
            || deniesLoadedGateTerritory(sender, [[Math.floor(x / 16), Math.floor(z / 16)]], dimension)
            || chunkDataBase.get(id) !== rawChunk || countryDataBase.get(countryKey) !== rawCountry) return;

        chunkData.countryId = playerData.country;
        playerCountryData.resourcePoint -= chunkPrice;
        playerCountryData.territories.push(id);
        playerCountryData.resourcePointLog ||= [];
        playerCountryData.resourcePointLog.push({ timestamp: Date.now(), actor: sender.name, action: "remove", amount: -chunkPrice, reason: "BUY CHUNK" });
        if (playerCountryData.resourcePointLog.length > 50) playerCountryData.resourcePointLog.splice(0, playerCountryData.resourcePointLog.length - 50);

        // These are two independent records. Restore both exact snapshots if
        // either synchronous save fails, including a failed first/new chunk.
        const attempted: Array<{ database: DynamicProperties; key: string; raw: string | undefined }> = [];
        try {
            attempted.push({ database: chunkDataBase, key: id, raw: rawChunk });
            StringifyAndSavePropertyData(id, chunkData, chunkDataBase);
            attempted.push({ database: countryDataBase, key: countryKey, raw: rawCountry });
            StringifyAndSavePropertyData(countryKey, playerCountryData, countryDataBase);
        } catch (error) {
            const rollbackErrors: unknown[] = [];
            for (const entry of attempted.reverse()) {
                try {
                    if (entry.raw === undefined) entry.database.delete(entry.key);
                    else entry.database.set(entry.key, entry.raw);
                } catch (rollbackError) { rollbackErrors.push(rollbackError); }
            }
            if (rollbackErrors.length) throw Object.assign(new Error("chunk_purchase_rollback_failed"), { errors: [error, ...rollbackErrors] });
            throw error;
        }
        try {
            country.afterEvents.chunkbuy.emit({ ...eventData, cancel: undefined, territoryCount: playerCountryData.territories.length });
        } catch (error) { console.error("[buychunk] Purchase event notification failed", error); }
        if (sender.isValid) {
            try { sender.sendMessage({ translate: "command.buychunk.result", with: [`${playerCountryData.resourcePoint}`] }); } catch { }
        }
    }

    if (args.length === 2) {
        const [ix, iz] = args.map((value: any) => Math.floor(Number(value)));
        if (!Number.isSafeInteger(ix) || !Number.isSafeInteger(iz) || !isNumber(ix) || !isNumber(iz)) {
            sender.sendMessage({ translate: "command.error.coordinates.incorrect" });
            return;
        }
        const { x, z } = sender.location;
        const chunks = getChunksInRange(Math.floor(x), Math.floor(z), ix, iz);
        if (chunks.length > 300) {
            sender.sendMessage({ translate: "command.error.chunks.limit.buy", with: ["300"] });
            return;
        }
        // Check every target before scheduling any purchase, including diagonal
        // and negative-coordinate borders covered by incident 16.
        if (chunks.some(chunk => deniesIncident16(sender, chunk.chunkX * 16, chunk.chunkZ * 16, dimension, true))) {
            noticeIncident16(sender);
            return;
        }
        const rangeCountry = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
        if (!rangeCountry || deniesNewTerritory(sender, chunks.map(c => [c.chunkX, c.chunkZ]), dimension, rangeCountry)) return;
        runWithGateTerritoryCheck(sender, chunks.map(c => [c.chunkX, c.chunkZ]), dimension, () => {
            let rangeFailed = false;
            for (let i = 0; i < chunks.length; i++) {
                system.runTimeout(() => {
                    if (rangeFailed) return;
                    if (!sender.isValid || sender.dimension.id !== dimension) return;
                    const target = chunks[i];
                    if (!target || deniesIncident16(sender, target.chunkX * 16, target.chunkZ * 16, dimension, true)) return;
                    const id = `chunk_${target.chunkX}_${target.chunkZ}_${dimension.replace("minecraft:", "")}`;
                    runWithGateTerritoryCheck(sender, [[target.chunkX, target.chunkZ]], dimension, () => {
                        if (rangeFailed) return;
                        try { purchaseChunk(id, target.chunkX * 16, target.chunkZ * 16, false); }
                        catch (error) { rangeFailed = true; throw error; }
                    });
                }, i);
            }
        });
        return;
    }
    const { x, z } = sender.location;
    if (deniesIncident16(sender, x, z, dimension, true)) {
        noticeIncident16(sender);
        return;
    }
    const id = GetPlayerChunkPropertyId(sender);
    runWithGateTerritoryCheck(sender, [[Math.floor(x / 16), Math.floor(z / 16)]], dimension,
        () => purchaseChunk(id, x, z, true));
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:buychunk',
            description: 'command.help.buychunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
function getChunksInRange(x1: any, z1: any, x2: any, z2: any) {
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
