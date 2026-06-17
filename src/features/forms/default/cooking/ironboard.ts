import { Player } from "@minecraft/server";
import { IronBoardRecipes } from "@/content/cooking/ironboard-recipe.js";
import {
    clamp,
    openSimpleStationCooking,
    openSimpleStationRecipeSelect,
    rangeScore,
    targetScore,
    type SimpleStationAction,
    type SimpleStationSession,
    type SimpleStationStatus
} from "@/features/forms/default/cooking/simple-station-core.js";

const sessions = new Map<string, SimpleStationSession>();

function add(session: SimpleStationSession, key: string, amount: number, max = 100) {
    session[key] = clamp((session[key] ?? 0) + amount, 0, max);
}

const actions: SimpleStationAction[] = [
    {
        key: "heat_griddle",
        slot: 20,
        name: "cooking.action.heat_griddle",
        icon: "minecraft:fire_charge",
        unlockLv: 1,
        cost: 1,
        run(session) {
            add(session, "temperature", 25, 250);
            add(session, "sear", 12);
            add(session, "smoke", 4);
        }
    },
    {
        key: "turn",
        slot: 21,
        name: "cooking.action.turn",
        icon: "minecraft:stick",
        unlockLv: 4,
        cost: 1,
        run(session) {
            add(session, "evenness", 14);
            add(session, "sear", 8);
            add(session, "temperature", -3, 250);
        }
    },
    {
        key: "press",
        slot: 22,
        name: "cooking.action.press",
        icon: "minecraft:iron_ingot",
        unlockLv: 8,
        cost: 2,
        run(session) {
            add(session, "sear", 18);
            add(session, "evenness", 4);
            add(session, "smoke", 8);
        }
    },
    {
        key: "add_oil",
        slot: 23,
        name: "cooking.action.add_oil",
        icon: "mc:food_oil",
        unlockLv: 12,
        cost: 1,
        run(session) {
            add(session, "oil", 22);
            add(session, "smoke", -3);
            add(session, "evenness", 2);
        }
    },
    {
        key: "scrape",
        slot: 24,
        name: "cooking.action.scrape",
        icon: "minecraft:flint",
        unlockLv: 16,
        cost: 1,
        run(session) {
            add(session, "smoke", -16);
            add(session, "evenness", 4);
            add(session, "oil", -5);
        }
    },
    {
        key: "control_flame",
        slot: 29,
        name: "cooking.action.control_flame",
        icon: "minecraft:redstone_torch",
        unlockLv: 20,
        cost: 1,
        run(session) {
            add(session, "temperature", -18, 250);
            add(session, "smoke", -6);
            add(session, "evenness", 5);
        }
    },
    {
        key: "baste",
        slot: 30,
        name: "cooking.action.baste",
        icon: "minecraft:honey_bottle",
        unlockLv: 24,
        cost: 1,
        run(session) {
            add(session, "oil", 12);
            add(session, "sear", 8);
            add(session, "evenness", 8);
            add(session, "smoke", 3);
        }
    },
    {
        key: "rest_griddle",
        slot: 31,
        name: "cooking.action.rest_griddle",
        icon: "minecraft:clock",
        unlockLv: 28,
        cost: 1,
        run(session) {
            add(session, "temperature", -10, 250);
            add(session, "evenness", 10);
            add(session, "smoke", -5);
        }
    },
    {
        key: "crisp_edges",
        slot: 32,
        name: "cooking.action.crisp_edges",
        icon: "minecraft:golden_hoe",
        unlockLv: 32,
        cost: 2,
        run(session) {
            add(session, "sear", 22);
            add(session, "temperature", 12, 250);
            add(session, "oil", -6);
            add(session, "smoke", 10);
        }
    },
    {
        key: "sauce_finish",
        slot: 33,
        name: "cooking.action.sauce_finish",
        icon: "mc:syoyu",
        unlockLv: 36,
        cost: 1,
        run(session) {
            add(session, "sear", 8);
            add(session, "evenness", 12);
            add(session, "oil", 5);
            add(session, "smoke", 4);
        }
    },
];

const statuses: SimpleStationStatus[] = [
    { name: "cooking.status.temperature", color: "§c", value: (session) => `${session.temperature}°C` },
    { name: "cooking.status.sear", color: "§6", value: (session) => `${session.sear}%` },
    { name: "cooking.status.evenness", color: "§a", value: (session) => `${session.evenness}%` },
    { name: "cooking.status.oil", color: "§e", value: (session) => `${session.oil}%` },
    { name: "cooking.status.smoke", color: "§7", value: (session) => `${session.smoke}%` },
];

const config = {
    title: "cooking.title.iron_board",
    recipes: IronBoardRecipes,
    sessions,
    actions,
    statuses,
    openRecipeSelect,
    openCooking,
    createSession() {
        return {
            phase: "raw",
            maxActions: 10,
            temperature: 60,
            sear: 0,
            evenness: 50,
            oil: 40,
            smoke: 0,
        };
    },
    score(session: SimpleStationSession) {
        return rangeScore(session.temperature, 150, 210, 25)
            + targetScore(session.sear, 80, 30, 25)
            + targetScore(session.evenness, 85, 30, 25)
            + targetScore(session.oil, 55, 20, 15)
            + targetScore(session.smoke, 10, 25, 10);
    },
};

export function openRecipeSelect(player: Player, page = 0, categoryId = "all", searchQuery = "") {
    openSimpleStationRecipeSelect(player, config, page, categoryId, searchQuery);
}

export function openCooking(player: Player) {
    openSimpleStationCooking(player, config);
}
