import { world } from "@minecraft/server";

/* ===== 定数 ===== */
const PREFIX = "db";
const MAX_SIZE = 30000;

const CHUNK = "__c__";
const META = "__m__";

const INDEX = "_index";
const INDEX_B = "_index_b";

const WAL = "_wal";
const SNAP = "_snap";

const LOCK = "_lock";
const TABLES = "_tables";

const LOCK_TIMEOUT = 5000;
const WAL_LIMIT = 80;

/* ===== LRU ===== */
class LRU<K, V> {
    private map = new Map<K, V>();
    constructor(private limit: number) {}

    get(k: K) {
        if (!this.map.has(k)) return undefined;
        const v = this.map.get(k)!;
        this.map.delete(k);
        this.map.set(k, v);
        return v;
    }

    set(k: K, v: V) {
        if (this.map.has(k)) this.map.delete(k);
        this.map.set(k, v);

        if (this.map.size > this.limit) {
            const first = this.map.keys().next().value;
            //@ts-ignore
            this.map.delete(first);
        }
    }

    delete(k: K) {
        this.map.delete(k);
    }
}

/* ===== DB ===== */
export class DataBase {
    constructor(public name: string) {}

    private tablesKey() {
        return `${PREFIX}:${this.name}:${TABLES}`;
    }

    private getTables(): Set<string> {
        const raw = world.getDynamicProperty(this.tablesKey());
        if (typeof raw !== "string") return new Set();
        return new Set(JSON.parse(raw));
    }

    private saveTables(set: Set<string>) {
        world.setDynamicProperty(
            this.tablesKey(),
            JSON.stringify([...set])
        );
    }

    /* ===== テーブル作成 ===== */
    createTable(name: string) {
        if (name.includes(":")) {
            throw new Error("invalid table name");
        }

        const tables = this.getTables();
        if (tables.has(name)) {
            throw new Error("table already exists");
        }

        tables.add(name);
        this.saveTables(tables);

        return new Table(name, this.name);
    }

    /* ===== テーブル取得 ===== */
    getTable(name: string) {
        const tables = this.getTables();
        if (!tables.has(name)) {
            return undefined
        }

        return new Table(name, this.name);
    }

    /* ===== テーブル削除 ===== */
    dropTable(name: string) {
        const tables = this.getTables();
        if (!tables.has(name)) {
            throw new Error("table does not exist");
        }

        const table = new Table(name, this.name);

        // 全データ削除
        for (const key of table.keys()) {
            table.delete(key);
        }

        // メタ削除
        const meta = [
            INDEX,
            INDEX_B,
            WAL,
            SNAP,
            LOCK
        ];

        for (const m of meta) {
            world.setDynamicProperty(
                `${PREFIX}:${this.name}:${name}:${m}`,
                undefined
            );
        }

        tables.delete(name);
        this.saveTables(tables);
    }

    getTableIds() {
        return [...this.getTables()];
    }
}

/* ===== TABLE ===== */
class Table {
    private cache = new LRU<string, any>(100);

    constructor(public name: string, public db: string) {}

    private k(k: string) {
        return `${PREFIX}:${this.db}:${this.name}:${k}`;
    }

    /* ===== LOCK ===== */
    private lock() {
        const raw = world.getDynamicProperty(this.k(LOCK));
        if (typeof raw === "string") {
            const l = JSON.parse(raw);
            if (Date.now() - l.time < LOCK_TIMEOUT) {
                throw new Error("locked");
            }
        }
        world.setDynamicProperty(
            this.k(LOCK),
            JSON.stringify({ time: Date.now() })
        );
    }

    private unlock() {
        world.setDynamicProperty(this.k(LOCK), undefined);
    }

    /* ===== CHUNK ===== */
    private writeChunks(key: string, str: string) {
        const n = Math.ceil(str.length / MAX_SIZE);
        world.setDynamicProperty(this.k(key + META), n);

        for (let i = 0; i < n; i++) {
            world.setDynamicProperty(
                this.k(key + CHUNK + i),
                str.slice(i * MAX_SIZE, (i + 1) * MAX_SIZE)
            );
        }
    }

