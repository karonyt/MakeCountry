import { Player, system, world } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm, ModalForm } from "./form_class";
const ActionFormData = ActionForm;
const ModalFormData = ModalForm;
import config from "../config";
import { createPlotGroup } from "./land";
import { CheckPermission, GetAndParsePropertyData, HasPermission, isDecimalNumberZeroOK, StringifyAndSavePropertyData } from "./util";
import { DynamicProperties } from "../api/dyp";

/**
 * @type {DynamicProperties}
 */
let playerDataBase;
/**
 * @type {DynamicProperties}
 */
let chunkDataBase;
/**
 * @type {DynamicProperties}
 */
let countryDataBase;
/**
 * @type {DynamicProperties}
 */
let chestDataBase;
/**
 * @type {DynamicProperties}
 */
let roleDataBase;
world.afterEvents.worldLoad.subscribe(() => {
    playerDataBase = new DynamicProperties("player");
    chunkDataBase = new DynamicProperties("chunk");
    countryDataBase = new DynamicProperties("country");
    chestDataBase = new DynamicProperties("chest");
    roleDataBase = new DynamicProperties("role");
});

/**
 * プロットのフォーム
 */

/**
 * プロットグループメインフォーム
 * @param {Player} player 
 */
export function settingCountryPlotGroupForm(player) {
    const isPlotAdmin = HasPermission(player, `plotAdmin`);
    if (!isPlotAdmin) {
        //権限がない場合
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const form = new ActionFormData();
    form.title({ translate: `form.setting.button.plotgroup` });
    form.button({ translate: `create.plotgroup.button` });
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
    const plotGroupIds = playerCountryData?.plotgroup ?? [];
    let plotGroupsData = [];
    for (const pgid of plotGroupIds) {
        const data = GetAndParsePropertyData(`plotgroup_${pgid}`);
        if (data) {
            plotGroupsData.push(data);
        };
    };
    for (const plotGroupData of plotGroupsData) {
        form.button(`${plotGroupData?.name}\n§rID:${plotGroupData?.id}`);
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            //settingCountry(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロットグループ作成フォーム表示
                CreatePlotGroupForm(player);
                break;
            };
            default: {
                //既存のプロットグループの編集
                plotGroupEditMainFormPlotAdmin(player, plotGroupsData[rs.selection - 1]?.id);
                break;
            };
        };
    });
};

/**
 * プロットグループ作成フォーム
 * @param {Player} player  
 */
export function CreatePlotGroupForm(player) {
    const isnotPlotAdmin = CheckPermission(player, `plotAdmin`);
    if (isnotPlotAdmin) {
        //権限がない場合
        player.sendMessage({ translate: `no.permission` });
        return;
    };
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const type = ["public", "private", "embassy"];
    const typeMessges = [
        { rawtext: [{ translate: `plot.public` }] },
        { rawtext: [{ translate: `plot.private` }] },
        { rawtext: [{ translate: `plot.embassy` }] },
    ];
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `form.plot.create` }] });
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] });
    form.dropdown({ rawtext: [{ translate: `plot.type` }] }, typeMessges);
    form.submitButton({ rawtext: [{ translate: `create.plotgroup.button` }] });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return settingCountryPlotGroupForm(player);
        };
        createPlotGroup(player, playerData?.country, rs.formValues[0], type[rs.formValues[1]]);
        return;
    });
};

/**
 * プロットアドミン用のプロットグループ編集フォーム
 * @param {Player} player 
 * @param {{is_selling: boolean,group: string|undefined,country: number|undefined,name: string|undefined,owner: string|undefined,permissions: [string],roles: [{id: number,permissions: [string]}],countries: [{id: number,permissions: [string]}],players: [{id: string,permissions: [string]}],type: "public"|"private"|"embassy",price: number|0, } | undefined} plot
 */
