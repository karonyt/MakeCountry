import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { setCustomBiomes } from './lib/bedrock-leveldat.mjs';

const args = process.argv.slice(2);
const filename = args.find(arg => !arg.startsWith('--'));
if (!filename) throw Error('Usage: node tools/enable-custom-biomes.mjs /server/worlds/world/level.dat [--write]');
const file = fs.realpathSync(filename);
const server = path.resolve(path.dirname(file), '../..');
const original = fs.readFileSync(file);
const result = setCustomBiomes(original);
if (!args.includes('--write')) {
    console.log(JSON.stringify({ file, pendingFlags: result.changed, dryRun: true }));
} else if (!result.changed.length) {
    console.log(JSON.stringify({ file, enabled: true, changed: false }));
} else {
    for (const pid of fs.readdirSync('/proc').filter(name => /^\d+$/.test(name))) {
        let executable, cwd;
        try { executable = path.basename(fs.realpathSync(`/proc/${pid}/exe`)); cwd = fs.realpathSync(`/proc/${pid}/cwd`); }
        catch { continue; }
        if (executable === 'bedrock_server' && cwd === server) throw Error(`Server is running (PID ${pid}); stop it cleanly before editing ${file}`);
    }
    if (!fs.readFileSync(file).equals(original)) throw Error('World settings changed during preparation');
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backup = `${file}.before-custom-biomes-${stamp}`;
    fs.copyFileSync(file, backup, fs.constants.COPYFILE_EXCL);
    const temporary = `${file}.custom-biomes-${process.pid}.tmp`;
    try {
        fs.writeFileSync(temporary, result.buffer, { mode: fs.statSync(file).mode });
        const fd = fs.openSync(temporary, 'r'); try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
        fs.renameSync(temporary, file);
    } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
    if (setCustomBiomes(fs.readFileSync(file)).changed.length) throw Error('Verification failed');
    console.log(JSON.stringify({ file, enabled: true, backup, originalSha256: crypto.createHash('sha256').update(original).digest('hex') }));
}
