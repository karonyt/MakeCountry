import { getCookingQualityCapProfile } from "@/domain/cooking/quality-cap.js";

/** Shared lore for both recipe lists and active cooking forms. */
export function buildCookingMasteryLore(chefLevel: number, requiredLevel: number) {
    const mastery = getCookingQualityCapProfile(chefLevel, requiredLevel);
    return [
        {
            rawtext: [{
                text: "§6",
            }, {
                translate: "artisan.mastery.cap",
                with: [mastery.maxRank],
            }],
        },
        ...(mastery.nextRank && mastery.levelsToNext !== undefined
            ? [{
                rawtext: [{
                    text: "§7",
                }, {
                    translate: "artisan.mastery.next",
                    with: [mastery.nextRank, String(mastery.levelsToNext)],
                }],
            }]
            : [{ rawtext: [{ text: "§e" }, { translate: "artisan.mastery.maxed" }] }]),
    ];
}
