import { Dimension, Player, system, world } from "@minecraft/server";
import fishing_config from "../../fishing_config";
import { DynamicProperties } from "../dyp";
import { TimeManager } from "../time/time";

export class FishManager {
    /**
     * options:
     *  - flushIntervalTicks: how often to schedule batch flush (default 600)
     *  - writesPerTick: how many DP writes to perform per flush tick (default 100)
     *  - activeCacheMaxEntries: max player-fish entries in memory (default 500000)
     *  - inactiveEvictSeconds: evict entry if not touched for this many seconds (default 900)
     */
    constructor(options = {}) {
        this.config = fishing_config;
        this.db = new DynamicProperties('fishEncyclopedia');
        this.calendar = new TimeManager();

        // In-memory primitives (avoid JSON)
        this.playerCounts = new Map(); // key: c_pid_fid -> int
        this.playerMaxes = new Map(); // key: m_pid_fid -> int (size*100)

        // access metadata for LRU / inactivity eviction
        // accessMap: key -> { lastAccess: epochSeconds }
        this.accessMap = new Map();

        // server ranks (small)
        this.serverRanks = new Map();

        // dirty sets and write queue
        this.dirtyPlayerKeys = new Set(); // primitive keys to write
        this.dirtyRankKeys = new Set();   // fishId keys to write as JSON
        this.writeQueue = []; // FIFO array of { key, type } to be drained gradually

        // options + tuning
        this.flushIntervalTicks = options.flushIntervalTicks ?? 600; // 30s @20tps
        this.writesPerTick = options.writesPerTick ?? 100; // how many writes to process in one flush tick
        this.activeCacheMaxEntries = options.activeCacheMaxEntries ?? 500000; // cap for player entries (count+max keys combined)
        this.inactiveEvictSeconds = options.inactiveEvictSeconds ?? 900; // 15 minutes default

        // rank limit
        this.rankLimit = options.rankLimit ?? 20;

        // preload server ranks
        this._preloadServerRanks();

        // schedule periodic flush + eviction + queue drain
        this._setupPeriodicTasks();
    }

    // ---------- helpers ----------
    _playerCountKey(playerId, fishId) { return `c_${playerId}_${fishId}`; }
    _playerMaxKey(playerId, fishId) { return `m_${playerId}_${fishId}`; }
    _serverRankKey(fishId) { return `server_${fishId}_rank`; }
    _nowSec() { return Math.floor(Date.now() / 1000); }
    _storeSizeInt(sizeFloat) { return Math.floor(sizeFloat * 100); }
    _restoreSizeFloat(sizeInt) { return (sizeInt / 100); }

    // ---------- preload ranks ----------
    _getAllFishIdsFromConfig() {
        const ids = new Set();
        const date = this.calendar.getCalendar();
        (this.config.fishes[date.season][date.period] ?? []).forEach(f => ids.add(f.typeId));
        const bi = this.config.biomes ?? {};
        Object.values(bi).forEach(b => (b.fishes[date.season][date.period] ?? []).forEach(f => ids.add(f.typeId)));
        return Array.from(ids);
    }

    _preloadServerRanks() {
        const ids = this._getAllFishIdsFromConfig();
        for (const id of ids) {
            const key = this._serverRankKey(id);
            const raw = this.db.get(key);
            if (raw) {
                try {
                    this.serverRanks.set(id, JSON.parse(raw));
                } catch (e) {
                    this.serverRanks.set(id, { top: [] });
                }
            } else {
                this.serverRanks.set(id, { top: [] });
            }
        }
    }

    // ---------- lazy load player primitive keys ----------
    _loadPlayerCountIfMissing(playerId, fishId) {
        const key = this._playerCountKey(playerId, fishId);
        if (!this.playerCounts.has(key)) {
            const v = this.db.get(key);
            this.playerCounts.set(key, v ? parseInt(v, 10) || 0 : 0);
            this._touchKey(key);
        } else {
            this._touchKey(key);
        }
    }

    _loadPlayerMaxIfMissing(playerId, fishId) {
        const key = this._playerMaxKey(playerId, fishId);
        if (!this.playerMaxes.has(key)) {
            const v = this.db.get(key);
            this.playerMaxes.set(key, v ? parseInt(v, 10) || 0 : 0);
            this._touchKey(key);
        } else {
            this._touchKey(key);
        }
    }

    // mark access time for LRU/inactivity
    _touchKey(key) {
        this.accessMap.set(key, { lastAccess: this._nowSec() });
    }

