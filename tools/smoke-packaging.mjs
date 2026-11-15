// Real native storage round trips in a disposable world. No production scripts,
// credentials, central services or player data are loaded into this server.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url), nbt = '/home/karoearth/bin/bedrock_leveldat.py';
const bp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = path.resolve(process.env.PACKAGING_SMOKE_SERVER || path.resolve(bp, '../..'));
const executable = path.resolve(process.env.PACKAGING_SMOKE_EXECUTABLE || path.join(server, 'bedrock_server'));
// Endstone launch scripts can cd to the production world, ignoring our cwd.
// Refuse every wrapper before creating a test world or spawning any process.
const executableFd = fs.openSync(executable, 'r');
try {
    const magic = Buffer.alloc(4);
    fs.readSync(executableFd, magic, 0, 4, 0);
    if (!magic.equals(Buffer.from([0x7f, 0x45, 0x4c, 0x46])))
        throw Error('Packaging smoke requires a native ELF binary; production launch wrappers are forbidden. Set PACKAGING_SMOKE_EXECUTABLE to a vanilla BDS binary.');
} finally { fs.closeSync(executableFd); }
const rp = path.join(server, 'development_resource_packs/MakeCountryResourcePack');
const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'makecountry-packaging-smoke-'));
const pack = path.join(directory, 'behavior_packs/packaging_smoke'), resource = path.join(directory, 'resource_packs/packaging_smoke'), world = path.join(directory, 'worlds/packaging_smoke');
const write = (file, data) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, typeof data === 'string' ? data : JSON.stringify(data)); };
const copy = (from, to) => { fs.mkdirSync(path.dirname(to), { recursive: true }); fs.cpSync(from, to, { recursive: true }); };
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
for (const name of ['data', 'definitions']) fs.symlinkSync(path.join(server, name), path.join(directory, name));
for (const name of ['behavior_packs', 'resource_packs']) {
    fs.mkdirSync(path.join(directory, name));
    for (const entry of fs.readdirSync(path.join(server, name))) fs.symlinkSync(path.join(server, name, entry), path.join(directory, name, entry));
}
write(path.join(directory, 'allowlist.json'), []);
write(path.join(directory, 'config/default/permissions.json'), { allowed_modules: ['@minecraft/server', '@minecraft/server-gametest'] });
write(path.join(directory, 'server.properties'), 'server-name=Packaging smoke\ngamemode=creative\nallow-cheats=true\nonline-mode=false\nserver-port=29383\nserver-portv6=29384\nenable-lan-visibility=false\nlevel-name=packaging_smoke\nlevel-seed=728183\nview-distance=4\ntick-distance=4\nmax-players=1\ncontent-log-file-enabled=true\n');
for (const folder of ['blocks/packaging', 'items/packaging', 'loot_tables/blocks/packaging']) copy(path.join(bp, folder), path.join(pack, folder));
// Include existing storage furniture to validate their real engine schema too.
for (const name of fs.readdirSync(path.join(bp, 'blocks/furniture/generated'))) {
    const file = path.join(bp, 'blocks/furniture/generated', name);
    if (read(file)['minecraft:block'].components['minecraft:block_entity']) copy(file, path.join(pack, 'blocks/furniture', name));
}
copy(path.join(bp, 'loot_tables/blocks/furniture'), path.join(pack, 'loot_tables/blocks/furniture'));
copy(path.join(rp, 'textures/blocks/furniture'), path.join(resource, 'textures/blocks/furniture'));
for (const name of fs.readdirSync(path.join(rp, 'models/blocks')).filter(name => name.startsWith('furniture_'))) copy(path.join(rp, 'models/blocks', name), path.join(resource, 'models/blocks', name));
const catalog = read(path.join(bp, 'item_catalog/crafting_item_catalog.json'));
catalog['minecraft:crafting_items_catalog'].categories = catalog['minecraft:crafting_items_catalog'].categories
    .map(category => ({ ...category, groups: category.groups.filter(group => ['mc:packaging', 'itemGroup.name.packaging'].includes(group.group_identifier?.name)) }))
    .filter(category => category.groups.length);
