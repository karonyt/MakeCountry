import type {
    CookingRouteDefinition,
    CookingTroubleDefinition,
} from "@/domain/cooking/station-minigame.js";

export type SimpleStationMinigameId =
    | "cutting_board"
    | "fermentation_machine"
    | "iron_board"
    | "rice_cooker"
    | "shaved_ice_machine"
    | "steamer";

type StationMinigameDefinition = {
    routes: CookingRouteDefinition[];
    troubles: CookingTroubleDefinition[];
};

function route(
    id: string,
    minLevel: number,
    icon: string,
    prep: string[],
    process: string[],
    finish: string[],
): CookingRouteDefinition {
    return {
        id,
        name: `cooking.route.${id}.name`,
        description: `cooking.route.${id}.description`,
        icon,
        minLevel,
        rewardBonus: id === "artisan" ? 2 : id === "bold" ? 1 : 0,
        stages: [
            { id: "prep", label: "cooking.stage.prep", actionKeys: prep },
            { id: "process", label: "cooking.stage.process", actionKeys: process },
            { id: "finish", label: "cooking.stage.finish", actionKeys: finish },
        ],
    };
}

function trouble(
    id: string,
    minLevel: number,
    chance: number,
    icon: string,
    recoveryActionKeys: string[],
    recoveryStages?: string[][],
): CookingTroubleDefinition {
    return {
        id,
        name: `cooking.trouble.${id}.name`,
        description: `cooking.trouble.${id}.description`,
        icon,
        minLevel,
        chance,
        recoveryActionKeys,
        recoveryStages,
    };
}

const DEFINITIONS: Record<SimpleStationMinigameId, StationMinigameDefinition> = {
    cutting_board: {
        routes: [
            route("steady", 1, "minecraft:iron_sword",
                ["cut", "align"], ["cut", "fine_chop"], ["cut", "plate"]),
            route("bold", 4, "minecraft:iron_axe",
                ["cut", "align"], ["fine_chop", "quick_cut"], ["cut", "portion", "plate"]),
            route("artisan", 24, "minecraft:shears",
                ["sharpen_knife", "align"], ["julienne", "fine_chop"], ["portion", "plate"]),
        ],
        troubles: [
            trouble("blade_stall", 1, 0.14, "minecraft:damaged_anvil", ["cut", "sharpen_knife"]),
            trouble("messy_board", 20, 0.18, "minecraft:paper", ["wipe_board", "sanitize"], [["wipe_board"], ["sanitize", "align"]]),
        ],
    },
    fermentation_machine: {
        routes: [
            route("steady", 1, "minecraft:potion",
                ["warm", "cool"], ["warm", "ferment"], ["warm", "release_pressure"]),
            route("bold", 8, "minecraft:blaze_powder",
                ["warm", "stir_culture"], ["ferment", "add_starter"], ["cool", "release_pressure"]),
            route("artisan", 24, "minecraft:barrel",
                ["stir_culture", "add_starter"], ["age", "smoke"], ["filter", "seal"]),
        ],
        troubles: [
            trouble("culture_stall", 1, 0.14, "minecraft:spider_eye", ["warm", "stir_culture"]),
            trouble("pressure_spike", 20, 0.18, "minecraft:glass_bottle", ["release_pressure", "cool"], [["release_pressure"], ["cool", "filter"]]),
        ],
    },
    iron_board: {
        routes: [
            route("steady", 1, "minecraft:campfire",
                ["heat_griddle", "add_oil"], ["heat_griddle", "turn"], ["heat_griddle", "rest_griddle"]),
            route("bold", 8, "minecraft:iron_ingot",
                ["heat_griddle", "add_oil"], ["press", "turn"], ["scrape", "rest_griddle"]),
            route("artisan", 24, "minecraft:honey_bottle",
                ["control_flame", "add_oil"], ["baste", "crisp_edges"], ["sauce_finish", "rest_griddle"]),
        ],
        troubles: [
            trouble("cold_surface", 1, 0.14, "minecraft:blue_ice", ["heat_griddle"]),
            trouble("smoke_cloud", 20, 0.18, "minecraft:campfire", ["scrape", "control_flame"], [["scrape"], ["control_flame", "rest_griddle"]]),
        ],
    },
    rice_cooker: {
        routes: [
            route("steady", 1, "minecraft:bowl",
                ["add_water", "rinse_rice"], ["add_water", "cook_rice"], ["add_water", "fluff"]),
            route("bold", 8, "minecraft:campfire",
                ["add_water", "soak"], ["cook_rice", "steam"], ["vent", "fluff"]),
            route("artisan", 24, "minecraft:clock",
                ["rinse_rice", "soak"], ["keep_warm", "adjust_water"], ["final_steam", "fluff"]),
        ],
        troubles: [
            trouble("dry_pot", 1, 0.14, "minecraft:bucket", ["add_water", "adjust_water"]),
            trouble("steam_lock", 20, 0.18, "minecraft:glass_bottle", ["vent", "adjust_water"], [["vent"], ["adjust_water", "fluff"]]),
        ],
    },
    shaved_ice_machine: {
        routes: [
            route("steady", 1, "minecraft:snowball",
                ["shave_ice", "blade_adjust"], ["shave_ice", "pack_ice"], ["shave_ice", "pour_syrup"]),
            route("bold", 8, "minecraft:blue_ice",
                ["shave_ice", "blade_adjust"], ["pack_ice", "quick_shave"], ["pour_syrup", "shape_ice"]),
            route("artisan", 24, "minecraft:packed_ice",
                ["blade_adjust", "slow_shave"], ["pack_ice", "shape_ice"], ["add_topping", "final_freeze"]),
        ],
        troubles: [
            trouble("blade_jam", 1, 0.14, "minecraft:damaged_anvil", ["shave_ice", "blade_adjust"]),
            trouble("melting_ice", 20, 0.18, "minecraft:ice", ["chill", "final_freeze"], [["chill"], ["shape_ice", "final_freeze"]]),
        ],
    },
    steamer: {
        routes: [
            route("steady", 1, "minecraft:water_bucket",
                ["add_water", "wrap_steam"], ["add_water", "raise_steam"], ["add_water", "open_lid"]),
            route("bold", 8, "minecraft:campfire",
                ["add_water", "wrap_steam"], ["raise_steam", "keep_steam"], ["rotate", "open_lid"]),
            route("artisan", 24, "minecraft:clock",
                ["wrap_steam", "lower_heat"], ["keep_steam", "rotate"], ["rest_steam", "finish_glaze"]),
        ],
        troubles: [
            trouble("dry_boiler", 1, 0.14, "minecraft:bucket", ["add_water"]),
            trouble("steam_surge", 20, 0.18, "minecraft:campfire", ["open_lid", "lower_heat"], [["open_lid"], ["lower_heat", "rest_steam"]]),
        ],
    },
};

export function getSimpleStationMinigame(id: SimpleStationMinigameId): StationMinigameDefinition {
    return DEFINITIONS[id];
}
