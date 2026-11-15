import entries from './catalog/artisan-text.js';
import base, { locales } from './catalog/primitive-text.js';
import { getPrimitiveLocale } from './primitive-text.js';
const rows = new Map([...base, ...entries].map(([key, ...values]) => [key, values]));
const exact = new Map([...base, ...entries].filter(row => !/%(?:[0-9]+|s)/.test(row[1])).map(row => [row[1], row[0]]));
const cache = new Map();
/** Resolve fixed UI text; substitutions remain literal and never modify stored data. */
export function artisanText(viewer, key, parameters = []) {
    const row = rows.get(key);
    if (!row) return key;
    const index = locales.indexOf(getPrimitiveLocale(viewer));
    const signature = JSON.stringify([index, key, parameters]);
    if (cache.has(signature)) return cache.get(signature);
    let sequential = 0;
    const result = row[index].replace(/%%|%(?:(\d+)(?:\$s)?|s)/g, (match, number) => {
        if (match === '%%') return '%';
        const position = number ? Number(number) - 1 : sequential++;
        if (position >= parameters.length) throw Error('Missing artisan UI parameter: ' + key);
        return String(parameters[position] ?? '');
    });
    cache.set(signature, result);
    if (cache.size > 512) cache.delete(cache.keys().next().value);
    return result;
}
/** Only authored catalog values are passed here; player names and custom text stay literal. */
export function artisanKnown(viewer, value) {
    const key = exact.get(value);
    return key ? artisanText(viewer, key) : value;
}
export function artisanTextCacheSize() { return cache.size; }
