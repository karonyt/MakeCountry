import { CommandPermissionLevel, Player, system } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { getFederationMemberIds, isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";

function federationMemberListExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const playerData = GetAndParsePropertyData(`player_${sender.id}`);

    if (!playerData?.country) {
        sender.sendMessage({ translate: `federation.error.not_joined` });
        return;
    }

    const countryDataBase = new DynamicProperties("country");
    const countryData = GetAndParsePropertyData(`country_${playerData.country}`, countryDataBase);
    const federation = normalizeFederationData(countryData);

    if (!isFederationActive(federation)) {
        sender.sendMessage({ translate: `federation.error.not_joined` });
        return;
    }

    const memberNames = [];
    for (const countryId of getFederationMemberIds(countryData)) {
        const memberCountryData = GetAndParsePropertyData(`country_${countryId}`, countryDataBase);
        if (!memberCountryData) continue;
        memberNames.push(`${memberCountryData.name} §7(ID: ${memberCountryData.id})§r`);
    }

    sender.sendMessage({
        rawtext: [
            { text: `§a[MakeCountry]\n§r` },
            { translate: `federation.member.list.title`, with: [`${federation.name}`] },
            { text: `\n` },
            { translate: `federation.member.count`, with: [`${memberNames.length}`] },
            { text: `\n§f${memberNames.join(`\n`)}` }
        ]
    });
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: `makecountry:fdlist`,
            description: `command.help.fdlist.message`,
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                federationMemberListExecuter(origin, args);
            });
        })
    );
});
