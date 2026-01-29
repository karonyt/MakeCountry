import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm, ModalForm } from "./form_class";
const ActionFormData = ActionForm;
const ModalFormData = ModalForm;
import { CheckPermissionFromLocation, GetAndParsePropertyData, GetPlayerChunkPropertyId, isDecimalNumberZeroOK, StringifyAndSavePropertyData } from "./util";
import { Player, system, world } from "@minecraft/server";
import { addPlotToGroup, createPlot, createPlotToGroup } from "./land";
import config from "../config";
import { plotGroupEditMainFormPlotOwner } from "./form";
import { DynamicProperties } from "../api/dyp";

const landPermissions = [
    `place`,
    `break`,
    `openContainer`,
    `pistonPlace`,
    `setHome`,
    `blockUse`,
    `entityUse`,
    `noTarget`,
    `publicHomeUse`,
];

/**
 * プロットフォーム
 * @param {Player} player  
 */
export function plotMainForm(player) {
    const form = new ActionFormData();
    const { x, y, z } = player.location;
    const dimensionId = player.dimension.id;
    form.title({ rawtext: [{ translate: `form.plot.main` }] });
    const chunkId = GetPlayerChunkPropertyId(player);
    const chunkData = GetAndParsePropertyData(chunkId);
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const playerCountryData = GetAndParsePropertyData(`country_${playerData.country}`);

    //国じゃない場合
    if (!chunkData || !chunkData?.countryId) {
        //メッセージ
        player.sendMessage({ rawtext: [{ translate: `plot.failed.nonCountryChunk` }] });
        return;
    };

    if (playerCountryData?.hostility.includes(chunkData?.country)) {
        //敵対してる場合
        //メッセージ
        player.sendMessage({ rawtext: [{ translate: `plot.failed.forhostile` }] });
        return;
    };

    /**
     * @type {{is_selling: boolean,group: number|undefined,country: number|undefined,name: string|undefined,owner: string|undefined,permissions: [string],roles: [{id: number,permissions: [string]}],countries: [{id: number,permissions: [string]}],players: [{id: string,permissions: [string]}],type: "public"|"private"|"embassy",price: number|0, } | undefined}
     */
    let plot = chunkData?.plot ?? {
        group: undefined,
        is_selling: false,
        name: undefined,
        owner: undefined,
        players: [],
        type: "public",
        price: 0,
        countries: [],
        permissions: [],
    };
    const isnot_plotAdmin = CheckPermissionFromLocation(player, x, z, dimensionId, `plotAdmin`) //?? CheckPermission(player, `admin`);
    //プロットが設定されてないチャンクの場合
    if (!plot?.name && !plot?.owner && !plot?.group) {
        //自分の国じゃない場合
        if (chunkData?.countryId != playerData?.country) {
            //メッセージ
            player.sendMessage({ rawtext: [{ translate: `plot.failed.nonOwnCountryChunk` }] });
            return;
        };

        if (!isnot_plotAdmin) {
            //プロット作成画面
            form.button({ rawtext: [{ translate: `create.plot.button` }] });
            form.show(player).then((rs) => {
                if (rs.canceled) {
                    if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                        system.runTimeout(() => {
                            plotMainForm(player);
                            return;
                        }, 10)
                    };
                    return;
                };
                switch (rs.selection) {
                    case 0: {
                        CreatePlotForm(player, chunkId);
                        break;
                    };
                };
            });
            return;
        }
        //権限がない場合にメッセージ
        player.sendMessage({ rawtext: [{ translate: `no.permission` }] });
        return;
    };
    let plotName = plot?.name ?? `new Plot`;
    let body = [
        { translate: `plot.name` }, { text: `: ` }, { text: `${plotName} §r\n` },
    ];
    if (plot?.group) {
        body.unshift({ translate: `plot.is_group` }, { text: ` ID: ${plot.group}\n` })
    };
    //プロットグループに入ってる場合
    if (plot?.group) {
        const groupdata = GetAndParsePropertyData(`plotgroup_${plot?.group}`);
        if (!groupdata) {
            plot.group = null;
            chunkData.plot = plot;
            body.shift();
            StringifyAndSavePropertyData(`${chunkId}`, chunkData);
        } else {
            plot = groupdata;
            body.unshift({ translate: `plotgroup.name` }, { text: `: ` }, { text: `${plot?.name} §r\n` });
        };
    };
    body.push(
        { translate: `plot.type` }, { text: `: ` }, { translate: `plot.${plot?.type}` }, { text: `\n` },
        { translate: `plot.price`, with: [`: ${config.MoneyName} ${plot?.price}\n`] },
        { translate: `plot.is_selling` }, { text: `: ${plot?.is_selling}\n` },
        { translate: `plot.is_enable` }, { text: `: ${plot?.enable}\n` },
    );
    if (plot?.owner) {
        body.push({ translate: `owner` }, { text: `: ${GetAndParsePropertyData(`player_${plot.owner}`)?.name} §r\n` })
    };
    form.body({
        rawtext: body
    });
    if (plot?.id) {
        //プロットグループの場合
        switch (plot.type) {
            case "public": {
                //自分の国じゃない場合
                if (chunkData?.countryId != playerData?.country) {
                    //メッセージ
                    player.sendMessage({ rawtext: [{ translate: `plot.failed.nonOwnCountryChunk` }] });
                    return;
                };
                //公開設定のプロットの場合(type=public)
                //bodyには設定とか表示しとくようにしてね
                //権限編集(plotAdmin)
                form.button({ rawtext: [{ translate: `edit` }] });
                form.button({ rawtext: [{ translate: `mc.button.close` }] });
                form.show(player).then((rs) => {
                    //権限あるか確認
                    if (rs.canceled) {
                        if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                            system.runTimeout(() => {
                                plotMainForm(player);
                                return;
                            }, 10)
                        };
                        return;
                    };
                    switch (rs.selection) {
                        case 0: {
                            if (isnot_plotAdmin) {
                                player.sendMessage({ rawtext: [{ translate: `no.permission` }] });
                                return;
                            };
                            //editForm
                            plotEditMainFormPlotAdmin(player, plot, chunkId);
                            break;
                        };
                    };
                });
                break;
            };
            case "private": {
                //私有地設定のプロットの場合(type=private)

                //国民のみ
                //国民以外は弾く処理
                if (chunkData?.countryId != playerData?.country) {
                    //メッセージ
                    player.sendMessage({ translate: `plot.error.no.people.this.country` });
                    return;
                };

                //管理者の場合
                if (!isnot_plotAdmin) {
                    form.button({ rawtext: [{ translate: `edit` }] });
                    form.button({ rawtext: [{ translate: `mc.button.close` }] });
                    form.show(player).then((rs) => {
                        if (rs.canceled) {
                            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                                system.runTimeout(() => {
                                    plotMainForm(player);
                                }, 10);
                                return;
                            };
                            return;
                        };
                        plotEditMainFormPlotAdmin(player, plot, chunkId);
                        return;
                    });
                    return;
                };

                //売り出し中
                if (plot.is_selling) {
                    //0 → 購入
                    form.button({ rawtext: [{ translate: `mc.button.buy` }] });
                    form.button({ rawtext: [{ translate: `mc.button.close` }] });
                    form.show(player).then((rs) => {
                        if (rs.canceled) {
                            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                                system.runTimeout(() => {
                                    plotMainForm(player);
                                    return;
                                }, 10)
                            };
                            return;
                        };
                        switch (rs.selection) {
                            case 0: {
                                //購入処理の関数を入れておいてね
                                plotGroupBuyForm(player, plot.id);
                                break;
                            };
                        };
                    });
                    return;
                };

                //売り出してない
                if (!plot.is_selling) {
                    //所有者ナシ
                    if (plot.owner) {
                        //所有者あり
                        //所有者でも管理者でもない場合
                        if (plot.owner != player.id && !player.hasTag(`adminmode`) && isnot_plotAdmin) {
                            //メッセージ表示
                            player.sendMessage({ translate: `plot.error.not.is_selling` });
                            return;
                        };
                        //管理者の場合
                        if (!isnot_plotAdmin) {
                            form.button({ rawtext: [{ translate: `edit` }] });
                            form.button({ rawtext: [{ translate: `mc.button.close` }] });
                            form.show(player).then((rs) => {
                                if (rs.canceled) {
                                    if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                                        system.runTimeout(() => {
                                            plotMainForm(player);
                                        }, 10);
                                        return;
                                    };
                                    return;
                                };
                                plotEditMainFormPlotAdmin(player, plot, chunkId);
                                return;
                            });
                        };
                        //所有者
                        //権限編集フォームを表示しといてね
                        plotGroupEditMainFormPlotOwner(player, plot.id);
                        return;
                    };
                };
                break;
            };
            case "embassy": {
                //大使館設定のプロットの場合(type=embassy)

                //国民の場合、権限がない場合は買えないようにしてくれ、管理者は変えれるように
                if (chunkData?.countryId == playerData?.country) {
                    if (plot.owner != player.id && !player.hasTag(`adminmode`) && isnot_plotAdmin) {
                        //メッセージ このチャンクは大使館です
                        player.sendMessage({ translate: `plot.this.plot.embassy` })
                        return;
                    } else {
                        //管理者の場合
                        form.button({ rawtext: [{ translate: `edit` }] });
                        form.button({ rawtext: [{ translate: `mc.button.close` }] });
                        form.show(player).then((rs) => {
                            if (rs.canceled) {
                                if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                                    system.runTimeout(() => {
                                        plotMainForm(player);
                                    }, 10);
                                    return;
                                };
                                return;
                            };
                            plotEditMainFormPlotAdmin(player, plot, chunkId);
                            return;
                        });
                        return;
                    };
                };

                if (plot?.owner) {
                    if (plot.owner == player.id) {
                        //オーナー
                        plotGroupEditMainFormPlotOwner(player, plot.id);
                        return;
                    };
                };

                //売り出し中 is_selling
                if (plot?.is_selling) {
                    plotGroupBuyForm(player, plot.id);
                    return;
                };
                //売り出してない !is_selling
                if (!plot?.is_selling) {
                    player.sendMessage({ translate: `plot.error.not.is_selling` })
                    return;
                };
                break;
            }
        };
        return;
    };
    switch (plot?.type) {
        case "public": {
            //自分の国じゃない場合
            if (chunkData?.countryId != playerData?.country) {
                //メッセージ
                player.sendMessage({ rawtext: [{ translate: `plot.failed.nonOwnCountryChunk` }] });
                return;
            };
            //公開設定のプロットの場合(type=public)
            //bodyには設定とか表示しとくようにしてね
            //権限編集(plotAdmin)
            form.button({ rawtext: [{ translate: `edit` }] });
            form.button({ rawtext: [{ translate: `mc.button.close` }] });
            form.show(player).then((rs) => {
                //権限あるか確認
                if (rs.canceled) {
                    if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                        system.runTimeout(() => {
                            plotMainForm(player);
                            return;
                        }, 10)
                    };
                    return;
                };
                switch (rs.selection) {
                    case 0: {
                        if (isnot_plotAdmin) {
                            player.sendMessage({ rawtext: [{ translate: `no.permission` }] });
                            return;
                        };
                        //editForm
                        plotEditMainFormPlotAdmin(player, plot, chunkId);
                        break;
                    };
                };
            });
            break;
        };
        case "private": {
            //私有地設定のプロットの場合(type=private)

            //国民のみ
            //国民以外は弾く処理
            if (chunkData?.countryId != playerData?.country) {
                //メッセージ
                player.sendMessage({ translate: `plot.error.no.people.this.country` });
                return;
            };

            //管理者の場合
            if (!isnot_plotAdmin) {
                form.button({ rawtext: [{ translate: `edit` }] });
                form.button({ rawtext: [{ translate: `mc.button.close` }] });
                form.show(player).then((rs) => {
                    if (rs.canceled) {
                        if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                            system.runTimeout(() => {
                                plotMainForm(player);
                            }, 10);
                            return;
                        };
                        return;
                    };
                    plotEditMainFormPlotAdmin(player, plot, chunkId);
                    return;
                });
                return;
            };

            //売り出し中
            if (plot.is_selling) {
                //0 → 購入
                form.button({ rawtext: [{ translate: `mc.button.buy` }] });
                form.button({ rawtext: [{ translate: `mc.button.close` }] });
                form.show(player).then((rs) => {
                    if (rs.canceled) {
                        if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                            system.runTimeout(() => {
                                plotMainForm(player);
                                return;
                            }, 10)
                        };
                        return;
                    };
                    switch (rs.selection) {
                        case 0: {
                            //購入処理の関数を入れておいてね
                            plotBuyForm(player, chunkId);
                            break;
                        };
                    };
                });
                return;
            };

            //売り出してない
            if (!plot.is_selling) {
                //所有者ナシ
                if (plot.owner) {
                    //所有者あり
                    //所有者でも管理者でもない場合
                    if (plot.owner != player.id && !player.hasTag(`adminmode`) && isnot_plotAdmin) {
                        //メッセージ表示
                        player.sendMessage({ translate: `plot.error.not.is_selling` });
                        return;
                    };
                    //管理者の場合
                    if (!isnot_plotAdmin) {
                        form.button({ rawtext: [{ translate: `edit` }] });
                        form.button({ rawtext: [{ translate: `mc.button.close` }] });
                        form.show(player).then((rs) => {
                            if (rs.canceled) {
                                if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                                    system.runTimeout(() => {
                                        plotMainForm(player);
                                    }, 10);
                                    return;
                                };
                                return;
                            };
                            plotEditMainFormPlotAdmin(player, plot, chunkId);
                            return;
                        });
                    };
                    //所有者
                    //権限編集フォームを表示しといてね
                    plotEditMainFormPlotOwner(player, plot, chunkId);
                    return;
                };
            };
            break;
        };
        case "embassy": {
            //大使館設定のプロットの場合(type=embassy)

            //国民の場合、権限がない場合は買えないようにしてくれ、管理者は変えれるように
            if (chunkData?.countryId == playerData?.country) {
                if (plot.owner != player.id && !player.hasTag(`adminmode`) && isnot_plotAdmin) {
                    //メッセージ このチャンクは大使館です
                    player.sendMessage({ translate: `plot.this.plot.embassy` });
                    return;
                } else {
                    //管理者の場合
                    form.button({ rawtext: [{ translate: `edit` }] });
                    form.button({ rawtext: [{ translate: `mc.button.close` }] });
                    form.show(player).then((rs) => {
                        if (rs.canceled) {
                            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                                system.runTimeout(() => {
                                    plotMainForm(player);
                                }, 10);
                                return;
                            };
                            return;
                        };
                        plotEditMainFormPlotAdmin(player, plot, chunkId);
                        return;
                    });
                    return;
                };
            };

            if (plot?.owner) {
                if (plot.owner == player.id) {
                    //オーナー
                    plotEditMainFormPlotOwner(player, plot, chunkId);
                    return;
                };
            };

            //売り出し中 is_selling
            if (plot?.is_selling) {
                plotBuyForm(player, chunkId);
                return;
            };
            //売り出してない !is_selling
            if (!plot?.is_selling) {
                player.sendMessage({ translate: `plot.error.not.is_selling` });
                return;
            };
            break;
        }
    };
};


