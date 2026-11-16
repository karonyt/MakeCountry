/**
 * フル版から乗り換えたワールドの引き継ぎ (分割版のみ)。
 *
 * Lite はフル版と同じ UUID なので、フル版が保存したデータ (職業レベル・魚の記録・結婚など) は Lite の領域に残っている。
 * 機能パックは自分が使うデータを Lite から受け取り、自分の領域にコピーする。Lite 側の元データは消さない。
 *
 * - ワールドのデータ: 起動時に 1 回。すでにあるデータは上書きしない (ID の一覧は両方を合わせる)
 * - プレイヤーのデータ: そのプレイヤーが初めてログインしたとき
 * - Lite のプレイヤーデータの一部の項目 (結婚・懸賞金): 起動時に 1 回 (オフラインのプレイヤーも含む)
 */
import { Player, system, world } from "@minecraft/server";
import { isPackPresent, onPackPresence, onRpc, rpc } from "@/shared/bridge/bridge.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";

export type MigrationSpec = {
    /** DynamicProperties のコレクション名 (例: "fishEncyclopedia") */
    collections?: string[];
    /** そのままコピーするワールドのキーの接頭辞 (例: "karo:job_reward#") */
    worldPrefixes?: string[];
    /** プレイヤーのダイナミックプロパティ (名前そのもの、または接頭辞) */
    playerKeys?: string[];
    playerPrefixes?: string[];
    /** Lite のプレイヤーデータ (player_<ID>) から受け取る項目と、受け取ったときの処理 */
    playerDataFields?: { fields: string[]; apply(playerId: string, fields: Record<string, unknown>): void };
    /** アイテムのダイナミックプロパティも引き継ぐアイテムの種類 (バックパックの中身・梱包の ID など) */
    itemTypes?: (typeId: string) => boolean;
};

const WORLD_DONE = "mc:migrated_from_full";
const ITEM_DONE = "mc:migrated_from_full";
const PLAYER_DONE = "mc:migrated_from_full";

/** 機能パック側: 引き継ぎを始める。 */
export function setupModuleMigration(spec: MigrationSpec): void {
    let running = false;
    const start = () => {
        if (running || world.getDynamicProperty(WORLD_DONE) === true || !isPackPresent("lite")) return;
        running = true;
        migrateWorld(spec)
            .then(() => { world.setDynamicProperty(WORLD_DONE, true); console.log("[MakeCountry] migration from the full version finished"); })
            .catch(error => console.warn(`[MakeCountry] migration will retry: ${error instanceof Error ? error.message : error}`))
            .finally(() => { running = false; });
    };
    onPackPresence((pack, joined) => { if (joined && pack.pack === "lite") system.runTimeout(start, 40); });
    world.afterEvents.worldLoad.subscribe(() => system.runInterval(start, 20 * 30));

    if (spec.itemTypes) setupItemMigration(spec.itemTypes);

    if (spec.playerKeys?.length || spec.playerPrefixes?.length) {
        const pending = new Set<string>();
        const migratePlayer = (player: Player) => {
            if (!player.isValid || player.getDynamicProperty(PLAYER_DONE) === true || pending.has(player.id) || !isPackPresent("lite")) return;
            pending.add(player.id);
            rpc<Record<string, string | number | boolean>>("lite", "migrate.player", { playerId: player.id, keys: spec.playerKeys ?? [], prefixes: spec.playerPrefixes ?? [] }, 200)
                .then(values => {
                    if (!player.isValid) return;
                    for (const [key, value] of Object.entries(values ?? {})) {
                        if (player.getDynamicProperty(key) === undefined) player.setDynamicProperty(key, value);
                    }
                    player.setDynamicProperty(PLAYER_DONE, true);
                })
                .catch(() => { /* 次のログイン・次の回に送り直す */ })
                .finally(() => pending.delete(player.id));
        };
        world.afterEvents.playerSpawn.subscribe(({ player }) => system.runTimeout(() => migratePlayer(player), 40));
        world.afterEvents.worldLoad.subscribe(() => system.runInterval(() => { for (const p of world.getPlayers()) migratePlayer(p); }, 20 * 10));
    }
}

