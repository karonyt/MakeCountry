import type { Player } from "@minecraft/server";

/**
 * 配布版: KaroEarth で一時的に設けていた事故調査用の保護区域は含まない。
 * 呼び出し側とのインターフェースだけを残し、常に「保護対象外」として扱う。
 */
export const INCIDENT16_RELEASE_PROPERTY = "karoearth:incident16:released";
export const INCIDENT16_MESSAGE = "";

export function setIncident16Released(_value: boolean) {}
export function isIncident16Active() { return false; }
export function isIncident16Location(_x: number, _z: number, _dimensionId: string) { return false; }
export function deniesIncident16(_player: Pick<Player, "id" | "hasTag">, _x: number, _z: number, _dimensionId: string, _claiming = false) {
    return false;
}
export function noticeIncident16(_player: Player) {}
export function cancelIncident16BlockEvent(_event: { player: Player; block: { location: { x: number; z: number }; dimension: { id: string } }; cancel: boolean }) {
    return false;
}
