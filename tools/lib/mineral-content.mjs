import { extraOres, extraMaterials, extraTerrain, extraBiomes, extraTools, extraForge, extraChemistry, cookware } from './mineral-wave2.mjs';
export { cookware };
// Gameplay values are intentionally simplified; these are game recipes, not
// real chemical procedures. Keep raw materials, recipes and worldgen together.
export const ores = [
  { id: 'tin', ja: '錫', en: 'Tin', color: [177, 201, 195], height: [8, 96], size: 8, tries: 6, level: 2, region: 'mineral_highlands' },
  { id: 'zinc', ja: '亜鉛', en: 'Zinc', color: [177, 192, 160], height: [-16, 80], size: 7, tries: 5, level: 3, region: 'mineral_highlands' },
  { id: 'nickel', ja: 'ニッケル', en: 'Nickel', color: [170, 186, 122], height: [-48, 32], size: 6, tries: 4, level: 10, region: 'mineral_highlands' },
  { id: 'chromium', ja: 'クロム', en: 'Chromium', color: [109, 154, 132], height: [-48, 24], size: 5, tries: 4, level: 12, region: 'mineral_highlands' },
  { id: 'manganese', ja: 'マンガン', en: 'Manganese', color: [151, 104, 147], height: [-32, 48], size: 6, tries: 4, level: 8, region: 'mineral_highlands' },
  { id: 'cobalt', ja: 'コバルト', en: 'Cobalt', color: [65, 105, 209], height: [-56, 16], size: 5, tries: 3, level: 14, region: 'mineral_highlands' },
  { id: 'galena', metal: 'lead', ja: '方鉛鉱', en: 'Galena', metalJa: '鉛', metalEn: 'Lead', color: [106, 108, 145], height: [-24, 56], size: 7, tries: 5, level: 4, region: 'crystal_moor' },
  { id: 'silver', ja: '銀', en: 'Silver', color: [220, 230, 241], height: [-48, 32], size: 5, tries: 3, level: 16, region: 'crystal_moor' },
  { id: 'platinum', ja: '白金', en: 'Platinum', color: [183, 213, 235], height: [-60, -16], size: 3, tries: 2, level: 24, region: 'mineral_highlands' },
  { id: 'apatite', ja: '燐灰石', en: 'Apatite', color: [101, 204, 173], height: [0, 80], size: 8, tries: 6, level: 5, region: 'crystal_moor', mineral: true },
  { id: 'potash', ja: 'カリ岩塩', en: 'Potash', color: [221, 146, 144], height: [8, 72], size: 9, tries: 6, level: 5, region: 'salt_flats', mineral: true },
  { id: 'borax', ja: 'ホウ砂', en: 'Borax', color: [222, 215, 169], height: [0, 64], size: 7, tries: 5, level: 6, region: 'salt_flats', mineral: true },
  ...extraOres,
];

export const materials = {
  bronze_ingot: ['青銅インゴット', 'Bronze Ingot', [189, 123, 61]],
  brass_ingot: ['真鍮インゴット', 'Brass Ingot', [213, 178, 77]],
  nickel_alloy: ['ニッケル合金', 'Nickel Alloy', [174, 187, 152]],
  stainless_steel: ['ステンレス鋼', 'Stainless Steel', [190, 209, 217]],
  manganese_steel: ['マンガン鋼', 'Manganese Steel', [136, 115, 147]],
  silver_catalyst: ['銀触媒', 'Silver Catalyst', [218, 231, 240]],
  platinum_catalyst: ['白金触媒', 'Platinum Catalyst', [174, 213, 229]],
  borax_flux: ['ホウ砂融剤', 'Borax Flux', [226, 217, 154]],
  borosilicate_glass: ['耐熱ガラス', 'Borosilicate Glass', [154, 208, 203]],
  phosphate_fertilizer: ['リン酸肥料', 'Phosphate Fertilizer', [137, 207, 161]],
  potassium_fertilizer: ['カリ肥料', 'Potassium Fertilizer', [213, 154, 157]],
  compound_fertilizer: ['複合肥料', 'Compound Fertilizer', [219, 182, 97]],
  deep_fishing_rig: ['深場用の仕掛け', 'Deepwater Fishing Rig', [123, 124, 156]],
  tin_can: ['缶詰容器', 'Tin Can', [181, 197, 190]],
  canned_fish: ['魚の缶詰', 'Canned Fish', [178, 188, 160]],
  ...extraMaterials,
};

