"""guard の陸海マスク (landmask.json / landmask-solid.bin) から src/domain/country/land-mask-data.ts を作る。
使い方: python3 tools/make-land-mask.py <landmask.json> <landmask-solid.bin>
"""
import json, base64, sys
meta = json.load(open(sys.argv[1]))
raw = open(sys.argv[2], 'rb').read()
total = meta['width'] * meta['height']
runs, cur, n, land = [], 0, 0, 0
for i in range(total):
    b = (raw[i >> 3] >> (i & 7)) & 1
    land += b
    if b == cur: n += 1
    else: runs.append(n); cur ^= 1; n = 1
runs.append(n)
out = bytearray()
for r in runs:
    while True:
        b = r & 0x7f; r >>= 7
        if r: out.append(b | 0x80)
        else: out.append(b); break
b64 = base64.b64encode(bytes(out)).decode()
print(f'''/**
 * 地球の「陸チャンク」（元からある陸 = 水でないマスが 13 マス以上）の地図。領土の見張り (guard/data/landmask.bin) と同じもの。
 * 建国規約 第3条 第2項（海は自国の陸チャンクから 20 チャンク以内）をゲーム内で判定するために使う。
 * 形式: index=(cz-minZ)*width+(cx-minX) のビット列を、0 から始まる交互の長さ (varint) で詰めて base64 にしたもの。
 * 作り直すときは guard の landmask を作り直したあと tools/make-land-mask.py で出し直す。
 */
export const LAND_MASK_META = {{ minX: {meta["minX"]}, minZ: {meta["minZ"]}, width: {meta["width"]}, height: {meta["height"]}, land: {land}, generatedAt: "{meta["generatedAt"]}" }} as const;
export const LAND_MASK_RLE = "{b64}";''')
