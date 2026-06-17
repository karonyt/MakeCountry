export const FryingPanRecipes = {
    steak: {
        name: "minecraft:cooked_beef",
        ingredients: {
            "mc:beef_loin": 1,
            "mc:food_oil": 1,
        },
        seasonings: {
            "mc:pepper": 1,
            "mc:salt": 2
        },
        result: "minecraft:cooked_beef",
        needHeat: [50, 80],
        maxSeasonings: 5,
        baseMoney: 0.5,
        baseXp: 0.05,
        baseActions: 7,
        requiredLevel: 1
    },
    porkchop: {
        name: "minecraft:cooked_porkchop",
        ingredients: {
            "mc:pork_chop": 1,
            "mc:food_oil": 1,
        },
        seasonings: {
            "mc:pepper": 1,
            "mc:salt": 2
        },
        result: "minecraft:cooked_porkchop",
        needHeat: [65, 95],
        maxSeasonings: 5,
        baseMoney: 0.5,
        baseXp: 0.05,
        baseActions: 7,
        requiredLevel: 1
    },
    sunny_side_up_eggs: {
        name: "mc:sunny_side_up_eggs",
        ingredients: {
            "minecraft:egg": 1,
            "mc:food_oil": 1,
        },
        seasonings: {
            "mc:salt": 2
        }
        , result: "mc:sunny_side_up_eggs",
        needHeat: [30, 50],
        maxSeasonings: 5,
        baseMoney: 0.5,
        baseXp: 0.05,
        baseActions: 6,
        requiredLevel: 2
    },

    fish: {
        name: "minecraft:cooked_cod",
        ingredients: {
            "minecraft:cod": 1,
            "mc:food_oil": 1,
        },
        seasonings: {
            "mc:salt": 2
        }
        , result: "minecraft:cooked_cod",
        needHeat: [40, 70],
        maxSeasonings: 5,
        baseMoney: 0.5,
        baseXp: 0.05,
        baseActions: 5,
        requiredLevel: 3
    },

    meatsauce: {
        name: "mc:meatsauce",
        ingredients: {
            "mc:beef_minced_meat": 1,
            "mc:ovlive_oil": 1,
            "mc:pepper": 1,
            "mc:garlic_mizin": 1,
            "mc:red_wine": 1,
            "mc:tomato_sauce": 1,
            "mc:carrot_mizin": 1,
        },
        seasonings: {
            "mc:salt": 2,
            "mc:syoyu": 2,
        }
        , result: "mc:meatsauce",
        needHeat: [115, 145],
        maxSeasonings: 5,
        baseMoney: 2,
        baseXp: 0.5,
        baseActions: 9,
        requiredLevel: 4
    },
    squid_roast: {
        name: "mc:squid_roast",
        ingredients: {
            "minecraft:stick": 1,
            "mc:squid": 1,
            "mc:sake": 1,
            "mc:food_oil": 1,
        },
        seasonings: {
            "mc:salt": 2,
            "minecraft:sugar": 1,
            "mc:syoyu": 1,
        }
        , result: "mc:squid_roast",
        needHeat: [70, 105],
        maxSeasonings: 5,
        baseMoney: 1.5,
        baseXp: 0.15,
        baseActions: 10,
        requiredLevel: 5
    },
    yakisoba: {
        name: "mc:yakisoba",
        ingredients: {
            "mc:noodle": 2,
            "mc:food_oil": 1,
            "mc:pork_boned_rib": 1,
            "minecraft:carrot": 1,
            "minecraft:beetroot": 1,
            "mc:onion": 1,
        },
        seasonings: {
            "mc:salt": 2,
            "mc:syoyu": 1,
        }
        , result: "mc:yakisoba",
        needHeat: [130, 165],
        maxSeasonings: 5,
        baseMoney: 2,
        baseXp: 0.2,
        baseActions: 11,
        requiredLevel: 6
    },
    // Generated food expansion start
    "homeprep_asparagus_saute_base": {
            "name": "mc:homeprep_asparagus_saute_base",
            "result": {
                    "id": "mc:homeprep_asparagus_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_asparagus_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_beetroot_saute_base": {
            "name": "mc:homeprep_beetroot_saute_base",
            "result": {
                    "id": "mc:homeprep_beetroot_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_beetroot_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_ginger_saute_base": {
            "name": "mc:homeprep_ginger_saute_base",
            "result": {
                    "id": "mc:homeprep_ginger_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_ginger_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_kelp_saute_base": {
            "name": "mc:homeprep_kelp_saute_base",
            "result": {
                    "id": "mc:homeprep_kelp_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_kelp_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_leek_saute_base": {
            "name": "mc:homeprep_leek_saute_base",
            "result": {
                    "id": "mc:homeprep_leek_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_leek_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_lotus_root_saute_base": {
            "name": "mc:homeprep_lotus_root_saute_base",
            "result": {
                    "id": "mc:homeprep_lotus_root_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_lotus_root_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_mushroom_saute_base": {
            "name": "mc:homeprep_mushroom_saute_base",
            "result": {
                    "id": "mc:homeprep_mushroom_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_mushroom_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_pie_dough_saute_base": {
            "name": "mc:homeprep_pie_dough_saute_base",
            "result": {
                    "id": "mc:homeprep_pie_dough_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_pie_dough_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_potato_saute_base": {
            "name": "mc:homeprep_potato_saute_base",
            "result": {
                    "id": "mc:homeprep_potato_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_potato_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_rice_saute_base": {
            "name": "mc:homeprep_rice_saute_base",
            "result": {
                    "id": "mc:homeprep_rice_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_rice_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_sesame_saute_base": {
            "name": "mc:homeprep_sesame_saute_base",
            "result": {
                    "id": "mc:homeprep_sesame_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_sesame_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_teriyaki_saute_base": {
            "name": "mc:homeprep_teriyaki_saute_base",
            "result": {
                    "id": "mc:homeprep_teriyaki_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_teriyaki_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_tortilla_saute_base": {
            "name": "mc:homeprep_tortilla_saute_base",
            "result": {
                    "id": "mc:homeprep_tortilla_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_tortilla_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_vinegared_rice_saute_base": {
            "name": "mc:homeprep_vinegared_rice_saute_base",
            "result": {
                    "id": "mc:homeprep_vinegared_rice_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_zucchini_saute_base": {
            "name": "mc:homeprep_zucchini_saute_base",
            "result": {
                    "id": "mc:homeprep_zucchini_saute_base",
                    "count": 2
            },
            "requiredLevel": 146,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_zucchini_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 456,
            "baseXp": 304
    },
    "homeprep_anko_saute_base": {
            "name": "mc:homeprep_anko_saute_base",
            "result": {
                    "id": "mc:homeprep_anko_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_anko_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_beef_saute_base": {
            "name": "mc:homeprep_beef_saute_base",
            "result": {
                    "id": "mc:homeprep_beef_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_beef_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_carrot_saute_base": {
            "name": "mc:homeprep_carrot_saute_base",
            "result": {
                    "id": "mc:homeprep_carrot_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_carrot_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_chicken_saute_base": {
            "name": "mc:homeprep_chicken_saute_base",
            "result": {
                    "id": "mc:homeprep_chicken_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_chicken_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_chili_saute_base": {
            "name": "mc:homeprep_chili_saute_base",
            "result": {
                    "id": "mc:homeprep_chili_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_chili_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_chocolate_saute_base": {
            "name": "mc:homeprep_chocolate_saute_base",
            "result": {
                    "id": "mc:homeprep_chocolate_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_chocolate_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_cream_saute_base": {
            "name": "mc:homeprep_cream_saute_base",
            "result": {
                    "id": "mc:homeprep_cream_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_cream_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_custard_saute_base": {
            "name": "mc:homeprep_custard_saute_base",
            "result": {
                    "id": "mc:homeprep_custard_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_custard_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_garlic_saute_base": {
            "name": "mc:homeprep_garlic_saute_base",
            "result": {
                    "id": "mc:homeprep_garlic_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_garlic_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_honey_saute_base": {
            "name": "mc:homeprep_honey_saute_base",
            "result": {
                    "id": "mc:homeprep_honey_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_honey_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_onion_saute_base": {
            "name": "mc:homeprep_onion_saute_base",
            "result": {
                    "id": "mc:homeprep_onion_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_onion_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_peanut_saute_base": {
            "name": "mc:homeprep_peanut_saute_base",
            "result": {
                    "id": "mc:homeprep_peanut_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_peanut_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_pineapple_saute_base": {
            "name": "mc:homeprep_pineapple_saute_base",
            "result": {
                    "id": "mc:homeprep_pineapple_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pineapple_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_pork_saute_base": {
            "name": "mc:homeprep_pork_saute_base",
            "result": {
                    "id": "mc:homeprep_pork_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_pork_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_ramen_saute_base": {
            "name": "mc:homeprep_ramen_saute_base",
            "result": {
                    "id": "mc:homeprep_ramen_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_ramen_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_soba_saute_base": {
            "name": "mc:homeprep_soba_saute_base",
            "result": {
                    "id": "mc:homeprep_soba_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_soba_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_udon_saute_base": {
            "name": "mc:homeprep_udon_saute_base",
            "result": {
                    "id": "mc:homeprep_udon_saute_base",
                    "count": 2
            },
            "requiredLevel": 147,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_udon_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 459,
            "baseXp": 306
    },
    "homeprep_apple_saute_base": {
            "name": "mc:homeprep_apple_saute_base",
            "result": {
                    "id": "mc:homeprep_apple_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_apple_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_bacon_saute_base": {
            "name": "mc:homeprep_bacon_saute_base",
            "result": {
                    "id": "mc:homeprep_bacon_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_bacon_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_barley_saute_base": {
            "name": "mc:homeprep_barley_saute_base",
            "result": {
                    "id": "mc:homeprep_barley_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_barley_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_butter_saute_base": {
            "name": "mc:homeprep_butter_saute_base",
            "result": {
                    "id": "mc:homeprep_butter_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_butter_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_cabbage_saute_base": {
            "name": "mc:homeprep_cabbage_saute_base",
            "result": {
                    "id": "mc:homeprep_cabbage_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_cabbage_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_coffee_saute_base": {
            "name": "mc:homeprep_coffee_saute_base",
            "result": {
                    "id": "mc:homeprep_coffee_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_coffee_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_curry_saute_base": {
            "name": "mc:homeprep_curry_saute_base",
            "result": {
                    "id": "mc:homeprep_curry_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_curry_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_daikon_saute_base": {
            "name": "mc:homeprep_daikon_saute_base",
            "result": {
                    "id": "mc:homeprep_daikon_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_daikon_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_eggplant_saute_base": {
            "name": "mc:homeprep_eggplant_saute_base",
            "result": {
                    "id": "mc:homeprep_eggplant_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_eggplant_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_flour_saute_base": {
            "name": "mc:homeprep_flour_saute_base",
            "result": {
                    "id": "mc:homeprep_flour_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_flour_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_herb_saute_base": {
            "name": "mc:homeprep_herb_saute_base",
            "result": {
                    "id": "mc:homeprep_herb_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_herb_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_macaroni_saute_base": {
            "name": "mc:homeprep_macaroni_saute_base",
            "result": {
                    "id": "mc:homeprep_macaroni_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_macaroni_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_milk_saute_base": {
            "name": "mc:homeprep_milk_saute_base",
            "result": {
                    "id": "mc:homeprep_milk_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_milk_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_spinach_saute_base": {
            "name": "mc:homeprep_spinach_saute_base",
            "result": {
                    "id": "mc:homeprep_spinach_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_spinach_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_strawberry_saute_base": {
            "name": "mc:homeprep_strawberry_saute_base",
            "result": {
                    "id": "mc:homeprep_strawberry_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_strawberry_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_sweet_corn_saute_base": {
            "name": "mc:homeprep_sweet_corn_saute_base",
            "result": {
                    "id": "mc:homeprep_sweet_corn_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_sweet_corn_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_tomato_saute_base": {
            "name": "mc:homeprep_tomato_saute_base",
            "result": {
                    "id": "mc:homeprep_tomato_saute_base",
                    "count": 2
            },
            "requiredLevel": 148,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tomato_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 462,
            "baseXp": 308
    },
    "homeprep_bell_pepper_saute_base": {
            "name": "mc:homeprep_bell_pepper_saute_base",
            "result": {
                    "id": "mc:homeprep_bell_pepper_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_bell_pepper_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_bread_saute_base": {
            "name": "mc:homeprep_bread_saute_base",
            "result": {
                    "id": "mc:homeprep_bread_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_bread_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_buns_saute_base": {
            "name": "mc:homeprep_buns_saute_base",
            "result": {
                    "id": "mc:homeprep_buns_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_buns_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_burdock_saute_base": {
            "name": "mc:homeprep_burdock_saute_base",
            "result": {
                    "id": "mc:homeprep_burdock_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_burdock_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_cheese_saute_base": {
            "name": "mc:homeprep_cheese_saute_base",
            "result": {
                    "id": "mc:homeprep_cheese_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_cheese_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_egg_saute_base": {
            "name": "mc:homeprep_egg_saute_base",
            "result": {
                    "id": "mc:homeprep_egg_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_egg_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_matcha_saute_base": {
            "name": "mc:homeprep_matcha_saute_base",
            "result": {
                    "id": "mc:homeprep_matcha_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_matcha_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_mikan_saute_base": {
            "name": "mc:homeprep_mikan_saute_base",
            "result": {
                    "id": "mc:homeprep_mikan_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:homeprep_mikan_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_miso_saute_base": {
            "name": "mc:homeprep_miso_saute_base",
            "result": {
                    "id": "mc:homeprep_miso_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_miso_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_pumpkin_saute_base": {
            "name": "mc:homeprep_pumpkin_saute_base",
            "result": {
                    "id": "mc:homeprep_pumpkin_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pumpkin_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "homeprep_soy_sauce_saute_base": {
            "name": "mc:homeprep_soy_sauce_saute_base",
            "result": {
                    "id": "mc:homeprep_soy_sauce_saute_base",
                    "count": 2
            },
            "requiredLevel": 149,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_soy_sauce_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 465,
            "baseXp": 310
    },
    "asparagus_bacon": {
            "name": "mc:asparagus_bacon",
            "result": "mc:asparagus_bacon",
            "requiredLevel": 162,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:asparagus_cut": 2,
                    "mc:bacon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 504,
            "baseXp": 336
    },
    "burdock_kinpira": {
            "name": "mc:burdock_kinpira",
            "result": "mc:burdock_kinpira",
            "requiredLevel": 162,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:burdock_shaved": 2,
                    "mc:carrot_mizin": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 504,
            "baseXp": 336
    },
    "cucumber_salad": {
            "name": "mc:cucumber_salad",
            "result": "mc:cucumber_salad",
            "requiredLevel": 162,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cucumber_slice": 2,
                    "mc:vinegar": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 504,
            "baseXp": 336
    },
    "eggplant_miso": {
            "name": "mc:eggplant_miso",
            "result": "mc:eggplant_miso",
            "requiredLevel": 162,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:eggplant_slice": 2,
                    "mc:miso": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 504,
            "baseXp": 336
    },
    "ginger_pork": {
            "name": "mc:ginger_pork",
            "result": "mc:ginger_pork",
            "requiredLevel": 162,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:pork_shoulder_loin": 1,
                    "mc:grated_ginger": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 504,
            "baseXp": 336
    },
    "roasted_sweet_corn": {
            "name": "mc:roasted_sweet_corn",
            "result": "mc:roasted_sweet_corn",
            "requiredLevel": 162,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:sweet_corn": 1,
                    "minecraft:stick": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 504,
            "baseXp": 336
    },
    "ebi_chili": {
            "name": "mc:ebi_chili",
            "result": "mc:ebi_chili",
            "requiredLevel": 163,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:shrimp": 2,
                    "mc:chili_powder": 1,
                    "mc:tomato_catsup": 1
            },
            "seasonings": {
                    "mc:grated_ginger": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "gyoza": {
            "name": "mc:gyoza",
            "result": "mc:gyoza",
            "requiredLevel": 163,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 2,
                    "mc:cabbage_chopped": 1,
                    "mc:pork_sasami": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "mapo_tofu": {
            "name": "mc:mapo_tofu",
            "result": "mc:mapo_tofu",
            "requiredLevel": 163,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:soybeans": 2,
                    "mc:beef_minced_meat": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "okonomiyaki": {
            "name": "mc:okonomiyaki",
            "result": "mc:okonomiyaki",
            "requiredLevel": 163,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cabbage_chopped": 2,
                    "mc:flour": 2,
                    "minecraft:egg": 1,
                    "mc:pork_boned_rib": 1
            },
            "seasonings": {
                    "mc:mayonnaise": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "omurice": {
            "name": "mc:omurice",
            "result": "mc:omurice",
            "requiredLevel": 163,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 2,
                    "mc:tomato_catsup": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "pancakes": {
            "name": "mc:pancakes",
            "result": "mc:pancakes",
            "requiredLevel": 163,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 2,
                    "minecraft:egg": 1,
                    "mc:milk": 1,
                    "minecraft:sugar": 1
            },
            "seasonings": {
                    "mc:caramel_sauce": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "fish_grilled_abalone": {
            "name": "mc:fish_grilled_abalone",
            "result": "mc:fish_grilled_abalone",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_abalone": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_airsac_catfish": {
            "name": "mc:fish_grilled_airsac_catfish",
            "result": "mc:fish_grilled_airsac_catfish",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_airsac_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_alfonsino": {
            "name": "mc:fish_grilled_alfonsino",
            "result": "mc:fish_grilled_alfonsino",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_alfonsino": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_amberjack": {
            "name": "mc:fish_grilled_amberjack",
            "result": "mc:fish_grilled_amberjack",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_amberjack": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_anemonefish": {
            "name": "mc:fish_grilled_anemonefish",
            "result": "mc:fish_grilled_anemonefish",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_anemonefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_anglerfish": {
            "name": "mc:fish_grilled_anglerfish",
            "result": "mc:fish_grilled_anglerfish",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_anglerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_arapaima": {
            "name": "mc:fish_grilled_arapaima",
            "result": "mc:fish_grilled_arapaima",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_arapaima": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_armored_searobin": {
            "name": "mc:fish_grilled_armored_searobin",
            "result": "mc:fish_grilled_armored_searobin",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_armored_searobin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_arowana": {
            "name": "mc:fish_grilled_arowana",
            "result": "mc:fish_grilled_arowana",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_arowana": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_atka_mackerel": {
            "name": "mc:fish_grilled_atka_mackerel",
            "result": "mc:fish_grilled_atka_mackerel",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_atka_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_atlantic_salmon": {
            "name": "mc:fish_grilled_atlantic_salmon",
            "result": "mc:fish_grilled_atlantic_salmon",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_atlantic_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_australasian_salmon": {
            "name": "mc:fish_grilled_australasian_salmon",
            "result": "mc:fish_grilled_australasian_salmon",
            "requiredLevel": 201,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_australasian_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 621,
            "baseXp": 414
    },
    "fish_grilled_australian_prowfish": {
            "name": "mc:fish_grilled_australian_prowfish",
            "result": "mc:fish_grilled_australian_prowfish",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_australian_prowfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_ballan_wrasse": {
            "name": "mc:fish_grilled_ballan_wrasse",
            "result": "mc:fish_grilled_ballan_wrasse",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_ballan_wrasse": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_bangus": {
            "name": "mc:fish_grilled_bangus",
            "result": "mc:fish_grilled_bangus",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bangus": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_barbel": {
            "name": "mc:fish_grilled_barbel",
            "result": "mc:fish_grilled_barbel",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_barbel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_barfish": {
            "name": "mc:fish_grilled_barfish",
            "result": "mc:fish_grilled_barfish",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_barfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_barred_danio": {
            "name": "mc:fish_grilled_barred_danio",
            "result": "mc:fish_grilled_barred_danio",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_barred_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_basslet": {
            "name": "mc:fish_grilled_basslet",
            "result": "mc:fish_grilled_basslet",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_basslet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_beaked_salmon": {
            "name": "mc:fish_grilled_beaked_salmon",
            "result": "mc:fish_grilled_beaked_salmon",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_beaked_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_bengal_danio": {
            "name": "mc:fish_grilled_bengal_danio",
            "result": "mc:fish_grilled_bengal_danio",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bengal_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_bigeye": {
            "name": "mc:fish_grilled_bigeye",
            "result": "mc:fish_grilled_bigeye",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bigeye": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_bigmouth_buffalo": {
            "name": "mc:fish_grilled_bigmouth_buffalo",
            "result": "mc:fish_grilled_bigmouth_buffalo",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bigmouth_buffalo": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_bitterling": {
            "name": "mc:fish_grilled_bitterling",
            "result": "mc:fish_grilled_bitterling",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bitterling": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_black_mackerel": {
            "name": "mc:fish_grilled_black_mackerel",
            "result": "mc:fish_grilled_black_mackerel",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_black_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_black_sea_bass": {
            "name": "mc:fish_grilled_black_sea_bass",
            "result": "mc:fish_grilled_black_sea_bass",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_black_sea_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_blackchin": {
            "name": "mc:fish_grilled_blackchin",
            "result": "mc:fish_grilled_blackchin",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_blackchin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_bleak": {
            "name": "mc:fish_grilled_bleak",
            "result": "mc:fish_grilled_bleak",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bleak": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_blobfish": {
            "name": "mc:fish_grilled_blobfish",
            "result": "mc:fish_grilled_blobfish",
            "requiredLevel": 202,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_blobfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 624,
            "baseXp": 416
    },
    "fish_grilled_blue_eye_trevalla": {
            "name": "mc:fish_grilled_blue_eye_trevalla",
            "result": "mc:fish_grilled_blue_eye_trevalla",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_blue_eye_trevalla": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_blue_triggerfish": {
            "name": "mc:fish_grilled_blue_triggerfish",
            "result": "mc:fish_grilled_blue_triggerfish",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_blue_triggerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_bluegill": {
            "name": "mc:fish_grilled_bluegill",
            "result": "mc:fish_grilled_bluegill",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bluegill": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_boarfish": {
            "name": "mc:fish_grilled_boarfish",
            "result": "mc:fish_grilled_boarfish",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_boarfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_bombay_duck": {
            "name": "mc:fish_grilled_bombay_duck",
            "result": "mc:fish_grilled_bombay_duck",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bombay_duck": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_bonnetmouth": {
            "name": "mc:fish_grilled_bonnetmouth",
            "result": "mc:fish_grilled_bonnetmouth",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bonnetmouth": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_boxfish": {
            "name": "mc:fish_grilled_boxfish",
            "result": "mc:fish_grilled_boxfish",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_boxfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_bristlemouth": {
            "name": "mc:fish_grilled_bristlemouth",
            "result": "mc:fish_grilled_bristlemouth",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bristlemouth": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_brook_lamprey": {
            "name": "mc:fish_grilled_brook_lamprey",
            "result": "mc:fish_grilled_brook_lamprey",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_brook_lamprey": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_brown_trout": {
            "name": "mc:fish_grilled_brown_trout",
            "result": "mc:fish_grilled_brown_trout",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_brown_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_bullhead": {
            "name": "mc:fish_grilled_bullhead",
            "result": "mc:fish_grilled_bullhead",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_bullhead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_buri": {
            "name": "mc:fish_grilled_buri",
            "result": "mc:fish_grilled_buri",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_buri": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_butterfly_ray": {
            "name": "mc:fish_grilled_butterfly_ray",
            "result": "mc:fish_grilled_butterfly_ray",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_butterfly_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_canary_rockfish": {
            "name": "mc:fish_grilled_canary_rockfish",
            "result": "mc:fish_grilled_canary_rockfish",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_canary_rockfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_cardinal_tetra": {
            "name": "mc:fish_grilled_cardinal_tetra",
            "result": "mc:fish_grilled_cardinal_tetra",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_cardinal_tetra": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_carpsucker": {
            "name": "mc:fish_grilled_carpsucker",
            "result": "mc:fish_grilled_carpsucker",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_carpsucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_catla": {
            "name": "mc:fish_grilled_catla",
            "result": "mc:fish_grilled_catla",
            "requiredLevel": 203,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_catla": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 627,
            "baseXp": 418
    },
    "fish_grilled_chain_pickerel": {
            "name": "mc:fish_grilled_chain_pickerel",
            "result": "mc:fish_grilled_chain_pickerel",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_chain_pickerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_charr": {
            "name": "mc:fish_grilled_charr",
            "result": "mc:fish_grilled_charr",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_charr": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_chinook_salmon": {
            "name": "mc:fish_grilled_chinook_salmon",
            "result": "mc:fish_grilled_chinook_salmon",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_chinook_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_cichlid": {
            "name": "mc:fish_grilled_cichlid",
            "result": "mc:fish_grilled_cichlid",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_cichlid": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_climbing_gourami": {
            "name": "mc:fish_grilled_climbing_gourami",
            "result": "mc:fish_grilled_climbing_gourami",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_climbing_gourami": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_clown_triggerfish": {
            "name": "mc:fish_grilled_clown_triggerfish",
            "result": "mc:fish_grilled_clown_triggerfish",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_clown_triggerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_codlet": {
            "name": "mc:fish_grilled_codlet",
            "result": "mc:fish_grilled_codlet",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_codlet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_coho_salmon": {
            "name": "mc:fish_grilled_coho_salmon",
            "result": "mc:fish_grilled_coho_salmon",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_coho_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_colorado_squawfish": {
            "name": "mc:fish_grilled_colorado_squawfish",
            "result": "mc:fish_grilled_colorado_squawfish",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_colorado_squawfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_common_carp": {
            "name": "mc:fish_grilled_common_carp",
            "result": "mc:fish_grilled_common_carp",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_common_carp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_convict_cichlid": {
            "name": "mc:fish_grilled_convict_cichlid",
            "result": "mc:fish_grilled_convict_cichlid",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_convict_cichlid": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_cow_shark": {
            "name": "mc:fish_grilled_cow_shark",
            "result": "mc:fish_grilled_cow_shark",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_cow_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_crappie": {
            "name": "mc:fish_grilled_crappie",
            "result": "mc:fish_grilled_crappie",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_crappie": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_crevice_kelpfish": {
            "name": "mc:fish_grilled_crevice_kelpfish",
            "result": "mc:fish_grilled_crevice_kelpfish",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_crevice_kelpfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_crucian_carp": {
            "name": "mc:fish_grilled_crucian_carp",
            "result": "mc:fish_grilled_crucian_carp",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_crucian_carp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_cutlassfish": {
            "name": "mc:fish_grilled_cutlassfish",
            "result": "mc:fish_grilled_cutlassfish",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_cutlassfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_dace": {
            "name": "mc:fish_grilled_dace",
            "result": "mc:fish_grilled_dace",
            "requiredLevel": 204,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dace": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 630,
            "baseXp": 420
    },
    "fish_grilled_dartfish": {
            "name": "mc:fish_grilled_dartfish",
            "result": "mc:fish_grilled_dartfish",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dartfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_deep_sea_smelt": {
            "name": "mc:fish_grilled_deep_sea_smelt",
            "result": "mc:fish_grilled_deep_sea_smelt",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_deep_sea_smelt": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_delta_smelt": {
            "name": "mc:fish_grilled_delta_smelt",
            "result": "mc:fish_grilled_delta_smelt",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_delta_smelt": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_devario": {
            "name": "mc:fish_grilled_devario",
            "result": "mc:fish_grilled_devario",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_devario": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_dogfish": {
            "name": "mc:fish_grilled_dogfish",
            "result": "mc:fish_grilled_dogfish",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dogfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_dolly_varden_trout": {
            "name": "mc:fish_grilled_dolly_varden_trout",
            "result": "mc:fish_grilled_dolly_varden_trout",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dolly_varden_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_dory": {
            "name": "mc:fish_grilled_dory",
            "result": "mc:fish_grilled_dory",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dory": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_dragonfish": {
            "name": "mc:fish_grilled_dragonfish",
            "result": "mc:fish_grilled_dragonfish",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dragonfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_duckbill": {
            "name": "mc:fish_grilled_duckbill",
            "result": "mc:fish_grilled_duckbill",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_duckbill": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_dwarf_gourami": {
            "name": "mc:fish_grilled_dwarf_gourami",
            "result": "mc:fish_grilled_dwarf_gourami",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_dwarf_gourami": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_eel": {
            "name": "mc:fish_grilled_eel",
            "result": "mc:fish_grilled_eel",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_eeltail_catfish": {
            "name": "mc:fish_grilled_eeltail_catfish",
            "result": "mc:fish_grilled_eeltail_catfish",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_eeltail_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_electric_knifefish": {
            "name": "mc:fish_grilled_electric_knifefish",
            "result": "mc:fish_grilled_electric_knifefish",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_electric_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_elver": {
            "name": "mc:fish_grilled_elver",
            "result": "mc:fish_grilled_elver",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_elver": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_emperor_angelfish": {
            "name": "mc:fish_grilled_emperor_angelfish",
            "result": "mc:fish_grilled_emperor_angelfish",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_emperor_angelfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_eulachon": {
            "name": "mc:fish_grilled_eulachon",
            "result": "mc:fish_grilled_eulachon",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_eulachon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_european_minnow": {
            "name": "mc:fish_grilled_european_minnow",
            "result": "mc:fish_grilled_european_minnow",
            "requiredLevel": 205,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_european_minnow": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 633,
            "baseXp": 422
    },
    "fish_grilled_false_moray": {
            "name": "mc:fish_grilled_false_moray",
            "result": "mc:fish_grilled_false_moray",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_false_moray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_featherback": {
            "name": "mc:fish_grilled_featherback",
            "result": "mc:fish_grilled_featherback",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_featherback": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_fingerfish": {
            "name": "mc:fish_grilled_fingerfish",
            "result": "mc:fish_grilled_fingerfish",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_fingerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_flabby_whale_fish": {
            "name": "mc:fish_grilled_flabby_whale_fish",
            "result": "mc:fish_grilled_flabby_whale_fish",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_flabby_whale_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_flagtail": {
            "name": "mc:fish_grilled_flagtail",
            "result": "mc:fish_grilled_flagtail",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_flagtail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_flathead_catfish": {
            "name": "mc:fish_grilled_flathead_catfish",
            "result": "mc:fish_grilled_flathead_catfish",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_flathead_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_flying_gurnard": {
            "name": "mc:fish_grilled_flying_gurnard",
            "result": "mc:fish_grilled_flying_gurnard",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_flying_gurnard": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_french_angelfish": {
            "name": "mc:fish_grilled_french_angelfish",
            "result": "mc:fish_grilled_french_angelfish",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_french_angelfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_freshwater_shark": {
            "name": "mc:fish_grilled_freshwater_shark",
            "result": "mc:fish_grilled_freshwater_shark",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_freshwater_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_frogmouth_catfish": {
            "name": "mc:fish_grilled_frogmouth_catfish",
            "result": "mc:fish_grilled_frogmouth_catfish",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_frogmouth_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_gar": {
            "name": "mc:fish_grilled_gar",
            "result": "mc:fish_grilled_gar",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_gar": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_ghost_fish": {
            "name": "mc:fish_grilled_ghost_fish",
            "result": "mc:fish_grilled_ghost_fish",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_ghost_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_ghost_shark": {
            "name": "mc:fish_grilled_ghost_shark",
            "result": "mc:fish_grilled_ghost_shark",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_ghost_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_giant_sea_bass": {
            "name": "mc:fish_grilled_giant_sea_bass",
            "result": "mc:fish_grilled_giant_sea_bass",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_giant_sea_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_gizzard_shad": {
            "name": "mc:fish_grilled_gizzard_shad",
            "result": "mc:fish_grilled_gizzard_shad",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_gizzard_shad": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_glowlight_danio": {
            "name": "mc:fish_grilled_glowlight_danio",
            "result": "mc:fish_grilled_glowlight_danio",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_glowlight_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_golden_dojo": {
            "name": "mc:fish_grilled_golden_dojo",
            "result": "mc:fish_grilled_golden_dojo",
            "requiredLevel": 206,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_golden_dojo": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 636,
            "baseXp": 424
    },
    "fish_grilled_goldeye": {
            "name": "mc:fish_grilled_goldeye",
            "result": "mc:fish_grilled_goldeye",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_goldeye": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_gopher_rockfish": {
            "name": "mc:fish_grilled_gopher_rockfish",
            "result": "mc:fish_grilled_gopher_rockfish",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_gopher_rockfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_gray_mullet": {
            "name": "mc:fish_grilled_gray_mullet",
            "result": "mc:fish_grilled_gray_mullet",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_gray_mullet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_green_spotted_puffer": {
            "name": "mc:fish_grilled_green_spotted_puffer",
            "result": "mc:fish_grilled_green_spotted_puffer",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_green_spotted_puffer": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_grenadier": {
            "name": "mc:fish_grilled_grenadier",
            "result": "mc:fish_grilled_grenadier",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_grenadier": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_grunt": {
            "name": "mc:fish_grilled_grunt",
            "result": "mc:fish_grilled_grunt",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_grunt": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_guitarfish": {
            "name": "mc:fish_grilled_guitarfish",
            "result": "mc:fish_grilled_guitarfish",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_guitarfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_gunnel": {
            "name": "mc:fish_grilled_gunnel",
            "result": "mc:fish_grilled_gunnel",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_gunnel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_hagfish": {
            "name": "mc:fish_grilled_hagfish",
            "result": "mc:fish_grilled_hagfish",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_hagfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_halfmoon": {
            "name": "mc:fish_grilled_halfmoon",
            "result": "mc:fish_grilled_halfmoon",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_halfmoon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_hammerhead_shark": {
            "name": "mc:fish_grilled_hammerhead_shark",
            "result": "mc:fish_grilled_hammerhead_shark",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_hammerhead_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_harelip_sucker": {
            "name": "mc:fish_grilled_harelip_sucker",
            "result": "mc:fish_grilled_harelip_sucker",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_harelip_sucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_herring": {
            "name": "mc:fish_grilled_herring",
            "result": "mc:fish_grilled_herring",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_herring": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_hog_sucker": {
            "name": "mc:fish_grilled_hog_sucker",
            "result": "mc:fish_grilled_hog_sucker",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_hog_sucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_horsefish": {
            "name": "mc:fish_grilled_horsefish",
            "result": "mc:fish_grilled_horsefish",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_horsefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_humuhumunukunukuapua_a": {
            "name": "mc:fish_grilled_humuhumunukunukuapua_a",
            "result": "mc:fish_grilled_humuhumunukunukuapua_a",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_humuhumunukunukuapua_a": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_ilish_hilsha": {
            "name": "mc:fish_grilled_ilish_hilsha",
            "result": "mc:fish_grilled_ilish_hilsha",
            "requiredLevel": 207,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_ilish_hilsha": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 639,
            "baseXp": 426
    },
    "fish_grilled_jack_dempsey": {
            "name": "mc:fish_grilled_jack_dempsey",
            "result": "mc:fish_grilled_jack_dempsey",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_jack_dempsey": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_jawfish": {
            "name": "mc:fish_grilled_jawfish",
            "result": "mc:fish_grilled_jawfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_jawfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_jewelfish": {
            "name": "mc:fish_grilled_jewelfish",
            "result": "mc:fish_grilled_jewelfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_jewelfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_kingfish": {
            "name": "mc:fish_grilled_kingfish",
            "result": "mc:fish_grilled_kingfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_kingfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_lake_whitefish": {
            "name": "mc:fish_grilled_lake_whitefish",
            "result": "mc:fish_grilled_lake_whitefish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_lake_whitefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_leatherjacket": {
            "name": "mc:fish_grilled_leatherjacket",
            "result": "mc:fish_grilled_leatherjacket",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_leatherjacket": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_loach_catfish": {
            "name": "mc:fish_grilled_loach_catfish",
            "result": "mc:fish_grilled_loach_catfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_loach_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_longfin_dragonfish": {
            "name": "mc:fish_grilled_longfin_dragonfish",
            "result": "mc:fish_grilled_longfin_dragonfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_longfin_dragonfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_lost_river_sucker": {
            "name": "mc:fish_grilled_lost_river_sucker",
            "result": "mc:fish_grilled_lost_river_sucker",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_lost_river_sucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_madtom": {
            "name": "mc:fish_grilled_madtom",
            "result": "mc:fish_grilled_madtom",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_madtom": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_mantis_shrimp": {
            "name": "mc:fish_grilled_mantis_shrimp",
            "result": "mc:fish_grilled_mantis_shrimp",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_mantis_shrimp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_medaka": {
            "name": "mc:fish_grilled_medaka",
            "result": "mc:fish_grilled_medaka",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_medaka": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_mooneye": {
            "name": "mc:fish_grilled_mooneye",
            "result": "mc:fish_grilled_mooneye",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_mooneye": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_mud_catfish": {
            "name": "mc:fish_grilled_mud_catfish",
            "result": "mc:fish_grilled_mud_catfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_mud_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_muskellunge": {
            "name": "mc:fish_grilled_muskellunge",
            "result": "mc:fish_grilled_muskellunge",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_muskellunge": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_nautilus": {
            "name": "mc:fish_grilled_nautilus",
            "result": "mc:fish_grilled_nautilus",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_nautilus": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_oarfish": {
            "name": "mc:fish_grilled_oarfish",
            "result": "mc:fish_grilled_oarfish",
            "requiredLevel": 208,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_oarfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 642,
            "baseXp": 428
    },
    "fish_grilled_opah": {
            "name": "mc:fish_grilled_opah",
            "result": "mc:fish_grilled_opah",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_opah": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_pacific_trout": {
            "name": "mc:fish_grilled_pacific_trout",
            "result": "mc:fish_grilled_pacific_trout",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_pacific_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_paradise_fish": {
            "name": "mc:fish_grilled_paradise_fish",
            "result": "mc:fish_grilled_paradise_fish",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_paradise_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_pelican_gulper": {
            "name": "mc:fish_grilled_pelican_gulper",
            "result": "mc:fish_grilled_pelican_gulper",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_pelican_gulper": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_pike": {
            "name": "mc:fish_grilled_pike",
            "result": "mc:fish_grilled_pike",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_pike": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_pollock": {
            "name": "mc:fish_grilled_pollock",
            "result": "mc:fish_grilled_pollock",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_pollock": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_rattail": {
            "name": "mc:fish_grilled_rattail",
            "result": "mc:fish_grilled_rattail",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_rattail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_roosterfish": {
            "name": "mc:fish_grilled_roosterfish",
            "result": "mc:fish_grilled_roosterfish",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_roosterfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_russian_sturgeon": {
            "name": "mc:fish_grilled_russian_sturgeon",
            "result": "mc:fish_grilled_russian_sturgeon",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_russian_sturgeon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_sand_stargazer": {
            "name": "mc:fish_grilled_sand_stargazer",
            "result": "mc:fish_grilled_sand_stargazer",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_sand_stargazer": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_scallop": {
            "name": "mc:fish_grilled_scallop",
            "result": "mc:fish_grilled_scallop",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_scallop": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_sea_bass": {
            "name": "mc:fish_grilled_sea_bass",
            "result": "mc:fish_grilled_sea_bass",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_sea_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_sea_lamprey": {
            "name": "mc:fish_grilled_sea_lamprey",
            "result": "mc:fish_grilled_sea_lamprey",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_sea_lamprey": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_sheatfish": {
            "name": "mc:fish_grilled_sheatfish",
            "result": "mc:fish_grilled_sheatfish",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_sheatfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_skilfish": {
            "name": "mc:fish_grilled_skilfish",
            "result": "mc:fish_grilled_skilfish",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_skilfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_smallmouth_bass": {
            "name": "mc:fish_grilled_smallmouth_bass",
            "result": "mc:fish_grilled_smallmouth_bass",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_smallmouth_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_snook": {
            "name": "mc:fish_grilled_snook",
            "result": "mc:fish_grilled_snook",
            "requiredLevel": 209,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_snook": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 645,
            "baseXp": 430
    },
    "fish_grilled_spearfish": {
            "name": "mc:fish_grilled_spearfish",
            "result": "mc:fish_grilled_spearfish",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_spearfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_sturgeon": {
            "name": "mc:fish_grilled_sturgeon",
            "result": "mc:fish_grilled_sturgeon",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_sturgeon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_swordfish": {
            "name": "mc:fish_grilled_swordfish",
            "result": "mc:fish_grilled_swordfish",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_swordfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_tiger_shark": {
            "name": "mc:fish_grilled_tiger_shark",
            "result": "mc:fish_grilled_tiger_shark",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_tiger_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_triggerfish": {
            "name": "mc:fish_grilled_triggerfish",
            "result": "mc:fish_grilled_triggerfish",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_triggerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_wahoo": {
            "name": "mc:fish_grilled_wahoo",
            "result": "mc:fish_grilled_wahoo",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_wahoo": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_white_marlin": {
            "name": "mc:fish_grilled_white_marlin",
            "result": "mc:fish_grilled_white_marlin",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_white_marlin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_yellowfin_tuna": {
            "name": "mc:fish_grilled_yellowfin_tuna",
            "result": "mc:fish_grilled_yellowfin_tuna",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_yellowfin_tuna": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_yellowtail_horse_mackerel": {
            "name": "mc:fish_grilled_yellowtail_horse_mackerel",
            "result": "mc:fish_grilled_yellowtail_horse_mackerel",
            "requiredLevel": 210,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 6,
            "ingredients": {
                    "mc:fish_fillet_yellowtail_horse_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 648,
            "baseXp": 432
    },
    "fish_grilled_african_lungfish": {
            "name": "mc:fish_grilled_african_lungfish",
            "result": "mc:fish_grilled_african_lungfish",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_african_lungfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_alaska_blackfish": {
            "name": "mc:fish_grilled_alaska_blackfish",
            "result": "mc:fish_grilled_alaska_blackfish",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_alaska_blackfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_algae_eater": {
            "name": "mc:fish_grilled_algae_eater",
            "result": "mc:fish_grilled_algae_eater",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_algae_eater": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_american_sole": {
            "name": "mc:fish_grilled_american_sole",
            "result": "mc:fish_grilled_american_sole",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_american_sole": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_angelfish": {
            "name": "mc:fish_grilled_angelfish",
            "result": "mc:fish_grilled_angelfish",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_angelfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_antarctic_cod": {
            "name": "mc:fish_grilled_antarctic_cod",
            "result": "mc:fish_grilled_antarctic_cod",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_antarctic_cod": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_archerfish": {
            "name": "mc:fish_grilled_archerfish",
            "result": "mc:fish_grilled_archerfish",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_archerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_armorhead": {
            "name": "mc:fish_grilled_armorhead",
            "result": "mc:fish_grilled_armorhead",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_armorhead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_arrowtooth_eel": {
            "name": "mc:fish_grilled_arrowtooth_eel",
            "result": "mc:fish_grilled_arrowtooth_eel",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_arrowtooth_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_atlantic_bonito": {
            "name": "mc:fish_grilled_atlantic_bonito",
            "result": "mc:fish_grilled_atlantic_bonito",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_atlantic_bonito": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_atlantic_saury": {
            "name": "mc:fish_grilled_atlantic_saury",
            "result": "mc:fish_grilled_atlantic_saury",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_atlantic_saury": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_australian_grayling": {
            "name": "mc:fish_grilled_australian_grayling",
            "result": "mc:fish_grilled_australian_grayling",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_australian_grayling": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_ayu": {
            "name": "mc:fish_grilled_ayu",
            "result": "mc:fish_grilled_ayu",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ayu": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_bamboo_shark": {
            "name": "mc:fish_grilled_bamboo_shark",
            "result": "mc:fish_grilled_bamboo_shark",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bamboo_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_banjo": {
            "name": "mc:fish_grilled_banjo",
            "result": "mc:fish_grilled_banjo",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_banjo": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_barbel_less_catfish": {
            "name": "mc:fish_grilled_barbel_less_catfish",
            "result": "mc:fish_grilled_barbel_less_catfish",
            "requiredLevel": 211,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_barbel_less_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 651,
            "baseXp": 434
    },
    "fish_grilled_barracuda": {
            "name": "mc:fish_grilled_barracuda",
            "result": "mc:fish_grilled_barracuda",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_barracuda": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_barreleye": {
            "name": "mc:fish_grilled_barreleye",
            "result": "mc:fish_grilled_barreleye",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_barreleye": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_bat_ray": {
            "name": "mc:fish_grilled_bat_ray",
            "result": "mc:fish_grilled_bat_ray",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bat_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_beaked_sandfish": {
            "name": "mc:fish_grilled_beaked_sandfish",
            "result": "mc:fish_grilled_beaked_sandfish",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_beaked_sandfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_betta": {
            "name": "mc:fish_grilled_betta",
            "result": "mc:fish_grilled_betta",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_betta": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_bigeye_squaretail": {
            "name": "mc:fish_grilled_bigeye_squaretail",
            "result": "mc:fish_grilled_bigeye_squaretail",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bigeye_squaretail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_bigscale": {
            "name": "mc:fish_grilled_bigscale",
            "result": "mc:fish_grilled_bigscale",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bigscale": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_black_angelfish": {
            "name": "mc:fish_grilled_black_angelfish",
            "result": "mc:fish_grilled_black_angelfish",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_black_angelfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_black_neon_tetra": {
            "name": "mc:fish_grilled_black_neon_tetra",
            "result": "mc:fish_grilled_black_neon_tetra",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_black_neon_tetra": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_black_swallower": {
            "name": "mc:fish_grilled_black_swallower",
            "result": "mc:fish_grilled_black_swallower",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_black_swallower": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_blackfin_tuna": {
            "name": "mc:fish_grilled_blackfin_tuna",
            "result": "mc:fish_grilled_blackfin_tuna",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_blackfin_tuna": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_blenny": {
            "name": "mc:fish_grilled_blenny",
            "result": "mc:fish_grilled_blenny",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_blenny": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_blowfish": {
            "name": "mc:fish_grilled_blowfish",
            "result": "mc:fish_grilled_blowfish",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_blowfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_blue_gourami": {
            "name": "mc:fish_grilled_blue_gourami",
            "result": "mc:fish_grilled_blue_gourami",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_blue_gourami": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_blue_whiting": {
            "name": "mc:fish_grilled_blue_whiting",
            "result": "mc:fish_grilled_blue_whiting",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_blue_whiting": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_bluntnose_knifefish": {
            "name": "mc:fish_grilled_bluntnose_knifefish",
            "result": "mc:fish_grilled_bluntnose_knifefish",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bluntnose_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_bobtail_snipe_eel": {
            "name": "mc:fish_grilled_bobtail_snipe_eel",
            "result": "mc:fish_grilled_bobtail_snipe_eel",
            "requiredLevel": 212,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bobtail_snipe_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 654,
            "baseXp": 436
    },
    "fish_grilled_bonefish": {
            "name": "mc:fish_grilled_bonefish",
            "result": "mc:fish_grilled_bonefish",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bonefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_bonytail": {
            "name": "mc:fish_grilled_bonytail",
            "result": "mc:fish_grilled_bonytail",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bonytail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_bramble_shark": {
            "name": "mc:fish_grilled_bramble_shark",
            "result": "mc:fish_grilled_bramble_shark",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bramble_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_bristlenose_catfish": {
            "name": "mc:fish_grilled_bristlenose_catfish",
            "result": "mc:fish_grilled_bristlenose_catfish",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bristlenose_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_brook_stickleback": {
            "name": "mc:fish_grilled_brook_stickleback",
            "result": "mc:fish_grilled_brook_stickleback",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_brook_stickleback": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_buffalo_fish": {
            "name": "mc:fish_grilled_buffalo_fish",
            "result": "mc:fish_grilled_buffalo_fish",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_buffalo_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_bullhead_shark": {
            "name": "mc:fish_grilled_bullhead_shark",
            "result": "mc:fish_grilled_bullhead_shark",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_bullhead_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_burma_danio": {
            "name": "mc:fish_grilled_burma_danio",
            "result": "mc:fish_grilled_burma_danio",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_burma_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_butterflyfish": {
            "name": "mc:fish_grilled_butterflyfish",
            "result": "mc:fish_grilled_butterflyfish",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_butterflyfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_candiru": {
            "name": "mc:fish_grilled_candiru",
            "result": "mc:fish_grilled_candiru",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_candiru": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_cardinalfish": {
            "name": "mc:fish_grilled_cardinalfish",
            "result": "mc:fish_grilled_cardinalfish",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cardinalfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_cat_shark": {
            "name": "mc:fish_grilled_cat_shark",
            "result": "mc:fish_grilled_cat_shark",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cat_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_cavefish": {
            "name": "mc:fish_grilled_cavefish",
            "result": "mc:fish_grilled_cavefish",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cavefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_channel_bass": {
            "name": "mc:fish_grilled_channel_bass",
            "result": "mc:fish_grilled_channel_bass",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_channel_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_cherry_salmon": {
            "name": "mc:fish_grilled_cherry_salmon",
            "result": "mc:fish_grilled_cherry_salmon",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cherry_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_chub": {
            "name": "mc:fish_grilled_chub",
            "result": "mc:fish_grilled_chub",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_chub": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_cisco": {
            "name": "mc:fish_grilled_cisco",
            "result": "mc:fish_grilled_cisco",
            "requiredLevel": 213,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cisco": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 657,
            "baseXp": 438
    },
    "fish_grilled_climbing_perch": {
            "name": "mc:fish_grilled_climbing_perch",
            "result": "mc:fish_grilled_climbing_perch",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_climbing_perch": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_clownfish": {
            "name": "mc:fish_grilled_clownfish",
            "result": "mc:fish_grilled_clownfish",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_clownfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_codling": {
            "name": "mc:fish_grilled_codling",
            "result": "mc:fish_grilled_codling",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_codling": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_coley": {
            "name": "mc:fish_grilled_coley",
            "result": "mc:fish_grilled_coley",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_coley": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_combfish": {
            "name": "mc:fish_grilled_combfish",
            "result": "mc:fish_grilled_combfish",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_combfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_common_tunny": {
            "name": "mc:fish_grilled_common_tunny",
            "result": "mc:fish_grilled_common_tunny",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_common_tunny": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_cookiecutter_shark": {
            "name": "mc:fish_grilled_cookiecutter_shark",
            "result": "mc:fish_grilled_cookiecutter_shark",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cookiecutter_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_cowfish": {
            "name": "mc:fish_grilled_cowfish",
            "result": "mc:fish_grilled_cowfish",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cowfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_crayfish": {
            "name": "mc:fish_grilled_crayfish",
            "result": "mc:fish_grilled_crayfish",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_crayfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_croaker": {
            "name": "mc:fish_grilled_croaker",
            "result": "mc:fish_grilled_croaker",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_croaker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_cuckoo_wrasse": {
            "name": "mc:fish_grilled_cuckoo_wrasse",
            "result": "mc:fish_grilled_cuckoo_wrasse",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cuckoo_wrasse": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_cutthroat_eel": {
            "name": "mc:fish_grilled_cutthroat_eel",
            "result": "mc:fish_grilled_cutthroat_eel",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_cutthroat_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_daggertooth_pike_conger": {
            "name": "mc:fish_grilled_daggertooth_pike_conger",
            "result": "mc:fish_grilled_daggertooth_pike_conger",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_daggertooth_pike_conger": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_dealfish": {
            "name": "mc:fish_grilled_dealfish",
            "result": "mc:fish_grilled_dealfish",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_dealfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_deepwater_cardinalfish": {
            "name": "mc:fish_grilled_deepwater_cardinalfish",
            "result": "mc:fish_grilled_deepwater_cardinalfish",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_deepwater_cardinalfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_demoiselle": {
            "name": "mc:fish_grilled_demoiselle",
            "result": "mc:fish_grilled_demoiselle",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_demoiselle": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_devil_ray": {
            "name": "mc:fish_grilled_devil_ray",
            "result": "mc:fish_grilled_devil_ray",
            "requiredLevel": 214,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_devil_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 660,
            "baseXp": 440
    },
    "fish_grilled_dogfish_shark": {
            "name": "mc:fish_grilled_dogfish_shark",
            "result": "mc:fish_grilled_dogfish_shark",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_dogfish_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_dolphin_fish": {
            "name": "mc:fish_grilled_dolphin_fish",
            "result": "mc:fish_grilled_dolphin_fish",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_dolphin_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_dottyback": {
            "name": "mc:fish_grilled_dottyback",
            "result": "mc:fish_grilled_dottyback",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_dottyback": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_driftfish": {
            "name": "mc:fish_grilled_driftfish",
            "result": "mc:fish_grilled_driftfish",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_driftfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_duckbill_eel": {
            "name": "mc:fish_grilled_duckbill_eel",
            "result": "mc:fish_grilled_duckbill_eel",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_duckbill_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_dwarf_loach": {
            "name": "mc:fish_grilled_dwarf_loach",
            "result": "mc:fish_grilled_dwarf_loach",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_dwarf_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_eel_cod": {
            "name": "mc:fish_grilled_eel_cod",
            "result": "mc:fish_grilled_eel_cod",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_eel_cod": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_elasmobranch": {
            "name": "mc:fish_grilled_elasmobranch",
            "result": "mc:fish_grilled_elasmobranch",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_elasmobranch": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_electric_ray": {
            "name": "mc:fish_grilled_electric_ray",
            "result": "mc:fish_grilled_electric_ray",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_electric_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_ember_parrotfish": {
            "name": "mc:fish_grilled_ember_parrotfish",
            "result": "mc:fish_grilled_ember_parrotfish",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ember_parrotfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_emperor_bream": {
            "name": "mc:fish_grilled_emperor_bream",
            "result": "mc:fish_grilled_emperor_bream",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_emperor_bream": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_european_chub": {
            "name": "mc:fish_grilled_european_chub",
            "result": "mc:fish_grilled_european_chub",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_european_chub": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_european_perch": {
            "name": "mc:fish_grilled_european_perch",
            "result": "mc:fish_grilled_european_perch",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_european_perch": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_false_trevally": {
            "name": "mc:fish_grilled_false_trevally",
            "result": "mc:fish_grilled_false_trevally",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_false_trevally": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_fierasfer": {
            "name": "mc:fish_grilled_fierasfer",
            "result": "mc:fish_grilled_fierasfer",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_fierasfer": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_fire_bar_danio": {
            "name": "mc:fish_grilled_fire_bar_danio",
            "result": "mc:fish_grilled_fire_bar_danio",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_fire_bar_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_flagblenny": {
            "name": "mc:fish_grilled_flagblenny",
            "result": "mc:fish_grilled_flagblenny",
            "requiredLevel": 215,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_flagblenny": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 663,
            "baseXp": 442
    },
    "fish_grilled_flashlight_fish": {
            "name": "mc:fish_grilled_flashlight_fish",
            "result": "mc:fish_grilled_flashlight_fish",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_flashlight_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_flier": {
            "name": "mc:fish_grilled_flier",
            "result": "mc:fish_grilled_flier",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_flier": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_footballfish": {
            "name": "mc:fish_grilled_footballfish",
            "result": "mc:fish_grilled_footballfish",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_footballfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_freshwater_eel": {
            "name": "mc:fish_grilled_freshwater_eel",
            "result": "mc:fish_grilled_freshwater_eel",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_freshwater_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_frigate_mackerel": {
            "name": "mc:fish_grilled_frigate_mackerel",
            "result": "mc:fish_grilled_frigate_mackerel",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_frigate_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_fusilier_fish": {
            "name": "mc:fish_grilled_fusilier_fish",
            "result": "mc:fish_grilled_fusilier_fish",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_fusilier_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_garden_eel": {
            "name": "mc:fish_grilled_garden_eel",
            "result": "mc:fish_grilled_garden_eel",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_garden_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_ghost_flathead": {
            "name": "mc:fish_grilled_ghost_flathead",
            "result": "mc:fish_grilled_ghost_flathead",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ghost_flathead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_ghoul": {
            "name": "mc:fish_grilled_ghoul",
            "result": "mc:fish_grilled_ghoul",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ghoul": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_giant_squid": {
            "name": "mc:fish_grilled_giant_squid",
            "result": "mc:fish_grilled_giant_squid",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_giant_squid": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_glass_catfish": {
            "name": "mc:fish_grilled_glass_catfish",
            "result": "mc:fish_grilled_glass_catfish",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_glass_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_goatfish": {
            "name": "mc:fish_grilled_goatfish",
            "result": "mc:fish_grilled_goatfish",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_goatfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_golden_loach": {
            "name": "mc:fish_grilled_golden_loach",
            "result": "mc:fish_grilled_golden_loach",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_golden_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_goldfish": {
            "name": "mc:fish_grilled_goldfish",
            "result": "mc:fish_grilled_goldfish",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_goldfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_gourami": {
            "name": "mc:fish_grilled_gourami",
            "result": "mc:fish_grilled_gourami",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_gourami": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_gray_reef_shark": {
            "name": "mc:fish_grilled_gray_reef_shark",
            "result": "mc:fish_grilled_gray_reef_shark",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_gray_reef_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_green_swordtail": {
            "name": "mc:fish_grilled_green_swordtail",
            "result": "mc:fish_grilled_green_swordtail",
            "requiredLevel": 216,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_green_swordtail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 666,
            "baseXp": 444
    },
    "fish_grilled_ground_shark": {
            "name": "mc:fish_grilled_ground_shark",
            "result": "mc:fish_grilled_ground_shark",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ground_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_grunt_sculpin": {
            "name": "mc:fish_grilled_grunt_sculpin",
            "result": "mc:fish_grilled_grunt_sculpin",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_grunt_sculpin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_gulf_menhaden": {
            "name": "mc:fish_grilled_gulf_menhaden",
            "result": "mc:fish_grilled_gulf_menhaden",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_gulf_menhaden": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_guppy": {
            "name": "mc:fish_grilled_guppy",
            "result": "mc:fish_grilled_guppy",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_guppy": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_hairtail": {
            "name": "mc:fish_grilled_hairtail",
            "result": "mc:fish_grilled_hairtail",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_hairtail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_halibut": {
            "name": "mc:fish_grilled_halibut",
            "result": "mc:fish_grilled_halibut",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_halibut": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_hammerjaw": {
            "name": "mc:fish_grilled_hammerjaw",
            "result": "mc:fish_grilled_hammerjaw",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_hammerjaw": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_hatchetfish": {
            "name": "mc:fish_grilled_hatchetfish",
            "result": "mc:fish_grilled_hatchetfish",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_hatchetfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_herring_smelt": {
            "name": "mc:fish_grilled_herring_smelt",
            "result": "mc:fish_grilled_herring_smelt",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_herring_smelt": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_hoki": {
            "name": "mc:fish_grilled_hoki",
            "result": "mc:fish_grilled_hoki",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_hoki": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_horseshoe_crab": {
            "name": "mc:fish_grilled_horseshoe_crab",
            "result": "mc:fish_grilled_horseshoe_crab",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_horseshoe_crab": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_hussar": {
            "name": "mc:fish_grilled_hussar",
            "result": "mc:fish_grilled_hussar",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_hussar": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_inanga": {
            "name": "mc:fish_grilled_inanga",
            "result": "mc:fish_grilled_inanga",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_inanga": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_jackfish": {
            "name": "mc:fish_grilled_jackfish",
            "result": "mc:fish_grilled_jackfish",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_jackfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_jellyfish": {
            "name": "mc:fish_grilled_jellyfish",
            "result": "mc:fish_grilled_jellyfish",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_jellyfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_john_dory": {
            "name": "mc:fish_grilled_john_dory",
            "result": "mc:fish_grilled_john_dory",
            "requiredLevel": 217,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_john_dory": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 669,
            "baseXp": 446
    },
    "fish_grilled_knifefish": {
            "name": "mc:fish_grilled_knifefish",
            "result": "mc:fish_grilled_knifefish",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_lamprey": {
            "name": "mc:fish_grilled_lamprey",
            "result": "mc:fish_grilled_lamprey",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_lamprey": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_ling": {
            "name": "mc:fish_grilled_ling",
            "result": "mc:fish_grilled_ling",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ling": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_lobster": {
            "name": "mc:fish_grilled_lobster",
            "result": "mc:fish_grilled_lobster",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_lobster": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_longnose_sucker": {
            "name": "mc:fish_grilled_longnose_sucker",
            "result": "mc:fish_grilled_longnose_sucker",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_longnose_sucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_loweye_catfish": {
            "name": "mc:fish_grilled_loweye_catfish",
            "result": "mc:fish_grilled_loweye_catfish",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_loweye_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_mahi_mahi": {
            "name": "mc:fish_grilled_mahi_mahi",
            "result": "mc:fish_grilled_mahi_mahi",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_mahi_mahi": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_marine_hatchetfish": {
            "name": "mc:fish_grilled_marine_hatchetfish",
            "result": "mc:fish_grilled_marine_hatchetfish",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_marine_hatchetfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_mexican_golden_trout": {
            "name": "mc:fish_grilled_mexican_golden_trout",
            "result": "mc:fish_grilled_mexican_golden_trout",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_mexican_golden_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_moorish_idol": {
            "name": "mc:fish_grilled_moorish_idol",
            "result": "mc:fish_grilled_moorish_idol",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_moorish_idol": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_mudskipper": {
            "name": "mc:fish_grilled_mudskipper",
            "result": "mc:fish_grilled_mudskipper",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_mudskipper": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_muskie": {
            "name": "mc:fish_grilled_muskie",
            "result": "mc:fish_grilled_muskie",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_muskie": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_needlefish": {
            "name": "mc:fish_grilled_needlefish",
            "result": "mc:fish_grilled_needlefish",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_needlefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_octopus": {
            "name": "mc:fish_grilled_octopus",
            "result": "mc:fish_grilled_octopus",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_octopus": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_oscar": {
            "name": "mc:fish_grilled_oscar",
            "result": "mc:fish_grilled_oscar",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_oscar": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_pacific_viperfish": {
            "name": "mc:fish_grilled_pacific_viperfish",
            "result": "mc:fish_grilled_pacific_viperfish",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_pacific_viperfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_parasitic_catfish": {
            "name": "mc:fish_grilled_parasitic_catfish",
            "result": "mc:fish_grilled_parasitic_catfish",
            "requiredLevel": 218,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_parasitic_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 672,
            "baseXp": 448
    },
    "fish_grilled_pencil_catfish": {
            "name": "mc:fish_grilled_pencil_catfish",
            "result": "mc:fish_grilled_pencil_catfish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_pencil_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_pilchard": {
            "name": "mc:fish_grilled_pilchard",
            "result": "mc:fish_grilled_pilchard",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_pilchard": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_pomfret": {
            "name": "mc:fish_grilled_pomfret",
            "result": "mc:fish_grilled_pomfret",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_pomfret": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_remora": {
            "name": "mc:fish_grilled_remora",
            "result": "mc:fish_grilled_remora",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_remora": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_ropefish": {
            "name": "mc:fish_grilled_ropefish",
            "result": "mc:fish_grilled_ropefish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_ropefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_sailfish": {
            "name": "mc:fish_grilled_sailfish",
            "result": "mc:fish_grilled_sailfish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_sailfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_sardine": {
            "name": "mc:fish_grilled_sardine",
            "result": "mc:fish_grilled_sardine",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_sardine": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_scaly_dragonfish": {
            "name": "mc:fish_grilled_scaly_dragonfish",
            "result": "mc:fish_grilled_scaly_dragonfish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_scaly_dragonfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_sea_catfish": {
            "name": "mc:fish_grilled_sea_catfish",
            "result": "mc:fish_grilled_sea_catfish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_sea_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_sea_snail": {
            "name": "mc:fish_grilled_sea_snail",
            "result": "mc:fish_grilled_sea_snail",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_sea_snail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_shortnose_sucker": {
            "name": "mc:fish_grilled_shortnose_sucker",
            "result": "mc:fish_grilled_shortnose_sucker",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_shortnose_sucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_skipjack_tuna": {
            "name": "mc:fish_grilled_skipjack_tuna",
            "result": "mc:fish_grilled_skipjack_tuna",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_skipjack_tuna": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_snake_mackerel": {
            "name": "mc:fish_grilled_snake_mackerel",
            "result": "mc:fish_grilled_snake_mackerel",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_snake_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_sockeye_salmon": {
            "name": "mc:fish_grilled_sockeye_salmon",
            "result": "mc:fish_grilled_sockeye_salmon",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_sockeye_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_spiny_dwarf_catfish": {
            "name": "mc:fish_grilled_spiny_dwarf_catfish",
            "result": "mc:fish_grilled_spiny_dwarf_catfish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_spiny_dwarf_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_sunfish": {
            "name": "mc:fish_grilled_sunfish",
            "result": "mc:fish_grilled_sunfish",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_sunfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_tai": {
            "name": "mc:fish_grilled_tai",
            "result": "mc:fish_grilled_tai",
            "requiredLevel": 219,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_tai": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 675,
            "baseXp": 450
    },
    "fish_grilled_aholehole": {
            "name": "mc:fish_grilled_aholehole",
            "result": "mc:fish_grilled_aholehole",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_aholehole": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_tigerfish": {
            "name": "mc:fish_grilled_tigerfish",
            "result": "mc:fish_grilled_tigerfish",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_tigerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_tripletail": {
            "name": "mc:fish_grilled_tripletail",
            "result": "mc:fish_grilled_tripletail",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_tripletail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_walleye": {
            "name": "mc:fish_grilled_walleye",
            "result": "mc:fish_grilled_walleye",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_walleye": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_wrasse": {
            "name": "mc:fish_grilled_wrasse",
            "result": "mc:fish_grilled_wrasse",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_wrasse": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_yellowtail": {
            "name": "mc:fish_grilled_yellowtail",
            "result": "mc:fish_grilled_yellowtail",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_yellowtail": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_zebra_tilapia": {
            "name": "mc:fish_grilled_zebra_tilapia",
            "result": "mc:fish_grilled_zebra_tilapia",
            "requiredLevel": 220,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:fish_fillet_zebra_tilapia": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 678,
            "baseXp": 452
    },
    "fish_grilled_albacore": {
            "name": "mc:fish_grilled_albacore",
            "result": "mc:fish_grilled_albacore",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_albacore": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_alligator_gar": {
            "name": "mc:fish_grilled_alligator_gar",
            "result": "mc:fish_grilled_alligator_gar",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_alligator_gar": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_amur_pike": {
            "name": "mc:fish_grilled_amur_pike",
            "result": "mc:fish_grilled_amur_pike",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_amur_pike": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_angler": {
            "name": "mc:fish_grilled_angler",
            "result": "mc:fish_grilled_angler",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_angler": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_antarctic_icefish": {
            "name": "mc:fish_grilled_antarctic_icefish",
            "result": "mc:fish_grilled_antarctic_icefish",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_antarctic_icefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_arctic_char": {
            "name": "mc:fish_grilled_arctic_char",
            "result": "mc:fish_grilled_arctic_char",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_arctic_char": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_armorhead_catfish": {
            "name": "mc:fish_grilled_armorhead_catfish",
            "result": "mc:fish_grilled_armorhead_catfish",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_armorhead_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_asian_carp": {
            "name": "mc:fish_grilled_asian_carp",
            "result": "mc:fish_grilled_asian_carp",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_asian_carp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_atlantic_cod": {
            "name": "mc:fish_grilled_atlantic_cod",
            "result": "mc:fish_grilled_atlantic_cod",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_atlantic_cod": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_atlantic_sharpnose_shark": {
            "name": "mc:fish_grilled_atlantic_sharpnose_shark",
            "result": "mc:fish_grilled_atlantic_sharpnose_shark",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_atlantic_sharpnose_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_australian_herring": {
            "name": "mc:fish_grilled_australian_herring",
            "result": "mc:fish_grilled_australian_herring",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_australian_herring": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_baikal_oilfish": {
            "name": "mc:fish_grilled_baikal_oilfish",
            "result": "mc:fish_grilled_baikal_oilfish",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_baikal_oilfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_banded_killifish": {
            "name": "mc:fish_grilled_banded_killifish",
            "result": "mc:fish_grilled_banded_killifish",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_banded_killifish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_banjo_catfish": {
            "name": "mc:fish_grilled_banjo_catfish",
            "result": "mc:fish_grilled_banjo_catfish",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_banjo_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_barbeled_dragonfish": {
            "name": "mc:fish_grilled_barbeled_dragonfish",
            "result": "mc:fish_grilled_barbeled_dragonfish",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_barbeled_dragonfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_barracudina": {
            "name": "mc:fish_grilled_barracudina",
            "result": "mc:fish_grilled_barracudina",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_barracudina": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_basking_shark": {
            "name": "mc:fish_grilled_basking_shark",
            "result": "mc:fish_grilled_basking_shark",
            "requiredLevel": 221,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_basking_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 681,
            "baseXp": 454
    },
    "fish_grilled_batfish": {
            "name": "mc:fish_grilled_batfish",
            "result": "mc:fish_grilled_batfish",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_batfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_beardfish": {
            "name": "mc:fish_grilled_beardfish",
            "result": "mc:fish_grilled_beardfish",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_beardfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bichir": {
            "name": "mc:fish_grilled_bichir",
            "result": "mc:fish_grilled_bichir",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bichir": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bigeye_tuna": {
            "name": "mc:fish_grilled_bigeye_tuna",
            "result": "mc:fish_grilled_bigeye_tuna",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bigeye_tuna": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bigscale_pomfret": {
            "name": "mc:fish_grilled_bigscale_pomfret",
            "result": "mc:fish_grilled_bigscale_pomfret",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bigscale_pomfret": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_black_bass": {
            "name": "mc:fish_grilled_black_bass",
            "result": "mc:fish_grilled_black_bass",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_black_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_black_scabbardfish": {
            "name": "mc:fish_grilled_black_scabbardfish",
            "result": "mc:fish_grilled_black_scabbardfish",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_black_scabbardfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_black_tetra": {
            "name": "mc:fish_grilled_black_tetra",
            "result": "mc:fish_grilled_black_tetra",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_black_tetra": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_blackfish": {
            "name": "mc:fish_grilled_blackfish",
            "result": "mc:fish_grilled_blackfish",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_blackfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_blind_goby": {
            "name": "mc:fish_grilled_blind_goby",
            "result": "mc:fish_grilled_blind_goby",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_blind_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_blue_catfish": {
            "name": "mc:fish_grilled_blue_catfish",
            "result": "mc:fish_grilled_blue_catfish",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_blue_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_blue_redstripe_danio": {
            "name": "mc:fish_grilled_blue_redstripe_danio",
            "result": "mc:fish_grilled_blue_redstripe_danio",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_blue_redstripe_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bluefin_tuna": {
            "name": "mc:fish_grilled_bluefin_tuna",
            "result": "mc:fish_grilled_bluefin_tuna",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bluefin_tuna": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bluntnose_minnow": {
            "name": "mc:fish_grilled_bluntnose_minnow",
            "result": "mc:fish_grilled_bluntnose_minnow",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bluntnose_minnow": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bocaccio": {
            "name": "mc:fish_grilled_bocaccio",
            "result": "mc:fish_grilled_bocaccio",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bocaccio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bonito": {
            "name": "mc:fish_grilled_bonito",
            "result": "mc:fish_grilled_bonito",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bonito": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bonytongue": {
            "name": "mc:fish_grilled_bonytongue",
            "result": "mc:fish_grilled_bonytongue",
            "requiredLevel": 222,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bonytongue": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 684,
            "baseXp": 456
    },
    "fish_grilled_bream": {
            "name": "mc:fish_grilled_bream",
            "result": "mc:fish_grilled_bream",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bream": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_broadband_dogfish": {
            "name": "mc:fish_grilled_broadband_dogfish",
            "result": "mc:fish_grilled_broadband_dogfish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_broadband_dogfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_brook_trout": {
            "name": "mc:fish_grilled_brook_trout",
            "result": "mc:fish_grilled_brook_trout",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_brook_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_bull_shark": {
            "name": "mc:fish_grilled_bull_shark",
            "result": "mc:fish_grilled_bull_shark",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bull_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_bumblebee_goby": {
            "name": "mc:fish_grilled_bumblebee_goby",
            "result": "mc:fish_grilled_bumblebee_goby",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_bumblebee_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_burrowing_goby": {
            "name": "mc:fish_grilled_burrowing_goby",
            "result": "mc:fish_grilled_burrowing_goby",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_burrowing_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_california_flyingfish": {
            "name": "mc:fish_grilled_california_flyingfish",
            "result": "mc:fish_grilled_california_flyingfish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_california_flyingfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_candlefish": {
            "name": "mc:fish_grilled_candlefish",
            "result": "mc:fish_grilled_candlefish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_candlefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_carp": {
            "name": "mc:fish_grilled_carp",
            "result": "mc:fish_grilled_carp",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_carp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_catalufa": {
            "name": "mc:fish_grilled_catalufa",
            "result": "mc:fish_grilled_catalufa",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_catalufa": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_celebes_rainbowfish": {
            "name": "mc:fish_grilled_celebes_rainbowfish",
            "result": "mc:fish_grilled_celebes_rainbowfish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_celebes_rainbowfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_channel_catfish": {
            "name": "mc:fish_grilled_channel_catfish",
            "result": "mc:fish_grilled_channel_catfish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_channel_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_cherubfish": {
            "name": "mc:fish_grilled_cherubfish",
            "result": "mc:fish_grilled_cherubfish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_cherubfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_chubsucker": {
            "name": "mc:fish_grilled_chubsucker",
            "result": "mc:fish_grilled_chubsucker",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_chubsucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_clam": {
            "name": "mc:fish_grilled_clam",
            "result": "mc:fish_grilled_clam",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_clam": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_clingfish": {
            "name": "mc:fish_grilled_clingfish",
            "result": "mc:fish_grilled_clingfish",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_clingfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_cobbler": {
            "name": "mc:fish_grilled_cobbler",
            "result": "mc:fish_grilled_cobbler",
            "requiredLevel": 223,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_cobbler": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 687,
            "baseXp": 458
    },
    "fish_grilled_coelacanth": {
            "name": "mc:fish_grilled_coelacanth",
            "result": "mc:fish_grilled_coelacanth",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_coelacanth": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_collared_carpetshark": {
            "name": "mc:fish_grilled_collared_carpetshark",
            "result": "mc:fish_grilled_collared_carpetshark",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_collared_carpetshark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_combtail_gourami": {
            "name": "mc:fish_grilled_combtail_gourami",
            "result": "mc:fish_grilled_combtail_gourami",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_combtail_gourami": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_conger_eel": {
            "name": "mc:fish_grilled_conger_eel",
            "result": "mc:fish_grilled_conger_eel",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_conger_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_coolie_loach": {
            "name": "mc:fish_grilled_coolie_loach",
            "result": "mc:fish_grilled_coolie_loach",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_coolie_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_cownose_ray": {
            "name": "mc:fish_grilled_cownose_ray",
            "result": "mc:fish_grilled_cownose_ray",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_cownose_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_creek_chub": {
            "name": "mc:fish_grilled_creek_chub",
            "result": "mc:fish_grilled_creek_chub",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_creek_chub": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_crocodile_icefish": {
            "name": "mc:fish_grilled_crocodile_icefish",
            "result": "mc:fish_grilled_crocodile_icefish",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_crocodile_icefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_cusk": {
            "name": "mc:fish_grilled_cusk",
            "result": "mc:fish_grilled_cusk",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_cusk": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_cutthroat_trout": {
            "name": "mc:fish_grilled_cutthroat_trout",
            "result": "mc:fish_grilled_cutthroat_trout",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_cutthroat_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_damselfish": {
            "name": "mc:fish_grilled_damselfish",
            "result": "mc:fish_grilled_damselfish",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_damselfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_death_valley_pupfish": {
            "name": "mc:fish_grilled_death_valley_pupfish",
            "result": "mc:fish_grilled_death_valley_pupfish",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_death_valley_pupfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_deepwater_flathead": {
            "name": "mc:fish_grilled_deepwater_flathead",
            "result": "mc:fish_grilled_deepwater_flathead",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_deepwater_flathead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_denticle_herring": {
            "name": "mc:fish_grilled_denticle_herring",
            "result": "mc:fish_grilled_denticle_herring",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_denticle_herring": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_dhufish": {
            "name": "mc:fish_grilled_dhufish",
            "result": "mc:fish_grilled_dhufish",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_dhufish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_dogteeth_tetra": {
            "name": "mc:fish_grilled_dogteeth_tetra",
            "result": "mc:fish_grilled_dogteeth_tetra",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_dogteeth_tetra": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_dorab_wolf_herring": {
            "name": "mc:fish_grilled_dorab_wolf_herring",
            "result": "mc:fish_grilled_dorab_wolf_herring",
            "requiredLevel": 224,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_dorab_wolf_herring": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 690,
            "baseXp": 460
    },
    "fish_grilled_dragon_goby": {
            "name": "mc:fish_grilled_dragon_goby",
            "result": "mc:fish_grilled_dragon_goby",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_dragon_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_driftwood_catfish": {
            "name": "mc:fish_grilled_driftwood_catfish",
            "result": "mc:fish_grilled_driftwood_catfish",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_driftwood_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_dusky_grouper": {
            "name": "mc:fish_grilled_dusky_grouper",
            "result": "mc:fish_grilled_dusky_grouper",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_dusky_grouper": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_eagle_ray": {
            "name": "mc:fish_grilled_eagle_ray",
            "result": "mc:fish_grilled_eagle_ray",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_eagle_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_eel_goby": {
            "name": "mc:fish_grilled_eel_goby",
            "result": "mc:fish_grilled_eel_goby",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_eel_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_electric_catfish": {
            "name": "mc:fish_grilled_electric_catfish",
            "result": "mc:fish_grilled_electric_catfish",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_electric_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_elephant_fish": {
            "name": "mc:fish_grilled_elephant_fish",
            "result": "mc:fish_grilled_elephant_fish",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_elephant_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_emerald_catfish": {
            "name": "mc:fish_grilled_emerald_catfish",
            "result": "mc:fish_grilled_emerald_catfish",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_emerald_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_escolar": {
            "name": "mc:fish_grilled_escolar",
            "result": "mc:fish_grilled_escolar",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_escolar": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_european_eel": {
            "name": "mc:fish_grilled_european_eel",
            "result": "mc:fish_grilled_european_eel",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_european_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_false_brotula": {
            "name": "mc:fish_grilled_false_brotula",
            "result": "mc:fish_grilled_false_brotula",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_false_brotula": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_fangtooth": {
            "name": "mc:fish_grilled_fangtooth",
            "result": "mc:fish_grilled_fangtooth",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_fangtooth": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_filefish": {
            "name": "mc:fish_grilled_filefish",
            "result": "mc:fish_grilled_filefish",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_filefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_fire_goby": {
            "name": "mc:fish_grilled_fire_goby",
            "result": "mc:fish_grilled_fire_goby",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_fire_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_flagfin": {
            "name": "mc:fish_grilled_flagfin",
            "result": "mc:fish_grilled_flagfin",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_flagfin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_flatfish": {
            "name": "mc:fish_grilled_flatfish",
            "result": "mc:fish_grilled_flatfish",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_flatfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_flounder": {
            "name": "mc:fish_grilled_flounder",
            "result": "mc:fish_grilled_flounder",
            "requiredLevel": 225,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_flounder": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 693,
            "baseXp": 462
    },
    "fish_grilled_forehead_brooder": {
            "name": "mc:fish_grilled_forehead_brooder",
            "result": "mc:fish_grilled_forehead_brooder",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_forehead_brooder": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_freshwater_goby": {
            "name": "mc:fish_grilled_freshwater_goby",
            "result": "mc:fish_grilled_freshwater_goby",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_freshwater_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_frilled_shark": {
            "name": "mc:fish_grilled_frilled_shark",
            "result": "mc:fish_grilled_frilled_shark",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_frilled_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_galjoen_fish": {
            "name": "mc:fish_grilled_galjoen_fish",
            "result": "mc:fish_grilled_galjoen_fish",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_galjoen_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_garibaldi": {
            "name": "mc:fish_grilled_garibaldi",
            "result": "mc:fish_grilled_garibaldi",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_garibaldi": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_ghost_knifefish": {
            "name": "mc:fish_grilled_ghost_knifefish",
            "result": "mc:fish_grilled_ghost_knifefish",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_ghost_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_giant_danio": {
            "name": "mc:fish_grilled_giant_danio",
            "result": "mc:fish_grilled_giant_danio",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_giant_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_gibberfish": {
            "name": "mc:fish_grilled_gibberfish",
            "result": "mc:fish_grilled_gibberfish",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_gibberfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_glass_knifefish": {
            "name": "mc:fish_grilled_glass_knifefish",
            "result": "mc:fish_grilled_glass_knifefish",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_glass_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_goblin_shark": {
            "name": "mc:fish_grilled_goblin_shark",
            "result": "mc:fish_grilled_goblin_shark",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_goblin_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_golden_shiner": {
            "name": "mc:fish_grilled_golden_shiner",
            "result": "mc:fish_grilled_golden_shiner",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_golden_shiner": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_gombessa": {
            "name": "mc:fish_grilled_gombessa",
            "result": "mc:fish_grilled_gombessa",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_gombessa": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_grass_carp": {
            "name": "mc:fish_grilled_grass_carp",
            "result": "mc:fish_grilled_grass_carp",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_grass_carp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_grayling": {
            "name": "mc:fish_grilled_grayling",
            "result": "mc:fish_grilled_grayling",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_grayling": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_greeneye": {
            "name": "mc:fish_grilled_greeneye",
            "result": "mc:fish_grilled_greeneye",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_greeneye": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_grouper": {
            "name": "mc:fish_grilled_grouper",
            "result": "mc:fish_grilled_grouper",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_grouper": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_grunter": {
            "name": "mc:fish_grilled_grunter",
            "result": "mc:fish_grilled_grunter",
            "requiredLevel": 226,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_grunter": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 696,
            "baseXp": 464
    },
    "fish_grilled_gulper": {
            "name": "mc:fish_grilled_gulper",
            "result": "mc:fish_grilled_gulper",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_gulper": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_gurnard": {
            "name": "mc:fish_grilled_gurnard",
            "result": "mc:fish_grilled_gurnard",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_gurnard": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_hake": {
            "name": "mc:fish_grilled_hake",
            "result": "mc:fish_grilled_hake",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_hake": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_halosaur": {
            "name": "mc:fish_grilled_halosaur",
            "result": "mc:fish_grilled_halosaur",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_halosaur": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_handfish": {
            "name": "mc:fish_grilled_handfish",
            "result": "mc:fish_grilled_handfish",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_handfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_hawkfish": {
            "name": "mc:fish_grilled_hawkfish",
            "result": "mc:fish_grilled_hawkfish",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_hawkfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_hickory_shad": {
            "name": "mc:fish_grilled_hickory_shad",
            "result": "mc:fish_grilled_hickory_shad",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_hickory_shad": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_horn_shark": {
            "name": "mc:fish_grilled_horn_shark",
            "result": "mc:fish_grilled_horn_shark",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_horn_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_houndshark": {
            "name": "mc:fish_grilled_houndshark",
            "result": "mc:fish_grilled_houndshark",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_houndshark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_icefish": {
            "name": "mc:fish_grilled_icefish",
            "result": "mc:fish_grilled_icefish",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_icefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_inconnu": {
            "name": "mc:fish_grilled_inconnu",
            "result": "mc:fish_grilled_inconnu",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_inconnu": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_japanese_eel": {
            "name": "mc:fish_grilled_japanese_eel",
            "result": "mc:fish_grilled_japanese_eel",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_japanese_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_jellynose_fish": {
            "name": "mc:fish_grilled_jellynose_fish",
            "result": "mc:fish_grilled_jellynose_fish",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_jellynose_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_king_of_the_salmon": {
            "name": "mc:fish_grilled_king_of_the_salmon",
            "result": "mc:fish_grilled_king_of_the_salmon",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_king_of_the_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_koi": {
            "name": "mc:fish_grilled_koi",
            "result": "mc:fish_grilled_koi",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_koi": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_lanternfish": {
            "name": "mc:fish_grilled_lanternfish",
            "result": "mc:fish_grilled_lanternfish",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_lanternfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_lionfish": {
            "name": "mc:fish_grilled_lionfish",
            "result": "mc:fish_grilled_lionfish",
            "requiredLevel": 227,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_lionfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 699,
            "baseXp": 466
    },
    "fish_grilled_long_finned_char": {
            "name": "mc:fish_grilled_long_finned_char",
            "result": "mc:fish_grilled_long_finned_char",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_long_finned_char": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_longnose_whiptail_catfish": {
            "name": "mc:fish_grilled_longnose_whiptail_catfish",
            "result": "mc:fish_grilled_longnose_whiptail_catfish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_longnose_whiptail_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_lungfish": {
            "name": "mc:fish_grilled_lungfish",
            "result": "mc:fish_grilled_lungfish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_lungfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_manefish": {
            "name": "mc:fish_grilled_manefish",
            "result": "mc:fish_grilled_manefish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_manefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_marlin": {
            "name": "mc:fish_grilled_marlin",
            "result": "mc:fish_grilled_marlin",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_marlin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_milkfish": {
            "name": "mc:fish_grilled_milkfish",
            "result": "mc:fish_grilled_milkfish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_milkfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_moray_eel": {
            "name": "mc:fish_grilled_moray_eel",
            "result": "mc:fish_grilled_moray_eel",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_moray_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_mullet": {
            "name": "mc:fish_grilled_mullet",
            "result": "mc:fish_grilled_mullet",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_mullet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_mussel": {
            "name": "mc:fish_grilled_mussel",
            "result": "mc:fish_grilled_mussel",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_mussel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_new_world_rivuline": {
            "name": "mc:fish_grilled_new_world_rivuline",
            "result": "mc:fish_grilled_new_world_rivuline",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_new_world_rivuline": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_oilfish": {
            "name": "mc:fish_grilled_oilfish",
            "result": "mc:fish_grilled_oilfish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_oilfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_oyster": {
            "name": "mc:fish_grilled_oyster",
            "result": "mc:fish_grilled_oyster",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_oyster": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_paddlefish": {
            "name": "mc:fish_grilled_paddlefish",
            "result": "mc:fish_grilled_paddlefish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_paddlefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_parrotfish": {
            "name": "mc:fish_grilled_parrotfish",
            "result": "mc:fish_grilled_parrotfish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_parrotfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_peppered_corydoras": {
            "name": "mc:fish_grilled_peppered_corydoras",
            "result": "mc:fish_grilled_peppered_corydoras",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_peppered_corydoras": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_piranha": {
            "name": "mc:fish_grilled_piranha",
            "result": "mc:fish_grilled_piranha",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_piranha": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_pupfish": {
            "name": "mc:fish_grilled_pupfish",
            "result": "mc:fish_grilled_pupfish",
            "requiredLevel": 228,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_pupfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 702,
            "baseXp": 468
    },
    "fish_grilled_roach": {
            "name": "mc:fish_grilled_roach",
            "result": "mc:fish_grilled_roach",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_roach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_rudd": {
            "name": "mc:fish_grilled_rudd",
            "result": "mc:fish_grilled_rudd",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_rudd": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_sand_knifefish": {
            "name": "mc:fish_grilled_sand_knifefish",
            "result": "mc:fish_grilled_sand_knifefish",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_sand_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_saury": {
            "name": "mc:fish_grilled_saury",
            "result": "mc:fish_grilled_saury",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_saury": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_scat": {
            "name": "mc:fish_grilled_scat",
            "result": "mc:fish_grilled_scat",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_scat": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_sea_​​cucumber": {
            "name": "mc:fish_grilled_sea_​​cucumber",
            "result": "mc:fish_grilled_sea_​​cucumber",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_sea_​​cucumber": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_sea_urchin": {
            "name": "mc:fish_grilled_sea_urchin",
            "result": "mc:fish_grilled_sea_urchin",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_sea_urchin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_shovelnose_sturgeon": {
            "name": "mc:fish_grilled_shovelnose_sturgeon",
            "result": "mc:fish_grilled_shovelnose_sturgeon",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_shovelnose_sturgeon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_slickhead": {
            "name": "mc:fish_grilled_slickhead",
            "result": "mc:fish_grilled_slickhead",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_slickhead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_snakehead": {
            "name": "mc:fish_grilled_snakehead",
            "result": "mc:fish_grilled_snakehead",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_snakehead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_south_american_lungfish": {
            "name": "mc:fish_grilled_south_american_lungfish",
            "result": "mc:fish_grilled_south_american_lungfish",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_south_american_lungfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_starfish": {
            "name": "mc:fish_grilled_starfish",
            "result": "mc:fish_grilled_starfish",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_starfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_surgeonfish": {
            "name": "mc:fish_grilled_surgeonfish",
            "result": "mc:fish_grilled_surgeonfish",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_surgeonfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_tarpon": {
            "name": "mc:fish_grilled_tarpon",
            "result": "mc:fish_grilled_tarpon",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_tarpon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_tilapia": {
            "name": "mc:fish_grilled_tilapia",
            "result": "mc:fish_grilled_tilapia",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_tilapia": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_tuna": {
            "name": "mc:fish_grilled_tuna",
            "result": "mc:fish_grilled_tuna",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_tuna": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_warty_angler": {
            "name": "mc:fish_grilled_warty_angler",
            "result": "mc:fish_grilled_warty_angler",
            "requiredLevel": 229,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_warty_angler": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 705,
            "baseXp": 470
    },
    "fish_grilled_airbreathing_catfish": {
            "name": "mc:fish_grilled_airbreathing_catfish",
            "result": "mc:fish_grilled_airbreathing_catfish",
            "requiredLevel": 230,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_airbreathing_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 708,
            "baseXp": 472
    },
    "fish_grilled_alewife": {
            "name": "mc:fish_grilled_alewife",
            "result": "mc:fish_grilled_alewife",
            "requiredLevel": 230,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_alewife": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 708,
            "baseXp": 472
    },
    "fish_grilled_alligatorfish": {
            "name": "mc:fish_grilled_alligatorfish",
            "result": "mc:fish_grilled_alligatorfish",
            "requiredLevel": 230,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_alligatorfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 708,
            "baseXp": 472
    },
    "fish_grilled_anchovy": {
            "name": "mc:fish_grilled_anchovy",
            "result": "mc:fish_grilled_anchovy",
            "requiredLevel": 230,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_anchovy": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 708,
            "baseXp": 472
    },
    "fish_grilled_yamame_trout": {
            "name": "mc:fish_grilled_yamame_trout",
            "result": "mc:fish_grilled_yamame_trout",
            "requiredLevel": 230,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_yamame_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 708,
            "baseXp": 472
    },
    "fish_grilled_yellowtail_amberjack": {
            "name": "mc:fish_grilled_yellowtail_amberjack",
            "result": "mc:fish_grilled_yellowtail_amberjack",
            "requiredLevel": 230,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:fish_fillet_yellowtail_amberjack": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 708,
            "baseXp": 472
    },
    "fish_grilled_angler_catfish": {
            "name": "mc:fish_grilled_angler_catfish",
            "result": "mc:fish_grilled_angler_catfish",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_angler_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_antenna_codlet": {
            "name": "mc:fish_grilled_antenna_codlet",
            "result": "mc:fish_grilled_antenna_codlet",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_antenna_codlet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_armored_gurnard": {
            "name": "mc:fish_grilled_armored_gurnard",
            "result": "mc:fish_grilled_armored_gurnard",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_armored_gurnard": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_armoured_catfish": {
            "name": "mc:fish_grilled_armoured_catfish",
            "result": "mc:fish_grilled_armoured_catfish",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_armoured_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_asiatic_glassfish": {
            "name": "mc:fish_grilled_asiatic_glassfish",
            "result": "mc:fish_grilled_asiatic_glassfish",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_asiatic_glassfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_atlantic_herring": {
            "name": "mc:fish_grilled_atlantic_herring",
            "result": "mc:fish_grilled_atlantic_herring",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_atlantic_herring": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_atlantic_silverside": {
            "name": "mc:fish_grilled_atlantic_silverside",
            "result": "mc:fish_grilled_atlantic_silverside",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_atlantic_silverside": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_australian_lungfish": {
            "name": "mc:fish_grilled_australian_lungfish",
            "result": "mc:fish_grilled_australian_lungfish",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_australian_lungfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_bala_shark": {
            "name": "mc:fish_grilled_bala_shark",
            "result": "mc:fish_grilled_bala_shark",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bala_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_bandfish": {
            "name": "mc:fish_grilled_bandfish",
            "result": "mc:fish_grilled_bandfish",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bandfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_barb": {
            "name": "mc:fish_grilled_barb",
            "result": "mc:fish_grilled_barb",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_barb": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_barbeled_houndshark": {
            "name": "mc:fish_grilled_barbeled_houndshark",
            "result": "mc:fish_grilled_barbeled_houndshark",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_barbeled_houndshark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_barramundi": {
            "name": "mc:fish_grilled_barramundi",
            "result": "mc:fish_grilled_barramundi",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_barramundi": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_bass": {
            "name": "mc:fish_grilled_bass",
            "result": "mc:fish_grilled_bass",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bass": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_beachsalmon": {
            "name": "mc:fish_grilled_beachsalmon",
            "result": "mc:fish_grilled_beachsalmon",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_beachsalmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_beluga_sturgeon": {
            "name": "mc:fish_grilled_beluga_sturgeon",
            "result": "mc:fish_grilled_beluga_sturgeon",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_beluga_sturgeon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_bicolor_goat_fish": {
            "name": "mc:fish_grilled_bicolor_goat_fish",
            "result": "mc:fish_grilled_bicolor_goat_fish",
            "requiredLevel": 231,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bicolor_goat_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 711,
            "baseXp": 474
    },
    "fish_grilled_bighead_carp": {
            "name": "mc:fish_grilled_bighead_carp",
            "result": "mc:fish_grilled_bighead_carp",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bighead_carp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_billfish": {
            "name": "mc:fish_grilled_billfish",
            "result": "mc:fish_grilled_billfish",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_billfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_black_dragonfish": {
            "name": "mc:fish_grilled_black_dragonfish",
            "result": "mc:fish_grilled_black_dragonfish",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_black_dragonfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_black_scalyfin": {
            "name": "mc:fish_grilled_black_scalyfin",
            "result": "mc:fish_grilled_black_scalyfin",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_black_scalyfin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_black_triggerfish": {
            "name": "mc:fish_grilled_black_triggerfish",
            "result": "mc:fish_grilled_black_triggerfish",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_black_triggerfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_blacktip_reef_shark": {
            "name": "mc:fish_grilled_blacktip_reef_shark",
            "result": "mc:fish_grilled_blacktip_reef_shark",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_blacktip_reef_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_blind_shark": {
            "name": "mc:fish_grilled_blind_shark",
            "result": "mc:fish_grilled_blind_shark",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_blind_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_blue_danio": {
            "name": "mc:fish_grilled_blue_danio",
            "result": "mc:fish_grilled_blue_danio",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_blue_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_blue_shark": {
            "name": "mc:fish_grilled_blue_shark",
            "result": "mc:fish_grilled_blue_shark",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_blue_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_bluefish": {
            "name": "mc:fish_grilled_bluefish",
            "result": "mc:fish_grilled_bluefish",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bluefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_boafish": {
            "name": "mc:fish_grilled_boafish",
            "result": "mc:fish_grilled_boafish",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_boafish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_boga": {
            "name": "mc:fish_grilled_boga",
            "result": "mc:fish_grilled_boga",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_boga": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_bonnethead_shark": {
            "name": "mc:fish_grilled_bonnethead_shark",
            "result": "mc:fish_grilled_bonnethead_shark",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bonnethead_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_bowfin": {
            "name": "mc:fish_grilled_bowfin",
            "result": "mc:fish_grilled_bowfin",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bowfin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_brill": {
            "name": "mc:fish_grilled_brill",
            "result": "mc:fish_grilled_brill",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_brill": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_bronze_corydoras": {
            "name": "mc:fish_grilled_bronze_corydoras",
            "result": "mc:fish_grilled_bronze_corydoras",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bronze_corydoras": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_brotula": {
            "name": "mc:fish_grilled_brotula",
            "result": "mc:fish_grilled_brotula",
            "requiredLevel": 232,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_brotula": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 714,
            "baseXp": 476
    },
    "fish_grilled_bull_trout": {
            "name": "mc:fish_grilled_bull_trout",
            "result": "mc:fish_grilled_bull_trout",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_bull_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_burbot": {
            "name": "mc:fish_grilled_burbot",
            "result": "mc:fish_grilled_burbot",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_burbot": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_butterfish": {
            "name": "mc:fish_grilled_butterfish",
            "result": "mc:fish_grilled_butterfish",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_butterfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_california_halibut": {
            "name": "mc:fish_grilled_california_halibut",
            "result": "mc:fish_grilled_california_halibut",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_california_halibut": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_capelin": {
            "name": "mc:fish_grilled_capelin",
            "result": "mc:fish_grilled_capelin",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_capelin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_carpetshark": {
            "name": "mc:fish_grilled_carpetshark",
            "result": "mc:fish_grilled_carpetshark",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_carpetshark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_catfish": {
            "name": "mc:fish_grilled_catfish",
            "result": "mc:fish_grilled_catfish",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_central_mudminnow": {
            "name": "mc:fish_grilled_central_mudminnow",
            "result": "mc:fish_grilled_central_mudminnow",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_central_mudminnow": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_char": {
            "name": "mc:fish_grilled_char",
            "result": "mc:fish_grilled_char",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_char": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_chimaera": {
            "name": "mc:fish_grilled_chimaera",
            "result": "mc:fish_grilled_chimaera",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_chimaera": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_chum_salmon": {
            "name": "mc:fish_grilled_chum_salmon",
            "result": "mc:fish_grilled_chum_salmon",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_chum_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_climbing_catfish": {
            "name": "mc:fish_grilled_climbing_catfish",
            "result": "mc:fish_grilled_climbing_catfish",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_climbing_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_clown_loach": {
            "name": "mc:fish_grilled_clown_loach",
            "result": "mc:fish_grilled_clown_loach",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_clown_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_cobia": {
            "name": "mc:fish_grilled_cobia",
            "result": "mc:fish_grilled_cobia",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_cobia": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_coffinfish": {
            "name": "mc:fish_grilled_coffinfish",
            "result": "mc:fish_grilled_coffinfish",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_coffinfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_collared_dogfish": {
            "name": "mc:fish_grilled_collared_dogfish",
            "result": "mc:fish_grilled_collared_dogfish",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_collared_dogfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_combtooth_blenny": {
            "name": "mc:fish_grilled_combtooth_blenny",
            "result": "mc:fish_grilled_combtooth_blenny",
            "requiredLevel": 233,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_combtooth_blenny": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 717,
            "baseXp": 478
    },
    "fish_grilled_convict_blenny": {
            "name": "mc:fish_grilled_convict_blenny",
            "result": "mc:fish_grilled_convict_blenny",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_convict_blenny": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_cornetfish": {
            "name": "mc:fish_grilled_cornetfish",
            "result": "mc:fish_grilled_cornetfish",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_cornetfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_crab": {
            "name": "mc:fish_grilled_crab",
            "result": "mc:fish_grilled_crab",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_crab": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_crestfish": {
            "name": "mc:fish_grilled_crestfish",
            "result": "mc:fish_grilled_crestfish",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_crestfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_crocodile_shark": {
            "name": "mc:fish_grilled_crocodile_shark",
            "result": "mc:fish_grilled_crocodile_shark",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_crocodile_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_cusk_eel": {
            "name": "mc:fish_grilled_cusk_eel",
            "result": "mc:fish_grilled_cusk_eel",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_cusk_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_dab": {
            "name": "mc:fish_grilled_dab",
            "result": "mc:fish_grilled_dab",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_dab": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_danio": {
            "name": "mc:fish_grilled_danio",
            "result": "mc:fish_grilled_danio",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_danio": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_deep_sea_eel": {
            "name": "mc:fish_grilled_deep_sea_eel",
            "result": "mc:fish_grilled_deep_sea_eel",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_deep_sea_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_deepwater_stingray": {
            "name": "mc:fish_grilled_deepwater_stingray",
            "result": "mc:fish_grilled_deepwater_stingray",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_deepwater_stingray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_desert_pupfish": {
            "name": "mc:fish_grilled_desert_pupfish",
            "result": "mc:fish_grilled_desert_pupfish",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_desert_pupfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_discus": {
            "name": "mc:fish_grilled_discus",
            "result": "mc:fish_grilled_discus",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_discus": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_dojo_loach": {
            "name": "mc:fish_grilled_dojo_loach",
            "result": "mc:fish_grilled_dojo_loach",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_dojo_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_dorado": {
            "name": "mc:fish_grilled_dorado",
            "result": "mc:fish_grilled_dorado",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_dorado": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_dragonet": {
            "name": "mc:fish_grilled_dragonet",
            "result": "mc:fish_grilled_dragonet",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_dragonet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_drum": {
            "name": "mc:fish_grilled_drum",
            "result": "mc:fish_grilled_drum",
            "requiredLevel": 234,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_drum": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 720,
            "baseXp": 480
    },
    "fish_grilled_dusky_shark": {
            "name": "mc:fish_grilled_dusky_shark",
            "result": "mc:fish_grilled_dusky_shark",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_dusky_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_earthworm_eel": {
            "name": "mc:fish_grilled_earthworm_eel",
            "result": "mc:fish_grilled_earthworm_eel",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_earthworm_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_eelpout": {
            "name": "mc:fish_grilled_eelpout",
            "result": "mc:fish_grilled_eelpout",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_eelpout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_electric_eel": {
            "name": "mc:fish_grilled_electric_eel",
            "result": "mc:fish_grilled_electric_eel",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_electric_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_elephantnose_fish": {
            "name": "mc:fish_grilled_elephantnose_fish",
            "result": "mc:fish_grilled_elephantnose_fish",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_elephantnose_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_emperor": {
            "name": "mc:fish_grilled_emperor",
            "result": "mc:fish_grilled_emperor",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_emperor": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_eucla_cod": {
            "name": "mc:fish_grilled_eucla_cod",
            "result": "mc:fish_grilled_eucla_cod",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_eucla_cod": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_european_flounder": {
            "name": "mc:fish_grilled_european_flounder",
            "result": "mc:fish_grilled_european_flounder",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_european_flounder": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_false_cat_shark": {
            "name": "mc:fish_grilled_false_cat_shark",
            "result": "mc:fish_grilled_false_cat_shark",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_false_cat_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_fathead_sculpin": {
            "name": "mc:fish_grilled_fathead_sculpin",
            "result": "mc:fish_grilled_fathead_sculpin",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_fathead_sculpin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_finback_cat_shark": {
            "name": "mc:fish_grilled_finback_cat_shark",
            "result": "mc:fish_grilled_finback_cat_shark",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_finback_cat_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_firefish": {
            "name": "mc:fish_grilled_firefish",
            "result": "mc:fish_grilled_firefish",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_firefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_flagfish": {
            "name": "mc:fish_grilled_flagfish",
            "result": "mc:fish_grilled_flagfish",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_flagfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_flathead": {
            "name": "mc:fish_grilled_flathead",
            "result": "mc:fish_grilled_flathead",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_flathead": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_flying_fish": {
            "name": "mc:fish_grilled_flying_fish",
            "result": "mc:fish_grilled_flying_fish",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_flying_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_four_eyed_fish": {
            "name": "mc:fish_grilled_four_eyed_fish",
            "result": "mc:fish_grilled_four_eyed_fish",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_four_eyed_fish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_freshwater_hatchetfish": {
            "name": "mc:fish_grilled_freshwater_hatchetfish",
            "result": "mc:fish_grilled_freshwater_hatchetfish",
            "requiredLevel": 235,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_freshwater_hatchetfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 723,
            "baseXp": 482
    },
    "fish_grilled_frogfish": {
            "name": "mc:fish_grilled_frogfish",
            "result": "mc:fish_grilled_frogfish",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_frogfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_ganges_shark": {
            "name": "mc:fish_grilled_ganges_shark",
            "result": "mc:fish_grilled_ganges_shark",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_ganges_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_garpike": {
            "name": "mc:fish_grilled_garpike",
            "result": "mc:fish_grilled_garpike",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_garpike": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_ghost_pipefish": {
            "name": "mc:fish_grilled_ghost_pipefish",
            "result": "mc:fish_grilled_ghost_pipefish",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_ghost_pipefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_giant_gourami": {
            "name": "mc:fish_grilled_giant_gourami",
            "result": "mc:fish_grilled_giant_gourami",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_giant_gourami": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_gila_trout": {
            "name": "mc:fish_grilled_gila_trout",
            "result": "mc:fish_grilled_gila_trout",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_gila_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_glassfish": {
            "name": "mc:fish_grilled_glassfish",
            "result": "mc:fish_grilled_glassfish",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_glassfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_goby": {
            "name": "mc:fish_grilled_goby",
            "result": "mc:fish_grilled_goby",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_goby": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_golden_trout": {
            "name": "mc:fish_grilled_golden_trout",
            "result": "mc:fish_grilled_golden_trout",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_golden_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_goosefish": {
            "name": "mc:fish_grilled_goosefish",
            "result": "mc:fish_grilled_goosefish",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_goosefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_graveldiver": {
            "name": "mc:fish_grilled_graveldiver",
            "result": "mc:fish_grilled_graveldiver",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_graveldiver": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_great_white_shark": {
            "name": "mc:fish_grilled_great_white_shark",
            "result": "mc:fish_grilled_great_white_shark",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_great_white_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_greenling": {
            "name": "mc:fish_grilled_greenling",
            "result": "mc:fish_grilled_greenling",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_greenling": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_grunion": {
            "name": "mc:fish_grilled_grunion",
            "result": "mc:fish_grilled_grunion",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_grunion": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_gudgeon": {
            "name": "mc:fish_grilled_gudgeon",
            "result": "mc:fish_grilled_gudgeon",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_gudgeon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_gulper_eel": {
            "name": "mc:fish_grilled_gulper_eel",
            "result": "mc:fish_grilled_gulper_eel",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_gulper_eel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_haddock": {
            "name": "mc:fish_grilled_haddock",
            "result": "mc:fish_grilled_haddock",
            "requiredLevel": 236,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_haddock": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 726,
            "baseXp": 484
    },
    "fish_grilled_halfbeak": {
            "name": "mc:fish_grilled_halfbeak",
            "result": "mc:fish_grilled_halfbeak",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_halfbeak": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_hamlet": {
            "name": "mc:fish_grilled_hamlet",
            "result": "mc:fish_grilled_hamlet",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_hamlet": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_hardhead_catfish": {
            "name": "mc:fish_grilled_hardhead_catfish",
            "result": "mc:fish_grilled_hardhead_catfish",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_hardhead_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_hermit_crab": {
            "name": "mc:fish_grilled_hermit_crab",
            "result": "mc:fish_grilled_hermit_crab",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_hermit_crab": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_hillstream_loach": {
            "name": "mc:fish_grilled_hillstream_loach",
            "result": "mc:fish_grilled_hillstream_loach",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_hillstream_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_horse_mackerel": {
            "name": "mc:fish_grilled_horse_mackerel",
            "result": "mc:fish_grilled_horse_mackerel",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_horse_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_huchen": {
            "name": "mc:fish_grilled_huchen",
            "result": "mc:fish_grilled_huchen",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_huchen": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_ide": {
            "name": "mc:fish_grilled_ide",
            "result": "mc:fish_grilled_ide",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_ide": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_jack": {
            "name": "mc:fish_grilled_jack",
            "result": "mc:fish_grilled_jack",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_jack": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_javelin": {
            "name": "mc:fish_grilled_javelin",
            "result": "mc:fish_grilled_javelin",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_javelin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_jewel_tetra": {
            "name": "mc:fish_grilled_jewel_tetra",
            "result": "mc:fish_grilled_jewel_tetra",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_jewel_tetra": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_king_salmon": {
            "name": "mc:fish_grilled_king_salmon",
            "result": "mc:fish_grilled_king_salmon",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_king_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_lake_trout": {
            "name": "mc:fish_grilled_lake_trout",
            "result": "mc:fish_grilled_lake_trout",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_lake_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_leaffish": {
            "name": "mc:fish_grilled_leaffish",
            "result": "mc:fish_grilled_leaffish",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_leaffish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_loach": {
            "name": "mc:fish_grilled_loach",
            "result": "mc:fish_grilled_loach",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_loach": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_long_whiskered_catfish": {
            "name": "mc:fish_grilled_long_whiskered_catfish",
            "result": "mc:fish_grilled_long_whiskered_catfish",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_long_whiskered_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_loosejaw": {
            "name": "mc:fish_grilled_loosejaw",
            "result": "mc:fish_grilled_loosejaw",
            "requiredLevel": 237,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_loosejaw": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 729,
            "baseXp": 486
    },
    "fish_grilled_mackerel": {
            "name": "mc:fish_grilled_mackerel",
            "result": "mc:fish_grilled_mackerel",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_manta_ray": {
            "name": "mc:fish_grilled_manta_ray",
            "result": "mc:fish_grilled_manta_ray",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_manta_ray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_masu_salmon": {
            "name": "mc:fish_grilled_masu_salmon",
            "result": "mc:fish_grilled_masu_salmon",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_masu_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_modoc_sucker": {
            "name": "mc:fish_grilled_modoc_sucker",
            "result": "mc:fish_grilled_modoc_sucker",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_modoc_sucker": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_mozambique_tilapia": {
            "name": "mc:fish_grilled_mozambique_tilapia",
            "result": "mc:fish_grilled_mozambique_tilapia",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_mozambique_tilapia": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_mummichog": {
            "name": "mc:fish_grilled_mummichog",
            "result": "mc:fish_grilled_mummichog",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_mummichog": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_naked_back_knifefish": {
            "name": "mc:fish_grilled_naked_back_knifefish",
            "result": "mc:fish_grilled_naked_back_knifefish",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_naked_back_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_north_american_freshwater_catfish": {
            "name": "mc:fish_grilled_north_american_freshwater_catfish",
            "result": "mc:fish_grilled_north_american_freshwater_catfish",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_north_american_freshwater_catfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_old_world_knifefish": {
            "name": "mc:fish_grilled_old_world_knifefish",
            "result": "mc:fish_grilled_old_world_knifefish",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_old_world_knifefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_pacific_salmon": {
            "name": "mc:fish_grilled_pacific_salmon",
            "result": "mc:fish_grilled_pacific_salmon",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_pacific_salmon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_pancake_batfish": {
            "name": "mc:fish_grilled_pancake_batfish",
            "result": "mc:fish_grilled_pancake_batfish",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_pancake_batfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_peamouth": {
            "name": "mc:fish_grilled_peamouth",
            "result": "mc:fish_grilled_peamouth",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_peamouth": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_perch": {
            "name": "mc:fish_grilled_perch",
            "result": "mc:fish_grilled_perch",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_perch": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_pleco": {
            "name": "mc:fish_grilled_pleco",
            "result": "mc:fish_grilled_pleco",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_pleco": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_rainbow_trout": {
            "name": "mc:fish_grilled_rainbow_trout",
            "result": "mc:fish_grilled_rainbow_trout",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_rainbow_trout": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_rockfish": {
            "name": "mc:fish_grilled_rockfish",
            "result": "mc:fish_grilled_rockfish",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_rockfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_ruffe": {
            "name": "mc:fish_grilled_ruffe",
            "result": "mc:fish_grilled_ruffe",
            "requiredLevel": 238,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_ruffe": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 732,
            "baseXp": 488
    },
    "fish_grilled_sand_lance": {
            "name": "mc:fish_grilled_sand_lance",
            "result": "mc:fish_grilled_sand_lance",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_sand_lance": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_sawfish": {
            "name": "mc:fish_grilled_sawfish",
            "result": "mc:fish_grilled_sawfish",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_sawfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_scorpionfish": {
            "name": "mc:fish_grilled_scorpionfish",
            "result": "mc:fish_grilled_scorpionfish",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_scorpionfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_sea_dragon": {
            "name": "mc:fish_grilled_sea_dragon",
            "result": "mc:fish_grilled_sea_dragon",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_sea_dragon": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_searobin": {
            "name": "mc:fish_grilled_searobin",
            "result": "mc:fish_grilled_searobin",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_searobin": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_shrimp": {
            "name": "mc:fish_grilled_shrimp",
            "result": "mc:fish_grilled_shrimp",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_shrimp": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_slimy_mackerel": {
            "name": "mc:fish_grilled_slimy_mackerel",
            "result": "mc:fish_grilled_slimy_mackerel",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_slimy_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_snapper": {
            "name": "mc:fish_grilled_snapper",
            "result": "mc:fish_grilled_snapper",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_snapper": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_spanish_mackerel": {
            "name": "mc:fish_grilled_spanish_mackerel",
            "result": "mc:fish_grilled_spanish_mackerel",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_spanish_mackerel": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_stingray": {
            "name": "mc:fish_grilled_stingray",
            "result": "mc:fish_grilled_stingray",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_stingray": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_sweetfish": {
            "name": "mc:fish_grilled_sweetfish",
            "result": "mc:fish_grilled_sweetfish",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_sweetfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_tench": {
            "name": "mc:fish_grilled_tench",
            "result": "mc:fish_grilled_tench",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_tench": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_tilefish": {
            "name": "mc:fish_grilled_tilefish",
            "result": "mc:fish_grilled_tilefish",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_tilefish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_viperfish": {
            "name": "mc:fish_grilled_viperfish",
            "result": "mc:fish_grilled_viperfish",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_viperfish": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_whale_shark": {
            "name": "mc:fish_grilled_whale_shark",
            "result": "mc:fish_grilled_whale_shark",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_whale_shark": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_yellow_jack": {
            "name": "mc:fish_grilled_yellow_jack",
            "result": "mc:fish_grilled_yellow_jack",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_yellow_jack": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "fish_grilled_yellowtail_barracuda": {
            "name": "mc:fish_grilled_yellowtail_barracuda",
            "result": "mc:fish_grilled_yellowtail_barracuda",
            "requiredLevel": 239,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:fish_fillet_yellowtail_barracuda": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 735,
            "baseXp": 490
    },
    "cuisine_chicken_donburi": {
            "name": "mc:cuisine_chicken_donburi",
            "result": "mc:cuisine_chicken_donburi",
            "requiredLevel": 295,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 903,
            "baseXp": 602
    },
    "cuisine_chicken_fried_rice": {
            "name": "mc:cuisine_chicken_fried_rice",
            "result": "mc:cuisine_chicken_fried_rice",
            "requiredLevel": 295,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 903,
            "baseXp": 602
    },
    "cuisine_chicken_pasta": {
            "name": "mc:cuisine_chicken_pasta",
            "result": "mc:cuisine_chicken_pasta",
            "requiredLevel": 295,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 903,
            "baseXp": 602
    },
    "cuisine_chicken_pilaf": {
            "name": "mc:cuisine_chicken_pilaf",
            "result": "mc:cuisine_chicken_pilaf",
            "requiredLevel": 295,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 903,
            "baseXp": 602
    },
    "cuisine_chicken_spaghetti": {
            "name": "mc:cuisine_chicken_spaghetti",
            "result": "mc:cuisine_chicken_spaghetti",
            "requiredLevel": 295,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 903,
            "baseXp": 602
    },
    "cuisine_chicken_burger": {
            "name": "mc:cuisine_chicken_burger",
            "result": "mc:cuisine_chicken_burger",
            "requiredLevel": 296,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 906,
            "baseXp": 604
    },
    "cuisine_chicken_gyoza": {
            "name": "mc:cuisine_chicken_gyoza",
            "result": "mc:cuisine_chicken_gyoza",
            "requiredLevel": 296,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "minecraft:chicken": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 906,
            "baseXp": 604
    },
    "cuisine_pork_donburi": {
            "name": "mc:cuisine_pork_donburi",
            "result": "mc:cuisine_pork_donburi",
            "requiredLevel": 296,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 906,
            "baseXp": 604
    },
    "cuisine_pork_fried_rice": {
            "name": "mc:cuisine_pork_fried_rice",
            "result": "mc:cuisine_pork_fried_rice",
            "requiredLevel": 296,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 906,
            "baseXp": 604
    },
    "cuisine_pork_pilaf": {
            "name": "mc:cuisine_pork_pilaf",
            "result": "mc:cuisine_pork_pilaf",
            "requiredLevel": 296,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 906,
            "baseXp": 604
    },
    "cuisine_pork_spaghetti": {
            "name": "mc:cuisine_pork_spaghetti",
            "result": "mc:cuisine_pork_spaghetti",
            "requiredLevel": 296,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 906,
            "baseXp": 604
    },
    "cuisine_beef_donburi": {
            "name": "mc:cuisine_beef_donburi",
            "result": "mc:cuisine_beef_donburi",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_beef_fried_rice": {
            "name": "mc:cuisine_beef_fried_rice",
            "result": "mc:cuisine_beef_fried_rice",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_beef_pasta": {
            "name": "mc:cuisine_beef_pasta",
            "result": "mc:cuisine_beef_pasta",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_beef_pilaf": {
            "name": "mc:cuisine_beef_pilaf",
            "result": "mc:cuisine_beef_pilaf",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_beef_spaghetti": {
            "name": "mc:cuisine_beef_spaghetti",
            "result": "mc:cuisine_beef_spaghetti",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_pork_burger": {
            "name": "mc:cuisine_pork_burger",
            "result": "mc:cuisine_pork_burger",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_pork_gyoza": {
            "name": "mc:cuisine_pork_gyoza",
            "result": "mc:cuisine_pork_gyoza",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_pork_pasta": {
            "name": "mc:cuisine_pork_pasta",
            "result": "mc:cuisine_pork_pasta",
            "requiredLevel": 297,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:pork_chop": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 909,
            "baseXp": 606
    },
    "cuisine_beef_burger": {
            "name": "mc:cuisine_beef_burger",
            "result": "mc:cuisine_beef_burger",
            "requiredLevel": 298,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 912,
            "baseXp": 608
    },
    "cuisine_beef_gyoza": {
            "name": "mc:cuisine_beef_gyoza",
            "result": "mc:cuisine_beef_gyoza",
            "requiredLevel": 298,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:beef_loin": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 912,
            "baseXp": 608
    },
    "cuisine_shrimp_donburi": {
            "name": "mc:cuisine_shrimp_donburi",
            "result": "mc:cuisine_shrimp_donburi",
            "requiredLevel": 298,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 912,
            "baseXp": 608
    },
    "cuisine_shrimp_fried_rice": {
            "name": "mc:cuisine_shrimp_fried_rice",
            "result": "mc:cuisine_shrimp_fried_rice",
            "requiredLevel": 298,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 912,
            "baseXp": 608
    },
    "cuisine_shrimp_pasta": {
            "name": "mc:cuisine_shrimp_pasta",
            "result": "mc:cuisine_shrimp_pasta",
            "requiredLevel": 298,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 912,
            "baseXp": 608
    },
    "cuisine_shrimp_pilaf": {
            "name": "mc:cuisine_shrimp_pilaf",
            "result": "mc:cuisine_shrimp_pilaf",
            "requiredLevel": 298,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 912,
            "baseXp": 608
    },
    "cuisine_shrimp_burger": {
            "name": "mc:cuisine_shrimp_burger",
            "result": "mc:cuisine_shrimp_burger",
            "requiredLevel": 299,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 915,
            "baseXp": 610
    },
    "cuisine_shrimp_gyoza": {
            "name": "mc:cuisine_shrimp_gyoza",
            "result": "mc:cuisine_shrimp_gyoza",
            "requiredLevel": 299,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 915,
            "baseXp": 610
    },
    "cuisine_shrimp_spaghetti": {
            "name": "mc:cuisine_shrimp_spaghetti",
            "result": "mc:cuisine_shrimp_spaghetti",
            "requiredLevel": 299,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:shrimp": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 915,
            "baseXp": 610
    },
    "cuisine_squid_donburi": {
            "name": "mc:cuisine_squid_donburi",
            "result": "mc:cuisine_squid_donburi",
            "requiredLevel": 299,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 915,
            "baseXp": 610
    },
    "cuisine_squid_fried_rice": {
            "name": "mc:cuisine_squid_fried_rice",
            "result": "mc:cuisine_squid_fried_rice",
            "requiredLevel": 299,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 915,
            "baseXp": 610
    },
    "cuisine_squid_pilaf": {
            "name": "mc:cuisine_squid_pilaf",
            "result": "mc:cuisine_squid_pilaf",
            "requiredLevel": 299,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 915,
            "baseXp": 610
    },
    "cuisine_salmon_donburi": {
            "name": "mc:cuisine_salmon_donburi",
            "result": "mc:cuisine_salmon_donburi",
            "requiredLevel": 300,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_squid_burger": {
            "name": "mc:cuisine_squid_burger",
            "result": "mc:cuisine_squid_burger",
            "requiredLevel": 300,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_squid_gyoza": {
            "name": "mc:cuisine_squid_gyoza",
            "result": "mc:cuisine_squid_gyoza",
            "requiredLevel": 300,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_squid_pasta": {
            "name": "mc:cuisine_squid_pasta",
            "result": "mc:cuisine_squid_pasta",
            "requiredLevel": 300,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_squid_spaghetti": {
            "name": "mc:cuisine_squid_spaghetti",
            "result": "mc:cuisine_squid_spaghetti",
            "requiredLevel": 300,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:squid": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_salmon_fried_rice": {
            "name": "mc:cuisine_salmon_fried_rice",
            "result": "mc:cuisine_salmon_fried_rice",
            "requiredLevel": 301,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 921,
            "baseXp": 614
    },
    "cuisine_salmon_pasta": {
            "name": "mc:cuisine_salmon_pasta",
            "result": "mc:cuisine_salmon_pasta",
            "requiredLevel": 301,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 921,
            "baseXp": 614
    },
    "cuisine_salmon_pilaf": {
            "name": "mc:cuisine_salmon_pilaf",
            "result": "mc:cuisine_salmon_pilaf",
            "requiredLevel": 301,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 921,
            "baseXp": 614
    },
    "cuisine_salmon_spaghetti": {
            "name": "mc:cuisine_salmon_spaghetti",
            "result": "mc:cuisine_salmon_spaghetti",
            "requiredLevel": 301,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 921,
            "baseXp": 614
    },
    "cuisine_salmon_burger": {
            "name": "mc:cuisine_salmon_burger",
            "result": "mc:cuisine_salmon_burger",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_salmon_gyoza": {
            "name": "mc:cuisine_salmon_gyoza",
            "result": "mc:cuisine_salmon_gyoza",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "minecraft:salmon": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_tuna_donburi": {
            "name": "mc:cuisine_tuna_donburi",
            "result": "mc:cuisine_tuna_donburi",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_tuna_fried_rice": {
            "name": "mc:cuisine_tuna_fried_rice",
            "result": "mc:cuisine_tuna_fried_rice",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_tuna_pasta": {
            "name": "mc:cuisine_tuna_pasta",
            "result": "mc:cuisine_tuna_pasta",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_tuna_pilaf": {
            "name": "mc:cuisine_tuna_pilaf",
            "result": "mc:cuisine_tuna_pilaf",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_tuna_spaghetti": {
            "name": "mc:cuisine_tuna_spaghetti",
            "result": "mc:cuisine_tuna_spaghetti",
            "requiredLevel": 302,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_egg_donburi": {
            "name": "mc:cuisine_egg_donburi",
            "result": "mc:cuisine_egg_donburi",
            "requiredLevel": 303,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 927,
            "baseXp": 618
    },
    "cuisine_egg_fried_rice": {
            "name": "mc:cuisine_egg_fried_rice",
            "result": "mc:cuisine_egg_fried_rice",
            "requiredLevel": 303,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 3,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 927,
            "baseXp": 618
    },
    "cuisine_tuna_burger": {
            "name": "mc:cuisine_tuna_burger",
            "result": "mc:cuisine_tuna_burger",
            "requiredLevel": 303,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 927,
            "baseXp": 618
    },
    "cuisine_tuna_gyoza": {
            "name": "mc:cuisine_tuna_gyoza",
            "result": "mc:cuisine_tuna_gyoza",
            "requiredLevel": 303,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:tuna": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 927,
            "baseXp": 618
    },
    "cuisine_cheese_donburi": {
            "name": "mc:cuisine_cheese_donburi",
            "result": "mc:cuisine_cheese_donburi",
            "requiredLevel": 304,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_egg_burger": {
            "name": "mc:cuisine_egg_burger",
            "result": "mc:cuisine_egg_burger",
            "requiredLevel": 304,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_egg_gyoza": {
            "name": "mc:cuisine_egg_gyoza",
            "result": "mc:cuisine_egg_gyoza",
            "requiredLevel": 304,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_egg_pasta": {
            "name": "mc:cuisine_egg_pasta",
            "result": "mc:cuisine_egg_pasta",
            "requiredLevel": 304,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_egg_pilaf": {
            "name": "mc:cuisine_egg_pilaf",
            "result": "mc:cuisine_egg_pilaf",
            "requiredLevel": 304,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_egg_spaghetti": {
            "name": "mc:cuisine_egg_spaghetti",
            "result": "mc:cuisine_egg_spaghetti",
            "requiredLevel": 304,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_cheese_burger": {
            "name": "mc:cuisine_cheese_burger",
            "result": "mc:cuisine_cheese_burger",
            "requiredLevel": 305,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 933,
            "baseXp": 622
    },
    "cuisine_cheese_fried_rice": {
            "name": "mc:cuisine_cheese_fried_rice",
            "result": "mc:cuisine_cheese_fried_rice",
            "requiredLevel": 305,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 933,
            "baseXp": 622
    },
    "cuisine_cheese_pasta": {
            "name": "mc:cuisine_cheese_pasta",
            "result": "mc:cuisine_cheese_pasta",
            "requiredLevel": 305,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 933,
            "baseXp": 622
    },
    "cuisine_cheese_pilaf": {
            "name": "mc:cuisine_cheese_pilaf",
            "result": "mc:cuisine_cheese_pilaf",
            "requiredLevel": 305,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 933,
            "baseXp": 622
    },
    "cuisine_cheese_spaghetti": {
            "name": "mc:cuisine_cheese_spaghetti",
            "result": "mc:cuisine_cheese_spaghetti",
            "requiredLevel": 305,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 933,
            "baseXp": 622
    },
    "cuisine_bacon_donburi": {
            "name": "mc:cuisine_bacon_donburi",
            "result": "mc:cuisine_bacon_donburi",
            "requiredLevel": 306,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_bacon_fried_rice": {
            "name": "mc:cuisine_bacon_fried_rice",
            "result": "mc:cuisine_bacon_fried_rice",
            "requiredLevel": 306,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_bacon_pasta": {
            "name": "mc:cuisine_bacon_pasta",
            "result": "mc:cuisine_bacon_pasta",
            "requiredLevel": 306,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_bacon_pilaf": {
            "name": "mc:cuisine_bacon_pilaf",
            "result": "mc:cuisine_bacon_pilaf",
            "requiredLevel": 306,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_cheese_gyoza": {
            "name": "mc:cuisine_cheese_gyoza",
            "result": "mc:cuisine_cheese_gyoza",
            "requiredLevel": 306,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:cheese": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_bacon_burger": {
            "name": "mc:cuisine_bacon_burger",
            "result": "mc:cuisine_bacon_burger",
            "requiredLevel": 307,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 939,
            "baseXp": 626
    },
    "cuisine_bacon_gyoza": {
            "name": "mc:cuisine_bacon_gyoza",
            "result": "mc:cuisine_bacon_gyoza",
            "requiredLevel": 307,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 939,
            "baseXp": 626
    },
    "cuisine_bacon_spaghetti": {
            "name": "mc:cuisine_bacon_spaghetti",
            "result": "mc:cuisine_bacon_spaghetti",
            "requiredLevel": 307,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:bacon": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 939,
            "baseXp": 626
    },
    "cuisine_mushroom_fried_rice": {
            "name": "mc:cuisine_mushroom_fried_rice",
            "result": "mc:cuisine_mushroom_fried_rice",
            "requiredLevel": 307,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 939,
            "baseXp": 626
    },
    "cuisine_mushroom_burger": {
            "name": "mc:cuisine_mushroom_burger",
            "result": "mc:cuisine_mushroom_burger",
            "requiredLevel": 308,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 942,
            "baseXp": 628
    },
    "cuisine_mushroom_donburi": {
            "name": "mc:cuisine_mushroom_donburi",
            "result": "mc:cuisine_mushroom_donburi",
            "requiredLevel": 308,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 942,
            "baseXp": 628
    },
    "cuisine_mushroom_pasta": {
            "name": "mc:cuisine_mushroom_pasta",
            "result": "mc:cuisine_mushroom_pasta",
            "requiredLevel": 308,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 942,
            "baseXp": 628
    },
    "cuisine_mushroom_pilaf": {
            "name": "mc:cuisine_mushroom_pilaf",
            "result": "mc:cuisine_mushroom_pilaf",
            "requiredLevel": 308,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 942,
            "baseXp": 628
    },
    "cuisine_mushroom_spaghetti": {
            "name": "mc:cuisine_mushroom_spaghetti",
            "result": "mc:cuisine_mushroom_spaghetti",
            "requiredLevel": 308,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 942,
            "baseXp": 628
    },
    "cuisine_mushroom_gyoza": {
            "name": "mc:cuisine_mushroom_gyoza",
            "result": "mc:cuisine_mushroom_gyoza",
            "requiredLevel": 309,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "minecraft:brown_mushroom": 2
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_potato_donburi": {
            "name": "mc:cuisine_potato_donburi",
            "result": "mc:cuisine_potato_donburi",
            "requiredLevel": 309,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_potato_fried_rice": {
            "name": "mc:cuisine_potato_fried_rice",
            "result": "mc:cuisine_potato_fried_rice",
            "requiredLevel": 309,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_potato_pasta": {
            "name": "mc:cuisine_potato_pasta",
            "result": "mc:cuisine_potato_pasta",
            "requiredLevel": 309,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_potato_pilaf": {
            "name": "mc:cuisine_potato_pilaf",
            "result": "mc:cuisine_potato_pilaf",
            "requiredLevel": 309,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_cabbage_donburi": {
            "name": "mc:cuisine_cabbage_donburi",
            "result": "mc:cuisine_cabbage_donburi",
            "requiredLevel": 310,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:cabbage_chopped": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 948,
            "baseXp": 632
    },
    "cuisine_potato_burger": {
            "name": "mc:cuisine_potato_burger",
            "result": "mc:cuisine_potato_burger",
            "requiredLevel": 310,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 948,
            "baseXp": 632
    },
    "cuisine_potato_gyoza": {
            "name": "mc:cuisine_potato_gyoza",
            "result": "mc:cuisine_potato_gyoza",
            "requiredLevel": 310,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 948,
            "baseXp": 632
    },
    "cuisine_potato_spaghetti": {
            "name": "mc:cuisine_potato_spaghetti",
            "result": "mc:cuisine_potato_spaghetti",
            "requiredLevel": 310,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:potato": 2
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 948,
            "baseXp": 632
    },
    "cuisine_cabbage_burger": {
            "name": "mc:cuisine_cabbage_burger",
            "result": "mc:cuisine_cabbage_burger",
            "requiredLevel": 311,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:cabbage_chopped": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 951,
            "baseXp": 634
    },
    "cuisine_cabbage_fried_rice": {
            "name": "mc:cuisine_cabbage_fried_rice",
            "result": "mc:cuisine_cabbage_fried_rice",
            "requiredLevel": 311,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:cabbage_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 951,
            "baseXp": 634
    },
    "cuisine_cabbage_pasta": {
            "name": "mc:cuisine_cabbage_pasta",
            "result": "mc:cuisine_cabbage_pasta",
            "requiredLevel": 311,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:cabbage_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 951,
            "baseXp": 634
    },
    "cuisine_cabbage_pilaf": {
            "name": "mc:cuisine_cabbage_pilaf",
            "result": "mc:cuisine_cabbage_pilaf",
            "requiredLevel": 311,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:cabbage_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 951,
            "baseXp": 634
    },
    "cuisine_cabbage_spaghetti": {
            "name": "mc:cuisine_cabbage_spaghetti",
            "result": "mc:cuisine_cabbage_spaghetti",
            "requiredLevel": 311,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:cabbage_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 951,
            "baseXp": 634
    },
    "cuisine_cabbage_gyoza": {
            "name": "mc:cuisine_cabbage_gyoza",
            "result": "mc:cuisine_cabbage_gyoza",
            "requiredLevel": 312,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 2,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_spinach_donburi": {
            "name": "mc:cuisine_spinach_donburi",
            "result": "mc:cuisine_spinach_donburi",
            "requiredLevel": 312,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_spinach_fried_rice": {
            "name": "mc:cuisine_spinach_fried_rice",
            "result": "mc:cuisine_spinach_fried_rice",
            "requiredLevel": 312,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_spinach_pilaf": {
            "name": "mc:cuisine_spinach_pilaf",
            "result": "mc:cuisine_spinach_pilaf",
            "requiredLevel": 312,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_spinach_spaghetti": {
            "name": "mc:cuisine_spinach_spaghetti",
            "result": "mc:cuisine_spinach_spaghetti",
            "requiredLevel": 312,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_eggplant_donburi": {
            "name": "mc:cuisine_eggplant_donburi",
            "result": "mc:cuisine_eggplant_donburi",
            "requiredLevel": 313,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_eggplant_pilaf": {
            "name": "mc:cuisine_eggplant_pilaf",
            "result": "mc:cuisine_eggplant_pilaf",
            "requiredLevel": 313,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_spinach_burger": {
            "name": "mc:cuisine_spinach_burger",
            "result": "mc:cuisine_spinach_burger",
            "requiredLevel": 313,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_spinach_gyoza": {
            "name": "mc:cuisine_spinach_gyoza",
            "result": "mc:cuisine_spinach_gyoza",
            "requiredLevel": 313,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_spinach_pasta": {
            "name": "mc:cuisine_spinach_pasta",
            "result": "mc:cuisine_spinach_pasta",
            "requiredLevel": 313,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:spinach_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_eggplant_burger": {
            "name": "mc:cuisine_eggplant_burger",
            "result": "mc:cuisine_eggplant_burger",
            "requiredLevel": 314,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 960,
            "baseXp": 640
    },
    "cuisine_eggplant_fried_rice": {
            "name": "mc:cuisine_eggplant_fried_rice",
            "result": "mc:cuisine_eggplant_fried_rice",
            "requiredLevel": 314,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 960,
            "baseXp": 640
    },
    "cuisine_eggplant_gyoza": {
            "name": "mc:cuisine_eggplant_gyoza",
            "result": "mc:cuisine_eggplant_gyoza",
            "requiredLevel": 314,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 960,
            "baseXp": 640
    },
    "cuisine_eggplant_pasta": {
            "name": "mc:cuisine_eggplant_pasta",
            "result": "mc:cuisine_eggplant_pasta",
            "requiredLevel": 314,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 960,
            "baseXp": 640
    },
    "cuisine_eggplant_spaghetti": {
            "name": "mc:cuisine_eggplant_spaghetti",
            "result": "mc:cuisine_eggplant_spaghetti",
            "requiredLevel": 314,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:eggplant_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:miso": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 960,
            "baseXp": 640
    },
    "cuisine_bell_pepper_donburi": {
            "name": "mc:cuisine_bell_pepper_donburi",
            "result": "mc:cuisine_bell_pepper_donburi",
            "requiredLevel": 315,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 963,
            "baseXp": 642
    },
    "cuisine_bell_pepper_fried_rice": {
            "name": "mc:cuisine_bell_pepper_fried_rice",
            "result": "mc:cuisine_bell_pepper_fried_rice",
            "requiredLevel": 315,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 963,
            "baseXp": 642
    },
    "cuisine_bell_pepper_pasta": {
            "name": "mc:cuisine_bell_pepper_pasta",
            "result": "mc:cuisine_bell_pepper_pasta",
            "requiredLevel": 315,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 963,
            "baseXp": 642
    },
    "cuisine_bell_pepper_pilaf": {
            "name": "mc:cuisine_bell_pepper_pilaf",
            "result": "mc:cuisine_bell_pepper_pilaf",
            "requiredLevel": 315,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 963,
            "baseXp": 642
    },
    "cuisine_bell_pepper_spaghetti": {
            "name": "mc:cuisine_bell_pepper_spaghetti",
            "result": "mc:cuisine_bell_pepper_spaghetti",
            "requiredLevel": 315,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 963,
            "baseXp": 642
    },
    "cuisine_bell_pepper_burger": {
            "name": "mc:cuisine_bell_pepper_burger",
            "result": "mc:cuisine_bell_pepper_burger",
            "requiredLevel": 316,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_bell_pepper_gyoza": {
            "name": "mc:cuisine_bell_pepper_gyoza",
            "result": "mc:cuisine_bell_pepper_gyoza",
            "requiredLevel": 316,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:bell_pepper_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_leek_donburi": {
            "name": "mc:cuisine_leek_donburi",
            "result": "mc:cuisine_leek_donburi",
            "requiredLevel": 316,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_leek_fried_rice": {
            "name": "mc:cuisine_leek_fried_rice",
            "result": "mc:cuisine_leek_fried_rice",
            "requiredLevel": 316,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_leek_pilaf": {
            "name": "mc:cuisine_leek_pilaf",
            "result": "mc:cuisine_leek_pilaf",
            "requiredLevel": 316,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_leek_burger": {
            "name": "mc:cuisine_leek_burger",
            "result": "mc:cuisine_leek_burger",
            "requiredLevel": 317,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 969,
            "baseXp": 646
    },
    "cuisine_leek_pasta": {
            "name": "mc:cuisine_leek_pasta",
            "result": "mc:cuisine_leek_pasta",
            "requiredLevel": 317,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 969,
            "baseXp": 646
    },
    "cuisine_leek_spaghetti": {
            "name": "mc:cuisine_leek_spaghetti",
            "result": "mc:cuisine_leek_spaghetti",
            "requiredLevel": 317,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 969,
            "baseXp": 646
    },
    "cuisine_ginger_donburi": {
            "name": "mc:cuisine_ginger_donburi",
            "result": "mc:cuisine_ginger_donburi",
            "requiredLevel": 318,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_ginger_fried_rice": {
            "name": "mc:cuisine_ginger_fried_rice",
            "result": "mc:cuisine_ginger_fried_rice",
            "requiredLevel": 318,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_ginger_pasta": {
            "name": "mc:cuisine_ginger_pasta",
            "result": "mc:cuisine_ginger_pasta",
            "requiredLevel": 318,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_ginger_pilaf": {
            "name": "mc:cuisine_ginger_pilaf",
            "result": "mc:cuisine_ginger_pilaf",
            "requiredLevel": 318,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_ginger_spaghetti": {
            "name": "mc:cuisine_ginger_spaghetti",
            "result": "mc:cuisine_ginger_spaghetti",
            "requiredLevel": 318,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_leek_gyoza": {
            "name": "mc:cuisine_leek_gyoza",
            "result": "mc:cuisine_leek_gyoza",
            "requiredLevel": 318,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:leek_chopped": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_garlic_donburi": {
            "name": "mc:cuisine_garlic_donburi",
            "result": "mc:cuisine_garlic_donburi",
            "requiredLevel": 319,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 975,
            "baseXp": 650
    },
    "cuisine_garlic_fried_rice": {
            "name": "mc:cuisine_garlic_fried_rice",
            "result": "mc:cuisine_garlic_fried_rice",
            "requiredLevel": 319,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 975,
            "baseXp": 650
    },
    "cuisine_ginger_burger": {
            "name": "mc:cuisine_ginger_burger",
            "result": "mc:cuisine_ginger_burger",
            "requiredLevel": 319,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 975,
            "baseXp": 650
    },
    "cuisine_ginger_gyoza": {
            "name": "mc:cuisine_ginger_gyoza",
            "result": "mc:cuisine_ginger_gyoza",
            "requiredLevel": 319,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:grated_ginger": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 975,
            "baseXp": 650
    },
    "cuisine_garlic_burger": {
            "name": "mc:cuisine_garlic_burger",
            "result": "mc:cuisine_garlic_burger",
            "requiredLevel": 320,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 978,
            "baseXp": 652
    },
    "cuisine_garlic_pasta": {
            "name": "mc:cuisine_garlic_pasta",
            "result": "mc:cuisine_garlic_pasta",
            "requiredLevel": 320,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 978,
            "baseXp": 652
    },
    "cuisine_garlic_pilaf": {
            "name": "mc:cuisine_garlic_pilaf",
            "result": "mc:cuisine_garlic_pilaf",
            "requiredLevel": 320,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 978,
            "baseXp": 652
    },
    "cuisine_garlic_spaghetti": {
            "name": "mc:cuisine_garlic_spaghetti",
            "result": "mc:cuisine_garlic_spaghetti",
            "requiredLevel": 320,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 978,
            "baseXp": 652
    },
    "cuisine_chili_donburi": {
            "name": "mc:cuisine_chili_donburi",
            "result": "mc:cuisine_chili_donburi",
            "requiredLevel": 321,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_chili_fried_rice": {
            "name": "mc:cuisine_chili_fried_rice",
            "result": "mc:cuisine_chili_fried_rice",
            "requiredLevel": 321,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_chili_pasta": {
            "name": "mc:cuisine_chili_pasta",
            "result": "mc:cuisine_chili_pasta",
            "requiredLevel": 321,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_chili_pilaf": {
            "name": "mc:cuisine_chili_pilaf",
            "result": "mc:cuisine_chili_pilaf",
            "requiredLevel": 321,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_chili_spaghetti": {
            "name": "mc:cuisine_chili_spaghetti",
            "result": "mc:cuisine_chili_spaghetti",
            "requiredLevel": 321,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_garlic_gyoza": {
            "name": "mc:cuisine_garlic_gyoza",
            "result": "mc:cuisine_garlic_gyoza",
            "requiredLevel": 321,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_chili_burger": {
            "name": "mc:cuisine_chili_burger",
            "result": "mc:cuisine_chili_burger",
            "requiredLevel": 322,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_chili_gyoza": {
            "name": "mc:cuisine_chili_gyoza",
            "result": "mc:cuisine_chili_gyoza",
            "requiredLevel": 322,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:chili_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_tomato_donburi": {
            "name": "mc:cuisine_tomato_donburi",
            "result": "mc:cuisine_tomato_donburi",
            "requiredLevel": 322,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_tomato_fried_rice": {
            "name": "mc:cuisine_tomato_fried_rice",
            "result": "mc:cuisine_tomato_fried_rice",
            "requiredLevel": 322,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_tomato_pilaf": {
            "name": "mc:cuisine_tomato_pilaf",
            "result": "mc:cuisine_tomato_pilaf",
            "requiredLevel": 322,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_tomato_burger": {
            "name": "mc:cuisine_tomato_burger",
            "result": "mc:cuisine_tomato_burger",
            "requiredLevel": 323,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 987,
            "baseXp": 658
    },
    "cuisine_tomato_gyoza": {
            "name": "mc:cuisine_tomato_gyoza",
            "result": "mc:cuisine_tomato_gyoza",
            "requiredLevel": 323,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 987,
            "baseXp": 658
    },
    "cuisine_tomato_pasta": {
            "name": "mc:cuisine_tomato_pasta",
            "result": "mc:cuisine_tomato_pasta",
            "requiredLevel": 323,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 987,
            "baseXp": 658
    },
    "cuisine_tomato_spaghetti": {
            "name": "mc:cuisine_tomato_spaghetti",
            "result": "mc:cuisine_tomato_spaghetti",
            "requiredLevel": 323,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:tomato_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:basil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 987,
            "baseXp": 658
    },
    "cuisine_curry_donburi": {
            "name": "mc:cuisine_curry_donburi",
            "result": "mc:cuisine_curry_donburi",
            "requiredLevel": 324,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 990,
            "baseXp": 660
    },
    "cuisine_curry_fried_rice": {
            "name": "mc:cuisine_curry_fried_rice",
            "result": "mc:cuisine_curry_fried_rice",
            "requiredLevel": 324,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 990,
            "baseXp": 660
    },
    "cuisine_curry_pasta": {
            "name": "mc:cuisine_curry_pasta",
            "result": "mc:cuisine_curry_pasta",
            "requiredLevel": 324,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 990,
            "baseXp": 660
    },
    "cuisine_curry_pilaf": {
            "name": "mc:cuisine_curry_pilaf",
            "result": "mc:cuisine_curry_pilaf",
            "requiredLevel": 324,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 990,
            "baseXp": 660
    },
    "cuisine_curry_spaghetti": {
            "name": "mc:cuisine_curry_spaghetti",
            "result": "mc:cuisine_curry_spaghetti",
            "requiredLevel": 324,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 990,
            "baseXp": 660
    },
    "cuisine_curry_burger": {
            "name": "mc:cuisine_curry_burger",
            "result": "mc:cuisine_curry_burger",
            "requiredLevel": 325,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_curry_gyoza": {
            "name": "mc:cuisine_curry_gyoza",
            "result": "mc:cuisine_curry_gyoza",
            "requiredLevel": 325,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:curry_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_miso_donburi": {
            "name": "mc:cuisine_miso_donburi",
            "result": "mc:cuisine_miso_donburi",
            "requiredLevel": 325,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_miso_fried_rice": {
            "name": "mc:cuisine_miso_fried_rice",
            "result": "mc:cuisine_miso_fried_rice",
            "requiredLevel": 325,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_miso_pilaf": {
            "name": "mc:cuisine_miso_pilaf",
            "result": "mc:cuisine_miso_pilaf",
            "requiredLevel": 325,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_miso_burger": {
            "name": "mc:cuisine_miso_burger",
            "result": "mc:cuisine_miso_burger",
            "requiredLevel": 326,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 996,
            "baseXp": 664
    },
    "cuisine_miso_gyoza": {
            "name": "mc:cuisine_miso_gyoza",
            "result": "mc:cuisine_miso_gyoza",
            "requiredLevel": 326,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 996,
            "baseXp": 664
    },
    "cuisine_miso_pasta": {
            "name": "mc:cuisine_miso_pasta",
            "result": "mc:cuisine_miso_pasta",
            "requiredLevel": 326,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 996,
            "baseXp": 664
    },
    "cuisine_miso_spaghetti": {
            "name": "mc:cuisine_miso_spaghetti",
            "result": "mc:cuisine_miso_spaghetti",
            "requiredLevel": 326,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:miso": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:dashi": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 996,
            "baseXp": 664
    },
    "cuisine_soy_donburi": {
            "name": "mc:cuisine_soy_donburi",
            "result": "mc:cuisine_soy_donburi",
            "requiredLevel": 326,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 996,
            "baseXp": 664
    },
    "cuisine_soy_fried_rice": {
            "name": "mc:cuisine_soy_fried_rice",
            "result": "mc:cuisine_soy_fried_rice",
            "requiredLevel": 327,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 999,
            "baseXp": 666
    },
    "cuisine_soy_pasta": {
            "name": "mc:cuisine_soy_pasta",
            "result": "mc:cuisine_soy_pasta",
            "requiredLevel": 327,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 999,
            "baseXp": 666
    },
    "cuisine_soy_pilaf": {
            "name": "mc:cuisine_soy_pilaf",
            "result": "mc:cuisine_soy_pilaf",
            "requiredLevel": 327,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 999,
            "baseXp": 666
    },
    "cuisine_soy_spaghetti": {
            "name": "mc:cuisine_soy_spaghetti",
            "result": "mc:cuisine_soy_spaghetti",
            "requiredLevel": 327,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 999,
            "baseXp": 666
    },
    "cuisine_soy_burger": {
            "name": "mc:cuisine_soy_burger",
            "result": "mc:cuisine_soy_burger",
            "requiredLevel": 328,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_soy_gyoza": {
            "name": "mc:cuisine_soy_gyoza",
            "result": "mc:cuisine_soy_gyoza",
            "requiredLevel": 328,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:syoyu": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:leek_chopped": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_teriyaki_donburi": {
            "name": "mc:cuisine_teriyaki_donburi",
            "result": "mc:cuisine_teriyaki_donburi",
            "requiredLevel": 328,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_teriyaki_fried_rice": {
            "name": "mc:cuisine_teriyaki_fried_rice",
            "result": "mc:cuisine_teriyaki_fried_rice",
            "requiredLevel": 328,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_teriyaki_pilaf": {
            "name": "mc:cuisine_teriyaki_pilaf",
            "result": "mc:cuisine_teriyaki_pilaf",
            "requiredLevel": 328,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_teriyaki_burger": {
            "name": "mc:cuisine_teriyaki_burger",
            "result": "mc:cuisine_teriyaki_burger",
            "requiredLevel": 329,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1005,
            "baseXp": 670
    },
    "cuisine_teriyaki_gyoza": {
            "name": "mc:cuisine_teriyaki_gyoza",
            "result": "mc:cuisine_teriyaki_gyoza",
            "requiredLevel": 329,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1005,
            "baseXp": 670
    },
    "cuisine_teriyaki_pasta": {
            "name": "mc:cuisine_teriyaki_pasta",
            "result": "mc:cuisine_teriyaki_pasta",
            "requiredLevel": 329,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1005,
            "baseXp": 670
    },
    "cuisine_teriyaki_spaghetti": {
            "name": "mc:cuisine_teriyaki_spaghetti",
            "result": "mc:cuisine_teriyaki_spaghetti",
            "requiredLevel": 329,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:teriyaki_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1005,
            "baseXp": 670
    },
    "cuisine_sesame_burger": {
            "name": "mc:cuisine_sesame_burger",
            "result": "mc:cuisine_sesame_burger",
            "requiredLevel": 330,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1008,
            "baseXp": 672
    },
    "cuisine_sesame_donburi": {
            "name": "mc:cuisine_sesame_donburi",
            "result": "mc:cuisine_sesame_donburi",
            "requiredLevel": 330,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1008,
            "baseXp": 672
    },
    "cuisine_sesame_fried_rice": {
            "name": "mc:cuisine_sesame_fried_rice",
            "result": "mc:cuisine_sesame_fried_rice",
            "requiredLevel": 330,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1008,
            "baseXp": 672
    },
    "cuisine_sesame_pasta": {
            "name": "mc:cuisine_sesame_pasta",
            "result": "mc:cuisine_sesame_pasta",
            "requiredLevel": 330,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1008,
            "baseXp": 672
    },
    "cuisine_sesame_pilaf": {
            "name": "mc:cuisine_sesame_pilaf",
            "result": "mc:cuisine_sesame_pilaf",
            "requiredLevel": 330,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1008,
            "baseXp": 672
    },
    "cuisine_sesame_spaghetti": {
            "name": "mc:cuisine_sesame_spaghetti",
            "result": "mc:cuisine_sesame_spaghetti",
            "requiredLevel": 330,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1008,
            "baseXp": 672
    },
    "cuisine_peanut_donburi": {
            "name": "mc:cuisine_peanut_donburi",
            "result": "mc:cuisine_peanut_donburi",
            "requiredLevel": 331,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_peanut_fried_rice": {
            "name": "mc:cuisine_peanut_fried_rice",
            "result": "mc:cuisine_peanut_fried_rice",
            "requiredLevel": 331,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_peanut_pasta": {
            "name": "mc:cuisine_peanut_pasta",
            "result": "mc:cuisine_peanut_pasta",
            "requiredLevel": 331,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_peanut_pilaf": {
            "name": "mc:cuisine_peanut_pilaf",
            "result": "mc:cuisine_peanut_pilaf",
            "requiredLevel": 331,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_peanut_spaghetti": {
            "name": "mc:cuisine_peanut_spaghetti",
            "result": "mc:cuisine_peanut_spaghetti",
            "requiredLevel": 331,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_sesame_gyoza": {
            "name": "mc:cuisine_sesame_gyoza",
            "result": "mc:cuisine_sesame_gyoza",
            "requiredLevel": 331,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:sesame_seed_powder": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_cream_donburi": {
            "name": "mc:cuisine_cream_donburi",
            "result": "mc:cuisine_cream_donburi",
            "requiredLevel": 332,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1014,
            "baseXp": 676
    },
    "cuisine_peanut_burger": {
            "name": "mc:cuisine_peanut_burger",
            "result": "mc:cuisine_peanut_burger",
            "requiredLevel": 332,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1014,
            "baseXp": 676
    },
    "cuisine_peanut_gyoza": {
            "name": "mc:cuisine_peanut_gyoza",
            "result": "mc:cuisine_peanut_gyoza",
            "requiredLevel": 332,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:peanut_butter": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1014,
            "baseXp": 676
    },
    "cuisine_cream_burger": {
            "name": "mc:cuisine_cream_burger",
            "result": "mc:cuisine_cream_burger",
            "requiredLevel": 333,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1017,
            "baseXp": 678
    },
    "cuisine_cream_fried_rice": {
            "name": "mc:cuisine_cream_fried_rice",
            "result": "mc:cuisine_cream_fried_rice",
            "requiredLevel": 333,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1017,
            "baseXp": 678
    },
    "cuisine_cream_pasta": {
            "name": "mc:cuisine_cream_pasta",
            "result": "mc:cuisine_cream_pasta",
            "requiredLevel": 333,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1017,
            "baseXp": 678
    },
    "cuisine_cream_pilaf": {
            "name": "mc:cuisine_cream_pilaf",
            "result": "mc:cuisine_cream_pilaf",
            "requiredLevel": 333,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1017,
            "baseXp": 678
    },
    "cuisine_cream_spaghetti": {
            "name": "mc:cuisine_cream_spaghetti",
            "result": "mc:cuisine_cream_spaghetti",
            "requiredLevel": 333,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:pepper": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1017,
            "baseXp": 678
    },
    "cuisine_butter_donburi": {
            "name": "mc:cuisine_butter_donburi",
            "result": "mc:cuisine_butter_donburi",
            "requiredLevel": 334,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1020,
            "baseXp": 680
    },
    "cuisine_butter_fried_rice": {
            "name": "mc:cuisine_butter_fried_rice",
            "result": "mc:cuisine_butter_fried_rice",
            "requiredLevel": 334,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1020,
            "baseXp": 680
    },
    "cuisine_butter_pilaf": {
            "name": "mc:cuisine_butter_pilaf",
            "result": "mc:cuisine_butter_pilaf",
            "requiredLevel": 334,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 2,
                    "mc:onion_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1020,
            "baseXp": 680
    },
    "cuisine_cream_gyoza": {
            "name": "mc:cuisine_cream_gyoza",
            "result": "mc:cuisine_cream_gyoza",
            "requiredLevel": 334,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:cream_sauce": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:pepper": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1020,
            "baseXp": 680
    },
    "cuisine_butter_burger": {
            "name": "mc:cuisine_butter_burger",
            "result": "mc:cuisine_butter_burger",
            "requiredLevel": 335,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1023,
            "baseXp": 682
    },
    "cuisine_butter_gyoza": {
            "name": "mc:cuisine_butter_gyoza",
            "result": "mc:cuisine_butter_gyoza",
            "requiredLevel": 335,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1023,
            "baseXp": 682
    },
    "cuisine_butter_pasta": {
            "name": "mc:cuisine_butter_pasta",
            "result": "mc:cuisine_butter_pasta",
            "requiredLevel": 335,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1023,
            "baseXp": 682
    },
    "cuisine_butter_spaghetti": {
            "name": "mc:cuisine_butter_spaghetti",
            "result": "mc:cuisine_butter_spaghetti",
            "requiredLevel": 335,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1023,
            "baseXp": 682
    },
    "cuisine_herb_donburi": {
            "name": "mc:cuisine_herb_donburi",
            "result": "mc:cuisine_herb_donburi",
            "requiredLevel": 335,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1023,
            "baseXp": 682
    },
    "cuisine_herb_fried_rice": {
            "name": "mc:cuisine_herb_fried_rice",
            "result": "mc:cuisine_herb_fried_rice",
            "requiredLevel": 336,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1026,
            "baseXp": 684
    },
    "cuisine_herb_pasta": {
            "name": "mc:cuisine_herb_pasta",
            "result": "mc:cuisine_herb_pasta",
            "requiredLevel": 336,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1026,
            "baseXp": 684
    },
    "cuisine_herb_pilaf": {
            "name": "mc:cuisine_herb_pilaf",
            "result": "mc:cuisine_herb_pilaf",
            "requiredLevel": 336,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1026,
            "baseXp": 684
    },
    "cuisine_herb_spaghetti": {
            "name": "mc:cuisine_herb_spaghetti",
            "result": "mc:cuisine_herb_spaghetti",
            "requiredLevel": 336,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1026,
            "baseXp": 684
    },
    "cuisine_daikon_donburi": {
            "name": "mc:cuisine_daikon_donburi",
            "result": "mc:cuisine_daikon_donburi",
            "requiredLevel": 337,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_daikon_fried_rice": {
            "name": "mc:cuisine_daikon_fried_rice",
            "result": "mc:cuisine_daikon_fried_rice",
            "requiredLevel": 337,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_daikon_pasta": {
            "name": "mc:cuisine_daikon_pasta",
            "result": "mc:cuisine_daikon_pasta",
            "requiredLevel": 337,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_daikon_pilaf": {
            "name": "mc:cuisine_daikon_pilaf",
            "result": "mc:cuisine_daikon_pilaf",
            "requiredLevel": 337,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_herb_burger": {
            "name": "mc:cuisine_herb_burger",
            "result": "mc:cuisine_herb_burger",
            "requiredLevel": 337,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_herb_gyoza": {
            "name": "mc:cuisine_herb_gyoza",
            "result": "mc:cuisine_herb_gyoza",
            "requiredLevel": 337,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_burdock_donburi": {
            "name": "mc:cuisine_burdock_donburi",
            "result": "mc:cuisine_burdock_donburi",
            "requiredLevel": 338,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_burdock_fried_rice": {
            "name": "mc:cuisine_burdock_fried_rice",
            "result": "mc:cuisine_burdock_fried_rice",
            "requiredLevel": 338,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_daikon_burger": {
            "name": "mc:cuisine_daikon_burger",
            "result": "mc:cuisine_daikon_burger",
            "requiredLevel": 338,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_daikon_gyoza": {
            "name": "mc:cuisine_daikon_gyoza",
            "result": "mc:cuisine_daikon_gyoza",
            "requiredLevel": 338,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_daikon_spaghetti": {
            "name": "mc:cuisine_daikon_spaghetti",
            "result": "mc:cuisine_daikon_spaghetti",
            "requiredLevel": 338,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:daikon_grated": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_burdock_burger": {
            "name": "mc:cuisine_burdock_burger",
            "result": "mc:cuisine_burdock_burger",
            "requiredLevel": 339,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1035,
            "baseXp": 690
    },
    "cuisine_burdock_pasta": {
            "name": "mc:cuisine_burdock_pasta",
            "result": "mc:cuisine_burdock_pasta",
            "requiredLevel": 339,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1035,
            "baseXp": 690
    },
    "cuisine_burdock_pilaf": {
            "name": "mc:cuisine_burdock_pilaf",
            "result": "mc:cuisine_burdock_pilaf",
            "requiredLevel": 339,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1035,
            "baseXp": 690
    },
    "cuisine_burdock_spaghetti": {
            "name": "mc:cuisine_burdock_spaghetti",
            "result": "mc:cuisine_burdock_spaghetti",
            "requiredLevel": 339,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:syoyu": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1035,
            "baseXp": 690
    },
    "cuisine_burdock_gyoza": {
            "name": "mc:cuisine_burdock_gyoza",
            "result": "mc:cuisine_burdock_gyoza",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:burdock_shaved": 1
            },
            "seasonings": {
                    "mc:syoyu": 2
            },
            "maxSeasonings": 1,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_lotus_root_burger": {
            "name": "mc:cuisine_lotus_root_burger",
            "result": "mc:cuisine_lotus_root_burger",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_lotus_root_donburi": {
            "name": "mc:cuisine_lotus_root_donburi",
            "result": "mc:cuisine_lotus_root_donburi",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_lotus_root_fried_rice": {
            "name": "mc:cuisine_lotus_root_fried_rice",
            "result": "mc:cuisine_lotus_root_fried_rice",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_lotus_root_pasta": {
            "name": "mc:cuisine_lotus_root_pasta",
            "result": "mc:cuisine_lotus_root_pasta",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_lotus_root_pilaf": {
            "name": "mc:cuisine_lotus_root_pilaf",
            "result": "mc:cuisine_lotus_root_pilaf",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_lotus_root_spaghetti": {
            "name": "mc:cuisine_lotus_root_spaghetti",
            "result": "mc:cuisine_lotus_root_spaghetti",
            "requiredLevel": 340,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_asparagus_donburi": {
            "name": "mc:cuisine_asparagus_donburi",
            "result": "mc:cuisine_asparagus_donburi",
            "requiredLevel": 341,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_asparagus_fried_rice": {
            "name": "mc:cuisine_asparagus_fried_rice",
            "result": "mc:cuisine_asparagus_fried_rice",
            "requiredLevel": 341,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_asparagus_pasta": {
            "name": "mc:cuisine_asparagus_pasta",
            "result": "mc:cuisine_asparagus_pasta",
            "requiredLevel": 341,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_asparagus_pilaf": {
            "name": "mc:cuisine_asparagus_pilaf",
            "result": "mc:cuisine_asparagus_pilaf",
            "requiredLevel": 341,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_asparagus_spaghetti": {
            "name": "mc:cuisine_asparagus_spaghetti",
            "result": "mc:cuisine_asparagus_spaghetti",
            "requiredLevel": 341,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_lotus_root_gyoza": {
            "name": "mc:cuisine_lotus_root_gyoza",
            "result": "mc:cuisine_lotus_root_gyoza",
            "requiredLevel": 341,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:lotus_root_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:salt": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_asparagus_burger": {
            "name": "mc:cuisine_asparagus_burger",
            "result": "mc:cuisine_asparagus_burger",
            "requiredLevel": 342,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_asparagus_gyoza": {
            "name": "mc:cuisine_asparagus_gyoza",
            "result": "mc:cuisine_asparagus_gyoza",
            "requiredLevel": 342,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:asparagus_cut": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:butter": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_zucchini_donburi": {
            "name": "mc:cuisine_zucchini_donburi",
            "result": "mc:cuisine_zucchini_donburi",
            "requiredLevel": 342,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_zucchini_fried_rice": {
            "name": "mc:cuisine_zucchini_fried_rice",
            "result": "mc:cuisine_zucchini_fried_rice",
            "requiredLevel": 342,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_zucchini_pasta": {
            "name": "mc:cuisine_zucchini_pasta",
            "result": "mc:cuisine_zucchini_pasta",
            "requiredLevel": 342,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_zucchini_pilaf": {
            "name": "mc:cuisine_zucchini_pilaf",
            "result": "mc:cuisine_zucchini_pilaf",
            "requiredLevel": 342,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_pineapple_donburi": {
            "name": "mc:cuisine_pineapple_donburi",
            "result": "mc:cuisine_pineapple_donburi",
            "requiredLevel": 343,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_pineapple_fried_rice": {
            "name": "mc:cuisine_pineapple_fried_rice",
            "result": "mc:cuisine_pineapple_fried_rice",
            "requiredLevel": 343,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_zucchini_burger": {
            "name": "mc:cuisine_zucchini_burger",
            "result": "mc:cuisine_zucchini_burger",
            "requiredLevel": 343,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_zucchini_gyoza": {
            "name": "mc:cuisine_zucchini_gyoza",
            "result": "mc:cuisine_zucchini_gyoza",
            "requiredLevel": 343,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_zucchini_spaghetti": {
            "name": "mc:cuisine_zucchini_spaghetti",
            "result": "mc:cuisine_zucchini_spaghetti",
            "requiredLevel": 343,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:zucchini_slice": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "mc:ovlive_oil": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_apple_donburi": {
            "name": "mc:cuisine_apple_donburi",
            "result": "mc:cuisine_apple_donburi",
            "requiredLevel": 344,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_pineapple_burger": {
            "name": "mc:cuisine_pineapple_burger",
            "result": "mc:cuisine_pineapple_burger",
            "requiredLevel": 344,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_pineapple_gyoza": {
            "name": "mc:cuisine_pineapple_gyoza",
            "result": "mc:cuisine_pineapple_gyoza",
            "requiredLevel": 344,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_pineapple_pasta": {
            "name": "mc:cuisine_pineapple_pasta",
            "result": "mc:cuisine_pineapple_pasta",
            "requiredLevel": 344,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_pineapple_pilaf": {
            "name": "mc:cuisine_pineapple_pilaf",
            "result": "mc:cuisine_pineapple_pilaf",
            "requiredLevel": 344,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_pineapple_spaghetti": {
            "name": "mc:cuisine_pineapple_spaghetti",
            "result": "mc:cuisine_pineapple_spaghetti",
            "requiredLevel": 344,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:pineapple_cut": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_apple_burger": {
            "name": "mc:cuisine_apple_burger",
            "result": "mc:cuisine_apple_burger",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_apple_fried_rice": {
            "name": "mc:cuisine_apple_fried_rice",
            "result": "mc:cuisine_apple_fried_rice",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_apple_gyoza": {
            "name": "mc:cuisine_apple_gyoza",
            "result": "mc:cuisine_apple_gyoza",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_apple_pasta": {
            "name": "mc:cuisine_apple_pasta",
            "result": "mc:cuisine_apple_pasta",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_apple_pilaf": {
            "name": "mc:cuisine_apple_pilaf",
            "result": "mc:cuisine_apple_pilaf",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_apple_spaghetti": {
            "name": "mc:cuisine_apple_spaghetti",
            "result": "mc:cuisine_apple_spaghetti",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "minecraft:apple": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_strawberry_donburi": {
            "name": "mc:cuisine_strawberry_donburi",
            "result": "mc:cuisine_strawberry_donburi",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_strawberry_fried_rice": {
            "name": "mc:cuisine_strawberry_fried_rice",
            "result": "mc:cuisine_strawberry_fried_rice",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_strawberry_pilaf": {
            "name": "mc:cuisine_strawberry_pilaf",
            "result": "mc:cuisine_strawberry_pilaf",
            "requiredLevel": 345,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_matcha_donburi": {
            "name": "mc:cuisine_matcha_donburi",
            "result": "mc:cuisine_matcha_donburi",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_matcha_fried_rice": {
            "name": "mc:cuisine_matcha_fried_rice",
            "result": "mc:cuisine_matcha_fried_rice",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_matcha_pasta": {
            "name": "mc:cuisine_matcha_pasta",
            "result": "mc:cuisine_matcha_pasta",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_matcha_pilaf": {
            "name": "mc:cuisine_matcha_pilaf",
            "result": "mc:cuisine_matcha_pilaf",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_matcha_spaghetti": {
            "name": "mc:cuisine_matcha_spaghetti",
            "result": "mc:cuisine_matcha_spaghetti",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_strawberry_burger": {
            "name": "mc:cuisine_strawberry_burger",
            "result": "mc:cuisine_strawberry_burger",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_strawberry_gyoza": {
            "name": "mc:cuisine_strawberry_gyoza",
            "result": "mc:cuisine_strawberry_gyoza",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_strawberry_pasta": {
            "name": "mc:cuisine_strawberry_pasta",
            "result": "mc:cuisine_strawberry_pasta",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_strawberry_spaghetti": {
            "name": "mc:cuisine_strawberry_spaghetti",
            "result": "mc:cuisine_strawberry_spaghetti",
            "requiredLevel": 346,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:straw_berry": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_matcha_burger": {
            "name": "mc:cuisine_matcha_burger",
            "result": "mc:cuisine_matcha_burger",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_matcha_gyoza": {
            "name": "mc:cuisine_matcha_gyoza",
            "result": "mc:cuisine_matcha_gyoza",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:green_tea": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_burger": {
            "name": "mc:cuisine_mikan_burger",
            "result": "mc:cuisine_mikan_burger",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:buns": 1,
                    "mc:lettuce_leaf": 1,
                    "mc:tomato_slice": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:tomato_catsup": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_donburi": {
            "name": "mc:cuisine_mikan_donburi",
            "result": "mc:cuisine_mikan_donburi",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:onion_mizin": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_fried_rice": {
            "name": "mc:cuisine_mikan_fried_rice",
            "result": "mc:cuisine_mikan_fried_rice",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "minecraft:egg": 1,
                    "mc:food_oil": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_pasta": {
            "name": "mc:cuisine_mikan_pasta",
            "result": "mc:cuisine_mikan_pasta",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_pilaf": {
            "name": "mc:cuisine_mikan_pilaf",
            "result": "mc:cuisine_mikan_pilaf",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:butter": 1,
                    "mc:onion_mizin": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_spaghetti": {
            "name": "mc:cuisine_mikan_spaghetti",
            "result": "mc:cuisine_mikan_spaghetti",
            "requiredLevel": 347,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:noodle": 1,
                    "mc:ovlive_oil": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:pepper": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_mikan_gyoza": {
            "name": "mc:cuisine_mikan_gyoza",
            "result": "mc:cuisine_mikan_gyoza",
            "requiredLevel": 348,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:flour": 1,
                    "mc:cabbage_chopped": 1,
                    "mc:food_oil": 1,
                    "mc:mikan": 1
            },
            "seasonings": {
                    "mc:syoyu": 1,
                    "minecraft:sugar": 1
            },
            "maxSeasonings": 2,
            "baseMoney": 1062,
            "baseXp": 708
    },
    "homefood_asparagus_breakfast_plate": {
            "name": "mc:homefood_asparagus_breakfast_plate",
            "result": "mc:homefood_asparagus_breakfast_plate",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_asparagus_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_bread_chef_special": {
            "name": "mc:homefood_bread_chef_special",
            "result": "mc:homefood_bread_chef_special",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_bread_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_butter_bistro_saute": {
            "name": "mc:homefood_butter_bistro_saute",
            "result": "mc:homefood_butter_bistro_saute",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_butter_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_carrot_chef_special": {
            "name": "mc:homefood_carrot_chef_special",
            "result": "mc:homefood_carrot_chef_special",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_carrot_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_cheese_omelet": {
            "name": "mc:homefood_cheese_omelet",
            "result": "mc:homefood_cheese_omelet",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_cheese_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_chicken_homestyle_rice_bowl": {
            "name": "mc:homefood_chicken_homestyle_rice_bowl",
            "result": "mc:homefood_chicken_homestyle_rice_bowl",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_chicken_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_flour_omelet": {
            "name": "mc:homefood_flour_omelet",
            "result": "mc:homefood_flour_omelet",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_flour_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_herb_chef_special": {
            "name": "mc:homefood_herb_chef_special",
            "result": "mc:homefood_herb_chef_special",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_herb_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_herb_fine_plate": {
            "name": "mc:homefood_herb_fine_plate",
            "result": "mc:homefood_herb_fine_plate",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_herb_marinade": 1,
                    "mc:homeprep_herb_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_matcha_homestyle_rice_bowl": {
            "name": "mc:homefood_matcha_homestyle_rice_bowl",
            "result": "mc:homefood_matcha_homestyle_rice_bowl",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_matcha_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_pineapple_simple_skillet": {
            "name": "mc:homefood_pineapple_simple_skillet",
            "result": "mc:homefood_pineapple_simple_skillet",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pineapple_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_potato_pasta": {
            "name": "mc:homefood_potato_pasta",
            "result": "mc:homefood_potato_pasta",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_potato_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_ramen_pilaf": {
            "name": "mc:homefood_ramen_pilaf",
            "result": "mc:homefood_ramen_pilaf",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_ramen_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_sesame_omelet": {
            "name": "mc:homefood_sesame_omelet",
            "result": "mc:homefood_sesame_omelet",
            "requiredLevel": 414,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_sesame_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1260,
            "baseXp": 840
    },
    "homefood_barley_simple_skillet": {
            "name": "mc:homefood_barley_simple_skillet",
            "result": "mc:homefood_barley_simple_skillet",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_barley_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_beetroot_homestyle_rice_bowl": {
            "name": "mc:homefood_beetroot_homestyle_rice_bowl",
            "result": "mc:homefood_beetroot_homestyle_rice_bowl",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_beetroot_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_bell_pepper_breakfast_plate": {
            "name": "mc:homefood_bell_pepper_breakfast_plate",
            "result": "mc:homefood_bell_pepper_breakfast_plate",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_bell_pepper_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_butter_pasta": {
            "name": "mc:homefood_butter_pasta",
            "result": "mc:homefood_butter_pasta",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_butter_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_carrot_bistro_saute": {
            "name": "mc:homefood_carrot_bistro_saute",
            "result": "mc:homefood_carrot_bistro_saute",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_carrot_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_chocolate_breakfast_plate": {
            "name": "mc:homefood_chocolate_breakfast_plate",
            "result": "mc:homefood_chocolate_breakfast_plate",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_chocolate_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_ginger_simple_skillet": {
            "name": "mc:homefood_ginger_simple_skillet",
            "result": "mc:homefood_ginger_simple_skillet",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_ginger_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_macaroni_pasta": {
            "name": "mc:homefood_macaroni_pasta",
            "result": "mc:homefood_macaroni_pasta",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_macaroni_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_macaroni_pilaf": {
            "name": "mc:homefood_macaroni_pilaf",
            "result": "mc:homefood_macaroni_pilaf",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_macaroni_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_peanut_omelet": {
            "name": "mc:homefood_peanut_omelet",
            "result": "mc:homefood_peanut_omelet",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_peanut_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_peanut_pilaf": {
            "name": "mc:homefood_peanut_pilaf",
            "result": "mc:homefood_peanut_pilaf",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_peanut_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_pork_homestyle_rice_bowl": {
            "name": "mc:homefood_pork_homestyle_rice_bowl",
            "result": "mc:homefood_pork_homestyle_rice_bowl",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_pork_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_potato_pilaf": {
            "name": "mc:homefood_potato_pilaf",
            "result": "mc:homefood_potato_pilaf",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_potato_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_soba_omelet": {
            "name": "mc:homefood_soba_omelet",
            "result": "mc:homefood_soba_omelet",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_soba_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_tomato_homestyle_rice_bowl": {
            "name": "mc:homefood_tomato_homestyle_rice_bowl",
            "result": "mc:homefood_tomato_homestyle_rice_bowl",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_tomato_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_tortilla_fine_plate": {
            "name": "mc:homefood_tortilla_fine_plate",
            "result": "mc:homefood_tortilla_fine_plate",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tortilla_marinade": 1,
                    "mc:homeprep_tortilla_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_zucchini_breakfast_plate": {
            "name": "mc:homefood_zucchini_breakfast_plate",
            "result": "mc:homefood_zucchini_breakfast_plate",
            "requiredLevel": 415,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_zucchini_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1263,
            "baseXp": 842
    },
    "homefood_apple_simple_skillet": {
            "name": "mc:homefood_apple_simple_skillet",
            "result": "mc:homefood_apple_simple_skillet",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_apple_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_bread_bistro_saute": {
            "name": "mc:homefood_bread_bistro_saute",
            "result": "mc:homefood_bread_bistro_saute",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_bread_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_buns_chef_special": {
            "name": "mc:homefood_buns_chef_special",
            "result": "mc:homefood_buns_chef_special",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_buns_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_buns_fine_plate": {
            "name": "mc:homefood_buns_fine_plate",
            "result": "mc:homefood_buns_fine_plate",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_buns_marinade": 1,
                    "mc:homeprep_buns_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_butter_chef_special": {
            "name": "mc:homefood_butter_chef_special",
            "result": "mc:homefood_butter_chef_special",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_butter_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_carrot_pasta": {
            "name": "mc:homefood_carrot_pasta",
            "result": "mc:homefood_carrot_pasta",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_carrot_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_cream_pasta": {
            "name": "mc:homefood_cream_pasta",
            "result": "mc:homefood_cream_pasta",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cream_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_daikon_fine_plate": {
            "name": "mc:homefood_daikon_fine_plate",
            "result": "mc:homefood_daikon_fine_plate",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_daikon_marinade": 1,
                    "mc:homeprep_daikon_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_herb_bistro_saute": {
            "name": "mc:homefood_herb_bistro_saute",
            "result": "mc:homefood_herb_bistro_saute",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_herb_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_honey_homestyle_rice_bowl": {
            "name": "mc:homefood_honey_homestyle_rice_bowl",
            "result": "mc:homefood_honey_homestyle_rice_bowl",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_honey_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_mikan_homestyle_rice_bowl": {
            "name": "mc:homefood_mikan_homestyle_rice_bowl",
            "result": "mc:homefood_mikan_homestyle_rice_bowl",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_mikan_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_mushroom_omelet": {
            "name": "mc:homefood_mushroom_omelet",
            "result": "mc:homefood_mushroom_omelet",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_mushroom_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_mushroom_pilaf": {
            "name": "mc:homefood_mushroom_pilaf",
            "result": "mc:homefood_mushroom_pilaf",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_mushroom_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_onion_chef_special": {
            "name": "mc:homefood_onion_chef_special",
            "result": "mc:homefood_onion_chef_special",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_onion_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_onion_fine_plate": {
            "name": "mc:homefood_onion_fine_plate",
            "result": "mc:homefood_onion_fine_plate",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_onion_marinade": 1,
                    "mc:homeprep_onion_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_pumpkin_simple_skillet": {
            "name": "mc:homefood_pumpkin_simple_skillet",
            "result": "mc:homefood_pumpkin_simple_skillet",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pumpkin_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_spinach_fine_plate": {
            "name": "mc:homefood_spinach_fine_plate",
            "result": "mc:homefood_spinach_fine_plate",
            "requiredLevel": 416,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_spinach_marinade": 1,
                    "mc:homeprep_spinach_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1266,
            "baseXp": 844
    },
    "homefood_beef_homestyle_rice_bowl": {
            "name": "mc:homefood_beef_homestyle_rice_bowl",
            "result": "mc:homefood_beef_homestyle_rice_bowl",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_beef_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_bread_pasta": {
            "name": "mc:homefood_bread_pasta",
            "result": "mc:homefood_bread_pasta",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_bread_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_carrot_pilaf": {
            "name": "mc:homefood_carrot_pilaf",
            "result": "mc:homefood_carrot_pilaf",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_carrot_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_coffee_breakfast_plate": {
            "name": "mc:homefood_coffee_breakfast_plate",
            "result": "mc:homefood_coffee_breakfast_plate",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_coffee_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_cream_omelet": {
            "name": "mc:homefood_cream_omelet",
            "result": "mc:homefood_cream_omelet",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_cream_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_cream_pilaf": {
            "name": "mc:homefood_cream_pilaf",
            "result": "mc:homefood_cream_pilaf",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_cream_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_curry_homestyle_rice_bowl": {
            "name": "mc:homefood_curry_homestyle_rice_bowl",
            "result": "mc:homefood_curry_homestyle_rice_bowl",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_curry_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_daikon_chef_special": {
            "name": "mc:homefood_daikon_chef_special",
            "result": "mc:homefood_daikon_chef_special",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_daikon_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_garlic_simple_skillet": {
            "name": "mc:homefood_garlic_simple_skillet",
            "result": "mc:homefood_garlic_simple_skillet",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_garlic_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_herb_pasta": {
            "name": "mc:homefood_herb_pasta",
            "result": "mc:homefood_herb_pasta",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_herb_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_kelp_homestyle_rice_bowl": {
            "name": "mc:homefood_kelp_homestyle_rice_bowl",
            "result": "mc:homefood_kelp_homestyle_rice_bowl",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_kelp_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_leek_breakfast_plate": {
            "name": "mc:homefood_leek_breakfast_plate",
            "result": "mc:homefood_leek_breakfast_plate",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_leek_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_onion_bistro_saute": {
            "name": "mc:homefood_onion_bistro_saute",
            "result": "mc:homefood_onion_bistro_saute",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_onion_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_pie_dough_fine_plate": {
            "name": "mc:homefood_pie_dough_fine_plate",
            "result": "mc:homefood_pie_dough_fine_plate",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pie_dough_marinade": 1,
                    "mc:homeprep_pie_dough_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_ramen_omelet": {
            "name": "mc:homefood_ramen_omelet",
            "result": "mc:homefood_ramen_omelet",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_ramen_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_tortilla_bistro_saute": {
            "name": "mc:homefood_tortilla_bistro_saute",
            "result": "mc:homefood_tortilla_bistro_saute",
            "requiredLevel": 417,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tortilla_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1269,
            "baseXp": 846
    },
    "homefood_anko_homestyle_rice_bowl": {
            "name": "mc:homefood_anko_homestyle_rice_bowl",
            "result": "mc:homefood_anko_homestyle_rice_bowl",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_anko_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_beetroot_simple_skillet": {
            "name": "mc:homefood_beetroot_simple_skillet",
            "result": "mc:homefood_beetroot_simple_skillet",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_beetroot_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_bread_omelet": {
            "name": "mc:homefood_bread_omelet",
            "result": "mc:homefood_bread_omelet",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_bread_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_bread_pilaf": {
            "name": "mc:homefood_bread_pilaf",
            "result": "mc:homefood_bread_pilaf",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_bread_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_buns_bistro_saute": {
            "name": "mc:homefood_buns_bistro_saute",
            "result": "mc:homefood_buns_bistro_saute",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_buns_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_burdock_fine_plate": {
            "name": "mc:homefood_burdock_fine_plate",
            "result": "mc:homefood_burdock_fine_plate",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_burdock_marinade": 1,
                    "mc:homeprep_burdock_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_cabbage_chef_special": {
            "name": "mc:homefood_cabbage_chef_special",
            "result": "mc:homefood_cabbage_chef_special",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_cabbage_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_cabbage_fine_plate": {
            "name": "mc:homefood_cabbage_fine_plate",
            "result": "mc:homefood_cabbage_fine_plate",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cabbage_marinade": 1,
                    "mc:homeprep_cabbage_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_daikon_bistro_saute": {
            "name": "mc:homefood_daikon_bistro_saute",
            "result": "mc:homefood_daikon_bistro_saute",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_daikon_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_pineapple_breakfast_plate": {
            "name": "mc:homefood_pineapple_breakfast_plate",
            "result": "mc:homefood_pineapple_breakfast_plate",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_pineapple_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_rice_homestyle_rice_bowl": {
            "name": "mc:homefood_rice_homestyle_rice_bowl",
            "result": "mc:homefood_rice_homestyle_rice_bowl",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_rice_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_soy_sauce_homestyle_rice_bowl": {
            "name": "mc:homefood_soy_sauce_homestyle_rice_bowl",
            "result": "mc:homefood_soy_sauce_homestyle_rice_bowl",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_soy_sauce_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_spinach_bistro_saute": {
            "name": "mc:homefood_spinach_bistro_saute",
            "result": "mc:homefood_spinach_bistro_saute",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_spinach_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_strawberry_simple_skillet": {
            "name": "mc:homefood_strawberry_simple_skillet",
            "result": "mc:homefood_strawberry_simple_skillet",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_strawberry_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_sweet_corn_breakfast_plate": {
            "name": "mc:homefood_sweet_corn_breakfast_plate",
            "result": "mc:homefood_sweet_corn_breakfast_plate",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_sweet_corn_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_sweet_corn_simple_skillet": {
            "name": "mc:homefood_sweet_corn_simple_skillet",
            "result": "mc:homefood_sweet_corn_simple_skillet",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_sweet_corn_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_tomato_simple_skillet": {
            "name": "mc:homefood_tomato_simple_skillet",
            "result": "mc:homefood_tomato_simple_skillet",
            "requiredLevel": 418,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tomato_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1272,
            "baseXp": 848
    },
    "homefood_bacon_homestyle_rice_bowl": {
            "name": "mc:homefood_bacon_homestyle_rice_bowl",
            "result": "mc:homefood_bacon_homestyle_rice_bowl",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_bacon_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_buns_pasta": {
            "name": "mc:homefood_buns_pasta",
            "result": "mc:homefood_buns_pasta",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_buns_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_burdock_chef_special": {
            "name": "mc:homefood_burdock_chef_special",
            "result": "mc:homefood_burdock_chef_special",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_burdock_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_butter_pilaf": {
            "name": "mc:homefood_butter_pilaf",
            "result": "mc:homefood_butter_pilaf",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_butter_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_chicken_simple_skillet": {
            "name": "mc:homefood_chicken_simple_skillet",
            "result": "mc:homefood_chicken_simple_skillet",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chicken_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_chili_simple_skillet": {
            "name": "mc:homefood_chili_simple_skillet",
            "result": "mc:homefood_chili_simple_skillet",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_chili_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_custard_fine_plate": {
            "name": "mc:homefood_custard_fine_plate",
            "result": "mc:homefood_custard_fine_plate",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_custard_marinade": 1,
                    "mc:homeprep_custard_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_daikon_pasta": {
            "name": "mc:homefood_daikon_pasta",
            "result": "mc:homefood_daikon_pasta",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_daikon_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_eggplant_fine_plate": {
            "name": "mc:homefood_eggplant_fine_plate",
            "result": "mc:homefood_eggplant_fine_plate",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_eggplant_marinade": 1,
                    "mc:homeprep_eggplant_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_ginger_breakfast_plate": {
            "name": "mc:homefood_ginger_breakfast_plate",
            "result": "mc:homefood_ginger_breakfast_plate",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_ginger_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_macaroni_omelet": {
            "name": "mc:homefood_macaroni_omelet",
            "result": "mc:homefood_macaroni_omelet",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_macaroni_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_miso_homestyle_rice_bowl": {
            "name": "mc:homefood_miso_homestyle_rice_bowl",
            "result": "mc:homefood_miso_homestyle_rice_bowl",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_miso_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_onion_pasta": {
            "name": "mc:homefood_onion_pasta",
            "result": "mc:homefood_onion_pasta",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_onion_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_onion_pilaf": {
            "name": "mc:homefood_onion_pilaf",
            "result": "mc:homefood_onion_pilaf",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_onion_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_pie_dough_bistro_saute": {
            "name": "mc:homefood_pie_dough_bistro_saute",
            "result": "mc:homefood_pie_dough_bistro_saute",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pie_dough_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_potato_omelet": {
            "name": "mc:homefood_potato_omelet",
            "result": "mc:homefood_potato_omelet",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_potato_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_tortilla_chef_special": {
            "name": "mc:homefood_tortilla_chef_special",
            "result": "mc:homefood_tortilla_chef_special",
            "requiredLevel": 419,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_tortilla_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1275,
            "baseXp": 850
    },
    "homefood_apple_breakfast_plate": {
            "name": "mc:homefood_apple_breakfast_plate",
            "result": "mc:homefood_apple_breakfast_plate",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_apple_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_barley_breakfast_plate": {
            "name": "mc:homefood_barley_breakfast_plate",
            "result": "mc:homefood_barley_breakfast_plate",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_barley_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_buns_omelet": {
            "name": "mc:homefood_buns_omelet",
            "result": "mc:homefood_buns_omelet",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_buns_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_buns_pilaf": {
            "name": "mc:homefood_buns_pilaf",
            "result": "mc:homefood_buns_pilaf",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_buns_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_burdock_bistro_saute": {
            "name": "mc:homefood_burdock_bistro_saute",
            "result": "mc:homefood_burdock_bistro_saute",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_burdock_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_butter_omelet": {
            "name": "mc:homefood_butter_omelet",
            "result": "mc:homefood_butter_omelet",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_butter_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_cabbage_bistro_saute": {
            "name": "mc:homefood_cabbage_bistro_saute",
            "result": "mc:homefood_cabbage_bistro_saute",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cabbage_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_chili_breakfast_plate": {
            "name": "mc:homefood_chili_breakfast_plate",
            "result": "mc:homefood_chili_breakfast_plate",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_chili_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_curry_simple_skillet": {
            "name": "mc:homefood_curry_simple_skillet",
            "result": "mc:homefood_curry_simple_skillet",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_curry_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_custard_chef_special": {
            "name": "mc:homefood_custard_chef_special",
            "result": "mc:homefood_custard_chef_special",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_custard_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_daikon_pilaf": {
            "name": "mc:homefood_daikon_pilaf",
            "result": "mc:homefood_daikon_pilaf",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_daikon_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_matcha_simple_skillet": {
            "name": "mc:homefood_matcha_simple_skillet",
            "result": "mc:homefood_matcha_simple_skillet",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_matcha_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_onion_omelet": {
            "name": "mc:homefood_onion_omelet",
            "result": "mc:homefood_onion_omelet",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_onion_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_pie_dough_pasta": {
            "name": "mc:homefood_pie_dough_pasta",
            "result": "mc:homefood_pie_dough_pasta",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pie_dough_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_spinach_chef_special": {
            "name": "mc:homefood_spinach_chef_special",
            "result": "mc:homefood_spinach_chef_special",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_spinach_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_teriyaki_homestyle_rice_bowl": {
            "name": "mc:homefood_teriyaki_homestyle_rice_bowl",
            "result": "mc:homefood_teriyaki_homestyle_rice_bowl",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_teriyaki_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_vinegared_rice_homestyle_rice_bowl": {
            "name": "mc:homefood_vinegared_rice_homestyle_rice_bowl",
            "result": "mc:homefood_vinegared_rice_homestyle_rice_bowl",
            "requiredLevel": 420,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_vinegared_rice_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1278,
            "baseXp": 852
    },
    "homefood_bell_pepper_chef_special": {
            "name": "mc:homefood_bell_pepper_chef_special",
            "result": "mc:homefood_bell_pepper_chef_special",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_bell_pepper_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_bell_pepper_fine_plate": {
            "name": "mc:homefood_bell_pepper_fine_plate",
            "result": "mc:homefood_bell_pepper_fine_plate",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_bell_pepper_marinade": 1,
                    "mc:homeprep_bell_pepper_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_burdock_pasta": {
            "name": "mc:homefood_burdock_pasta",
            "result": "mc:homefood_burdock_pasta",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_burdock_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_cabbage_pasta": {
            "name": "mc:homefood_cabbage_pasta",
            "result": "mc:homefood_cabbage_pasta",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_cabbage_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_cabbage_pilaf": {
            "name": "mc:homefood_cabbage_pilaf",
            "result": "mc:homefood_cabbage_pilaf",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_cabbage_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_carrot_omelet": {
            "name": "mc:homefood_carrot_omelet",
            "result": "mc:homefood_carrot_omelet",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_carrot_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_custard_bistro_saute": {
            "name": "mc:homefood_custard_bistro_saute",
            "result": "mc:homefood_custard_bistro_saute",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_custard_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_eggplant_bistro_saute": {
            "name": "mc:homefood_eggplant_bistro_saute",
            "result": "mc:homefood_eggplant_bistro_saute",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_eggplant_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_garlic_breakfast_plate": {
            "name": "mc:homefood_garlic_breakfast_plate",
            "result": "mc:homefood_garlic_breakfast_plate",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_garlic_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_herb_pilaf": {
            "name": "mc:homefood_herb_pilaf",
            "result": "mc:homefood_herb_pilaf",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_herb_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_kelp_simple_skillet": {
            "name": "mc:homefood_kelp_simple_skillet",
            "result": "mc:homefood_kelp_simple_skillet",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_kelp_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_lotus_root_chef_special": {
            "name": "mc:homefood_lotus_root_chef_special",
            "result": "mc:homefood_lotus_root_chef_special",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_lotus_root_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_lotus_root_fine_plate": {
            "name": "mc:homefood_lotus_root_fine_plate",
            "result": "mc:homefood_lotus_root_fine_plate",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_lotus_root_marinade": 1,
                    "mc:homeprep_lotus_root_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_milk_homestyle_rice_bowl": {
            "name": "mc:homefood_milk_homestyle_rice_bowl",
            "result": "mc:homefood_milk_homestyle_rice_bowl",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_milk_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_pie_dough_chef_special": {
            "name": "mc:homefood_pie_dough_chef_special",
            "result": "mc:homefood_pie_dough_chef_special",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pie_dough_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_pumpkin_breakfast_plate": {
            "name": "mc:homefood_pumpkin_breakfast_plate",
            "result": "mc:homefood_pumpkin_breakfast_plate",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pumpkin_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_tortilla_pasta": {
            "name": "mc:homefood_tortilla_pasta",
            "result": "mc:homefood_tortilla_pasta",
            "requiredLevel": 421,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_tortilla_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1281,
            "baseXp": 854
    },
    "homefood_burdock_pilaf": {
            "name": "mc:homefood_burdock_pilaf",
            "result": "mc:homefood_burdock_pilaf",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_burdock_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_cabbage_omelet": {
            "name": "mc:homefood_cabbage_omelet",
            "result": "mc:homefood_cabbage_omelet",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_cabbage_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_chocolate_chef_special": {
            "name": "mc:homefood_chocolate_chef_special",
            "result": "mc:homefood_chocolate_chef_special",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_chocolate_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_chocolate_fine_plate": {
            "name": "mc:homefood_chocolate_fine_plate",
            "result": "mc:homefood_chocolate_fine_plate",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chocolate_marinade": 1,
                    "mc:homeprep_chocolate_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_custard_pasta": {
            "name": "mc:homefood_custard_pasta",
            "result": "mc:homefood_custard_pasta",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_custard_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_egg_homestyle_rice_bowl": {
            "name": "mc:homefood_egg_homestyle_rice_bowl",
            "result": "mc:homefood_egg_homestyle_rice_bowl",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_egg_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_eggplant_pasta": {
            "name": "mc:homefood_eggplant_pasta",
            "result": "mc:homefood_eggplant_pasta",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_eggplant_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_herb_omelet": {
            "name": "mc:homefood_herb_omelet",
            "result": "mc:homefood_herb_omelet",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_herb_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_mikan_simple_skillet": {
            "name": "mc:homefood_mikan_simple_skillet",
            "result": "mc:homefood_mikan_simple_skillet",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_mikan_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_miso_simple_skillet": {
            "name": "mc:homefood_miso_simple_skillet",
            "result": "mc:homefood_miso_simple_skillet",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_miso_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_pork_simple_skillet": {
            "name": "mc:homefood_pork_simple_skillet",
            "result": "mc:homefood_pork_simple_skillet",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_pork_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_sesame_homestyle_rice_bowl": {
            "name": "mc:homefood_sesame_homestyle_rice_bowl",
            "result": "mc:homefood_sesame_homestyle_rice_bowl",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_sesame_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_strawberry_breakfast_plate": {
            "name": "mc:homefood_strawberry_breakfast_plate",
            "result": "mc:homefood_strawberry_breakfast_plate",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_strawberry_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_tomato_breakfast_plate": {
            "name": "mc:homefood_tomato_breakfast_plate",
            "result": "mc:homefood_tomato_breakfast_plate",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_tomato_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_tortilla_pilaf": {
            "name": "mc:homefood_tortilla_pilaf",
            "result": "mc:homefood_tortilla_pilaf",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_tortilla_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_udon_homestyle_rice_bowl": {
            "name": "mc:homefood_udon_homestyle_rice_bowl",
            "result": "mc:homefood_udon_homestyle_rice_bowl",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_udon_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_zucchini_fine_plate": {
            "name": "mc:homefood_zucchini_fine_plate",
            "result": "mc:homefood_zucchini_fine_plate",
            "requiredLevel": 422,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_zucchini_marinade": 1,
                    "mc:homeprep_zucchini_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1284,
            "baseXp": 856
    },
    "homefood_asparagus_chef_special": {
            "name": "mc:homefood_asparagus_chef_special",
            "result": "mc:homefood_asparagus_chef_special",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_asparagus_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_asparagus_fine_plate": {
            "name": "mc:homefood_asparagus_fine_plate",
            "result": "mc:homefood_asparagus_fine_plate",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_asparagus_marinade": 1,
                    "mc:homeprep_asparagus_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_beetroot_breakfast_plate": {
            "name": "mc:homefood_beetroot_breakfast_plate",
            "result": "mc:homefood_beetroot_breakfast_plate",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_beetroot_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_bell_pepper_bistro_saute": {
            "name": "mc:homefood_bell_pepper_bistro_saute",
            "result": "mc:homefood_bell_pepper_bistro_saute",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_bell_pepper_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_chicken_breakfast_plate": {
            "name": "mc:homefood_chicken_breakfast_plate",
            "result": "mc:homefood_chicken_breakfast_plate",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_chicken_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_chocolate_bistro_saute": {
            "name": "mc:homefood_chocolate_bistro_saute",
            "result": "mc:homefood_chocolate_bistro_saute",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chocolate_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_eggplant_chef_special": {
            "name": "mc:homefood_eggplant_chef_special",
            "result": "mc:homefood_eggplant_chef_special",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_eggplant_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_flour_homestyle_rice_bowl": {
            "name": "mc:homefood_flour_homestyle_rice_bowl",
            "result": "mc:homefood_flour_homestyle_rice_bowl",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_flour_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_honey_simple_skillet": {
            "name": "mc:homefood_honey_simple_skillet",
            "result": "mc:homefood_honey_simple_skillet",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_honey_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_leek_chef_special": {
            "name": "mc:homefood_leek_chef_special",
            "result": "mc:homefood_leek_chef_special",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_leek_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_leek_fine_plate": {
            "name": "mc:homefood_leek_fine_plate",
            "result": "mc:homefood_leek_fine_plate",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_leek_marinade": 1,
                    "mc:homeprep_leek_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_lotus_root_bistro_saute": {
            "name": "mc:homefood_lotus_root_bistro_saute",
            "result": "mc:homefood_lotus_root_bistro_saute",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_lotus_root_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_ramen_homestyle_rice_bowl": {
            "name": "mc:homefood_ramen_homestyle_rice_bowl",
            "result": "mc:homefood_ramen_homestyle_rice_bowl",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_ramen_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_spinach_pasta": {
            "name": "mc:homefood_spinach_pasta",
            "result": "mc:homefood_spinach_pasta",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_spinach_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_tortilla_omelet": {
            "name": "mc:homefood_tortilla_omelet",
            "result": "mc:homefood_tortilla_omelet",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_tortilla_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_vinegared_rice_simple_skillet": {
            "name": "mc:homefood_vinegared_rice_simple_skillet",
            "result": "mc:homefood_vinegared_rice_simple_skillet",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_zucchini_bistro_saute": {
            "name": "mc:homefood_zucchini_bistro_saute",
            "result": "mc:homefood_zucchini_bistro_saute",
            "requiredLevel": 423,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_zucchini_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1287,
            "baseXp": 858
    },
    "homefood_beef_simple_skillet": {
            "name": "mc:homefood_beef_simple_skillet",
            "result": "mc:homefood_beef_simple_skillet",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_beef_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_bell_pepper_pasta": {
            "name": "mc:homefood_bell_pepper_pasta",
            "result": "mc:homefood_bell_pepper_pasta",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_bell_pepper_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_cheese_homestyle_rice_bowl": {
            "name": "mc:homefood_cheese_homestyle_rice_bowl",
            "result": "mc:homefood_cheese_homestyle_rice_bowl",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_cheese_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_chocolate_pasta": {
            "name": "mc:homefood_chocolate_pasta",
            "result": "mc:homefood_chocolate_pasta",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_chocolate_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_coffee_chef_special": {
            "name": "mc:homefood_coffee_chef_special",
            "result": "mc:homefood_coffee_chef_special",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_coffee_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_coffee_fine_plate": {
            "name": "mc:homefood_coffee_fine_plate",
            "result": "mc:homefood_coffee_fine_plate",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_coffee_marinade": 1,
                    "mc:homeprep_coffee_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_curry_breakfast_plate": {
            "name": "mc:homefood_curry_breakfast_plate",
            "result": "mc:homefood_curry_breakfast_plate",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_curry_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_daikon_omelet": {
            "name": "mc:homefood_daikon_omelet",
            "result": "mc:homefood_daikon_omelet",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_daikon_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_lotus_root_pasta": {
            "name": "mc:homefood_lotus_root_pasta",
            "result": "mc:homefood_lotus_root_pasta",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_lotus_root_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_lotus_root_pilaf": {
            "name": "mc:homefood_lotus_root_pilaf",
            "result": "mc:homefood_lotus_root_pilaf",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_lotus_root_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_matcha_breakfast_plate": {
            "name": "mc:homefood_matcha_breakfast_plate",
            "result": "mc:homefood_matcha_breakfast_plate",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_matcha_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_pie_dough_pilaf": {
            "name": "mc:homefood_pie_dough_pilaf",
            "result": "mc:homefood_pie_dough_pilaf",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pie_dough_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_pineapple_fine_plate": {
            "name": "mc:homefood_pineapple_fine_plate",
            "result": "mc:homefood_pineapple_fine_plate",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pineapple_marinade": 1,
                    "mc:homeprep_pineapple_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_rice_simple_skillet": {
            "name": "mc:homefood_rice_simple_skillet",
            "result": "mc:homefood_rice_simple_skillet",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_rice_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_soba_homestyle_rice_bowl": {
            "name": "mc:homefood_soba_homestyle_rice_bowl",
            "result": "mc:homefood_soba_homestyle_rice_bowl",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_soba_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_spinach_omelet": {
            "name": "mc:homefood_spinach_omelet",
            "result": "mc:homefood_spinach_omelet",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_spinach_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_spinach_pilaf": {
            "name": "mc:homefood_spinach_pilaf",
            "result": "mc:homefood_spinach_pilaf",
            "requiredLevel": 424,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_spinach_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1290,
            "baseXp": 860
    },
    "homefood_anko_simple_skillet": {
            "name": "mc:homefood_anko_simple_skillet",
            "result": "mc:homefood_anko_simple_skillet",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_anko_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_asparagus_bistro_saute": {
            "name": "mc:homefood_asparagus_bistro_saute",
            "result": "mc:homefood_asparagus_bistro_saute",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_asparagus_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_chocolate_pilaf": {
            "name": "mc:homefood_chocolate_pilaf",
            "result": "mc:homefood_chocolate_pilaf",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_chocolate_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_coffee_bistro_saute": {
            "name": "mc:homefood_coffee_bistro_saute",
            "result": "mc:homefood_coffee_bistro_saute",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_coffee_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_egg_simple_skillet": {
            "name": "mc:homefood_egg_simple_skillet",
            "result": "mc:homefood_egg_simple_skillet",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_egg_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_ginger_fine_plate": {
            "name": "mc:homefood_ginger_fine_plate",
            "result": "mc:homefood_ginger_fine_plate",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_ginger_marinade": 1,
                    "mc:homeprep_ginger_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_kelp_breakfast_plate": {
            "name": "mc:homefood_kelp_breakfast_plate",
            "result": "mc:homefood_kelp_breakfast_plate",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_kelp_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_leek_bistro_saute": {
            "name": "mc:homefood_leek_bistro_saute",
            "result": "mc:homefood_leek_bistro_saute",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_leek_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_lotus_root_omelet": {
            "name": "mc:homefood_lotus_root_omelet",
            "result": "mc:homefood_lotus_root_omelet",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_lotus_root_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_macaroni_homestyle_rice_bowl": {
            "name": "mc:homefood_macaroni_homestyle_rice_bowl",
            "result": "mc:homefood_macaroni_homestyle_rice_bowl",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_macaroni_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_peanut_homestyle_rice_bowl": {
            "name": "mc:homefood_peanut_homestyle_rice_bowl",
            "result": "mc:homefood_peanut_homestyle_rice_bowl",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_peanut_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_pie_dough_omelet": {
            "name": "mc:homefood_pie_dough_omelet",
            "result": "mc:homefood_pie_dough_omelet",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_pie_dough_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_potato_homestyle_rice_bowl": {
            "name": "mc:homefood_potato_homestyle_rice_bowl",
            "result": "mc:homefood_potato_homestyle_rice_bowl",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_potato_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_rice_breakfast_plate": {
            "name": "mc:homefood_rice_breakfast_plate",
            "result": "mc:homefood_rice_breakfast_plate",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_rice_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_soy_sauce_simple_skillet": {
            "name": "mc:homefood_soy_sauce_simple_skillet",
            "result": "mc:homefood_soy_sauce_simple_skillet",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_soy_sauce_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_udon_simple_skillet": {
            "name": "mc:homefood_udon_simple_skillet",
            "result": "mc:homefood_udon_simple_skillet",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_udon_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_zucchini_chef_special": {
            "name": "mc:homefood_zucchini_chef_special",
            "result": "mc:homefood_zucchini_chef_special",
            "requiredLevel": 425,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_zucchini_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1293,
            "baseXp": 862
    },
    "homefood_apple_chef_special": {
            "name": "mc:homefood_apple_chef_special",
            "result": "mc:homefood_apple_chef_special",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_apple_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_apple_fine_plate": {
            "name": "mc:homefood_apple_fine_plate",
            "result": "mc:homefood_apple_fine_plate",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_apple_marinade": 1,
                    "mc:homeprep_apple_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_asparagus_pasta": {
            "name": "mc:homefood_asparagus_pasta",
            "result": "mc:homefood_asparagus_pasta",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_asparagus_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_asparagus_pilaf": {
            "name": "mc:homefood_asparagus_pilaf",
            "result": "mc:homefood_asparagus_pilaf",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_asparagus_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_bacon_simple_skillet": {
            "name": "mc:homefood_bacon_simple_skillet",
            "result": "mc:homefood_bacon_simple_skillet",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_bacon_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_barley_chef_special": {
            "name": "mc:homefood_barley_chef_special",
            "result": "mc:homefood_barley_chef_special",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_barley_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_barley_fine_plate": {
            "name": "mc:homefood_barley_fine_plate",
            "result": "mc:homefood_barley_fine_plate",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_barley_marinade": 1,
                    "mc:homeprep_barley_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_burdock_omelet": {
            "name": "mc:homefood_burdock_omelet",
            "result": "mc:homefood_burdock_omelet",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_burdock_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_custard_pilaf": {
            "name": "mc:homefood_custard_pilaf",
            "result": "mc:homefood_custard_pilaf",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_custard_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_eggplant_omelet": {
            "name": "mc:homefood_eggplant_omelet",
            "result": "mc:homefood_eggplant_omelet",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_eggplant_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_eggplant_pilaf": {
            "name": "mc:homefood_eggplant_pilaf",
            "result": "mc:homefood_eggplant_pilaf",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_eggplant_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_ginger_chef_special": {
            "name": "mc:homefood_ginger_chef_special",
            "result": "mc:homefood_ginger_chef_special",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_ginger_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_leek_pasta": {
            "name": "mc:homefood_leek_pasta",
            "result": "mc:homefood_leek_pasta",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_leek_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_mikan_breakfast_plate": {
            "name": "mc:homefood_mikan_breakfast_plate",
            "result": "mc:homefood_mikan_breakfast_plate",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_mikan_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_mushroom_homestyle_rice_bowl": {
            "name": "mc:homefood_mushroom_homestyle_rice_bowl",
            "result": "mc:homefood_mushroom_homestyle_rice_bowl",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_mushroom_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_pineapple_bistro_saute": {
            "name": "mc:homefood_pineapple_bistro_saute",
            "result": "mc:homefood_pineapple_bistro_saute",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pineapple_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_pork_breakfast_plate": {
            "name": "mc:homefood_pork_breakfast_plate",
            "result": "mc:homefood_pork_breakfast_plate",
            "requiredLevel": 426,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pork_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1296,
            "baseXp": 864
    },
    "homefood_asparagus_omelet": {
            "name": "mc:homefood_asparagus_omelet",
            "result": "mc:homefood_asparagus_omelet",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_asparagus_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_bacon_breakfast_plate": {
            "name": "mc:homefood_bacon_breakfast_plate",
            "result": "mc:homefood_bacon_breakfast_plate",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_bacon_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_carrot_homestyle_rice_bowl": {
            "name": "mc:homefood_carrot_homestyle_rice_bowl",
            "result": "mc:homefood_carrot_homestyle_rice_bowl",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_carrot_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_cheese_simple_skillet": {
            "name": "mc:homefood_cheese_simple_skillet",
            "result": "mc:homefood_cheese_simple_skillet",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_cheese_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_coffee_pasta": {
            "name": "mc:homefood_coffee_pasta",
            "result": "mc:homefood_coffee_pasta",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_coffee_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_coffee_pilaf": {
            "name": "mc:homefood_coffee_pilaf",
            "result": "mc:homefood_coffee_pilaf",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_coffee_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_cream_homestyle_rice_bowl": {
            "name": "mc:homefood_cream_homestyle_rice_bowl",
            "result": "mc:homefood_cream_homestyle_rice_bowl",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_cream_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_custard_omelet": {
            "name": "mc:homefood_custard_omelet",
            "result": "mc:homefood_custard_omelet",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_custard_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_ginger_bistro_saute": {
            "name": "mc:homefood_ginger_bistro_saute",
            "result": "mc:homefood_ginger_bistro_saute",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_ginger_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_honey_breakfast_plate": {
            "name": "mc:homefood_honey_breakfast_plate",
            "result": "mc:homefood_honey_breakfast_plate",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_honey_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_leek_pilaf": {
            "name": "mc:homefood_leek_pilaf",
            "result": "mc:homefood_leek_pilaf",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_leek_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_milk_simple_skillet": {
            "name": "mc:homefood_milk_simple_skillet",
            "result": "mc:homefood_milk_simple_skillet",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_milk_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_miso_breakfast_plate": {
            "name": "mc:homefood_miso_breakfast_plate",
            "result": "mc:homefood_miso_breakfast_plate",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_miso_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_pineapple_pasta": {
            "name": "mc:homefood_pineapple_pasta",
            "result": "mc:homefood_pineapple_pasta",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pineapple_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_pumpkin_fine_plate": {
            "name": "mc:homefood_pumpkin_fine_plate",
            "result": "mc:homefood_pumpkin_fine_plate",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pumpkin_marinade": 1,
                    "mc:homeprep_pumpkin_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_teriyaki_simple_skillet": {
            "name": "mc:homefood_teriyaki_simple_skillet",
            "result": "mc:homefood_teriyaki_simple_skillet",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_teriyaki_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_vinegared_rice_breakfast_plate": {
            "name": "mc:homefood_vinegared_rice_breakfast_plate",
            "result": "mc:homefood_vinegared_rice_breakfast_plate",
            "requiredLevel": 427,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1299,
            "baseXp": 866
    },
    "homefood_apple_bistro_saute": {
            "name": "mc:homefood_apple_bistro_saute",
            "result": "mc:homefood_apple_bistro_saute",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_apple_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_barley_bistro_saute": {
            "name": "mc:homefood_barley_bistro_saute",
            "result": "mc:homefood_barley_bistro_saute",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_barley_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_beef_breakfast_plate": {
            "name": "mc:homefood_beef_breakfast_plate",
            "result": "mc:homefood_beef_breakfast_plate",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_beef_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_bell_pepper_omelet": {
            "name": "mc:homefood_bell_pepper_omelet",
            "result": "mc:homefood_bell_pepper_omelet",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_bell_pepper_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_bell_pepper_pilaf": {
            "name": "mc:homefood_bell_pepper_pilaf",
            "result": "mc:homefood_bell_pepper_pilaf",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_bell_pepper_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_bread_homestyle_rice_bowl": {
            "name": "mc:homefood_bread_homestyle_rice_bowl",
            "result": "mc:homefood_bread_homestyle_rice_bowl",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_bread_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_garlic_chef_special": {
            "name": "mc:homefood_garlic_chef_special",
            "result": "mc:homefood_garlic_chef_special",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_garlic_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_garlic_fine_plate": {
            "name": "mc:homefood_garlic_fine_plate",
            "result": "mc:homefood_garlic_fine_plate",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_garlic_marinade": 1,
                    "mc:homeprep_garlic_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_ginger_pasta": {
            "name": "mc:homefood_ginger_pasta",
            "result": "mc:homefood_ginger_pasta",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_ginger_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_pineapple_chef_special": {
            "name": "mc:homefood_pineapple_chef_special",
            "result": "mc:homefood_pineapple_chef_special",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pineapple_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_pumpkin_bistro_saute": {
            "name": "mc:homefood_pumpkin_bistro_saute",
            "result": "mc:homefood_pumpkin_bistro_saute",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pumpkin_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_soba_simple_skillet": {
            "name": "mc:homefood_soba_simple_skillet",
            "result": "mc:homefood_soba_simple_skillet",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_soba_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_strawberry_fine_plate": {
            "name": "mc:homefood_strawberry_fine_plate",
            "result": "mc:homefood_strawberry_fine_plate",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_strawberry_marinade": 1,
                    "mc:homeprep_strawberry_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_sweet_corn_chef_special": {
            "name": "mc:homefood_sweet_corn_chef_special",
            "result": "mc:homefood_sweet_corn_chef_special",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_sweet_corn_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_sweet_corn_fine_plate": {
            "name": "mc:homefood_sweet_corn_fine_plate",
            "result": "mc:homefood_sweet_corn_fine_plate",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_sweet_corn_marinade": 1,
                    "mc:homeprep_sweet_corn_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_tomato_fine_plate": {
            "name": "mc:homefood_tomato_fine_plate",
            "result": "mc:homefood_tomato_fine_plate",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tomato_marinade": 1,
                    "mc:homeprep_tomato_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_zucchini_pasta": {
            "name": "mc:homefood_zucchini_pasta",
            "result": "mc:homefood_zucchini_pasta",
            "requiredLevel": 428,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_zucchini_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1302,
            "baseXp": 868
    },
    "homefood_anko_breakfast_plate": {
            "name": "mc:homefood_anko_breakfast_plate",
            "result": "mc:homefood_anko_breakfast_plate",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_anko_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_apple_pasta": {
            "name": "mc:homefood_apple_pasta",
            "result": "mc:homefood_apple_pasta",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_apple_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_barley_pasta": {
            "name": "mc:homefood_barley_pasta",
            "result": "mc:homefood_barley_pasta",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_barley_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_beetroot_fine_plate": {
            "name": "mc:homefood_beetroot_fine_plate",
            "result": "mc:homefood_beetroot_fine_plate",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_beetroot_marinade": 1,
                    "mc:homeprep_beetroot_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_butter_homestyle_rice_bowl": {
            "name": "mc:homefood_butter_homestyle_rice_bowl",
            "result": "mc:homefood_butter_homestyle_rice_bowl",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_butter_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_chocolate_omelet": {
            "name": "mc:homefood_chocolate_omelet",
            "result": "mc:homefood_chocolate_omelet",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_chocolate_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_egg_breakfast_plate": {
            "name": "mc:homefood_egg_breakfast_plate",
            "result": "mc:homefood_egg_breakfast_plate",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_egg_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_flour_simple_skillet": {
            "name": "mc:homefood_flour_simple_skillet",
            "result": "mc:homefood_flour_simple_skillet",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_flour_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_garlic_bistro_saute": {
            "name": "mc:homefood_garlic_bistro_saute",
            "result": "mc:homefood_garlic_bistro_saute",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_garlic_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_ginger_pilaf": {
            "name": "mc:homefood_ginger_pilaf",
            "result": "mc:homefood_ginger_pilaf",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_ginger_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_mushroom_simple_skillet": {
            "name": "mc:homefood_mushroom_simple_skillet",
            "result": "mc:homefood_mushroom_simple_skillet",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_mushroom_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_onion_homestyle_rice_bowl": {
            "name": "mc:homefood_onion_homestyle_rice_bowl",
            "result": "mc:homefood_onion_homestyle_rice_bowl",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_onion_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_sesame_simple_skillet": {
            "name": "mc:homefood_sesame_simple_skillet",
            "result": "mc:homefood_sesame_simple_skillet",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_sesame_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_soy_sauce_breakfast_plate": {
            "name": "mc:homefood_soy_sauce_breakfast_plate",
            "result": "mc:homefood_soy_sauce_breakfast_plate",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_soy_sauce_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_strawberry_chef_special": {
            "name": "mc:homefood_strawberry_chef_special",
            "result": "mc:homefood_strawberry_chef_special",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_strawberry_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_zucchini_omelet": {
            "name": "mc:homefood_zucchini_omelet",
            "result": "mc:homefood_zucchini_omelet",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_zucchini_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_zucchini_pilaf": {
            "name": "mc:homefood_zucchini_pilaf",
            "result": "mc:homefood_zucchini_pilaf",
            "requiredLevel": 429,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_zucchini_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1305,
            "baseXp": 870
    },
    "homefood_barley_omelet": {
            "name": "mc:homefood_barley_omelet",
            "result": "mc:homefood_barley_omelet",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_barley_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_barley_pilaf": {
            "name": "mc:homefood_barley_pilaf",
            "result": "mc:homefood_barley_pilaf",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_barley_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_buns_homestyle_rice_bowl": {
            "name": "mc:homefood_buns_homestyle_rice_bowl",
            "result": "mc:homefood_buns_homestyle_rice_bowl",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_buns_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_chicken_chef_special": {
            "name": "mc:homefood_chicken_chef_special",
            "result": "mc:homefood_chicken_chef_special",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_chicken_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_chicken_fine_plate": {
            "name": "mc:homefood_chicken_fine_plate",
            "result": "mc:homefood_chicken_fine_plate",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chicken_marinade": 1,
                    "mc:homeprep_chicken_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_chili_chef_special": {
            "name": "mc:homefood_chili_chef_special",
            "result": "mc:homefood_chili_chef_special",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_chili_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_chili_fine_plate": {
            "name": "mc:homefood_chili_fine_plate",
            "result": "mc:homefood_chili_fine_plate",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_chili_marinade": 1,
                    "mc:homeprep_chili_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_cream_simple_skillet": {
            "name": "mc:homefood_cream_simple_skillet",
            "result": "mc:homefood_cream_simple_skillet",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_cream_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_daikon_homestyle_rice_bowl": {
            "name": "mc:homefood_daikon_homestyle_rice_bowl",
            "result": "mc:homefood_daikon_homestyle_rice_bowl",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_daikon_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_flour_breakfast_plate": {
            "name": "mc:homefood_flour_breakfast_plate",
            "result": "mc:homefood_flour_breakfast_plate",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_flour_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_garlic_pasta": {
            "name": "mc:homefood_garlic_pasta",
            "result": "mc:homefood_garlic_pasta",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_garlic_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_matcha_fine_plate": {
            "name": "mc:homefood_matcha_fine_plate",
            "result": "mc:homefood_matcha_fine_plate",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_matcha_marinade": 1,
                    "mc:homeprep_matcha_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_ramen_simple_skillet": {
            "name": "mc:homefood_ramen_simple_skillet",
            "result": "mc:homefood_ramen_simple_skillet",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_ramen_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_strawberry_bistro_saute": {
            "name": "mc:homefood_strawberry_bistro_saute",
            "result": "mc:homefood_strawberry_bistro_saute",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_strawberry_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_sweet_corn_bistro_saute": {
            "name": "mc:homefood_sweet_corn_bistro_saute",
            "result": "mc:homefood_sweet_corn_bistro_saute",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_sweet_corn_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_tomato_bistro_saute": {
            "name": "mc:homefood_tomato_bistro_saute",
            "result": "mc:homefood_tomato_bistro_saute",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tomato_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_udon_breakfast_plate": {
            "name": "mc:homefood_udon_breakfast_plate",
            "result": "mc:homefood_udon_breakfast_plate",
            "requiredLevel": 430,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_udon_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1308,
            "baseXp": 872
    },
    "homefood_beetroot_bistro_saute": {
            "name": "mc:homefood_beetroot_bistro_saute",
            "result": "mc:homefood_beetroot_bistro_saute",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_beetroot_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_cabbage_homestyle_rice_bowl": {
            "name": "mc:homefood_cabbage_homestyle_rice_bowl",
            "result": "mc:homefood_cabbage_homestyle_rice_bowl",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_cabbage_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_cheese_breakfast_plate": {
            "name": "mc:homefood_cheese_breakfast_plate",
            "result": "mc:homefood_cheese_breakfast_plate",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_cheese_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_coffee_omelet": {
            "name": "mc:homefood_coffee_omelet",
            "result": "mc:homefood_coffee_omelet",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_coffee_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_curry_fine_plate": {
            "name": "mc:homefood_curry_fine_plate",
            "result": "mc:homefood_curry_fine_plate",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_curry_marinade": 1,
                    "mc:homeprep_curry_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_garlic_pilaf": {
            "name": "mc:homefood_garlic_pilaf",
            "result": "mc:homefood_garlic_pilaf",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_garlic_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_herb_homestyle_rice_bowl": {
            "name": "mc:homefood_herb_homestyle_rice_bowl",
            "result": "mc:homefood_herb_homestyle_rice_bowl",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_herb_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_kelp_fine_plate": {
            "name": "mc:homefood_kelp_fine_plate",
            "result": "mc:homefood_kelp_fine_plate",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_kelp_marinade": 1,
                    "mc:homeprep_kelp_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_leek_omelet": {
            "name": "mc:homefood_leek_omelet",
            "result": "mc:homefood_leek_omelet",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_leek_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_matcha_chef_special": {
            "name": "mc:homefood_matcha_chef_special",
            "result": "mc:homefood_matcha_chef_special",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_matcha_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_peanut_simple_skillet": {
            "name": "mc:homefood_peanut_simple_skillet",
            "result": "mc:homefood_peanut_simple_skillet",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_peanut_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_pineapple_pilaf": {
            "name": "mc:homefood_pineapple_pilaf",
            "result": "mc:homefood_pineapple_pilaf",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pineapple_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_potato_simple_skillet": {
            "name": "mc:homefood_potato_simple_skillet",
            "result": "mc:homefood_potato_simple_skillet",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_potato_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_pumpkin_chef_special": {
            "name": "mc:homefood_pumpkin_chef_special",
            "result": "mc:homefood_pumpkin_chef_special",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pumpkin_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_strawberry_pasta": {
            "name": "mc:homefood_strawberry_pasta",
            "result": "mc:homefood_strawberry_pasta",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_strawberry_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_sweet_corn_pasta": {
            "name": "mc:homefood_sweet_corn_pasta",
            "result": "mc:homefood_sweet_corn_pasta",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_sweet_corn_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_teriyaki_breakfast_plate": {
            "name": "mc:homefood_teriyaki_breakfast_plate",
            "result": "mc:homefood_teriyaki_breakfast_plate",
            "requiredLevel": 431,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_teriyaki_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1311,
            "baseXp": 874
    },
    "homefood_beetroot_pasta": {
            "name": "mc:homefood_beetroot_pasta",
            "result": "mc:homefood_beetroot_pasta",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_beetroot_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_burdock_homestyle_rice_bowl": {
            "name": "mc:homefood_burdock_homestyle_rice_bowl",
            "result": "mc:homefood_burdock_homestyle_rice_bowl",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_burdock_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_butter_simple_skillet": {
            "name": "mc:homefood_butter_simple_skillet",
            "result": "mc:homefood_butter_simple_skillet",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_butter_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_chicken_bistro_saute": {
            "name": "mc:homefood_chicken_bistro_saute",
            "result": "mc:homefood_chicken_bistro_saute",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chicken_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_chili_bistro_saute": {
            "name": "mc:homefood_chili_bistro_saute",
            "result": "mc:homefood_chili_bistro_saute",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_chili_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_garlic_omelet": {
            "name": "mc:homefood_garlic_omelet",
            "result": "mc:homefood_garlic_omelet",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_garlic_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_kelp_chef_special": {
            "name": "mc:homefood_kelp_chef_special",
            "result": "mc:homefood_kelp_chef_special",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_kelp_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_macaroni_simple_skillet": {
            "name": "mc:homefood_macaroni_simple_skillet",
            "result": "mc:homefood_macaroni_simple_skillet",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_macaroni_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_matcha_bistro_saute": {
            "name": "mc:homefood_matcha_bistro_saute",
            "result": "mc:homefood_matcha_bistro_saute",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_matcha_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_milk_breakfast_plate": {
            "name": "mc:homefood_milk_breakfast_plate",
            "result": "mc:homefood_milk_breakfast_plate",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_milk_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_peanut_breakfast_plate": {
            "name": "mc:homefood_peanut_breakfast_plate",
            "result": "mc:homefood_peanut_breakfast_plate",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_peanut_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_pineapple_omelet": {
            "name": "mc:homefood_pineapple_omelet",
            "result": "mc:homefood_pineapple_omelet",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_pineapple_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_soba_breakfast_plate": {
            "name": "mc:homefood_soba_breakfast_plate",
            "result": "mc:homefood_soba_breakfast_plate",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_soba_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_strawberry_pilaf": {
            "name": "mc:homefood_strawberry_pilaf",
            "result": "mc:homefood_strawberry_pilaf",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_strawberry_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_sweet_corn_omelet": {
            "name": "mc:homefood_sweet_corn_omelet",
            "result": "mc:homefood_sweet_corn_omelet",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_sweet_corn_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_sweet_corn_pilaf": {
            "name": "mc:homefood_sweet_corn_pilaf",
            "result": "mc:homefood_sweet_corn_pilaf",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_sweet_corn_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_tortilla_homestyle_rice_bowl": {
            "name": "mc:homefood_tortilla_homestyle_rice_bowl",
            "result": "mc:homefood_tortilla_homestyle_rice_bowl",
            "requiredLevel": 432,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_tortilla_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1314,
            "baseXp": 876
    },
    "homefood_apple_pilaf": {
            "name": "mc:homefood_apple_pilaf",
            "result": "mc:homefood_apple_pilaf",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_apple_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_beetroot_chef_special": {
            "name": "mc:homefood_beetroot_chef_special",
            "result": "mc:homefood_beetroot_chef_special",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_beetroot_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_chicken_pasta": {
            "name": "mc:homefood_chicken_pasta",
            "result": "mc:homefood_chicken_pasta",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_chicken_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_chili_pasta": {
            "name": "mc:homefood_chili_pasta",
            "result": "mc:homefood_chili_pasta",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_chili_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_chili_pilaf": {
            "name": "mc:homefood_chili_pilaf",
            "result": "mc:homefood_chili_pilaf",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chili_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_curry_bistro_saute": {
            "name": "mc:homefood_curry_bistro_saute",
            "result": "mc:homefood_curry_bistro_saute",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_curry_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_ginger_omelet": {
            "name": "mc:homefood_ginger_omelet",
            "result": "mc:homefood_ginger_omelet",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_ginger_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_kelp_bistro_saute": {
            "name": "mc:homefood_kelp_bistro_saute",
            "result": "mc:homefood_kelp_bistro_saute",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_kelp_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_mikan_chef_special": {
            "name": "mc:homefood_mikan_chef_special",
            "result": "mc:homefood_mikan_chef_special",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_mikan_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_mikan_fine_plate": {
            "name": "mc:homefood_mikan_fine_plate",
            "result": "mc:homefood_mikan_fine_plate",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_mikan_marinade": 1,
                    "mc:homeprep_mikan_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_miso_chef_special": {
            "name": "mc:homefood_miso_chef_special",
            "result": "mc:homefood_miso_chef_special",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_miso_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_miso_fine_plate": {
            "name": "mc:homefood_miso_fine_plate",
            "result": "mc:homefood_miso_fine_plate",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_miso_marinade": 1,
                    "mc:homeprep_miso_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_pork_chef_special": {
            "name": "mc:homefood_pork_chef_special",
            "result": "mc:homefood_pork_chef_special",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_pork_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_pork_fine_plate": {
            "name": "mc:homefood_pork_fine_plate",
            "result": "mc:homefood_pork_fine_plate",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_pork_marinade": 1,
                    "mc:homeprep_pork_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_pumpkin_pasta": {
            "name": "mc:homefood_pumpkin_pasta",
            "result": "mc:homefood_pumpkin_pasta",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pumpkin_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_sesame_breakfast_plate": {
            "name": "mc:homefood_sesame_breakfast_plate",
            "result": "mc:homefood_sesame_breakfast_plate",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_sesame_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_tomato_chef_special": {
            "name": "mc:homefood_tomato_chef_special",
            "result": "mc:homefood_tomato_chef_special",
            "requiredLevel": 433,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_tomato_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1317,
            "baseXp": 878
    },
    "homefood_apple_omelet": {
            "name": "mc:homefood_apple_omelet",
            "result": "mc:homefood_apple_omelet",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_apple_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_bread_simple_skillet": {
            "name": "mc:homefood_bread_simple_skillet",
            "result": "mc:homefood_bread_simple_skillet",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_bread_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_carrot_simple_skillet": {
            "name": "mc:homefood_carrot_simple_skillet",
            "result": "mc:homefood_carrot_simple_skillet",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_carrot_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_chicken_pilaf": {
            "name": "mc:homefood_chicken_pilaf",
            "result": "mc:homefood_chicken_pilaf",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_chicken_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_chili_omelet": {
            "name": "mc:homefood_chili_omelet",
            "result": "mc:homefood_chili_omelet",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_chili_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_curry_pasta": {
            "name": "mc:homefood_curry_pasta",
            "result": "mc:homefood_curry_pasta",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_curry_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_honey_chef_special": {
            "name": "mc:homefood_honey_chef_special",
            "result": "mc:homefood_honey_chef_special",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_honey_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_honey_fine_plate": {
            "name": "mc:homefood_honey_fine_plate",
            "result": "mc:homefood_honey_fine_plate",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_honey_marinade": 1,
                    "mc:homeprep_honey_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_matcha_pasta": {
            "name": "mc:homefood_matcha_pasta",
            "result": "mc:homefood_matcha_pasta",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_matcha_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_mushroom_breakfast_plate": {
            "name": "mc:homefood_mushroom_breakfast_plate",
            "result": "mc:homefood_mushroom_breakfast_plate",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_mushroom_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_pie_dough_homestyle_rice_bowl": {
            "name": "mc:homefood_pie_dough_homestyle_rice_bowl",
            "result": "mc:homefood_pie_dough_homestyle_rice_bowl",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_pie_dough_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_pork_bistro_saute": {
            "name": "mc:homefood_pork_bistro_saute",
            "result": "mc:homefood_pork_bistro_saute",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_pork_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_pumpkin_pilaf": {
            "name": "mc:homefood_pumpkin_pilaf",
            "result": "mc:homefood_pumpkin_pilaf",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_pumpkin_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_ramen_breakfast_plate": {
            "name": "mc:homefood_ramen_breakfast_plate",
            "result": "mc:homefood_ramen_breakfast_plate",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_ramen_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_spinach_homestyle_rice_bowl": {
            "name": "mc:homefood_spinach_homestyle_rice_bowl",
            "result": "mc:homefood_spinach_homestyle_rice_bowl",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_spinach_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_vinegared_rice_fine_plate": {
            "name": "mc:homefood_vinegared_rice_fine_plate",
            "result": "mc:homefood_vinegared_rice_fine_plate",
            "requiredLevel": 434,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_marinade": 1,
                    "mc:homeprep_vinegared_rice_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1320,
            "baseXp": 880
    },
    "homefood_beef_chef_special": {
            "name": "mc:homefood_beef_chef_special",
            "result": "mc:homefood_beef_chef_special",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_beef_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_beef_fine_plate": {
            "name": "mc:homefood_beef_fine_plate",
            "result": "mc:homefood_beef_fine_plate",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_beef_marinade": 1,
                    "mc:homeprep_beef_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_chocolate_homestyle_rice_bowl": {
            "name": "mc:homefood_chocolate_homestyle_rice_bowl",
            "result": "mc:homefood_chocolate_homestyle_rice_bowl",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_chocolate_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_cream_breakfast_plate": {
            "name": "mc:homefood_cream_breakfast_plate",
            "result": "mc:homefood_cream_breakfast_plate",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_cream_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_curry_chef_special": {
            "name": "mc:homefood_curry_chef_special",
            "result": "mc:homefood_curry_chef_special",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_curry_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_herb_simple_skillet": {
            "name": "mc:homefood_herb_simple_skillet",
            "result": "mc:homefood_herb_simple_skillet",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_herb_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_honey_bistro_saute": {
            "name": "mc:homefood_honey_bistro_saute",
            "result": "mc:homefood_honey_bistro_saute",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_honey_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_kelp_pasta": {
            "name": "mc:homefood_kelp_pasta",
            "result": "mc:homefood_kelp_pasta",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_kelp_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_lotus_root_homestyle_rice_bowl": {
            "name": "mc:homefood_lotus_root_homestyle_rice_bowl",
            "result": "mc:homefood_lotus_root_homestyle_rice_bowl",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_lotus_root_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_matcha_pilaf": {
            "name": "mc:homefood_matcha_pilaf",
            "result": "mc:homefood_matcha_pilaf",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_matcha_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_mikan_bistro_saute": {
            "name": "mc:homefood_mikan_bistro_saute",
            "result": "mc:homefood_mikan_bistro_saute",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_mikan_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_miso_bistro_saute": {
            "name": "mc:homefood_miso_bistro_saute",
            "result": "mc:homefood_miso_bistro_saute",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_miso_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_pork_pasta": {
            "name": "mc:homefood_pork_pasta",
            "result": "mc:homefood_pork_pasta",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_pork_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_pumpkin_omelet": {
            "name": "mc:homefood_pumpkin_omelet",
            "result": "mc:homefood_pumpkin_omelet",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_pumpkin_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_rice_fine_plate": {
            "name": "mc:homefood_rice_fine_plate",
            "result": "mc:homefood_rice_fine_plate",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_rice_marinade": 1,
                    "mc:homeprep_rice_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_tomato_pasta": {
            "name": "mc:homefood_tomato_pasta",
            "result": "mc:homefood_tomato_pasta",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_tomato_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_tortilla_simple_skillet": {
            "name": "mc:homefood_tortilla_simple_skillet",
            "result": "mc:homefood_tortilla_simple_skillet",
            "requiredLevel": 435,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_tortilla_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1323,
            "baseXp": 882
    },
    "homefood_anko_chef_special": {
            "name": "mc:homefood_anko_chef_special",
            "result": "mc:homefood_anko_chef_special",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_anko_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_anko_fine_plate": {
            "name": "mc:homefood_anko_fine_plate",
            "result": "mc:homefood_anko_fine_plate",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_anko_marinade": 1,
                    "mc:homeprep_anko_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_egg_fine_plate": {
            "name": "mc:homefood_egg_fine_plate",
            "result": "mc:homefood_egg_fine_plate",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_egg_marinade": 1,
                    "mc:homeprep_egg_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_eggplant_homestyle_rice_bowl": {
            "name": "mc:homefood_eggplant_homestyle_rice_bowl",
            "result": "mc:homefood_eggplant_homestyle_rice_bowl",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_eggplant_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_mikan_pasta": {
            "name": "mc:homefood_mikan_pasta",
            "result": "mc:homefood_mikan_pasta",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_mikan_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_miso_pasta": {
            "name": "mc:homefood_miso_pasta",
            "result": "mc:homefood_miso_pasta",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_miso_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_onion_simple_skillet": {
            "name": "mc:homefood_onion_simple_skillet",
            "result": "mc:homefood_onion_simple_skillet",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_onion_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_pork_pilaf": {
            "name": "mc:homefood_pork_pilaf",
            "result": "mc:homefood_pork_pilaf",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pork_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_potato_breakfast_plate": {
            "name": "mc:homefood_potato_breakfast_plate",
            "result": "mc:homefood_potato_breakfast_plate",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_potato_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_rice_chef_special": {
            "name": "mc:homefood_rice_chef_special",
            "result": "mc:homefood_rice_chef_special",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_rice_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_soy_sauce_chef_special": {
            "name": "mc:homefood_soy_sauce_chef_special",
            "result": "mc:homefood_soy_sauce_chef_special",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_soy_sauce_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_soy_sauce_fine_plate": {
            "name": "mc:homefood_soy_sauce_fine_plate",
            "result": "mc:homefood_soy_sauce_fine_plate",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_soy_sauce_marinade": 1,
                    "mc:homeprep_soy_sauce_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_strawberry_omelet": {
            "name": "mc:homefood_strawberry_omelet",
            "result": "mc:homefood_strawberry_omelet",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_strawberry_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_tomato_omelet": {
            "name": "mc:homefood_tomato_omelet",
            "result": "mc:homefood_tomato_omelet",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_tomato_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_tomato_pilaf": {
            "name": "mc:homefood_tomato_pilaf",
            "result": "mc:homefood_tomato_pilaf",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_tomato_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_udon_fine_plate": {
            "name": "mc:homefood_udon_fine_plate",
            "result": "mc:homefood_udon_fine_plate",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_udon_marinade": 1,
                    "mc:homeprep_udon_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_vinegared_rice_bistro_saute": {
            "name": "mc:homefood_vinegared_rice_bistro_saute",
            "result": "mc:homefood_vinegared_rice_bistro_saute",
            "requiredLevel": 436,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1326,
            "baseXp": 884
    },
    "homefood_asparagus_homestyle_rice_bowl": {
            "name": "mc:homefood_asparagus_homestyle_rice_bowl",
            "result": "mc:homefood_asparagus_homestyle_rice_bowl",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_asparagus_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_bacon_fine_plate": {
            "name": "mc:homefood_bacon_fine_plate",
            "result": "mc:homefood_bacon_fine_plate",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_bacon_marinade": 1,
                    "mc:homeprep_bacon_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_beef_bistro_saute": {
            "name": "mc:homefood_beef_bistro_saute",
            "result": "mc:homefood_beef_bistro_saute",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_beef_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_beetroot_omelet": {
            "name": "mc:homefood_beetroot_omelet",
            "result": "mc:homefood_beetroot_omelet",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_beetroot_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_beetroot_pilaf": {
            "name": "mc:homefood_beetroot_pilaf",
            "result": "mc:homefood_beetroot_pilaf",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_beetroot_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_buns_simple_skillet": {
            "name": "mc:homefood_buns_simple_skillet",
            "result": "mc:homefood_buns_simple_skillet",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_buns_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_butter_breakfast_plate": {
            "name": "mc:homefood_butter_breakfast_plate",
            "result": "mc:homefood_butter_breakfast_plate",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_butter_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_custard_homestyle_rice_bowl": {
            "name": "mc:homefood_custard_homestyle_rice_bowl",
            "result": "mc:homefood_custard_homestyle_rice_bowl",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_custard_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_daikon_simple_skillet": {
            "name": "mc:homefood_daikon_simple_skillet",
            "result": "mc:homefood_daikon_simple_skillet",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_daikon_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_honey_pasta": {
            "name": "mc:homefood_honey_pasta",
            "result": "mc:homefood_honey_pasta",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_honey_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_leek_homestyle_rice_bowl": {
            "name": "mc:homefood_leek_homestyle_rice_bowl",
            "result": "mc:homefood_leek_homestyle_rice_bowl",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_leek_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_macaroni_breakfast_plate": {
            "name": "mc:homefood_macaroni_breakfast_plate",
            "result": "mc:homefood_macaroni_breakfast_plate",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_macaroni_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_mikan_omelet": {
            "name": "mc:homefood_mikan_omelet",
            "result": "mc:homefood_mikan_omelet",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_mikan_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_mikan_pilaf": {
            "name": "mc:homefood_mikan_pilaf",
            "result": "mc:homefood_mikan_pilaf",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_mikan_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_rice_bistro_saute": {
            "name": "mc:homefood_rice_bistro_saute",
            "result": "mc:homefood_rice_bistro_saute",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_rice_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_soy_sauce_bistro_saute": {
            "name": "mc:homefood_soy_sauce_bistro_saute",
            "result": "mc:homefood_soy_sauce_bistro_saute",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_soy_sauce_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_spinach_simple_skillet": {
            "name": "mc:homefood_spinach_simple_skillet",
            "result": "mc:homefood_spinach_simple_skillet",
            "requiredLevel": 437,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_spinach_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1329,
            "baseXp": 886
    },
    "homefood_anko_bistro_saute": {
            "name": "mc:homefood_anko_bistro_saute",
            "result": "mc:homefood_anko_bistro_saute",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_anko_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_bacon_chef_special": {
            "name": "mc:homefood_bacon_chef_special",
            "result": "mc:homefood_bacon_chef_special",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_bacon_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_beef_pasta": {
            "name": "mc:homefood_beef_pasta",
            "result": "mc:homefood_beef_pasta",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_beef_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_buns_breakfast_plate": {
            "name": "mc:homefood_buns_breakfast_plate",
            "result": "mc:homefood_buns_breakfast_plate",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_buns_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_carrot_breakfast_plate": {
            "name": "mc:homefood_carrot_breakfast_plate",
            "result": "mc:homefood_carrot_breakfast_plate",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_carrot_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_cheese_fine_plate": {
            "name": "mc:homefood_cheese_fine_plate",
            "result": "mc:homefood_cheese_fine_plate",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_cheese_marinade": 1,
                    "mc:homeprep_cheese_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_chicken_omelet": {
            "name": "mc:homefood_chicken_omelet",
            "result": "mc:homefood_chicken_omelet",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_chicken_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_coffee_homestyle_rice_bowl": {
            "name": "mc:homefood_coffee_homestyle_rice_bowl",
            "result": "mc:homefood_coffee_homestyle_rice_bowl",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_coffee_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_curry_pilaf": {
            "name": "mc:homefood_curry_pilaf",
            "result": "mc:homefood_curry_pilaf",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_curry_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_egg_bistro_saute": {
            "name": "mc:homefood_egg_bistro_saute",
            "result": "mc:homefood_egg_bistro_saute",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_egg_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_honey_pilaf": {
            "name": "mc:homefood_honey_pilaf",
            "result": "mc:homefood_honey_pilaf",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_honey_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_milk_fine_plate": {
            "name": "mc:homefood_milk_fine_plate",
            "result": "mc:homefood_milk_fine_plate",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_milk_marinade": 1,
                    "mc:homeprep_milk_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_pie_dough_simple_skillet": {
            "name": "mc:homefood_pie_dough_simple_skillet",
            "result": "mc:homefood_pie_dough_simple_skillet",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pie_dough_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_teriyaki_chef_special": {
            "name": "mc:homefood_teriyaki_chef_special",
            "result": "mc:homefood_teriyaki_chef_special",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_teriyaki_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_teriyaki_fine_plate": {
            "name": "mc:homefood_teriyaki_fine_plate",
            "result": "mc:homefood_teriyaki_fine_plate",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_teriyaki_marinade": 1,
                    "mc:homeprep_teriyaki_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_udon_bistro_saute": {
            "name": "mc:homefood_udon_bistro_saute",
            "result": "mc:homefood_udon_bistro_saute",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_udon_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_vinegared_rice_chef_special": {
            "name": "mc:homefood_vinegared_rice_chef_special",
            "result": "mc:homefood_vinegared_rice_chef_special",
            "requiredLevel": 438,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1332,
            "baseXp": 888
    },
    "homefood_anko_pasta": {
            "name": "mc:homefood_anko_pasta",
            "result": "mc:homefood_anko_pasta",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_anko_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_bacon_bistro_saute": {
            "name": "mc:homefood_bacon_bistro_saute",
            "result": "mc:homefood_bacon_bistro_saute",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_bacon_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_beef_omelet": {
            "name": "mc:homefood_beef_omelet",
            "result": "mc:homefood_beef_omelet",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_beef_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_beef_pilaf": {
            "name": "mc:homefood_beef_pilaf",
            "result": "mc:homefood_beef_pilaf",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_beef_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_bell_pepper_homestyle_rice_bowl": {
            "name": "mc:homefood_bell_pepper_homestyle_rice_bowl",
            "result": "mc:homefood_bell_pepper_homestyle_rice_bowl",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_bell_pepper_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_bread_breakfast_plate": {
            "name": "mc:homefood_bread_breakfast_plate",
            "result": "mc:homefood_bread_breakfast_plate",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_bread_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_cabbage_simple_skillet": {
            "name": "mc:homefood_cabbage_simple_skillet",
            "result": "mc:homefood_cabbage_simple_skillet",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cabbage_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_curry_omelet": {
            "name": "mc:homefood_curry_omelet",
            "result": "mc:homefood_curry_omelet",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_curry_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_herb_breakfast_plate": {
            "name": "mc:homefood_herb_breakfast_plate",
            "result": "mc:homefood_herb_breakfast_plate",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_herb_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_kelp_pilaf": {
            "name": "mc:homefood_kelp_pilaf",
            "result": "mc:homefood_kelp_pilaf",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_kelp_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_matcha_omelet": {
            "name": "mc:homefood_matcha_omelet",
            "result": "mc:homefood_matcha_omelet",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_matcha_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_milk_chef_special": {
            "name": "mc:homefood_milk_chef_special",
            "result": "mc:homefood_milk_chef_special",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_milk_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_rice_pasta": {
            "name": "mc:homefood_rice_pasta",
            "result": "mc:homefood_rice_pasta",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_rice_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_rice_pilaf": {
            "name": "mc:homefood_rice_pilaf",
            "result": "mc:homefood_rice_pilaf",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_rice_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_soba_chef_special": {
            "name": "mc:homefood_soba_chef_special",
            "result": "mc:homefood_soba_chef_special",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_soba_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_soba_fine_plate": {
            "name": "mc:homefood_soba_fine_plate",
            "result": "mc:homefood_soba_fine_plate",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_soba_marinade": 1,
                    "mc:homeprep_soba_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_soy_sauce_pasta": {
            "name": "mc:homefood_soy_sauce_pasta",
            "result": "mc:homefood_soy_sauce_pasta",
            "requiredLevel": 439,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_soy_sauce_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1335,
            "baseXp": 890
    },
    "homefood_anko_pilaf": {
            "name": "mc:homefood_anko_pilaf",
            "result": "mc:homefood_anko_pilaf",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_anko_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_bacon_pasta": {
            "name": "mc:homefood_bacon_pasta",
            "result": "mc:homefood_bacon_pasta",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_bacon_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_barley_homestyle_rice_bowl": {
            "name": "mc:homefood_barley_homestyle_rice_bowl",
            "result": "mc:homefood_barley_homestyle_rice_bowl",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_barley_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_burdock_simple_skillet": {
            "name": "mc:homefood_burdock_simple_skillet",
            "result": "mc:homefood_burdock_simple_skillet",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_burdock_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_cabbage_breakfast_plate": {
            "name": "mc:homefood_cabbage_breakfast_plate",
            "result": "mc:homefood_cabbage_breakfast_plate",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_cabbage_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_cheese_bistro_saute": {
            "name": "mc:homefood_cheese_bistro_saute",
            "result": "mc:homefood_cheese_bistro_saute",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_cheese_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_custard_simple_skillet": {
            "name": "mc:homefood_custard_simple_skillet",
            "result": "mc:homefood_custard_simple_skillet",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_custard_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_egg_chef_special": {
            "name": "mc:homefood_egg_chef_special",
            "result": "mc:homefood_egg_chef_special",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_egg_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_eggplant_simple_skillet": {
            "name": "mc:homefood_eggplant_simple_skillet",
            "result": "mc:homefood_eggplant_simple_skillet",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_eggplant_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_ginger_homestyle_rice_bowl": {
            "name": "mc:homefood_ginger_homestyle_rice_bowl",
            "result": "mc:homefood_ginger_homestyle_rice_bowl",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_ginger_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_kelp_omelet": {
            "name": "mc:homefood_kelp_omelet",
            "result": "mc:homefood_kelp_omelet",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_kelp_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_rice_omelet": {
            "name": "mc:homefood_rice_omelet",
            "result": "mc:homefood_rice_omelet",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_rice_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_soy_sauce_pilaf": {
            "name": "mc:homefood_soy_sauce_pilaf",
            "result": "mc:homefood_soy_sauce_pilaf",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_soy_sauce_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_teriyaki_bistro_saute": {
            "name": "mc:homefood_teriyaki_bistro_saute",
            "result": "mc:homefood_teriyaki_bistro_saute",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_teriyaki_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_tortilla_breakfast_plate": {
            "name": "mc:homefood_tortilla_breakfast_plate",
            "result": "mc:homefood_tortilla_breakfast_plate",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_tortilla_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_udon_pasta": {
            "name": "mc:homefood_udon_pasta",
            "result": "mc:homefood_udon_pasta",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_udon_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_zucchini_homestyle_rice_bowl": {
            "name": "mc:homefood_zucchini_homestyle_rice_bowl",
            "result": "mc:homefood_zucchini_homestyle_rice_bowl",
            "requiredLevel": 440,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_zucchini_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1338,
            "baseXp": 892
    },
    "homefood_bacon_pilaf": {
            "name": "mc:homefood_bacon_pilaf",
            "result": "mc:homefood_bacon_pilaf",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_bacon_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_cheese_pasta": {
            "name": "mc:homefood_cheese_pasta",
            "result": "mc:homefood_cheese_pasta",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_cheese_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_flour_chef_special": {
            "name": "mc:homefood_flour_chef_special",
            "result": "mc:homefood_flour_chef_special",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_flour_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_flour_fine_plate": {
            "name": "mc:homefood_flour_fine_plate",
            "result": "mc:homefood_flour_fine_plate",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_flour_marinade": 1,
                    "mc:homeprep_flour_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_milk_bistro_saute": {
            "name": "mc:homefood_milk_bistro_saute",
            "result": "mc:homefood_milk_bistro_saute",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_milk_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_miso_pilaf": {
            "name": "mc:homefood_miso_pilaf",
            "result": "mc:homefood_miso_pilaf",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_miso_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_mushroom_chef_special": {
            "name": "mc:homefood_mushroom_chef_special",
            "result": "mc:homefood_mushroom_chef_special",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_mushroom_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_mushroom_fine_plate": {
            "name": "mc:homefood_mushroom_fine_plate",
            "result": "mc:homefood_mushroom_fine_plate",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_mushroom_marinade": 1,
                    "mc:homeprep_mushroom_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_onion_breakfast_plate": {
            "name": "mc:homefood_onion_breakfast_plate",
            "result": "mc:homefood_onion_breakfast_plate",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_onion_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_pork_omelet": {
            "name": "mc:homefood_pork_omelet",
            "result": "mc:homefood_pork_omelet",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pork_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_ramen_fine_plate": {
            "name": "mc:homefood_ramen_fine_plate",
            "result": "mc:homefood_ramen_fine_plate",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_ramen_marinade": 1,
                    "mc:homeprep_ramen_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_sesame_chef_special": {
            "name": "mc:homefood_sesame_chef_special",
            "result": "mc:homefood_sesame_chef_special",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_sesame_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_sesame_fine_plate": {
            "name": "mc:homefood_sesame_fine_plate",
            "result": "mc:homefood_sesame_fine_plate",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_sesame_marinade": 1,
                    "mc:homeprep_sesame_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_soba_bistro_saute": {
            "name": "mc:homefood_soba_bistro_saute",
            "result": "mc:homefood_soba_bistro_saute",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_soba_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_teriyaki_pasta": {
            "name": "mc:homefood_teriyaki_pasta",
            "result": "mc:homefood_teriyaki_pasta",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_teriyaki_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_udon_chef_special": {
            "name": "mc:homefood_udon_chef_special",
            "result": "mc:homefood_udon_chef_special",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_udon_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_vinegared_rice_pasta": {
            "name": "mc:homefood_vinegared_rice_pasta",
            "result": "mc:homefood_vinegared_rice_pasta",
            "requiredLevel": 441,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1341,
            "baseXp": 894
    },
    "homefood_bacon_omelet": {
            "name": "mc:homefood_bacon_omelet",
            "result": "mc:homefood_bacon_omelet",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_bacon_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_bell_pepper_simple_skillet": {
            "name": "mc:homefood_bell_pepper_simple_skillet",
            "result": "mc:homefood_bell_pepper_simple_skillet",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_bell_pepper_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_cream_fine_plate": {
            "name": "mc:homefood_cream_fine_plate",
            "result": "mc:homefood_cream_fine_plate",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_cream_marinade": 1,
                    "mc:homeprep_cream_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_daikon_breakfast_plate": {
            "name": "mc:homefood_daikon_breakfast_plate",
            "result": "mc:homefood_daikon_breakfast_plate",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_daikon_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_garlic_homestyle_rice_bowl": {
            "name": "mc:homefood_garlic_homestyle_rice_bowl",
            "result": "mc:homefood_garlic_homestyle_rice_bowl",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_garlic_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_honey_omelet": {
            "name": "mc:homefood_honey_omelet",
            "result": "mc:homefood_honey_omelet",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_honey_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_lotus_root_simple_skillet": {
            "name": "mc:homefood_lotus_root_simple_skillet",
            "result": "mc:homefood_lotus_root_simple_skillet",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_lotus_root_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_milk_pasta": {
            "name": "mc:homefood_milk_pasta",
            "result": "mc:homefood_milk_pasta",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_milk_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_miso_omelet": {
            "name": "mc:homefood_miso_omelet",
            "result": "mc:homefood_miso_omelet",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_miso_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_pineapple_homestyle_rice_bowl": {
            "name": "mc:homefood_pineapple_homestyle_rice_bowl",
            "result": "mc:homefood_pineapple_homestyle_rice_bowl",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_pineapple_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_ramen_chef_special": {
            "name": "mc:homefood_ramen_chef_special",
            "result": "mc:homefood_ramen_chef_special",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_ramen_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_sesame_bistro_saute": {
            "name": "mc:homefood_sesame_bistro_saute",
            "result": "mc:homefood_sesame_bistro_saute",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_sesame_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_soba_pasta": {
            "name": "mc:homefood_soba_pasta",
            "result": "mc:homefood_soba_pasta",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_soba_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_spinach_breakfast_plate": {
            "name": "mc:homefood_spinach_breakfast_plate",
            "result": "mc:homefood_spinach_breakfast_plate",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_spinach_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_teriyaki_pilaf": {
            "name": "mc:homefood_teriyaki_pilaf",
            "result": "mc:homefood_teriyaki_pilaf",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_teriyaki_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_vinegared_rice_omelet": {
            "name": "mc:homefood_vinegared_rice_omelet",
            "result": "mc:homefood_vinegared_rice_omelet",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_vinegared_rice_pilaf": {
            "name": "mc:homefood_vinegared_rice_pilaf",
            "result": "mc:homefood_vinegared_rice_pilaf",
            "requiredLevel": 442,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1344,
            "baseXp": 896
    },
    "homefood_cheese_chef_special": {
            "name": "mc:homefood_cheese_chef_special",
            "result": "mc:homefood_cheese_chef_special",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cheese_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_chocolate_simple_skillet": {
            "name": "mc:homefood_chocolate_simple_skillet",
            "result": "mc:homefood_chocolate_simple_skillet",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chocolate_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_cream_bistro_saute": {
            "name": "mc:homefood_cream_bistro_saute",
            "result": "mc:homefood_cream_bistro_saute",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_cream_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_egg_pasta": {
            "name": "mc:homefood_egg_pasta",
            "result": "mc:homefood_egg_pasta",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_egg_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_flour_bistro_saute": {
            "name": "mc:homefood_flour_bistro_saute",
            "result": "mc:homefood_flour_bistro_saute",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_flour_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_milk_omelet": {
            "name": "mc:homefood_milk_omelet",
            "result": "mc:homefood_milk_omelet",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_milk_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_milk_pilaf": {
            "name": "mc:homefood_milk_pilaf",
            "result": "mc:homefood_milk_pilaf",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_milk_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_mushroom_bistro_saute": {
            "name": "mc:homefood_mushroom_bistro_saute",
            "result": "mc:homefood_mushroom_bistro_saute",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_mushroom_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_peanut_chef_special": {
            "name": "mc:homefood_peanut_chef_special",
            "result": "mc:homefood_peanut_chef_special",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_peanut_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_peanut_fine_plate": {
            "name": "mc:homefood_peanut_fine_plate",
            "result": "mc:homefood_peanut_fine_plate",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_peanut_marinade": 1,
                    "mc:homeprep_peanut_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_pie_dough_breakfast_plate": {
            "name": "mc:homefood_pie_dough_breakfast_plate",
            "result": "mc:homefood_pie_dough_breakfast_plate",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_pie_dough_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_potato_chef_special": {
            "name": "mc:homefood_potato_chef_special",
            "result": "mc:homefood_potato_chef_special",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_potato_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_potato_fine_plate": {
            "name": "mc:homefood_potato_fine_plate",
            "result": "mc:homefood_potato_fine_plate",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_potato_marinade": 1,
                    "mc:homeprep_potato_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_ramen_bistro_saute": {
            "name": "mc:homefood_ramen_bistro_saute",
            "result": "mc:homefood_ramen_bistro_saute",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_ramen_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_strawberry_homestyle_rice_bowl": {
            "name": "mc:homefood_strawberry_homestyle_rice_bowl",
            "result": "mc:homefood_strawberry_homestyle_rice_bowl",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_strawberry_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_sweet_corn_homestyle_rice_bowl": {
            "name": "mc:homefood_sweet_corn_homestyle_rice_bowl",
            "result": "mc:homefood_sweet_corn_homestyle_rice_bowl",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_sweet_corn_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_zucchini_simple_skillet": {
            "name": "mc:homefood_zucchini_simple_skillet",
            "result": "mc:homefood_zucchini_simple_skillet",
            "requiredLevel": 443,
            "needHeat": [
                    85,
                    125
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_zucchini_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1347,
            "baseXp": 898
    },
    "homefood_anko_omelet": {
            "name": "mc:homefood_anko_omelet",
            "result": "mc:homefood_anko_omelet",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_anko_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_apple_homestyle_rice_bowl": {
            "name": "mc:homefood_apple_homestyle_rice_bowl",
            "result": "mc:homefood_apple_homestyle_rice_bowl",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_apple_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_asparagus_simple_skillet": {
            "name": "mc:homefood_asparagus_simple_skillet",
            "result": "mc:homefood_asparagus_simple_skillet",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_asparagus_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_burdock_breakfast_plate": {
            "name": "mc:homefood_burdock_breakfast_plate",
            "result": "mc:homefood_burdock_breakfast_plate",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_burdock_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_butter_fine_plate": {
            "name": "mc:homefood_butter_fine_plate",
            "result": "mc:homefood_butter_fine_plate",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_butter_marinade": 1,
                    "mc:homeprep_butter_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_egg_omelet": {
            "name": "mc:homefood_egg_omelet",
            "result": "mc:homefood_egg_omelet",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_egg_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_egg_pilaf": {
            "name": "mc:homefood_egg_pilaf",
            "result": "mc:homefood_egg_pilaf",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_egg_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_eggplant_breakfast_plate": {
            "name": "mc:homefood_eggplant_breakfast_plate",
            "result": "mc:homefood_eggplant_breakfast_plate",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_eggplant_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_flour_pasta": {
            "name": "mc:homefood_flour_pasta",
            "result": "mc:homefood_flour_pasta",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_flour_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_macaroni_chef_special": {
            "name": "mc:homefood_macaroni_chef_special",
            "result": "mc:homefood_macaroni_chef_special",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_macaroni_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_macaroni_fine_plate": {
            "name": "mc:homefood_macaroni_fine_plate",
            "result": "mc:homefood_macaroni_fine_plate",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_macaroni_marinade": 1,
                    "mc:homeprep_macaroni_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_mushroom_pasta": {
            "name": "mc:homefood_mushroom_pasta",
            "result": "mc:homefood_mushroom_pasta",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_mushroom_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_ramen_pasta": {
            "name": "mc:homefood_ramen_pasta",
            "result": "mc:homefood_ramen_pasta",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_ramen_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_sesame_pasta": {
            "name": "mc:homefood_sesame_pasta",
            "result": "mc:homefood_sesame_pasta",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_sesame_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_sesame_pilaf": {
            "name": "mc:homefood_sesame_pilaf",
            "result": "mc:homefood_sesame_pilaf",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_sesame_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_soy_sauce_omelet": {
            "name": "mc:homefood_soy_sauce_omelet",
            "result": "mc:homefood_soy_sauce_omelet",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_soy_sauce_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_udon_pilaf": {
            "name": "mc:homefood_udon_pilaf",
            "result": "mc:homefood_udon_pilaf",
            "requiredLevel": 444,
            "needHeat": [
                    70,
                    110
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_udon_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1350,
            "baseXp": 900
    },
    "homefood_bread_fine_plate": {
            "name": "mc:homefood_bread_fine_plate",
            "result": "mc:homefood_bread_fine_plate",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_bread_marinade": 1,
                    "mc:homeprep_bread_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_carrot_fine_plate": {
            "name": "mc:homefood_carrot_fine_plate",
            "result": "mc:homefood_carrot_fine_plate",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_carrot_marinade": 1,
                    "mc:homeprep_carrot_cream_base": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_cheese_pilaf": {
            "name": "mc:homefood_cheese_pilaf",
            "result": "mc:homefood_cheese_pilaf",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_cheese_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_chili_homestyle_rice_bowl": {
            "name": "mc:homefood_chili_homestyle_rice_bowl",
            "result": "mc:homefood_chili_homestyle_rice_bowl",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_chili_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_coffee_simple_skillet": {
            "name": "mc:homefood_coffee_simple_skillet",
            "result": "mc:homefood_coffee_simple_skillet",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_coffee_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_cream_chef_special": {
            "name": "mc:homefood_cream_chef_special",
            "result": "mc:homefood_cream_chef_special",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_cream_marinade": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:basil": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_custard_breakfast_plate": {
            "name": "mc:homefood_custard_breakfast_plate",
            "result": "mc:homefood_custard_breakfast_plate",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_custard_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_flour_pilaf": {
            "name": "mc:homefood_flour_pilaf",
            "result": "mc:homefood_flour_pilaf",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_flour_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_leek_simple_skillet": {
            "name": "mc:homefood_leek_simple_skillet",
            "result": "mc:homefood_leek_simple_skillet",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_leek_diced": 1,
                    "mc:food_oil": 1
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_lotus_root_breakfast_plate": {
            "name": "mc:homefood_lotus_root_breakfast_plate",
            "result": "mc:homefood_lotus_root_breakfast_plate",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_lotus_root_diced": 1,
                    "minecraft:egg": 1,
                    "minecraft:bread": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_macaroni_bistro_saute": {
            "name": "mc:homefood_macaroni_bistro_saute",
            "result": "mc:homefood_macaroni_bistro_saute",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_macaroni_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_peanut_bistro_saute": {
            "name": "mc:homefood_peanut_bistro_saute",
            "result": "mc:homefood_peanut_bistro_saute",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_peanut_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_peanut_pasta": {
            "name": "mc:homefood_peanut_pasta",
            "result": "mc:homefood_peanut_pasta",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_peanut_sauce": 1,
                    "mc:macaroni": 1,
                    "mc:ovlive_oil": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_potato_bistro_saute": {
            "name": "mc:homefood_potato_bistro_saute",
            "result": "mc:homefood_potato_bistro_saute",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_potato_sliced": 1,
                    "mc:ovlive_oil": 1,
                    "mc:garlic_mizin": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_pumpkin_homestyle_rice_bowl": {
            "name": "mc:homefood_pumpkin_homestyle_rice_bowl",
            "result": "mc:homefood_pumpkin_homestyle_rice_bowl",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:cooked_rice": 1,
                    "mc:homeprep_pumpkin_saute_base": 1
            },
            "seasonings": {
                    "mc:syoyu": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_teriyaki_omelet": {
            "name": "mc:homefood_teriyaki_omelet",
            "result": "mc:homefood_teriyaki_omelet",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_teriyaki_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_udon_omelet": {
            "name": "mc:homefood_udon_omelet",
            "result": "mc:homefood_udon_omelet",
            "requiredLevel": 445,
            "needHeat": [
                    75,
                    115
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_udon_filling": 1,
                    "minecraft:egg": 2
            },
            "seasonings": {
                    "mc:salt": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1353,
            "baseXp": 902
    },
    "homefood_soba_pilaf": {
            "name": "mc:homefood_soba_pilaf",
            "result": "mc:homefood_soba_pilaf",
            "requiredLevel": 446,
            "needHeat": [
                    80,
                    120
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_soba_diced": 1,
                    "mc:cooked_rice": 1,
                    "mc:butter": 1
            },
            "seasonings": {
                    "mc:pepper": 1
            },
            "maxSeasonings": 1,
            "baseMoney": 1356,
            "baseXp": 904
    }
    // Generated food expansion end
};
