import common from "./fishing_configs/common";
import plains from "./fishing_configs/plains";
import river from "./fishing_configs/river";
import savanna from "./fishing_configs/savanna";
import ocean from "./fishing_configs/ocean";
import deep_ocean from "./fishing_configs/deep_ocean";
import cold_ocean from "./fishing_configs/cold_ocean";
import deep_cold_ocean from "./fishing_configs/deep_cold_ocean";
import frozen_ocean from "./fishing_configs/frozen_ocean";
import deep_frozen_ocean from "./fishing_configs/deep_frozen_ocean";
import lukewarm_ocean from "./fishing_configs/lukewarm_ocean";
import deep_lukewarm_ocean from "./fishing_configs/deep_lukewarm_ocean";
import warm_ocean from "./fishing_configs/warm_ocean";
import river from "./fishing_configs/river";
import frozen_river from "./fishing_configs/frozen_river";
import beach from "./fishing_configs/beach";
import cold_beach from "./fishing_configs/cold_beach";
import stone_beach from "./fishing_configs/stone_beach";
import swampland from "./fishing_configs/swampland";
import mangrove_swamp from "./fishing_configs/mangrove_swamp";

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
        //深海
        "minecraft:deep_ocean": {
            fishes: deep_ocean
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