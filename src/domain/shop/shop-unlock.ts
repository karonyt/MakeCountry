/**
 * 持ち主が居なくなった店 (ショップブロック) の登録を運営が外す (チケット #1211)。
 *
 * 店は持ち主と店の管理者しか壊せないので、持ち主が遊ばなくなると国の側では片付けられない。
 * 登録を外すと、ふつうのブロックとして壊せるようになる。店に残っていた売上と前払いは、
 * 壊したときと同じく持ち主へ返す (失わせない)。
 *
 * ここは Minecraft の API に触らない (テストできるように)。読み書きは呼ぶ側が渡す。
 */

/** Core から届く店の論理 ID。値 null (外す) だけを受ける */
export const SHOP_UNLOCK_ID = /^shop_minecraft:(overworld|nether|the_end)_-?\d+_-?\d+_-?\d+$/;

/** 円未満の端数をそろえる (barrel-shop.ts の normalizeMoney と同じ丸め) */
function roundMoney(value: number): number {
    return Math.round(value * 100) / 100;
}

/**
 * 店の登録を外す。返すのは持ち主へ戻した額 (店が無ければ undefined)。
 * @param read 名前空間とキーから生の値を読む
 * @param write 名前空間とキーへ書く (null は消す)
 */
export function unlockShop(
    id: string,
    read: (namespace: string, key: string) => string | undefined,
    write: (namespace: string, key: string, value: string | null) => void,
): { refunded: number; owner: string } | undefined {
    if (!SHOP_UNLOCK_ID.test(id)) throw Error(`Invalid shop id: ${id}`);
    const raw = read("barrelShop", id);
    if (raw === undefined) return undefined;
    let refunded = 0;
    let owner = "";
    try {
        const shop = JSON.parse(raw);
        owner = String(shop?.owner ?? "");
        const money = Number(shop?.money) || 0;
        const prepaid = Number(shop?.prepaidMoney) || 0;
        const amount = roundMoney(Math.max(0, money) + Math.max(0, prepaid));
        if (owner && amount > 0) {
            const rawOwner = read("player", `player_${owner}`);
            if (rawOwner === undefined) throw Error(`Shop owner not found: ${owner}`);
            const playerData = JSON.parse(rawOwner);
            playerData.money = roundMoney((Number(playerData.money) || 0) + amount);
            write("player", `player_${owner}`, JSON.stringify(playerData));
            refunded = amount;
        }
    } catch (error) {
        // 売上を返せないまま消すとお金が消えるので、外さずに止める
        throw error instanceof Error ? error : Error(String(error));
    }
    write("barrelShop", id, null);
    return { refunded, owner };
}
