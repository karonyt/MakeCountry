import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const bpDir = path.resolve(toolDir, "..");
const rpDir = path.resolve(bpDir, "../../development_resource_packs/MakeCountryResourcePack");

const LANG_FILES = ["ja_JP.lang", "en_US.lang", "en_GB.lang", "ko_KR.lang", "zh_CN.lang", "zh_TW.lang"];
const BLOCK_DIR = path.join(bpDir, "blocks/furniture/generated");
const RECIPE_DIR = path.join(bpDir, "recipes/furniture/generated");
const LOOT_DIR = path.join(bpDir, "loot_tables/blocks/furniture/generated");
const TEXTURE_DIR = path.join(rpDir, "textures/blocks/furniture/generated");
const MODEL_DIR = path.join(rpDir, "models/blocks");
const CRAFTING_CATALOG_PATH = path.join(bpDir, "item_catalog/crafting_item_catalog.json");
const LANG_START = "# Generated furniture blocks start";
const LANG_END = "# Generated furniture blocks end";

const variants = [
  {
    id: "oak",
    en: "Oak",
    ja: (name) => `オークの${name}`,
    ko: "오크",
    zhCn: "橡木",
    zhTw: "橡木",
    material: "minecraft:oak_planks",
    color: [156, 107, 61],
    accent: [93, 58, 32],
    style: "wood",
  },
  {
    id: "spruce",
    en: "Spruce",
    ja: (name) => `トウヒの${name}`,
    ko: "가문비나무",
    zhCn: "云杉",
    zhTw: "杉木",
    material: "minecraft:spruce_planks",
    color: [104, 75, 46],
    accent: [67, 45, 29],
    style: "wood",
  },
  {
    id: "birch",
    en: "Birch",
    ja: (name) => `シラカバの${name}`,
    ko: "자작나무",
    zhCn: "白桦",
    zhTw: "樺木",
    material: "minecraft:birch_planks",
    color: [205, 181, 112],
    accent: [142, 111, 60],
    style: "wood",
  },
  {
    id: "dark_oak",
    en: "Dark Oak",
    ja: (name) => `ダークオークの${name}`,
    ko: "짙은 참나무",
    zhCn: "深色橡木",
    zhTw: "黑橡木",
    material: "minecraft:dark_oak_planks",
    color: [71, 47, 29],
    accent: [42, 27, 18],
    style: "wood",
  },
  {
    id: "cherry",
    en: "Cherry",
    ja: (name) => `サクラの${name}`,
    ko: "벚나무",
    zhCn: "樱花木",
    zhTw: "櫻花木",
    material: "minecraft:cherry_planks",
    color: [213, 149, 152],
    accent: [139, 82, 93],
    style: "wood",
  },
  {
    id: "white",
    en: "White",
    ja: (name) => `白い${name}`,
    ko: "하얀색",
    zhCn: "白色",
    zhTw: "白色",
    material: "minecraft:white_wool",
    color: [232, 232, 220],
    accent: [166, 166, 156],
    style: "paint",
  },
  {
    id: "black",
    en: "Black",
    ja: (name) => `黒い${name}`,
    ko: "검은색",
    zhCn: "黑色",
    zhTw: "黑色",
    material: "minecraft:black_wool",
    color: [38, 40, 43],
    accent: [12, 14, 18],
    style: "paint",
  },
  {
    id: "red",
    en: "Red",
    ja: (name) => `赤い${name}`,
    ko: "빨간색",
    zhCn: "红色",
    zhTw: "紅色",
    material: "minecraft:red_wool",
    color: [171, 48, 43],
    accent: [103, 27, 31],
    style: "paint",
  },
  {
    id: "blue",
    en: "Blue",
    ja: (name) => `青い${name}`,
    ko: "파란색",
    zhCn: "蓝色",
    zhTw: "藍色",
    material: "minecraft:blue_wool",
    color: [48, 73, 154],
    accent: [28, 41, 94],
    style: "paint",
  },
  {
    id: "green",
    en: "Green",
    ja: (name) => `緑の${name}`,
    ko: "초록색",
    zhCn: "绿色",
    zhTw: "綠色",
    material: "minecraft:green_wool",
    color: [58, 126, 61],
    accent: [31, 77, 36],
    style: "paint",
  },
];

