import type { Player, RawMessage } from "@minecraft/server";
import { requestTextTranslation } from "@/domain/chat/translation/index.js";
import { normalizeLanguage } from "@/domain/chat/translation/languages.js";
import { literal } from "../../../localization/ui-makecountry.js";
import { serverTextKeys } from "./server-text-keys.js";

const JAPANESE = /[\u3041-\u30ff\u3400-\u9fff]/u;
const PROTECTED = /⟦[^⟧]*⟧|§.|`[^`\r\n]+`|https?:\/\/[^\s<>"'「」『』（）()。！？]+|\/[A-Za-z][\w:-]*|(?<!\w)@[pares]\b|\b[A-Za-z][\w.-]*:[a-z_][\w./-]*|[+−-]?[0-9０-９]+(?:[.,:×][0-9０-９]+)*/gu;
const MARKER = /⟦(\d+)⟧/g;
const CACHE_LIMIT = 512;
const CACHE_MS = 30 * 60_000;
const QUEUE_LIMIT = 24;
const QUEUE_WAIT_MS = 8_000;
const CONCURRENCY = 2;
const LINE_LIMIT = 450;

interface TranslationTask {
    text: string;
    target: string;
    expires: number;
    resolve(value: string | null): void;
}

let active = 0;
const queue: TranslationTask[] = [];
const inFlight = new Map<string, Promise<string | null>>();
const cache = new Map<string, { text: string; expires: number }>();

export function coreUiText(key: string, ...args: (RawMessage | string | number)[]): RawMessage {
    const translate = `game.ui.core_text.${key}`;
    if (!args.length) return { translate };
    return { translate, with: { rawtext: args.map(arg => typeof arg === "object" ? arg : { text: String(arg) }) } };
}

function pump(): void {
    while (active < CONCURRENCY && queue.length) {
        const task = queue.shift()!;
        if (task.expires <= Date.now()) {
            task.resolve(null);
            continue;
        }
        active++;
        void requestTextTranslation(task.text, task.target).then(task.resolve, () => task.resolve(null)).finally(() => {
            active--;
            pump();
        });
    }
}

function translatePart(text: string, target: string): Promise<string | null> {
    if (!JAPANESE.test(text)) return Promise.resolve(text);
    const key = `${target}\0${text}`;
    const saved = cache.get(key);
    if (saved && saved.expires > Date.now()) return Promise.resolve(saved.text);
    const pending = inFlight.get(key);
    if (pending) return pending;
    if (queue.length >= QUEUE_LIMIT) return Promise.resolve(null);

    const request = new Promise<string | null>(resolve => {
        queue.push({ text, target, expires: Date.now() + QUEUE_WAIT_MS, resolve });
        pump();
    }).then(translated => {
        if (!translated) return null;
        const output = translated.replace(/⟦\s*([0-9]+)\s*⟧/g, "⟦$1⟧");
        const markers = (value: string) => (value.match(MARKER) ?? []).sort().join(",");
        if (markers(text) !== markers(output) || /[0-9０-９]/u.test(output.replace(MARKER, ""))) return null;
        cache.delete(key);
        cache.set(key, { text: output, expires: Date.now() + CACHE_MS });
        if (cache.size > CACHE_LIMIT) cache.delete(cache.keys().next().value!);
        return output;
    }).finally(() => inFlight.delete(key));
    inFlight.set(key, request);
    return request;
}

function splitLine(text: string): string[] {
    if (text.length <= LINE_LIMIT) return [text];
    const parts: string[] = [];
    let start = 0;
    let boundary = 0;
    for (const token of text.matchAll(/⟦\d+⟧|./gu)) {
        const end = token.index + token[0].length;
        if (end - start > LINE_LIMIT) {
            const cut = boundary - start >= LINE_LIMIT / 2 ? boundary : token.index;
            parts.push(text.slice(start, cut));
            start = cut;
        }
        if (/[。！？\s]/u.test(token[0])) boundary = end;
    }
    parts.push(text.slice(start));
    return parts;
}

async function translateLine(line: string, target: string): Promise<string> {
    if (!JAPANESE.test(line)) return line;
    const values: string[] = [];
    const masked = line.replace(PROTECTED, token => `⟦${values.push(token)}⟧`);
    const translated = await Promise.all(splitLine(masked).map(part => translatePart(part, target)));
    if (translated.some(part => part === null)) return line;
    const separator = target.startsWith("zh-") ? "" : " ";
    return translated.join(separator).replace(MARKER, (_, index) => values[Number(index) - 1]);
}

/** Core の原文を表示用に変換する。端末の言語を使い、チャット翻訳の設定とは独立。 */
export function localizeServerText(player: Player, texts: readonly string[]): Promise<RawMessage[]> {
    let target: string | null = null;
    try { target = normalizeLanguage(player.clientSystemInfo.locale); } catch { /* client left */ }
    const language = target;
    return Promise.all(texts.map(async text => {
        const key = serverTextKeys.get(text);
        if (key) return coreUiText(key);
        if (!language || language === "ja" || !JAPANESE.test(text)) return literal(text);
        const lines = await Promise.all(text.split(/\r?\n/).map(line => translateLine(line, language)));
        return literal(lines.join("\n"));
    }));
}
