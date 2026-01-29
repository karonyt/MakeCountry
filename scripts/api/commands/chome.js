import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { CheckPermissionFromLocation, GetAndParsePropertyData } from "../../lib/util";
import config from "../../config";

function countryHomeExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const playerDataBase = new DynamicProperties("player");
    const countryDataBase = new DynamicProperties("country");

    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);

    if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
        sender.sendMessage({ translate: "teleport.error.combattag" });
        return;
    }
    if (config.invaderNoTeleportValidity && sender.getTags().find(tag => tag.startsWith("war"))) {
        sender.sendMessage({ translate: "teleport.error.invader" });
        return;
    }
    if (sender.hasTag(`mc_notp`)) return;

    if (!playerData?.country) {
        sender.sendMessage({ translate: `command.chome.error.notjoin.country` });
        return;
    }

    const countryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
    if (!countryData?.spawn) return;

    // スポーン名取得、指定がなければ "default"
    const spawnName = args[0]?.trim() || "default";
    const spawnData = countryData.spawn[spawnName];

    if (!spawnData || !spawnData.enabled) {
        sender.sendMessage({ translate: `command.chome.error.spawn_disabled` });
        return;
    }

    const [x, y, z, rx, ry, dimensionId] = spawnData.pos.split("_");

    // 権限チェック
    if (CheckPermissionFromLocation(sender, Number(x), Number(z), dimensionId, `publicHomeUse`)) {
        sender.sendMessage({ translate: `no.permission` });
        return;
    }

    // テレポート
    sender.teleport(
        { x: Number(x), y: Number(y), z: Number(z) },
        {
            dimension: world.getDimension(dimensionId.replace(`minecraft:`, ``)),
            rotation: { x: Number(rx), y: Number(ry) }
        }
    );

    sender.sendMessage({ translate: `command.chome.result` });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:countryhome',
            description: 'command.help.countryhome.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: 'SpawnName', type: CustomCommandParamType.String }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                countryHomeExecuter(origin, args);;
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:chome',
            description: 'command.help.countryhome.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: 'SpawnName', type: CustomCommandParamType.String }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                countryHomeExecuter(origin, args)
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:teleportcountryhome',
            description: 'command.help.countryhome.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: 'SpawnName', type: CustomCommandParamType.String }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                countryHomeExecuter(origin, args)
            });
        })
    );
});