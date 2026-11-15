import { CountryActionForm as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { transferCountry, transferGroups, listLandTransfers, findLandTransfer, sendLandTransfer, closeLandTransfer,
    receiveLandTransfer, transferMessage as t, transferEligibleAt, reportTransferError, LAND_TRANSFER_FEE,
    type LandTransferRequest } from "@/domain/country/land-transfer.js";

export function transferDate(timestamp: number): string {
    return new Date(timestamp + 9 * 3_600_000).toISOString().slice(0, 16).replace("T", " ") + " JST";
}
function detail(request: LandTransferRequest) {
    return t("details", [request.id, request.sourceName, request.targetName, request.groupName, String(request.chunks.length),
        String(request.chunks.length * LAND_TRANSFER_FEE), transferDate(request.eligibleAt),
        request.chunks.map(key => key.replace(/^chunk_/, "").replace(/_overworld$/, "").replace("_", ", ")).join("; ")]);
}

async function pick(player: any, title: any, choices: any[]): Promise<any | undefined> {
    const pageSize = 18;
    let page = 0;
    while (true) {
        const start = page * pageSize, visible = choices.slice(start, start + pageSize);
        const form = new ActionFormData().title(title).body(`${page + 1} / ${Math.ceil(choices.length / pageSize)}`);
        for (const choice of visible) form.button(`${choice.name} (#${choice.id})`);
        const previous = page > 0 ? visible.length : -1;
        if (previous >= 0) form.button({ translate: "backpack.button.before" });
        const next = start + pageSize < choices.length ? visible.length + (previous >= 0 ? 1 : 0) : -1;
        if (next >= 0) form.button({ translate: "smelting.page.next" });
        const response = await form.show(player);
        if (response.canceled) return undefined;
        if (response.selection === previous) { page--; continue; }
        if (response.selection === next) { page++; continue; }
        return visible[response.selection];
    }
}

export async function confirmLandTransferSend(player: any, group: string, targetId: number): Promise<void> {
    try {
        const source = transferCountry(player);
        const selected = transferGroups(player).filter(g => group === `#${g.id}` || group === g.name);
        const rawTarget = new DynamicProperties("country").get(`country_${targetId}`);
        if (selected.length !== 1 || !rawTarget) { player.sendMessage(t("error.group")); return; }
        const target = JSON.parse(rawTarget);
        const chunkDB = new DynamicProperties("chunk");
        const ids = source.territories.filter((key: string) => String(JSON.parse(chunkDB.get(key) ?? "null")?.plot?.group) === String(selected[0].id)).sort();
        const preview: LandTransferRequest = { id: "-", sourceId: source.id, targetId, groupId: Number(selected[0].id), sourceOwner: source.owner,
            targetOwner: target.owner, sourceName: source.name, targetName: target.name, groupName: selected[0].name,
            chunks: ids, createdAt: Date.now(), eligibleAt: transferEligibleAt(Date.now()), state: "pending" };
        const form = new ActionFormData().title(t("send")).body({ rawtext: [detail(preview), { text: "\n\n" }, t("policy")] })
            .button({ translate: "mc.button.close" }).button(t("send"));
        const response = await form.show(player);
        if (response.canceled || response.selection !== 1) return;
        // Country and selection must still match the exact confirmation screen.
        if (transferCountry(player).id !== source.id) { player.sendMessage(t("error.changed")); return; }
        const currentIds = transferCountry(player).territories.filter((key: string) => String(JSON.parse(chunkDB.get(key) ?? "null")?.plot?.group) === String(selected[0].id)).sort();
        const freshTarget = JSON.parse(new DynamicProperties("country").get(`country_${targetId}`) ?? "null");
        if (JSON.stringify(currentIds) !== JSON.stringify(ids) || String(freshTarget?.owner) !== String(target.owner)
            || transferEligibleAt(Date.now()) !== preview.eligibleAt) { player.sendMessage(t("error.changed")); return; }
        const request = sendLandTransfer(player, `#${selected[0].id}`, targetId);
        player.sendMessage(t("sent", [request.id, transferDate(request.eligibleAt)]));
    } catch (error) { reportTransferError(player, error); }
}

export async function showLandTransferRequest(player: any, id: string): Promise<void> {
    try {
        const own = transferCountry(player), request = findLandTransfer(player, id);
        const source = own.id === request.sourceId;
        const form = new ActionFormData().title(t("title")).body({ rawtext: [detail(request), { text: "\n\n" }, t("policy")] })
            .button({ translate: "mc.button.close" });
        if (source) form.button(t("cancel"));
        else { form.button(t("accept")); form.button(t("reject")); }
        const response = await form.show(player);
        if (response.canceled || !response.selection) return;
        if (transferCountry(player).id !== own.id) { player.sendMessage(t("error.changed")); return; }
        if (!source && response.selection === 1) { receiveLandTransfer(player, id); return; }
        closeLandTransfer(player, id, source ? "cancelled" : "rejected");
        player.sendMessage(t(source ? "cancelled" : "rejected", [id]));
    } catch (error) { reportTransferError(player, error); }
}

export async function landTransferForm(player: any): Promise<void> {
    try {
        const country = transferCountry(player), pending = listLandTransfers(player);
        const form = new ActionFormData().title(t("title")).body(t("policy")).button(t("send"));
        for (const request of pending) form.button({ rawtext: [t(country.id === request.sourceId ? "outgoing" : "incoming"),
            { text: ` ${request.groupName} (${request.chunks.length})\n${request.sourceName} → ${request.targetName}` }] });
        const response = await form.show(player);
        if (response.canceled) return;
        if (transferCountry(player).id !== country.id) { player.sendMessage(t("error.changed")); return; }
        if (response.selection > 0) { const selected = pending[response.selection - 1]; if (selected) await showLandTransferRequest(player, selected.id); return; }
        if (response.selection !== 0) return;
        const groups = transferGroups(player);
        const countries = new DynamicProperties("country").idList.map(key => JSON.parse(new DynamicProperties("country").get(key) ?? "null"))
            .filter(c => c && c.id !== country.id).sort((a, b) => a.id - b.id);
        if (!groups.length || !countries.length) { player.sendMessage(t("error.group")); return; }
        const group = await pick(player, t("group"), groups);
        if (!group) return;
        const target = await pick(player, t("target"), countries);
        if (!group || !target || transferCountry(player).id !== country.id) return;
        await confirmLandTransferSend(player, `#${group.id}`, target.id);
    } catch (error) { reportTransferError(player, error); }
}
