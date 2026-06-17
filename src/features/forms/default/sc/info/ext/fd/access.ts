import { Player } from "@minecraft/server";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { isFederationLeader, isFederationSubLeader } from "@/domain/country/relationships/federation.js";

export function canLeadFederation(player: Player, countryData: any) {
    return isFederationLeader(player, countryData);
}

export function canManageFederation(player: Player, countryData: any) {
    return canLeadFederation(player, countryData)
        || isFederationSubLeader(player, countryData)
        || !CheckPermission(player, `federationPermission`)
        || !CheckPermission(player, `federationAdmin`);
}