    private readChunks(key: string): string | undefined {
        const n = world.getDynamicProperty(this.k(key + META));

        if (typeof n !== "number") {
            const raw = world.getDynamicProperty(this.k(key));
            return typeof raw === "string" ? raw : undefined;
        }

        let s = "";
        for (let i = 0; i < n; i++) {
            const c = world.getDynamicProperty(this.k(key + CHUNK + i));
            if (typeof c !== "string") return;
            s += c;
        }
        return s;
    }

    private delChunks(key: string) {
        const n = world.getDynamicProperty(this.k(key + META));

        if (typeof n === "number") {
            for (let i = 0; i < n; i++) {
                world.setDynamicProperty(this.k(key + CHUNK + i), undefined);
            }
            world.setDynamicProperty(this.k(key + META), undefined);
        } else {
            world.setDynamicProperty(this.k(key), undefined);
        }
    }

    /* ===== INDEX ===== */
    private getIndex(): Set<string> {
        const raw = world.getDynamicProperty(this.k(INDEX));
        if (typeof raw === "string") {
            try {
                return new Set(JSON.parse(raw));
            } catch {}
        }

        const b = world.getDynamicProperty(this.k(INDEX_B));
        if (typeof b === "string") return new Set(JSON.parse(b));

        return new Set();
    }

    private saveIndex(idx: Set<string>) {
        const s = JSON.stringify([...idx]);
        world.setDynamicProperty(this.k(INDEX_B), s);
        world.setDynamicProperty(this.k(INDEX), s);
    }

    /* ===== WAL ===== */
    private walMeta() {
        return this.k(WAL + META);
    }

    private walChunk(i: number) {
        return this.k(WAL + CHUNK + i);
    }

    private readWAL(): any[] {
        const n = world.getDynamicProperty(this.walMeta());
        if (typeof n !== "number") return [];

        let s = "";
        for (let i = 0; i < n; i++) {
            const c = world.getDynamicProperty(this.walChunk(i));
            if (typeof c === "string") s += c;
        }

        try {
            return JSON.parse(s);
        } catch {
            return [];
        }
    }

    private writeWAL(log: any[]) {
        const str = JSON.stringify(log);
        const n = Math.ceil(str.length / MAX_SIZE);

        world.setDynamicProperty(this.walMeta(), n);

        for (let i = 0; i < n; i++) {
            world.setDynamicProperty(
                this.walChunk(i),
                str.slice(i * MAX_SIZE, (i + 1) * MAX_SIZE)
            );
        }
    }

    private appendWAL(entry: any) {
        const log = this.readWAL();
        log.push({ ...entry, ts: Date.now() });
        this.writeWAL(log);
    }

    /* ===== SNAPSHOT ===== */
    private snapshot() {
        const data: Record<string, any> = {};
        for (const k of this.keys()) data[k] = this.get(k);

        this.writeChunks(SNAP, JSON.stringify(data));
        this.writeWAL([]);
    }

    private maybeGC() {
        const log = this.readWAL();
        if (log.length > WAL_LIMIT) {
            this.snapshot();
        }
    }

    /* ===== RAW ===== */
    private _setRaw(key: string, value: any) {
        const idx = this.getIndex();

        const str =
            typeof value === "object"
                ? JSON.stringify(value)
                : String(value);

        if (str.length > MAX_SIZE) this.writeChunks(key, str);
        else world.setDynamicProperty(this.k(key), str);

        idx.add(key);
        this.saveIndex(idx);

        this.cache.set(key, value);
    }

    private _delRaw(key: string) {
        const idx = this.getIndex();

        this.delChunks(key);

        idx.delete(key);
        this.saveIndex(idx);

        this.cache.delete(key);
    }

    /* ===== PUBLIC ===== */
    get(key: string) {
        const c = this.cache.get(key);
        if (c !== undefined) return c;

        const raw = this.readChunks(key);
        if (!raw) return;

        let v;
        try {
            v = JSON.parse(raw);
        } catch {
            v = raw;
        }

        this.cache.set(key, v);
        return v;
    }

    set(key: string, value: any) {
        this.lock();
        try {
            this.appendWAL({ op: "set", key, value });
            this._setRaw(key, value);
            this.maybeGC();
        } finally {
            this.unlock();
        }
    }

    delete(key: string) {
        this.lock();
        try {
            this.appendWAL({ op: "del", key });
            this._delRaw(key);
            this.maybeGC();
        } finally {
            this.unlock();
        }
    }

    keys() {
        return [...this.getIndex()];
    }
}