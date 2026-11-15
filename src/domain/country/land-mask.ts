import { LAND_MASK_META, LAND_MASK_RLE } from "./land-mask-data.js";

/** 陸チャンクのビット列。初めて使うときに 1 回だけ展開する (約 330KB) */
let bits: Uint8Array | undefined;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

/** スクリプト環境には atob も Buffer も無いので自前で読む */
export function decodeBase64(text: string): Uint8Array {
    const table = new Int16Array(128).fill(-1);
    for (let i = 0; i < ALPHABET.length; i += 1) table[ALPHABET.charCodeAt(i)] = i;
    const clean = text.replace(/=+$/, "");
    const out = new Uint8Array(Math.floor((clean.length * 6) / 8));
    let buffer = 0, size = 0, o = 0;
    for (let i = 0; i < clean.length; i += 1) {
        const v = table[clean.charCodeAt(i)];
        if (v === undefined || v < 0) throw Error("Invalid base64");
        buffer = (buffer << 6) | v;
        size += 6;
        if (size >= 8) {
            size -= 8;
            out[o++] = (buffer >> size) & 0xff;
        }
    }
    return out;
}

/** 交互の長さ (0 から始まる) を展開する */
export function expandRuns(packed: Uint8Array, total: number): Uint8Array {
    const out = new Uint8Array(Math.ceil(total / 8));
    let pos = 0, on = false, i = 0;
    while (i < packed.length && pos < total) {
        let n = 0, shift = 0, b = 0;
        do {
            b = packed[i++] ?? 0;
            n += (b & 0x7f) * 2 ** shift;
            shift += 7;
        } while (b & 0x80);
        if (on) for (let k = 0; k < n; k += 1) { const p = pos + k; out[p >> 3] = (out[p >> 3] ?? 0) | (1 << (p & 7)); }
        pos += n;
        on = !on;
    }
    return out;
}

/** 陸チャンク (元からある陸 = 水でないマスが 13 マス以上) か (地球の外は false) */
export function isLandChunk(x: number, z: number): boolean {
    const m = LAND_MASK_META;
    if (x < m.minX || x >= m.minX + m.width || z < m.minZ || z >= m.minZ + m.height) return false;
    bits ??= expandRuns(decodeBase64(LAND_MASK_RLE), m.width * m.height);
    const i = (z - m.minZ) * m.width + (x - m.minX);
    return ((bits[i >> 3] ?? 0) & (1 << (i & 7))) !== 0;
}
