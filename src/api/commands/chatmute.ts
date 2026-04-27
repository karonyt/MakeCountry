import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import { getMutedPlayerNames, mutePlayer, resolvePlayerName, unmutePlayer } from "../../lib/chat_mute.js";
import { openChatMuteFormFromName, playerChatMuteMenuForm } from "../../forms/default/menu/setting/chat_mute.js";

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
        sender.sendMessage("§cプレイヤー名を入力してください");
        return;
    }
    if (resolvedName.trim().toLowerCase() === sender.name.trim().toLowerCase()) {
        sender.sendMessage("§c自分自身は個別ミュートできません");
        return;
    }

    const result = mutePlayer(sender, resolvedName);
    sender.sendMessage(result.changed
        ? `§a${resolvedName} を個別ミュートしました`
        : `§e${resolvedName} はすでに個別ミュートされています`);
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
        ? `§a${resolvedName} の個別ミュートを解除しました`
        : `§e${resolvedName} は個別ミュートされていません`);
}

function chatMuteListExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const mutedPlayers = getMutedPlayerNames(sender);

    if (mutedPlayers.length < 1) {
        sender.sendMessage("§e個別ミュート中のプレイヤーはいません");
        return;
    }

    sender.sendMessage(`§a個別ミュート一覧 (${mutedPlayers.length}人)\n§f${mutedPlayers.join("\n")}`);
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
            description: "Mute a player's chat only for yourself",
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
            description: "Unmute a player's chat only for yourself",
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
            description: "Show your personal muted players",
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
            description: "Open personal chat mute form",
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
