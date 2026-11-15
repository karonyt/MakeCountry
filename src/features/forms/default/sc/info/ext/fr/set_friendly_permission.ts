import { CountryListForm as ActionFormData } from "@/shared/ui/country-list-form.js";
import { CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { FriendlyMainDefaultForm } from "@/features/forms/default/sc/info/ext/fr/friendly_main.js";

/** 友好国を選択し、その国だけに適用する国土権限を編集する。 */
export function setFriendlyPermissionDefaultForm(player: any, targetCountryId?: number | "default", page = 0) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    const rawPlayerData = playerDataBase.get(`player_${player.id}`);
    if (!rawPlayerData) return;

    const playerData = JSON.parse(rawPlayerData);
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;

    if (targetCountryId === undefined) {
        const countryIds = countryData.friendly ?? [];
        const targets = countryIds.map((id: number) => new CountryManager(id).countryData).filter(Boolean);
        const form = new ActionFormData({ page }).title({ translate: `friendly.permission.edit` });
        form.button({ translate: `relationship.permission.default.edit` });
        for (const target of targets) form.button(`${target.name}\nID: ${target.id}`);
        form.show(player).then(rs => {
            page = rs.page;
            if (rs.canceled || rs.selection === undefined) {
                FriendlyMainDefaultForm(player);
                return;
            }
            if (rs.selection === 0) setFriendlyPermissionDefaultForm(player, "default", page);
            else setFriendlyPermissionDefaultForm(player, targets[rs.selection - 1].id, page);
        });
        return;
    }

    if (targetCountryId === "default") {
        const form = new ModalFormData().title({ translate: `friendly.permission.edit` });
        for (const permission of landPermissions) {
            form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(countryData.friendlyPermission, permission) });
        }
        form.submitButton({ translate: `mc.button.save` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                setFriendlyPermissionDefaultForm(player, undefined, page);
                return;
            }
            countryManager.reload();
            countryData = countryManager.countryData;
            countryData.friendlyPermission = permissionsFromToggles(landPermissions, rs.formValues);
            countryDataBase.set(`country_${countryData.id}`, countryData);
            setFriendlyPermissionDefaultForm(player, undefined, page);
        });
        return;
    }

    if (!countryData.friendly?.includes(targetCountryId)) {
        FriendlyMainDefaultForm(player);
        return;
    }
    const targetCountry = new CountryManager(targetCountryId).countryData;
    if (!targetCountry) {
        FriendlyMainDefaultForm(player);
        return;
    }
    const individualEntry = countryData.friendlyCountryPermissions
        ?.find((entry: any) => entry.id === targetCountryId);
    const currentPermissions = individualEntry?.permissions
        ?? countryData.friendlyPermission
        ?? [];
    const form = new ModalFormData();
    form.title({ translate: `friendly.country.permission.edit`, with: [targetCountry.name] });
    form.toggle({ translate: `relationship.permission.use.individual` }, { defaultValue: !!individualEntry });
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, { defaultValue: isPermissionEnabled(currentPermissions, permission) });
    }
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            setFriendlyPermissionDefaultForm(player, undefined, page);
            return;
        }
        const useIndividual = !!rs.formValues?.[0];
        const newLandPermissions = permissionsFromToggles(landPermissions, rs.formValues, 1);
        countryManager.reload();
        countryData = countryManager.countryData;
        if (!countryData.friendly?.includes(targetCountryId)) return;
        countryData.friendlyCountryPermissions ??= [];
        const entry = countryData.friendlyCountryPermissions.find((item: any) => item.id === targetCountryId);
        if (!useIndividual) {
            countryData.friendlyCountryPermissions = countryData.friendlyCountryPermissions.filter((item: any) => item.id !== targetCountryId);
        } else if (entry) entry.permissions = newLandPermissions;
        else countryData.friendlyCountryPermissions.push({ id: targetCountryId, permissions: newLandPermissions });
        countryDataBase.set(`country_${countryData.id}`, countryData);
        setFriendlyPermissionDefaultForm(player, undefined, page);
    });
}
