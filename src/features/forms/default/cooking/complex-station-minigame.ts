import { getCookwareScoreBonus, getCookingEquipmentLore } from '@/domain/cooking/cookware.js';
import { Player } from "@minecraft/server";
import { itemIdToPath } from "@/config/textures.js";
import { evaluateCookingCompletion } from "@/domain/cooking/completion.js";
import {
    advanceCookingRoute,
    applyCookingTroubleChoice,
    getAvailableCookingRoutes,
    getChefTechniqueProfile,
    getCookingTechniqueAdjustment,
    maybeStartCookingTrouble,
    type CookingActionAccess,
    type CookingRouteDefinition,
    type CookingTechniqueState,
    type CookingTroubleDefinition,
} from "@/domain/cooking/station-minigame.js";
import { JobLevel } from "@/domain/jobs/job-level.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";

export type ComplexCookingStationId =
    | "frying_pan"
    | "mixer"
    | "oven"
    | "stew"
    | "deep_stew"
    | "deep_fryer";

type ComplexAction = CookingActionAccess & {
    name: string;
    icon: string;
};

type ComplexStationDefinition = {
    routes: CookingRouteDefinition[];
    troubles: CookingTroubleDefinition[];
};

type ComplexSession = CookingTechniqueState & {
    routeId?: string;
    actions: number;
    maxActions: number;
    [key: string]: any;
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

const DEFINITIONS: Record<ComplexCookingStationId, ComplexStationDefinition> = {
    frying_pan: {
        routes: [
            route("steady", 1, "minecraft:iron_sword",
                ["fire_up"], ["flip", "fire_up"], ["flip", "careful_flip"]),
            route("bold", 10, "minecraft:fire_charge",
                ["seasoning", "gentle_fire"], ["strong_fire", "hard_press", "flip"], ["cool_down", "careful_flip"]),
            route("artisan", 30, "minecraft:clock",
                ["timing_check", "gentle_fire"], ["strong_fire", "hard_press"], ["careful_flip", "rest_pan"]),
        ],
        troubles: [
            trouble("cold_surface", 1, 0.12, "minecraft:blue_ice", ["fire_up", "gentle_fire"]),
            trouble("grease_flare", 15, 0.18, "minecraft:fire_charge", ["cool_down", "careful_flip"], [["cool_down"], ["careful_flip", "rest_pan"]]),
        ],
    },
    mixer: {
        routes: [
            route("steady", 1, "minecraft:glass_bottle",
                ["increase_speed"], ["blend", "increase_speed"], ["blend"]),
            route("bold", 10, "minecraft:redstone",
                ["add_additive", "increase_speed"], ["vigorous_blend", "pulse"], ["reduce_speed", "blend"]),
            route("artisan", 30, "minecraft:potion",
                ["taste_test", "add_additive"], ["turbo_mix", "pulse"], ["chill", "rest"]),
        ],
        troubles: [
            trouble("mixture_stall", 1, 0.12, "minecraft:slime_ball", ["increase_speed", "blend"]),
            trouble("foam_surge", 25, 0.18, "minecraft:honey_bottle", ["reduce_speed", "chill"], [["reduce_speed"], ["chill", "rest"]]),
        ],
    },
    oven: {
        routes: [
            route("steady", 1, "minecraft:furnace",
                ["increase_temp"], ["rotate_tray", "increase_temp"], ["rotate_tray"]),
            route("bold", 10, "minecraft:blaze_rod",
                ["add_topping", "increase_temp"], ["convection_mode", "high_heat_blast"], ["reduce_temp", "open_check"]),
            route("artisan", 30, "minecraft:honey_bottle",
                ["open_check", "add_topping"], ["steam_injection", "convection_mode"], ["glaze_spray", "rest_cooling"]),
        ],
        troubles: [
            trouble("cold_oven", 1, 0.12, "minecraft:blue_ice", ["increase_temp"]),
            trouble("hot_spot", 15, 0.18, "minecraft:fire_charge", ["open_check", "rotate_tray"], [["open_check", "reduce_temp"], ["rotate_tray", "rest_cooling"]]),
        ],
    },
    stew: {
        routes: [
            route("steady", 1, "minecraft:cauldron",
                ["increase_heat"], ["stir", "increase_heat"], ["stir"]),
            route("bold", 10, "minecraft:magma_cream",
                ["add_seasoning", "increase_heat"], ["vigorous_stir", "simmer"], ["reduce_heat", "skim_foam"]),
            route("artisan", 30, "minecraft:honey_bottle",
                ["taste_test", "add_seasoning"], ["rapid_boil", "simmer"], ["skim_foam", "rest"]),
        ],
        troubles: [
            trouble("cold_broth", 1, 0.12, "minecraft:blue_ice", ["increase_heat"]),
            trouble("boil_over", 10, 0.18, "minecraft:water_bucket", ["reduce_heat", "stir"], [["reduce_heat"], ["stir", "vigorous_stir"]]),
        ],
    },
    deep_stew: {
        routes: [
            route("steady", 1, "minecraft:cauldron",
                ["increase_heat"], ["stir", "increase_heat"], ["stir"]),
            route("bold", 12, "minecraft:campfire",
                ["layer_ingredients", "add_seasoning"], ["slow_cook", "simmer"], ["reduce_heat", "press_down"]),
            route("artisan", 30, "minecraft:dragon_breath",
                ["taste_test", "add_broth"], ["deep_stir", "extract_essence"], ["skim_foam", "infuse_herbs", "rest"]),
        ],
        troubles: [
            trouble("thin_stock", 1, 0.12, "minecraft:potion", ["increase_heat", "stir"]),
            trouble("scorched_base", 28, 0.18, "minecraft:charcoal", ["reduce_heat", "deep_stir"], [["reduce_heat"], ["deep_stir", "add_broth"]]),
        ],
    },
    deep_fryer: {
        routes: [
            route("steady", 1, "minecraft:bucket",
                ["increase_heat"], ["flip", "increase_heat"], ["drain_oil"]),
            route("bold", 10, "minecraft:golden_carrot",
                ["add_coating", "remove_excess_moisture"], ["double_fry", "shake_basket"], ["drain_oil", "rest_on_rack"]),
            route("artisan", 30, "minecraft:glowstone_dust",
                ["batter_test", "add_aromatics"], ["gentle_fry", "flash_fry"], ["season_hot", "perfect_drain", "oil_refresh"]),
        ],
        troubles: [
            trouble("cold_oil", 1, 0.12, "minecraft:blue_ice", ["increase_heat"]),
            trouble("oil_flare", 20, 0.18, "minecraft:fire_charge", ["reduce_heat", "drain_oil"], [["reduce_heat", "temperature_control"], ["drain_oil", "skim_debris"]]),
        ],
    },
};

const textureByItemId = itemIdToPath as Record<string, string>;
const COMPLEX_PROGRESS_TARGET = 80;

function icon(itemId: string) {
    return textureByItemId[itemId] ?? itemId;
}

export function initializeComplexCookingMinigame(session: Record<string, any>) {
    Object.assign(session, {
        routeId: undefined,
        stageIndex: 0,
        technique: 0,
        routeCycles: 0,
        mistakePenalty: 0,
        recoveryBonus: 0,
        troubleId: undefined,
        troubleSeverity: 0,
        troubleProgress: 0,
        lastOutcome: undefined,
    });
    return session;
}

export function ensureComplexCookingRoute(
    player: Player,
    stationId: ComplexCookingStationId,
    session: ComplexSession,
    actions: ComplexAction[],
    reopen: (player: any) => void,
) {
    const definition = DEFINITIONS[stationId];
    if (definition.routes.some((route) => route.id === session.routeId)) return true;

    const level = new JobLevel(player, "chef").getLevel();
    const routes = getAvailableCookingRoutes(definition.routes, actions, level);
    if (routes.length === 0) return true;

    const form = new ChestFormData("small").enableLoreLineBreaks();
    form.setTitle({ rawtext: [{ translate: "cooking.minigame.route_select" }] });
    for (let slot = 0; slot < 27; slot++) {
        form.setButton(slot, { iconPath: icon("minecraft:black_stained_glass_pane"), name: " ", editedName: true });
    }
    const slots = routes.length === 1 ? [13] : routes.length === 2 ? [11, 15] : [10, 13, 16];
    routes.slice(0, 3).forEach((route, index) => {
        form.setButton(slots[index], {
            iconPath: icon(route.icon),
            name: route.name,
            lore: [
                { rawtext: [{ text: "§7" }, { translate: route.description }] },
                { rawtext: [{ text: "§6" }, { translate: "cooking.minigame.route_reward" }, { text: `: +${route.rewardBonus}` }] },
                ...route.stages.map((stage, stageIndex) => {
                    const allowed = stage.actionKeys
                        .map((key) => actions.find((action) => action.key === key))
                        .filter((action) => action && action.unlockLv <= level);
                    return {
                        rawtext: [
                            { text: `§b${stageIndex + 1}. ` },
                            { translate: stage.label },
                            { text: " §8— §f" },
                            ...allowed.flatMap((action, actionIndex) => [
                                ...(actionIndex > 0 ? [{ text: " / " }] : []),
                                { translate: action!.name },
                            ]),
                        ],
                    };
                }),
            ],
            editedName: true,
        });
    });
    form.show(player).then((response) => {
        if (!response || response.canceled) return;
        const selected = routes[slots.indexOf(response.selection ?? -1)];
        if (!selected) {
            reopen(player);
            return;
        }
        session.routeId = selected.id;
        session.stageIndex = 0;
        reopen(player);
    });
    return false;
}

export function addComplexCookingMinigameUi(
    form: ChestFormData | undefined,
    player: Player,
    stationId: ComplexCookingStationId,
    session: ComplexSession,
) {
    if (!form) return;
    const definition = DEFINITIONS[stationId];
    const route = definition.routes.find((item) => item.id === session.routeId);
    if (!route) return;
    const stage = route.stages[session.stageIndex] ?? route.stages[0];
    const profile = getChefTechniqueProfile(new JobLevel(player, "chef").getLevel());

    form.setButton(4, {
        iconPath: icon(route.icon),
        name: route.name,
        lore: [
            ...getCookingEquipmentLore(session.cookware),
            { rawtext: [{ text: "§6" }, { translate: "cooking.minigame.stage" }, { text: ": " }, { translate: stage?.label ?? "cooking.stage.prep" }] },
            { rawtext: [{ text: "§d" }, { translate: "cooking.minigame.technique" }, { text: `: ${session.technique}/3` }] },
            { rawtext: [{ text: "§a" }, { translate: "cooking.minigame.route_cycles" }, { text: `: ${session.routeCycles}` }] },
            { rawtext: [{ text: "§6" }, { translate: `cooking.minigame.level_tier.${profile.tier}` }, { text: ` (+${profile.bonus})` }] },
            { rawtext: [{ text: "§7" }, { translate: "cooking.minigame.route_rule" }] },
        ],
        editedName: true,
        isGlint: true,
    });

    const activeTrouble = definition.troubles.find((item) => item.id === session.troubleId);
    if (activeTrouble) {
        form.setButton(26, {
            iconPath: icon(activeTrouble.icon),
            name: [{ text: "§c! " }, { translate: activeTrouble.name }],
            lore: [
                { rawtext: [{ text: "§7" }, { translate: activeTrouble.description }] },
                { rawtext: [{ text: "§c" }, { translate: "cooking.minigame.trouble.severity" }, { text: `: ${session.troubleSeverity + 1}/3` }] },
                ...(activeTrouble.recoveryStages?.length
                    ? [{ rawtext: [{ text: "§b" }, { translate: "cooking.minigame.trouble.steps" }, { text: `: ${session.troubleProgress}/${activeTrouble.recoveryStages.length}` }] }]
                    : []),
                { rawtext: [{ text: "§e" }, { translate: "cooking.minigame.trouble.hint" }] },
            ],
            editedName: true,
            isGlint: true,
        });
    } else {
        form.setButton(26, {
            iconPath: icon("minecraft:clock"),
            name: "cooking.minigame.calm",
            lore: [
                { rawtext: [{ text: "§7" }, { translate: "cooking.minigame.calm_lore" }] },
                ...(session.lastOutcome
                    ? [{ rawtext: [{ text: "§f" }, { translate: `cooking.minigame.outcome.${session.lastOutcome}` }] }]
                    : []),
            ],
            editedName: true,
        });
    }
}

export function beginComplexCookingAction(
    stationId: ComplexCookingStationId,
    session: ComplexSession,
    actionKey: string,
) {
    const definition = DEFINITIONS[stationId];
    const route = definition.routes.find((item) => item.id === session.routeId);
    if (!route) return false;
    const activeTrouble = definition.troubles.find((item) => item.id === session.troubleId);
    const troubleOutcome = applyCookingTroubleChoice(session, activeTrouble, actionKey);
    if (troubleOutcome === "recovered" || troubleOutcome === "recovering" || troubleOutcome === "worsened") {
        session.lastOutcome = troubleOutcome;
    } else {
        const routeSuccess = advanceCookingRoute(session, route, actionKey);
        session.lastOutcome = routeSuccess ? "stage" : "mistake";
    }
    return Boolean(activeTrouble);
}

export function endComplexCookingAction(
    player: Player,
    stationId: ComplexCookingStationId,
    session: ComplexSession,
    actions: ComplexAction[],
    hadTrouble: boolean,
) {
    if (hadTrouble || session.troubleId) return;
    const previousOutcome = session.lastOutcome;
    const level = new JobLevel(player, "chef").getLevel();
    const started = maybeStartCookingTrouble(
        session,
        DEFINITIONS[stationId].troubles,
        actions,
        level,
        session.maxActions - session.actions,
    );
    if (!started) session.lastOutcome = previousOutcome;
}

export function getComplexCookingAdjustment(
    player: Player,
    stationId: ComplexCookingStationId,
    session: ComplexSession,
) {
    const level = new JobLevel(player, "chef").getLevel();
    const route = DEFINITIONS[stationId].routes.find((item) => item.id === session.routeId);
    return getCookingTechniqueAdjustment(session, level, route) + getCookwareScoreBonus(session.cookware);
}

export function canCompleteComplexCooking(session: ComplexSession) {
    return getComplexCookingCompletionState(session).complete;
}

export function getComplexCookingCompletionState(session: ComplexSession) {
    return evaluateCookingCompletion(session.routeCycles, [{
        id: "progress",
        label: "cooking.status.progress",
        current: Number(session.progress) || 0,
        target: COMPLEX_PROGRESS_TARGET,
        suffix: "%",
    }]);
}

export function getComplexCookingCompletionLore(session: ComplexSession) {
    const completion = getComplexCookingCompletionState(session);
    return [
        ...completion.goals.map((goal) => ({
            rawtext: [
                { text: goal.current >= goal.target ? "§a✔ " : "§c✘ " },
                { translate: goal.label },
                { text: `: ${goal.current}/${goal.target}${goal.suffix ?? ""}` },
            ],
        })),
        ...(!completion.routeComplete
            ? [{ rawtext: [{ text: "§c" }, { translate: "cooking.minigame.finish.need_cycle" }] }]
            : []),
    ];
}

export function getComplexCookingCompletionMessage(session: ComplexSession) {
    const completion = getComplexCookingCompletionState(session);
    if (!completion.routeComplete) {
        return { rawtext: [{ translate: "cooking.minigame.finish.need_cycle" }] };
    }
    const goal = completion.unmetGoals[0];
    if (goal) {
        return {
            rawtext: [
                { translate: "cooking.minigame.finish.locked" },
                { text: " — " },
                { translate: goal.label },
                { text: `: ${goal.current}/${goal.target}${goal.suffix ?? ""}` },
            ],
        };
    }
    return { rawtext: [{ translate: "cooking.minigame.finish.locked" }] };
}

export function getComplexCookingResultInfo(
    player: Player,
    stationId: ComplexCookingStationId,
    session: ComplexSession,
) {
    const profile = getChefTechniqueProfile(new JobLevel(player, "chef").getLevel());
    const route = DEFINITIONS[stationId].routes.find((item) => item.id === session.routeId);
    return {
        levelTechnique: profile.bonus,
        routeBonus: session.routeCycles > 0 ? route?.rewardBonus ?? 0 : 0,
    };
}