/**
 * プレイヤーのインベントリにある、まだ引き継いでいないアイテムを Lite に読んでもらい、同じアイテムに書き写す。
 * (チェストなどにあるアイテムは、インベントリに入ったときに引き継ぐ)
 */
function setupItemMigration(isTarget: (typeId: string) => boolean) {
    const pending = new Set<string>();
    const scan = (player: Player) => {
        if (!player.isValid || !isPackPresent("lite")) return;
        const container = player.getComponent("inventory")?.container;
        if (!container) return;
        for (let slot = 0; slot < container.size; slot++) {
            const item = container.getItem(slot);
            if (!item || !isTarget(item.typeId) || item.getDynamicProperty(ITEM_DONE) === true) continue;
            const id = `${player.id}:${slot}`;
            if (pending.has(id)) continue;
            pending.add(id);
            const typeId = item.typeId;
            rpc<Record<string, string | number | boolean>>("lite", "migrate.item", { playerId: player.id, slot, typeId }, 200)
                .then(values => {
                    if (!player.isValid) return;
                    const current = container.getItem(slot);
                    if (!current || current.typeId !== typeId || current.getDynamicProperty(ITEM_DONE) === true) return;
                    for (const [key, value] of Object.entries(values ?? {})) {
                        if (current.getDynamicProperty(key) === undefined) current.setDynamicProperty(key, value);
                    }
                    current.setDynamicProperty(ITEM_DONE, true);
                    container.setItem(slot, current);
                })
                .catch(() => { /* 次の回に送り直す */ })
                .finally(() => pending.delete(id));
        }
    };
    world.afterEvents.playerSpawn.subscribe(({ player }) => system.runTimeout(() => scan(player), 60));
    world.afterEvents.worldLoad.subscribe(() => system.runInterval(() => { for (const p of world.getPlayers()) scan(p); }, 20 * 10));
}

async function migrateWorld(spec: MigrationSpec): Promise<void> {
    const prefixes = [
        ...(spec.worldPrefixes ?? []),
        ...(spec.collections ?? []).flatMap(name => [`${name}ids`, `${name}#`, `dyp#${name}#`]),
    ];
    if (prefixes.length) {
        // まとまり (コレクションの 1 件分のキー) ごとに、すでに持っていなければコピーする
        let cursor = "";
        for (;;) {
            const page = await rpc<{ entries: [string, string | number | boolean][]; next?: string }>("lite", "migrate.worldKeys", { prefixes, cursor, limit: 40 }, 400);
            for (const [key, value] of page.entries) importWorldKey(key, value);
            if (!page.next) break;
            cursor = page.next;
        }
    }
    if (spec.playerDataFields) {
        let cursor = "";
        for (;;) {
            const page = await rpc<{ records: { id: string; fields: Record<string, unknown> }[]; next?: string }>("lite", "migrate.playerData", { fields: spec.playerDataFields.fields, cursor, limit: 40 }, 400);
            for (const record of page.records) {
                try { spec.playerDataFields.apply(record.id, record.fields); }
                catch (error) { console.warn(`[MakeCountry] migration of player ${record.id}: ${error instanceof Error ? error.message : error}`); }
            }
            if (!page.next) break;
            cursor = page.next;
        }
    }
}

