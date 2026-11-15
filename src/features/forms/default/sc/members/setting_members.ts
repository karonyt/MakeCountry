import { CountryActionForm as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { callSettingCountryForm } from "@/features/forms/form-registry.js";
import { memberSelectedShowDefaultForm } from "@/features/forms/default/sc/members/member_show.js";

function readPlayer(dataBase: DynamicProperties, id: string): any | undefined {
    try {
        const raw = dataBase.get(`player_${id}`);
        if (typeof raw !== "string") return undefined;
        const data = JSON.parse(raw);
        return data && typeof data === "object" && !Array.isArray(data) ? data : undefined;
    } catch { return undefined; }
}

/** Keep unavailable members visible; a temporary read failure must not hide the whole roster. */
export async function settingCountryMembersDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = readPlayer(playerDataBase, player.id);
    if (!playerData?.country) {
        player.sendMessage("§c国のデータを読み込めませんでした。少し待ってから開き直してください。");
        return;
    }
    const countryManager = new CountryManager(playerData.country);
    const countryData = countryManager.countryData;
    if (!countryManager.isVaildProperty || !Array.isArray(countryData?.members)) {
        player.sendMessage("§c国民一覧のデータを読み込めませんでした。少し待ってから開き直してください。");
        return;
    }
    const form = new ActionFormData().title({ translate: "form.setting.members.title" });
    const members: any[] = [];
    for (const memberId of countryData.members) {
        const member = readPlayer(playerDataBase, String(memberId));
        if (member && member.country != countryData.id) continue;
        const available = member && typeof member.id === "string" && typeof member.name === "string";
        members.push(available ? member : undefined);
        form.button(available ? `${member.name}\n${member.id}` : `§7未取得の国民データ\n${memberId}`);
    }
    if (members.length === 0) {
        player.sendMessage("§e表示できる国民データがありません。少し待ってから開き直してください。");
        return;
    }
    try {
        const response = await form.show(player);
        if (response.canceled) return callSettingCountryForm(player);
        if (!Number.isInteger(response.selection) || response.selection < 0 || response.selection >= members.length) return;
        const selected = members[response.selection];
        if (!selected) {
            player.sendMessage("§eこの国民のデータはまだ読み込めません。少し待ってから開き直してください。");
            return;
        }
        return memberSelectedShowDefaultForm(player, selected, countryData);
    } catch {
        try { player.sendMessage("§c国民管理画面を開けませんでした。少し待ってから開き直してください。"); } catch {}
    }
}
