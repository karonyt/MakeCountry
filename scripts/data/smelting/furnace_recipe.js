export const FurnaceRecipes = {
    "glass": {
        name: "minecraft:glass",
        result: "minecraft:glass",
        requiredLevel: 1,
        baseActions: 30,
        needTemperature: [1200, 1500],
        ingredients: {
            "minecraft:sand": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:coal": 1,
        },
        maxAdditives: 1,
        baseMoney: 5,
        baseXp: 3
    },

    "beaker": {
        name: "mc:beaker",
        result: "mc:beaker",
        requiredLevel: 1,
        baseActions: 35,
        needTemperature: [1500, 1800],
        ingredients: {
            "minecraft:glass": 2
        },
        additives: {
            "minecraft:quartz": 1 // 耐熱性向上（ホウケイ酸ガラス表現）
        },
        maxAdditives: 1,
        baseMoney: 5,
        baseXp: 3
    },

    "cup": {
        name: "mc:cup",
        result: "mc:cup",
        requiredLevel: 1,
        baseActions: 35,
        needTemperature: [1300, 1600],
        ingredients: {
            "minecraft:glass": 3
        },
        additives: {
            "minecraft:quartz": 1 // 耐熱性向上（ホウケイ酸ガラス表現）
        },
        maxAdditives: 1,
        baseMoney: 5,
        baseXp: 3
    },

    "oil_bottle": {
        name: "mc:oil_bottle",
        result: "mc:oil_bottle",
        requiredLevel: 2,
        baseActions: 30,
        needTemperature: [160, 220],
        ingredients: {
            "mc:polyethylene_pellet": 1,
            "minecraft:coal": 1
        },
        additives: {
            "minecraft:quartz": 2,
            "minecraft:blaze_powder": 1, // 高温維持・成形難度表現
        },
        maxAdditives: 2,
        baseMoney: 10,
        baseXp: 6
    },

    "flask": {
        name: "mc:flask",
        result: "mc:flask",
        requiredLevel: 2,
        baseActions: 33,
        needTemperature: [1400, 1700],
        ingredients: {
            "minecraft:glass": 4,
            "minecraft:coal": 1
        },
        additives: {
            "minecraft:quartz": 2,
            "minecraft:blaze_powder": 1, // 高温維持・成形難度表現
        },
        maxAdditives: 2,
        baseMoney: 10,
        baseXp: 6
    },

    "iron_alloy": {
        name: "mc:iron_alloy",
        result: "mc:iron_alloy",
        requiredLevel: 3,
        baseActions: 18,
        needTemperature: [1200, 1400],
        ingredients: {
            "minecraft:iron_ingot": 5,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:coal": 3
        },
        maxAdditives: 1,
        baseMoney: 15,
        baseXp: 9
    },

    "titanium_ingot": {
        name: "mc:titanium_ingot",
        result: "mc:titanium_ingot",
        requiredLevel: 4,
        baseActions: 20,
        needTemperature: [1600, 1800],
        ingredients: {
            "mc:titanium": 4,
            "mc:iron_alloy": 8,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 3
        },
        maxAdditives: 2,
        baseMoney: 20,
        baseXp: 12
    },

    "tungsten_ingot": {
        name: "mc:tungsten_ingot",
        result: "mc:tungsten_ingot",
        requiredLevel: 5,
        baseActions: 22,
        needTemperature: [1800, 2000],
        ingredients: {
            "mc:tungsten": 4,
            "mc:iron_alloy": 8,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 4
        },
        maxAdditives: 3,
        baseMoney: 25,
        baseXp: 15
    },

    /* ===== 基本的な鉱石精錬 ===== */

    "vanadium_alloy": {
        name: "mc:vanadium_alloy",
        result: "mc:vanadium_alloy",
        requiredLevel: 10,
        baseActions: 22,
        needTemperature: [1400, 1600],
        ingredients: {
            "mc:iron_alloy": 2,
            "mc:vanadium_powder": 1,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:coal": 4
        },
        maxAdditives: 2,
        baseMoney: 50,
        baseXp: 30
    },

    "vanadium_pickaxe": {
        name: "mc:vanadium_pickaxe",
        result: "mc:vanadium_pickaxe",
        requiredLevel: 12,
        baseActions: 20,
        needTemperature: [1400, 1700],
        ingredients: {
            "mc:vanadium_alloy": 4,
            "minecraft:stick": 2, // 柄の仮固定表現
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:redstone": 2
        },
        maxAdditives: 2,
        baseMoney: 60,
        baseXp: 36
    },

    "backpack": {
        name: "mc:backpack",
        result: "mc:backpack",
        requiredLevel: 15,
        baseActions: 20,
        needTemperature: [1400, 1700],
        ingredients: {
            "mc:vanadium_alloy": 3,
            "mc:titanium_ingot": 3,
            "mc:tungsten_ingot": 3,
            "minecraft:leather": 12,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:redstone": 2
        },
        maxAdditives: 2,
        baseMoney: 75,
        baseXp: 45
    },


    "titanium_alloy": {
        name: "mc:titanium_alloy",
        result: "mc:titanium_alloy",
        requiredLevel: 18,
        baseActions: 20,
        needTemperature: [1600, 1800],
        ingredients: {
            "mc:titanium_ingot": 1,
            "mc:iron_alloy": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 3
        },
        maxAdditives: 2,
        baseMoney: 90,
        baseXp: 54
    },

    "titanium_pickaxe": {
        name: "mc:titanium_pickaxe",
        result: "mc:titanium_pickaxe",
        requiredLevel: 21,
        baseActions: 22,
        needTemperature: [1700, 1900],
        ingredients: {
            "mc:titanium_alloy": 4,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 3
        },
        maxAdditives: 3,
        baseMoney: 105,
        baseXp: 63
    },
    "tungsten_alloy": {
        name: "mc:tungsten_alloy",
        result: "mc:tungsten_alloy",
        requiredLevel: 25,
        baseActions: 24,
        needTemperature: [1800, 2000],
        ingredients: {
            "mc:tungsten_ingot": 1,
            "mc:iron_alloy": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 4
        },
        maxAdditives: 3,
        baseMoney: 125,
        baseXp: 75
    },
    "titanium_hammer": {
        name: "mc:titanium_hammer",
        result: "mc:titanium_hammer",
        requiredLevel: 30,
        baseActions: 22,
        needTemperature: [3500, 4200],
        ingredients: {
            "mc:titanium_alloy": 12,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 3
        },
        maxAdditives: 3,
        baseMoney: 150,
        baseXp: 90
    },
    "tungsten_pickaxe": {
        name: "mc:tungsten_pickaxe",
        result: "mc:tungsten_pickaxe",
        requiredLevel: 35,
        baseActions: 26,
        needTemperature: [1900, 2100],
        ingredients: {
            "mc:tungsten_alloy": 4,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 5
        },
        maxAdditives: 3,
        baseMoney: 185,
        baseXp: 105
    },
    "aluminum_pickaxe": {
        name: "mc:aluminum_pickaxe",
        result: "mc:aluminum_pickaxe",
        requiredLevel: 40,
        baseActions: 26,
        needTemperature: [4500, 5000],
        ingredients: {
            "mc:aluminum": 12,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 5
        },
        maxAdditives: 3,
        baseMoney: 200,
        baseXp: 120
    },
    "mithril_ingot": {
        name: "mc:mithril_ingot",
        result: "mc:mithril_ingot",
        requiredLevel: 45,
        baseActions: 24,
        needTemperature: [4000, 4600],
        ingredients: {
            "mc:mithril": 5,
            "mc:vanadium_alloy": 9,
            "mc:tungsten_alloy": 7,
            "mc:titanium_alloy": 7,
            "mc:iron_alloy": 10,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 4
        },
        maxAdditives: 3,
        baseMoney: 225,
        baseXp: 135
    },
    "mithril_pickaxe": {
        name: "mc:mithril_pickaxe",
        result: "mc:mithril_pickaxe",
        requiredLevel: 50,
        baseActions: 26,
        needTemperature: [7000, 8500],
        ingredients: {
            "mc:mithril_ingot": 12,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 5
        },
        maxAdditives: 3,
        baseMoney: 250,
        baseXp: 150
    },
    "orichalcum_ingot": {
        name: "mc:orichalcum_ingot",
        result: "mc:orichalcum_ingot",
        requiredLevel: 55,
        baseActions: 24,
        needTemperature: [15000, 20000],
        ingredients: {
            "mc:orichalcum": 12,
            "mc:vanadium_alloy": 19,
            "mc:tungsten_alloy": 17,
            "mc:titanium_alloy": 17,
            "mc:iron_alloy": 20,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 4
        },
        maxAdditives: 3,
        baseMoney: 275,
        baseXp: 165
    },
    "orichalcum_pickaxe": {
        name: "mc:orichalcum_pickaxe",
        result: "mc:orichalcum_pickaxe",
        requiredLevel: 60,
        baseActions: 26,
        needTemperature: [39000, 40000],
        ingredients: {
            "mc:orichalcum_ingot": 16,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 5
        },
        maxAdditives: 3,
        baseMoney: 300,
        baseXp: 180
    },
    "tungsten_hammer": {
        name: "mc:tungsten_hammer",
        result: "mc:tungsten_hammer",
        requiredLevel: 65,
        baseActions: 26,
        needTemperature: [5000, 5500],
        ingredients: {
            "mc:tungsten_alloy": 12,
            "minecraft:stick": 2,
            "minecraft:coal": 1,
        },
        additives: {
            "minecraft:blaze_powder": 5
        },
        maxAdditives: 3,
        baseMoney: 325,
        baseXp: 195
    },
};