import { CommandPermissionLevel, GameMode, Player, system, world } from "@minecraft/server";
import { http, HttpRequest, HttpHeader, HttpRequestMethod } from "@minecraft/server-net";
import { GetAndParsePropertyData, GetPlayerChunkPropertyId, StringifyAndSavePropertyData } from "../../lib/util.js";
import * as DyProp from "../../lib/DyProp.js";
import { DynamicProperties } from "../../api/dyp.js";
import { savePlayerData } from "./transfer.js";
import { country } from "../../api/api.js";
import mapConfig from "./map/config.js";
import { Webhook_Delete_Country, Webhook_Make_Country, Webhook_Rename_Country } from "./webhook-make-country.js";
import config from "../../config.js";
import { boost } from "./rewardbuff.js";

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id == 'karo:netreset') {
        http.cancelAll('reset');
        return;
    };
});

let mcChatChannelId = "1142839504412098692";
switch (config.world) {
    case 'karoearth': {
        mcChatChannelId = "1142839504412098692";
        break;
    };
    case 'resource1': {
        mcChatChannelId = "1335126695870730270";
        break;
    };
    case 'resource2': {
        mcChatChannelId = "1335126720432308336";
        break;
    };
    case 'resource3': {
        mcChatChannelId = "1335126743807295488";
        break;
    };
    case 'resource4': {
        mcChatChannelId = "1467009983895048385";
        break;
    };
};

country.afterEvents.create.subscribe((ev: any) => {
    if (config.world != 'karoearth') return;
    Webhook_Make_Country(ev.countryName, ev.player, ev.invite, ev.peace, ev.countryId);
});

country.afterEvents.delete.subscribe((ev: any) => {
    if (config.world != 'karoearth') return;
    Webhook_Delete_Country(ev.countryName, ev.countryId);
});

country.afterEvents.rename.subscribe((ev: any) => {
    if (config.world != 'karoearth') return;
    Webhook_Rename_Country(ev.oldName, ev.newName, ev.countryId)
});

export async function sendEvent(body: any) {
    const req = new HttpRequest("http://192.168.100.4:20005/event/send");

    req.body = JSON.stringify(body);
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];
    await http.request(req);
}

let logs: any = []
export async function addLog(data: any) {
    logs.push(data);
    if (logs.length > 49) {
        let sendLogs = logs;
        logs = [];
        await sendLog(sendLogs);
    };
};

export async function sendLog(body: any) {
    const req = new HttpRequest("http://192.168.100.50:30100/log");

    req.body = JSON.stringify(body);
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader("Content-Type", "application/json")
    ];
    await http.request(req);
}

export async function sendToDiscord(data: any) {
    sendEvent({
        type: 'send_to_discord',
        data: data
    });
}

world.afterEvents.worldLoad.subscribe(async () => {
    if (config.world == 'dev') {
        return;
    };
    const date = new Date();
    if (date.getMinutes() == 30) return;
    await sendToDiscord({
        channelId: mcChatChannelId,
        content: {
            embeds: [
                {
                    color: 0x7cfc00,
                    description: "Server Started"
                }
            ]
        }
    });
});

world.beforeEvents.playerLeave.subscribe(async (ev) => {
    if (config.world == 'dev') {
        return;
    };
    const { player } = ev;
    const Name = player.name
    const Id = player.id;
    system.runTimeout(async () => {
        await sendEvent({
            type: 'leave',
            data: {
                server: config.world,
                minecraftId: Id,
                playerName: Name,
                amount: world.getPlayers().length
            }
        });
    });
});


system.beforeEvents.shutdown.subscribe(async () => {
    if (config.world == 'dev') {
        return;
    };
    await sendToDiscord({
        channelId: mcChatChannelId,
        content: {
            embeds: [
                {
                    color: 0xff0000,
                    description: "Server Stopped"
                }
            ]
        }
    })
});

world.afterEvents.playerSpawn.subscribe(async (ev) => {
    if (config.world == 'dev') {
        return;
    };
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;
    let firstJoin = false;
    if (!player.hasTag(`firstJoin`) && config.world == 'karoearth') {
        world.sendMessage({ rawtext: [{ text: `§a[かろEarth]\n§b${player.name} §r§b` }, { translate: `servernet.first_join` }] });
        firstJoin = true;
        player.addTag(`firstJoin`);
        await savePlayerData(player);
    };
    await sendEvent({
        type: 'join',
        data: {
            firstJoin: firstJoin,
            server: config.world,
            minecraftId: player.id,
            playerName: player.name,
            amount: world.getPlayers().length
        }
    });
});

