import { system, TextPrimitive, world, type Dimension, type Entity, type Player, type RawMessage, type Vector3 } from "@minecraft/server";
import { LocalizedTextGroup } from "../../../localization/primitive-text.js";
import config from "@/config/server.js";
import fishingConfig from "@/config/fishing.js";
import { getFishManager } from "@/domain/fishing/fishing.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { storageReadReady } from "@/shared/storage/write-hook.js";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";

const BOARD_PROPERTY = "karoearth_ranking_boards";
const BOARD_TAGS = ["text:baltop", "text:playtime", "text:chunk", "text:member"] as const;
const FISH_PREFIX = "text:fish_size_";
const VIEW_DISTANCE = 48;
const REFRESH_MS = 60_000;

type BoardTag = (typeof BOARD_TAGS)[number] | `text:fish_size_${string}`;
type Board = { id: string; tag: BoardTag; dimensionId: string; location: Vector3 };
type BoardContent = { message: RawMessage; signature: string; refreshAt: number };
type BoardLabel = LocalizedTextGroup;
type RankingPlayer = { id: string; name: string; money: string; moneyPrivate?: boolean };
type RankingCountry = { name: string; territories?: unknown[]; members?: unknown[] };
type Row = { name: string; value: RawMessage };

let boards: Map<string, Board> | undefined;
let renderTimer: number | undefined;
let nextWarningAt = 0;
const contents = new Map<BoardTag, BoardContent>();
const labels = new Map<string, BoardLabel>();

function boardTag(tags: string[]): BoardTag | undefined {
    return BOARD_TAGS.find(tag => tags.includes(tag)) ??
        tags.find((tag): tag is `text:fish_size_${string}` => tag.startsWith(FISH_PREFIX) && tag.length > FISH_PREFIX.length);
}

function getBoards(): Map<string, Board> {
    if (boards) return boards;
    const raw = world.getDynamicProperty(BOARD_PROPERTY);
    if (raw !== undefined && typeof raw !== "string") throw new Error("Invalid ranking board property");
    const saved: Board[] = raw === undefined ? [] : JSON.parse(raw);
    boards = new Map(saved.map(board => [board.id, board]));
    return boards;
}

function warn(error: unknown): void {
    const now = Date.now();
    if (now < nextWarningAt) return;
    nextWarningAt = now + REFRESH_MS;
    console.warn(`[ranking] ${error}`);
}

function importMarkers(entities: Entity[]): void {
    const saved = getBoards();
    const updated = new Map(saved);
    const migrated: Entity[] = [];
    for (const entity of entities) {
        if (!entity.isValid) continue;
        const tag = boardTag(entity.getTags());
        if (!tag) continue;
        if (!updated.has(entity.id)) {
            const location = entity.location;
            // 元のネームタグ用 TextPrimitive と同じ高さに置く。
            const y = Math.max(location.y + .35, entity.getHeadLocation().y) + .35;
            updated.set(entity.id, { id: entity.id, tag, dimensionId: entity.dimension.id, location: { ...location, y } });
        }
        migrated.push(entity);
    }

    // 保存に失敗した場合はエンティティを残す。再読込しても同じ ID で再開できる。
    if (updated.size !== saved.size) {
        world.setDynamicProperty(BOARD_PROPERTY, JSON.stringify([...updated.values()]));
        boards = updated;
    }

    let removed = 0;
    for (const entity of migrated) {
        try {
            entity.remove();
            removed++;
        } catch (error) {
            warn(error);
        }
    }
    if (removed) console.warn(`[ranking] Migrated ${removed} mc:text marker(s); ${updated.size} saved board(s)`);
    if (updated.size && renderTimer === undefined) {
        renderTimer = system.runInterval(renderBoards, 20);
    }
}

export function updateRanking(): void {
    for (const content of contents.values()) content.refreshAt = 0;
    try {
        const markers = ["overworld", "nether", "the_end"].flatMap(id =>
            world.getDimension(id).getEntities({ type: "mc:text" }),
        );
        importMarkers(markers);
    } catch (error) {
        warn(error);
    }
}

world.afterEvents.worldLoad.subscribe(updateRanking);
world.afterEvents.entityLoad.subscribe(({ entity }) => {
    if (!entity.isValid || entity.typeId !== "mc:text") return;
    try {
        importMarkers([entity]);
    } catch (error) {
        warn(error);
    }
});

function removeLabel(id: string): void {
    const label = labels.get(id);
    if (!label) return;
    labels.delete(id);
    try {
        label.clear();
    } catch (error) {
        warn(error);
    }
}

function renderBoards(): void {
    if (!boards) return;
    const visible: { board: Board; dimension: Dimension; viewers: Player[] }[] = [];
    for (const board of boards.values()) {
        try {
            const dimension = world.getDimension(board.dimensionId);
            const viewers = dimension.getPlayers({ location: board.location, maxDistance: VIEW_DISTANCE });
            if (viewers.length) visible.push({ board, dimension, viewers });
            else removeLabel(board.id);
        } catch (error) {
            warn(error);
        }
    }
    if (!visible.length) return;

    try {
        refreshContents(visible.map(({ board }) => board.tag));
    } catch (error) {
        warn(error);
    }

    for (const { board, dimension, viewers } of visible) {
        const content = contents.get(board.tag);
        if (!content) continue;
        try {
            let label = labels.get(board.id);
            if (!label) {
                label = new LocalizedTextGroup(TextPrimitive, world.primitiveShapesManager);
                labels.set(board.id, label);
            }
            label.update({
                position: board.location, dimension, viewers, message: content.message,
                style: {
                    depthTest: true, useRotation: false, scale: .8,
                    maximumRenderDistance: VIEW_DISTANCE,
                    color: { red: 1, green: 1, blue: 1, alpha: 1 },
                    backgroundColorOverride: { red: 0, green: 0, blue: 0, alpha: .25 },
                }, timeLeft: 4,
            });
        } catch (error) {
            removeLabel(board.id);
            warn(error);
        }
    }
}

