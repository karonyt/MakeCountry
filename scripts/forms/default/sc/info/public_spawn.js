import { Player } from "@minecraft/server";
import { DynamicProperties } from "../../../../api/dyp";
import { CountryManager } from "../../../../api/country/country";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { settingCountryInfoDefaultForm } from "./info";
import { CheckPermission, GetAndParsePropertyData, GetPlayerChunkPropertyId } from "../../../../lib/util";
import national_tier_level from "../../../../national_tier_level";
/**@typedef {import("../../../../jsdoc/player").PlayerData} PlayerData*/

/** スポーン解放レベル配列例 */
const unlockLevels = national_tier_level.unlockPublicSpawnLevels;

/**
 * 旧システムのホームを新システムに移行する
 * @param {string|number} countryId 移行対象の国ID
 */
export function migrateOldHomeToNewSystem(countryId) {
    const countryDataBase = new DynamicProperties('country');
    const countryDataRaw = countryDataBase.get(`country_${countryId}`);
    if (!countryDataRaw) return console.warn(`国ID ${countryId} のデータが存在しません。`);

    const countryData = JSON.parse(countryDataRaw);

    // 新システム用 spawn オブジェクトを初期化
    countryData.spawn = countryData.spawn || {};

    // 旧ホームが存在する場合に移行
    if (typeof countryData.spawn == 'string') {
        const oldHome = countryData.spawn; // 例: "x_y_z_rx_ry_dimension"
        countryData.spawn = {};
        countryData.spawn["default"] = { pos: oldHome, enabled: true };

        // 移行後、必要なら旧フィールドを削除
        // delete countryData.oldHome;

        // 更新
        countryDataBase.set(`country_${countryId}`, JSON.stringify(countryData));
        console.log(`国ID ${countryId} の旧ホームを新システムに移行しました。`);
    }
}

/** 現在の国レベルで設定可能なスポーン数を返す */
function getMaxSpawns(countryLv, unlockLevels) {
    let count = 0;
    for (let i = 0; i < unlockLevels.length; i++) {
        if (countryLv >= unlockLevels[i]) count++;
    }
    return count;
}

