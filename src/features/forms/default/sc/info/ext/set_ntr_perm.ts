import { CountryListForm as ActionFormData } from "@/shared/ui/country-list-form.js";
import { CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { areCountriesInSameFederation } from "@/domain/country/relationships/federation.js";
import { externalAffairsMainDefaultForm } from "@/features/forms/default/sc/info/ext/main.js";

/** 中立国の一括デフォルト、または国家別の国土権限を編集する。 */
export function setNeutralityPermissionDefaultForm(player: any, targetCountryId?: number | "default", page = 0) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const rawPlayerData = playerDataBase.get(`player_${player.id}`);
    if (!rawPlayerData) return;
    const playerData = JSON.parse(rawPlayerData);
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;

    if (targetCountryId === undefined) {
        const relatedIds = new Set([countryData.id, ...(countryData.alliance ?? []), ...(countryData.friendly ?? []), ...(countryData.hostility ?? [])]);
        const targets = countryDataBase.idList
            .map((key: any) => countryDataBase.get(key))
            .filter(Boolean)
            .map((raw) => JSON.parse(raw!))
            .filter((target: any) => !relatedIds.has(target.id) && !areCountriesInSameFederation(countryData, target));
        const form = new ActionFormData({ page }).title({ translate: `neutrality.permission.edit` });
        form.button({ translate: `relationship.permission.default.edit` });
        for (const target of targets) form.button(`${target.name}\nID: ${target.id}`);
        form.show(player).then(rs => {
            page = rs.page;
            if (rs.canceled || rs.selection === undefined) return externalAffairsMainDefaultForm(player);
            if (rs.selection === 0) setNeutralityPermissionDefaultForm(player, "default", page);
            else setNeutralityPermissionDefaultForm(player, targets[rs.selection - 1].id, page);
        });
        return;
    }

    if (targetCountryId === "default") {
        const form = new ModalFormData().title({ translate: `neutrality.permission.edit` });
        for (const permission of landPermissions) {
            form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(countryData.neutralityPermission, permission) });
        }
        form.submitButton({ translate: `mc.button.save` });
        form.show(player).then(rs => {
            if (rs.canceled) return setNeutralityPermissionDefaultForm(player, undefined, page);
            countryManager.reload();
            countryData = countryManager.countryData;
            countryData.neutralityPermission = permissionsFromToggles(landPermissions, rs.formValues);
            countryDataBase.set(`country_${countryData.id}`, countryData);
            setNeutralityPermissionDefaultForm(player, undefined, page);
        });
        return;
    }

    const targetCountry = new CountryManager(targetCountryId).countryData;
    const isRelated = countryData.id === targetCountryId || countryData.alliance?.includes(targetCountryId)
        || countryData.friendly?.includes(targetCountryId) || countryData.hostility?.includes(targetCountryId)
        || (targetCountry && areCountriesInSameFederation(countryData, targetCountry));
    if (!targetCountry || isRelated) return externalAffairsMainDefaultForm(player);
    const individualEntry = countryData.neutralityCountryPermissions?.find((entry: any) => entry.id === targetCountryId);
    const currentPermissions = individualEntry?.permissions ?? countryData.neutralityPermission ?? [];
    const form = new ModalFormData().title({ translate: `neutrality.country.permission.edit`, with: [targetCountry.name] });
    form.toggle({ translate: `relationship.permission.use.individual` }, { defaultValue: !!individualEntry });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(currentPermissions, permission) });
    }
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) return setNeutralityPermissionDefaultForm(player, undefined, page);
        const useIndividual = !!rs.formValues?.[0];
        const permissions = permissionsFromToggles(landPermissions, rs.formValues, 1);
        countryManager.reload();
        countryData = countryManager.countryData;
        countryData.neutralityCountryPermissions ??= [];
        const entry = countryData.neutralityCountryPermissions.find((item: any) => item.id === targetCountryId);
        if (!useIndividual) countryData.neutralityCountryPermissions = countryData.neutralityCountryPermissions.filter((item: any) => item.id !== targetCountryId);
        else if (entry) entry.permissions = permissions;
        else countryData.neutralityCountryPermissions.push({ id: targetCountryId, permissions });
        countryDataBase.set(`country_${countryData.id}`, countryData);
        setNeutralityPermissionDefaultForm(player, undefined, page);
    });
}
