import common from "./fishing_configs/common";
import ocean from "./fishing_configs/ocean";
import plains from "./fishing_configs/plains";
import river from "./fishing_configs/river";
import savanna from "./fishing_configs/savanna";

export default {
    //全バイオーム共通
    fishes: common,
    biomes: {
        //川
        'minecraft:river': {
            fishes: river
        },
        //海洋
        'minecraft:ocean': {
            fishes: ocean
        },
        //サバンナ
        'minecraft:savanna': {
            fishes: savanna
        },
        //平原
        'minecraft:plains': {
            fishes: plains
        },

    },
    //魚一覧(魚図鑑用)
    allFishes: [
        {
            typeId: 'minecraft:cod'
        },
        {
            typeId: 'minecraft:salmon'
        },
        {
            typeId: 'mc:tuna'
        },
        {
            typeId: 'mc:shrimp'
        },
        {
            typeId: 'mc:tai'
        },
    ],
};