/** 1 件分のキー (分割されたかたまりも含む) の基準になる名前。 */
function groupOf(key: string): string {
    const chunk = /^dyp#(.+)#(?:dy\d+|meta)$/.exec(key);
    return chunk ? chunk[1] : key;
}
const ownedGroups = new Map<string, boolean>();
function importWorldKey(key: string, value: string | number | boolean) {
    // ID の一覧は両方を合わせる
    if (/ids$/.test(key) && typeof value === "string" && !key.includes("#")) {
        let mine: unknown[] = [], theirs: unknown[] = [];
        try { mine = JSON.parse(String(world.getDynamicProperty(key) ?? "[]")); } catch { mine = []; }
        try { theirs = JSON.parse(value); } catch { return; }
        if (!Array.isArray(mine) || !Array.isArray(theirs)) return;
        const merged = [...new Set([...mine, ...theirs])];
        if (merged.length !== mine.length) world.setDynamicProperty(key, JSON.stringify(merged));
        return;
    }
    const group = groupOf(key);
    if (!ownedGroups.has(group)) {
        ownedGroups.set(group, world.getDynamicProperty(group) !== undefined || world.getDynamicProperty(`dyp#${group}#meta`) !== undefined);
    }
    if (ownedGroups.get(group)) return;
    world.setDynamicProperty(key, value);
}

/** Lite 側: 引き継ぎの問い合わせに答える。 */
export function setupLiteMigrationService(): void {
    onRpc("migrate.worldKeys", (args: any) => {
        const prefixes: string[] = Array.isArray(args?.prefixes) ? args.prefixes.map(String).filter(Boolean) : [];
        const cursor = String(args?.cursor ?? "");
        const limit = Math.max(1, Math.min(200, Number(args?.limit) || 40));
        if (!prefixes.length) return { entries: [] };
        const keys = world.getDynamicPropertyIds().filter(key => prefixes.some(p => key.startsWith(p)) && key > cursor).sort();
        const page = keys.slice(0, limit);
        const entries = page.map(key => [key, world.getDynamicProperty(key)] as [string, unknown]).filter(([, v]) => v !== undefined && typeof v !== "object");
        return { entries, next: keys.length > limit ? page[page.length - 1] : undefined };
    });

    onRpc("migrate.player", (args: any) => {
        const player = world.getEntity(String(args?.playerId ?? ""));
        if (!(player instanceof Player)) throw new Error("player_not_online");
        const keys: string[] = Array.isArray(args?.keys) ? args.keys.map(String) : [];
        const prefixes: string[] = Array.isArray(args?.prefixes) ? args.prefixes.map(String).filter(Boolean) : [];
        const values: Record<string, unknown> = {};
        for (const key of keys) { const v = player.getDynamicProperty(key); if (v !== undefined && typeof v !== "object") values[key] = v; }
        if (prefixes.length) for (const key of player.getDynamicPropertyIds()) {
            if (!prefixes.some(p => key.startsWith(p))) continue;
            const v = player.getDynamicProperty(key);
            if (v !== undefined && typeof v !== "object") values[key] = v;
        }
        return values;
    });

    onRpc("migrate.item", (args: any) => {
        const player = world.getEntity(String(args?.playerId ?? ""));
        if (!(player instanceof Player)) throw new Error("player_not_online");
        const item = player.getComponent("inventory")?.container?.getItem(Number(args?.slot));
        if (!item || item.typeId !== String(args?.typeId ?? "")) throw new Error("item_moved");
        const values: Record<string, unknown> = {};
        for (const key of item.getDynamicPropertyIds()) {
            const v = item.getDynamicProperty(key);
            if (v !== undefined && typeof v !== "object") values[key] = v;
        }
        return values;
    });

    onRpc("migrate.playerData", (args: any) => {
        const fields: string[] = Array.isArray(args?.fields) ? args.fields.map(String) : [];
        const cursor = String(args?.cursor ?? "");
        const limit = Math.max(1, Math.min(200, Number(args?.limit) || 40));
        const db = new DynamicProperties("player");
        const ids = (db.idList as string[]).filter(id => id.startsWith("player_") && id > cursor).sort();
        const page = ids.slice(0, limit);
        const records = page.flatMap(id => {
            try {
                const data = JSON.parse(db.get(id) ?? "null");
                if (!data) return [];
                const picked: Record<string, unknown> = {};
                for (const field of fields) if (data[field] !== undefined) picked[field] = data[field];
                return Object.keys(picked).length ? [{ id: id.slice("player_".length), fields: picked }] : [];
            } catch { return []; }
        });
        return { records, next: ids.length > limit ? page[page.length - 1] : undefined };
    });
}