function refreshContents(tags: BoardTag[]): void {
    const now = Date.now();
    const needed = [...new Set(tags)].filter(tag => now >= (contents.get(tag)?.refreshAt ?? 0));
    if (!needed.length) return;

    const playerDb = new DynamicProperties("player");
    const countryDb = new DynamicProperties("country");
    let players: RankingPlayer[] | undefined;
    let countries: RankingCountry[] | undefined;
    for (const tag of needed) {
        let message: RawMessage;
        switch (tag) {
            case "text:baltop":
            case "text:playtime":
                if (!storageReadReady("player") || (tag === "text:playtime" && !storageReadReady("playtime"))) continue;
                players ??= playerDb.idList.map(id => GetAndParsePropertyData(id, playerDb))
                    .filter(player => player?.name && !isNaN(parseInt(player.money)));
                message = tag === "text:baltop" ? moneyBoard(players) : playtimeBoard(players, now);
                break;
            case "text:chunk":
            case "text:member":
                if (!storageReadReady("country")) continue;
                countries ??= countryDb.idList.map(id => GetAndParsePropertyData(id, countryDb))
                    .filter(country => country?.name);
                message = countryBoard(countries, tag === "text:chunk" ? "territories" : "members");
                break;
            default:
                if (!storageReadReady("player")) continue;
                message = fishBoard(tag.slice(FISH_PREFIX.length), playerDb);
        }
        contents.set(tag, { message, signature: JSON.stringify(message), refreshAt: now + REFRESH_MS });
    }
}

function boardMessage(title: RawMessage, rows: Row[], total?: RawMessage): RawMessage {
    const rawtext: RawMessage[] = [title];
    if (total) {
        rawtext.push({ text: "\n" }, { translate: "game.ui.ranking.total", with: { rawtext: [total] } });
    }
    for (const [index, row] of rows.entries()) {
        rawtext.push({ text: "\n" }, {
            translate: "game.ui.ranking.row",
            with: { rawtext: [{ text: String(index + 1) }, { text: row.name }, row.value] },
        });
    }
    return { rawtext };
}

function moneyValue(amount: number): RawMessage {
    return { text: `${amount}${config.MoneyName}` };
}

function moneyBoard(players: RankingPlayer[]): RawMessage {
    const total = players.reduce((sum, player) => sum + parseInt(player.money), 0);
    const top = players.filter(player => !player.moneyPrivate)
        .sort((a, b) => Number(b.money) - Number(a.money)).slice(0, 20)
        .map(player => ({ name: player.name, value: moneyValue(parseInt(player.money)) }));
    return boardMessage({ translate: "game.ui.ranking.money" }, top, moneyValue(total));
}

function playtimeBoard(players: RankingPlayer[], now: number): RawMessage {
    const db = new DynamicProperties("playtime");
    const logins: { id: string; loginTime: number }[] = JSON.parse(db.get("worldLoginPlayers") || "[]");
    const loginTimes = new Map(logins.map(login => [login.id, login.loginTime]));
    const entries = players.map(player => {
        const saved = Number(JSON.parse(db.get(`player_${player.id}_total`) || "0")) || 0;
        const login = loginTimes.get(player.id);
        const minutes = saved + (login === undefined ? 0 : Math.floor((now - login) / 60_000));
        return { name: player.name, minutes };
    });
    const total = entries.reduce((sum, player) => sum + player.minutes, 0);
    const top = entries.sort((a, b) => b.minutes - a.minutes).slice(0, 20)
        .map(player => ({ name: player.name, value: formatMinutes(player.minutes) }));
    return boardMessage({ translate: "game.ui.ranking.playtime" }, top, formatMinutes(total));
}

function formatMinutes(total: number): RawMessage {
    const hours = Math.floor(total / 60);
    const minutes = String(total % 60);
    return hours > 0
        ? { translate: "game.ui.ranking.hours_minutes", with: [String(hours), minutes] }
        : { translate: "game.ui.ranking.minutes", with: [minutes] };
}

function countryBoard(countries: RankingCountry[], field: "territories" | "members"): RawMessage {
    const entries = countries.map(country => ({ name: country.name, count: country[field]?.length ?? 0 }));
    const total = entries.reduce((sum, country) => sum + country.count, 0);
    const top = entries.sort((a, b) => b.count - a.count).slice(0, 20)
        .map(country => ({ name: country.name, value: { text: String(country.count) } }));
    return boardMessage(
        { translate: `game.ui.ranking.${field}` },
        top,
        { translate: `game.ui.ranking.${field}_count`, with: [String(total)] },
    );
}

function fishBoard(fishTypeId: string, playerDb: DynamicProperties): RawMessage {
    const fish = fishingConfig.allFishes.find(entry => entry.typeId === fishTypeId);
    const fishName: RawMessage = fish ? { translate: fish.name } : { text: fishTypeId.split(":").at(-1) ?? fishTypeId };
    const rank = getFishManager().getServerFishRanking(fishTypeId);
    const top = rank.top.map((entry: { playerId: string; playerName?: string; size: number }) => {
        const player = GetAndParsePropertyData(`player_${entry.playerId}`, playerDb);
        return { name: player?.name ?? entry.playerName ?? entry.playerId, value: { text: `${entry.size} cm` } };
    });
    return boardMessage({
        translate: "game.ui.ranking.fish",
        with: { rawtext: [fishName, { text: String(top.length) }] },
    }, top);
}
