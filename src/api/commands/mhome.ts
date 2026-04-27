import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { setMarriageHomeAtCurrentLocation, teleportToMarriageHome } from "../player/marriage.js";

function marriageHomeExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const subCommand = `${args[0] ?? "tp"}`.toLowerCase();

    if (subCommand === "set") {
        setMarriageHomeAtCurrentLocation(sender);
        return;
    }
    if (subCommand === "tp") {
        teleportToMarriageHome(sender);
        return;
    }

    sender.sendMessage({ translate: "marriage.home.command.usage" });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:mhome",
            description: "command.help.mhome.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "mode", type: CustomCommandParamType.String }]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                marriageHomeExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:marriagehome",
            description: "command.help.mhome.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "mode", type: CustomCommandParamType.String }]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                marriageHomeExecuter(origin, args);
            });
        })
    );
});