write(path.join(pack, 'item_catalog/crafting_item_catalog.json'), catalog);
for (const folder of ['textures/items/packaging', 'textures/blocks/packaging']) copy(path.join(rp, folder), path.join(resource, folder));
for (const name of fs.readdirSync(path.join(rp, 'models/blocks')).filter(name => name.startsWith('packaging_'))) copy(path.join(rp, 'models/blocks', name), path.join(resource, 'models/blocks', name));
for (const file of ['textures/item_texture.json', 'textures/terrain_texture.json', 'blocks.json']) {
    const data = read(path.join(rp, file));
    if (data.texture_data) data.texture_data = Object.fromEntries(Object.entries(data.texture_data).filter(([, entry]) => typeof entry.textures === 'string' && (entry.textures.includes('/packaging/') || entry.textures.includes('/furniture/'))));
    else for (const key of Object.keys(data)) if (key !== 'format_version' && !key.endsWith('_block') && !key.startsWith('mc:furniture_')) delete data[key];
    write(path.join(resource, file), data);
}
const bpId = crypto.randomUUID(), rpId = crypto.randomUUID();
function manifest(id, isResource) {
    return { format_version: 2, header: { name: 'Isolated Packaging Smoke', description: 'Disposable native storage validation', uuid: id, version: [1, 0, 0], min_engine_version: [1, 26, 60] },
        modules: isResource ? [{ type: 'resources', uuid: crypto.randomUUID(), version: [1, 0, 0] }] : [{ type: 'data', uuid: crypto.randomUUID(), version: [1, 0, 0] }, { type: 'script', language: 'javascript', uuid: crypto.randomUUID(), version: [1, 0, 0], entry: 'scripts/index.js' }],
        ...(!isResource ? { dependencies: [{ module_name: '@minecraft/server', version: 'beta' }, { module_name: '@minecraft/server-gametest', version: 'beta' }] } : {}) };
}
write(path.join(pack, 'manifest.json'), manifest(bpId, false)); write(path.join(resource, 'manifest.json'), manifest(rpId, true));
write(path.join(world, 'world_behavior_packs.json'), [{ pack_id: bpId, version: [1, 0, 0] }]); write(path.join(world, 'world_resource_packs.json'), [{ pack_id: rpId, version: [1, 0, 0] }]);
const stripImports = text => text.replace(/^import .*;\r?\n/gm, '');
const transferSource = ts.createSourceFile('transfer.ts', fs.readFileSync(path.join(bp, 'src/plugins/karoearth/transfer.ts'), 'utf8'), ts.ScriptTarget.Latest);
const functions = ['containerToData', 'createItemStackFromData', 'validateTransferStorage'];
const transferFunctions = transferSource.statements.filter(node => ts.isFunctionDeclaration(node) && functions.includes(node.name?.text)).map(node => node.getText(transferSource)).join('\n');
const testSource = `import { world, system, ItemStack, ItemComponentTypes, BlockTypes, EnchantmentTypes, Potions, BlockPermutation, GameMode, Direction } from '@minecraft/server';
import { register } from '@minecraft/server-gametest';
${stripImports(fs.readFileSync(path.join(bp, 'src/content/packaging/catalog.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/content/packaging/food-items.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/shared/minecraft/block-permissions.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/domain/professions/artisan-quality.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/shared/storage/utf8-chunks.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/shared/minecraft/portable-item-codec.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/domain/packaging/storage.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/domain/packaging/placement.ts'), 'utf8'))}
${stripImports(fs.readFileSync(path.join(bp, 'src/domain/packaging/restrictions.ts'), 'utf8'))}
registerPackagePlacement(() => {}, (_, error) => { throw error; });
registerStorageRestrictions();
${transferFunctions}
const assert = (condition, message) => { if (!condition) throw Error(message); };
world.afterEvents.worldLoad.subscribe(() => {
    const dimension = world.getDimension('overworld');
    dimension.runCommand('tickingarea add circle 0 80 0 1 packaging_smoke true');
    system.runTimeout(() => {
        try {
            const sword = new ItemStack('minecraft:diamond_sword'); sword.nameTag = 'Native gift'; sword.setDynamicProperty('test:quality', 9);
            sword.getComponent('enchantable').addEnchantment({ type: EnchantmentTypes.get('sharpness'), level: 3 });
            sword.getComponent('durability').damage = 17;
            let x = 0; const outbound = [];
            for (const definition of PACKAGES) {
                const shell = new ItemStack(definition.item); shell.nameTag = '包装テスト'; shell.setLore([{ translate: 'item.apple.name' }]);
                shell.setDynamicProperty(PACKAGE_SEALED, true); shell.setDynamicProperty(PACKAGE_ID, 'native-test');
                const payloadSource = definition.kind === 'food' ? new ItemStack('minecraft:cooked_beef', 32) : definition.kind === 'bottle' ? new ItemStack('minecraft:honey_bottle', 3) : sword;
                console.warn('PACKAGING_CHECK ' + JSON.stringify({package:definition.item, payload:payloadSource.typeId, lock:payloadSource.lockMode, keep:payloadSource.keepOnDeath, inventory:!!payloadSource.getComponent('minecraft:inventory'), food:!!payloadSource.getComponent('minecraft:food'), accepted:acceptsPackageItem(shell.typeId,payloadSource)}));
                const packed = withPackageContents(shell, [payloadSource]);
                assert(storedItems(packageInventory(shell)).length === 0, 'clone must detach native storage');
                const block = dimension.getBlock({ x: x++, y: 80, z: 0 }); block.setType(definition.block); writeBlockPackage(block, packed);
                const read = readBlockPackage(block), payload = packageInventory(read).getItem(0);
                assert(payload.typeId === payloadSource.typeId && payload.amount === payloadSource.amount, 'block payload count');
                if (payload.typeId === sword.typeId) {
                    assert(payload.nameTag === sword.nameTag && payload.getDynamicProperty('test:quality') === 9, 'payload metadata');
                    assert(payload.getComponent('enchantable').getEnchantment('sharpness').level === 3, 'enchantment');
                    assert(payload.getComponent('durability').damage === 17 && read.nameTag === shell.nameTag, 'damage/wrapper');
                }
                shell.setLore([{ rawtext: [{ translate: 'chemistry.lore.purity', with: ['KARON'] }] }]);
                const capacity = packageCapacity(shell);
                const full = withPackageContents(shell, Array.from({ length: capacity }, () => payloadSource));
                block.getComponent('inventory').container.clearAll(); block.setType(packageBlockId(full)); writeBlockPackage(block, full);
                assert(block.getComponent('inventory').container.size === capacity, 'ranked native block capacity');
                assert(storedItems(packageInventory(readBlockPackage(block))).length === capacity, 'full ranked contents');
                outbound.push(containerToData(readBlockPackage(block)));
                let overflow = false; try { withPackageContents(shell, Array.from({ length: capacity + 1 }, () => payloadSource)); } catch { overflow = true; }
                assert(overflow, 'rank capacity overflow rejected');
                const encoded = containerToData(read), restored = createItemStackFromData(JSON.parse(JSON.stringify(encoded)));
                assert(JSON.stringify(containerToData(restored)) === JSON.stringify(encoded), 'package transfer round trip');
                block.getComponent('inventory').container.clearAll(); block.setType('minecraft:air');
            }
            const bundle = new ItemStack('minecraft:bundle');
            const gold = new ItemStack('minecraft:gold_ingot', 23); bundle.getComponent('inventory').container.setItem(0, gold);
            const encoded = containerToData(bundle), restored = createItemStackFromData(JSON.parse(JSON.stringify(encoded)));
            assert(JSON.stringify(containerToData(restored)) === JSON.stringify(encoded), 'native bundle transfer');
            const shulker = new ItemStack('minecraft:undyed_shulker_box');
            if (!shulker.getComponent('inventory')) {
                let refused = false; try { containerToData(shulker); } catch { refused = true; }
                assert(refused, 'inaccessible shulker must not serialize as empty');
                console.warn('PACKAGING_SHULKER_UNAVAILABLE native ItemInventoryComponent missing on this BDS build');
            }
            console.warn('PACKAGING_SMOKE_PASS packages=5 ranked_capacity=true bundle_transfer=true metadata=true');
            console.warn('PACKAGING_TRANSFER_EXPORT ' + JSON.stringify(outbound));
        } catch (error) { console.error('PACKAGING_SMOKE_FAIL ' + error + '\\n' + error.stack); }
    }, 60);
});`;
write(path.join(pack, 'scripts/index.js'), ts.transpileModule(testSource, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText);
async function launch(validate) {
    return new Promise((resolve, reject) => {
        const child = spawn(executable, [], { cwd: directory, env: { ...process.env, LD_PRELOAD: '', LD_LIBRARY_PATH: server }, stdio: ['pipe', 'pipe', 'pipe'] });
        let output = '', stopped = false;
        const stop = () => { if (!stopped) { stopped = true; child.stdin.write('stop\n'); } };
        const timer = setTimeout(() => { stop(); setTimeout(() => child.kill('SIGTERM'), 5000).unref(); }, 45000);
        const receive = buffer => {
            output += buffer.toString(); fs.appendFileSync(path.join(directory, validate ? 'validation.log' : 'world-init.log'), buffer);
            if ((!validate && output.includes('Server started.')) || (validate && /PACKAGING_SMOKE_(PASS|FAIL)/.test(output))) setTimeout(stop, 250);
        };
        child.stdout.on('data', receive); child.stderr.on('data', receive); child.on('error', reject);
        child.on('exit', code => { clearTimeout(timer); if (validate && (!output.includes('PACKAGING_SMOKE_PASS') || output.includes(' ERROR]'))) reject(Error('Native validation failed; see ' + directory + '/validation.log')); else resolve(output); });
    });
}
console.log('Isolated BDS: ' + directory);
await launch(false);
// Preserve all existing typed settings; the real world is never opened here.
const { execFileSync } = require('node:child_process');
execFileSync('python3', ['-c', `import sys;sys.path.insert(0,'/home/karoearth/bin');import bedrock_leveldat as n\np=sys.argv[1];v,r,d=n.load(p);e=d.setdefault('experiments',(10,{}))[1]\nfor k in ['upcoming_creator_features','gametest','experiments_ever_used','saved_with_toggled_experiments']:e[k]=(1,1)\nn.dump(p,v,r,d)`, path.join(world, 'level.dat')]);
const output = await launch(true);
console.log(output.split('\n').filter(line => /PACKAGING_SMOKE_|Version:|ERROR/.test(line)).join('\n'));
const exported = output.match(/PACKAGING_TRANSFER_EXPORT (\[[^\r\n]*\])/);
if (!exported) throw Error('Missing outgoing package transfer fixture');
const incoming = JSON.parse(exported[1]);
const functionsEnd = testSource.indexOf('world.afterEvents.worldLoad.subscribe');
const destinationSource = testSource.slice(0, functionsEnd) + `
world.afterEvents.worldLoad.subscribe(() => {
    const dimension = world.getDimension('overworld');
    dimension.runCommand('tickingarea add circle 0 80 0 1 destination_smoke true');
    system.runTimeout(() => {
        try {
            const incoming = ${JSON.stringify(incoming)};
            let x = 0;
            for (const data of incoming) {
                const item = createItemStackFromData(data);
                assert(JSON.stringify(containerToData(item)) === JSON.stringify(data), 'different-server item metadata');
                const block = dimension.getBlock({x:x++,y:80,z:0}); block.setType(packageBlockId(item)); writeBlockPackage(block,item);
                const restored = readBlockPackage(block);
                assert(storedItems(packageInventory(restored)).length === packageCapacity(restored), 'different-server full capacity');
                assert(JSON.stringify(containerToData(restored)) === JSON.stringify(data), 'different-server placed contents');
                block.getComponent('inventory').container.clearAll(); block.setType('minecraft:air');
            }
            console.warn('PACKAGING_SMOKE_PASS destination_packages=5 full_ranked_contents=true');
        } catch (error) { console.error('PACKAGING_SMOKE_FAIL destination ' + error + '\\n' + error.stack); }
    },40);
});`;
// Start a second process with a fresh world and only the serialized handoff data.
fs.renameSync(world, world + '_source');
write(path.join(world, 'world_behavior_packs.json'), [{ pack_id: bpId, version: [1, 0, 0] }]);
write(path.join(world, 'world_resource_packs.json'), [{ pack_id: rpId, version: [1, 0, 0] }]);
write(path.join(pack, 'scripts/index.js'), '');
await launch(false);
execFileSync('python3', ['-c', `import sys;sys.path.insert(0,'/home/karoearth/bin');import bedrock_leveldat as n\np=sys.argv[1];v,r,d=n.load(p);e=d.setdefault('experiments',(10,{}))[1]\nfor k in ['upcoming_creator_features','gametest','experiments_ever_used','saved_with_toggled_experiments']:e[k]=(1,1)\nn.dump(p,v,r,d)`, path.join(world,'level.dat')]);
write(path.join(pack,'scripts/index.js'),ts.transpileModule(destinationSource,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
const destinationOutput = await launch(true);
console.log(destinationOutput.split('\n').filter(line => /PACKAGING_SMOKE_|Version:|ERROR/.test(line)).join('\n'));
// Empty GameTest structure; generated in the disposable pack, never live worlds.
execFileSync('python3', ['-c', `import sys;sys.path.insert(0,'/home/karoearth/bin');import bedrock_leveldat as n
size=[24,8,16]; count=24*8*16
root={'format_version':(3,1),'size':(9,(3,size)),'structure_world_origin':(9,(3,[0,0,0])),
'structure':(10,{'block_indices':(9,(9,[(3,[0]*count),(3,[-1]*count)])), 'entities':(9,(10,[])),
'palette':(10,{'default':(10,{'block_palette':(9,(10,[{'name':(8,'minecraft:air'),'states':(10,{}),'version':(3,18168865)}])), 'block_position_data':(10,{})})})})}
out=bytearray(b'\\x0a\\x00\\x00');n._write(out,10,root)
from pathlib import Path
p=Path(sys.argv[1]);p.parent.mkdir(parents=True,exist_ok=True);p.write_bytes(out)
`, path.join(pack, 'structures/packaging/empty.mcstructure')]);
const interaction = fs.readFileSync(path.join(bp, 'tools/packaging-interaction-fixture.ts'), 'utf8');
write(path.join(pack, 'scripts/index.js'), ts.transpileModule(testSource.slice(0, functionsEnd) + interaction, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText);
const interactionOutput = await launch(true);
console.log(interactionOutput.split('\n').filter(line => /PACKAGING_(SMOKE_|INTERACTION)|Version:|ERROR/.test(line)).join('\n'));
console.log('Full logs: ' + directory);
