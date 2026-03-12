import { CommandPermissionLevel, Player, system, CustomCommandParamType } from "@minecraft/server";
import { showQuestMainForm } from "./daily_quest/forms.js";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:quest',
            description: 'デイリークエストメニューを開きます',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin) =>... Remove this comment to see the full error message
        ((origin) => {
            system.run(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                origin.sourceEntity.sendMessage("[Daily Quest]§l§c当該機能は一時的に停止しています。ご了承ください。");
            });
        })
    );

});
