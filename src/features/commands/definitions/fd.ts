import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { FederationMainDefaultForm } from "@/features/forms/default/sc/info/ext/fd/main.js";

function federationListExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const playerDataBase = new DynamicProperties('player');
    const rawData = playerDataBase.get(`player_${sender.id}`);
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(rawData);

    if (!playerData?.country) {
        sender.sendMessage({ translate: 'cannnot.use.nojoin.country' });
        return;
    };
    FederationMainDefaultForm(sender);
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:federationlist',
            description: 'command.help.federationlist.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                federationListExecuter(origin, args);
            })
        })
    )
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:fd',
            description: 'command.help.federationlist.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                federationListExecuter(origin, args);
            })
        })
    )
});
