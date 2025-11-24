import { BiomeType, BiomeTypes } from "@minecraft/server";

export default {
    fishes: [
        {
            typeId: 'minecraft:bread',
            name: 'item.minecraft:bread.name',
            weight: 10,
            size: {
                min: 10,
                max: 100
            }
        }
    ],
    biomes: {
        'minecraft:river': {
            fishes: [
                {
                    typeId: 'minecraft:apple',
                    name: 'item.minecraft:apple.name',
                    weight: 1,
                    size: {
                        min: 10,
                        max: 100
                    }
                }
            ]
        }
    }
};