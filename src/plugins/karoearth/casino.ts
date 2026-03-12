import { Player, world } from "@minecraft/server";
import { ActionForm, ModalForm } from "../../lib/form_class.js";
import { DynamicProperties } from "../../api/dyp.js";

function CasinoCoinShopForm(player: any) {
    const form = new ActionForm();
    form.title({ translate: "casino.shop.title" });
    form.body({ translate: "casino.shop.body" });
    form.button({ translate: "casino.shop.button.buy" });
    form.button({ translate: "casino.shop.button.balance" });
    form.show(player).then((rs: any) => {
        if (rs.canceled) return;
        switch (rs.selection) {
            case 0:
                CasinoCoinBuy(player);
                break;
            case 1:
                player.runCommand("scriptevent coin:check");
                break;
        }
    });
}

function CasinoCoinBuy(player: any) {
    const form = new ModalForm();
    form.title({ translate: "casino.buy.title" });
    form.label({ translate: "casino.buy.rate" });
    form.slider({ translate: "casino.buy.slider" }, 1, 5000, 1);
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            CasinoCoinShopForm(player);
            return;
        }
        const playerDataBase = new DynamicProperties("player");
        const rawData = playerDataBase.get(`player_${player.id}`);
        // @ts-ignore
        const playerData = JSON.parse(rawData);
        const amount = Number(rs.formValues[1]);
        const price = amount * 100;
        if (price > playerData.money) {
            player.sendMessage({
                rawtext: [
                    { translate: "casino.staff.prefix" },
                    { translate: "casino.buy.error.not_enough_money", with: [`${Math.floor(price - playerData.money)}`] }
                ]
            });
            return;
        }
        player.runCommand(`scriptevent coin:add ${amount}`);
        player.sendMessage({ translate: "casino.buy.success", with: [`${amount}`] });
        player.sendMessage({
            rawtext: [
                { translate: "casino.staff.prefix" },
                { translate: "casino.buy.staff_thanks" }
            ]
        });
        player.runCommand(`scriptevent mc:remove ${price}`);
    });
}

function casinoEnterForm(player: any) {
    if (player.hasTag("casinoban")) {
        player.sendMessage({
            rawtext: [
                { translate: "casino.staff.prefix" },
                { translate: "casino.enter.error.banned" }
            ]
        });
        return;
    }
    const form = new ActionForm();
    form.title({ translate: "casino.enter.title" });
    form.body({ translate: "casino.enter.body" });
    form.button({ translate: "casino.enter.button" });
    form.show(player).then((rs: any) => {
        if (rs.canceled) return;
        const playerDataBase = new DynamicProperties("player");
        const rawData = playerDataBase.get(`player_${player.id}`);
        // @ts-ignore
        const playerData = JSON.parse(rawData);
        if (playerData.money < 1000000) {
            player.sendMessage({
                rawtext: [
                    { translate: "casino.staff.prefix" },
                    { translate: "casino.enter.error.not_enough_money" }
                ]
            });
            return;
        }
        player.teleport({ x: 389, y: 50, z: 15016 });
        player.addTag("mc_notp");
        player.sendMessage({
            rawtext: [
                { translate: "casino.staff.prefix" },
                { translate: "casino.enter.success" }
            ]
        });
    });
}

world.afterEvents.entityHitEntity.subscribe((ev) => {
    if (!(ev.damagingEntity instanceof Player)) return;
    const player = ev.damagingEntity;
    if (ev.hitEntity.typeId != "mc:dealer") return;
    const dealer = ev.hitEntity;
    if (dealer.hasTag("casinocoinshop")) {
        CasinoCoinShopForm(player);
        return;
    }
    if (dealer.hasTag("enter")) {
        casinoEnterForm(player);
    }
});