    // ---------- pick fish (same weighted logic) ----------
    _pickFish(location, dimension) {
        const biome = dimension.getBiome(location);
        const biomeId = biome?.id;
        const date = this.calendar.getCalendar();
        /**
         * @type {Array<{typeId:string,name:string,weight:number,size:{min:number,max:number}}>}
         */
        const biomeFishes = this.config.biomes?.[biomeId]?.fishes[date.season][date.period] ?? [];
        const fishes = [
            ...(this.config.fishes[date.season][date.period] ?? []),
            ...biomeFishes
        ];
        if (fishes.length === 0) return null;

        const totalWeight = fishes.reduce((s, f) => s + (f.weight ?? 0), 0);
        let rand = Math.random() * totalWeight;

        for (const fish of fishes) {
            rand -= (fish.weight ?? 0);
            if (rand <= 0) {
                const min = fish.size?.min ?? 1;
                const max = fish.size?.max ?? 1;
                return {
                    typeId: fish.typeId,
                    name: fish.name,
                    size: this.setRandomSize(min, max),
                    biome: biomeId
                };
            }
        }

        const last = fishes[fishes.length - 1];
        const min = last.size?.min ?? 1;
        const max = last.size?.max ?? 1;
        return {
            typeId: last.typeId,
            name: last.name,
            size: this.setRandomSize(min, max),
            biome: biomeId
        };
    }

    /**
     * ---------- public: fishing ----------
     * @param {{x: number,y: number,z: number}} location 
     * @param {Dimension} dimension 
     * @param {Player} player 
     */
    fishing(location, dimension, player) {
        const result = this._pickFish(location, dimension);
        if (!result) return null;

        const { typeId, size, biome, name } = result;
        const pId = player.id;
        const countKey = this._playerCountKey(pId, typeId);
        const maxKey = this._playerMaxKey(pId, typeId);

        this._loadPlayerCountIfMissing(pId, typeId);
        this._loadPlayerMaxIfMissing(pId, typeId);

        // increment count (primitive)
        const newCount = (this.playerCounts.get(countKey) ?? 0) + 1;
        this.playerCounts.set(countKey, newCount);
        this._enqueueDirtyKey(countKey);

        // update max if needed
        const sizeInt = this._storeSizeInt(size);
        const prevMax = this.playerMaxes.get(maxKey) ?? 0;
        if (sizeInt > prevMax) {
            this.playerMaxes.set(maxKey, sizeInt);
            this._enqueueDirtyKey(maxKey);
        } else {
            this._touchKey(maxKey);
        }

        // update ranking in memory (efficient)
        const ranking = this._updateServerRankingInMemory(pId, typeId, sizeInt);

        // LRU cap check and evict if over limit (best-effort)
        if ((this.playerCounts.size + this.playerMaxes.size) > this.activeCacheMaxEntries) {
            this._evictLRU(Math.max(1, Math.floor(this.activeCacheMaxEntries * 0.1))); // evict 10% at a time
        }

        return {
            typeId,
            size,
            name,
            biome,
            playerRecord: {
                count: newCount,
                maxSize: this._restoreSizeFloat(Math.max(prevMax, sizeInt))
            },
            ranking
        };
    }

    // ---------- enqueue dirty primitive keys (avoid duplicate queue entries) ----------
    _enqueueDirtyKey(key) {
        if (!this.dirtyPlayerKeys.has(key)) {
            this.dirtyPlayerKeys.add(key);
            this.writeQueue.push({ key, type: 'primitive' });
        }
        this._touchKey(key);
    }

    _enqueueDirtyRank(fishId) {
        if (!this.dirtyRankKeys.has(fishId)) {
            this.dirtyRankKeys.add(fishId);
            this.writeQueue.push({ key: fishId, type: 'rank' });
        }
    }

    // ---------- server ranking in-memory update (efficient insert/position adjust) ----------
    _updateServerRankingInMemory(playerId, fishId, sizeInt) {
        let rankObj = this.serverRanks.get(fishId);
        if (!rankObj) {
            const raw = this.db.get(this._serverRankKey(fishId));
            rankObj = raw ? JSON.parse(raw) : { top: [] };
            this.serverRanks.set(fishId, rankObj);
        }

        const top = rankObj.top;
        const existingIdx = top.findIndex(r => r.playerId === playerId);

        if (existingIdx >= 0) {
            if (sizeInt > top[existingIdx].size) {
                top[existingIdx].size = sizeInt;
                // bubble up
                let i = existingIdx;
                while (i > 0 && top[i].size > top[i - 1].size) {
                    [top[i], top[i - 1]] = [top[i - 1], top[i]];
                    i--;
                }
                if (top.length > this.rankLimit) top.length = this.rankLimit;
                this._enqueueDirtyRank(fishId);
            }
        } else {
            if (top.length < this.rankLimit || sizeInt > top[top.length - 1].size) {
                top.push({ playerId, size: sizeInt });
                top.sort((a, b) => b.size - a.size);
                if (top.length > this.rankLimit) top.length = this.rankLimit;
                this._enqueueDirtyRank(fishId);
            }
        }

        // return normalized copy
        return { top: (rankObj.top.map(r => ({ playerId: r.playerId, size: this._restoreSizeFloat(r.size) }))) };
    }

