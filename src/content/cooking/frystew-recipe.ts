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
            "mc:flour": 2
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
            "mc:flour": 3,
            "minecraft:egg": 1
        },
        maxCoatings: 2,
        result: "mc:shrimp_tempra",
        baseMoney: 1.2,
        baseXp: 15
    },
    // Generated food expansion start
    "croquette": {
            "name": "mc:croquette",
            "result": "mc:croquette",
            "requiredLevel": 163,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:mashed_potato": 1,
                    "mc:beef_minced_meat": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "lotus_root_tempura": {
            "name": "mc:lotus_root_tempura",
            "result": "mc:lotus_root_tempura",
            "requiredLevel": 163,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:lotus_root_slice": 2,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "mc_fried_potato": {
            "name": "mc:fried_potato",
            "result": "mc:fried_potato",
            "requiredLevel": 163,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "minecraft:potato": 2,
                    "mc:food_oil": 1
            },
            "coatings": {
                    "mc:salt": 1
            },
            "maxCoatings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "sesame_dango": {
            "name": "mc:sesame_dango",
            "result": "mc:sesame_dango",
            "requiredLevel": 163,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:rice_powder": 2,
                    "mc:anko": 1,
                    "mc:food_oil": 1
            },
            "coatings": {
                    "mc:sesame_seed_powder": 1
            },
            "maxCoatings": 1,
            "baseMoney": 507,
            "baseXp": 338
    },
    "tonkatsu": {
            "name": "mc:tonkatsu",
            "result": "mc:tonkatsu",
            "requiredLevel": 163,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:pork_chop": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 507,
            "baseXp": 338
    },
    "cuisine_chicken_cutlet": {
            "name": "mc:cuisine_chicken_cutlet",
            "result": "mc:cuisine_chicken_cutlet",
            "requiredLevel": 300,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:chicken": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_chicken_tempura": {
            "name": "mc:cuisine_chicken_tempura",
            "result": "mc:cuisine_chicken_tempura",
            "requiredLevel": 300,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:chicken": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 918,
            "baseXp": 612
    },
    "cuisine_pork_tempura": {
            "name": "mc:cuisine_pork_tempura",
            "result": "mc:cuisine_pork_tempura",
            "requiredLevel": 301,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:pork_chop": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 921,
            "baseXp": 614
    },
    "cuisine_pork_cutlet": {
            "name": "mc:cuisine_pork_cutlet",
            "result": "mc:cuisine_pork_cutlet",
            "requiredLevel": 302,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:pork_chop": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 924,
            "baseXp": 616
    },
    "cuisine_beef_cutlet": {
            "name": "mc:cuisine_beef_cutlet",
            "result": "mc:cuisine_beef_cutlet",
            "requiredLevel": 303,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:beef_loin": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 927,
            "baseXp": 618
    },
    "cuisine_beef_tempura": {
            "name": "mc:cuisine_beef_tempura",
            "result": "mc:cuisine_beef_tempura",
            "requiredLevel": 303,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:beef_loin": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 927,
            "baseXp": 618
    },
    "cuisine_shrimp_cutlet": {
            "name": "mc:cuisine_shrimp_cutlet",
            "result": "mc:cuisine_shrimp_cutlet",
            "requiredLevel": 304,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:shrimp": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_shrimp_tempura": {
            "name": "mc:cuisine_shrimp_tempura",
            "result": "mc:cuisine_shrimp_tempura",
            "requiredLevel": 304,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:shrimp": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 930,
            "baseXp": 620
    },
    "cuisine_squid_cutlet": {
            "name": "mc:cuisine_squid_cutlet",
            "result": "mc:cuisine_squid_cutlet",
            "requiredLevel": 306,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:squid": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 3,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_squid_tempura": {
            "name": "mc:cuisine_squid_tempura",
            "result": "mc:cuisine_squid_tempura",
            "requiredLevel": 306,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:squid": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 2,
            "baseMoney": 936,
            "baseXp": 624
    },
    "cuisine_salmon_cutlet": {
            "name": "mc:cuisine_salmon_cutlet",
            "result": "mc:cuisine_salmon_cutlet",
            "requiredLevel": 307,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:salmon": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 939,
            "baseXp": 626
    },
    "cuisine_salmon_tempura": {
            "name": "mc:cuisine_salmon_tempura",
            "result": "mc:cuisine_salmon_tempura",
            "requiredLevel": 307,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:salmon": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 939,
            "baseXp": 626
    },
    "cuisine_tuna_cutlet": {
            "name": "mc:cuisine_tuna_cutlet",
            "result": "mc:cuisine_tuna_cutlet",
            "requiredLevel": 309,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:tuna": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 3,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_tuna_tempura": {
            "name": "mc:cuisine_tuna_tempura",
            "result": "mc:cuisine_tuna_tempura",
            "requiredLevel": 309,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:tuna": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 2,
            "baseMoney": 945,
            "baseXp": 630
    },
    "cuisine_egg_cutlet": {
            "name": "mc:cuisine_egg_cutlet",
            "result": "mc:cuisine_egg_cutlet",
            "requiredLevel": 310,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:egg": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 948,
            "baseXp": 632
    },
    "cuisine_egg_tempura": {
            "name": "mc:cuisine_egg_tempura",
            "result": "mc:cuisine_egg_tempura",
            "requiredLevel": 310,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:egg": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 948,
            "baseXp": 632
    },
    "cuisine_cheese_cutlet": {
            "name": "mc:cuisine_cheese_cutlet",
            "result": "mc:cuisine_cheese_cutlet",
            "requiredLevel": 312,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:cheese": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_cheese_tempura": {
            "name": "mc:cuisine_cheese_tempura",
            "result": "mc:cuisine_cheese_tempura",
            "requiredLevel": 312,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:cheese": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 954,
            "baseXp": 636
    },
    "cuisine_bacon_cutlet": {
            "name": "mc:cuisine_bacon_cutlet",
            "result": "mc:cuisine_bacon_cutlet",
            "requiredLevel": 313,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:bacon": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_bacon_tempura": {
            "name": "mc:cuisine_bacon_tempura",
            "result": "mc:cuisine_bacon_tempura",
            "requiredLevel": 313,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:bacon": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 957,
            "baseXp": 638
    },
    "cuisine_mushroom_tempura": {
            "name": "mc:cuisine_mushroom_tempura",
            "result": "mc:cuisine_mushroom_tempura",
            "requiredLevel": 314,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:brown_mushroom": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 960,
            "baseXp": 640
    },
    "cuisine_mushroom_cutlet": {
            "name": "mc:cuisine_mushroom_cutlet",
            "result": "mc:cuisine_mushroom_cutlet",
            "requiredLevel": 315,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:brown_mushroom": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 963,
            "baseXp": 642
    },
    "cuisine_potato_cutlet": {
            "name": "mc:cuisine_potato_cutlet",
            "result": "mc:cuisine_potato_cutlet",
            "requiredLevel": 316,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:potato": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_potato_tempura": {
            "name": "mc:cuisine_potato_tempura",
            "result": "mc:cuisine_potato_tempura",
            "requiredLevel": 316,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:potato": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 966,
            "baseXp": 644
    },
    "cuisine_cabbage_cutlet": {
            "name": "mc:cuisine_cabbage_cutlet",
            "result": "mc:cuisine_cabbage_cutlet",
            "requiredLevel": 318,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:cabbage_chopped": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_cabbage_tempura": {
            "name": "mc:cuisine_cabbage_tempura",
            "result": "mc:cuisine_cabbage_tempura",
            "requiredLevel": 318,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:cabbage_chopped": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 972,
            "baseXp": 648
    },
    "cuisine_spinach_cutlet": {
            "name": "mc:cuisine_spinach_cutlet",
            "result": "mc:cuisine_spinach_cutlet",
            "requiredLevel": 319,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:spinach_chopped": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 975,
            "baseXp": 650
    },
    "cuisine_spinach_tempura": {
            "name": "mc:cuisine_spinach_tempura",
            "result": "mc:cuisine_spinach_tempura",
            "requiredLevel": 319,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:spinach_chopped": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 975,
            "baseXp": 650
    },
    "cuisine_eggplant_tempura": {
            "name": "mc:cuisine_eggplant_tempura",
            "result": "mc:cuisine_eggplant_tempura",
            "requiredLevel": 320,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:eggplant_slice": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:miso": 1
            },
            "maxCoatings": 2,
            "baseMoney": 978,
            "baseXp": 652
    },
    "cuisine_eggplant_cutlet": {
            "name": "mc:cuisine_eggplant_cutlet",
            "result": "mc:cuisine_eggplant_cutlet",
            "requiredLevel": 321,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:eggplant_slice": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:miso": 1
            },
            "maxCoatings": 3,
            "baseMoney": 981,
            "baseXp": 654
    },
    "cuisine_bell_pepper_cutlet": {
            "name": "mc:cuisine_bell_pepper_cutlet",
            "result": "mc:cuisine_bell_pepper_cutlet",
            "requiredLevel": 322,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:bell_pepper_slice": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_bell_pepper_tempura": {
            "name": "mc:cuisine_bell_pepper_tempura",
            "result": "mc:cuisine_bell_pepper_tempura",
            "requiredLevel": 322,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:bell_pepper_slice": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 984,
            "baseXp": 656
    },
    "cuisine_leek_tempura": {
            "name": "mc:cuisine_leek_tempura",
            "result": "mc:cuisine_leek_tempura",
            "requiredLevel": 323,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:leek_chopped": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 2,
            "baseMoney": 987,
            "baseXp": 658
    },
    "cuisine_leek_cutlet": {
            "name": "mc:cuisine_leek_cutlet",
            "result": "mc:cuisine_leek_cutlet",
            "requiredLevel": 324,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:leek_chopped": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 3,
            "baseMoney": 990,
            "baseXp": 660
    },
    "cuisine_ginger_cutlet": {
            "name": "mc:cuisine_ginger_cutlet",
            "result": "mc:cuisine_ginger_cutlet",
            "requiredLevel": 325,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:grated_ginger": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 3,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_ginger_tempura": {
            "name": "mc:cuisine_ginger_tempura",
            "result": "mc:cuisine_ginger_tempura",
            "requiredLevel": 325,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:grated_ginger": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 2,
            "baseMoney": 993,
            "baseXp": 662
    },
    "cuisine_garlic_cutlet": {
            "name": "mc:cuisine_garlic_cutlet",
            "result": "mc:cuisine_garlic_cutlet",
            "requiredLevel": 326,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:garlic_mizin": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 996,
            "baseXp": 664
    },
    "cuisine_garlic_tempura": {
            "name": "mc:cuisine_garlic_tempura",
            "result": "mc:cuisine_garlic_tempura",
            "requiredLevel": 327,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:garlic_mizin": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 999,
            "baseXp": 666
    },
    "cuisine_chili_cutlet": {
            "name": "mc:cuisine_chili_cutlet",
            "result": "mc:cuisine_chili_cutlet",
            "requiredLevel": 328,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:chili_powder": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_chili_tempura": {
            "name": "mc:cuisine_chili_tempura",
            "result": "mc:cuisine_chili_tempura",
            "requiredLevel": 328,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:chili_powder": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1002,
            "baseXp": 668
    },
    "cuisine_tomato_cutlet": {
            "name": "mc:cuisine_tomato_cutlet",
            "result": "mc:cuisine_tomato_cutlet",
            "requiredLevel": 329,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:tomato_sauce": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:basil": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1005,
            "baseXp": 670
    },
    "cuisine_tomato_tempura": {
            "name": "mc:cuisine_tomato_tempura",
            "result": "mc:cuisine_tomato_tempura",
            "requiredLevel": 329,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:tomato_sauce": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:basil": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1005,
            "baseXp": 670
    },
    "cuisine_curry_cutlet": {
            "name": "mc:cuisine_curry_cutlet",
            "result": "mc:cuisine_curry_cutlet",
            "requiredLevel": 331,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:curry_powder": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_curry_tempura": {
            "name": "mc:cuisine_curry_tempura",
            "result": "mc:cuisine_curry_tempura",
            "requiredLevel": 331,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:curry_powder": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1011,
            "baseXp": 674
    },
    "cuisine_miso_cutlet": {
            "name": "mc:cuisine_miso_cutlet",
            "result": "mc:cuisine_miso_cutlet",
            "requiredLevel": 332,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:miso": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:dashi": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1014,
            "baseXp": 676
    },
    "cuisine_miso_tempura": {
            "name": "mc:cuisine_miso_tempura",
            "result": "mc:cuisine_miso_tempura",
            "requiredLevel": 332,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:miso": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:dashi": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1014,
            "baseXp": 676
    },
    "cuisine_soy_cutlet": {
            "name": "mc:cuisine_soy_cutlet",
            "result": "mc:cuisine_soy_cutlet",
            "requiredLevel": 334,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:syoyu": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:leek_chopped": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1020,
            "baseXp": 680
    },
    "cuisine_soy_tempura": {
            "name": "mc:cuisine_soy_tempura",
            "result": "mc:cuisine_soy_tempura",
            "requiredLevel": 334,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:syoyu": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:leek_chopped": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1020,
            "baseXp": 680
    },
    "cuisine_teriyaki_cutlet": {
            "name": "mc:cuisine_teriyaki_cutlet",
            "result": "mc:cuisine_teriyaki_cutlet",
            "requiredLevel": 335,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:teriyaki_sauce": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1023,
            "baseXp": 682
    },
    "cuisine_sesame_tempura": {
            "name": "mc:cuisine_sesame_tempura",
            "result": "mc:cuisine_sesame_tempura",
            "requiredLevel": 336,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:sesame_seed_powder": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1026,
            "baseXp": 684
    },
    "cuisine_teriyaki_tempura": {
            "name": "mc:cuisine_teriyaki_tempura",
            "result": "mc:cuisine_teriyaki_tempura",
            "requiredLevel": 336,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:teriyaki_sauce": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1026,
            "baseXp": 684
    },
    "cuisine_sesame_cutlet": {
            "name": "mc:cuisine_sesame_cutlet",
            "result": "mc:cuisine_sesame_cutlet",
            "requiredLevel": 337,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:sesame_seed_powder": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1029,
            "baseXp": 686
    },
    "cuisine_peanut_cutlet": {
            "name": "mc:cuisine_peanut_cutlet",
            "result": "mc:cuisine_peanut_cutlet",
            "requiredLevel": 338,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:peanut_butter": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_peanut_tempura": {
            "name": "mc:cuisine_peanut_tempura",
            "result": "mc:cuisine_peanut_tempura",
            "requiredLevel": 338,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:peanut_butter": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1032,
            "baseXp": 688
    },
    "cuisine_cream_cutlet": {
            "name": "mc:cuisine_cream_cutlet",
            "result": "mc:cuisine_cream_cutlet",
            "requiredLevel": 340,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:cream_sauce": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_cream_tempura": {
            "name": "mc:cuisine_cream_tempura",
            "result": "mc:cuisine_cream_tempura",
            "requiredLevel": 340,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:cream_sauce": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:pepper": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1038,
            "baseXp": 692
    },
    "cuisine_butter_cutlet": {
            "name": "mc:cuisine_butter_cutlet",
            "result": "mc:cuisine_butter_cutlet",
            "requiredLevel": 341,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:butter": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_butter_tempura": {
            "name": "mc:cuisine_butter_tempura",
            "result": "mc:cuisine_butter_tempura",
            "requiredLevel": 341,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:butter": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1041,
            "baseXp": 694
    },
    "cuisine_herb_cutlet": {
            "name": "mc:cuisine_herb_cutlet",
            "result": "mc:cuisine_herb_cutlet",
            "requiredLevel": 342,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:ovlive_oil": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_herb_tempura": {
            "name": "mc:cuisine_herb_tempura",
            "result": "mc:cuisine_herb_tempura",
            "requiredLevel": 342,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:basil": 1,
                    "mc:shiso_leaf": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:ovlive_oil": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1044,
            "baseXp": 696
    },
    "cuisine_daikon_cutlet": {
            "name": "mc:cuisine_daikon_cutlet",
            "result": "mc:cuisine_daikon_cutlet",
            "requiredLevel": 343,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:daikon_grated": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_daikon_tempura": {
            "name": "mc:cuisine_daikon_tempura",
            "result": "mc:cuisine_daikon_tempura",
            "requiredLevel": 343,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:daikon_grated": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1047,
            "baseXp": 698
    },
    "cuisine_burdock_tempura": {
            "name": "mc:cuisine_burdock_tempura",
            "result": "mc:cuisine_burdock_tempura",
            "requiredLevel": 344,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:burdock_shaved": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1050,
            "baseXp": 700
    },
    "cuisine_burdock_cutlet": {
            "name": "mc:cuisine_burdock_cutlet",
            "result": "mc:cuisine_burdock_cutlet",
            "requiredLevel": 345,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:burdock_shaved": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:syoyu": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_lotus_root_cutlet": {
            "name": "mc:cuisine_lotus_root_cutlet",
            "result": "mc:cuisine_lotus_root_cutlet",
            "requiredLevel": 345,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:lotus_root_slice": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_lotus_root_tempura": {
            "name": "mc:cuisine_lotus_root_tempura",
            "result": "mc:cuisine_lotus_root_tempura",
            "requiredLevel": 345,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:lotus_root_slice": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:salt": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1053,
            "baseXp": 702
    },
    "cuisine_asparagus_cutlet": {
            "name": "mc:cuisine_asparagus_cutlet",
            "result": "mc:cuisine_asparagus_cutlet",
            "requiredLevel": 346,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:asparagus_cut": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:butter": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_asparagus_tempura": {
            "name": "mc:cuisine_asparagus_tempura",
            "result": "mc:cuisine_asparagus_tempura",
            "requiredLevel": 346,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:asparagus_cut": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:butter": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1056,
            "baseXp": 704
    },
    "cuisine_zucchini_cutlet": {
            "name": "mc:cuisine_zucchini_cutlet",
            "result": "mc:cuisine_zucchini_cutlet",
            "requiredLevel": 347,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:zucchini_slice": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "mc:ovlive_oil": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_zucchini_tempura": {
            "name": "mc:cuisine_zucchini_tempura",
            "result": "mc:cuisine_zucchini_tempura",
            "requiredLevel": 347,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:zucchini_slice": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "mc:ovlive_oil": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1059,
            "baseXp": 706
    },
    "cuisine_apple_cutlet": {
            "name": "mc:cuisine_apple_cutlet",
            "result": "mc:cuisine_apple_cutlet",
            "requiredLevel": 348,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:apple": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1062,
            "baseXp": 708
    },
    "cuisine_apple_tempura": {
            "name": "mc:cuisine_apple_tempura",
            "result": "mc:cuisine_apple_tempura",
            "requiredLevel": 348,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "minecraft:apple": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1062,
            "baseXp": 708
    },
    "cuisine_pineapple_cutlet": {
            "name": "mc:cuisine_pineapple_cutlet",
            "result": "mc:cuisine_pineapple_cutlet",
            "requiredLevel": 348,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:pineapple_cut": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1062,
            "baseXp": 708
    },
    "cuisine_pineapple_tempura": {
            "name": "mc:cuisine_pineapple_tempura",
            "result": "mc:cuisine_pineapple_tempura",
            "requiredLevel": 348,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:pineapple_cut": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1062,
            "baseXp": 708
    },
    "cuisine_strawberry_tempura": {
            "name": "mc:cuisine_strawberry_tempura",
            "result": "mc:cuisine_strawberry_tempura",
            "requiredLevel": 348,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:straw_berry": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1062,
            "baseXp": 708
    },
    "cuisine_matcha_cutlet": {
            "name": "mc:cuisine_matcha_cutlet",
            "result": "mc:cuisine_matcha_cutlet",
            "requiredLevel": 349,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:green_tea": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1065,
            "baseXp": 710
    },
    "cuisine_matcha_tempura": {
            "name": "mc:cuisine_matcha_tempura",
            "result": "mc:cuisine_matcha_tempura",
            "requiredLevel": 349,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:green_tea": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1065,
            "baseXp": 710
    },
    "cuisine_mikan_cutlet": {
            "name": "mc:cuisine_mikan_cutlet",
            "result": "mc:cuisine_mikan_cutlet",
            "requiredLevel": 349,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:mikan": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1065,
            "baseXp": 710
    },
    "cuisine_mikan_tempura": {
            "name": "mc:cuisine_mikan_tempura",
            "result": "mc:cuisine_mikan_tempura",
            "requiredLevel": 349,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:mikan": 1
            },
            "coatings": {
                    "mc:tempura_batter": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1065,
            "baseXp": 710
    },
    "cuisine_strawberry_cutlet": {
            "name": "mc:cuisine_strawberry_cutlet",
            "result": "mc:cuisine_strawberry_cutlet",
            "requiredLevel": 349,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:food_oil": 2,
                    "mc:straw_berry": 1
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1,
                    "minecraft:sugar": 1
            },
            "maxCoatings": 3,
            "baseMoney": 1065,
            "baseXp": 710
    },
    "homefood_beetroot_tempura": {
            "name": "mc:homefood_beetroot_tempura",
            "result": "mc:homefood_beetroot_tempura",
            "requiredLevel": 446,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_beetroot_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1356,
            "baseXp": 904
    },
    "homefood_chicken_cutlet": {
            "name": "mc:homefood_chicken_cutlet",
            "result": "mc:homefood_chicken_cutlet",
            "requiredLevel": 446,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_chicken_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1356,
            "baseXp": 904
    },
    "homefood_chicken_tempura": {
            "name": "mc:homefood_chicken_tempura",
            "result": "mc:homefood_chicken_tempura",
            "requiredLevel": 446,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_chicken_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1356,
            "baseXp": 904
    },
    "homefood_pork_croquette": {
            "name": "mc:homefood_pork_croquette",
            "result": "mc:homefood_pork_croquette",
            "requiredLevel": 446,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_pork_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1356,
            "baseXp": 904
    },
    "homefood_curry_tempura": {
            "name": "mc:homefood_curry_tempura",
            "result": "mc:homefood_curry_tempura",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_curry_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_honey_croquette": {
            "name": "mc:homefood_honey_croquette",
            "result": "mc:homefood_honey_croquette",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_honey_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_kelp_cutlet": {
            "name": "mc:homefood_kelp_cutlet",
            "result": "mc:homefood_kelp_cutlet",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_kelp_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_kelp_tempura": {
            "name": "mc:homefood_kelp_tempura",
            "result": "mc:homefood_kelp_tempura",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_kelp_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_matcha_cutlet": {
            "name": "mc:homefood_matcha_cutlet",
            "result": "mc:homefood_matcha_cutlet",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_matcha_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_matcha_tempura": {
            "name": "mc:homefood_matcha_tempura",
            "result": "mc:homefood_matcha_tempura",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_matcha_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_mikan_croquette": {
            "name": "mc:homefood_mikan_croquette",
            "result": "mc:homefood_mikan_croquette",
            "requiredLevel": 447,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_mikan_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1359,
            "baseXp": 906
    },
    "homefood_beef_croquette": {
            "name": "mc:homefood_beef_croquette",
            "result": "mc:homefood_beef_croquette",
            "requiredLevel": 448,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_beef_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1362,
            "baseXp": 908
    },
    "homefood_curry_croquette": {
            "name": "mc:homefood_curry_croquette",
            "result": "mc:homefood_curry_croquette",
            "requiredLevel": 448,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_curry_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1362,
            "baseXp": 908
    },
    "homefood_pork_cutlet": {
            "name": "mc:homefood_pork_cutlet",
            "result": "mc:homefood_pork_cutlet",
            "requiredLevel": 448,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_pork_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1362,
            "baseXp": 908
    },
    "homefood_pork_tempura": {
            "name": "mc:homefood_pork_tempura",
            "result": "mc:homefood_pork_tempura",
            "requiredLevel": 448,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_pork_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1362,
            "baseXp": 908
    },
    "homefood_tomato_cutlet": {
            "name": "mc:homefood_tomato_cutlet",
            "result": "mc:homefood_tomato_cutlet",
            "requiredLevel": 448,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_tomato_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1362,
            "baseXp": 908
    },
    "homefood_tomato_tempura": {
            "name": "mc:homefood_tomato_tempura",
            "result": "mc:homefood_tomato_tempura",
            "requiredLevel": 448,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_tomato_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1362,
            "baseXp": 908
    },
    "homefood_anko_croquette": {
            "name": "mc:homefood_anko_croquette",
            "result": "mc:homefood_anko_croquette",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_anko_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_beetroot_cutlet": {
            "name": "mc:homefood_beetroot_cutlet",
            "result": "mc:homefood_beetroot_cutlet",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_beetroot_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_kelp_croquette": {
            "name": "mc:homefood_kelp_croquette",
            "result": "mc:homefood_kelp_croquette",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_kelp_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_mikan_cutlet": {
            "name": "mc:homefood_mikan_cutlet",
            "result": "mc:homefood_mikan_cutlet",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_mikan_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_mikan_tempura": {
            "name": "mc:homefood_mikan_tempura",
            "result": "mc:homefood_mikan_tempura",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_mikan_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_miso_cutlet": {
            "name": "mc:homefood_miso_cutlet",
            "result": "mc:homefood_miso_cutlet",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_miso_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_miso_tempura": {
            "name": "mc:homefood_miso_tempura",
            "result": "mc:homefood_miso_tempura",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_miso_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_rice_croquette": {
            "name": "mc:homefood_rice_croquette",
            "result": "mc:homefood_rice_croquette",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_rice_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_soy_sauce_croquette": {
            "name": "mc:homefood_soy_sauce_croquette",
            "result": "mc:homefood_soy_sauce_croquette",
            "requiredLevel": 449,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_soy_sauce_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1365,
            "baseXp": 910
    },
    "homefood_curry_cutlet": {
            "name": "mc:homefood_curry_cutlet",
            "result": "mc:homefood_curry_cutlet",
            "requiredLevel": 450,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_curry_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1368,
            "baseXp": 912
    },
    "homefood_honey_cutlet": {
            "name": "mc:homefood_honey_cutlet",
            "result": "mc:homefood_honey_cutlet",
            "requiredLevel": 450,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_honey_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1368,
            "baseXp": 912
    },
    "homefood_honey_tempura": {
            "name": "mc:homefood_honey_tempura",
            "result": "mc:homefood_honey_tempura",
            "requiredLevel": 450,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_honey_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1368,
            "baseXp": 912
    },
    "homefood_bacon_croquette": {
            "name": "mc:homefood_bacon_croquette",
            "result": "mc:homefood_bacon_croquette",
            "requiredLevel": 451,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_bacon_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1371,
            "baseXp": 914
    },
    "homefood_beef_cutlet": {
            "name": "mc:homefood_beef_cutlet",
            "result": "mc:homefood_beef_cutlet",
            "requiredLevel": 451,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_beef_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1371,
            "baseXp": 914
    },
    "homefood_beef_tempura": {
            "name": "mc:homefood_beef_tempura",
            "result": "mc:homefood_beef_tempura",
            "requiredLevel": 451,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_beef_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1371,
            "baseXp": 914
    },
    "homefood_miso_croquette": {
            "name": "mc:homefood_miso_croquette",
            "result": "mc:homefood_miso_croquette",
            "requiredLevel": 451,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_miso_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1371,
            "baseXp": 914
    },
    "homefood_anko_cutlet": {
            "name": "mc:homefood_anko_cutlet",
            "result": "mc:homefood_anko_cutlet",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_anko_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_anko_tempura": {
            "name": "mc:homefood_anko_tempura",
            "result": "mc:homefood_anko_tempura",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_anko_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_milk_croquette": {
            "name": "mc:homefood_milk_croquette",
            "result": "mc:homefood_milk_croquette",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_milk_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_rice_cutlet": {
            "name": "mc:homefood_rice_cutlet",
            "result": "mc:homefood_rice_cutlet",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_rice_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_rice_tempura": {
            "name": "mc:homefood_rice_tempura",
            "result": "mc:homefood_rice_tempura",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_rice_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_soy_sauce_cutlet": {
            "name": "mc:homefood_soy_sauce_cutlet",
            "result": "mc:homefood_soy_sauce_cutlet",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_soy_sauce_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_soy_sauce_tempura": {
            "name": "mc:homefood_soy_sauce_tempura",
            "result": "mc:homefood_soy_sauce_tempura",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_soy_sauce_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_teriyaki_croquette": {
            "name": "mc:homefood_teriyaki_croquette",
            "result": "mc:homefood_teriyaki_croquette",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_teriyaki_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_vinegared_rice_croquette": {
            "name": "mc:homefood_vinegared_rice_croquette",
            "result": "mc:homefood_vinegared_rice_croquette",
            "requiredLevel": 452,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1374,
            "baseXp": 916
    },
    "homefood_bacon_cutlet": {
            "name": "mc:homefood_bacon_cutlet",
            "result": "mc:homefood_bacon_cutlet",
            "requiredLevel": 453,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_bacon_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1377,
            "baseXp": 918
    },
    "homefood_egg_croquette": {
            "name": "mc:homefood_egg_croquette",
            "result": "mc:homefood_egg_croquette",
            "requiredLevel": 453,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_egg_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1377,
            "baseXp": 918
    },
    "homefood_udon_tempura": {
            "name": "mc:homefood_udon_tempura",
            "result": "mc:homefood_udon_tempura",
            "requiredLevel": 453,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_udon_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1377,
            "baseXp": 918
    },
    "homefood_bacon_tempura": {
            "name": "mc:homefood_bacon_tempura",
            "result": "mc:homefood_bacon_tempura",
            "requiredLevel": 454,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_bacon_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1380,
            "baseXp": 920
    },
    "homefood_udon_croquette": {
            "name": "mc:homefood_udon_croquette",
            "result": "mc:homefood_udon_croquette",
            "requiredLevel": 454,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_udon_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1380,
            "baseXp": 920
    },
    "homefood_vinegared_rice_cutlet": {
            "name": "mc:homefood_vinegared_rice_cutlet",
            "result": "mc:homefood_vinegared_rice_cutlet",
            "requiredLevel": 454,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1380,
            "baseXp": 920
    },
    "homefood_vinegared_rice_tempura": {
            "name": "mc:homefood_vinegared_rice_tempura",
            "result": "mc:homefood_vinegared_rice_tempura",
            "requiredLevel": 454,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_vinegared_rice_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1380,
            "baseXp": 920
    },
    "homefood_cheese_tempura": {
            "name": "mc:homefood_cheese_tempura",
            "result": "mc:homefood_cheese_tempura",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_cheese_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_flour_croquette": {
            "name": "mc:homefood_flour_croquette",
            "result": "mc:homefood_flour_croquette",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_flour_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_milk_cutlet": {
            "name": "mc:homefood_milk_cutlet",
            "result": "mc:homefood_milk_cutlet",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_milk_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_milk_tempura": {
            "name": "mc:homefood_milk_tempura",
            "result": "mc:homefood_milk_tempura",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_milk_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_ramen_croquette": {
            "name": "mc:homefood_ramen_croquette",
            "result": "mc:homefood_ramen_croquette",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_ramen_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_sesame_croquette": {
            "name": "mc:homefood_sesame_croquette",
            "result": "mc:homefood_sesame_croquette",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_sesame_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_soba_cutlet": {
            "name": "mc:homefood_soba_cutlet",
            "result": "mc:homefood_soba_cutlet",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_soba_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_soba_tempura": {
            "name": "mc:homefood_soba_tempura",
            "result": "mc:homefood_soba_tempura",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_soba_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_teriyaki_cutlet": {
            "name": "mc:homefood_teriyaki_cutlet",
            "result": "mc:homefood_teriyaki_cutlet",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_teriyaki_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_teriyaki_tempura": {
            "name": "mc:homefood_teriyaki_tempura",
            "result": "mc:homefood_teriyaki_tempura",
            "requiredLevel": 455,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_teriyaki_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1383,
            "baseXp": 922
    },
    "homefood_cheese_croquette": {
            "name": "mc:homefood_cheese_croquette",
            "result": "mc:homefood_cheese_croquette",
            "requiredLevel": 456,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_cheese_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1386,
            "baseXp": 924
    },
    "homefood_egg_cutlet": {
            "name": "mc:homefood_egg_cutlet",
            "result": "mc:homefood_egg_cutlet",
            "requiredLevel": 456,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_egg_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1386,
            "baseXp": 924
    },
    "homefood_egg_tempura": {
            "name": "mc:homefood_egg_tempura",
            "result": "mc:homefood_egg_tempura",
            "requiredLevel": 456,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_egg_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1386,
            "baseXp": 924
    },
    "homefood_soba_croquette": {
            "name": "mc:homefood_soba_croquette",
            "result": "mc:homefood_soba_croquette",
            "requiredLevel": 456,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_soba_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1386,
            "baseXp": 924
    },
    "homefood_mushroom_cutlet": {
            "name": "mc:homefood_mushroom_cutlet",
            "result": "mc:homefood_mushroom_cutlet",
            "requiredLevel": 457,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_mushroom_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1389,
            "baseXp": 926
    },
    "homefood_peanut_croquette": {
            "name": "mc:homefood_peanut_croquette",
            "result": "mc:homefood_peanut_croquette",
            "requiredLevel": 457,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_peanut_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1389,
            "baseXp": 926
    },
    "homefood_potato_croquette": {
            "name": "mc:homefood_potato_croquette",
            "result": "mc:homefood_potato_croquette",
            "requiredLevel": 457,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_potato_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1389,
            "baseXp": 926
    },
    "homefood_sesame_cutlet": {
            "name": "mc:homefood_sesame_cutlet",
            "result": "mc:homefood_sesame_cutlet",
            "requiredLevel": 457,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_sesame_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1389,
            "baseXp": 926
    },
    "homefood_sesame_tempura": {
            "name": "mc:homefood_sesame_tempura",
            "result": "mc:homefood_sesame_tempura",
            "requiredLevel": 457,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_sesame_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1389,
            "baseXp": 926
    },
    "homefood_udon_cutlet": {
            "name": "mc:homefood_udon_cutlet",
            "result": "mc:homefood_udon_cutlet",
            "requiredLevel": 457,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_udon_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1389,
            "baseXp": 926
    },
    "homefood_flour_cutlet": {
            "name": "mc:homefood_flour_cutlet",
            "result": "mc:homefood_flour_cutlet",
            "requiredLevel": 458,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_flour_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1392,
            "baseXp": 928
    },
    "homefood_flour_tempura": {
            "name": "mc:homefood_flour_tempura",
            "result": "mc:homefood_flour_tempura",
            "requiredLevel": 458,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_flour_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1392,
            "baseXp": 928
    },
    "homefood_macaroni_croquette": {
            "name": "mc:homefood_macaroni_croquette",
            "result": "mc:homefood_macaroni_croquette",
            "requiredLevel": 458,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_macaroni_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1392,
            "baseXp": 928
    },
    "homefood_mushroom_tempura": {
            "name": "mc:homefood_mushroom_tempura",
            "result": "mc:homefood_mushroom_tempura",
            "requiredLevel": 458,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_mushroom_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1392,
            "baseXp": 928
    },
    "homefood_ramen_cutlet": {
            "name": "mc:homefood_ramen_cutlet",
            "result": "mc:homefood_ramen_cutlet",
            "requiredLevel": 458,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_ramen_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1392,
            "baseXp": 928
    },
    "homefood_ramen_tempura": {
            "name": "mc:homefood_ramen_tempura",
            "result": "mc:homefood_ramen_tempura",
            "requiredLevel": 458,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_ramen_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1392,
            "baseXp": 928
    },
    "homefood_cheese_cutlet": {
            "name": "mc:homefood_cheese_cutlet",
            "result": "mc:homefood_cheese_cutlet",
            "requiredLevel": 459,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cheese_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1395,
            "baseXp": 930
    },
    "homefood_mushroom_croquette": {
            "name": "mc:homefood_mushroom_croquette",
            "result": "mc:homefood_mushroom_croquette",
            "requiredLevel": 459,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_mushroom_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1395,
            "baseXp": 930
    },
    "homefood_carrot_croquette": {
            "name": "mc:homefood_carrot_croquette",
            "result": "mc:homefood_carrot_croquette",
            "requiredLevel": 460,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_carrot_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1398,
            "baseXp": 932
    },
    "homefood_cream_croquette": {
            "name": "mc:homefood_cream_croquette",
            "result": "mc:homefood_cream_croquette",
            "requiredLevel": 460,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_cream_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1398,
            "baseXp": 932
    },
    "homefood_peanut_cutlet": {
            "name": "mc:homefood_peanut_cutlet",
            "result": "mc:homefood_peanut_cutlet",
            "requiredLevel": 460,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_peanut_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1398,
            "baseXp": 932
    },
    "homefood_peanut_tempura": {
            "name": "mc:homefood_peanut_tempura",
            "result": "mc:homefood_peanut_tempura",
            "requiredLevel": 460,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_peanut_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1398,
            "baseXp": 932
    },
    "homefood_potato_cutlet": {
            "name": "mc:homefood_potato_cutlet",
            "result": "mc:homefood_potato_cutlet",
            "requiredLevel": 460,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_potato_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1398,
            "baseXp": 932
    },
    "homefood_potato_tempura": {
            "name": "mc:homefood_potato_tempura",
            "result": "mc:homefood_potato_tempura",
            "requiredLevel": 460,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_potato_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1398,
            "baseXp": 932
    },
    "homefood_bread_croquette": {
            "name": "mc:homefood_bread_croquette",
            "result": "mc:homefood_bread_croquette",
            "requiredLevel": 461,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_bread_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1401,
            "baseXp": 934
    },
    "homefood_butter_tempura": {
            "name": "mc:homefood_butter_tempura",
            "result": "mc:homefood_butter_tempura",
            "requiredLevel": 461,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_butter_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1401,
            "baseXp": 934
    },
    "homefood_macaroni_cutlet": {
            "name": "mc:homefood_macaroni_cutlet",
            "result": "mc:homefood_macaroni_cutlet",
            "requiredLevel": 461,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_macaroni_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1401,
            "baseXp": 934
    },
    "homefood_macaroni_tempura": {
            "name": "mc:homefood_macaroni_tempura",
            "result": "mc:homefood_macaroni_tempura",
            "requiredLevel": 461,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_macaroni_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1401,
            "baseXp": 934
    },
    "homefood_butter_croquette": {
            "name": "mc:homefood_butter_croquette",
            "result": "mc:homefood_butter_croquette",
            "requiredLevel": 462,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_butter_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1404,
            "baseXp": 936
    },
    "homefood_carrot_cutlet": {
            "name": "mc:homefood_carrot_cutlet",
            "result": "mc:homefood_carrot_cutlet",
            "requiredLevel": 462,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_carrot_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1404,
            "baseXp": 936
    },
    "homefood_cream_cutlet": {
            "name": "mc:homefood_cream_cutlet",
            "result": "mc:homefood_cream_cutlet",
            "requiredLevel": 462,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_cream_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1404,
            "baseXp": 936
    },
    "homefood_cream_tempura": {
            "name": "mc:homefood_cream_tempura",
            "result": "mc:homefood_cream_tempura",
            "requiredLevel": 462,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_cream_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1404,
            "baseXp": 936
    },
    "homefood_bread_cutlet": {
            "name": "mc:homefood_bread_cutlet",
            "result": "mc:homefood_bread_cutlet",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_bread_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_bread_tempura": {
            "name": "mc:homefood_bread_tempura",
            "result": "mc:homefood_bread_tempura",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_bread_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_buns_croquette": {
            "name": "mc:homefood_buns_croquette",
            "result": "mc:homefood_buns_croquette",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_buns_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_carrot_tempura": {
            "name": "mc:homefood_carrot_tempura",
            "result": "mc:homefood_carrot_tempura",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_carrot_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_daikon_croquette": {
            "name": "mc:homefood_daikon_croquette",
            "result": "mc:homefood_daikon_croquette",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_daikon_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_herb_cutlet": {
            "name": "mc:homefood_herb_cutlet",
            "result": "mc:homefood_herb_cutlet",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_herb_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_herb_tempura": {
            "name": "mc:homefood_herb_tempura",
            "result": "mc:homefood_herb_tempura",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_herb_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_onion_croquette": {
            "name": "mc:homefood_onion_croquette",
            "result": "mc:homefood_onion_croquette",
            "requiredLevel": 463,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_onion_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1407,
            "baseXp": 938
    },
    "homefood_butter_cutlet": {
            "name": "mc:homefood_butter_cutlet",
            "result": "mc:homefood_butter_cutlet",
            "requiredLevel": 464,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_butter_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1410,
            "baseXp": 940
    },
    "homefood_herb_croquette": {
            "name": "mc:homefood_herb_croquette",
            "result": "mc:homefood_herb_croquette",
            "requiredLevel": 464,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_herb_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1410,
            "baseXp": 940
    },
    "homefood_buns_cutlet": {
            "name": "mc:homefood_buns_cutlet",
            "result": "mc:homefood_buns_cutlet",
            "requiredLevel": 465,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_buns_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1413,
            "baseXp": 942
    },
    "homefood_cabbage_croquette": {
            "name": "mc:homefood_cabbage_croquette",
            "result": "mc:homefood_cabbage_croquette",
            "requiredLevel": 465,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_cabbage_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1413,
            "baseXp": 942
    },
    "homefood_onion_cutlet": {
            "name": "mc:homefood_onion_cutlet",
            "result": "mc:homefood_onion_cutlet",
            "requiredLevel": 465,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_onion_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1413,
            "baseXp": 942
    },
    "homefood_onion_tempura": {
            "name": "mc:homefood_onion_tempura",
            "result": "mc:homefood_onion_tempura",
            "requiredLevel": 465,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_onion_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1413,
            "baseXp": 942
    },
    "homefood_tortilla_croquette": {
            "name": "mc:homefood_tortilla_croquette",
            "result": "mc:homefood_tortilla_croquette",
            "requiredLevel": 465,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_tortilla_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1413,
            "baseXp": 942
    },
    "homefood_buns_tempura": {
            "name": "mc:homefood_buns_tempura",
            "result": "mc:homefood_buns_tempura",
            "requiredLevel": 466,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_buns_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1416,
            "baseXp": 944
    },
    "homefood_burdock_croquette": {
            "name": "mc:homefood_burdock_croquette",
            "result": "mc:homefood_burdock_croquette",
            "requiredLevel": 466,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_burdock_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1416,
            "baseXp": 944
    },
    "homefood_daikon_cutlet": {
            "name": "mc:homefood_daikon_cutlet",
            "result": "mc:homefood_daikon_cutlet",
            "requiredLevel": 466,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_daikon_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1416,
            "baseXp": 944
    },
    "homefood_daikon_tempura": {
            "name": "mc:homefood_daikon_tempura",
            "result": "mc:homefood_daikon_tempura",
            "requiredLevel": 466,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_daikon_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1416,
            "baseXp": 944
    },
    "homefood_pie_dough_tempura": {
            "name": "mc:homefood_pie_dough_tempura",
            "result": "mc:homefood_pie_dough_tempura",
            "requiredLevel": 466,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pie_dough_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1416,
            "baseXp": 944
    },
    "homefood_cabbage_cutlet": {
            "name": "mc:homefood_cabbage_cutlet",
            "result": "mc:homefood_cabbage_cutlet",
            "requiredLevel": 467,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_cabbage_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1419,
            "baseXp": 946
    },
    "homefood_cabbage_tempura": {
            "name": "mc:homefood_cabbage_tempura",
            "result": "mc:homefood_cabbage_tempura",
            "requiredLevel": 467,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_cabbage_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1419,
            "baseXp": 946
    },
    "homefood_spinach_croquette": {
            "name": "mc:homefood_spinach_croquette",
            "result": "mc:homefood_spinach_croquette",
            "requiredLevel": 467,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_spinach_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1419,
            "baseXp": 946
    },
    "homefood_burdock_cutlet": {
            "name": "mc:homefood_burdock_cutlet",
            "result": "mc:homefood_burdock_cutlet",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_burdock_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_burdock_tempura": {
            "name": "mc:homefood_burdock_tempura",
            "result": "mc:homefood_burdock_tempura",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_burdock_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_eggplant_tempura": {
            "name": "mc:homefood_eggplant_tempura",
            "result": "mc:homefood_eggplant_tempura",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_eggplant_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_lotus_root_croquette": {
            "name": "mc:homefood_lotus_root_croquette",
            "result": "mc:homefood_lotus_root_croquette",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_lotus_root_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_pie_dough_croquette": {
            "name": "mc:homefood_pie_dough_croquette",
            "result": "mc:homefood_pie_dough_croquette",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pie_dough_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_tortilla_cutlet": {
            "name": "mc:homefood_tortilla_cutlet",
            "result": "mc:homefood_tortilla_cutlet",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_tortilla_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_tortilla_tempura": {
            "name": "mc:homefood_tortilla_tempura",
            "result": "mc:homefood_tortilla_tempura",
            "requiredLevel": 468,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_tortilla_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1422,
            "baseXp": 948
    },
    "homefood_chocolate_croquette": {
            "name": "mc:homefood_chocolate_croquette",
            "result": "mc:homefood_chocolate_croquette",
            "requiredLevel": 469,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_chocolate_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1425,
            "baseXp": 950
    },
    "homefood_custard_cutlet": {
            "name": "mc:homefood_custard_cutlet",
            "result": "mc:homefood_custard_cutlet",
            "requiredLevel": 469,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_custard_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1425,
            "baseXp": 950
    },
    "homefood_custard_tempura": {
            "name": "mc:homefood_custard_tempura",
            "result": "mc:homefood_custard_tempura",
            "requiredLevel": 469,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_custard_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1425,
            "baseXp": 950
    },
    "homefood_eggplant_croquette": {
            "name": "mc:homefood_eggplant_croquette",
            "result": "mc:homefood_eggplant_croquette",
            "requiredLevel": 469,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_eggplant_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1425,
            "baseXp": 950
    },
    "homefood_spinach_cutlet": {
            "name": "mc:homefood_spinach_cutlet",
            "result": "mc:homefood_spinach_cutlet",
            "requiredLevel": 469,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_spinach_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1425,
            "baseXp": 950
    },
    "homefood_asparagus_croquette": {
            "name": "mc:homefood_asparagus_croquette",
            "result": "mc:homefood_asparagus_croquette",
            "requiredLevel": 470,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_asparagus_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1428,
            "baseXp": 952
    },
    "homefood_custard_croquette": {
            "name": "mc:homefood_custard_croquette",
            "result": "mc:homefood_custard_croquette",
            "requiredLevel": 470,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_custard_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1428,
            "baseXp": 952
    },
    "homefood_lotus_root_cutlet": {
            "name": "mc:homefood_lotus_root_cutlet",
            "result": "mc:homefood_lotus_root_cutlet",
            "requiredLevel": 470,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_lotus_root_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1428,
            "baseXp": 952
    },
    "homefood_pie_dough_cutlet": {
            "name": "mc:homefood_pie_dough_cutlet",
            "result": "mc:homefood_pie_dough_cutlet",
            "requiredLevel": 470,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pie_dough_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1428,
            "baseXp": 952
    },
    "homefood_spinach_tempura": {
            "name": "mc:homefood_spinach_tempura",
            "result": "mc:homefood_spinach_tempura",
            "requiredLevel": 470,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_spinach_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1428,
            "baseXp": 952
    },
    "homefood_bell_pepper_cutlet": {
            "name": "mc:homefood_bell_pepper_cutlet",
            "result": "mc:homefood_bell_pepper_cutlet",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_bell_pepper_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_bell_pepper_tempura": {
            "name": "mc:homefood_bell_pepper_tempura",
            "result": "mc:homefood_bell_pepper_tempura",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_bell_pepper_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_chocolate_cutlet": {
            "name": "mc:homefood_chocolate_cutlet",
            "result": "mc:homefood_chocolate_cutlet",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_chocolate_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_chocolate_tempura": {
            "name": "mc:homefood_chocolate_tempura",
            "result": "mc:homefood_chocolate_tempura",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_chocolate_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_coffee_croquette": {
            "name": "mc:homefood_coffee_croquette",
            "result": "mc:homefood_coffee_croquette",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_coffee_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_leek_croquette": {
            "name": "mc:homefood_leek_croquette",
            "result": "mc:homefood_leek_croquette",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_leek_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_lotus_root_tempura": {
            "name": "mc:homefood_lotus_root_tempura",
            "result": "mc:homefood_lotus_root_tempura",
            "requiredLevel": 471,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_lotus_root_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1431,
            "baseXp": 954
    },
    "homefood_bell_pepper_croquette": {
            "name": "mc:homefood_bell_pepper_croquette",
            "result": "mc:homefood_bell_pepper_croquette",
            "requiredLevel": 472,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_bell_pepper_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1434,
            "baseXp": 956
    },
    "homefood_eggplant_cutlet": {
            "name": "mc:homefood_eggplant_cutlet",
            "result": "mc:homefood_eggplant_cutlet",
            "requiredLevel": 472,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_eggplant_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1434,
            "baseXp": 956
    },
    "homefood_asparagus_cutlet": {
            "name": "mc:homefood_asparagus_cutlet",
            "result": "mc:homefood_asparagus_cutlet",
            "requiredLevel": 473,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_asparagus_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1437,
            "baseXp": 958
    },
    "homefood_asparagus_tempura": {
            "name": "mc:homefood_asparagus_tempura",
            "result": "mc:homefood_asparagus_tempura",
            "requiredLevel": 473,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_asparagus_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1437,
            "baseXp": 958
    },
    "homefood_ginger_croquette": {
            "name": "mc:homefood_ginger_croquette",
            "result": "mc:homefood_ginger_croquette",
            "requiredLevel": 473,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_ginger_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1437,
            "baseXp": 958
    },
    "homefood_zucchini_croquette": {
            "name": "mc:homefood_zucchini_croquette",
            "result": "mc:homefood_zucchini_croquette",
            "requiredLevel": 473,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_zucchini_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1437,
            "baseXp": 958
    },
    "homefood_barley_croquette": {
            "name": "mc:homefood_barley_croquette",
            "result": "mc:homefood_barley_croquette",
            "requiredLevel": 474,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_barley_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1440,
            "baseXp": 960
    },
    "homefood_coffee_cutlet": {
            "name": "mc:homefood_coffee_cutlet",
            "result": "mc:homefood_coffee_cutlet",
            "requiredLevel": 474,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_coffee_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1440,
            "baseXp": 960
    },
    "homefood_coffee_tempura": {
            "name": "mc:homefood_coffee_tempura",
            "result": "mc:homefood_coffee_tempura",
            "requiredLevel": 474,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_coffee_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1440,
            "baseXp": 960
    },
    "homefood_leek_cutlet": {
            "name": "mc:homefood_leek_cutlet",
            "result": "mc:homefood_leek_cutlet",
            "requiredLevel": 474,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_leek_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1440,
            "baseXp": 960
    },
    "homefood_leek_tempura": {
            "name": "mc:homefood_leek_tempura",
            "result": "mc:homefood_leek_tempura",
            "requiredLevel": 474,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_leek_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1440,
            "baseXp": 960
    },
    "homefood_pineapple_tempura": {
            "name": "mc:homefood_pineapple_tempura",
            "result": "mc:homefood_pineapple_tempura",
            "requiredLevel": 474,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_pineapple_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1440,
            "baseXp": 960
    },
    "homefood_pineapple_croquette": {
            "name": "mc:homefood_pineapple_croquette",
            "result": "mc:homefood_pineapple_croquette",
            "requiredLevel": 475,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pineapple_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1443,
            "baseXp": 962
    },
    "homefood_zucchini_cutlet": {
            "name": "mc:homefood_zucchini_cutlet",
            "result": "mc:homefood_zucchini_cutlet",
            "requiredLevel": 475,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_zucchini_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1443,
            "baseXp": 962
    },
    "homefood_apple_cutlet": {
            "name": "mc:homefood_apple_cutlet",
            "result": "mc:homefood_apple_cutlet",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_apple_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_barley_cutlet": {
            "name": "mc:homefood_barley_cutlet",
            "result": "mc:homefood_barley_cutlet",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_barley_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_barley_tempura": {
            "name": "mc:homefood_barley_tempura",
            "result": "mc:homefood_barley_tempura",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_barley_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_garlic_croquette": {
            "name": "mc:homefood_garlic_croquette",
            "result": "mc:homefood_garlic_croquette",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_garlic_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_ginger_cutlet": {
            "name": "mc:homefood_ginger_cutlet",
            "result": "mc:homefood_ginger_cutlet",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_ginger_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_ginger_tempura": {
            "name": "mc:homefood_ginger_tempura",
            "result": "mc:homefood_ginger_tempura",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_ginger_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_sweet_corn_croquette": {
            "name": "mc:homefood_sweet_corn_croquette",
            "result": "mc:homefood_sweet_corn_croquette",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_sweet_corn_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_zucchini_tempura": {
            "name": "mc:homefood_zucchini_tempura",
            "result": "mc:homefood_zucchini_tempura",
            "requiredLevel": 476,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_zucchini_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1446,
            "baseXp": 964
    },
    "homefood_apple_tempura": {
            "name": "mc:homefood_apple_tempura",
            "result": "mc:homefood_apple_tempura",
            "requiredLevel": 477,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_apple_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1449,
            "baseXp": 966
    },
    "homefood_strawberry_croquette": {
            "name": "mc:homefood_strawberry_croquette",
            "result": "mc:homefood_strawberry_croquette",
            "requiredLevel": 477,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_strawberry_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1449,
            "baseXp": 966
    },
    "homefood_apple_croquette": {
            "name": "mc:homefood_apple_croquette",
            "result": "mc:homefood_apple_croquette",
            "requiredLevel": 478,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_apple_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1452,
            "baseXp": 968
    },
    "homefood_chili_croquette": {
            "name": "mc:homefood_chili_croquette",
            "result": "mc:homefood_chili_croquette",
            "requiredLevel": 478,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_chili_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1452,
            "baseXp": 968
    },
    "homefood_garlic_cutlet": {
            "name": "mc:homefood_garlic_cutlet",
            "result": "mc:homefood_garlic_cutlet",
            "requiredLevel": 478,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 10,
            "ingredients": {
                    "mc:homeprep_garlic_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1452,
            "baseXp": 968
    },
    "homefood_garlic_tempura": {
            "name": "mc:homefood_garlic_tempura",
            "result": "mc:homefood_garlic_tempura",
            "requiredLevel": 478,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_garlic_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1452,
            "baseXp": 968
    },
    "homefood_pineapple_cutlet": {
            "name": "mc:homefood_pineapple_cutlet",
            "result": "mc:homefood_pineapple_cutlet",
            "requiredLevel": 478,
            "needTemp": [
                    175,
                    195
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pineapple_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1452,
            "baseXp": 968
    },
    "homefood_chicken_croquette": {
            "name": "mc:homefood_chicken_croquette",
            "result": "mc:homefood_chicken_croquette",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 7,
            "ingredients": {
                    "mc:homeprep_chicken_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_matcha_croquette": {
            "name": "mc:homefood_matcha_croquette",
            "result": "mc:homefood_matcha_croquette",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_matcha_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_pumpkin_croquette": {
            "name": "mc:homefood_pumpkin_croquette",
            "result": "mc:homefood_pumpkin_croquette",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_pumpkin_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_strawberry_cutlet": {
            "name": "mc:homefood_strawberry_cutlet",
            "result": "mc:homefood_strawberry_cutlet",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 8,
            "ingredients": {
                    "mc:homeprep_strawberry_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_strawberry_tempura": {
            "name": "mc:homefood_strawberry_tempura",
            "result": "mc:homefood_strawberry_tempura",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 9,
            "ingredients": {
                    "mc:homeprep_strawberry_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_sweet_corn_cutlet": {
            "name": "mc:homefood_sweet_corn_cutlet",
            "result": "mc:homefood_sweet_corn_cutlet",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_sweet_corn_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_sweet_corn_tempura": {
            "name": "mc:homefood_sweet_corn_tempura",
            "result": "mc:homefood_sweet_corn_tempura",
            "requiredLevel": 479,
            "needTemp": [
                    180,
                    200
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_sweet_corn_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1455,
            "baseXp": 970
    },
    "homefood_chili_cutlet": {
            "name": "mc:homefood_chili_cutlet",
            "result": "mc:homefood_chili_cutlet",
            "requiredLevel": 480,
            "needTemp": [
                    165,
                    185
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_chili_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1458,
            "baseXp": 972
    },
    "homefood_beetroot_croquette": {
            "name": "mc:homefood_beetroot_croquette",
            "result": "mc:homefood_beetroot_croquette",
            "requiredLevel": 481,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_beetroot_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1461,
            "baseXp": 974
    },
    "homefood_chili_tempura": {
            "name": "mc:homefood_chili_tempura",
            "result": "mc:homefood_chili_tempura",
            "requiredLevel": 481,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_chili_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1461,
            "baseXp": 974
    },
    "homefood_pumpkin_cutlet": {
            "name": "mc:homefood_pumpkin_cutlet",
            "result": "mc:homefood_pumpkin_cutlet",
            "requiredLevel": 481,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 12,
            "ingredients": {
                    "mc:homeprep_pumpkin_diced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1,
                    "minecraft:egg": 1
            },
            "maxCoatings": 2,
            "baseMoney": 1461,
            "baseXp": 974
    },
    "homefood_pumpkin_tempura": {
            "name": "mc:homefood_pumpkin_tempura",
            "result": "mc:homefood_pumpkin_tempura",
            "requiredLevel": 481,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 13,
            "ingredients": {
                    "mc:homeprep_pumpkin_sliced": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:tempura_batter": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1461,
            "baseXp": 974
    },
    "homefood_tomato_croquette": {
            "name": "mc:homefood_tomato_croquette",
            "result": "mc:homefood_tomato_croquette",
            "requiredLevel": 481,
            "needTemp": [
                    170,
                    190
            ],
            "baseActions": 11,
            "ingredients": {
                    "mc:homeprep_tomato_filling": 1,
                    "mc:mashed_potato": 1,
                    "mc:food_oil": 2
            },
            "coatings": {
                    "mc:breadcrumbs": 1
            },
            "maxCoatings": 1,
            "baseMoney": 1461,
            "baseXp": 974
    }
    // Generated food expansion end
};