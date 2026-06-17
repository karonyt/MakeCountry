import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { transferPlayer } from "@minecraft/server-admin";
import config from "@/config/server";

function karonNetWorkExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (config.combatTagNoTeleportValidity && sender.hasTag("mc_combat")) {
        sender.sendMessage({ translate: "teleport.error.combattag" });
        return;
    }
    if (config.invaderNoTeleportValidity && sender.getTags().find((tag: any) => tag.startsWith("war"))) {
        sender.sendMessage({ translate: "teleport.error.invader" });
        return;
    }
    if (sender.hasTag(`mc_notp`)) return;

    transferPlayer(sender, { hostname: "play.karon.jp", port: 19132 });
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:karonnetwork',
            description: 'command.help.karonnetwork.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                karonNetWorkExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:knw',
            description: 'command.help.karonnetwork.message',
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                karonNetWorkExecuter(origin, args);
            })
        })
    )
});