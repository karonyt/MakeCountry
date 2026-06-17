import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { getPlayerDataById } from "@/domain/player/marriage.js";

function spouseChatExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const senderData = getPlayerDataById(sender.id);

    if (!senderData?.marriage?.spouseId) {
        sender.sendMessage({ translate: "marriage.error.not_married" });
        return;
    }

    sender.setDynamicProperty("chatType", "spouse");
    sender.sendMessage({ translate: "spousechat.switched" });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:spousechat",
            description: "command.help.spousechat.message",
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