export function plotGroupEditMainFormPlotAdmin(player, plotGroupId) {
    const plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `${plot.name}` }] });
    form.button({ translate: `plot.edit.menu.button.settings` });
    form.button({ translate: `plot.edit.menu.button.permissions` });
    form.button({ translate: `plot.edit.menu.button.player` });
    form.button({ translate: `plot.edit.menu.button.country` });
    form.button({ translate: `plot.edit.menu.button.role` });
    form.button({ translate: `plot.edit.menu.button.owner` });
    form.button({ translate: `mc.button.delete` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            settingCountryPlotGroupForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロットグループ設定ModalForm
                plotGroupEditSettingFormPlotAdmin(player, plotGroupId, true);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                plotGroupEditPermissionsForm(player, plotGroupId, true);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                plotGroupEditPlayersListForm(player, plotGroupId, true);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                plotGroupEditCountriesListForm(player, plotGroupId, true);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                plotGroupEditRolesListForm(player, plotGroupId, true);
                break;
            };
            case 5: {
                //プロットの所有者管理ActionForm
                plotGroupOwnerShowForm(player, plotGroupId, true);
                break;
            };
            case 6: {
                //プロットグループの削除
                //ここに削除処理
                const playerData = GetAndParsePropertyData(`player_${player.id}`);
                const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
                if (!playerCountryData) {
                    return;
                };
                if (!playerCountryData?.plotgroup) playerCountryData.plotgroup = [];
                playerCountryData?.plotgroup.splice(playerCountryData?.plotgroup.indexOf(plotGroupId), 1);
                StringifyAndSavePropertyData(`country_${playerData?.country}`, playerCountryData);
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`);
                settingCountryPlotGroupForm(player);
                break;
            };
        };
    });
};

/*
 * プロットグループの各種設定フォーム
 */

/**
 * 所有者用の編集フォーム
 * @param {Player} player 
 * @param {number} plotGroupId
 */
export function plotGroupEditMainFormPlotOwner(player, plotGroupId) {
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `${plot?.name}` }] });
    form.button({ translate: `plot.edit.menu.button.settings` });
    form.button({ translate: `plot.edit.menu.button.permissions` });
    form.button({ translate: `plot.edit.menu.button.player` });
    form.button({ translate: `plot.edit.menu.button.country` });
    form.button({ translate: `plot.edit.menu.button.role` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    plotGroupEditMainFormPlotOwner(player, plotGroupId);
                }, 10);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロット設定ModalForm
                plotGroupEditSettingFormPlotOwner(player, plotGroupId);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                plotGroupEditPermissionsForm(player, plotGroupId);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                plotGroupEditPlayersListForm(player, plotGroupId);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                plotGroupEditCountriesListForm(player, plotGroupId);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                plotGroupEditRolesListForm(player, plotGroupId);
                break;
            };
        };
    });
};

/*
 * 所有者用の編集フォーム
 * ----------------------------------------------
 * 所有者の管理
 */

/**
 * 所有者の管理
 * @param {Player} player 
 * @param {*} targetData 
 * @param {boolean} plotAdmin 
 */
function plotGroupOwnerShowForm(player, plotGroupId, plotAdmin = false) {
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.owner) plot.owner = null;
    const form = new ActionFormData();
    let ownerData;
    if (plot?.owner) {
        ownerData = GetAndParsePropertyData(`player_${plot?.owner}`);
        form.title({ text: `${ownerData?.name}` });
        form.body({ rawtext: [{ translate: `owner` }, { text: `: ${ownerData?.name}` }] });
    };
    if (!plot?.owner) form.title({ translate: `not.owned` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.close` });
    if (plot?.owner) form.button({ translate: `mc.button.delete` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupEditMainFormPlotAdmin(player, plotGroupId);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (plotAdmin) {
                    plotGroupEditMainFormPlotAdmin(player, plotGroupId);
                    return;
                };
                break;
            };
            case 1: {
                //閉じる(何もしない)
                break;
            };
            case 2: {
                //オーナーの削除
                let afterPlot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
                afterPlot.owner = null;
                StringifyAndSavePropertyData(`${chunkId}`, afterPlot);
                plotGroupEditMainFormPlotAdmin(player, plotGroupId);
                break;
            };
        };
    });
};

/*
 * 所有者の管理
 * ----------------------------------------------
 * ロールの管理
 */

/**
 * プロットロールリストフォーム
 * @param {Player} player 
 */
