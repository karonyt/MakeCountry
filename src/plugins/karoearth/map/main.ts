import { world, system, Player, CommandPermissionLevel, CustomCommandParamType, GameMode } from "@minecraft/server";
import { http, HttpRequest, HttpHeader, HttpRequestMethod } from "@minecraft/server-net";
import Config from "./config.js";
import { Logger } from "./logger.js";
import { waitTicks, verifyChunksLoaded, isSurfaceUpdate, findSurfaceBlock } from "./util.js";
import { scanAndCompressChunk, sendChunkDataBatch, sendPlayerData, syncAllLandData, checkExistingChunks } from "./sync.js";
import { StateManager } from "./state.js";
import config from "../../../config.js";

system.beforeEvents.startup.subscribe(ev => {
    if (config.world != 'karoearth') return;
    try {
        ev.customCommandRegistry.registerCommand({
            name: "makecountry:wmap",
            description: "リアルタイムマップ管理コマンド",
            permissionLevel: CommandPermissionLevel.Any,
            optionalParameters: [
                { name: "action", type: CustomCommandParamType.String },
                { name: "arg1", type: CustomCommandParamType.String },
                { name: "arg2", type: CustomCommandParamType.String },
                { name: "arg3", type: CustomCommandParamType.String },
                { name: "arg4", type: CustomCommandParamType.String },
                { name: "arg5", type: CustomCommandParamType.String }
            ]
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ac... Remove this comment to see the full error message
        }, (origin, action, arg1, arg2, arg3, arg4, arg5) => {
            const args = [action, arg1, arg2, arg3, arg4, arg5].filter(a => a !== undefined);
            system.run(() => executeMapLogic(origin, args));
        });

        Logger.info("Registered command: /makecountry:map");
    } catch (e) {
        // @ts-ignore TS(2345): Argument of type 'unknown' is not assignable to pa... Remove this comment to see the full error message
        Logger.error("Failed to register command:", e);
    }
});

world.beforeEvents.chatSend.subscribe(async (ev) => {
    // @ts-ignore TS(2339): Property 'world' does not exist on type '{ SERVER_... Remove this comment to see the full error message
    if (Config.world != 'karoearth') return;
    if (!ev.message.startsWith("!map ")) return;
    ev.cancel = true;

    const sender = ev.sender;
    const args = ev.message.slice(5).trim().split(" ");
    const origin = { sourceEntity: sender };

    system.run(() => executeMapLogic(origin, args));
});

/**
 * メッセージ送信の安全化ヘルパー
 */
function safeSendMessage(executor: any, msg: any) {
    if (!executor) return;
    try {
        if (executor instanceof Player) {
            if (executor.isValid) {
                executor.sendMessage(msg);
            } else {
                Logger.info(`[Map][ToDisconnected] ${msg.replace(/§./g, '')}`);
            }
        } else if (typeof executor.sendMessage === 'function') {
            executor.sendMessage(msg);
        } else {
            Logger.info(msg.replace(/§./g, ''));
        }
    } catch (e) {
        Logger.info(`[Map] ${msg.replace(/§./g, '')}`);
    }
}

/**
 * コマンド処理の共通ロジック
 */
