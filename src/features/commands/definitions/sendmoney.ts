import { CommandPermissionLevel, CustomCommandParamType, Player, system } from "@minecraft/server";
import { sendMoneyBetweenPlayers } from "@/domain/player/money-transfer.js";

function sendMoneyExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    sendMoneyBetweenPlayers(origin.sourceEntity, args[1]?.[0], args[0], 1000000000000);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sendmoney',
            description: 'command.help.sendmoney.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "amount", type: CustomCommandParamType.Integer }, { name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                sendMoneyExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:pay',
            description: 'command.help.sendmoney.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "amount", type: CustomCommandParamType.Integer }, { name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                sendMoneyExecuter(origin, args);
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:msend',
            description: 'command.help.sendmoney.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "amount", type: CustomCommandParamType.Integer }, { name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                sendMoneyExecuter(origin, args);
            })
        })
    )
});