const furnitureTypes = [
  { id: "chair", en: "Chair", ja: "椅子", ko: "의자", zhCn: "椅子", zhTw: "椅子", surface: "wood", recipe: ["P  ", "PPP", "S S"] },
  { id: "stool", en: "Stool", ja: "スツール", ko: "스툴", zhCn: "凳子", zhTw: "凳子", surface: "wood", recipe: ["PPP", " S ", "S S"] },
  { id: "dining_table", en: "Dining Table", ja: "ダイニングテーブル", ko: "식탁", zhCn: "餐桌", zhTw: "餐桌", surface: "wood", recipe: ["PPP", " S ", "S S"] },
  { id: "coffee_table", en: "Coffee Table", ja: "ローテーブル", ko: "커피 테이블", zhCn: "茶几", zhTw: "茶几", surface: "wood", recipe: ["PPP", "S S", "S S"] },
  { id: "side_table", en: "Side Table", ja: "サイドテーブル", ko: "사이드 테이블", zhCn: "边桌", zhTw: "邊桌", surface: "wood", recipe: ["PP ", " S ", " S "] },
  { id: "desk", en: "Desk", ja: "机", ko: "책상", zhCn: "书桌", zhTw: "書桌", surface: "wood", recipe: ["PPP", "P S", "S S"] },
  { id: "counter", en: "Counter", ja: "カウンター", ko: "카운터", zhCn: "柜台", zhTw: "櫃檯", surface: "wood", recipe: ["PPP", "PIP", "PPP"] },
  { id: "cabinet", en: "Cabinet", ja: "キャビネット", ko: "캐비닛", zhCn: "柜子", zhTw: "櫃子", surface: "wood", recipe: ["PPP", "PCP", "PPP"], extra: "minecraft:chest" },
  { id: "cupboard", en: "Cupboard", ja: "食器棚", ko: "찬장", zhCn: "碗柜", zhTw: "碗櫃", surface: "wood", recipe: ["PGP", "PCP", "PPP"], extra: "minecraft:glass_pane" },
  { id: "bookshelf", en: "Bookshelf", ja: "本棚", ko: "책장", zhCn: "书架", zhTw: "書架", surface: "wood", recipe: ["PPP", "PBP", "PPP"], extra: "minecraft:book" },
  { id: "low_shelf", en: "Low Shelf", ja: "ローボード", ko: "낮은 선반", zhCn: "矮架", zhTw: "矮架", surface: "wood", recipe: ["PPP", "P P", "PPP"] },
  { id: "wardrobe", en: "Wardrobe", ja: "ワードローブ", ko: "옷장", zhCn: "衣柜", zhTw: "衣櫃", surface: "wood", recipe: ["PPP", "PLP", "PPP"], extra: "minecraft:leather" },
  { id: "dresser", en: "Dresser", ja: "ドレッサー", ko: "화장대", zhCn: "梳妆台", zhTw: "梳妝台", surface: "wood", recipe: ["PGP", "PIP", "PPP"], extra: "minecraft:glass_pane" },
  { id: "sofa", en: "Sofa", ja: "ソファ", ko: "소파", zhCn: "沙发", zhTw: "沙發", surface: "fabric", recipe: ["WWW", "PPP", "S S"], primary: "wool" },
  { id: "armchair", en: "Armchair", ja: "アームチェア", ko: "안락의자", zhCn: "扶手椅", zhTw: "扶手椅", surface: "fabric", recipe: ["W W", "PPP", "S S"], primary: "wool" },
  { id: "bench", en: "Bench", ja: "ベンチ", ko: "벤치", zhCn: "长椅", zhTw: "長椅", surface: "wood", recipe: ["PPP", "S S", "S S"] },
  { id: "bed", en: "Bed", ja: "ベッド", ko: "침대", zhCn: "床", zhTw: "床", surface: "fabric", recipe: ["WWW", "PPP", "P P"], primary: "wool" },
  { id: "futon", en: "Futon", ja: "布団", ko: "요", zhCn: "被褥", zhTw: "被褥", surface: "fabric", recipe: ["WWW", "PPP", "   "], primary: "wool" },
  { id: "sink", en: "Sink", ja: "シンク", ko: "싱크대", zhCn: "水槽", zhTw: "水槽", surface: "metal", recipe: ["IPI", "IGI", "PPP"], extra: "minecraft:iron_ingot" },
  { id: "bathtub", en: "Bathtub", ja: "バスタブ", ko: "욕조", zhCn: "浴缸", zhTw: "浴缸", surface: "ceramic", recipe: ["I I", "IWI", "PPP"], extra: "minecraft:iron_ingot" },
  { id: "toilet", en: "Toilet", ja: "トイレ", ko: "변기", zhCn: "马桶", zhTw: "馬桶", surface: "ceramic", recipe: [" Q ", "PWP", " P "], extra: "minecraft:quartz_block" },
  { id: "refrigerator", en: "Refrigerator", ja: "冷蔵庫", ko: "냉장고", zhCn: "冰箱", zhTw: "冰箱", surface: "metal", recipe: ["IPI", "IRI", "IPI"], extra: "minecraft:iron_ingot" },
  { id: "stove", en: "Stove", ja: "コンロ", ko: "스토브", zhCn: "炉灶", zhTw: "爐灶", surface: "metal", recipe: ["III", "IRI", "PPP"], extra: "minecraft:iron_ingot" },
  { id: "microwave", en: "Microwave", ja: "電子レンジ", ko: "전자레인지", zhCn: "微波炉", zhTw: "微波爐", surface: "metal", recipe: ["IGI", "IRI", "PPP"], extra: "minecraft:glass_pane" },
  { id: "tv_stand", en: "TV Stand", ja: "テレビ台", ko: "TV 받침대", zhCn: "电视柜", zhTw: "電視櫃", surface: "wood", recipe: ["PPP", "PRP", "PPP"], extra: "minecraft:redstone" },
  { id: "television", en: "Television", ja: "テレビ", ko: "텔레비전", zhCn: "电视", zhTw: "電視", surface: "metal", recipe: ["GGG", "RIR", " P "], extra: "minecraft:redstone" },
  { id: "lamp", en: "Table Lamp", ja: "テーブルランプ", ko: "탁상 램프", zhCn: "台灯", zhTw: "檯燈", surface: "light", recipe: [" T ", " S ", " P "], extra: "minecraft:torch" },
  { id: "floor_lamp", en: "Floor Lamp", ja: "フロアランプ", ko: "플로어 램프", zhCn: "落地灯", zhTw: "落地燈", surface: "light", recipe: [" T ", " S ", " S "], extra: "minecraft:torch" },
  { id: "plant_stand", en: "Plant Stand", ja: "プラントスタンド", ko: "화분 받침대", zhCn: "花盆架", zhTw: "花盆架", surface: "wood", recipe: [" F ", "PPP", "S S"], extra: "minecraft:flower_pot" },
  { id: "folding_screen", en: "Folding Screen", ja: "屏風", ko: "병풍", zhCn: "屏风", zhTw: "屏風", surface: "fabric", recipe: ["WWW", "PPP", "S S"], primary: "wool" },
  { id: "rocking_chair", en: "Rocking Chair", ja: "ロッキングチェア", ko: "흔들의자", zhCn: "摇椅", zhTw: "搖椅", surface: "wood", recipe: ["P  ", "PPP", "SSS"] },
  { id: "bar_stool", en: "Bar Stool", ja: "バースツール", ko: "바 스툴", zhCn: "吧台凳", zhTw: "吧台椅", surface: "wood", recipe: ["PPP", " S ", "S S"] },
  { id: "ottoman", en: "Ottoman", ja: "オットマン", ko: "오토만", zhCn: "脚凳", zhTw: "腳凳", surface: "fabric", recipe: ["WWW", "PPP", "S S"], primary: "wool" },
  { id: "chaise_lounge", en: "Chaise Lounge", ja: "カウチソファ", ko: "카우치", zhCn: "贵妃椅", zhTw: "貴妃椅", surface: "fabric", recipe: ["WWW", "PPP", "S S"], primary: "wool" },
  { id: "picnic_table", en: "Picnic Table", ja: "ピクニックテーブル", ko: "피크닉 테이블", zhCn: "野餐桌", zhTw: "野餐桌", surface: "wood", recipe: ["PPP", "SPS", "S S"] },
  { id: "console_table", en: "Console Table", ja: "コンソールテーブル", ko: "콘솔 테이블", zhCn: "玄关桌", zhTw: "玄關桌", surface: "wood", recipe: ["PPP", "S S", "S S"] },
  { id: "vanity_table", en: "Vanity Table", ja: "化粧台", ko: "화장 테이블", zhCn: "梳妆桌", zhTw: "梳妝桌", surface: "wood", recipe: ["PGP", "PIP", "S S"] },
  { id: "drafting_table", en: "Drafting Table", ja: "製図台", ko: "제도대", zhCn: "绘图桌", zhTw: "製圖桌", surface: "wood", recipe: ["PPP", "BP ", "S S"] },
  { id: "computer_desk", en: "Computer Desk", ja: "パソコンデスク", ko: "컴퓨터 책상", zhCn: "电脑桌", zhTw: "電腦桌", surface: "wood", recipe: ["PPP", "PRP", "S S"] },
  { id: "kotatsu", en: "Kotatsu", ja: "こたつ", ko: "코타츠", zhCn: "暖桌", zhTw: "暖桌", surface: "fabric", recipe: ["WWW", "PTP", "S S"], primary: "wool" },
  { id: "nightstand", en: "Nightstand", ja: "ナイトスタンド", ko: "침대 협탁", zhCn: "床头柜", zhTw: "床頭櫃", surface: "wood", recipe: ["PPP", "PCP", "PPP"], extra: "minecraft:chest" },
  { id: "shoe_rack", en: "Shoe Rack", ja: "靴棚", ko: "신발장", zhCn: "鞋架", zhTw: "鞋架", surface: "wood", recipe: ["PPP", "P P", "PPP"] },
  { id: "wine_rack", en: "Bottle Rack", ja: "ボトルラック", ko: "병 랙", zhCn: "瓶架", zhTw: "瓶架", surface: "wood", recipe: ["PPP", "PVP", "PPP"], extra: "minecraft:glass_bottle" },
  { id: "display_case", en: "Display Case", ja: "ショーケース", ko: "진열장", zhCn: "展示柜", zhTw: "展示櫃", surface: "glass", recipe: ["GGG", "GCG", "PPP"], extra: "minecraft:glass_pane" },
  { id: "filing_cabinet", en: "Filing Cabinet", ja: "書類キャビネット", ko: "서류 캐비닛", zhCn: "文件柜", zhTw: "文件櫃", surface: "metal", recipe: ["IPI", "IPI", "IPI"], extra: "minecraft:iron_ingot" },
  { id: "toy_box", en: "Toy Box", ja: "おもちゃ箱", ko: "장난감 상자", zhCn: "玩具箱", zhTw: "玩具箱", surface: "wood", recipe: ["PPP", "PCP", "PPP"], extra: "minecraft:chest" },
  { id: "kitchen_island", en: "Kitchen Island", ja: "キッチンアイランド", ko: "아일랜드 식탁", zhCn: "厨房岛台", zhTw: "廚房中島", surface: "wood", recipe: ["PPP", "PIP", "PIP"], extra: "minecraft:iron_ingot" },
  { id: "kitchen_cabinet", en: "Kitchen Cabinet", ja: "キッチンキャビネット", ko: "주방 캐비닛", zhCn: "厨房柜", zhTw: "廚房櫃", surface: "wood", recipe: ["PPP", "PGP", "PCP"], extra: "minecraft:glass_pane" },
  { id: "dishwasher", en: "Dishwasher", ja: "食洗機", ko: "식기세척기", zhCn: "洗碗机", zhTw: "洗碗機", surface: "metal", recipe: ["IPI", "IWI", "PPP"], extra: "minecraft:iron_ingot" },
  { id: "shower_booth", en: "Shower Booth", ja: "シャワーブース", ko: "샤워 부스", zhCn: "淋浴间", zhTw: "淋浴間", surface: "glass", recipe: ["GGG", "GIG", "PWP"], extra: "minecraft:glass_pane" },
  { id: "bathroom_vanity", en: "Bathroom Vanity", ja: "洗面台", ko: "세면대 수납장", zhCn: "浴室洗手台", zhTw: "浴室洗手台", surface: "ceramic", recipe: ["PGP", "PWP", "PPP"], extra: "minecraft:glass_pane" },
  { id: "wall_mirror", en: "Wall Mirror", ja: "壁掛け鏡", ko: "벽걸이 거울", zhCn: "壁镜", zhTw: "壁鏡", surface: "glass", recipe: ["PGP", "PGP", "PPP"], extra: "minecraft:glass_pane" },
  { id: "towel_rack", en: "Towel Rack", ja: "タオルラック", ko: "수건걸이", zhCn: "毛巾架", zhTw: "毛巾架", surface: "metal", recipe: ["III", "WWW", "I I"], primary: "wool", extra: "minecraft:iron_ingot" },
  { id: "ceiling_light", en: "Ceiling Light", ja: "シーリングライト", ko: "천장등", zhCn: "吸顶灯", zhTw: "吸頂燈", surface: "light", recipe: [" P ", "GTG", " P "], extra: "minecraft:torch" },
  { id: "chandelier", en: "Chandelier", ja: "シャンデリア", ko: "샹들리에", zhCn: "吊灯", zhTw: "吊燈", surface: "light", recipe: [" I ", "TTT", "G G"], extra: "minecraft:torch" },
  { id: "wall_sconce", en: "Wall Sconce", ja: "壁灯", ko: "벽등", zhCn: "壁灯", zhTw: "壁燈", surface: "light", recipe: [" T ", "IPI", " P "], extra: "minecraft:torch" },
  { id: "computer", en: "Computer", ja: "パソコン", ko: "컴퓨터", zhCn: "电脑", zhTw: "電腦", surface: "metal", recipe: ["GGG", "RIR", " P "], extra: "minecraft:redstone" },
  { id: "arcade_cabinet", en: "Arcade Cabinet", ja: "アーケード筐体", ko: "아케이드 캐비닛", zhCn: "街机柜", zhTw: "街機櫃", surface: "metal", recipe: ["GGG", "RIR", "PPP"], extra: "minecraft:redstone" },
  { id: "speaker", en: "Speaker", ja: "スピーカー", ko: "스피커", zhCn: "音箱", zhTw: "喇叭", surface: "metal", recipe: ["PPP", "RIR", "PPP"], extra: "minecraft:redstone" },
  { id: "tatami_mat", en: "Tatami Mat", ja: "畳", ko: "다다미", zhCn: "榻榻米", zhTw: "榻榻米", surface: "fabric", recipe: ["WWW", "PPP", "WWW"], primary: "wool" },
];

