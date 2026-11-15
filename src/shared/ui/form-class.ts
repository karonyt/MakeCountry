import { Player, system } from "@minecraft/server"
import { ActionFormData, ModalFormData, FormCancelationReason } from "@minecraft/server-ui";
import { getChestIconPath } from "@/shared/minecraft/item-presentation.js";

/** Disconnection/native rejection must resolve as cancellation, never undefined. */
export async function showSafeForm(form: any, player: any): Promise<any> {
    const canceled = { canceled: true, cancelationReason: FormCancelationReason.UserClosed };
    if (!player?.isValid) return canceled;
    try {
        // Forms are also requested by before-events (restricted execution).
        // Schedule the native call in writable execution, not just its callback.
        return await new Promise<any>((resolve, reject) => system.run(() => {
            if (!player.isValid) { resolve(canceled); return; }
            try { Promise.resolve(form.show(player)).then(resolve, reject); }
            catch (error) { reject(error); }
        })) ?? canceled;
    } catch (error) {
        if (player.isValid) console.warn(`[form] show failed: ${error instanceof Error ? error.message : String(error)}`);
        return canceled;
    }
}

/**
 * Modal headers, labels and dividers occupy response slots with `undefined`.
 * Strip only those presentation-only entries while preserving valid empty
 * strings, false toggles and zero-valued controls.
 */
export function getInteractiveFormValues(response: any): any[] {
    const values = Array.isArray(response?.formValues)
        ? response.formValues
        : Array.isArray(response)
            ? response
            : [];
    return values.filter((value: any) => value !== undefined && value !== null);
}

export const CLASSIC_FORM_UI_PROPERTY = "useClassicFormUI";

/** Player-owned opt-out from routed JSON UI skins. */
export function usesClassicFormUI(player: any): boolean {
    const value = player?.getDynamicProperty?.(CLASSIC_FORM_UI_PROPERTY);
    return value === true || value === "true";
}

const ROUTING_TOKEN_PATTERN = /(?:§[a-z]){4,}(?:§r)?/gi;

/** Remove invisible title routing tokens while preserving ordinary formatting. */
export function withoutFormRoutingTokens(value: any): any {
    if (typeof value === "string") return value.replace(ROUTING_TOKEN_PATTERN, "");
    if (Array.isArray(value)) return value.map(withoutFormRoutingTokens);
    if (!value || typeof value !== "object") return value;
    const copy: any = { ...value };
    if (typeof copy.text === "string") copy.text = copy.text.replace(ROUTING_TOKEN_PATTERN, "");
    if (Array.isArray(copy.rawtext)) copy.rawtext = copy.rawtext.map(withoutFormRoutingTokens);
    if (Array.isArray(copy.with)) copy.with = copy.with.map(withoutFormRoutingTokens);
    return copy;
}

export class ActionForm {
    form: any;
    private preserveLayout: boolean;
    private titleText: any = "";
    private bodyText: any = undefined;
    private buttons: { text: any; iconPath?: string }[] = [];
    private details: any[] = [];
    private controls: Array<{ kind: "button" | "divider" | "header" | "label"; text?: any; iconPath?: string }> = [];
    private purposeTheme?: PurposeFormTheme;

    constructor(options: { preserveLayout?: boolean; purposeTheme?: PurposeFormTheme } = {}) {
        this.form = new ActionFormData;
        this.preserveLayout = options.preserveLayout ?? false;
        this.purposeTheme = options.purposeTheme;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} bodyText 
     */
    body(bodyText: any) {
        const displayText = this.purposeTheme ? toParchmentText(bodyText) : bodyText;
        this.bodyText = bodyText;
        this.form.body(displayText);
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} text 
     * @param {undefined|string} iconPath 
     */
    button(text: any, iconPath: string | undefined = undefined) {
        const displayText = this.purposeTheme ? toParchmentText(text) : text;
        this.buttons.push({ text, iconPath });
        this.controls.push({ kind: "button", text, iconPath });
        // Bedrock distinguishes an omitted texture argument from an explicitly
        // supplied undefined value. Keep textureless vanilla buttons on their
        // native two-line text layout.
        if (iconPath === undefined) this.form.button(displayText);
        else this.form.button(displayText, iconPath);
        return this;
    }

    divider() {
        this.controls.push({ kind: "divider" });
        this.form.divider();
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} text 
     * @returns 
     */
    header(text: any) {
        const displayText = this.purposeTheme ? toParchmentText(text) : text;
        this.details.push(text);
        this.controls.push({ kind: "header", text });
        this.form.header(displayText);
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} text 
     * @returns 
     */
    label(text: any) {
        const displayText = this.purposeTheme ? toParchmentText(text) : text;
        this.details.push(text);
        this.controls.push({ kind: "label", text });
        this.form.label(displayText);
        return this;
    }

