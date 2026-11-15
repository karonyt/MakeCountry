import type { Block, Player, RawMessage, Vector3 } from '@minecraft/server';
import { COOKWARE } from '@/content/minerals/cookware-data.js';

export type CookingEquipment = {
    typeId: string;
    station: string;
    bonus: number;
    nameKey: string;
    location: Vector3;
    dimensionId: string;
};
const activeEquipment = new Map<string, CookingEquipment>();
const normalize = (station: string) => station.split('.').at(-1)!.replace(/_/g, '');

export function rememberCookingEquipment(player: Player, block: Block) {
    const equipment = COOKWARE[block.typeId as keyof typeof COOKWARE];
    if (!equipment) { activeEquipment.delete(player.id); return; }
    activeEquipment.set(player.id, { ...equipment, typeId: block.typeId, location: { ...block.location }, dimensionId: block.dimension.id });
}
export function forgetCookingEquipment(playerId: string) { activeEquipment.delete(playerId); }

export function isCookingEquipmentAvailable(player: Player, equipment: CookingEquipment | undefined) {
    if (!equipment) return true;
    if (player.isValid === false || player.dimension.id !== equipment.dimensionId) return false;
    const { x, y, z } = player.location;
    if ((x - equipment.location.x) ** 2 + (y - equipment.location.y) ** 2 + (z - equipment.location.z) ** 2 > 64) return false;
    try { return player.dimension.getBlock(equipment.location)?.typeId === equipment.typeId; }
    catch { return false; }
}
export function captureCookingEquipment(player: Player, station: string): CookingEquipment | undefined {
    const equipment = activeEquipment.get(player.id);
    if (!equipment || normalize(station) !== normalize(equipment.station) || !isCookingEquipmentAvailable(player, equipment)) return undefined;
    return { ...equipment, location: { ...equipment.location } };
}
export function getCookwareScoreBonus(equipment: CookingEquipment | undefined) { return equipment?.bonus ?? 0; }

export function requireCookingEquipment(player: Player, equipment: CookingEquipment | undefined) {
    if (isCookingEquipmentAvailable(player, equipment)) return true;
    player.sendMessage({ translate: 'cooking.equipment.unavailable' });
    return false;
}
export function getCookingEquipmentLore(equipment: CookingEquipment | undefined): RawMessage[] {
    return [{ rawtext: [
        { text: '§6' }, { translate: 'cooking.equipment.bonus' }, { text: `: +${getCookwareScoreBonus(equipment)}` },
        ...(equipment ? [{ text: ' §7(' }, { translate: equipment.nameKey }, { text: ')' }] : []),
    ] }];
}
