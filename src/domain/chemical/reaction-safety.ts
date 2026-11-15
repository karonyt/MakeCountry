export const ACCIDENT_RISK_THRESHOLD = 65;
export const CRITICAL_RISK_THRESHOLD = 90;

export interface ReactionConditions {
    reactionType: string;
    optimalVoltage?: readonly [number, number];
    targetPH?: number;
    optimalTemperature?: readonly [number, number];
}

export interface ReactionSafetyInput {
    voltage: number;
    pH: number;
    temperature: number;
    progress: number;
    contamination: number;
    actions: number;
    maxActions: number;
    accidents: number;
    instability: number;
}

export interface EmergencyStabilizationInput {
    instability: number;
    progress: number;
    contamination: number;
    score: number;
    yieldPenalty: number;
    voltage: number;
    pH: number;
    temperature: number;
}

export interface BreakthroughInput {
    phase: string;
    accidents: number;
    emergencyUses: number;
    yieldPenalty: number;
    progress: number;
    contamination: number;
    precision: number;
    stability: number;
    safePrecisionStreak: number;
}

export type ReactionControlMetric = "voltage" | "ph" | "temperature";
export type ReactionControlDirection = "increase" | "decrease" | "hold";

export interface ReactionControlTarget {
    metric: ReactionControlMetric;
    current: number;
    min: number;
    max: number;
    ideal: number;
    delta: number;
    direction: ReactionControlDirection;
}

export type ReactionRiskCause =
    | ReactionControlMetric
    | "instability"
    | "contamination"
    | "actions"
    | "accidents";

export interface ReactionRiskFactor {
    cause: ReactionRiskCause;
    value: number;
}

export function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

export function isTemperatureReaction(recipe: ReactionConditions) {
    return Array.isArray(recipe.optimalTemperature);
}

function createControlTarget(
    metric: ReactionControlMetric,
    current: number,
    min: number,
    max: number
): ReactionControlTarget {
    const ideal = (min + max) / 2;
    const direction: ReactionControlDirection = current < min
        ? "increase"
        : current > max ? "decrease" : "hold";
    const delta = current < min
        ? min - current
        : current > max ? current - max : 0;

    return { metric, current, min, max, ideal, delta, direction };
}

/** Returns every live control target, including both pH and temperature for precipitation. */
export function getReactionControlTargets(
    lab: Pick<ReactionSafetyInput, "voltage" | "pH" | "temperature">,
    recipe: ReactionConditions
) {
    const targets: ReactionControlTarget[] = [];

    if (recipe.reactionType === "electrolysis" && recipe.optimalVoltage) {
        targets.push(createControlTarget(
            "voltage",
            lab.voltage,
            recipe.optimalVoltage[0],
            recipe.optimalVoltage[1]
        ));
    }

    if (recipe.reactionType === "neutralization" || recipe.reactionType === "precipitation") {
        const targetPH = recipe.targetPH ?? 7;
        targets.push(createControlTarget("ph", lab.pH, targetPH - 0.25, targetPH + 0.25));
    }

    if (recipe.optimalTemperature) {
        targets.push(createControlTarget(
            "temperature",
            lab.temperature,
            recipe.optimalTemperature[0],
            recipe.optimalTemperature[1]
        ));
    }

    return targets;
}

/**
 * Normalized distance to the ideal point. This is used to recognize deliberate
 * control moves without making recipes with larger numeric ranges easier.
 */
export function calculateReactionControlError(
    lab: Pick<ReactionSafetyInput, "voltage" | "pH" | "temperature">,
    recipe: ReactionConditions
) {
    return getReactionControlTargets(lab, recipe).reduce((sum, target) => {
        const scale = target.metric === "ph"
            ? 1
            : Math.max(1, target.max - target.min);
        return sum + Math.abs(target.current - target.ideal) / scale;
    }, 0);
}

/**
 * A cold high-temperature reaction is incomplete rather than explosive.
 * Immediate physical risk comes from overheating, excessive cooling in a
 * cryogenic recipe, over-voltage, or an active reaction far from its target pH.
 */
export function calculateControlRisk(lab: ReactionSafetyInput, recipe: ReactionConditions) {
    return calculateControlRiskFactors(lab, recipe)
        .reduce((sum, factor) => sum + factor.value, 0);
}