/**
 * プロット購入フォーム
 * @param {Player} player 
 * @param {string} chunkId 
 */
export function plotBuyForm(player, chunkId) {
    const chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot ?? {
        group: undefined,
        is_selling: false,
        name: undefined,
        owner: undefined,
        players: [],
        roles: [],
        type: "public",
        price: 0,
        countries: [],
        permissions: [],
    };
    let body = [
        { translate: `plot.name` }, { text: `: ` }, { text: `${plot?.name} §r\n` },
    ];
    if (plot?.group) {
        body.unshift({ translate: `plot.is_group` }, { text: ` ID: ${plot.group}\n` })
    };
    //プロットグループに入ってる場合
    if (plot?.group) {
        const groupdata = GetAndParsePropertyData(`plotgroup_${plot?.group}`);
        if (!groupdata) {
            plot.group = null;
            chunkData.plot = plot;
            StringifyAndSavePropertyData(`${chunkId}`, chunkData);
        };
        if (groupdata) {
            plot = groupdata;
            body.unshift({ translate: `plotgroup.name` }, { text: `: ` }, { text: `${plot?.name} §r\n` })
        };
    };
    body.push(
        { translate: `plot.type` }, { text: `: ` }, { translate: `plot.${plot?.type}` }, { text: `\n` },
        { translate: `plot.price`, with: [`: ${config.MoneyName} ${plot?.price}\n`] },
        { translate: `plot.is_selling` }, { text: `: ${plot?.is_selling}\n` },
        { translate: `plot.is_enable` }, { text: `: ${plot?.enable}\n` },
    );
    if (plot?.owner) {
        body.push({ translate: `owner` }, { text: `: ${GetAndParsePropertyData(`player_${plot.owner}`)?.name} §r\n` })
    };

    const form = new ActionFormData();
    form.body({
        rawtext: body
    });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.buy` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    plotBuyForm(player, chunkId);
                }, 10);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotMainForm(player);
            };
            case 1: {
                const newChunkData = GetAndParsePropertyData(`${chunkId}`);
                if (!newChunkData) {
                    return;
                };
                let newPlot = newChunkData?.plot;
                if (!newPlot) {
                    return;
                };
                if (!newPlot?.is_selling) {
                    return;
                };
                const playerData = GetAndParsePropertyData(`player_${player.id}`);
                let money = playerData?.money ?? 0;
                if (money < newPlot?.price ?? 0) {
                    //金が足りない時
                    player.sendMessage({ translate: `error.notenough.money` });
                    return;
                };
                newPlot.is_selling = false;
                newPlot.owner = player.id;
                playerData.money -= newPlot?.price;
                newChunkData.plot = newPlot;
                StringifyAndSavePropertyData(`player_${player.id}`, playerData);
                StringifyAndSavePropertyData(`${chunkId}`, newChunkData);
                player.sendMessage({ translate: `finish.bought` });
                const [c, x, z, d] = chunkId.split('_');
                const countryId = GetAndParsePropertyData(chunkId)?.countryId;
            };
        };
    });
};

/**
 * プロットグループ購入フォーム
 * @param {Player} player 
 * @param {string} chunkId 
 */
export function plotGroupBuyForm(player, plotgroupId) {
    let plot = GetAndParsePropertyData(`plotgroup_${plotgroupId}`);
    if (!plot) {
        return;
    };
    let body = [];
    if (plot?.id) {
        body.unshift({ translate: `plot.is_group` }, { text: ` ID: ${plot.id}\n` })
    };
    //プロットグループに入ってる場合
    if (plot?.name) {
        body.unshift({ translate: `plotgroup.name` }, { text: `: ` }, { text: `${plot?.name} §r\n` })
    };
    body.push(
        { translate: `plot.type` }, { text: `: ` }, { translate: `plot.${plot?.type}` }, { text: `\n` },
        { translate: `plot.price`, with: [`: ${config.MoneyName} ${plot?.price}\n`] },
        { translate: `plot.is_selling` }, { text: `: ${plot?.is_selling}\n` },
        { translate: `plot.is_enable` }, { text: `: ${plot?.enable}\n` },
    );
    if (plot?.owner) {
        body.push({ translate: `owner` }, { text: `: ${GetAndParsePropertyData(`player_${plot.owner}`)?.name} §r\n` })
    };

    const form = new ActionFormData();
    form.body({
        rawtext: body
    });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.buy` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    plotGroupBuyForm(player, plotgroupId);
                }, 10)
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotMainForm(player);
            };
            case 1: {
                let newPlot = GetAndParsePropertyData(`plotgroup_${plotgroupId}`);
                if (!newPlot) {
                    return;
                };
                if (!newPlot?.is_selling) {
                    return;
                };
                const playerData = GetAndParsePropertyData(`player_${player.id}`);
                let money = playerData?.money ?? 0;
                if (money < newPlot?.price ?? 0) {
                    //金が足りない時
                    player.sendMessage({ translate: `error.notenough.money` });
                    return;
                };
                newPlot.is_selling = false;
                newPlot.owner = player.id;
                playerData.money -= newPlot?.price;
                StringifyAndSavePropertyData(`player_${player.id}`, playerData);
                StringifyAndSavePropertyData(`plotgroup_${plotgroupId}`, newPlot);
                player.sendMessage({ translate: `finish.bought` });
            };
        };
    });
};

