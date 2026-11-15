import { world } from "@minecraft/server";
import config from "@/config/server.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { storageReadReady } from "@/shared/storage/write-hook.js";
import { commitStorageBatch } from "@/shared/storage/recoverable-batch.js";
import { countryHasActiveInvasion } from "@/domain/war/core-war-service.js";
import { isIncident16Location } from "@/domain/protection/incident16.js";
import { deniesNewTerritory } from "./territory-rules-gate.js";
import { runWithGateTerritoryCheck } from "./gate-territory.js";

export const LAND_TRANSFER_FEE = 500;
const DAY = 86_400_000, JST = 9 * 3_600_000;
const MAX_PENDING = 10;
const MAX_CHUNKS = 100;
const CHUNK = /^chunk_(-?\d+)_(-?\d+)_overworld$/;
export interface LandTransferRequest {
    id: string; sourceId: number; targetId: number; groupId: number;
    sourceOwner: string; targetOwner: string; sourceName: string; targetName: string;
    worldId?: string; groupName: string; chunks: string[]; createdAt: number; eligibleAt: number;
    state: "pending" | "accepted" | "cancelled" | "rejected";
    announcedAt?: number; completedAt?: number;
}
export class LandTransferError extends Error {
    constructor(public readonly key: string, public readonly args: string[] = []) { super(key); }
}
function fail(key: string, ...args: string[]): never { throw new LandTransferError("land.transfer.error." + key, args); }
const read = (namespace: string, key: string): any => {
    const raw = new DynamicProperties(namespace).get(key);
    return raw === undefined ? undefined : JSON.parse(raw);
};
const entry = (namespace: string, key: string, data: any) => ({ namespace, key, value: JSON.stringify(data) });
export const transferMessage = (key: string, args: string[] = []) => ({ translate: "land.transfer." + key, with: args });

export function transferEligibleAt(createdAt: number): number {
    // Calendar day in Japan, rather than 24h or the next tax later the same day.
    return Math.floor((createdAt + JST) / DAY) * DAY - JST + DAY + 21 * 3_600_000;
}

export function transferCountry(player: any): any {
    if (!["country", "chunk", "plotgroup", "player"].every(storageReadReady)) fail("unavailable");
    const data = read("player", `player_${player.id}`);
    const country = data?.country && read("country", `country_${data.country}`);
    if (!country || String(country.owner) !== String(player.id)) fail("owner");
    return country;
}

function requests(country: any): LandTransferRequest[] {
    if (country.landTransferRequests === undefined) return [];
    if (!Array.isArray(country.landTransferRequests)) fail("invalid");
    return country.landTransferRequests;
}

export function listLandTransfers(player: any): LandTransferRequest[] {
    const own = transferCountry(player);
    const result: LandTransferRequest[] = [];
    for (const key of new DynamicProperties("country").idList) {
        const country = read("country", String(key));
        if (!country) continue;
        for (const request of requests(country)) {
            if (request.state === "pending" && (request.sourceId === own.id || request.targetId === own.id)) result.push(request);
        }
    }
    return result.sort((a, b) => a.createdAt - b.createdAt);
}

export function transferGroups(player: any): any[] {
    const country = transferCountry(player);
    return (country.plotgroup ?? []).map((id: number) => read("plotgroup", `plotgroup_${id}`)).filter(Boolean);
}

function checkCountries(source: any, target: any, now: number): void {
    if (!source || !target || source.id === target.id) fail("country");
    for (const country of [source, target]) {
        if (!Number.isSafeInteger(country.id) || typeof country.owner !== "string" || typeof country.peace !== "boolean"
            || !Number.isFinite(country.money) || country.money < 0 || !Array.isArray(country.territories)
            || new Set(country.territories).size !== country.territories.length || !Array.isArray(country.plotgroup)
            || [country.lastInvated, country.landTransferInvadedAt].some(value => value !== undefined && (!Number.isFinite(value) || value < 0))) fail("invalid");
        if (country.merging || country.isWarNow || country.warNowCountries?.length || country.declarationSend?.length
            || country.declarationReceive?.length || countryHasActiveInvasion(country.id)
            || (Math.max(country.lastInvated ?? 0, country.landTransferInvadedAt ?? 0) > 0
                && now - Math.max(country.lastInvated ?? 0, country.landTransferInvadedAt ?? 0) < 3 * DAY)) fail("war");
        if (!Number.isFinite(country.days) || country.days < (config.mergeProtectionDuration ?? 3)) fail("newcountry");
    }
    if (!source.peace && target.peace) fail("peace");
}

