import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandParamType, ItemStack, Player, system, world } from "@minecraft/server";

/**
 * 
 * @param {CustomCommandOrigin} origin 
 * @param {any} args 
 * @returns 
 */
function xpToBottleExecuter(origin, args) {
    if (!origin?.sourceEntity || !(origin?.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    let xpNeed = 11;

    const amount = args[0];
    if (amount <= 0 || 1728 < amount) {
        sender.sendMessage({ translate: 'command.number.limit.range', with: ['1', '1728'] });
        return;
    };

    let hasXp = sender.getTotalXp();

    let xp = Math.floor(xpNeed * amount);

    if ((hasXp - xp) < 0) {
        sender.sendMessage({ translate: 'command.error.notenough.xp' });
        return;
    };

    const container = sender.getComponent(`inventory`).container;

    const MAX_STACK = 64;
    const needSlots = Math.ceil(amount / MAX_STACK);

    if (container.emptySlotsCount < needSlots) {
        sender.sendMessage({ translate: 'no.available.slots' });
        return;
    }

    /**
     * 
     * @param {Player} player 
     * @param {number} xp 
     */
    function removeTotalXp(player, xp) {
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
    removeTotalXp(sender, xp);

    let remaining = amount;
    while (remaining > 0) {
        const stackSize = Math.min(MAX_STACK, remaining);
        container.addItem(
            new ItemStack('minecraft:experience_bottle', stackSize)
        );
        remaining -= stackSize;
    }
    
    return;
};

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:xptobottle',
            description: 'command.help.xptobottle.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: 'amount', type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                xpToBottleExecuter(origin, args);
            })
        })
    )
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:xptb',
            description: 'command.help.xptobottle.message',
            permissionLevel: CommandPermissionLevel.Any,
            mandatoryParameters: [{ name: 'amount', type: CustomCommandParamType.Integer }]
        },
        ((origin, ...args) => {
            system.runTimeout(() => {
                xpToBottleExecuter(origin, args);
            })
        })
    )
});