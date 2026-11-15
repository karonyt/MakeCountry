// ビヘイビアパックの JSON 資産 (アイテム・ブロック・レシピなど) を、Lite と機能パックに振り分ける。
// 使い方: import { classifyAssets } from './pack-assets.mjs'; const { owner, unassigned } = classifyAssets(packRoot);
import fs from 'node:fs';
import path from 'node:path';

export const PACK_IDS = ['lite', 'jobs', 'cooking', 'industry', 'fishing', 'deco', 'life'];
export const ASSET_DIRS = ['items', 'blocks', 'recipes', 'loot_tables', 'features', 'feature_rules', 'biomes', 'entities', 'item_catalog'];

const COOKING_STATIONS = /^(?:(?:red|blue|green|white)_)?(?:cutting_board|deep_stew|fermentation_machine|fryingpan|fry_stew|iron_board|mixer|oven_range|rice_cooker|shaved_ice_machine|steamer|stew)$/;

/** アイテムのフォルダ (items/ 直下の名前) → パック */
const ITEM_FOLDERS = {
  alcohol: 'cooking', drink: 'cooking', food: 'cooking', ice: 'cooking', materials: 'cooking',
  karaage: 'cooking', osechi: 'cooking', cooked_rice_vinegared: 'cooking', dirty_plate: 'cooking', plate: 'cooking',
  rice: 'cooking', rice_bin: 'cooking', rice_plant: 'cooking', rice_seed: 'cooking', sunny_side_up_eggs: 'cooking', xmas_chicken: 'cooking',
  chemical: 'industry', metal: 'industry', minerals: 'industry', packaging: 'industry', tool: 'industry',
  fish: 'fishing',
  armor: 'deco',
  backpack: 'life', penname_before: 'life', penname_after: 'life',
  smartphone: 'lite',
};

/** ブロックのフォルダ・ファイル名 (blocks/ 直下の名前) → パック */
function blockFolderPack(name) {
  if (COOKING_STATIONS.test(name) || name === 'crop' || name === 'crop_blocks' || name.endsWith('_crop')) return 'cooking';
  if (['blacksmith', 'chemical_lab', 'minerals', 'ore', 'compressed', 'packaging'].includes(name)) return 'industry';
  if (name === 'furniture' || name === 'furniture_crafting_table' || name.startsWith('neon_light_')) return 'deco';
  if (name === 'shop_block') return 'lite';
  return undefined;
}

/** 地形生成 (features / feature_rules) の名前 → パック */
function featurePack(name) {
  if (/_plant_feature(?:_rule)?$/.test(name)) return 'cooking';
  if (/(?:_ore_(?:regional_)?feature(?:_rule)?|_landmark|moor_crystal_feature(?:_rule)?|^oil_feature(?:_rule)?|^lime_stone_feature(?:_rule)?)$/.test(name)) return 'industry';
  return undefined;
}

const walk = d => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const rel = (root, f) => path.relative(root, f).split(path.sep).join('/');
const readJson = f => JSON.parse(fs.readFileSync(f, 'utf8').replace(/^﻿/, ''));

/**
 * @returns {{ owner: Map<string,string>, idOwner: Map<string,string>, unassigned: string[] }}
 *   owner: 資産ファイル (packRoot からの相対パス) → パック ID
 *   idOwner: アイテム/ブロックの identifier → パック ID
 */
export function classifyAssets(packRoot) {
  const owner = new Map();
  const idOwner = new Map();
  const unassigned = [];

  // 1. アイテム・ブロック・バイオーム・エンティティ: フォルダで決める
  for (const dir of ['items', 'blocks', 'biomes', 'entities']) {
    for (const file of walk(path.join(packRoot, dir)).filter(f => f.endsWith('.json'))) {
      const r = rel(packRoot, file);
      const top = r.split('/')[1].replace(/\.json$/, '');
      let pack;
      if (dir === 'items') pack = ITEM_FOLDERS[top];
      else if (dir === 'blocks') pack = blockFolderPack(top);
      else if (dir === 'biomes') pack = 'industry';
      else pack = 'lite';
      if (!pack) { unassigned.push(r); continue; }
      owner.set(r, pack);
      const text = fs.readFileSync(file, 'utf8');
      const id = text.match(/"identifier"\s*:\s*"([^"]+)"/)?.[1];
      if (id) idOwner.set(id, pack);
    }
  }

  // 2. レシピ: 作られるもの (なければ材料) の持ち主に合わせる
  for (const file of walk(path.join(packRoot, 'recipes')).filter(f => f.endsWith('.json'))) {
    const r = rel(packRoot, file);
    const text = fs.readFileSync(file, 'utf8');
    const result = [...text.matchAll(/"result"\s*:\s*(?:\[\s*)?\{[^}]*?"item"\s*:\s*"([^"]+)"/g)].map(m => m[1])
      .concat([...text.matchAll(/"result"\s*:\s*"([^"]+)"/g)].map(m => m[1]));
    const all = [...text.matchAll(/"(mc:[a-z0-9_]+)"/g)].map(m => m[1]);
    let pack = [...result, ...all].map(id => idOwner.get(id)).find(Boolean);
    if (!pack && r.startsWith('recipes/vanilla')) pack = 'cooking';
    owner.set(r, pack ?? 'lite');
  }

  // 3. ルートテーブル: blocks/<名前> はブロックの持ち主、それ以外は Lite
  const blockByName = new Map([...idOwner].filter(([id]) => id.startsWith('mc:')).map(([id, pack]) => [id.slice(3), pack]));
  for (const file of walk(path.join(packRoot, 'loot_tables')).filter(f => f.endsWith('.json'))) {
    const r = rel(packRoot, file);
    const name = path.basename(r, '.json');
    let pack = r.startsWith('loot_tables/blocks/') ? blockByName.get(name) : undefined;
    if (!pack) {
      const text = fs.readFileSync(file, 'utf8');
      pack = [...text.matchAll(/"(mc:[a-z0-9_]+)"/g)].map(m => idOwner.get(m[1])).find(Boolean);
    }
    owner.set(r, pack ?? 'lite');
  }

  // 4. 地形生成
  for (const dir of ['features', 'feature_rules']) {
    for (const file of walk(path.join(packRoot, dir)).filter(f => f.endsWith('.json'))) {
      const r = rel(packRoot, file);
      const pack = featurePack(path.basename(r, '.json'));
      if (pack) owner.set(r, pack); else unassigned.push(r);
    }
  }

  // 5. クリエイティブ/レシピ本のカタログは build-packs.mjs がパックごとに分割する
  for (const file of walk(path.join(packRoot, 'item_catalog')).filter(f => f.endsWith('.json'))) owner.set(rel(packRoot, file), '*');

  return { owner, idOwner, unassigned };
}

/** カタログ (crafting_items_catalog) から、指定パックのアイテムだけを残したものを作る。空なら undefined。 */
export function splitCatalog(catalog, pack, idOwner) {
  const doc = structuredClone(catalog);
  const root = doc['minecraft:crafting_items_catalog'];
  let kept = 0;
  for (const category of root.categories ?? []) {
    category.groups = (category.groups ?? []).map(group => {
      group.items = (group.items ?? []).filter(item => {
        const id = typeof item === 'string' ? item : item.name;
        return (idOwner.get(id) ?? 'lite') === pack;
      });
      kept += group.items.length;
      return group;
    }).filter(group => group.items.length > 0);
  }
  root.categories = (root.categories ?? []).filter(category => category.groups.length > 0);
  return kept ? doc : undefined;
}

export { readJson };
