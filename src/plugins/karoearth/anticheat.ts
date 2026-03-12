import { world, Player, system, GameMode, EquipmentSlot } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ModalForm } from "../../lib/form_class.js";
const ModalFormData = ModalForm;
import { ChestFormData } from "../../lib/chest-ui.js";
import { itemIdToPath } from "../../texture_config.js";
import { beforeEvents } from "@minecraft/server-net"

beforeEvents.packetReceive.subscribe((ev) => {
    // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
    if (!ev.sender && !(ev.sender instanceof Player)) return;
    if (ev.packetId == "CommandRequestPacket" && ev.packetSize == 533) {
        console.log(`${ev.packetId}\n${ev.packetSize}`)
        // @ts-ignore TS(2339): Property 'cracher' does not exist on type 'Player'... Remove this comment to see the full error message
        let num = ev.sender.cracher || 0
        // @ts-ignore TS(2339): Property 'cracher' does not exist on type 'Player'... Remove this comment to see the full error message
        ev.sender.cracher = num + 1;
        if (num > 20) {
            ev.cancel = true;
            system.run(async () => {
                const target = ev.sender;
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                target.runCommand(`ban "${target.name}" §c§lクラッシャーの使用`);
            });
        };
    };
});

beforeEvents.packetReceive.subscribe((ev) => {
    // @ts-ignore TS(2358): The left-hand side of an 'instanceof' expression m... Remove this comment to see the full error message
    if (!ev.sender && !(ev.sender instanceof Player)) return;
    // @ts-ignore TS(2367): This condition will always return 'false' since th... Remove this comment to see the full error message
    if (ev.packetId == "LevelSoundPacket") {
        console.log(`${ev.packetId}\n${ev.packetSize}`)
        // @ts-ignore TS(2339): Property 'cracher' does not exist on type 'Player'... Remove this comment to see the full error message
        let num = ev.sender.cracher || 0
        // @ts-ignore TS(2339): Property 'cracher' does not exist on type 'Player'... Remove this comment to see the full error message
        ev.sender.cracher = num + 1;
        if (num > 20) {
            ev.cancel = true;
            system.run(async () => {
                const target = ev.sender;
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                target.runCommand(`ban "${target.name}" §c§lクラッシャーの使用`);
            });
        };
    };
});

world.afterEvents.worldLoad.subscribe(() => {
    system.runInterval(() => {
        for (const p of world.getPlayers()) {
            // @ts-ignore TS(2339): Property 'cracher' does not exist on type 'Player'... Remove this comment to see the full error message
            p.cracher = 0;
        };
    }, 20);
});

const unbanList = [];

const unmuteList = [];
const muteList = [];


system.afterEvents.scriptEventReceive.subscribe((ev) => {
    switch (ev.id) {
        case `karo:unban`: {
            unbanList.push(ev.message);
        };
    };
});

/**
 * 
 * @param {Player} player 
 */
function muteForm(player: any) {
    const players = world.getPlayers();
    const playerNames = players.map(p => p.name);
    const form = new ModalFormData();
    form.dropdown(`MUTEするプレイヤーを選択`, playerNames);
    form.submitButton(`MUTEする`);
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                muteForm(player);
                return;
            };
            return;
        };
        try {
            /**
             * @type {Player}
             */
            const target = players[rs.formValues[0]];
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            target.setDynamicProperty(`isMute`, true);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            player.sendMessage(`§a${target.name}をMUTEしました`)
        } catch (error) {
        };
    });
};

/**
 * 
 * @param {Player} player 
 */
function unmuteForm(player: any) {
    const players = world.getPlayers();
    const playerNames = players.map(p => p.name);
    const form = new ModalFormData();
    form.dropdown(`MUTE解除するプレイヤーを選択`, playerNames);
    form.submitButton(`MUTE解除する`);
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                unmuteForm(player);
                return;
            };
            return;
        };
        try {
            /**
             * @type {Player}
             */
            const target = players[rs.formValues[0]];
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            target.setDynamicProperty(`isMute`);
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            player.sendMessage(`§a${target.name}をMUTE解除しました`)
        } catch (error) {
        };
    });
};

