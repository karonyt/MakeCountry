import {
    ActionFormData as NativeActionFormData,
    MessageFormData as NativeMessageFormData,
    ModalFormData as NativeModalFormData,
} from "@minecraft/server-ui";
import {
    ActionForm,
    ModalForm,
    type PurposeFormTheme,
    showSafeForm,
    toParchmentText,
    usesClassicFormUI,
    withPurposeToken,
    withoutFormRoutingTokens,
} from "./form-class.js";

abstract class PurposeActionFormData extends NativeActionFormData {
    private titleText: any = "";
    private bodyText: any = undefined;
    private controls: Array<{ kind: "button" | "divider" | "header" | "label"; text?: any; iconPath?: string }> = [];

    constructor(private readonly purposeTheme?: PurposeFormTheme) { super(); }
    title(titleText: any): this {
        this.titleText = titleText;
        return this;
    }
    body(bodyText: any): this {
        this.bodyText = bodyText;
        return this;
    }
    button(text: any, iconPath?: string): this {
        this.controls.push({ kind: "button", text, iconPath });
        return this;
    }
    divider(): this {
        this.controls.push({ kind: "divider" });
        return this;
    }
    header(text: any): this {
        this.controls.push({ kind: "header", text });
        return this;
    }
    label(text: any): this {
        this.controls.push({ kind: "label", text });
        return this;
    }
    async show(player: any): Promise<any> {
        const classic = usesClassicFormUI(player);
        const form = new NativeActionFormData();
        const title = classic
            ? withoutFormRoutingTokens(this.titleText)
            : this.purposeTheme
                ? withPurposeToken(this.purposeTheme, toParchmentText(this.titleText))
                : this.titleText;
        form.title(title);
        if (this.bodyText !== undefined) form.body(classic ? this.bodyText : toParchmentText(this.bodyText));
        for (const control of this.controls) {
            const text = classic ? control.text : toParchmentText(control.text);
            if (control.kind === "button") {
                if (control.iconPath === undefined) form.button(text);
                else form.button(text, control.iconPath);
            } else if (control.kind === "divider") form.divider();
            else if (control.kind === "header") form.header(text);
            else form.label(text);
        }
        return showSafeForm(form, player);
    }
}

abstract class PurposeModalFormData extends NativeModalFormData {
    private titleText: any = "";
    private controls: Array<any> = [];

    constructor(private readonly purposeTheme?: PurposeFormTheme) { super(); }
    title(titleText: any): this {
        this.titleText = titleText;
        return this;
    }
    dropdown(label: any, options: any[], config?: any): this {
        this.controls.push({ kind: "dropdown", label, options, config });
        return this;
    }
    divider(): this {
        this.controls.push({ kind: "divider" });
        return this;
    }
    header(text: any): this {
        this.controls.push({ kind: "header", text });
        return this;
    }
    label(text: any): this {
        this.controls.push({ kind: "label", text });
        return this;
    }
    slider(label: any, minimumValue: number, maximumValue: number, config?: any): this {
        this.controls.push({ kind: "slider", label, minimumValue, maximumValue, config });
        return this;
    }
    submitButton(text: any): this {
        this.controls.push({ kind: "submitButton", text });
        return this;
    }
    textField(label: any, placeholderText: any, config?: any): this {
        this.controls.push({ kind: "textField", label, placeholderText, config });
        return this;
    }
    toggle(label: any, config?: any): this {
        this.controls.push({ kind: "toggle", label, config });
        return this;
    }
    async show(player: any): Promise<any> {
        const classic = usesClassicFormUI(player);
        const form = new NativeModalFormData();
        const text = (value: any) => classic ? value : toParchmentText(value);
        form.title(classic
            ? withoutFormRoutingTokens(this.titleText)
            : this.purposeTheme
                ? withPurposeToken(this.purposeTheme, toParchmentText(this.titleText))
                : this.titleText);
        for (const control of this.controls) {
            switch (control.kind) {
                case "divider": form.divider(); break;
                case "dropdown": form.dropdown(text(control.label), control.options.map(text), control.config); break;
                case "header": form.header(text(control.text)); break;
                case "label": form.label(text(control.text)); break;
                case "slider": form.slider(text(control.label), control.minimumValue, control.maximumValue, control.config); break;
                case "submitButton": form.submitButton(text(control.text)); break;
                case "textField": form.textField(text(control.label), text(control.placeholderText), control.config); break;
                case "toggle": form.toggle(text(control.label), control.config); break;
            }
        }
        return showSafeForm(form, player);
    }
}

