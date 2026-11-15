import type { Player } from "@minecraft/server";
import config from "@/config/server.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { isUnsafeToPlay } from "@/shared/integration/standalone.js";

function cents(value: unknown): number | undefined {
    if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
    const result = Math.round(value * 100);
    return Number.isSafeInteger(result) ? result : undefined;
}

function readAccount(database: DynamicProperties, id: string) {
    const raw = database.get(`player_${id}`);
    const account = raw ? JSON.parse(raw) : undefined;
    if (!account || cents(account.money) === undefined) throw Error('invalid_transfer_account');
    return account;
}

function notify(player: Player, message: Parameters<Player['sendMessage']>[0]): void {
    try { if (player.isValid) player.sendMessage(message); } catch { }
}

export function getMoneyTransferBalance(player: Player): number | undefined {
    if (!player.isValid || isUnsafeToPlay()) return undefined;
    try { return readAccount(new DynamicProperties('player'), player.id).money; } catch { return undefined; }
}

/** No asynchronous gap between checking current wallets and applying the pair. */
export function sendMoneyBetweenPlayers(sender: Player, receiver: Player | undefined, amount: number,
    maximum = Number.MAX_SAFE_INTEGER): boolean {
    if (!sender?.isValid) return false;
    if (isUnsafeToPlay()) {
        notify(sender, '§cサーバーのデータを読み込み中です。少し待ってから送金してください。');
        return false;
    }
    if (!receiver?.isValid) {
        notify(sender, '§c送金先のプレイヤーが見つかりません。退出していないか確認してください。');
        return false;
    }
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > maximum) {
        notify(sender, { translate: 'command.number.limit.range', with: ['1', String(maximum)] });
        return false;
    }
    if (sender.id === receiver.id) {
        notify(sender, { translate: 'command.error.trysend.moremoney.yourself' });
        return false;
    }
    const database = new DynamicProperties('player');
    let senderData, receiverData;
    try {
        senderData = readAccount(database, sender.id);
        receiverData = readAccount(database, receiver.id);
    } catch {
        notify(sender, '§c残高データを確認できないため、送金を中止しました。');
        return false;
    }
    const senderCents = cents(senderData.money)!;
    const receiverCents = cents(receiverData.money)!;
    const amountCents = amount * 100;
    if (!Number.isSafeInteger(amountCents) || !Number.isSafeInteger(receiverCents + amountCents)) {
        notify(sender, '§c金額が大きすぎるため、安全に計算できません。');
        return false;
    }
    if (senderCents < amountCents) {
        notify(sender, { translate: 'command.error.trysend.moremoney.youhave', with: [String(senderData.money)] });
        return false;
    }
    const senderId = sender.id, receiverId = receiver.id;
    const senderName = sender.name, receiverName = receiver.name;
    senderData.money = (senderCents - amountCents) / 100;
    receiverData.money = (receiverCents + amountCents) / 100;
    try {
        database.set(`player_${senderId}`, senderData);
        database.set(`player_${receiverId}`, receiverData);
    } catch (error) {
        let restored = true;
        for (const [id, original] of [[senderId, senderCents], [receiverId, receiverCents]] as const) {
            try {
                // Read fresh money markers: set() may have applied some writes
                // and updated the marker even when a later native write threw.
                const current = readAccount(database, id);
                if (cents(current.money) === original) continue;
                current.money = original / 100;
                database.set(`player_${id}`, current);
            } catch { restored = false; }
        }
        console.warn(`[MoneyTransfer] save failed; balancesRestored=${restored}`, error);
        notify(sender, restored ? '§c送金を保存できませんでした。時間を置いて再度お試しください。'
            : '§c送金の保存と残高の復元に失敗しました。運営へ連絡してください。');
        return false;
    }
    // A notification failure cannot cancel an already persisted transfer.
    notify(sender, { translate: 'command.sendmoney.result.sender', with: [receiverName, `${config.MoneyName} ${amount}`] });
    notify(receiver, { translate: 'command.sendmoney.result.receiver', with: [senderName, `${config.MoneyName} ${amount}`] });
    return true;
}
