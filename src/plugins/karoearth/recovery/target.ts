import { world, system, BlockPermutation, CustomCommandParamType, CommandPermissionLevel, Player } from "@minecraft/server";
import { http, HttpRequest, HttpRequestMethod } from "@minecraft/server-net";
import { decodeBlock, waitTicks } from "./common.js";
import { ChunkState } from "./chunk_state.js";
import config from "../../../config.js";

const API = "http://localhost:3055/next";

let running = false;
let stopRequested = false;

system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand({
        name: 'makecountry:recoveryblocksstart',
        description: 'チャンクのブロックを別サーバーからリカバリー',
        permissionLevel: CommandPermissionLevel.Admin,
    // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin) =>... Remove this comment to see the full error message
    }, (origin) => {
        const player = origin.sourceEntity;
        if (!(player instanceof Player)) return;
        system.runTimeout(() => {
            if (running) {
                player.sendMessage("§cすでにリカバリーは実行中です");
                return;
            }

            running = true;
            player.sendMessage("§aリカバリーを開始しました");

            system.run(() => recoveryLoop(player));
        });
    });
    ev.customCommandRegistry.registerCommand({
        name: 'makecountry:recoveryblocksstop',
        description: 'ブロックリカバリーを停止',
        permissionLevel: CommandPermissionLevel.Admin,
    // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin) =>... Remove this comment to see the full error message
    }, (origin) => {
        const player = origin.sourceEntity;
        if (!(player instanceof Player)) return;

        if (!running) {
            player.sendMessage("§eリカバリーは実行されていません");
            return;
        }

        stopRequested = true;
        player.sendMessage("§cリカバリー停止を要求しました");
    });
});

async function recoveryLoop(player: any) {
    stopRequested = false;

    try {
        while (true) {
            if (stopRequested) {
                player.sendMessage("§cリカバリーを停止しました");
                break;
            }

            const data = await fetchChunk();

            if (!data) {
                player.sendMessage("§bリカバリー完了");
                break;
            }

            await restoreLayer(data);
            await waitTicks(1);
        }
    } catch (e) {
        console.error(e);
        player.sendMessage("§cリカバリー中にエラーが発生しました");
    } finally {
        running = false;
        stopRequested = false;

        try {
            world.getDimension("overworld")
                .runCommand(`tickingarea remove "recovery"`);
        } catch { }
    }
}

/*system.runInterval(() => {
    if (config.world !== "karoearth") return;
    if (running) return;

    running = true;
    system.run(async () => {
        try {
            const data = await fetchChunk();
            if (data) await restoreLayer(data);
        } finally {
            running = false;
        }
    });
}, 20);*/

async function fetchChunk() {
    const req = new HttpRequest(API);
    req.method = HttpRequestMethod.Get;

    const res = await http.request(req);
    if (res.status !== 200 || !res.body) return null;

    return JSON.parse(res.body);
}

async function restoreLayer(data: any) {
    const { cx, cz, y, blocks } = data;
    if (!blocks || blocks.length === 0) return;

    // すでにこのYを処理済みならスキップ
    //if (ChunkState.isDone(cx, cz, y)) return;

    const dim = world.getDimension("overworld");

    // チャンクをロード
    try { dim.runCommand(`tickingarea remove "recovery"`); } catch { }
    await waitTicks(4);
    try {
        dim.runCommand(
            `tickingarea add ${cx * 16} 0 ${cz * 16} ${cx * 16 + 15} 0 ${cz * 16 + 15} "recovery" true`
        );
    } catch { }
    await waitTicks(5);

    while (!dim.isChunkLoaded({ x: cx * 16, y: y, z: cz * 16 })) {
        await waitTicks(1);
    }

    let placed = 0;

    for (const b of blocks) {
        if (stopRequested) break;
        
        const { x, z, b: encoded } = b;
        const { id, states } = decodeBlock(encoded);

        const block = dim.getBlock({
            x: cx * 16 + x,
            y,
            z: cz * 16 + z
        });

        if (!block) continue;

        let perm;
        try {
            perm = BlockPermutation.resolve(id);
        } catch {
            continue;
        }

        for (const [k, v] of Object.entries(states)) {
            try {
                // @ts-ignore TS(2345): Argument of type 'string' is not assignable to par... Remove this comment to see the full error message
                perm = perm.withState(k, v);
            } catch {
                // この state は無理 → 無視
            }
        }

        block.setPermutation(perm);

        placed++;
        if (placed >= 200) {
            placed = 0;
            await waitTicks(1);
        }
    }

    // @ts-ignore TS(2554): Expected 2 arguments, but got 3.
    ChunkState.markDone(cx, cz, y);
}