import { Player, system } from "@minecraft/server";
import { FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import fishingConfig from "@/config/fishing.js";
import { itemIdToPath } from "@/config/textures.js";
import { getFishManager } from "@/domain/fishing/fishing.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";

type Season = "spring" | "summer" | "autumn" | "winter";
type Period = "morning" | "afternoon" | "evening" | "night";
type SizeRange = { min: number; max: number };
type RawTextPart = { text?: string; translate?: string; with?: string[] };
type FishBookSearchMode = "all" | "fish" | "angler" | "obtained" | "unobtained" | "recorded";

export type FishBookSearchFilter = {
    query: string;
    mode: FishBookSearchMode;
};

type FishBookEntry = {
    typeId: string;
    name: string;
    size?: SizeRange;
    seasons: Set<Season>;
    periods: Set<Period>;
    habitats: Set<string>;
};

const seasons: Season[] = ["spring", "summer", "autumn", "winter"];
const periods: Period[] = ["morning", "afternoon", "evening", "night"];
const pageSize = 45;
const fishStartSlot = 9;
const unknownFishTexture = "textures/ui/fish_silhouette";
const searchModes: FishBookSearchMode[] = ["all", "fish", "angler", "obtained", "unobtained", "recorded"];

const habitatOrder = [
    "fish.encyclopedia.habitat.common",
    "fish.encyclopedia.habitat.river",
    "fish.encyclopedia.habitat.cold_river",
    "fish.encyclopedia.habitat.pond",
    "fish.encyclopedia.habitat.tropical_pond",
    "fish.encyclopedia.habitat.mountain_water",
    "fish.encyclopedia.habitat.swamp",
    "fish.encyclopedia.habitat.mangrove_swamp",
    "fish.encyclopedia.habitat.beach",
    "fish.encyclopedia.habitat.ocean",
    "fish.encyclopedia.habitat.deep_ocean",
    "fish.encyclopedia.habitat.warm_ocean",
    "fish.encyclopedia.habitat.cold_ocean",
];

let cachedEntries: FishBookEntry[] | undefined;
const playerDb = new DynamicProperties("player");

export function showFishEncyclopedia(player: Player, page = 0, filter?: FishBookSearchFilter) {
    const allEntries = getFishBookEntries();
    const entries = getVisibleEntries(player, allEntries, filter);
    const totalPages = Math.max(1, Math.ceil(entries.length / pageSize));
    const safePage = Math.min(Math.max(page, 0), totalPages - 1);
    const pageEntries = entries.slice(safePage * pageSize, (safePage + 1) * pageSize);
    const fishManager = getFishManager();
    const form = new ChestFormData("large");
    form.setTitle([
        { translate: filter ? "fish.encyclopedia.search.title" : "fish.encyclopedia.title" },
        ...(filter?.query ? [{ text: `: ${filter.query}` }] : []),
        { text: ` ${safePage + 1}/${totalPages}` },
    ]);

    form.setButton(0, {
        name: "mc.button.close",
        iconPath: "textures/blocks/barrier",
        lore: ["fish.encyclopedia.close.lore"],
        editedName: true,
    });

    if (safePage > 0) {
        form.setButton(3, {
            name: "fish.encyclopedia.previous",
            iconPath: "textures/ui/arrow_left",
            lore: ["fish.encyclopedia.previous.lore"],
            editedName: true,
        });
    }

    form.setButton(4, {
        name: "fish.encyclopedia.page",
        iconPath: "textures/items/book_normal",
        lore: pageInfoLore(player, entries.length, allEntries.length, safePage, totalPages, filter),
        editedName: true,
    });

    if (safePage + 1 < totalPages) {
        form.setButton(5, {
            name: "fish.encyclopedia.next",
            iconPath: "textures/ui/arrow_right",
            lore: ["fish.encyclopedia.next.lore"],
            editedName: true,
        });
    }

    form.setButton(7, {
        name: "fish.encyclopedia.search.open",
        iconPath: "textures/items/compass_item",
        lore: ["fish.encyclopedia.search.open.lore"],
        editedName: true,
        isGlint: !!filter,
    });

    if (filter) {
        form.setButton(8, {
            name: "fish.encyclopedia.search.clear",
            iconPath: "minecraft:redstone",
            lore: ["fish.encyclopedia.search.clear.lore"],
            editedName: true,
        });
    }

    if (pageEntries.length === 0) {
        form.setButton(22, {
            name: "fish.encyclopedia.search.no_results",
            iconPath: "minecraft:paper",
            lore: ["fish.encyclopedia.search.no_results.lore"],
            editedName: true,
        });
    }

    for (let i = 0; i < pageEntries.length; i++) {
        const entry = pageEntries[i];
        const record = fishManager.getPlayerFishRecord(player.id, entry.typeId);
        const obtained = record.obtained;

        form.setButton(fishStartSlot + i, {
            name: obtained ? entry.name.replace('minecraft:', '') : "fish.encyclopedia.unknown",
            iconPath: obtained ? getFishIcon(entry.typeId) : getFishSilhouetteIcon(entry.typeId),
            stackAmount: Math.min(Math.max(record.count, 1), 64),
            lore: fishLore(entry, player.id, obtained),
            editedName: true,
            isGlint: obtained,
        });
    }

    form.show(player).then(rs => {
        if (rs?.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => showFishEncyclopedia(player, safePage, filter), 10);
            }
            return;
        }

        switch (rs?.selection) {
            case 0:
                return;
            case 3:
                showFishEncyclopedia(player, safePage - 1, filter);
                return;
            case 5:
                showFishEncyclopedia(player, safePage + 1, filter);
                return;
            case 7:
                showFishSearchForm(player, filter, safePage);
                return;
            case 8:
                if (filter) showFishEncyclopedia(player);
                return;
            default:
                if (typeof rs?.selection === "number" && rs.selection >= fishStartSlot) {
                    const entry = pageEntries[rs.selection - fishStartSlot];
                    if (entry) showFishDetail(player, entry, safePage, filter);
                }
        }
    });
}