async function executeMapLogic(origin: any, args: any) {
    const sender = origin.sourceEntity;

    const consoleExecutor = {
        name: "Server",
        id: "server",
        sendMessage: (msg: any) => Logger.info(msg),
        hasTag: () => true,
        isOp: true,
        isValid: true
    };

    const executor = sender ? sender : consoleExecutor;

    if (sender instanceof Player) {
        if (!sender.isValid) return;
        // @ts-ignore TS(2339): Property 'isOp' does not exist on type 'Player'.
        const isAdmin = sender.hasTag(Config.ADMIN_TAG) || sender.isOp;
        if (!isAdmin) {
            safeSendMessage(executor, `§c[Map] 権限がありません。タグ "${Config.ADMIN_TAG}" が必要です。`);
            return;
        }
    }

    const action = args[0];
    const params = args.slice(1);

    if (!action) {
        safeSendMessage(executor, "§cUsage: /makecountry:map <render|repair|stop|resume|reset|sync>");
        return;
    }

    const parseBounds = () => {
        const numParams = params.map((p: any) => parseInt(p)).filter((n: any) => !isNaN(n));

        if (numParams.length >= 4) {
            return {
                minCx: Math.floor(Math.min(numParams[0], numParams[2]) / 16),
                minCz: Math.floor(Math.min(numParams[1], numParams[3]) / 16),
                maxCx: Math.floor(Math.max(numParams[0], numParams[2]) / 16),
                maxCz: Math.floor(Math.max(numParams[1], numParams[3]) / 16)
            };
        }
        else if (numParams.length === 1) {
            if (!sender || (sender instanceof Player && !sender.location)) {
                safeSendMessage(executor, "§cコンソールからは座標(x1 z1 x2 z2)を指定してください。");
                return null;
            }
            if (sender instanceof Player && sender.isValid) {
                const px = Math.floor(sender.location.x);
                const pz = Math.floor(sender.location.z);
                const r = numParams[0];
                return {
                    minCx: Math.floor((px - r) / 16),
                    minCz: Math.floor((pz - r) / 16),
                    maxCx: Math.floor((px + r) / 16),
                    maxCz: Math.floor((pz + r) / 16)
                };
            }
        }
        return null;
    };

    try {
        switch (action) {
            case "render": {
                if (isRendering) return safeSendMessage(executor, "§cAlready rendering.");
                const b = parseBounds();
                if (!b) return safeSendMessage(executor, "§cUsage: render <x1> <z1> <x2> <z2> (or <radius>)");

                let mode = "force";
                startRender(executor, b, null, mode);
                break;
            }
            case "repair": {
                if (isRendering) return safeSendMessage(executor, "§cAlready rendering.");
                const b = parseBounds();
                if (!b) return safeSendMessage(executor, "§cUsage: repair <x1> <z1> <x2> <z2> (or <radius>)");
                safeSendMessage(executor, "§aStarting Repair Mode...");
                startRender(executor, b, null, "repair");
                break;
            }
            case "stop":
                if (!isRendering) return safeSendMessage(executor, "§cNot rendering.");
                stopRequested = true;
                safeSendMessage(executor, "§eStopping...");
                break;
            case "resume":
                if (isRendering) return safeSendMessage(executor, "§cAlready rendering.");
                const s = StateManager.load();
                if (s && s.status !== "completed") {
                    safeSendMessage(executor, `§aResuming (${s.mode || "force"})...`);
                    startRender(executor, s.bounds, s.current, s.mode || "force");
                } else safeSendMessage(executor, "§cNo resumable state found.");
                break;
            case "reset":
                isRendering = false;
                stopRequested = true;
                // @ts-ignore TS(2339): Property 'clear' does not exist on type 'typeof St... Remove this comment to see the full error message
                StateManager.clear();
                try { world.getDimension("overworld").runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
                safeSendMessage(executor, "§aState reset complete.");
                break;
            case "sync":
                if (sender instanceof Player) {
                    // @ts-ignore TS(2345): Argument of type 'Player' is not assignable to par... Remove this comment to see the full error message
                    await syncAllLandData(sender);
                } else {
                    Logger.info("Syncing Land Data from console...");
                    // @ts-ignore TS(2345): Argument of type '{ name: string; id: string; send... Remove this comment to see the full error message
                    await syncAllLandData(consoleExecutor);
                }
                break;
            default:
                safeSendMessage(executor, "§cUnknown action: " + action);
        }
    } catch (e) {
        Logger.error(`Cmd Error: ${e}`);
        safeSendMessage(executor, "§cError occurred.");
    }
}

// ==========================================
// 2. リアルタイム更新 (部分更新版)
// ==========================================

const partialUpdateQueue = new Map();
let globalUpdateTask: any = null;

function onBlockChange(block: any) {
    if (!block) return;
    try {
        if (block.dimension.id !== "minecraft:overworld") return;

        // ★修正: 地下判定を有効化 (util.jsの強化されたロジックを使用)
        // Y=120まで(またはそれ以上)スキャンし、不透過ブロックがあれば地下と判定してリターン
        if (!isSurfaceUpdate(block.dimension, block)) return;

        const key = `${block.x},${block.z}`;
        partialUpdateQueue.set(key, { x: block.x, z: block.z });

        if (!globalUpdateTask) {
            globalUpdateTask = system.runTimeout(processPartialUpdates, 40);
        }
    } catch (e) { }
}

world.afterEvents.playerPlaceBlock.subscribe(ev => {
    if (config.world != 'karoearth') return;
    onBlockChange(ev.block)
});
world.afterEvents.playerBreakBlock.subscribe(ev => {
    if (config.world != 'karoearth') return;
    onBlockChange(ev.block);
});

async function processPartialUpdates() {
    globalUpdateTask = null;
    if (partialUpdateQueue.size === 0) return;

    const dimension = world.getDimension("overworld");
    const updatesToSend = [];

    const tasks = Array.from(partialUpdateQueue.values());
    partialUpdateQueue.clear();

    for (const task of tasks) {
        try {
            const surfaceInfo = findSurfaceBlock(dimension, task.x, task.z);
            if (surfaceInfo) {
                updatesToSend.push({
                    x: task.x,
                    z: task.z,
                    y: surfaceInfo.location.y,
                    block_id: surfaceInfo.typeId,
                    dimension: 'overworld'
                });
            } else {
                updatesToSend.push({
                    x: task.x,
                    z: task.z,
                    y: dimension.heightRange.min,
                    block_id: 'minecraft:air',
                    dimension: 'overworld'
                });
            }
        } catch (e) { }

        if (updatesToSend.length % 20 === 0) await waitTicks(1);
    }

    if (updatesToSend.length > 0) {
        await postJsonPartial('/api/map/update-partial', { updates: updatesToSend });
    }
}

async function postJsonPartial(endpoint: any, data: any) {
    const url = `${Config.SERVER_URL}${endpoint}`;
    const req = new HttpRequest(url);
    req.method = HttpRequestMethod.Post;
    req.headers = [
        new HttpHeader("Content-Type", "application/json"),
        new HttpHeader("X-API-Key", Config.API_KEY || "")
    ];
    req.body = JSON.stringify(data);
    try {
        const res = await http.request(req);
        // デバッグログが必要な場合はここで確認
        // Logger.info(`Partial Update Sent: ${res.status}`);
    } catch (e) {
        // @ts-ignore TS(2571): Object is of type 'unknown'.
        Logger.warn(`Partial Update Network Error: ${e.message}`);
    }
}

// ==========================================
// 3. レンダリングロジック (ETA + リザルト)
// ==========================================
let isRendering = false;
let stopRequested = false;

function formatDuration(ms: any) {
    if (ms < 0) return "calculating...";
    const seconds = Math.floor(ms / 1000);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    return `${m}m ${s}s`;
}

function showResult(executor: any, stats: any, stopped: any) {
    const elapsed = Date.now() - stats.startTime;
    const duration = formatDuration(elapsed);
    const processedTotal = stats.processed;

    if (processedTotal > 50) {
        const avg = elapsed / processedTotal;
        const saved = StateManager.load() || {};

        const oldAvg = saved.stats?.averageSpeed || avg;
        const newAvg = (oldAvg + avg) / 2;

        StateManager.save({
            bounds: null,
            current: null,
            mode: null,
            status: "completed",
            stats: { averageSpeed: parseFloat(newAvg.toFixed(2)) }
        });

        Logger.info(`Updated speed stats: ${newAvg.toFixed(0)} ms/chunk`);
    }

    const title = stopped ? "§6=== Render Stopped ===" : "§2=== Render Complete ===";
    const color = stopped ? "§e" : "§a";

    const msg = [
        title,
        `§7Duration: §f${duration}`,
        `§7Total Chunks: §f${stats.totalChunks}`,
        `§7Processed: ${color}${stats.processed} §7(Skipped: §b${stats.skipped}§7)`,
        `§7Load Retries: §e${stats.loadRetries} §7(Force Reloads: §c${stats.forceReloads}§7)`,
        `§7Scan Retries: §c${stats.scanRetries}`,
        `§7Progress: ${color}${((stats.processed / stats.totalChunks) * 100).toFixed(1)}%`,
        "§2========================"
    ].join("\n");

    safeSendMessage(executor, msg);
}

async function startRender(executor: any, bounds: any, resumeCursor = null, mode = "force") {
    isRendering = true;
    stopRequested = false;

    const sendMsg = (msg: any) => safeSendMessage(executor, msg);

    const overworld = world.getDimension("overworld");
    const totalChunks = (bounds.maxCx - bounds.minCx + 1) * (bounds.maxCz - bounds.minCz + 1);

    let stats = {
        totalChunks: totalChunks,
        processed: 0,
        skipped: 0,
        loadRetries: 0,
        forceReloads: 0,
        scanRetries: 0,
        startTime: Date.now()
    };

    let startCx = bounds.minCx;
    let startCz = bounds.minCz;

    const savedState = StateManager.load();
    let avgSpeed = 150;
    if (savedState && savedState.stats && savedState.stats.averageSpeed) {
        avgSpeed = savedState.stats.averageSpeed;
    }

    if (resumeCursor) {
        // @ts-ignore TS(2339): Property 'cx' does not exist on type 'never'.
        startCx = resumeCursor.cx;
        // @ts-ignore TS(2339): Property 'cz' does not exist on type 'never'.
        startCz = resumeCursor.cz;
        if (savedState && savedState.stats) {
            if (savedState.stats.processed) stats.processed = savedState.stats.processed;
            if (savedState.stats.skipped) stats.skipped = savedState.stats.skipped;
        }
        sendMsg(`§aResuming scan from (${startCx}, ${startCz})...`);
    } else {
        const estimatedMs = totalChunks * avgSpeed;
        sendMsg(`§aScan started: ${stats.totalChunks} chunks.`);
        sendMsg(`§7Estimated Time (ETA): §e~${formatDuration(estimatedMs)}`);
    }

    // 実行中も stats オブジェクトに averageSpeed を持たせておく（保存時に引き継ぐため）
    // @ts-ignore TS(2339): Property 'averageSpeed' does not exist on type '{ ... Remove this comment to see the full error message
    stats.averageSpeed = avgSpeed;

    try {
        for (let cz = startCz; cz <= bounds.maxCz; cz += Config.SEND_BATCH_SIZE) {
            let currentMinCx = (cz === startCz) ? startCx : bounds.minCx;

            for (let cx = currentMinCx; cx <= bounds.maxCx; cx += Config.SEND_BATCH_SIZE) {
                StateManager.save({ bounds, current: { cx, cz }, mode, status: "running", stats: { ...stats, averageSpeed: avgSpeed } });

                if (stopRequested) {
                    StateManager.save({ bounds, current: { cx, cz }, mode, status: "stopped", stats: { ...stats, averageSpeed: avgSpeed } });
                    showResult(executor, stats, true);
                    isRendering = false;
                    try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
                    return;
                }

                const endCx = Math.min(cx + Config.SEND_BATCH_SIZE - 1, bounds.maxCx);
                const endCz = Math.min(cz + Config.SEND_BATCH_SIZE - 1, bounds.maxCz);

                if (mode === "repair") {
                    let targetChunks = [];
                    for (let iz = cz; iz <= endCz; iz++) {
                        for (let ix = cx; ix <= endCx; ix++) {
                            targetChunks.push({ cx: ix, cz: iz });
                        }
                    }
                    const missingChunks = await checkExistingChunks(targetChunks);
                    if (missingChunks.length === 0) {
                        const skipCount = targetChunks.length;
                        stats.skipped += skipCount;
                        stats.processed += skipCount;
                        await waitTicks(1);
                        continue;
                    }
                }

                const fromBlock = { x: cx * 16, z: cz * 16 };
                const toBlock = { x: endCx * 16 + 15, z: endCz * 16 + 15 };

                try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
                await waitTicks(2);
                try {
                    overworld.runCommand(`tickingarea add ${fromBlock.x} 0 ${fromBlock.z} ${toBlock.x} 0 ${toBlock.z} "${Config.RENDER_AREA_TAG}" true`);
                } catch (e) {
                    // @ts-ignore TS(2571): Object is of type 'unknown'.
                    Logger.error(`Tickingarea failed: ${e.message}`);
                }

                let loaded = false;
                let retryCount = 0;
                while (!loaded && !stopRequested) {
                    for (let i = 0; i < 8; i++) {
                        if (verifyChunksLoaded(overworld, fromBlock, toBlock)) {
                            loaded = true;
                            break;
                        }
                        await waitTicks(10);
                    }

                    if (!loaded) {
                        retryCount++;
                        stats.loadRetries++;
                        if (retryCount % Config.FORCE_RELOAD_INTERVAL_RETRIES === 0) {
                            Logger.warn(`§eChunk load stuck at (${cx},${cz}). Force reloading... (#${retryCount})`);
                            stats.forceReloads++;
                            try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
                            await waitTicks(10);
                            try { overworld.runCommand(`tickingarea add ${fromBlock.x} 0 ${fromBlock.z} ${toBlock.x} 0 ${toBlock.z} "${Config.RENDER_AREA_TAG}" true`); } catch { }
                            await waitTicks(30);
                        } else {
                            await waitTicks(20);
                        }
                    }
                }

                if (stopRequested) {
                    StateManager.save({ bounds, current: { cx, cz }, mode, status: "stopped", stats: { ...stats, averageSpeed: avgSpeed } });
                    showResult(executor, stats, true);
                    isRendering = false;
                    try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
                    return;
                }

                const batchData = [];
                for (let iz = cz; iz <= endCz; iz++) {
                    for (let ix = cx; ix <= endCx; ix++) {
                        let scanSuccess = false;
                        while (!scanSuccess) {
                            if (stopRequested) break;
                            try {
                                const chunkData = scanAndCompressChunk(overworld, ix, iz);
                                batchData.push(chunkData);
                                scanSuccess = true;
                                stats.processed++;
                            } catch (e) {
                                stats.scanRetries++;
                                // @ts-ignore TS(2571): Object is of type 'unknown'.
                                if (stats.scanRetries % 20 === 0) Logger.warn(`Scan error at (${ix},${iz}): ${e.message}. Retrying...`);
                                await waitTicks(5);
                            }
                        }
                        if (stopRequested) break;
                    }
                    if (stopRequested) break;
                }

                if (stopRequested) {
                    StateManager.save({ bounds, current: { cx, cz }, mode, status: "stopped", stats: { ...stats, averageSpeed: avgSpeed } });
                    showResult(executor, stats, true);
                    isRendering = false;
                    try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
                    return;
                }

                if (batchData.length > 0) {
                    await sendChunkDataBatch(batchData);
                }

                try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }

                StateManager.save({ bounds, current: { cx: endCx + 1, cz }, mode, status: "running", stats: { ...stats, averageSpeed: avgSpeed } });

                if (stats.processed % 100 === 0) {
                    const percent = ((stats.processed / stats.totalChunks) * 100).toFixed(1);
                    sendMsg(`§7Progress: ${stats.processed}/${stats.totalChunks} (${percent}%)`);
                }

                await waitTicks(1);
            }
        }

        showResult(executor, stats, false);
        StateManager.clearProgress();

    } catch (e) {
        // @ts-ignore TS(2571): Object is of type 'unknown'.
        Logger.error(`Render Error: ${e.message}`, e);
        sendMsg("§cError occurred.");
    } finally {
        isRendering = false;
        try { overworld.runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
    }
}

system.runInterval(() => {
    if (config.world != 'karoearth') return;
    try {
        const players = world.getAllPlayers();
        if (players.length === 0) return sendPlayerData([]);
        const pd = players.map(p => ({
            id: p.id, name: p.name,
            skin: p.getTags().find(t => t.startsWith("skin_"))?.slice(5) || undefined,
            point: { x: Math.floor(p.location.x), y: Math.floor(p.location.z), dimension: 'overworld', invisibility: (p.getEffect("invisibility") !== undefined || p.hasTag("invisibility") || p.getGameMode() == GameMode.Spectator) }
        }));
        sendPlayerData(pd).catch(() => { });
    } catch (e) { }
}, Config.PLAYER_SYNC_INTERVAL);

system.run(() => {
    if (config.world != 'karoearth') return;
    Logger.info("Map Addon Loaded. Command: /makecountry:map");
    try { world.getDimension("overworld").runCommand(`tickingarea remove "${Config.RENDER_AREA_TAG}"`); } catch { }
    if (Config.AUTO_RESUME) {
        const s = StateManager.load();
        if (s && s.status === "running") {
            Logger.warn("⚠️ Detected unfinished render (Crash/Restart). Auto-resuming...");
            const consoleExecutor = {
                name: "Server",
                id: "server",
                sendMessage: (m: any) => Logger.info(m),
                isValid: true,
                hasTag: () => true,
                isOp: true
            };
            system.runTimeout(() => {
                startRender(consoleExecutor, s.bounds, s.current, s.mode);
            }, 100);
        }
    }
});

system.runInterval(() => {
    if (config.world != 'karoearth') return;
    if (Config.STANDALONE_MODE) return;
    syncAllLandData().catch(e => { });

}, Config.COUNTRY_SYNC_INTERVAL);
