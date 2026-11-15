import { world } from "@minecraft/server";
import type { Cell } from "@/domain/country/territory-rules.js";

const REFUSAL = "§cゲートがあるチャンクは購入・建国できません。";
type Messenger = { sendMessage(message: string): void };
type GatePosition = { x: number; z: number; dimension: string };
const dimensionName = (id: string) => id.replace(/^minecraft:/, "");

function overlaps(targets: Cell[], dimensionId: string, gates: GatePosition[]): boolean {
    const cells = new Set(targets.map(([x, z]) => `${x},${z}`));
    return gates.some(gate => dimensionName(gate.dimension) === dimensionName(dimensionId)
        && cells.has(`${Math.floor(gate.x / 16)},${Math.floor(gate.z / 16)}`));
}

/** Native entrances catch a spawn that happened after the Core reply, including before-event listeners. */
export function deniesLoadedGateTerritory(player: Messenger, targets: Cell[], dimensionId: string): boolean {
    const dimension = world.getDimension(dimensionId);
    const gates: GatePosition[] = [];
    for (const gate of dimension.getEntities({ families: ["gate"] })) {
        try {
            if (!gate.isValid || gate.typeId === "mc:gate_exit") continue;
            gates.push({ x: gate.location.x, z: gate.location.z, dimension: gate.dimension.id });
        } catch {
            // An entrance removed during the native read no longer reserves land.
        }
    }
    if (!overlaps(targets, dimensionId, gates)) return false;
    player.sendMessage(REFUSAL);
    return true;
}

/** 配布版: 外部サーバーのゲート一覧は使わず、読み込み済みのゲートだけを確認して実行する。 */
export function runWithGateTerritoryCheck(player: Messenger, targets: Cell[], dimensionId: string, action: () => void): void {
    if (deniesLoadedGateTerritory(player, targets, dimensionId)) return;
    action();
}

world.afterEvents.worldLoad.subscribe(() => {
    console.log("[GateTerritory] ready policy=entrance-chunk purchase=single-range-foundation");
});
