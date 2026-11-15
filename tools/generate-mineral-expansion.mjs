import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';
import { ores, materials, terrain, biomes, tools, smelting, chemical, cooking, cookware } from './lib/mineral-content.mjs';

const bp = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// リソースパックの場所 (既定: このパックと同じ親フォルダの MakeCountryResourcePack)
const rp = process.env.MAKECOUNTRY_RP ? path.resolve(process.env.MAKECOUNTRY_RP) : path.resolve(bp, '..', 'MakeCountryResourcePack');
function write(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const text = typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`;
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== text) fs.writeFileSync(file, text);
}
const json = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const terrainAtlas = json(path.join(rp, 'textures/terrain_texture.json'));
const itemAtlas = json(path.join(rp, 'textures/item_texture.json'));
const sounds = json(path.join(rp, 'blocks.json'));
const labels = new Map();
const texturePaths = {};
const allBlocks = [];
const allItems = [];
const originalTextureIds = ['tin_ore','zinc_ore','nickel_ore','chromium_ore','manganese_ore','cobalt_ore','galena_ore','silver_ore','platinum_ore','apatite_ore','potash_ore','borax_ore','mineral_slate','mineral_slate_bricks','mineral_moss','salt_crust','saltstone','saltstone_bricks','cobalt_shale','cobalt_shale_bricks','borax_crystal_block','brass_block','silver_block','cobalt_glass','cobalt_ceramic'];
const textureSeed = id => originalTextureIds.includes(id) ? originalTextureIds.indexOf(id) + 1 : [...id].reduce((hash,c) => (hash * 31 + c.charCodeAt(0)) % 65521, 0);

// Extend the pack's existing deterministic 16px pixel-art pipeline. No external
// dependencies or image service are required to regenerate these assets.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  for (let k = 0; k < 8; k++) n = (n & 1) ? (0xedb88320 ^ (n >>> 1)) : n >>> 1;
  return n >>> 0;
});
function chunk(type, data) {
  const tag = Buffer.from(type); let crc = 0xffffffff;
  for (const b of Buffer.concat([tag, data])) crc = crcTable[(crc ^ b) & 255] ^ (crc >>> 8);
  const output = Buffer.alloc(data.length + 12);
  output.writeUInt32BE(data.length); tag.copy(output, 4); data.copy(output, 8);
  output.writeUInt32BE((crc ^ 0xffffffff) >>> 0, output.length - 4);
  return output;
}
function png(file, pixel) {
  const data = Buffer.alloc(16 * 65);
  for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) {
    const color = pixel(x, y); const offset = y * 65 + 1 + x * 4;
    for (let c = 0; c < 3; c++) data[offset + c] = Math.max(0, Math.min(255, Math.round(color[c])));
    data[offset + 3] = color[3] ?? 255;
  }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(16); ihdr.writeUInt32BE(16, 4); ihdr[8] = 8; ihdr[9] = 6;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(data)), chunk('IEND', Buffer.alloc(0))]));
}
const shade = (color, delta, alpha = 255) => [...color.map(c => c + delta), alpha];
const noise = (x, y, seed) => ((x * 17 + y * 31 + x * y * 7 + seed * 13) % 23) - 11;
function tile(id, color, pattern = 'stone', seed = 0) {
  const texture = `textures/blocks/minerals/${id}`;
  png(path.join(rp, `${texture}.png`), (x, y) => {
    const n = noise(x, y, seed);
    if (pattern === 'ore') {
      const fleck = [[3,3],[10,2],[7,8],[12,11],[3,12]].find(([a,b]) => x >= a && x < a + 2 + seed % 2 && y >= b && y < b + 2);
      return fleck ? shade(color, n + (y === fleck[1] ? 22 : -15)) : shade([108,111,115], n);
    }
    if (pattern === 'bricks') return shade(color, (y % 5 === 0 || (x + (Math.floor(y / 5) % 2) * 4) % 8 === 0) ? -38 : n);
    if (pattern === 'metal') return shade(color, x === 0 || y === 0 ? 28 : x === 15 || y === 15 ? -30 : n / 2);
    if (pattern === 'crystal') return shade(color, ((x + y) % 7 < 2 ? 26 : -8) + n / 2);
    if (pattern === 'glass') return shade(color, x === 0 || y === 0 || x === 15 || y === 15 || x + y === 7 ? 36 : n / 3, 205);
    return shade(color, n + (y % 6 === 0 ? -10 : 0));
  });
  terrainAtlas.texture_data[id] = { textures: texture };
  texturePaths[`mc:${id}`] = texture;
}
function icon(id, color, kind = 'powder') {
  const texture = `textures/items/minerals/${id}`;
  png(path.join(rp, `${texture}.png`), (x, y) => {
    const n = noise(x, y, id.length);
    if (['pickaxe','hammer','sword','axe','shovel'].includes(kind)) {
      if (Math.abs(x + y - 15) <= 1 && x >= 2 && x <= 11) return shade([113,79,40], n);
      const head = kind === 'sword' ? Math.abs(x + y - 15) <= 1 && x > 8
        : kind === 'shovel' ? (x - 11) ** 2 + (y - 4) ** 2 <= 9
        : kind === 'axe' ? x >= 8 && x <= 13 && y >= 2 && y <= 7
        : y >= 2 && y <= (kind === 'hammer' ? 7 : 4) && x >= 5 && x <= 13;
      if (head) return shade(color, n + 12);
      return [0,0,0,0];
    }
    if (kind === 'ingot') {
      if (y >= 5 && y <= 11 && x >= 3 - Number(y > 7) && x <= 12 + Number(y > 7)) return shade(color, y === 5 ? 35 : y >= 10 ? -30 : n / 2);
    } else if (kind === 'can') {
      if (x >= 4 && x <= 11 && y >= 3 && y <= 13) return shade(color, x === 4 ? 25 : x === 11 ? -30 : y === 7 ? -25 : n / 2);
    } else if (kind === 'rig') {
      if (x === 8 && y >= 2 && y <= 10) return [193,173,131,255];
      if ((x - 8) ** 2 + (y - 11) ** 2 < 14) return shade(color, n);
    } else if (kind === 'raw') {
      if ((x - 7) ** 2 + (y - 8) ** 2 < 30 + noise(x,y,4)) return shade(color, n + (x + y < 15 ? 20 : -15));
    } else if (x >= 3 && x <= 12 && y >= 4 && y <= 13 && Math.abs(x - 7.5) <= 2 + (y - 4) / 2) return shade(color, n);
    return [0,0,0,0];
  });
  itemAtlas.texture_data[id] = { textures: texture };
  texturePaths[`mc:${id}`] = texture;
}
function item(id, ja, en, color, kind = 'powder', extra = {}) {
  allItems.push(`mc:${id}`); labels.set(`item.mc:${id}`, { ja, en });
  icon(id, color, kind);
  write(path.join(bp, `items/minerals/${id}.json`), { format_version: '1.21.120', 'minecraft:item': {
    description: { identifier: `mc:${id}`, menu_category: { category: 'items' } },
    components: { 'minecraft:icon': id, 'minecraft:display_name': { value: `item.mc:${id}` }, ...extra },
  } });
}
function block(id, ja, en, color, pattern = 'stone', ore = false, options = {}) {
  allBlocks.push(`mc:${id}`); labels.set(`tile.mc:${id}.name`, { ja, en });
  tile(id, color, pattern, textureSeed(id));
  const glass = pattern === 'glass';
  sounds[`mc:${id}`] = { sound: glass ? 'glass' : 'stone' };
  write(path.join(bp, `blocks/minerals/${id}.json`), { format_version: '1.20.0', 'minecraft:block': {
    description: { identifier: `mc:${id}`, menu_category: { category: 'construction' } },
    components: { 'minecraft:display_name': `tile.mc:${id}.name`, 'minecraft:destructible_by_mining': { seconds_to_destroy: ore ? 8 : 2 }, 'minecraft:destructible_by_explosion': { explosion_resistance: glass ? 1 : 6 },
      'tag:minecraft:is_pickaxe_item_destructible': {}, 'minecraft:map_color': `#${color.map(c => c.toString(16).padStart(2, '0')).join('')}`,
      'minecraft:geometry': 'minecraft:geometry.full_block', 'minecraft:material_instances': { '*': { texture: id, render_method: glass ? 'blend' : 'opaque' } },
      ...(glass ? { 'minecraft:light_dampening': 0 } : {}),
      ...(options.light ? { 'minecraft:light_emission': options.light } : {}),
      'minecraft:loot': ore ? 'loot_tables/empty.json' : `loot_tables/blocks/minerals/${id}.json`,
    },
  } });
  if (!ore) write(path.join(bp, `loot_tables/blocks/minerals/${id}.json`), { pools: [{ rolls: 1, entries: [{ type: 'item', name: `mc:${id}`, weight: 1 }] }] });
}
function craft(id, inputs, result, count = 1) {
  write(path.join(bp, `recipes/minerals/${id}.json`), { format_version: '1.20.10', 'minecraft:recipe_shapeless': { description: { identifier: `mc:${id}` }, tags: ['crafting_table'], unlock: [{ item: inputs[0].includes(':') ? inputs[0] : `mc:${inputs[0]}` }], ingredients: inputs.map(entry => ({ item: entry.includes(':') ? entry : `mc:${entry}` })), result: { item: `mc:${result}`, count } } });
}

