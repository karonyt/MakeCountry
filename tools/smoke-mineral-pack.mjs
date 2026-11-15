// Loads just the expansion in a disposable BDS world. Never starts the real
// MakeCountry script, contacts its services, or opens the production world.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ores, biomes } from './lib/mineral-content.mjs';

const bp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = path.resolve(bp, '../..');
const rp = path.join(server, 'development_resource_packs/MakeCountryResourcePack');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'makecountry-mineral-smoke-'));
const pack = path.join(directory, 'behavior_packs/mineral_smoke');
const resource = path.join(directory, 'resource_packs/mineral_smoke');
const world = path.join(directory, 'worlds/mineral_smoke');
const ids = { bp: crypto.randomUUID(), rp: crypto.randomUUID() };
const write = (file, object) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof object === 'string' ? object : JSON.stringify(object, null, 2)); };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.cpSync(from, to, { recursive: true }); };
write(path.join(directory, 'allowlist.json'), []);
write(path.join(directory, 'config/default/permissions.json'), { allowed_modules: ['@minecraft/server'] });
for (const name of ['data','definitions']) fs.symlinkSync(path.join(server, name), path.join(directory, name));
for (const name of ['behavior_packs','resource_packs']) {
    fs.mkdirSync(path.join(directory, name));
    for (const entry of fs.readdirSync(path.join(server, name))) fs.symlinkSync(path.join(server, name, entry), path.join(directory, name, entry));
}
write(path.join(directory, 'server.properties'), 'server-name=Mineral smoke test\ngamemode=creative\nallow-cheats=true\nonline-mode=false\nserver-port=29381\nserver-portv6=29382\nenable-lan-visibility=false\nlevel-name=mineral_smoke\nlevel-seed=728183\nview-distance=4\ntick-distance=4\nmax-players=1\ncontent-log-file-enabled=true\n');
for (const folder of ['blocks/minerals','items/minerals','recipes/minerals','loot_tables/blocks/minerals','biomes']) copy(path.join(bp, folder), path.join(pack, folder));
copy(path.join(bp, 'loot_tables/empty.json'), path.join(pack, 'loot_tables/empty.json'));
for (const ore of ores) {
    copy(path.join(bp, `features/${ore.id}_ore_feature.json`), path.join(pack, `features/${ore.id}_ore_feature.json`));
    for (const regional of ['', '_regional']) copy(path.join(bp, `feature_rules/${ore.id}_ore${regional}_feature_rule.json`), path.join(pack, `feature_rules/${ore.id}_ore${regional}_feature_rule.json`));
}
for (const biome of biomes.filter(item => item.landmark)) {
    const name = `${biome.id}_landmark.json`;
    copy(path.join(bp,'features',name),path.join(pack,'features',name));
    copy(path.join(bp,'feature_rules',name),path.join(pack,'feature_rules',name));
}
copy(path.join(rp,'models/blocks'),path.join(resource,'models/blocks'));
copy(path.join(bp, 'features/moor_crystal_feature.json'), path.join(pack, 'features/moor_crystal_feature.json'));
copy(path.join(bp, 'feature_rules/moor_crystal_feature_rule.json'), path.join(pack, 'feature_rules/moor_crystal_feature_rule.json'));
for (const folder of ['textures/blocks/minerals','textures/items/minerals','biomes','fogs']) copy(path.join(rp, folder), path.join(resource, folder));
for (const filename of ['textures/terrain_texture.json','textures/item_texture.json','blocks.json']) {
    const document = read(path.join(rp, filename));
    if (document.texture_data) document.texture_data = Object.fromEntries(Object.entries(document.texture_data).filter(([,entry]) => typeof entry.textures === 'string' && entry.textures.includes('/minerals/')));
    else for (const key of Object.keys(document)) if (key !== 'format_version' && !key.startsWith('mc:')) delete document[key];
    write(path.join(resource, filename), document);
}
function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(path.join(dir, entry.name)) : [path.join(dir, entry.name)]); }
const itemIds = walk(path.join(pack, 'items')).map(file => read(file)['minecraft:item'].description.identifier);
const blockIds = walk(path.join(pack, 'blocks')).map(file => read(file)['minecraft:block'].description.identifier);
// Existing workstations are fixtures here; only new definitions are tested.
for (const file of walk(path.join(pack, 'recipes'))) {
    const recipe = read(file)['minecraft:recipe_shapeless'];
    for (const { item } of [...recipe.ingredients, recipe.result]) {
        if (!item?.startsWith('mc:') || itemIds.includes(item) || blockIds.includes(item)) continue;
        write(path.join(pack, `items/fixtures/${item.slice(3)}.json`), { format_version: '1.20.30', 'minecraft:item': { description: { identifier: item }, components: { 'minecraft:icon': { texture: 'apple' } } } });
    }
}
const manifest = (id, resource) => ({ format_version: 2, header: { name: 'Isolated Mineral Smoke', description: 'Disposable content validation', uuid: id, version: [1,0,0], min_engine_version: [1,26,30] }, modules: resource ? [{ type: 'resources', uuid: crypto.randomUUID(), version: [1,0,0] }] : [{ type: 'data', uuid: crypto.randomUUID(), version: [1,0,0] }, { type: 'script', language: 'javascript', uuid: crypto.randomUUID(), version: [1,0,0], entry: 'scripts/index.js' }], ...(!resource ? { dependencies: [{ module_name: '@minecraft/server', version: 'beta' }] } : {}) });
write(path.join(pack, 'manifest.json'), manifest(ids.bp, false));
write(path.join(resource, 'manifest.json'), manifest(ids.rp, true));
write(path.join(world, 'world_behavior_packs.json'), [{ pack_id: ids.bp, version: [1,0,0] }]);
write(path.join(world, 'world_resource_packs.json'), [{ pack_id: ids.rp, version: [1,0,0] }]);
write(path.join(pack, 'scripts/index.js'), `import { world, system, ItemStack, BlockPermutation, BiomeTypes } from '@minecraft/server';
system.beforeEvents.startup.subscribe(event => event.itemComponentRegistry.registerCustomComponent('mc:ranktool', {}));
world.afterEvents.worldLoad.subscribe(() => system.runTimeout(() => {
    try {
        for (const id of ${JSON.stringify(itemIds)}) new ItemStack(id);
        for (const id of ${JSON.stringify(blockIds)}) BlockPermutation.resolve(id);
        for (const id of ${JSON.stringify(biomes.map(b => `mc:${b.id}`))}) if (!BiomeTypes.get(id)) throw Error('Biome not registered: ' + id);
        console.warn('MINERAL_SMOKE_PASS items=${itemIds.length} blocks=${blockIds.length} biomes=${biomes.length}');
    } catch (error) { console.error('MINERAL_SMOKE_FAIL ' + error); }
}, 20));
`);

