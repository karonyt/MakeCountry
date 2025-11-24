import common from "./fishing_configs/common";
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
        //サバンナ
        'minecraft:savanna': {
            fishes: savanna
        }
    }
};