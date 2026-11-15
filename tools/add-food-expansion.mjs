import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const toolDir = path.dirname(fileURLToPath(import.meta.url));
const bpDir = path.resolve(toolDir, "..");
const rpDir = path.resolve(bpDir, "../../development_resource_packs/MakeCountryResourcePack");

const crops = [
  ["cucumber", "Cucumber", "きゅうり", 3],
  ["cabbage", "Cabbage", "キャベツ", 3],
  ["lettuce", "Lettuce", "レタス", 3],
  ["spinach", "Spinach", "ほうれん草", 3],
  ["eggplant", "Eggplant", "なす", 4],
  ["bell_pepper", "Bell Pepper", "ピーマン", 3],
  ["chili_pepper", "Chili Pepper", "唐辛子", 2],
  ["leek", "Leek", "長ねぎ", 3],
  ["ginger", "Ginger", "しょうが", 2],
  ["lotus_root", "Lotus Root", "れんこん", 3],
  ["burdock", "Burdock", "ごぼう", 3],
  ["daikon", "Daikon", "大根", 3],
  ["napa_cabbage", "Napa Cabbage", "白菜", 3],
  ["shiso", "Shiso", "しそ", 2],
  ["sesame", "Sesame", "ごま", 2],
  ["peanut", "Peanut", "落花生", 3],
  ["zucchini", "Zucchini", "ズッキーニ", 3],
  ["asparagus", "Asparagus", "アスパラガス", 3],
].map(([id, en, ja, nutrition]) => ({
  id,
  en,
  ja,
  kind: "crop",
  nutrition,
  texture: `textures/items/generated/${id}`,
}));

const materials = [
  ["cucumber_slice", "Sliced Cucumber", "きゅうりスライス", { "mc:cucumber": 1 }],
  ["cabbage_chopped", "Chopped Cabbage", "刻みキャベツ", { "mc:cabbage": 1 }],
  ["lettuce_leaf", "Lettuce Leaf", "レタスの葉", { "mc:lettuce": 1 }],
  ["spinach_chopped", "Chopped Spinach", "刻みほうれん草", { "mc:spinach": 1 }],
  ["eggplant_slice", "Sliced Eggplant", "なすスライス", { "mc:eggplant": 1 }],
  ["bell_pepper_slice", "Sliced Bell Pepper", "ピーマンスライス", { "mc:bell_pepper": 1 }],
  ["chili_powder", "Chili Powder", "唐辛子粉", { "mc:chili_pepper": 2 }],
  ["leek_chopped", "Chopped Leek", "刻み長ねぎ", { "mc:leek": 1 }],
  ["grated_ginger", "Grated Ginger", "すりおろししょうが", { "mc:ginger": 1 }],
  ["lotus_root_slice", "Sliced Lotus Root", "れんこんスライス", { "mc:lotus_root": 1 }],
  ["burdock_shaved", "Shaved Burdock", "ささがきごぼう", { "mc:burdock": 1 }],
  ["daikon_grated", "Grated Daikon", "大根おろし", { "mc:daikon": 1 }],
  ["napa_cabbage_chopped", "Chopped Napa Cabbage", "刻み白菜", { "mc:napa_cabbage": 1 }],
  ["shiso_leaf", "Shiso Leaf", "しその葉", { "mc:shiso": 1 }],
  ["sesame_seed_powder", "Ground Sesame", "すりごま", { "mc:sesame": 2 }],
  ["peanut_butter", "Peanut Butter", "ピーナッツバター", { "mc:peanut": 3, "minecraft:sugar": 1 }],
  ["zucchini_slice", "Sliced Zucchini", "ズッキーニスライス", { "mc:zucchini": 1 }],
  ["asparagus_cut", "Cut Asparagus", "カットアスパラ", { "mc:asparagus": 1 }],
  ["tempura_batter", "Tempura Batter", "天ぷら衣", { "mc:flour": 2, "minecraft:egg": 1, "mc:water_cup": 1 }],
  ["breadcrumbs", "Breadcrumbs", "パン粉", { "minecraft:bread": 1 }],
  ["curry_powder", "Curry Powder", "カレー粉", { "mc:chili_powder": 1, "mc:pepper": 1, "minecraft:wheat_seeds": 1 }],
  ["soup_stock", "Soup Stock", "スープストック", { "minecraft:bone": 2, "mc:leek_chopped": 1 }],
  ["dashi", "Dashi", "だし", { "minecraft:kelp": 2, "mc:salt": 1 }],
  ["miso_soup_base", "Miso Soup Base", "味噌汁の素", { "mc:miso": 2, "mc:dashi": 1 }],
  ["teriyaki_sauce", "Teriyaki Sauce", "照り焼きソース", { "mc:syoyu": 2, "minecraft:sugar": 1, "mc:sake": 1 }],
  ["mayonnaise", "Mayonnaise", "マヨネーズ", { "minecraft:egg": 1, "mc:vinegar": 1, "mc:food_oil": 1 }],
  ["cream_sauce", "Cream Sauce", "クリームソース", { "mc:milk": 2, "mc:butter": 1, "mc:flour": 1 }],
  ["white_sauce", "White Sauce", "ホワイトソース", { "mc:cream_sauce": 1, "mc:cheese": 1 }],
  ["demi_glace_sauce", "Demi-Glace Sauce", "デミグラスソース", { "mc:beef_leg": 1, "mc:tomato_sauce": 1, "mc:red_wine": 1 }],
  ["mashed_potato", "Mashed Potato", "マッシュポテト", { "minecraft:potato": 2, "mc:butter": 1 }],
  ["potato_starch", "Potato Starch", "片栗粉", { "minecraft:potato": 2 }],
  ["corn_starch", "Corn Starch", "コーンスターチ", { "mc:sweet_corn": 2 }],
  ["udon_noodle", "Udon Noodles", "うどん麺", { "mc:flour": 3, "mc:salt": 1, "mc:water_cup": 1 }],
  ["soba_noodle", "Soba Noodles", "そば麺", { "mc:flour": 1, "mc:rice_powder": 2, "mc:water_cup": 1 }],
  ["ramen_soup", "Ramen Soup", "ラーメンスープ", { "mc:soup_stock": 1, "mc:syoyu": 1, "mc:garlic_mizin": 1 }],
  ["tortilla_dough", "Tortilla Dough", "トルティーヤ生地", { "mc:flour": 2, "mc:food_oil": 1, "mc:water_cup": 1 }],
  ["pie_dough", "Pie Dough", "パイ生地", { "mc:flour": 2, "mc:butter": 2, "minecraft:sugar": 1 }],
  ["custard_cream", "Custard Cream", "カスタードクリーム", { "minecraft:egg": 2, "mc:milk": 1, "minecraft:sugar": 2 }],
  ["whipped_cream", "Whipped Cream", "ホイップクリーム", { "mc:milk": 2, "minecraft:sugar": 1 }],
  ["caramel_sauce", "Caramel Sauce", "キャラメルソース", { "minecraft:sugar": 3, "mc:milk": 1 }],
].map(([id, en, ja, ingredients]) => ({
  id,
  en,
  ja,
  kind: "material",
  ingredients,
  texture: `textures/items/generated/${id}`,
}));

const foods = [
  ["cucumber_salad", "Cucumber Salad", "きゅうりサラダ", 5, "pan", { "mc:cucumber_slice": 2, "mc:vinegar": 1 }, { "mc:salt": 1 }],
  ["cabbage_roll", "Cabbage Roll", "ロールキャベツ", 8, "deep", { "mc:cabbage": 2, "mc:beef_minced_meat": 1, "mc:soup_stock": 1 }, { "mc:pepper": 1 }],
  ["caesar_salad", "Caesar Salad", "シーザーサラダ", 7, "mixer", { "mc:lettuce_leaf": 2, "mc:cheese": 1, "mc:mayonnaise": 1 }, { "mc:pepper": 1 }],
  ["spinach_soup", "Spinach Soup", "ほうれん草スープ", 7, "stew", { "mc:spinach_chopped": 2, "mc:soup_stock": 1, "mc:milk": 1 }, { "mc:salt": 1 }],
  ["eggplant_miso", "Miso Eggplant", "なす味噌", 7, "pan", { "mc:eggplant_slice": 2, "mc:miso": 1, "mc:food_oil": 1 }, { "minecraft:sugar": 1 }],
  ["stuffed_bell_pepper", "Stuffed Bell Pepper", "ピーマンの肉詰め", 9, "oven", { "mc:bell_pepper": 2, "mc:beef_minced_meat": 1, "mc:breadcrumbs": 1 }, { "mc:tomato_catsup": 1 }],
  ["chili_hot_pot", "Chili Hot Pot", "唐辛子鍋", 10, "deep", { "mc:chili_powder": 1, "mc:napa_cabbage_chopped": 2, "minecraft:chicken": 1, "mc:soup_stock": 1 }, { "mc:syoyu": 1 }],
  ["leek_soup", "Leek Soup", "長ねぎスープ", 6, "stew", { "mc:leek_chopped": 2, "mc:soup_stock": 1 }, { "mc:pepper": 1 }],
  ["ginger_pork", "Ginger Pork", "生姜焼き", 9, "pan", { "mc:pork_shoulder_loin": 1, "mc:grated_ginger": 1, "mc:teriyaki_sauce": 1 }, { "mc:syoyu": 1 }],
  ["lotus_root_tempura", "Lotus Root Tempura", "れんこん天ぷら", 7, "fry", { "mc:lotus_root_slice": 2, "mc:food_oil": 2 }, { "mc:tempura_batter": 1 }],
  ["burdock_kinpira", "Kinpira Burdock", "きんぴらごぼう", 7, "pan", { "mc:burdock_shaved": 2, "mc:carrot_mizin": 1, "mc:syoyu": 1 }, { "minecraft:sugar": 1 }],
  ["daikon_stew", "Simmered Daikon", "大根の煮物", 8, "stew", { "mc:daikon": 2, "mc:dashi": 1, "mc:syoyu": 1 }, { "mc:salt": 1 }],
  ["napa_hot_pot", "Napa Hot Pot", "白菜鍋", 9, "deep", { "mc:napa_cabbage_chopped": 3, "minecraft:porkchop": 1, "mc:dashi": 1 }, { "mc:syoyu": 1 }],
  ["shiso_onigiri", "Shiso Rice Ball", "しそおにぎり", 6, "mixer", { "mc:cooked_rice": 1, "mc:shiso_leaf": 1, "mc:salt": 1 }, {}],
  ["sesame_dango", "Sesame Dango", "ごま団子", 7, "fry", { "mc:rice_powder": 2, "mc:anko": 1, "mc:food_oil": 1 }, { "mc:sesame_seed_powder": 1 }],
  ["peanut_cookie", "Peanut Cookie", "ピーナッツクッキー", 6, "oven", { "mc:peanut_butter": 1, "mc:flour": 2, "minecraft:sugar": 1 }, {}],
  ["zucchini_gratin", "Zucchini Gratin", "ズッキーニグラタン", 9, "oven", { "mc:zucchini_slice": 2, "mc:white_sauce": 1, "mc:cheese": 1 }, { "mc:pepper": 1 }],
  ["asparagus_bacon", "Asparagus Bacon", "アスパラベーコン", 8, "pan", { "mc:asparagus_cut": 2, "mc:bacon": 1, "mc:food_oil": 1 }, { "mc:pepper": 1 }],
  ["vegetable_curry", "Vegetable Curry", "野菜カレー", 10, "stew", { "mc:curry_powder": 1, "mc:tomato_sauce": 1, "minecraft:potato": 1, "mc:eggplant_slice": 1 }, { "mc:salt": 1 }],
  ["curry_udon", "Curry Udon", "カレーうどん", 11, "stew", { "mc:vegetable_curry": 1, "mc:udon_noodle": 1, "mc:dashi": 1 }, { "mc:syoyu": 1 }],
  ["kitsune_udon", "Kitsune Udon", "きつねうどん", 9, "stew", { "mc:udon_noodle": 1, "mc:dashi": 1, "mc:soybeans": 1 }, { "mc:syoyu": 1 }],
  ["tempura_udon", "Tempura Udon", "天ぷらうどん", 10, "stew", { "mc:udon_noodle": 1, "mc:dashi": 1, "mc:shrimp_tempra": 1 }, { "mc:leek_chopped": 1 }],
  ["zaru_soba", "Zaru Soba", "ざるそば", 7, "mixer", { "mc:soba_noodle": 1, "mc:dashi": 1, "mc:leek_chopped": 1 }, { "mc:shiso_leaf": 1 }],
  ["yakisoba_bread", "Yakisoba Bread", "焼きそばパン", 8, "mixer", { "mc:yakisoba": 1, "mc:circle_bread": 1, "mc:mayonnaise": 1 }, {}],
  ["okonomiyaki", "Okonomiyaki", "お好み焼き", 10, "pan", { "mc:cabbage_chopped": 2, "mc:flour": 2, "minecraft:egg": 1, "mc:pork_boned_rib": 1 }, { "mc:mayonnaise": 1 }],
  ["takikomi_gohan", "Mixed Rice", "炊き込みご飯", 9, "deep", { "mc:cooked_rice": 1, "mc:burdock_shaved": 1, "mc:carrot_mizin": 1, "mc:dashi": 1 }, { "mc:syoyu": 1 }],
  ["omurice", "Omurice", "オムライス", 10, "pan", { "mc:cooked_rice": 1, "minecraft:egg": 2, "mc:tomato_catsup": 1, "minecraft:chicken": 1 }, { "mc:pepper": 1 }],
  ["hayashi_rice", "Hayashi Rice", "ハヤシライス", 10, "stew", { "mc:cooked_rice": 1, "mc:demi_glace_sauce": 1, "mc:beef_loin": 1, "mc:onion_mizin": 1 }, { "mc:red_wine": 1 }],
  ["croquette", "Croquette", "コロッケ", 8, "fry", { "mc:mashed_potato": 1, "mc:beef_minced_meat": 1, "mc:food_oil": 2 }, { "mc:breadcrumbs": 1 }],
  ["tonkatsu", "Tonkatsu", "とんかつ", 10, "fry", { "mc:pork_chop": 1, "mc:food_oil": 2 }, { "mc:breadcrumbs": 1, "minecraft:egg": 1 }],
  ["ebi_chili", "Shrimp Chili", "エビチリ", 9, "pan", { "mc:shrimp": 2, "mc:chili_powder": 1, "mc:tomato_catsup": 1 }, { "mc:grated_ginger": 1 }],
  ["mapo_tofu", "Mapo Tofu", "麻婆豆腐", 9, "pan", { "mc:soybeans": 2, "mc:beef_minced_meat": 1, "mc:chili_powder": 1 }, { "mc:syoyu": 1 }],
  ["gyoza", "Gyoza", "餃子", 8, "pan", { "mc:flour": 2, "mc:cabbage_chopped": 1, "mc:pork_sasami": 1 }, { "mc:syoyu": 1 }],
  ["shumai", "Shumai", "焼売", 8, "stew", { "mc:flour": 2, "mc:pork_sasami": 1, "mc:onion_mizin": 1 }, { "mc:grated_ginger": 1 }],
  ["nikuman", "Steamed Meat Bun", "肉まん", 9, "stew", { "mc:bread_material": 1, "mc:pork_boned_rib": 1, "mc:cabbage_chopped": 1 }, { "mc:syoyu": 1 }],
  ["cream_stew", "Cream Stew", "クリームシチュー", 10, "stew", { "mc:white_sauce": 1, "minecraft:chicken": 1, "minecraft:potato": 1, "mc:carrot_mizin": 1 }, { "mc:salt": 1 }],
  ["gratin", "Gratin", "グラタン", 10, "oven", { "mc:macaroni": 1, "mc:white_sauce": 1, "mc:cheese": 1 }, { "mc:breadcrumbs": 1 }],
  ["pancakes", "Pancakes", "パンケーキ", 8, "pan", { "mc:flour": 2, "minecraft:egg": 1, "mc:milk": 1, "minecraft:sugar": 1 }, { "mc:caramel_sauce": 1 }],
  ["apple_pie", "Apple Pie", "アップルパイ", 9, "oven", { "mc:pie_dough": 1, "minecraft:apple": 2, "minecraft:sugar": 1 }, { "mc:caramel_sauce": 1 }],
  ["pudding", "Pudding", "プリン", 7, "stew", { "mc:milk": 1, "minecraft:egg": 2, "minecraft:sugar": 1 }, { "mc:caramel_sauce": 1 }],
  ["fruit_parfait", "Fruit Parfait", "フルーツパフェ", 9, "mixer", { "mc:whipped_cream": 1, "mc:straw_berry": 1, "mc:pineapple_cut": 1, "minecraft:apple": 1 }, { "minecraft:sugar": 1 }],
  ["matcha_latte", "Matcha Latte", "抹茶ラテ", 5, "mixer", { "mc:green_tea": 1, "mc:milk": 1, "minecraft:sugar": 1 }, {}],
].map(([id, en, ja, nutrition, station, ingredients, extras]) => ({
  id,
  en,
  ja,
  kind: "food",
  nutrition,
  station,
  ingredients,
  extras,
  texture: `textures/items/generated/${id}`,
}));

