import fs from "node:fs";
import path from "node:path";
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const moduleCache = new Map();

const root = process.cwd();

const contentRecipeFiles = [
  "src/content/smelting/furnace-recipe.ts",
  "src/content/chemical/chemical-recipe.ts",
  ...fs
    .readdirSync(path.join(root, "src/content/cooking"))
    .filter((file) => file.endsWith("-recipe.ts"))
    .map((file) => `src/content/cooking/${file}`),
];

const criticalItems = [
  "mc:quicklime",
  "mc:calcium_hydroxide",
  "mc:sodium_hydroxide",
  "mc:sodium_hydroxide_solution",
  "mc:carbon_dioxide",
  "mc:sodium_bicarbonate",
  "mc:sodium_carbonate",
  "mc:oil_bottle",
  "mc:food_oil",
  "mc:ovlive_oil",
  "mc:polyethylene_pellet",
  "mc:flour",
  "mc:yeast",
  "mc:bread_material",
  "mc:pizza_dough",
  "mc:pie_dough",
  "mc:tortilla_dough",
  "mc:iron_alloy",
  "mc:titanium_ingot",
  "mc:tungsten_ingot",
  "mc:vanadium_alloy",
  "mc:titanium_alloy",
  "mc:tungsten_alloy",
  "mc:mithril_ingot",
  "mc:orichalcum_ingot",
  ...["aluminum", "vanadium", "titanium", "tungsten", "mithril", "orichalcum"]
    .flatMap((material) => ["axe", "shovel", "hoe", "sword"]
      .map((tool) => `mc:${material}_${tool}`)),
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function walkFiles(dir, predicate = () => true) {
  const result = [];
  const fullDir = path.join(root, dir);
  if (!fs.existsSync(fullDir)) return result;

  for (const entry of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (entry.name === "node_modules") continue;
    const relative = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      result.push(...walkFiles(relative, predicate));
    } else if (entry.isFile() && predicate(relative)) {
      result.push(relative);
    }
  }

  return result;
}

