/** Dynamic-property strings are limited by UTF-8 bytes, not UTF-16 units. */
export function splitUtf8(text: string, maximumBytes: number): string[] {
    if (typeof text !== 'string') throw new TypeError('invalid_utf8_text');
    if (!Number.isSafeInteger(maximumBytes) || maximumBytes < 1) throw new RangeError('invalid_utf8_chunk_size');
    if (text.length === 0) return [];
    const chunks: string[] = [];
    // Most stored JSON is ASCII; retain the inexpensive existing split there.
    if (!/[^\x00-\x7f]/.test(text)) {
        for (let offset = 0; offset < text.length; offset += maximumBytes) chunks.push(text.slice(offset, offset + maximumBytes));
        return chunks;
    }
    let start = 0, offset = 0, bytes = 0;
    for (const character of text) {
        const point = character.codePointAt(0)!;
        const width = point <= 0x7f ? 1 : point <= 0x7ff ? 2 : point <= 0xffff ? 3 : 4;
        if (width > maximumBytes) throw new RangeError('utf8_character_exceeds_chunk_size');
        if (bytes + width > maximumBytes) {
            chunks.push(text.slice(start, offset));
            start = offset;
            bytes = 0;
        }
        bytes += width;
        offset += character.length;
    }
    chunks.push(text.slice(start));
    return chunks;
}