    // ---------- LRU eviction (evict N least recently used primitive keys) ----------
    _evictLRU(evictCount) {
        // build array of [key,lastAccess] for primitive keys only
        const arr = [];
        for (const [key, meta] of this.accessMap.entries()) {
            // only evict primitive keys (c_ or m_)
            if (key.startsWith('c_') || key.startsWith('m_')) arr.push([key, meta.lastAccess]);
        }
        if (arr.length === 0) return;

        // sort ascending by lastAccess (oldest first)
        arr.sort((a, b) => a[1] - b[1]);

        let evicted = 0;
        for (const [key] of arr) {
            if (evicted >= evictCount) break;
            // flush dirty one before deletion (best-effort)
            if (this.dirtyPlayerKeys.has(key)) {
                // leave it in cache to be flushed by writeQueue - avoid double write
                this.dirtyPlayerKeys.delete(key);
            }
            // actually delete from in-memory maps
            if (key.startsWith('c_')) this.playerCounts.delete(key);
            if (key.startsWith('m_')) this.playerMaxes.delete(key);
            this.accessMap.delete(key);
            evicted++;
        }
    }

    // ---------- drain writeQueue gradually (called on flush tick) ----------
    _drainWriteQueue() {
        let writes = 0;
        // process FIFO
        while (this.writeQueue.length > 0 && writes < this.writesPerTick) {
            const item = this.writeQueue.shift();
            if (!item) break;
            if (item.type === 'primitive') {
                const key = item.key;
                // primitive: check which map contains it
                if (key.startsWith('c_')) {
                    const val = this.playerCounts.get(key) ?? 0;
                    this.db.set(key, String(val));
                    this.dirtyPlayerKeys.delete(key);
                } else if (key.startsWith('m_')) {
                    const val = this.playerMaxes.get(key) ?? 0;
                    this.db.set(key, String(val));
                    this.dirtyPlayerKeys.delete(key);
                }
            } else if (item.type === 'rank') {
                const fishId = item.key;
                const rankObj = this.serverRanks.get(fishId) ?? { top: [] };
                const key = this._serverRankKey(fishId);
                try {
                    this.db.set(key, JSON.stringify(rankObj));
                } catch (e) {
                    // log but continue
                    console.warn('Failed to write rank for', fishId, e);
                }
                this.dirtyRankKeys.delete(fishId);
            }
            writes++;
        }
    }

    // ---------- periodic flush + smoothing ----------
    _setupPeriodicTasks() {
        let ticksSinceDirty = 0;
        let hasDirty = false;

        // フラグ管理関数
        const markDirty = () => {
            hasDirty = true;
            ticksSinceDirty = 0;
        };
        this._markDirty = markDirty;

        system.runInterval(() => {

            // dirty が無いなら何もしない（これが最重要）
            if (!hasDirty && this.writeQueue.length === 0) {
                return;
            }

            // small burst（書き込みがある時だけ）
            if (this.writeQueue.length > 0) {
                const small = Math.min(6, this.writeQueue.length);
                for (let i = 0; i < small; i++) {
                    this._flushOne(); // 単発書き込み
                }
            }

            // dirty がある時だけ flush タイマー進める
            if (hasDirty) {
                ticksSinceDirty++;

                // 設定した間隔に達したらバッチFlush
                if (ticksSinceDirty >= this.flushIntervalTicks) {

                    // ここだけ "まとめ書き"
                    this._drainWriteQueue();

                    // 次サイクルへ
                    hasDirty = false;
                    ticksSinceDirty = 0;
                }
            }
        });
    }

    _flushOne() {
        const item = this.writeQueue.shift();
        if (!item) return;

        if (item.type === "primitive") {
            const key = item.key;
            let val;

            if (key.startsWith("c_")) {
                val = this.playerCounts.get(key) ?? 0;
            } else if (key.startsWith("m_")) {
                val = this.playerMaxes.get(key) ?? 0;
            }
            this.db.set(key, String(val));
            this.dirtyPlayerKeys.delete(key);

        } else if (item.type === "rank") {
            const fishId = item.key;
            const rankObj = this.serverRanks.get(fishId) ?? { top: [] };
            const key = this._serverRankKey(fishId);
            this.db.set(key, JSON.stringify(rankObj));
            this.dirtyRankKeys.delete(fishId);
        }
    }