/** パブリックスポーン管理フォーム */
export function publicSpawnManageForm(player) {
    const playerDataBase = new DynamicProperties('player');
    /** @type {PlayerData} */
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);

    migrateOldHomeToNewSystem(playerData.country);

    let countryData = countryManager.countryData;

    countryData.spawn = countryData.spawn || {};
    const spawnKeys = Object.keys(countryData.spawn);
    const maxSpawns = getMaxSpawns(countryData.lv || 0, unlockLevels);

    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: `form.setting.info.button.publicspawn` }, { text: ` (${spawnKeys.length}/${maxSpawns})` }] });

    // 新規追加ボタン（上限チェック）
    if (spawnKeys.length < maxSpawns) {
        form.button({ translate: `publicspawn.add_new` });
    } else {
        form.button({ translate: `publicspawn.add_new_full` });
    }

    // 既存スポーン一覧（座標 + 次元 + 有効/無効表示）
    spawnKeys.forEach(name => {
        const spawnData = countryData.spawn[name];
        if (spawnData) {
            const [x, y, z, , , ...dimension] = spawnData.pos.split("_");
            const status = spawnData.enabled ? "§aON" : "§cOFF";
            const isStreamerMode = player.getDynamicProperty("isStreamerSettings") === 'true';
            //ストリーマーモードの場合、ホームの座標は表示しない
            if (isStreamerMode) {
                form.button({ text: `${name} → [§eHidden§r] (${dimension.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ").replace('minecraft:', '')}) ${status}` });
                return;
            } else {
                form.button({ text: `${name} → [${x}, ${y}, ${z}] (${dimension.map(d => d.charAt(0).toUpperCase() + d.slice(1)).join(" ").replace('minecraft:', '')}) ${status}` });
            }
        } else {
            form.button({ text: name });
        }
    });

    form.show(player).then(rs => {
        if (rs.canceled) {
            settingCountryInfoDefaultForm(player);
            return;
        }

        if (CheckPermission(player, `publicHomeAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        }

        // 新規追加
        if (rs.selection === 0) {
            if (spawnKeys.length >= maxSpawns) {
                player.sendMessage({ translate: `publichome.set.error.limit` });
                return publicSpawnManageForm(player);
            }
            return publicSpawnDefaultForm(player); // 新規追加フォーム呼び出し
        }

        // 既存スポーン編集/削除
        const selectedName = spawnKeys[rs.selection - 1];
        spawnEditDeleteForm(player, selectedName);
    });
}

/** 既存スポーンの編集/削除フォーム */
function spawnEditDeleteForm(player, spawnName) {
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;

    const form = new ActionFormData();
    form.title({ rawtext: [{ translate: 'edit' }, { text: `: ${spawnName}` }] });
    form.button({ translate: "edit" });
    form.button({ rawtext: [{ text: '§c' }, { translate: "mc.button.delete" }] });
    form.button({ translate: "mc.button.back" });

    form.show(player).then(rs => {
        if (rs.canceled || rs.selection === 2) {
            publicSpawnManageForm(player);
            return;
        }

        const spawnData = countryData.spawn[spawnName];

        // 編集
        if (rs.selection === 0) {
            const editForm = new ModalFormData();
            editForm.title({ rawtext: [{ translate: 'edit' }, { text: `: ${spawnName}` }] });
            editForm.textField({ text: 'Name' }, { translate: 'input.string' }, { defaultValue: spawnName });
            editForm.toggle({ translate: "publicspawn.button.validity" }, { defaultValue: spawnData.enabled ?? true });

            editForm.show(player).then(res => {
                if (res.canceled) return publicSpawnManageForm(player);

                const newName = res.formValues[0].trim() || spawnName;
                const enabled = res.formValues[1];

                // 名前変更の場合は既存キーを置き換え
                if (newName !== spawnName) {
                    countryData.spawn[newName] = countryData.spawn[spawnName];
                    delete countryData.spawn[spawnName];
                }

                // enabled 更新
                countryData.spawn[newName].enabled = enabled;

                const countryDataBase = new DynamicProperties('country');
                countryDataBase.set(`country_${playerData.country}`, countryData);
                player.sendMessage({ translate: `updated` });
                publicSpawnManageForm(player);
            });
        }

        // 削除
        if (rs.selection === 1) {
            delete countryData.spawn[spawnName];
            const countryDataBase = new DynamicProperties('country');
            countryDataBase.set(`country_${playerData.country}`, JSON.stringify(countryData));
            player.sendMessage({ translate: `deleted` });
            publicSpawnManageForm(player);
        }
    });
}

/** 新規追加フォーム */
export function publicSpawnDefaultForm(player) {
    const playerDataBase = new DynamicProperties('player');
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    let countryData = countryManager.countryData;

    countryData.spawn = countryData.spawn || {};

    const form = new ModalFormData();
    form.title({ translate: `form.setting.info.button.publicspawn` });
    form.textField({ translate: "publicspawn.button.name" }, { translate: 'input.string' });
    form.toggle({ translate: "publicspawn.button.validity" }, { defaultValue: true });
    form.submitButton({ translate: `mc.button.update` });

    form.show(player).then(rs => {
        if (rs.canceled) {
            publicSpawnManageForm(player);
            return;
        }

        const spawnName = rs.formValues[0].trim() || "default";
        const enabled = rs.formValues[1];

        const chunkDB = new DynamicProperties('chunk');
        const countryDB = new DynamicProperties('country');
        //スポーン上限をチェック
        const spawnKeys = Object.keys(countryData.spawn);
        const maxSpawns = getMaxSpawns(countryData.lv || 0, unlockLevels);
        if (spawnKeys.length >= maxSpawns) {
            player.sendMessage({ translate: `publichome.set.error.limit` });
            return publicSpawnManageForm(player);
        }

        const chunkData = JSON.parse(chunkDB.get(GetPlayerChunkPropertyId(player)));
        if (!chunkData?.countryId || chunkData.countryId !== playerData.country) {
            player.sendMessage({ translate: `publichome.set.error.within.country` });
            return publicSpawnManageForm(player);
        }

        const { x, y, z } = player.location;
        const { x: rx, y: ry } = player.getRotation();
        const spawnPos = `${Math.ceil(x) - 0.5}_${Math.ceil(y)}_${Math.ceil(z) - 0.5}_${Math.ceil(rx)}_${Math.ceil(ry)}_${player.dimension.id}`;

        countryData.spawn[spawnName] = { pos: spawnPos, enabled };
        countryDB.set(`country_${playerData.country}`, JSON.stringify(countryData));
        player.sendMessage({ translate: `updated` });
        publicSpawnManageForm(player);
    });
}