function showFishDetail(player: Player, entry: FishBookEntry, page: number, filter?: FishBookSearchFilter) {
    const record = getFishManager().getPlayerFishRecord(player.id, entry.typeId);
    const obtained = record.obtained;
    const form = new ChestFormData("small");
    form.setTitle([
        { translate: obtained ? entry.name : "fish.encyclopedia.unknown" },
    ]);

    form.setButton(4, {
        name: obtained ? entry.name : "fish.encyclopedia.unknown",
        iconPath: obtained ? getFishIcon(entry.typeId) : getFishSilhouetteIcon(entry.typeId),
        stackAmount: Math.min(Math.max(record.count, 1), 64),
        lore: fishLore(entry, player.id, obtained),
        editedName: true,
        isGlint: obtained,
    });

    form.setButton(18, {
        name: "mc.button.back",
        iconPath: "textures/ui/arrow_left",
        lore: ["fish.encyclopedia.back.lore"],
        editedName: true,
    });

    form.setButton(26, {
        name: "mc.button.close",
        iconPath: "minecraft:barrier",
        lore: ["fish.encyclopedia.close.lore"],
        editedName: true,
    });

    form.show(player).then(rs => {
        if (rs?.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => showFishDetail(player, entry, page, filter), 10);
            }
            return;
        }

        if (rs?.selection === 18) showFishEncyclopedia(player, page, filter);
    });
}