    // evict entries not touched for inactiveEvictSeconds (best-effort)
    _evictInactiveEntries() {
        const now = this._nowSec();
        const toEvict = [];
        for (const [key, meta] of this.accessMap.entries()) {
            if ((now - meta.lastAccess) > this.inactiveEvictSeconds) {
                // only consider primitive keys
                if (key.startsWith('c_') || key.startsWith('m_')) toEvict.push(key);
            }
        }
        // evict up to a reasonable batch to avoid stall
        const batch = Math.min(1000, toEvict.length);
        for (let i = 0; i < batch; i++) {
            const key = toEvict[i];
            // flush if dirty by enqueueing (it will be drained)
            if (this.dirtyPlayerKeys.has(key)) {
                this.writeQueue.push({ key, type: 'primitive' });
            }
            this.playerCounts.delete(key);
            this.playerMaxes.delete(key);
            this.accessMap.delete(key);
        }
    }

    // ---------- manual flush all now (shutdown hook should call this) ----------
    flushAllNow() {
        // enqueue all dirty keys
        for (const key of this.dirtyPlayerKeys) {
            if (!this.writeQueue.find(i => i.key === key && i.type === 'primitive')) {
                this.writeQueue.push({ key, type: 'primitive' });
            }
        }
        for (const fishId of this.dirtyRankKeys) {
            if (!this.writeQueue.find(i => i.key === fishId && i.type === 'rank')) {
                this.writeQueue.push({ key: fishId, type: 'rank' });
            }
        }

        // drain entire queue synchronously (best-effort)
        while (this.writeQueue.length > 0) {
            const item = this.writeQueue.shift();
            if (!item) break;
            if (item.type === 'primitive') {
                const key = item.key;
                if (key.startsWith('c_')) {
                    const val = this.playerCounts.get(key) ?? 0;
                    this.db.set(key, String(val));
                    this.dirtyPlayerKeys.delete(key);
                } else if (key.startsWith('m_')) {
                    const val = this.playerMaxes.get(key) ?? 0;
                    this.db.set(key, String(val));
                    this.dirtyPlayerKeys.delete(key);
                }
            } else if (item.type === 'rank') {
                const fishId = item.key;
                const rankObj = this.serverRanks.get(fishId) ?? { top: [] };
                const key = this._serverRankKey(fishId);
                this.db.set(key, JSON.stringify(rankObj));
                this.dirtyRankKeys.delete(fishId);
            }
        }
    }

    // ---------- utility: get player record (fast) ----------
    getPlayerFishRecord(playerId, fishId) {
        const countKey = this._playerCountKey(playerId, fishId);
        const maxKey = this._playerMaxKey(playerId, fishId);
        this._loadPlayerCountIfMissing(playerId, fishId);
        this._loadPlayerMaxIfMissing(playerId, fishId);
        return {
            count: this.playerCounts.get(countKey) ?? 0,
            maxSize: this._restoreSizeFloat(this.playerMaxes.get(maxKey) ?? 0)
        };
    }

    /**
     * ready-made random size util (2 decimal places)
     * @param {number} min 
     * @param {number} max 
     * @returns {number}
     */
    setRandomSize(min, max) {
        const v = Math.random() * (max - min) + min;
        return Math.round(v * 100) / 100;
    }

    getPlayerFishRecord(playerId, fishId) {
        const countKey = this._playerCountKey(playerId, fishId);
        const maxKey = this._playerMaxKey(playerId, fishId);

        this._loadPlayerCountIfMissing(playerId, fishId);
        this._loadPlayerMaxIfMissing(playerId, fishId);

        const count = this.playerCounts.get(countKey) ?? 0;
        const maxInt = this.playerMaxes.get(maxKey) ?? 0;

        return {
            count,
            maxSize: this._restoreSizeFloat(maxInt),
            obtained: count > 0,
        };
    }

    getPlayerAllFishRecords(player) {
        const result = {};
        const pid = player.id;

        for (const f of this.config.allFishes) {
            const record = this.getPlayerFishRecord(pid, f.typeId);

            result[f.typeId] = {
                name: f.name,
                count: record.count,
                maxSize: record.maxSize,
                obtained: record.count > 0
            };
        }

        return result;
    }

    getServerFishRanking(fishId) {
        const obj = this.serverRanks.get(fishId);
        if (!obj) return { top: [] };

        return {
            top: obj.top.map(r => ({
                playerId: r.playerId,
                size: this._restoreSizeFloat(r.size)
            }))
        };
    }
}