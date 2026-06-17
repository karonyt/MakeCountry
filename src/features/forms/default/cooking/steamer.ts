import { Player } from "@minecraft/server";
import { SteamerRecipes } from "@/content/cooking/steamer-recipe.js";
import {
    clamp,
    openSimpleStationCooking,
    openSimpleStationRecipeSelect,
    targetScore,
    type SimpleStationAction,
    type SimpleStationSession,
    type SimpleStationStatus
} from "@/features/forms/default/cooking/simple-station-core.js";

const sessions = new Map<string, SimpleStationSession>();

function add(session: SimpleStationSession, key: string, amount: number) {
    session[key] = clamp((session[key] ?? 0) + amount);
}

const actions: SimpleStationAction[] = [
    {
        key: "add_water",
        slot: 20,
        name: "cooking.action.add_water",
        icon: "minecraft:water_bucket",
        unlockLv: 1,
        cost: 1,
        run(session) {
            add(session, "moisture", 15);
            add(session, "steam", 5);
            add(session, "heat", -2);
        }
    },
    {
        key: "raise_steam",
        slot: 21,
        name: "cooking.action.raise_steam",
        icon: "minecraft:campfire",
        unlockLv: 4,
        cost: 1,
        run(session) {
            add(session, "steam", 18);
            add(session, "heat", 10);
            add(session, "moisture", -3);
            add(session, "softness", 8);
        }
    },
    {
        key: "keep_steam",
        slot: 22,
        name: "cooking.action.keep_steam",
        icon: "minecraft:clock",
        unlockLv: 8,
        cost: 2,
        run(session) {
            add(session, "steam", 12);
            add(session, "softness", 15);
            add(session, "timing", 5);
            add(session, "heat", 2);
        }
    },
    {
        key: "rotate",
        slot: 23,
        name: "cooking.action.rotate",
        icon: "minecraft:compass",
        unlockLv: 12,
        cost: 1,
        run(session) {
            add(session, "timing", 15);
            add(session, "softness", 6);
            add(session, "steam", -2);
        }
    },
    {
        key: "open_lid",
        slot: 24,
        name: "cooking.action.open_lid",
        icon: "minecraft:trapdoor",
        unlockLv: 16,
        cost: 1,
        run(session) {
            add(session, "heat", -8);
            add(session, "steam", -12);
            add(session, "moisture", -5);
            add(session, "timing", 12);
        }
    },
    {
        key: "check_texture",
        slot: 29,
        name: "cooking.action.check_texture",
        icon: "minecraft:spyglass",
        unlockLv: 20,
        cost: 1,
        run(session) {
            add(session, "timing", 18);
            add(session, "softness", 4);
            add(session, "steam", -3);
        }
    },
    {
        key: "wrap_steam",
        slot: 30,
        name: "cooking.action.wrap_steam",
        icon: "minecraft:paper",
        unlockLv: 24,
        cost: 1,
        run(session) {
            add(session, "steam", 14);
            add(session, "moisture", 10);
            add(session, "softness", 6);
        }
    },
    {
        key: "lower_heat",
        slot: 31,
        name: "cooking.action.lower_heat",
        icon: "minecraft:blue_ice",
        unlockLv: 28,
        cost: 1,
        run(session) {
            add(session, "heat", -14);
            add(session, "moisture", 5);
            add(session, "steam", -4);
        }
    },
    {
        key: "rest_steam",
        slot: 32,
        name: "cooking.action.rest_steam",
        icon: "minecraft:clock",
        unlockLv: 32,
        cost: 2,
        run(session) {
            add(session, "softness", 20);
            add(session, "timing", 12);
            add(session, "steam", 6);
            add(session, "heat", -4);
        }
    },
    {
        key: "finish_glaze",
        slot: 33,
        name: "cooking.action.finish_glaze",
        icon: "minecraft:honey_bottle",
        unlockLv: 36,
        cost: 1,
        run(session) {
            add(session, "softness", 8);
            add(session, "moisture", 8);
            add(session, "timing", 6);
        }
    },
];

const statuses: SimpleStationStatus[] = [
    { name: "cooking.status.steam", color: "§f", value: (session) => `${session.steam}%` },
    { name: "cooking.status.heat", color: "§c", value: (session) => `${session.heat}%` },
    { name: "cooking.status.moisture", color: "§b", value: (session) => `${session.moisture}%` },
    { name: "cooking.status.softness", color: "§e", value: (session) => `${session.softness}%` },
    { name: "cooking.status.timing", color: "§d", value: (session) => `${session.timing}%` },
];

const config = {
    title: "cooking.title.steamer",
    recipes: SteamerRecipes,
    sessions,
    actions,
    statuses,
    openRecipeSelect,
    openCooking,
    createSession() {
        return {
            phase: "raw",
            maxActions: 10,
            steam: 0,
            heat: 40,
            moisture: 65,
            softness: 0,
            timing: 50,
        };
    },
    score(session: SimpleStationSession) {
        return targetScore(session.steam, 80, 25, 22)
            + targetScore(session.heat, 75, 25, 18)
            + targetScore(session.moisture, 70, 25, 18)
            + targetScore(session.softness, 100, 35, 24)
            + targetScore(session.timing, 85, 25, 18);
    },
};

export function openRecipeSelect(player: Player, page = 0, categoryId = "all", searchQuery = "") {
    openSimpleStationRecipeSelect(player, config, page, categoryId, searchQuery);
}

export function openCooking(player: Player) {
    openSimpleStationCooking(player, config);
}