function plotGroupEditRolesListForm(player, plotGroupId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.role` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.roles) plot.roles = [];
    form.button({ translate: `mc.button.role.add` });
    const roles = [];
    for (const roleRawData of plot.roles) {
        roles.push(GetAndParsePropertyData(`role_${roleRawData.id}`));
    };
    let aliveRoles = [];
    let aliveRolesData = [];
    for (const r of roles) {
        if (r?.id) {
            aliveRoles.push(r.id);
            aliveRolesData.push(r);
            form.button(`${r?.name}\nID: ${r?.id}`);
        };
    };
    plot.roles = plot.roles.filter(d => aliveRoles.includes(d.id));
    StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupEditMainFormPlotAdmin(player, plotGroupId);
                return;
            };
            plotGroupEditMainFormPlotOwner(player, plotGroupId);
            return;
        };
        if (rs.selection == 0) {
            roleAddPlotGroupForm(player, plotGroupId, plotAdmin);
            return;
        };
        plotGroupRoleSelectedShowForm(player, aliveRolesData[rs.selection - 1], plotGroupId, plotAdmin);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} plotGroupId 
 * @param {boolean} plotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function roleAddPlotGroupForm(player, plotGroupId, plotAdmin, search = false, keyword = ``) {
    const form = new ActionFormData();
    form.title({ translate: `form.plot.addrole.list.title` });
    form.button({ translate: `form.plot.addrole.button.serch` });
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData?.country}`);
    const roleIds = playerCountryData?.roles ?? [];
    let roles = [];
    roleIds.forEach(id => {
        roles[roles.length] = GetAndParsePropertyData(`role_${id}`);
    });

    if (search) {
        roles = roles.filter(r => r?.name.includes(keyword));
    };
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.roles) plot.roles = [];
    let aliveRoles = [];
    for (const r of roles) {
        if (plot.roles.find(d => d?.id == r.id)) continue;
        aliveRoles.push(r)
        form.button(`${r?.name}§r\nID: ${r?.id}`);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditRolesListForm(player, plotGroupId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form

                break;
            };
            default: {
                //ロール追加しよう
                const target = aliveRoles[rs.selection - 1];
                plot.roles.push({ id: target.id, permissions: [] });
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
                plotGroupEditRolesListForm(player, plotGroupId, plotAdmin);
                return;
            };
        };
    });
};

/**
 * 
 * @param {Player} player 
 * @param {*} targetData 
 * @param {boolean} plotAdmin 
 */
function plotGroupRoleSelectedShowForm(player, targetData, plotGroupId, plotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditRolesListForm(player, plotGroupId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotGroupEditRolesListForm(player, plotGroupId, plotAdmin);
                break;
            };
            case 1: {
                //ロールの権限編集
                plotGroupRolePermissionsEditForm(player, plotGroupId, targetData, plotAdmin);
                break;
            };
            case 2: {
                //ロールの削除
                let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
                if (!plot) {
                    return;
                };
                if (!plot?.roles) plot.roles = [];
                plot.roles.splice(plot.roles.indexOf(d => d.id == targetData.id), 1);
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
                plotGroupEditRolesListForm(player, plotGroupId, plotAdmin);
                break;
            };
            case 3: {
                //閉じる(何もしない)
                break;
            };
        };
    });
};

/**
 * プロットロール権限編集フォーム
 * @param {Player} player 
 */
function plotGroupRolePermissionsEditForm(player, plotGroupId, targetData, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.roles) plot.roles = [];
    let target = plot.roles.find(d => d.id == targetData?.id) ?? { id: targetData?.id, permissions: [] };
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, target?.permissions.includes(permission));
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupRoleSelectedShowForm(player, targetData, plotGroupId, plotAdmin);
                return;
            };
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        target.permissions = newLandPermissions;
        const index = plot?.roles.findIndex(d => d.id == target.id);
        if (index != -1) {
            plot.roles[index] = target;
        } else {
            plot?.roles.push(target);
        };
        StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
        if (plotAdmin) {
            plotGroupRoleSelectedShowForm(player, targetData, plotGroupId, plotAdmin);
            return;
        };
        return;
    });
};

/*
 * ロールの管理
 * -----------------------------------------
 * 国の管理
 */

/**
 * プロット国リストフォーム
 * @param {Player} player 
 */
