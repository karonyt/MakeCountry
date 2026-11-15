/**
 * 建国規約 第3条の例外のうち、チケットで運営が認めたもの。
 * 海チャンクの距離 (第2項: 自国の陸から 20 チャンク以内) を、この範囲 (チャンク座標・両端を含む) だけ外す。
 * 足すときは国 ID・範囲・チケット番号を書く。
 */
export const seaReachExceptions: { countryId: number; minX: number; maxX: number; minZ: number; maxZ: number; ticket: string }[] = [];

export function isSeaReachException(countryId: number | undefined, x: number, z: number): boolean {
    if (countryId === undefined) return false;
    return seaReachExceptions.some((e) => e.countryId === countryId && x >= e.minX && x <= e.maxX && z >= e.minZ && z <= e.maxZ);
}
