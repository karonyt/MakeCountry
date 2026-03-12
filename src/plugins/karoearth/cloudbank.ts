import {
    world,
    system,
    CommandPermissionLevel,
    CustomCommandParamType,
    Player
} from "@minecraft/server";
import {
    http,
    HttpHeader,
    HttpRequest,
    HttpRequestMethod
} from "@minecraft/server-net";
import { DynamicProperties } from "../../api/dyp.js";
import config from "../../config.js";
import { PlayerManager } from "../../api/player/player.js";

const API_BASE = "http://192.168.100.4:20003";
const SERVER_ID = config.world;
const POLL_INTERVAL_TICKS = 5;

const pending = new Map();
const dp = new DynamicProperties("bank");

let eventLoopRunning = false;

world.afterEvents.worldLoad.subscribe(() => {
    loadPending();
    startEventLoop();
});

function loadPending() {
    const raw = dp.get("pending");
    if (!raw) return;

    try {
        const list = JSON.parse(raw);
        for (const tx of list) {
            pending.set(tx.txId, tx);
        }
        console.warn(`[Bank] Loaded ${pending.size} pending transactions`);
    } catch (e) {
        console.error("[Bank] Failed to load pending:", e);
    }
}

function persistPending() {
    dp.set("pending", JSON.stringify([...pending.values()]));
}

function generateTxId(player: any, type: any) {
    return `${SERVER_ID}:${player.id}:${type}:${Date.now()}`;
}

async function post(path: any, body: any) {
    const req = new HttpRequest(`${API_BASE}${path}`);
    req.setMethod(HttpRequestMethod.Post);
    req.setBody(JSON.stringify(body));
    req.setHeaders([new HttpHeader("Content-Type", "application/json")]);
    req.setTimeout(10000);
    return await http.request(req);
}

async function longPoll() {
    const req = new HttpRequest(
        `${API_BASE}/event/receive?serverId=${SERVER_ID}`
    );
    req.setMethod(HttpRequestMethod.Get);
    req.setTimeout(30000);
    return await http.request(req);
}

system.beforeEvents.startup.subscribe(ev => {
    ev.customCommandRegistry.registerCommand(
        {
            name: "makecountry:check",
            description: "commands.cloudbank.check",
            permissionLevel: CommandPermissionLevel.Any
        },
        // @ts-ignore
        origin => {
            system.runTimeout(() => {
                const p = origin.sourceEntity;
                if (!(p instanceof Player)) return;

                post("/bank/check", {
                    playerName: p.name,
                    serverId: SERVER_ID
                });

                p.sendMessage({ translate: "cloudbank.check.processing" });
            })
        }
    );

    ev.customCommandRegistry.registerCommand(
        {
            name: "makecountry:deposit",
            description: "commands.cloudbank.deposit",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "value", type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore
        (origin, amount) => {
            system.runTimeout(() => {
                const p = origin.sourceEntity;
                if (!(p instanceof Player)) return;
                if (amount <= 0) return p.sendMessage({ translate: "cloudbank.error.invalid_amount" });

                const pm = new PlayerManager(p.id);
                if (amount > pm.data.money) {
                    p.sendMessage({ translate: "cloudbank.error.not_enough_money" });
                    return;
                }

                const txId = generateTxId(p, "deposit");
                pending.set(txId, {
                    txId,
                    playerName: p.name,
                    type: "deposit",
                    amount
                });
                persistPending();

                post("/bank/deposit", {
                    transactionId: txId,
                    playerName: p.name,
                    serverId: SERVER_ID,
                    amount
                });

                p.sendMessage({ translate: "cloudbank.deposit.processing", with: [`${amount.toLocaleString()}`] });
            });
        }
    );

    ev.customCommandRegistry.registerCommand(
        {
            name: "makecountry:withdraw",
            description: "commands.cloudbank.withdraw",
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: "value", type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore
        (origin, amount) => {
            system.runTimeout(() => {
                const p = origin.sourceEntity;
                if (!(p instanceof Player)) return;
                if (amount <= 0) return p.sendMessage({ translate: "cloudbank.error.invalid_amount" });

                const txId = generateTxId(p, "withdraw");
                pending.set(txId, {
                    txId,
                    playerName: p.name,
                    type: "withdraw",
                    amount
                });
                persistPending();

                post("/bank/withdraw", {
                    transactionId: txId,
                    playerName: p.name,
                    serverId: SERVER_ID,
                    amount
                });

                p.sendMessage({ translate: "cloudbank.withdraw.processing", with: [`${amount.toLocaleString()}`] });
            })
        }
    );
});

function startEventLoop() {
    if (eventLoopRunning) return;
    eventLoopRunning = true;
    console.warn("[Bank] Event loop started");
    pollOnce();
}

async function pollOnce() {
    try {
        const res = await longPoll();

        if (res?.status === 200) {
            const events = JSON.parse(res.body);
            if (events.length > 0) {
                console.warn(`[Bank] Received ${events.length} events`);
                handleEvents(events);
            }
        }
    } catch (e) {
        console.error("[Bank] Poll error:", e);
    }

    system.runTimeout(pollOnce, POLL_INTERVAL_TICKS);
}

function handleEvents(events: any) {
    for (const e of events) {
        if (e.type === "bankdepositresult") onDeposit(e.data);
        else if (e.type === "bankwithdrawresult") onWithdraw(e.data);
        else if (e.type === "bankcheckresult") onCheck(e.data);
    }
}

async function finish(txId: any) {
    try {
        await post("/bank/applied", { transactionId: txId });
        pending.delete(txId);
        persistPending();
    } catch {
        console.warn(`[Bank] applied failed, retry later: ${txId}`);
    }
}

function onDeposit(data: any) {
    const tx = pending.get(data.transactionId);
    if (!tx) return;

    const p = world.getPlayers({ name: tx.playerName })[0];
    if (!p) return;

    if (data.error) {
        p.sendMessage({ translate: "cloudbank.deposit.failed", with: [`${data.text}`] });
        finish(tx.txId);
        return;
    }

    p.runCommand(`scriptevent mc:remove ${tx.amount}`);
    p.sendMessage({ translate: "cloudbank.deposit.success", with: [`${tx.amount.toLocaleString()}`] });
    finish(tx.txId);
}

function onWithdraw(data: any) {
    const tx = pending.get(data.transactionId);
    if (!tx) return;

    const p = world.getPlayers({ name: tx.playerName })[0];
    if (!p) return;

    if (data.error) {
        p.sendMessage({ translate: "cloudbank.withdraw.failed", with: [`${data.text}`] });
        finish(tx.txId);
        return;
    }

    p.runCommand(`scriptevent mc:add ${tx.amount}`);
    p.sendMessage({ translate: "cloudbank.withdraw.success", with: [`${tx.amount.toLocaleString()}`] });
    finish(tx.txId);
}

function onCheck(data: any) {
    const p = world.getPlayers({ name: data.playerName })[0];
    if (!p) return;
    p.sendMessage({ translate: "cloudbank.balance", with: [`${data.value.toLocaleString()}`] });
}