const CUISINE_THEMES = [
  { id: "chicken", en: "Chicken", ja: "チキン", ingredients: { "minecraft:chicken": 1 }, extras: { "mc:pepper": 1 }, nutrition: 3, color: [216, 154, 82] },
  { id: "pork", en: "Pork", ja: "ポーク", ingredients: { "mc:pork_chop": 1 }, extras: { "mc:salt": 1 }, nutrition: 4, color: [210, 125, 93] },
  { id: "beef", en: "Beef", ja: "ビーフ", ingredients: { "mc:beef_loin": 1 }, extras: { "mc:pepper": 1 }, nutrition: 4, color: [143, 69, 45] },
  { id: "shrimp", en: "Shrimp", ja: "エビ", ingredients: { "mc:shrimp": 1 }, extras: { "mc:salt": 1 }, nutrition: 3, color: [226, 111, 75] },
  { id: "squid", en: "Squid", ja: "イカ", ingredients: { "mc:squid": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 3, color: [224, 213, 195] },
  { id: "salmon", en: "Salmon", ja: "サーモン", ingredients: { "minecraft:salmon": 1 }, extras: { "mc:salt": 1 }, nutrition: 3, color: [234, 111, 83] },
  { id: "tuna", en: "Tuna", ja: "マグロ", ingredients: { "mc:tuna": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 3, color: [169, 55, 63] },
  { id: "egg", en: "Egg", ja: "たまご", ingredients: { "minecraft:egg": 2 }, extras: { "mc:salt": 1 }, nutrition: 2, color: [234, 198, 65] },
  { id: "cheese", en: "Cheese", ja: "チーズ", ingredients: { "mc:cheese": 1 }, extras: { "mc:pepper": 1 }, nutrition: 3, color: [238, 199, 80] },
  { id: "bacon", en: "Bacon", ja: "ベーコン", ingredients: { "mc:bacon": 1 }, extras: { "mc:pepper": 1 }, nutrition: 4, color: [202, 92, 65] },
  { id: "mushroom", en: "Mushroom", ja: "きのこ", ingredients: { "minecraft:brown_mushroom": 2 }, extras: { "mc:salt": 1 }, nutrition: 2, color: [164, 119, 78] },
  { id: "potato", en: "Potato", ja: "ポテト", ingredients: { "minecraft:potato": 2 }, extras: { "mc:salt": 1 }, nutrition: 3, color: [213, 180, 96] },
  { id: "cabbage", en: "Cabbage", ja: "キャベツ", ingredients: { "mc:cabbage_chopped": 1 }, extras: { "mc:salt": 1 }, nutrition: 2, color: [124, 190, 84] },
  { id: "spinach", en: "Spinach", ja: "ほうれん草", ingredients: { "mc:spinach_chopped": 1 }, extras: { "mc:pepper": 1 }, nutrition: 2, color: [61, 139, 66] },
  { id: "eggplant", en: "Eggplant", ja: "なす", ingredients: { "mc:eggplant_slice": 1 }, extras: { "mc:miso": 1 }, nutrition: 2, color: [106, 63, 151] },
  { id: "bell_pepper", en: "Bell Pepper", ja: "ピーマン", ingredients: { "mc:bell_pepper_slice": 1 }, extras: { "mc:salt": 1 }, nutrition: 2, color: [61, 159, 66] },
  { id: "leek", en: "Leek", ja: "長ねぎ", ingredients: { "mc:leek_chopped": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 2, color: [176, 209, 111] },
  { id: "ginger", en: "Ginger", ja: "しょうが", ingredients: { "mc:grated_ginger": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 2, color: [199, 142, 73] },
  { id: "garlic", en: "Garlic", ja: "ガーリック", ingredients: { "mc:garlic_mizin": 1 }, extras: { "mc:pepper": 1 }, nutrition: 2, color: [223, 211, 162] },
  { id: "chili", en: "Chili", ja: "チリ", ingredients: { "mc:chili_powder": 1 }, extras: { "mc:pepper": 1 }, nutrition: 2, color: [202, 57, 41] },
  { id: "tomato", en: "Tomato", ja: "トマト", ingredients: { "mc:tomato_sauce": 1 }, extras: { "mc:basil": 1 }, nutrition: 2, color: [190, 60, 44] },
  { id: "curry", en: "Curry", ja: "カレー", ingredients: { "mc:curry_powder": 1 }, extras: { "mc:pepper": 1 }, nutrition: 3, color: [186, 117, 35] },
  { id: "miso", en: "Miso", ja: "味噌", ingredients: { "mc:miso": 1 }, extras: { "mc:dashi": 1 }, nutrition: 2, color: [145, 81, 45] },
  { id: "soy", en: "Soy Sauce", ja: "醤油", ingredients: { "mc:syoyu": 1 }, extras: { "mc:leek_chopped": 1 }, nutrition: 2, color: [89, 50, 35] },
  { id: "teriyaki", en: "Teriyaki", ja: "照り焼き", ingredients: { "mc:teriyaki_sauce": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 3, color: [154, 75, 38] },
  { id: "sesame", en: "Sesame", ja: "ごま", ingredients: { "mc:sesame_seed_powder": 1 }, extras: { "mc:salt": 1 }, nutrition: 2, color: [212, 184, 116] },
  { id: "peanut", en: "Peanut", ja: "ピーナッツ", ingredients: { "mc:peanut_butter": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 3, color: [196, 130, 61] },
  { id: "cream", en: "Cream", ja: "クリーム", ingredients: { "mc:cream_sauce": 1 }, extras: { "mc:pepper": 1 }, nutrition: 3, color: [236, 224, 187] },
  { id: "butter", en: "Butter", ja: "バター", ingredients: { "mc:butter": 1 }, extras: { "mc:salt": 1 }, nutrition: 3, color: [235, 199, 81] },
  { id: "herb", en: "Herb", ja: "ハーブ", ingredients: { "mc:basil": 1, "mc:shiso_leaf": 1 }, extras: { "mc:ovlive_oil": 1 }, nutrition: 2, color: [82, 156, 74] },
  { id: "daikon", en: "Daikon", ja: "大根", ingredients: { "mc:daikon_grated": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 2, color: [226, 227, 202] },
  { id: "burdock", en: "Burdock", ja: "ごぼう", ingredients: { "mc:burdock_shaved": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 2, color: [139, 88, 49] },
  { id: "lotus_root", en: "Lotus Root", ja: "れんこん", ingredients: { "mc:lotus_root_slice": 1 }, extras: { "mc:salt": 1 }, nutrition: 2, color: [216, 191, 145] },
  { id: "asparagus", en: "Asparagus", ja: "アスパラ", ingredients: { "mc:asparagus_cut": 1 }, extras: { "mc:butter": 1 }, nutrition: 2, color: [77, 153, 70] },
  { id: "zucchini", en: "Zucchini", ja: "ズッキーニ", ingredients: { "mc:zucchini_slice": 1 }, extras: { "mc:ovlive_oil": 1 }, nutrition: 2, color: [70, 139, 77] },
  { id: "pineapple", en: "Pineapple", ja: "パイナップル", ingredients: { "mc:pineapple_cut": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 2, color: [228, 183, 62] },
  { id: "apple", en: "Apple", ja: "りんご", ingredients: { "minecraft:apple": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 2, color: [203, 63, 57] },
  { id: "strawberry", en: "Strawberry", ja: "いちご", ingredients: { "mc:straw_berry": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 2, color: [224, 75, 95] },
  { id: "matcha", en: "Matcha", ja: "抹茶", ingredients: { "mc:green_tea": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 2, color: [122, 169, 83] },
  { id: "mikan", en: "Mandarin", ja: "みかん", ingredients: { "mc:mikan": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 2, color: [226, 133, 50] },
];

const CUISINE_TYPES = [
  { id: "rice_bowl", en: "Rice Bowl", ja: "ご飯", station: "mixer", ingredients: { "mc:cooked_rice": 1 }, extras: { "mc:salt": 1 }, nutrition: 4 },
  { id: "donburi", en: "Donburi", ja: "丼", station: "pan", ingredients: { "mc:cooked_rice": 1, "mc:onion_mizin": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 5 },
  { id: "fried_rice", en: "Fried Rice", ja: "チャーハン", station: "pan", ingredients: { "mc:cooked_rice": 1, "minecraft:egg": 1, "mc:food_oil": 1 }, extras: { "mc:pepper": 1 }, nutrition: 5 },
  { id: "curry_rice", en: "Curry Rice", ja: "カレーライス", station: "stew", ingredients: { "mc:cooked_rice": 1, "mc:curry_powder": 1, "mc:tomato_sauce": 1 }, extras: { "mc:salt": 1 }, nutrition: 6 },
  { id: "pilaf", en: "Pilaf", ja: "ピラフ", station: "pan", ingredients: { "mc:cooked_rice": 1, "mc:butter": 1, "mc:onion_mizin": 1 }, extras: { "mc:pepper": 1 }, nutrition: 5 },
  { id: "onigiri", en: "Onigiri", ja: "おにぎり", station: "mixer", ingredients: { "mc:cooked_rice": 1, "mc:salt": 1 }, extras: { "minecraft:kelp": 1 }, nutrition: 4 },
  { id: "sushi_roll", en: "Sushi Roll", ja: "巻き寿司", station: "mixer", ingredients: { "mc:cooked_rice_vinegared": 1, "minecraft:kelp": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 4 },
  { id: "udon", en: "Udon", ja: "うどん", station: "stew", ingredients: { "mc:udon_noodle": 1, "mc:dashi": 1 }, extras: { "mc:leek_chopped": 1 }, nutrition: 5 },
  { id: "soba", en: "Soba", ja: "そば", station: "stew", ingredients: { "mc:soba_noodle": 1, "mc:dashi": 1 }, extras: { "mc:leek_chopped": 1 }, nutrition: 5 },
  { id: "ramen", en: "Ramen", ja: "ラーメン", station: "stew", ingredients: { "mc:noodle": 1, "mc:ramen_soup": 1 }, extras: { "mc:garlic_mizin": 1 }, nutrition: 6 },
  { id: "pasta", en: "Pasta", ja: "パスタ", station: "pan", ingredients: { "mc:macaroni": 1, "mc:ovlive_oil": 1 }, extras: { "mc:pepper": 1 }, nutrition: 5 },
  { id: "spaghetti", en: "Spaghetti", ja: "スパゲッティ", station: "pan", ingredients: { "mc:noodle": 1, "mc:ovlive_oil": 1 }, extras: { "mc:pepper": 1 }, nutrition: 5 },
  { id: "soup", en: "Soup", ja: "スープ", station: "stew", ingredients: { "mc:soup_stock": 1, "mc:leek_chopped": 1 }, extras: { "mc:salt": 1 }, nutrition: 4 },
  { id: "stew", en: "Stew", ja: "シチュー", station: "deep", ingredients: { "mc:soup_stock": 1, "minecraft:potato": 1, "minecraft:carrot": 1 }, extras: { "mc:pepper": 1 }, nutrition: 6 },
  { id: "hot_pot", en: "Hot Pot", ja: "鍋", station: "deep", ingredients: { "mc:napa_cabbage_chopped": 1, "mc:dashi": 1, "mc:leek_chopped": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 6 },
  { id: "salad", en: "Salad", ja: "サラダ", station: "mixer", ingredients: { "mc:lettuce_leaf": 1, "mc:cucumber_slice": 1 }, extras: { "mc:mayonnaise": 1 }, nutrition: 4 },
  { id: "sandwich", en: "Sandwich", ja: "サンド", station: "mixer", ingredients: { "minecraft:bread": 1, "mc:lettuce_leaf": 1 }, extras: { "mc:mayonnaise": 1 }, nutrition: 5 },
  { id: "burger", en: "Burger", ja: "バーガー", station: "pan", ingredients: { "mc:buns": 1, "mc:lettuce_leaf": 1, "mc:tomato_slice": 1 }, extras: { "mc:tomato_catsup": 1 }, nutrition: 6 },
  { id: "pizza", en: "Pizza", ja: "ピザ", station: "oven", ingredients: { "mc:pizza_dough": 1, "mc:cheese": 1, "mc:tomato_sauce": 1 }, extras: { "mc:basil": 1 }, nutrition: 6 },
  { id: "gratin", en: "Gratin", ja: "グラタン", station: "oven", ingredients: { "mc:macaroni": 1, "mc:white_sauce": 1, "mc:cheese": 1 }, extras: { "mc:breadcrumbs": 1 }, nutrition: 6 },
  { id: "pie", en: "Pie", ja: "パイ", station: "oven", ingredients: { "mc:pie_dough": 1, "mc:butter": 1 }, extras: { "minecraft:sugar": 1 }, nutrition: 5 },
  { id: "dumpling", en: "Dumpling", ja: "団子", station: "stew", ingredients: { "mc:flour": 1, "mc:water_cup": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 4 },
  { id: "gyoza", en: "Gyoza", ja: "餃子", station: "pan", ingredients: { "mc:flour": 1, "mc:cabbage_chopped": 1, "mc:food_oil": 1 }, extras: { "mc:syoyu": 1 }, nutrition: 5 },
  { id: "tempura", en: "Tempura", ja: "天ぷら", station: "fry", ingredients: { "mc:food_oil": 2 }, extras: { "mc:tempura_batter": 1 }, nutrition: 5 },
  { id: "cutlet", en: "Cutlet", ja: "カツ", station: "fry", ingredients: { "mc:food_oil": 2 }, extras: { "mc:breadcrumbs": 1, "minecraft:egg": 1 }, nutrition: 6 },
];

function mergeIngredients(...sources) {
  const merged = {};
  for (const source of sources) {
    for (const [id, amount] of Object.entries(source ?? {})) {
      merged[id] = (merged[id] ?? 0) + amount;
    }
  }
  return merged;
}

function createCuisineExpansion() {
  const result = [];
  for (const theme of CUISINE_THEMES) {
    for (const type of CUISINE_TYPES) {
      const id = `cuisine_${theme.id}_${type.id}`;
      result.push({
        id,
        en: `${theme.en} ${type.en}`,
        ja: `${theme.ja}${type.ja}`,
        kind: "food",
        nutrition: Math.min(14, theme.nutrition + type.nutrition),
        station: type.station,
        ingredients: mergeIngredients(type.ingredients, theme.ingredients),
        extras: mergeIngredients(type.extras, theme.extras),
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  if (result.length !== 1000) {
    throw new Error(`Expected 1000 cuisine expansion foods, got ${result.length}`);
  }
  return result;
}

const cuisineExpansionFoods = createCuisineExpansion();
foods.push(...cuisineExpansionFoods);

const LANG_FILES = ["ja_JP.lang", "en_US.lang", "en_GB.lang", "ko_KR.lang", "zh_CN.lang", "zh_TW.lang"];

function readLangItems(fileName) {
  const filePath = path.join(rpDir, "texts", fileName);
  const text = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/u, "");
  const entries = new Map();
  for (const line of text.split(/\r?\n/u)) {
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    entries.set(line.slice(0, eq), line.slice(eq + 1));
  }
  return entries;
}

const langItems = Object.fromEntries(LANG_FILES.map((fileName) => [fileName, readLangItems(fileName)]));

function titleFromId(id) {
  return id
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function naturalJapaneseFishName(fishId) {
  return langItems["ja_JP.lang"]?.get(`item.mc:${fishId}`) ?? titleFromId(fishId);
}

function localizedFishName(fishId, fileName) {
  if (fileName === "ja_JP.lang") return naturalJapaneseFishName(fishId);
  const key = `item.mc:${fishId}`;
  return langItems[fileName]?.get(key) ?? langItems["en_US.lang"]?.get(key) ?? titleFromId(fishId);
}

const fishNameTemplates = {
  "ja_JP.lang": {
    fillet: (name) => `${name}の切り身`,
    mince: (name) => `${name}のすり身`,
    stock: (name) => `${name}のだし`,
    grilled: (name) => `焼き${name}`,
    soup: (name) => `${name}スープ`,
    nigiri: (name) => `${name}の握り寿司`,
  },
  "en_US.lang": {
    fillet: (name) => `${name} Fillet`,
    mince: (name) => `Minced ${name}`,
    stock: (name) => `${name} Stock`,
    grilled: (name) => `Grilled ${name}`,
    soup: (name) => `${name} Soup`,
    nigiri: (name) => `${name} Nigiri`,
  },
  "en_GB.lang": {
    fillet: (name) => `${name} Fillet`,
    mince: (name) => `Minced ${name}`,
    stock: (name) => `${name} Stock`,
    grilled: (name) => `Grilled ${name}`,
    soup: (name) => `${name} Soup`,
    nigiri: (name) => `${name} Nigiri`,
  },
  "ko_KR.lang": {
    fillet: (name) => `${name} 살코기`,
    mince: (name) => `다진 ${name}`,
    stock: (name) => `${name} 육수`,
    grilled: (name) => `구운 ${name}`,
    soup: (name) => `${name} 수프`,
    nigiri: (name) => `${name} 니기리 초밥`,
  },
  "zh_CN.lang": {
    fillet: (name) => `${name}鱼片`,
    mince: (name) => `${name}鱼糜`,
    stock: (name) => `${name}高汤`,
    grilled: (name) => `烤${name}`,
    soup: (name) => `${name}汤`,
    nigiri: (name) => `${name}握寿司`,
  },
  "zh_TW.lang": {
    fillet: (name) => `${name}魚片`,
    mince: (name) => `${name}魚漿`,
    stock: (name) => `${name}高湯`,
    grilled: (name) => `烤${name}`,
    soup: (name) => `${name}湯`,
    nigiri: (name) => `${name}握壽司`,
  },
};

function fishNames(fishId, variant) {
  return Object.fromEntries(
    LANG_FILES.map((fileName) => {
      const template = fishNameTemplates[fileName]?.[variant] ?? fishNameTemplates["en_US.lang"][variant];
      return [fileName, template(localizedFishName(fishId, fileName))];
    }),
  );
}

function firstName(names, fileName) {
  return names[fileName] ?? names["en_US.lang"];
}

const fishIds = fs
  .readdirSync(path.join(bpDir, "items/fish"))
  .filter((fileName) => fileName.endsWith(".json"))
  .map((fileName) => fileName.replace(/\.json$/u, ""))
  .sort((a, b) => a.localeCompare(b));

// The fishing catalog contains the 626 custom fish above plus four vanilla fish.
// Salmon roe is included as the 631st sushi topping requested by the community.
const nigiriSources = [
  ...fishIds.map((id) => ({ id, ingredient: `mc:${id}` })),
  { id: "cod", ingredient: "minecraft:cod", names: langNames("Cod Nigiri", "タラの握り寿司", "대구 니기리 초밥", "鳕鱼握寿司", "鱈魚握壽司") },
  { id: "salmon", ingredient: "minecraft:salmon", names: langNames("Salmon Nigiri", "サケの握り寿司", "연어 니기리 초밥", "鲑鱼握寿司", "鮭魚握壽司") },
  { id: "tropical_fish", ingredient: "minecraft:tropical_fish", names: langNames("Tropical Fish Nigiri", "熱帯魚の握り寿司", "열대어 니기리 초밥", "热带鱼握寿司", "熱帶魚握壽司") },
  { id: "pufferfish", ingredient: "minecraft:pufferfish", names: langNames("Pufferfish Nigiri", "フグの握り寿司", "복어 니기리 초밥", "河豚握寿司", "河豚握壽司") },
  {
    id: "salmon_roe",
    ingredient: "minecraft:salmon",
    names: {
      "ja_JP.lang": "イクラ握り寿司",
      "en_US.lang": "Salmon Roe Nigiri",
      "en_GB.lang": "Salmon Roe Nigiri",
      "ko_KR.lang": "연어알 니기리 초밥",
      "zh_CN.lang": "鲑鱼子握寿司",
      "zh_TW.lang": "鮭魚卵握壽司",
    },
  },
];

function nigiriNames(source) {
  if (source.names) return source.names;
  return fishNames(source.id, "nigiri");
}

function createFishPreparationMaterials() {
  const result = [];
  for (const [index, fishId] of fishIds.entries()) {
    const filletId = `fish_fillet_${fishId}`;
    const minceId = `fish_mince_${fishId}`;
    const stockId = `fish_stock_${fishId}`;
    const baseLevel = 1 + (index % 4);

    result.push({
      id: filletId,
      en: fishNameTemplates["en_US.lang"].fillet(localizedFishName(fishId, "en_US.lang")),
      ja: fishNameTemplates["ja_JP.lang"].fillet(localizedFishName(fishId, "ja_JP.lang")),
      names: fishNames(fishId, "fillet"),
      kind: "material",
      station: "cutting_board",
      ingredients: { [`mc:${fishId}`]: 1 },
      result: { id: `mc:${filletId}`, count: 2 },
      requiredLevel: baseLevel,
      texture: `textures/items/generated/${filletId}`,
    });

    result.push({
      id: minceId,
      en: fishNameTemplates["en_US.lang"].mince(localizedFishName(fishId, "en_US.lang")),
      ja: fishNameTemplates["ja_JP.lang"].mince(localizedFishName(fishId, "ja_JP.lang")),
      names: fishNames(fishId, "mince"),
      kind: "material",
      station: "mixer",
      ingredients: { [`mc:${filletId}`]: 1 },
      result: { id: `mc:${minceId}`, count: 2 },
      requiredLevel: baseLevel + 1,
      baseActions: 6 + (index % 3),
      texture: `textures/items/generated/${minceId}`,
    });

    result.push({
      id: stockId,
      en: fishNameTemplates["en_US.lang"].stock(localizedFishName(fishId, "en_US.lang")),
      ja: fishNameTemplates["ja_JP.lang"].stock(localizedFishName(fishId, "ja_JP.lang")),
      names: fishNames(fishId, "stock"),
      kind: "material",
      station: "stew",
      ingredients: { [`mc:${filletId}`]: 1, "mc:water_cup": 1 },
      extras: { "mc:salt": 1 },
      result: { id: `mc:${stockId}`, count: 2 },
      requiredLevel: baseLevel + 1,
      baseActions: 7 + (index % 4),
      texture: `textures/items/generated/${stockId}`,
    });
  }
  return result;
}

function fishNutrition(fishId, base) {
  return Math.min(14, base + (Math.abs(hashColor(fishId)[0]) % 4));
}

function createFishExpansionFoods() {
  const result = [];
  for (const [index, fishId] of fishIds.entries()) {
    const filletId = `fish_fillet_${fishId}`;
    const stockId = `fish_stock_${fishId}`;
    const grilledId = `fish_grilled_${fishId}`;
    const soupId = `fish_soup_${fishId}`;
    const baseLevel = 1 + (index % 4);

    result.push({
      id: grilledId,
      en: fishNameTemplates["en_US.lang"].grilled(localizedFishName(fishId, "en_US.lang")),
      ja: fishNameTemplates["ja_JP.lang"].grilled(localizedFishName(fishId, "ja_JP.lang")),
      names: fishNames(fishId, "grilled"),
      kind: "food",
      nutrition: fishNutrition(fishId, 5),
      station: "pan",
      ingredients: { [`mc:${filletId}`]: 1, "mc:food_oil": 1 },
      extras: { "mc:salt": 1 },
      requiredLevel: baseLevel,
      baseActions: 6 + (index % 4),
      texture: `textures/items/generated/${grilledId}`,
    });

    result.push({
      id: soupId,
      en: fishNameTemplates["en_US.lang"].soup(localizedFishName(fishId, "en_US.lang")),
      ja: fishNameTemplates["ja_JP.lang"].soup(localizedFishName(fishId, "ja_JP.lang")),
      names: fishNames(fishId, "soup"),
      kind: "food",
      nutrition: fishNutrition(fishId, 6),
      station: "stew",
      ingredients: { [`mc:${stockId}`]: 1, "mc:leek_chopped": 1 },
      extras: { "mc:pepper": 1 },
      requiredLevel: baseLevel + 1,
      baseActions: 7 + (index % 4),
      texture: `textures/items/generated/${soupId}`,
    });
  }
  return result;
}

function createFishNigiriFoods() {
  return nigiriSources.map((source, index) => {
    const id = `fish_nigiri_${source.id}`;
    const names = nigiriNames(source);
    return {
      id,
      en: names["en_US.lang"],
      ja: names["ja_JP.lang"],
      names,
      kind: "food",
      nutrition: fishNutrition(source.id, 5),
      station: "cutting_board",
      ingredients: {
        "mc:cooked_rice_vinegared": 1,
        [source.ingredient]: 1,
      },
      requiredLevel: 1 + (index % 5),
      texture: `textures/items/generated/${id}`,
    };
  });
}

const fishPreparationMaterials = createFishPreparationMaterials();
const fishExpansionFoods = createFishExpansionFoods();
const fishNigiriFoods = createFishNigiriFoods();
if (fishNigiriFoods.length !== 631) {
  throw new Error(`Unexpected nigiri count: ${fishNigiriFoods.length}`);
}
const fishExpansionItems = [...fishPreparationMaterials, ...fishExpansionFoods, ...fishNigiriFoods];

function langNames(en, ja, ko, zhCn, zhTw) {
  return {
    "ja_JP.lang": ja,
    "en_US.lang": en,
    "en_GB.lang": en,
    "ko_KR.lang": ko,
    "zh_CN.lang": zhCn,
    "zh_TW.lang": zhTw,
  };
}

function homeTheme(id, en, ja, ko, zhCn, zhTw, ingredients, nutrition = 3) {
  return {
    id,
    names: langNames(en, ja, ko, zhCn, zhTw),
    ingredients,
    nutrition,
  };
}

const HOME_THEMES = [
  homeTheme("chicken", "Chicken", "鶏肉", "치킨", "鸡肉", "雞肉", { "minecraft:chicken": 1 }, 3),
  homeTheme("pork", "Pork", "豚肉", "돼지고기", "猪肉", "豬肉", { "mc:pork_chop": 1 }, 4),
  homeTheme("beef", "Beef", "牛肉", "소고기", "牛肉", "牛肉", { "mc:beef_loin": 1 }, 4),
  homeTheme("bacon", "Bacon", "ベーコン", "베이컨", "培根", "培根", { "mc:bacon": 1 }, 4),
  homeTheme("egg", "Egg", "たまご", "달걀", "鸡蛋", "雞蛋", { "minecraft:egg": 2 }, 2),
  homeTheme("cheese", "Cheese", "チーズ", "치즈", "奶酪", "起司", { "mc:cheese": 1 }, 3),
  homeTheme("mushroom", "Mushroom", "きのこ", "버섯", "蘑菇", "蘑菇", { "minecraft:brown_mushroom": 2 }, 2),
  homeTheme("potato", "Potato", "じゃがいも", "감자", "土豆", "馬鈴薯", { "minecraft:potato": 2 }, 3),
  homeTheme("carrot", "Carrot", "にんじん", "당근", "胡萝卜", "胡蘿蔔", { "minecraft:carrot": 2 }, 2),
  homeTheme("onion", "Onion", "玉ねぎ", "양파", "洋葱", "洋蔥", { "mc:onion": 1 }, 2),
  homeTheme("cabbage", "Cabbage", "キャベツ", "양배추", "卷心菜", "高麗菜", { "mc:cabbage_chopped": 1 }, 2),
  homeTheme("spinach", "Spinach", "ほうれん草", "시금치", "菠菜", "菠菜", { "mc:spinach_chopped": 1 }, 2),
  homeTheme("eggplant", "Eggplant", "なす", "가지", "茄子", "茄子", { "mc:eggplant_slice": 1 }, 2),
  homeTheme("bell_pepper", "Bell Pepper", "ピーマン", "피망", "青椒", "青椒", { "mc:bell_pepper_slice": 1 }, 2),
  homeTheme("leek", "Leek", "長ねぎ", "대파", "大葱", "大蔥", { "mc:leek_chopped": 1 }, 2),
  homeTheme("ginger", "Ginger", "しょうが", "생강", "生姜", "生薑", { "mc:grated_ginger": 1 }, 2),
  homeTheme("garlic", "Garlic", "にんにく", "마늘", "大蒜", "大蒜", { "mc:garlic_mizin": 1 }, 2),
  homeTheme("chili", "Chili", "唐辛子", "칠리", "辣椒", "辣椒", { "mc:chili_powder": 1 }, 2),
  homeTheme("tomato", "Tomato", "トマト", "토마토", "番茄", "番茄", { "mc:tomato_sauce": 1 }, 2),
  homeTheme("curry", "Curry", "カレー", "카레", "咖喱", "咖哩", { "mc:curry_powder": 1 }, 3),
  homeTheme("miso", "Miso", "味噌", "된장", "味噌", "味噌", { "mc:miso": 1 }, 2),
  homeTheme("soy_sauce", "Soy Sauce", "醤油", "간장", "酱油", "醬油", { "mc:syoyu": 1 }, 2),
  homeTheme("teriyaki", "Teriyaki", "照り焼き", "데리야키", "照烧", "照燒", { "mc:teriyaki_sauce": 1 }, 3),
  homeTheme("sesame", "Sesame", "ごま", "참깨", "芝麻", "芝麻", { "mc:sesame_seed_powder": 1 }, 2),
  homeTheme("peanut", "Peanut", "ピーナッツ", "땅콩", "花生", "花生", { "mc:peanut_butter": 1 }, 3),
  homeTheme("cream", "Cream", "クリーム", "크림", "奶油", "奶油", { "mc:cream_sauce": 1 }, 3),
  homeTheme("butter", "Butter", "バター", "버터", "黄油", "奶油", { "mc:butter": 1 }, 3),
  homeTheme("herb", "Herb", "ハーブ", "허브", "香草", "香草", { "mc:basil": 1, "mc:shiso_leaf": 1 }, 2),
  homeTheme("daikon", "Daikon", "大根", "무", "白萝卜", "白蘿蔔", { "mc:daikon_grated": 1 }, 2),
  homeTheme("burdock", "Burdock", "ごぼう", "우엉", "牛蒡", "牛蒡", { "mc:burdock_shaved": 1 }, 2),
  homeTheme("lotus_root", "Lotus Root", "れんこん", "연근", "莲藕", "蓮藕", { "mc:lotus_root_slice": 1 }, 2),
  homeTheme("asparagus", "Asparagus", "アスパラ", "아스파라거스", "芦笋", "蘆筍", { "mc:asparagus_cut": 1 }, 2),
  homeTheme("zucchini", "Zucchini", "ズッキーニ", "주키니", "西葫芦", "櫛瓜", { "mc:zucchini_slice": 1 }, 2),
  homeTheme("pineapple", "Pineapple", "パイナップル", "파인애플", "菠萝", "鳳梨", { "mc:pineapple_cut": 1 }, 2),
  homeTheme("apple", "Apple", "りんご", "사과", "苹果", "蘋果", { "minecraft:apple": 1 }, 2),
  homeTheme("strawberry", "Strawberry", "いちご", "딸기", "草莓", "草莓", { "mc:straw_berry": 1 }, 2),
  homeTheme("matcha", "Matcha", "抹茶", "말차", "抹茶", "抹茶", { "mc:green_tea": 1 }, 2),
  homeTheme("mikan", "Mandarin", "みかん", "귤", "橘子", "橘子", { "mc:mikan": 1 }, 2),
  homeTheme("rice", "Rice", "ご飯", "밥", "米饭", "白飯", { "mc:cooked_rice": 1 }, 3),
  homeTheme("vinegared_rice", "Vinegared Rice", "酢飯", "초밥 밥", "醋饭", "醋飯", { "mc:cooked_rice_vinegared": 1 }, 3),
  homeTheme("udon", "Udon", "うどん", "우동", "乌冬", "烏龍麵", { "mc:udon_noodle": 1 }, 3),
  homeTheme("soba", "Soba", "そば", "소바", "荞麦面", "蕎麥麵", { "mc:soba_noodle": 1 }, 3),
  homeTheme("ramen", "Ramen", "ラーメン", "라멘", "拉面", "拉麵", { "mc:noodle": 1 }, 3),
  homeTheme("macaroni", "Macaroni", "マカロニ", "마카로니", "通心粉", "通心粉", { "mc:macaroni": 1 }, 3),
  homeTheme("bread", "Bread", "パン", "빵", "面包", "麵包", { "minecraft:bread": 1 }, 3),
  homeTheme("buns", "Buns", "バンズ", "번", "汉堡面包", "漢堡麵包", { "mc:buns": 1 }, 3),
  homeTheme("tortilla", "Tortilla", "トルティーヤ", "토르티야", "玉米饼", "墨西哥薄餅", { "mc:tortilla_dough": 1 }, 3),
  homeTheme("pie_dough", "Pie Dough", "パイ生地", "파이 반죽", "派皮", "派皮", { "mc:pie_dough": 1 }, 3),
  homeTheme("custard", "Custard", "カスタード", "커스터드", "卡仕达", "卡士達", { "mc:custard_cream": 1 }, 3),
  homeTheme("chocolate", "Chocolate", "チョコレート", "초콜릿", "巧克力", "巧克力", { "mc:milk_chocolate": 1 }, 3),
  homeTheme("coffee", "Coffee", "コーヒー", "커피", "咖啡", "咖啡", { "mc:coffee": 1 }, 2),
  homeTheme("barley", "Barley", "大麦", "보리", "大麦", "大麥", { "mc:barley": 1 }, 2),
  homeTheme("sweet_corn", "Sweet Corn", "とうもろこし", "옥수수", "玉米", "玉米", { "mc:sweet_corn": 1 }, 2),
  homeTheme("pumpkin", "Pumpkin", "かぼちゃ", "호박", "南瓜", "南瓜", { "minecraft:pumpkin": 1 }, 2),
  homeTheme("beetroot", "Beetroot", "ビートルート", "비트", "甜菜根", "甜菜根", { "minecraft:beetroot": 2 }, 2),
  homeTheme("kelp", "Kelp", "昆布", "다시마", "海带", "昆布", { "minecraft:kelp": 2 }, 2),
  homeTheme("honey", "Honey", "はちみつ", "꿀", "蜂蜜", "蜂蜜", { "minecraft:honey_bottle": 1 }, 2),
  homeTheme("anko", "Anko", "あんこ", "팥앙금", "红豆馅", "紅豆餡", { "mc:anko": 1 }, 3),
  homeTheme("milk", "Milk", "ミルク", "우유", "牛奶", "牛奶", { "mc:milk": 1 }, 2),
  homeTheme("flour", "Flour", "小麦粉", "밀가루", "面粉", "麵粉", { "mc:flour": 1 }, 2),
];

function patternNames(en, ja, ko, zhCn, zhTw) {
  return langNames(en, ja, ko, zhCn, zhTw);
}

function fillHomePattern(pattern, theme, fileName) {
  return pattern.replace(/\{theme\}/gu, theme.names[fileName] ?? theme.names["en_US.lang"]);
}

function homeItemNames(patterns, theme) {
  return Object.fromEntries(
    LANG_FILES.map((fileName) => [fileName, fillHomePattern(patterns[fileName] ?? patterns["en_US.lang"], theme, fileName)]),
  );
}

const MAIN_DISH_THEMES = new Set([
  "chicken",
  "pork",
  "beef",
  "bacon",
  "egg",
  "cheese",
  "mushroom",
  "potato",
  "carrot",
  "onion",
  "cabbage",
  "spinach",
  "eggplant",
  "bell_pepper",
  "leek",
  "ginger",
  "garlic",
  "chili",
  "tomato",
  "daikon",
  "burdock",
  "lotus_root",
  "asparagus",
  "zucchini",
  "sweet_corn",
  "pumpkin",
]);

const LIQUID_OR_SAUCE_THEMES = new Set(["soy_sauce", "teriyaki", "cream", "butter", "honey", "milk", "coffee", "matcha", "miso", "curry"]);
const POWDER_OR_PASTE_THEMES = new Set(["flour", "barley", "sesame", "peanut", "anko", "custard", "chocolate"]);
const GRAIN_OR_NOODLE_THEMES = new Set(["rice", "vinegared_rice", "udon", "soba", "ramen", "macaroni", "bread", "buns", "tortilla", "pie_dough", "kelp"]);
const YAKUMI_THEMES = new Set(["leek", "ginger", "garlic", "chili", "herb", "shiso"]);

function jaThemeName(theme) {
  return theme.names["ja_JP.lang"];
}

function jaDishThemeName(theme) {
  return MAIN_DISH_THEMES.has(theme.id) ? jaThemeName(theme) : `${jaThemeName(theme)}風味`;
}

function naturalHomeMaterialJa(typeId, theme) {
  const name = jaThemeName(theme);
  const isLiquid = LIQUID_OR_SAUCE_THEMES.has(theme.id);
  const isPowder = POWDER_OR_PASTE_THEMES.has(theme.id);
  const isGrain = GRAIN_OR_NOODLE_THEMES.has(theme.id);

  switch (typeId) {
    case "diced":
      if (isLiquid) return `${name}キューブ`;
      if (isPowder) return `${name}ミックス`;
      if (isGrain) return `${name}ほぐし`;
      return `${name}の角切り`;
    case "sliced":
      if (isLiquid) return `${name}キューブ`;
      if (isPowder) return `${name}ミックス`;
      if (isGrain) return `${name}ほぐし`;
      return `${name}スライス`;
    case "paste":
      return isLiquid ? `${name}ベース` : `${name}ペースト`;
    case "sauce":
      return `${name}ソース`;
    case "broth":
      if (isLiquid) return `${name}スープベース`;
      if (isPowder) return `${name}とろみベース`;
      if (isGrain) return `${name}スープベース`;
      return `${name}だし`;
    case "filling":
      if (theme.id === "milk" || theme.id === "coffee" || theme.id === "matcha") return `${name}クリームフィリング`;
      if (theme.id === "cream") return "クリームフィリング";
      if (isLiquid || isPowder) return `${name}フィリング`;
      if (isGrain) return `${name}の具`;
      return `${name}の具材`;
    case "marinade":
      if (isLiquid) return `${name}マリネ液`;
      if (isPowder) return `${name}下味ミックス`;
      if (isGrain) return `${name}和えだれ`;
      return `${name}漬けだれ`;
    case "cream_base":
      if (theme.id === "cream") return "クリームベース";
      if (isLiquid) return `${name}クリームソース`;
      return `${name}クリームベース`;
    case "saute_base":
      if (isLiquid) return `${name}仕上げソース`;
      if (isPowder) return `${name}炒めミックス`;
      return `${name}炒めベース`;
    case "garnish":
      if (isLiquid) return `${name}の仕上げ`;
      if (isPowder) return `${name}ふりかけ`;
      if (isGrain) return `${name}トッピング`;
      return YAKUMI_THEMES.has(theme.id) ? `${name}の薬味` : `${name}トッピング`;
    default:
      return `${name}素材`;
  }
}

function naturalHomeDishJa(typeId, theme) {
  const name = jaDishThemeName(theme);
  const plain = jaThemeName(theme);
  const prefix = MAIN_DISH_THEMES.has(theme.id) ? plain : name;

  switch (typeId) {
    case "homestyle_rice_bowl":
      return `家庭風${prefix}丼`;
    case "comfort_soup":
      return `${name}のやさしいスープ`;
    case "family_stew":
      return `具だくさん${name}シチュー`;
    case "simple_skillet":
      return `${name}ソテー`;
    case "breakfast_plate":
      return `${prefix}朝食プレート`;
    case "sandwich":
      return `${name}サンド`;
    case "salad_plate":
      return `${name}サラダ`;
    case "curry_plate":
      return `${name}カレー`;
    case "gratin":
      return `${name}グラタン`;
    case "pasta":
      return `${name}パスタ`;
    case "pizza":
      return `${name}ピザ`;
    case "risotto":
      return `${name}リゾット`;
    case "omelet":
      return `${name}オムレツ`;
    case "dumpling":
      return `${name}団子`;
    case "croquette":
      return `${name}コロッケ`;
    case "cutlet":
      return `${name}カツ`;
    case "tempura":
      return `${name}天ぷら`;
    case "pot_pie":
      return `${name}ポットパイ`;
    case "quiche":
      return `${name}キッシュ`;
    case "terrine":
      return `${name}テリーヌ`;
    case "ragout":
      return `${name}ラグー`;
    case "braised_plate":
      return `${name}の煮込み`;
    case "chef_special":
      return `シェフ特製${name}`;
    case "course_appetizer":
      return `${name}の前菜`;
    case "bistro_saute":
      return `ビストロ風${name}ソテー`;
    case "cream_soup":
      return `${name}クリームスープ`;
    case "tartine":
      return `${name}タルティーヌ`;
    case "doria":
      return `${name}ドリア`;
    case "pilaf":
      return `${name}ピラフ`;
    case "noodle_bowl":
      return `${name}ヌードル`;
    case "udon_bowl":
      return `${name}うどん`;
    case "soba_bowl":
      return `${name}そば`;
    case "ramen_bowl":
      return `${name}ラーメン`;
    case "bento":
      return `${prefix}弁当`;
    case "toast":
      return `${name}トースト`;
    case "wrap":
      return `${name}ラップサンド`;
    case "fondue":
      return `${name}フォンデュ`;
    case "souffle":
      return `${name}スフレ`;
    case "fine_plate":
      return `${name}特製プレート`;
    case "tasting_bowl":
      return `${name}小鉢`;
    default:
      return `${name}料理`;
  }
}

function homeMaterialNames(type, theme) {
  const names = homeItemNames(type.names, theme);
  names["ja_JP.lang"] = naturalHomeMaterialJa(type.id, theme);
  return names;
}

function homeDishNames(type, theme) {
  const names = homeItemNames(type.names, theme);
  names["ja_JP.lang"] = naturalHomeDishJa(type.id, theme);
  return names;
}

function homeMaterialRef(theme, typeId) {
  return `mc:homeprep_${theme.id}_${typeId}`;
}

const HOME_MATERIAL_TYPES = [
  { id: "diced", station: "cutting_board", count: 2, level: 0, names: patternNames("Diced {theme}", "{theme}の角切り", "깍둑 썬 {theme}", "{theme}丁", "{theme}丁"), ingredients: (theme) => theme.ingredients },
  { id: "sliced", station: "cutting_board", count: 2, level: 0, names: patternNames("Sliced {theme}", "{theme}スライス", "얇게 썬 {theme}", "{theme}片", "{theme}片"), ingredients: (theme) => theme.ingredients },
  { id: "paste", station: "mixer", count: 2, level: 1, names: patternNames("{theme} Paste", "{theme}ペースト", "{theme} 페이스트", "{theme}酱", "{theme}醬"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:water_cup": 1 }) },
  { id: "sauce", station: "stew", count: 2, level: 2, names: patternNames("{theme} Sauce", "{theme}ソース", "{theme} 소스", "{theme}酱汁", "{theme}醬汁"), ingredients: (theme) => mergeIngredients(theme.ingredients, { "mc:water_cup": 1, "mc:salt": 1 }), extras: { "mc:pepper": 1 } },
  { id: "broth", station: "stew", count: 2, level: 2, names: patternNames("{theme} Broth", "{theme}ブロス", "{theme} 육수", "{theme}汤底", "{theme}湯底"), ingredients: (theme) => mergeIngredients(theme.ingredients, { "mc:water_cup": 1 }), extras: { "mc:salt": 1 } },
  { id: "filling", station: "mixer", count: 2, level: 2, names: patternNames("{theme} Filling", "{theme}フィリング", "{theme} 속재료", "{theme}馅料", "{theme}餡料"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:breadcrumbs": 1 }) },
  { id: "marinade", station: "mixer", count: 2, level: 3, names: patternNames("{theme} Marinade", "{theme}マリネ液", "{theme} 마리네이드", "{theme}腌汁", "{theme}醃汁"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "mc:syoyu": 1, "mc:vinegar": 1 }) },
  { id: "cream_base", station: "stew", count: 2, level: 3, names: patternNames("{theme} Cream Base", "{theme}クリームベース", "{theme} 크림 베이스", "{theme}奶油底", "{theme}奶油底"), ingredients: (theme) => mergeIngredients(theme.ingredients, { "mc:milk": 1, "mc:butter": 1 }), extras: { "mc:pepper": 1 } },
];

const HOME_DISH_TYPES = [
  { id: "homestyle_rice_bowl", station: "pan", nutrition: 5, level: 0, names: patternNames("Homestyle {theme} Rice Bowl", "家庭風{theme}丼", "가정식 {theme} 덮밥", "家常{theme}盖饭", "家常{theme}丼飯"), ingredients: (theme) => ({ "mc:cooked_rice": 1, [homeMaterialRef(theme, "saute_base")]: 1 }), extras: { "mc:syoyu": 1 } },
  { id: "comfort_soup", station: "stew", nutrition: 5, level: 0, names: patternNames("{theme} Comfort Soup", "{theme}ほっとスープ", "{theme} 컴포트 수프", "{theme}暖心汤", "{theme}暖心湯"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, "mc:leek_chopped": 1 }), extras: { "mc:pepper": 1 } },
  { id: "family_stew", station: "deep", nutrition: 7, level: 1, names: patternNames("{theme} Family Stew", "{theme}ファミリーシチュー", "{theme} 가족 스튜", "{theme}家庭炖菜", "{theme}家庭燉菜"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, "minecraft:potato": 1, "minecraft:carrot": 1 }), extras: { "mc:pepper": 1 } },
  { id: "simple_skillet", station: "pan", nutrition: 5, level: 0, names: patternNames("{theme} Simple Skillet", "{theme}の簡単ソテー", "{theme} 간단 팬구이", "{theme}简易煎锅菜", "{theme}簡易煎鍋菜"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:food_oil": 1 }), extras: { "mc:salt": 1 } },
  { id: "breakfast_plate", station: "pan", nutrition: 6, level: 1, names: patternNames("{theme} Breakfast Plate", "{theme}朝食プレート", "{theme} 아침 플레이트", "{theme}早餐拼盘", "{theme}早餐拼盤"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "minecraft:egg": 1, "minecraft:bread": 1 }), extras: { "mc:pepper": 1 } },
  { id: "sandwich", station: "mixer", nutrition: 5, level: 0, names: patternNames("{theme} Sandwich", "{theme}サンド", "{theme} 샌드위치", "{theme}三明治", "{theme}三明治"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "minecraft:bread": 1, "mc:lettuce_leaf": 1 }), extras: { "mc:mayonnaise": 1 } },
  { id: "salad_plate", station: "mixer", nutrition: 4, level: 0, names: patternNames("{theme} Salad Plate", "{theme}サラダプレート", "{theme} 샐러드 플레이트", "{theme}沙拉盘", "{theme}沙拉盤"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sliced")]: 1, "mc:lettuce_leaf": 1, "mc:cucumber_slice": 1 }), extras: { "mc:mayonnaise": 1 } },
  { id: "curry_plate", station: "stew", nutrition: 7, level: 2, names: patternNames("{theme} Curry Plate", "{theme}カレープレート", "{theme} 카레 플레이트", "{theme}咖喱盘", "{theme}咖哩盤"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "mc:curry_powder": 1, "mc:cooked_rice": 1 }), extras: { "mc:salt": 1 } },
  { id: "gratin", station: "oven", nutrition: 7, level: 3, names: patternNames("{theme} Gratin", "{theme}グラタン", "{theme} 그라탱", "{theme}焗烤", "{theme}焗烤"), ingredients: (theme) => ({ [homeMaterialRef(theme, "cream_base")]: 1, "mc:macaroni": 1, "mc:cheese": 1 }), extras: { "mc:breadcrumbs": 1 } },
  { id: "pasta", station: "pan", nutrition: 6, level: 2, names: patternNames("{theme} Pasta", "{theme}パスタ", "{theme} 파스타", "{theme}意面", "{theme}義大利麵"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "mc:macaroni": 1, "mc:ovlive_oil": 1 }), extras: { "mc:pepper": 1 } },
  { id: "pizza", station: "oven", nutrition: 7, level: 3, names: patternNames("{theme} Pizza", "{theme}ピザ", "{theme} 피자", "{theme}披萨", "{theme}披薩"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "mc:pizza_dough": 1, "mc:cheese": 1 }), extras: { "mc:basil": 1 } },
  { id: "risotto", station: "stew", nutrition: 6, level: 2, names: patternNames("{theme} Risotto", "{theme}リゾット", "{theme} 리소토", "{theme}烩饭", "{theme}燉飯"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, "mc:cooked_rice": 1, "mc:butter": 1 }), extras: { "mc:cheese": 1 } },
  { id: "omelet", station: "pan", nutrition: 5, level: 1, names: patternNames("{theme} Omelet", "{theme}オムレツ", "{theme} 오믈렛", "{theme}煎蛋卷", "{theme}歐姆蛋"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "minecraft:egg": 2 }), extras: { "mc:salt": 1 } },
  { id: "dumpling", station: "stew", nutrition: 5, level: 2, names: patternNames("{theme} Dumpling", "{theme}団子", "{theme} 만두", "{theme}团子", "{theme}糰子"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "mc:flour": 1, "mc:water_cup": 1 }), extras: { "mc:syoyu": 1 } },
  { id: "croquette", station: "fry", nutrition: 6, level: 3, names: patternNames("{theme} Croquette", "{theme}コロッケ", "{theme} 고로케", "{theme}可乐饼", "{theme}可樂餅"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "mc:mashed_potato": 1, "mc:food_oil": 2 }), extras: { "mc:breadcrumbs": 1 } },
  { id: "cutlet", station: "fry", nutrition: 7, level: 3, names: patternNames("{theme} Cutlet", "{theme}カツ", "{theme} 커틀릿", "{theme}炸排", "{theme}炸排"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:food_oil": 2 }), extras: { "mc:breadcrumbs": 1, "minecraft:egg": 1 } },
  { id: "tempura", station: "fry", nutrition: 5, level: 2, names: patternNames("{theme} Tempura", "{theme}天ぷら", "{theme} 튀김", "{theme}天妇罗", "{theme}天婦羅"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sliced")]: 1, "mc:food_oil": 2 }), extras: { "mc:tempura_batter": 1 } },
  { id: "pot_pie", station: "oven", nutrition: 7, level: 4, names: patternNames("{theme} Pot Pie", "{theme}ポットパイ", "{theme} 팟파이", "{theme}锅派", "{theme}鍋派"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "mc:pie_dough": 1, "mc:cream_sauce": 1 }), extras: { "mc:pepper": 1 } },
  { id: "quiche", station: "oven", nutrition: 6, level: 4, names: patternNames("{theme} Quiche", "{theme}キッシュ", "{theme} 키슈", "{theme}咸派", "{theme}鹹派"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "minecraft:egg": 2, "mc:cream_sauce": 1 }), extras: { "mc:cheese": 1 } },
  { id: "terrine", station: "mixer", nutrition: 5, level: 5, names: patternNames("{theme} Terrine", "{theme}テリーヌ", "{theme} 테린", "{theme}陶罐冻", "{theme}陶罐凍"), ingredients: (theme) => ({ [homeMaterialRef(theme, "paste")]: 1, "mc:cream_sauce": 1 }), extras: { "mc:basil": 1 } },
  { id: "ragout", station: "deep", nutrition: 7, level: 5, names: patternNames("{theme} Ragout", "{theme}ラグー", "{theme} 라구", "{theme}炖肉酱", "{theme}燉肉醬"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, [homeMaterialRef(theme, "sauce")]: 1, "minecraft:potato": 1 }), extras: { "mc:pepper": 1 } },
  { id: "braised_plate", station: "deep", nutrition: 7, level: 4, names: patternNames("Braised {theme} Plate", "{theme}の煮込み皿", "브레이즈드 {theme} 플레이트", "慢炖{theme}盘", "慢燉{theme}盤"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, [homeMaterialRef(theme, "broth")]: 1, "mc:syoyu": 1 }), extras: { "mc:salt": 1 } },
  { id: "chef_special", station: "pan", nutrition: 8, level: 6, names: patternNames("Chef's {theme} Special", "シェフの{theme}スペシャル", "셰프의 {theme} 스페셜", "主厨{theme}特餐", "主廚{theme}特餐"), ingredients: (theme) => ({ [homeMaterialRef(theme, "marinade")]: 1, "mc:butter": 1 }), extras: { "mc:basil": 1 } },
  { id: "course_appetizer", station: "mixer", nutrition: 4, level: 5, names: patternNames("{theme} Course Appetizer", "{theme}コース前菜", "{theme} 코스 전채", "{theme}套餐前菜", "{theme}套餐前菜"), ingredients: (theme) => ({ [homeMaterialRef(theme, "paste")]: 1, "minecraft:bread": 1 }), extras: { "mc:ovlive_oil": 1 } },
  { id: "bistro_saute", station: "pan", nutrition: 6, level: 4, names: patternNames("Bistro {theme} Saute", "ビストロ{theme}ソテー", "비스트로 {theme} 소테", "小酒馆{theme}煎炒", "小酒館{theme}煎炒"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sliced")]: 1, "mc:ovlive_oil": 1, "mc:garlic_mizin": 1 }), extras: { "mc:pepper": 1 } },
  { id: "cream_soup", station: "stew", nutrition: 6, level: 3, names: patternNames("{theme} Cream Soup", "{theme}クリームスープ", "{theme} 크림 수프", "{theme}奶油汤", "{theme}奶油湯"), ingredients: (theme) => ({ [homeMaterialRef(theme, "cream_base")]: 1, "mc:soup_stock": 1 }), extras: { "mc:pepper": 1 } },
  { id: "tartine", station: "mixer", nutrition: 5, level: 3, names: patternNames("{theme} Tartine", "{theme}タルティーヌ", "{theme} 타르틴", "{theme}开放三明治", "{theme}開放三明治"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "minecraft:bread": 1, "mc:cheese": 1 }), extras: { "mc:basil": 1 } },
  { id: "doria", station: "oven", nutrition: 7, level: 4, names: patternNames("{theme} Doria", "{theme}ドリア", "{theme} 도리아", "{theme}焗饭", "{theme}焗飯"), ingredients: (theme) => ({ [homeMaterialRef(theme, "cream_base")]: 1, "mc:cooked_rice": 1, "mc:cheese": 1 }), extras: { "mc:breadcrumbs": 1 } },
  { id: "pilaf", station: "pan", nutrition: 6, level: 2, names: patternNames("{theme} Pilaf", "{theme}ピラフ", "{theme} 필라프", "{theme}抓饭", "{theme}香飯"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:cooked_rice": 1, "mc:butter": 1 }), extras: { "mc:pepper": 1 } },
  { id: "noodle_bowl", station: "stew", nutrition: 6, level: 2, names: patternNames("{theme} Noodle Bowl", "{theme}ヌードルボウル", "{theme} 누들 볼", "{theme}面碗", "{theme}麵碗"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, "mc:noodle": 1 }), extras: { "mc:leek_chopped": 1 } },
  { id: "udon_bowl", station: "stew", nutrition: 6, level: 2, names: patternNames("{theme} Udon Bowl", "{theme}うどん", "{theme} 우동", "{theme}乌冬面", "{theme}烏龍麵"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, "mc:udon_noodle": 1 }), extras: { "mc:leek_chopped": 1 } },
  { id: "soba_bowl", station: "stew", nutrition: 6, level: 2, names: patternNames("{theme} Soba Bowl", "{theme}そば", "{theme} 소바", "{theme}荞麦面", "{theme}蕎麥麵"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "mc:soba_noodle": 1, "mc:dashi": 1 }), extras: { "mc:leek_chopped": 1 } },
  { id: "ramen_bowl", station: "stew", nutrition: 7, level: 3, names: patternNames("{theme} Ramen Bowl", "{theme}ラーメン", "{theme} 라멘", "{theme}拉面", "{theme}拉麵"), ingredients: (theme) => ({ [homeMaterialRef(theme, "broth")]: 1, "mc:noodle": 1, "mc:ramen_soup": 1 }), extras: { "mc:garlic_mizin": 1 } },
  { id: "bento", station: "mixer", nutrition: 7, level: 3, names: patternNames("{theme} Bento", "{theme}弁当", "{theme} 도시락", "{theme}便当", "{theme}便當"), ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:cooked_rice": 1, "minecraft:egg": 1 }), extras: { "minecraft:kelp": 1 } },
  { id: "toast", station: "oven", nutrition: 5, level: 1, names: patternNames("{theme} Toast", "{theme}トースト", "{theme} 토스트", "{theme}吐司", "{theme}吐司"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, "minecraft:bread": 1, "mc:cheese": 1 }), extras: { "mc:butter": 1 } },
  { id: "wrap", station: "mixer", nutrition: 5, level: 1, names: patternNames("{theme} Wrap", "{theme}ラップ", "{theme} 랩", "{theme}卷饼", "{theme}捲餅"), ingredients: (theme) => ({ [homeMaterialRef(theme, "filling")]: 1, "mc:tortilla_dough": 1, "mc:lettuce_leaf": 1 }), extras: { "mc:mayonnaise": 1 } },
  { id: "fondue", station: "stew", nutrition: 6, level: 5, names: patternNames("{theme} Fondue", "{theme}フォンデュ", "{theme} 퐁뒤", "{theme}火锅蘸酱", "{theme}起司鍋"), ingredients: (theme) => ({ [homeMaterialRef(theme, "cream_base")]: 1, "mc:cheese": 1, "minecraft:bread": 1 }), extras: { "mc:pepper": 1 } },
  { id: "souffle", station: "oven", nutrition: 6, level: 5, names: patternNames("{theme} Souffle", "{theme}スフレ", "{theme} 수플레", "{theme}舒芙蕾", "{theme}舒芙蕾"), ingredients: (theme) => ({ [homeMaterialRef(theme, "paste")]: 1, "minecraft:egg": 2, "mc:milk": 1 }), extras: { "minecraft:sugar": 1 } },
  { id: "fine_plate", station: "pan", nutrition: 8, level: 7, names: patternNames("{theme} Fine Dining Plate", "{theme}ファインダイニング皿", "{theme} 파인 다이닝 플레이트", "{theme}高级餐盘", "{theme}高級餐盤"), ingredients: (theme) => ({ [homeMaterialRef(theme, "marinade")]: 1, [homeMaterialRef(theme, "cream_base")]: 1, "mc:butter": 1 }), extras: { "mc:basil": 1 } },
  { id: "tasting_bowl", station: "mixer", nutrition: 5, level: 6, names: patternNames("{theme} Tasting Bowl", "{theme}テイスティングボウル", "{theme} 테이스팅 볼", "{theme}品鉴碗", "{theme}品鑑碗"), ingredients: (theme) => ({ [homeMaterialRef(theme, "sauce")]: 1, [homeMaterialRef(theme, "garnish")]: 1, "minecraft:bowl": 1 }), extras: { "mc:ovlive_oil": 1 } },
];

HOME_MATERIAL_TYPES.push({
  id: "saute_base",
  station: "pan",
  count: 2,
  level: 2,
  names: patternNames("{theme} Saute Base", "{theme}ソテーベース", "{theme} 소테 베이스", "{theme}煎炒底料", "{theme}煎炒底料"),
  ingredients: (theme) => ({ [homeMaterialRef(theme, "diced")]: 1, "mc:food_oil": 1 }),
  extras: { "mc:salt": 1 },
});

HOME_MATERIAL_TYPES.push({
  id: "garnish",
  station: "cutting_board",
  count: 3,
  level: 1,
  names: patternNames("{theme} Garnish", "{theme}ガーニッシュ", "{theme} 가니시", "{theme}装饰配料", "{theme}裝飾配料"),
  ingredients: (theme) => theme.ingredients,
});

function createHomePreparationMaterials() {
  const result = [];
  for (const [themeIndex, theme] of HOME_THEMES.entries()) {
    for (const [typeIndex, type] of HOME_MATERIAL_TYPES.entries()) {
      const id = `homeprep_${theme.id}_${type.id}`;
      const names = homeMaterialNames(type, theme);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "material",
        station: type.station,
        ingredients: type.ingredients(theme),
        extras: type.extras ?? {},
        result: { id: `mc:${id}`, count: type.count ?? 1 },
        requiredLevel: 1 + ((themeIndex + type.level + typeIndex) % 8),
        baseActions: 6 + ((themeIndex + typeIndex) % 5),
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

function createHomeExpansionFoods() {
  const result = [];
  for (const [themeIndex, theme] of HOME_THEMES.entries()) {
    for (const [typeIndex, type] of HOME_DISH_TYPES.entries()) {
      const id = `homefood_${theme.id}_${type.id}`;
      const names = homeDishNames(type, theme);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "food",
        nutrition: Math.min(14, theme.nutrition + type.nutrition),
        station: type.station,
        ingredients: type.ingredients(theme),
        extras: type.extras ?? {},
        requiredLevel: 1 + ((themeIndex + type.level + typeIndex) % 18),
        baseActions: 7 + ((themeIndex + typeIndex) % 7),
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

const homePreparationMaterials = createHomePreparationMaterials();
const homeExpansionFoods = createHomeExpansionFoods();
const homeExpansionItems = [...homePreparationMaterials, ...homeExpansionFoods];

if (homeExpansionItems.length !== 3000) {
  throw new Error(`Expected 3000 non-fish home and restaurant items, got ${homeExpansionItems.length}`);
}

function generatedName(parts, fileName) {
  const joiner = fileName === "ja_JP.lang" || fileName === "zh_CN.lang" || fileName === "zh_TW.lang" ? "" : " ";
  return parts.map((part) => part.names[fileName] ?? part.names["en_US.lang"]).join(joiner);
}

function generatedNames(...parts) {
  return Object.fromEntries(LANG_FILES.map((fileName) => [fileName, generatedName(parts, fileName)]));
}

function namedPart(id, en, ja, ko, zhCn, zhTw, ingredients = {}, nutrition = 1) {
  return {
    id,
    names: langNames(en, ja, ko, zhCn, zhTw),
    ingredients,
    nutrition,
  };
}

const BREAD_FLAVORS = [
  namedPart("milk", "Milk", "ミルク", "우유", "牛奶", "牛奶", { "mc:milk": 1 }),
  namedPart("butter", "Butter", "バター", "버터", "黄油", "奶油", { "mc:butter": 1 }),
  namedPart("cheese", "Cheese", "チーズ", "치즈", "奶酪", "起司", { "mc:cheese": 1 }),
  namedPart("garlic", "Garlic", "ガーリック", "마늘", "蒜香", "蒜香", { "mc:garlic_mizin": 1 }),
  namedPart("herb", "Herb", "ハーブ", "허브", "香草", "香草", { "mc:basil": 1 }),
  namedPart("honey", "Honey", "はちみつ", "꿀", "蜂蜜", "蜂蜜", { "minecraft:honey_bottle": 1 }),
  namedPart("chocolate", "Chocolate", "チョコ", "초콜릿", "巧克力", "巧克力", { "mc:milk_chocolate": 1 }),
  namedPart("apple", "Apple", "りんご", "사과", "苹果", "蘋果", { "minecraft:apple": 1 }),
  namedPart("strawberry", "Strawberry", "いちご", "딸기", "草莓", "草莓", { "mc:straw_berry": 1 }),
  namedPart("mikan", "Mandarin", "みかん", "귤", "橘子", "橘子", { "mc:mikan": 1 }),
  namedPart("anko", "Anko", "あんこ", "팥앙금", "红豆馅", "紅豆餡", { "mc:anko": 1 }),
  namedPart("curry", "Curry", "カレー", "카레", "咖喱", "咖哩", { "mc:curry_powder": 1 }),
  namedPart("potato", "Potato", "ポテト", "감자", "土豆", "馬鈴薯", { "minecraft:potato": 1 }),
  namedPart("pumpkin", "Pumpkin", "かぼちゃ", "호박", "南瓜", "南瓜", { "minecraft:pumpkin": 1 }),
  namedPart("corn", "Corn", "とうもろこし", "옥수수", "玉米", "玉米", { "mc:sweet_corn": 1 }),
  namedPart("sesame", "Sesame", "ごま", "참깨", "芝麻", "芝麻", { "mc:sesame_seed_powder": 1 }),
  namedPart("peanut", "Peanut", "ピーナッツ", "땅콩", "花生", "花生", { "mc:peanut_butter": 1 }),
  namedPart("matcha", "Matcha", "抹茶", "말차", "抹茶", "抹茶", { "mc:green_tea": 1 }),
  namedPart("berry", "Berry", "ベリー", "베리", "浆果", "莓果", { "minecraft:sweet_berries": 1 }),
  namedPart("barley", "Barley", "大麦", "보리", "大麦", "大麥", { "mc:barley": 1 }),
];

const BREAD_FORMS = [
  namedPart("loaf", "Loaf", "ブレッド", "식빵", "面包", "麵包", { "mc:bread_material": 1 }, 4),
  namedPart("roll", "Roll", "ロール", "롤빵", "餐包", "餐包", { "mc:bread_material": 1 }, 4),
  namedPart("baguette", "Baguette", "バゲット", "바게트", "法棍", "法棍", { "mc:bread_material": 1 }, 5),
  namedPart("brioche", "Brioche", "ブリオッシュ", "브리오슈", "布里欧修", "布里歐修", { "mc:bread_material": 1, "minecraft:egg": 1 }, 5),
  namedPart("flatbread", "Flatbread", "フラットブレッド", "플랫브레드", "扁面包", "扁麵包", { "mc:bread_material": 1, "mc:food_oil": 1 }, 4),
];

function createBreadExpansionFoods() {
  const result = [];
  for (const [flavorIndex, flavor] of BREAD_FLAVORS.entries()) {
    for (const [formIndex, form] of BREAD_FORMS.entries()) {
      const id = `breadcraft_${flavor.id}_${form.id}`;
      const names = generatedNames(flavor, form);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "food",
        nutrition: Math.min(14, form.nutrition + flavor.nutrition + 2),
        station: "oven",
        ingredients: mergeIngredients(form.ingredients, flavor.ingredients, { "minecraft:sugar": flavorIndex % 3 === 0 ? 1 : 0 }),
        extras: { "mc:butter": 1 },
        requiredLevel: 1 + ((flavorIndex + formIndex) % 12),
        baseActions: 7 + ((flavorIndex + formIndex) % 5),
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

const ALCOHOL_BASES = [
  namedPart("barley", "Barley", "大麦", "보리", "大麦", "大麥", { "mc:barley": 1 }),
  namedPart("rice", "Rice", "米", "쌀", "米", "米", { "mc:rice": 1 }),
  namedPart("wheat", "Wheat", "小麦", "밀", "小麦", "小麥", { "minecraft:wheat": 1 }),
  namedPart("potato", "Potato", "ポテト", "감자", "土豆", "馬鈴薯", { "minecraft:potato": 1 }),
  namedPart("apple", "Apple", "りんご", "사과", "苹果", "蘋果", { "minecraft:apple": 1 }),
  namedPart("berry", "Berry", "ベリー", "베리", "浆果", "莓果", { "minecraft:sweet_berries": 2 }),
  namedPart("glowberry", "Glow Berry", "グロウベリー", "발광 열매", "发光浆果", "發光莓果", { "minecraft:glow_berries": 2 }),
  namedPart("honey", "Honey", "はちみつ", "꿀", "蜂蜜", "蜂蜜", { "minecraft:honey_bottle": 1 }),
  namedPart("mikan", "Mandarin", "みかん", "귤", "橘子", "橘子", { "mc:mikan": 1 }),
  namedPart("melon", "Melon", "メロン", "멜론", "西瓜", "西瓜", { "minecraft:melon_slice": 2 }),
  namedPart("pineapple", "Pineapple", "パイナップル", "파인애플", "菠萝", "鳳梨", { "mc:pineapple_cut": 1 }),
  namedPart("strawberry", "Strawberry", "いちご", "딸기", "草莓", "草莓", { "mc:straw_berry": 1 }),
  namedPart("pumpkin", "Pumpkin", "かぼちゃ", "호박", "南瓜", "南瓜", { "minecraft:pumpkin": 1 }),
  namedPart("corn", "Corn", "とうもろこし", "옥수수", "玉米", "玉米", { "mc:sweet_corn": 1 }),
  namedPart("beetroot", "Beetroot", "ビートルート", "비트", "甜菜根", "甜菜根", { "minecraft:beetroot": 2 }),
  namedPart("cactus", "Cactus", "サボテン", "선인장", "仙人掌", "仙人掌", { "minecraft:cactus": 1 }),
  namedPart("sugarcane", "Sugarcane", "サトウキビ", "사탕수수", "甘蔗", "甘蔗", { "minecraft:sugar_cane": 2 }),
  namedPart("carrot", "Carrot", "にんじん", "당근", "胡萝卜", "胡蘿蔔", { "minecraft:carrot": 1 }),
  namedPart("coffee", "Coffee", "コーヒー", "커피", "咖啡", "咖啡", { "mc:coffee": 1 }),
  namedPart("green_tea", "Green Tea", "緑茶", "녹차", "绿茶", "綠茶", { "mc:green_tea": 1 }),
  namedPart("matcha", "Matcha", "抹茶", "말차", "抹茶", "抹茶", { "mc:green_tea": 1 }),
  namedPart("basil", "Basil", "バジル", "바질", "罗勒", "羅勒", { "mc:basil": 1 }),
  namedPart("shiso", "Shiso", "しそ", "차조기", "紫苏", "紫蘇", { "mc:shiso_leaf": 1 }),
  namedPart("ginger", "Ginger", "しょうが", "생강", "生姜", "生薑", { "mc:grated_ginger": 1 }),
  namedPart("peanut", "Peanut", "ピーナッツ", "땅콩", "花生", "花生", { "mc:peanut": 1 }),
  namedPart("sesame", "Sesame", "ごま", "참깨", "芝麻", "芝麻", { "mc:sesame_seed_powder": 1 }),
  namedPart("milk", "Milk", "ミルク", "우유", "牛奶", "牛奶", { "mc:milk": 1 }),
  namedPart("chocolate", "Chocolate", "チョコ", "초콜릿", "巧克力", "巧克力", { "mc:milk_chocolate": 1 }),
  namedPart("mushroom", "Mushroom", "きのこ", "버섯", "蘑菇", "蘑菇", { "minecraft:brown_mushroom": 1 }),
  namedPart("kelp", "Kelp", "昆布", "다시마", "海带", "昆布", { "minecraft:kelp": 1 }),
];

const ALCOHOL_STYLES = [
  namedPart("ale", "Ale", "エール", "에일", "艾尔", "愛爾", {}, 3),
  namedPart("wine", "Wine", "ワイン", "와인", "葡萄酒", "葡萄酒", {}, 3),
  namedPart("liqueur", "Liqueur", "リキュール", "리큐르", "利口酒", "利口酒", {}, 4),
  namedPart("spirit", "Spirit", "スピリッツ", "증류주", "烈酒", "烈酒", {}, 4),
  namedPart("aged", "Aged Brew", "熟成酒", "숙성주", "陈酿", "陳釀", {}, 4),
];

function createAlcoholExpansionFoods() {
  const result = [];
  for (const [baseIndex, base] of ALCOHOL_BASES.entries()) {
    for (const [styleIndex, style] of ALCOHOL_STYLES.entries()) {
      const id = `alcohol_${base.id}_${style.id}`;
      const names = generatedNames(base, style);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "food",
        nutrition: 4,
        station: "fermentation_machine",
        ingredients: mergeIngredients({ "minecraft:potion": 1, "mc:yeast": 1 }, base.ingredients, styleIndex >= 2 ? { "minecraft:sugar": 1 } : {}),
        result: [{ id: `mc:${id}`, count: 1 }, { id: "minecraft:glass_bottle", count: 1 }],
        requiredLevel: 1 + ((baseIndex + styleIndex) % 20),
        baseActions: 8 + ((baseIndex + styleIndex) % 5),
        drink: true,
        usingConvertsTo: "minecraft:glass_bottle",
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

const STATION_THEMES = HOME_THEMES.slice(0, 20);

const RICE_COOKER_TYPES = [
  namedPart("takikomi", "Mixed Rice", "炊き込みご飯", "영양밥", "什锦饭", "炊飯", { "mc:rice": 1 }, 5),
  namedPart("porridge", "Porridge", "おかゆ", "죽", "粥", "粥", { "mc:rice": 1, "mc:water_cup": 1 }, 4),
  namedPart("pilaf", "Pilaf", "ピラフ", "필라프", "抓饭", "香飯", { "mc:rice": 1, "mc:butter": 1 }, 5),
  namedPart("risotto", "Risotto", "リゾット", "리소토", "烩饭", "燉飯", { "mc:rice": 1, "mc:cream_sauce": 1 }, 6),
  namedPart("donabe", "Pot Rice", "釜飯", "솥밥", "锅饭", "釜飯", { "mc:rice": 1, "mc:dashi": 1 }, 6),
  namedPart("omusubi", "Rice Ball", "おむすび", "주먹밥", "饭团", "飯糰", { "mc:rice": 1, "minecraft:kelp": 1 }, 4),
  namedPart("bento_rice", "Bento Rice", "弁当ご飯", "도시락밥", "便当饭", "便當飯", { "mc:rice": 1 }, 5),
  namedPart("seasoned_rice", "Seasoned Rice", "味付けご飯", "양념밥", "调味饭", "調味飯", { "mc:rice": 1, "mc:salt": 1 }, 5),
  namedPart("rice_gratin", "Rice Gratin", "ライスグラタン", "라이스 그라탱", "焗饭", "焗飯", { "mc:rice": 1, "mc:cheese": 1 }, 6),
  namedPart("sweet_rice", "Sweet Rice", "おこわ", "단밥", "甜米饭", "甜米飯", { "mc:rice": 1, "minecraft:sugar": 1 }, 5),
];

const GRIDDLE_TYPES = [
  namedPart("teppanyaki", "Teppanyaki", "鉄板焼き", "철판구이", "铁板烧", "鐵板燒", { "mc:food_oil": 1 }, 6),
  namedPart("okonomiyaki", "Okonomiyaki", "お好み焼き", "오코노미야키", "御好烧", "御好燒", { "mc:flour": 1, "minecraft:egg": 1 }, 6),
  namedPart("yakisoba", "Yakisoba", "焼きそば", "야키소바", "炒面", "炒麵", { "mc:noodle": 1, "mc:food_oil": 1 }, 6),
  namedPart("skewer", "Skewer", "串焼き", "꼬치구이", "烤串", "烤串", { "minecraft:stick": 1 }, 5),
  namedPart("pancake", "Pancake", "パンケーキ", "팬케이크", "煎饼", "鬆餅", { "mc:flour": 1, "minecraft:egg": 1 }, 5),
  namedPart("griddle_toast", "Griddle Toast", "鉄板トースト", "철판 토스트", "铁板吐司", "鐵板吐司", { "minecraft:bread": 1, "mc:butter": 1 }, 5),
  namedPart("hash", "Hash", "ハッシュ", "해시", "杂炒", "雜炒", { "minecraft:potato": 1, "mc:food_oil": 1 }, 5),
  namedPart("steak_plate", "Steak Plate", "ステーキ皿", "스테이크 플레이트", "铁板排餐", "鐵板排餐", { "mc:food_oil": 1, "mc:pepper": 1 }, 7),
  namedPart("sauce_finish", "Sauce Finish", "ソース仕上げ", "소스 마무리", "酱汁收尾", "醬汁收尾", { "mc:syoyu": 1, "minecraft:sugar": 1 }, 6),
  namedPart("festival_grill", "Festival Grill", "屋台焼き", "축제 구이", "庙会铁板", "夜市鐵板", { "mc:food_oil": 1, "mc:flour": 1 }, 6),
];

const STEAMER_TYPES = [
  namedPart("steamed_bun", "Steamed Bun", "蒸しパン", "찐빵", "蒸包", "蒸包", { "mc:bread_material": 1 }, 5),
  namedPart("dumpling", "Dumpling", "蒸し団子", "찐만두", "蒸饺", "蒸餃", { "mc:flour": 1, "mc:water_cup": 1 }, 5),
  namedPart("shumai", "Shumai", "焼売", "슈마이", "烧卖", "燒賣", { "mc:flour": 1 }, 5),
  namedPart("bao", "Bao", "包子", "바오", "包子", "包子", { "mc:bread_material": 1 }, 6),
  namedPart("chawanmushi", "Savory Custard", "茶碗蒸し", "계란찜", "蒸蛋", "蒸蛋", { "minecraft:egg": 1, "mc:dashi": 1 }, 5),
  namedPart("steam_cake", "Steam Cake", "蒸しケーキ", "찜 케이크", "蒸蛋糕", "蒸蛋糕", { "mc:flour": 1, "minecraft:sugar": 1 }, 5),
  namedPart("mushi_yaki", "Steam Roast", "蒸し焼き", "찜구이", "蒸烤", "蒸烤", { "minecraft:potion": 1 }, 6),
  namedPart("mochi", "Mochi", "もち", "떡", "年糕", "麻糬", { "mc:rice_powder": 1 }, 5),
  namedPart("wrapped_steam", "Wrapped Steam", "包み蒸し", "쌈찜", "包蒸", "包蒸", { "minecraft:paper": 1 }, 5),
  namedPart("soft_pudding", "Soft Pudding", "やわらかプリン", "부드러운 푸딩", "嫩布丁", "嫩布丁", { "minecraft:egg": 1, "mc:milk": 1 }, 5),
];

function createStationExpansionFoods(prefix, station, types) {
  const result = [];
  for (const [themeIndex, theme] of STATION_THEMES.entries()) {
    for (const [typeIndex, type] of types.entries()) {
      const id = `${prefix}_${theme.id}_${type.id}`;
      const names = generatedNames(theme, type);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "food",
        nutrition: Math.min(14, theme.nutrition + type.nutrition),
        station,
        ingredients: mergeIngredients(theme.ingredients, type.ingredients),
        extras: station === "iron_board" ? { "mc:syoyu": 1 } : {},
        requiredLevel: 1 + ((themeIndex + typeIndex) % 18),
        baseActions: 7 + ((themeIndex + typeIndex) % 6),
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

const REFRESHMENT_BASES = [
  namedPart("milk", "Milk", "ミルク", "우유", "牛奶", "牛奶", { "mc:milk": 1 }, 2),
  namedPart("chocolate", "Chocolate", "チョコ", "초콜릿", "巧克力", "巧克力", { "mc:milk_chocolate": 1 }, 3),
  namedPart("strawberry", "Strawberry", "いちご", "딸기", "草莓", "草莓", { "mc:straw_berry": 1 }, 2),
  namedPart("mikan", "Mandarin", "みかん", "귤", "橘子", "橘子", { "mc:mikan": 1 }, 2),
  namedPart("apple", "Apple", "りんご", "사과", "苹果", "蘋果", { "minecraft:apple": 1 }, 2),
  namedPart("berry", "Berry", "ベリー", "베리", "浆果", "莓果", { "minecraft:sweet_berries": 2 }, 2),
  namedPart("melon", "Melon", "メロン", "멜론", "西瓜", "西瓜", { "minecraft:melon_slice": 2 }, 2),
  namedPart("honey", "Honey", "はちみつ", "꿀", "蜂蜜", "蜂蜜", { "minecraft:honey_bottle": 1 }, 2),
  namedPart("matcha", "Matcha", "抹茶", "말차", "抹茶", "抹茶", { "mc:green_tea": 1 }, 2),
  namedPart("coffee", "Coffee", "コーヒー", "커피", "咖啡", "咖啡", { "mc:coffee": 1 }, 2),
  namedPart("green_tea", "Green Tea", "緑茶", "녹차", "绿茶", "綠茶", { "mc:green_tea": 1 }, 2),
  namedPart("pumpkin", "Pumpkin", "かぼちゃ", "호박", "南瓜", "南瓜", { "minecraft:pumpkin": 1 }, 3),
  namedPart("corn", "Corn", "とうもろこし", "옥수수", "玉米", "玉米", { "mc:sweet_corn": 1 }, 3),
  namedPart("peanut", "Peanut", "ピーナッツ", "땅콩", "花生", "花生", { "mc:peanut_butter": 1 }, 3),
  namedPart("sesame", "Sesame", "ごま", "참깨", "芝麻", "芝麻", { "mc:sesame_seed_powder": 1 }, 2),
  namedPart("barley", "Barley", "大麦", "보리", "大麦", "大麥", { "mc:barley": 1 }, 2),
  namedPart("rice", "Rice", "お米", "쌀", "米", "米", { "mc:rice": 1 }, 2),
  namedPart("pineapple", "Pineapple", "パイナップル", "파인애플", "菠萝", "鳳梨", { "mc:pineapple_cut": 1 }, 2),
  namedPart("cactus", "Cactus", "サボテン", "선인장", "仙人掌", "仙人掌", { "minecraft:cactus": 1 }, 2),
  namedPart("carrot", "Carrot", "にんじん", "당근", "胡萝卜", "胡蘿蔔", { "minecraft:carrot": 1 }, 2),
  namedPart("beetroot", "Beetroot", "ビートルート", "비트", "甜菜根", "甜菜根", { "minecraft:beetroot": 2 }, 2),
  namedPart("ginger", "Ginger", "しょうが", "생강", "生姜", "生薑", { "mc:grated_ginger": 1 }, 2),
  namedPart("shiso", "Shiso", "しそ", "차조기", "紫苏", "紫蘇", { "mc:shiso_leaf": 1 }, 2),
  namedPart("basil", "Basil", "バジル", "바질", "罗勒", "羅勒", { "mc:basil": 1 }, 2),
  namedPart("kelp", "Kelp", "昆布", "다시마", "海带", "昆布", { "minecraft:kelp": 1 }, 2),
];

const ICE_STYLES = [
  namedPart("shaved_ice", "Shaved Ice", "かき氷", "빙수", "刨冰", "剉冰", { "minecraft:blue_ice": 2 }, 4),
  namedPart("sorbet", "Sorbet", "ソルベ", "소르베", "雪芭", "雪酪", { "minecraft:snowball": 2, "minecraft:sugar": 1 }, 4),
  namedPart("gelato", "Gelato", "ジェラート", "젤라토", "意式冰淇淋", "義式冰淇淋", { "mc:milk": 1, "minecraft:sugar": 1 }, 5),
  namedPart("popsicle", "Popsicle", "アイスキャンディ", "아이스바", "冰棒", "冰棒", { "minecraft:snowball": 1, "minecraft:stick": 1 }, 4),
  namedPart("parfait", "Parfait", "パフェ", "파르페", "芭菲", "聖代", { "mc:whipped_cream": 1, "minecraft:sugar": 1 }, 6),
  namedPart("granita", "Granita", "グラニータ", "그라니타", "格兰尼塔", "格蘭尼塔", { "minecraft:blue_ice": 1, "minecraft:snowball": 1 }, 4),
  namedPart("frozen_yogurt", "Frozen Yogurt", "フローズンヨーグルト", "프로즌 요거트", "冻酸奶", "優格冰淇淋", { "mc:milk": 1, "minecraft:sugar": 1 }, 5),
  namedPart("sherbet", "Sherbet", "シャーベット", "셔벗", "冰沙", "雪貝", { "minecraft:snowball": 2, "minecraft:sugar": 1 }, 4),
];

const DRINK_STYLES = [
  namedPart("juice", "Juice", "ジュース", "주스", "果汁", "果汁", { "mc:water_cup": 1 }, 3),
  namedPart("smoothie", "Smoothie", "スムージー", "스무디", "思慕雪", "果昔", { "mc:water_cup": 1, "minecraft:sugar": 1 }, 4),
  namedPart("soda", "Soda", "ソーダ", "소다", "苏打", "蘇打", { "mc:water_cup": 1, "minecraft:sugar": 1 }, 3),
  namedPart("tea", "Tea", "ティー", "차", "茶", "茶", { "mc:water_cup": 1, "mc:green_tea": 1 }, 3),
  namedPart("latte", "Latte", "ラテ", "라테", "拿铁", "拿鐵", { "mc:water_cup": 1, "mc:milk": 1 }, 4),
  namedPart("shake", "Shake", "シェイク", "셰이크", "奶昔", "奶昔", { "mc:milk": 1, "minecraft:sugar": 1 }, 5),
  namedPart("squash", "Squash", "スカッシュ", "스쿼시", "汽水饮", "氣泡飲", { "mc:water_cup": 1, "minecraft:sugar": 1 }, 3),
  namedPart("nectar", "Nectar", "ネクター", "넥타", "浓汁", "濃汁", { "mc:water_cup": 1, "minecraft:honey_bottle": 1 }, 4),
];

const JUICE_BASES = new Set(["strawberry", "mikan", "apple", "berry", "melon", "pineapple", "carrot", "beetroot", "cactus"]);

function naturalDrinkJa(base, style) {
  const baseName = base.names["ja_JP.lang"];
  switch (style.id) {
    case "juice":
      return JUICE_BASES.has(base.id) ? `${baseName}ジュース` : `${baseName}ドリンク`;
    case "smoothie":
      return `${baseName}スムージー`;
    case "soda":
      return `${baseName}ソーダ`;
    case "tea":
      if (base.id === "green_tea") return "緑茶";
      if (base.id === "matcha") return "抹茶入り緑茶";
      if (base.id === "coffee") return "コーヒーブレンドティー";
      return `${baseName}ティー`;
    case "latte":
      return `${baseName}ラテ`;
    case "shake":
      return `${baseName}シェイク`;
    case "squash":
      return `${baseName}スカッシュ`;
    case "nectar":
      return `${baseName}ネクター`;
    default:
      return `${baseName}ドリンク`;
  }
}

function drinkNames(base, style) {
  const names = generatedNames(base, style);
  names["ja_JP.lang"] = naturalDrinkJa(base, style);
  return names;
}

function createIceExpansionFoods() {
  const result = [];
  for (const [baseIndex, base] of REFRESHMENT_BASES.entries()) {
    for (const [styleIndex, style] of ICE_STYLES.entries()) {
      const id = `icecraft_${base.id}_${style.id}`;
      const names = generatedNames(base, style);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "food",
        folder: "ice",
        nutrition: Math.min(12, base.nutrition + style.nutrition),
        station: "shaved_ice_machine",
        ingredients: mergeIngredients(style.ingredients, base.ingredients),
        requiredLevel: 1 + ((baseIndex + styleIndex) % 16),
        baseActions: 7 + ((baseIndex + styleIndex) % 5),
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

function createDrinkExpansionFoods() {
  const result = [];
  for (const [baseIndex, base] of REFRESHMENT_BASES.entries()) {
    for (const [styleIndex, style] of DRINK_STYLES.entries()) {
      const id = `drinkcraft_${base.id}_${style.id}`;
      const names = drinkNames(base, style);
      result.push({
        id,
        en: names["en_US.lang"],
        ja: names["ja_JP.lang"],
        names,
        kind: "food",
        folder: "drink",
        nutrition: Math.min(10, base.nutrition + style.nutrition),
        station: "mixer",
        ingredients: mergeIngredients(style.ingredients, base.ingredients),
        extras: {},
        requiredLevel: 1 + ((baseIndex + styleIndex) % 14),
        baseActions: 6 + ((baseIndex + styleIndex) % 5),
        drink: true,
        usingConvertsTo: "mc:cup",
        texture: `textures/items/generated/${id}`,
      });
    }
  }
  return result;
}

const breadExpansionFoods = createBreadExpansionFoods();
const alcoholExpansionFoods = createAlcoholExpansionFoods();
const riceCookerExpansionFoods = createStationExpansionFoods("ricecooker", "rice_cooker", RICE_COOKER_TYPES);
const ironBoardExpansionFoods = createStationExpansionFoods("griddle", "iron_board", GRIDDLE_TYPES);
const steamerExpansionFoods = createStationExpansionFoods("steamer", "steamer", STEAMER_TYPES);
const iceExpansionFoods = createIceExpansionFoods();
const drinkExpansionFoods = createDrinkExpansionFoods();
const requestedExpansionItems = [
  ...breadExpansionFoods,
  ...alcoholExpansionFoods,
  ...riceCookerExpansionFoods,
  ...ironBoardExpansionFoods,
  ...steamerExpansionFoods,
  ...iceExpansionFoods,
  ...drinkExpansionFoods,
];

if (breadExpansionFoods.length !== 100 || alcoholExpansionFoods.length !== 150 || riceCookerExpansionFoods.length !== 200 || ironBoardExpansionFoods.length !== 200 || steamerExpansionFoods.length !== 200 || iceExpansionFoods.length !== 200 || drinkExpansionFoods.length !== 200) {
  throw new Error(`Unexpected requested expansion counts: bread=${breadExpansionFoods.length}, alcohol=${alcoholExpansionFoods.length}, rice=${riceCookerExpansionFoods.length}, griddle=${ironBoardExpansionFoods.length}, steamer=${steamerExpansionFoods.length}, ice=${iceExpansionFoods.length}, drink=${drinkExpansionFoods.length}`);
}

const allItems = [...crops, ...materials, ...foods, ...fishExpansionItems, ...homeExpansionItems, ...requestedExpansionItems];

const COOKING_LEVEL_MIN = 1;
const COOKING_LEVEL_MAX = 500;

const generatedRecipePrefixes = [
  "fish_",
  "homeprep_",
  "homefood_",
  "breadcraft_",
  "alcohol_",
  "ricecooker_",
  "griddle_",
  "steamer_",
  "icecraft_",
  "drinkcraft_",
  "cuisine_",
];

const recipeDefaults = {
  pan: { target: "fryingpan-recipe.ts", collection: "FryingPanRecipes", extraKey: "seasonings", maxKey: "maxSeasonings", rangeKey: "needHeat", range: [70, 110] },
  stew: { target: "stew-recipe.ts", collection: "StewRecipes", extraKey: "seasonings", maxKey: "maxSeasonings", rangeKey: "needHeat", range: [85, 115] },
  deep: { target: "deepstew-recipe.ts", collection: "DeepStewRecipes", extraKey: "seasonings", maxKey: "maxSeasonings", rangeKey: "needHeat", range: [130, 180] },
  fry: { target: "frystew-recipe.ts", collection: "FryStewRecipes", extraKey: "coatings", maxKey: "maxCoatings", rangeKey: "needTemp", range: [165, 185] },
  oven: { target: "oven-recipe.ts", collection: "OvenRecipes", extraKey: "toppings", maxKey: "maxToppings", rangeKey: "needTemp", range: [150, 180] },
  mixer: { target: "mixer-recipe.ts", collection: "MixerRecipes", extraKey: "additives", maxKey: "maxAdditives", rangeKey: "needSpeed", range: [35, 75] },
};

const simpleRecipeDefaults = {
  cutting_board: { target: "cuttingboard-recipe.ts", collection: "CuttingBoardRecipes" },
  rice_cooker: { target: "ricecooker-recipe.ts", collection: "RiceCookerRecipes" },
  iron_board: { target: "ironboard-recipe.ts", collection: "IronBoardRecipes" },
  steamer: { target: "steamer-recipe.ts", collection: "SteamerRecipes" },
  fermentation_machine: { target: "fermentationmachine-recipe.ts", collection: "FermentationMachineRecipes" },
  shaved_ice_machine: { target: "shavedicemachine-recipe.ts", collection: "ShavedIceMachineRecipes" },
};

const legacyAdditionalRecipes = [
  {
    id: "macaroni",
    station: "mixer",
    name: "mc:macaroni",
    result: { id: "mc:macaroni", count: 2 },
    requiredLevel: 1,
    baseActions: 7,
    ingredients: { "mc:flour": 2, "mc:water_cup": 1, "mc:salt": 1 },
    extras: {},
    progressionGroup: "material",
  },
  {
    id: "boiled_sweet_corn",
    station: "stew",
    name: "mc:boiled_sweet_corn",
    result: "mc:boiled_sweet_corn",
    requiredLevel: 2,
    baseActions: 7,
    ingredients: { "mc:sweet_corn": 1, "mc:water_cup": 1 },
    extras: { "mc:salt": 1 },
    progressionGroup: "classic_food",
  },
  {
    id: "roasted_sweet_corn",
    station: "pan",
    name: "mc:roasted_sweet_corn",
    result: "mc:roasted_sweet_corn",
    requiredLevel: 3,
    baseActions: 7,
    ingredients: { "mc:sweet_corn": 1, "minecraft:stick": 1 },
    extras: { "mc:salt": 1 },
    progressionGroup: "classic_food",
  },
  {
    id: "mc_fried_potato",
    station: "fry",
    name: "mc:fried_potato",
    result: "mc:fried_potato",
    requiredLevel: 4,
    baseActions: 8,
    ingredients: { "minecraft:potato": 2, "mc:food_oil": 1 },
    extras: { "mc:salt": 1 },
    progressionGroup: "classic_food",
  },
  {
    id: "melon_soda",
    station: "mixer",
    name: "mc:melon_soda",
    result: "mc:melon_soda",
    requiredLevel: 5,
    baseActions: 7,
    ingredients: { "mc:soda": 1, "minecraft:melon_slice": 2, "mc:cup": 1 },
    extras: {},
    progressionGroup: "drink",
  },
  {
    id: "melon_bread",
    station: "oven",
    name: "mc:melon_bread",
    result: "mc:melon_bread",
    requiredLevel: 6,
    baseActions: 8,
    ingredients: { "mc:bread_material": 1, "minecraft:melon_slice": 2, "minecraft:sugar": 1 },
    extras: { "mc:butter": 1 },
    progressionGroup: "bread",
  },
  {
    id: "vegetable_pizza",
    station: "oven",
    name: "mc:vegetable_pizza",
    result: "mc:vegetable_pizza",
    requiredLevel: 7,
    baseActions: 9,
    ingredients: {
      "mc:pizza_dough": 1,
      "mc:tomato_sauce": 1,
      "mc:cheese": 1,
      "mc:cabbage_chopped": 1,
      "mc:bell_pepper_slice": 1,
    },
    extras: { "mc:basil": 1 },
    progressionGroup: "classic_food",
  },
  {
    id: "nether_pizza",
    station: "oven",
    name: "mc:nether_pizza",
    result: "mc:nether_pizza",
    requiredLevel: 8,
    baseActions: 10,
    ingredients: {
      "mc:pizza_dough": 1,
      "mc:tomato_sauce": 1,
      "mc:cheese": 1,
      "minecraft:crimson_fungus": 1,
      "minecraft:warped_fungus": 1,
    },
    extras: { "minecraft:nether_wart": 1 },
    progressionGroup: "classic_food",
  },
];

const stationDifficulty = {
  cutting_board: 0,
  mixer: 1,
  stew: 2,
  rice_cooker: 2,
  pan: 3,
  fermentation_machine: 3,
  shaved_ice_machine: 3,
  oven: 4,
  fry: 4,
  deep: 5,
  iron_board: 5,
  steamer: 5,
};

const progressionGroupDifficulty = {
  material: 0,
  homeprep: 1,
  fish_prep: 1,
  classic_food: 2,
  drink: 2,
  fish_food: 3,
  bread: 3,
  ice: 3,
  station_food: 4,
  cuisine: 5,
  homefood: 6,
  alcohol: 7,
};

function progressionGroupForRecipe(recipe) {
  if (recipe.progressionGroup) return recipe.progressionGroup;
  if (recipe.id.startsWith("homeprep_")) return "homeprep";
  if (recipe.id.startsWith("fish_fillet_") || recipe.id.startsWith("fish_mince_") || recipe.id.startsWith("fish_stock_")) return "fish_prep";
  if (recipe.id.startsWith("fish_grilled_") || recipe.id.startsWith("fish_soup_")) return "fish_food";
  if (recipe.id.startsWith("breadcraft_")) return "bread";
  if (recipe.id.startsWith("icecraft_")) return "ice";
  if (recipe.id.startsWith("drinkcraft_")) return "drink";
  if (recipe.id.startsWith("ricecooker_") || recipe.id.startsWith("griddle_") || recipe.id.startsWith("steamer_")) return "station_food";
  if (recipe.id.startsWith("cuisine_")) return "cuisine";
  if (recipe.id.startsWith("homefood_")) return "homefood";
  if (recipe.id.startsWith("alcohol_")) return "alcohol";
  return "classic_food";
}

function recipeDifficulty(recipe) {
  const ingredientEntries = Object.entries(recipe.ingredients ?? {});
  const extraEntries = Object.entries(recipe.extras ?? {});
  const ingredientKinds = ingredientEntries.length + extraEntries.length;
  const ingredientAmount = [...ingredientEntries, ...extraEntries].reduce((total, [, amount]) => total + Number(amount ?? 0), 0);
  const group = progressionGroupForRecipe(recipe);
  return (
    (progressionGroupDifficulty[group] ?? progressionGroupDifficulty.classic_food) * 10000
    + (stationDifficulty[recipe.station] ?? 3) * 500
    + (recipe.requiredLevel ?? COOKING_LEVEL_MIN) * 20
    + (recipe.baseActions ?? 7) * 6
    + ingredientKinds * 4
    + ingredientAmount
  );
}

function assignCookingLevels(recipes) {
  if (recipes.length === 0) return recipes;
  const ordered = [...recipes].sort((a, b) => (recipeDifficulty(a) - recipeDifficulty(b)) || a.id.localeCompare(b.id));
  const range = COOKING_LEVEL_MAX - COOKING_LEVEL_MIN + 1;
  for (const [index, recipe] of ordered.entries()) {
    recipe.requiredLevel = COOKING_LEVEL_MIN + Math.floor((index * range) / ordered.length);
  }
  return recipes;
}

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function writeJson(filePath, value, indent = 2) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, indent)}\n`);
}

function itemFilePath(item) {
  if (item.kind === "crop") return path.join(bpDir, "items/materials/generated/crops", `${item.id}.json`);
  if (item.folder === "drink") return path.join(bpDir, "items/drink/generated", `${item.id}.json`);
  if (item.folder === "ice") return path.join(bpDir, "items/ice/generated", `${item.id}.json`);
  if (item.kind === "food") return path.join(bpDir, "items/food/generated", `${item.id}.json`);
  return path.join(bpDir, "items/materials/generated", `${item.id}.json`);
}

function itemJson(item) {
  const components = {
    "minecraft:icon": {
      texture: item.id,
    },
  };

  if (item.kind === "crop") {
    components["minecraft:use_duration"] = 1;
    components["minecraft:food"] = {
      nutrition: item.nutrition,
      can_always_eat: true,
    };
    components["minecraft:use_animation"] = "eat";
    components["minecraft:block_placer"] = {
      block: `mc:${item.id}_crop`,
      use_on: ["farmland"],
    };
  } else if (item.kind === "food") {
    components["minecraft:use_duration"] = item.useDuration ?? (item.drink ? 3 : 5);
    components["minecraft:food"] = {
      nutrition: item.nutrition,
      can_always_eat: true,
      ...(item.usingConvertsTo ? { using_converts_to: item.usingConvertsTo } : {}),
    };
    components["minecraft:use_animation"] = item.useAnimation ?? (item.drink || item.id.endsWith("_latte") ? "drink" : "eat");
  }

  return {
    format_version: "1.20.30",
    "minecraft:item": {
      description: {
        identifier: `mc:${item.id}`,
      },
      components,
    },
  };
}

function cropBlockJson(crop) {
  return {
    format_version: "1.21.60",
    "minecraft:block": {
      description: {
        identifier: `mc:${crop.id}_crop`,
        menu_category: {
          category: "none",
          is_hidden_in_commands: false,
        },
        states: {
          "mc:growth_stage": [0, 1, 2, 3],
        },
      },
      components: {
        "minecraft:flammable": true,
        "minecraft:collision_box": false,
        "minecraft:liquid_detection": {
          detection_rules: [
            {
              liquid_type: "water",
              can_contain_liquid: false,
              on_liquid_touches: "popped",
            },
          ],
        },
        "minecraft:geometry": "geometry.crop_common",
        "minecraft:light_dampening": 0,
        "minecraft:placement_filter": {
          conditions: [
            {
              allowed_faces: ["up"],
              block_filter: ["farmland", "dirt", "grass_block"],
            },
          ],
        },
        "minecraft:loot": "loot_tables/empty.json",
        "minecraft:custom_components": ["mc:grow"],
      },
      permutations: [0, 1, 2, 3].map((stage) => ({
        condition: `q.block_state('mc:growth_stage') == ${stage}`,
        components: {
          "minecraft:material_instances": {
            "*": {
              texture: `${crop.id}_stage_${stage + 1}`,
              render_method: "blend",
              face_dimming: false,
              ambient_occlusion: false,
            },
          },
          "minecraft:selection_box": {
            origin: [-8, 0, -8],
            size: [16, [2, 8, 12, 15][stage], 16],
          },
          "minecraft:loot": `loot_tables/blocks/${crop.id}_${stage === 3 ? "plant" : "seed"}.json`,
        },
      })),
    },
  };
}

function lootTable(itemId, mature) {
  return {
    pools: [
      {
        rolls: 1,
        entries: [
          {
            type: "item",
            name: `mc:${itemId}`,
            ...(mature
              ? {
                  functions: [
                    {
                      function: "set_count",
                      count: { min: 2, max: 5 },
                    },
                  ],
                }
              : { quantity: 1 }),
            weight: 1,
          },
        ],
      },
    ],
  };
}

function hashColor(id) {
  let hash = 2166136261;
  for (const ch of id) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  const hue = Math.abs(hash) % 360;
  return hslToRgb(hue / 360, 0.58, 0.52);
}

function hslToRgb(h, s, l) {
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    Math.round(hue2rgb(p, q, h) * 255),
    Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  ];
}

function clampColor(color, delta) {
  return color.map((v) => Math.max(0, Math.min(255, v + delta)));
}

function makeCanvas() {
  const w = 16;
  const h = 16;
  const pixels = new Uint8Array(w * h * 4);
  const set = (x, y, color, a = 255) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const i = (y * w + x) * 4;
    pixels[i] = color[0];
    pixels[i + 1] = color[1];
    pixels[i + 2] = color[2];
    pixels[i + 3] = a;
  };
  const rect = (x, y, rw, rh, color, a = 255) => {
    for (let yy = y; yy < y + rh; yy++) {
      for (let xx = x; xx < x + rw; xx++) set(xx, yy, color, a);
    }
  };
  const circle = (cx, cy, r, color, a = 255) => {
    for (let yy = cy - r; yy <= cy + r; yy++) {
      for (let xx = cx - r; xx <= cx + r; xx++) {
        const dx = xx - cx;
        const dy = yy - cy;
        if (dx * dx + dy * dy <= r * r) set(xx, yy, color, a);
      }
    }
  };
  const ellipse = (cx, cy, rx, ry, color, a = 255) => {
    for (let yy = Math.floor(cy - ry); yy <= Math.ceil(cy + ry); yy++) {
      for (let xx = Math.floor(cx - rx); xx <= Math.ceil(cx + rx); xx++) {
        const dx = (xx - cx) / rx;
        const dy = (yy - cy) / ry;
        if (dx * dx + dy * dy <= 1) set(xx, yy, color, a);
      }
    }
  };
  const line = (x0, y0, x1, y1, color, a = 255) => {
    let dx = Math.abs(x1 - x0);
    let dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    while (true) {
      set(x0, y0, color, a);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }
      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  };
  return { pixels, set, rect, circle, ellipse, line };
}

const PIXEL = {
  outline: [78, 57, 45],
  shadow: [98, 76, 61],
  plate: [230, 230, 218],
  plateHi: [255, 255, 247],
  rice: [247, 246, 233],
  bowl: [86, 116, 154],
  bowlDark: [48, 68, 101],
  board: [160, 111, 62],
  boardDark: [111, 73, 43],
  bread: [204, 145, 71],
  breadDark: [139, 83, 41],
  fried: [211, 144, 49],
  friedDark: [135, 82, 31],
  cream: [244, 231, 195],
  redSauce: [176, 52, 42],
  green: [72, 151, 69],
  darkGreen: [38, 101, 48],
  noodle: [230, 203, 132],
};

const PRODUCE_VISUALS = {
  cucumber: { shape: "long", main: [44, 137, 63], dark: [23, 86, 44], hi: [117, 194, 96], flesh: [184, 221, 139] },
  cabbage: { shape: "leafy_ball", main: [121, 185, 83], dark: [58, 118, 55], hi: [184, 220, 121] },
  lettuce: { shape: "leafy_open", main: [111, 181, 77], dark: [53, 118, 54], hi: [176, 223, 114] },
  spinach: { shape: "leaf_bunch", main: [47, 135, 57], dark: [24, 80, 42], hi: [92, 177, 74] },
  eggplant: { shape: "oval", main: [92, 49, 145], dark: [52, 29, 93], hi: [159, 104, 205], cap: [65, 136, 59] },
  bell_pepper: { shape: "pepper", main: [52, 151, 62], dark: [28, 94, 45], hi: [103, 205, 89] },
  chili_pepper: { shape: "chili", main: [196, 43, 35], dark: [121, 29, 29], hi: [243, 92, 59], cap: [68, 132, 52] },
  leek: { shape: "stalk", main: [226, 237, 176], dark: [69, 132, 58], hi: [247, 250, 214] },
  ginger: { shape: "knob", main: [187, 139, 78], dark: [116, 78, 48], hi: [232, 181, 108] },
  lotus_root: { shape: "root_slice", main: [225, 197, 152], dark: [141, 109, 74], hi: [248, 226, 184] },
  burdock: { shape: "stick", main: [128, 82, 47], dark: [74, 49, 35], hi: [173, 116, 66] },
  daikon: { shape: "root", main: [238, 239, 218], dark: [154, 160, 132], hi: [255, 255, 241], cap: [79, 151, 68] },
  napa_cabbage: { shape: "napa", main: [219, 230, 142], dark: [72, 133, 66], hi: [248, 247, 188] },
  shiso: { shape: "leaf_single", main: [62, 139, 70], dark: [31, 87, 45], hi: [112, 182, 90] },
  sesame: { shape: "seeds", main: [221, 199, 143], dark: [132, 104, 65], hi: [255, 238, 182] },
  peanut: { shape: "peanut", main: [209, 158, 92], dark: [130, 84, 48], hi: [236, 193, 124] },
  zucchini: { shape: "long", main: [52, 128, 75], dark: [27, 83, 53], hi: [103, 172, 93], flesh: [207, 220, 146] },
  asparagus: { shape: "spear", main: [70, 151, 70], dark: [38, 96, 49], hi: [143, 199, 94] },
};

const MATERIAL_COLORS = {
  chili_powder: [190, 55, 34],
  sesame_seed_powder: [218, 195, 142],
  peanut_butter: [191, 126, 59],
  tempura_batter: [236, 222, 164],
  breadcrumbs: [210, 159, 77],
  curry_powder: [198, 139, 39],
  soup_stock: [179, 132, 68],
  dashi: [198, 171, 94],
  miso_soup_base: [141, 83, 44],
  teriyaki_sauce: [105, 54, 36],
  mayonnaise: [239, 229, 161],
  cream_sauce: [240, 229, 190],
  white_sauce: [239, 232, 203],
  demi_glace_sauce: [96, 49, 37],
  mashed_potato: [232, 216, 160],
  potato_starch: [239, 237, 218],
  corn_starch: [240, 231, 174],
  udon_noodle: [238, 230, 198],
  soba_noodle: [167, 139, 91],
  ramen_soup: [151, 89, 43],
  tortilla_dough: [221, 185, 116],
  pie_dough: [217, 174, 95],
  custard_cream: [237, 204, 95],
  whipped_cream: [248, 245, 228],
  caramel_sauce: [190, 103, 45],
};

const FOOD_COLORS = {
  cucumber_salad: [86, 174, 83],
  cabbage_roll: [128, 185, 91],
  caesar_salad: [130, 190, 87],
  spinach_soup: [72, 143, 69],
  eggplant_miso: [120, 67, 108],
  stuffed_bell_pepper: [61, 156, 66],
  chili_hot_pot: [196, 59, 42],
  leek_soup: [207, 221, 166],
  ginger_pork: [192, 125, 69],
  lotus_root_tempura: [218, 159, 69],
  burdock_kinpira: [150, 87, 48],
  daikon_stew: [217, 204, 154],
  napa_hot_pot: [211, 220, 139],
  shiso_onigiri: [238, 239, 218],
  sesame_dango: [210, 184, 109],
  peanut_cookie: [201, 137, 69],
  zucchini_gratin: [84, 149, 75],
  asparagus_bacon: [82, 152, 75],
  vegetable_curry: [175, 109, 37],
  curry_udon: [184, 120, 43],
  kitsune_udon: [226, 204, 128],
  tempura_udon: [225, 174, 69],
  zaru_soba: [156, 126, 82],
  yakisoba_bread: [196, 134, 63],
  okonomiyaki: [191, 136, 72],
  takikomi_gohan: [221, 207, 166],
  omurice: [231, 196, 70],
  hayashi_rice: [112, 57, 42],
  croquette: [210, 139, 47],
  tonkatsu: [201, 124, 44],
  ebi_chili: [214, 75, 48],
  mapo_tofu: [190, 61, 43],
  gyoza: [221, 204, 154],
  shumai: [228, 191, 91],
  nikuman: [238, 226, 187],
  cream_stew: [236, 225, 188],
  gratin: [216, 151, 70],
  pancakes: [219, 159, 78],
  apple_pie: [201, 132, 61],
  pudding: [231, 190, 78],
  fruit_parfait: [228, 104, 135],
  matcha_latte: [128, 178, 101],
};

const THEME_COLORS = {
  chicken: [216, 154, 82],
  pork: [210, 125, 93],
  beef: [143, 69, 45],
  bacon: [202, 92, 65],
  egg: [234, 198, 65],
  cheese: [238, 199, 80],
  mushroom: [164, 119, 78],
  potato: [213, 180, 96],
  carrot: [218, 108, 51],
  onion: [226, 207, 138],
  cabbage: [124, 190, 84],
  spinach: [61, 139, 66],
  eggplant: [106, 63, 151],
  bell_pepper: [61, 159, 66],
  leek: [176, 209, 111],
  ginger: [199, 142, 73],
  garlic: [223, 211, 162],
  chili: [202, 57, 41],
  tomato: [190, 60, 44],
  curry: [186, 117, 35],
  miso: [145, 81, 45],
  soy: [89, 50, 35],
  soy_sauce: [89, 50, 35],
  teriyaki: [154, 75, 38],
  sesame: [212, 184, 116],
  peanut: [196, 130, 61],
  cream: [236, 224, 187],
  butter: [235, 199, 81],
  herb: [82, 156, 74],
  daikon: [226, 227, 202],
  burdock: [139, 88, 49],
  lotus_root: [216, 191, 145],
  asparagus: [77, 153, 70],
  zucchini: [70, 139, 77],
  pineapple: [228, 183, 62],
  apple: [203, 63, 57],
  strawberry: [224, 75, 95],
  matcha: [122, 169, 83],
  mikan: [226, 133, 50],
  rice: [247, 246, 233],
  vinegared_rice: [244, 241, 220],
  udon: [238, 230, 198],
  soba: [167, 139, 91],
  ramen: [223, 183, 98],
  macaroni: [230, 203, 132],
  bread: [204, 145, 71],
  buns: [204, 145, 71],
  tortilla: [221, 185, 116],
  pie_dough: [217, 174, 95],
  custard: [237, 204, 95],
  chocolate: [100, 61, 43],
  coffee: [88, 58, 43],
  barley: [190, 151, 83],
  sweet_corn: [232, 194, 70],
  corn: [232, 194, 70],
  pumpkin: [221, 126, 49],
  beetroot: [154, 50, 81],
  kelp: [64, 112, 74],
  honey: [229, 166, 62],
  anko: [111, 54, 64],
  milk: [239, 238, 225],
  flour: [240, 235, 214],
  green_tea: [104, 154, 82],
};

function visualColorForBase(baseId) {
  return THEME_COLORS[baseId] ?? PRODUCE_VISUALS[baseId]?.main ?? MATERIAL_COLORS[baseId] ?? FOOD_COLORS[baseId] ?? hashColor(baseId);
}

function getCuisineTheme(id) {
  if (!id.startsWith("cuisine_")) return undefined;
  return CUISINE_THEMES.find((theme) => id.startsWith(`cuisine_${theme.id}_`));
}

function getCuisineType(id) {
  if (!id.startsWith("cuisine_")) return undefined;
  return CUISINE_TYPES.find((type) => id.endsWith(`_${type.id}`));
}

function mixColor(a, b, ratio = 0.5) {
  return a.map((v, i) => Math.round(v * (1 - ratio) + b[i] * ratio));
}

function thickLine(c, x0, y0, x1, y1, color, size = 1) {
  for (let o = -Math.floor(size / 2); o <= Math.floor(size / 2); o++) {
    c.line(x0, y0 + o, x1, y1 + o, color);
    if (size > 1) c.line(x0 + o, y0, x1 + o, y1, color);
  }
}

function drawPlate(c) {
  c.ellipse(8, 12, 6, 3, PIXEL.outline);
  c.ellipse(8, 11, 6, 3, PIXEL.plate);
  c.ellipse(8, 10, 4, 1.6, PIXEL.plateHi);
}

function drawBowl(c, fill, bowl = PIXEL.bowl) {
  c.ellipse(8, 7, 6, 3, PIXEL.outline);
  c.ellipse(8, 7, 5, 2, fill);
  c.rect(3, 7, 10, 4, bowl);
  c.ellipse(8, 11, 5, 2, PIXEL.bowlDark);
  c.ellipse(8, 10, 4, 1, clampColor(bowl, 40));
  c.set(5, 6, clampColor(fill, 40));
}

function drawGlass(c, fill) {
  c.rect(5, 4, 6, 9, PIXEL.outline);
  c.rect(6, 5, 4, 7, [222, 234, 239], 170);
  c.rect(6, 8, 4, 4, fill);
  c.rect(7, 3, 2, 1, [245, 245, 237]);
  c.set(7, 6, [255, 255, 255], 210);
}

function drawJar(c, fill, lid = [115, 117, 119]) {
  c.rect(5, 3, 6, 2, lid);
  c.rect(4, 5, 8, 8, PIXEL.outline);
  c.rect(5, 6, 6, 6, [216, 226, 231], 185);
  c.rect(5, 8, 6, 4, fill);
  c.rect(6, 6, 1, 3, [255, 255, 255], 150);
}

function drawPouch(c, fill) {
  c.rect(4, 4, 8, 10, PIXEL.outline);
  c.rect(5, 4, 6, 2, [232, 214, 161]);
  c.rect(5, 6, 6, 7, [214, 189, 128]);
  c.rect(6, 9, 4, 3, fill);
  c.set(7, 8, clampColor(fill, 45));
}

function drawCuttingBoard(c) {
  c.rect(3, 10, 10, 4, PIXEL.boardDark);
  c.rect(3, 8, 10, 5, PIXEL.board);
  c.rect(4, 9, 8, 1, clampColor(PIXEL.board, 28));
  c.set(11, 12, PIXEL.boardDark);
}

function produceColor(id) {
  const root = id
    .replace(/_(slice|cut|chopped|leaf|powder|mizin|shaved|grated)$/u, "")
    .replace(/^grated_/u, "")
    .replace(/^shaved_/u, "");
  return PRODUCE_VISUALS[root]?.main ?? MATERIAL_COLORS[id] ?? hashColor(id);
}

function drawProduceIcon(c, id) {
  const p = PRODUCE_VISUALS[id] ?? { shape: "oval", main: hashColor(id), dark: clampColor(hashColor(id), -45), hi: clampColor(hashColor(id), 45) };
  switch (p.shape) {
    case "long":
      thickLine(c, 3, 10, 12, 6, p.dark, 3);
      thickLine(c, 3, 9, 12, 5, p.main, 2);
      c.set(6, 7, p.hi);
      c.set(10, 5, p.hi);
      break;
    case "leafy_ball":
      c.circle(8, 8, 5, p.dark);
      c.circle(8, 8, 4, p.main);
      c.ellipse(6, 7, 3, 2, p.hi);
      c.line(5, 9, 11, 6, p.dark);
      c.line(7, 12, 11, 7, p.dark);
      break;
    case "leafy_open":
      c.ellipse(6, 9, 4, 2, p.dark);
      c.ellipse(10, 9, 4, 2, p.dark);
      c.ellipse(5, 7, 3, 2, p.main);
      c.ellipse(10, 7, 4, 2, p.hi);
      c.line(3, 11, 13, 6, p.dark);
      break;
    case "leaf_bunch":
      c.line(8, 13, 8, 5, p.dark);
      c.ellipse(5, 8, 3, 2, p.main);
      c.ellipse(10, 7, 3, 2, p.hi);
      c.ellipse(8, 5, 3, 2, p.main);
      c.ellipse(6, 11, 2, 2, p.dark);
      break;
    case "oval":
      c.ellipse(8, 9, 4, 6, p.dark);
      c.ellipse(8, 8, 3, 5, p.main);
      c.ellipse(6, 6, 1, 2, p.hi);
      c.rect(6, 3, 5, 2, p.cap ?? PIXEL.darkGreen);
      c.set(8, 2, p.cap ?? PIXEL.darkGreen);
      break;
    case "pepper":
      c.ellipse(8, 9, 4, 5, p.dark);
      c.ellipse(6, 8, 2, 4, p.main);
      c.ellipse(10, 8, 2, 4, p.main);
      c.rect(7, 3, 3, 2, PIXEL.darkGreen);
      c.set(6, 7, p.hi);
      break;
    case "chili":
      thickLine(c, 4, 11, 11, 5, p.dark, 3);
      thickLine(c, 4, 10, 11, 4, p.main, 2);
      c.set(7, 8, p.hi);
      c.line(11, 4, 13, 3, p.cap);
      break;
    case "stalk":
      c.rect(5, 5, 3, 9, p.main);
      c.rect(8, 4, 3, 10, p.hi);
      c.rect(7, 3, 2, 5, p.dark);
      c.rect(10, 4, 2, 5, p.dark);
      c.set(6, 12, [255, 255, 230]);
      break;
    case "knob":
      c.circle(7, 8, 4, p.dark);
      c.circle(7, 8, 3, p.main);
      c.circle(10, 10, 2, p.main);
      c.circle(5, 11, 2, p.hi);
      c.set(8, 6, p.hi);
      break;
    case "root_slice":
      c.ellipse(8, 8, 5, 4, p.dark);
      c.ellipse(8, 8, 4, 3, p.main);
      for (const [x, y] of [[7, 7], [9, 7], [6, 9], [10, 9], [8, 10]]) c.set(x, y, PIXEL.outline);
      c.set(6, 6, p.hi);
      break;
    case "stick":
      thickLine(c, 4, 13, 12, 4, p.dark, 3);
      thickLine(c, 4, 12, 12, 3, p.main, 1);
      c.set(8, 8, p.hi);
      break;
    case "root":
      c.ellipse(8, 9, 3, 6, p.dark);
      c.ellipse(8, 9, 2, 5, p.main);
      c.rect(6, 3, 5, 3, p.cap);
      c.set(7, 8, p.hi);
      break;
    case "napa":
      c.ellipse(8, 9, 4, 6, p.dark);
      c.ellipse(8, 9, 3, 5, p.main);
      c.rect(6, 5, 4, 8, p.hi);
      c.line(8, 4, 8, 13, p.dark);
      break;
    case "leaf_single":
      c.ellipse(8, 8, 5, 4, p.dark);
      c.ellipse(8, 8, 4, 3, p.main);
      c.line(4, 11, 12, 5, p.dark);
      c.set(6, 7, p.hi);
      break;
    case "seeds":
      for (const [x, y] of [[5, 6], [8, 5], [10, 7], [6, 9], [9, 10], [12, 11], [4, 12]]) {
        c.ellipse(x, y, 1, 1.5, p.dark);
        c.set(x, y, p.main);
      }
      c.set(8, 5, p.hi);
      break;
    case "peanut":
      c.circle(7, 7, 3, p.dark);
      c.circle(9, 10, 3, p.dark);
      c.circle(7, 7, 2, p.main);
      c.circle(9, 10, 2, p.main);
      c.set(6, 6, p.hi);
      break;
    case "spear":
      c.line(6, 13, 9, 4, p.dark);
      c.line(7, 13, 10, 4, p.main);
      c.rect(8, 3, 3, 2, p.hi);
      c.set(5, 10, p.hi);
      c.set(10, 7, p.hi);
      break;
    default:
      c.circle(8, 8, 4, p.dark);
      c.circle(8, 8, 3, p.main);
      c.set(7, 6, p.hi);
  }
}

function drawSlicedMaterial(c, item) {
  const color = produceColor(item.id);
  const flesh = mixColor(color, [245, 235, 188], 0.62);
  drawCuttingBoard(c);
  for (const [x, y] of [[5, 8], [8, 8], [11, 9], [6, 11], [10, 11]]) {
    c.ellipse(x, y, 2, 1, color);
    c.ellipse(x, y, 1, 1, flesh);
  }
}

function drawChoppedMaterial(c, item) {
  const color = produceColor(item.id);
  drawCuttingBoard(c);
  for (const [x, y] of [[5, 8], [7, 9], [10, 8], [11, 11], [6, 12], [9, 11], [4, 11]]) {
    c.rect(x, y, 2, 2, clampColor(color, (x + y) % 2 ? 20 : -15));
  }
}

function drawNoodles(c, color) {
  drawPlate(c);
  c.line(4, 9, 12, 9, PIXEL.outline);
  c.line(4, 10, 12, 8, color);
  c.line(5, 11, 12, 10, color);
  c.line(5, 8, 11, 11, color);
  c.line(7, 7, 13, 8, clampColor(color, -25));
}

function fishBaseId(id) {
  return id
    .replace(/^fish_fillet_/u, "")
    .replace(/^fish_mince_/u, "")
    .replace(/^fish_stock_/u, "")
    .replace(/^fish_grilled_/u, "")
    .replace(/^fish_soup_/u, "")
    .replace(/^fish_nigiri_/u, "");
}

function fishGeneratedColor(id) {
  const baseId = fishBaseId(id);
  if (/(tuna|bonito|marlin|swordfish)$/u.test(baseId)) return [170, 56, 64];
  if (/(salmon|trout|char|charr|ayu|sweetfish)$/u.test(baseId)) return [230, 112, 83];
  if (/(shrimp|crab|lobster|crayfish)$/u.test(baseId)) return [222, 106, 72];
  if (/(clam|oyster|scallop|mussel|abalone)$/u.test(baseId)) return [210, 184, 139];
  if (/(eel|conger|hagfish|lamprey)$/u.test(baseId)) return [118, 80, 54];
  if (/(shark|ray|skate|sturgeon|chimaera)$/u.test(baseId)) return [118, 134, 148];
  if (/(squid|octopus|cuttlefish)$/u.test(baseId)) return [224, 213, 195];
  if (/(cod|pollock|haddock|halibut|flounder|sole|whitefish)$/u.test(baseId)) return [221, 211, 184];
  if (/(mackerel|herring|sardine|saury|anchovy)$/u.test(baseId)) return [129, 156, 177];
  return mixColor(hashColor(baseId), [188, 149, 112], 0.35);
}

function drawFishFillet(c, item) {
  const color = fishGeneratedColor(item.id);
  const light = mixColor(color, [246, 218, 197], 0.55);
  drawCuttingBoard(c);
  c.ellipse(7, 8, 4, 2, PIXEL.outline);
  c.ellipse(7, 8, 3, 1.5, light);
  c.line(5, 8, 10, 7, color);
  c.ellipse(10, 11, 4, 2, PIXEL.outline);
  c.ellipse(10, 11, 3, 1.5, light);
  c.line(8, 11, 12, 10, color);
}

function drawFishMince(c, item) {
  const color = mixColor(fishGeneratedColor(item.id), [246, 218, 197], 0.45);
  drawBowl(c, mixColor(color, [240, 226, 204], 0.35), [127, 91, 70]);
  for (const [x, y] of [[5, 7], [7, 6], [8, 8], [10, 7], [11, 8]]) {
    c.set(x, y, clampColor(color, (x + y) % 2 ? 35 : -25));
  }
}

function drawGrilledFish(c, item) {
  const color = mixColor(fishGeneratedColor(item.id), PIXEL.fried, 0.45);
  drawPlate(c);
  c.ellipse(8, 9, 6, 3, PIXEL.outline);
  c.ellipse(8, 9, 5, 2, color);
  c.set(3, 9, PIXEL.outline);
  c.set(13, 8, PIXEL.outline);
  c.line(6, 7, 10, 11, clampColor(color, -55));
  c.line(8, 7, 11, 10, clampColor(color, -55));
  c.set(5, 8, clampColor(color, 42));
  garnish(c, PIXEL.green);
}

function drawFishNigiri(c, item) {
  const topping = fishGeneratedColor(item.id);
  drawPlate(c);
  c.ellipse(8, 10, 5, 2.5, PIXEL.outline);
  c.ellipse(8, 10, 4, 1.5, PIXEL.rice);
  c.ellipse(8, 8, 5, 2, PIXEL.outline);
  c.ellipse(8, 8, 4, 1.25, topping);
  c.line(5, 8, 11, 7, clampColor(topping, 35));
  c.set(11, 9, clampColor(topping, -35));
}

function generatedTypeFromId(id, prefix, types) {
  if (!id.startsWith(prefix)) return undefined;
  return types.find((type) => id.endsWith(`_${type.id}`));
}

function generatedBaseId(id, prefix, types) {
  const type = generatedTypeFromId(id, prefix, types);
  if (!type) return id;
  return id.slice(prefix.length, -(`_${type.id}`).length);
}

function homeGeneratedColor(id) {
  const prefix = id.startsWith("homeprep_") ? "homeprep_" : "homefood_";
  const types = prefix === "homeprep_" ? HOME_MATERIAL_TYPES : HOME_DISH_TYPES;
  return visualColorForBase(generatedBaseId(id, prefix, types));
}

function drawHomePrepIcon(c, item) {
  const type = generatedTypeFromId(item.id, "homeprep_", HOME_MATERIAL_TYPES);
  const color = homeGeneratedColor(item.id);
  const light = mixColor(color, [242, 226, 186], 0.45);

  switch (type?.id) {
    case "diced":
    case "garnish":
      drawCuttingBoard(c);
      for (const [x, y] of [[5, 8], [8, 8], [11, 9], [6, 11], [10, 11], [8, 12]]) {
        c.rect(x, y, 2, 2, clampColor(color, (x + y) % 2 ? 28 : -18));
      }
      return;
    case "sliced":
      drawCuttingBoard(c);
      for (const [x, y] of [[5, 8], [8, 8], [11, 9], [6, 11], [10, 11]]) {
        c.ellipse(x, y, 2, 1, color);
        c.ellipse(x, y, 1, 1, light);
      }
      return;
    case "paste":
    case "filling":
      drawBowl(c, mixColor(color, PIXEL.cream, 0.35), [128, 93, 70]);
      c.set(6, 7, clampColor(color, 35));
      c.set(10, 8, clampColor(color, -30));
      return;
    case "sauce":
    case "marinade":
      drawJar(c, mixColor(color, [165, 80, 48], 0.3), [120, 86, 52]);
      return;
    case "broth":
    case "cream_base":
      {
        const fill = type.id === "cream_base" ? mixColor(color, PIXEL.cream, 0.7) : mixColor(color, [210, 162, 88], 0.45);
        drawBowl(c, fill);
        c.ellipse(8, 6, 4, 1, clampColor(fill, 28));
        c.set(10, 7, clampColor(fill, -32));
      }
      return;
    case "saute_base":
      drawPlate(c);
      c.ellipse(8, 9, 5, 3, mixColor(color, PIXEL.fried, 0.35));
      c.line(5, 8, 11, 11, clampColor(color, -45));
      garnish(c);
      return;
    default:
      drawJar(c, color);
  }
}

function drawHomeFoodIcon(c, item) {
  const type = generatedTypeFromId(item.id, "homefood_", HOME_DISH_TYPES);
  const color = homeGeneratedColor(item.id);
  const id = type?.id ?? "";

  if (/(soup|stew|ragout|fondue)$/u.test(id)) return drawSoupBowl(c, color);
  if (/(rice_bowl|curry_plate|risotto|doria|pilaf|bento)$/u.test(id)) return drawRicePlate(c, color);
  if (/(pasta|noodle_bowl|udon_bowl|soba_bowl|ramen_bowl)$/u.test(id)) return drawNoodleBowl(c, color);
  if (/(croquette|cutlet|tempura)$/u.test(id)) return drawFriedPlate(c, mixColor(color, PIXEL.fried, 0.35));

  if (/(sandwich|tartine|toast|wrap)$/u.test(id)) {
    c.rect(3, 7, 10, 5, PIXEL.outline);
    c.rect(4, 6, 8, 3, PIXEL.bread);
    c.rect(4, 9, 8, 2, color);
    c.rect(5, 8, 7, 1, PIXEL.green);
    c.rect(4, 11, 8, 2, PIXEL.breadDark);
    return;
  }

  if (/(gratin|pot_pie|quiche|souffle|pizza)$/u.test(id)) {
    c.rect(3, 7, 10, 6, PIXEL.outline);
    c.rect(4, 8, 8, 4, [112, 76, 50]);
    c.rect(5, 7, 6, 4, mixColor(color, PIXEL.cream, 0.45));
    c.set(6, 8, color);
    c.set(10, 9, PIXEL.fried);
    return;
  }

  if (/(omelet|breakfast_plate)$/u.test(id)) {
    drawPlate(c);
    c.ellipse(8, 8, 5, 3, [232, 196, 70]);
    c.line(5, 8, 11, 8, color);
    c.set(6, 7, [255, 230, 116]);
    return;
  }

  if (/(terrine|course_appetizer|tasting_bowl|salad_plate)$/u.test(id)) {
    drawPlate(c);
    c.ellipse(7, 8, 4, 2, PIXEL.green);
    c.ellipse(10, 9, 3, 2, mixColor(color, PIXEL.cream, 0.3));
    c.set(8, 7, color);
    c.set(11, 10, clampColor(color, -35));
    return;
  }

  drawPlate(c);
  c.ellipse(8, 8, 5, 3, color);
  c.set(6, 7, clampColor(color, 45));
  c.set(10, 10, clampColor(color, -35));
  garnish(c);
}

function drawBreadExpansionIcon(c, item) {
  const type = generatedTypeFromId(item.id, "breadcraft_", BREAD_FORMS);
  const color = mixColor(visualColorForBase(generatedBaseId(item.id, "breadcraft_", BREAD_FORMS)), PIXEL.bread, 0.55);
  const crust = clampColor(color, -45);

  switch (type?.id) {
    case "baguette":
      thickLine(c, 3, 11, 12, 6, crust, 4);
      thickLine(c, 3, 10, 12, 5, color, 2);
      c.line(6, 8, 8, 7, [249, 222, 154]);
      c.line(9, 6, 11, 5, [249, 222, 154]);
      return;
    case "roll":
      drawPlate(c);
      for (const [x, y] of [[6, 9], [9, 9], [8, 7]]) {
        c.ellipse(x, y, 3, 2, crust);
        c.ellipse(x, y - 1, 2, 1, color);
      }
      return;
    case "brioche":
      drawPlate(c);
      c.ellipse(8, 10, 5, 3, crust);
      c.ellipse(8, 9, 4, 2, color);
      c.circle(8, 6, 2, color);
      c.set(7, 5, [255, 231, 171]);
      return;
    case "flatbread":
      drawPlate(c);
      c.ellipse(8, 9, 6, 3, crust);
      c.ellipse(8, 8, 5, 2, color);
      c.set(5, 8, clampColor(color, -30));
      c.set(10, 9, clampColor(color, 35));
      return;
    default:
      c.rect(4, 7, 9, 6, PIXEL.outline);
      c.rect(5, 6, 7, 5, color);
      c.rect(5, 10, 7, 2, crust);
      c.set(6, 7, [255, 231, 171]);
      c.set(10, 9, clampColor(color, -20));
  }
}

function drawAlcoholExpansionIcon(c, item) {
  const fill = mixColor(visualColorForBase(generatedBaseId(item.id, "alcohol_", ALCOHOL_STYLES)), [154, 80, 46], 0.35);
  if (item.id.endsWith("_wine") || item.id.endsWith("_liqueur")) {
    drawGlass(c, fill);
    c.rect(7, 12, 2, 2, PIXEL.outline);
    c.rect(5, 14, 6, 1, PIXEL.outline);
    return;
  }
  drawJar(c, fill, [84, 58, 42]);
  c.rect(6, 2, 4, 2, [113, 74, 45]);
}

function drawRiceCookerExpansionIcon(c, item) {
  const color = mixColor(visualColorForBase(generatedBaseId(item.id, "ricecooker_", RICE_COOKER_TYPES)), PIXEL.rice, 0.42);
  drawBowl(c, PIXEL.rice);
  c.ellipse(8, 7, 5, 2, color);
  c.set(6, 6, clampColor(color, 45));
  c.set(10, 8, clampColor(color, -35));
  garnish(c, PIXEL.green);
}

function drawGriddleExpansionIcon(c, item) {
  const color = mixColor(visualColorForBase(generatedBaseId(item.id, "griddle_", GRIDDLE_TYPES)), PIXEL.fried, 0.38);
  c.rect(2, 11, 12, 2, PIXEL.outline);
  c.rect(3, 10, 10, 2, [65, 68, 70]);
  c.ellipse(8, 8, 5, 3, PIXEL.outline);
  c.ellipse(8, 8, 4, 2, color);
  c.line(5, 7, 11, 9, clampColor(color, -55));
  c.set(6, 6, clampColor(color, 45));
  garnish(c);
}

function drawSteamerExpansionIcon(c, item) {
  const color = mixColor(visualColorForBase(generatedBaseId(item.id, "steamer_", STEAMER_TYPES)), PIXEL.cream, 0.58);
  drawBowl(c, [224, 211, 166], [139, 101, 67]);
  c.ellipse(6, 7, 2, 2, color);
  c.ellipse(9, 7, 2, 2, clampColor(color, -20));
  c.ellipse(11, 8, 2, 2, color);
  c.set(5, 4, [221, 221, 209], 150);
  c.set(8, 3, [221, 221, 209], 150);
  c.set(11, 4, [221, 221, 209], 150);
}

function drawIceExpansionIcon(c, item) {
  const color = mixColor(visualColorForBase(generatedBaseId(item.id, "icecraft_", ICE_STYLES)), [137, 213, 235], 0.45);
  if (item.id.endsWith("_popsicle")) {
    c.rect(6, 4, 5, 8, PIXEL.outline);
    c.rect(7, 5, 3, 6, color);
    c.rect(8, 11, 1, 4, [147, 91, 48]);
    c.set(8, 5, [244, 252, 255]);
    return;
  }

  drawBowl(c, [219, 238, 244], [85, 141, 170]);
  c.ellipse(8, 6, 5, 3, PIXEL.outline);
  c.ellipse(8, 6, 4, 2, color);
  c.set(6, 5, [250, 255, 255]);
  c.set(10, 7, clampColor(color, -35));
  if (item.id.endsWith("_parfait")) {
    c.set(8, 3, [248, 246, 232]);
    c.set(9, 4, [235, 80, 96]);
  }
}

function drawDrinkExpansionIcon(c, item) {
  const color = mixColor(visualColorForBase(generatedBaseId(item.id, "drinkcraft_", DRINK_STYLES)), [220, 104, 75], 0.42);
  if (item.id.endsWith("_latte") || item.id.endsWith("_shake")) {
    drawGlass(c, mixColor(color, PIXEL.cream, 0.55));
    c.rect(6, 5, 4, 2, PIXEL.cream);
    c.set(7, 4, [255, 255, 245]);
    return;
  }

  drawGlass(c, color);
  c.set(10, 4, [233, 238, 228]);
  c.line(10, 4, 12, 2, [233, 238, 228]);
  if (item.id.endsWith("_soda") || item.id.endsWith("_squash")) {
    c.set(7, 8, [255, 255, 255], 180);
    c.set(9, 10, [255, 255, 255], 180);
  }
}

function drawMaterialIcon(c, item) {
  const id = item.id;
  const color = MATERIAL_COLORS[id] ?? produceColor(id);

  if (id.startsWith("fish_fillet_")) return drawFishFillet(c, item);
  if (id.startsWith("fish_mince_")) return drawFishMince(c, item);
  if (id.startsWith("fish_stock_")) return drawBowl(c, mixColor(fishGeneratedColor(id), [218, 178, 102], 0.58));
  if (id.startsWith("homeprep_")) return drawHomePrepIcon(c, item);
  if (/(slice|cut)$/u.test(id)) return drawSlicedMaterial(c, item);
  if (/(chopped|grated|shaved)$/u.test(id)) return drawChoppedMaterial(c, item);
  if (/(leaf)$/u.test(id)) return drawProduceIcon(c, id.replace(/_leaf$/u, ""));
  if (/(powder|starch|flour)$/u.test(id)) return drawPouch(c, color);
  if (/(sauce|stock|dashi|base|batter|cream|potato)$/u.test(id) || id === "mayonnaise") return drawBowl(c, color);
  if (/(noodle)$/u.test(id)) return drawNoodles(c, color);
  if (/(dough)$/u.test(id)) {
    c.ellipse(8, 10, 5, 4, PIXEL.outline);
    c.ellipse(8, 9, 4, 3, color);
    c.set(6, 8, clampColor(color, 35));
    c.set(10, 10, clampColor(color, -25));
    return;
  }
  if (id === "breadcrumbs") return drawPouch(c, color);
  if (id === "peanut_butter" || id === "caramel_sauce") return drawJar(c, color, [120, 86, 52]);
  if (id === "tempura_batter") return drawBowl(c, color, [145, 104, 70]);

  drawJar(c, color);
}

function garnish(c, color = PIXEL.green) {
  c.set(5, 8, color);
  c.set(10, 7, color);
  c.set(11, 10, color);
}

function drawFriedPlate(c, color) {
  drawPlate(c);
  for (const [x, y, r] of [[6, 8, 2], [9, 8, 2], [8, 10, 2], [11, 10, 1]]) {
    c.circle(x, y, r, PIXEL.friedDark);
    c.circle(x, y, Math.max(1, r - 1), color);
    c.set(x - 1, y - 1, clampColor(color, 40));
  }
}

function drawRicePlate(c, sauce) {
  drawPlate(c);
  c.ellipse(6, 9, 3, 2, PIXEL.rice);
  c.ellipse(10, 9, 4, 3, sauce);
  c.set(5, 8, [255, 255, 255]);
  c.set(10, 7, clampColor(sauce, 35));
}

function drawNoodleBowl(c, broth) {
  drawBowl(c, broth);
  c.line(5, 7, 11, 6, PIXEL.noodle);
  c.line(5, 8, 12, 8, PIXEL.noodle);
  c.line(6, 9, 11, 7, clampColor(PIXEL.noodle, -20));
  c.circle(5, 6, 1, [84, 146, 68]);
  c.circle(11, 7, 1, [219, 166, 65]);
}

function drawSoupBowl(c, fill) {
  drawBowl(c, fill);
  c.set(6, 7, [245, 242, 220]);
  c.set(9, 6, PIXEL.green);
  c.set(11, 8, clampColor(fill, 45));
}

function drawFoodIcon(c, item) {
  const id = item.id;
  const cuisineTheme = getCuisineTheme(id);
  const cuisineType = getCuisineType(id);
  const color = FOOD_COLORS[id] ?? cuisineTheme?.color ?? hashColor(id);

  if (id.startsWith("fish_grilled_")) return drawGrilledFish(c, item);
  if (id.startsWith("fish_soup_")) return drawSoupBowl(c, mixColor(fishGeneratedColor(id), [201, 154, 86], 0.55));
  if (id.startsWith("fish_nigiri_")) return drawFishNigiri(c, item);
  if (id.startsWith("homefood_")) return drawHomeFoodIcon(c, item);
  if (id.startsWith("breadcraft_")) return drawBreadExpansionIcon(c, item);
  if (id.startsWith("alcohol_")) return drawAlcoholExpansionIcon(c, item);
  if (id.startsWith("ricecooker_")) return drawRiceCookerExpansionIcon(c, item);
  if (id.startsWith("griddle_")) return drawGriddleExpansionIcon(c, item);
  if (id.startsWith("steamer_")) return drawSteamerExpansionIcon(c, item);
  if (id.startsWith("icecraft_")) return drawIceExpansionIcon(c, item);
  if (id.startsWith("drinkcraft_")) return drawDrinkExpansionIcon(c, item);

  if (cuisineType) {
    switch (cuisineType.id) {
      case "rice_bowl":
      case "donburi":
        drawBowl(c, PIXEL.rice);
        c.ellipse(8, 7, 4, 2, color);
        garnish(c, clampColor(color, 35));
        return;
      case "fried_rice":
      case "pilaf":
        drawPlate(c);
        c.ellipse(8, 9, 5, 3, mixColor(PIXEL.rice, color, 0.42));
        c.set(6, 8, [236, 192, 62]);
        c.set(10, 10, PIXEL.green);
        c.set(11, 8, clampColor(color, -30));
        return;
      case "curry_rice":
        return drawRicePlate(c, color);
      case "onigiri":
        c.rect(5, 10, 7, 3, PIXEL.outline);
        c.ellipse(8, 9, 4, 5, PIXEL.rice);
        c.rect(7, 8, 3, 4, color);
        c.set(6, 8, [255, 255, 255]);
        return;
      case "sushi_roll":
        drawPlate(c);
        for (const [x, y] of [[5, 9], [8, 8], [11, 9]]) {
          c.circle(x, y, 2, [25, 52, 39]);
          c.circle(x, y, 1, PIXEL.rice);
          c.set(x, y, color);
        }
        return;
      case "udon":
      case "soba":
      case "ramen":
        return drawNoodleBowl(c, color);
      case "pasta":
      case "spaghetti":
        return drawNoodles(c, mixColor(PIXEL.noodle, color, 0.35));
      case "soup":
      case "stew":
      case "hot_pot":
        return drawSoupBowl(c, color);
      case "salad":
        drawPlate(c);
        c.ellipse(7, 8, 4, 2, PIXEL.green);
        c.ellipse(10, 9, 3, 2, clampColor(PIXEL.green, 35));
        c.set(8, 7, color);
        c.set(11, 10, clampColor(color, -35));
        return;
      case "sandwich":
        c.rect(3, 7, 10, 5, PIXEL.outline);
        c.rect(4, 6, 8, 3, PIXEL.bread);
        c.rect(4, 9, 8, 2, color);
        c.rect(5, 8, 7, 1, PIXEL.green);
        c.rect(4, 11, 8, 2, PIXEL.breadDark);
        return;
      case "burger":
        c.ellipse(8, 6, 5, 2, PIXEL.bread);
        c.rect(4, 7, 9, 2, color);
        c.rect(4, 9, 9, 1, PIXEL.green);
        c.rect(4, 10, 9, 2, [117, 65, 39]);
        c.ellipse(8, 12, 5, 2, PIXEL.breadDark);
        return;
      case "pizza":
        c.line(4, 4, 12, 12, PIXEL.breadDark);
        c.line(12, 12, 5, 13, PIXEL.breadDark);
        c.line(4, 4, 5, 13, PIXEL.breadDark);
        c.ellipse(8, 10, 4, 3, [224, 187, 87]);
        c.set(7, 8, color);
        c.set(10, 11, PIXEL.redSauce);
        c.set(6, 11, PIXEL.green);
        return;
      case "gratin":
        c.rect(3, 7, 10, 6, PIXEL.outline);
        c.rect(4, 8, 8, 4, [112, 76, 50]);
        c.rect(5, 7, 6, 4, mixColor(color, PIXEL.cream, 0.55));
        c.set(6, 8, color);
        c.set(10, 9, PIXEL.fried);
        return;
      case "pie":
        drawPlate(c);
        c.ellipse(8, 9, 5, 3, PIXEL.breadDark);
        c.ellipse(8, 8, 4, 3, mixColor(color, PIXEL.bread, 0.55));
        c.line(5, 7, 11, 10, PIXEL.bread);
        c.line(5, 10, 11, 7, PIXEL.bread);
        c.set(8, 6, color);
        return;
      case "dumpling":
      case "gyoza":
        drawPlate(c);
        for (const [x, y] of [[5, 9], [8, 8], [11, 9]]) {
          c.ellipse(x, y, 2, 1.5, PIXEL.outline);
          c.ellipse(x, y, 1.5, 1, mixColor(PIXEL.cream, color, 0.25));
          c.set(x, y, color);
        }
        return;
      case "tempura":
      case "cutlet":
        return drawFriedPlate(c, mixColor(PIXEL.fried, color, 0.35));
    }
  }

  if (/salad$/u.test(id)) {
    drawPlate(c);
    c.ellipse(7, 8, 4, 2, color);
    c.ellipse(10, 9, 3, 2, clampColor(color, 30));
    c.set(6, 7, [245, 242, 210]);
    c.set(11, 8, PIXEL.redSauce);
    return;
  }
  if (/(soup|stew|hot_pot)$/u.test(id)) return drawSoupBowl(c, color);
  if (/(udon)$/u.test(id)) return drawNoodleBowl(c, color);
  if (id === "zaru_soba") return drawNoodles(c, color);
  if (/(tempura|croquette|tonkatsu)$/u.test(id)) return drawFriedPlate(c, color);
  if (/(curry|hayashi_rice)$/u.test(id)) return drawRicePlate(c, color);

  switch (id) {
    case "shiso_onigiri":
      c.rect(5, 10, 7, 3, PIXEL.outline);
      c.ellipse(8, 9, 4, 5, PIXEL.rice);
      c.rect(7, 7, 3, 4, PIXEL.darkGreen);
      c.set(6, 8, [255, 255, 255]);
      break;
    case "sesame_dango":
      c.line(4, 12, 12, 4, [125, 84, 51]);
      for (const [x, y] of [[6, 10], [8, 8], [10, 6]]) {
        c.circle(x, y, 2, PIXEL.outline);
        c.circle(x, y, 1, color);
      }
      break;
    case "peanut_cookie":
      c.circle(8, 8, 5, PIXEL.breadDark);
      c.circle(8, 8, 4, color);
      for (const p of [[6, 7], [9, 6], [10, 10], [7, 11]]) c.set(...p, [104, 61, 34]);
      break;
    case "stuffed_bell_pepper":
      drawPlate(c);
      c.ellipse(6, 8, 3, 4, PIXEL.darkGreen);
      c.ellipse(10, 9, 3, 4, PIXEL.green);
      c.circle(8, 9, 2, [137, 72, 43]);
      break;
    case "cabbage_roll":
      drawPlate(c);
      c.rect(4, 8, 9, 4, [153, 102, 53]);
      c.rect(5, 7, 7, 3, color);
      c.line(5, 8, 12, 8, clampColor(color, -35));
      break;
    case "ginger_pork":
    case "asparagus_bacon":
    case "burdock_kinpira":
    case "eggplant_miso":
    case "ebi_chili":
    case "mapo_tofu":
      drawPlate(c);
      c.ellipse(8, 9, 5, 3, color);
      c.line(5, 8, 11, 11, clampColor(color, -45));
      c.set(6, 7, clampColor(color, 45));
      garnish(c);
      break;
    case "okonomiyaki":
      drawPlate(c);
      c.circle(8, 8, 4, PIXEL.breadDark);
      c.circle(8, 8, 3, color);
      c.line(5, 7, 11, 10, PIXEL.redSauce);
      c.line(5, 10, 11, 7, PIXEL.cream);
      garnish(c);
      break;
    case "takikomi_gohan":
      drawBowl(c, PIXEL.rice, [122, 88, 69]);
      c.set(6, 7, [124, 83, 47]);
      c.set(10, 8, [211, 134, 66]);
      break;
    case "omurice":
      drawPlate(c);
      c.ellipse(8, 8, 5, 3, color);
      c.line(5, 8, 11, 8, PIXEL.redSauce);
      c.set(6, 7, clampColor(color, 35));
      break;
    case "yakisoba_bread":
      c.ellipse(8, 10, 6, 3, PIXEL.breadDark);
      c.ellipse(8, 9, 5, 2, PIXEL.bread);
      c.line(4, 8, 12, 8, [91, 50, 31]);
      c.line(5, 7, 12, 9, [91, 50, 31]);
      break;
    case "gyoza":
      drawPlate(c);
      for (const [x, y] of [[5, 9], [8, 8], [11, 9]]) {
        c.ellipse(x, y, 2, 1.5, PIXEL.outline);
        c.ellipse(x, y, 1.5, 1, color);
      }
      break;
    case "shumai":
      drawPlate(c);
      for (const [x, y] of [[6, 8], [9, 8], [8, 10]]) {
        c.rect(x - 1, y - 1, 3, 3, PIXEL.outline);
        c.rect(x, y - 1, 2, 2, color);
      }
      break;
    case "nikuman":
      drawPlate(c);
      c.circle(8, 8, 4, PIXEL.outline);
      c.circle(8, 8, 3, color);
      c.line(6, 7, 10, 9, clampColor(color, -45));
      c.line(10, 7, 6, 9, clampColor(color, -45));
      break;
    case "gratin":
    case "zucchini_gratin":
      c.rect(3, 7, 10, 6, PIXEL.outline);
      c.rect(4, 8, 8, 4, [112, 76, 50]);
      c.rect(5, 7, 6, 4, color);
      c.set(6, 8, PIXEL.cream);
      c.set(10, 9, PIXEL.green);
      break;
    case "pancakes":
      drawPlate(c);
      c.ellipse(8, 10, 5, 2, PIXEL.breadDark);
      c.ellipse(8, 8, 5, 2, color);
      c.ellipse(8, 6, 4, 2, clampColor(color, 20));
      c.rect(7, 4, 3, 2, [232, 209, 88]);
      c.line(7, 5, 10, 9, [145, 76, 42]);
      break;
    case "apple_pie":
      drawPlate(c);
      c.ellipse(8, 9, 5, 3, PIXEL.breadDark);
      c.ellipse(8, 8, 4, 3, color);
      c.line(5, 7, 11, 10, [238, 190, 96]);
      c.line(5, 10, 11, 7, [238, 190, 96]);
      c.set(8, 6, [186, 55, 47]);
      break;
    case "pudding":
      drawPlate(c);
      c.rect(6, 6, 5, 5, color);
      c.ellipse(8, 6, 3, 1.5, [128, 68, 35]);
      c.ellipse(8, 11, 4, 1.5, color);
      break;
    case "fruit_parfait":
      drawGlass(c, PIXEL.cream);
      c.set(6, 6, [225, 72, 96]);
      c.set(9, 7, [236, 187, 62]);
      c.set(8, 5, [108, 176, 81]);
      break;
    case "matcha_latte":
      c.rect(5, 6, 7, 6, PIXEL.outline);
      c.rect(6, 7, 5, 4, [239, 238, 225]);
      c.rect(6, 8, 5, 3, color);
      c.rect(11, 8, 2, 3, PIXEL.outline);
      c.set(7, 7, [255, 255, 255]);
      break;
    default:
      drawPlate(c);
      c.ellipse(8, 8, 5, 3, color);
      c.set(6, 7, clampColor(color, 45));
      c.set(10, 10, clampColor(color, -35));
      garnish(c);
  }
}

function drawItemIcon(item) {
  const c = makeCanvas();
  if (item.kind === "crop") drawProduceIcon(c, item.id);
  else if (item.kind === "material") drawMaterialIcon(c, item);
  else drawFoodIcon(c, item);
  return c.pixels;
}

function drawCropStage(id, stage) {
  const base = visualColorForBase(id);
  const leaf = [57, 143, 64];
  const dark = [34, 100, 45];
  const c = makeCanvas();
  const height = [4, 8, 11, 13][stage - 1];
  c.rect(7, 15 - height, 2, height, dark);
  c.rect(5, 14 - Math.floor(height * 0.6), 6, 2, leaf);
  if (stage >= 2) c.rect(4, 13 - Math.floor(height * 0.5), 8, 2, leaf);
  if (stage >= 3) {
    c.rect(6, 8, 1, 4, dark);
    c.rect(9, 8, 1, 4, dark);
  }
  if (stage >= 4) {
    c.circle(6, 7, 2, base);
    c.circle(10, 8, 2, clampColor(base, -25));
    c.set(5, 6, clampColor(base, 40));
  }
  return c.pixels;
}

const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuf = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crc]);
}

function writePng(filePath, pixels) {
  ensureDir(filePath);
  const w = 16;
  const h = 16;
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    const row = y * (w * 4 + 1);
    raw[row] = 0;
    for (let x = 0; x < w * 4; x++) raw[row + 1 + x] = pixels[y * w * 4 + x];
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
  fs.writeFileSync(filePath, png);
}

function updateAtlas() {
  const itemTexturePath = path.join(rpDir, "textures/item_texture.json");
  const itemTexture = JSON.parse(fs.readFileSync(itemTexturePath, "utf8"));
  for (const item of allItems) {
    itemTexture.texture_data[item.id] = {
      textures: item.texture,
    };
  }
  writeJson(itemTexturePath, itemTexture);

  const terrainPath = path.join(rpDir, "textures/terrain_texture.json");
  const terrain = JSON.parse(fs.readFileSync(terrainPath, "utf8"));
  for (const crop of crops) {
    for (let stage = 1; stage <= 4; stage++) {
      terrain.texture_data[`${crop.id}_stage_${stage}`] = {
        textures: `textures/blocks/crop/generated/${crop.id}_stage_${stage}`,
      };
    }
  }
  writeJson(terrainPath, terrain);
}

function updateLang() {
  const langs = {
    "ja_JP.lang": {
      item: (item) => item.names?.["ja_JP.lang"] ?? item.ja,
      crop: (item) => `${item.ja}の作物`,
    },
    "en_US.lang": {
      item: (item) => item.names?.["en_US.lang"] ?? item.en,
      crop: (item) => `${item.en} Crop`,
    },
    "en_GB.lang": {
      item: (item) => item.names?.["en_GB.lang"] ?? item.en,
      crop: (item) => `${item.en} Crop`,
    },
    "zh_CN.lang": {
      item: (item) => item.names?.["zh_CN.lang"] ?? item.en,
      crop: (item) => `${firstName(item.names ?? {}, "zh_CN.lang") ?? item.en} 作物`,
    },
    "zh_TW.lang": {
      item: (item) => item.names?.["zh_TW.lang"] ?? item.en,
      crop: (item) => `${firstName(item.names ?? {}, "zh_TW.lang") ?? item.en} 作物`,
    },
    "ko_KR.lang": {
      item: (item) => item.names?.["ko_KR.lang"] ?? item.en,
      crop: (item) => `${firstName(item.names ?? {}, "ko_KR.lang") ?? item.en} 작물`,
    },
  };
  const categoryLangs = {
    "ja_JP.lang": {
      "cooking.category.all": "すべて",
      "cooking.category.low_level": "低レベル",
      "cooking.category.materials": "中間素材",
      "cooking.category.fish": "魚",
      "cooking.category.home": "家庭/レストラン",
      "cooking.category.bread": "パン",
      "cooking.category.alcohol": "酒",
      "cooking.category.rice_cooker": "炊飯器",
      "cooking.category.iron_board": "鉄板料理",
      "cooking.category.steamer": "蒸し器",
      "cooking.category.ice": "アイス",
      "cooking.category.drink": "飲み物",
      "cooking.category.generated": "追加料理",
      "cooking.category.classic": "定番",
      "cooking.category.prev": "前のカテゴリ",
      "cooking.category.next": "次のカテゴリ",
      "cooking.category.current": "§bカテゴリ: %s",
    },
    "en_US.lang": {
      "cooking.category.all": "All",
      "cooking.category.low_level": "Low Level",
      "cooking.category.materials": "Intermediate Materials",
      "cooking.category.fish": "Fish",
      "cooking.category.home": "Home/Restaurant",
      "cooking.category.bread": "Bread",
      "cooking.category.alcohol": "Alcohol",
      "cooking.category.rice_cooker": "Rice Cooker",
      "cooking.category.iron_board": "Griddle",
      "cooking.category.steamer": "Steamer",
      "cooking.category.ice": "Ice",
      "cooking.category.drink": "Drinks",
      "cooking.category.generated": "Expanded Recipes",
      "cooking.category.classic": "Classic",
      "cooking.category.prev": "Previous Category",
      "cooking.category.next": "Next Category",
      "cooking.category.current": "§bCategory: %s",
    },
    "en_GB.lang": {
      "cooking.category.all": "All",
      "cooking.category.low_level": "Low Level",
      "cooking.category.materials": "Intermediate Materials",
      "cooking.category.fish": "Fish",
      "cooking.category.home": "Home/Restaurant",
      "cooking.category.bread": "Bread",
      "cooking.category.alcohol": "Alcohol",
      "cooking.category.rice_cooker": "Rice Cooker",
      "cooking.category.iron_board": "Griddle",
      "cooking.category.steamer": "Steamer",
      "cooking.category.ice": "Ice",
      "cooking.category.drink": "Drinks",
      "cooking.category.generated": "Expanded Recipes",
      "cooking.category.classic": "Classic",
      "cooking.category.prev": "Previous Category",
      "cooking.category.next": "Next Category",
      "cooking.category.current": "§bCategory: %s",
    },
    "zh_CN.lang": {
      "cooking.category.all": "全部",
      "cooking.category.low_level": "低等级",
      "cooking.category.materials": "中间素材",
      "cooking.category.fish": "鱼类",
      "cooking.category.home": "家庭/餐厅",
      "cooking.category.bread": "面包",
      "cooking.category.alcohol": "酒",
      "cooking.category.rice_cooker": "电饭锅",
      "cooking.category.iron_board": "铁板料理",
      "cooking.category.steamer": "蒸笼",
      "cooking.category.ice": "冰品",
      "cooking.category.drink": "饮料",
      "cooking.category.generated": "扩展料理",
      "cooking.category.classic": "经典",
      "cooking.category.prev": "上个分类",
      "cooking.category.next": "下个分类",
      "cooking.category.current": "§b分类: %s",
    },
    "zh_TW.lang": {
      "cooking.category.all": "全部",
      "cooking.category.low_level": "低等級",
      "cooking.category.materials": "中間素材",
      "cooking.category.fish": "魚類",
      "cooking.category.home": "家庭/餐廳",
      "cooking.category.bread": "麵包",
      "cooking.category.alcohol": "酒",
      "cooking.category.rice_cooker": "電子鍋",
      "cooking.category.iron_board": "鐵板料理",
      "cooking.category.steamer": "蒸籠",
      "cooking.category.ice": "冰品",
      "cooking.category.drink": "飲品",
      "cooking.category.generated": "擴展料理",
      "cooking.category.classic": "經典",
      "cooking.category.prev": "上一個分類",
      "cooking.category.next": "下一個分類",
      "cooking.category.current": "§b分類: %s",
    },
    "ko_KR.lang": {
      "cooking.category.all": "전체",
      "cooking.category.low_level": "낮은 레벨",
      "cooking.category.materials": "중간 재료",
      "cooking.category.fish": "생선",
      "cooking.category.home": "가정/레스토랑",
      "cooking.category.bread": "빵",
      "cooking.category.alcohol": "술",
      "cooking.category.rice_cooker": "밥솥",
      "cooking.category.iron_board": "철판 요리",
      "cooking.category.steamer": "찜기",
      "cooking.category.ice": "아이스",
      "cooking.category.drink": "음료",
      "cooking.category.generated": "확장 요리",
      "cooking.category.classic": "클래식",
      "cooking.category.prev": "이전 카테고리",
      "cooking.category.next": "다음 카테고리",
      "cooking.category.current": "§b카테고리: %s",
    },
  };
  const creativeGroupLangs = {
    "ja_JP.lang": {
      "itemGroup.name.mc.crops": "MakeCountry 作物",
      "itemGroup.name.mc.materials": "MakeCountry 素材",
      "itemGroup.name.mc.fish": "MakeCountry 魚",
      "itemGroup.name.mc.foods": "MakeCountry 料理",
      "itemGroup.name.mc.breads": "MakeCountry パン",
      "itemGroup.name.mc.drinks": "MakeCountry 飲み物",
      "itemGroup.name.mc.alcohol": "MakeCountry 酒",
      "itemGroup.name.mc.ice": "MakeCountry アイス",
      "itemGroup.name.mc.tools": "MakeCountry 道具",
      "itemGroup.name.mc.metals": "MakeCountry 金属",
      "itemGroup.name.mc.chemicals": "MakeCountry 化学",
      "itemGroup.name.mc.storage": "MakeCountry 収納",
      "itemGroup.name.mc.stations": "MakeCountry 調理設備",
      "itemGroup.name.mc.ores": "MakeCountry 鉱石",
    },
    "en_US.lang": {
      "itemGroup.name.mc.crops": "MakeCountry Crops",
      "itemGroup.name.mc.materials": "MakeCountry Materials",
      "itemGroup.name.mc.fish": "MakeCountry Fish",
      "itemGroup.name.mc.foods": "MakeCountry Foods",
      "itemGroup.name.mc.breads": "MakeCountry Breads",
      "itemGroup.name.mc.drinks": "MakeCountry Drinks",
      "itemGroup.name.mc.alcohol": "MakeCountry Alcohol",
      "itemGroup.name.mc.ice": "MakeCountry Ice",
      "itemGroup.name.mc.tools": "MakeCountry Tools",
      "itemGroup.name.mc.metals": "MakeCountry Metals",
      "itemGroup.name.mc.chemicals": "MakeCountry Chemicals",
      "itemGroup.name.mc.storage": "MakeCountry Storage",
      "itemGroup.name.mc.stations": "MakeCountry Cooking Stations",
      "itemGroup.name.mc.ores": "MakeCountry Ores",
    },
    "en_GB.lang": {
      "itemGroup.name.mc.crops": "MakeCountry Crops",
      "itemGroup.name.mc.materials": "MakeCountry Materials",
      "itemGroup.name.mc.fish": "MakeCountry Fish",
      "itemGroup.name.mc.foods": "MakeCountry Foods",
      "itemGroup.name.mc.breads": "MakeCountry Breads",
      "itemGroup.name.mc.drinks": "MakeCountry Drinks",
      "itemGroup.name.mc.alcohol": "MakeCountry Alcohol",
      "itemGroup.name.mc.ice": "MakeCountry Ice",
      "itemGroup.name.mc.tools": "MakeCountry Tools",
      "itemGroup.name.mc.metals": "MakeCountry Metals",
      "itemGroup.name.mc.chemicals": "MakeCountry Chemicals",
      "itemGroup.name.mc.storage": "MakeCountry Storage",
      "itemGroup.name.mc.stations": "MakeCountry Cooking Stations",
      "itemGroup.name.mc.ores": "MakeCountry Ores",
    },
    "zh_CN.lang": {
      "itemGroup.name.mc.crops": "MakeCountry 作物",
      "itemGroup.name.mc.materials": "MakeCountry 素材",
      "itemGroup.name.mc.fish": "MakeCountry 鱼类",
      "itemGroup.name.mc.foods": "MakeCountry 料理",
      "itemGroup.name.mc.breads": "MakeCountry 面包",
      "itemGroup.name.mc.drinks": "MakeCountry 饮料",
      "itemGroup.name.mc.alcohol": "MakeCountry 酒",
      "itemGroup.name.mc.ice": "MakeCountry 冰品",
      "itemGroup.name.mc.tools": "MakeCountry 工具",
      "itemGroup.name.mc.metals": "MakeCountry 金属",
      "itemGroup.name.mc.chemicals": "MakeCountry 化学",
      "itemGroup.name.mc.storage": "MakeCountry 收纳",
      "itemGroup.name.mc.stations": "MakeCountry 烹饪设备",
      "itemGroup.name.mc.ores": "MakeCountry 矿石",
    },
    "zh_TW.lang": {
      "itemGroup.name.mc.crops": "MakeCountry 作物",
      "itemGroup.name.mc.materials": "MakeCountry 素材",
      "itemGroup.name.mc.fish": "MakeCountry 魚類",
      "itemGroup.name.mc.foods": "MakeCountry 料理",
      "itemGroup.name.mc.breads": "MakeCountry 麵包",
      "itemGroup.name.mc.drinks": "MakeCountry 飲品",
      "itemGroup.name.mc.alcohol": "MakeCountry 酒",
      "itemGroup.name.mc.ice": "MakeCountry 冰品",
      "itemGroup.name.mc.tools": "MakeCountry 工具",
      "itemGroup.name.mc.metals": "MakeCountry 金屬",
      "itemGroup.name.mc.chemicals": "MakeCountry 化學",
      "itemGroup.name.mc.storage": "MakeCountry 收納",
      "itemGroup.name.mc.stations": "MakeCountry 調理設備",
      "itemGroup.name.mc.ores": "MakeCountry 礦石",
    },
    "ko_KR.lang": {
      "itemGroup.name.mc.crops": "MakeCountry 작물",
      "itemGroup.name.mc.materials": "MakeCountry 재료",
      "itemGroup.name.mc.fish": "MakeCountry 생선",
      "itemGroup.name.mc.foods": "MakeCountry 요리",
      "itemGroup.name.mc.breads": "MakeCountry 빵",
      "itemGroup.name.mc.drinks": "MakeCountry 음료",
      "itemGroup.name.mc.alcohol": "MakeCountry 술",
      "itemGroup.name.mc.ice": "MakeCountry 아이스",
      "itemGroup.name.mc.tools": "MakeCountry 도구",
      "itemGroup.name.mc.metals": "MakeCountry 금속",
      "itemGroup.name.mc.chemicals": "MakeCountry 화학",
      "itemGroup.name.mc.storage": "MakeCountry 보관",
      "itemGroup.name.mc.stations": "MakeCountry 조리 설비",
      "itemGroup.name.mc.ores": "MakeCountry 광석",
    },
  };
  const itemKeySet = new Set(allItems.map((item) => `item.mc:${item.id}`));
  const tileKeySet = new Set(crops.map((crop) => `tile.mc:${crop.id}_crop.name`));
  const categoryKeySet = new Set(Object.keys(categoryLangs["en_US.lang"]));
  const creativeGroupKeySet = new Set(Object.keys(creativeGroupLangs["en_US.lang"]));
  const baseLangFixes = {
    "ja_JP.lang": {
      ...Object.fromEntries(fishIds.map((fishId) => [`item.mc:${fishId}`, naturalJapaneseFishName(fishId)])),
      "item.mc:tuna_sushi": "マグロ寿司",
      "item.mc:ikura_sushi": "いくら寿司",
      "item.mc:tekka_sushi": "鉄火巻き",
      "item.mc:salmon_sushi": "サーモン寿司",
      "item.mc:tai_sushi": "鯛寿司",
      "item.mc:shrimp_tempra_sushi": "海老天寿司",
      "item.mc:cooked_rice": "白ご飯",
      "item.mc:cooked_rice_vinegared": "酢飯",
      "item.mc:pork_chop": "ポークチョップ",
      "item.mc:pork_loin": "豚ロース肉",
      "item.mc:pork_sasami": "豚ヒレ肉",
      "item.mc:pork_shoulder_loin": "豚肩ロース肉",
      "item.mc:pork_boned_rib": "豚バラ肉",
      "item.mc:beef_loin": "牛ロース肉",
      "item.mc:beef_leg": "牛すね肉",
      "item.mc:beef_minced_meat": "牛ひき肉",
      "item.mc:pineapple_cut": "カットパイナップル",
      "item.mc:cut_raw_squid": "イカの切り身",
      "item.mc:roasted_pork_fillet": "チャーシュー",
      "item.mc:onion_mizin": "玉ねぎのみじん切り",
      "item.mc:carrot_mizin": "にんじんのみじん切り",
      "item.mc:potato_mizin": "じゃがいものみじん切り",
      "item.mc:garlic_mizin": "にんにくのみじん切り",
      "item.mc:vinegar": "酢",
      "item.mc:food_oil": "食用油",
      "item.mc:bread_material": "パン生地",
      "item.mc:shape_bread": "食パン",
      "item.mc:shape_bread_toast": "トースト",
      "item.mc:sunny_side_up_eggs": "目玉焼き",
      "item.mc:sunny_side_up_eggs_toast": "目玉焼きトースト",
      "item.mc:nether_pizza": "ネザーピザ",
      "item.mc:vegetable_pizza": "野菜ピザ",
      "item.mc:margherita_pizza": "マルゲリータピザ",
      "item.mc:meatlovers_pizza": "ミートラバーズピザ",
      "item.mc:tomato_catsup": "トマトケチャップ",
      "item.mc:syoyu_ramen": "醤油ラーメン",
      "item.mc:squid_tempra": "いか天",
      "item.mc:squid_roast": "イカ焼き",
      "item.mc:roasted_sweet_corn": "焼きとうもろこし",
      "item.mc:boiled_sweet_corn": "ゆでとうもろこし",
      "item.mc:straw_berry": "いちご",
      "item.mc:straw_berry_daifuku": "いちご大福",
    },
  };

  for (const [fileName, label] of Object.entries(langs)) {
    const filePath = path.join(rpDir, "texts", fileName);
    const baseFixes = baseLangFixes[fileName] ?? {};
    const baseFixKeySet = new Set(Object.keys(baseFixes));
    let text = fs.readFileSync(filePath, "utf8");
    const bom = text.startsWith("\uFEFF") ? "\uFEFF" : "";
    text = text.replace(/^\uFEFF/, "");
    const filtered = text
      .split(/\r?\n/)
      .filter((line) => {
        const key = line.split("=")[0];
        return !itemKeySet.has(key) && !tileKeySet.has(key) && !categoryKeySet.has(key) && !creativeGroupKeySet.has(key) && !baseFixKeySet.has(key);
      })
      .join("\n")
      .replace(/\n*$/, "\n");
    const additions = [
      ...Object.entries(baseFixes).map(([key, value]) => `${key}=${value}`),
      ...allItems.map((item) => `item.mc:${item.id}=${label.item(item)}`),
      ...crops.map((crop) => `tile.mc:${crop.id}_crop.name=${label.crop(crop)}`),
      ...Object.entries(categoryLangs[fileName]).map(([key, value]) => `${key}=${value}`),
      ...Object.entries(creativeGroupLangs[fileName]).map(([key, value]) => `${key}=${value}`),
    ].join("\n");
    fs.writeFileSync(filePath, `${bom}${filtered}${additions}\n`);
  }
}

function updateTextureMap() {
  const filePath = path.join(bpDir, "src/config/textures.ts");
  let text = fs.readFileSync(filePath, "utf8");
  text = text.replace(/\n\s*\/\/ Generated food expansion start[\s\S]*?\n\s*\/\/ Generated food expansion end\n?/m, "\n");
  const missing = [];
  for (const item of allItems) {
    const key = item.id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const existingEntry = new RegExp(`('mc:${key}'\\s*:\\s*)'[^']*'`);
    if (existingEntry.test(text)) {
      text = text.replace(existingEntry, `$1'${item.texture}'`);
    } else {
      missing.push(item);
    }
  }
  const entries = missing
    .map((item) => `  'mc:${item.id}': '${item.texture}',`)
    .join("\n");
  const block = `  // Generated food expansion start\n${entries}\n  // Generated food expansion end\n`;
  const close = text.lastIndexOf("\n}");
  const before = text.slice(0, close).replace(/\s*$/, "");
  const needsComma = !before.endsWith(",");
  text = `${before}${needsComma ? "," : ""}\n${block}${text.slice(close)}`;
  fs.writeFileSync(filePath, text);
}

function updateCustomItemIds() {
  const filePath = path.join(bpDir, "src/config/custom-item-ids.ts");
  let text = fs.readFileSync(filePath, "utf8");
  const existingIds = new Set([...text.matchAll(/"(mc:[a-z0-9_]+)"/gu)].map((match) => match[1]));
  const additions = allItems
    .map((item) => `mc:${item.id}`)
    .filter((id) => !existingIds.has(id))
    .sort((a, b) => a.localeCompare(b));
  if (additions.length === 0) return;

  const insertion = additions.map((id) => `  "${id}",`).join("\n");
  text = text.replace(/\n\];\s*$/u, `\n${insertion}\n];\n`);
  fs.writeFileSync(filePath, text);
}

function updateCookingRecipes() {
  const mixerRecipes = materials.map((item, index) => ({
    id: item.id,
    station: "mixer",
    name: `mc:${item.id}`,
    result: index < 18 || ["potato_starch", "corn_starch"].includes(item.id) ? { id: `mc:${item.id}`, count: 2 } : `mc:${item.id}`,
    requiredLevel: 2 + Math.floor(index / 5),
    baseActions: 7 + (index % 4),
    ingredients: item.ingredients,
    extras: {},
    progressionGroup: "material",
  }));
  const foodRecipes = foods.map((item, index) => ({
    id: item.id,
    station: item.station,
    name: `mc:${item.id}`,
    result: `mc:${item.id}`,
    requiredLevel: 3 + Math.floor(index / 4),
    baseActions: 8 + (index % 6),
    ingredients: item.ingredients,
    extras: item.extras,
    progressionGroup: item.id.startsWith("cuisine_") ? "cuisine" : "classic_food",
  }));
  const generatedExpansionRecipes = [...fishExpansionItems, ...homeExpansionItems, ...requestedExpansionItems].map((item) => ({
    id: item.id,
    station: item.station,
    name: `mc:${item.id}`,
    result: item.result ?? `mc:${item.id}`,
    requiredLevel: item.requiredLevel,
    baseActions: item.baseActions ?? 7,
    ingredients: item.ingredients,
    extras: item.extras ?? {},
  }));
  const allCookingRecipes = assignCookingLevels([...mixerRecipes, ...foodRecipes, ...generatedExpansionRecipes, ...legacyAdditionalRecipes]);

  const byStation = new Map();
  for (const recipe of allCookingRecipes) {
    if (!byStation.has(recipe.station)) byStation.set(recipe.station, []);
    byStation.get(recipe.station).push(recipe);
  }

  for (const [station, recipes] of byStation) {
    if (recipes.some((recipe) => generatedRecipePrefixes.some((prefix) => recipe.id.startsWith(prefix)))) {
      recipes.sort((a, b) => (a.requiredLevel - b.requiredLevel) || a.id.localeCompare(b.id));
    }
    const complexDef = recipeDefaults[station];
    const simpleDef = simpleRecipeDefaults[station];
    const def = complexDef ?? simpleDef;
    if (!def) throw new Error(`Unknown cooking station: ${station}`);

    const filePath = path.join(bpDir, "src/content/cooking", def.target);
    const generated = complexDef ? recipes
      .map((recipe) => {
        const obj = {
          name: recipe.name,
          result: recipe.result,
          requiredLevel: recipe.requiredLevel,
          [complexDef.rangeKey]: complexDef.range.map((v, idx) => v + (recipe.requiredLevel % 4) * 5 + idx * (recipe.station === "oven" ? 10 : 0)),
          baseActions: recipe.baseActions,
          ingredients: recipe.ingredients,
          [complexDef.extraKey]: recipe.extras,
          [complexDef.maxKey]: Math.max(0, Object.keys(recipe.extras).length),
          baseMoney: Math.round((18 + recipe.requiredLevel * 3) * 10) / 10,
          baseXp: Math.round((12 + recipe.requiredLevel * 2) * 10) / 10,
        };
        return `    "${recipe.id}": ${JSON.stringify(obj, null, 8).replace(/^/gm, "    ").trimStart()}`;
      })
      .join(",\n") : recipes
      .map((recipe) => {
        const obj = {
          name: recipe.name,
          result: recipe.result,
          requiredLevel: recipe.requiredLevel,
          ingredients: recipe.ingredients,
        };
        return `    "${recipe.id}": ${JSON.stringify(obj, null, 8).replace(/^/gm, "    ").trimStart()}`;
      })
      .join(",\n");

    let text = fs.readFileSync(filePath, "utf8");
    text = text.replace(/\n\s*\/\/ Generated food expansion start[\s\S]*?\n\s*\/\/ Generated food expansion end\n?/m, "\n");
    const block = `    // Generated food expansion start\n${generated}\n    // Generated food expansion end`;
    const close = text.lastIndexOf("\n};");
    const before = text.slice(0, close).replace(/\s*$/, "");
    const needsComma = !before.endsWith(",");
    text = `${before}${needsComma ? "," : ""}\n${block}${text.slice(close)}`;
    fs.writeFileSync(filePath, text);
  }
}

function listJsonFiles(dir) {
  const result = [];
  if (!fs.existsSync(dir)) return result;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const filePath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...listJsonFiles(filePath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      result.push(filePath);
    }
  }
  return result;
}

function readJsonWithComments(filePath) {
  const text = fs.readFileSync(filePath, "utf8").replace(/^\s*\/\/.*$/gm, "");
  return JSON.parse(text);
}

const hiddenCreativeCatalogGroups = new Set([
  "mc:fish",
  "mc:drinks",
  "mc:alcohol",
  "mc:frozen_sweets",
  "mc:breads",
  "mc:sweets",
  "mc:festival_foods",
  "mc:rice_dishes",
  "mc:noodle_dishes",
  "mc:pizzas",
  "mc:burgers_sandwiches",
  "mc:sushi",
  "mc:soups_hot_pots",
  "mc:dumplings",
  "mc:fried_baked_foods",
  "mc:salads_light_meals",
  "mc:main_dishes",
]);

const hiddenCreativeItemPrefixes = [
  "fish_",
  "cuisine_",
  "homefood_",
  "breadcraft_",
  "alcohol_",
  "ricecooker_",
  "griddle_",
  "steamer_",
  "icecraft_",
  "drinkcraft_",
];

function shouldHideCreativeItem(itemId, components = undefined) {
  const id = itemId.replace(/^mc:/u, "");
  return Boolean(components?.["minecraft:food"]) || hiddenCreativeItemPrefixes.some((prefix) => id.startsWith(prefix));
}

function creativeMenuForItem(relativePath, itemId, components = undefined) {
  const id = itemId.replace(/^mc:/u, "");
  const normalizedPath = relativePath.replace(/\\/g, "/");

  if (
    normalizedPath.startsWith("items/fish/") ||
    normalizedPath.startsWith("items/food/") ||
    shouldHideCreativeItem(itemId, components)
  ) {
    return { category: "none", is_hidden_in_commands: false };
  }

  if (normalizedPath.startsWith("items/tool/")) return { category: "equipment" };
  if (normalizedPath.startsWith("items/backpack/")) return { category: "items", group: "mc:itemGroup.name.mc.storage" };
  if (normalizedPath.startsWith("items/chemical/")) return { category: "items", group: "mc:itemGroup.name.mc.chemicals" };
  if (normalizedPath.startsWith("items/metal/")) return { category: "items", group: "mc:itemGroup.name.mc.metals" };
  if (normalizedPath.startsWith("items/materials/generated/crops/") || normalizedPath.startsWith("items/materials/crops/")) return { category: "items", group: "mc:itemGroup.name.mc.crops" };
  if (normalizedPath.startsWith("items/drink/") || id.startsWith("drinkcraft_")) return { category: "items", group: "mc:itemGroup.name.mc.drinks" };
  if (normalizedPath.startsWith("items/ice/") || id.startsWith("icecraft_")) return { category: "items", group: "mc:itemGroup.name.mc.ice" };
  if (normalizedPath.startsWith("items/alcohol/") || id.startsWith("alcohol_")) return { category: "items", group: "mc:itemGroup.name.mc.alcohol" };
  if (normalizedPath.startsWith("items/food/bread/") || id.startsWith("breadcraft_")) return { category: "items", group: "mc:itemGroup.name.mc.breads" };
  if (normalizedPath.startsWith("items/fish/") || id.startsWith("fish_")) return { category: "items", group: "mc:itemGroup.name.mc.fish" };
  if (normalizedPath.startsWith("items/materials/") || id.startsWith("homeprep_")) return { category: "items", group: "mc:itemGroup.name.mc.materials" };
  if (normalizedPath.startsWith("items/food/")) return { category: "items", group: "mc:itemGroup.name.mc.foods" };

  return { category: "items", group: "mc:itemGroup.name.mc.materials" };
}

function updateCreativeItemCategories() {
  for (const filePath of listJsonFiles(path.join(bpDir, "items"))) {
    const json = readJsonWithComments(filePath);
    const description = json?.["minecraft:item"]?.description;
    const itemId = description?.identifier;
    if (typeof itemId !== "string" || !itemId.startsWith("mc:")) continue;

    const relativePath = path.relative(bpDir, filePath);
    description.menu_category = creativeMenuForItem(relativePath, itemId, json?.["minecraft:item"]?.components);
    writeJson(filePath, json);
  }
}

function updateCreativeBlockCategories() {
  for (const filePath of listJsonFiles(path.join(bpDir, "blocks"))) {
    const json = readJsonWithComments(filePath);
    const description = json?.["minecraft:block"]?.description;
    const blockId = description?.identifier;
    if (typeof blockId !== "string" || !blockId.startsWith("mc:")) continue;
    if (description.menu_category?.category === "none") continue;

    const relativePath = path.relative(bpDir, filePath).replace(/\\/g, "/");
    description.menu_category = {
      category: "items",
    };
    writeJson(filePath, json);
  }
}

function updateCreativeCategories() {
  updateCreativeItemCategories();
  updateCreativeBlockCategories();
}

function removeHiddenCreativeCatalogEntries() {
  const catalogPath = path.join(bpDir, "item_catalog", "crafting_item_catalog.json");
  if (!fs.existsSync(catalogPath)) return;

  const hiddenItemIds = new Set();
  for (const filePath of listJsonFiles(path.join(bpDir, "items"))) {
    const itemJson = readJsonWithComments(filePath);
    const description = itemJson?.["minecraft:item"]?.description;
    const itemId = description?.identifier;
    if (typeof itemId !== "string" || !itemId.startsWith("mc:")) continue;

    const relativePath = path.relative(bpDir, filePath).replace(/\\/g, "/");
    const components = itemJson?.["minecraft:item"]?.components;
    if (
      relativePath.startsWith("items/fish/") ||
      relativePath.startsWith("items/food/") ||
      shouldHideCreativeItem(itemId, components)
    ) {
      hiddenItemIds.add(itemId);
    }
  }

  const json = readJsonWithComments(catalogPath);
  const catalog = json?.["minecraft:crafting_items_catalog"];
  if (!catalog?.categories) return;

  for (const category of catalog.categories) {
    category.groups = (category.groups ?? [])
      .filter((group) => !hiddenCreativeCatalogGroups.has(group.group_identifier?.name))
      .map((group) => ({
        ...group,
        items: (group.items ?? []).filter((itemId) => !hiddenItemIds.has(itemId)),
      }))
      .filter((group) => group.items.length > 0);
  }

  writeJson(catalogPath, json, 4);
}

function removeCatalogItemCreativeCategories() {
  const catalogPath = path.join(bpDir, "item_catalog", "crafting_item_catalog.json");
  if (!fs.existsSync(catalogPath)) return;

  const catalogItems = new Set();
  const equipmentItems = new Set();
  const catalog = readJsonWithComments(catalogPath)?.["minecraft:crafting_items_catalog"];
  for (const category of catalog?.categories ?? []) {
    for (const group of category.groups ?? []) {
      for (const itemId of group.items ?? []) {
        catalogItems.add(itemId);
        if (category.category_name === "equipment") equipmentItems.add(itemId);
      }
    }
  }

  for (const filePath of listJsonFiles(path.join(bpDir, "items"))) {
    const json = readJsonWithComments(filePath);
    const description = json?.["minecraft:item"]?.description;
    if (!catalogItems.has(description?.identifier)) continue;

    if (equipmentItems.has(description.identifier)) {
      description.menu_category = { category: "equipment" };
    } else {
      delete description.menu_category;
    }
    writeJson(filePath, json);
  }
}

function writeGeneratedFiles() {
  for (const item of allItems) {
    writeJson(itemFilePath(item), itemJson(item));
    writePng(path.join(rpDir, `${item.texture}.png`), drawItemIcon(item));
  }

  for (const crop of crops) {
    writeJson(path.join(bpDir, "blocks/crop", `${crop.id}_crop.json`), cropBlockJson(crop));
    writeJson(path.join(bpDir, "loot_tables/blocks", `${crop.id}_seed.json`), lootTable(crop.id, false));
    writeJson(path.join(bpDir, "loot_tables/blocks", `${crop.id}_plant.json`), lootTable(crop.id, true));
    for (let stage = 1; stage <= 4; stage++) {
      writePng(
        path.join(rpDir, "textures/blocks/crop/generated", `${crop.id}_stage_${stage}.png`),
        drawCropStage(crop.id, stage),
      );
    }
  }
}

if (new Set(allItems.map((item) => item.id)).size !== allItems.length) {
  throw new Error("Duplicate item IDs in generated content");
}

writeGeneratedFiles();
updateAtlas();
updateLang();
updateTextureMap();
updateCustomItemIds();
updateCookingRecipes();
updateCreativeCategories();
removeHiddenCreativeCatalogEntries();
removeCatalogItemCreativeCategories();

console.log(`Added ${allItems.length} generated items, including ${cuisineExpansionFoods.length} cuisine foods, ${fishExpansionItems.length} fish-based materials and foods, ${homeExpansionItems.length} non-fish home and restaurant materials and foods, ${requestedExpansionItems.length} requested bread/alcohol/rice cooker/griddle/steamer/ice/drink foods, ${crops.length} crops, and generated cooking recipes.`);