async function launch(validate) {
    return new Promise((resolve, reject) => {
        const child = spawn(path.join(server, 'bedrock_server'), [], { cwd: directory, env: { ...process.env, LD_LIBRARY_PATH: `${server}${process.env.LD_LIBRARY_PATH ? ':' + process.env.LD_LIBRARY_PATH : ''}` }, stdio: ['pipe','pipe','pipe'] });
        let output = ''; let stopped = false;
        const stop = () => { if (!stopped) { stopped = true; child.stdin.write('stop\n'); } };
        const timeout = setTimeout(() => { stop(); setTimeout(() => child.kill('SIGKILL'), 5000).unref(); }, 45000);
        const receive = buffer => {
            const text = buffer.toString(); output += text;
            fs.appendFileSync(path.join(directory, validate ? 'validation.log' : 'world-init.log'), text);
            if (!validate && output.includes('Server started.')) setTimeout(stop, 1000);
            if (validate && /MINERAL_SMOKE_(PASS|FAIL)/.test(output)) setTimeout(stop, 1000);
        };
        child.stdout.on('data', receive); child.stderr.on('data', receive);
        child.on('error', reject);
        child.on('exit', code => {
            clearTimeout(timeout);
            if (validate && (!output.includes('MINERAL_SMOKE_PASS') || output.includes(' ERROR]'))) reject(new Error(`BDS validation failed (${code}). See ${directory}/validation.log`));
            else resolve(output);
        });
    });
}
console.log(`Isolated BDS directory: ${directory}`);
await launch(false);
// NBT is little endian. Locate top-level entries without decoding their data,
// preserving all unrelated world settings byte-for-byte in this TEMP world.
const levelFile = path.join(world, 'level.dat');
const buffer = fs.readFileSync(levelFile);
function stringAt(position) { const length = buffer.readUInt16LE(position); return { value: buffer.toString('utf8', position + 2, position + 2 + length), end: position + 2 + length }; }
function skip(type, position) {
    if (type >= 1 && type <= 6) return position + [0,1,2,4,8,4,8][type];
    if (type === 8) return stringAt(position).end;
    if ([7,11,12].includes(type)) return position + 4 + buffer.readInt32LE(position) * ({7:1,11:4,12:8}[type]);
    if (type === 9) { const subtype = buffer[position++]; const count = buffer.readInt32LE(position); position += 4; for (let i = 0; i < count; i++) position = skip(subtype, position); return position; }
    if (type === 10) { while (buffer[position]) { const subtype = buffer[position++]; position = skip(subtype, stringAt(position).end); } return position + 1; }
    throw Error(`Unknown NBT type ${type}`);
}
const nbtString = value => { const text = Buffer.from(value); const length = Buffer.alloc(2); length.writeUInt16LE(text.length); return Buffer.concat([length,text]); };
let position = stringAt(9).end; let previous;
while (buffer[position]) {
    const start = position; const type = buffer[position++]; const name = stringAt(position); position = skip(type, name.end);
    if (name.value === 'experiments') previous = { start, end: position };
}
const experiments = Buffer.concat([Buffer.from([10]),nbtString('experiments'), ...['data_driven_biomes','gametest','experiments_ever_used','saved_with_toggled_experiments'].map(key => Buffer.concat([Buffer.from([1]),nbtString(key),Buffer.from([1])])), Buffer.from([0])]);
const changed = previous ? Buffer.concat([buffer.subarray(0,previous.start), experiments, buffer.subarray(previous.end)]) : Buffer.concat([buffer.subarray(0,position),experiments,buffer.subarray(position)]);
changed.writeUInt32LE(changed.length - 8, 4); fs.writeFileSync(levelFile, changed);
const output = await launch(true);
console.log(output.split('\n').filter(line => /MINERAL_SMOKE_|Version:|\[(?:.*error.*|.*warning.*)\]/i.test(line)).join('\n'));
console.log(`Full logs retained in ${directory}`);