    /**
     * 
     * @param {Player} player 
     * @returns 
     */
    async show(player: any) {
        if (usesClassicFormUI(player)) {
            const classicForm = new ActionFormData();
            classicForm.title(withoutFormRoutingTokens(this.titleText));
            if (this.bodyText !== undefined) classicForm.body(this.bodyText);
            for (const control of this.controls) {
                if (control.kind === "button") {
                    if (control.iconPath === undefined) classicForm.button(control.text);
                    else classicForm.button(control.text, control.iconPath);
                } else if (control.kind === "divider") classicForm.divider();
                else if (control.kind === "header") classicForm.header(control.text);
                else classicForm.label(control.text);
            }
            return showSafeForm(classicForm, player);
        }

        const uiType = player?.getDynamicProperty?.("uiType") ?? "default";
        if (this.preserveLayout || (uiType !== "kingdoms" && uiType !== "towny") || this.buttons.length > 54) {
            return showSafeForm(this.form, player);
        }

        const size = this.buttons.length <= 18 ? 27 : 54;
        const themedForm = new ActionFormData();
        themedForm.title(withChestToken(this.titleText, size));

        const slots = themedSlots(this.buttons.length, size);
        const selectionMap = new Map<number, number>();
        const filler = uiType === "kingdoms"
            ? ["textures/blocks/glass_black", "textures/blocks/glass_red"]
            : ["textures/blocks/glass_gray"];
        const defaultIcons = uiType === "kingdoms"
            ? ["textures/items/book_normal", "textures/items/nether_star", "textures/items/gold_ingot"]
            : ["textures/items/paper", "textures/items/emerald", "textures/items/compass_item"];

        for (let slot = 0; slot < size; slot++) {
            const originalIndex = slots.indexOf(slot);
            if (originalIndex === -1) {
                themedForm.button({ rawtext: [{ text: "stack#01§r" }] }, filler[slot % filler.length]);
                continue;
            }

            const button = this.buttons[originalIndex];
            const icon = button.iconPath
                ? getChestIconPath(button.iconPath)
                : defaultIcons[originalIndex % defaultIcons.length];
            themedForm.button(withChestButtonText(button.text, this.bodyText, this.details), icon);
            selectionMap.set(slot, originalIndex);
        }

        const response = await showSafeForm(themedForm, player);
        if (response.canceled) return response;
        const selection = selectionMap.get(response.selection);
        if (selection === undefined) {
            return { canceled: true, cancelationReason: FormCancelationReason.UserClosed };
        }
        return { ...response, selection };
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} titleText 
     * @returns 
     */
    title(titleText: any) {
        const displayText = this.purposeTheme ? toParchmentText(titleText) : titleText;
        this.titleText = titleText;
        this.form.title(this.purposeTheme ? withPurposeToken(this.purposeTheme, displayText) : displayText);
        return this;
    }
}

function themedSlots(buttonCount: number, size: number) {
    if (size === 27 && buttonCount <= 7) {
        const start = 9 + Math.floor((9 - buttonCount) / 2);
        return Array.from({ length: buttonCount }, (_, index) => start + index);
    }
    if (size === 27) {
        return Array.from({ length: buttonCount }, (_, index) => 9 + index);
    }
    return Array.from({ length: buttonCount }, (_, index) => index);
}

function withChestToken(title: any, size: number) {
    const token = size === 27 ? "§c§h§e§s§t§s§m§a§l§l§r" : "§c§h§e§s§t§l§a§r§g§e§r";
    return { rawtext: [{ text: token }, ...rawMessageParts(title)] };
}

function withChestButtonText(text: any, body: any, details: any[]) {
    const rawtext: any[] = [{ text: "stack#01§r" }, ...rawMessageParts(text)];
    const extra = [body, ...details].filter(value => value !== undefined && value !== null && value !== "");
    for (const value of extra) rawtext.push({ text: "\n§r§7" }, ...rawMessageParts(value));
    return { rawtext };
}

function rawMessageParts(value: any): any[] {
    if (value === undefined || value === null) return [];
    if (typeof value === "string") return [{ text: value }];
    if (Array.isArray(value?.rawtext)) return value.rawtext;
    return [value];
}

