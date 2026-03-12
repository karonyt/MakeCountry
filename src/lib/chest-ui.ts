import { ActionFormResponse } from "@minecraft/server-ui";
import { ActionForm, } from "./form_class.js";
const ActionFormData = ActionForm;
import { typeIdToID } from "./typeIds.js";
import { langChangeItemName } from "./util.js";

const sizes = new Map([
    ["single", 27],
    ["double", 54],
    ["small", 27],
    ["large", 54]
]);
export class ChestFormData {
    /** @type {ActionFormData} */
    #formData

    /** @type {{ text: string, icon: string|number }[]} */
    #buttons

    /** @type {string} */
    #type

    /** @param {("single"|"double"|"small"|"large")} size */
    constructor(size = "large") {
        this.#formData = new ActionFormData();
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
            if (typeof title == 'string') {
                this.#formData.title({ rawtext: [{ text: this.#type }, { translate: title }] });
            } else {

                this.#formData.title({ rawtext: [{ text: this.#type }].concat(title) });
            };
            return this;
        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
        }
    }

    /**
     * 
     * @param {number} slot 
     * @param {{ iconPath: string|number, name: string|import("@minecraft/server").RawMessage[], stackAmount?: number, lore?: string[]|import("@minecraft/server").RawMessage[], editedName?: boolean, isGlint?: boolean }} itemData
     * @returns {ChestFormData}
     */
    setButton(slot: any, itemData: any) {
        try {
            const item = itemData;
            const id = typeof item?.iconPath === "number" ? item.iconPath : typeIdToID.get(item.iconPath);
            if (!item?.editedName) {
                item.name = langChangeItemName(item.name);
            };
            const text = {
                rawtext: [
                    { text: `stack#${Math.min(Math.max(item.stackAmount, 1) || 1, 64).toString().padStart(2, "0")}§r` },
                ]
            };

            // @ts-ignore TS(2345): Argument of type '{ translate: string; }' is not a... Remove this comment to see the full error message
            typeof item.name == 'string' ? text.rawtext.push({ translate: `${item.name}` }, { text: `§r` }) : text.rawtext.push(...item.name);

            // lore のフォーマット処理
            const formattedLore = item.lore?.length > 0
                ? typeof item.lore[0] == 'string' ? item.lore.flatMap((l: any) => [
                    { text: "\n§r" },
                    { translate: `${l}` }
                ]) : [{ text: "\n§r" }].concat(item.lore)
                : [];

            // formattedLore を rawtext に追加
            text.rawtext.push(...formattedLore);
            const texture = (id * 65536 + (item.isGlint ? 32768 : 0)) || item.iconPath;

            this.#buttons.splice(slot, 1, { text: text, icon: String(texture) });
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
            for (let button of this.#buttons) this.#formData.button(button.text, button.icon);
            return this.#formData.show(player);
        } catch (e) {
            // @ts-ignore TS(2571): Object is of type 'unknown'.
            console.error(e, e.stack);
        }
    }
}
