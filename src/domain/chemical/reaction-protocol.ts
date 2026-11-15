export type ReactionProtocolStageKey =
    | "charge"
    | "voltage_control"
    | "ph_control"
    | "dual_control"
    | "thermal_control"
    | "reaction"
    | "separation"
    | "finish";

export interface ReactionProtocolStage {
    key: ReactionProtocolStageKey;
    acceptedActions: readonly string[];
}

export type ProtocolActionOutcome = "completed" | "progress" | "revisit" | "out_of_order" | "unrelated";

export interface ProtocolActionEvaluation {
    outcome: ProtocolActionOutcome;
    nextStageIndex: number;
}

export type ReactionPulseKind =
    | "voltage_surge"
    | "ph_acidic_drift"
    | "ph_alkaline_drift"
    | "thermal_runaway"
    | "contamination_bloom";

export interface ReactionPulse {
    kind: ReactionPulseKind;
    responseActions: readonly string[];
}

export interface ChemistryResearchTechnique {
    level: number;
    insightBonus: number;
    precisionBonus: number;
    containmentRecovery: number;
    breakthroughCap: number;
    yieldBonusRate: number;
    pulseChanceBonus: number;
}

export interface ChemistryActionBudgetInput {
    baseActions: number;
    requiredLevel: number;
    chemistLevel: number;
    reactionType: string;
    supportedActions: readonly string[];
    protocol: readonly ReactionProtocolStage[];
}

export interface IncompleteProtocolDisposition {
    rank: "F";
    productCount: 0;
    wasteCount: number;
    rewardMultiplier: 0;
}

export const CHEMISTRY_RANK_MULTIPLIERS: Readonly<Record<string, number>> = {
    CONTAMINATED: 0.3,
    F: 0.3,
    E: 1,
    D: 1.2,
    C: 1.3,
    B: 1.4,
    A: 1.5,
    S: 1.7,
    SS: 2,
    SSS: 2.5,
    LEGENDARY: 4,
    EXTRA: 6,
    IMPOSSIBLE: 10,
    KARON: 12,
};

export function getChemistryRankMultiplier(rank: string) {
    const normalized = rank === "LEGEND" ? "LEGENDARY" : rank;
    return CHEMISTRY_RANK_MULTIPLIERS[normalized] ?? CHEMISTRY_RANK_MULTIPLIERS.F;
}

const CONDITION_STAGE_BY_REACTION: Record<string, ReactionProtocolStage | undefined> = {
    electrolysis: {
        key: "voltage_control",
        acceptedActions: ["increase_voltage", "decrease_voltage"],
    },
    neutralization: {
        key: "ph_control",
        acceptedActions: ["add_acid", "add_base"],
    },
    precipitation: {
        key: "dual_control",
        acceptedActions: ["add_acid", "add_base", "heat", "cool"],
    },
    oxidation: {
        key: "thermal_control",
        acceptedActions: ["heat", "cool"],
    },
    reduction: {
        key: "thermal_control",
        acceptedActions: ["heat", "cool"],
    },
    polymerization: {
        key: "thermal_control",
        acceptedActions: ["heat", "cool"],
    },
    decomposition: {
        key: "thermal_control",
        acceptedActions: ["heat", "cool"],
    },
    fermentation: {
        key: "thermal_control",
        acceptedActions: ["heat", "cool"],
    },
};

const BASE_REACTION_ACTIONS = ["stir", "add_catalyst"];
const CHEMISTRY_ACTION_COSTS: Readonly<Record<string, number>> = {
    add_reagent: 1,
    stir: 1,
    add_catalyst: 1,
    increase_voltage: 1,
    decrease_voltage: 1,
    add_acid: 1,
    add_base: 1,
    heat: 1,
    cool: 1,
    filter: 2,
    centrifuge: 2,
    distill: 3,
    measure_purity: 1,
    crystallize: 3,
    emergency_stabilize: 2,
};

// add_reagent guarantees 12 progress and the weakest stir guarantees 8. Six
// reaction operations therefore complete the 55-progress gate even on the
// lowest possible rolls: 12 + (6 * 8) = 60.
const GUARANTEED_REACTION_ACTIONS = 6;
// The adaptive controls close 65-70% of the remaining gap while outside the
// target range. Three adjustments cover the widest voltage, pH, heating, and
// cooling ranges used by recipes at their unlock level, even from the initial
// state and the weakest random reagent shift.
const GUARANTEED_CONDITION_ACTIONS = 3;
const EMERGENCY_ACTION_RESERVE = CHEMISTRY_ACTION_COSTS.emergency_stabilize;
const SEPARATION_ACTIONS_BY_REACTION: Record<string, readonly string[]> = {
    electrolysis: ["filter", "measure_purity", "centrifuge"],
    neutralization: ["filter", "measure_purity", "distill"],
    precipitation: ["filter", "centrifuge", "crystallize", "measure_purity"],
    oxidation: ["distill", "filter", "measure_purity"],
    reduction: ["distill", "filter", "measure_purity"],
    polymerization: ["centrifuge", "crystallize", "measure_purity"],
    decomposition: ["distill", "filter", "measure_purity"],
    fermentation: ["filter", "centrifuge", "measure_purity"],
};

