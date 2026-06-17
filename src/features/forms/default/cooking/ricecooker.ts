import { Player } from "@minecraft/server";
import { RiceCookerRecipes } from "@/content/cooking/ricecooker-recipe.js";
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
            add(session, "water", 18);
            add(session, "heat", -2);
            add(session, "steam", 5);
        }
    },
    {
        key: "cook_rice",
        slot: 21,
        name: "cooking.action.cook_rice",
        icon: "minecraft:furnace",
        unlockLv: 4,
        cost: 2,
        run(session) {
            add(session, "heat", 20);
            add(session, "steam", 12);
            add(session, "doneness", 15);
            add(session, "water", -8);
        }
    },
    {
        key: "steam",
        slot: 22,
        name: "cooking.action.steam",
        icon: "minecraft:campfire",
        unlockLv: 8,
        cost: 1,
        run(session) {
            add(session, "steam", 22);
            add(session, "doneness", 12);
            add(session, "fluffiness", 5);
            add(session, "water", -4);
        }
    },
    {
        key: "vent",
        slot: 23,
        name: "cooking.action.vent",
        icon: "minecraft:glass_bottle",
        unlockLv: 12,
        cost: 1,
        run(session) {
            add(session, "steam", -12);
            add(session, "water", -5);
            add(session, "fluffiness", 5);
        }
    },
    {
        key: "fluff",
        slot: 24,
        name: "cooking.action.fluff",
        icon: "minecraft:feather",
        unlockLv: 16,
        cost: 1,
        run(session) {
            add(session, "fluffiness", 18);
            add(session, "doneness", 5);
            add(session, "steam", -5);
        }
    },
    {
        key: "rinse_rice",
        slot: 29,
        name: "cooking.action.rinse_rice",
        icon: "minecraft:water_bucket",
        unlockLv: 20,
        cost: 1,
        run(session) {
            add(session, "water", 10);
            add(session, "fluffiness", 8);
            add(session, "heat", -4);
        }
    },
    {
        key: "soak",
        slot: 30,
        name: "cooking.action.soak",
        icon: "minecraft:clock",
        unlockLv: 24,
        cost: 2,
        run(session) {
            add(session, "water", 8);
            add(session, "fluffiness", 14);
            add(session, "doneness", 6);
            add(session, "steam", -3);
        }
    },
    {
        key: "keep_warm",
        slot: 31,
        name: "cooking.action.keep_warm",
        icon: "minecraft:torch",
        unlockLv: 28,
        cost: 1,
        run(session) {
            add(session, "heat", 8);
            add(session, "steam", 8);
            add(session, "doneness", 8);
            add(session, "water", -3);
        }
    },
    {
        key: "adjust_water",
        slot: 32,
        name: "cooking.action.adjust_water",
        icon: "minecraft:glass_bottle",
        unlockLv: 32,
        cost: 1,
        run(session) {
            if (session.water < 55) add(session, "water", 14);
            else add(session, "water", -14);
            add(session, "fluffiness", 4);
        }
    },
    {
        key: "final_steam",
        slot: 33,
        name: "cooking.action.final_steam",
        icon: "minecraft:campfire",
        unlockLv: 36,
        cost: 2,
        run(session) {
            add(session, "steam", 18);
            add(session, "doneness", 18);
            add(session, "fluffiness", 10);
            add(session, "water", -8);
        }
    },
];

const statuses: SimpleStationStatus[] = [
    { name: "cooking.status.water", color: "§b", value: (session) => `${session.water}%` },
    { name: "cooking.status.heat", color: "§c", value: (session) => `${session.heat}%` },
    { name: "cooking.status.steam", color: "§f", value: (session) => `${session.steam}%` },
    { name: "cooking.status.fluffiness", color: "§e", value: (session) => `${session.fluffiness}%` },
    { name: "cooking.status.doneness", color: "§a", value: (session) => `${session.doneness}%` },
];

const config = {
    title: "cooking.title.rice_cooker",
    recipes: RiceCookerRecipes,
    sessions,
    actions,
    statuses,
    openRecipeSelect,
    openCooking,
    createSession() {
        return {
            phase: "raw",
            maxActions: 10,
            water: 55,
            heat: 20,
            steam: 0,
            fluffiness: 40,
            doneness: 0,
        };
    },
    score(session: SimpleStationSession) {
        return targetScore(session.water, 55, 20, 18)
            + targetScore(session.heat, 80, 30, 18)
            + targetScore(session.steam, 70, 25, 18)
            + targetScore(session.fluffiness, 85, 30, 20)
            + targetScore(session.doneness, 100, 35, 26);
    },
};

export function openRecipeSelect(player: Player, page = 0, categoryId = "all", searchQuery = "") {
    openSimpleStationRecipeSelect(player, config, page, categoryId, searchQuery);
}

export function openCooking(player: Player) {
    openSimpleStationCooking(player, config);
}