abstract class PurposeMessageFormData extends NativeMessageFormData {
    private titleText: any = "";
    private bodyText: any = undefined;
    private firstButton: any = undefined;
    private secondButton: any = undefined;

    constructor(private readonly purposeTheme: PurposeFormTheme) { super(); }
    title(titleText: any): this {
        this.titleText = titleText;
        return this;
    }
    body(bodyText: any): this {
        this.bodyText = bodyText;
        return this;
    }
    button1(text: any): this {
        this.firstButton = text;
        return this;
    }
    button2(text: any): this {
        this.secondButton = text;
        return this;
    }
    async show(player: any): Promise<any> {
        const classic = usesClassicFormUI(player);
        const form = new NativeMessageFormData();
        form.title(classic
            ? withoutFormRoutingTokens(this.titleText)
            : withPurposeToken(this.purposeTheme, toParchmentText(this.titleText)));
        if (this.bodyText !== undefined) form.body(classic ? this.bodyText : toParchmentText(this.bodyText));
        if (this.firstButton !== undefined) form.button1(classic ? this.firstButton : toParchmentText(this.firstButton));
        if (this.secondButton !== undefined) form.button2(classic ? this.secondButton : toParchmentText(this.secondButton));
        return showSafeForm(form, player);
    }
}

export class CountryActionFormData extends PurposeActionFormData { constructor() { super("country"); } }
export class CountryModalFormData extends PurposeModalFormData { constructor() { super("country"); } }
export class CountryActionForm extends ActionForm { constructor() { super({ purposeTheme: "country", preserveLayout: true }); } }
export class CountryModalForm extends ModalForm { constructor() { super({ purposeTheme: "country", preserveLayout: true }); } }

export class PlotActionFormData extends PurposeActionFormData { constructor() { super("plot"); } }
export class PlotModalFormData extends PurposeModalFormData { constructor() { super("plot"); } }
export class PlotActionForm extends ActionForm { constructor() { super({ purposeTheme: "plot", preserveLayout: true }); } }
export class PlotModalForm extends ModalForm { constructor() { super({ purposeTheme: "plot", preserveLayout: true }); } }

export class CommerceActionFormData extends PurposeActionFormData { constructor() { super("commerce"); } }
export class CommerceModalFormData extends PurposeModalFormData { constructor() { super("commerce"); } }
export class CommerceActionForm extends ActionForm { constructor() { super({ purposeTheme: "commerce", preserveLayout: true }); } }
export class CommerceModalForm extends ModalForm { constructor() { super({ purposeTheme: "commerce", preserveLayout: true }); } }

export class PlayerMarketActionFormData extends PurposeActionFormData { constructor() { super("player_market"); } }
export class PlayerMarketModalFormData extends PurposeModalFormData { constructor() { super("player_market"); } }
export class PlayerMarketActionForm extends ActionForm { constructor() { super({ purposeTheme: "player_market", preserveLayout: true }); } }
export class PlayerMarketModalForm extends ModalForm { constructor() { super({ purposeTheme: "player_market", preserveLayout: true }); } }

export class AdminShopActionFormData extends PurposeActionFormData { constructor() { super("admin_shop"); } }
export class AdminShopModalFormData extends PurposeModalFormData { constructor() { super("admin_shop"); } }
export class AdminShopActionForm extends ActionForm { constructor() { super({ purposeTheme: "admin_shop", preserveLayout: true }); } }
export class AdminShopModalForm extends ModalForm { constructor() { super({ purposeTheme: "admin_shop", preserveLayout: true }); } }

