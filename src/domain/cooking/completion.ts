export type CookingCompletionGoal = {
    id: string;
    label: string;
    current: number;
    target: number;
    suffix?: string;
};

export type CookingCompletionState = {
    routeComplete: boolean;
    goals: CookingCompletionGoal[];
    unmetGoals: CookingCompletionGoal[];
    complete: boolean;
};

function finite(value: unknown) {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
}

/** A route is necessary, but the station's actual food progress is necessary too. */
export function evaluateCookingCompletion(
    routeCycles: unknown,
    goals: CookingCompletionGoal[],
): CookingCompletionState {
    const normalizedGoals = goals.map((goal) => ({
        ...goal,
        current: finite(goal.current),
        target: Math.max(0, finite(goal.target)),
    }));
    const unmetGoals = normalizedGoals.filter((goal) => goal.current < goal.target);
    const routeComplete = finite(routeCycles) > 0;
    return {
        routeComplete,
        goals: normalizedGoals,
        unmetGoals,
        complete: routeComplete && unmetGoals.length === 0,
    };
}
