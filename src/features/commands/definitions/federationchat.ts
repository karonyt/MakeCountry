import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";

function federationChatExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const playerDataBase = new DynamicProperties('player');
    const rawData = playerDataBase.get(`player_${sender.id}`);
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(rawData);

    if (!playerData?.country || playerData.country < 1) {
        sender.sendMessage({ translate: `cannnot.use.nojoin.country` });
        return;
    };
    const countryManager = new CountryManager(playerData.country);
    if (!isFederationActive(normalizeFederationData(countryManager.countryData))) {
        sender.sendMessage({ translate: `federation.no.active` });
        return;
    }
    sender.setDynamicProperty(`chatType`, `federation`);
    sender.sendMessage({ rawtext: [{ translate: `chattype.changed`, with: { rawtext: [{ translate: `federation.chat` }] } }] })
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:federationchat',
            description: 'command.help.federationchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                federationChatExecuter(origin, args)
            })
        })
    )

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:fdc',
            description: 'command.help.federationchat.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                federationChatExecuter(origin, args);
            })
        })
    )
});
