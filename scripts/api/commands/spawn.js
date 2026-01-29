import {
    CommandPermissionLevel,
    CustomCommandParamType,
    Player,
    system,
    world
} from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermissionFromLocation } from "../../lib/util";
import config from "../../config";

function spawnExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    system.runTimeout(() => {
        const countryDataBase = new DynamicProperties("country");

        const countryId = args[0];
        const spawnName = args[1] ?? "default";

        const rawCountryData = countryDataBase.get(`country_${countryId}`);
        if (!rawCountryData) {
            sender.sendMessage({ translate: "command.spawn.error.country_not_found" });
            return;
        }

        const countryData = JSON.parse(rawCountryData);

        if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
            sender.sendMessage({ translate: "teleport.error.combattag" });
            return;
        }

        if (config.invaderNoTeleportValidity && sender.getTags().some(t => t.startsWith("war"))) {
            sender.sendMessage({ translate: "teleport.error.invader" });
            return;
        }

        if (sender.hasTag("mc_notp")) {
            sender.sendMessage({ translate: "command.spawn.error.notp" });
            return;
        }

        const spawnData = countryData.spawn?.[spawnName];
        if (!spawnData) {
            sender.sendMessage({ translate: "command.spawn.error.spawn_not_found" });
            return;
        }

        if (spawnData.enabled !== true) {
            sender.sendMessage({ translate: "command.spawn.error.spawn_disabled" });
            return;
        }

        const [x, y, z, rx, ry, dimensionId] = spawnData.pos.split("_");

        if (
            CheckPermissionFromLocation(
                sender,
                Number(x),
                Number(z),
                dimensionId,
                "publicHomeUse"
            )
        ) {
            sender.sendMessage({ translate: "no.permission" });
            return;
        }

        sender.teleport(
            { x: Number(x), y: Number(y), z: Number(z) },
            {
                dimension: world.getDimension(dimensionId.replace("minecraft:", "")),
                rotation: { x: Number(rx), y: Number(ry) }
            }
        );

        sender.sendMessage({ translate: "command.chome.result" });
    });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:spawn",
            description: "command.help.spawn.message",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [
                { name: "countryID", type: CustomCommandParamType.Integer }
            ],
            optionalParameters: [
                { name: "spawnName", type: CustomCommandParamType.String }
            ]
        },
        (origin, ...args) => {
            system.runTimeout(() => {
                spawnExecuter(origin, args);
            });
        }
    );
});
