import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const bpDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const serverDir = path.resolve(bpDir, "../..");
const rpDir = path.join(serverDir, "development_resource_packs/MakeCountryResourcePack");

const materials = {
  aluminum: {
    durability: 2400, speed: 10, damage: 8,
    colors: [[219, 219, 219], [204, 204, 204], [196, 196, 196]],
    names: { en: "Aluminium", ja: "アルミニウム", ko: "알루미늄", zhCN: "铝", zhTW: "鋁" },
  },
  vanadium: {
    durability: 1400, speed: 10, damage: 7,
    colors: [[238, 136, 133], [220, 119, 116], [210, 109, 105]],
    names: { en: "Vanadium", ja: "バナジウム", ko: "바나듐", zhCN: "钒", zhTW: "釩" },
  },
  titanium: {
    durability: 3200, speed: 10, damage: 9,
    colors: [[207, 207, 207], [189, 189, 189], [179, 179, 179]],
    names: { en: "Titanium", ja: "チタン", ko: "티타늄", zhCN: "钛", zhTW: "鈦" },
  },
  tungsten: {
    durability: 4200, speed: 25, damage: 10,
    colors: [[99, 99, 99], [84, 84, 84], [72, 72, 72]],
    names: { en: "Tungsten", ja: "タングステン", ko: "텅스텐", zhCN: "钨", zhTW: "鎢" },
  },
  mithril: {
    durability: 6500, speed: 40, damage: 12,
    colors: [[151, 145, 238], [131, 126, 218], [120, 114, 207]],
    names: { en: "Mithril", ja: "ミスリル", ko: "미스릴", zhCN: "秘银", zhTW: "秘銀" },
  },
  orichalcum: {
    durability: 9000, speed: 60, damage: 14,
    colors: [[145, 238, 167], [126, 218, 147], [114, 207, 136]],
    names: { en: "Orichalcum", ja: "オリハルコン", ko: "오리할콘", zhCN: "奥利哈钢", zhTW: "奧利哈鋼" },
  },
};

const tools = {
  axe: { tag: "minecraft:is_axe_item_destructible", damageOffset: 2 },
  shovel: { tag: "minecraft:is_shovel_item_destructible", damageOffset: -2 },
  hoe: { tag: "minecraft:is_hoe_item_destructible", damageOffset: -4 },
  sword: { block: "minecraft:cobweb", damageOffset: 0 },
};

const labels = {
  axe: { en: "Axe", ja: "の斧", ko: " 도끼", zhCN: "斧", zhTW: "斧" },
  shovel: { en: "Shovel", ja: "のシャベル", ko: " 삽", zhCN: "锹", zhTW: "鏟" },
  hoe: { en: "Hoe", ja: "のクワ", ko: " 괭이", zhCN: "锄", zhTW: "鋤" },
  sword: { en: "Sword", ja: "の剣", ko: " 검", zhCN: "剑", zhTW: "劍" },
};

const templates = {
  axe: [
    "................", "....O1111O......", "...O122222O.....", "..O1233322O.....",
    "..O1233322O.....", "...O12222O......", "....OOHOO.......", "......HHO.......",
    ".....HHO........", "....HHO.........", "...HHO..........", "..HHO...........",
    ".HHO............", ".OO.............", "................", "................",
  ],
  shovel: [
    ".........OO.....", "........O11O....", ".......O123O....", ".......O233O....",
    "........O2O.....", ".......HHO......", "......HHO.......", ".....HHO........",
    "....HHO.........", "...HHO..........", "..HHO...........", ".HHO............",
    ".OO.............", "................", "................", "................",
  ],
  hoe: [
    "................", "....O111111O....", "...O1233332O....", "....OOOOO22O....",
    "........OHOO....", ".......HHO......", "......HHO.......", ".....HHO........",
    "....HHO.........", "...HHO..........", "..HHO...........", ".HHO............",
    ".OO.............", "................", "................", "................",
  ],
  sword: [
    "............OO..", "...........O1O..", "..........O12O..", ".........O123O..",
    "........O123O...", ".......O123O....", "......O123O.....", ".....O123O......",
    "....O123O.......", "...OO22O........", ".O22OHO.........", "..OOHHO.........",
    "....HHO.........", "...HHO..........", "...OO...........", "................",
  ],
};

