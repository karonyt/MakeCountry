export interface AuditEvent {
    id: string;
    kind: string;
    at: number;
    actor?: string;
    playerId?: string;
    data: Record<string, unknown>;
}

// ScriptAPI has no Node Buffer. Count actual UTF-8, including astral characters.
export function utf8Bytes(value: string): number {
    let bytes = 0;
    for (const character of value) {
        const code = character.codePointAt(0)!;
        bytes += code < 0x80 ? 1 : code < 0x800 ? 2 : code < 0x10000 ? 3 : 4;
    }
    return bytes;
}

/** No network/storage outage may grow BDS memory indefinitely. ACK removes only the exact prefix. */
export class AuditOutbox {
    private rows: Array<{ event: AuditEvent; bytes: number }> = [];
    bytes = 0;
    dropped = 0;
    constructor(private maxCount = 2000, private maxBytes = 8 * 1024 * 1024) {}
    get length() { return this.rows.length; }
    get oldestAt() { return this.rows[0]?.event.at ?? 0; }
    push(event: AuditEvent): boolean {
        const bytes = utf8Bytes(JSON.stringify(event));
        if (bytes > 150 * 1024 || this.rows.length >= this.maxCount || this.bytes + bytes > this.maxBytes) {
            this.dropped++; return false;
        }
        this.rows.push({ event, bytes }); this.bytes += bytes; return true;
    }
    batch(): AuditEvent[] {
        let bytes = 0;
        const result: AuditEvent[] = [];
        for (const row of this.rows) {
            if (result.length >= 32 || bytes + row.bytes > 256 * 1024) break;
            result.push(row.event); bytes += row.bytes;
        }
        return result;
    }
    acknowledge(ids: string[]): boolean {
        if (!ids.length || ids.length > this.rows.length || ids.some((id, i) => id !== this.rows[i].event.id)) return false;
        for (const row of this.rows.splice(0, ids.length)) this.bytes -= row.bytes;
        return true;
    }
}

/** Wall-clock due times; one player per scheduler call, including on low TPS. */
export class InventorySchedule {
    private due = new Map<string, number>();
    private cursor = 0;
    choose(ids: readonly string[], now: number): string | undefined {
        const active = new Set(ids);
        for (const id of this.due.keys()) if (!active.has(id)) this.due.delete(id);
        for (let offset = 0; offset < ids.length; offset++) {
            const index = (this.cursor + offset) % ids.length, id = ids[index];
            if (!this.due.has(id)) this.due.set(id, now + index * Math.min(250, 60000 / Math.max(1, ids.length)));
            if (this.due.get(id)! > now) continue;
            this.cursor = (index + 1) % ids.length;
            this.due.set(id, now + 60000);
            return id;
        }
        return undefined;
    }
}

/** Bounded, millisecond-resolution diagnostics; never stores player/item text. */
export class InventoryCaptureMetrics {
    private samples: Array<{ captureMs: number; enqueueMs: number; bytes: number }> = [];
    captures = 0;
    lastCaptureAt = 0;
    observe(captureMs: number, enqueueMs: number, bytes: number, at: number) {
        if (![captureMs, enqueueMs, bytes, at].every(n => Number.isFinite(n) && n >= 0)) return;
        this.captures++; this.lastCaptureAt = at;
        this.samples.push({ captureMs, enqueueMs, bytes });
        if (this.samples.length > 256) this.samples.shift();
    }
    report() {
        const distribution = (key: 'captureMs' | 'enqueueMs' | 'bytes') => {
            const values = this.samples.map(s => s[key]).sort((a, b) => a - b);
            const percentile = (p: number) => values[Math.max(0, Math.ceil(values.length * p) - 1)] ?? 0;
            return { p50: percentile(.5), p95: percentile(.95), max: values.at(-1) ?? 0 };
        };
        return { captures: this.captures, lastCaptureAt: this.lastCaptureAt, window: this.samples.length,
            captureMs: distribution('captureMs'), enqueueMs: distribution('enqueueMs'), bytes: distribution('bytes') };
    }
}
