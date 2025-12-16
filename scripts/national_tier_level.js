export default {
    //国家レベルを有効化するかどうか
    enabled: true,

    //AdminShopを何レベから解放するか
    releaseAdminShop: 100,

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
                { typeId: 'minecraft:coal_block', amount: 32 }
            ],
            point: 4000
        },
        19: {
            item: [
                { typeId: 'minecraft:flint', amount: 96 },
                { typeId: 'minecraft:coal_block', amount: 40 }
            ],
            point: 4000
        },
        20: {
            item: [
                { typeId: 'minecraft:flint', amount: 128 },
                { typeId: 'minecraft:raw_iron_block', amount: 32 }
            ],
            point: 20000
        },
    }
};