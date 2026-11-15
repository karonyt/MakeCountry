import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, ItemStack, Player, system } from "@minecraft/server";
import { addItemsExactly } from "@/shared/minecraft/inventory-delivery.js";

// バニラ瓶の排出は3〜11 XP。最大値を必ず先に徴収し、再変換で増殖させない。
const XP_PER_BOTTLE = 11;
const BOTTLES_PER_STACK = 64;
const MAX_BOTTLES = 1728;
const MAX_STACKS = MAX_BOTTLES / BOTTLES_PER_STACK;

type ConversionUnit = 'bottle' | 'stack';

function formatBottleAmount(amount: number) {
    const stacks = Math.floor(amount / BOTTLES_PER_STACK);
    const bottles = amount % BOTTLES_PER_STACK;
    if (stacks === 0) return `${bottles}個`;
    if (bottles === 0) return `${stacks}st (${amount}個)`;
    return `${stacks}st + ${bottles}個 (${amount}個)`;
}

function checkXpExecuter(origin: CustomCommandOrigin) {
    if (!(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const xp = sender.getTotalXp();
    const bottles = Math.floor(xp / XP_PER_BOTTLE);
    const stacks = Math.floor(bottles / BOTTLES_PER_STACK);
    const remainder = bottles % BOTTLES_PER_STACK;
    const stackAmount = remainder === 0 ? `${stacks}st` : `${stacks}st + ${remainder}瓶`;

    sender.sendMessage(`§a現在の経験値: §f${xp.toLocaleString('en-US')} XP §7(${stackAmount}分)`);
    sender.sendMessage('§7経験値の瓶換算: 1瓶 = 11XP / 1st = 64瓶 = 704XP（所持経験値から計算）');
    if (stacks > 0) {
        const amount = Math.min(stacks, MAX_STACKS);
        sender.sendMessage(`§7変換するには §f/xptb ${amount}§7（1回最大${MAX_STACKS}st・空き容量が必要）`);
    }
}

function availableBottleCapacity(container: any) {
    const plainBottle = new ItemStack('minecraft:experience_bottle', 1);
    let capacity = container.emptySlotsCount * BOTTLES_PER_STACK;

    for (let slot = 0; slot < container.size; slot++) {
        const item = container.getItem(slot);
        if (!item || item.amount >= BOTTLES_PER_STACK) continue;
        if (item.isStackableWith(plainBottle)) capacity += BOTTLES_PER_STACK - item.amount;
    }
    return capacity;
}

/**
 * 
 * @param {CustomCommandOrigin} origin 
 * @param {any} args 
 * @returns 
 */
function xpToBottleExecuter(origin: any, args: any, unit: ConversionUnit) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    const inputAmount = args[0];
    const maxInput = unit === 'stack' ? MAX_STACKS : MAX_BOTTLES;
    if (!Number.isInteger(inputAmount) || inputAmount <= 0 || maxInput < inputAmount) {
        sender.sendMessage({ translate: 'command.number.limit.range', with: ['1', String(maxInput)] });
        return;
    };

    const amount = unit === 'stack' ? inputAmount * BOTTLES_PER_STACK : inputAmount;
    const xp = XP_PER_BOTTLE * amount;

    const hasXp = sender.getTotalXp();

    if (hasXp < xp) {
        sender.sendMessage({ translate: 'command.error.notenough.xp' });
        sender.sendMessage(`§7必要経験値: §f${xp} XP §7(経験値の瓶 ${formatBottleAmount(amount)})`);
        return;
    };

    const container = sender.getComponent(`inventory`).container;

    if (availableBottleCapacity(container) < amount) {
        sender.sendMessage({ translate: 'no.available.slots' });
        return;
    }

    /**
     * 
     * @param {Player} player 
     * @param {number} xp 
     */
    function removeTotalXp(player: any, xp: any) {
        let remaining = xp;

        while (remaining > 0) {
            const cur = player.xpEarnedAtCurrentLevel;

            if (cur >= remaining) {
                player.addExperience(-remaining);
                break;
            }

            if (cur > 0) {
                player.addExperience(-cur);
                remaining -= cur;
            }

            if (player.level > 0) {
                player.addLevels(-1);

                player.addExperience(player.totalXpNeededForNextLevel - 1);
                remaining -= 1;
            } else {
                break;
            }
        }
    }
    let remaining = amount;
    const stacks: ItemStack[] = [];
    while (remaining > 0) {
        const stackSize = Math.min(BOTTLES_PER_STACK, remaining);
        stacks.push(new ItemStack('minecraft:experience_bottle', stackSize));
        remaining -= stackSize;
    }
    removeTotalXp(sender, xp);
    if (!addItemsExactly(container, stacks)) {
        sender.addExperience(xp);
        sender.sendMessage({ translate: 'no.available.slots' });
        return;
    }

    sender.sendMessage(`§a${xp} XPを経験値の瓶 ${formatBottleAmount(amount)} に変換しました。`);
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    for (const name of ['checkxp', 'cxp']) {
        event.customCommandRegistry.registerCommand(
            {
                name: `makecountry:${name}`,
                description: '現在の経験値と経験値の瓶に変換できる量を確認します',
                permissionLevel: CommandPermissionLevel.Any,
            },
            (origin) => {
                system.runTimeout(() => checkXpExecuter(origin));
                return undefined;
            },
        );
    }

    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:xptobottle',
            description: 'command.help.xptobottle.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: 'bottles', type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                xpToBottleExecuter(origin, args, 'bottle');
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:xptb',
            description: '経験値を経験値の瓶へ変換します（1st = 64瓶 = 704XP）',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: 'stacks', type: CustomCommandParamType.Integer }]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        ((origin, ...args) => {
            system.runTimeout(() => {
                xpToBottleExecuter(origin, args, 'stack');
            })
        })
    )
});
