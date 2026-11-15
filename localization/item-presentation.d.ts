/** RawMessage structure, independent of a particular pack's beta API dependency. */
interface Message {
    text?: string;
    translate?: string;
    rawtext?: Message[];
    with?: string[] | Message;
}
export function normalizeTradePresentation(item: {
    typeId: string;
    name?: string;
    lore?: readonly unknown[];
}): {name: string | undefined; lore: unknown[]};
export function localizeLegacyEquipmentLore(typeId: string, lines: readonly (string | Message)[]): (string | Message)[] | undefined;