function showFishSearchForm(player: Player, currentFilter: FishBookSearchFilter | undefined, page: number) {
    const modeIndex = Math.max(0, searchModes.indexOf(currentFilter?.mode ?? "all"));
    const form = new ModalFormData()
        .title({ translate: "fish.encyclopedia.search.form.title" })
        .textField(
            { translate: "fish.encyclopedia.search.query" },
            { translate: "fish.encyclopedia.search.placeholder" },
            { defaultValue: currentFilter?.query ?? "" },
        )
        .dropdown(
            { translate: "fish.encyclopedia.search.mode" },
            searchModes.map(mode => ({ translate: searchModeTranslateKey(mode) })),
            { defaultValueIndex: modeIndex },
        )
        .submitButton({ translate: "fish.encyclopedia.search.submit" });

    form.show(player).then(rs => {
        if (rs?.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => showFishSearchForm(player, currentFilter, page), 10);
                return;
            }

            showFishEncyclopedia(player, page, currentFilter);
            return;
        }

        const query = String(rs.formValues?.[0] ?? "").trim();
        const modeIndex = typeof rs.formValues?.[1] === "number" ? rs.formValues[1] : 0;
        const nextMode = searchModes[modeIndex] ?? "all";
        const nextFilter = query || nextMode !== "all" ? { query, mode: nextMode } : undefined;
        showFishEncyclopedia(player, 0, nextFilter);
    });
}

function getFishBookEntries() {
    if (cachedEntries) return cachedEntries;

    const entriesById = new Map<string, FishBookEntry>();

    for (const fish of fishingConfig.allFishes as Array<{ typeId: string; name: string; size?: SizeRange }>) {
        entriesById.set(fish.typeId, {
            typeId: fish.typeId,
            name: fish.name,
            size: fish.size ? { ...fish.size } : undefined,
            seasons: new Set(),
            periods: new Set(),
            habitats: new Set(),
        });
    }

    collectTable(entriesById, fishingConfig.fishes, "fish.encyclopedia.habitat.common");

    for (const [biomeId, biomeData] of Object.entries(fishingConfig.biomes ?? {})) {
        collectTable(entriesById, (biomeData as any).fishes, habitatKeyForBiome(biomeId));
    }

    cachedEntries = Array.from(entriesById.values());
    return cachedEntries;
}

function collectTable(entriesById: Map<string, FishBookEntry>, table: any, habitatKey: string) {
    for (const season of seasons) {
        for (const period of periods) {
            const fishList = table?.[season]?.[period] ?? [];
            for (const fish of fishList) {
                const entry = entriesById.get(fish.typeId) ?? {
                    typeId: fish.typeId,
                    name: fish.name,
                    size: undefined,
                    seasons: new Set<Season>(),
                    periods: new Set<Period>(),
                    habitats: new Set<string>(),
                };

                entry.name = entry.name ?? fish.name;
                entry.seasons.add(season);
                entry.periods.add(period);
                entry.habitats.add(habitatKey);
                entry.size = mergeSize(entry.size, fish.size);
                entriesById.set(fish.typeId, entry);
            }
        }
    }
}

function getVisibleEntries(player: Player, entries: FishBookEntry[], filter: FishBookSearchFilter | undefined) {
    if (!filter) return entries;

    const query = normalizeSearchText(filter.query);
    const visible = entries.filter(entry => matchesSearchFilter(player, entry, filter.mode, query));

    if (filter.mode === "recorded" || filter.mode === "angler") {
        return visible.sort((a, b) => (getServerBest(b.typeId)?.size ?? 0) - (getServerBest(a.typeId)?.size ?? 0));
    }

    return visible;
}

function matchesSearchFilter(player: Player, entry: FishBookEntry, mode: FishBookSearchMode, query: string) {
    switch (mode) {
        case "fish":
            return query.length === 0 || matchesFish(entry, query);
        case "angler": {
            const serverBest = getServerBest(entry.typeId);
            return !!serverBest && (query.length === 0 || matchesAngler(serverBest, query));
        }
        case "obtained": {
            const record = getFishManager().getPlayerFishRecord(player.id, entry.typeId);
            return record.obtained && (query.length === 0 || matchesFish(entry, query) || matchesEntryAngler(entry, query));
        }
        case "unobtained": {
            const record = getFishManager().getPlayerFishRecord(player.id, entry.typeId);
            return !record.obtained && (query.length === 0 || matchesFish(entry, query) || matchesEntryAngler(entry, query));
        }
        case "recorded": {
            const serverBest = getServerBest(entry.typeId);
            return !!serverBest && (query.length === 0 || matchesFish(entry, query) || matchesAngler(serverBest, query));
        }
        case "all":
        default:
            return query.length === 0 || matchesFish(entry, query) || matchesEntryAngler(entry, query);
    }
}

