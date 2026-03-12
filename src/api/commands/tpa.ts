import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import config from "../../config.js";
import { AcceptTeleportRequest, teleportRequest, tpaMainForm } from "../player/tpa.js";

function tpaExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!config.tpaValidity) {
        sender.sendMessage({ translate: `command.error.tpa.novalidity` });
        return;
    };
    if (sender.hasTag(`mc_notp`)) {
        return;
    };
    if (config.combatTagNoTeleportValidity) {
        if (sender.hasTag(`mc_combat`)) {
            sender.sendMessage({ translate: `teleport.error.combattag` });
            return;
        };
    };
    if (config.invaderNoTeleportValidity) {
        if (sender.getTags().find((tag: any) => tag.startsWith(`war`))) {
            sender.sendMessage({ translate: `teleport.error.invader` });
            return;
        };
    };
    if (args.length != 0) {
        if (args[0].length == 0) return;
        teleportRequest(sender, args[0][0].name);
        return;
    };
    tpaMainForm(sender);
};

function tpAcceptExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!config.tpaValidity) {
        sender.sendMessage({ translate: `command.error.tpa.novalidity` });
        return;
    };

    AcceptTeleportRequest(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:tpa',
            description: 'command.help.tpa.message',
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                tpaExecuter(origin, args);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:tpaccept',
            description: 'command.help.tpaccept.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                tpAcceptExecuter(origin, args);
            })
        })
    )
});
