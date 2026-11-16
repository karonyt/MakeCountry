import { IS_SPLIT_BUILD } from "@/shared/build-flags.js";
import { world } from "@minecraft/server";

export type PendingJobReward = {
    version: 1;
    id: string;
    job: "crafter" | "tamer";
    playerId: string;
    amount: number;
    phase: "pending" | "executing" | "settled" | "blocked";
    sourceId?: string;
    outcome?: "paid" | "skipped";
    reason?: string;
};
type StoredReward = PendingJobReward & { dirty?: boolean; owned?: boolean };
const PREFIX = "karo:job_reward#";
let sequence = 0;

/** Native receipts survive a new script VM. Unconfirmed payments are never replayed. */
export class PendingJobRewards {
    private readonly records = new Map<string, StoredReward>();
    private loaded = false;
    private invalid = 0;
    private storageFailures = 0;
    constructor(private readonly job: PendingJobReward["job"], private readonly canRemove: (entry: PendingJobReward) => boolean = () => true) { }

    private key(id: string) { return `${PREFIX}${this.job}#${id}`; }
    private warn() { this.storageFailures++; if (this.storageFailures === 1 || this.storageFailures % 20 === 0) console.warn(`[jobs] ${this.job} receipt storage unavailable; retaining work`); }
    private persist(entry: StoredReward) {
        if (!entry.owned) {
            if (world.getDynamicProperty(this.key(entry.id)) !== undefined) throw Error("job_reward_receipt_collision");
            entry.owned = true;
        }
        const { dirty, owned, ...record } = entry;
        entry.dirty = true;
        world.setDynamicProperty(this.key(entry.id), JSON.stringify(record));
        entry.dirty = false;
    }
    private decode(key: string, raw: unknown): StoredReward {
        if (typeof raw !== "string") throw Error("invalid_job_reward_receipt");
        const e = JSON.parse(raw);
        const fields = ["version", "id", "job", "playerId", "amount", "phase", "sourceId", "outcome", "reason"];
        if (!e || Object.keys(e).some(key => !fields.includes(key)) || e.version !== 1 || e.job !== this.job || typeof e.id !== "string"
            || !/^[a-z0-9-]{1,100}$/.test(e.id) || key !== this.key(e.id)
            || typeof e.playerId !== "string" || !e.playerId.length || e.playerId.length > 256
            || !Number.isSafeInteger(e.amount) || e.amount <= 0
            || !["pending", "executing", "settled", "blocked"].includes(e.phase)
            || (this.job === "tamer" && (e.sourceId === undefined || e.amount !== 1))
            || (e.sourceId !== undefined && (typeof e.sourceId !== "string" || !e.sourceId.length || e.sourceId.length > 256))
            || (e.outcome !== undefined && !["paid", "skipped"].includes(e.outcome))
            || (e.phase === "settled" && !e.outcome) || (e.phase !== "settled" && e.outcome !== undefined)
            || (e.reason !== undefined && (typeof e.reason !== "string" || e.reason.length > 100))) throw Error("invalid_job_reward_receipt");
        // Copy known fields only: an on-disk value cannot forge the in-memory dirty/owned flags.
        return { version: 1, id: e.id, job: e.job, playerId: e.playerId, amount: e.amount, phase: e.phase,
            ...(e.sourceId === undefined ? {} : { sourceId: e.sourceId }),
            ...(e.outcome === undefined ? {} : { outcome: e.outcome }),
            ...(e.reason === undefined ? {} : { reason: e.reason }), owned: true, dirty: false };
    }
    load(): boolean {
        if (this.loaded) return true;
        try {
            this.invalid = 0;
            for (const key of world.getDynamicPropertyIds().filter(key => key.startsWith(`${PREFIX}${this.job}#`))) {
                let entry: StoredReward;
                const raw = world.getDynamicProperty(key);
                try { entry = this.decode(key, raw); }
                catch { this.invalid++; continue; } // Preserve unreadable/corrupt records for review.
                if (this.records.has(entry.id)) continue;
                // A repeated tame accepted while Native enumeration was unavailable
                // represents the same animal, not another payment or another owner.
                if (entry.sourceId) for (const fresh of this.records.values()) {
                    if (!fresh.owned && fresh.sourceId === entry.sourceId) this.records.delete(fresh.id);
                }
                if (entry.phase === "executing") {
                    // 分割版: 支払いは Lite が ID ごとに一度だけ行うので、送り直して確かめられる
                    if (IS_SPLIT_BUILD) { entry.phase = "pending"; entry.dirty = true; }
                    else { entry.phase = "blocked"; entry.reason = "unconfirmed_after_restart"; entry.dirty = true; }
                }
                this.records.set(entry.id, entry);
            }
            if (this.job === "tamer") {
                const sources = new Map<string, StoredReward[]>();
                for (const entry of this.records.values()) if (entry.sourceId) {
                    const group = sources.get(entry.sourceId) ?? [];
                    group.push(entry); sources.set(entry.sourceId, group);
                }
                for (const entry of this.records.values()) {
                    if (entry.phase === "settled" || entry.phase === "blocked") continue;
                    if (this.invalid || (entry.sourceId && (sources.get(entry.sourceId)?.length ?? 0) > 1)) {
                        entry.phase = "blocked"; entry.reason = this.invalid ? "receipt_corruption" : "duplicate_source_claim"; entry.dirty = true;
                    }
                }
            }
            this.loaded = true;
            if (this.invalid) console.warn(`[jobs] ${this.job} invalid receipts retained for review: ${this.invalid}`);
            return true;
        } catch { this.warn(); return false; }
    }
    enqueue(playerId: string, amount: number, sourceId?: string): PendingJobReward {
        if (!Number.isSafeInteger(amount) || amount <= 0 || !playerId || playerId.length > 256
            || (sourceId !== undefined && (!sourceId.length || sourceId.length > 256))) throw Error("invalid_job_reward_work");
        if (this.job === "tamer" && (sourceId === undefined || amount !== 1)) throw Error("invalid_job_reward_work");
        this.load();
        if (sourceId !== undefined) {
            const existing = [...this.records.values()].find(e => e.sourceId === sourceId);
            if (existing) {
                if (this.job === "tamer" && this.invalid) throw Error("job_reward_receipts_need_review");
                if (!this.loaded) throw Error("job_reward_receipt_save_failed");
                if (existing.dirty) {
                    try { this.persist(existing); }
                    catch { this.warn(); throw Error("job_reward_receipt_save_failed"); }
                }
                return existing;
            }
        }
        let entry = sourceId === undefined ? [...this.records.values()].find(e => e.playerId === playerId && e.phase === "pending" && !e.sourceId && Number.isSafeInteger(e.amount + amount)) : undefined;
        if (entry) entry.amount += amount;
        else {
            let id: string;
            do { id = `${Date.now().toString(36)}-${(++sequence).toString(36)}-${Math.floor(Math.random() * 0x100000000).toString(36)}`; } while (this.records.has(id));
            entry = { version: 1, id, job: this.job, playerId, amount, phase: "pending", ...(sourceId === undefined ? {} : { sourceId }), dirty: true };
            this.records.set(id, entry);
        }
        entry.dirty = true;
        if (this.job === "tamer" && this.invalid) { entry.phase = "blocked"; entry.reason = "receipt_corruption"; }
        if (!this.loaded) throw Error("job_reward_receipt_save_failed");
        try { this.persist(entry); } catch { this.warn(); throw Error("job_reward_receipt_save_failed"); }
        if (this.job === "tamer" && this.invalid) throw Error("job_reward_receipts_need_review");
        return entry;
    }
    entries(): PendingJobReward[] { return this.loaded ? [...this.records.values()] : []; }
    begin(entry: PendingJobReward): void { this.beginMany([entry]); }
    beginMany(entries: PendingJobReward[]): void {
        if (!entries.length || !this.loaded) throw Error("job_reward_receipt_not_ready");
        const ids = new Set(entries.map(e => e.id));
        if (ids.size !== entries.length || entries.some(e => this.records.get(e.id) !== e || e.phase !== "pending" || (e as StoredReward).dirty)) throw Error("job_reward_receipt_not_ready");
        if ([...this.records.values()].some(e => entries.some(entry => entry.playerId === e.playerId) && ["blocked", "executing"].includes(e.phase))) throw Error("job_reward_player_blocked");
        const started: StoredReward[] = [];
        try {
            for (const entry of entries as StoredReward[]) {
                started.push(entry); entry.phase = "executing"; this.persist(entry);
            }
        } catch {
            // No money/XP has been touched until every receipt is durable.
            for (const entry of started) {
                entry.phase = "pending"; entry.dirty = true;
                try { this.persist(entry); } catch { this.warn(); }
            }
            throw Error("job_reward_receipt_save_failed");
        }
    }
    retry(entry: PendingJobReward, error: unknown): void {
        const owned = this.records.get(entry.id); if (owned !== entry || !["pending", "executing"].includes(owned.phase)) return;
        const uncertain = error instanceof Error && ["job_progress_rollback_failed", "native_property_rollback_failed"].includes(error.message);
        owned.phase = uncertain ? "blocked" : "pending";
        if (uncertain) owned.reason = "rollback_failed";
        try { this.persist(owned); } catch { this.warn(); }
    }
    block(entry: PendingJobReward, reason: string): void {
        const owned = this.records.get(entry.id); if (owned !== entry) return;
        owned.phase = "blocked"; owned.reason = reason;
        try { this.persist(owned); } catch { this.warn(); }
    }
    settle(entry: PendingJobReward, outcome: "paid" | "skipped"): void {
        const owned = this.records.get(entry.id); if (owned !== entry) return;
        // A failed receipt write/cleanup must not make an accepted payment retryable.
        owned.phase = "settled"; owned.outcome = outcome;
        try { this.persist(owned); } catch { this.warn(); }
        this.cleanup(owned);
    }
    private cleanup(entry: StoredReward) {
        try {
            if (!this.canRemove(entry)) return;
            world.setDynamicProperty(this.key(entry.id), undefined);
            this.records.delete(entry.id);
        } catch { this.warn(); }
    }
    sync(): void {
        if (!this.load()) return;
        for (const entry of this.records.values()) {
            if (entry.phase === "settled") {
                if (entry.dirty) { try { this.persist(entry); } catch { this.warn(); } }
                this.cleanup(entry); continue;
            }
            if (entry.dirty) { try { this.persist(entry); } catch { this.warn(); } }
        }
    }
    needsWork(): boolean {
        if (!this.loaded) return true;
        const blocked = new Set([...this.records.values()].filter(e => e.phase === "blocked" || e.phase === "executing").map(e => e.playerId));
        return [...this.records.values()].some(e => e.dirty || e.phase === "settled" || (e.phase === "pending" && !blocked.has(e.playerId)));
    }
    stats() {
        return { records: this.records.size, pendingPlayers: new Set([...this.records.values()].map(e => e.playerId)).size,
            blockedPlayers: new Set([...this.records.values()].filter(e => e.phase === "blocked").map(e => e.playerId)).size,
            invalidReceipts: this.invalid, storageFailures: this.storageFailures };
    }
}
