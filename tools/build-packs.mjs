// MakeCountryLite と機能パックをビルドする。フル版は従来どおり `npm run build` (tsdown.config.js)。
//
// 使い方: node tools/build-packs.mjs [パックID ...]   (省略時はすべて)
//   環境変数 MC_VERSION でバージョンを指定できる (省略時は manifest.json のバージョン)。
// 出力: dist/<パックID>/ (manifest.json・scripts・ブロックやアイテムなどの資産)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build } from 'tsdown';
import { gameUiLocalization } from './game-ui-localization.mjs';
import { classifyAssets, splitCatalog } from './pack-assets.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const defs = JSON.parse(fs.readFileSync(path.join(root, 'packs/packs.json'), 'utf8'));
const fullManifest = JSON.parse(fs.readFileSync(path.join(root, 'manifest.json'), 'utf8'));
const version = process.env.MC_VERSION ?? fullManifest.header.version.join('.');
const versionArray = version.split('.').map(Number);
const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(defs.packs);
const norm = p => path.resolve(p).toLowerCase();

/** 機能パックで、職業パックなどのデータを使う部品を「依頼・スコアボード読み取り」版に差し替える。 */
function remoteModules(packId) {
  const map = new Map();
  for (const name of defs.packs[packId].remote) {
    const r = defs.remote[name];
    map.set(norm(path.join(root, r.replaces)), path.join(root, r.with));
  }
  return {
    name: 'makecountry-remote-modules',
    async resolveId(source, importer, options) {
      if (!map.size || !importer) return null;
      const resolved = await this.resolve(source, importer, { ...options, skipSelf: true });
      if (!resolved) return null;
      const replacement = map.get(norm(resolved.id));
      return replacement ? { id: replacement } : null;
    },
  };
}

function manifestFor(packId) {
  const def = defs.packs[packId];
  const dependencies = [
    { module_name: '@minecraft/server', version: 'beta' },
    { module_name: '@minecraft/server-ui', version: 'beta' },
    { uuid: defs.resourcePack.uuid, version: versionArray },
  ];
  if (packId === 'lite') dependencies.splice(2, 0, { module_name: '@minecraft/server-admin', version: 'beta' });
  else dependencies.push({ uuid: defs.packs.lite.header, version: versionArray });
  return {
    format_version: 2,
    header: {
      name: `${def.name} v.${version}`,
      description: def.description,
      uuid: def.header,
      version: versionArray,
      min_engine_version: fullManifest.header.min_engine_version,
    },
    modules: [{ type: 'script', language: 'javascript', entry: 'scripts/index.js', uuid: def.module, version: versionArray }],
    dependencies,
    ...(packId === 'lite' ? { capabilities: ['script_admin'] } : {}),
  };
}

function copyFile(from, to) {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

console.log(`MakeCountry packs v${version}: ${targets.join(', ')}`);
const { owner, idOwner, unassigned } = classifyAssets(root);
if (unassigned.length) throw new Error(`振り分け先のない資産があります: ${unassigned.join(', ')}`);

for (const packId of targets) {
  if (!defs.packs[packId]) throw new Error(`unknown pack: ${packId}`);
  const out = path.join(root, 'dist', packId);
  fs.rmSync(out, { recursive: true, force: true });

  await build({
    config: false,
    logLevel: 'warn',
    entry: { index: path.join(root, `src/packs/${packId}/index.ts`) },
    outDir: path.join(out, 'scripts'),
    format: 'esm',
    platform: 'neutral',
    target: 'ES2024',
    tsconfig: path.join(root, 'tsconfig.json'),
    external: /^@minecraft\/(?!vanilla-data|math)/,
    outExtensions: () => ({ js: '.js' }),
    sourcemap: false,
    dts: false,
    clean: true,
    define: {
      __MC_VERSION__: JSON.stringify(version),
      __MC_SPLIT__: 'true',
      __MC_PACK__: JSON.stringify(packId),
    },
    plugins: [remoteModules(packId), gameUiLocalization('makecountry')],
  });

  let copied = 0;
  for (const [file, pack] of owner) {
    if (pack === '*') continue;
    if (pack !== packId) continue;
    copyFile(path.join(root, file), path.join(out, file));
    copied++;
  }
  for (const [file, pack] of owner) {
    if (pack !== '*') continue;
    const part = splitCatalog(JSON.parse(fs.readFileSync(path.join(root, file), 'utf8')), packId, idOwner);
    if (part) { fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true }); fs.writeFileSync(path.join(out, file), JSON.stringify(part, null, 2)); copied++; }
  }
  for (const file of ['pack_icon.png', 'LICENSE']) if (fs.existsSync(path.join(root, file))) copyFile(path.join(root, file), path.join(out, file));
  fs.writeFileSync(path.join(out, 'manifest.json'), JSON.stringify(manifestFor(packId), null, 2) + '\n');
  const size = fs.statSync(path.join(out, 'scripts/index.js')).size;
  console.log(`  ${packId}: scripts ${(size / 1024 / 1024).toFixed(1)} MB, assets ${copied}`);
}
