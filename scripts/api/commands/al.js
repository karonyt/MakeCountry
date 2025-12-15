import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "../dyp";
import { callCountryListForm } from "../../forms/form";

function allianceListExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const playerDataBase = new DynamicProperties('player');
    const rawData = playerDataBase.get(`player_${sender.id}`);
    const playerData = JSON.parse(rawData);

    if (!playerData?.country) {
        sender.sendMessage({ translate: 'cannnot.use.nojoin.country' });
        return;
    };
    callCountryListForm(sender, 'al');
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:alliancelist',
            description: 'command.help.alliancelist.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                allianceListExecuter(origin, args);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:al',
            description: 'command.help.alliancelist.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                allianceListExecuter(origin, args);
            })
        })
    )
});