function availableActions(actions: readonly string[], supported: ReadonlySet<string>) {
    return actions.filter(action => supported.has(action));
}

/**
 * Builds the protocol once when the session starts. Optional stages are only
 * included when the current recipe and chemist level can actually perform them.
 */
export function createReactionProtocol(reactionType: string, supportedActions: readonly string[]) {
    const supported = new Set(supportedActions);
    const stages: ReactionProtocolStage[] = [
        { key: "charge", acceptedActions: ["add_reagent"] },
    ];
    const condition = CONDITION_STAGE_BY_REACTION[reactionType];
    const conditionActions = condition
        ? availableActions(condition.acceptedActions, supported)
        : [];
    const reactionActions = availableActions(BASE_REACTION_ACTIONS, supported);
    const reactionStage: ReactionProtocolStage = {
        key: "reaction",
        acceptedActions: reactionActions.length > 0 ? reactionActions : ["stir"],
    };
    const reactsBeforeControl = reactionType === "fermentation" || reactionType === "polymerization";
    if (reactsBeforeControl) stages.push(reactionStage);
    if (condition && conditionActions.length > 0) {
        stages.push({ ...condition, acceptedActions: conditionActions });
    }
    if (!reactsBeforeControl) stages.push(reactionStage);

    const separationActions = availableActions(
        SEPARATION_ACTIONS_BY_REACTION[reactionType] ?? ["filter", "measure_purity"],
        supported
    );
    if (separationActions.length > 0) {
        stages.push({ key: "separation", acceptedActions: separationActions });
    }

    stages.push({ key: "finish", acceptedActions: ["complete"] });
    return stages;
}

function cheapestActionCost(actions: readonly string[]) {
    return actions.reduce(
        (cheapest, action) => Math.min(
            cheapest,
            CHEMISTRY_ACTION_COSTS[action] ?? Number.POSITIVE_INFINITY
        ),
        Number.POSITIVE_INFINITY
    );
}

/**
 * Keeps every generated protocol finishable on its unlock level. The legacy
 * recipe budget remains meaningful, while the floor reserves enough weak-roll
 * reaction operations, every generated stage, and one pulse/emergency answer.
 */
/**
 * Purification and separation work feeds a refinement pool. The pool is capped
 * by recipe mastery so a long session cannot run far past the rank the chemist
 * has unlocked, while a chemist at the unlock level can still reach it.
 */
export const CHEMISTRY_REFINEMENT = {
    filter: 3,
    centrifuge: 3,
    distill: 5,
    measure: 1.5,
    crystallize: 4,
    preciseRevisit: 1.5,
} as const;

export function getChemistryRefinementCap(level: unknown, requiredLevel: unknown): number {
    const surplus = Math.max(0, Math.floor(Number(level) || 0) - Math.floor(Number(requiredLevel) || 0));
    return 8 + Math.floor(surplus * 0.2);
}

export function calculateChemistryActionBudget(input: ChemistryActionBudgetInput) {
    const baseActions = Math.max(1, Math.ceil(Number(input.baseActions) || 0));
    const requirement = Math.max(0, Math.floor(Number(input.requiredLevel) || 0));
    const level = Math.max(requirement, Math.floor(Number(input.chemistLevel) || 0));
    const masteryBonus = Math.max(0, Math.min(
        Math.floor((level - requirement) / 3),
        Math.max(40, Math.floor(requirement * 1.5))
    ));

    const protocolCost = input.protocol.reduce((total, stage) => {
        if (stage.key === "finish") return total;
        const cheapest = cheapestActionCost(stage.acceptedActions);
        if (!Number.isFinite(cheapest)) return total;
        const repetitions = stage.key === "reaction"
            ? GUARANTEED_REACTION_ACTIONS
            : stage.key === "voltage_control"
                || stage.key === "ph_control"
                || stage.key === "dual_control"
                || stage.key === "thermal_control"
                ? GUARANTEED_CONDITION_ACTIONS
                : 1;
        return total + cheapest * repetitions;
    }, 0);

    const pulseResponseReserve = getEligibleReactionPulses(
        input.reactionType,
        input.supportedActions
    ).reduce((largest, pulse) => {
        const cheapest = cheapestActionCost(pulse.responseActions);
        return Number.isFinite(cheapest) ? Math.max(largest, cheapest) : largest;
    }, 0);

    const protocolFloor = protocolCost + Math.max(
        EMERGENCY_ACTION_RESERVE,
        pulseResponseReserve
    );
    return Math.max(baseActions + masteryBonus, protocolFloor);
}

