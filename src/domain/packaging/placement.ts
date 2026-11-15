import { BlockPermutation, GameMode, system, type Block, type ItemStack, type Player } from '@minecraft/server';
import { PACKAGE_ID, packageBlockId, packageDefinition, validatePackagePayload, writeBlockPackage } from './storage.js';

/** Let the engine resolve replaceable blocks, permissions and item consumption. */
export function registerPackagePlacement(validate: (player: Player, block: Block) => void, report: (player: Player, error: unknown) => void) {
    const pending = new Map<string, { item: ItemStack; tick: number; player: Player; slot: number }>();
    const key = (block: Block) => `${block.dimension.id}:${block.x}:${block.y}:${block.z}`;
    system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
        blockComponentRegistry.registerCustomComponent('mc:package_placement', {
            beforeOnPlayerPlace(event) {
                const player = event.player;
                if (!player || event.cancel) return;
                try {
                    validate(player, event.block);
                    const slot = player.selectedSlotIndex;
                    const item = player.getComponent('inventory')?.container?.getItem(slot);
                    if (!item || item.amount !== 1 || item.lockMode !== 'none'
                        || packageDefinition(item.typeId)?.block !== packageDefinition(event.permutationToPlace.type.id)?.block) throw Error('packaging.changed');
                    // Validate without mutating ItemStacks in this before-event.
                    validatePackagePayload(item);
                    event.permutationToPlace = BlockPermutation.resolve(packageBlockId(item), event.permutationToPlace.getAllStates());
                    pending.set(key(event.block), { item: item.clone(), tick: system.currentTick, player, slot });
                } catch (error) { event.cancel = true; system.run(() => report(player, error)); }
            },
            onPlace({ block }) {
                const entry = pending.get(key(block));
                pending.delete(key(block));
                if (!entry || entry.tick !== system.currentTick) return;
                const shell = entry.item.clone();
                shell.setDynamicProperty(PACKAGE_ID, `${Date.now()}:${system.currentTick}:${entry.player.id}`);
                // This callback runs during native placement, without an intervening tick.
                try { writeBlockPackage(block, shell); }
                catch (error) {
                    // Native placement has succeeded. Undo partial native contents,
                    // then refund the untouched portable stack after consumption.
                    block.getComponent('inventory')?.container?.clearAll();
                    block.setType('minecraft:air');
                    const creative = entry.player.getGameMode() === GameMode.Creative;
                    system.run(() => {
                        if (!creative) {
                            block.dimension.spawnItem(entry.item, block.location);
                        }
                        report(entry.player, error);
                    });
                    return;
                }
                // Creative normally keeps the held stack. Consume filled packages too,
                // so placing a carried package never duplicates its contents.
                if (entry.player.getGameMode() === GameMode.Creative && validatePackagePayload(shell)) {
                    const inv = entry.player.getComponent('inventory')!.container!;
                    inv.setItem(entry.slot, undefined);
                }
            },
        });
    });
    // A later protection handler may cancel placement after the component ran.
    system.runInterval(() => { for (const [id, entry] of pending) if (entry.tick < system.currentTick) pending.delete(id); }, 1);
}
