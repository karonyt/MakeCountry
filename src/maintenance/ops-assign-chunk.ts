import { ScriptEventSource, system } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "@/shared/utils/minecraft.js";
import { GenerateChunkData } from "@/domain/country/land-service.js";

/**
 * 運営用: 荒野のチャンクを国の領土にする（取得制限・RP消費なし）。サーバーのコンソールからだけ動く。
 *   scriptevent karoearth:ops_assignchunk {"mode":"scan","country":285,"chunks":[[-467,247]],"tag":"memo"}
 * scan は確かめるだけ。apply で書き込む。持ち主・国・特別区域のあるチャンクは触らない。overworld のみ。
 */
type Request = { mode: "scan" | "apply"; country: number; chunks: [number, number][]; tag?: string };

function log(tag: string, text: string) { console.warn(`[ops-assignchunk ${tag}] ${text}`); }

function run(request: Request) {
    const tag = `${request.tag ?? "-"}`;
    if (!["scan", "apply"].includes(request.mode) || !Number.isSafeInteger(request.country) || request.country <= 0
        || !Array.isArray(request.chunks) || request.chunks.length === 0 || request.chunks.length > 50
        || request.chunks.some(c => !Array.isArray(c) || !Number.isSafeInteger(c[0]) || !Number.isSafeInteger(c[1]))) {
        log(tag, "rejected: bad request"); return;
    }
    const chunkDB = new DynamicProperties("chunk"), countryDB = new DynamicProperties("country");
    const countryKey = `country_${request.country}`;
    const rawCountry = countryDB.get(countryKey);
    const country = GetAndParsePropertyData(countryKey, countryDB);
    if (!country || `${country.id}` !== `${request.country}` || !Array.isArray(country.territories)) { log(tag, `rejected: ${countryKey} missing/invalid`); return; }
    const plans: { id: string; raw: string | undefined; data: any }[] = [];
    for (const [cx, cz] of request.chunks) {
        const id = `chunk_${cx}_${cz}_overworld`;
        const raw = chunkDB.get(id);
        const data = GetAndParsePropertyData(id, chunkDB) ?? GenerateChunkData(cx * 16, cz * 16, "minecraft:overworld");
        if (!data || data.id !== id) { log(tag, `rejected: ${id} data id mismatch ${data?.id}`); return; }
        if (data.special || data.owner || data.countryId || country.territories.includes(id)) {
            log(tag, `rejected: ${id} special=${data.special} owner=${data.owner} country=${data.countryId}`); return;
        }
        plans.push({ id, raw, data });
    }
    if (request.mode === "scan") { log(tag, `scan ok ${countryKey} (${country.name}) territories=${country.territories.length} +${plans.map(p => p.id).join(",")}`); return; }
    const attempted: { database: DynamicProperties; key: string; raw: string | undefined }[] = [];
    try {
        for (const p of plans) {
            p.data.countryId = request.country;
            attempted.push({ database: chunkDB, key: p.id, raw: p.raw });
            StringifyAndSavePropertyData(p.id, p.data, chunkDB);
            country.territories.push(p.id);
        }
        attempted.push({ database: countryDB, key: countryKey, raw: rawCountry });
        StringifyAndSavePropertyData(countryKey, country, countryDB);
    } catch (error) {
        for (const e of attempted.reverse()) {
            try { if (e.raw === undefined) e.database.delete(e.key); else e.database.set(e.key, e.raw); } catch (rollbackError) { log(tag, `rollback failed ${e.key}: ${String(rollbackError)}`); }
        }
        log(tag, `apply failed: ${String(error)}`); return;
    }
    log(tag, `apply done ${countryKey} (${country.name}) territories=${country.territories.length} +${plans.map(p => p.id).join(",")}`);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "karoearth:ops_assignchunk") return;
    if (event.sourceType !== ScriptEventSource.Server) return;
    let request: Request;
    try { request = JSON.parse(event.message); } catch (error) { log("-", `bad message: ${String(error)}`); return; }
    run(request);
});

/**
 * 運営用: 国の建国直後の保護 (3 日・5 チャンク) だけを外す。建国日時は変えない。コンソール専用。
 *   scriptevent karoearth:ops_liftnewcomer {"mode":"scan","country":295,"tag":"memo"}
 */
system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "karoearth:ops_liftnewcomer") return;
    if (event.sourceType !== ScriptEventSource.Server) return;
    let request: { mode?: string; country?: number; tag?: string };
    try { request = JSON.parse(event.message); } catch (error) { log("-", `bad message: ${String(error)}`); return; }
    const tag = `lift ${request.tag ?? "-"}`;
    if (!["scan", "apply"].includes(`${request.mode}`) || !Number.isSafeInteger(request.country) || (request.country as number) <= 0) { log(tag, "rejected: bad request"); return; }
    const countryDB = new DynamicProperties("country");
    const key = `country_${request.country}`;
    const country = GetAndParsePropertyData(key, countryDB);
    if (!country || `${country.id}` !== `${request.country}`) { log(tag, `rejected: ${key} missing/invalid`); return; }
    if (request.mode === "scan") { log(tag, `scan ok ${key} (${country.name}) foundedAt=${country.foundedAt} lifted=${country.newcomerProtectionLifted === true}`); return; }
    country.newcomerProtectionLifted = true;
    StringifyAndSavePropertyData(key, country, countryDB);
    log(tag, `apply done ${key} (${country.name}) foundedAt=${country.foundedAt} lifted=true`);
});
