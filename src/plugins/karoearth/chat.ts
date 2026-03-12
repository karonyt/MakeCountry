import { CommandPermissionLevel, system, world } from "@minecraft/server";
import { playerHandler } from "../../api/api.js";
import { sendEvent } from "./server_net.js";
import { GetAndParsePropertyData } from "../../lib/util.js";
import config from "../../config.js";
import { formshow } from "./transfer.js";

system.beforeEvents.startup.subscribe((ev) => {
    if (config.world == 'dev') {
        return;
    };

    ev.customCommandRegistry.registerCommand({
        name: "makecountry:server",
        description: "サーバーを移動します",
        permissionLevel: CommandPermissionLevel.Any
    // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
    }, (origin, ...arg) => {
        const sender = origin?.sourceEntity;
        system.run(() => {
            formshow(sender);
        })
    })
})

playerHandler.beforeEvents.chat.subscribe((ev: any) => {
    const { player, message } = ev;
    if (player.getDynamicProperty(`isMute`) && !player.hasTag(`moderator`)) ev.cancel = true;
    if (player.hasTag(`moderator`) && message.startsWith('!')) ev.cancel = true;
});

function stripFormat(text: any) {
    return text.replace(/§./g, "");
}

playerHandler.afterEvents.chat.subscribe((ev: any) => {
    if (config.world == 'dev') {
        return;
    };

    const { player, message, type } = ev;
    system.run(async () => {
        if (type != "general") return;
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);

        let landId = playerData?.country;
        let land = `chat.player.no.join.any.country`;
        let penNameBefore = player.getDynamicProperty(`pennameBefore`) ?? config.initialPennameBefore;
        let penNameAfter = player.getDynamicProperty(`pennameAfter`) ?? config.initialPennameAfter;
        let penname = `§r|${penNameBefore}§r${penNameAfter}`;
        if (landId) land = playerCountryData?.name;
        if (land === `chat.player.no.join.any.country`) land = `無所属`;
        sendEvent({
            type: "chat",
            data: {
                server: config.world,
                minecraftId: player.id,
                senderName: `[${stripFormat(penname).substring(1)}] ${player.name} (${stripFormat(land)})`,
                text: message
            }
        });
    });
});
