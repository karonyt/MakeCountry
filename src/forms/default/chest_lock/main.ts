import { Player, world } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../api/dyp.js";

/**
 * @param {Player} player
 * @param {string} id
 */
export function chestLockDefaultForm(player: any, id: any) {
    const chestDataBase = new DynamicProperties("chest");
    const raw = chestDataBase.get(id);

    let chestData = raw ? JSON.parse(raw) : undefined;

    if (chestData && !Array.isArray(chestData.admin)) {
        chestData.admin = [];
    }

    const form = new ActionFormData();
    form.title({ translate: "form.chestlock.title" });

    let lock: any;

    if (chestData) {
        form.button({ translate: "form.button.chestlock.disabled" });
        lock = false;

        if (chestData.player === player.id) {
            form.button({ translate: "form.chestlock.share.title" });
        }
    } else {
        form.button({ translate: "form.button.chestlock.enabled" });
        lock = true;

        chestData = {
            id,
            player: player.id,
            admin: [],
        };
    }

    form.show(player).then(rs => {
        if (rs.canceled) return;

        if (rs.selection === 0) {
            if (lock) {
                chestDataBase.set(id, chestData);
            } else {
                chestDataBase.delete(id);
            }
            player.sendMessage({ translate: "updated" });
            return;
        }

        if (!lock && rs.selection === 1) {
            openShareManageForm(player, id, chestData);
        }
    });
}

function openShareManageForm(player: any, chestId: any, chestData: any) {
    const form = new ActionFormData()
        .title({ translate: "form.chestlock.share.title" })
        .button({ translate: "form.chestlock.share.add" })
        .button({ translate: "form.chestlock.share.remove" });

    form.show(player).then(rs => {
        if (rs.canceled) return;

        if (rs.selection === 0) {
            openAddAdminForm(player, chestId, chestData);
        } else if (rs.selection === 1) {
            openRemoveAdminForm(player, chestId, chestData);
        }
    });
}

function openAddAdminForm(player: any, chestId: any, chestData: any) {
    const candidates = world.getPlayers().filter(p =>
        p.id !== chestData.player &&
        !chestData.admin.includes(p.id)
    );

    if (candidates.length === 0) {
        player.sendMessage({ translate: "message.no_add_candidate" });
        return;
    }

    const form = new ModalFormData()
        .title({ translate: "form.chestlock.share.add.title" })
        .dropdown(
            { translate: "form.chestlock.share.add.label" },
            candidates.map(p => p.name)
        );

    form.show(player).then(rs => {
        if (rs.canceled) return;

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const target = candidates[rs.formValues[0]];
        chestData.admin.push(target.id);

        new DynamicProperties("chest").set(chestId, JSON.stringify(chestData));
        player.sendMessage({
            translate: "message.share.added",
            with: [target.name]
        });
    });
}

function openRemoveAdminForm(player: any, chestId: any, chestData: any) {
    if (chestData.admin.length === 0) {
        player.sendMessage({ translate: "message.no_admin" });
        return;
    }

    const playerDB = new DynamicProperties('player');

    const admins = chestData.admin
        .map((id: any) => {
            const raw = playerDB.get(`player_${id}`);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return { id, name: data.name };
        })
        .filter(Boolean);

    const form = new ModalFormData()
        .title({ translate: "form.chestlock.share.remove.title" })
        .dropdown(
            { translate: "form.chestlock.share.remove.label" },
            admins.map((p: any) => p.name)
        );

    form.show(player).then(rs => {
        if (rs.canceled) return;

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const target = admins[rs.formValues[0]];
        chestData.admin = chestData.admin.filter((id: any) => id !== target.id);

        new DynamicProperties("chest").set(chestId, JSON.stringify(chestData));
        player.sendMessage({
            translate: "message.share.removed",
            with: [target.name]
        });
    });
}