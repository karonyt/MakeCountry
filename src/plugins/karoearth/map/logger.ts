import { world } from "@minecraft/server";
import { Config } from "./config.js";

export const LogLevel = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

let currentLevel = Config.DEBUG_MODE ? LogLevel.DEBUG : LogLevel.INFO;

export class Logger {
    static setLevel(levelStr: any) {
        if (typeof levelStr === 'number') {
            currentLevel = levelStr;
            return;
        }
        const key = levelStr.toUpperCase();
        if (LogLevel.hasOwnProperty(key)) {
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            currentLevel = LogLevel[key];
            this.broadcast(`§e[Map] Log level set to: ${key}`);
        }
    }
    
    static getLevel() {
        return currentLevel;
    }

    // チャットとコンテンツログの両方に出す（重要な通知）
    static broadcast(msg: any) {
        console.warn(`[Map][BCAST] ${msg}`);
        if (Config.LOG_TO_CHAT) {
            try {
                world.sendMessage(`§b[Map] §r${msg}`);
            } catch (e) {}
        }
    }

    static debug(msg: any) {
        if (currentLevel <= LogLevel.DEBUG) console.warn(`[Map][DBG] ${msg}`);
    }

    static info(msg: any) {
        if (currentLevel <= LogLevel.INFO) console.warn(`[Map][INF] ${msg}`);
    }

    static warn(msg: any) {
        if (currentLevel <= LogLevel.WARN) console.warn(`[Map][WRN] ${msg}`);
    }

    static error(msg: any, errorObj = null) {
        if (currentLevel <= LogLevel.ERROR) {
            console.warn(`[Map][ERR] ${msg}`);
            if (errorObj) {
                // @ts-ignore TS(2339): Property 'stack' does not exist on type 'never'.
                if (errorObj.stack) console.warn(`[Stack] ${errorObj.stack}`);
                else console.warn(`[ErrorDetails] ${JSON.stringify(errorObj)}`);
            }
        }
    }
    
    // 計測用
    static time(label: any) {
        if (currentLevel <= LogLevel.DEBUG) console.warn(`[TimeStart] ${label}`);
    }
    
    static timeEnd(label: any) {
        if (currentLevel <= LogLevel.DEBUG) console.warn(`[TimeEnd] ${label}`);
    }
}