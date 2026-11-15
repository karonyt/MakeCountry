export type CookingRouteStage = {
    id: "prep" | "process" | "finish";
    label: string;
    actionKeys: string[];
};

export type CookingRouteDefinition = {
    id: string;
    name: string;
    description: string;
    icon: string;
    minLevel: number;
    rewardBonus: number;
    stages: CookingRouteStage[];
};

export type CookingTroubleDefinition = {
    id: string;
    name: string;
    description: string;
    icon: string;
    minLevel: number;
    chance: number;
    recoveryActionKeys: string[];
    recoveryStages?: string[][];
};

export type CookingTechniqueState = {
    stageIndex: number;
    technique: number;
    routeCycles: number;
    mistakePenalty: number;
    recoveryBonus: number;
    troubleId?: string;
    troubleSeverity: number;
    troubleProgress: number;
    lastOutcome?: "stage" | "mistake" | "recovering" | "recovered" | "worsened" | "trouble";
};

export type CookingActionAccess = {
    key: string;
    unlockLv: number;
    cost: number;
};

export function getAvailableCookingRoutes(
    routes: CookingRouteDefinition[],
    actions: CookingActionAccess[],
    level: number,
) {
    const unlocked = new Set(actions.filter((action) => action.unlockLv <= level).map((action) => action.key));
    return routes.filter((route) =>
        route.minLevel <= level
        && route.stages.length > 0
        && route.stages.every((stage) => stage.actionKeys.some((key) => unlocked.has(key)))
    );
}

export function advanceCookingRoute(
    state: CookingTechniqueState,
    route: CookingRouteDefinition,
    actionKey: string,
) {
    const stage = route.stages[state.stageIndex] ?? route.stages[0];
    if (!stage || !stage.actionKeys.includes(actionKey)) {
        state.technique = 0;
        state.stageIndex = 0;
        state.mistakePenalty = Math.min(3, state.mistakePenalty + 1);
        state.lastOutcome = "mistake";
        return false;
    }

    state.technique = Math.min(3, state.technique + 1);
    state.stageIndex += 1;
    if (state.stageIndex >= route.stages.length) {
        state.stageIndex = 0;
        state.routeCycles += 1;
    }
    state.lastOutcome = "stage";
    return true;
}

export function applyCookingTroubleChoice(
    state: CookingTechniqueState,
    trouble: CookingTroubleDefinition | undefined,
    actionKey: string,
) {
    if (!trouble || state.troubleId !== trouble.id) return "none" as const;

    const recoveryStages = trouble.recoveryStages?.length
        ? trouble.recoveryStages
        : [trouble.recoveryActionKeys];
    const expectedRecovery = recoveryStages[state.troubleProgress] ?? recoveryStages[0] ?? [];
    if (expectedRecovery.includes(actionKey)) {
        state.troubleProgress += 1;
        if (state.troubleProgress < recoveryStages.length) {
            state.lastOutcome = "recovering";
            return "recovering" as const;
        }
        state.troubleId = undefined;
        state.troubleSeverity = 0;
        state.troubleProgress = 0;
        state.recoveryBonus = Math.min(3, state.recoveryBonus + Math.min(2, recoveryStages.length));
        state.lastOutcome = "recovered";
        return "recovered" as const;
    }

    state.troubleSeverity = Math.min(2, state.troubleSeverity + 1);
    state.troubleProgress = 0;
    state.mistakePenalty = Math.min(3, state.mistakePenalty + 1);
    state.lastOutcome = "worsened";
    return "worsened" as const;
}

export function maybeStartCookingTrouble(
    state: CookingTechniqueState,
    troubles: CookingTroubleDefinition[],
    actions: CookingActionAccess[],
    level: number,
    remainingActions: number,
    random: () => number = Math.random,
) {
    if (state.troubleId || remainingActions <= 0) return undefined;

    const unlockedActions = actions.filter((action) => action.unlockLv <= level);
    const affordable = new Set(
        unlockedActions
            .filter((action) => action.cost <= remainingActions)
            .map((action) => action.key),
    );
    const actionCost = new Map(unlockedActions.map((action) => [action.key, action.cost]));
    const eligible = troubles.filter((trouble) =>
        trouble.minLevel <= level
        && (trouble.recoveryStages?.length
            ? trouble.recoveryStages.every((stage) => stage.some((key) => affordable.has(key)))
                && trouble.recoveryStages.reduce((total, stage) => {
                    const cheapest = Math.min(...stage.map((key) => actionCost.get(key) ?? Number.POSITIVE_INFINITY));
                    return total + cheapest;
                }, 0) <= remainingActions
            : trouble.recoveryActionKeys.some((key) => affordable.has(key)))
    );
    if (eligible.length === 0) return undefined;

    const trouble = eligible[Math.min(eligible.length - 1, Math.floor(random() * eligible.length))];
    if (!trouble || random() >= trouble.chance) return undefined;

    state.troubleId = trouble.id;
    state.troubleSeverity = 0;
    state.troubleProgress = 0;
    state.lastOutcome = "trouble";
    return trouble;
}

export function getChefLevelTechnique(level: number) {
    return getChefTechniqueProfile(level).bonus;
}

export function getChefTechniqueProfile(level: number) {
    const safeLevel = Math.max(1, Math.floor(level));
    if (safeLevel >= 150) return { tier: "legend", bonus: 3, actionBonus: 2 } as const;
    if (safeLevel >= 100) return { tier: "master", bonus: 2, actionBonus: 2 } as const;
    if (safeLevel >= 60) return { tier: "expert", bonus: 2, actionBonus: 1 } as const;
    if (safeLevel >= 35) return { tier: "specialist", bonus: 1, actionBonus: 1 } as const;
    if (safeLevel >= 15) return { tier: "cook", bonus: 1, actionBonus: 0 } as const;
    return { tier: "trainee", bonus: 0, actionBonus: 0 } as const;
}

export function getCookingTechniqueAdjustment(
    state: CookingTechniqueState,
    level = 1,
    route?: CookingRouteDefinition,
) {
    const unresolvedTroublePenalty = state.troubleId ? state.troubleSeverity + 2 : 0;
    const routeReward = state.routeCycles > 0 ? route?.rewardBonus ?? 0 : 0;
    return Math.max(-5, Math.min(6,
        state.technique
        + state.recoveryBonus
        + getChefLevelTechnique(level)
        + routeReward
        - state.mistakePenalty
        - unresolvedTroublePenalty
    ));
}
