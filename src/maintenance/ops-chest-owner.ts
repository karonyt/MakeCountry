import { ScriptEventSource, system } from "@minecraft/server";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";

/**
 * 運営用: 保護チェストの持ち主の ID を付け替える。サーバーのコンソールからだけ動く。
 *   scriptevent karoearth:ops_chestowner {"mode":"scan","from":"<古い ID>","to":"<今の ID>","toName":"<MCID>","tag":"1297"}
 * scan は数えるだけ。apply で付け替える。
 * ワールドの復旧などでプレイヤーの ID が変わり、自分の保護チェストが開けなくなったときに使う (チケット #1297)。
 * 間違えて他人に渡さないよう、to のプレイヤーの名前が toName と同じで、from のプレイヤーのデータが残っていないときだけ動く。
 */
type Request = {
    mode: "scan" | "apply";
    from: string;
    to: string;
    toName: string;
    tag?: string;
};

function log(tag: string, text: string) {
    console.warn(`[ops-chestowner ${tag}] ${text}`);
}

function run(request: Request) {
    const tag = request.tag ?? "-";
    const from = `${request.from ?? ""}`;
    const to = `${request.to ?? ""}`;
    if (!["scan", "apply"].includes(request.mode) || !from || !to || from === to) {
        log(tag, `rejected: mode=${request.mode} from=${from} to=${to}`);
        return;
    }
    const toName = GetAndParsePropertyData(`player_${to}`)?.name;
    if (!toName || toName !== request.toName) {
        log(tag, `rejected: player_${to} name=${toName ?? "(none)"} expected=${request.toName}`);
        return;
    }
    if (GetAndParsePropertyData(`player_${from}`)) {
        log(tag, `rejected: player_${from} still exists`);
        return;
    }
    const chests = new DynamicProperties("chest");
    const matched: string[] = [];
    for (const id of chests.idList) {
        const lock = GetAndParsePropertyData(`${id}`, chests);
        if (!lock || `${lock.player}` !== from) continue;
        matched.push(`${id}`);
        if (request.mode === "apply") {
            lock.player = to;
            chests.set(id, JSON.stringify(lock));
        }
    }
    log(tag, `${request.mode} done ${from} -> ${to} (${toName}) count=${matched.length} | ${matched.join(" ")}`);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "karoearth:ops_chestowner") return;
    if (event.sourceType !== ScriptEventSource.Server) return;
    let request: Request;
    try {
        request = JSON.parse(event.message);
    } catch (error) {
        log("-", `bad message: ${String(error)}`);
        return;
    }
    run(request);
});
