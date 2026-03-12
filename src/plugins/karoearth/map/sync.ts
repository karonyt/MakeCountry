import { world, system, Player } from "@minecraft/server";
import { http, HttpRequest, HttpHeader, HttpRequestMethod } from "@minecraft/server-net";
import Config from "./config.js";
import { Logger } from "./logger.js";
import { findSurfaceBlock, waitTicks } from "./util.js";
import { DynamicProperties } from "../../../api/dyp.js";
import config from "../../../config.js";

// ヘルパー: 安全なメッセージ送信 (main.jsと同様)
function safeSendMessage(sender: any, msg: any) {
    if (!sender) return;
    try {
        if (sender instanceof Player) {
            if (sender.isValid) sender.sendMessage(msg);
            else Logger.info(`[Map] ${msg.replace(/§./g, '')}`);
        } else if (typeof sender.sendMessage === 'function') {
            sender.sendMessage(msg);
        } else {
            Logger.info(msg.replace(/§./g, ''));
        }
    } catch (e) { }
}

async function postJson(endpoint: any, data: any) {
    if (!data) return false;
    const url = `${Config.SERVER_URL}${endpoint}`;
    const payload = JSON.stringify(data);
    const req = new HttpRequest(url);
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("X-API-Key", Config.API_KEY || "")
    ];
    req.body = payload;

    for (let i = 0; i < 3; i++) {
        try {
            const res = await http.request(req);
            if (res.status >= 200 && res.status < 300) return true;
        } catch (e) { /* ignore */ }
        await waitTicks(10 * (i + 1));
    }
    Logger.warn(`Failed to send data to ${endpoint}`);
    return false;
}

export function scanAndCompressChunk(dimension: any, cx: any, cz: any) {
    const palette: any = [];
    const paletteMap = new Map();
    const s_ids = [];
    const s_ys = [];

    const getPaletteId = (typeId: any) => {
        if (paletteMap.has(typeId)) return paletteMap.get(typeId);
        const idx = palette.length;
        palette.push(typeId);
        paletteMap.set(typeId, idx);
        return idx;
    };

    const startX = cx * 16;
    const startZ = cz * 16;
    let validBlockCount = 0;

    for (let z = 0; z < 16; z++) {
        for (let x = 0; x < 16; x++) {
            const blockInfo = findSurfaceBlock(dimension, startX + x, startZ + z);

            if (blockInfo) {
                s_ids.push(getPaletteId(blockInfo.typeId));
                s_ys.push(blockInfo.location.y);
                if (blockInfo.typeId !== "minecraft:air" && blockInfo.typeId !== "minecraft:bedrock") {
                    validBlockCount++;
                }
            } else {
                s_ids.push(getPaletteId("minecraft:air"));
                s_ys.push(0);
            }
        }
    }

    if (validBlockCount === 0) {
        throw new Error(`Chunk (${cx}, ${cz}) empty. Retry.`);
    }

    return {
        cx: cx, cz: cz,
        palette: palette, s_ids: s_ids, s_ys: s_ys,
        dimension: dimension.id.replace('minecraft:', '')
    };
}

export async function checkExistingChunks(chunkCoords: any) {
    if (chunkCoords.length === 0) return [];

    const req = new HttpRequest(`${Config.SERVER_URL}/api/map/check`);
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("X-API-Key", Config.API_KEY || "")
    ];
    req.body = JSON.stringify({ chunks: chunkCoords });

    try {
        const res = await http.request(req);
        if (res.status === 200) {
            const result = JSON.parse(res.body);
            const existingSet = new Set(result.existing.map((c: any) => `${c.cx},${c.cz}`));
            return chunkCoords.filter((c: any) => !existingSet.has(`${c.cx},${c.cz}`));
        }
    } catch (e) {
        // @ts-ignore TS(2571): Object is of type 'unknown'.
        Logger.warn(`Check API failed: ${e.message}`);
    }
    return chunkCoords;
}

export async function sendChunkDataBatch(chunksData: any) {
    if (!chunksData || chunksData.length === 0) return;
    await postJson('/api/map/update', { data: chunksData });
}

export async function sendPlayerData(playersData: any) {
    await postJson('/players', { data: playersData });
}

