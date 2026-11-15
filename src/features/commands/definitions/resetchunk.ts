import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId, isNumber, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import config from "@/config/server.js";

function resetChunkExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (!sender.isValid) return;
    if (!sender.hasTag("mc_admin")) { sender.sendMessage({ translate: "command.permission.error" }); return; }
    if (args.length !== 0 && args.length !== 2) { sender.sendMessage({ translate: "command.resetchunk.error.invalid_coordinates" }); return; }
    const chunkDataBase = new DynamicProperties("chunk");
    const countryDataBase = new DynamicProperties("country");
    const dimension = sender.dimension.id;

    function resetChunk(id: string): void {
        if (!sender.isValid || !sender.hasTag("mc_admin") || sender.dimension.id !== dimension) return;
        const rawChunk = chunkDataBase.get(id);
        const chunkData = GetAndParsePropertyData(id, chunkDataBase);
        const attempted: Array<{ database: DynamicProperties; key: string; raw: string | undefined }> = [];
        let countryKey: string | undefined, rawCountry: string | undefined, countryData: any;
        if (chunkData?.countryId) {
            countryKey = `country_${chunkData.countryId}`;
            rawCountry = countryDataBase.get(countryKey);
            countryData = GetAndParsePropertyData(countryKey, countryDataBase);
            if (countryData) {
                const fullPrice = chunkData.price || config.defaultChunkPrice;
                const indexed = Array.isArray(countryData.territories) && countryData.territories.includes(id);
                const refund = indexed ? fullPrice / 2 : 0;
                if (`${countryData.id}` !== `${chunkData.countryId}` || !Array.isArray(countryData.territories)
                    || !Number.isFinite(fullPrice) || fullPrice < 0 || (indexed && fullPrice > 0 && refund === 0)
                    || !Number.isFinite(countryData.money) || !Number.isFinite(countryData.money + refund)
                    || (refund > 0 && countryData.money + refund === countryData.money)) throw new Error("invalid_chunk_reset_data");
                // A missing index entry must never splice away the last unrelated
                // territory. A missing target may already have been refunded by a
                // partially completed reset; remove it without paying again.
                countryData.territories = countryData.territories.filter((key: any) => key !== id);
                // Preserve the reset command's established treasury refund (money).
                countryData.money += refund;
            }
        }
        try {
            if (countryData && countryKey) {
                attempted.push({ database: countryDataBase, key: countryKey, raw: rawCountry });
                StringifyAndSavePropertyData(countryKey, countryData, countryDataBase);
            }
            attempted.push({ database: chunkDataBase, key: id, raw: rawChunk });
            chunkDataBase.delete(id);
        } catch (error) {
            const rollbackErrors: unknown[] = [];
            for (const entry of attempted.reverse()) {
                try {
                    if (entry.raw === undefined) entry.database.delete(entry.key);
                    else entry.database.set(entry.key, entry.raw);
                } catch (rollbackError) { rollbackErrors.push(rollbackError); }
            }
            if (rollbackErrors.length) throw Object.assign(new Error("chunk_reset_rollback_failed"), { errors: [error, ...rollbackErrors] });
            throw error;
        }
        if (sender.isValid) {
            try { sender.sendMessage({ translate: "command.resetchunk.result", with: { rawtext: [{ translate: "wilderness.name" }] } }); } catch { }
        }
    }
    if (args.length === 2) {
        const [ix, iz] = args.map((value: any) => Math.floor(Number(value)));
        if (!Number.isSafeInteger(ix) || !Number.isSafeInteger(iz) || !isNumber(ix) || !isNumber(iz)) {
            sender.sendMessage({ translate: "command.resetchunk.error.invalid_coordinates" });
            return;
        }
        const { x, z } = sender.location;
        const chunks = getChunksInRange(Math.floor(x), Math.floor(z), ix, iz);
        if (chunks.length > 100) { sender.sendMessage({ translate: "command.resetchunk.error.too_many_chunks" }); return; }
        let rangeFailed = false;
        for (let i = 0; i < chunks.length; i++) {
            system.runTimeout(() => {
                if (rangeFailed) return;
                const target = chunks[i];
                if (!target) return;
                const id = `chunk_${target.chunkX}_${target.chunkZ}_${dimension.replace("minecraft:", "")}`;
                try { resetChunk(id); } catch (error) { rangeFailed = true; throw error; }
            }, i);
        }
        return;
    }
    resetChunk(GetPlayerChunkPropertyId(sender));
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:resetchunk',
            description: 'command.help.resetchunk.message',
            permissionLevel: CommandPermissionLevel.Admin,
            optionalParameters: [{ name: "x", type: CustomCommandParamType.Integer }, { name: "z", type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                resetChunkExecuter(origin, args);
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
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                resetChunkExecuter(origin, args);
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