function makeItem(materialId, material, toolId, tool) {
  const destroySpeeds = [];
  if (materialId === "titanium" && toolId === "axe") {
    for (const block of [
      "minecraft:cherry_log", "minecraft:cherry_wood", "minecraft:stripped_cherry_log", "minecraft:stripped_cherry_wood",
      "minecraft:mangrove_log", "minecraft:mangrove_wood", "minecraft:stripped_mangrove_log", "minecraft:stripped_mangrove_wood",
    ]) destroySpeeds.push({ block, speed: 180 });
  }
  destroySpeeds.push(tool.tag
    ? { block: { tags: `q.any_tag('${tool.tag}')` }, speed: material.speed }
    : { block: tool.block, speed: material.speed });

  const components = {
    "minecraft:icon": `${materialId}_${toolId}`,
    "minecraft:durability": { max_durability: material.durability },
    "minecraft:max_stack_size": 1,
    "minecraft:hand_equipped": true,
    "minecraft:damage": Math.max(1, material.damage + tool.damageOffset),
    "minecraft:digger": { use_efficiency: true, destroy_speeds: destroySpeeds },
    "minecraft:enchantable": { slot: toolId === "sword" ? "sword" : toolId, value: 14 },
    "mc:ranktool": {},
  };
  if (toolId === "sword") components["minecraft:tags"] = { tags: ["weapon", "type_sword"] };

  return {
    format_version: "1.21.120",
    "minecraft:item": {
      description: { identifier: `mc:${materialId}_${toolId}`, menu_category: { category: "equipment" } },
      components,
    },
  };
}

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  return c >>> 0;
});

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  typeBuffer.copy(out, 4);
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return out;
}

