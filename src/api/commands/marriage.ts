import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { sendMarriageRequest, showMarriageMainForm } from "../player/marriage.js";

function marriageExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (args.length === 0 || !args[0]?.length) {
        showMarriageMainForm(sender);
        return;
    }

    const target = args[0][0];
    if (!target || !(target instanceof Player)) {
        sender.sendMessage({ translate: "marriage.request.error.resolve_player" });
        return;
    }

    sendMarriageRequest(sender, target);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:marriage",
            description: "command.help.marriage.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                marriageExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:kekkon",
            description: "command.help.marriage.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                marriageExecuter(origin, args);
            });
        })
    );
});
