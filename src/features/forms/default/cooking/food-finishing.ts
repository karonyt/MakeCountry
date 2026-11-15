import type { Block, ItemStack, Player, RawMessage } from '@minecraft/server';
import { CraftingActionFormData as ActionFormData, CraftingModalFormData as ModalFormData } from '@/shared/ui/purpose-forms.js';
import {
    SECRET_FLAVORS, FOOD_TOPPINGS, buildFinishingLore, canFinishFood, finishFood, foodSnapshot,
} from '@/domain/cooking/food-finishing.js';

const openPlayers = new Set<string>();
type Board = { typeId: string; dimension: string; x: number; y: number; z: number };
function boardAvailable(player: Player, board: Board) {
    if (!player.isValid || player.dimension.id !== board.dimension) return false;
    const p = player.location;
    if ((p.x - board.x) ** 2 + (p.y - board.y) ** 2 + (p.z - board.z) ** 2 > 64) return false;
    return player.dimension.getBlock(board)?.typeId === board.typeId;
}
const foodName = (item: ItemStack) => item.nameTag ? { text: item.nameTag } : { translate: item.localizationKey };
const text = (key: string, args?: string[]): RawMessage => ({ translate: 'cooking.finish.' + key, ...(args ? { with: args } : {}) });

/** Sneak-use any cutting board; all dialogs share one lock until they close. */
export async function openFoodFinishing(player: Player, block: Block) {
    if (openPlayers.has(player.id)) return;
    openPlayers.add(player.id);
    const board: Board = { typeId: block.typeId, dimension: block.dimension.id, ...block.location };
    try {
        if (!boardAvailable(player, board)) return;
        const container = player.getComponent('minecraft:inventory')?.container;
        if (!container) return;
        const foods: { slot: number; item: ItemStack; snapshot: string }[] = [];
        const select = new ActionFormData().title(text('ui.title')).body(text('ui.intro'));
        for (let slot = 0; slot < container.size; slot++) {
            const item = container.getItem(slot);
            if (!item || !canFinishFood(item)) continue;
            foods.push({ slot, item, snapshot: foodSnapshot(item) });
            select.button({ rawtext: [foodName(item), text('ui.stack', [String(item.amount), String(slot + 1)])] });
        }
        if (!foods.length) { player.sendMessage(text('ui.empty')); return; }
        const selected = await select.show(player);
        if (selected.canceled || !Number.isInteger(selected.selection)) return;
        const food = foods[selected.selection];
        if (!food || !boardAvailable(player, board)) return;
        const form = new ModalFormData().title(text('ui.choose'))
            .dropdown(text('ui.secret'), [text('ui.none'), ...SECRET_FLAVORS.map(entry => text('ingredient.' + entry.id))])
            .dropdown(text('ui.topping'), [text('ui.none'), ...FOOD_TOPPINGS.map(entry => text('ingredient.' + entry.id))]);
        if (food.item.amount > 1) form.slider(text('ui.quantity'), 1, food.item.amount, { defaultValue: 1, valueStep: 1 });
        form.submitButton(text('ui.preview'));
        const response = await form.show(player);
        if (response.canceled || !response.formValues || !boardAvailable(player, board)) return;
        const [secretIndex, toppingIndex, quantity = 1] = response.formValues;
        if (![secretIndex, toppingIndex, quantity].every(Number.isInteger)) return;
        const secret = secretIndex === 0 ? undefined : SECRET_FLAVORS[Number(secretIndex) - 1];
        const topping = toppingIndex === 0 ? undefined : FOOD_TOPPINGS[Number(toppingIndex) - 1];
        if ((!secret && secretIndex !== 0) || (!topping && toppingIndex !== 0)) return;
        if (!secret && !topping) { player.sendMessage(text('error.choice')); return; }
        const lore = buildFinishingLore(food.item, secret?.id, topping?.id);
        const confirm = new ActionFormData().title(text('ui.confirm')).body({ rawtext: [
            foodName(food.item), { text: ` ×${quantity}\n` },
            ...lore.flatMap(line => [{ text: '\n' }, line]), text('ui.materials'),
            ...[secret, topping].filter(Boolean).flatMap(entry => [text('ingredient.' + entry!.id), { text: ` ×${quantity}\n` }]),
            text('ui.effect_hint'),
        ] }).button(text('ui.finish')).button(text('ui.cancel'));
        const decision = await confirm.show(player);
        if (decision.canceled || decision.selection !== 0 || !boardAvailable(player, board)) return;
        // Recheck the exact source slot and all materials after the final dialog.
        const current = player.getComponent('minecraft:inventory')?.container;
        if (!current) return;
        finishFood(current, food.slot, food.snapshot, Number(quantity), secret?.id, topping?.id);
        player.sendMessage(text('ui.done', [String(quantity)]));
    } catch (error) {
        if (player.isValid) player.sendMessage(error instanceof Error && error.message.startsWith('cooking.finish.error.')
            ? { translate: error.message } : text('error.failed'));
    } finally { openPlayers.delete(player.id); }
}