world.afterEvents.worldLoad.subscribe(async () => {
    await subscribeEvent();
})

async function subscribeEvent() {
    try {
        const req = new HttpRequest("http://192.168.100.4:20005/event/receive");
        req.timeout = 5000;
        req.method = HttpRequestMethod.Get;

        const res = await http.request(req);

        if (res.status == 502) {
            console.warn("[Warning] Server is temporarily unavailable.");
        } else if (res.status != 200) {
            console.error(`[Error] HTTP Error: ${res.status}, ${res.body}`);
        } else {
            netEventHandler(res);
        }
    } catch (error) {
        // @ts-ignore TS(2571): Object is of type 'unknown'.
        console.error(`[Error] Request failed: ${error.message}`);
    }

    system.runTimeout(() => {
        subscribeEvent();
    }, 2);
}

function discordChatToMcChat(data: any) {
    if (data.server !== config.world) return;

    let lines = [];

    if (data.reply) {
        lines.push(`\n§7[Reply]§7${data.reply.author}§r: §7${data.reply.text}§r`);
    }

    lines.push(`${data.reply ? '§7--> §r' : ''}${data.text}`);

    for (const p of world.getPlayers()) {
        if (p.getDynamicProperty('isMuteGeneralChat') != 'true') {
            p.sendMessage(
                `§2[§bDiscord§2-§r${data.authorName}§2]§r ` +
                lines.join('\n')
            );
        };
    };
};

function voteNotify(data: any) {
    if (config.world == 'dev') {
        return;
    };
    if (data.userName) {
        world.sendMessage({ rawtext: [{ text: `§l§6 [VOTE]\n §r§l${data.userName} §l§a` }, { text: `${data.serverName}` }, { text: ` §a` }, { translate: `servernet.vote.broadcast` }] });
    };
}

function netEventHandler(res: any) {
    const events = {
        discord_chat: discordChatToMcChat,
        vote: voteNotify,
        'boost-req': boost
    };
    const eventList = JSON.parse(res.body);

    for (const event of eventList) {
        const type = event.type;
        const data = event.data;
        // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const handler = events[type];

        if (handler) handler(data);
    }
}

let reqque: any = null
world.afterEvents.worldLoad.subscribe(async () => {
    return;
    system.runInterval(async () => {
        try {
            const res = await http.get("http://192.168.100.4:20905/");
            if (res.body !== reqque) {
                if (reqque == null) {
                    reqque = res.body;
                    return;
                }
                reqque = res.body;
                const parseData = JSON.parse(res.body);
                switch (parseData.type) {
                    case `ban`: {
                        const rawDeviceIds = DyProp.getDynamicProperty("deviceIds") || "[]";
                        const deviceIds = JSON.parse(rawDeviceIds);
                        /**
                         * @type {Player}
                         */
                        const targetPlayers = world.getPlayers({ name: parseData.user });
                        if (targetPlayers.length == 0) return;
                        const target = targetPlayers[0];
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        const playerRawDataBefore = target.getDynamicProperty("accountData");
                        /**
                         * @type {{ "deviceId": [string] , "id": string , "xuid": string }}
                         */
                        // @ts-ignore TS(2345): Argument of type 'string | number | boolean | Vect... Remove this comment to see the full error message
                        const playerParseDataBefore = JSON.parse(playerRawDataBefore);
                        for (let deviceId of playerParseDataBefore.deviceId) {
                            if (!deviceIds.includes(deviceId)) {
                                deviceIds.push(deviceId);
                            };
                        };
                        // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                        DyProp.setDynamicProperty("deviceIds", JSON.stringify(deviceIds));

                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        if (parseData?.reason != "") target.setDynamicProperty(`banReason`, parseData?.reason);
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        target.setDynamicProperty(`isBan`, true);
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        target.runCommand(`kick "${playerParseDataBefore.xuid}" §c§lYou are banned\nReason: ${parseData?.reason}`);
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        world.sendMessage(`§a[KaronNetWork BAN System]§r\n${target.name} §r§7の接続を拒否しました`);
                        break;
                    };
                    case `mute`: {
                        const targetPlayers = world.getPlayers({ name: parseData.user });
                        if (targetPlayers.length == 0) return;
                        const target = targetPlayers[0];
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        target.setDynamicProperty(`isMute`, true);
                        break;
                    };
                    case `unmute`: {
                        const targetPlayers = world.getPlayers({ name: parseData.user });
                        if (targetPlayers.length == 0) return;
                        const target = targetPlayers[0];
                        // @ts-ignore TS(2532): Object is possibly 'undefined'.
                        target.setDynamicProperty(`isMute`);
                        break;
                    };
                    case `unban`: {
                        world.getDimension(`overworld`).runCommand(`scriptevent karo:unban ${parseData.user}`);
                        break;
                    };
                };
            }
        } catch (error) {
        }
    }, 10);
});

