import { system, type Player, type RawMessage } from '@minecraft/server';
import { normalizeLanguage } from './languages.js';

/**
 * 配布版のチャット配信。
 *
 * KaroEarth 版では外部の翻訳サーバー(@minecraft/server-net の WebSocket)へ本文を送り、
 * 受信者ごとに訳文を返していた。配布版は外部サーバーに接続しないため、
 * 呼び出し側(chat-router / server-text)とのインターフェースだけを保ち、原文をそのまま配信する。
 */

export type ChatOutput = string | RawMessage | (string | RawMessage)[];
export interface ChatRecipient {
    player: Player;
    format(text: string): ChatOutput;
    allowed?: () => boolean;
}
export interface ContentTranslation { text: string; source: string | null; sourceName?: string }

/** 翻訳設定。配布版では翻訳は常に無効。 */
export function translationSettings(player: Player) {
    let locale = '';
    try { locale = player.clientSystemInfo.locale; } catch { /* old client / API */ }
    const language = normalizeLanguage(locale);
    return { enabled: false, language: language ?? 'en', automatic: true, locale, supportedLocale: !!language };
}

/** 配布版では翻訳しない(常に null)。 */
export function requestTextTranslation(_text: string, _target: string): Promise<string | null> {
    return Promise.resolve(null);
}

/** 配布版では翻訳しない(常に null)。 */
export function requestDetailedTextTranslation(_text: string, _target: string): Promise<ContentTranslation | null> {
    return Promise.resolve(null);
}

/** 配布版では接続先が無いため何もしない。 */
export function initializeChatTranslation(_server: string, _namespace = 'makecountry'): void {}

/** 受信者1人につき原文を1通配信する(重複・退出済み・閲覧不可の受信者は除く)。 */
export function sendChatBatch(text: string, recipients: ChatRecipient[], _senderId?: string): void {
    if (!recipients.length) return;
    system.run(() => {
        const seen = new Set<string>();
        for (const recipient of recipients) {
            try {
                if (!recipient.player.isValid || seen.has(recipient.player.id)) continue;
                seen.add(recipient.player.id);
                if (recipient.allowed && !recipient.allowed()) continue;
                recipient.player.sendMessage(recipient.format(text));
            } catch { /* departed recipient */ }
        }
    });
}

/** 外部チャット(Discord 等)の重複抑止。配布版では外部チャットが無いため常に受け付ける。 */
export function claimExternalChat(_source: string, _id: unknown): boolean {
    return true;
}
