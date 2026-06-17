import { Player } from '@minecraft/server';
import { tpaMainForm } from '@/domain/player/tpa.js';

/**
 * @param {Player} player
 */
export function TeleportApp(player: any) {
    tpaMainForm(player, true)
};