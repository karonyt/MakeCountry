/**
 * @typedef {import("@minecraft/server").Player} Player
 */
import { system, world } from "@minecraft/server";
import { transferPlayer } from "@minecraft/server-admin";
import config from "../../config.js";

function sendAction(action: any, payload: any) {
    const json = JSON.stringify({ action, payload });
    console.warn(`bds_enhancer:${json}`);
}

export function sendTransferAction(player: any, host: any, port: any) {
    sendAction("transfer", { player: player.name, host, port });
}

export function sendKickAction(player: any, reason: any) {
    sendAction("kick", { player: player.name, reason });
}

export function sendGetPlayerAction(name: any) {
    sendAction("getplayer", { name: name });
}

export function sendStopAction() {
    // @ts-ignore
    sendAction("stop");
}

export function sendReloadAction() {
    // @ts-ignore
    sendAction("reload");
}

const commandQueue: any = [];

export async function executeCommand(command = "", result = false) {
    sendAction("execute", { command, result });
    return new Promise((resolve) => {
        if (result) commandQueue.push({ command, resolve, resultTmp: "" });
        // @ts-ignore
        else resolve();
    });
}

const shellQueue: any = [];

export async function executeShellCommand(mainCommand = "", args = [], result = false) {
    sendAction("executeshell", { main_command: mainCommand, args, result });
    return new Promise((resolve) => {
        if (result) shellQueue.push({ fullCommand: `${mainCommand} ${args.join(" ")}`, resolve, resultTmp: "" });
        // @ts-ignore
        else resolve();
    });
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id === "bds_enhancer:result") {
        const data = JSON.parse(event.message);
        // @ts-ignore
        const arr = commandQueue.find((item) => item.command === data.command)
        if (!arr) return;
        arr.resultTmp += data.result_message;
        if (data.end) {
            arr.resolve(arr.resultTmp);
            commandQueue.splice(commandQueue.indexOf(arr), 1);
        }
    } else if (event.id === "bds_enhancer:shell_result") {
        const data = JSON.parse(event.message);
        if (data.err) {
            // @ts-ignore
            const arr = shellQueue.find((item) => item.fullCommand === data.command)
            if (!arr) return;
            arr.resolve({ err: true, message: data.result_message });
            shellQueue.splice(shellQueue.indexOf(arr), 1);
        } else {
            // @ts-ignore
            const arr = shellQueue.find((item) => item.fullCommand === data.command)
            if (!arr) return;
            arr.resultTmp += data.result_message;
            if (data.end) {
                arr.resolve({ err: false, message: arr.resultTmp });
                shellQueue.splice(shellQueue.indexOf(arr), 1);
            }
        }
    }
});

let checkRestart10 = false;
let checkRestart5 = false;
let checkRestart1 = false;
let checkRestart3020 = false;

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        const date = new Date();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        if (config.world == "karoearth") {
            if ((date.getHours()) % 2 != 0) {
                return;
            }
        }
        if (config.world == "dev") {
            return;
        }
        if (config.world != "karoearth" && config.world != "dev") {
            if ((date.getHours()) % 2 != 0) {
                return;
            }
        }
        if (minute == 20) {
            if (checkRestart10) return;
            checkRestart10 = true;
            world.sendMessage({ rawtext: [{ text: "§a[かろEarth]\n§b" }, { translate: "plugin.bds_enhancer.restart_in_10m" }] });
        }
        if (minute == 25) {
            if (checkRestart5) return;
            checkRestart5 = true;
            world.sendMessage({ rawtext: [{ text: "§a[かろEarth]\n§b" }, { translate: "plugin.bds_enhancer.restart_in_5m" }] });
        }
        if (minute == 29) {
            if (checkRestart1) return;
            checkRestart1 = true;
            world.sendMessage({ rawtext: [{ text: "§a[かろEarth]\n§b" }, { translate: "plugin.bds_enhancer.restart_in_1m" }] });
        }
        if (minute == 30 && second >= 20) {
            if (checkRestart3020) return;
            checkRestart3020 = true;
            world.sendMessage({ rawtext: [{ text: "§a[かろEarth]\n§b" }, { translate: "plugin.bds_enhancer.restart_now" }] });

            system.runTimeout(() => {
                if (date.getHours() == 4) {
                    world.getPlayers().forEach(p => {
                        try {
                        } catch (error) {
                            // @ts-ignore
                            transferPlayer(p, { hostname: "play.karon.jp", port: 19133 });
                        }
                    });
                } else {
                    world.getDimension("overworld").runCommand("execute as @a run knw");
                }
            }, 40);
            system.runTimeout(() => {
                sendStopAction();
            }, 60);
        }
    }, 20);
});
