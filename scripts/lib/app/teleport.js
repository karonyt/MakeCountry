import { Player } from '@minecraft/server';
import { tpaMainForm } from '../../api/player/tpa.js';

/**
 * @param {Player} player
 */
export function TeleportApp(player) {
    tpaMainForm(player, true)
};