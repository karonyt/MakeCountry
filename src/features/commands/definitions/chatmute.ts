import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { getMutedPlayerNames, mutePlayer, resolvePlayerName, unmutePlayer } from "@/domain/chat/mute.js";
import { openChatMuteFormFromName, playerChatMuteMenuForm } from "@/features/forms/default/menu/setting/chat_mute.js";

function getTargetName(args: any[]) {
    const raw = args?.[0];
    return typeof raw === "string" ? raw.trim() : "";
}

function chatMuteExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const targetName = getTargetName(args);

    if (!targetName) {
        playerChatMuteMenuForm(sender);
        return;
    }

    const resolvedName = resolvePlayerName(targetName, world.getPlayers());
    if (!resolvedName) {
        sender.sendMessage({ translate: "chatmute.error.name_required" });
        return;
    }
    if (resolvedName.trim().toLowerCase() === sender.name.trim().toLowerCase()) {
        sender.sendMessage({ translate: "chatmute.error.self" });
        return;
    }

    const result = mutePlayer(sender, resolvedName);
    sender.sendMessage(result.changed
        ? { translate: "chatmute.muted", with: [resolvedName] }
        : { translate: "chatmute.already_muted", with: [resolvedName] });
}

function chatUnmuteExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const targetName = getTargetName(args);

    if (!targetName) {
        playerChatMuteMenuForm(sender);
        return;
    }

    const resolvedName = resolvePlayerName(targetName, world.getPlayers());
    const result = unmutePlayer(sender, resolvedName);
    sender.sendMessage(result.changed
        ? { translate: "chatmute.unmuted", with: [resolvedName] }
        : { translate: "chatmute.not_muted", with: [resolvedName] });
}

function chatMuteListExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const mutedPlayers = getMutedPlayerNames(sender);

    if (mutedPlayers.length < 1) {
        sender.sendMessage({ translate: "chatmute.empty" });
        return;
    }

    sender.sendMessage({
        rawtext: [
            { translate: "chatmute.list.header", with: [`${mutedPlayers.length}`] },
            { text: `\n§f${mutedPlayers.join("\n")}` },
        ],
    });
}

function chatMuteFormExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    openChatMuteFormFromName(origin.sourceEntity, getTargetName(args));
}

system.beforeEvents.startup.subscribe((event) => {
    const optionalNameParameter = [{ name: "playerName", type: CustomCommandParamType.String }];

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:chatmute",
            description: "command.help.chatmute.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: optionalNameParameter
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                chatMuteExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:chatunmute",
            description: "command.help.chatunmute.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: optionalNameParameter
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                chatUnmuteExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:chatmutelist",
            description: "command.help.chatmutelist.message",
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                chatMuteListExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:chatmuteform",
            description: "command.help.chatmuteform.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: optionalNameParameter
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                chatMuteFormExecuter(origin, args);
            });
        })
    );
});
