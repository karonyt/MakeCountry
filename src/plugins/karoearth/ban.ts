import { Player, system, world } from "@minecraft/server";
import * as DyProp from "../../lib/DyProp.js";
import { executeCommand, sendGetPlayerAction } from "./bds_enhancer.js";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ActionForm, ModalForm } from "../../lib/form_class.js";
const ActionFormData = ActionForm;
const ModalFormData = ModalForm;
import { http, HttpRequest, HttpRequestMethod, HttpHeader } from "@minecraft/server-net";

let bans = {};
const muteList: any = [];
const unmuteList: any = [];

class BanManager {
    banList: any;
    dyprop: any;
    playerData: any;
    constructor(dyprop: any) {
        this.dyprop = dyprop;
        this.loadData();
    }

    loadData() {
        this.banList = JSON.parse(this.dyprop.getDynamicProperty("banList") ?? "[]") || [];
        this.playerData = JSON.parse(this.dyprop.getDynamicProperty("playerData") ?? "{}") || {};
    }

    saveData() {
        this.dyprop.setDynamicProperty("banList", JSON.stringify(this.banList));
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

        const isGBan = isGBAN(savePlayerData.xuid, savePlayerData.deviceId, player.name);
        if (isGBan) {
            player.runCommand(`kick "${savePlayerData.xuid}" §c§l${translateBan("ban.global.kick", data.deviceId)}`);
            world.sendMessage({ rawtext: [{ text: "§a§l[KaronNetWork GlobalBAN System]\n§r§7" }, { text: player.name }, { text: " §r§7" }, { translate: "ban.global.message" }] });
            return;
        };

        const isBan = banManager.isBan(player.name, savePlayerData.xuid, data.deviceId);
        if (isBan) {
            player.runCommand(`kick "${savePlayerData.xuid}" §c§l${translateBan("ban.kick", data.deviceId)}`);
            world.sendMessage({ rawtext: [{ text: "§a§l[KaronNetWork BAN System]\n§r§7" }, { text: player.name }, { text: " §r§7" }, { translate: "ban.message" }] });
            return;
        };

        if (muteList.includes(`${player.name}`)) {
            player.setDynamicProperty(`isMute`, true);
        };
        if (unmuteList.includes(`${player.name}`) && player.getDynamicProperty(`isMute`)) {
            player.setDynamicProperty(`isMute`);
        };
        player.removeTag('checking');

        const info = banManager.getPlayerInfo(player.name);
        if (info.deviceId.length >= 4) {
            const webhookUrl = "https://discordapp.com/api/webhooks/1417515886297747589/7BFRzkwAhpZkzLmYLR82V6GGMSonn4O-RkmPA8X57JoRVwcJzIAJuXGECSr_ab48nORx";
            const req = new HttpRequest(webhookUrl);
            req.setBody(JSON.stringify({
                content: `**${player.name}** ${translateBan("ban.webhook.multidevice", `${info.deviceId.length}`)}\n[\n${info.deviceId.join(',\n')}\n]`
            }));
            req.setMethod(HttpRequestMethod.Post);
            req.setHeaders([
                new HttpHeader("Content-Type", "application/json")
            ]);

            await http.request(req);
        };
    }, 3);
});

world.afterEvents.itemUse.subscribe((ev) => {
    const { itemStack, source } = ev;
    if (!source.hasTag('moderator')) return;
    if (itemStack.typeId != 'minecraft:stick') return;
    banMainForm(source);
});

function banMainForm(player: any) {
    const form = new ActionFormData();
    form.title({ translate: 'ban.form.title' });
    form.button({ translate: 'ban.form.button.add' });
    form.button({ translate: 'ban.form.button.list' });
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
    form.title({ translate: 'ban.list.title' });
    const banPlayers = banManager.banlist();
    if (banPlayers.length == 0) {
        form.body({ translate: 'ban.list.empty' });
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
    form.body({ translate: 'ban.info.body', with: [name, `${info?.xuid}`, `${info?.deviceId.join(',\n')}`] });
    form.button({ translate: 'common.back' });
    form.button({ translate: 'ban.info.unban' });

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
                player.sendMessage({ translate: 'ban.unban.success', with: [name] })
                break;
        };
    });
};

function addBanForm(player: any) {
    const form = new ModalFormData();
    form.title({ translate: 'ban.add.title' });
    form.textField({ translate: 'ban.add.input' }, { translate: 'ban.add.placeholder' });
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
            player.sendMessage({ translate: 'ban.add.error.empty' });
            return;
        };
        const playerInfo = banManager.getPlayerInfo(rs.formValues[0]);
        if (playerInfo) {
            banManager.ban(rs.formValues[0], playerInfo.xuid, playerInfo.deviceId[0]);
            player.sendMessage({ translate: 'ban.add.success.detail', with: [`${rs.formValues[0]}`, `${playerInfo.xuid}`, `${playerInfo.deviceId.join(',\n')}`] });
            world.getPlayers({ name: rs.formValues[0] })[0]?.runCommand(`kick "${playerInfo.xuid}" §c§l${translateBan("ban.kicked.simple")}`);
            return;
        } else {
            banManager.ban(rs.formValues[0]);
            player.sendMessage({ translate: 'ban.add.success.simple', with: [`${rs.formValues[0]}`] });
            return;
        };
    });
};

function isGBAN(xuid: any, deviceId: any, name: any) {
    // @ts-ignore
    const record = bans[xuid];
    if (record) {
        return true;
    };
    for (const key in bans) {
        // @ts-ignore
        if (bans[key].devices.includes(deviceId)) {
            return true;
        };
    };

    return false;
};

function getPlayerByDeviceId(deviceId: any) {
    return banManager.getPlayerByDeviceId(deviceId)
};

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    const { id, message } = ev;
    if (id != "system:on_spawn") return;
    system.runTimeout(() => {
        sendGetPlayerAction(message.split('|')[0]);
    }, 5);
});

world.afterEvents.playerSpawn.subscribe((ev) => {
    const { player, initialSpawn } = ev;
    if (!initialSpawn) return;
    executeCommand("listd");
    player.addTag('checking');
    system.runTimeout(() => {
        if (player.hasTag('checking')) {
            player.runCommand(`kick @s §c§l${translateBan("ban.checking.failed")}`);
        };
    }, 150);
});

system.afterEvents.scriptEventReceive.subscribe((ev) => {
    if (ev.id != "karo:getbydeviceid") return;
    const accounts = getPlayerByDeviceId(ev.message);
    let message = ``
    for (const account of accounts) {
        message += `・${account}\n`
    }
    // @ts-ignore
    ev.sourceEntity.sendMessage(message)
})

function translateBan(key: string, value?: string) {
    const map: Record<string, string> = {
        "ban.global.kick": `あなたはGlobalBANされています\nReason: ${value}のデバイスからの接続を検出しました`,
        "ban.kick": `あなたはBANされています\n${value}のデバイスからの接続を検出しました`,
        "ban.webhook.multidevice": `${value}端末から参加しています`,
        "ban.kicked.simple": `あなたはBANされました`,
        "ban.checking.failed": `認証に失敗しました。もう一度接続を試してください`
    };
    return map[key] ?? key;
}
