import { Player, type Entity } from "@minecraft/server";
import config from "@/config/server.js";
import { canAttackBountyTarget } from "@/domain/player/bounty.js";
import { CheckPermissionFromLocation } from "@/shared/utils/minecraft.js";
import { isUnsafeToPlay } from "@/shared/integration/standalone.js";
import { isIncident16Location } from "./incident16.js";

/** Shared by native hits and scripted Halloween attacks, including status effects. */
export function isEntityAttackDenied(attacker: Player, target: Entity): boolean {
    if (!attacker.isValid || !target.isValid || isUnsafeToPlay()) return true;
    const { x, z } = target.location;
    const dimension = target.dimension;
    if (attacker.dimension.id !== dimension.id) return true;
    // The final native incident guard also forbids attacks launched out of this area.
    if (isIncident16Location(x, z, dimension.id)
        || isIncident16Location(attacker.location.x, attacker.location.z, attacker.dimension.id)) return true;
    if (target instanceof Player && canAttackBountyTarget(attacker, target)) return false;
    if (target.typeId === "mc:core") return false;
    // The lobby training scarecrow cannot be harmed; land rules must not hide its damage display.
    if (target.typeId === "mc:training_dummy") return false;
    if (dimension.getEntities({ location: target.location, maxDistance: config.maxDropDistance, type: "mc:core" }).length > 0) return false;
    return CheckPermissionFromLocation(attacker, x, z, dimension.id, target instanceof Player ? "playerAttack" : "entityAttack");
}
