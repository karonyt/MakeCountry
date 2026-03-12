import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { teleportToSpouse } from "../player/marriage.js";

function spouseTpExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    teleportToSpouse(origin.sourceEntity);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:spousetp",
            description: "command.help.spousetp.message",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore
        ((origin) => {
            system.runTimeout(() => {
                spouseTpExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:mtp",
            description: "command.help.spousetp.message",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore
        ((origin) => {
            system.runTimeout(() => {
                spouseTpExecuter(origin);
            });
        })
    );
});