function groupChunks(source: any, groupId: number): { group: any; ids: string[]; chunks: any[] } {
    if (!source.plotgroup.some((id: any) => String(id) === String(groupId))) fail("group");
    const group = read("plotgroup", `plotgroup_${groupId}`);
    if (!group || String(group.id) !== String(groupId) || group.group) fail("group");
    if (group.owner || group.is_selling || group.type !== "public" || group.enable === false) fail("private");
    const chunks = source.territories.map((id: string) => read("chunk", id)).filter((chunk: any) => String(chunk?.plot?.group) === String(groupId));
    const ids = chunks.map((chunk: any) => chunk.id).sort();
    if (!ids.length || ids.length > MAX_CHUNKS) fail("size", String(MAX_CHUNKS));
    for (const chunk of chunks) {
        const match = CHUNK.exec(chunk.id);
        if (!match || chunk.countryId !== source.id || !source.territories.includes(chunk.id)) fail("changed");
        if (chunk.plot.owner || chunk.plot.is_selling || (chunk.plot.type && chunk.plot.type !== "public")) fail("private");
        if (isIncident16Location(Number(match[1]) * 16, Number(match[2]) * 16, "minecraft:overworld")) fail("protected");
    }
    if (new Set(ids).size !== ids.length || source.territories.length - ids.length < 1) fail("lastchunk");
    const homes = typeof source.spawn === "string" ? [source.spawn] : Object.values(source.spawn ?? {}).map((s: any) => s?.pos);
    for (const home of homes) {
        if (typeof home !== "string") continue;
        const [x, , z, , , dimension] = home.split("_");
        if (["minecraft:overworld", "overworld"].includes(dimension) && ids.includes(`chunk_${Math.floor(Number(x) / 16)}_${Math.floor(Number(z) / 16)}_overworld`)) fail("spawn");
    }
    return { group, ids, chunks };
}