function plotGroupEditCountriesListForm(player, plotGroupId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.country` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.countries) plot.countries = [];
    form.button({ translate: `mc.button.country.add` });
    const countries = [];
    for (const countryRawData of plot.countries) {
        countries.push(GetAndParsePropertyData(`country_${countryRawData.id}`));
    };
    let aliveCountries = [];
    let aliveCountriesData = [];
    for (const c of countries) {
        if (c?.id) {
            aliveCountries.push(c.id);
            aliveCountriesData.push(c);
            form.button(`${c?.name}\n${c?.id}`);
        };
    };
    plot.countries = plot.countries.filter(d => aliveCountries.includes(d.id));
    StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupEditMainFormPlotAdmin(player, plotGroupId);
                return;
            };
            plotGroupEditMainFormPlotOwner(player, plotGroupId);
            return;
        };
        if (rs.selection == 0) {
            countryAddPlotGroupForm(player, plotGroupId, plotAdmin);
            return;
        };
        plotGroupCountrySelectedShowForm(player, aliveCountriesData[rs.selection - 1], plotGroupId, plotAdmin);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} plotGroupId 
 * @param {boolean} plotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function countryAddPlotGroupForm(player, plotGroupId, plotAdmin, search = false, keyword = ``) {
    const form = new ActionFormData();
    form.title({ translate: `form.plot.addcountry.list.title` });
    form.button({ translate: `form.plot.addcountry.button.serch` });
    const countryIds = countryDataBase.idList;
    let countries = [];
    countryIds.forEach(id => {
        countries[countries.length] = GetAndParsePropertyData(id);
    });

    if (search) {
        countries = countries.filter(c => c?.name.includes(keyword));
    };
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.countries) plot.countries = [];
    let aliveCountries = [];
    let aliveCountriesData = [];
    for (const c of countries) {
        if (c?.id) {
            aliveCountries.push(c.id);
            aliveCountriesData.push(c);
            form.button(`${c?.name}\nID: ${c?.id}`);
        };
    };
    plot.countries = plot.countries.filter(d => aliveCountries.includes(d.id));
    StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);

    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditCountriesListForm(player, plotGroupId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form

                break;
            };
            default: {
                //国追加しよう
                const target = aliveCountriesData[rs.selection - 1];
                plot.countries.push({ id: target.id, permissions: [] });
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
                plotGroupEditCountriesListForm(player, plotGroupId, plotAdmin);
                return;
            };
        };
    });
};

/**
 * 
 * @param {Player} player 
 * @param {*} targetData 
 * @param {boolean} plotAdmin 
 */
function plotGroupCountrySelectedShowForm(player, targetData, plotGroupId, plotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditCountriesListForm(player, plotGroupId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotGroupEditCountriesListForm(player, plotGroupId, plotAdmin);
                break;
            };
            case 1: {
                //国の権限編集
                plotGroupCountryPermissionsEditForm(player, plotGroupId, targetData, plotAdmin);
                break;
            };
            case 2: {
                //国の削除
                let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
                if (!plot) {
                    return;
                };
                if (!plot?.countries) plot.countries = [];
                plot.countries = plot.countries.filter(d => d.id != targetData.id);
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
                plotGroupEditCountriesListForm(player, plotGroupId, plotAdmin);
                break;
            };
            case 3: {
                //閉じる(何もしない)
                break;
            };
        };
    });
};

/**
 * プロット国権限編集フォーム
 * @param {Player} player 
 */
function plotGroupCountryPermissionsEditForm(player, plotGroupId, targetData, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.countries) plot.countries = [];
    let target = plot.countries.find(d => d.id == targetData?.id) ?? { id: targetData?.id, permissions: [] };
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, target?.permissions.includes(permission));
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupCountrySelectedShowForm(player, targetData, plotGroupId, plotAdmin);
                return;
            };
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        target.permissions = newLandPermissions;
        const index = plot?.countries.findIndex(d => d.id == target.id);
        if (index != -1) {
            plot.countries[index] = target;
        } else {
            plot?.countries.push(target);
        };
        StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
        if (plotAdmin) {
            plotGroupCountrySelectedShowForm(player, targetData, plotGroupId, plotAdmin);
            return;
        };
        return;
    });
};

/*
 * 国の管理
 * ----------------------------------------------
 * プレイヤーの管理
 */

/**
 * プロットプレイヤーリストフォーム
 * @param {Player} player 
 */
function plotGroupEditPlayersListForm(player, plotGroupId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.player` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.players) plot.players = [];
    form.button({ translate: `mc.button.player.add` });
    const players = [];
    for (const playerRawData of plot.players) {
        players.push(GetAndParsePropertyData(`player_${playerRawData.id}`));
    };
    for (const p of players) {
        form.button(`${p?.name}\n${p?.id}`);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupEditMainFormPlotAdmin(player, plotGroupId);
                return;
            };
            plotGroupEditMainFormPlotOwner(player, plotGroupId);
            return;
        };
        if (rs.selection == 0) {
            playerAddPlotGroupForm(player, plotGroupId, plotAdmin);
            return;
        };
        plotGroupPlayerSelectedShowForm(player, players[rs.selection - 1], plotGroupId, plotAdmin);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} plotGroupId 
 * @param {boolean} plotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function playerAddPlotGroupForm(player, plotGroupId, plotAdmin, serch = false, keyword = ``) {
    const form = new ActionFormData();
    let players = world.getPlayers();
    form.title({ translate: `form.plot.addplayer.list.title` });
    form.button({ translate: `form.plot.addplayer.button.serch` });
    if (serch) {
        players = players.filter(p => p.name.includes(keyword));
    };
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.players) plot.players = [];
    /**
     * @type {Array<Player>}
     */
    let showPlayers = [];
    for (const p of players) {
        if (plot.players.find(d => d?.id == p.id)) continue;
        form.button(`${p.name}§r\n${p.id}`);
        showPlayers.push(p);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            plotGroupEditPlayersListForm(player, plotGroupId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //検索form

                break;
            };
            default: {
                //プレイヤー追加しよう
                const target = showPlayers[rs.selection - 1];
                plot.players.push({ id: target.id, permissions: [] });
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
                plotGroupEditPlayersListForm(player, plotGroupId, plotAdmin);
                return;
            };
        };
    });
};