if (variants.length * furnitureTypes.length !== 600) {
  throw new Error(`Expected 600 furniture blocks, got ${variants.length * furnitureTypes.length}`);
}

const furnitureGroups = [
  {
    id: "furniture_seating",
    icon: "mc:furniture_oak_chair",
    types: ["chair", "stool", "sofa", "armchair", "bench", "rocking_chair", "bar_stool", "ottoman", "chaise_lounge"],
    names: {
      "ja_JP.lang": "家具 - 椅子・ソファ",
      "en_US.lang": "Furniture - Seating",
      "en_GB.lang": "Furniture - Seating",
      "ko_KR.lang": "가구 - 좌석",
      "zh_CN.lang": "家具 - 座椅",
      "zh_TW.lang": "家具 - 座椅",
    },
  },
  {
    id: "furniture_tables",
    icon: "mc:furniture_oak_dining_table",
    types: ["dining_table", "coffee_table", "side_table", "desk", "counter", "picnic_table", "console_table", "vanity_table", "drafting_table", "computer_desk", "kotatsu"],
    names: {
      "ja_JP.lang": "家具 - テーブル・机",
      "en_US.lang": "Furniture - Tables & Desks",
      "en_GB.lang": "Furniture - Tables & Desks",
      "ko_KR.lang": "가구 - 테이블과 책상",
      "zh_CN.lang": "家具 - 桌子",
      "zh_TW.lang": "家具 - 桌子",
    },
  },
  {
    id: "furniture_storage",
    icon: "mc:furniture_oak_cabinet",
    types: [
      "cabinet",
      "cupboard",
      "bookshelf",
      "low_shelf",
      "wardrobe",
      "dresser",
      "tv_stand",
      "nightstand",
      "shoe_rack",
      "wine_rack",
      "display_case",
      "filing_cabinet",
      "toy_box",
    ],
    names: {
      "ja_JP.lang": "家具 - 収納・棚",
      "en_US.lang": "Furniture - Storage & Shelves",
      "en_GB.lang": "Furniture - Storage & Shelves",
      "ko_KR.lang": "가구 - 수납과 선반",
      "zh_CN.lang": "家具 - 收纳和架子",
      "zh_TW.lang": "家具 - 收納和架子",
    },
  },
  {
    id: "furniture_bedroom",
    icon: "mc:furniture_oak_bed",
    types: ["bed", "futon", "folding_screen", "tatami_mat"],
    names: {
      "ja_JP.lang": "家具 - 寝具・間仕切り",
      "en_US.lang": "Furniture - Bedroom",
      "en_GB.lang": "Furniture - Bedroom",
      "ko_KR.lang": "가구 - 침실",
      "zh_CN.lang": "家具 - 卧室",
      "zh_TW.lang": "家具 - 臥室",
    },
  },
  {
    id: "furniture_kitchen_bath",
    icon: "mc:furniture_oak_sink",
    types: [
      "sink",
      "bathtub",
      "toilet",
      "refrigerator",
      "stove",
      "microwave",
      "kitchen_island",
      "kitchen_cabinet",
      "dishwasher",
      "shower_booth",
      "bathroom_vanity",
      "wall_mirror",
      "towel_rack",
    ],
    names: {
      "ja_JP.lang": "家具 - キッチン・水回り",
      "en_US.lang": "Furniture - Kitchen & Bath",
      "en_GB.lang": "Furniture - Kitchen & Bath",
      "ko_KR.lang": "가구 - 주방과 욕실",
      "zh_CN.lang": "家具 - 厨卫",
      "zh_TW.lang": "家具 - 廚衛",
    },
  },
  {
    id: "furniture_lighting_electronics",
    icon: "mc:furniture_oak_lamp",
    types: ["television", "lamp", "floor_lamp", "plant_stand", "ceiling_light", "chandelier", "wall_sconce", "computer", "arcade_cabinet", "speaker"],
    names: {
      "ja_JP.lang": "家具 - 照明・家電・装飾",
      "en_US.lang": "Furniture - Lighting & Decor",
      "en_GB.lang": "Furniture - Lighting & Decor",
      "ko_KR.lang": "가구 - 조명과 장식",
      "zh_CN.lang": "家具 - 照明和装饰",
      "zh_TW.lang": "家具 - 照明和裝飾",
    },
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeJson(filePath, value) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function clamp(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function mix(a, b, amount) {
  return [
    clamp(a[0] + (b[0] - a[0]) * amount),
    clamp(a[1] + (b[1] - a[1]) * amount),
    clamp(a[2] + (b[2] - a[2]) * amount),
  ];
}

function shift(color, amount) {
  return color.map((channel) => clamp(channel + amount));
}

function hex(color) {
  return `#${color.map((channel) => clamp(channel).toString(16).padStart(2, "0")).join("")}`;
}

function hashText(text) {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function setPixel(pixels, x, y, color, alpha = 255) {
  if (x < 0 || y < 0 || x >= 64 || y >= 64) return;
  const index = (y * 64 + x) * 4;
  pixels[index] = clamp(color[0]);
  pixels[index + 1] = clamp(color[1]);
  pixels[index + 2] = clamp(color[2]);
  pixels[index + 3] = alpha;
}

function fillRect(pixels, x, y, width, height, color) {
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) setPixel(pixels, px, py, color);
  }
}

function rect(pixels, x, y, width, height, color) {
  fillRect(pixels, x, y, width, 1, color);
  fillRect(pixels, x, y + height - 1, width, 1, color);
  fillRect(pixels, x, y, 1, height, color);
  fillRect(pixels, x + width - 1, y, 1, height, color);
}

function surfaceStyle(type, variant) {
  if (type.surface === "fabric") return "fabric";
  if (type.surface === "metal") return "metal";
  if (type.surface === "ceramic") return "ceramic";
  if (type.surface === "glass") return "glass";
  if (type.surface === "light") return "light";
  return variant.style === "paint" ? "painted" : "wood";
}

function drawTexture(type, variant) {
  const pixels = Buffer.alloc(64 * 64 * 4);
  const style = surfaceStyle(type, variant);
  const seed = hashText(`${variant.id}:${type.id}`);
  const base = variant.color;
  const dark = variant.accent;
  const light = shift(base, style === "metal" || style === "ceramic" ? 38 : 26);
  const shadow = mix(dark, [0, 0, 0], 0.2);

  for (let y = 0; y < 64; y += 1) {
    for (let x = 0; x < 64; x += 1) {
      const noise = (((x * 37 + y * 17 + seed) >>> 0) % 15) - 7;
      let color = base;
      if (style === "wood") {
        const grain = Math.sin((y + (seed % 11)) / 2.7) * 9 + Math.sin((x + y) / 8) * 5;
        color = shift(base, grain + noise * 0.45);
      } else if (style === "fabric") {
        const weave = (x % 8 === 0 || y % 8 === 0 ? -16 : 0) + ((x + y) % 5 === 0 ? 7 : 0);
        color = shift(base, weave + noise * 0.35);
      } else if (style === "metal") {
        color = shift(mix(base, [220, 224, 226], 0.35), (x - y) * 0.08 + noise * 0.4);
      } else if (style === "ceramic") {
        color = shift(mix(base, [238, 238, 232], 0.55), noise * 0.25);
      } else if (style === "glass") {
        color = shift(mix(base, [165, 211, 224], 0.48), ((x + y) % 11 === 0 ? 26 : 0) + noise * 0.25);
      } else if (style === "light") {
        const glow = Math.max(0, 28 - Math.hypot(x - 32, y - 23));
        color = shift(mix(base, [245, 214, 108], 0.35), glow + noise * 0.2);
      } else {
        color = shift(base, noise * 0.45);
      }
      setPixel(pixels, x, y, color);
    }
  }

  rect(pixels, 0, 0, 64, 64, shadow);
  rect(pixels, 2, 2, 60, 60, mix(dark, base, 0.25));

  if (
    [
      "cabinet",
      "cupboard",
      "wardrobe",
      "dresser",
      "counter",
      "tv_stand",
      "nightstand",
      "filing_cabinet",
      "toy_box",
      "kitchen_island",
      "kitchen_cabinet",
      "bathroom_vanity",
      "arcade_cabinet",
      "crate",
    ].includes(type.id)
  ) {
    fillRect(pixels, 8, 12, 20, 40, mix(base, light, 0.25));
    fillRect(pixels, 36, 12, 20, 40, mix(base, shadow, 0.15));
    rect(pixels, 8, 12, 20, 40, dark);
    rect(pixels, 36, 12, 20, 40, dark);
    fillRect(pixels, 29, 30, 3, 5, light);
    fillRect(pixels, 33, 30, 3, 5, light);
  }

  if (["bookshelf", "low_shelf", "shoe_rack", "wine_rack", "display_case"].includes(type.id)) {
    for (const y of [16, 31, 46]) fillRect(pixels, 7, y, 50, 3, dark);
    for (let i = 0; i < 9; i += 1) {
      const x = 10 + i * 5;
      const bookColor = [[154, 43, 45], [41, 82, 148], [59, 126, 67], [211, 167, 65]][(i + seed) % 4];
      fillRect(pixels, x, 18 + (i % 2), 3, 12, bookColor);
      fillRect(pixels, x, 34, 3, 11, shift(bookColor, 18));
    }
  }

  if (["sofa", "armchair", "bed", "futon", "folding_screen", "ottoman", "chaise_lounge", "kotatsu", "tatami_mat"].includes(type.id)) {
    fillRect(pixels, 8, 8, 48, 18, light);
    fillRect(pixels, 8, 38, 48, 14, mix(base, dark, 0.25));
    rect(pixels, 8, 8, 48, 18, dark);
    rect(pixels, 8, 38, 48, 14, dark);
  }

  if (["sink", "bathtub", "toilet", "shower_booth", "bathroom_vanity", "wall_mirror"].includes(type.id)) {
    fillRect(pixels, 14, 14, 36, 30, light);
    rect(pixels, 14, 14, 36, 30, dark);
    fillRect(pixels, 22, 22, 20, 14, mix(base, [115, 171, 199], 0.45));
    rect(pixels, 22, 22, 20, 14, shadow);
  }

  if (["refrigerator", "stove", "microwave", "television", "dishwasher", "computer", "arcade_cabinet", "speaker"].includes(type.id)) {
    fillRect(pixels, 10, 10, 44, 42, mix(base, [210, 214, 218], 0.3));
    rect(pixels, 10, 10, 44, 42, shadow);
    fillRect(pixels, 17, 17, 30, 17, mix([24, 37, 48], base, type.id === "television" ? 0.08 : 0.25));
    rect(pixels, 17, 17, 30, 17, dark);
    fillRect(pixels, 47, 19, 3, 20, light);
  }

  if (["lamp", "floor_lamp", "ceiling_light", "chandelier", "wall_sconce"].includes(type.id)) {
    fillRect(pixels, 22, 8, 20, 18, [241, 214, 112]);
    rect(pixels, 22, 8, 20, 18, dark);
    fillRect(pixels, 30, 26, 4, 27, shadow);
    fillRect(pixels, 20, 53, 24, 5, dark);
  }

  if (type.id === "plant_stand") {
    fillRect(pixels, 20, 28, 24, 18, mix(base, dark, 0.2));
    rect(pixels, 20, 28, 24, 18, dark);
    fillRect(pixels, 26, 17, 12, 12, [55, 143, 68]);
    fillRect(pixels, 31, 10, 5, 20, [45, 116, 58]);
  }

  return pixels;
}

const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n += 1) {
  let c = n;
  for (let k = 0; k < 8; k += 1) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  crcTable[n] = c >>> 0;
}

function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0);
  return Buffer.concat([length, typeBuffer, data, crc]);
}