world.afterEvents.entityDie.subscribe(async (ev) => {
    if (config.world == 'dev') {
        return;
    };
    const { deadEntity: player, damageSource } = ev;
    if (!(player instanceof Player)) return;
    let reason = `Cause: ${damageSource.cause} `;
    if (damageSource?.damagingEntity) reason += `\nEntity: ${damageSource?.damagingEntity?.nameTag || damageSource?.damagingEntity?.typeId}`;
    if (damageSource?.damagingProjectile) reason += `\nProjectile: ${damageSource?.damagingProjectile?.nameTag || damageSource?.damagingProjectile?.typeId}`;

    sendToDiscord({
        channelId: mcChatChannelId,
        content: {
            embeds: [
                {
                    color: 0x730099,
                    description: `[Dead] ${player.name}\n${reason}`
                }
            ]
        }
    });
});

const voteCooldown = new Map();
const COOLDOWN_MS = 30 * 1000;

system.beforeEvents.startup.subscribe((ev) => {

    ev.customCommandRegistry.registerCommand({
        name: "makecountry:vote",
        description: "commands.servernet.vote",
        permissionLevel: CommandPermissionLevel.Any
    // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin) =>... Remove this comment to see the full error message
    }, (origin) => {

        const sender = origin?.sourceEntity;
        if (!sender) return;

        system.run(async () => {
            const now = Date.now();
            // @ts-ignore TS(2339): Property 'name' does not exist on type 'Entity'.
            const last = voteCooldown.get(sender.name) ?? 0;

            if (now - last < COOLDOWN_MS) {
                const remain = Math.ceil((COOLDOWN_MS - (now - last)) / 1000);
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
                sender.sendMessage({ translate: "servernet.vote.error.cooldown", with: [`${remain}`] });
                return;
            }

            // @ts-ignore TS(2339): Property 'name' does not exist on type 'Entity'.
            voteCooldown.set(sender.name, now);

            try {
                const res = await http.get(
                    // @ts-ignore TS(2339): Property 'name' does not exist on type 'Entity'.
                    `http://192.168.100.4:20025/votes/pull?user=${sender.name.replace(/ /g, '.')}`
                );
                const votes = JSON.parse(res.body);

                if (!Array.isArray(votes) || votes.length === 0) {
                    // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
                    sender.sendMessage({ translate: "servernet.vote.error.empty" });
                    return;
                }

                const rewardCount = votes.length;
                sender.runCommand(`give @s karo:ticket ${Math.floor(rewardCount * 3)}`);
                sender.runCommand(`scriptevent karo:add ${Math.floor(rewardCount * 3000)}`);
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
                sender.sendMessage({ translate: "servernet.vote.success", with: [`${rewardCount}`] });

            } catch (e) {
                // @ts-ignore TS(2339): Property 'sendMessage' does not exist on type 'Ent... Remove this comment to see the full error message
                sender.sendMessage({ translate: "servernet.vote.error.fetch" });
                console.error(e);
            }
        });
    });
    if (config.world !== "karoearth") return;

    ev.customCommandRegistry.registerCommand({
        name: "makecountry:login",
        description: "commands.servernet.login",
        permissionLevel: CommandPermissionLevel.Any
    // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
    }, (origin, ...arg) => {
        const sender = origin?.sourceEntity;
        system.run(() => {

            function getLocalDate() {
                const now = new Date();
                return new Date(now.getTime() + ((config.timeDifference || 0) * 60 * 60 * 1000));
            }

            function formatDateLocal(date: any) {
                const yy = String(date.getUTCFullYear()).slice(-2);
                const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
                const dd = String(date.getUTCDate()).padStart(2, '0');
                return `${yy}-${mm}-${dd}`;
            }

            function getTodayLocal() {
                const d = getLocalDate();
                return formatDateLocal(d);
            }

            function getYesterdayLocal() {
                const d = getLocalDate();
                d.setUTCDate(d.getUTCDate() - 1);
                return formatDateLocal(d);
            }

            const todayStr = getTodayLocal();
            const yesterdayStr = getYesterdayLocal();

            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const rawData = sender.getDynamicProperty("loginData");
            const parseData = rawData
                // @ts-ignore TS(2345): Argument of type 'string | number | true | Vector3... Remove this comment to see the full error message
                ? JSON.parse(rawData)
                : { last: "none", continuing: 0 };

            if (parseData.last === todayStr) {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                sender.sendMessage({ translate: "servernet.login.error.already_claimed" });
                return;
            }

            if (parseData.last === yesterdayStr) {
                parseData.continuing += 1;
            } else {
                parseData.continuing = 1;
            }

            let ticketAmount;

            const days = parseData.continuing;

            if (days <= 10) {
                ticketAmount = 1;
            } else if (days <= 20) {
                ticketAmount = 2;
            } else {
                ticketAmount = 3;
            }

            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            sender.runCommand(`give @s karo:login_ticket ${ticketAmount}`);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            sender.sendMessage({ translate: "servernet.login.success", with: [`${days}`, `${ticketAmount}`] });

            parseData.last = todayStr;
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            sender.setDynamicProperty("loginData", JSON.stringify(parseData));
            return;
        })
    })
})

