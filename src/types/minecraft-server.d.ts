import type { Entity, ItemStack, Player, Vector3 } from '@minecraft/server';

// The server supports this event, but the pinned 1.26.20 API types predate it.
// https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playeritemattackentitybeforeevent?view=minecraft-bedrock-experimental
declare module '@minecraft/server' {
    interface PlayerItemAttackEntityBeforeEvent {
        cancel: boolean;
        readonly player: Player;
        readonly target: Entity;
        readonly itemStack?: ItemStack;
        readonly aimDirection?: Vector3;
    }

    interface PlayerItemAttackEntityBeforeEventSignal {
        subscribe(callback: (event: PlayerItemAttackEntityBeforeEvent) => void): (event: PlayerItemAttackEntityBeforeEvent) => void;
        unsubscribe(callback: (event: PlayerItemAttackEntityBeforeEvent) => void): void;
    }

    interface WorldBeforeEvents {
        readonly playerItemAttackEntity: PlayerItemAttackEntityBeforeEventSignal;
    }
}
