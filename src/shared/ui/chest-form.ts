import { ActionFormData, ActionFormResponse, FormCancelationReason } from "@minecraft/server-ui";
import { showSafeForm, usesClassicFormUI, withoutFormRoutingTokens } from "@/shared/ui/form-class.js";
import { resolveChestIconPath } from "@/shared/minecraft/item-presentation.js";
import { typeIdToID } from "@/shared/minecraft/type-ids.js";
import { langChangeItemName } from "@/shared/utils/minecraft.js";

const sizes = new Map([
    ["single", 27],
    ["double", 54],
    ["small", 27],
    ["large", 54]
]);

const iconPresentationCache = new Map<string, string|number>();
const itemNameCache = new Map<string, string>();

type PreparedChestButton = { text: any; icon: string };

function cachedChestIconPath(iconPath: any, name?: any) {
    if (typeof iconPath !== "string") return resolveChestIconPath(iconPath, name);
    const cached = iconPresentationCache.get(iconPath);
    if (cached !== undefined) return cached;
    const resolved = resolveChestIconPath(iconPath, name);
    iconPresentationCache.set(iconPath, resolved);
    return resolved;
}

function cachedItemName(name: any) {
    if (typeof name !== "string") return name;
    const cached = itemNameCache.get(name);
    if (cached !== undefined) return cached;
    const translated = langChangeItemName(name);
    itemNameCache.set(name, translated);
    return translated;
}

function prepareChestButton(itemData: any, loreLineBreaks = false): PreparedChestButton {
    const item = itemData;
    const iconPath = cachedChestIconPath(item?.iconPath, item?.name);
    const id = typeof iconPath === "number"
        ? iconPath
        : typeIdToID.get(item?.iconPath) ?? typeIdToID.get(iconPath);
    const name = item?.editedName ? item.name : cachedItemName(item.name);
    const text: any = {
        rawtext: [
            { text: `stack#${Math.min(Math.max(item.stackAmount, 1) || 1, 64).toString().padStart(2, "0")}§r` },
        ]
    };

    typeof name === "string"
        ? text.rawtext.push({ translate: name }, { text: `§r` })
        : text.rawtext.push(...name);

    const formattedLore = item.lore?.length > 0
        ? typeof item.lore[0] === "string" ? item.lore.flatMap((line: any) => [
            { text: "\n§r" },
            { translate: `${line}` }
        ]) : loreLineBreaks
            ? item.lore.reduce((formatted: any[], loreLine: any, index: number) => {
                if (index > 0) {
                    const previousLine = item.lore[index - 1];
                    const previousParts = Array.isArray(previousLine?.rawtext)
                        ? previousLine.rawtext
                        : [previousLine];
                    const lastPart = previousParts[previousParts.length - 1];
                    const alreadySeparated = typeof lastPart?.text === "string"
                        && /\n(?:§[0-9a-fk-or])*$/i.test(lastPart.text);
                    if (!alreadySeparated) formatted.push({ text: "\n§r" });
                }
                formatted.push(loreLine);
                return formatted;
            }, [{ text: "\n§r" }])
            : [{ text: "\n§r" }].concat(item.lore)
        : [];

    text.rawtext.push(...formattedLore);
    const texture = id !== undefined ? id * 65536 + (item.isGlint ? 32768 : 0) : iconPath;
    return { text, icon: String(texture) };
}

export class ChestFormData {
    /** @type {{ text: string, icon: string|number }[]} */
    #buttons

    /** @type {string} */
    #type

    /** @type {boolean} */
    #loreLineBreaks = false

    /** @type {boolean} */
    #trimTrailingEmpty = false

    /** @type {string|Array<import("@minecraft/server").RawText>} */
    #title: any = ""

    /** @param {("single"|"double"|"small"|"large")} size */
    constructor(size = "large") {
        this.#buttons = new Array(sizes.get(size)).fill({ text: "", icon: undefined });
        this.#type =
            ["small", "single"].includes(size) ? "§c§h§e§s§t§s§m§a§l§l§r" :
                ["double", "large"].includes(size) ? "§c§h§e§s§t§l§a§r§g§e§r" : "";
    }