function writePng(filePath, pixels) {
  ensureDir(path.dirname(filePath));
  const raw = Buffer.alloc((64 * 4 + 1) * 64);
  for (let y = 0; y < 64; y += 1) {
    const rowStart = y * (64 * 4 + 1);
    raw[rowStart] = 0;
    pixels.copy(raw, rowStart + 1, y * 64 * 4, (y + 1) * 64 * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(64, 0);
  ihdr.writeUInt32BE(64, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(filePath, png);
}

function cube(x, y, z, w, h, d, uv = [0, 0]) {
  return { origin: [x, y, z], size: [w, h, d], uv };
}

const commonLegs = [
  cube(-6, 0, -6, 2, 7, 2),
  cube(4, 0, -6, 2, 7, 2),
  cube(-6, 0, 4, 2, 7, 2),
  cube(4, 0, 4, 2, 7, 2),
];

function geometryCubes(typeId) {
  const c = {
    chair: [cube(-6, 6, -5, 12, 2, 10), cube(-6, 8, 4, 12, 8, 2), ...commonLegs],
    stool: [cube(-6, 7, -6, 12, 2, 12), ...commonLegs],
    dining_table: [cube(-8, 9, -8, 16, 2, 16), ...commonLegs],
    coffee_table: [cube(-8, 5, -8, 16, 2, 16), cube(-6, 0, -6, 2, 5, 2), cube(4, 0, -6, 2, 5, 2), cube(-6, 0, 4, 2, 5, 2), cube(4, 0, 4, 2, 5, 2)],
    side_table: [cube(-6, 8, -6, 12, 2, 12), cube(-2, 0, -2, 4, 8, 4), cube(-5, 0, -5, 10, 1, 10)],
    desk: [cube(-8, 9, -7, 16, 2, 14), cube(-8, 0, -7, 2, 9, 14), cube(5, 0, -7, 3, 9, 14), cube(-6, 4, 5, 11, 1, 2)],
    counter: [cube(-8, 0, -8, 16, 13, 16), cube(-8, 13, -8, 16, 3, 16), cube(-7, 2, -8.1, 6, 9, 1), cube(1, 2, -8.1, 6, 9, 1)],
    cabinet: [cube(-7, 0, -7, 14, 15, 14), cube(-6, 2, -7.2, 5.5, 10, 1), cube(0.5, 2, -7.2, 5.5, 10, 1), cube(-0.5, 7, -8, 1, 1, 1)],
    cupboard: [cube(-7, 0, -7, 14, 16, 14), cube(-6, 9, -7.2, 12, 5, 1), cube(-6, 2, -7.2, 5.5, 6, 1), cube(0.5, 2, -7.2, 5.5, 6, 1), cube(-6, 8, -7, 12, 1, 1)],
    bookshelf: [cube(-8, 0, -7, 2, 16, 14), cube(6, 0, -7, 2, 16, 14), cube(-8, 0, -7, 16, 2, 14), cube(-8, 14, -7, 16, 2, 14), cube(-7, 5, -7, 14, 1.5, 14), cube(-7, 10, -7, 14, 1.5, 14), cube(-6, 2, -6, 12, 3, 2), cube(-6, 7, -6, 12, 3, 2), cube(-6, 12, -6, 12, 2, 2)],
    low_shelf: [cube(-8, 0, -7, 16, 9, 14), cube(-7, 3, -7.2, 6, 4, 1), cube(1, 3, -7.2, 6, 4, 1), cube(-7, 8, -7, 14, 1, 14)],
    wardrobe: [cube(-8, 0, -7, 16, 16, 14), cube(-7, 1, -7.2, 7, 14, 1), cube(0, 1, -7.2, 7, 14, 1), cube(-1, 7, -8, 1, 2, 1), cube(1, 7, -8, 1, 2, 1)],
    dresser: [cube(-8, 0, -7, 16, 11, 14), cube(-6, 2, -7.2, 12, 2, 1), cube(-6, 5, -7.2, 12, 2, 1), cube(-6, 8, -7.2, 12, 2, 1), cube(-4, 11, -5, 8, 5, 1), cube(-5, 10, -6, 10, 1, 3)],
    sofa: [cube(-8, 3, -6, 16, 5, 12), cube(-8, 8, 4, 16, 6, 2), cube(-8, 5, -6, 2, 6, 12), cube(6, 5, -6, 2, 6, 12), cube(-7, 8, -5, 6.5, 2, 8), cube(0.5, 8, -5, 6.5, 2, 8)],
    armchair: [cube(-6, 3, -6, 12, 5, 12), cube(-6, 8, 4, 12, 6, 2), cube(-8, 5, -6, 2, 6, 12), cube(6, 5, -6, 2, 6, 12), cube(-5, 8, -5, 10, 2, 8)],
    bench: [cube(-8, 6, -5, 16, 2, 10), cube(-7, 0, -4, 2, 6, 2), cube(5, 0, -4, 2, 6, 2), cube(-7, 0, 2, 2, 6, 2), cube(5, 0, 2, 2, 6, 2)],
    bed: [cube(-8, 0, -8, 16, 4, 16), cube(-7, 4, -7, 14, 4, 14), cube(-7, 8, 2, 14, 2, 5), cube(-8, 0, 6, 16, 7, 2)],
    futon: [cube(-8, 0, -8, 16, 2, 16), cube(-7, 2, -7, 14, 2, 14), cube(-6, 4, 2, 12, 2, 5)],
    sink: [cube(-8, 0, -8, 16, 10, 16), cube(-7, 10, -7, 14, 3, 14), cube(-4, 12, -5, 8, 1, 8), cube(-1, 13, -1, 2, 3, 1), cube(1, 15, -4, 1, 1, 4)],
    bathtub: [cube(-8, 0, -8, 16, 4, 16), cube(-8, 4, -8, 2, 7, 16), cube(6, 4, -8, 2, 7, 16), cube(-6, 4, -8, 12, 7, 2), cube(-6, 4, 6, 12, 7, 2)],
    toilet: [cube(-4, 0, -4, 8, 5, 8), cube(-5, 5, -5, 10, 4, 10), cube(-5, 9, 2, 10, 6, 4), cube(-2, 13, -6, 4, 2, 3)],
    refrigerator: [cube(-7, 0, -7, 14, 16, 14), cube(-6.5, 8, -7.2, 13, 1, 1), cube(4.5, 2, -8, 1, 5, 1), cube(4.5, 10, -8, 1, 4, 1)],
    stove: [cube(-8, 0, -8, 16, 12, 16), cube(-7, 12, -7, 14, 2, 14), cube(-5, 14, -5, 3, 1, 3), cube(2, 14, -5, 3, 1, 3), cube(-5, 14, 2, 3, 1, 3), cube(2, 14, 2, 3, 1, 3)],
    microwave: [cube(-7, 4, -7, 14, 8, 14), cube(-5, 6, -7.2, 7, 4, 1), cube(4, 6, -7.2, 1, 4, 1), cube(5.5, 7, -7.2, 1, 1, 1), cube(5.5, 9, -7.2, 1, 1, 1)],
    tv_stand: [cube(-8, 0, -7, 16, 7, 14), cube(-7, 2, -7.2, 6, 3, 1), cube(1, 2, -7.2, 6, 3, 1), cube(-7, 7, -7, 14, 1, 14)],
    television: [cube(-7, 6, -7, 14, 8, 2), cube(-2, 2, -6, 4, 4, 2), cube(-5, 0, -6, 10, 2, 5), cube(-6, 7, -7.3, 12, 6, 1)],
    lamp: [cube(-4, 0, -4, 8, 2, 8), cube(-1, 2, -1, 2, 8, 2), cube(-5, 10, -5, 10, 5, 10), cube(-4, 15, -4, 8, 1, 8)],
    floor_lamp: [cube(-4, 0, -4, 8, 1.5, 8), cube(-1, 1.5, -1, 2, 12, 2), cube(-5, 11, -5, 10, 5, 10)],
    plant_stand: [cube(-6, 6, -6, 12, 2, 12), cube(-5, 0, -5, 2, 6, 2), cube(3, 0, -5, 2, 6, 2), cube(-5, 0, 3, 2, 6, 2), cube(3, 0, 3, 2, 6, 2), cube(-4, 8, -4, 8, 5, 8), cube(-3, 13, -3, 6, 3, 6)],
    folding_screen: [cube(-8, 0, -1, 5, 16, 2), cube(-2.5, 0, -1, 5, 16, 2), cube(3, 0, -1, 5, 16, 2), cube(-3, 0, -1.5, 1, 16, 3), cube(2.5, 0, -1.5, 1, 16, 3)],
    rocking_chair: [cube(-6, 6, -5, 12, 2, 10), cube(-6, 8, 4, 12, 8, 2), cube(-6, 0, -5, 2, 7, 2), cube(4, 0, -5, 2, 7, 2), cube(-6, 0, 3, 2, 7, 2), cube(4, 0, 3, 2, 7, 2), cube(-8, 0, -7, 16, 1.5, 2), cube(-8, 0, 5, 16, 1.5, 2)],
    bar_stool: [cube(-5, 11, -5, 10, 2, 10), cube(-1.5, 2, -1.5, 3, 9, 3), cube(-5, 1, -5, 10, 1, 10), cube(-6, 7, -6, 12, 1, 1), cube(-6, 7, 5, 12, 1, 1)],
    ottoman: [cube(-7, 5, -7, 14, 5, 14), cube(-6, 0, -6, 2, 5, 2), cube(4, 0, -6, 2, 5, 2), cube(-6, 0, 4, 2, 5, 2), cube(4, 0, 4, 2, 5, 2)],
    chaise_lounge: [cube(-8, 3, -8, 16, 5, 16), cube(-8, 8, 3, 16, 5, 5), cube(-7, 8, -7, 14, 2, 10), cube(-8, 5, -8, 2, 5, 16), cube(6, 5, -8, 2, 5, 16)],
    picnic_table: [cube(-8, 8, -4, 16, 2, 8), cube(-8, 5, -8, 16, 2, 3), cube(-8, 5, 5, 16, 2, 3), cube(-5, 0, -3, 2, 8, 2), cube(3, 0, -3, 2, 8, 2), cube(-5, 0, 1, 2, 8, 2), cube(3, 0, 1, 2, 8, 2)],
    console_table: [cube(-8, 8, -5, 16, 2, 10), cube(-7, 0, -4, 2, 8, 2), cube(5, 0, -4, 2, 8, 2), cube(-7, 0, 2, 2, 8, 2), cube(5, 0, 2, 2, 8, 2), cube(-6, 5, -5.2, 12, 2, 1)],
    vanity_table: [cube(-8, 8, -7, 16, 2, 14), cube(-8, 0, -7, 2, 8, 14), cube(6, 0, -7, 2, 8, 14), cube(-4, 10, -6, 8, 6, 1), cube(-5, 9, -7, 10, 1, 3), cube(-5, 3, -7.2, 10, 3, 1)],
    drafting_table: [cube(-8, 9, -7, 16, 2, 14), cube(-7, 0, -6, 2, 9, 2), cube(5, 0, -6, 2, 9, 2), cube(-7, 0, 4, 2, 9, 2), cube(5, 0, 4, 2, 9, 2), cube(-6, 11, -5, 12, 1, 10)],
    computer_desk: [cube(-8, 8, -7, 16, 2, 14), cube(-8, 0, -7, 2, 8, 14), cube(6, 0, -7, 2, 8, 14), cube(-5, 10, -6, 10, 5, 1), cube(-2, 8.5, -4, 4, 1, 4), cube(-4, 4, -7.2, 8, 2, 1)],
    kotatsu: [cube(-8, 5, -8, 16, 2, 16), cube(-7, 3, -7, 14, 3, 14), cube(-6, 0, -6, 2, 5, 2), cube(4, 0, -6, 2, 5, 2), cube(-6, 0, 4, 2, 5, 2), cube(4, 0, 4, 2, 5, 2), cube(-3, 0, -3, 6, 3, 6)],
    nightstand: [cube(-6, 0, -6, 12, 11, 12), cube(-5, 2, -6.2, 10, 3, 1), cube(-5, 6, -6.2, 10, 3, 1), cube(-1, 3, -7, 2, 1, 1), cube(-1, 7, -7, 2, 1, 1)],
    shoe_rack: [cube(-8, 0, -7, 16, 2, 14), cube(-8, 6, -7, 16, 2, 14), cube(-8, 12, -7, 16, 2, 14), cube(-8, 0, -7, 2, 14, 14), cube(6, 0, -7, 2, 14, 14), cube(-5, 2, -6, 4, 3, 8), cube(1, 2, -6, 4, 3, 8), cube(-5, 8, -6, 4, 3, 8), cube(1, 8, -6, 4, 3, 8)],
    wine_rack: [cube(-8, 0, -7, 16, 16, 14), cube(-7, 5, -7.2, 14, 2, 1), cube(-7, 10, -7.2, 14, 2, 1), cube(-6, 2, -6, 2, 10, 2), cube(-2, 2, -6, 2, 10, 2), cube(2, 2, -6, 2, 10, 2), cube(6, 2, -6, 2, 10, 2)],
    display_case: [cube(-8, 0, -8, 16, 2, 16), cube(-8, 14, -8, 16, 2, 16), cube(-8, 0, -8, 2, 16, 2), cube(6, 0, -8, 2, 16, 2), cube(-8, 0, 6, 2, 16, 2), cube(6, 0, 6, 2, 16, 2), cube(-7, 2, -7.5, 14, 12, 1), cube(-7, 7, -7, 14, 1, 14)],
    filing_cabinet: [cube(-7, 0, -7, 14, 16, 14), cube(-6, 2, -7.2, 12, 3, 1), cube(-6, 6, -7.2, 12, 3, 1), cube(-6, 10, -7.2, 12, 3, 1), cube(-1, 3, -8, 2, 1, 1), cube(-1, 7, -8, 2, 1, 1), cube(-1, 11, -8, 2, 1, 1)],
    toy_box: [cube(-8, 0, -8, 16, 10, 16), cube(-8, 10, -8, 16, 2, 16), cube(-6, 12, -6, 4, 3, 4), cube(2, 12, -5, 3, 3, 3), cube(-1, 12, 2, 4, 3, 4)],
    kitchen_island: [cube(-8, 0, -8, 16, 12, 16), cube(-8, 12, -8, 16, 3, 16), cube(-6, 2, -8.2, 5, 7, 1), cube(1, 2, -8.2, 5, 7, 1), cube(-4, 15, -4, 8, 1, 8)],
    kitchen_cabinet: [cube(-8, 0, -7, 16, 16, 14), cube(-7, 2, -7.2, 6, 11, 1), cube(1, 2, -7.2, 6, 11, 1), cube(-7, 13, -7, 14, 1, 14), cube(-1, 7, -8, 1, 1, 1), cube(1, 7, -8, 1, 1, 1)],
    dishwasher: [cube(-8, 0, -8, 16, 13, 16), cube(-7, 2, -8.2, 14, 8, 1), cube(-6, 11, -8.2, 12, 1, 1), cube(5, 4, -8.3, 1, 4, 1)],
    shower_booth: [cube(-8, 0, -8, 16, 1, 16), cube(-8, 0, -8, 1, 16, 16), cube(7, 0, -8, 1, 16, 16), cube(-8, 0, 7, 16, 16, 1), cube(-7, 0, -8, 14, 16, 1), cube(-1, 13, 5, 2, 2, 2), cube(-1, 10, 4, 2, 3, 1)],
    bathroom_vanity: [cube(-8, 0, -7, 16, 10, 14), cube(-7, 10, -6, 14, 3, 12), cube(-4, 12, -4, 8, 1, 7), cube(-4, 13, -7, 8, 3, 1), cube(-6, 2, -7.2, 12, 5, 1)],
    wall_mirror: [cube(-6, 2, -7.5, 12, 13, 1), cube(-8, 0, -8, 2, 16, 2), cube(6, 0, -8, 2, 16, 2), cube(-8, 14, -8, 16, 2, 2), cube(-8, 0, -8, 16, 2, 2)],
    towel_rack: [cube(-7, 10, -7.5, 14, 1, 1), cube(-7, 5, -7, 2, 6, 1), cube(5, 5, -7, 2, 6, 1), cube(-6, 4, -6.8, 12, 5, 1)],
    ceiling_light: [cube(-6, 12, -6, 12, 3, 12), cube(-4, 15, -4, 8, 1, 8), cube(-3, 10, -3, 6, 2, 6)],
    chandelier: [cube(-1, 10, -1, 2, 6, 2), cube(-7, 9, -1, 14, 1, 2), cube(-1, 9, -7, 2, 1, 14), cube(-8, 5, -2, 4, 4, 4), cube(4, 5, -2, 4, 4, 4), cube(-2, 5, -8, 4, 4, 4), cube(-2, 5, 4, 4, 4, 4)],
    wall_sconce: [cube(-3, 7, -8, 6, 6, 2), cube(-2, 5, -7, 4, 2, 4), cube(-1, 3, -6, 2, 2, 2)],
    computer: [cube(-7, 7, -7, 14, 8, 2), cube(-2, 3, -6, 4, 4, 2), cube(-5, 1, -6, 10, 2, 5), cube(-6, 8, -7.3, 12, 6, 1), cube(-4, 0, 1, 8, 2, 5)],
    arcade_cabinet: [cube(-7, 0, -7, 14, 16, 14), cube(-6, 9, -7.2, 12, 5, 1), cube(-5, 5, -7.3, 10, 3, 1), cube(-3, 3, -7.4, 2, 1, 1), cube(1, 3, -7.4, 2, 1, 1), cube(-7, 15, -7, 14, 1, 14)],
    speaker: [cube(-6, 0, -6, 12, 16, 12), cube(-4, 10, -6.3, 8, 4, 1), cube(-5, 2, -6.3, 10, 7, 1), cube(-3, 11, -6.5, 6, 2, 1), cube(-3, 4, -6.5, 6, 3, 1)],
    tatami_mat: [cube(-8, 0, -8, 16, 1, 16), cube(-8, 1, -8, 16, 1, 2), cube(-8, 1, 6, 16, 1, 2), cube(-8, 1, -1, 16, 1, 2), cube(-7, 2, -7, 14, 0.5, 14)],
    crate: [cube(-8, 0, -8, 16, 16, 16), cube(-8.2, 2, -8.2, 16.4, 2, 16.4), cube(-8.2, 12, -8.2, 16.4, 2, 16.4), cube(-2, -0.1, -8.3, 4, 16.2, 1), cube(-8.3, -0.1, -2, 1, 16.2, 4), cube(7.3, -0.1, -2, 1, 16.2, 4)],
  };
  return c[typeId];
}

function geometryJson(type) {
  return {
    format_version: "1.12.0",
    "minecraft:geometry": [
      {
        description: {
          identifier: `geometry.furniture_${type.id}`,
          texture_width: 64,
          texture_height: 64,
          visible_bounds_width: 2,
          visible_bounds_height: 2.5,
          visible_bounds_offset: [0, 0.75, 0],
        },
        bones: [
          {
            name: "main",
            pivot: [0, 0, 0],
            cubes: geometryCubes(type.id),
          },
        ],
      },
    ],
  };
}

function blockId(variant, type) {
  return `furniture_${variant.id}_${type.id}`;
}

function textureKey(variant, type) {
  return blockId(variant, type);
}

function names(variant, type) {
  return {
    "ja_JP.lang": variant.ja(type.ja),
    "en_US.lang": `${variant.en} ${type.en}`,
    "en_GB.lang": `${variant.en} ${type.en}`,
    "ko_KR.lang": `${variant.ko} ${type.ko}`,
    "zh_CN.lang": `${variant.zhCn}${type.zhCn}`,
    "zh_TW.lang": `${variant.zhTw}${type.zhTw}`,
  };
}

const storageSlots = {
  cabinet: 27, cupboard: 54, bookshelf: 27, low_shelf: 18,
  wardrobe: 54, dresser: 27, tv_stand: 18, nightstand: 9,
  shoe_rack: 18, wine_rack: 18, display_case: 18, filing_cabinet: 27,
  toy_box: 27, kitchen_island: 27, kitchen_cabinet: 27,
  refrigerator: 54, bathroom_vanity: 18,
};
function blockJson(variant, type) {
  return {
    format_version: storageSlots[type.id] ? "1.26.20" : "1.21.10",
    "minecraft:block": {
      description: {
        identifier: `mc:${blockId(variant, type)}`,
        traits: {
          "minecraft:placement_direction": {
            enabled_states: ["minecraft:cardinal_direction"],
          },
        },
      },
      components: {
        ...(storageSlots[type.id] ? {
          "minecraft:tags": ["furniture", `furniture_${type.id}`],
          "minecraft:block_entity": { container: { slot_count: storageSlots[type.id], title: `tile.mc:${blockId(variant, type)}.name` } },
          "minecraft:movable": { movement_type: "immovable" },
          ...(["refrigerator", "wine_rack"].includes(type.id) ? {
            "mc:storage_restrictions": {},
            "minecraft:tick": { interval_range: [1, 1], looping: true },
          } : {}),
        } : { "tag:furniture": {}, [`tag:furniture_${type.id}`]: {} }),
        "minecraft:destructible_by_mining": {
          seconds_to_destroy: 0.6,
        },
        "minecraft:loot": `loot_tables/blocks/furniture/generated/${blockId(variant, type)}.json`,
        "minecraft:map_color": hex(variant.color),
        "minecraft:collision_box": true,
        "minecraft:selection_box": true,
        "minecraft:geometry": `geometry.furniture_${type.id}`,
        "minecraft:material_instances": {
          "*": {
            texture: textureKey(variant, type),
            render_method: "opaque",
          },
        },
      },
      permutations: [
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'north'",
          components: {
            "minecraft:transformation": {
              rotation: [0, 180, 0],
            },
          },
        },
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'east'",
          components: {
            "minecraft:transformation": {
              rotation: [0, 90, 0],
            },
          },
        },
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'south'",
          components: {
            "minecraft:transformation": {
              rotation: [0, 0, 0],
            },
          },
        },
        {
          condition: "q.block_state('minecraft:cardinal_direction') == 'west'",
          components: {
            "minecraft:transformation": {
              rotation: [0, 270, 0],
            },
          },
        },
      ],
    },
  };
}