/**
 * プロット作成フォーム
 * @param {Player} player  
 */
export function CreatePlotForm(player, chunkId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const countryData = GetAndParsePropertyData(`country_${playerData?.country}`);
    const plotGroups = [];
    const plotGroupsDatas = [];
    plotGroups.push({ rawtext: [{ translate: `none` }] });
    for (const group of countryData?.plotgroup ?? []) {
        const groupData = GetAndParsePropertyData(`plotgroup_${group}`);
        plotGroups.push({ text: `${groupData?.name}` });
        plotGroupsDatas.push(groupData);
    };
    const type = ["public", "private", "embassy"];
    const typeMessges = [
        { rawtext: [{ translate: `plot.public` }] },
        { rawtext: [{ translate: `plot.private` }] },
        { rawtext: [{ translate: `plot.embassy` }] },
    ];
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `form.plot.create` }] });
    form.dropdown({ rawtext: [{ translate: `plot.group` }] }, plotGroups);
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] });
    form.dropdown({ rawtext: [{ translate: `plot.type` }] }, typeMessges);
    form.submitButton({ rawtext: [{ translate: `create.plot.button` }] });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return plotMainForm(player);
        };
        if (rs.formValues[0] !== 0) {
            createPlotToGroup(player, countryData?.plotgroup[rs.formValues[0] - 1], chunkId);
            return;
        };
        createPlot(player, rs.formValues[1], chunkId, type[rs.formValues[2]]);
        return;
    });
};

