import { CountryActionForm as ActionFormData, CountryModalForm as ModalFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import { landPermissions, isPermissionEnabled, permissionsFromToggles } from "@/domain/country/permissions.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { externalAffairsMainDefaultForm } from "@/features/forms/default/sc/info/ext/main.js";

type PlayerPermission = { id: string; permissions: string[] };

function context(player: Player) {
    const playerDb = new DynamicProperties("player");
    const ownRaw = playerDb.get(`player_${player.id}`);
    if (!ownRaw) return;
    const own = JSON.parse(ownRaw);
    const countryDb = new DynamicProperties("country");
    const countryRaw = countryDb.get(`country_${own.country}`);
    if (!countryRaw) return;
    const country = JSON.parse(countryRaw);
    country.playerPermissions ??= [];
    return { playerDb, countryDb, country };
}

function playerName(playerDb: DynamicProperties, id: string) {
    const raw = playerDb.get(`player_${id}`);
    return raw ? JSON.parse(raw).name ?? id : id;
}

export function countryPlayerPermissionsDefaultForm(player: Player) {
    const data = context(player);
    if (!data) return;
    const form = new ActionFormData().title({ translate: "external.player.permission" });
    form.button({ translate: "mc.button.player.add" });
    for (const entry of data.country.playerPermissions as PlayerPermission[]) {
        form.button(`${playerName(data.playerDb, entry.id)}§r\n${entry.id}`);
    }
    form.show(player).then(result => {
        if (result.canceled) return externalAffairsMainDefaultForm(player);
        if (result.selection === 0) return searchPlayerForm(player);
        const entry = data.country.playerPermissions[result.selection! - 1];
        if (entry) editPlayerPermissionForm(player, entry.id);
    });
}

function searchPlayerForm(player: Player) {
    new ModalFormData()
        .title({ translate: "external.player.permission.add" })
        .textField(
            { translate: "form.plot.addplayer.search.label" },
            { translate: "form.plot.addplayer.search.placeholder" }
        )
        .submitButton({ translate: "form.plot.addplayer.button.search" })
        .show(player).then(result => {
            if (result.canceled) return countryPlayerPermissionsDefaultForm(player);
            showPlayerSearchResults(player, String(result.formValues?.[0] ?? ""));
        });
}

function showPlayerSearchResults(player: Player, keyword: string) {
    const data = context(player);
    if (!data) return;
    const normalized = keyword.trim().toLowerCase();
    const configured = new Set((data.country.playerPermissions as PlayerPermission[]).map(entry => entry.id));
    const matches = data.playerDb.idList
        .filter(key => `${key}`.startsWith("player_"))
        .map(key => {
            const raw = data.playerDb.get(key);
            return raw ? JSON.parse(raw) : undefined;
        })
        .filter(target => target && target.id !== player.id && Number(target.country) !== Number(data.country.id))
        .filter(target => !configured.has(target.id))
        .filter(target => !normalized || String(target.name ?? "").toLowerCase().includes(normalized))
        .slice(0, 100);
    const form = new ActionFormData().title({ translate: "external.player.permission.add" });
    for (const target of matches) form.button(`${target.name}§r\n${target.id}`);
    form.show(player).then(result => {
        if (result.canceled) return searchPlayerForm(player);
        const target = matches[result.selection!];
        if (target) editPlayerPermissionForm(player, target.id);
    });
}

function editPlayerPermissionForm(player: Player, targetId: string) {
    const data = context(player);
    if (!data) return;
    const entries = data.country.playerPermissions as PlayerPermission[];
    const current = entries.find(entry => entry.id === targetId);
    const form = new ModalFormData().title({
        translate: "external.player.permission.edit",
        with: [playerName(data.playerDb, targetId)]
    });
    for (const permission of landPermissions) {
        form.toggle(
            { translate: `permission.${permission}` },
            { defaultValue: isPermissionEnabled(current?.permissions, permission) }
        );
    }
    form.toggle({ translate: "external.player.permission.delete" }, { defaultValue: false });
    form.submitButton({ translate: "mc.button.save" });
    form.show(player).then(result => {
        if (result.canceled) return countryPlayerPermissionsDefaultForm(player);
        const values = result.formValues ?? [];
        const remove = Boolean(values[landPermissions.length]);
        data.country.playerPermissions = entries.filter(entry => entry.id !== targetId);
        if (!remove) {
            data.country.playerPermissions.push({
                id: targetId,
                permissions: permissionsFromToggles(landPermissions, values)
            });
        }
        data.countryDb.set(`country_${data.country.id}`, data.country);
        countryPlayerPermissionsDefaultForm(player);
    });
}