function matchesFish(entry: FishBookEntry, query: string) {
    return [
        entry.typeId,
        entry.name,
        entry.typeId.split(":").pop() ?? "",
        entry.name.split(":").pop() ?? "",
    ].some(value => normalizeSearchText(value).includes(query));
}

function matchesAngler(serverBest: { playerId: string; playerName: string }, query: string) {
    return [serverBest.playerId, serverBest.playerName].some(value => normalizeSearchText(value).includes(query));
}

function matchesEntryAngler(entry: FishBookEntry, query: string) {
    const serverBest = getServerBest(entry.typeId);
    return !!serverBest && matchesAngler(serverBest, query);
}

function mergeSize(current: SizeRange | undefined, next: SizeRange | undefined) {
    if (!next) return current;
    if (!current) return { min: next.min, max: next.max };
    return {
        min: Math.min(current.min, next.min),
        max: Math.max(current.max, next.max),
    };
}

function fishLore(entry: FishBookEntry, playerId: string, obtained: boolean) {
    const lore: RawTextPart[] = [];
    const serverBest = getServerBest(entry.typeId);

    addLine(lore, "fish.encyclopedia.lore.server_best", [{ text: formatSize(serverBest?.size) }]);
    addLine(lore, "fish.encyclopedia.lore.angler", [{ text: serverBest?.playerName ?? "-" }]);

    if (!obtained) return lore;

    const record = getFishManager().getPlayerFishRecord(playerId, entry.typeId);
    addLine(lore, "fish.encyclopedia.lore.habitat", translatedList([...entry.habitats], habitatOrder));
    addLine(lore, "fish.encyclopedia.lore.season", translatedList(seasons.filter(season => entry.seasons.has(season)).map(season => `day.${season}`)));
    addLine(lore, "fish.encyclopedia.lore.period", translatedList(periods.filter(period => entry.periods.has(period)).map(period => `day.${period}`)));
    addLine(lore, "fish.encyclopedia.lore.size_range", [{ text: formatRange(entry.size) }]);
    addLine(lore, "fish.encyclopedia.lore.your_best", [{ text: formatSize(record.maxSize) }]);
    addLine(lore, "fish.encyclopedia.lore.caught", [{ text: `${record.count}` }]);

    return lore;
}

function addLine(lore: RawTextPart[], labelKey: string, value: RawTextPart[]) {
    lore.push(
        { text: `${lore.length === 0 ? "" : "\n"}§r§7` },
        { translate: labelKey },
        { text: ": §f" },
        ...value,
    );
}

function pageInfoLore(player: Player, visibleTotal: number, total: number, page: number, totalPages: number, filter?: FishBookSearchFilter) {
    const obtained = getFishBookEntries().reduce((count, entry) => {
        return count + (getFishManager().getPlayerFishRecord(player.id, entry.typeId).obtained ? 1 : 0);
    }, 0);

    const lore: RawTextPart[] = [
        { text: "§r§7" },
        { translate: "fish.encyclopedia.lore.page" },
        { text: `: §f${page + 1}/${totalPages}` },
        { text: "\n§r§7" },
        { translate: "fish.encyclopedia.lore.progress" },
        { text: `: §f${obtained}/${total}` },
    ];

    if (filter) {
        lore.push(
            { text: "\n§r§7" },
            { translate: "fish.encyclopedia.search.results" },
            { text: `: §f${visibleTotal}/${total}` },
            { text: "\n§r§7" },
            { translate: "fish.encyclopedia.search.mode" },
            { text: ": §f" },
            { translate: searchModeTranslateKey(filter.mode) },
        );

        if (filter.query) {
            lore.push(
                { text: "\n§r§7" },
                { translate: "fish.encyclopedia.search.query" },
                { text: `: §f${filter.query}` },
            );
        }
    }

    return lore;
}

