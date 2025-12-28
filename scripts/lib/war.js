import { Container, EntityEquippableComponent, EquipmentSlot, Player, system, world } from "@minecraft/server";
import { GetAndParsePropertyData, GetChunkPropertyId, GetPlayerChunkPropertyId, isWithinTimeRange, StringifyAndSavePropertyData } from "./util";
import config from "../config";
import { country } from "../api/api";
import { DeleteCountry } from "./land";

const warCountry = new Map();

const wars = new Map();
/**
 * 
 * @param {Player} player 
 */
export async function Invade(player) {
    let key = 0;
    for (let i = 1; i < 16; i++) {
        if (wars.has(`${i}`)) continue;
        key = i;
        break;
    };
    if (key == 0) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.maxinvade` }] });
        return;
    };
    if (config.isSettingCanInvadeDuration) {
        let start = config.canInvadeDuration.startTime;
        let end = config.canInvadeDuration.endTime;
        if (!isWithinTimeRange(start, end)) {
            player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.notimerange`, with: [`${start.hour}:${start.min}～${end.hour}:${end.min}`] }] });
            return;
        };
    };
    const chunk = GetAndParsePropertyData(GetPlayerChunkPropertyId(player));
    if (!chunk || !chunk?.countryId) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.wilderness` }] });
        return;
    };
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (chunk?.countryId == playerData?.country) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.mycountry` }] });
        return;
    };
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    if (playerCountryData?.peace) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.peace` }] });
        return;
    };
    if (playerCountryData?.days <= config.invadeProtectionDuration) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.protectionduration` }] });
        return;
    };
    if (warCountry.has(`${playerCountryData.id}`)) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.iswarnow` }] });
        return;
    };
    if (playerCountryData.alliance.includes(chunk.countryId)) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.alliance` }] });
        return;
    };
    if (playerCountryData?.territories?.length < config.minChunkCountCanInvade) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.self.minchunk`, with: [`${config.minChunkCountCanInvade}`] }] });
        return;
    };
    const targetCountryData = GetAndParsePropertyData(`country_${chunk.countryId}`);
    if (targetCountryData?.peace) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.target.peace` }] });
        return;
    };
    if (targetCountryData?.days <= config.invadeProtectionDuration) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.target.protectionduration` }] });
        return;
    };
    if (targetCountryData?.territories?.length < config.minChunkCountCanInvade) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.target.minchunk`, with: [`${config.minChunkCountCanInvade}`] }] });
        return;
    };

    const date = new Date(Date.now() + ((config.timeDifference * 60) * 60 * 1000)).getTime();
    const cooltime = playerCountryData?.invadeCooltime ?? date - 1000;

    if (cooltime - date > 0) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.cooltime`, with: [`${Math.ceil((cooltime - date) / 100) / 10}`] }] });
        return;
    };
    const limit = config.chunkLimit || 3200;
    if (playerCountryData?.territories.length >= limit) {
        player.sendMessage({ translate: 'chunk.limit', with: [`${limit}`] });
        return;
    };

    // なんかきもい
    const cores = player.dimension.getEntities({ type: `mc:core` });
    let coresChunks = [];
    for (let i = 0; i < cores.length; i++) {
        coresChunks[coresChunks.length] = GetPlayerChunkPropertyId(cores[i]);
    };
    if (coresChunks.includes(GetPlayerChunkPropertyId(player))) {
        player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.already` }] });
        return;
    };

    if (config.isAttackCorner) {
        const thisChunk = chunk.id;
        const [c, cx, cz, d] = thisChunk.split(`_`);
        const numCx = Number(cx);
        const numCz = Number(cz);
        let adjacentTerritoriesLength = 0;
        for (let i = -1; i <= 1; i += 2) {
            const adjacentChunk = `${c}_${numCx}_${numCz + i}_${d}`;
            const adjacentChunkData = GetAndParsePropertyData(`${adjacentChunk}`);
            if (adjacentChunkData) {
                if (adjacentChunkData?.countryId == chunk?.countryId) {
                    adjacentTerritoriesLength++;
                };
            };
            const adjacentChunk2 = `${c}_${numCx + i}_${numCz}_${d}`;
            const adjacentChunkData2 = GetAndParsePropertyData(`${adjacentChunk2}`);
            if (adjacentChunkData2) {
                if (adjacentChunkData2?.countryId == chunk?.countryId) {
                    adjacentTerritoriesLength++;
                };
            };
        };
        if (adjacentTerritoriesLength >= 3) {
            player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.error.attackcorner` }] });
            return;
        };
    };

    const { x, y, z } = player.getHeadLocation();
    const msg = `${Math.floor(x)}, ${Math.floor(y)}, ${Math.floor(z)} [${player.dimension.id.replace(`minecraft:`, ``)}]`;

    const eventData = {
        invaderCountryName: playerCountryData.name,
        invadedCountryName: targetCountryData.name,
        invader: player,
        locationString: msg,
        cancel: false
    };
    const isCanceled = country.beforeEvents.startInvade.emit(eventData);
    if (isCanceled) return;
    eventData.cancel = undefined;
    playerCountryData.invadeCooltime = date + (config.invadeCooltime * 1000);
    playerCountryData.peaceChangeCooltime = config.invadePeaceChangeCooltime;

    const coreEntity = player.dimension.spawnEntity(`mc:core`, player.getHeadLocation(), { initialPersistence: true });
    warCountry.set(`${playerCountryData.id}`, { country: targetCountryData.id, core: coreEntity.id, time: date + 1000 * config.invadeTimelimit, key: key });
    coreEntity.nameTag = `${targetCountryData.name}§r Core`;
    player.addTag(`war${key}`);
    coreEntity.addTag(`war${key}`);
    wars.set(`${key}`, true);
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n§f` }, { translate: `invade.success`, with: [`${player.name}§r(${playerCountryData.name}§r)`, `${msg}§r(${targetCountryData.name})§r`] }] });
    country.afterEvents.startInvade.emit(eventData);
    StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData);
};

