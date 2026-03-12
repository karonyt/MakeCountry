export const FryStewRecipes = {
    /* ===== 初級レシピ (Lv 1-10) ===== */
    "fried_potato": {
        name: "minecraft:potato",
        requiredLevel: 1,
        needTemp: [160, 180],
        baseActions: 8,
        ingredients: {
            "minecraft:potato": 3,
            "mc:food_oil": 2,
        },
        coatings: {
            "minecraft:wheat": 5
        },
        maxCoatings: 1,
        result: "minecraft:baked_potato",
        baseMoney: 0.5,
        baseXp: 10
    },

    "shrimp_tempra": {
        name: "mc:shrimp_tempra",
        requiredLevel: 3,
        needTemp: [170, 185],
        baseActions: 10,
        ingredients: {
            "mc:shrimp": 2,
            "mc:food_oil": 2,
        },
        coatings: {
            "minecraft:wheat": 8,
            "minecraft:egg": 2
        },
        maxCoatings: 2,
        result: "mc:shrimp_tempra",
        baseMoney: 1.2,
        baseXp: 15
    }
};