export function sendLandTransfer(player: any, groupInput: string, targetId: number): LandTransferRequest {
    const source = transferCountry(player), target = read("country", `country_${targetId}`), now = Date.now();
    checkCountries(source, target, now);
    if (target.id !== targetId) fail("invalid");
    const matches = transferGroups(player).filter(g => groupInput === `#${g.id}` || groupInput === g.name);
    if (matches.length !== 1) fail("group");
    const { group, ids } = groupChunks(source, Number(matches[0].id));
    const pending = requests(source).filter(r => r.state === "pending");
    if (pending.length >= MAX_PENDING || pending.some(r => r.groupId === Number(group.id) || r.chunks.some(id => ids.includes(id)))) fail("duplicate");
    let incoming = 0;
    for (const key of new DynamicProperties("country").idList) incoming += requests(read("country", String(key)) ?? {}).filter(r => r.state === "pending" && r.targetId === targetId).length;
    if (incoming >= MAX_PENDING) fail("duplicate");
    if (target.territories.length + ids.length > (config.chunkLimit ?? 3200)) fail("limit");
    const fee = ids.length * LAND_TRANSFER_FEE;
    if (source.money < fee || target.money < fee) fail("funds", String(fee));
    const request: LandTransferRequest = {
        id: `${source.id}-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
        worldId: String(config.world ?? "karoearth"), sourceId: source.id, targetId, groupId: Number(group.id),
        sourceOwner: String(source.owner), targetOwner: String(target.owner),
        sourceName: String(source.name), targetName: String(target.name), groupName: String(group.name),
        chunks: ids, createdAt: now, eligibleAt: transferEligibleAt(now), state: "pending",
    };
    source.landTransferRequests = [...requests(source).filter(r => r.state === "pending"), ...requests(source).filter(r => r.state !== "pending" && r.completedAt && now - r.completedAt < 30 * DAY).slice(-39), request];
    commitStorageBatch([entry("country", `country_${source.id}`, source)]);
    return request;
}

export function findLandTransfer(player: any, id: string): LandTransferRequest {
    const request = listLandTransfers(player).find(r => r.id === id);
    if (!request) fail("request");
    return request;
}

export function closeLandTransfer(player: any, id: string, action: "cancelled" | "rejected"): void {
    const actor = transferCountry(player), request = findLandTransfer(player, id);
    if (actor.id !== (action === "cancelled" ? request.sourceId : request.targetId)) fail("owner");
    const source = read("country", `country_${request.sourceId}`);
    const current = requests(source).find(r => r.id === id && r.state === "pending");
    if (!current) fail("request");
    current.state = action; current.completedAt = Date.now();
    commitStorageBatch([entry("country", `country_${source.id}`, source)]);
}

/** Called only after a successful Discord response. Re-read to avoid stale writes. */
export function markLandTransferAnnounced(sourceId: number, id: string): void {
    const source = read("country", `country_${sourceId}`);
    const request = source && requests(source).find(r => r.id === id);
    if (!request || request.announcedAt || request.state !== "pending") return;
    request.announcedAt = Date.now();
    commitStorageBatch([entry("country", `country_${source.id}`, source)]);
}

export function unannouncedLandTransfers(): LandTransferRequest[] {
    if (!["country", "chunk", "plotgroup"].every(storageReadReady)) return [];
    return new DynamicProperties("country").idList.flatMap(key => requests(read("country", String(key)) ?? {}).filter(r => r.state === "pending" && !r.announcedAt));
}

export function acceptLandTransfer(player: any, id: string): LandTransferRequest {
    const actor = transferCountry(player), request = findLandTransfer(player, id), now = Date.now();
    if (actor.id !== request.targetId) fail("owner");
    const source = read("country", `country_${request.sourceId}`), target = read("country", `country_${request.targetId}`);
    checkCountries(source, target, now);
    if (String(source.owner) !== request.sourceOwner || String(target.owner) !== request.targetOwner) fail("ownerchanged");
    if (!request.announcedAt) fail("announcement");
    if (now < request.eligibleAt || Number(world.getDynamicProperty("karo:land-transfer:last-tax")) < request.eligibleAt
        || !Number.isFinite(Number(world.getDynamicProperty("karo:land-transfer:last-tax")))) fail("tax");
    const { group, ids, chunks } = groupChunks(source, request.groupId);
    if (JSON.stringify(ids) !== JSON.stringify(request.chunks) || target.plotgroup.some((g: any) => String(g) === String(group.id))
        || ids.some(id => target.territories.includes(id))) fail("changed");
    if (target.territories.length + ids.length > (config.chunkLimit ?? 3200)) fail("limit");
    const cells: [number, number][] = ids.map(id => { const m = CHUNK.exec(id)!; return [Number(m[1]), Number(m[2])]; });
    // Apply existing land rules to the recipient; consent must not bypass them.
    let ruleDenied = false;
    if (deniesNewTerritory({ sendMessage: (message: string) => { ruleDenied = true; player.sendMessage(message); } }, cells, "overworld", target) || ruleDenied) fail("rules");
    const fee = ids.length * LAND_TRANSFER_FEE;
    if (source.money < fee || target.money < fee) fail("funds", String(fee));
    for (const country of [source, target]) {
        country.money = Math.round((country.money - fee) * 100) / 100;
        if (country.treasuryBudgetLog !== undefined && !Array.isArray(country.treasuryBudgetLog)) fail("invalid");
        country.treasuryBudgetLog = [...(country.treasuryBudgetLog ?? []).slice(-49), { timestamp: now, actor: player.name,
            action: "remove", amount: -fee, reason: `LAND TRANSFER ${request.id}` }];
    }
    source.territories = source.territories.filter((key: string) => !ids.includes(key));
    target.territories = [...target.territories, ...ids];
    source.plotgroup = source.plotgroup.filter((g: any) => String(g) !== String(group.id));
    target.plotgroup = [...target.plotgroup, group.id];
    // Ownership and old-country role grants must never follow a public group.
    const transferredGroup = { ...group, countryId: target.id, country: target.id, owner: null, players: [], roles: [], countries: [],
        permissions: [], alliancePermissions: [], friendlyPermissions: [], is_selling: false, price: 0, type: "public", enable: true };
    const current = requests(source).find(r => r.id === id && r.state === "pending");
    if (!current) fail("request");
    current.state = "accepted"; current.completedAt = now;
    const entries = [entry("country", `country_${source.id}`, source), entry("country", `country_${target.id}`, target),
        entry("plotgroup", `plotgroup_${group.id}`, transferredGroup),
        ...chunks.map(chunk => entry("chunk", chunk.id, { ...chunk, countryId: target.id, plot: { group: group.id } }))];
    commitStorageBatch(entries);
    return current;
}

/** Async gate lookup precedes a full synchronous revalidation and commit. */
export function receiveLandTransfer(player: any, id: string): void {
    const request = findLandTransfer(player, id);
    const cells: [number, number][] = request.chunks.map(key => { const m = CHUNK.exec(key); if (!m) fail("invalid"); return [Number(m[1]), Number(m[2])]; });
    runWithGateTerritoryCheck(player, cells, "overworld", () => {
        try {
            if (player.isValid === false) return;
            const accepted = acceptLandTransfer(player, id);
            world.sendMessage(transferMessage("accepted", [accepted.sourceName, accepted.targetName, accepted.groupName, String(accepted.chunks.length)]));
        } catch (error) { reportTransferError(player, error); }
    });
}

export function reportTransferError(player: any, error: unknown): void {
    if (player.isValid === false) return;
    if (error instanceof LandTransferError) player.sendMessage({ translate: error.key, with: error.args });
    else { player.sendMessage(transferMessage("error.unavailable")); console.error("[LandTransfer] operation failed", error instanceof Error ? error.message : "unknown"); }
}
