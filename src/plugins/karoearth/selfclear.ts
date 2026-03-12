import { CommandPermissionLevel, system, Player } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:selfclear",
            description: "commands.selfclear.description",
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore
        (origin) => {
            if (!(origin.sourceEntity instanceof Player)) return;

            const player: Player = origin.sourceEntity;

            system.runTimeout(() => {
                try {
                    player.runCommand("clear @s");
                    player.sendMessage({ translate: "selfclear.success" });
                } catch (error) {
                    player.sendMessage({ translate: "selfclear.error" });
                }
            }, 1);
        }
    );
});
