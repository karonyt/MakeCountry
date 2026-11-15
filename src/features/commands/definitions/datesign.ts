import { CommandPermissionLevel, Player, system } from "@minecraft/server";

const DATE_SIGNATURE_MARKER = '[日時署名]';
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const MAX_LORE_LINES = 20;
const FORBIDDEN_ITEMS = new Set(['mc:penname_after', 'mc:penname_before']);

function pad(value: number) {
    return String(value).padStart(2, '0');
}

export function formatJstTimestamp(now = new Date()) {
    const jst = new Date(now.getTime() + JST_OFFSET_MS);
    return [
        jst.getUTCFullYear(),
        pad(jst.getUTCMonth() + 1),
        pad(jst.getUTCDate()),
    ].join('/') + ` ${pad(jst.getUTCHours())}:${pad(jst.getUTCMinutes())} JST`;
}

function hasDateSignature(lore: unknown[]) {
    return lore.some((line) => {
        try {
            return JSON.stringify(line).includes(DATE_SIGNATURE_MARKER);
        } catch {
            return false;
        }
    });
}

function dateSignExecuter(origin: any) {
    if (!origin?.sourceEntity || !(origin.sourceEntity instanceof Player)) return;
    const sender = origin.sourceEntity;
    const container = sender.getComponent('inventory').container;
    const item = container.getItem(sender.selectedSlotIndex);

    if (!item) {
        sender.sendMessage('§c日時を刻印するアイテムを手に持ってください。');
        return;
    }
    if (FORBIDDEN_ITEMS.has(item.typeId)) {
        sender.sendMessage({ translate: 'command.error.cannot.this.item' });
        return;
    }

    const lore = item.getRawLore();
    if (hasDateSignature(lore)) {
        sender.sendMessage('§cこのアイテムには既に日時が刻印されています。');
        return;
    }
    if (lore.length >= MAX_LORE_LINES) {
        sender.sendMessage('§c説明欄が上限に達しているため、日時を刻印できません。');
        return;
    }

    const timestamp = formatJstTimestamp();
    item.setLore([{ text: `§r§8${DATE_SIGNATURE_MARKER} §f${timestamp}` }, ...lore]);
    container.setItem(sender.selectedSlotIndex, item);
    sender.sendMessage(`§a手持ちアイテムへ ${timestamp} を刻印しました。`);
}

system.beforeEvents.startup.subscribe((event) => {
    event.customCommandRegistry.registerCommand(
        {
            name: 'makecountry:date',
            description: '手持ちアイテムへ現在の日時（JST）を刻印します',
            permissionLevel: CommandPermissionLevel.Any,
        },
        (origin) => {
            system.runTimeout(() => dateSignExecuter(origin));
            return undefined;
        },
    );
});
