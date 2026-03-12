export const ChemistryRecipes = {

    /* ===============================
       基礎無機（Lv1〜）
    ============================== */

    /* 石灰石 → 生石灰 */
    "quicklime": {
        name: "mc:quicklime",
        result: { id: "mc:quicklime", count: 2 },
        reactionType: "decomposition",
        requiredLevel: 1,
        baseActions: 12,
        ingredients: {
            "mc:lime_stone": 4
        },
        catalysts: {
            "minecraft:coal": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [850, 1000],
        baseMoney: 5,
        baseXp: 3
    },

    /* 生石灰 → 消石灰 */
    "calcium_hydroxide": {
        name: "mc:calcium_hydroxide",
        result: { id: "mc:calcium_hydroxide", count: 2 },
        reactionType: "neutralization",
        requiredLevel: 2,
        baseActions: 10,
        ingredients: {
            "mc:quicklime": 2,
            "mc:water_beaker": 1
        },
        catalysts: {},
        maxCatalysts: 0,
        targetPH: 12,
        baseMoney: 10,
        baseXp: 6
    },

    "milk": {
        name: "mc:milk",
        result: "mc:milk",
        reactionType: "decomposition",
        requiredLevel: 2,
        baseActions: 8,
        ingredients: {
            "mc:raw_milk": 1
        },
        catalysts: {
            "minecraft:furnace": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [60, 80],
        baseMoney: 10,
        baseXp: 6
    },

    "yeast_culture": {
        name: "mc:yeast",
        result: { id: "mc:yeast", count: 2 },
        reactionType: "fermentation",
        requiredLevel: 4,
        baseActions: 16,
        ingredients: {
            "minecraft:sugar": 2,
            "mc:water_beaker": 1
        },
        catalysts: {
            "mc:apple_juice": 1,
            "mc:mikan_juice": 1,
        },
        maxCatalysts: 1,
        optimalTemperature: [25, 35],
        baseMoney: 20,
        baseXp: 12
    },

    "limestone_decomposition": {
        name: "mc:carbon_dioxide",
        result: "mc:carbon_dioxide",
        reactionType: "decomposition",
        requiredLevel: 4,
        baseActions: 10,
        ingredients: {
            "mc:flask": 1,
            "mc:lime_stone": 4
        },
        catalysts: {
            "minecraft:furnace": 1
        },
        optimalTemperature: [800, 1000],
        baseMoney: 20,
        baseXp: 12
    },

    "oxygen_electrolysis": {
        name: "mc:oxygen_gas",
        result: "mc:oxygen_gas",
        reactionType: "electrolysis",
        requiredLevel: 5,
        baseActions: 12,
        ingredients: {
            "mc:flask": 1,
            "mc:water_beaker": 1
        },
        catalysts: {
            "minecraft:redstone": 1
        },
        maxCatalysts: 1,
        optimalVoltage: [4, 8],
        baseMoney: 25,
        baseXp: 15
    },

    "sodium_hydroxide_solution": {
        name: "mc:sodium_hydroxide_solution",
        result: {
            id: "mc:sodium_hydroxide_solution",
            count: 2
        },
        reactionType: "neutralization",
        requiredLevel: 6,
        baseActions: 6,
        ingredients: {
            "mc:sodium_hydroxide": 1,
            "mc:water_beaker": 1
        },
        catalysts: {},
        maxCatalysts: 0,
        targetPH: 14,
        baseMoney: 12,
        baseXp: 7
    },

    "carbon_dioxide_production": {
        name: "mc:carbon_dioxide",
        result: "mc:carbon_dioxide",
        reactionType: "oxidation",
        requiredLevel: 6,
        baseActions: 8,
        ingredients: {
            "mc:flask": 1,
            "minecraft:coal": 2,
            "mc:oxygen_gas": 2
        },
        catalysts: {
            "minecraft:furnace": 1
        },
        optimalTemperature: [500, 800],
        baseMoney: 30,
        baseXp: 18
    },

    "nitrogen_air_separation": {
        name: "mc:nitrogen_gas",
        result: "mc:nitrogen_gas",
        reactionType: "decomposition",
        requiredLevel: 8,
        baseActions: 16,
        ingredients: {
            "mc:flask": 1,
            "mc:oxygen_gas": 1 // 空気表現の簡略
        },
        catalysts: {
            "minecraft:packed_ice": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [-200, -180],
        baseMoney: 40,
        baseXp: 24
    },

    /* ===============================
       炭酸系（Lv3〜）
    ============================== */

    /* 炭酸水素ナトリウム */
    "sodium_bicarbonate": {
        name: "mc:sodium_bicarbonate",
        result: "mc:sodium_bicarbonate",
        reactionType: "neutralization",
        requiredLevel: 3,
        baseActions: 14,
        ingredients: {
            "mc:sodium_hydroxide_solution": 2,
            "mc:carbon_dioxide": 2
        },
        catalysts: {},
        maxCatalysts: 0,
        targetPH: 8,
        baseMoney: 15,
        baseXp: 9
    },

    /* 炭酸ナトリウム */
    "sodium_carbonate": {
        name: "mc:sodium_carbonate",
        result: "mc:sodium_carbonate",
        reactionType: "oxidation",
        requiredLevel: 5,
        baseActions: 16,
        ingredients: {
            "mc:sodium_bicarbonate": 4
        },
        catalysts: {
            "minecraft:coal": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [200, 350],
        baseMoney: 25,
        baseXp: 15
    },

    /* ===============================
       アルカリ（Lv6〜）
    ============================== */

    /* 水酸化ナトリウム */
    "sodium_hydroxide": {
        name: "mc:sodium_hydroxide",
        result: "mc:sodium_hydroxide",
        reactionType: "neutralization",
        requiredLevel: 6,
        baseActions: 14,
        ingredients: {
            "mc:sodium_carbonate": 4,
            "mc:calcium_hydroxide": 4
        },
        catalysts: {},
        maxCatalysts: 0,
        targetPH: 14,
        baseMoney: 30,
        baseXp: 18
    },

    "coal_residue": {
        name: "mc:coal_residue",
        result: {
            id: "mc:coal_residue",
            count: 8
        },
        reactionType: "decomposition",
        requiredLevel: 9,
        baseActions: 10,
        ingredients: {
            "minecraft:coal": 4
        },
        optimalTemperature: [400, 600],
        baseMoney: 45,
        baseXp: 27
    },

    "sulfur_recovery": {
        name: "mc:sulfur",
        result: "mc:sulfur",
        reactionType: "oxidation",
        requiredLevel: 10,
        baseActions: 14,
        ingredients: {
            "mc:coal_residue": 3
        },
        catalysts: {
            "minecraft:blaze_powder": 1
        },
        optimalTemperature: [200, 350],
        baseMoney: 50,
        baseXp: 30
    },

    "coal_tar": {
        name: "mc:tar",
        result: {
            id: "mc:tar",
            count: 2
        },
        reactionType: "decomposition",
        requiredLevel: 11,
        baseActions: 18,
        ingredients: {
            "minecraft:coal": 6,
            "mc:flask": 1
        },
        catalysts: {
            "minecraft:furnace": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [900, 1100],
        baseMoney: 55,
        baseXp: 33
    },

    "sulfur_dioxide": {
        name: "mc:sulfur_dioxide",
        result: "mc:sulfur_dioxide",
        reactionType: "oxidation",
        requiredLevel: 12,
        baseActions: 12,
        ingredients: {
            "mc:sulfur": 2,
            "mc:oxygen_gas": 2
        },
        catalysts: {
            "minecraft:furnace": 1
        },
        optimalTemperature: [300, 500],
        baseMoney: 60,
        baseXp: 36
    },

    "sulfur_trioxide": {
        name: "mc:sulfur_trioxide",
        result: "mc:sulfur_trioxide",
        reactionType: "oxidation",
        requiredLevel: 13,
        baseActions: 16,
        ingredients: {
            "mc:sulfur_dioxide": 2,
            "mc:oxygen_gas": 1
        },
        catalysts: {
            "mc:vanadium_powder": 1   // 触媒簡略
        },
        maxCatalysts: 1,
        optimalTemperature: [400, 600],
        baseMoney: 65,
        baseXp: 39
    },

    /* ===============================
       石油・炭素系（Lv15〜）
    ============================== */

    "naphtha_fraction": {
        name: "mc:naphtha",
        result: "mc:naphtha",
        reactionType: "decomposition",
        requiredLevel: 14,
        baseActions: 18,
        ingredients: {
            "mc:crude_oil": 6
        },
        catalysts: {
            "minecraft:blaze_powder": 1
        },
        maxCatalysts: 2,
        optimalTemperature: [350, 450],
        baseMoney: 70,
        baseXp: 42
    },

    "crude_oil_fraction": {
        name: "mc:heavy_oil",
        result: "mc:heavy_oil",
        reactionType: "decomposition",
        requiredLevel: 15,
        baseActions: 20,
        ingredients: {
            "mc:crude_oil": 6
        },
        catalysts: {
            "minecraft:blaze_powder": 1
        },
        maxCatalysts: 2,
        optimalTemperature: [300, 380],
        baseMoney: 75,
        baseXp: 45
    },

    "petroleum_coke": {
        name: "mc:petroleum_coke",
        result: "mc:petroleum_coke",
        reactionType: "reduction",
        requiredLevel: 16,
        baseActions: 24,
        ingredients: {
            "mc:heavy_oil": 4
        },
        catalysts: {
            "minecraft:lava_bucket": 1
        },
        maxCatalysts: 2,
        optimalTemperature: [450, 520],
        baseMoney: 80,
        baseXp: 48
    },

    "ethylene_cracking": {
        name: "mc:ethylene",
        result: "mc:ethylene",
        reactionType: "decomposition",
        requiredLevel: 17,
        baseActions: 22,
        ingredients: {
            "mc:naphtha": 4
        },
        catalysts: {
            "minecraft:furnace": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [750, 900],
        baseMoney: 85,
        baseXp: 51
    },

    "potassium_nitrate_synthesis": {
        name: "mc:potassium_nitrate",
        result: "mc:potassium_nitrate",
        reactionType: "neutralization",
        requiredLevel: 18,
        baseActions: 20,
        ingredients: {
            "mc:nitrogen_gas": 2,
            "mc:oxygen_gas": 6,
            "mc:salt": 4,          // カリウム源の簡略表現
            "minecraft:water_bucket": 1
        },
        catalysts: {
            "minecraft:glowstone_dust": 2
        },
        targetPH: 7,
        baseMoney: 90,
        baseXp: 54
    },

    "polyethylene_pellet": {
        name: "mc:polyethylene_pellet",
        result: "mc:polyethylene_pellet",
        reactionType: "polymerization",
        requiredLevel: 20,
        baseActions: 26,
        ingredients: {
            "mc:ethylene": 6
        },
        catalysts: {
            "minecraft:redstone": 2
        },
        maxCatalysts: 2,
        optimalTemperature: [80, 120],
        baseMoney: 100,
        baseXp: 60
    },

    "calcined_coke": {
        name: "mc:calcined_coke",
        result: "mc:calcined_coke",
        reactionType: "oxidation",
        requiredLevel: 22,
        baseActions: 26,
        ingredients: {
            "mc:petroleum_coke": 4
        },
        catalysts: {
            "minecraft:blaze_powder": 2
        },
        maxCatalysts: 2,
        optimalTemperature: [1200, 1350],
        baseMoney: 110,
        baseXp: 66
    },

    "gunpowder_production": {
        name: "minecraft:gunpowder",
        result: "minecraft:gunpowder",
        reactionType: "oxidation",
        requiredLevel: 24,
        baseActions: 16,
        ingredients: {
            "mc:potassium_nitrate": 3,
            "mc:sulfur": 2,
            "minecraft:charcoal": 1
        },
        catalysts: {
            "minecraft:redstone": 1
        },
        optimalTemperature: [20, 40],
        baseMoney: 120,
        baseXp: 72
    },

    "carbon_anode": {
        name: "mc:carbon_anode",
        result: "mc:carbon_anode",
        reactionType: "reduction",
        requiredLevel: 26,
        baseActions: 28,
        ingredients: {
            "mc:calcined_coke": 3,
            "mc:tar": 2
        },
        catalysts: {
            "minecraft:redstone": 2
        },
        maxCatalysts: 2,
        optimalTemperature: [950, 1100],
        baseMoney: 130,
        baseXp: 78
    },

    /* ===============================
       アルミ精錬（Lv28〜）
    ============================== */

    "alumina": {
        name: "mc:alumina",
        result: "mc:alumina",
        reactionType: "neutralization",
        requiredLevel: 28,
        baseActions: 24,
        ingredients: {
            "mc:bauxite": 8,
            "mc:sodium_hydroxide": 4
        },
        catalysts: {
            "mc:lime_powder": 2
        },
        maxCatalysts: 2,
        targetPH: 13,
        baseMoney: 140,
        baseXp: 84
    },

    "aluminum": {
        name: "mc:aluminum",
        result: "mc:aluminum",
        reactionType: "electrolysis",
        requiredLevel: 32,
        baseActions: 32,
        ingredients: {
            "mc:alumina": 6,
            "mc:cryolite": 3,
            "mc:carbon_anode": 2
        },
        catalysts: {},
        maxCatalysts: 0,
        optimalVoltage: [12, 16],
        baseMoney: 160,
        baseXp: 96
    },

    "sulfuric_acid": {
        name: "mc:sulfuric_acid",
        result: {
            id: "mc:sulfuric_acid",
            count: 4
        },
        reactionType: "neutralization",
        requiredLevel: 34,
        baseActions: 18,
        ingredients: {
            "mc:sulfur_trioxide": 2,
            "mc:water_beaker": 2
        },
        catalysts: {},
        maxCatalysts: 0,
        targetPH: 1,
        baseMoney: 170,
        baseXp: 102
    },

    /* ===============================
       アンモニア（最終：Lv36〜）
    ============================== */

    "ammonia": {
        name: "mc:ammonia",
        result: {
            id: "mc:ammonia",
            count: 12
        },
        reactionType: "reduction",
        requiredLevel: 36,
        baseActions: 36,
        ingredients: {
            "mc:nitrogen_gas": 3,
            "mc:hydrogen_gas": 9
        },
        catalysts: {
            "mc:carbon_anode": 1
        },
        maxCatalysts: 1,
        optimalTemperature: [400, 500],
        baseMoney: 180,
        baseXp: 108
    },

    "ammonium_sulfate": {
        name: "mc:ammonium_sulfate",
        result: {
            id: "mc:ammonium_sulfate",
            count: 12
        },
        reactionType: "neutralization",
        requiredLevel: 38,
        baseActions: 20,
        ingredients: {
            "mc:ammonia": 8,
            "mc:sulfuric_acid": 2
        },
        catalysts: {},
        maxCatalysts: 0,
        targetPH: 6,
        baseMoney: 190,
        baseXp: 114
    }
};