import { CountryListForm as ActionFormData } from "@/shared/ui/country-list-form.js";
import { CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { HostilityMainDefaultForm } from "@/features/forms/default/sc/info/ext/hos/hostility_main.js";

/** 敵対国の一括デフォルト、または国家別の国土権限を編集する。 */
export function setHostilityPermissionDefaultForm(player: any, targetCountryId?: number | "default", page = 0) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const rawPlayerData = playerDataBase.get(`player_${player.id}`);
    if (!rawPlayerData) return;
    const playerData = JSON.parse(rawPlayerData);
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;

    if (targetCountryId === undefined) {
        const targets = (countryData.hostility ?? [])
            .map((id: number) => new CountryManager(id).countryData)
            .filter(Boolean);
        const form = new ActionFormData({ page }).title({ translate: `hostility.permission.edit` });
        form.button({ translate: `relationship.permission.default.edit` });
        for (const target of targets) form.button(`${target.name}\nID: ${target.id}`);
        form.show(player).then(rs => {
            page = rs.page;
            if (rs.canceled || rs.selection === undefined) {
                HostilityMainDefaultForm(player);
                return;
            }
            if (rs.selection === 0) setHostilityPermissionDefaultForm(player, "default", page);
            else setHostilityPermissionDefaultForm(player, targets[rs.selection - 1].id, page);
        });
        return;
    }

    if (targetCountryId === "default") {
        const form = new ModalFormData().title({ translate: `hostility.permission.edit` });
        for (const permission of landPermissions) {
            form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(countryData.hostilityPermission, permission) });
        }
        form.submitButton({ translate: `mc.button.save` });
        form.show(player).then(rs => {
            if (rs.canceled) return setHostilityPermissionDefaultForm(player, undefined, page);
            countryManager.reload();
            countryData = countryManager.countryData;
            countryData.hostilityPermission = permissionsFromToggles(landPermissions, rs.formValues);
            countryDataBase.set(`country_${countryData.id}`, countryData);
            setHostilityPermissionDefaultForm(player, undefined, page);
        });
        return;
    }

    if (!countryData.hostility?.includes(targetCountryId)) return HostilityMainDefaultForm(player);
    const targetCountry = new CountryManager(targetCountryId).countryData;
    if (!targetCountry) return HostilityMainDefaultForm(player);
    const individualEntry = countryData.hostilityCountryPermissions?.find((entry: any) => entry.id === targetCountryId);
    const currentPermissions = individualEntry?.permissions ?? countryData.hostilityPermission ?? [];
    const form = new ModalFormData().title({ translate: `hostility.country.permission.edit`, with: [targetCountry.name] });
    form.toggle({ translate: `relationship.permission.use.individual` }, { defaultValue: !!individualEntry });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(currentPermissions, permission) });
    }
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) return setHostilityPermissionDefaultForm(player, undefined, page);
        const useIndividual = !!rs.formValues?.[0];
        const permissions = permissionsFromToggles(landPermissions, rs.formValues, 1);
        countryManager.reload();
        countryData = countryManager.countryData;
        if (!countryData.hostility?.includes(targetCountryId)) return;
        countryData.hostilityCountryPermissions ??= [];
        const entry = countryData.hostilityCountryPermissions.find((item: any) => item.id === targetCountryId);
        if (!useIndividual) countryData.hostilityCountryPermissions = countryData.hostilityCountryPermissions.filter((item: any) => item.id !== targetCountryId);
        else if (entry) entry.permissions = permissions;
        else countryData.hostilityCountryPermissions.push({ id: targetCountryId, permissions });
        countryDataBase.set(`country_${countryData.id}`, countryData);
        setHostilityPermissionDefaultForm(player, undefined, page);
    });
}
