import { world, system, CustomCommandParamType, CommandPermissionLevel, Player } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net";
import { encodeBlock, waitTicks } from "./common.js";

const API = "http://localhost:3055/push";

system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand({
        name: 'makecountry:recoveryblocks',
        description: 'チャンクのブロックを別サーバーからリカバリー',
        permissionLevel: CommandPermissionLevel.Admin,
        mandatoryParameters: [
            { name: 'coordinates1', type: CustomCommandParamType.Location },
            { name: 'coordinates2', type: CustomCommandParamType.Location }
        ]
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
    }, (origin, ...args) => {
        if (origin.sourceEntity) {
            if (!(origin.sourceEntity instanceof Player)) return;
            const player = origin.sourceEntity;
            player.sendMessage(`§aリカバリースタート from: ${args[0].x}, ${args[0].z} to: ${args[1].x}, ${args[1].z}`);
        };
        system.run(async () => await exportArea(args[0].x, args[0].z, args[1].x, args[1].z));
    });
});

async function exportArea(x1: any, z1: any, x2: any, z2: any) {
    const dim = world.getDimension("overworld");

    const minCx = Math.floor(Math.min(x1, x2) / 16);
    const maxCx = Math.floor(Math.max(x1, x2) / 16);
    const minCz = Math.floor(Math.min(z1, z2) / 16);
    const maxCz = Math.floor(Math.max(z1, z2) / 16);

    const yMin = -64;
    const yMax = 200;

    for (let cz = minCz; cz <= maxCz; cz++) {
        for (let cx = minCx; cx <= maxCx; cx++) {

            // チャンクロード
            try { dim.runCommand(`tickingarea remove "recovery"`); } catch { }
            await waitTicks(2);

            try {
                dim.runCommand(
                    `tickingarea add ${cx * 16} 0 ${cz * 16} ${cx * 16 + 15} 0 ${cz * 16 + 15} "recovery" true`
                );
            } catch { }
            await waitTicks(5);

            for (let y = yMin; y <= yMax; y++) {
                const data = scanChunkY(dim, cx, cz, y);
                if (!data) continue;

                await send(data);
                await waitTicks(1); // 超重要
            }
        }
    }
}

async function scanChunkY(dim: any, cx: any, cz: any, y: any) {
    while (!dim.isChunkLoaded({ x: cx * 16 + 5, y: y, z: cz * 16 + 5 })) {
        console.log('チャンク未確認')
        await waitTicks(1);
    }
    const blocks = [];

    for (let lx = 0; lx < 16; lx++) {
        for (let lz = 0; lz < 16; lz++) {
            const b = dim.getBlock({
                x: cx * 16 + lx,
                y,
                z: cz * 16 + lz
            });

            if (!b) continue;
            if (b.typeId === "minecraft:air") continue;

            blocks.push({
                x: lx,
                z: lz,
                y,
                b: encodeBlock(b)
            });
        }
    }

    if (blocks.length === 0) return null;

    return { cx, cz, y, blocks };
}

async function send(data: any) {
    const req = new HttpRequest(API);
    req.method = HttpRequestMethod.Post;
    req.headers = [new HttpHeader("Content-Type", "application/json")];
    req.body = JSON.stringify(data);
    const res = await http.request(req);
}