for (const ore of ores) {
  block(`${ore.id}_ore`, ore.id === 'galena' ? ore.ja : `${ore.ja}鉱石`, `${ore.en} Ore`, ore.color, 'ore', true);
  const raw = ore.mineral ? ore.id : `raw_${ore.id}`;
  item(raw, ore.mineral ? ore.ja : `未精錬の${ore.ja}`, ore.mineral ? ore.en : `Raw ${ore.en}`, ore.color, 'raw');
  if (!ore.mineral) item(`${ore.metal ?? ore.id}_ingot`, `${ore.metalJa ?? ore.ja}インゴット`, `${ore.metalEn ?? ore.en} Ingot`, ore.color, 'ingot');
  const hostBlocks = [...new Set(biomes.flatMap(b => [b.top,b.mid]).filter(id => !id.includes(':')).map(id => `mc:${id}`))];
  write(path.join(bp, `features/${ore.id}_ore_feature.json`), { format_version: '1.20.0', 'minecraft:ore_feature': { description: { identifier: `mc:${ore.id}_ore_feature` }, count: ore.size, replace_rules: [{ places_block: `mc:${ore.id}_ore`, may_replace: ['minecraft:stone', 'minecraft:deepslate', 'minecraft:granite', 'minecraft:diorite', 'minecraft:andesite', ...hostBlocks] }] } });
  for (const regional of [false, true]) {
    const rule = `${ore.id}_ore${regional ? '_regional' : ''}_feature_rule`;
    const filter = regional ? { test: 'has_biome_tag', operator: '==', value: `mc:${ore.region}` } : { test: 'has_biome_tag', operator: '==', value: 'overworld' };
    write(path.join(bp, `feature_rules/${rule}.json`), { format_version: '1.13.0', 'minecraft:feature_rules': { description: { identifier: `mc:${rule}`, places_feature: `mc:${ore.id}_ore_feature` }, conditions: { placement_pass: 'underground_pass', 'minecraft:biome_filter': filter }, distribution: { iterations: regional ? ore.tries : Math.max(1, Math.floor(ore.tries / 2)), x: { distribution: 'uniform', extent: [0, 15] }, y: { distribution: 'uniform', extent: ore.height }, z: { distribution: 'uniform', extent: [0, 15] } } } });
  }
}
for (const [id, [ja, en, color]] of Object.entries(materials)) {
  const kind = id.includes('ingot') || id.includes('steel') || id.includes('alloy') ? 'ingot' : id.includes('can') ? 'can' : id.includes('rig') ? 'rig' : 'powder';
  const food = id === 'canned_fish' ? { 'minecraft:food': { nutrition: 8, saturation_modifier: 0.8, can_always_eat: false }, 'minecraft:use_animation': 'eat', 'minecraft:use_modifiers': { use_duration: 1.6, movement_modifier: 0.35 } } : {};
  item(id, ja, en, color, kind, food);
}
for (const [id, [ja, en, color, pattern, options]] of Object.entries(terrain)) block(id, ja, en, color, pattern, false, options);
for (const [id, tool] of Object.entries(tools)) {
  const tag = tool.kind === 'axe' ? 'minecraft:is_axe_item_destructible' : tool.kind === 'shovel' ? 'minecraft:is_shovel_item_destructible' : 'minecraft:is_pickaxe_item_destructible';
  const c = { 'minecraft:durability': { max_durability: tool.durability }, 'minecraft:max_stack_size': 1, 'minecraft:hand_equipped': true, 'mc:ranktool': {}, 'minecraft:digger': { use_efficiency: true, destroy_speeds: tool.kind === 'sword' ? [{ block: 'minecraft:cobweb', speed: 10 }] : [{ block: { tags: `q.any_tag('${tag}')` }, speed: tool.speed }] } };
  if (tool.damage) c['minecraft:damage'] = tool.damage;
  const color = materials[tool.material]?.[2] ?? ores.find(ore => `${ore.metal ?? ore.id}_ingot` === tool.material)?.color;
  if (!color) throw Error(`Unknown tool material ${tool.material}`);
  item(id, tool.ja, tool.en, color, tool.kind, c);
  const file = path.join(bp, `items/minerals/${id}.json`); const document = json(file);
  document['minecraft:item'].description.menu_category.category = 'equipment'; write(file, document);
}
for (const id of ['mineral_slate', 'saltstone', 'cobalt_shale']) craft(`${id}_bricks`, [id,id,id,id], `${id}_bricks`, 4);
craft('brass_block', Array(9).fill('brass_ingot'), 'brass_block');
craft('brass_ingots', ['brass_block'], 'brass_ingot', 9);
craft('silver_block', Array(9).fill('silver_ingot'), 'silver_block');
craft('silver_ingots', ['silver_block'], 'silver_ingot', 9);
craft('borax_crystal_block', Array(4).fill('borax'), 'borax_crystal_block');
craft('borax_crystals', ['borax_crystal_block'], 'borax', 4);
craft('cobalt_glass', ['cobalt_ingot', ...Array(8).fill('minecraft:glass')], 'cobalt_glass', 8);
craft('cobalt_ceramic', ['cobalt_ingot', ...Array(8).fill('minecraft:hardened_clay')], 'cobalt_ceramic', 8);
// Existing cooking stations gain material-based alternative recipes. They use
// the existing forms and benefits, without adding decorative fake machines.
craft('stainless_stew', ['stainless_steel','stainless_steel','stainless_steel','brass_ingot'], 'stew');
craft('stainless_cutting_board', ['stainless_steel','stainless_steel','brass_ingot','minecraft:oak_planks'], 'cutting_board');
craft('brass_fryingpan', ['brass_ingot','brass_ingot','brass_ingot','minecraft:stick'], 'fryingpan');
craft('salt_crust', ['potash','minecraft:sand'], 'salt_crust', 2);
for (const [base,result] of [['sulfur_stone','sulfur_stone_bricks'],['ochre_stone','ochre_stone_bricks'],['chalk_stone','chalk_bricks'],['jade_slate','jade_slate_bricks'],['froststone','froststone_bricks'],['graphite_schist','graphite_schist_bricks'],['serpentine_block','serpentine_bricks'],['porcelain_block','porcelain_tiles'],['gypsum_block','polished_gypsum'],['jade_block','jade_mosaic'],['garnet_block','garnet_mosaic'],['fluorite_block','fluorite_mosaic'],['bismuth_block','bismuth_tiles']]) craft(result,[base,base,base,base],result,4);
for (const [mineral,result] of [['jade','jade_block'],['garnet','garnet_block'],['fluorite','fluorite_block'],['bismuth_ingot','bismuth_block'],['fine_plaster','gypsum_block'],['porcelain_mix','porcelain_block']]) {
  craft(result,Array(4).fill(mineral),result);
  craft(`${result}_unpack`,[result],mineral,4);
}
craft('kaolin_clay',['kaolinite','kaolinite','minecraft:clay_ball'], 'kaolin_clay',2);
craft('serpentine_block',Array(4).fill('serpentine'),'serpentine_block',4);
for (const [lamp,color] of [['celestite_lamp','minecraft:light_blue_dye'],['amber_mineral_lamp','minecraft:orange_dye'],['jade_mineral_lamp','minecraft:green_dye']]) craft(lamp,['glow_pigment','borosilicate_glass','minecraft:redstone',color],lamp,4);
for (const equipment of cookware) {
  block(equipment.id,equipment.ja,equipment.en,equipment.color,'metal');
  const file = path.join(bp,`blocks/minerals/${equipment.id}.json`);
  const document = json(file); const components = document['minecraft:block'].components;
  const base = json(path.join(bp,`blocks/${equipment.base}.json`))['minecraft:block'];
  components['minecraft:geometry'] = base.components['minecraft:geometry'];
  components['minecraft:collision_box'] = base.components['minecraft:collision_box'] ?? true;
  components['minecraft:selection_box'] = base.components['minecraft:selection_box'] ?? true;
  components[`tag:${equipment.base}`] = {};
  write(file,document);
  craft(equipment.id,[...Array(4).fill(equipment.material),'brass_ingot', ...(equipment.base.includes('machine') || equipment.base === 'mixer' || equipment.base === 'oven_range' || equipment.base === 'rice_cooker' ? ['minecraft:redstone'] : ['minecraft:stick'])],equipment.id);
}
write(path.join(bp,'src/content/minerals/cookware-data.ts'),`// Generated by tools/generate-mineral-expansion.mjs.\nexport const COOKWARE = ${JSON.stringify(Object.fromEntries(cookware.map(item => [`mc:${item.id}`,{station:item.station,base:item.base,bonus:item.bonus,nameKey:`tile.mc:${item.id}.name`}])),null,2)} as const;\n`);

