// data/cooking/fryingpan_recipe.js
export const FryingPanRecipes = {
    steak: {
        name: "minecraft:cooked_beef",
        ingredients: {
            "mc:beef_loin": 1
        },
        seasonings: {
            "minecraft:sugar": {
                bonus: "sweet",
                riskHeat: +10
            },
            "mc:salt": {
                bonus: "stable",
                riskHeat: -10
            }
        },
        result: "minecraft:cooked_beef",
        needHeat: [50, 80],
        maxActions: 5,
        baseMoney: 5,
        baseXp: 0.5,
        baseActions: 8,
        requiredLevel: 1
    },

    fish: {
        name: "minecraft:cooked_cod",
        ingredients: {
            "minecraft:cod": 1
        },
        seasonings: {
            "minecraft:sugar": {
                bonus: "sweet",
                riskHeat: +10
            },
            "mc:salt": {
                bonus: "stable",
                riskHeat: -10
            }
        }
        , result: "minecraft:cooked_cod",
        needHeat: [40, 70],
        maxActions: 4,
        baseMoney: 5,
        baseXp: 0.5,
        baseActions: 8,
        requiredLevel: 2
    }
};