world.afterEvents.entityLoad.subscribe((ev) => {
    const entity = ev.entity;
    if (entity?.typeId !== `mc:core`) return;
    const isWar = warCountry.some((value) => entity.id == value.core);
    if (!isWar) {
        entity.remove();
    };
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { initialSpawn, player } = ev;
    if (initialSpawn) {
        player.getTags().forEach(tag => {
            if (tag.startsWith(`war`)) player.removeTag(tag);
        });
    };
});

world.afterEvents.worldLoad.subscribe(() => {
    const players = world.getPlayers();
    for (const player of players) {
        player.getTags().forEach(tag => {
            if (tag.startsWith(`war`)) player.removeTag(tag);
        });
    };
    const overworldEntities = world.getDimension(`minecraft:overworld`).getEntities({ type: `mc:core` });
    for (const entity of overworldEntities) {
        entity.remove();
    };
    const netherEntities = world.getDimension(`minecraft:nether`).getEntities({ type: `mc:core` });
    for (const entity of netherEntities) {
        entity.remove();
    };
    const the_endEntities = world.getDimension(`minecraft:the_end`).getEntities({ type: `mc:core` });
    for (const entity of the_endEntities) {
        entity.remove();
    };
});

world.afterEvents.entityDie.subscribe((ev) => {
    const { deadEntity } = ev;
    if (!deadEntity.isValid) return;
    if (deadEntity?.typeId !== `mc:core`) return;
    let isWar = false;
    let key = ``;
    for (const [mapKey, value] of warCountry) {
        if (deadEntity.id == value.core) {
            isWar = true;
            key = mapKey;
        };
    };
    if (!isWar) return;
    /**
     * @type {{ country: number, core: string, key: number }}
     */
    const data = warCountry.get(key);
    const playerCountryData = GetAndParsePropertyData(`country_${key}`);
    const invadeCountryData = GetAndParsePropertyData(`country_${data.country}`);
    const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(deadEntity));
    chunkData.countryId = playerCountryData.id;
    if (invadeCountryData.territories.includes(chunkData.id)) {
        invadeCountryData.territories = invadeCountryData.territories.filter(id => id != chunkData.id);
    };
    playerCountryData.territories.push(chunkData.id);
    const date = new Date(Date.now() + ((config.timeDifference * 60) * 60 * 1000)).getTime();
    playerCountryData.invadeCooltime = date + (config.invadeWonCoolTime * 1000);
    StringifyAndSavePropertyData(chunkData.id, chunkData);
    StringifyAndSavePropertyData(`country_${playerCountryData.id}`, playerCountryData);
    StringifyAndSavePropertyData(`country_${invadeCountryData.id}`, invadeCountryData);
    if (ev.damageSource?.damagingEntity) {
        ev.damageSource.damagingEntity.removeTag(ev.damageSource.damagingEntity.getTags().find(tag => tag.startsWith(`war`)));
    };
    wars.delete(`${data.key}`);
    warCountry.delete(key);
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.won`, with: [`§r${playerCountryData.name}§r`, `${invadeCountryData.name}§r`] }] });
    system.runTimeout(() => {
        if (invadeCountryData.territories.length == 0) {
            DeleteCountry(invadeCountryData.id);
        };
    }, 10);
});

world.afterEvents.entityDie.subscribe((ev) => {
    const { deadEntity } = ev;
    if (!deadEntity.isValid) return;
    if (deadEntity?.typeId !== `minecraft:player`) return;
    const tags = deadEntity.getTags().find(a => a.startsWith(`war`));
    if (!tags) return;
    const key = tags.split(`war`)[1];
    const playerData = GetAndParsePropertyData(`player_${deadEntity.id}`);
    if (!warCountry.has(`${playerData.country}`)) return;
    /**
     * @type {{ country: number, core: string }}
     */
    const warData = warCountry.get(`${playerData.country}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const warCountryData = GetAndParsePropertyData(`country_${warData.country}`);
    const coreArray = ev.deadEntity.dimension.getEntities({ location: ev.deadEntity.location, maxDistance: config.maxDropDistance, type: `mc:core` });
    const core = world.getEntity(warData.core);
    if (core) {
        core.remove();
    };
    deadEntity.removeTag(`war${key}`);
    wars.delete(key);
    warCountry.delete(`${playerData.country}`);
    const date = new Date(Date.now() + ((config.timeDifference * 60) * 60 * 1000)).getTime();
    playerCountryData.invadeCooltime = date + (config.invadeLostCoolTime * 1000);
    world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.guard`, with: [`§r${warCountryData.name}§r`, `${playerCountryData.name}§r`] }] });
    StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    if (coreArray.length == 0) return;
    /** 
    * @type { Container } 
    */
    let playerContainer = ev.deadEntity.getComponent(`inventory`).container;
    for (let i = 0; i < 36; i++) {
        if (typeof playerContainer.getItem(i) === 'undefined') continue;
        world.getDimension(ev.deadEntity.dimension.id).spawnItem(playerContainer.getItem(i), ev.deadEntity.location);
    };
    /** 
    * @type { EntityEquippableComponent } 
    */
    let playerEquipment = ev.deadEntity.getComponent(`minecraft:equippable`);
    const slotNames = ["Chest", "Head", "Feet", "Legs", "Offhand"];
    for (let i = 0; i < 5; i++) {
        if (typeof playerEquipment.getEquipment(slotNames[i]) === 'undefined') continue;
        world.getDimension(ev.deadEntity.dimension.id).spawnItem(playerEquipment.getEquipment(slotNames[i]), ev.deadEntity.location);
    };
    ev.deadEntity.runCommand(`clear @s`);
});

world.beforeEvents.playerLeave.subscribe((ev) => {
    const { player: deadEntity } = ev;
    if (!deadEntity.isValid) return;
    if (deadEntity?.typeId !== `minecraft:player`) return;
    const tags = deadEntity.getTags().find(a => a.startsWith(`war`));
    if (!tags) return;
    const id = deadEntity.id;
    system.run(() => {
        const key = tags.split(`war`)[1];
        const playerData = GetAndParsePropertyData(`player_${id}`);
        if (!warCountry.has(`${playerData.country}`)) return;
        /**
         * @type {{ country: number, core: string }}
         */
        const warData = warCountry.get(`${playerData.country}`);
        const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);
        const date = new Date(Date.now() + ((config.timeDifference * 60) * 60 * 1000)).getTime();
        playerCountryData.invadeCooltime = date + (config.invadeLostCoolTime * 1000);
        const warCountryData = GetAndParsePropertyData(`country_${warData.country}`);
        const core = world.getEntity(warData.core);
        if (core) {
            core.remove();
        };
        wars.delete(key);
        warCountry.delete(`${playerData.country}`);
        world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.guard`, with: [`§r${warCountryData.name}§r`, `${playerCountryData.name}§r`] }] });
        StringifyAndSavePropertyData(`country_${playerData.country}`, playerCountryData);
    });
});

