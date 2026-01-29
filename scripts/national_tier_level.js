export default {
    //国家レベルを有効化するかどうか
    enabled: true,

    //AdminShopを何レベから解放するか
    releaseAdminShop: 0,

    //特殊釣りを何レベから解放するか
    releaseSpeciallFishing: 130,

    //何レベルのときにホームを解放するか
    unlockPublicSpawnLevels: [0, 40],

    needs: {
        1: {
            item: [
                { typeId: 'minecraft:oak_log', amount: 10 }
            ],
            //必要なリソースポイント
            point: 100
        },
        2: {
            item: [
                { typeId: 'minecraft:cobblestone', amount: 10 }
            ],
            point: 100
        },
        3: {
            item: [
                { typeId: 'minecraft:oak_sapling', amount: 10 }
            ],
            point: 100
        },
        4: {
            item: [
                { typeId: 'minecraft:fence_gate', amount: 15 }
            ],
            point: 100
        },
        5: {
            item: [
                { typeId: 'minecraft:apple', amount: 10 },
            ],
            point: 500
        },
        6: {
            item: [
                { typeId: 'minecraft:dirt', amount: 64 },
            ],
            point: 200
        },
        7: {
            item: [
                { typeId: 'minecraft:cobblestone', amount: 64 },
            ],
            point: 200
        },
        8: {
            item: [
                { typeId: 'minecraft:chest', amount: 10 },
            ],
            point: 200
        },
        9: {
            item: [
                { typeId: 'minecraft:wooden_door', amount: 15 }
            ],
            point: 200
        },
        10: {
            item: [
                { typeId: 'minecraft:oak_log', amount: 32 },
                { typeId: 'minecraft:coal', amount: 15 }
            ],
            point: 1000
        },
        11: {
            item: [
                { typeId: 'minecraft:leaf_litter', amount: 32 },
                { typeId: 'minecraft:oak_sapling', amount: 5 }
            ],
            point: 300
        },
        12: {
            item: [
                { typeId: 'minecraft:gravel', amount: 16 },
                { typeId: 'minecraft:coal', amount: 20 }
            ],
            point: 300
        },
        13: {
            item: [
                { typeId: 'minecraft:raw_iron', amount: 10 }
            ],
            point: 300
        },
        14: {
            item: [
                { typeId: 'minecraft:oak_leaves', amount: 16 },
                { typeId: 'minecraft:campfire', amount: 16 }
            ],
            point: 300
        },
        15: {
            item: [
                { typeId: 'minecraft:oak_log', amount: 64 },
                { typeId: 'minecraft:coal', amount: 20 }
            ],
            point: 1500
        },
        16: {
            item: [
                { typeId: 'minecraft:sand', amount: 128 },
            ],
            point: 400
        },
        17: {
            item: [
                { typeId: 'minecraft:flint', amount: 6 },
                { typeId: 'minecraft:iron_ingot', amount: 18 }
            ],
            point: 400
        },
        18: {
            item: [
                { typeId: 'minecraft:furnace', amount: 8 },
                { typeId: 'mc:pork_boned_rib', amount: 5 },
                { typeId: 'mc:pork_loin', amount: 5 },
            ],
            point: 400
        },
        19: {
            item: [
                { typeId: 'minecraft:smoker', amount: 8 },
                { typeId: 'mc:beef_loin', amount: 5 },
                { typeId: 'mc:beef_leg', amount: 5 },
            ],
            point: 400
        },
        20: {
            item: [
                { typeId: 'minecraft:iron_ingot', amount: 32 },
                { typeId: 'minecraft:cooked_beef', amount: 8 },
                { typeId: 'mc:fermentation_machine', amount: 1 },
            ],
            point: 2000
        },
        21: {
            item: [
                { typeId: 'mc:beer', amount: 24 },
            ],
            point: 500
        },
        22: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 16 },
                { typeId: 'minecraft:slime_ball', amount: 16 },
            ],
            point: 500
        },
        23: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 32 },
                { typeId: 'minecraft:gravel', amount: 64 },
                { typeId: 'minecraft:slime_ball', amount: 48 },
                { typeId: 'minecraft:redstone_block', amount: 32 },
                { typeId: 'minecraft:egg', amount: 16 },
            ],
            point: 500
        },
        24: {
            item: [
                { typeId: 'minecraft:charcoal', amount: 64 },
                { typeId: 'minecraft:slime_ball', amount: 33 },
                { typeId: 'minecraft:redstone_block', amount: 16 },
                { typeId: 'minecraft:ender_pearl', amount: 16 },

            ],
            point: 500
        },
        25: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 48 },
                { typeId: 'minecraft:gravel', amount: 64 },
                { typeId: 'minecraft:flint', amount: 32 },
            ],
            point: 2500
        },
        26: {
            item: [
                { typeId: 'minecraft:raw_copper_block', amount: 32 },
                { typeId: 'minecraft:coal_block', amount: 16 },
                { typeId: 'minecraft:andesite', amount: 64 }
            ],
            point: 600
        },
        27: {
            item: [
                { typeId: 'minecraft:raw_copper_block', amount: 64 },
                { typeId: 'minecraft:coal_block', amount: 64 },
                { typeId: 'minecraft:smooth_stone', amount: 64 },
            ],
            point: 600
        },
        28: {
            item: [
                { typeId: 'minecraft:coal_block', amount: 64 },
                { typeId: 'minecraft:raw_iron_block', amount: 16 },
                { typeId: 'minecraft:apple', amount: 32 },
            ],
            point: 600
        },
        29: {
            item: [
                { typeId: 'minecraft:sand', amount: 128 },
                { typeId: 'minecraft:cobblestone', amount: 256 },
                { typeId: 'minecraft:gravel', amount: 64 },
            ],
            point: 600
        },
        30: {
            item: [
                { typeId: 'minecraft:acacia_log', amount: 32 },
                { typeId: 'minecraft:birch_log', amount: 32 },
                { typeId: 'minecraft:cherry_log', amount: 32 },
                { typeId: 'minecraft:jungle_log', amount: 64 },
            ],
            point: 3000
        },
        31: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 48 },
                { typeId: 'minecraft:rotten_flesh', amount: 32 },
                { typeId: 'minecraft:carrot', amount: 64 },
            ],
            point: 700
        },
        32: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 48 },
                { typeId: 'minecraft:rotten_flesh', amount: 48 },
                { typeId: 'minecraft:potato', amount: 64 },
            ],
            point: 700
        },
        33: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 64 },
                { typeId: 'minecraft:rotten_flesh', amount: 64 },
                { typeId: 'minecraft:bone', amount: 64 },
            ],
            point: 700
        },
        34: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 96 },
                { typeId: 'minecraft:rotten_flesh', amount: 96 },
            ],
            point: 700
        },
        35: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 128 },
                { typeId: 'minecraft:rotten_flesh', amount: 128 },
                { typeId: 'minecraft:poppy', amount: 32 },
            ],
            point: 3500
        },
        36: {
            item: [
                { typeId: 'minecraft:cherry_sapling', amount: 32 },
                { typeId: 'minecraft:white_wool', amount: 64 },
            ],
            point: 800
        },
        37: {
            item: [
                { typeId: 'minecraft:spruce_sapling', amount: 32 },
                { typeId: 'minecraft:orange_wool', amount: 64 },
                { typeId: 'minecraft:porkchop', amount: 32 },
            ],
            point: 800
        },
        38: {
            item: [
                { typeId: 'minecraft:spruce_sapling', amount: 64 },
                { typeId: 'minecraft:cyan_wool', amount: 64 },
                { typeId: 'minecraft:string', amount: 64 },
            ],
            point: 800
        },
        39: {
            item: [
                { typeId: 'minecraft:dark_oak_sapling', amount: 32 },
                { typeId: 'minecraft:lime_wool', amount: 64 },
                { typeId: 'minecraft:black_dye', amount: 32 },
            ],
            point: 800
        },
        40: {
            item: [
                { typeId: 'minecraft:apple', amount: 64 },
                { typeId: 'minecraft:lime_stained_glass', amount: 64 },
                { typeId: 'minecraft:amethyst_shard', amount: 16 },
                { typeId: 'minecraft:glow_ink_sac', amount: 64 },
            ],
            point: 4000
        },
    }
};