function calculateControlRiskFactors(lab: ReactionSafetyInput, recipe: ReactionConditions) {
    const factors: ReactionRiskFactor[] = [];

    if (recipe.reactionType === "electrolysis" && recipe.optimalVoltage) {
        const [, maxVoltage] = recipe.optimalVoltage;
        factors.push({ cause: "voltage", value: Math.max(0, lab.voltage - maxVoltage) * 7 });
    }

    if (recipe.reactionType === "neutralization" || recipe.reactionType === "precipitation") {
        const targetPH = recipe.targetPH ?? 7;
        const activeFactor = clamp((lab.progress - 20) / 60, 0, 1);
        factors.push({
            cause: "ph",
            value: Math.max(0, Math.abs(lab.pH - targetPH) - 2) * 5 * activeFactor,
        });
    }

    if (recipe.optimalTemperature) {
        const [minTemperature, maxTemperature] = recipe.optimalTemperature;
        const span = Math.max(20, maxTemperature - minTemperature);
        const unsafeDelta = maxTemperature < 0
            ? Math.max(0, minTemperature - lab.temperature)
            : Math.max(0, lab.temperature - maxTemperature);
        factors.push({ cause: "temperature", value: (unsafeDelta / span) * 35 });
    }

    const controlTotal = factors.reduce((sum, factor) => sum + factor.value, 0);
    if (controlTotal > 55) {
        const scale = 55 / controlTotal;
        for (const factor of factors) factor.value *= scale;
    }

    return factors.filter(factor => factor.value > 0);
}

/** Exact sources used by the safety calculation, sorted by their impact. */
export function calculateReactionRiskFactors(lab: ReactionSafetyInput, recipe: ReactionConditions) {
    const factors = calculateControlRiskFactors(lab, recipe);
    const contaminationRisk = clamp((lab.contamination - 70) * 0.2, 0, 6);
    const actionPressure = lab.actions >= lab.maxActions - 1
        ? 10
        : lab.actions >= lab.maxActions * 0.85 ? 5 : 0;
    const accidentMemory = Math.min(12, lab.accidents * 4);

    factors.push(
        { cause: "instability", value: Math.max(0, lab.instability) },
        { cause: "contamination", value: contaminationRisk },
        { cause: "actions", value: actionPressure },
        { cause: "accidents", value: accidentMemory }
    );

    return factors
        .filter(factor => factor.value > 0)
        .sort((a, b) => b.value - a.value);
}

export function calculateReactionSafety(lab: ReactionSafetyInput, recipe: ReactionConditions) {
    const risk = Math.round(clamp(
        calculateReactionRiskFactors(lab, recipe)
            .reduce((sum, factor) => sum + factor.value, 0),
        0,
        100
    ));

    return { risk, stability: 100 - risk };
}

export function calculateAccidentChance(risk: number, dangerSteps: number) {
    if (risk < ACCIDENT_RISK_THRESHOLD) return 0;
    return Math.min(
        0.45,
        0.08 + Math.max(0, risk - ACCIDENT_RISK_THRESHOLD) * 0.012 + dangerSteps * 0.025
    );
}

export function calculateEmergencyStabilization(
    lab: EmergencyStabilizationInput,
    recipe: ReactionConditions
) {
    let voltage = lab.voltage;
    let pH = lab.pH;
    let temperature = lab.temperature;

    if (recipe.reactionType === "electrolysis" && recipe.optimalVoltage) {
        const target = (recipe.optimalVoltage[0] + recipe.optimalVoltage[1]) / 2;
        voltage += (target - voltage) * 0.6;
    }

    if (recipe.reactionType === "neutralization" || recipe.reactionType === "precipitation") {
        const target = recipe.targetPH ?? 7;
        pH += (target - pH) * 0.6;
    }

    if (recipe.optimalTemperature) {
        const [minTemperature, maxTemperature] = recipe.optimalTemperature;
        if (maxTemperature < 0 && temperature < minTemperature) {
            temperature = minTemperature;
        } else if (maxTemperature >= 0 && temperature > maxTemperature) {
            temperature = maxTemperature;
        }
    }

    return {
        instability: Math.max(0, lab.instability - 45),
        progress: Math.max(0, lab.progress - 8),
        contamination: clamp(lab.contamination + 5, 0, 100),
        score: lab.score - 1,
        yieldPenalty: clamp(lab.yieldPenalty + 0.05, 0, 0.8),
        voltage,
        pH,
        temperature,
    };
}

export function meetsBreakthroughConditions(lab: BreakthroughInput, conditionScore: number) {
    return lab.phase !== "failed"
        && lab.accidents === 0
        && lab.emergencyUses === 0
        && lab.yieldPenalty === 0
        && lab.progress >= 80
        && lab.contamination <= 10
        && lab.precision >= 0.82
        && lab.stability >= 88
        && conditionScore >= 11
        && lab.safePrecisionStreak >= 2;
}

export function calculateBreakthroughChance(level: number, requiredLevel: number) {
    return Math.min(0.07, 0.03 + Math.max(0, level - requiredLevel) * 0.0008);
}

export function calculateOutputYield(baseCount: number, yieldPenalty: number, breakthrough: boolean) {
    const penalizedCount = Math.max(1, Math.round(baseCount * (1 - yieldPenalty)));
    const breakthroughBonus = breakthrough
        ? Math.max(1, Math.ceil(baseCount * 0.25))
        : 0;

    return {
        penalizedCount,
        breakthroughBonus,
        totalCount: penalizedCount + breakthroughBonus,
        lostCount: Math.max(0, baseCount - penalizedCount),
    };
}
