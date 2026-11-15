import { Player, system } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { getChestIconPath } from "@/shared/minecraft/item-presentation.js";
import { countryInvitesListDefaultForm } from "@/features/forms/default/menu/join/invite/invite_list.js";
import { allowJoinCountriesListDefaultForm } from "@/features/forms/default/menu/join/allow_list/allow_list.js";
import { playerMainMenuKingdomsForm } from "@/features/forms/kingdoms/index.js";

export function joinTypeSelectKingdomsForm(player: Player) {
    const form = new ChestFormData("small");
    form.setTitle([{ text: "§6§lNexus §8- " }, { translate: "form.invite.title" }]);
    form.setPattern([0, 0], ["xxxxxxxxx", "xxixlxxxx", "bxxxxxxxc"], {
        x: { iconPath: "textures/blocks/glass_black", name: "", lore: [], editedName: true },
        i: { iconPath: getChestIconPath("minecraft:writable_book"), name: [{ text: "§e" }, { translate: "form.invite.check.invite" }], lore: [], editedName: true },
        l: { iconPath: getChestIconPath("minecraft:banner"), name: [{ text: "§a" }, { translate: "form.invite.list.allowjoin" }], lore: [], editedName: true },
        b: { iconPath: "textures/ui/arrow_left", name: [{ text: "§a" }, { translate: "mc.button.back" }], lore: [], editedName: true },
        c: { iconPath: getChestIconPath("minecraft:barrier"), name: [{ text: "§c" }, { translate: "mc.button.close" }], lore: [], editedName: true },
    });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => joinTypeSelectKingdomsForm(player), 10);
            else playerMainMenuKingdomsForm(player);
            return;
        }
        if (rs.selection === 11) return countryInvitesListDefaultForm(player);
        if (rs.selection === 13) return allowJoinCountriesListDefaultForm(player);
        if (rs.selection === 18) return playerMainMenuKingdomsForm(player);
    });
}

