export const FermentationMachineRecipes = {
    "absinthe": {
        name: "mc:absinthe",
        result: "mc:absinthe",
        requiredLevel: 100,
        ingredients: { "minecraft:potion": 1, "mc:basil": 1 },
    },
    "beer": {
        name: "mc:beer",
        result: "mc:beer",
        requiredLevel: 19,
        ingredients: { "minecraft:potion": 1, "minecraft:wheat": 1 },
    },
    "butter": {
        name: "mc:butter",
        result: [{ id: "mc:butter", count: 1 }, { id: "minecraft:bucket", count: 1 }],
        requiredLevel: 3,
        ingredients: { "mc:salt": 1, "minecraft:milk_bucket": 1 },
    },
    "bacon": {
        name: "mc:bacon",
        result: { id: "mc:bacon", count: 2 },
        requiredLevel: 100,
        ingredients: { "mc:pork_boned_rib": 1, "mc:salt": 1, "mc:pepper": 1, "mc:basil": 1, "minecraft:sugar": 1, "mc:garlic_mizin": 1 },
    },
    "roasted_pork_fillet": {
        name: "mc:roasted_pork_fillet",
        result: [{ id: "mc:roasted_pork_fillet", count: 2 }, { id: "minecraft:glass_bottle", count: 1 }],
        requiredLevel: 100,
        ingredients: { "mc:pepper": 1, "mc:garlic_mizin": 1, "mc:sake": 1, "mc:salt": 1, "minecraft:honey_bottle": 1, "mc:pork_shoulder_loin": 1, "mc:syoyu": 1 },
    },
    "miso": {
        name: "mc:miso",
        result: { id: "mc:miso", count: 2 },
        requiredLevel: 100,
        ingredients: { "mc:salt": 1, "mc:yeast": 1, "mc:soybeans": 1 },
    },
    "syoyu": {
        name: "mc:syoyu",
        result: "mc:syoyu",
        requiredLevel: 100,
        ingredients: { "mc:salt": 1, "mc:yeast": 1, "mc:soybeans": 1, "minecraft:wheat": 1 },
    },
    "yeast": {
        name: "mc:yeast",
        result: [{ id: "mc:yeast", count: 2 }, { id: "minecraft:glass_bottle", count: 1 }],
        requiredLevel: 4,
        ingredients: { "minecraft:potion": 1, "minecraft:wheat": 2 },
    },
    "red_wine": {
        name: "mc:red_wine",
        result: "mc:red_wine",
        requiredLevel: 100,
        ingredients: { "minecraft:sweet_berries": 5, "minecraft:potion": 1 },
    },
    "sake": {
        name: "mc:sake",
        result: "mc:sake",
        requiredLevel: 100,
        ingredients: { "minecraft:potion": 1, "mc:rice": 1 },
    },
    "soda": {
        name: "mc:soda",
        result: "mc:soda",
        requiredLevel: 100,
        ingredients: { "minecraft:potion": 1, "minecraft:sugar": 1 },
    },
    "softcream": {
        name: "mc:softcream",
        result: [{ id: "mc:softcream", count: 1 }, { id: "minecraft:bucket", count: 1 }],
        requiredLevel: 100,
        ingredients: { "minecraft:milk_bucket": 1, "minecraft:wheat": 3, "minecraft:blue_ice": 1 },
    },
    "vinegar": {
        name: "mc:vinegar",
        result: [{ id: "mc:vinegar", count: 1 }, { id: "minecraft:bone_meal", count: 1 }],
        requiredLevel: 100,
        ingredients: { "minecraft:potion": 1, "mc:rice": 1, "mc:yeast": 1 },
    },
    "vodka": {
        name: "mc:vodka",
        result: "mc:vodka",
        requiredLevel: 100,
        ingredients: { "minecraft:potion": 1, "minecraft:wheat": 1, "mc:barley": 1, "minecraft:potato": 1 },
    },
    "whiskey": {
        name: "mc:whiskey",
        result: "mc:whiskey",
        requiredLevel: 100,
        ingredients: { "minecraft:potion": 1, "mc:barley": 1 },
    },
    "white_wine": {
        name: "mc:white_wine",
        result: "mc:white_wine",
        requiredLevel: 100,
        ingredients: { "minecraft:glow_berries": 5, "minecraft:potion": 1 },
    },
    // Generated food expansion start
    "alcohol_barley_ale": {
            "name": "mc:alcohol_barley_ale",
            "result": [
                    {
                            "id": "mc:alcohol_barley_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:barley": 1
            }
    },
    "alcohol_barley_wine": {
            "name": "mc:alcohol_barley_wine",
            "result": [
                    {
                            "id": "mc:alcohol_barley_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:barley": 1
            }
    },
    "alcohol_basil_ale": {
            "name": "mc:alcohol_basil_ale",
            "result": [
                    {
                            "id": "mc:alcohol_basil_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:basil": 1
            }
    },
    "alcohol_basil_wine": {
            "name": "mc:alcohol_basil_wine",
            "result": [
                    {
                            "id": "mc:alcohol_basil_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:basil": 1
            }
    },
    "alcohol_carrot_aged": {
            "name": "mc:alcohol_carrot_aged",
            "result": [
                    {
                            "id": "mc:alcohol_carrot_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:carrot": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_carrot_spirit": {
            "name": "mc:alcohol_carrot_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_carrot_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:carrot": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_coffee_liqueur": {
            "name": "mc:alcohol_coffee_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_coffee_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:coffee": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_coffee_spirit": {
            "name": "mc:alcohol_coffee_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_coffee_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:coffee": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_green_tea_liqueur": {
            "name": "mc:alcohol_green_tea_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_green_tea_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_green_tea_wine": {
            "name": "mc:alcohol_green_tea_wine",
            "result": [
                    {
                            "id": "mc:alcohol_green_tea_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1
            }
    },
    "alcohol_matcha_ale": {
            "name": "mc:alcohol_matcha_ale",
            "result": [
                    {
                            "id": "mc:alcohol_matcha_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1
            }
    },
    "alcohol_matcha_wine": {
            "name": "mc:alcohol_matcha_wine",
            "result": [
                    {
                            "id": "mc:alcohol_matcha_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1
            }
    },
    "alcohol_rice_ale": {
            "name": "mc:alcohol_rice_ale",
            "result": [
                    {
                            "id": "mc:alcohol_rice_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:rice": 1
            }
    },
    "alcohol_rice_wine": {
            "name": "mc:alcohol_rice_wine",
            "result": [
                    {
                            "id": "mc:alcohol_rice_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:rice": 1
            }
    },
    "alcohol_sugarcane_aged": {
            "name": "mc:alcohol_sugarcane_aged",
            "result": [
                    {
                            "id": "mc:alcohol_sugarcane_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 492,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sugar_cane": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_apple_wine": {
            "name": "mc:alcohol_apple_wine",
            "result": [
                    {
                            "id": "mc:alcohol_apple_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:apple": 1
            }
    },
    "alcohol_barley_liqueur": {
            "name": "mc:alcohol_barley_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_barley_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:barley": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_barley_spirit": {
            "name": "mc:alcohol_barley_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_barley_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:barley": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_basil_liqueur": {
            "name": "mc:alcohol_basil_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_basil_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:basil": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_coffee_aged": {
            "name": "mc:alcohol_coffee_aged",
            "result": [
                    {
                            "id": "mc:alcohol_coffee_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:coffee": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_ginger_ale": {
            "name": "mc:alcohol_ginger_ale",
            "result": [
                    {
                            "id": "mc:alcohol_ginger_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:grated_ginger": 1
            }
    },
    "alcohol_green_tea_aged": {
            "name": "mc:alcohol_green_tea_aged",
            "result": [
                    {
                            "id": "mc:alcohol_green_tea_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_green_tea_spirit": {
            "name": "mc:alcohol_green_tea_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_green_tea_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_matcha_liqueur": {
            "name": "mc:alcohol_matcha_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_matcha_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_matcha_spirit": {
            "name": "mc:alcohol_matcha_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_matcha_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_peanut_wine": {
            "name": "mc:alcohol_peanut_wine",
            "result": [
                    {
                            "id": "mc:alcohol_peanut_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:peanut": 1
            }
    },
    "alcohol_potato_ale": {
            "name": "mc:alcohol_potato_ale",
            "result": [
                    {
                            "id": "mc:alcohol_potato_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:potato": 1
            }
    },
    "alcohol_rice_liqueur": {
            "name": "mc:alcohol_rice_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_rice_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:rice": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_shiso_ale": {
            "name": "mc:alcohol_shiso_ale",
            "result": [
                    {
                            "id": "mc:alcohol_shiso_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:shiso_leaf": 1
            }
    },
    "alcohol_shiso_wine": {
            "name": "mc:alcohol_shiso_wine",
            "result": [
                    {
                            "id": "mc:alcohol_shiso_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:shiso_leaf": 1
            }
    },
    "alcohol_wheat_ale": {
            "name": "mc:alcohol_wheat_ale",
            "result": [
                    {
                            "id": "mc:alcohol_wheat_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:wheat": 1
            }
    },
    "alcohol_wheat_wine": {
            "name": "mc:alcohol_wheat_wine",
            "result": [
                    {
                            "id": "mc:alcohol_wheat_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 493,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:wheat": 1
            }
    },
    "alcohol_apple_ale": {
            "name": "mc:alcohol_apple_ale",
            "result": [
                    {
                            "id": "mc:alcohol_apple_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:apple": 1
            }
    },
    "alcohol_barley_aged": {
            "name": "mc:alcohol_barley_aged",
            "result": [
                    {
                            "id": "mc:alcohol_barley_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:barley": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_basil_aged": {
            "name": "mc:alcohol_basil_aged",
            "result": [
                    {
                            "id": "mc:alcohol_basil_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:basil": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_basil_spirit": {
            "name": "mc:alcohol_basil_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_basil_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:basil": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_berry_ale": {
            "name": "mc:alcohol_berry_ale",
            "result": [
                    {
                            "id": "mc:alcohol_berry_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sweet_berries": 2
            }
    },
    "alcohol_ginger_liqueur": {
            "name": "mc:alcohol_ginger_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_ginger_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:grated_ginger": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_ginger_wine": {
            "name": "mc:alcohol_ginger_wine",
            "result": [
                    {
                            "id": "mc:alcohol_ginger_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:grated_ginger": 1
            }
    },
    "alcohol_matcha_aged": {
            "name": "mc:alcohol_matcha_aged",
            "result": [
                    {
                            "id": "mc:alcohol_matcha_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_peanut_ale": {
            "name": "mc:alcohol_peanut_ale",
            "result": [
                    {
                            "id": "mc:alcohol_peanut_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:peanut": 1
            }
    },
    "alcohol_potato_liqueur": {
            "name": "mc:alcohol_potato_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_potato_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:potato": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_potato_wine": {
            "name": "mc:alcohol_potato_wine",
            "result": [
                    {
                            "id": "mc:alcohol_potato_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:potato": 1
            }
    },
    "alcohol_rice_aged": {
            "name": "mc:alcohol_rice_aged",
            "result": [
                    {
                            "id": "mc:alcohol_rice_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:rice": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_rice_spirit": {
            "name": "mc:alcohol_rice_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_rice_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:rice": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sesame_ale": {
            "name": "mc:alcohol_sesame_ale",
            "result": [
                    {
                            "id": "mc:alcohol_sesame_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sesame_seed_powder": 1
            }
    },
    "alcohol_shiso_liqueur": {
            "name": "mc:alcohol_shiso_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_shiso_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:shiso_leaf": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_shiso_spirit": {
            "name": "mc:alcohol_shiso_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_shiso_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:shiso_leaf": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_wheat_spirit": {
            "name": "mc:alcohol_wheat_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_wheat_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 494,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:wheat": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_apple_liqueur": {
            "name": "mc:alcohol_apple_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_apple_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:apple": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_apple_spirit": {
            "name": "mc:alcohol_apple_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_apple_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:apple": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_berry_wine": {
            "name": "mc:alcohol_berry_wine",
            "result": [
                    {
                            "id": "mc:alcohol_berry_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sweet_berries": 2
            }
    },
    "alcohol_chocolate_ale": {
            "name": "mc:alcohol_chocolate_ale",
            "result": [
                    {
                            "id": "mc:alcohol_chocolate_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk_chocolate": 1
            }
    },
    "alcohol_ginger_aged": {
            "name": "mc:alcohol_ginger_aged",
            "result": [
                    {
                            "id": "mc:alcohol_ginger_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:grated_ginger": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_ginger_spirit": {
            "name": "mc:alcohol_ginger_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_ginger_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:grated_ginger": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_glowberry_ale": {
            "name": "mc:alcohol_glowberry_ale",
            "result": [
                    {
                            "id": "mc:alcohol_glowberry_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:glow_berries": 2
            }
    },
    "alcohol_glowberry_wine": {
            "name": "mc:alcohol_glowberry_wine",
            "result": [
                    {
                            "id": "mc:alcohol_glowberry_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:glow_berries": 2
            }
    },
    "alcohol_honey_ale": {
            "name": "mc:alcohol_honey_ale",
            "result": [
                    {
                            "id": "mc:alcohol_honey_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:honey_bottle": 1
            }
    },
    "alcohol_milk_ale": {
            "name": "mc:alcohol_milk_ale",
            "result": [
                    {
                            "id": "mc:alcohol_milk_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk": 1
            }
    },
    "alcohol_milk_wine": {
            "name": "mc:alcohol_milk_wine",
            "result": [
                    {
                            "id": "mc:alcohol_milk_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk": 1
            }
    },
    "alcohol_peanut_liqueur": {
            "name": "mc:alcohol_peanut_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_peanut_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:peanut": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_potato_spirit": {
            "name": "mc:alcohol_potato_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_potato_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:potato": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sesame_wine": {
            "name": "mc:alcohol_sesame_wine",
            "result": [
                    {
                            "id": "mc:alcohol_sesame_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sesame_seed_powder": 1
            }
    },
    "alcohol_shiso_aged": {
            "name": "mc:alcohol_shiso_aged",
            "result": [
                    {
                            "id": "mc:alcohol_shiso_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:shiso_leaf": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_wheat_aged": {
            "name": "mc:alcohol_wheat_aged",
            "result": [
                    {
                            "id": "mc:alcohol_wheat_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:wheat": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_wheat_liqueur": {
            "name": "mc:alcohol_wheat_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_wheat_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 495,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:wheat": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_apple_aged": {
            "name": "mc:alcohol_apple_aged",
            "result": [
                    {
                            "id": "mc:alcohol_apple_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:apple": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_berry_liqueur": {
            "name": "mc:alcohol_berry_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_berry_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sweet_berries": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_berry_spirit": {
            "name": "mc:alcohol_berry_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_berry_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sweet_berries": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_chocolate_wine": {
            "name": "mc:alcohol_chocolate_wine",
            "result": [
                    {
                            "id": "mc:alcohol_chocolate_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk_chocolate": 1
            }
    },
    "alcohol_glowberry_liqueur": {
            "name": "mc:alcohol_glowberry_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_glowberry_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:glow_berries": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_honey_wine": {
            "name": "mc:alcohol_honey_wine",
            "result": [
                    {
                            "id": "mc:alcohol_honey_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:honey_bottle": 1
            }
    },
    "alcohol_kelp_wine": {
            "name": "mc:alcohol_kelp_wine",
            "result": [
                    {
                            "id": "mc:alcohol_kelp_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:kelp": 1
            }
    },
    "alcohol_melon_wine": {
            "name": "mc:alcohol_melon_wine",
            "result": [
                    {
                            "id": "mc:alcohol_melon_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:melon_slice": 2
            }
    },
    "alcohol_mikan_ale": {
            "name": "mc:alcohol_mikan_ale",
            "result": [
                    {
                            "id": "mc:alcohol_mikan_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:mikan": 1
            }
    },
    "alcohol_milk_liqueur": {
            "name": "mc:alcohol_milk_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_milk_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mushroom_ale": {
            "name": "mc:alcohol_mushroom_ale",
            "result": [
                    {
                            "id": "mc:alcohol_mushroom_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:brown_mushroom": 1
            }
    },
    "alcohol_peanut_aged": {
            "name": "mc:alcohol_peanut_aged",
            "result": [
                    {
                            "id": "mc:alcohol_peanut_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:peanut": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_peanut_spirit": {
            "name": "mc:alcohol_peanut_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_peanut_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:peanut": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pineapple_ale": {
            "name": "mc:alcohol_pineapple_ale",
            "result": [
                    {
                            "id": "mc:alcohol_pineapple_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:pineapple_cut": 1
            }
    },
    "alcohol_potato_aged": {
            "name": "mc:alcohol_potato_aged",
            "result": [
                    {
                            "id": "mc:alcohol_potato_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:potato": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sesame_liqueur": {
            "name": "mc:alcohol_sesame_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_sesame_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sesame_seed_powder": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sesame_spirit": {
            "name": "mc:alcohol_sesame_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_sesame_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 496,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sesame_seed_powder": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_berry_aged": {
            "name": "mc:alcohol_berry_aged",
            "result": [
                    {
                            "id": "mc:alcohol_berry_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sweet_berries": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_chocolate_liqueur": {
            "name": "mc:alcohol_chocolate_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_chocolate_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk_chocolate": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_chocolate_spirit": {
            "name": "mc:alcohol_chocolate_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_chocolate_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk_chocolate": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_glowberry_aged": {
            "name": "mc:alcohol_glowberry_aged",
            "result": [
                    {
                            "id": "mc:alcohol_glowberry_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:glow_berries": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_glowberry_spirit": {
            "name": "mc:alcohol_glowberry_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_glowberry_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:glow_berries": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_honey_liqueur": {
            "name": "mc:alcohol_honey_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_honey_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:honey_bottle": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_honey_spirit": {
            "name": "mc:alcohol_honey_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_honey_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:honey_bottle": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_kelp_ale": {
            "name": "mc:alcohol_kelp_ale",
            "result": [
                    {
                            "id": "mc:alcohol_kelp_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:kelp": 1
            }
    },
    "alcohol_melon_ale": {
            "name": "mc:alcohol_melon_ale",
            "result": [
                    {
                            "id": "mc:alcohol_melon_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:melon_slice": 2
            }
    },
    "alcohol_mikan_liqueur": {
            "name": "mc:alcohol_mikan_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_mikan_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:mikan": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mikan_wine": {
            "name": "mc:alcohol_mikan_wine",
            "result": [
                    {
                            "id": "mc:alcohol_mikan_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:mikan": 1
            }
    },
    "alcohol_milk_aged": {
            "name": "mc:alcohol_milk_aged",
            "result": [
                    {
                            "id": "mc:alcohol_milk_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_milk_spirit": {
            "name": "mc:alcohol_milk_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_milk_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mushroom_liqueur": {
            "name": "mc:alcohol_mushroom_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_mushroom_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:brown_mushroom": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mushroom_wine": {
            "name": "mc:alcohol_mushroom_wine",
            "result": [
                    {
                            "id": "mc:alcohol_mushroom_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:brown_mushroom": 1
            }
    },
    "alcohol_pineapple_wine": {
            "name": "mc:alcohol_pineapple_wine",
            "result": [
                    {
                            "id": "mc:alcohol_pineapple_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:pineapple_cut": 1
            }
    },
    "alcohol_sesame_aged": {
            "name": "mc:alcohol_sesame_aged",
            "result": [
                    {
                            "id": "mc:alcohol_sesame_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 497,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sesame_seed_powder": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_chocolate_aged": {
            "name": "mc:alcohol_chocolate_aged",
            "result": [
                    {
                            "id": "mc:alcohol_chocolate_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:milk_chocolate": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_corn_ale": {
            "name": "mc:alcohol_corn_ale",
            "result": [
                    {
                            "id": "mc:alcohol_corn_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sweet_corn": 1
            }
    },
    "alcohol_honey_aged": {
            "name": "mc:alcohol_honey_aged",
            "result": [
                    {
                            "id": "mc:alcohol_honey_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:honey_bottle": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_kelp_aged": {
            "name": "mc:alcohol_kelp_aged",
            "result": [
                    {
                            "id": "mc:alcohol_kelp_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:kelp": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_kelp_liqueur": {
            "name": "mc:alcohol_kelp_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_kelp_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:kelp": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_kelp_spirit": {
            "name": "mc:alcohol_kelp_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_kelp_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:kelp": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_melon_liqueur": {
            "name": "mc:alcohol_melon_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_melon_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:melon_slice": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_melon_spirit": {
            "name": "mc:alcohol_melon_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_melon_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:melon_slice": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mikan_aged": {
            "name": "mc:alcohol_mikan_aged",
            "result": [
                    {
                            "id": "mc:alcohol_mikan_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:mikan": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mikan_spirit": {
            "name": "mc:alcohol_mikan_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_mikan_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:mikan": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mushroom_aged": {
            "name": "mc:alcohol_mushroom_aged",
            "result": [
                    {
                            "id": "mc:alcohol_mushroom_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:brown_mushroom": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_mushroom_spirit": {
            "name": "mc:alcohol_mushroom_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_mushroom_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:brown_mushroom": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pineapple_liqueur": {
            "name": "mc:alcohol_pineapple_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_pineapple_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:pineapple_cut": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pumpkin_ale": {
            "name": "mc:alcohol_pumpkin_ale",
            "result": [
                    {
                            "id": "mc:alcohol_pumpkin_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:pumpkin": 1
            }
    },
    "alcohol_pumpkin_wine": {
            "name": "mc:alcohol_pumpkin_wine",
            "result": [
                    {
                            "id": "mc:alcohol_pumpkin_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:pumpkin": 1
            }
    },
    "alcohol_strawberry_ale": {
            "name": "mc:alcohol_strawberry_ale",
            "result": [
                    {
                            "id": "mc:alcohol_strawberry_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:straw_berry": 1
            }
    },
    "alcohol_strawberry_wine": {
            "name": "mc:alcohol_strawberry_wine",
            "result": [
                    {
                            "id": "mc:alcohol_strawberry_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 498,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:straw_berry": 1
            }
    },
    "alcohol_beetroot_ale": {
            "name": "mc:alcohol_beetroot_ale",
            "result": [
                    {
                            "id": "mc:alcohol_beetroot_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:beetroot": 2
            }
    },
    "alcohol_beetroot_wine": {
            "name": "mc:alcohol_beetroot_wine",
            "result": [
                    {
                            "id": "mc:alcohol_beetroot_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:beetroot": 2
            }
    },
    "alcohol_cactus_ale": {
            "name": "mc:alcohol_cactus_ale",
            "result": [
                    {
                            "id": "mc:alcohol_cactus_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:cactus": 1
            }
    },
    "alcohol_cactus_wine": {
            "name": "mc:alcohol_cactus_wine",
            "result": [
                    {
                            "id": "mc:alcohol_cactus_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:cactus": 1
            }
    },
    "alcohol_corn_liqueur": {
            "name": "mc:alcohol_corn_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_corn_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sweet_corn": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_corn_spirit": {
            "name": "mc:alcohol_corn_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_corn_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sweet_corn": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_corn_wine": {
            "name": "mc:alcohol_corn_wine",
            "result": [
                    {
                            "id": "mc:alcohol_corn_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sweet_corn": 1
            }
    },
    "alcohol_melon_aged": {
            "name": "mc:alcohol_melon_aged",
            "result": [
                    {
                            "id": "mc:alcohol_melon_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:melon_slice": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pineapple_aged": {
            "name": "mc:alcohol_pineapple_aged",
            "result": [
                    {
                            "id": "mc:alcohol_pineapple_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:pineapple_cut": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pineapple_spirit": {
            "name": "mc:alcohol_pineapple_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_pineapple_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:pineapple_cut": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pumpkin_aged": {
            "name": "mc:alcohol_pumpkin_aged",
            "result": [
                    {
                            "id": "mc:alcohol_pumpkin_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:pumpkin": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pumpkin_liqueur": {
            "name": "mc:alcohol_pumpkin_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_pumpkin_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:pumpkin": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_pumpkin_spirit": {
            "name": "mc:alcohol_pumpkin_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_pumpkin_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:pumpkin": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_strawberry_aged": {
            "name": "mc:alcohol_strawberry_aged",
            "result": [
                    {
                            "id": "mc:alcohol_strawberry_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:straw_berry": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_strawberry_liqueur": {
            "name": "mc:alcohol_strawberry_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_strawberry_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:straw_berry": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_strawberry_spirit": {
            "name": "mc:alcohol_strawberry_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_strawberry_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:straw_berry": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sugarcane_ale": {
            "name": "mc:alcohol_sugarcane_ale",
            "result": [
                    {
                            "id": "mc:alcohol_sugarcane_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 499,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sugar_cane": 2
            }
    },
    "alcohol_beetroot_aged": {
            "name": "mc:alcohol_beetroot_aged",
            "result": [
                    {
                            "id": "mc:alcohol_beetroot_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:beetroot": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_beetroot_liqueur": {
            "name": "mc:alcohol_beetroot_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_beetroot_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:beetroot": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_beetroot_spirit": {
            "name": "mc:alcohol_beetroot_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_beetroot_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:beetroot": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_cactus_aged": {
            "name": "mc:alcohol_cactus_aged",
            "result": [
                    {
                            "id": "mc:alcohol_cactus_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:cactus": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_cactus_liqueur": {
            "name": "mc:alcohol_cactus_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_cactus_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:cactus": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_cactus_spirit": {
            "name": "mc:alcohol_cactus_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_cactus_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:cactus": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_carrot_ale": {
            "name": "mc:alcohol_carrot_ale",
            "result": [
                    {
                            "id": "mc:alcohol_carrot_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:carrot": 1
            }
    },
    "alcohol_carrot_liqueur": {
            "name": "mc:alcohol_carrot_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_carrot_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:carrot": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_carrot_wine": {
            "name": "mc:alcohol_carrot_wine",
            "result": [
                    {
                            "id": "mc:alcohol_carrot_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:carrot": 1
            }
    },
    "alcohol_coffee_ale": {
            "name": "mc:alcohol_coffee_ale",
            "result": [
                    {
                            "id": "mc:alcohol_coffee_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:coffee": 1
            }
    },
    "alcohol_coffee_wine": {
            "name": "mc:alcohol_coffee_wine",
            "result": [
                    {
                            "id": "mc:alcohol_coffee_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:coffee": 1
            }
    },
    "alcohol_corn_aged": {
            "name": "mc:alcohol_corn_aged",
            "result": [
                    {
                            "id": "mc:alcohol_corn_aged",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:sweet_corn": 1,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_green_tea_ale": {
            "name": "mc:alcohol_green_tea_ale",
            "result": [
                    {
                            "id": "mc:alcohol_green_tea_ale",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "mc:green_tea": 1
            }
    },
    "alcohol_sugarcane_liqueur": {
            "name": "mc:alcohol_sugarcane_liqueur",
            "result": [
                    {
                            "id": "mc:alcohol_sugarcane_liqueur",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sugar_cane": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sugarcane_spirit": {
            "name": "mc:alcohol_sugarcane_spirit",
            "result": [
                    {
                            "id": "mc:alcohol_sugarcane_spirit",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sugar_cane": 2,
                    "minecraft:sugar": 1
            }
    },
    "alcohol_sugarcane_wine": {
            "name": "mc:alcohol_sugarcane_wine",
            "result": [
                    {
                            "id": "mc:alcohol_sugarcane_wine",
                            "count": 1
                    },
                    {
                            "id": "minecraft:glass_bottle",
                            "count": 1
                    }
            ],
            "requiredLevel": 500,
            "ingredients": {
                    "minecraft:potion": 1,
                    "mc:yeast": 1,
                    "minecraft:sugar_cane": 2
            }
    }
    // Generated food expansion end
};
