import { Player } from "@minecraft/server";
import { ShavedIceMachineRecipes } from "@/content/cooking/shavedicemachine-recipe.js";
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
        key: "shave_ice",
        slot: 20,
        name: "cooking.action.shave_ice",
        icon: "minecraft:blue_ice",
        unlockLv: 1,
        cost: 1,
        run(session) {
            add(session, "iceFineness", 22);
            add(session, "shape", 4);
            add(session, "coldness", -5);
            add(session, "melt", 4);
        }
    },
    {
        key: "pour_syrup",
        slot: 21,
        name: "cooking.action.pour_syrup",
        icon: "minecraft:sweet_berries",
        unlockLv: 4,
        cost: 1,
        run(session) {
            add(session, "syrup", 25);
            add(session, "melt", 6);
        }
    },
    {
        key: "pack_ice",
        slot: 22,
        name: "cooking.action.pack_ice",
        icon: "minecraft:snowball",
        unlockLv: 8,
        cost: 1,
        run(session) {
            add(session, "shape", 18);
            add(session, "iceFineness", 5);
            add(session, "melt", 4);
        }
    },
    {
        key: "chill",
        slot: 23,
        name: "cooking.action.chill",
        icon: "minecraft:packed_ice",
        unlockLv: 12,
        cost: 1,
        run(session) {
            add(session, "coldness", 18);
            add(session, "melt", -10);
        }
    },
    {
        key: "shape_ice",
        slot: 24,
        name: "cooking.action.shape_ice",
        icon: "minecraft:bowl",
        unlockLv: 16,
        cost: 1,
        run(session) {
            add(session, "shape", 14);
            add(session, "syrup", 2);
            add(session, "melt", 3);
        }
    },
    {
        key: "blade_adjust",
        slot: 29,
        name: "cooking.action.blade_adjust",
        icon: "minecraft:shears",
        unlockLv: 20,
        cost: 1,
        run(session) {
            add(session, "iceFineness", 14);
            add(session, "shape", 6);
            add(session, "melt", 2);
        }
    },
    {
        key: "add_topping",
        slot: 30,
        name: "cooking.action.add_topping",
        icon: "minecraft:glow_berries",
        unlockLv: 24,
        cost: 1,
        run(session) {
            add(session, "syrup", 12);
            add(session, "shape", 8);
            add(session, "melt", 5);
        }
    },
    {
        key: "slow_shave",
        slot: 31,
        name: "cooking.action.slow_shave",
        icon: "minecraft:iron_pickaxe",
        unlockLv: 28,
        cost: 2,
        run(session) {
            add(session, "iceFineness", 30);
            add(session, "shape", 10);
            add(session, "coldness", -3);
            add(session, "melt", 3);
        }
    },
    {
        key: "quick_shave",
        slot: 32,
        name: "cooking.action.quick_shave",
        icon: "minecraft:golden_pickaxe",
        unlockLv: 32,
        cost: 1,
        run(session) {
            add(session, "iceFineness", 18);
            add(session, "shape", -6);
            add(session, "coldness", -8);
            add(session, "melt", 10);
        }
    },
    {
        key: "final_freeze",
        slot: 33,
        name: "cooking.action.final_freeze",
        icon: "minecraft:ice",
        unlockLv: 36,
        cost: 1,
        run(session) {
            add(session, "coldness", 25);
            add(session, "melt", -16);
            add(session, "shape", 4);
        }
    },
];

const statuses: SimpleStationStatus[] = [
    { name: "cooking.status.ice_fineness", color: "§b", value: (session) => `${session.iceFineness}%` },
    { name: "cooking.status.syrup", color: "§d", value: (session) => `${session.syrup}%` },
    { name: "cooking.status.coldness", color: "§3", value: (session) => `${session.coldness}%` },
    { name: "cooking.status.shape", color: "§f", value: (session) => `${session.shape}%` },
    { name: "cooking.status.melt", color: "§c", value: (session) => `${session.melt}%` },
];

const config = {
    title: "cooking.title.shaved_ice_machine",
    recipes: ShavedIceMachineRecipes,
    sessions,
    actions,
    statuses,
    openRecipeSelect,
    openCooking,
    createSession() {
        return {
            phase: "raw",
            maxActions: 9,
            iceFineness: 0,
            syrup: 0,
            coldness: 100,
            shape: 40,
            melt: 0,
        };
    },
    score(session: SimpleStationSession) {
        return targetScore(session.iceFineness, 85, 25, 25)
            + targetScore(session.syrup, 70, 25, 20)
            + targetScore(session.coldness, 90, 20, 25)
            + targetScore(session.shape, 80, 25, 18)
            + targetScore(session.melt, 8, 16, 12);
    },
};

export function openRecipeSelect(player: Player, page = 0, categoryId = "all", searchQuery = "") {
    openSimpleStationRecipeSelect(player, config, page, categoryId, searchQuery);
}

export function openCooking(player: Player) {
    openSimpleStationCooking(player, config);
}
