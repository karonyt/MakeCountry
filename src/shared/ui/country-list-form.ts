import { CountryActionForm } from "@/shared/ui/purpose-forms.js";

export const COUNTRY_LIST_PAGE_SIZE = 15;

/** Keep the leading menu action visible and send only one page to Bedrock. */
export class CountryListForm {
    private listTitle: any = "";
    private listBody: any;
    private entries: Array<{ text: any; iconPath?: string }> = [];

    constructor(private readonly options: { page?: number } = {}) {}

    title(text: any) { this.listTitle = text; return this; }
    body(text: any) { this.listBody = text; return this; }
    button(text: any, iconPath?: string) {
        this.entries.push({ text, iconPath });
        return this;
    }

    async show(player: any): Promise<any> {
        const pinnedCount = Math.min(1, this.entries.length);
        const pageCount = Math.max(1, Math.ceil((this.entries.length - pinnedCount) / COUNTRY_LIST_PAGE_SIZE));
        const requestedPage = this.options.page ?? 0;
        let page = Number.isFinite(requestedPage)
            ? Math.min(pageCount - 1, Math.max(0, Math.floor(requestedPage))) : 0;

        while (true) {
            const form = new CountryActionForm().title(this.listTitle);
            const rawtext: any[] = [];
            if (this.listBody !== undefined) {
                rawtext.push(typeof this.listBody === "string" ? { text: this.listBody } : this.listBody);
            }
            if (pageCount > 1) rawtext.push({ text: `${rawtext.length ? "\n" : ""}${page + 1} / ${pageCount}` });
            if (rawtext.length) form.body({ rawtext });

            // Map visible indices back to the caller's original country list.
            const selectionMap: number[] = [];
            const addEntry = (index: number) => {
                const entry = this.entries[index];
                form.button(entry.text, entry.iconPath);
                selectionMap.push(index);
            };
            if (pinnedCount) addEntry(0);
            const start = pinnedCount + page * COUNTRY_LIST_PAGE_SIZE;
            const end = Math.min(start + COUNTRY_LIST_PAGE_SIZE, this.entries.length);
            for (let index = start; index < end; index++) addEntry(index);
            const previousIndex = page > 0 ? selectionMap.length : -1;
            if (page > 0) {
                form.button({ translate: "smelting.page.prev" });
                selectionMap.push(-1);
            }
            const nextIndex = page + 1 < pageCount ? selectionMap.length : -1;
            if (page + 1 < pageCount) {
                form.button({ translate: "smelting.page.next" });
                selectionMap.push(-1);
            }

            const response = await form.show(player);
            if (response.canceled || response.selection === undefined) return { ...response, canceled: true, page };
            if (previousIndex >= 0 && response.selection === previousIndex) { page--; continue; }
            if (nextIndex >= 0 && response.selection === nextIndex) { page++; continue; }
            const selection = selectionMap[response.selection];
            if (selection === undefined || selection < 0) return { ...response, canceled: true, page };
            return { ...response, selection, page };
        }
    }
}
