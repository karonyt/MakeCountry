import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { showFishEncyclopedia } from "@/features/fishing/fish-encyclopedia.js";

function fishBookExecuter(origin: any, args: any[] = []) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const query = typeof args[0] === "string" ? args[0].trim() : "";
    showFishEncyclopedia(origin.sourceEntity, 0, query ? { query, mode: "all" } : undefined);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:fishbook",
            description: "command.help.fishbook.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "Search", type: CustomCommandParamType.String }],
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin) => void' is not assignable here.
        ((origin, ...args) => {
            system.runTimeout(() => fishBookExecuter(origin, args));
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:fishdex",
            description: "command.help.fishbook.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [{ name: "Search", type: CustomCommandParamType.String }],
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin) => void' is not assignable here.
        ((origin, ...args) => {
            system.runTimeout(() => fishBookExecuter(origin, args));
        })
    );
});
