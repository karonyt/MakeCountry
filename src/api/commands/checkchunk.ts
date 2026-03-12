import { CommandPermissionLevel, Player, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId } from "../../lib/util.js";

function checkChunkExecuter(origin: any, args: any) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(sender));
    if (!chunkData || (!chunkData.special && !chunkData.countryId)) {
        sender.sendMessage({ translate: `command.checkchunk.result.wilderness`, with: { rawtext: [{ translate: `wilderness.name` }] } });
        return;
    } else if (chunkData.special) {
        sender.sendMessage({ translate: `command.checkchunk.result.special`, with: { rawtext: [{ translate: `special.name` }] } });
        return;
    } else {
        if (chunkData.owner) {
            // @ts-ignore TS(2448): Block-scoped variable 'chunkCountryData' used befo... Remove this comment to see the full error message
            sender.sendMessage({ translate: `command.checkchunk.result.ownerland`, with: [`${chunkCountryData.owner}`] });
            return;
        };
        const chunkCountryData = GetAndParsePropertyData(`country_${chunkData.countryId}`)
        sender.sendMessage({ translate: `command.checkchunk.result.territory`, with: [`${chunkCountryData.name}`] });
        return;
    };
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:checkchunk',
            description: 'command.help.checkchunk.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                checkChunkExecuter(origin, args);
            });
        })
    );
});

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:cc',
            description: 'command.help.checkchunk.message',
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                checkChunkExecuter(origin, args);
            });
        })
    );
});