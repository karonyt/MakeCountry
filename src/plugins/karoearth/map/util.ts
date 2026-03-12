import { system } from "@minecraft/server";
import { Logger } from "./logger.js";
import { IgnoredBlocks, IgnoreFloatingBlocks, AquaticBlocks, SurfaceFeatureBlocks, TransparentDecorationBlocks } from "./config.js";

// --- ユーティリティ関数 ---

export function waitTicks(ticks: any) {
    return new Promise(resolve => {
        // @ts-ignore TS(2345): Argument of type '(value: unknown) => void' is not... Remove this comment to see the full error message
        system.runTimeout(resolve, ticks);
    });
}

export function verifyChunksLoaded(dimension: any, from: any, to: any) {
    const midX = Math.floor((from.x + to.x) / 2);
    const midZ = Math.floor((from.z + to.z) / 2);
    try {
        const b = dimension.getBlock({ x: midX, y: dimension.heightRange.max - 1, z: midZ });
        return !!b;
    } catch (e) {
        return false;
    }
}

// ★修正: 地下判定ロジック (遮蔽物スキャン)
export function isSurfaceUpdate(dimension: any, block: any) {
    try {
        const x = block.x;
        const y = block.y;
        const z = block.z;

        // 判定の上限高さ
        // 基本はY=120まで見るが、もし現在の位置がそれより高ければ、さらに上(最大Y+20)まで見る
        const checkLimitY = Math.min(dimension.heightRange.max, Math.max(120, y + 20));

        // 直上からスキャン開始
        let currentY = y + 1;

        while (currentY < checkLimitY) {
            const b = dimension.getBlock({ x, y: currentY, z });

            // ブロックが取得できない(未ロード等)場合は、安全のため更新しておく
            if (!b) return true;

            const id = b.typeId;

            // 1. 完全に無視していいもの（空気など）はスルーして上へ
            if (IgnoredBlocks.has(id)) {
                currentY++;
                continue;
            }

            // 2. マップ上で「無視」扱いされるもの（草、花、ガラスなど）もスルー
            // これらが上にあっても、その下のブロック（今回置いたブロック）はマップに映る可能性があるため
            if (TransparentDecorationBlocks.has(id) || IgnoreFloatingBlocks.has(id)) {
                currentY++;
                continue;
            }

            // 3. それ以外（石、土、原木、葉っぱ、水など）
            // これらはマップに描画される「不透過/地表ブロック」とみなす。
            // これらが上に一つでもあれば、今回置いたブロックは「隠れている」ので更新不要。
            return false;
        }

        // 上空まで遮蔽物がなかった
        return true;

    } catch (e) {
        // エラー時は念のため送信する
        return true;
    }
}

// 地表ブロック特定ロジック
export function findSurfaceBlock(dimension: any, x: any, z: any) {
    try {
        // 1. APIが思う「一番上のブロック」を取得
        let topmostBlock = dimension.getTopmostBlock({ x, z });
        if (!topmostBlock) return null;

        // ★ステップ1: 「草・花」対策 (Drill Down)
        // 一番上が装飾用の草花なら、それがなくなるまで下に掘り下げる
        try {
            while (topmostBlock && TransparentDecorationBlocks.has(topmostBlock.typeId)) {
                const lowerY = topmostBlock.y - 1;
                if (lowerY < dimension.heightRange.min) break;

                const lowerBlock = dimension.getBlock({ x, y: lowerY, z });
                if (lowerBlock) {
                    topmostBlock = lowerBlock;
                } else {
                    break;
                }
            }
        } catch (e) { /* 無視 */ }

        // ★ステップ2: 「葉っぱ・雪・木」対策 (Drill Up)
        // 原木や地面が取得された場合、その上に「葉っぱ」や「雪」がないか上空へ探索する
        try {
            let currentY = topmostBlock.y + 1;
            // 木や積雪を考慮して少し上までスキャン
            const scanLimitY = Math.min(dimension.heightRange.max, currentY + 20);

            while (currentY < scanLimitY) {
                const b = dimension.getBlock({ x, y: currentY, z });
                if (!b) break;
                const id = b.typeId;

                // 空気ならスキップ（木の枝の隙間などの可能性があるため、すぐには諦めない）
                if (id === "minecraft:air" || id === "minecraft:void_air" || id === "minecraft:light_block") {
                    currentY++;
                    continue;
                }

                if (id.includes("leaves") || id.includes("vine") || id.includes("mangrove_roots") ||
                    id.includes("wart_block") || id.includes("shroomlight") ||
                    id.includes("snow") || id.includes("carpet") || id.includes("wool")) {

                    topmostBlock = b;
                }
                // 他の固体ブロック（石や土など）が出てきたら更新
                else if (!IgnoredBlocks.has(id) && !IgnoreFloatingBlocks.has(id) && !TransparentDecorationBlocks.has(id)) {
                    topmostBlock = b;
                }

                currentY++;
            }
        } catch (e) { }

        // ★ステップ3: 上空へ向かって水面を探す (Depth Map対応)
        let hasWater = false;

        try {
            let currentY = topmostBlock.y + 1;
            const limitY = Math.min(dimension.heightRange.max, currentY + 30);

            while (currentY < limitY) {
                const b = dimension.getBlock({ x, y: currentY, z });
                if (!b) break;
                const id = b.typeId;

                if (id === "minecraft:air" || id === "minecraft:void_air") break;

                if (id.includes("water") || AquaticBlocks.has(id)) {
                    hasWater = true;
                }
                else if (TransparentDecorationBlocks.has(id)) {
                    // 無視
                }
                else if (SurfaceFeatureBlocks.has(id) || !IgnoredBlocks.has(id)) {
                    topmostBlock = b;
                    hasWater = false;
                    break;
                }
                currentY++;
            }
        } catch (e) { }

        // 結果の決定

        // 水があった場合は、IDは「水」、座標は「海底」を返す
        if (hasWater) {
            return { typeId: "minecraft:water", location: { x: topmostBlock.x, y: topmostBlock.y, z: topmostBlock.z } };
        }

        const typeId = topmostBlock.typeId;

        if (SurfaceFeatureBlocks.has(typeId) || typeId.includes("leaves") || typeId.includes("log") ||
            typeId.includes("wool") || typeId.includes("carpet") || typeId.includes("snow")) {
            return { typeId: typeId, location: { x: topmostBlock.x, y: topmostBlock.y, z: topmostBlock.z } };
        }

        if (IgnoreFloatingBlocks.has(typeId)) {
            let currentY = topmostBlock.y - 1;
            const limitY = Math.max(dimension.heightRange.min, currentY - 20);
            while (currentY > limitY) {
                const b = dimension.getBlock({ x, y: currentY, z });
                if (b && !b.isAir && !IgnoreFloatingBlocks.has(b.typeId) && !IgnoredBlocks.has(b.typeId)) {
                    topmostBlock = b;
                    break;
                }
                currentY--;
            }
        }

        return { typeId: topmostBlock.typeId, location: { x: topmostBlock.x, y: topmostBlock.y, z: topmostBlock.z } };

    } catch (e) {
        return null;
    }
}