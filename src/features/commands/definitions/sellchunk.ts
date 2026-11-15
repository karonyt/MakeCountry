import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId, isNumber, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import config from "@/config/server.js";
import { isIncident16Location, noticeIncident16 } from "@/domain/protection/incident16.js";

function sellChunkExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (!sender.isValid) return;
    if (args.length !== 0 && args.length !== 2) { sender.sendMessage({ translate: "command.error.coordinates.incorrect" }); return; }
    const chunkDataBase = new DynamicProperties("chunk");
    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");
    const playerData = GetAndParsePropertyData(`player_${sender.id}`, playerDataBase);
    if (!playerData?.country) {
        sender.sendMessage({ translate: "command.sellchunk.error.notjoin.country" });
        return;
    }
    const dimension = sender.dimension.id;

    function releaseChunk(id: string, x: number, z: number): void {
        if (!sender.isValid || sender.dimension.id !== dimension) return;
        if (GetAndParsePropertyData(`player_${sender.id}`, playerDataBase)?.country !== playerData.country) return;
        if (isIncident16Location(x, z, dimension)) { noticeIncident16(sender); return; }
        const rawChunk = chunkDataBase.get(id);
        const chunkData = GetAndParsePropertyData(id, chunkDataBase);
        if (!chunkData?.countryId || chunkData.countryId != playerData.country) {
            sender.sendMessage({ translate: "command.sellchunk.error.thischunk.notterritory" });
            return;
        }
        if (CheckPermission(sender, "sellChunk")) {
            sender.sendMessage({ translate: "command.permission.error" });
            return;
        }
        // A range may include a core while the seller stands in a different
        // chunk. Protect the chunk being released, rather than their position.
        const cores = sender.dimension.getEntities({ type: "mc:core" });
        if (cores.some((core: any) => core.isValid && GetPlayerChunkPropertyId(core) === id)) {
            sender.sendMessage({ rawtext: [{ text: "§a[MakeCountry]\n" }, { translate: "invade.error.already" }] });
            return;
        }
        const countryKey = `country_${playerData.country}`;
        const rawCountry = countryDataBase.get(countryKey);
        const playerCountryData = GetAndParsePropertyData(countryKey, countryDataBase);
        const fullPrice = chunkData.price || config.defaultChunkPrice;
        const chunkPrice = fullPrice / 2;
        if (chunkData.id !== id || !playerCountryData || `${playerCountryData.id}` !== `${playerData.country}`
            || !Array.isArray(playerCountryData.territories) || playerCountryData.territories.filter((key: any) => key === id).length !== 1
            || !Number.isFinite(fullPrice) || fullPrice < 0 || (fullPrice > 0 && chunkPrice === 0)
            || !Number.isFinite(playerCountryData.resourcePoint) || playerCountryData.resourcePoint < 0
            || !Number.isFinite(playerCountryData.resourcePoint + chunkPrice)
            || (chunkPrice > 0 && playerCountryData.resourcePoint + chunkPrice === playerCountryData.resourcePoint)
            || (playerCountryData.lastInvated !== undefined && (!Number.isFinite(playerCountryData.lastInvated) || playerCountryData.lastInvated < 0))
            || (playerCountryData.resourcePointLog !== undefined && !Array.isArray(playerCountryData.resourcePointLog))) {
            throw new Error("invalid_chunk_sale_data");
        }
        if (Date.now() - (playerCountryData.lastInvated || 0) < 3 * 24 * 60 * 60 * 1000) return;
        if (playerCountryData.territories.length < 2) {
            sender.sendMessage({ translate: "command.sellchunk.error.morechunk", with: [`${chunkPrice}`] });
            return;
        }
        chunkData.countryId = undefined;
        playerCountryData.resourcePoint += chunkPrice;
        playerCountryData.territories.splice(playerCountryData.territories.indexOf(id), 1);
        playerCountryData.resourcePointLog ||= [];
        playerCountryData.resourcePointLog.push({ timestamp: Date.now(), actor: sender.name, action: "add", amount: chunkPrice, reason: "SELL CHUNK" });
        if (playerCountryData.resourcePointLog.length > 50) playerCountryData.resourcePointLog.splice(0, playerCountryData.resourcePointLog.length - 50);
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
            if (rollbackErrors.length) throw Object.assign(new Error("chunk_sale_rollback_failed"), { errors: [error, ...rollbackErrors] });
            throw error;
        }
        if (sender.isValid) {
            try { sender.sendMessage({ translate: "command.sellchunk.result", with: [`${playerCountryData.resourcePoint}`] }); } catch { }
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
        if (chunks.length > 100) {
            sender.sendMessage({ translate: "command.error.chunks.limit.sell", with: ["100"] });
            return;
        }
        // Protected incident-16 land cannot be bought back, so reject the range
        // before scheduling any release.
        if (chunks.some(chunk => isIncident16Location(chunk.chunkX * 16, chunk.chunkZ * 16, dimension))) {
            noticeIncident16(sender);
            return;
        }
        let rangeFailed = false;
        for (let i = 0; i < chunks.length; i++) {
            system.runTimeout(() => {
                if (rangeFailed) return;
                const target = chunks[i];
                if (!target) return;
                const id = `chunk_${target.chunkX}_${target.chunkZ}_${dimension.replace("minecraft:", "")}`;
                try { releaseChunk(id, target.chunkX * 16, target.chunkZ * 16); }
                catch (error) { rangeFailed = true; throw error; }
            }, i);
        }
        return;
    }
    const { x, z } = sender.location;
    releaseChunk(GetPlayerChunkPropertyId(sender), x, z);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sellchunk',
            description: 'command.help.sellchunk.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
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
            if (chunks.length > 101) return chunks;
            chunks.push({ chunkX: cx, chunkZ: cz });
        }
    }
    return chunks;
}
