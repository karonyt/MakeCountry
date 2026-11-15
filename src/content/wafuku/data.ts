// 和服（着物・袴・下駄）×16色。防御力はスーツ（上着3・ズボン1・革靴1）と同じ。
// アイテム定義・レシピ・RP は items/armor/wafuku*.json と recipes/wafuku*.json にある。
export const WAFUKU_COLORS = ["white", "orange", "magenta", "light_blue", "yellow", "lime", "pink", "gray", "light_gray", "cyan", "purple", "blue", "brown", "green", "red", "black"] as const;
const PREFIXES = ['wafuku', 'wafuku_hakama', 'wafuku_geta'] as const;

export const WAFUKU_ITEM_IDS: string[] = PREFIXES.flatMap(prefix => WAFUKU_COLORS.map(color => `mc:${prefix}_${color}`));

export const WAFUKU_TEXTURES: Record<string, string> = Object.fromEntries(
  PREFIXES.flatMap(prefix => WAFUKU_COLORS.map(color => [`mc:${prefix}_${color}`, `textures/items/${prefix}_${color}`])),
);

export const WAFUKU_RECIPE_CONFIG: { id: string; lv: number }[] = WAFUKU_ITEM_IDS.map(id => ({ id: `${id}_recipe`, lv: 100 }));
