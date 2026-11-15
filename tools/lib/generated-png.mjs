import fs from 'node:fs';
import path from 'node:path';
import { decodePng } from '../../../karoearth/tools/lib/solo-png.mjs';

/** Keep losslessly optimized PNG bytes when the generated RGBA pixels match. */
export function writeGeneratedPng(file, generated) {
    const next = decodePng(generated);
    let existing;
    try {
        existing = fs.readFileSync(file);
    } catch (error) {
        if (error.code !== 'ENOENT') throw error;
    }
    if (existing) {
        let current;
        try {
            current = decodePng(existing);
        } catch {
            // A malformed or unsupported PNG must be replaced by the generator.
        }
        if (current && current.width === next.width && current.height === next.height
            && Buffer.from(current.pixels).equals(Buffer.from(next.pixels))) return false;
    }
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, generated);
    return true;
}
