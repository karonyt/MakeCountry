export const StewRecipes = {
    /* ===============================
       チョコレート系
    ================================ */
    "milk_chocolate": {
        name: "mc:milk_chocolate",
        result: "mc:milk_chocolate",
        requiredLevel: 1,
        baseActions: 8,
        needHeat: [60, 80],
        baseMoney: 20,
        baseXp: 15,
        ingredients: {
            "minecraft:cocoa_beans": 3,
            "minecraft:sugar": 2,
            "minecraft:milk_bucket": 1
        },
        seasonings: {
            "minecraft:honey_bottle": 3,
        },
        maxSeasonings: 2
    },
    "black_chocolate": {
        name: "mc:black_chocolate",
        result: "mc:black_chocolate",
        requiredLevel: 2,
        baseActions: 12,
        needHeat: [65, 85],
        baseMoney: 40,
        baseXp: 30,
        ingredients: {
            "minecraft:cocoa_beans": 8,
            "minecraft:sugar": 1,
            "minecraft:milk_bucket": 1
        },
        seasonings: {
            "mc:salt": 4
        },
        maxSeasonings: 3
    },
    "white_chocolate": {
        name: "mc:white_chocolate",
        result: "mc:white_chocolate",
        requiredLevel: 3,
        baseActions: 10,
        needHeat: [55, 70],
        baseMoney: 50,
        baseXp: 35,
        ingredients: {
            "minecraft:sugar": 4,
            "minecraft:milk_bucket": 2
        },
        seasonings: {
        },
        maxSeasonings: 2
    },

    /* ===============================
       ラーメン系
    ================================ */
    "syoyu_ramen": {
        name: "mc:syoyu_ramen",
        result: "mc:syoyu_ramen",
        requiredLevel: 5,
        baseActions: 15,
        needHeat: [90, 100],
        baseMoney: 60,
        baseXp: 40,
        ingredients: {
            "mc:noodle": 1,
            "minecraft:chicken": 5,
            "mc:syoyu": 2,
            "minecraft:kelp": 3
        },
        seasonings: {
            "mc:garlic": 4,
        },
        maxSeasonings: 4
    },
    
};