/** A premature finish never converts reagents into the requested product. */
export function getIncompleteProtocolDisposition(quantity: number): IncompleteProtocolDisposition {
    return {
        rank: "F",
        productCount: 0,
        wasteCount: Math.max(1, Math.floor(Number(quantity) || 0)),
        rewardMultiplier: 0,
    };
}

export function evaluateProtocolAction(
    protocol: readonly ReactionProtocolStage[],
    stageIndex: number,
    action: string,
    stageSatisfied = true
): ProtocolActionEvaluation {
    const safeIndex = Math.min(Math.max(0, stageIndex), Math.max(0, protocol.length - 1));
    const current = protocol[safeIndex];
    if (!current) return { outcome: "unrelated", nextStageIndex: safeIndex };

    if (current.acceptedActions.includes(action)) {
        return stageSatisfied
            ? { outcome: "completed", nextStageIndex: Math.min(safeIndex + 1, protocol.length) }
            : { outcome: "progress", nextStageIndex: safeIndex };
    }

    const earlier = protocol.slice(0, safeIndex)
        .some(stage => stage.acceptedActions.includes(action));
    if (earlier) return { outcome: "revisit", nextStageIndex: safeIndex };

    const later = protocol.slice(safeIndex + 1)
        .some(stage => stage.acceptedActions.includes(action));
    return {
        outcome: later ? "out_of_order" : "unrelated",
        nextStageIndex: safeIndex,
    };
}

export function getEligibleReactionPulses(reactionType: string, supportedActions: readonly string[]) {
    const supported = new Set(supportedActions);
    const pulses: ReactionPulse[] = [];

    if (reactionType === "electrolysis" && supported.has("decrease_voltage")) {
        pulses.push({ kind: "voltage_surge", responseActions: ["decrease_voltage"] });
    }
    if ((reactionType === "neutralization" || reactionType === "precipitation")
        && supported.has("add_acid") && supported.has("add_base")) {
        pulses.push(
            { kind: "ph_acidic_drift", responseActions: ["add_base"] },
            { kind: "ph_alkaline_drift", responseActions: ["add_acid"] }
        );
    }
    if (CONDITION_STAGE_BY_REACTION[reactionType]?.key === "thermal_control" && supported.has("cool")) {
        pulses.push({ kind: "thermal_runaway", responseActions: ["cool"] });
    }

    const cleaningActions = availableActions(["filter", "centrifuge", "distill"], supported);
    if (cleaningActions.length > 0) {
        pulses.push({ kind: "contamination_bloom", responseActions: cleaningActions });
    }
    return pulses;
}

export function isReactionPulseContained(pulse: ReactionPulse, action: string) {
    return action === "emergency_stabilize" || pulse.responseActions.includes(action);
}

/** A visible, bounded profession-level contribution beyond merely unlocking buttons. */
export function getChemistryResearchTechnique(level: number): ChemistryResearchTechnique {
    const researchLevel = Math.min(10, Math.floor(Math.max(0, level) / 10));
    return {
        level: researchLevel,
        insightBonus: Math.floor(researchLevel / 3),
        precisionBonus: researchLevel * 0.005,
        containmentRecovery: researchLevel * 0.005,
        breakthroughCap: 0.08 + researchLevel * 0.012,
        yieldBonusRate: researchLevel * 0.015,
        pulseChanceBonus: Math.min(0.06, researchLevel * 0.006),
    };
}

export function calculateProtocolBreakthroughChance(
    baseChance: number,
    insight: number,
    bestCombo: number,
    containedPulses: number,
    cap = 0.2
) {
    return Math.min(cap, baseChance
        + Math.max(0, insight) * 0.008
        + Math.max(0, bestCombo - 1) * 0.004
        + Math.max(0, containedPulses) * 0.01);
}

export function calculateResearchYieldBonus(
    baseCount: number,
    yieldBonusRate: number,
    protocolCompleted: boolean
) {
    if (!protocolCompleted || baseCount <= 0) return 0;
    return Math.max(0, Math.floor(baseCount * Math.max(0, yieldBonusRate)));
}