export class ModalForm {
    form: any;
    private titleText: any = "";
    private preserveLayout: boolean;
    private purposeTheme?: PurposeFormTheme;
    private controls: Array<
        | { kind: "divider" }
        | { kind: "dropdown"; label: any; options: any[]; config: any }
        | { kind: "header" | "label"; text: any }
        | { kind: "slider"; label: any; minimumValue: number; maximumValue: number; config: any }
        | { kind: "submitButton"; text: any }
        | { kind: "textField"; label: any; placeholderText: any; config: any }
        | { kind: "toggle"; label: any; config: any }
    > = [];

    constructor(options: { preserveLayout?: boolean; purposeTheme?: PurposeFormTheme } = {}) {
        this.form = new ModalFormData();
        this.preserveLayout = options.preserveLayout ?? false;
        this.purposeTheme = options.purposeTheme;
    }

    divider() {
        this.controls.push({ kind: "divider" });
        this.form.divider();
        return this;
    }

    /**
     * 
     * @param {string|import("@minecraft/server").RawMessage} label 
     * @param {Array<string|import("@minecraft/server").RawMessage>} options 
     * @param {number|undefined} defaultValueIndex 
     * @returns 
     */
    dropdown(label: any, options: any, defaultValueIndex: any = undefined) {
        const config = typeof defaultValueIndex === "object" && defaultValueIndex !== null
            ? defaultValueIndex
            : { defaultValueIndex };
        this.controls.push({ kind: "dropdown", label, options, config });
        this.form.dropdown(
            this.purposeTheme ? toParchmentText(label) : label,
            this.purposeTheme ? options.map((option: any) => toParchmentText(option)) : options,
            config,
        );
        return this;
    }

    /**
     * Single-choice data source for JSON UI skins that render the native
     * dropdown collection as an always-visible radio/checkbox group.
     */
    singleSelect(label: any, options: any, defaultValueIndex: any = undefined) {
        return this.dropdown(label, options, defaultValueIndex);
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} text 
     * @returns 
     */
    header(text: any) {
        this.controls.push({ kind: "header", text });
        this.form.header(this.purposeTheme ? toParchmentText(text) : text);
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} text 
     * @returns 
     */
    label(text: any) {
        this.controls.push({ kind: "label", text });
        this.form.label(this.purposeTheme ? toParchmentText(text) : text);
        return this;
    }

    /**
     * 
     * @param {Player} player 
     * @returns 
     */
    show(player: any) {
        if (usesClassicFormUI(player)) {
            const classicForm = new ModalFormData();
            classicForm.title(withoutFormRoutingTokens(this.titleText));
            for (const control of this.controls) {
                switch (control.kind) {
                    case "divider": classicForm.divider(); break;
                    case "dropdown": classicForm.dropdown(control.label, control.options, control.config); break;
                    case "header": classicForm.header(control.text); break;
                    case "label": classicForm.label(control.text); break;
                    case "slider": classicForm.slider(control.label, control.minimumValue, control.maximumValue, control.config); break;
                    case "submitButton": classicForm.submitButton(control.text); break;
                    case "textField": classicForm.textField(control.label, control.placeholderText, control.config); break;
                    case "toggle": classicForm.toggle(control.label, control.config); break;
                }
            }
            return showSafeForm(classicForm, player);
        }

        const uiType = player?.getDynamicProperty?.("uiType") ?? "default";
        if (!this.preserveLayout && (uiType === "kingdoms" || uiType === "towny")) {
            this.form.title(withModalToken(this.titleText, uiType));
        }
        return showSafeForm(this.form, player);
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} label 
     * @param {number} minimumValue 
     * @param {number} maximumValue 
     * @param {number} valueStep 
     * @param {number|undefined} defaultValue 
     * @returns 
     */
    slider(label: any, minimumValue: any, maximumValue: any, valueStep: any, defaultValue: any = undefined) {
        const config = typeof valueStep === "object" && valueStep !== null
            ? valueStep
            : { valueStep, defaultValue };
        this.controls.push({ kind: "slider", label, minimumValue, maximumValue, config });
        this.form.slider(this.purposeTheme ? toParchmentText(label) : label, minimumValue, maximumValue, config);
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} submitButtonText 
     * @returns 
     */
    submitButton(submitButtonText: any) {
        this.controls.push({ kind: "submitButton", text: submitButtonText });
        this.form.submitButton(this.purposeTheme ? toParchmentText(submitButtonText) : submitButtonText);
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} label 
     * @param {import("@minecraft/server").RawMessage|string} placeholderText 
     * @param {import("@minecraft/server").RawMessage|string|undefined} defaultValue 
     * @returns 
     */
    textField(label: any, placeholderText: any, defaultValue: any = undefined) {
        const config = typeof defaultValue === "object" && defaultValue !== null
            ? defaultValue
            : { defaultValue };
        this.controls.push({ kind: "textField", label, placeholderText, config });
        this.form.textField(
            this.purposeTheme ? toParchmentText(label) : label,
            this.purposeTheme ? toParchmentText(placeholderText) : placeholderText,
            config,
        );
        return this;
    }

