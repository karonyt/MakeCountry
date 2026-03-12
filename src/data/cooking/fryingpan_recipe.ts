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
};
