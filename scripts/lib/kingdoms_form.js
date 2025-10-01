import { Player } from "@minecraft/server";
import { ChestFormData } from "./chest-ui";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId, isDecimalNumber, isDecimalNumberZeroOK, StringifyAndSavePropertyData } from "./util";
import config from "../config";
import { ModalFormData } from "@minecraft/server-ui";

/**
 * 
 * @param {Player} player 
 */
export function kingdomsSettingForm(player) {
    const playerData = GetAndParsePropertyData('player_' + player.id);
    const countryData = GetAndParsePropertyData('country_' + playerData.country);
    const form = new ChestFormData();
    form.setTitle([{ text: `-=( §0` }, { translate: 'form.kingdoms.sc.button.setting' }, { text: ' §0)=-' }]);
    form.setPattern([0, 0], [
        'boohltooo',
        'oxxxxxxxo',
        'oxwomopxo',
        'oxoooooxo',
        'oxiocogxo',
        'oxxxxxxxo',
    ], {
        'b': { 'iconPath': 'textures/ui/arrow_left', 'name': [{ text: '§2' }, { translate: 'mc.button.back' }], 'lore': [], 'editedName': true },
        'x': { 'iconPath': 'textures/blocks/glass_blue', 'name': '', 'lore': [], 'editedName': true },
        'o': { 'iconPath': 'textures/blocks/glass_light_blue', 'name': '', 'lore': [], 'editedName': true },
        'i': { 'iconPath': 'textures/items/book_normal', 'name': [{ text: '§6' }, { translate: 'form.makecountry.invite' }, { text: `§7: ${countryData.invite ? '§a✓' : '§c✘'}` }], 'lore': ['form.kingdoms.setting.button.invite.lore'], 'editedName': true },
        'p': { 'iconPath': 'textures/items/end_crystal', 'name': [{ text: '§6' }, { translate: 'form.makecountry.peace' }, { text: `§7: ${countryData.peace ? '§a✓' : '§c✘'}` }], 'lore': [{ translate: 'form.kingdoms.setting.button.peace.lore', with: [String(countryData.peaceChangeCooltime)] }], 'editedName': true },
        'h': { 'iconPath': 'textures/items/door_dark_oak', 'name': [{ text: '§6' }, { translate: 'form.setting.info.button.publicspawn' }, { text: `§7: ${countryData.publicSpawn ? '§a✓' : '§c✘'}` }], 'lore': [{ translate: 'form.kingdoms.setting.button.publichome.lore', with: [String(countryData.peaceChangeCooltime)] }], 'editedName': true },
        'l': { 'iconPath': 'textures/items/door_iron', 'name': [{ text: '§6' }, { translate: 'form.kingdoms.setting.button.spawn' }], 'lore': [{ translate: 'form.kingdoms.setting.button.spawn.lore', with: [String(countryData.peaceChangeCooltime)] }], 'editedName': true },
        'c': { 'iconPath': 'textures/items/dye_powder_lime', 'name': [{ text: '§6' }, { translate: 'web.color.textbox.label' }, { text: `§7 §a(${countryData.colorcode})` }], 'lore': [{ translate: 'form.kingdoms.setting.button.color.lore', with: [String(countryData.peaceChangeCooltime)] }], 'editedName': true },
        't': { 'iconPath': 'textures/items/paper', 'name': [{ text: '§6' }, { translate: 'form.setting.info.button.tax' }], 'lore': [{ translate: 'form.kingdoms.setting.button.tax.lore', with: [String(countryData.taxPer), String(countryData.taxInstitutionIsPer)] }], 'editedName': true },
        'w': { 'iconPath': 'textures/items/book_writable', 'name': [{ text: '§6' }, { translate: 'form.setting.info.button.external.affairs' }], 'lore': [{ translate: 'form.kingdoms.setting.button.external.lore', with: [String(countryData.taxPer), String(countryData.taxInstitutionIsPer)] }], 'editedName': true },
        'm': { 'iconPath': 'textures/items/banner_pattern', 'name': [{ text: '§6' }, { translate: 'web.banner.textbox.label' }], 'lore': [{ translate: 'form.kingdoms.setting.button.banner.lore', with: [String(countryData.taxPer), String(countryData.taxInstitutionIsPer)] }], 'editedName': true },
        'g': { 'iconPath': 'textures/items/gold_ingot', 'name': [{ text: '§6' }, { translate: 'form.setting.info.button.publicsetting' }, { text: `§7: ${!countryData.hideMoney ? '§a✓' : '§c✘'}` }], 'lore': [{ translate: 'form.kingdoms.setting.button.publicsetting.lore', with: [String(countryData.taxPer), String(countryData.taxInstitutionIsPer)] }], 'editedName': true },
    });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            //settingCountry(player);
            return;
        };
        switch (rs.selection) {
            //戻る
            case 0: {
                break;
            };
            //パブリックホームの有効化
            case 3: {
                if (CheckPermission(player, `publicHomeAdmin`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                countryData.publicSpawn = !countryData.publicSpawn;
                StringifyAndSavePropertyData('country_' + playerData.country, countryData);
                kingdomsSettingForm(player);
                break;
            };
            //パブリックホームのセット
            case 4: {
                if (CheckPermission(player, `publicHomeAdmin`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                const chunkData = GetAndParsePropertyData(GetPlayerChunkPropertyId(player));
                if (!chunkData) {
                    player.sendMessage({ translate: `publichome.set.error.within.country` });
                    return;
                };
                if (!chunkData?.countryId) {
                    player.sendMessage({ translate: `publichome.set.error.within.country` });
                    return;
                };
                if (chunkData?.countryId != playerData?.country) {
                    player.sendMessage({ translate: `publichome.set.error.within.country` });
                    return;
                };
                let { x, y, z } = player.location;
                let { x: rx, y: ry } = player.getRotation();
                let spawnString = `${Math.ceil(x) - 0.5}_${Math.ceil(y)}_${Math.ceil(z) - 0.5}_${Math.ceil(rx)}_${Math.ceil(ry)}_${player.dimension.id}`;
                countryData[`spawn`] = spawnString;
                player.sendMessage({ translate: `updated` });
                StringifyAndSavePropertyData('country_' + playerData.country, countryData);
                break;
            };
            //税金
            case 5: {
                if (CheckPermission(player, `taxAdmin`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                //税金フォーム
                taxForm(player);
                break;
            };
            //招待制
            case 38: {
                if (CheckPermission(player, `inviteChange`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                countryData.invite = !countryData.invite;
                StringifyAndSavePropertyData('country_' + playerData.country, countryData);
                kingdomsSettingForm(player);
                break;
            };
            //国旗
            case 22: {
                if (CheckPermission(player, `admin`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                //国旗フォーム
                flagForm(player);
                break;
            };
            //平和主義の切り替え
            case 24: {
                if (CheckPermission(player, `peaceChange`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                if (0 < countryData.peaceChangeCooltime) {
                    player.sendMessage({ rawtext: [{ text: `§a[MakeCountry]§r\n` }, { translate: `peace.cooltime` }, { text: ` (${countryData.peaceChangeCooltime})` }] });
                    kingdomsSettingForm(player);
                    return;
                };
                countryData.peace = !countryData.peace;
                countryData.peaceChangeCooltime = config.peaceChangeCooltime;
                StringifyAndSavePropertyData('country_' + playerData.country, countryData);
                kingdomsSettingForm(player);
                break;
            };
            //領土の色
            case 40: {
                if (CheckPermission(player, `admin`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                //色変えフォーム
                colorSetFormMain(player);
                break;
            };
            //公開設定
            case 42: {
                if (CheckPermission(player, `admin`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                countryData.hideMoney = !countryData.hideMoney;
                StringifyAndSavePropertyData('country_' + playerData.country, countryData);
                kingdomsSettingForm(player);
                break;
            };
            default: {
                kingdomsSettingForm(player);
                break;
            };
        };
    });

};

function colorSetFormMain(player) {
    const form = new ChestFormData();
    form.setTitle([{ text: '§l-=( §2C§4o§9l§eo§1r §0Picker )=-' }]);
    form.setPattern([0, 0], [
        'ooo-oiooo',
        'ooooooooo',
        ' 12      ',
        ' 34 abcd ',
        ' 56 efgh ',
        ' 78      ',
    ], {
        '-': { 'iconPath': 'minecraft:barrier', 'name': [{ text: '§c' }, { translate: 'mc.button.back' }], 'lore': [], 'editedName': true },
        'i': { 'iconPath': 'textures/items/paper', 'name': 'form.kingdoms.color.button.input', 'lore': [], 'editedName': true },
        'o': { 'iconPath': 'textures/blocks/glass_black', 'name': '', 'lore': [], 'editedName': true },
        '1': { 'iconPath': 'minecraft:redstone_block', 'name': '§4#950606', 'lore': [], 'editedName': true },
        '2': { 'iconPath': 'minecraft:lapis_block', 'name': '§1#0000AA', 'lore': [], 'editedName': true },
        '3': { 'iconPath': 'minecraft:red_wool', 'name': '§c#FF5555', 'lore': [], 'editedName': true },
        '4': { 'iconPath': 'minecraft:blue_wool', 'name': '§9#5555FF', 'lore': [], 'editedName': true },
        '5': { 'iconPath': 'minecraft:orange_wool', 'name': '§6#DDD605', 'lore': [], 'editedName': true },
        '6': { 'iconPath': 'minecraft:cyan_wool', 'name': '§3#00AAAA', 'lore': [], 'editedName': true },
        '7': { 'iconPath': 'minecraft:yellow_wool', 'name': '§e#FFFF55', 'lore': [], 'editedName': true },
        '8': { 'iconPath': 'minecraft:light_blue_wool', 'name': '§b#55FFFF', 'lore': [], 'editedName': true },
        'a': { 'iconPath': 'minecraft:black_wool', 'name': '§0#000000', 'lore': [], 'editedName': true },
        'b': { 'iconPath': 'minecraft:gray_wool', 'name': '§8#555555', 'lore': [], 'editedName': true },
        'c': { 'iconPath': 'minecraft:purple_wool', 'name': '§5#AA00AA', 'lore': [], 'editedName': true },
        'd': { 'iconPath': 'minecraft:green_wool', 'name': '§2#00AA00', 'lore': [], 'editedName': true },
        'e': { 'iconPath': 'minecraft:white_wool', 'name': '§f#FFFFFF', 'lore': [], 'editedName': true },
        'f': { 'iconPath': 'minecraft:light_gray_wool', 'name': '§7#AAAAAA', 'lore': [], 'editedName': true },
        'g': { 'iconPath': 'minecraft:magenta_wool', 'name': '§d#FF55FF', 'lore': [], 'editedName': true },
        'h': { 'iconPath': 'minecraft:lime_wool', 'name': '§a#55FF55', 'lore': [], 'editedName': true },
    });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            return;
        };
        let color = '';
        switch (rs.selection) {
            //戻る
            case 3: {
                kingdomsSettingForm(player);
                return;
            };
            //入力フォーム
            case 5: {
                //入力フォーム
                colorInputForm(player);
                return;
            };
            case 19: {
                color = '#950606';
                break;
            }; 
            case 20: {
                color = '#0000AA';
                break;
            };
            case 28: {
                color = '#FF5555';
                break;
            }; 
            case 29: {
                color = '#5555FF';
                break;
            };
            case 37: {
                color = '#DDD605';
                break;
            };
            case 38: {
                color = '#00AAAA';
                break;
            };
            case 46: {
                color = '#FFFF55';
                break;
            };
            case 47: {
                color = '#55FFFF';
                break;
            };
            case 31: {
                color = '#000000';
                break;
            };
            case 32: {
                color = '#555555';
                break;
            };
            case 33: {
                color = '#AA00AA';
                break;
            };
            case 34: {
                color = '#00AA00';
                break;
            };
            case 40: {
                color = '#FFFFFF';
                break;
            };
            case 41: {
                color = '#AAAAAA';
                break;
            };
            case 42: {
                color = '#FF55FF';
                break;
            };
            case 43: {
                color = '#55FF55';
                break;
            };
            default: {
                colorSetFormMain(player);
                return;
            };
        };
        const playerData = GetAndParsePropertyData('player_' + player.id);
        const countryData = GetAndParsePropertyData('country_' + playerData.country);
        if(!countryData) return;
        countryData.colorcode;
        StringifyAndSavePropertyData(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        colorSetFormMain(player);
    });
};

function colorInputForm(player) {
    const form = new ModalFormData();
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    let countryData = GetAndParsePropertyData(`country_${playerData.country}`);
    form.title({ translate: `web.color.textbox.label` });
    form.textField({ translate: `web.color.textbox.label` }, { translate: `web.color.textbox.input` }, countryData.colorcode);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            colorSetFormMain(player);
            return;
        };
        countryData.colorcode = rs.formValues[0];
        StringifyAndSavePropertyData(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        kingdomsSettingForm(player);
        return;
    });
};

function flagForm(player) {
    const form = new ModalFormData();
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    let countryData = GetAndParsePropertyData(`country_${playerData.country}`);
    form.title({ translate: `web.banner.textbox.label` });
    form.textField({ translate: `web.banner.textbox.label` }, { translate: `web.banner.textbox.input` }, countryData.banner);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            kingdomsSettingForm(player);
            return;
        };
        countryData.banner = rs.formValues[0];
        StringifyAndSavePropertyData(`country_${playerData.country}`, countryData);
        player.sendMessage({ translate: `updated` });
        kingdomsSettingForm(player);
        return;
    });
};

function taxForm(player) {
    const form = new ModalFormData();
    const lastPlayerData = GetAndParsePropertyData(`player_${player.id}`)
    const lastountryData = GetAndParsePropertyData(`country_${lastPlayerData?.country}`);
    let taxMessageLabel = `label.input.taxnum`;
    if (lastountryData.taxInstitutionIsPer) taxMessageLabel = `label.input.taxper`;
    form.title({ translate: `form.setting.info.button.tax` })
    form.toggle({ translate: `tax.select.toggle.label` }, lastountryData.taxInstitutionIsPer);
    form.textField({ translate: taxMessageLabel }, { translate: `input.number` }, `${lastountryData.taxPer}`);
    form.show(player).then((rs) => {
        if (rs.canceled) {
            kingdomsSettingForm(player);
            return;
        };
        const cancel = CheckPermission(player, `taxAdmin`);
        if (cancel) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        let value = rs.formValues[1];
        if (!isDecimalNumberZeroOK(value)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        if (100 < Number(rs.formValues[1]) && rs.formValues[0] == true) {
            player.sendMessage({ translate: `input.error.over100` });
            return;
        };
        if (Number(rs.formValues[1]) < 0) {
            player.sendMessage({ translate: `input.error.under0` });
            return;
        };
        const playerData = GetAndParsePropertyData(`player_${player.id}`);
        const countryData = GetAndParsePropertyData(`country_${playerData.country}`);
        countryData.taxInstitutionIsPer = rs.formValues[0];
        countryData.taxPer = Number(rs.formValues[1]);
        StringifyAndSavePropertyData(`country_${countryData.id}`, countryData);
        player.sendMessage({ translate: `updated` });
        kingdomsSettingForm(player);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 */
export function resourcePointConverter(player) {
    const playerData = GetAndParsePropertyData('player_' + player.id);
    const countryData = GetAndParsePropertyData('country_' + playerData.country);
    const form = new ChestFormData('single');
    form.setTitle([{ text: `-=( §0` }, { translate: 'form.kingdoms.sc.button.resourcepoint' }, { text: ' §0)=-' }]);
    form.setPattern([2, 0], [
        'boowsdooo',
    ], {
        'b': { 'iconPath': 'textures/ui/arrow_left', 'name': [{ text: '§2' }, { translate: 'mc.button.back' }], 'lore': [], 'editedName': true },
        'x': { 'iconPath': 'textures/blocks/glass_blue', 'name': '', 'lore': [], 'editedName': true },
        'o': { 'iconPath': 'textures/blocks/glass_lime', 'name': '', 'lore': [], 'editedName': true },
        's': { 'iconPath': 'textures/items/nether_star', 'name': [{ translate: 'form.kingdoms.resourcepoint.button.show', with: [String(countryData.resourcePoint)] }], 'lore': [], 'editedName': true, 'isGlint': true, },
        'w': { 'iconPath': 'textures/items/paper', 'name': 'form.kingdoms.resourcepoint.button.withdraw', 'lore': ['form.kingdoms.resourcepoint.button.withdraw.lore'], 'editedName': true },
        'd': { 'iconPath': 'textures/items/paper', 'name': 'form.kingdoms.resourcepoint.button.deposit', 'lore': ['form.kingdoms.resourcepoint.button.deposit.lore'], 'editedName': true },
    });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            //settingCountry(player);
            return;
        };
        switch (rs.selection) {
            //国の設定
            case 18: {
                //settingCountry(player);
                break;
            };
            //出金
            case 21: {
                if (CheckPermission(player, `withDrawResourcepoint`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                withDrawRPForm(player);
                break;
            };
            case 23: {
                if (CheckPermission(player, `withDrawResourcepoint`)) {
                    player.sendMessage({ translate: `no.permission` });
                    return;
                };
                depositRPForm(player);
                break;
            };
            default: {
                resourcePointConverter(player);
                break;
            };
        };
    });

};

/**
 * リソポ出金
 * @param {Player} player 
 */
function withDrawRPForm(player) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const countryData = GetAndParsePropertyData(`country_${playerData.country}`);
    const form = new ModalFormData();
    form.title({ translate: `resourcepoint.withdraw` });
    form.textField({ rawtext: [{ translate: `withdraw` }, { text: ` : ${countryData.resourcePoint}` }] }, { translate: `input.number` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            resourcePointConverter(player);
            return;
        };
        let needMoney = Number(rs.formValues[0]);;
        if (!isDecimalNumber(needMoney)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        const playerData2 = GetAndParsePropertyData(`player_${player.id}`);
        const countryData2 = GetAndParsePropertyData(`country_${playerData2.country}`);
        let hasMoney = countryData2.resourcePoint;
        if (hasMoney < needMoney) {
            player.sendMessage({ translate: `error.notenough.resourcepoint` });
            return;
        };
        countryData2.resourcePoint -= needMoney;
        playerData2.money += needMoney;
        playerData2.money = Math.floor(playerData2.money * 100) / 100;
        countryData2.money = Math.floor(countryData2.money * 100) / 100;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData2);
        StringifyAndSavePropertyData(`country_${playerData2.country}`, countryData2);
        resourcePointConverter(player);
        return;
    });
};

/**
 * 
 * @param {Player} player 
 */
function depositRPForm(player) {
    const playerData = GetAndParsePropertyData(`player_${player.id}`);
    const form = new ModalFormData();
    form.title({ translate: `resourcepoint.conversion` });
    form.textField({ rawtext: [{ translate: `conversion` }, { text: ` : ${playerData.money}` }] }, { translate: `input.number` });
    form.show(player).then(rs => {
        if (rs.canceled) {
            resourcePointConverter(player);
            return;
        };
        let needMoney = Number(rs.formValues[0]);;
        if (!isDecimalNumber(needMoney)) {
            player.sendMessage({ translate: `input.error.notnumber` });
            return;
        };
        const playerData2 = GetAndParsePropertyData(`player_${player.id}`);
        let hasMoney = playerData2.money;
        const countryData2 = GetAndParsePropertyData(`country_${playerData2.country}`);
        if (hasMoney < needMoney) {
            player.sendMessage({ translate: `error.notenough.money` });
            return;
        };
        countryData2.resourcePoint += needMoney;
        playerData2.money -= needMoney;
        playerData2.money = Math.floor(playerData2.money * 100) / 100;
        countryData2.money = Math.floor(countryData2.money * 100) / 100;
        StringifyAndSavePropertyData(`player_${player.id}`, playerData2);
        StringifyAndSavePropertyData(`country_${playerData2.country}`, countryData2);
        resourcePointConverter(player);
        return;
    });
};