export async function syncAllCountryData() {
    Logger.info("Syncing all country data...");
    try {
        const countryDB = new DynamicProperties('country');
        const playerDB = new DynamicProperties('player');
        const roleDB = new DynamicProperties('role');
        const countryIds = countryDB.idList;
        const countriesData = [];

        for (const key of countryIds) {
            const rawCountryData = countryDB.get(key);
            if (!rawCountryData) continue;
            const countryData = JSON.parse(rawCountryData);
            if (!countryData) continue;

            const membersName = (countryData.members || []).map((memberId: any) => {
                const rawPData = playerDB.get(`player_${memberId}`);
                if (!rawPData) return null;
                const pData = JSON.parse(rawPData);
                return pData ? pData?.name.replace(/§./g, "") : null;
            }).filter(Boolean);

            const allianceCountryName = (countryData.alliance || []).map((aid: any) => {
                const rawCData = countryDB.get(`country_${aid}`);
                if (!rawCData) return null;
                const cData = JSON.parse(rawCData);
                return cData ? cData.name?.replace(/§./g, "") : null;
            }).filter(Boolean);


            const friendlyCountryName = (countryData.friendly || []).map((fid: any) => {
                const rawCData = countryDB.get(`country_${fid}`);
                if (!rawCData) return null;
                const cData = JSON.parse(rawCData);
                return cData ? cData.name : null;
            }).filter(Boolean);


            const hostilityCountryName = (countryData.hostility || []).map((hid: any) => {
                const rawCData = countryDB.get(`country_${hid}`);
                if (!rawCData) return null;
                const cData = JSON.parse(rawCData);
                return cData ? cData?.name.replace(/§./g, "") : null;
            }).filter(Boolean);

            const rawOwnerData = playerDB.get(`player_${countryData.owner}`);
            if (!rawOwnerData) continue;
            const ownerData = JSON.parse(rawOwnerData);
            const rawOwnerRoleData = roleDB.get(`role_${countryData.ownerRole}`);
            if (!rawOwnerRoleData) continue;
            const ownerRoleData = JSON.parse(rawOwnerRoleData);
            const rawMemberRoleData = roleDB.get(`role_${countryData.peopleRole}`);
            if (!rawMemberRoleData) continue;
            const memberRoleData = JSON.parse(rawMemberRoleData);

            countriesData.push({
                id: countryData.id,
                name: countryData.name.replace(/§./g, ""),
                lore: countryData.lore?.replace(/§./g, "") || '',
                lv: countryData.lv || 0,
                ownername: ownerRoleData?.name?.replace(/§./g, "") || 'Owner',
                owner: ownerData?.name || 'N/A',
                membersname: memberRoleData?.name?.replace(/§./g, "") || 'Member',
                members: membersName.filter((n: any) => n !== (ownerData?.name)).join(' , '),
                banner: countryData.banner,
                color: countryData.colorcode,
                peace: countryData.peace ? 1 : 0,
                invite: countryData.invite ? 1 : 0,
                alliance: allianceCountryName.join(' , '),
                friendly: friendlyCountryName.join(' , '),
                hostility: hostilityCountryName.join(' , ')
            });

            if (countriesData.length % 10 === 0) await waitTicks(1);
        }

        await postJson('/countries', countriesData);
        return countriesData.length;
    } catch (e) {
        // @ts-ignore TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
        Logger.error("Failed to sync countries:", e);
        return -1;
    }
}

export async function syncAllLandData(sender = undefined) {
    if (Config.STANDALONE_MODE) {
        safeSendMessage(sender, "§e[Map] Standalone mode is enabled. Land sync skipped.");
        return;
    }

    safeSendMessage(sender, "§a[Map] Syncing land and country data...");

    try {
        const chunkDB = new DynamicProperties('chunk');
        const chunkIds = chunkDB.idList;
        const chunksToSend = [];

        for (const key of chunkIds) {
            const rawChunkData = chunkDB.get(key);
            if (!rawChunkData) continue;
            const chunkData = JSON.parse(rawChunkData);
            const countryId = chunkData?.countryId || 0;

            if (countryId > 0) {
                const parts = key.split('_');
                if (parts.length >= 3) {
                    const x = parts[1];
                    const z = parts[2];
                    const dim = parts[3] || 'overworld';

                    chunksToSend.push({
                        x_y: `${x}_${z}`,
                        dimension: dim,
                        id: countryId
                    });
                }
            }
        }

        if (chunksToSend.length > 0) {
            const BATCH = 500;
            for (let i = 0; i < chunksToSend.length; i += BATCH) {
                const batch = chunksToSend.slice(i, i + BATCH);
                await postJson('/land', batch);
                safeSendMessage(sender, `§7 -> Sending land batch ${Math.ceil((i + 1) / BATCH)}/${Math.ceil(chunksToSend.length / BATCH)}...`);
                await waitTicks(5);
            }
        }

        safeSendMessage(sender, `§a[Map] Land data synced (${chunksToSend.length} chunks).`);

        const cCount = await syncAllCountryData();
        safeSendMessage(sender, `§a[Map] Country data synced (${cCount} countries).`);

    } catch (e) {
        // @ts-ignore TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
        Logger.error("Sync Error:", e);
        safeSendMessage(sender, "§cSync failed. Check console.");
    }

}
