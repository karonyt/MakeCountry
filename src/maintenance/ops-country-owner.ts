import { ScriptEventSource, system } from "@minecraft/server";
import { GetAndParsePropertyData } from "@/shared/utils/minecraft.js";
import { applyCountryOwnerChange } from "@/domain/country/relationships/owner.js";

/**
 * 運営用: 国王を付け替える。サーバーのコンソールからだけ動く。
 *   scriptevent karoearth:ops_countryowner {"mode":"scan","country":3,"from":"<今の国王 ID>","to":"<新しい国王 ID>","toName":"<MCID>","tag":"1405"}
 * scan は確かめるだけ。apply で付け替える (ゲーム内の国王譲渡と同じ applyCountryOwnerChange を使う)。
 * 今の国王が from で、to が同じ国の国民で名前が toName のときだけ動く (チケット #1405)。
 */
type Request = { mode: "scan" | "apply"; country: number; from: string; to: string; toName: string; tag?: string };

function log(tag: string, text: string) {
    console.warn(`[ops-countryowner ${tag}] ${text}`);
}

function run(request: Request) {
    const tag = `${request.tag ?? "-"}`;
    const from = `${request.from ?? ""}`, to = `${request.to ?? ""}`;
    if (!["scan", "apply"].includes(request.mode) || !Number.isSafeInteger(request.country) || !from || !to || from === to) {
        log(tag, `rejected: mode=${request.mode} country=${request.country} from=${from} to=${to}`);
        return;
    }
    const country = GetAndParsePropertyData(`country_${request.country}`);
    if (!country) { log(tag, `rejected: country_${request.country} missing`); return; }
    if (`${country.owner}` !== from) { log(tag, `rejected: owner=${country.owner} expected=${from}`); return; }
    const target = GetAndParsePropertyData(`player_${to}`);
    if (!target || target.name !== request.toName) { log(tag, `rejected: player_${to} name=${target?.name ?? "(none)"} expected=${request.toName}`); return; }
    const members = Array.isArray(country.members) ? country.members.map(String) : [];
    if (!members.includes(to) || Number(target.country) !== Number(request.country)) {
        log(tag, `rejected: ${to} is not a member of country_${request.country}`);
        return;
    }
    if (request.mode === "scan") { log(tag, `scan ok country_${request.country} owner ${from} -> ${to} (${target.name}) ownerRole=${country.ownerRole}`); return; }
    const changed = applyCountryOwnerChange(request.country, to);
    if (!changed) { log(tag, `apply failed country_${request.country} -> ${to}`); return; }
    log(tag, `apply done country_${request.country} owner ${from} -> ${changed.countryData.owner} (${changed.newOwnerData.name}) roles=${JSON.stringify(changed.newOwnerData.roles)}`);
}

system.afterEvents.scriptEventReceive.subscribe((event) => {
    if (event.id !== "karoearth:ops_countryowner") return;
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