for (const biome of biomes) {
  const id = `mc:${biome.id}`;
  const namespaced = block => block.includes(':') ? block : `mc:${block}`;
  write(path.join(bp, `biomes/${biome.id}.json`), { format_version: '1.26.30', 'minecraft:biome': {
    description: { identifier: id }, components: {
      'minecraft:climate': { temperature: biome.temperature, downfall: biome.downfall, snow_accumulation: [0,0] },
      'minecraft:surface_builder': { builder: { type: 'minecraft:overworld', sea_floor_depth: 7, sea_floor_material: 'minecraft:gravel', foundation_material: 'minecraft:stone', mid_material: namespaced(biome.mid), top_material: namespaced(biome.top), sea_material: 'minecraft:water' } },
      'minecraft:replace_biomes': { replacements: [{ dimension: 'minecraft:overworld', targets: biome.targets.map(target => `minecraft:${target}`), amount: 0.18, noise_frequency_scale: 16 }] },
      'minecraft:tags': { tags: ['overworld','monster',id, ...biome.tags] },
    },
  } });
  labels.set(`biome.${id}.name`, { ja: biome.ja, en: biome.en });
  if (biome.landmark) {
    const feature = `${biome.id}_landmark`;
    write(path.join(bp,`features/${feature}.json`),{format_version:'1.13.0','minecraft:single_block_feature':{description:{identifier:`mc:${feature}`},places_block:`mc:${biome.landmark}`,enforce_placement_rules:true,enforce_survivability_rules:false,may_replace:['minecraft:air'],may_attach_to:{min_sides_must_attach:1,bottom:namespaced(biome.top)}}});
    write(path.join(bp,`feature_rules/${feature}.json`),{format_version:'1.13.0','minecraft:feature_rules':{description:{identifier:`mc:${feature}`,places_feature:`mc:${feature}`},conditions:{placement_pass:'after_surface_pass','minecraft:biome_filter':{test:'has_biome_tag',operator:'==',value:id}},distribution:{iterations:1,x:{distribution:'uniform',extent:[0,15]},y:'q.heightmap(v.worldx, v.worldz)',z:{distribution:'uniform',extent:[0,15]}}}});
  }
  write(path.join(rp, `biomes/${biome.id}.client_biome.json`), { format_version: '1.21.40', 'minecraft:client_biome': {
    description: { identifier: id }, components: {
      'minecraft:sky_color': { sky_color: biome.fog },
      'minecraft:water_appearance': { surface_color: biome.water },
      'minecraft:fog_appearance': { fog_identifier: id },
    },
  } });
  write(path.join(rp, `fogs/${biome.id}.json`), { format_version: '1.16.100', 'minecraft:fog_settings': {
    description: { identifier: id }, distance: {
      air: { fog_start: 0.6, fog_end: 1, fog_color: biome.fog, render_distance_type: 'render' },
      water: { fog_start: 0, fog_end: 18, fog_color: biome.water, render_distance_type: 'fixed' },
    },
  } });
}
// Crystals create visible landmarks on the moor, rather than only changing its
// grass colour. No player-built areas are rewritten by script.
write(path.join(bp, 'features/moor_crystal_feature.json'), { format_version: '1.13.0', 'minecraft:single_block_feature': { description: { identifier: 'mc:moor_crystal_feature' }, places_block: 'mc:borax_crystal_block', enforce_placement_rules: true, enforce_survivability_rules: false, may_replace: ['minecraft:air'], may_attach_to: { min_sides_must_attach: 1, bottom: 'mc:mineral_moss' } } });
write(path.join(bp, 'feature_rules/moor_crystal_feature_rule.json'), { format_version: '1.13.0', 'minecraft:feature_rules': { description: { identifier: 'mc:moor_crystal_feature_rule', places_feature: 'mc:moor_crystal_feature' }, conditions: { placement_pass: 'after_surface_pass', 'minecraft:biome_filter': { test: 'has_biome_tag', operator: '==', value: 'mc:crystal_moor' } }, distribution: { iterations: 2, x: { distribution: 'uniform', extent: [0,15] }, y: "q.heightmap(v.worldx, v.worldz)", z: { distribution: 'uniform', extent: [0,15] } } } });

