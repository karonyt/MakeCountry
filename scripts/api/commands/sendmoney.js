import { CommandPermissionLevel, CustomCommandParamType, Player, system, world } from "@minecraft/server";
import config from "../../config";
import { GetAndParsePropertyData, StringifyAndSavePropertyData } from "../../lib/util";
import { DynamicProperties } from "../dyp";

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:sendmoney',
            description: 'command.help.sendmoney.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "amount", type: CustomCommandParamType.Integer }, { name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                const amount = Number(args[0]);
                //const targetName = args[1].name;
                /**
                 * @type {Player}
                 */
                //const targetPlayer = world.getDimension(this.sender.dimension.id).getEntities({ type: "minecraft:player", name: targetName })[0];
                const targetPlayer = args[1][0];

                if (!targetPlayer) {
                    sender.sendMessage({ translate: `command.error.notarget.this.dimension` });
                    return;
                };
                if (targetPlayer.id == sender.id) {
                    sender.sendMessage({ translate: `command.error.trysend.moremoney.yourself` })
                    return;
                };
                if (amount < 1) {
                    sender.sendMessage({ translate: `command.error.canuse.number.more`, with: [`1`] });
                    return;
                };
                if (playerData.money < amount) {
                    sender.sendMessage({ translate: `command.error.trysend.moremoney.youhave`, with: [`${playerData.money}`] });
                    return;
                };
                const targetData = GetAndParsePropertyData(`player_${targetPlayer.id}`);
                targetData.money += Math.floor(amount);
                playerData.money -= Math.floor(amount);
                StringifyAndSavePropertyData(`player_${targetPlayer.id}`, targetData);
                StringifyAndSavePropertyData(`player_${sender.id}`, playerData);
                sender.sendMessage({ translate: `command.sendmoney.result.sender`, with: [targetPlayer.name, `${config.MoneyName} ${Math.floor(amount)}`] });
                targetPlayer.sendMessage({ translate: `command.sendmoney.result.receiver`, with: [sender.name, `${config.MoneyName} ${Math.floor(amount)}`] });
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:pay',
            description: 'command.help.sendmoney.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "amount", type: CustomCommandParamType.Integer }, { name: "player", type: CustomCommandParamType.PlayerSelector }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
                const sender = origin.sourceEntity;

                const playerDataBase = new DynamicProperties('player');
                const rawData = playerDataBase.get(`player_${sender.id}`);
                const playerData = JSON.parse(rawData);

                const amount = Number(args[0]);
                //const targetName = args[1].name;
                /**
                 * @type {Player}
                 */
                //const targetPlayer = world.getDimension(this.sender.dimension.id).getEntities({ type: "minecraft:player", name: targetName })[0];
                const targetPlayer = args[1][0];

                if (!targetPlayer) {
                    sender.sendMessage({ translate: `command.error.notarget.this.dimension` });
                    return;
                };
                if (targetPlayer.id == sender.id) {
                    sender.sendMessage({ translate: `command.error.trysend.moremoney.yourself` })
                    return;
                };
                if (amount < 1) {
                    sender.sendMessage({ translate: `command.error.canuse.number.more`, with: [`1`] });
                    return;
                };
                if (playerData.money < amount) {
                    sender.sendMessage({ translate: `command.error.trysend.moremoney.youhave`, with: [`${playerData.money}`] });
                    return;
                };
                const targetData = GetAndParsePropertyData(`player_${targetPlayer.id}`);
                targetData.money += Math.floor(amount);
                playerData.money -= Math.floor(amount);
                StringifyAndSavePropertyData(`player_${targetPlayer.id}`, targetData);
                StringifyAndSavePropertyData(`player_${sender.id}`, playerData);
                sender.sendMessage({ translate: `command.sendmoney.result.sender`, with: [targetPlayer.name, `${config.MoneyName} ${Math.floor(amount)}`] });
                targetPlayer.sendMessage({ translate: `command.sendmoney.result.receiver`, with: [sender.name, `${config.MoneyName} ${Math.floor(amount)}`] });
            })
        })
    )
});