/**
 * 
 * @param {Player} player 
 * @param {*} targetData 
 * @param {boolean} plotAdmin 
 */
function plotGroupPlayerSelectedShowForm(player, targetData, plotGroupId, plotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditPlayersListForm(player, plotGroupId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotGroupEditPlayersListForm(player, plotGroupId, plotAdmin);
                break;
            };
            case 1: {
                //プレイヤーの権限編集
                plotGroupPlayerPermissionsEditForm(player, plotGroupId, targetData, plotAdmin);
                break;
            };
            case 2: {
                //プレイヤーの削除
                let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
                if (!plot) {
                    return;
                };
                if (!plot?.players) plot.players = [];
                plot.players.splice(plot.players.indexOf(d => d.id == targetData.id), 1);
                StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
                plotGroupEditPlayersListForm(player, plotGroupId, plotAdmin);
                break;
            };
            case 3: {
                //閉じる(何もしない)
                break;
            };
        };
    });
};

/**
 * プロットプレイヤー権限編集フォーム
 * @param {Player} player 
 */
function plotGroupPlayerPermissionsEditForm(player, plotGroupId, targetData, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.players) plot.players = [];
    let target = plot.players.find(d => d.id == targetData?.id) ?? { id: targetData?.id, permissions: [] };
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, target?.permissions.includes(permission));
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupPlayerSelectedShowForm(player, targetData, plotGroupId, plotAdmin);
                return;
            };
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        target.permissions = newLandPermissions;
        const index = plot?.players.findIndex(d => d.id == target.id);
        if (index != -1) {
            plot.players[index] = target;
        } else {
            plot?.players.push(target);
        };
        StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
        if (plotAdmin) {
            plotGroupPlayerSelectedShowForm(player, targetData, plotGroupId, plotAdmin);
            return;
        };
        return;
    });
};

/*
 * プレイヤー管理
 * -----------------------------------------
 * デフォルト権限
 */

/**
 * プロットデフォルト権限編集フォーム
 * @param {Player} player 
 */