function translatedList(keys: string[], order = keys) {
    const sorted = [...new Set(keys)].sort((a, b) => order.indexOf(a) - order.indexOf(b));
    if (sorted.length === 0) return [{ text: "-" }];

    const parts: RawTextPart[] = [];
    sorted.forEach((key, index) => {
        if (index > 0) parts.push({ text: ", " });
        parts.push({ translate: key });
    });
    return parts;
}

function getServerBest(fishId: string) {
    const best = getFishManager().getServerFishRanking(fishId).top[0];
    if (!best) return undefined;

    return {
        playerId: best.playerId,
        size: best.size,
        playerName: best.playerName ?? getPlayerName(best.playerId),
    };
}

function getPlayerName(playerId: string) {
    const raw = playerDb.get(`player_${playerId}`);
    if (!raw) return playerId;

    try {
        return JSON.parse(raw)?.name ?? playerId;
    } catch {
        return playerId;
    }
}

function getFishIcon(typeId: string) {
    return (itemIdToPath as Record<string, string>)[typeId] ?? typeId;
}

function getFishSilhouetteIcon(typeId: string) {
    const icon = getFishIcon(typeId);
    const separatorIndex = icon.lastIndexOf("/");
    if (!icon.startsWith("textures/") || separatorIndex < 0) return unknownFishTexture;

    return `${icon.slice(0, separatorIndex)}/silhouettes/${icon.slice(separatorIndex + 1)}`;
}

function formatSize(size: number | undefined) {
    return typeof size === "number" && size > 0 ? `${round1(size)}cm` : "-";
}

function formatRange(size: SizeRange | undefined) {
    return size ? `${round1(size.min)}-${round1(size.max)}cm` : "-";
}

function round1(value: number) {
    return Math.round(value * 10) / 10;
}

function normalizeSearchText(value: string) {
    return value
        .toLowerCase()
        .replace(/§[0-9a-fklmnor]/g, "")
        .replace(/^item\./, "")
        .replace(/^(minecraft|mc):/, "")
        .replace(/[\s:_-]+/g, "");
}

function searchModeTranslateKey(mode: FishBookSearchMode) {
    return `fish.encyclopedia.search.mode.${mode}`;
}

function habitatKeyForBiome(biomeId: string) {
    const id = biomeId.replace("minecraft:", "");

    if (id.includes("mangrove")) return "fish.encyclopedia.habitat.mangrove_swamp";
    if (id.includes("swamp")) return "fish.encyclopedia.habitat.swamp";
    if (id.includes("beach") || id.includes("shore")) return "fish.encyclopedia.habitat.beach";
    if (id.includes("warm_ocean") || id.includes("lukewarm_ocean")) return "fish.encyclopedia.habitat.warm_ocean";
    if (id.includes("cold_ocean") || id.includes("frozen_ocean")) return "fish.encyclopedia.habitat.cold_ocean";
    if (id.includes("deep_ocean")) return "fish.encyclopedia.habitat.deep_ocean";
    if (id.includes("ocean")) return "fish.encyclopedia.habitat.ocean";
    if (id.includes("frozen_river")) return "fish.encyclopedia.habitat.cold_river";
    if (id.includes("river")) return "fish.encyclopedia.habitat.river";

    if (
        id.includes("taiga") ||
        id.includes("hill") ||
        id.includes("peak") ||
        id.includes("slope") ||
        id.includes("caves") ||
        id.includes("deep_dark")
    ) {
        return "fish.encyclopedia.habitat.mountain_water";
    }

    if (
        id.includes("savanna") ||
        id.includes("desert") ||
        id.includes("mesa") ||
        id.includes("jungle")
    ) {
        return "fish.encyclopedia.habitat.tropical_pond";
    }

    return "fish.encyclopedia.habitat.pond";
}
