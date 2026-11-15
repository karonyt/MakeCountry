export function getJobXpRequired(level: unknown): number {
    const normalizedLevel = Math.max(1, Math.floor(Number(level) || 1));
    // The old expression accidentally used bitwise XOR. Keep its familiar
    // early-game pace, then grow smoothly without turning artisan jobs into a
    // four-digit-craft grind at higher levels.
    return (14 * normalizedLevel) + Math.ceil(normalizedLevel ** 2 / 30);
}
