import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { addPlayerToGroupChat, createGroupChat, disbandGroupChat, leaveGroupChat, removePlayerFromGroupChat, showGroupChatInfo, switchToGroupChat } from "../player/group_chat.js";

function groupChatExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    switchToGroupChat(origin.sourceEntity);
}

function groupCreateExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    createGroupChat(origin.sourceEntity, args[0]);
}

function groupInviteExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    addPlayerToGroupChat(origin.sourceEntity, args?.[0]?.[0]);
}

function groupKickExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    removePlayerFromGroupChat(origin.sourceEntity, args?.[0]?.[0]);
}

function groupLeaveExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    leaveGroupChat(origin.sourceEntity);
}

function groupDisbandExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    disbandGroupChat(origin.sourceEntity);
}

function groupInfoExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    showGroupChatInfo(origin.sourceEntity);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupchat",
            description: "Switch to your group chat",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupChatExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:gc",
            description: "Switch to your group chat",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupChatExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupcreate",
            description: "Create a group chat",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "name", type: CustomCommandParamType.String }],
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupCreateExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupinvite",
            description: "Add a player to your group chat",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }],
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupInviteExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupkick",
            description: "Remove a player from your group chat",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }],
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupKickExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupleave",
            description: "Leave your current group chat",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupLeaveExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupdisband",
            description: "Disband your owned group chat",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupDisbandExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:groupinfo",
            description: "Show current group chat info",
            permissionLevel: CommandPermissionLevel.Any,
        },
        // @ts-ignore TS(2345)
        ((origin, ...args) => {
            system.runTimeout(() => {
                groupInfoExecuter(origin);
            });
        })
    );
});