export const terrain = {
  mineral_slate: ['鉱床スレート', 'Mineral Slate', [94, 108, 120]],
  mineral_slate_bricks: ['鉱床スレートレンガ', 'Mineral Slate Bricks', [94, 108, 120], 'bricks'],
  mineral_moss: ['鉱床の苔石', 'Mineral Moss', [93, 139, 119]],
  salt_crust: ['塩の地殻', 'Salt Crust', [232, 222, 200]],
  saltstone: ['塩岩', 'Saltstone', [194, 169, 152]],
  saltstone_bricks: ['塩岩レンガ', 'Saltstone Bricks', [194, 169, 152], 'bricks'],
  cobalt_shale: ['青色頁岩', 'Cobalt Shale', [73, 99, 139]],
  cobalt_shale_bricks: ['青色頁岩レンガ', 'Cobalt Shale Bricks', [73, 99, 139], 'bricks'],
  borax_crystal_block: ['ホウ砂結晶ブロック', 'Borax Crystal Block', [219, 214, 173], 'crystal'],
  brass_block: ['真鍮ブロック', 'Brass Block', [203, 167, 71], 'metal'],
  silver_block: ['銀ブロック', 'Silver Block', [206, 221, 230], 'metal'],
  cobalt_glass: ['コバルトガラス', 'Cobalt Glass', [48, 86, 184], 'glass'],
  cobalt_ceramic: ['コバルト陶板', 'Cobalt Ceramic', [55, 92, 172], 'bricks'],
  ...extraTerrain,
};

export const biomes = [
  { id: 'mineral_highlands', ja: '鉱床高地', en: 'Mineral Highlands', targets: ['extreme_hills', 'stony_peaks'], top: 'mineral_slate', mid: 'cobalt_shale', tags: ['mountain', 'extreme_hills', 'stone'], temperature: 0.3, downfall: 0.3, fog: '#a3b6c3', water: '#537b9b', grass: '#819d8b' },
  { id: 'salt_flats', ja: '塩原', en: 'Salt Flats', targets: ['desert', 'savanna'], top: 'salt_crust', mid: 'saltstone', tags: ['desert', 'warm', 'dry'], temperature: 1.8, downfall: 0, fog: '#e6d9c6', water: '#79b5bd', grass: '#baa77e' },
  { id: 'crystal_moor', ja: '結晶の原野', en: 'Crystal Moor', targets: ['plains', 'birch_forest'], top: 'mineral_moss', mid: 'minecraft:dirt', tags: ['plains', 'animal', 'moist'], temperature: 0.6, downfall: 0.7, fog: '#a5c8c1', water: '#4e9caa', grass: '#74a398' },
  ...extraBiomes,
];

export const tools = {
  bronze_pickaxe: { ja: '青銅のツルハシ', en: 'Bronze Pickaxe', material: 'bronze_ingot', durability: 650, speed: 6, kind: 'pickaxe' },
  bronze_sword: { ja: '青銅の剣', en: 'Bronze Sword', material: 'bronze_ingot', durability: 650, damage: 5, kind: 'sword' },
  nickel_pickaxe: { ja: 'ニッケル合金のツルハシ', en: 'Nickel Alloy Pickaxe', material: 'nickel_alloy', durability: 3800, speed: 10, kind: 'pickaxe' },
  manganese_hammer: { ja: 'マンガン鋼のハンマー', en: 'Manganese Steel Hammer', material: 'manganese_steel', durability: 2600, speed: 14, kind: 'hammer' },
  ...extraTools,
};