world.afterEvents.entityDie.subscribe(async (ev) => {
    if (config.world == 'dev') {
        return;
    };
    const { deadEntity, damageSource } = ev;
    //if (!killLogCheckEntityIds.includes(`${deadEntity?.typeId}`)) return;
    try {
        const { x, y, z } = deadEntity.location;
        const date = new Date();
        date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        const str_date = date.toISOString().replace('T', ' ').substring(0, 19);

        await addLog({
            server: config.world,
            table: `kill_logs`,
            data: {
                deader_type: `${deadEntity?.typeId}`,
                deader_name: `${deadEntity?.nameTag}`,
                cause: `${damageSource?.cause}`,
                damager_type: `${damageSource?.damagingEntity?.typeId}`,
                damager_name: `${damageSource?.damagingEntity?.nameTag}`,
                x: Math.floor(x) ?? null,
                y: Math.floor(y) ?? null,
                z: Math.floor(z) ?? null,
                dimension: `${deadEntity.dimension.id}`,
                timestamp: `${str_date}`,
            },
        });
    } catch (error) { };
});

world.afterEvents.playerPlaceBlock.subscribe(async (ev) => {
    if (config.world == 'dev') {
        return;
    };
    const { player, block } = ev;
    const x = block.x;
    const y = block.y;
    const z = block.z;
    const date = new Date();
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    const str_date = date.toISOString().replace('T', ' ').substring(0, 19);

    await addLog({
        server: config.world,
        table: `place_logs`,
        data: {
            player_name: `${player.name}`,
            block: `${block?.typeId}`,
            x: x,
            y: y,
            z: z,
            dimension: `${player.dimension.id}`,
            timestamp: `${str_date}`,
        }
    });
});

world.afterEvents.playerBreakBlock.subscribe(async (ev) => {
    if (config.world == 'dev') {
        return;
    };
    const { player, brokenBlockPermutation, block } = ev;
    const x = block.x;
    const y = block.y;
    const z = block.z;
    const date = new Date();
    date.setTime(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    const str_date = date.toISOString().replace('T', ' ').substring(0, 19);

    await addLog({
        server: config.world,
        table: `break_logs`,
        data: {
            player_name: `${player.name}`,
            block: `${brokenBlockPermutation?.type.id}`,
            x: x,
            y: y,
            z: z,
            dimension: `${player.dimension.id}`,
            timestamp: `${str_date}`,
        }
    });
});

system.beforeEvents.shutdown.subscribe(async () => {
    if (config.world == 'dev') {
        return;
    };

    let sendLogs = logs;
    logs = [];
    await sendLog(sendLogs);
});