function loadContentModule(file) {
  const fullPath = path.resolve(root, file);
  if (moduleCache.has(fullPath)) return moduleCache.get(fullPath);
  const code = ts.transpileModule(fs.readFileSync(fullPath, 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  const module = { exports: {} };
  moduleCache.set(fullPath, module.exports);
  new Function('require', 'module', 'exports', code)(id => {
    if (!id.startsWith('.')) throw new Error(`Unexpected content module dependency: ${id}`);
    return loadContentModule(path.resolve(path.dirname(fullPath), id.replace(/\.js$/, '.ts')));
  }, module, module.exports);
  return module.exports;
}

function parseContentRecipes(file) {
  const recipeObject = Object.values(loadContentModule(file))[0];
  return Object.entries(recipeObject).map(([id, recipe]) => ({
    id,
    file,
    level: recipe.requiredLevel ?? 0,
    ingredients: recipe.ingredients ?? {},
    results: normalizeResults(recipe.result),
  }));
}

function normalizeResults(result) {
  const results = Array.isArray(result) ? result : [result];
  return results
    .filter(Boolean)
    .map((item) => {
      if (typeof item === "string") return { id: item, count: 1 };
      return { id: item.id ?? item.item, count: item.count ?? 1 };
    })
    .filter((item) => item.id);
}

function parseRecipeConfigLevels() {
  const source = fs.readFileSync(path.join(root, "src/config/recipes.ts"), "utf8");
  const levels = new Map();
  for (const match of source.matchAll(/\{\s*id:\s*['"]([^'"]+)['"],\s*lv:\s*(\d+)\s*\}/g)) {
    levels.set(match[1], Number(match[2]));
  }
  return levels;
}

function parseJsonRecipe(file, configuredLevels) {
  const data = readJson(file);
  const key = Object.keys(data).find((candidate) => candidate.startsWith("minecraft:recipe_"));
  if (!key) return null;

  const recipe = data[key];
  const id = recipe.description?.identifier ?? file;
  const ingredients = {};

  if (recipe.pattern && recipe.key) {
    const symbolCounts = {};
    for (const row of recipe.pattern) {
      for (const symbol of row) {
        if (symbol !== " ") symbolCounts[symbol] = (symbolCounts[symbol] ?? 0) + 1;
      }
    }

    for (const [symbol, amount] of Object.entries(symbolCounts)) {
      const item = recipe.key[symbol]?.item ?? recipe.key[symbol]?.tag;
      if (item) ingredients[item] = (ingredients[item] ?? 0) + amount;
    }
  }

  if (Array.isArray(recipe.ingredients)) {
    for (const entry of recipe.ingredients) {
      const item = entry?.item ?? entry?.tag;
      if (item) ingredients[item] = (ingredients[item] ?? 0) + 1;
    }
  }

  if (recipe.input) {
    const item = recipe.input.item ?? recipe.input.tag;
    if (item) ingredients[item] = (ingredients[item] ?? 0) + 1;
  }

  const rawResultValue = recipe.result ?? recipe.output;
  const rawResults = Array.isArray(rawResultValue) ? rawResultValue : [rawResultValue];
  const results = rawResults
    .filter(Boolean)
    .map((item) => ({ id: item.item ?? item.id, count: item.count ?? 1 }))
    .filter((item) => item.id);

  return {
    id,
    file,
    level: configuredLevels.get(id) ?? 0,
    ingredients,
    results,
  };
}

function getCustomDefinitionIds() {
  const ids = new Set();
  for (const file of walkFiles("items", (name) => name.endsWith(".json"))) {
    const id = readJson(file)["minecraft:item"]?.description?.identifier;
    if (id?.startsWith("mc:")) ids.add(id);
  }

  for (const file of walkFiles("blocks", (name) => name.endsWith(".json"))) {
    const id = readJson(file)["minecraft:block"]?.description?.identifier;
    if (id?.startsWith("mc:")) ids.add(id);
  }

  return ids;
}

function collectLootRoots() {
  const roots = new Set();
  for (const file of walkFiles("loot_tables", (name) => name.endsWith(".json"))) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of text.matchAll(/"name"\s*:\s*"(mc:[^"]+)"/g)) {
      roots.add(match[1]);
    }
  }
  return roots;
}