for (const [file, symbol, value] of [['smelting','MineralSmeltingRecipes',smelting],['chemical','MineralChemistryRecipes',chemical],['cooking','MineralCookingRecipes',cooking]]) write(path.join(bp, `src/content/${file}/mineral-recipes.ts`), `// Generated by tools/generate-mineral-expansion.mjs.\nexport const ${symbol} = ${JSON.stringify(value, null, 2)};\n`);
write(path.join(bp, 'src/content/minerals/ore-data.ts'), `// Generated by tools/generate-mineral-expansion.mjs.\nexport const MINERAL_ORES = ${JSON.stringify(Object.fromEntries(ores.map(o => [`mc:${o.id}_ore`, { drop: `mc:${o.mineral ? o.id : `raw_${o.id}`}`, minTier: o.minTier ?? (['platinum','cobalt'].includes(o.id) ? 3 : o.id === 'tin' || o.mineral ? 1 : 2) }])), null, 2)} as const;\n`);
const toolIds = [];
for (const folder of ['items/tool', 'items/minerals']) {
  function visit(directory) {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name.endsWith('.json')) {
        const item = json(file)['minecraft:item'];
        if (item.components?.['mc:ranktool']) toolIds.push(item.description.identifier);
      }
    }
  }
  visit(path.join(bp, folder));
}
write(path.join(bp, 'src/content/minerals/tool-ids.ts'), `// Generated by tools/generate-mineral-expansion.mjs.\nexport const FORGED_TOOL_IDS: ReadonlySet<string> = new Set(${JSON.stringify(toolIds.sort(), null, 2)});\n`);
write(path.join(bp, 'src/content/minerals/texture-data.ts'), `// Generated by tools/generate-mineral-expansion.mjs.\nexport const MINERAL_TEXTURES = ${JSON.stringify(texturePaths, null, 2)};\n`);

