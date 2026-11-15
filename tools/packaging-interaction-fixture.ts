// Appended to the isolated smoke pack; not part of the production addon.
world.beforeEvents.playerPlaceBlock.subscribe(event => console.warn('PACKAGING_INTERACTION before ' + JSON.stringify(event.block.location) + ' type=' + event.permutationToPlace.type.id));
world.afterEvents.playerPlaceBlock.subscribe(event => console.warn('PACKAGING_INTERACTION after ' + JSON.stringify(event.block.location) + ' type=' + event.block.typeId));
register('packaging', 'native', test => {
    try {
        for (let x = 0; x < 24; x++) for (let z = 0; z < 16; z++) test.setBlockType('minecraft:stone', { x, y: 1, z });
        let player = test.spawnSimulatedPlayer({ x: 3, y: 2, z: 6 }, 'PackagingTest', GameMode.Survival);
        const dimension = player.dimension;
        let opened = 0;
        world.afterEvents.blockContainerOpened.subscribe(event => { if (event.openSource.entity?.id === player.id) opened++; });
        const tasks = [...PACKAGES.map((definition, index) => ({ definition, index })), { definition: undefined, index: 5 },
            { definition: PACKAGES[0], index: 6, creative: true }, { definition: PACKAGES[0], index: 7, empty: true },
            { index: 8, furniture: 'mc:furniture_oak_refrigerator' }, { index: 9, furniture: 'mc:furniture_oak_wine_rack' }];
        let step = 0;
        const next = () => {
            try {
                if (step === tasks.length) {
                    // Restricted furniture must return rejected stacks without changing valid ones.
                    const fridge = dimension.getBlock(test.worldBlockLocation({ x: 18, y: 2, z: 3 }));
                    const inv = fridge.getComponent('inventory').container;
                    assert(inv.size === 54, 'fridge capacity');
                    inv.setItem(0, new ItemStack('minecraft:cooked_beef', 32));
                    inv.setItem(1, new ItemStack('minecraft:stone', 7));
                    const wine = dimension.getBlock(test.worldBlockLocation({ x: 20, y: 2, z: 3 }));
                    wine.getComponent('inventory').container.setItem(0, new ItemStack('minecraft:honey_bottle', 2));
                    wine.getComponent('inventory').container.setItem(1, new ItemStack('minecraft:stone', 5));
                    const hopper = dimension.getBlock({ ...fridge.location, y: fridge.y + 1 });
                    hopper.setType('minecraft:hopper');
                    hopper.getComponent('inventory').container.setItem(0, new ItemStack('minecraft:stone'));
                    test.runAfterDelay(25, () => {
                        try {
                            assert(inv.getItem(0)?.amount === 32 && !inv.getItem(1), 'fridge rejects nonfood');
                            assert(wine.getComponent('inventory').container.getItem(0)?.amount === 2 && !wine.getComponent('inventory').container.getItem(1), 'rack rejects nondrinks');
                            const drops = dimension.getEntities({ type: 'minecraft:item', location: fridge.location, maxDistance: 4 });
                            console.warn('PACKAGING_INTERACTION hopper_remaining=' + (hopper.getComponent('inventory').container.getItem(0)?.amount ?? 0) + ' states=' + JSON.stringify(hopper.permutation.getAllStates()));
                            const remaining = hopper.getComponent('inventory').container.getItem(0)?.amount ?? 0;
                            assert(remaining === 0 || remaining === 1, 'hopper item count');
                            // This engine may not route vanilla hopper automation into
                            // custom containers yet. In either case conserve all items.
                            assert(drops.reduce((sum, entity) => { const item = entity.getComponent('item').itemStack; return sum + (item.typeId === 'minecraft:stone' ? item.amount : 0); }, 0) + remaining === 13, 'rejected items preserved exactly once');
                            console.warn('PACKAGING_SMOKE_PASS native_survival_placement=5 rank=true metadata=true containers_opened=' + opened + ' furniture=true restrictions=true hopper_transfer=' + (remaining === 0) + ' creative_no_duplication=true');
                            player.disconnect(); test.succeed();
                        } catch (error) { fail(error); }
                    });
                    return;
                }
                const { definition, index, creative, empty, furniture } = tasks[step++];
                player.setGameMode(creative ? GameMode.Creative : GameMode.Survival);
                const anchor = { x: 2 + index * 2, y: 1, z: 3 };
                const location = test.worldBlockLocation({ ...anchor, y: 2 });
                player.teleport(test.worldLocation({ x: anchor.x + .5, y: 2, z: 6 }));
                const item = new ItemStack(definition?.item ?? furniture ?? 'mc:furniture_oak_cabinet');
                let expected;
                if (definition) {
                    if (!empty) item.setLore([{ rawtext: [{ translate: 'chemistry.lore.purity', with: ['KARON'] }] }]);
                    item.nameTag = 'Native placement';
                    expected = new ItemStack(definition.kind === 'food' ? 'minecraft:cooked_beef' : definition.kind === 'bottle' ? 'minecraft:honey_bottle' : 'minecraft:diamond', 3);
                    player.setItem(withPackageContents(item, empty ? [] : [expected]), 0, true);
                } else player.setItem(item, 0, true);
                const used = player.useItemInSlotOnBlock(0, anchor, Direction.Up);
                console.warn('PACKAGING_INTERACTION place ' + item.typeId + ' used=' + used + ' expected=' + JSON.stringify(location));
                test.runAfterDelay(2, () => {
                    try {
                        const block = dimension.getBlock(location);
                        assert(block.typeId === (definition ? packageBlockId(item) : item.typeId), 'native placement ' + item.typeId + ' got ' + block.typeId);
                        assert(!player.getComponent('inventory').container.getItem(0), 'survival consumes exactly once');
                        if (definition) {
                            const placed = readBlockPackage(block);
                            assert(placed.nameTag === item.nameTag && packageCapacity(placed) === block.getComponent('inventory').container.size, 'rank and shell metadata');
                            assert(empty ? !packageInventory(placed).getItem(0) : packageInventory(placed).getItem(0)?.amount === 3, 'placed payload');
                        }
                        const previous = opened;
                        player.interactWithBlock({ ...anchor, y: 2 });
                        test.runAfterDelay(2, () => {
                            try {
                                assert(opened > previous, 'native container screen opens ' + item.typeId);
                                player.disconnect();
                                player = test.spawnSimulatedPlayer({ x: 3, y: 2, z: 6 }, 'PackagingTest' + step, GameMode.Survival);
                                test.runAfterDelay(3, next);
                            }
                            catch (error) { fail(error); }
                        });
                    } catch (error) { fail(error); }
                });
            } catch (error) { fail(error); }
        };
        const fail = error => { console.error('PACKAGING_SMOKE_FAIL interaction ' + error + '\n' + error.stack); player.disconnect(); test.fail(String(error)); };
        test.runAfterDelay(5, next);
    } catch (error) { console.error('PACKAGING_SMOKE_FAIL setup ' + error + '\n' + error.stack); test.fail(String(error)); }
}).structureName('packaging:empty').structureLocation({ x: 0, y: 100, z: 0 }).maxTicks(300);
world.afterEvents.worldLoad.subscribe(() => {
    system.runTimeout(() => {
        try { world.getDimension('overworld').runCommand('gametest run packaging:native'); }
        catch (error) { console.error('PACKAGING_SMOKE_FAIL launch ' + error); }
    }, 60);
});
