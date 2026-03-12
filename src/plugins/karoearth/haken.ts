import { Player, system, world } from "@minecraft/server";
import * as DyProp from "../../lib/DyProp.js";
import { executeCommand, sendGetPlayerAction } from "./bds_enhancer.js";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm, ModalForm } from "../../lib/form_class.js";
import { transferPlayer } from "@minecraft/server-admin";
const ActionFormData = ActionForm;
const ModalFormData = ModalForm;

class BanManager {
    banList: any;
    dyprop: any;
    playerData: any;
    constructor(dyprop: any) {
        this.dyprop = dyprop;
        this.loadData();
    }

    loadData() {
        this.banList = JSON.parse(this.dyprop.getDynamicProperty("hakenList") ?? "[]") || [];
        this.playerData = JSON.parse(this.dyprop.getDynamicProperty("playerData") ?? "{}") || {};
    }

    saveData() {
        this.dyprop.setDynamicProperty("hakenList", JSON.stringify(this.banList));
        this.dyprop.setDynamicProperty("playerData", JSON.stringify(this.playerData));
    }

    addData(name: any, xuid: any, deviceId: any) {
        // @ts-ignore
        let existingEntry = Object.entries(this.playerData).find(([key, data]) => data.xuid === xuid);

        if (existingEntry) {
            let [oldName, data] = existingEntry;
            if (oldName !== name) {
                delete this.playerData[oldName];
                this.playerData[name] = data;
            }
            // @ts-ignore
            data.deviceId = data.deviceId.filter(Boolean);
            // @ts-ignore
            if (!data.deviceId.includes(deviceId)) {
                // @ts-ignore
                data.deviceId.push(deviceId);
            }
        } else {
            this.playerData[name] = { xuid, deviceId: [deviceId] };
        }
        this.saveData();
    }

    getPlayerByDeviceId(deviceId: any) {
        const accounts = []
        for (let ban of this.banList) {
            if (ban.deviceId.includes(deviceId)) {
                accounts.push(ban.name);
            }
        }
        return accounts
    }

    ban(name: any, xuid = null, deviceId = null) {
        let deviceIds = deviceId ? [deviceId] : [];
        if (this.playerData[name]) {
            let data = this.playerData[name];
            xuid = xuid || data.xuid;
            // @ts-ignore
            deviceIds = [...new Set([...deviceIds, ...data.deviceId])];
        }

        for (let ban of this.banList) {
            // @ts-ignore
            if (ban.xuid === xuid || ban.deviceId.some((id: any) => deviceIds.includes(id))) {
                // @ts-ignore
                deviceIds = [...new Set([...deviceIds, ...ban.deviceId])];
                ban.deviceId = deviceIds;
            }
        }

        this.banList.push({ name, xuid, deviceId: deviceIds });
        this.saveData();
    }

    unban(name: any) {
        this.banList = this.banList.filter((ban: any) => ban.name !== name);
        this.saveData();
    }

    isBan(name: any, xuid = null, deviceId = null) {
        return this.banList.some((ban: any) => ban.name === name ||
            ban.xuid === xuid ||
            (deviceId && ban.deviceId.includes(deviceId))
        );
    }

    banlist() {
        return this.banList;
    }

    getPlayerInfo(name: any) {
        return this.playerData[name] || null;
    }
}

let banManager: any
world.afterEvents.worldLoad.subscribe(() => {
    banManager = new BanManager(DyProp);
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    const { id, message } = ev;
    if (id != "system:playerinfo") return;
    const data = JSON.parse(message);
    const player = world.getPlayers().find(p => p.id == data.id);
    if (!player) return;
    system.runTimeout(async () => {
        const savePlayerData = { xuid: data.xuid, id: data.id, deviceId: [data.deviceId] };
        banManager.addData(player.name, savePlayerData.xuid, data.deviceId);
        player.addTag(`xuid_${data.xuid}`);

        const isBan = banManager.isBan(player.name, savePlayerData.xuid, data.deviceId);
        if (isBan) {
            world.sendMessage({ rawtext: [{ text: "§a§l[派遣システム]\n§r§7" }, { text: player.name }, { text: " §r§7" }, { translate: "haken.system.active" }] });
            // @ts-ignore
            transferPlayer(player, { hostname: 'marvgame.net', port: 19132 });
            return;
        };
    }, 3);
});

