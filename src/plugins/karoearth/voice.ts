import { world, system, CommandPermissionLevel, CustomCommandParamType } from '@minecraft/server';
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from '@minecraft/server-net';

const BACKEND_URL_INTERNAL = 'https://internal-api.voice.khserver.xyz';
const INTERNAL_API_KEY = '8bTmhyEzGqkxSODyIhQB1faXoY4MibdWFdhUZ7mK67TzOzBEvawmWPew6QIADqKL4kU';

const VOICE_DP_KEY = 'voicechat:auth_data';

function createInternalRequest(path: any, bodyObject = {}) {
    const req = new HttpRequest(`${BACKEND_URL_INTERNAL}${path}`);
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader('Content-Type', 'application/json'),
        new HttpHeader('X-Internal-API-Key', INTERNAL_API_KEY)
    ];
    req.body = JSON.stringify(bodyObject);
    return req;
}

system.beforeEvents.startup.subscribe(event => {
    event.customCommandRegistry.registerCommand({
        name: "makecountry:voice",
        description: "commands.voice.description",
        permissionLevel: CommandPermissionLevel.Any,
        optionalParameters: [
            { name: "subcommand", type: CustomCommandParamType.String }
        ]
    // @ts-ignore
    }, (origin, ...args) => {
        system.run(() => handleVoiceCommand(origin, args));
    });
});

async function handleVoiceCommand(origin: any, args: any) {
    const sender = origin.sourceEntity;
    if (!sender || sender.typeId !== "minecraft:player") {
        return;
    }

    const subcommand = args[0] ? String(args[0]).toLowerCase() : 'help';

    try {
        switch (subcommand) {
            case 'connect':
                await handleConnectCommand(sender);
                break;
            case 'logout':
                await handleLogoutCommand(sender);
                break;
            case 'help':
            default:
                sender.sendMessage({ translate: "voice.help.header" });
                sender.sendMessage({ translate: "voice.help.connect" });
                sender.sendMessage({ translate: "voice.help.logout" });
                sender.sendMessage({ translate: "voice.help.help" });
                break;
        }
    } catch (e) {
        console.error("Voice command error:", e);
        sender.sendMessage({ translate: "voice.error.command" });
    }
}

async function handleConnectCommand(player: any) {
    const authData = player.getDynamicProperty(VOICE_DP_KEY);
    if (authData) {
        player.sendMessage({ translate: "voice.connect.already_linked" });
        player.sendMessage({ translate: "voice.connect.already_linked_hint" });
        return;
    }

    player.sendMessage({ translate: "voice.connect.requesting" });
    try {
        const req = createInternalRequest('/generate-link-token', { uuid: player.id, username: player.name });
        const response = await http.request(req);

        if (response.status === 200) {
            const data = JSON.parse(response.body);
            if (data.token) {
                player.sendMessage({ translate: "voice.connect.token", with: [`${data.token}`] });
                player.sendMessage({ translate: "voice.connect.site" });
            } else {
                player.sendMessage({ translate: "voice.connect.failed" });
            }
        } else {
            player.sendMessage({ translate: "voice.error.server", with: [`${response.status}`, `${response.body}`] });
        }
    } catch (error) {
        player.sendMessage({ translate: 'voice.error.backend' });
        console.warn(`Link token request failed: ${error}`);
    }
}

async function handleLogoutCommand(player: any) {
    player.sendMessage({ translate: "voice.logout.requesting" });
    try {
        const req = createInternalRequest('/unlink-account', { uuid: player.id });
        const response = await http.request(req);

        if (response.status === 200) {
            player.setDynamicProperty(VOICE_DP_KEY, undefined);
            player.sendMessage({ translate: "voice.logout.success" });
        } else {
            const data = JSON.parse(response.body);
            player.sendMessage({ translate: "voice.logout.failed", with: [`${data.error || "Unknown error"}`] });
        }
    } catch (error) {
        player.sendMessage({ translate: 'voice.error.backend' });
        console.warn(`Unlink request failed: ${error}`);
    }
}

world.afterEvents.playerSpawn.subscribe((event) => {
    if (!event.initialSpawn) return;
    const player = event.player;

    system.runTimeout(async () => {
        try {
            const req = new HttpRequest(`${BACKEND_URL_INTERNAL}/auth/status?uuid=${player.id}`);
            req.method = HttpRequestMethod.Get;
            req.headers = [new HttpHeader('X-Internal-API-Key', INTERNAL_API_KEY)];

            const response = await http.request(req);

            if (response.status === 200) {
                const data = JSON.parse(response.body);
                if (data.isLinked) {
                    player.setDynamicProperty(VOICE_DP_KEY, "linked");
                    player.sendMessage({ translate: "voice.status.linked" });
                } else {
                    player.setDynamicProperty(VOICE_DP_KEY, undefined);
                }
            }
        } catch (error) {
            console.warn(`Failed to check auth status for ${player.name}: ${error}`);
        }
    }, 40);
});

world.afterEvents.worldLoad.subscribe(() => {
    system.run(locationSend);
});

async function locationSend() {
    try {
        const players = world.getAllPlayers();
        if (players.length > 0) {
            const playerData = players.map(p => ({
                uuid: p.id,
                username: p.name,
                location: p.location,
                dimensionId: p.dimension.id
            }));

            const req = createInternalRequest('/update-positions', playerData);

            await http.request(req).catch(e => console.warn(`Pos update req failed: ${e}`));
        }
    } catch (error) {
        console.warn(`Location send loop error: ${error}`);
    }

    system.runTimeout(locationSend, 10);
}

console.warn("[Proximity Voice Addon] - Script loaded.");
