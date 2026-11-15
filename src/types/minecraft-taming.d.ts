import type { Entity } from '@minecraft/server';

// The pinned API types predate the server's taming event.
// https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/entitytamedafterevent?view=minecraft-bedrock-experimental
declare module '@minecraft/server' {
    interface EntityTamedAfterEvent {
        readonly entity: Entity;
        readonly tamingEntity: Entity;
    }

    interface EntityTamedAfterEventSignal {
        subscribe(callback: (event: EntityTamedAfterEvent) => void): (event: EntityTamedAfterEvent) => void;
    }

    interface WorldAfterEvents {
        readonly entityTamed?: EntityTamedAfterEventSignal;
    }
}