const mc = id => id.includes(':') ? id : `mc:${id}`;
const ingredients = entries => Object.fromEntries(entries.map(([id, count]) => [id.includes(':') ? id : mc(id), count]));
export const smelting = {};
function forge(id, result, level, inputs, count = 1, additives = { 'mc:borax_flux': 3 }) {
  smelting[id] = { name: mc(result), result: { id: mc(result), count }, requiredLevel: level, baseActions: 18 + Math.min(level, 20), needTemperature: [1000 + level * 15, 1300 + level * 15], ingredients: ingredients(inputs), additives, maxAdditives: 2, baseMoney: level * 5, baseXp: level * 3 };
}
for (const ore of ores.filter(o => !o.mineral)) {
  forge(`${ore.metal ?? ore.id}_ingot`, `${ore.metal ?? ore.id}_ingot`, ore.level, [[`raw_${ore.id}`, 3], ['minecraft:coal', 1]], 2);
}
forge('bronze_ingot', 'bronze_ingot', 4, [['tin_ingot', 1], ['minecraft:copper_ingot', 3]], 4);
forge('brass_ingot', 'brass_ingot', 5, [['zinc_ingot', 1], ['minecraft:copper_ingot', 2]], 3);
forge('nickel_alloy', 'nickel_alloy', 13, [['nickel_ingot', 2], ['iron_alloy', 2], ['borax_flux', 1]], 3);
forge('stainless_steel', 'stainless_steel', 16, [['chromium_ingot', 1], ['nickel_ingot', 1], ['iron_alloy', 3]], 4);
forge('manganese_steel', 'manganese_steel', 12, [['manganese_ingot', 1], ['iron_alloy', 3], ['borax_flux', 1]], 3);
forge('borosilicate_glass', 'borosilicate_glass', 9, [['minecraft:glass', 3], ['borax_flux', 1]], 4);
forge('tin_can', 'tin_can', 4, [['tin_ingot', 1], ['minecraft:iron_nugget', 2]], 8);
forge('deep_fishing_rig', 'deep_fishing_rig', 7, [['lead_ingot', 1], ['minecraft:string', 2], ['minecraft:iron_nugget', 1]], 8);
for (const [id, tool] of Object.entries(tools)) {
  forge(id, id, tool.level ?? (id.startsWith('bronze') ? 6 : 16), [[tool.material, tool.kind === 'hammer' ? 4 : tool.kind === 'shovel' ? 1 : 3], ['minecraft:stick', 2]], 1, { 'mc:cobalt_ingot': 5, 'mc:borax_flux': 3, 'mc:garnet_abrasive': 4 });
}
forge('heatproof_beaker', 'beaker', 10, [['borosilicate_glass', 2]], 3);
forge('heatproof_flask', 'flask', 12, [['borosilicate_glass', 3]], 3);
for (const recipe of extraForge) forge(...recipe);

export const chemical = {};
function chemistry(id, result, level, inputs, count = 1, type = 'decomposition') {
  chemical[id] = { name: mc(result), result: { id: mc(result), count }, reactionType: type, requiredLevel: level, baseActions: 12 + Math.min(level, 16), ingredients: ingredients(inputs), catalysts: Object.fromEntries([['mc:silver_catalyst', 3], ['mc:platinum_catalyst', 5]].filter(([catalyst]) => catalyst !== mc(result))) /* a catalyst never lists itself */, maxCatalysts: 1, optimalTemperature: [80, 120], ...(['neutralization','precipitation'].includes(type) ? { targetPH: 7 } : {}), baseMoney: level * 5, baseXp: level * 3 };
}
chemistry('borax_flux', 'borax_flux', 6, [['borax', 2], ['lime_powder', 1]], 4);
chemistry('silver_catalyst', 'silver_catalyst', 16, [['silver_ingot', 1], ['minecraft:quartz', 2]], 6);
chemistry('platinum_catalyst', 'platinum_catalyst', 24, [['platinum_ingot', 1], ['borosilicate_glass', 1]], 8);
chemistry('phosphate_fertilizer', 'phosphate_fertilizer', 10, [['apatite', 2], ['sulfuric_acid', 1]], 4, 'neutralization');
chemistry('potassium_fertilizer', 'potassium_fertilizer', 6, [['potash', 2], ['water_beaker', 1]], 4);
chemistry('compound_fertilizer', 'compound_fertilizer', 14, [['phosphate_fertilizer', 2], ['potassium_fertilizer', 2], ['ammonium_sulfate', 2]], 4, 'neutralization');
chemistry('potash_nitrate', 'potassium_nitrate', 12, [['potash', 2], ['nitrogen_gas', 1], ['oxygen_gas', 3]], 2, 'neutralization');
chemistry('silver_ammonia', 'ammonia', 38, [['nitrogen_gas', 3], ['hydrogen_gas', 9], ['silver_catalyst', 1]], 16, 'reduction');
chemical.silver_ammonia.optimalTemperature = [400, 500];
chemistry('platinum_polymer', 'polyethylene_pellet', 26, [['ethylene', 4], ['platinum_catalyst', 1]], 12, 'polymerization');
chemical.platinum_polymer.optimalTemperature = [80, 120];
for (const recipe of extraChemistry) chemistry(...recipe);
export const cooking = {
  canned_fish: { name: 'mc:canned_fish', result: { id: 'mc:canned_fish', count: 2 }, requiredLevel: 6, baseActions: 18, ingredients: { 'minecraft:cod': 2, 'mc:tin_can': 2, 'mc:salt': 1 }, seasonings: {}, maxSeasonings: 0, needHeat: [90, 120], baseMoney: 30, baseXp: 18 },
};