world.afterEvents.itemUse.subscribe((ev) => {
    const { itemStack, source } = ev;
    if (!source.hasTag('moderator')) return;
    if (itemStack.typeId != 'minecraft:blaze_rod') return;
    banMainForm(source);
});

function banMainForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: 'haken.form.title' });
    form.button({ translate: 'haken.form.button.add' });
    form.button({ translate: 'haken.form.button.list' });
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    banMainForm(player);
                }, 10);
            };
            return;
        };
        switch (rs.selection) {
            case 0:
                addBanForm(player);
                break;
            case 1:
                banListForm(player);
                break;
        };
    });
};

function banListForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: 'haken.list.title' });
    const banPlayers = banManager.banlist();
    if (banPlayers.length == 0) {
        form.body({ translate: 'haken.list.empty' });
        form.button({ translate: 'common.close' });
    };
    for (const p of banPlayers) {
        form.button(`${p.name}\n${p.xuid}`);
    };

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    banListForm(player);
                }, 10);
            };
            return;
        };
        if (banPlayers.length == 0) return;
        banPlayerInfoForm(player, banPlayers[rs.selection].name);
    });
};

function banPlayerInfoForm(player: any, name: any) {
    const form = new ActionFormData();
    form.title(name);
    const info = banManager.getPlayerInfo(name);
    form.body({ translate: 'haken.info.body', with: [name, `${info?.xuid}`, `${info?.deviceId.join(',\n')}`] });
    form.button({ translate: 'common.back' });
    form.button({ translate: 'haken.info.finish' });

    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    banPlayerInfoForm(player, name);
                }, 10);
            };
            return;
        };
        switch (rs.selection) {
            case 0:
                banListForm(player);
                break;
            case 1:
                banManager.unban(name);
                player.sendMessage({ translate: 'haken.finish.success', with: [name] })
                break;
        };
    });
};

function addBanForm(player: any) {
    const form = new ModalFormData();
    form.title({ translate: 'haken.add.title' });
    form.textField({ translate: 'haken.add.input' }, { translate: 'haken.add.placeholder' });
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason == FormCancelationReason.UserBusy) {
                system.runTimeout(() => {
                    addBanForm(player);
                }, 10);
            };
            return;
        };
        if (rs.formValues[0].replaceAll(' ', '').replaceAll('　', '') == '') {
            player.sendMessage({ translate: 'haken.add.error.empty' });
            return;
        };
        const playerInfo = banManager.getPlayerInfo(rs.formValues[0]);
        if (playerInfo) {
            banManager.ban(rs.formValues[0], playerInfo.xuid, playerInfo.deviceId[0]);
            player.sendMessage({ translate: 'haken.add.success.detail', with: [`${rs.formValues[0]}`, `${playerInfo.xuid}`, `${playerInfo.deviceId.join(',\n')}`] });
            const hakenPlayer = world.getPlayers({ name: rs.formValues[0] });
            if (hakenPlayer.length == 1) {
                // @ts-ignore
                transferPlayer(hakenPlayer[0], { hostname: 'marvgame.net', port: 19132 });
            }
            return;
        } else {
            banManager.ban(rs.formValues[0]);
            player.sendMessage({ translate: 'haken.add.success.simple', with: [`${rs.formValues[0]}`] });
            return;
        };
    });
};

function getPlayerByDeviceId(deviceId: any) {
    return banManager.getPlayerByDeviceId(deviceId)
};
