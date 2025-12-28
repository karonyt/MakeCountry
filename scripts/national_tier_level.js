export default {
    //国家レベルを有効化するかどうか
    enabled: true,

    //AdminShopを何レベから解放するか
    releaseAdminShop: 30,

    //特殊釣りを何レベから解放するか
    releaseSpeciallFishing: 130,

    needs: {
        1: {
            item: [
                { typeId: 'minecraft:oak_fence', amount: 21 }
            ],
            //必要なリソースポイント
            point: 1000
        },
        2: {
            item: [
                { typeId: 'minecraft:oak_boat', amount: 5 }
            ],
            point: 1000
        },
        3: {
            item: [
                { typeId: 'minecraft:wooden_door', amount: 18 }
            ],
            point: 1000
        },
        4: {
            item: [
                { typeId: 'minecraft:wooden_pressure_plate', amount: 32 },
                { typeId: 'minecraft:oak_sapling', amount: 32 }

            ],
            point: 1000
        },
        5: {
            item: [
                { typeId: 'minecraft:apple', amount: 10 }

            ],
            point: 5000
        },
        6: {
            item: [
                { typeId: 'minecraft:oak_sapling', amount: 64 },
                { typeId: 'minecraft:oak_log', amount: 64 }
            ],
            point: 2000
        },
        7: {
            item: [
                { typeId: 'minecraft:oak_sapling', amount: 96 },
                { typeId: 'minecraft:oak_log', amount: 96 }
            ],
            point: 2000
        },
        8: {
            item: [
                { typeId: 'minecraft:oak_sapling', amount: 128 },
                { typeId: 'minecraft:oak_log', amount: 128 }
            ],
            point: 2000
        },
        7: {
            item: [
                { typeId: 'minecraft:chest', amount: 8 },
                { typeId: 'minecraft:oak_fence', amount: 16 },
                { typeId: 'minecraft:oak_log', amount: 64 }
            ],
            point: 2000
        },
        8: {
            item: [
                { typeId: 'minecraft:chest', amount: 16 },
                { typeId: 'minecraft:oak_fence', amount: 32 },
                { typeId: 'minecraft:oak_log', amount: 64 }
            ],
            point: 2000
        },
        9: {
            item: [
                { typeId: 'minecraft:chest', amount: 32 },
                { typeId: 'minecraft:oak_fence', amount: 48 },
                { typeId: 'minecraft:oak_log', amount: 64 }
            ],
            point: 2000
        },
        10: {
            item: [
                { typeId: 'minecraft:chest', amount: 64 },
                { typeId: 'minecraft:oak_fence', amount: 64 },
                { typeId: 'minecraft:oak_log', amount: 64 },
                { typeId: 'minecraft:coal', amount: 64 }
            ],
            point: 10000
        },
        11: {
            item: [
                { typeId: 'minecraft:leaf_litter', amount: 64 * 2 },
                { typeId: 'minecraft:oak_fence', amount: 64 },
                { typeId: 'minecraft:oak_log', amount: 64 },
                { typeId: 'minecraft:coal', amount: 64 }
            ],
            point: 3000
        },
        12: {
            item: [
                { typeId: 'minecraft:leaf_litter', amount: 64 * 2 },
                { typeId: 'minecraft:gravel', amount: 64 },
                { typeId: 'minecraft:oak_log', amount: 64 },
                { typeId: 'minecraft:coal', amount: 64 }
            ],
            point: 3000
        },
        13: {
            item: [
                { typeId: 'minecraft:leaf_litter', amount: 64 * 3 },
                { typeId: 'minecraft:gravel', amount: 64 },
                { typeId: 'minecraft:charcoal', amount: 64 },
                { typeId: 'minecraft:coal', amount: 64 }
            ],
            point: 3000
        },
        14: {
            item: [
                { typeId: 'minecraft:leaf_litter', amount: 64 * 4 },
                { typeId: 'minecraft:gravel', amount: 96 },
                { typeId: 'minecraft:charcoal', amount: 64 },
                { typeId: 'minecraft:coal', amount: 64 }
            ],
            point: 3000
        },
        15: {
            item: [
                { typeId: 'minecraft:gravel', amount: 128 },
                { typeId: 'minecraft:charcoal', amount: 128 },
                { typeId: 'minecraft:coal', amount: 128 }
            ],
            point: 15000
        },
        16: {
            item: [
                { typeId: 'minecraft:flint', amount: 32 },
                { typeId: 'minecraft:coal_block', amount: 16 }
            ],
            point: 4000
        },
        17: {
            item: [
                { typeId: 'minecraft:flint', amount: 48 },
                { typeId: 'minecraft:coal_block', amount: 24 }
            ],
            point: 4000
        },
        18: {
            item: [
                { typeId: 'minecraft:flint', amount: 64 },
                { typeId: 'minecraft:coal_block', amount: 32 },
                { typeId: 'minecraft:tnt', amount: 16 }
            ],
            point: 4000
        },
        19: {
            item: [
                { typeId: 'minecraft:flint', amount: 96 },
                { typeId: 'minecraft:coal_block', amount: 40 },
                { typeId: 'minecraft:tnt', amount: 24 },
                { typeId: 'minecraft:polished_basalt', amount: 64 * 2 },
            ],
            point: 4000
        },
        20: {
            item: [
                { typeId: 'minecraft:flint', amount: 128 },
                { typeId: 'minecraft:raw_iron_block', amount: 32 },
                { typeId: 'minecraft:seagrass', amount: 128 },
                { typeId: 'minecraft:saddle', amount: 5 },
            ],
            point: 20000
        },
        21: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 32 },
                { typeId: 'minecraft:slime_ball', amount: 64 },
                { typeId: 'minecraft:redstone_block', amount: 64 },
            ],
            point: 5000
        },
        22: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 64 },
                { typeId: 'minecraft:slime_ball', amount: 64 * 2 },
                { typeId: 'minecraft:redstone_block', amount: 64 * 2 },
            ],
            point: 5000
        },
        23: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 64 },
                { typeId: 'minecraft:gravel', amount: 64 },
                { typeId: 'minecraft:slime_ball', amount: 64 * 3 },
                { typeId: 'minecraft:redstone_block', amount: 64 * 3 },
                { typeId: 'minecraft:egg', amount: 64 },
            ],
            point: 5000
        },
        24: {
            item: [
                { typeId: 'minecraft:charcoal', amount: 64 * 3 },
                { typeId: 'minecraft:coal', amount: 128 },
                { typeId: 'minecraft:slime_ball', amount: 64 * 3 },
                { typeId: 'minecraft:redstone_block', amount: 64 * 3 },
                { typeId: 'minecraft:ender_pearl', amount: 64 },

            ],
            point: 5000
        },
        25: {
            item: [
                { typeId: 'minecraft:raw_iron_block', amount: 96 },
                { typeId: 'minecraft:gravel', amount: 64 },
                { typeId: 'minecraft:flint', amount: 64 },
                { typeId: 'minecraft:charcoal', amount: 32 },
                { typeId: 'minecraft:coal', amount: 32 }
            ],
            point: 25000
        },
        26: {
            item: [
                { typeId: 'minecraft:raw_copper_block', amount: 32 },
                { typeId: 'minecraft:coal_block', amount: 16 },
                { typeId: 'minecraft:andesite', amount: 64 }
            ],
            point: 6000
        },
        27: {
            item: [
                { typeId: 'minecraft:raw_copper_block', amount: 128 },
                { typeId: 'minecraft:coal_block', amount: 64 },
                { typeId: 'minecraft:raw_iron_block', amount: 32 },
                { typeId: 'minecraft:smooth_stone', amount: 64 },
            ],
            point: 6000
        },
        28: {
            item: [
                { typeId: 'minecraft:coal_block', amount: 64 },
                { typeId: 'minecraft:raw_iron_block', amount: 64 },
                { typeId: 'minecraft:apple', amount: 64 },
            ],
            point: 6000
        },
        29: {
            item: [
                { typeId: 'minecraft:sand', amount: 128 },
                { typeId: 'minecraft:stone', amount: 128 },
                { typeId: 'minecraft:gravel', amount: 128 },
            ],
            point: 6000
        },
        30: {
            item: [
                { typeId: 'minecraft:acacia_log', amount: 64 },
                { typeId: 'minecraft:birch_log', amount: 64 },
                { typeId: 'minecraft:cherry_log', amount: 64 },
                { typeId: 'minecraft:dark_oak_log', amount: 64 },
                { typeId: 'minecraft:jungle_log', amount: 64 },
            ],
            point: 30000
        },
        31: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
                { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
                { typeId: 'minecraft:carrot', amount: 64 * 4 },
            ],
            point: 7000
        },
        32: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
                { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
                { typeId: 'minecraft:potato', amount: 64 * 4 },
            ],
            point: 7000
        },
        33: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
                { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
                { typeId: 'minecraft:bone', amount: 64 * 2 },
            ],
            point: 7000
        },
        34: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
                { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
                { typeId: 'minecraft:fermented_spider_eye', amount: 64 * 2 },
            ],
            point: 7000
        },
        35: {
            item: [
                { typeId: 'minecraft:clay_ball', amount: 64 * 4 },
                { typeId: 'minecraft:rotten_flesh', amount: 64 * 2 },
                { typeId: 'minecraft:gunpowder', amount: 64 * 2 },
                { typeId: 'minecraft:allium', amount: 32 },
                { typeId: 'minecraft:poppy', amount: 32 },
                { typeId: 'minecraft:dandelion', amount: 32 },
            ],
            point: 35000
        },
        36: {
            item: [
                { typeId: 'minecraft:cherry_sapling', amount: 64 * 4 },
                { typeId: 'minecraft:white_wool', amount: 64 },
                { typeId: 'minecraft:beef', amount: 64 * 2 },
            ],
            point: 8000
        },
        37: {
            item: [
                { typeId: 'minecraft:dark_oak_sapling', amount: 64 * 4 },
                { typeId: 'minecraft:orange_wool', amount: 64 },
                { typeId: 'minecraft:porkchop', amount: 64 * 2 },
            ],
            point: 8000
        },
        38: {
            item: [
                { typeId: 'minecraft:spruce_sapling', amount: 64 * 4 },
                { typeId: 'minecraft:cyan_wool', amount: 64 },
                { typeId: 'minecraft:string', amount: 64 * 2 },
            ],
            point: 8000
        },
        39: {
            item: [
                { typeId: 'minecraft:pale_oak_sapling', amount: 64 * 4 },
                { typeId: 'minecraft:lime_wool', amount: 64 },
                { typeId: 'minecraft:black_dye', amount: 64 * 2 },
            ],
            point: 8000
        },
        40: {
            item: [
                { typeId: 'minecraft:apple', amount: 64 },
                { typeId: 'minecraft:lime_stained_glass', amount: 128 },
                { typeId: 'minecraft:amethyst_shard', amount: 128 },
                { typeId: 'minecraft:tall_grass', amount: 64 * 3 },
                { typeId: 'minecraft:glow_ink_sac', amount: 64 },
            ],
            point: 40000
        },
    }
};