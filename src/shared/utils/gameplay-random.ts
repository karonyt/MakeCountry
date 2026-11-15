/**
 * Rolls a gameplay value without applying the global job reward multiplier.
 * Reward calculations must continue to use getRandomInteger instead.
 */
export function getGameplayRandomValue(
    min: number,
    max: number,
    random: () => number = Math.random,
): number {
    return Math.floor((random() * (max - min) + min) * 100) / 100;
}
