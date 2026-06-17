import { Player } from "@minecraft/server";
import { CuttingBoardRecipes } from "@/content/cooking/cuttingboard-recipe.js";
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
        key: "cut",
        slot: 20,
        name: "cooking.action.cut",
        icon: "minecraft:iron_sword",
        unlockLv: 1,
        cost: 1,
        run(session) {
            add(session, "progress", 22);
            add(session, "precision", 8);
            add(session, "speed", 6);
            add(session, "cleanliness", -5);
        }
    },
    {
        key: "fine_chop",
        slot: 21,
        name: "cooking.action.fine_chop",
        icon: "minecraft:iron_axe",
        unlockLv: 4,
        cost: 2,
        run(session) {
            add(session, "progress", 28);
            add(session, "precision", 14);
            add(session, "speed", -4);
            add(session, "cleanliness", -8);
        }
    },
    {
        key: "align",
        slot: 22,
        name: "cooking.action.align",
        icon: "minecraft:stick",
        unlockLv: 8,
        cost: 1,
        run(session) {
            add(session, "progress", 5);
            add(session, "precision", 16);
            add(session, "speed", -3);
        }
    },
    {
        key: "wipe_board",
        slot: 23,
        name: "cooking.action.wipe_board",
        icon: "minecraft:paper",
        unlockLv: 12,
        cost: 1,
        run(session) {
            add(session, "progress", -3);
            add(session, "cleanliness", 20);
        }
    },
    {
        key: "plate",
        slot: 24,
        name: "cooking.action.plate",
        icon: "minecraft:bowl",
        unlockLv: 16,
        cost: 1,
        run(session) {
            add(session, "progress", 10);
            add(session, "precision", 6);
            add(session, "cleanliness", 3);
        }
    },
    {
        key: "sharpen_knife",
        slot: 29,
        name: "cooking.action.sharpen_knife",
        icon: "minecraft:iron_sword",
        unlockLv: 20,
        cost: 1,
        run(session) {
            add(session, "precision", 22);
            add(session, "speed", 6);
            add(session, "cleanliness", -2);
        }
    },
    {
        key: "julienne",
        slot: 30,
        name: "cooking.action.julienne",
        icon: "minecraft:shears",
        unlockLv: 24,
        cost: 2,
        run(session) {
            add(session, "progress", 24);
            add(session, "precision", 20);
            add(session, "speed", -6);
            add(session, "cleanliness", -7);
        }
    },
    {
        key: "portion",
        slot: 31,
        name: "cooking.action.portion",
        icon: "minecraft:stone_button",
        unlockLv: 28,
        cost: 1,
        run(session) {
            add(session, "progress", 12);
            add(session, "precision", 12);
            add(session, "speed", -2);
        }
    },
    {
        key: "quick_cut",
        slot: 32,
        name: "cooking.action.quick_cut",
        icon: "minecraft:golden_sword",
        unlockLv: 32,
        cost: 1,
        run(session) {
            add(session, "progress", 32);
            add(session, "speed", 16);
            add(session, "precision", -10);
            add(session, "cleanliness", -10);
        }
    },
    {
        key: "sanitize",
        slot: 33,
        name: "cooking.action.sanitize",
        icon: "minecraft:bucket",
        unlockLv: 36,
        cost: 2,
        run(session) {
            add(session, "cleanliness", 35);
            add(session, "precision", 4);
            add(session, "progress", -5);
        }
    },
];

const statuses: SimpleStationStatus[] = [
    { name: "cooking.status.progress", color: "§a", value: (session) => `${session.progress}%` },
    { name: "cooking.status.precision", color: "§e", value: (session) => `${session.precision}%` },
    { name: "cooking.status.speed", color: "§b", value: (session) => `${session.speed}%` },
    { name: "cooking.status.cleanliness", color: "§f", value: (session) => `${session.cleanliness}%` },
];

const config = {
    title: "cooking.title.cutting_board",
    recipes: CuttingBoardRecipes,
    sessions,
    actions,
    statuses,
    openRecipeSelect,
    openCooking,
    createSession() {
        return {
            phase: "raw",
            maxActions: 10,
            progress: 0,
            precision: 45,
            speed: 40,
            cleanliness: 100,
        };
    },
    score(session: SimpleStationSession) {
        return targetScore(session.progress, 100, 35, 25)
            + targetScore(session.precision, 85, 30, 25)
            + targetScore(session.speed, 70, 25, 20)
            + targetScore(session.cleanliness, 90, 25, 25)
            + targetScore(session.actions, 9, 3, 5);
    },
};

export function openRecipeSelect(player: Player, page = 0, categoryId = "all", searchQuery = "") {
    openSimpleStationRecipeSelect(player, config, page, categoryId, searchQuery);
}

export function openCooking(player: Player) {
    openSimpleStationCooking(player, config);
}
