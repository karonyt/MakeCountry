import { isLocationDenied, runAfterPermissionCheck } from '@/domain/country/location-permission.js';
import { ItemStack, system, world, type Block, type Container, type Player } from '@minecraft/server';
import { addItemsExactly } from '@/shared/minecraft/inventory-delivery.js';
import { deniesIncident16 } from '@/domain/protection/incident16.js';
import { isUnsafeToPlay } from '@/shared/integration/standalone.js';
import { isGateBlockProtected } from '@/shared/integration/standalone.js';
import { PACKAGE_ID, packageDefinition, readBlockPackage, writeBlockPackage } from './storage.js';

import { registerPackagePlacement } from './placement.js';
import { registerStorageRestrictions } from './restrictions.js';

type Target = { read(): ItemStack; write(item: ItemStack): void; pickup?(): void };
let sequence = 0;
const nextId = () => `${Date.now().toString(36)}:${system.currentTick}:${sequence++}`;
function inventory(player: Player): Container {
    const result = player.getComponent('inventory')?.container;
    if (!result) throw Error('packaging.changed');
    return result;
}
function playerReady(player: Player) {
    if (!player.isValid || player.hasTag('status:transferring') || player.hasTag('status:loading')
        || isUnsafeToPlay() || deniesIncident16(player, player.location.x, player.location.z, player.dimension.id)) throw Error('packaging.changed');
}
function accessible(player: Player, block: Block, permission = 'openContainer') {
    playerReady(player);
    if (!block.isValid || player.dimension.id !== block.dimension.id
        || Math.hypot(player.location.x - block.x, player.location.y - block.y, player.location.z - block.z) > 8
        || isGateBlockProtected(block.dimension, block.location)
        || isLocationDenied(player, block.x, block.z, block.dimension.id, permission)) throw Error('packaging.changed');
}
function report(player: Player, error: unknown) {
    const key = error instanceof Error && error.message.startsWith('packaging.') ? error.message : 'packaging.failed';
    if (key === 'packaging.failed') console.warn('[Packaging]', error);
    if (player.isValid) player.sendMessage({ translate: key });
}
function blockTarget(player: Player, original: Block): Target {
    const { dimension, location, typeId } = original;
    const initial = readBlockPackage(original);
    let id = initial.getDynamicProperty(PACKAGE_ID);
    function block() {
        const current = dimension.getBlock(location);
        if (current?.typeId !== typeId) throw Error('packaging.changed');
        accessible(player, current);
        return current;
    }
    const read = () => {
        const item = readBlockPackage(block());
        if (item.getDynamicProperty(PACKAGE_ID) !== id) throw Error('packaging.changed');
        return item;
    };
    return { read, write(item) {
        read();
        const updated = item.clone(); updated.setDynamicProperty(PACKAGE_ID, nextId());
        writeBlockPackage(block(), updated); id = updated.getDynamicProperty(PACKAGE_ID);
    }, pickup() {
        const item = read(), current = block(); accessible(player, current, 'break');
        const inv = inventory(player), before = Array.from({ length: inv.size }, (_, slot) => inv.getItem(slot));
        if (!addItemsExactly(inv, [item])) throw Error('packaging.no_space');
        const permutation = current.permutation;
        try {
            current.getComponent('inventory')!.container!.clearAll();
            current.setType('minecraft:air');
        } catch (error) {
            before.forEach((value, slot) => inv.setItem(slot, value));
            current.setPermutation(permutation); writeBlockPackage(current, item);
            throw error;
        }
    } };
}
// Placement and native container interaction are handled by the engine. There is
// deliberately no itemUse/playerInteractWithBlock form handler.
registerPackagePlacement((player, block) => accessible(player, block, 'place'), report);
registerStorageRestrictions();
world.beforeEvents.playerBreakBlock.subscribe(event => {
    if (!packageDefinition(event.block.typeId)) return;
    const denied = event.cancel; event.cancel = true;
    const { player, block } = event;
    if (!denied) runAfterPermissionCheck(player, ['break', 'openContainer'].map(permission => ({ x: block.x, z: block.z, dimension: block.dimension.id, permission })), () => {
        try { blockTarget(player, block).pickup!(); }
        catch (error) { report(player, error); }
    });
});