export class JobsActionFormData extends PurposeActionFormData { constructor() { super("jobs"); } }
export class JobsModalFormData extends PurposeModalFormData { constructor() { super("jobs"); } }
export class JobsActionForm extends ActionForm { constructor() { super({ purposeTheme: "jobs", preserveLayout: true }); } }
export class JobsModalForm extends ModalForm { constructor() { super({ purposeTheme: "jobs", preserveLayout: true }); } }

export class SocialActionFormData extends PurposeActionFormData { constructor() { super("social"); } }
export class SocialModalFormData extends PurposeModalFormData { constructor() { super("social"); } }
export class SocialMessageFormData extends PurposeMessageFormData { constructor() { super("social"); } }
export class SocialActionForm extends ActionForm { constructor() { super({ purposeTheme: "social", preserveLayout: true }); } }
export class SocialModalForm extends ModalForm { constructor() { super({ purposeTheme: "social", preserveLayout: true }); } }

export class CraftingActionFormData extends PurposeActionFormData { constructor() { super("crafting"); } }
export class CraftingModalFormData extends PurposeModalFormData { constructor() { super("crafting"); } }
export class CraftingActionForm extends ActionForm { constructor() { super({ purposeTheme: "crafting", preserveLayout: true }); } }
export class CraftingModalForm extends ModalForm { constructor() { super({ purposeTheme: "crafting", preserveLayout: true }); } }

export class MusicActionFormData extends PurposeActionFormData { constructor() { super("music"); } }
export class MusicModalFormData extends PurposeModalFormData { constructor() { super("music"); } }
export class MusicActionForm extends ActionForm { constructor() { super({ purposeTheme: "music", preserveLayout: true }); } }
export class MusicModalForm extends ModalForm { constructor() { super({ purposeTheme: "music", preserveLayout: true }); } }

export class StorageActionFormData extends PurposeActionFormData { constructor() { super("storage"); } }
export class StorageModalFormData extends PurposeModalFormData { constructor() { super("storage"); } }
export class StorageActionForm extends ActionForm { constructor() { super({ purposeTheme: "storage", preserveLayout: true }); } }
export class StorageModalForm extends ModalForm { constructor() { super({ purposeTheme: "storage", preserveLayout: true }); } }

export class SecurityActionFormData extends PurposeActionFormData { constructor() { super("security"); } }
export class SecurityModalFormData extends PurposeModalFormData { constructor() { super("security"); } }
export class SecurityActionForm extends ActionForm { constructor() { super({ purposeTheme: "security", preserveLayout: true }); } }
export class SecurityModalForm extends ModalForm { constructor() { super({ purposeTheme: "security", preserveLayout: true }); } }

export class NetworkActionFormData extends PurposeActionFormData { constructor() { super("network"); } }
export class NetworkModalFormData extends PurposeModalFormData { constructor() { super("network"); } }
export class NetworkMessageFormData extends PurposeMessageFormData { constructor() { super("network"); } }
export class NetworkActionForm extends ActionForm { constructor() { super({ purposeTheme: "network", preserveLayout: true }); } }
export class NetworkModalForm extends ModalForm { constructor() { super({ purposeTheme: "network", preserveLayout: true }); } }

export class VoteActionFormData extends PurposeActionFormData { constructor() { super("vote"); } }
export class VoteModalFormData extends PurposeModalFormData { constructor() { super("vote"); } }
export class VoteActionForm extends ActionForm { constructor() { super({ purposeTheme: "vote", preserveLayout: true }); } }
export class VoteModalForm extends ModalForm { constructor() { super({ purposeTheme: "vote", preserveLayout: true }); } }

// Enterprise already owns a long-standing route token in its title. These
// classes keep that token untouched while applying parchment-safe content text.
export class EnterpriseActionFormData extends PurposeActionFormData { constructor() { super(); } }
export class EnterpriseModalFormData extends PurposeModalFormData { constructor() { super(); } }
