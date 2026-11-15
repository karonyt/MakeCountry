import type { Block, ItemStack, Player } from '@minecraft/server';

// The pinned 1.26.20 types predate the server's crafting event.
// https://learn.microsoft.com/en-us/minecraft/creator/scriptapi/minecraft/server/playercraftrecipeafterevent?view=minecraft-bedrock-experimental
declare module '@minecraft/server' {
    interface PlayerCraftRecipeAfterEvent {
        readonly block?: Block;
        readonly itemStack?: ItemStack;
        readonly player: Player;
    }

    interface PlayerCraftRecipeAfterEventSignal {
        subscribe(callback: (event: PlayerCraftRecipeAfterEvent) => void): (event: PlayerCraftRecipeAfterEvent) => void;
    }

    interface WorldAfterEvents {
        readonly playerCraftRecipe?: PlayerCraftRecipeAfterEventSignal;
    }
}