world.beforeEvents.chatSend.subscribe((ev) => {
    const { sender, message } = ev;
    if (message.startsWith(`?`)) return;
    if (sender.hasTag(`moderator`)) {
        if (!message.startsWith(`!`)) return;
        ev.cancel = true;
        system.run(() => {
            switch (message) {
                /*case `!ban`: {
                    banForm(sender);
                    break;
                };*/
                case `!mute`: {
                    muteForm(sender);
                    break;
                };
                case `!unmute`: {
                    unmuteForm(sender);
                    break;
                };
                case `!help`: {
                    sender.sendMessage(`§a!ban§f: BANフォームを開く\n§a!mute§f: MUTEフォームを開く\n§a!unmute§f: UNMUTEフォームを開く\n§a!sp§f: ゲームモードを切り替える\n§a!inv <PlayerName>§f: プレイヤーのインベントリを確認する`);
                    break;
                }
                case `!sp`: {
                    switch (sender.getGameMode()) {
                        case GameMode.Spectator: {
                            sender.setGameMode(GameMode.Survival);
                            break;
                        };
                        case GameMode.Survival: {
                            sender.setGameMode(GameMode.Spectator);
                            break;
                        };
                    };
                    break;
                }
                default: {
                    if (message.startsWith(`!inv `)) {
                        const target = world.getPlayers({ name: message.substring(5) });
                        if (target.length === 0) {
                            sender.sendMessage(`§c指定したプレイヤーが見つかりません`);
                            return;
                        };
                        inventoryCheck(sender, target[0]);
                        break;
                    }
                    sender.sendMessage(`§c存在しないコマンド`);
                };
            };
            return;
        });
    };
    if (sender.getDynamicProperty(`isMute`)) {
        ev.cancel = true;
        system.run(() => {
            sender.sendMessage(`§cあなたはMUTEされています`);
        });
    };
});

/**
 * 
 * @param {Player} player 
 * @param {Player} target 
 */
function inventoryCheck(player: any, target: any) {
    const form = new ChestFormData("large");
    form.setTitle(`${target.name} のインベントリ`);
    const inventory = target.getComponent("inventory").container;
    for (let i = 0; i < inventory.size; i++) {
        const item = inventory.getItem(i);
        if (item) {
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            form.setButton(i + 9, { iconPath: itemIdToPath[item.typeId], name: item.nameTag || item.typeId, lore: item.getLore(), stackAmount: item.amount });
        };
    };
    const equippable = target.getComponent("equippable");
    const equippables = [EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet, EquipmentSlot.Offhand];
    for (let i = 0; i < equippables.length; i++) {
        const item = equippable.getEquipment(equippables[i]);
        if (item) {
            // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            form.setButton(i, { iconPath: itemIdToPath[item.typeId], name: item.nameTag || item.typeId, lore: item.getLore(), stackAmount: item.amount });
        };
    };
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                inventoryCheck(player, target);
                return;
            };
            return;
        };
        const playerInventory = player.getComponent("inventory").container;
        if (-1 < rs.selection && rs.selection < 5) {
            const item = equippable.getEquipment(equippables[rs.selection]);
            if (item) {
                player.sendMessage(`§a${target.name}のインベントリから ${item.nameTag || item.typeId} を奪いました`);
                equippable.setEquipment(equippables[rs.selection]);
                playerInventory.addItem(item);
                return;
            } else {
                player.sendMessage(`§cその位置にはアイテムがありません`);
                return;
            };
        };
        if (8 < rs.selection && rs.selection < 55) {
            const item = inventory.getItem(rs.selection - 9);
            if (item) {
                player.sendMessage(`§a${target.name}のインベントリから${item.nameTag || item.typeId} を奪いました`);
                inventory.setItem(rs.selection - 9);
                playerInventory.addItem(item);
                return;
            } else {
                player.sendMessage(`§cその位置にはアイテムがありません`);
                return;
            };
        };
        player.sendMessage(`§c無効なフィールド`);
    });
};