    /**
     * 
     * @param {string|Array<import("@minecraft/server").RawText>} title 
     * @returns {ChestFormData}
     */
    setTitle(title: any) {
        try {
            this.#title = title;
            return this;
        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
        }
    }

    enableLoreLineBreaks() {
        this.#loreLineBreaks = true;
        return this;
    }

    trimTrailingEmptySlots() {
        this.#trimTrailingEmpty = true;
        return this;
    }

    static prepareButton(itemData: any, loreLineBreaks = false): PreparedChestButton {
        return prepareChestButton(itemData, loreLineBreaks);
    }

    setPreparedButton(slot: number, button: PreparedChestButton) {
        this.#buttons.splice(slot, 1, button);
        return this;
    }

    setPreparedButtons(startSlot: number, buttons: PreparedChestButton[]) {
        this.#buttons.splice(startSlot, buttons.length, ...buttons);
        return this;
    }

    /**
     * 
     * @param {number} slot 
     * @param {{ iconPath: string|number, name: string|import("@minecraft/server").RawMessage[], stackAmount?: number, lore?: string[]|import("@minecraft/server").RawMessage[], editedName?: boolean, isGlint?: boolean }} itemData
     * @returns {ChestFormData}
     */
    setButton(slot: any, itemData: any) {
        try {
            this.#buttons.splice(slot, 1, prepareChestButton(itemData, this.#loreLineBreaks));
            return this;
        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
        }
    }

    /**
     * @param {{ slot: number, itemData: { iconPath: string, name: string, stackAmount: number, lore: string[], isGlint: boolean } }[]} buttons
     * @returns {ChestFormData}
     */
    setButtons(buttons: any) {
        try {
            for (let { slot, itemData } of buttons) this.setButton(slot, itemData);
            return this;
        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
        }
    }

    /**
     * 
     * @param {[ height: number, width: number ]} from 
     * @param {string[]} pattern 
     * @param {{ slot: number, itemData: { iconPath: string, name: string, stackAmount: number, lore: string[], isGlint: boolean }}} key - { key: { data: { name: string, lore: string[], stackAmount: number, isGlint: boolean }, iconPath: string } } 
     * @returns {ChestFormData}
     */
    setPattern(from: any, pattern: any, key: any) {
        try {
            pattern.forEach((row: any, i: any) => {
                [...row].forEach((letter, j) => {
                    const data = key[letter];
                    if (data) {
                        const slot = (from[1] + j) + ((from[0] + i) * 9);
                        this.setButton(slot, data);
                    }
                });
            });
            return this;


        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
        }
    }

    /**
     * 
     * @param {Player} player 
     * @returns {Promise<ActionFormResponse>}
     */
    async show(player: any) {
        try {
            const formData = new ActionFormData();
            const titleParts = typeof this.#title === "string"
                ? [{ translate: this.#title }]
                : Array.isArray(this.#title)
                    ? this.#title
                    : [this.#title];
            const visibleTitleParts = usesClassicFormUI(player)
                ? withoutFormRoutingTokens(titleParts).filter((part: any) => part?.text !== "")
                : titleParts;
            formData.title({ rawtext: [{ text: this.#type }].concat(visibleTitleParts) });

            let buttons = this.#buttons;
            if (this.#trimTrailingEmpty) {
                let lastUsed = buttons.length - 1;
                while (lastUsed >= 0 && buttons[lastUsed].text === "" && buttons[lastUsed].icon === undefined) lastUsed--;
                buttons = buttons.slice(0, lastUsed + 1);
            }
            for (let button of buttons) {
                if (button.icon === undefined) formData.button(button.text);
                else formData.button(button.text, button.icon);
            }
            return await showSafeForm(formData, player);
        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
            return { canceled: true, cancelationReason: FormCancelationReason.UserClosed };
        }
    }
}
