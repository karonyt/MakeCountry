import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { getPlayerDataById } from "../player/marriage.js";

function spouseChatExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const senderData = getPlayerDataById(sender.id);

    if (!senderData?.marriage?.spouseId) {
        sender.sendMessage("You are not married.");
        return;
    }

    sender.setDynamicProperty("chatType", "spouse");
    sender.sendMessage("Switched to spouse chat.");
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:spousechat",
            description: "Switch to spouse chat",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                spouseChatExecuter(origin);
            });
        })
    );
});
