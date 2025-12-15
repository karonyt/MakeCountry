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
                { typeId: 'minecraft:apple', amount: 10 }
            ],
            //必要なリソースポイント
            point: 1000
        },
        2: {
            item: [
                { typeId: 'minecraft:stone', amount: 10 },
                { typeId: 'minecraft:cobblestone', amount: 10 }
            ],
            point: 1000
        }
    }
};