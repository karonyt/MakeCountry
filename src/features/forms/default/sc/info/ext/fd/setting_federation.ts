import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { canLeadFederation, canManageFederation } from "@/features/forms/default/sc/info/ext/fd/access.js";
import { getFederationMemberIds, isFederationActive, normalizeFederationData } from "@/domain/country/relationships/federation.js";
import config from "@/config/server.js";

function getPlayerCountryManager(player: any) {
    const playerDataBase = new DynamicProperties("player");
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`) ?? "null");
    return playerData?.country ? new CountryManager(playerData.country) : undefined;
}

function getPlayerName(playerId: any) {
    const playerDataBase = new DynamicProperties("player");
    const rawData = playerDataBase.get(`player_${playerId}`);
    return rawData ? JSON.parse(rawData).name : `${playerId}`;
}

function formatMoney(value: any) {
    return `${config.MoneyName} ${Math.floor((Number(value) || 0) * 100) / 100}`;
}

function federationBody(federation: any) {
    const unpaidTotal = Object.values(federation.unpaidTaxes ?? {}).reduce((sum: any, value: any) => sum + (Number(value) || 0), 0);
    return {
        rawtext: [
            { translate: `federation.government.name` }, { text: `: ${federation.name}\n` },
            { translate: `federation.description` }, { text: `: ${federation.description || "-"}\n` },
            { translate: `federation.government.leader` }, { text: `: ${getPlayerName(federation.leader)}\n` },
            { translate: `federation.subleaders` }, { text: `: ${federation.subLeaders?.length ?? 0}\n` },
            { translate: `federation.government.members` }, { text: `: ${federation.members.length}\n` },
            { translate: `federation.treasury` }, { text: `: ${formatMoney(federation.treasury)}\n` },
            { translate: `federation.tax.rate` }, { text: `: ${federation.taxRate}%\n` },
            { translate: `federation.tax.unpaid` }, { text: `: ${formatMoney(unpaidTotal)}` }
        ]
    };
}

/**
 * 連邦設定UI
 * @param {Player} player
 */
export function settingFederationDefaultForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    const federation = normalizeFederationData(countryData);
    if (!countryManager || !isFederationActive(federation)) {
        player.sendMessage({ translate: `federation.no.active` });
        return;
    }
    if (!canManageFederation(player, countryData)) {
        player.sendMessage({ translate: `no.permission` });
        return;
    }

    const form = new ActionFormData();
    form.title({ translate: `form.setting.federation.title` });
    form.body(federationBody(federation));
    form.button({ translate: `federation.basic.settings` });
    form.button({ translate: `federation.display.settings` });
    form.button({ translate: `federation.subleader.settings` });
    form.button({ translate: `federation.finance.settings` });
    form.button({ translate: `federation.capital.set` });
    form.button({ translate: `federation.leader.transfer` });
    form.button({ translate: `federation.disband` });
    form.show(player).then((rs) => {
        if (rs.canceled) return;
        switch (rs.selection) {
            case 0:
                federationBasicSettingForm(player);
                break;
            case 1:
                federationDisplaySettingForm(player);
                break;
            case 2:
                federationSubLeaderSettingForm(player);
                break;
            case 3:
                federationFinanceSettingForm(player);
                break;
            case 4: {
                import("@/features/forms/default/sc/info/ext/fd/capital.js").then(({ FederationCapitalDefaultForm }) => FederationCapitalDefaultForm(player));
                break;
            }
            case 5: {
                if (canLeadFederation(player, countryData)) {
                    import("@/features/forms/default/sc/info/ext/fd/leader.js").then(({ FederationLeaderDefaultForm }) => FederationLeaderDefaultForm(player));
                } else {
                    player.sendMessage({ translate: `no.permission` });
                }
                break;
            }
            case 6:
                federationDisbandConfirmForm(player);
                break;
        }
    });
}

function federationBasicSettingForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canManageFederation(player, countryData)) return;
    const federation = normalizeFederationData(countryData);
    const form = new ModalFormData();
    form.title({ translate: `federation.basic.settings` });
    form.textField({ translate: `federation.government.name` }, { translate: `input.string` }, { defaultValue: federation.name });
    form.textField({ translate: `federation.description` }, { translate: `input.string` }, { defaultValue: federation.description ?? "" });
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingFederationDefaultForm(player);
            return;
        }
        countryManager.updateFederationBasic(rs.formValues?.[0], rs.formValues?.[1], player);
        settingFederationDefaultForm(player);
    });
}

function federationDisplaySettingForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canManageFederation(player, countryData)) return;
    const federation = normalizeFederationData(countryData);
    const form = new ModalFormData();
    form.title({ translate: `federation.display.settings` });
    form.toggle({ translate: `federation.setting.show_in_chat` }, { defaultValue: federation.settings?.showInChat ?? true });
    form.toggle({ translate: `federation.setting.show_on_territory_enter` }, { defaultValue: federation.settings?.showOnTerritoryEnter ?? true });
    form.toggle({ translate: `federation.setting.show_on_map` }, { defaultValue: federation.settings?.showOnMap ?? true });
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingFederationDefaultForm(player);
            return;
        }
        countryManager.updateFederationSettings({
            showInChat: !!rs.formValues?.[0],
            showOnTerritoryEnter: !!rs.formValues?.[1],
            showOnMap: !!rs.formValues?.[2]
        }, player);
        settingFederationDefaultForm(player);
    });
}

function federationFinanceSettingForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canManageFederation(player, countryData)) return;
    const federation = normalizeFederationData(countryData);
    const form = new ActionFormData();
    form.title({ translate: `federation.finance.settings` });
    form.body(federationBody(federation));
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `federation.tax.rate.set` });
    form.show(player).then((rs) => {
        if (rs.canceled || rs.selection === 0) {
            settingFederationDefaultForm(player);
            return;
        }
        if (!canLeadFederation(player, countryData)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        }
        federationTaxRateForm(player);
    });
}

function federationTaxRateForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canLeadFederation(player, countryData)) return;
    const federation = normalizeFederationData(countryData);
    const form = new ModalFormData();
    form.title({ translate: `federation.tax.rate.set` });
    form.textField({ translate: `federation.tax.rate` }, { translate: `input.number` }, { defaultValue: `${federation.taxRate ?? 0}` });
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            federationFinanceSettingForm(player);
            return;
        }
        countryManager.setFederationTaxRate(rs.formValues?.[0], player);
        federationFinanceSettingForm(player);
    });
}

function federationSubLeaderSettingForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canLeadFederation(player, countryData)) {
        player.sendMessage({ translate: `no.permission` });
        return;
    }
    const federation = normalizeFederationData(countryData);
    const form = new ActionFormData();
    const subLeaders = federation.subLeaders ?? [];
    form.title({ translate: `federation.subleader.settings` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `federation.subleader.add` });
    for (const subLeaderId of subLeaders) {
        form.button(`${getPlayerName(subLeaderId)}\n${subLeaderId}`);
    }
    form.show(player).then((rs) => {
        if (rs.canceled || rs.selection === 0) {
            settingFederationDefaultForm(player);
            return;
        }
        if (rs.selection === 1) {
            federationSubLeaderAddForm(player);
            return;
        }
        federationSubLeaderRemoveConfirmForm(player, subLeaders[(rs.selection ?? 0) - 2]);
    });
}

function federationSubLeaderAddForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canLeadFederation(player, countryData)) return;
    const federation = normalizeFederationData(countryData);
    const playerDataBase = new DynamicProperties("player");
    const form = new ActionFormData();
    const candidates: any = [];
    form.title({ translate: `federation.subleader.add` });
    form.button({ translate: `mc.button.close` });
    for (const countryId of getFederationMemberIds(countryData)) {
        const memberCountryManager = new CountryManager(countryId);
        if (!memberCountryManager.isVaildProperty) continue;
        for (const memberId of memberCountryManager.countryData.members ?? []) {
            if (memberId === federation.leader || federation.subLeaders?.includes(memberId)) continue;
            const rawMemberData = playerDataBase.get(`player_${memberId}`);
            if (!rawMemberData) continue;
            const memberData = JSON.parse(rawMemberData);
            candidates.push(memberData.id);
            form.button(`${memberData.name}\n${memberCountryManager.countryData.name}`);
        }
    }
    form.show(player).then((rs) => {
        if (rs.canceled || rs.selection === 0) {
            federationSubLeaderSettingForm(player);
            return;
        }
        countryManager.addFederationSubLeader(candidates[(rs.selection ?? 0) - 1], player);
        federationSubLeaderSettingForm(player);
    });
}

function federationSubLeaderRemoveConfirmForm(player: any, playerId: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canLeadFederation(player, countryData)) return;
    const form = new ActionFormData();
    form.title({ translate: `federation.subleader.remove` });
    form.body(`${getPlayerName(playerId)}`);
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `federation.subleader.remove` });
    form.show(player).then((rs) => {
        if (rs.canceled || rs.selection === 0) {
            federationSubLeaderSettingForm(player);
            return;
        }
        countryManager.removeFederationSubLeader(playerId, player);
        federationSubLeaderSettingForm(player);
    });
}

function federationDisbandConfirmForm(player: any) {
    const countryManager = getPlayerCountryManager(player);
    const countryData = countryManager?.countryData;
    if (!countryManager || !canLeadFederation(player, countryData)) {
        player.sendMessage({ translate: `no.permission` });
        return;
    }
    const form = new ActionFormData();
    form.title({ translate: `federation.disband` });
    form.button({ translate: `mc.button.close` });
    form.button({ translate: `federation.disband` });
    form.show(player).then((rs) => {
        if (rs.canceled || rs.selection === 0) {
            settingFederationDefaultForm(player);
            return;
        }
        countryManager.disbandFederation(player);
    });
}