/**
 * プロットアドミン用の編集フォーム
 * @param {Player} player 
 * @param {{is_selling: boolean,group: string|undefined,country: number|undefined,name: string|undefined,owner: string|undefined,permissions: [string],roles: [{id: number,permissions: [string]}],countries: [{id: number,permissions: [string]}],players: [{id: string,permissions: [string]}],type: "public"|"private"|"embassy",price: number|0, } | undefined} plot
 */
export function plotEditMainFormPlotAdmin(player, plot, chunkId) {
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.title` }] });
    form.button({ translate: `plot.edit.menu.button.settings` });
    form.button({ translate: `plot.edit.menu.button.permissions` });
    form.button({ translate: `plot.edit.menu.button.player` });
    form.button({ translate: `plot.edit.menu.button.country` });
    form.button({ translate: `plot.edit.menu.button.role` });
    form.button({ translate: `plot.edit.menu.button.owner` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotMainForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロット設定ModalForm
                plotEditSettingFormPlotAdmin(player, chunkId);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                plotEditPermissionsForm(player, chunkId, true);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                plotEditPlayersListForm(player, chunkId, true);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                plotEditCountriesListForm(player, chunkId, true);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                plotEditRolesListForm(player, chunkId, true);
                break;
            };
            case 5: {
                //プロットの所有者管理ActionForm
                plotOwnerShowForm(player, chunkId, true);
                break;
            };
        };
    });
};


/*
 * メインフォーム
 * ----------------------------------------------
 * 所有者用の編集フォーム
 */

/**
 * 所有者用の編集フォーム
 * @param {Player} player 
 * @param {{is_selling: boolean,group: string|undefined,country: number|undefined,name: string|undefined,owner: string|undefined,permissions: [string],roles: [{id: number,permissions: [string]}],countries: [{id: number,permissions: [string]}],players: [{id: string,permissions: [string]}],type: "public"|"private"|"embassy",price: number|0, } | undefined} plot
 */
export function plotEditMainFormPlotOwner(player, plot, chunkId) {
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.title` }] });
    form.button({ translate: `plot.edit.menu.button.settings` });
    form.button({ translate: `plot.edit.menu.button.permissions` });
    form.button({ translate: `plot.edit.menu.button.player` });
    form.button({ translate: `plot.edit.menu.button.country` });
    form.button({ translate: `plot.edit.menu.button.role` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    plotEditMainFormPlotOwner(player, plot, chunkId);
                }, 10);
                return;
            };
            return;
        };
        switch (rs.selection) {
            case 0: {
                //プロット設定ModalForm
                plotEditSettingFormPlotOwner(player, chunkId);
                break;
            };
            case 1: {
                //プロットのデフォルト権限ModalForm
                plotEditPermissionsForm(player, chunkId);
                break;
            };
            case 2: {
                //プロットのプレイヤー管理ActionForm
                plotEditPlayersListForm(player, chunkId);
                break;
            };
            case 3: {
                //プロットの国管理ActionForm
                plotEditCountriesListForm(player, chunkId);
                break;
            };
            case 4: {
                //プロットのロール管理ActionForm
                plotEditRolesListForm(player, chunkId);
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
function plotOwnerShowForm(player, chunkId, plotAdmin = false) {
    let beforeChunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = beforeChunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
                plotEditMainFormPlotAdmin(player, plot, chunkId);
                return;
            };
            plotEditMainFormPlotOwner(player, plot, chunkId);
            return;
        };
        switch (rs.selection) {
            case 0: {
                if (plotAdmin) {
                    plotEditMainFormPlotAdmin(player, plot, chunkId);
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
                let chunkData = GetAndParsePropertyData(`${chunkId}`);
                let plot = chunkData?.plot || {
                    group: undefined,
                    is_selling: false,
                    name: ``,
                    owner: null,
                    players: [],
                    permissions: [],
                    type: `public`,
                    price: 0,
                    roles: [],
                    countries: [],
                    enable: false,
                };
                plot.owner = null;
                chunkData.plot = plot;
                StringifyAndSavePropertyData(`${chunkId}`, chunkData);
                plotEditRolesListForm(player, chunkId, plotAdmin);
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
function plotEditRolesListForm(player, chunkId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.role` }] });
    let chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot ?? {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
    };
    if (!plot?.roles) plot.roles = [];
    form.button({ translate: `mc.button.role.add` });
    const roles = [];
    for (const roleRawData of plot?.roles) {
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
    plot.roles = plot?.roles.filter(d => aliveRoles.includes(d.id));
    chunkData.plot = plot;
    StringifyAndSavePropertyData(`${chunkId}`, chunkData);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotEditMainFormPlotAdmin(player, plot, chunkId);
                return;
            };
            plotEditMainFormPlotOwner(player, plot, chunkId);
            return;
        };
        if (rs.selection == 0) {
            roleAddPlotForm(player, chunkId, plotAdmin);
            return;
        };
        roleSelectedShowForm(player, aliveRolesData[rs.selection - 1], chunkId, plotAdmin);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} chunkId 
 * @param {boolean} plotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function roleAddPlotForm(player, chunkId, plotAdmin, search = false, keyword = ``) {
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
    let chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
    };
    if (!plot?.roles) plot.roles = [];
    let aliveRoles = [];
    for (const r of roles) {
        if (plot.roles.find(d => d?.id == r.id)) continue;
        aliveRoles.push(r);
        form.button(`${r?.name}§r\nID: ${r?.id}`);
    };
    form.show(player).then(rs => {
        if (rs.canceled) {
            plotEditRolesListForm(player, chunkId, plotAdmin);
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
                chunkData.plot = plot;
                StringifyAndSavePropertyData(chunkId, chunkData);
                plotEditRolesListForm(player, chunkId, plotAdmin);
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
function roleSelectedShowForm(player, targetData, chunkId, plotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotEditRolesListForm(player, chunkId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotEditRolesListForm(player, chunkId, plotAdmin);
                break;
            };
            case 1: {
                //ロールの権限編集
                rolePermissionsEditForm(player, chunkId, targetData, plotAdmin);
                break;
            };
            case 2: {
                //ロールの削除
                let chunkData = GetAndParsePropertyData(`${chunkId}`);
                let plot = chunkData?.plot || {
                    group: undefined,
                    is_selling: false,
                    name: ``,
                    owner: null,
                    players: [],
                    permissions: [],
                    type: `public`,
                    price: 0,
                    roles: [],
                    countries: [],
                    enable: false,
                };
                if (!plot?.roles) plot.roles = [];
                plot.roles.splice(plot.roles.indexOf(d => d.id == targetData.id), 1);
                chunkData.plot = plot;
                StringifyAndSavePropertyData(`${chunkId}`, chunkData);
                plotEditRolesListForm(player, chunkId, plotAdmin);
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
function rolePermissionsEditForm(player, chunkId, targetData, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
                roleSelectedShowForm(player, targetData, chunkId, plotAdmin);
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
        const index = chunkData?.plot?.roles.findIndex(d => d.id == target.id);
        if (index != -1) {
            chunkData.plot.roles[index] = target;
        } else {
            chunkData?.plot?.roles.push(target);
        };
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        if (plotAdmin) {
            roleSelectedShowForm(player, targetData, chunkId, plotAdmin);
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
function plotEditCountriesListForm(player, chunkId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.country` }] });
    let chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
    chunkData.plot = plot;
    StringifyAndSavePropertyData(`${chunkId}`, chunkData);

    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotEditMainFormPlotAdmin(player, plot, chunkId);
                return;
            };
            plotEditMainFormPlotOwner(player, plot, chunkId);
            return;
        };
        if (rs.selection == 0) {
            countryAddPlotForm(player, chunkId, plotAdmin);
            return;
        };
        countrySelectedShowForm(player, aliveCountriesData[rs.selection - 1], chunkId, plotAdmin);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} chunkId 
 * @param {boolean} plotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function countryAddPlotForm(player, chunkId, plotAdmin, search = false, keyword = ``) {
    const form = new ActionFormData();
    form.title({ translate: `form.plot.addcountry.list.title` });
    form.button({ translate: `form.plot.addcountry.button.serch` });
    const countryDataBase = new DynamicProperties('country')
    const countryIds = countryDataBase.idList;
    let countries = [];
    countryIds.forEach(id => {
        countries[countries.length] = GetAndParsePropertyData(id);
    });

    if (search) {
        countries = countries.filter(c => c?.name.includes(keyword));
    };
    let chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
    chunkData.plot = plot;
    StringifyAndSavePropertyData(`${chunkId}`, chunkData);

    form.show(player).then(rs => {
        if (rs.canceled) {
            plotEditCountriesListForm(player, chunkId, plotAdmin);
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
                chunkData.plot = plot;
                StringifyAndSavePropertyData(chunkId, chunkData);
                plotEditCountriesListForm(player, chunkId, plotAdmin);
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
function countrySelectedShowForm(player, targetData, chunkId, plotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotEditCountriesListForm(player, chunkId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotEditCountriesListForm(player, chunkId, plotAdmin);
                break;
            };
            case 1: {
                //国の権限編集
                countryPermissionsEditForm(player, chunkId, targetData, plotAdmin);
                break;
            };
            case 2: {
                //国の削除
                let chunkData = GetAndParsePropertyData(`${chunkId}`);
                let plot = chunkData?.plot || {
                    group: undefined,
                    is_selling: false,
                    name: ``,
                    owner: null,
                    players: [],
                    permissions: [],
                    type: `public`,
                    price: 0,
                    roles: [],
                    countries: [],
                    enable: false,
                };
                if (!plot?.countries) plot.countries = [];
                plot.countries = plot.countries.filter(d => aliveCountries.includes(d.id));
                chunkData.plot = plot;
                StringifyAndSavePropertyData(`${chunkId}`, chunkData);
                plotEditCountriesListForm(player, chunkId, plotAdmin);
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
function countryPermissionsEditForm(player, chunkId, targetData, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
                countrySelectedShowForm(player, targetData, chunkId, plotAdmin);
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
        const index = chunkData?.plot?.countries.findIndex(d => d.id == target.id);
        if (index != -1) {
            chunkData.plot.countries[index] = target;
        } else {
            chunkData?.plot?.countries.push(target);
        };
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        if (plotAdmin) {
            countrySelectedShowForm(player, targetData, chunkId, plotAdmin);
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
function plotEditPlayersListForm(player, chunkId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.player` }] });
    let chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
                plotEditMainFormPlotAdmin(player, plot, chunkId);
                return;
            };
            plotEditMainFormPlotOwner(player, plot, chunkId);
            return;
        };
        if (rs.selection == 0) {
            playerAddPlotForm(player, chunkId, plotAdmin);
            return;
        };
        playerSelectedShowForm(player, players[rs.selection - 1], chunkId, plotAdmin);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 * @param {string} chunkId 
 * @param {boolean} plotAdmin 
 * @param {boolean} serch 
 * @param {string} keyword 
 */
export function playerAddPlotForm(player, chunkId, plotAdmin, serch = false, keyword = ``) {
    const form = new ActionFormData();
    let players = world.getPlayers();
    form.title({ translate: `form.plot.addplayer.list.title` });
    form.button({ translate: `form.plot.addplayer.button.serch` });
    if (serch) {
        players = players.filter(p => p.name.includes(keyword));
    };
    let chunkData = GetAndParsePropertyData(`${chunkId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
            plotEditPlayersListForm(player, chunkId, plotAdmin);
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
                chunkData.plot = plot;
                StringifyAndSavePropertyData(chunkId, chunkData);
                plotEditPlayersListForm(player, chunkId, plotAdmin);
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
function playerSelectedShowForm(player, targetData, chunkId, plotAdmin = false) {
    const form = new ActionFormData();
    form.title({ text: `${targetData?.name}` });
    form.button({ translate: `mc.button.back` });
    form.button({ translate: `mc.button.edit.permission` });
    form.button({ translate: `mc.button.delete` });
    form.button({ translate: `mc.button.close` });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotEditPlayersListForm(player, chunkId, plotAdmin);
            return;
        };
        switch (rs.selection) {
            case 0: {
                plotEditPlayersListForm(player, chunkId, plotAdmin);
                break;
            };
            case 1: {
                //プレイヤーの権限編集
                playerPermissionsEditForm(player, chunkId, targetData, plotAdmin);
                break;
            };
            case 2: {
                //プレイヤーの削除
                let chunkData = GetAndParsePropertyData(`${chunkId}`);
                let plot = chunkData?.plot || {
                    group: undefined,
                    is_selling: false,
                    name: ``,
                    owner: null,
                    players: [],
                    permissions: [],
                    type: `public`,
                    price: 0,
                    roles: [],
                    countries: [],
                    enable: false,
                };
                if (!plot?.players) plot.players = [];
                plot.players.splice(plot.players.indexOf(d => d.id == targetData.id), 1);
                chunkData.plot = plot;
                StringifyAndSavePropertyData(`${chunkId}`, chunkData);
                plotEditPlayersListForm(player, chunkId, plotAdmin);
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
function playerPermissionsEditForm(player, chunkId, targetData, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
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
                playerSelectedShowForm(player, targetData, chunkId, plotAdmin);
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
        const index = chunkData?.plot?.players.findIndex(d => d.id == target.id);
        if (index != -1) {
            chunkData.plot.players[index] = target;
        } else {
            chunkData?.plot?.players.push(target);
        };
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        if (plotAdmin) {
            playerSelectedShowForm(player, targetData, chunkId, plotAdmin);
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
function plotEditPermissionsForm(player, chunkId, plotAdmin = false) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.permissions` }] });
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
    };
    if (!plot?.permissions) plot.permissions = [];
    for (const permission of landPermissions) {
        form.toggle({ translate: `permission.${permission}` }, plot?.permissions.includes(permission));
    };
    form.submitButton({ translate: `mc.button.save` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            if (plotAdmin) {
                plotEditMainFormPlotAdmin(player, plot, chunkId);
                return;
            };
            plotEditMainFormPlotOwner(player, plot, chunkId);
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
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        if (plotAdmin) {
            plotEditMainFormPlotAdmin(player, plot, chunkId);
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
function plotEditSettingFormPlotAdmin(player, chunkId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const countryData = GetAndParsePropertyData(`country_${playerData?.country}`);
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.settings` }] });
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
    };
    const plotGroups = [];
    const plotGroupsDatas = [];
    plotGroups.push({ rawtext: [{ translate: `none` }] });
    for (const group of countryData?.plotgroup ?? []) {
        const groupData = GetAndParsePropertyData(`plotgroup_${group}`);
        plotGroups.push(groupData?.name);
        plotGroupsDatas.push(groupData);
    };
    const groupIndex = plot?.group ? plotGroupsDatas.findIndex(d => d.id === plot?.group) + 1 : 0;

    const type = ["public", "private", "embassy"];
    const typeMessges = [
        { rawtext: [{ translate: `plot.public` }] },
        { rawtext: [{ translate: `plot.private` }] },
        { rawtext: [{ translate: `plot.embassy` }] },
    ];
    form.dropdown({ rawtext: [{ translate: `plot.group` }] }, plotGroups, groupIndex);
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] }, plot?.name ?? `new Plot`);
    form.dropdown({ rawtext: [{ translate: `plot.type` }] }, typeMessges, type.indexOf(plot?.type ?? `public`));
    form.textField({ translate: `plot.price`, with: [`${config.MoneyName} ${plot?.price ?? 0}`] }, { translate: `plot.price.input` }, `${plot?.price ?? 0}`);
    form.toggle({ translate: `plot.selling` }, plot?.is_selling);
    form.toggle({ translate: `plot.enable` }, plot?.enable);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotEditMainFormPlotAdmin(player, plot, chunkId);
            return;
        };
        if (rs.formValues[0] != 0) {
            addPlotToGroup(player, countryData?.plotgroup[rs.formValues[0] - 1], chunkId);
            return;
        };
        //値段チェック
        let newPlotName = rs.formValues[1];
        if (newPlotName == ``) {
            newPlotName = `new Plot`;
        };
        let price = rs.formValues[3];
        if (isDecimalNumberZeroOK(price)) {
            price = `0`;
        };
        if (Number(price) < 0) {
            price = `0`;
        };
        plot.group = undefined;
        plot.name = newPlotName;
        plot.price = Math.floor(Number(price));
        plot.type = type[rs.formValues[2]];
        plot.is_selling = rs.formValues[4];
        plot.enable = rs.formValues[5];
        chunkData.plot = plot;
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        plotEditMainFormPlotAdmin(player, plot, chunkId);
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
function plotEditSettingFormPlotOwner(player, chunkId) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    if (!playerData?.country) return;
    const form = new ModalFormData();
    form.title({ rawtext: [{ translate: `plot.edit.menu.button.settings` }] });
    const dypId = chunkId;
    let chunkData = GetAndParsePropertyData(`${dypId}`);
    let plot = chunkData?.plot || {
        group: undefined,
        is_selling: false,
        name: ``,
        owner: null,
        players: [],
        permissions: [],
        type: `public`,
        price: 0,
        roles: [],
        countries: [],
        enable: false,
    };
    form.textField({ rawtext: [{ translate: `plot.name` }] }, { rawtext: [{ translate: `input.plot.name` }] }, plot?.name ?? `new Plot`);
    form.textField({ translate: `plot.price` }, { translate: `plot.price.input`, with: [`${config.MoneyName} ${plot?.price ?? 0}`] });
    form.toggle({ translate: `plot.selling` }, plot?.is_selling);
    form.toggle({ translate: `plot.enable` }, plot?.enable);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            plotEditMainFormPlotOwner(player, plot, chunkId);
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
        chunkData.plot = plot;
        StringifyAndSavePropertyData(`${dypId}`, chunkData);
        plotEditMainFormPlotOwner(player, plot, chunkId);
        return;
    });
};