world.afterEvents.entityDie.subscribe((ev) => {
    if (!ev.deadEntity.isValid) return;
    if (ev.deadEntity.typeId != `minecraft:player`) return;
    if (!config.invadeItemDrop) return;
    const tags = ev.deadEntity.getTags().find(a => a.startsWith(`war`));
    if (tags) return;
    const coreArray = ev.deadEntity.dimension.getEntities({ location: ev.deadEntity.location, maxDistance: config.maxDropDistance, type: `mc:core` });
    if (coreArray.length == 0) return;
    /** 
    * @type { Container } 
    */
    let playerContainer = ev.deadEntity.getComponent(`inventory`).container;
    for (let i = 0; i < 36; i++) {
        if (playerContainer.getItem(i) === undefined) continue;
        world.getDimension(ev.deadEntity.dimension.id).spawnItem(playerContainer.getItem(i), ev.deadEntity.location);
    };
    /** 
    * @type { EntityEquippableComponent } 
    */
    let playerEquipment = ev.deadEntity.getComponent(`minecraft:equippable`);
    const slotNames = ["Chest", "Head", "Feet", "Legs", "Offhand"];
    for (let i = 0; i < 5; i++) {
        if (playerEquipment.getEquipment(slotNames[i]) === undefined) continue;
        world.getDimension(ev.deadEntity.dimension.id).spawnItem(playerEquipment.getEquipment(slotNames[i]), ev.deadEntity.location);
    };
    ev.deadEntity.runCommand(`clear @s`);
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        const date = new Date(Date.now() + ((config.timeDifference * 60) * 60 * 1000)).getTime();
        for (const key of warCountry.keys()) {
            const data = warCountry.get(key);
            if (data.time < date) {
                warCountry.delete(key);
                wars.delete(`${data.key}`);
                const playerCountryData = GetAndParsePropertyData(`country_${key}`);
                const warCountryData = GetAndParsePropertyData(`country_${data.country}`);
                const core = world.getEntity(data.core);
                if (core) {
                    core.remove();
                };
                world.sendMessage({ rawtext: [{ text: `§a[MakeCountry]\n` }, { translate: `invade.guard`, with: [`§r${warCountryData.name}§r`, `${playerCountryData.name}§r`] }] });
            };
        };
    }, 20);
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        const cores = world.getDimension("overworld").getEntities({ type: `mc:core` });
        for (const core of cores) {
            for (const player of core.dimension.getPlayers({ maxDistance: config.maxDropDistance, location: core.location })) {
                const container = player.getComponent(`inventory`).container;
                const selectItem = container.getItem(player.selectedSlotIndex);
                const equippable = player.getComponent(`equippable`);
                const chestItem = equippable.getEquipment(EquipmentSlot.Chest);
                if (chestItem) {
                    const equippableItemStackTypeId = chestItem.typeId;
                    let cleared = false;
                    if (equippableItemStackTypeId == `minecraft:elytra`) {
                        for (let i = 9; i < container.size; i++) {
                            if (!container.getItem(i) && !cleared) {
                                equippable.setEquipment(EquipmentSlot.Chest);
                                container.setItem(i, chestItem);
                                cleared = true;
                            };
                        };
                        if (!cleared) {
                            equippable.setEquipment(EquipmentSlot.Chest);
                            const { x, y, z } = player.location;
                            player.dimension.spawnItem(chestItem, { x, y: y + 5, z });
                        };
                    };
                };
                if (selectItem) {
                    const selectItemStackTypeId = selectItem.typeId;
                    let cleared = false;
                    const kisei = [
                        'minecraft:mace',
                        'minecraft:trident',
                        'minecraft:ender_pearl',
                        'minecraft:wooden_spear',
                        'minecraft:stone_spear',
                        'minecraft:copper_spear',
                        'minecraft:iron_spear',
                        'minecraft:golden_spear',
                        'minecraft:diamond_spear',
                        'minecraft:netherite_spear',

                    ];
                    if (kisei.includes(selectItemStackTypeId)) {
                        for (let i = 9; i < container.size; i++) {
                            if (!container.getItem(i) && !cleared) {
                                container.setItem(player.selectedSlotIndex);
                                container.setItem(i, selectItem);
                                cleared = true;
                            };
                        };
                        if (!cleared) {
                            container.setItem(player.selectedSlotIndex);
                            const { x, y, z } = player.location;
                            player.dimension.spawnItem(selectItem, { x, y: y + 5, z });
                        };
                    }
                };
            };
        };
    });
})
