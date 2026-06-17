import { world, system, Player, EntityRideableComponent } from "@minecraft/server"
import { Vec3 } from "@/shared/math/vec3.js";

const random = {
    randint(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
};

function t(translate: string, options: { texts?: unknown[] } = {}) {
    return { translate, with: (options.texts ?? []).map((text) => `${text}`) };
}

function parseId(id: unknown) {
    return `${id ?? ""}`;
}

world.afterEvents.worldLoad.subscribe(() => {
    // @ts-ignore TS(2345): Argument of type '(ev: any) => void' is not assign... Remove this comment to see the full error message
    system.runInterval((ev: any) => {
        let alreadyHorse: any = []
        for (const horse of world.getDimension("overworld").getEntities({ type: "minecraft:horse", tags: ["pet"] })) {
            if (horse.location.y < -64) continue;
            /**
             * @type {EntityRideableComponent}
             */
            const ride = horse.getComponent(EntityRideableComponent.componentId);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            const [rider] = ride.getRiders();
            const [player] = horse.dimension.getPlayers({ tags: [`ID_${horse.nameTag.slice(0, -8)}`], location: horse.location, maxDistance: 10 })
            if (alreadyHorse.includes(horse.nameTag) || !player) {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                ride.ejectRiders()
                alreadyHorse[alreadyHorse.length] = horse.nameTag
                horse.remove()
                //horse.teleport({x: horse.location.x,y: -100,z: horse.location.z})

                continue;
            }
            alreadyHorse[alreadyHorse.length] = horse.nameTag;

            //world.sendMessage()

            if (rider?.id !== player.id) {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                ride.ejectRiders()
            } else {
                let horseLv = player.getDynamicProperty("horseLv");
                if (!horseLv) {
                    // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    player[0].setDynamicProperty(`horseLv`, `1`)
                    horseLv = 1
                }
                horseLv = Number(horseLv)
                /**
                 * @type {EntityMovementComponent} */
                const move = horse.getComponent("minecraft:movement");
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                move.setCurrentValue(0.25 + (horseLv - 1) * (0.8 - 0.25) / 149);
                const { x, y, z } = horse.getVelocity();
                if (x == 0 && y == 0 && z == 0) continue;
                if (horseLv > 149) continue
                const int = random.randint(0, 12000 + (1200 * horseLv))
                if (int === 100) {
                    // @ts-ignore TS(2339): Property 'lang' does not exist on type 'Player'.
                    player.sendMessage(t("horse.lvUp", { langCode: player.lang, texts: [horseLv + 1] }))
                    player.setDynamicProperty("horseLv", `${horseLv + 1}`);
                }
            }
        }
    })
})

world.afterEvents.itemUse.subscribe(async (ev) => {
    const { source: player, itemStack: item } = ev;
    if (!(player instanceof Player)) return;

    if (item?.typeId === "karo:horse") {
        const horseName = player.getTags().find(a => a.startsWith(`ID_`))?.slice(3);
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const [pattern, color] = player.getDynamicProperty("horseType").split("#");
        if (!horseName) return;
        const [alreadySpawnedHorse] = player.dimension.getEntities({ name: `${horseName}'s Horse`, tags: ["pet"], type: "minecraft:horse" });
        if (alreadySpawnedHorse) {
            const rideable = alreadySpawnedHorse.getComponent("rideable");
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            rideable.ejectRiders();
            alreadySpawnedHorse.tryTeleport(Vec3.from(player.location).offset(0, -0.7, 0));
            return;
        }
        const horse = player.dimension.spawnEntity("minecraft:horse", player.location);
        horse.addTag("pet");
        horse.nameTag = `${horseName}'s Horse`;
        player.playSound(`horse_summon`);
        if (horse.hasComponent("is_baby")) horse.triggerEvent("minecraft:ageable_grow_up");
        system.runTimeout(() => {
            try {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                horse.getComponent("tamemount").setTamed(false);
                horse.runCommand("replaceitem entity @s slot.saddle 0 saddle");
                horse.triggerEvent(parseId(pattern));
                horse.triggerEvent(parseId(color));
            } catch (e) { }
        }, 1)
    }
})
