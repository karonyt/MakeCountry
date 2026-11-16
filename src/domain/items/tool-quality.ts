// 道具の品質 (鍛冶品質の段階)。
import { getArtisanQuality } from "@/domain/professions/artisan-quality.js";
/**
 * 
 * @param {ItemStack} item 
 * @returns 
 */
export function getToolQuality(item: any) {
    return getArtisanQuality(item);
}