function collectScriptItemStackRoots() {
  const mineralDrops = loadContentModule('src/content/minerals/ore-data.ts').MINERAL_ORES;
  const roots = new Set(Object.values(mineralDrops).map(ore => ore.drop));
  const scriptFiles = walkFiles("src", (name) => name.endsWith(".ts"));
  for (const file of scriptFiles) {
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of text.matchAll(/new ItemStack\(\s*['"`](mc:[^'"`]+)['"`]/g)) {
      roots.add(match[1]);
    }
  }
  return roots;
}

function collectShopRoots() {
  const roots = new Set();
  const files = [
    "src/config/shop.ts",
  ];

  for (const file of files) {
    if (!fs.existsSync(path.join(root, file))) continue;
    const text = fs.readFileSync(path.join(root, file), "utf8");
    for (const match of text.matchAll(/id:\s*['"`](mc:[^'"`]+)['"`]/g)) {
      roots.add(match[1]);
    }
  }

  return roots;
}

function collectFishRoots() {
  const roots = new Set();
  for (const file of walkFiles("items/fish", (name) => name.endsWith(".json"))) {
    const id = readJson(file)["minecraft:item"]?.description?.identifier;
    if (id?.startsWith("mc:")) roots.add(id);
  }
  return roots;
}

function collectRecipes() {
  const configuredLevels = parseRecipeConfigLevels();
  const recipes = [];

  for (const file of contentRecipeFiles) {
    recipes.push(...parseContentRecipes(file));
  }

  for (const file of walkFiles("recipes", (name) => name.endsWith(".json"))) {
    const recipe = parseJsonRecipe(file, configuredLevels);
    if (recipe) recipes.push(recipe);
  }

  return recipes;
}

function computeReachability(recipes, roots) {
  const levels = new Map();
  const via = new Map();

  for (const id of roots) {
    levels.set(id, 0);
    via.set(id, "root");
  }

  let changed = true;
  while (changed) {
    changed = false;
    for (const recipe of recipes) {
      let ingredientLevel = recipe.level;
      let blocked = false;

      for (const item of Object.keys(recipe.ingredients)) {
        if (item.startsWith("minecraft:")) continue;
        const knownLevel = levels.get(item);
        if (knownLevel === undefined) {
          blocked = true;
          break;
        }
        ingredientLevel = Math.max(ingredientLevel, knownLevel);
      }

      if (blocked) continue;

      for (const result of recipe.results) {
        const previous = levels.get(result.id);
        if (previous === undefined || ingredientLevel < previous) {
          levels.set(result.id, ingredientLevel);
          via.set(result.id, `${recipe.file}:${recipe.id}`);
          changed = true;
        }
      }
    }
  }

  return { levels, via };
}

const recipes = collectRecipes();
const definitions = getCustomDefinitionIds();
const roots = new Set([
  ...collectLootRoots(),
  ...collectScriptItemStackRoots(),
  ...collectFishRoots(),
  ...collectShopRoots(),
]);

const { levels, via } = computeReachability(recipes, roots);
const customIngredients = new Set();
const recipeOutputs = new Set();
const badLimestoneRecipes = [];
const undefinedRefs = [];

for (const recipe of recipes) {
  for (const result of recipe.results) {
    if (result.id.startsWith("mc:")) recipeOutputs.add(result.id);
  }

  for (const item of Object.keys(recipe.ingredients)) {
    if (!item.startsWith("mc:")) continue;
    customIngredients.add(item);
    if (item === "mc:lime_stone") {
      badLimestoneRecipes.push(`${recipe.file}:${recipe.id}`);
    }
    if (!definitions.has(item) && !levels.has(item)) {
      undefinedRefs.push(`${item} <- ${recipe.file}:${recipe.id}`);
    }
  }
}

const missingCritical = criticalItems.filter((item) => !levels.has(item));
const unreachableRecipeOutputs = [...recipeOutputs].filter((item) => !levels.has(item)).sort();
const unreachableUsed = [...customIngredients]
  .filter((item) => !levels.has(item))
  .sort()
  .slice(0, 40);

console.log(`recipes=${recipes.length}`);
console.log(`roots=${roots.size}`);
console.log(`reachableItems=${levels.size}`);
console.log(`customDefinitions=${definitions.size}`);

console.log("\ncritical:");
for (const item of criticalItems) {
  const level = levels.get(item);
  const source = via.get(item);
  console.log(`${item}: ${level === undefined ? "unreachable" : `level ${level}`} (${source ?? "-"})`);
}

if (unreachableUsed.length > 0) {
  console.log("\nunreachable custom ingredients sample:");
  for (const item of unreachableUsed) console.log(`- ${item}`);
}

if (unreachableRecipeOutputs.length > 0) {
  console.log("\nunreachable recipe outputs sample:");
  for (const item of unreachableRecipeOutputs.slice(0, 40)) console.log(`- ${item}`);
}

const errors = [
  ...missingCritical.map((item) => `critical item is unreachable: ${item}`),
  ...unreachableRecipeOutputs.map((item) => `recipe output is unreachable: ${item}`),
  ...badLimestoneRecipes.map((source) => `recipe still requires mined block mc:lime_stone: ${source}`),
  ...undefinedRefs.map((source) => `undefined custom reference: ${source}`),
];

if (errors.length > 0) {
  console.error("\nerrors:");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
}
