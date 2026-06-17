import { CommandPermissionLevel, CustomCommandParamType, ItemStack, Player, system } from "@minecraft/server";
import { customItemIds } from "@/config/custom-item-ids.js";

const customItemIdEnum = "makecountry:custom_item_id";

function toPlayerTargets(value: any): Player[] {
    if (!Array.isArray(value)) return [];
    return value.filter((target) => target instanceof Player);
}

function giveItem(target: Player, itemId: string, amount: number) {
    const inventory = target.getComponent("inventory")?.container;
    if (!inventory) return;

    const sample = new ItemStack(itemId);
    const maxAmount = Math.max(1, sample.maxAmount);
    let remaining = amount;

    while (remaining > 0) {
        const stackAmount = Math.min(maxAmount, remaining);
        const stack = new ItemStack(itemId, stackAmount);
        const leftover = inventory.addItem(stack);
        if (leftover) target.dimension.spawnItem(leftover, target.location);
        remaining -= stackAmount;
    }
}

function getExecuter(origin: any, args: any[]) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;

    if (!sender.hasTag("mc_admin")) {
        sender.sendMessage({ translate: "command.permission.error" });
        return;
    }

    const targets = toPlayerTargets(args[0]);
    const itemId = String(args[1]);
    const amount = Math.floor(Number(args[2]));

    if (targets.length === 0) {
        sender.sendMessage({ translate: "command.error.notarget.this.dimension" });
        return;
    }

    if (!Number.isFinite(amount) || amount < 1) {
        sender.sendMessage("§c個数は1以上の整数を指定してください");
        return;
    }

    try {
        for (const target of targets) giveItem(target, itemId, amount);
    } catch {
        sender.sendMessage(`§cアイテムを付与できませんでした: ${itemId}`);
        return;
    }

    sender.sendMessage(`§a${targets.length}人に ${itemId} x${amount} を付与しました`);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerEnum(customItemIdEnum, customItemIds);
    event.customCommandRegistry.registerCommand(
        {
            name: "makecountry:get",
            description: "Give a custom MakeCountry item to selected players.",
            permissionLevel: CommandPermissionLevel.Admin,
            mandatoryParameters: [
                { name: "selector", type: CustomCommandParamType.PlayerSelector },
                { name: "itemId", type: CustomCommandParamType.Enum, enumName: customItemIdEnum },
                { name: "amount", type: CustomCommandParamType.Integer }
            ]
        },
        // @ts-ignore TS(2345): Argument of type '(origin: CustomCommandOrigin, ..... Remove this comment to see the full error message
        (origin, ...args) => {
            system.run(() => getExecuter(origin, args));
        }
    );
});