function writeTexture(filePath, template, colors) {
  const outline = [24, 24, 24, 255];
  const handleDark = [73, 54, 21, 255];
  const handleLight = [137, 103, 39, 255];
  const rgba = [];
  for (const row of template) {
    for (const cell of row) {
      const rgb = cell === "O" ? outline
        : cell === "H" ? handleDark
          : cell === "h" ? handleLight
            : /^[123]$/.test(cell) ? [...colors[Number(cell) - 1], 255]
              : [0, 0, 0, 0];
      rgba.push(...rgb);
    }
  }
  const raw = Buffer.alloc(16 * (1 + 16 * 4));
  for (let y = 0; y < 16; y++) {
    raw[y * 65] = 0;
    Buffer.from(rgba.slice(y * 64, (y + 1) * 64)).copy(raw, y * 65 + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(16, 0); ihdr.writeUInt32BE(16, 4);
  ihdr[8] = 8; ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr), pngChunk("IDAT", zlib.deflateSync(raw)), pngChunk("IEND", Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, png);
}

const generatedIds = [];
for (const [materialId, material] of Object.entries(materials)) {
  for (const [toolId, tool] of Object.entries(tools)) {
    const id = `${materialId}_${toolId}`;
    generatedIds.push(`mc:${id}`);
    const itemPath = path.join(bpDir, "items/tool", toolId, `${id}.json`);
    fs.mkdirSync(path.dirname(itemPath), { recursive: true });
    fs.writeFileSync(itemPath, `${JSON.stringify(makeItem(materialId, material, toolId, tool), null, 2)}\n`);
    writeTexture(path.join(rpDir, "textures/items/tool", toolId, `${id}.png`), templates[toolId], material.colors);
  }
}

const itemTexturePath = path.join(rpDir, "textures/item_texture.json");
const itemTexture = JSON.parse(fs.readFileSync(itemTexturePath, "utf8"));
for (const namespacedId of generatedIds) {
  const id = namespacedId.slice(3);
  const toolId = id.slice(id.lastIndexOf("_") + 1);
  itemTexture.texture_data[id] = { textures: `textures/items/tool/${toolId}/${id}` };
}
fs.writeFileSync(itemTexturePath, `${JSON.stringify(itemTexture, null, 2)}\n`);

const catalogPath = path.join(bpDir, "item_catalog/crafting_item_catalog.json");
const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
const equipment = catalog["minecraft:crafting_items_catalog"].categories.find((entry) => entry.category_name === "equipment");
const toolGroup = equipment.groups.find((entry) => entry.group_identifier.name === "mc:itemGroup.name.mc.tools");
toolGroup.items = [...new Set([...toolGroup.items, ...generatedIds])].sort();
fs.writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 4)}\n`);

const translations = {
  "en_US.lang": (material, tool) => `${material.names.en} ${labels[tool].en}`,
  "en_GB.lang": (material, tool) => `${material.names.en} ${labels[tool].en}`,
  "ja_JP.lang": (material, tool) => `${material.names.ja}${labels[tool].ja}`,
  "ko_KR.lang": (material, tool) => `${material.names.ko}${labels[tool].ko}`,
  "zh_CN.lang": (material, tool) => `${material.names.zhCN}${labels[tool].zhCN}`,
  "zh_TW.lang": (material, tool) => `${material.names.zhTW}${labels[tool].zhTW}`,
};
for (const [file, translate] of Object.entries(translations)) {
  const langPath = path.join(rpDir, "texts", file);
  let text = fs.readFileSync(langPath, "utf8").replace(/\nitem\.mc:(?:aluminum|vanadium|titanium|tungsten|mithril|orichalcum)_(?:axe|shovel|hoe|sword)=.*$/gm, "");
  const lines = [];
  for (const [materialId, material] of Object.entries(materials)) {
    for (const toolId of Object.keys(tools)) lines.push(`item.mc:${materialId}_${toolId}=${translate(material, toolId)}`);
  }
  fs.writeFileSync(langPath, `${text.trimEnd()}\n${lines.join("\n")}\n`);
}

const textureConfigPath = path.join(bpDir, "src/config/textures.ts");
let textureConfig = fs.readFileSync(textureConfigPath, "utf8");
textureConfig = textureConfig.replace(/\n  'mc:(?:aluminum|vanadium|titanium|tungsten|mithril|orichalcum)_(?:axe|shovel|hoe|sword)': 'textures\/items\/tool\/(?:axe|shovel|hoe|sword)\/[^']+',/g, "");
const configLines = generatedIds.map((namespacedId) => {
  const id = namespacedId.slice(3);
  const toolId = id.slice(id.lastIndexOf("_") + 1);
  return `  '${namespacedId}': 'textures/items/tool/${toolId}/${id}',`;
});
const anchor = "  'mc:orichalcum_pickaxe': 'textures/items/tool/pickaxe/orichalcum_pickaxe',";
if (!textureConfig.includes(anchor)) throw new Error("Texture config insertion anchor not found");
textureConfig = textureConfig.replace(anchor, `${anchor}\n${configLines.join("\n")}`);
fs.writeFileSync(textureConfigPath, textureConfig);

const customItemIdsPath = path.join(bpDir, "src/config/custom-item-ids.ts");
let customItemIdsSource = fs.readFileSync(customItemIdsPath, "utf8");
if (!customItemIdsSource.includes("export const customItemIds = [")) throw new Error("Custom item ID list not found");
for (const id of generatedIds) {
  if (!customItemIdsSource.includes(`  "${id}",`)) {
    customItemIdsSource = customItemIdsSource.replace(/\n\];/, `\n  "${id}",\n];`);
  }
}
fs.writeFileSync(customItemIdsPath, customItemIdsSource);

console.log(`Generated ${generatedIds.length} special tools, textures, catalog entries, and translations.`);
