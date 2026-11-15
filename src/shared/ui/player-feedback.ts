import { Player, system } from "@minecraft/server";

/** Cosmetic feedback cannot interrupt a completed reward or touch departed entities. */
export function showPlayerActionBar(player: Player, message: string): void {
    system.run(() => {
        if (!player.isValid) return;
        try {
            const display = player.onScreenDisplay;
            if (display) display.setActionBar(message);
            else player.runCommand(`titleraw @s actionbar ${JSON.stringify({ rawtext: [{ text: message }] })}`);
        } catch (error) {
            // Disconnection can occur between receiving the event and this callback.
            if (player.isValid) console.warn(`[job-feedback] ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}

/** The enhancer may expose a player without the native ScreenDisplay wrapper. */
export function showPlayerTitle(player: Player, title: string, subtitle?: string): void {
    system.run(() => {
        if (!player.isValid) return;
        try {
            const display = player.onScreenDisplay;
            if (display) {
                display.setTitle(title);
                if (subtitle !== undefined) display.updateSubtitle(subtitle);
            } else {
                player.runCommand(`titleraw @s title ${JSON.stringify({ rawtext: [{ text: title }] })}`);
                if (subtitle !== undefined) player.runCommand(`titleraw @s subtitle ${JSON.stringify({ rawtext: [{ text: subtitle }] })}`);
            }
        } catch (error) {
            if (player.isValid) console.warn(`[player-feedback] ${error instanceof Error ? error.message : String(error)}`);
        }
    });
}