labels.set('chemical.fertilizer.area_applied', { ja: '複合肥料を使用（成長した作物：%1株）', en: 'Compound fertilizer applied (%1 crops grown)' });
labels.set('mineral.fishing.rig_used', { ja: '深場用の仕掛けを使用：深海魚の候補が追加されました', en: 'Deepwater rig used: deep-ocean fish added to the catch pool' });
labels.set('mineral.tool.no_crafting_repair', { ja: 'クラフト修理で品質を失った道具は使用できません。鍛冶場で新しく製作してください。', en: 'Tools without forged quality cannot be used after crafting repair. Forge a new tool at the blacksmith.' });
labels.set('mineral.tool.repair_policy_hint', { ja: 'クラフト修理不可：品質を失った道具は使用できません', en: 'No crafting repair: tools that lose forged quality cannot be used' });
labels.set('cooking.equipment.bonus',{ja:'調理器具ボーナス',en:'Cookware Score Bonus'});
labels.set('cooking.equipment.unavailable',{ja:'この料理を始めた調理器具の近くに戻ってください。器具が撤去されている場合は同じ場所に戻してください。',en:'Return to the cookware where this batch was started. Replace it at the same location if it was removed.'});
labels.set('mc:minerals.construction', { ja: '鉱床の建材', en: 'Mineral Building Blocks' });
labels.set('mc:minerals.items', { ja: '鉱石・工業素材', en: 'Minerals and Industrial Materials' });
labels.set('mc:minerals.equipment', { ja: '鉱石の道具', en: 'Mineral Tools' });
for (const locale of ['en_US','en_GB','ja_JP','ko_KR','zh_CN','zh_TW']) {
  const file = path.join(rp, `texts/${locale}.lang`);
  let text = fs.readFileSync(file, 'utf8').replace(/\n*## BEGIN MINERAL EXPANSION[\s\S]*?## END MINERAL EXPANSION\n?/g, '\n').trimEnd();
  // English fallbacks keep all supported clients readable. Japanese is native.
  text += '\n\n## BEGIN MINERAL EXPANSION\n' + [...labels].map(([key, names]) => `${key}=${locale === 'ja_JP' ? names.ja : names.en}`).join('\n') + '\n## END MINERAL EXPANSION\n';
  write(file, text);
}
const catalogFile = path.join(bp, 'item_catalog/crafting_item_catalog.json');
const catalog = json(catalogFile)['minecraft:crafting_items_catalog'];
for (const [category, ids] of [['construction',allBlocks], ['items',allItems.filter(id => !tools[id.slice(3)])], ['equipment',allItems.filter(id => tools[id.slice(3)])]]) {
  let entry = catalog.categories.find(c => c.category_name === category);
  if (!entry) catalog.categories.push(entry = { category_name: category, groups: [] });
  entry.groups = entry.groups.filter(g => g.group_identifier?.name !== `mc:minerals.${category}`);
  entry.groups.push({ group_identifier: { icon: ids[0], name: `mc:minerals.${category}` }, items: ids });
}
write(catalogFile, { format_version: '1.21.60', 'minecraft:crafting_items_catalog': catalog });
write(path.join(rp, 'textures/terrain_texture.json'), terrainAtlas);
write(path.join(rp, 'textures/item_texture.json'), itemAtlas);
write(path.join(rp, 'blocks.json'), sounds);
console.log(`Mineral expansion: ${ores.length} ores, ${biomes.length} biomes, ${allBlocks.length} blocks, ${allItems.length} items; ${Object.keys(smelting).length + Object.keys(chemical).length + Object.keys(cooking).length} profession recipes.`);