function plotGroupEditPermissionsForm(player, plotGroupId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    if (!plot?.permissions) plot.permissions = [];
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, plot?.permissions.includes(permission));
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotGroupEditMainFormPlotAdmin(player, plot, plotGroupId);
                return;
            };
            plotGroupEditMainFormPlotOwner(player, plot, plotGroupId);
            return;
        };
        const values = rs.formValues;
        let newLandPermissions = [];
        for (let i = 0; i < values.length; i++) {
            if (values[i]) {
                newLandPermissions.push(landPermissions[i]);
            };
        };
        plot.permissions = newLandPermissions;
        StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
        if (plotAdmin) {
            plotGroupEditMainFormPlotAdmin(player, plotGroupId);
            return;
        };
        return;
    });
};

/*
 * デフォルト権限
 * --------------------------------------
 * プロットアドミンプロット設定フォーム
 */

/**
 * プロットアドミンプロット設定フォーム
 * @param {Player} player 
 */
function plotGroupEditSettingFormPlotAdmin(player, plotGroupId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.settings` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };

    const type = ["public", "private", "embassy"];
    const typeMessges = [
        { rawtext: [{ translate: `plot.public` }] },
        { rawtext: [{ translate: `plot.private` }] },
        { rawtext: [{ translate: `plot.embassy` }] },
    ];
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] }, plot?.name ?? `new Plot`);
    form.dropdown({ rawtext: [{ translate: `plot.type` }] }, typeMessges, type.indexOf(plot?.type ?? `public`));
    form.textField({ translate: `plot.price`, with: [`${config.MoneyName} ${plot?.price ?? 0}`] }, { translate: `plot.price.input` }, `${plot?.price ?? 0}`);
    form.toggle({ translate: `plot.selling` }, plot?.is_selling);
    form.toggle({ translate: `plot.enable` }, plot?.enable);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditMainFormPlotAdmin(player, plotGroupId);
            return;
        };
        let newPlotName = rs.formValues[0];
        if (newPlotName == ``) {
            newPlotName = `new Plot`;
        };
        //値段チェック
        let price = rs.formValues[2];
        if (isDecimalNumberZeroOK(price)) {
            price = `0`;
        };
        if (Number(price) < 0) {
            price = `0`;
        };
        plot.name = newPlotName;
        plot.price = Math.floor(Number(price));
        plot.type = type[rs.formValues[1]];
        plot.is_selling = rs.formValues[3];
        plot.enable = rs.formValues[4];
        StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
        plotGroupEditMainFormPlotAdmin(player, plotGroupId);
        return;
    });
};

/*
 * プロットアドミンプロット設定フォーム
 * --------------------------------------
 * プロット所有者プロット設定フォーム
 */

/**
 * プロット所有者プロット設定フォーム
 * @param {Player} player 
 */
function plotGroupEditSettingFormPlotOwner(player, plotGroupId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.settings` }] });
    let plot = GetAndParsePropertyData(`plotgroup_${plotGroupId}`);
    if (!plot) {
        return;
    };
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] }, plot?.name ?? `new Plot`);
    form.textField({ translate: `plot.price`, with: [`${config.MoneyName} ${plot?.price ?? 0}`] }, { translate: `plot.price.input` }, `${plot?.price ?? 0}`);
    form.toggle({ translate: `plot.selling` }, plot?.is_selling);
    form.toggle({ translate: `plot.enable` }, plot?.enable);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotGroupEditMainFormPlotOwner(player, plotGroupId);
            return;
        };
        //名前チェック
        let newPlotName = rs.formValues[0];
        if (newPlotName == ``) {
            newPlotName = `new Plot`;
        };
        //値段チェック
        let price = rs.formValues[1];
        if (isDecimalNumberZeroOK(price)) {
            price = `0`;
        };
        if (Number(price) < 0) {
            price = `0`;
        };
        plot.name = newPlotName;
        plot.price = Math.floor(Number(price));
        plot.is_selling = rs.formValues[2];
        plot.enable = rs.formValues[3];
        StringifyAndSavePropertyData(`plotgroup_${plotGroupId}`, plot);
        plotGroupEditMainFormPlotOwner(player, plotGroupId);
        return;
    });
};