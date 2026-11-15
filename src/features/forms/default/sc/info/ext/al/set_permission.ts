import { CountryListForm as ActionFormData } from "@/shared/ui/country-list-form.js";
import { CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { AllianceMainDefaultForm } from "@/features/forms/default/sc/info/ext/al/main.js";

/** 同盟国を選択し、その国だけに適用する国土権限を編集する。 */
export function setAlliancePermissionDefaultForm(player: any, targetCountryId?: number | "default", page = 0) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const rawPlayerData = playerDataBase.get(`player_${player.id}`);
    if (!rawPlayerData) return;

    const playerData = JSON.parse(rawPlayerData);
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;

    if (targetCountryId === undefined) {
        const countryIds = countryData.alliance ?? [];
        const targets = countryIds.map((id: number) => new CountryManager(id).countryData).filter(Boolean);
        const form = new ActionFormData({ page }).title({ translate: `alliance.permission.edit` });
        form.button({ translate: `relationship.permission.default.edit` });
        for (const target of targets) form.button(`${target.name}\nID: ${target.id}`);
        form.show(player).then(rs => {
            page = rs.page;
            if (rs.canceled || rs.selection === undefined) {
                AllianceMainDefaultForm(player);
                return;
            }
            if (rs.selection === 0) setAlliancePermissionDefaultForm(player, "default", page);
            else setAlliancePermissionDefaultForm(player, targets[rs.selection - 1].id, page);
        });
        return;
    }

    if (targetCountryId === "default") {
        const form = new ModalFormData().title({ translate: `alliance.permission.edit` });
        for (const permission of landPermissions) {
            form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(countryData.alliancePermission, permission) });
        }
        form.submitButton({ translate: `mc.button.save` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                setAlliancePermissionDefaultForm(player, undefined, page);
                return;
            }
            countryManager.reload();
            countryData = countryManager.countryData;
            countryData.alliancePermission = permissionsFromToggles(landPermissions, rs.formValues);
            countryDataBase.set(`country_${countryData.id}`, countryData);
            setAlliancePermissionDefaultForm(player, undefined, page);
        });
        return;
    }

    if (!countryData.alliance?.includes(targetCountryId)) {
        AllianceMainDefaultForm(player);
        return;
    }
    const targetCountry = new CountryManager(targetCountryId).countryData;
    if (!targetCountry) {
        AllianceMainDefaultForm(player);
        return;
    }
    const individualEntry = countryData.allianceCountryPermissions
        ?.find((entry: any) => entry.id === targetCountryId);
    const currentPermissions = individualEntry?.permissions
        ?? countryData.alliancePermission
        ?? [];
    const form = new ModalFormData();
    form.title({ translate: `alliance.country.permission.edit`, with: [targetCountry.name] });
    form.toggle({ translate: `relationship.permission.use.individual` }, { defaultValue: !!individualEntry });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(currentPermissions, permission) });
    }
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            setAlliancePermissionDefaultForm(player, undefined, page);
            return;
        }
        const useIndividual = !!rs.formValues?.[0];
        const newLandPermissions = permissionsFromToggles(landPermissions, rs.formValues, 1);
        countryManager.reload();
        countryData = countryManager.countryData;
        if (!countryData.alliance?.includes(targetCountryId)) return;
        countryData.allianceCountryPermissions ??= [];
        const entry = countryData.allianceCountryPermissions.find((item: any) => item.id === targetCountryId);
        if (!useIndividual) {
            countryData.allianceCountryPermissions = countryData.allianceCountryPermissions.filter((item: any) => item.id !== targetCountryId);
        } else if (entry) entry.permissions = newLandPermissions;
        else countryData.allianceCountryPermissions.push({ id: targetCountryId, permissions: newLandPermissions });
        countryDataBase.set(`country_${countryData.id}`, countryData);
        setAlliancePermissionDefaultForm(player, undefined, page);
    });
}
