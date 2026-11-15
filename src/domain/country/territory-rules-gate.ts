import { deniesLoadedGateTerritory } from "@/domain/country/gate-territory.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import config from "@/config/server.js";
import { checkNewTerritory, countPieces, EXCEPTION_NOTE, MAX_ENCLAVES_BEFORE_NEW, parseOverworldTerritories, refusalMessage, type Cell, type IslandRules } from "@/domain/country/territory-rules.js";

/** 建国から平和主義をやめられるまで (7 日) */
const PEACE_EXIT_AFTER_MS = 7 * 24 * 60 * 60 * 1000;
import { isLandChunk } from "@/domain/country/land-mask.js";
import { isSeaReachException } from "@/config/territory-exceptions.js";

/** 2026-10-06 改正の施行時刻 (JST 0:00)。これより前は止めない */
const EFFECTIVE_AT = Date.parse("2026-10-06T00:00:00+09:00");
/** 島と海・建国直後の保護の施行時刻 (2026-10-05 にお知らせ、10/6 0:00 JST から) */
const ISLAND_RULES_AT: number | null = Date.parse("2026-10-06T00:00:00+09:00");

/**
 * 建国・チャンク購入の前に呼ぶ。止めたときはプレイヤーに理由を伝えて true を返す。
 * Earth の overworld 以外では何もしない (資源鯖には第3条を適用しない)。
 * @param countryData 建国のときは undefined
 */
export function deniesNewTerritory(player: { sendMessage(message: string): void }, targets: Cell[], dimensionId: string, countryData?: { id?: number; territories?: unknown; peace?: unknown }): boolean {
    if (deniesLoadedGateTerritory(player, targets, dimensionId)) return true;
    if (config.world !== "karoearth") return false;
    if (Date.now() < EFFECTIVE_AT) return false;
    if (dimensionId !== "minecraft:overworld" && dimensionId !== "overworld") return false;
    const chunks = new DynamicProperties("chunk");
    const ownerAt = (x: number, z: number) => {
        try {
            const raw = chunks.get(`chunk_${x}_${z}_overworld`);
            if (typeof raw !== "string") return undefined;
            const id = JSON.parse(raw)?.countryId;
            return Number.isSafeInteger(id) && id > 0 ? id : undefined;
        } catch {
            return undefined;
        }
    };
    const now = Date.now();
    let island: IslandRules | undefined;
    if (ISLAND_RULES_AT !== null && now >= ISLAND_RULES_AT) {
        const countries = new DynamicProperties("country");
        island = {
            now,
            isLand: isLandChunk,
            seaReachExempt: isSeaReachException,
            countryMeta: (id: number) => {
                try {
                    const raw = countries.get(`country_${id}`);
                    if (typeof raw !== "string") return undefined;
                    const data = JSON.parse(raw);
                    return { foundedAt: data?.foundedAt, alliance: Array.isArray(data?.alliance) ? data.alliance : [], newcomerProtectionLifted: data?.newcomerProtectionLifted === true };
                } catch {
                    return undefined;
                }
            },
        };
    }
    // 飛び地の数の上限は、戦争ができる国 (非平和主義) だけ。施行前は全部の国に当てていた
    const capEnclaves = island ? countryData?.peace === false : true;
    const refusal = checkNewTerritory(targets, countryData?.id, parseOverworldTerritories(countryData?.territories), ownerAt, island, capEnclaves);
    if (!refusal) return false;
    player.sendMessage(refusalMessage(refusal, countryData === undefined));
    return true;
}

/** 平和主義をやめられるか (建国規約 第3条: 建国から 7 日たっていて、飛び地が 3 か所以下)。だめなら理由を返す */
export function peaceExitRefusal(countryData: { foundedAt?: unknown; territories?: unknown }): string | undefined {
    if (config.world !== "karoearth") return undefined;
    if (ISLAND_RULES_AT === null || Date.now() < ISLAND_RULES_AT) return undefined;
    const foundedAt = Number(countryData?.foundedAt);
    if (Number.isFinite(foundedAt) && Date.now() - foundedAt < PEACE_EXIT_AFTER_MS) {
        const hours = Math.ceil((foundedAt + PEACE_EXIT_AFTER_MS - Date.now()) / 3_600_000);
        return `§c建国から 7 日たつまでは、平和主義をやめられません（建国規約 第3条。あと約 ${hours} 時間）。` + EXCEPTION_NOTE;
    }
    const enclaves = countPieces(parseOverworldTerritories(countryData?.territories)) - 1;
    if (enclaves > MAX_ENCLAVES_BEFORE_NEW) {
        return `§c飛び地が ${enclaves} か所あるため、平和主義をやめられません（建国規約 第3条：非平和主義の国の飛び地は 3 か所まで）。飛び地を 3 か所以下にしてから切り替えてください。` + EXCEPTION_NOTE;
    }
    return undefined;
}
