import { Player, world } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CheckPermission, CheckPermissionFromLocation } from "@/shared/utils/minecraft.js";
import { externalAffairsMainDefaultForm } from "@/features/forms/default/sc/info/ext/main.js";
import { setFederationPermissionDefaultForm } from "@/features/forms/default/sc/info/ext/fd/set_permission.js";
import { FederationListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/federation_list.js";
import { AddFederationListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/add/add_list.js";
import { ReceivedFederationRequestDefaultForm } from "@/features/forms/default/sc/info/ext/r_fd_req/received_federation_request.js";
import { CreateFederationDefaultForm } from "@/features/forms/default/sc/info/ext/fd/create.js";
import { FederationCapitalDefaultForm } from "@/features/forms/default/sc/info/ext/fd/capital.js";
import { FederationLeaderDefaultForm } from "@/features/forms/default/sc/info/ext/fd/leader.js";
import { checkFederationLeaveDefaultForm } from "@/features/forms/default/sc/info/ext/fd/leave.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";
import config from "@/config/server.js";
import { canLeadFederation, canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";

function federationBody(countryData: any) {
    const countryDB = new DynamicProperties("country");
    const playerDB = new DynamicProperties("player");
    const federation = normalizeFederationData(countryData);
    const leaderRaw = federation.leader ? playerDB.get(`player_${federation.leader}`) : undefined;
    const leaderData = leaderRaw ? JSON.parse(leaderRaw) : undefined;
    const capitalRaw = federation.capital ? countryDB.get(`country_${federation.capital}`) : undefined;
    const capitalData = capitalRaw ? JSON.parse(capitalRaw) : undefined;

    return {
        rawtext: [
            { translate: `federation.government.name` }, { text: `: ${federation.name || "-"}\n` },
            { translate: `federation.government.leader` }, { text: `: ${leaderData?.name ?? "None"}\n` },
            { translate: `federation.government.capital` }, { text: `: ${capitalData?.name ?? "None"}\n` },
            { translate: `federation.government.members` }, { text: `: ${federation.members.length}\n` },
            { translate: `received.federation.request` }, { text: `: ${federation.requests.length}` }
        ]
    };
}

function teleportFederationSpawn(player: any, countryData: any) {
    const countryDB = new DynamicProperties("country");
    const federation = normalizeFederationData(countryData);
    const capitalRaw = federation.capital ? countryDB.get(`country_${federation.capital}`) : undefined;
    const capitalData = capitalRaw ? JSON.parse(capitalRaw) : undefined;
    const spawnData = capitalData?.spawn?.default;

    if (!spawnData || spawnData.enabled !== true) {
        player.sendMessage({ translate: `command.chome.error.spawn_disabled` });
        return;
    }
    if (config.combatTagNoTeleportValidity && player.hasTag("mc_combat")) {
        player.sendMessage({ translate: "teleport.error.combattag" });
        return;
    }
    if (config.invaderNoTeleportValidity && player.getTags().find((tag: any) => tag.startsWith("war"))) {
        player.sendMessage({ translate: "teleport.error.invader" });
        return;
    }
    if (player.hasTag(`mc_notp`)) return;

    const [x, y, z, rx, ry, dimensionId] = spawnData.pos.split("_");
    if (CheckPermissionFromLocation(player, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
        player.sendMessage({ translate: `no.permission` });
        return;
    }

    player.teleport(
        { x: Number(x), y: Number(y), z: Number(z) },
        {
            dimension: world.getDimension(dimensionId.replace(`minecraft:`, ``)),
            rotation: { x: Number(rx), y: Number(ry) }
        }
    );
    player.sendMessage({ translate: `command.chome.result` });
}

/**
 * 連邦メインフォーム
 * @param {Player} player
 */
export function FederationMainDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    const countryManager = new CountryManager(playerData?.country);
    const countryData = countryManager.countryData;
    const federation = normalizeFederationData(countryData);
    const form = new ActionFormData();
    form.title({ translate: `form.federation.main.title` });

    if (!isFederationActive(federation)) {
        form.body({ translate: `federation.no.active` });
        form.button({ translate: `federation.government.create` });
        form.button({ translate: `send.federation.request` });
        form.show(player).then((rs) => {
            if (rs.canceled) {
                externalAffairsMainDefaultForm(player);
                return;
            }
            switch (rs.selection) {
                case 0: {
                    if (!CheckPermission(player, `federationPermission`) || !CheckPermission(player, `federationAdmin`)) {
                        CreateFederationDefaultForm(player);
                    } else {
                        player.sendMessage({ translate: `no.permission` });
                    }
                    break;
                }
                case 1: {
                    if (!CheckPermission(player, `federationPermission`) || !CheckPermission(player, `federationAdmin`)) {
                        AddFederationListDefaultForm(player);
                    } else {
                        player.sendMessage({ translate: `no.permission` });
                    }
                    break;
                }
            }
        });
        return;
    }

    form.body(federationBody(countryData));
    form.button({ translate: `form.federation.list.title` });
    form.button({ translate: `received.federation.request` });
    form.button({ translate: `federation.permission.edit` });
    form.button({ translate: `federation.capital.set` });
    form.button({ translate: `federation.leader.transfer` });
    form.button({ translate: `federation.spawn.teleport` });
    form.button({ translate: `federation.member.leave` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            externalAffairsMainDefaultForm(player);
            return;
        }
        switch (rs.selection) {
            case 0: {
                FederationListDefaultForm(player);
                break;
            }
            case 1: {
                if (canManageFederation(player, countryData)) {
                    ReceivedFederationRequestDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                }
                break;
            }
            case 2: {
                if (canManageFederation(player, countryData)) {
                    setFederationPermissionDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                }
                break;
            }
            case 3: {
                if (canManageFederation(player, countryData)) {
                    FederationCapitalDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                }
                break;
            }
            case 4: {
                if (canLeadFederation(player, countryData)) {
                    FederationLeaderDefaultForm(player);
                } else {
                    player.sendMessage({ translate: `no.permission` });
                }
                break;
            }
            case 5: {
                teleportFederationSpawn(player, countryData);
                break;
            }
            case 6: {
                checkFederationLeaveDefaultForm(player);
                break;
            }
        }
    });
}
