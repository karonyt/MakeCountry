import { Player } from "@minecraft/server";
import { FermentationMachineRecipes } from "@/content/cooking/fermentationmachine-recipe.js";
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

function add(session: SimpleStationSession, key: string, amount: number, max = 100) {
    session[key] = clamp((session[key] ?? 0) + amount, 0, max);
}

const actions: SimpleStationAction[] = [
    {
        key: "warm",
        slot: 20,
        name: "cooking.action.warm",
        icon: "minecraft:blaze_powder",
        unlockLv: 1,
        cost: 1,
        run(session) {
            add(session, "temperature", 8, 80);
            add(session, "fermentation", 8);
            add(session, "pressure", 4);
        }
    },
    {
        key: "cool",
        slot: 21,
        name: "cooking.action.cool",
        icon: "minecraft:blue_ice",
        unlockLv: 4,
        cost: 1,
        run(session) {
            add(session, "temperature", -7, 80);
            add(session, "purity", 3);
            add(session, "pressure", -2);
        }
    },
    {
        key: "ferment",
        slot: 22,
        name: "cooking.action.ferment",
        icon: "minecraft:potion",
        unlockLv: 8,
        cost: 2,
        run(session) {
            add(session, "fermentation", 14);
            add(session, "aging", 5);
            add(session, "pressure", 6);
            add(session, "purity", -3);
        }
    },
    {
        key: "release_pressure",
        slot: 23,
        name: "cooking.action.release_pressure",
        icon: "minecraft:glass_bottle",
        unlockLv: 12,
        cost: 1,
        run(session) {
            add(session, "pressure", -15);
            add(session, "purity", 2);
        }
    },
    {
        key: "age",
        slot: 24,
        name: "cooking.action.age",
        icon: "minecraft:clock",
        unlockLv: 16,
        cost: 2,
        run(session) {
            add(session, "aging", 18);
            add(session, "fermentation", 5);
            add(session, "temperature", -2, 80);
            add(session, "pressure", 4);
        }
    },
    {
        key: "stir_culture",
        slot: 29,
        name: "cooking.action.stir_culture",
        icon: "minecraft:stick",
        unlockLv: 20,
        cost: 1,
        run(session) {
            add(session, "fermentation", 10);
            add(session, "purity", 5);
            add(session, "pressure", 3);
        }
    },
    {
        key: "add_starter",
        slot: 30,
        name: "cooking.action.add_starter",
        icon: "mc:yeast",
        unlockLv: 24,
        cost: 2,
        run(session) {
            add(session, "fermentation", 22);
            add(session, "pressure", 8);
            add(session, "purity", -5);
        }
    },
    {
        key: "smoke",
        slot: 31,
        name: "cooking.action.smoke",
        icon: "minecraft:campfire",
        unlockLv: 28,
        cost: 2,
        run(session) {
            add(session, "aging", 14);
            add(session, "temperature", 5, 80);
            add(session, "pressure", 5);
            add(session, "purity", -3);
        }
    },
    {
        key: "filter",
        slot: 32,
        name: "cooking.action.filter",
        icon: "minecraft:string",
        unlockLv: 32,
        cost: 1,
        run(session) {
            add(session, "purity", 18);
            add(session, "fermentation", -4);
            add(session, "pressure", -3);
        }
    },
    {
        key: "seal",
        slot: 33,
        name: "cooking.action.seal",
        icon: "minecraft:barrel",
        unlockLv: 36,
        cost: 1,
        run(session) {
            add(session, "pressure", 12);
            add(session, "aging", 10);
            add(session, "purity", 4);
        }
    },
];

const statuses: SimpleStationStatus[] = [
    { name: "cooking.status.fermentation", color: "§a", value: (session) => `${session.fermentation}%` },
    { name: "cooking.status.temperature", color: "§c", value: (session) => `${session.temperature}°C` },
    { name: "cooking.status.aging", color: "§6", value: (session) => `${session.aging}%` },
    { name: "cooking.status.purity", color: "§f", value: (session) => `${session.purity}%` },
    { name: "cooking.status.pressure", color: "§e", value: (session) => `${session.pressure}%` },
];

const config = {
    title: "cooking.title.fermentation_machine",
    recipes: FermentationMachineRecipes,
    sessions,
    actions,
    statuses,
    openRecipeSelect,
    openCooking,
    createSession() {
        return {
            phase: "raw",
            maxActions: 12,
            fermentation: 0,
            temperature: 20,
            aging: 0,
            purity: 70,
            pressure: 15,
        };
    },
    score(session: SimpleStationSession) {
        return targetScore(session.fermentation, 100, 40, 24)
            + targetScore(session.temperature, 28, 12, 20)
            + targetScore(session.aging, 65, 30, 20)
            + targetScore(session.purity, 90, 25, 24)
            + targetScore(session.pressure, 20, 20, 12);
    },
};

export function openRecipeSelect(player: Player, page = 0, categoryId = "all", searchQuery = "") {
    openSimpleStationRecipeSelect(player, config, page, categoryId, searchQuery);
}

export function openCooking(player: Player) {
    openSimpleStationCooking(player, config);
}