    /**
     * @param {import("@minecraft/server").RawMessage|string} titleText 
     * @returns 
     */
    title(titleText: any) {
        const displayText = this.purposeTheme ? toParchmentText(titleText) : titleText;
        this.titleText = titleText;
        this.form.title(this.purposeTheme ? withPurposeToken(this.purposeTheme, displayText) : displayText);
        return this;
    }

    /**
     * 
     * @param {import("@minecraft/server").RawMessage|string} label 
     * @param {boolean} defaultValue 
     * @returns 
     */
    toggle(label: any, defaultValue: any = undefined) {
        const config = typeof defaultValue === "object" && defaultValue !== null
            ? defaultValue
            : { defaultValue };
        this.controls.push({ kind: "toggle", label, config });
        this.form.toggle(this.purposeTheme ? toParchmentText(label) : label, config);
        return this;
    }
}

function withModalToken(title: any, uiType: "kingdoms" | "towny") {
    const token = uiType === "kingdoms" ? "§k§i§n§g§d§o§m§s" : "§t§o§w§n§y";
    return { rawtext: [{ text: token }, ...rawMessageParts(title)] };
}

export type PurposeFormTheme =
    | "country" | "plot" | "commerce" | "jobs" | "social" | "crafting"
    | "music" | "storage" | "security" | "network" | "vote"
    | "player_market" | "admin_shop";

const PURPOSE_FORM_TOKENS: Record<PurposeFormTheme, string> = {
    country: "§u§i§c§o§u§n§t§r§y",
    plot: "§u§i§p§l§o§t",
    commerce: "§u§i§c§o§m§m§e§r§c§e",
    jobs: "§u§i§j§o§b§s",
    social: "§u§i§s§o§c§i§a§l",
    crafting: "§u§i§c§r§a§f§t§i§n§g",
    music: "§u§i§m§u§s§i§c",
    storage: "§u§i§s§t§o§r§a§g§e",
    security: "§u§i§s§e§c§u§r§i§t§y",
    network: "§u§i§n§e§t§w§o§r§k",
    vote: "§u§i§v§o§t§e",
    player_market: "§u§i§p§l§a§y§e§r§m§a§r§k§e§t",
    admin_shop: "§u§i§a§d§m§i§n§s§h§o§p",
};

export function withPurposeToken(theme: PurposeFormTheme, title: any) {
    return { rawtext: [{ text: PURPOSE_FORM_TOKENS[theme] }, ...rawMessageParts(title)] };
}

const PARCHMENT_COLOR_MAP: Record<string, string> = {
    "§f": "§0", "§7": "§8", "§b": "§3", "§a": "§2", "§e": "§6",
    "§d": "§5", "§c": "§4", "§9": "§1", "§g": "§6",
};

function remapParchmentColors(text: string): string {
    return text
        .replace(/§r/gi, "§r§0")
        .replace(/§[f7baedc9g]/gi, (code) => PARCHMENT_COLOR_MAP[code.toLowerCase()] ?? code);
}

function remapRawMessagePart(value: any): any {
    if (typeof value === "string") return remapParchmentColors(value);
    if (Array.isArray(value)) return value.map(remapRawMessagePart);
    if (!value || typeof value !== "object") return value;
    const copy: any = { ...value };
    if (typeof copy.text === "string") copy.text = remapParchmentColors(copy.text);
    if (Array.isArray(copy.rawtext)) copy.rawtext = copy.rawtext.map(remapRawMessagePart);
    if (Array.isArray(copy.with)) copy.with = copy.with.map(remapRawMessagePart);
    return copy;
}

/** Forces readable, dark semantic colors on parchment-style server forms. */
export function toParchmentText(value: any): any {
    if (typeof value === "string") return `§0${remapParchmentColors(value)}`;
    if (Array.isArray(value?.rawtext)) {
        return { ...value, rawtext: [{ text: "§0" }, ...value.rawtext.map(remapRawMessagePart)] };
    }
    return { rawtext: [{ text: "§0" }, remapRawMessagePart(value)] };
}
