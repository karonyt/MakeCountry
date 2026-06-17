import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { settingFederationDefaultForm } from "@/features/forms/default/sc/info/ext/fd/setting_federation.js";

function settingFederationExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    settingFederationDefaultForm(origin.sourceEntity);
}

system.beforeEvents.startup.subscribe((event) => {
    for (const name of [`makecountry:settingfederation`, `makecountry:sfd`]) {
        event.customCommandRegistry.registerCommand(
            {
                name,
                description: `command.help.settingfederation.message`,
                permissionLevel: CommandPermissionLevel.Any
            },
            // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
            ((origin, ...args) => {
                system.runTimeout(() => {
                    settingFederationExecuter(origin, args);
                });
            })
        );
    }
});
