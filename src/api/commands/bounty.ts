import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { cancelOwnBounty, clearBountyAsAdmin, getAllBounties, placeBounty, showBountyMainForm } from "../player/bounty.js";

function bountyExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const amount = args[0];
    const target = args[1]?.[0];
    if (amount === undefined && !args[1]?.length) {
        showBountyMainForm(sender);
        return;
    }
    if (!Number.isInteger(amount) || !(target instanceof Player)) {
        sender.sendMessage({ translate: "bounty.command.parse_failed" });
        return;
    }

    placeBounty(sender, target, amount);
}

function bountyListExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const bounties = getAllBounties().sort((a: any, b: any) => b.amount - a.amount);

    if (bounties.length === 0) {
        sender.sendMessage({ translate: "bounty.list.empty" });
        return;
    }

    sender.sendMessage({ translate: "bounty.list.header", with: [`${bounties.length}`] });
    for (const bounty of bounties) {
        sender.sendMessage({ translate: "bounty.list.entry", with: [bounty.targetName, `${bounty.amount}`, bounty.placerName] });
    }
}

function cancelBountyExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const target = args[0]?.[0];
    if (!(target instanceof Player)) {
        sender.sendMessage({ translate: "bounty.command.parse_target_failed" });
        return;
    }

    cancelOwnBounty(sender, target);
}

function adminClearBountyExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: "bounty.command.admin_required" });
        return;
    }

    const target = args[0]?.[0];
    if (!(target instanceof Player)) {
        sender.sendMessage({ translate: "bounty.command.parse_target_failed" });
        return;
    }

    clearBountyAsAdmin(sender, target);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:bounty",
            description: "command.help.bounty.message",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [
                // @ts-ignore
                { name: "amount", type: CustomCommandParamType.Integer, optional: true },
                // @ts-ignore
                { name: "player", type: CustomCommandParamType.PlayerSelector, optional: true }
            ]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                bountyExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:bountylist",
            description: "command.help.bountylist.message",
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore
        ((origin) => {
            system.runTimeout(() => {
                bountyListExecuter(origin);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:cancelbounty",
            description: "command.help.cancelbounty.message",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                cancelBountyExecuter(origin, args);
            });
        })
    );

    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:clearbounty",
            description: "command.help.clearbounty.message",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            mandatoryParameters: [{ name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore
        ((origin, ...args) => {
            system.runTimeout(() => {
                adminClearBountyExecuter(origin, args);
            });
        })
    );
});