function lootJson(variant, type) {
  return {
    pools: [
      {
        rolls: 1,
        entries: [
          {
            type: "item",
            name: `mc:${blockId(variant, type)}`,
            quantity: 1,
            weight: 1,
          },
        ],
      },
    ],
  };
}

function recipeKey(char, variant, type) {
  if (char === "P") return { item: type.primary === "wool" ? variant.material : variant.material };
  if (char === "W") return { item: variant.material };
  if (char === "S") return { item: "minecraft:stick" };
  if (char === "I") return { item: "minecraft:iron_ingot" };
  if (char === "G") return { item: "minecraft:glass_pane" };
  if (char === "R") return { item: "minecraft:redstone" };
  if (char === "B") return { item: "minecraft:book" };
  if (char === "C") return { item: "minecraft:chest" };
  if (char === "T") return { item: "minecraft:torch" };
  if (char === "F") return { item: "minecraft:flower_pot" };
  if (char === "L") return { item: "minecraft:leather" };
  if (char === "Q") return { item: "minecraft:quartz_block" };
  if (char === "V") return { item: "minecraft:glass_bottle" };
  return undefined;
}

function recipeJson(variant, type) {
  const chars = new Set(type.recipe.join("").replaceAll(" ", "").split(""));
  const key = {};
  for (const char of chars) key[char] = recipeKey(char, variant, type);
  return {
    format_version: "1.12",
    "minecraft:recipe_shaped": {
      description: {
        identifier: `mc:${blockId(variant, type)}_recipe`,
      },
      tags: ["crafting_table"],
      pattern: type.recipe,
      key,
      unlock: [
        {
          item: variant.material,
        },
      ],
      result: {
        item: `mc:${blockId(variant, type)}`,
        count: 1,
      },
    },
  };
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function updateTerrainTexture(entries) {
  const filePath = path.join(rpDir, "textures/terrain_texture.json");
  const json = readJson(filePath);
  const data = json.texture_data;
  for (const key of Object.keys(data)) {
    if (key.startsWith("furniture_")) delete data[key];
  }
  for (const [key, texturePath] of entries) {
    data[key] = { textures: texturePath };
  }
  writeJson(filePath, json);
}

function updateCraftingCatalog() {
  const catalog = readJson(CRAFTING_CATALOG_PATH);
  const root = catalog["minecraft:crafting_items_catalog"];
  if (!root || !Array.isArray(root.categories)) {
    throw new Error("Invalid crafting_items_catalog structure");
  }

  let itemsCategory = root.categories.find((category) => category.category_name === "items");
  if (!itemsCategory) {
    itemsCategory = { category_name: "items", groups: [] };
    root.categories.unshift(itemsCategory);
  }
  itemsCategory.groups = (itemsCategory.groups ?? []).filter((group) => {
    const name = group?.group_identifier?.name;
    return typeof name !== "string" || !name.startsWith("mc:furniture_");
  });

  const typeById = new Map(furnitureTypes.map((type) => [type.id, type]));
  for (const group of furnitureGroups) {
    const items = [];
    for (const typeId of group.types) {
      const type = typeById.get(typeId);
      if (!type) throw new Error(`Unknown furniture type in catalog group: ${typeId}`);
      for (const variant of variants) {
        items.push(`mc:${blockId(variant, type)}`);
      }
    }
    itemsCategory.groups.push({
      group_identifier: {
        icon: group.icon,
        name: `mc:${group.id}`,
      },
      items,
    });
  }

  writeJson(CRAFTING_CATALOG_PATH, catalog);
}

function updateLangFiles(langEntries) {
  for (const fileName of LANG_FILES) {
    const filePath = path.join(rpDir, "texts", fileName);
    const original = fs.readFileSync(filePath, "utf8");
    const bom = original.startsWith("\uFEFF") ? "\uFEFF" : "";
    let text = original.replace(/^\uFEFF/u, "").replace(/\r\n/gu, "\n");
    const pattern = new RegExp(`\\n?${LANG_START}[\\s\\S]*?${LANG_END}\\n?`, "u");
    text = text.replace(pattern, "\n");
    text = text.replace(/\s+$/u, "");
    const lines = [LANG_START];
    for (const group of furnitureGroups) {
      const label = group.names[fileName] ?? group.names["en_US.lang"];
      lines.push(`mc:${group.id}=${label}`);
    }
    for (const [id, labels] of langEntries) {
      const label = labels[fileName] ?? labels["en_US.lang"];
      lines.push(`item.mc:${id}=${label}`);
      lines.push(`tile.mc:${id}.name=${label}`);
    }
    lines.push(LANG_END);
    fs.writeFileSync(filePath, `${bom}${text}\n${lines.join("\n")}\n`);
  }
}

function cleanGenerated() {
  for (const dir of [BLOCK_DIR, RECIPE_DIR, LOOT_DIR, TEXTURE_DIR]) {
    fs.rmSync(dir, { recursive: true, force: true });
    ensureDir(dir);
  }
  for (const type of furnitureTypes) {
    fs.rmSync(path.join(MODEL_DIR, `furniture_${type.id}.geo.json`), { force: true });
  }
}

function generate() {
  cleanGenerated();
  const terrainEntries = [];
  const langEntries = [];

  for (const type of furnitureTypes) {
    writeJson(path.join(MODEL_DIR, `furniture_${type.id}.geo.json`), geometryJson(type));
  }

  for (const variant of variants) {
    for (const type of furnitureTypes) {
      const id = blockId(variant, type);
      writeJson(path.join(BLOCK_DIR, `${id}.json`), blockJson(variant, type));
      writeJson(path.join(LOOT_DIR, `${id}.json`), lootJson(variant, type));
      writeJson(path.join(RECIPE_DIR, `${id}.json`), recipeJson(variant, type));
      writePng(path.join(TEXTURE_DIR, `${id}.png`), drawTexture(type, variant));
      terrainEntries.push([textureKey(variant, type), `textures/blocks/furniture/generated/${id}`]);
      langEntries.push([id, names(variant, type)]);
    }
  }

  updateTerrainTexture(terrainEntries);
  updateCraftingCatalog();
  updateLangFiles(langEntries);

  console.log(`Generated ${langEntries.length} furniture blocks`);
  console.log(`Generated ${furnitureTypes.length} furniture geometries`);
}

generate();
