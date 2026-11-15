import type { ItemStack, Player } from '@minecraft/server';

// Official beta signatures; the pinned 1.26.20 declarations predate these events.
// https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playercursoritemgrabafterevent?view=minecraft-bedrock-experimental
// https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playercursoritemreleaseafterevent?view=minecraft-bedrock-experimental
declare module '@minecraft/server' {
    interface PlayerCursorItemGrabAfterEvent { readonly player: Player; readonly item: ItemStack }
    interface PlayerCursorItemReleaseAfterEvent { readonly player: Player; readonly item: ItemStack }
    interface PlayerCursorItemGrabAfterEventSignal {
        subscribe(callback: (event: PlayerCursorItemGrabAfterEvent) => void): (event: PlayerCursorItemGrabAfterEvent) => void;
        unsubscribe(callback: (event: PlayerCursorItemGrabAfterEvent) => void): void;
    }
    interface PlayerCursorItemReleaseAfterEventSignal {
        subscribe(callback: (event: PlayerCursorItemReleaseAfterEvent) => void): (event: PlayerCursorItemReleaseAfterEvent) => void;
        unsubscribe(callback: (event: PlayerCursorItemReleaseAfterEvent) => void): void;
    }
    interface WorldAfterEvents {
        readonly playerCursorItemGrab: PlayerCursorItemGrabAfterEventSignal;
        readonly playerCursorItemRelease: PlayerCursorItemReleaseAfterEventSignal;
    }
}
