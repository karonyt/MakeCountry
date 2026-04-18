import {
    world
} from "@minecraft/server";

world.afterEvents.entityHitBlock.subscribe((ev) => {
    const player = ev.damagingEntity;
    const putblock = ev.hitBlock
    const dim = player.dimension
    const loc = ev.hitBlock.location
    const x = loc.x;
    const y = loc.y;
    const z = loc.z;
    const equip = player.getComponent("equippable")
    const mainhand = 
    equip.getEquipment("mainhand");
    const offhand = 
    equip.getEquipment("offhand");
    if (!offhand || offhand.typeId !== "mc:cropputter") return;
    const puttablecrop = [
        "minecraft:wheat_seeds",
        "minecraft:carrot",
        "minecraft:potato",
        "mc:ovlive",
        "mc:basil",
        "mc:tomato",
        "mc:mikan",
        "mc:pineapple",
        "mc:onion",
        "mc:straw_berry",
        "mc:sweet_corn"
        ];
    const croplist = {
        "minecraft:wheat_seeds":
    "minecraft:wheat",
        "minecraft:carrot":
    "minecraft:carrots",
        "minecraft:potato":
    "minecraft:potatoes",
        "mc:ovlive":
    "mc:ovlive_crop",
        "mc:basil":
    "mc:basil_crop",
        "mc:tomato":
    "mc:tomato_crop",
        "mc:mikan":
    "mc:orange_crop",
        "mc:pineapple":
    "mc:pineapple_crop",
        "mc:onion":
    "mc:onion_crop",
        "mc:straw_berry":
    "mc:strawberry_crop",
        "mc:sweet_corn":
    "mc:corn_crop",
    }
    if (!mainhand || !puttablecrop.includes(mainhand.typeId)) return;
    const cropset = croplist[mainhand.typeId];
    if (!cropset) return;
    if (putblock.typeId !== "minecraft:farmland")
    return;
    let used = 0
    for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
            const target = {
                px: x + dx,
                py: y,
                pz: z + dz
            };
            let soilid = dim.getBlock({x: target.px, y: y, z: target.pz})
            if (!soilid || soilid.typeId !== "minecraft:farmland")
            continue;
            const above = dim.getBlock({x: target.px, y: y+1, z: target.pz});
            if (!above || above.typeId !== "minecraft:air") continue;
            if (mainhand.amount <= used)
            continue
        const placeBlock = dim.getBlock({
            x: target.px,
            y: target.py + 1,
            z: target.pz
        });

        if (placeBlock) {
            placeBlock.setType(cropset);
        }
        used++
        }
    }
    player.runCommandAsync(`clear @s ${mainhand.typeId} 0 ${used}`)

    const durability = mainhand.getComponent("durability");

if (durability) {
    durability.damage += 1;

    if (durability.damage >= durability.maxDurability) {
        const equip = player.getComponent("equippable");
        equip.setEquipment("mainhand", undefined);
    }
}
)}