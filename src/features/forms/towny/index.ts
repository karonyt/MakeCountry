import { callHook, readValue } from "@/shared/hooks.js";
import { Player, system } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
import config from "@/config/server.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { getChestIconPath } from "@/shared/minecraft/item-presentation.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { countryListDefaultForm } from "@/features/forms/default/country_list/list.js";
import { showProfileDefaultForm } from "@/features/forms/default/menu/profile/show_profile.js";
import { sendMoneyDefaultForm } from "@/features/forms/default/menu/send_money/send_money.js";
import { playerSettingDefaultForm } from "@/features/forms/default/menu/setting/setting.js";
import { countryInvitesListDefaultForm } from "@/features/forms/default/menu/join/invite/invite_list.js";
import { allowJoinCountriesListDefaultForm } from "@/features/forms/default/menu/join/allow_list/allow_list.js";
import { treasuryMainDefaultForm } from "@/features/forms/default/sc/treasury/treasury_main.js";
import { inviteMainDefaultForm } from "@/features/forms/default/sc/invite/main.js";
import { settingCountryMembersDefaultForm } from "@/features/forms/default/sc/members/setting_members.js";
import { settingCountryRoleDefaultForm } from "@/features/forms/default/sc/role/main.js";
import { settingCountryPlotGroupDefaultForm } from "@/features/forms/default/sc/plot_group/main.js";
import { settingCountryInfoDefaultForm } from "@/features/forms/default/sc/info/info.js";
import { countryDeleteCheckDefaultForm } from "@/features/forms/default/sc/del/main.js";
import { nationalTierLevelDefaultForm } from "@/features/forms/default/sc/ntlv/ntlv.js";
import national_tier_level from "@/config/national-tier-level.js";
import { CheckPermission, HasPermission } from "@/shared/utils/minecraft.js";

const border = { iconPath: "textures/blocks/glass_gray", name: "", lore: [], editedName: true };
const item = (iconPath: string, translate: string, color = "§6") => ({
    // テクスチャパスを直接渡し、現行クライアントで透明になる旧数値ID rendererを避ける。
    iconPath: getChestIconPath(iconPath),
    name: [{ text: color }, { translate }],
    lore: [],
    editedName: true,
});

/** TownyGUI のカテゴリ式27スロット構成を参考にしたメインメニュー。 */
export function playerMainMenuTownyForm(player: Player) {
    const form = new ChestFormData("small");
    form.setTitle([{ text: "§2§lTowny §8- " }, { translate: "form.mainmenu.title" }]);
    form.setPattern([0, 0], ["xxxxxxxxx", "xtxnxaxrx", "xxxxxxxxx"], {
        x: border,
        t: item("minecraft:emerald", "form.setting.title", "§2"),
        n: item("minecraft:diamond", "form.countrylist.title", "§b"),
        a: item("minecraft:grass", "form.mainmenu.button.fish_encyclopedia", "§a"),
        r: item("minecraft:book", "form.mainmenu.button.profile", "§e"),
    });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => playerMainMenuTownyForm(player), 10);
            return;
        }
        switch (rs.selection) {
            case 10: {
                const raw = new DynamicProperties("player").get(`player_${player.id}`);
                const playerData = raw ? JSON.parse(raw) : undefined;
                return playerData?.country ? settingCountryTownyForm(player) : joinTypeSelectTownyForm(player);
            }
            case 12: return countryListDefaultForm(player);
            case 14: { if (!callHook("fishing.openEncyclopedia", player)) player.sendMessage({ translate: "makecountry.module.missing", with: { rawtext: [{ translate: "makecountry.module.fishing" }] } }); return; }
            case 16: return residentMenuTownyForm(player);
        }
    });
}

function residentMenuTownyForm(player: Player) {
    const form = new ChestFormData("small");
    form.setTitle([{ text: "§2§lTowny §8- " }, { translate: "form.mainmenu.button.profile" }]);
    form.setPattern([0, 0], ["xxxxxxxxx", "xpxmxsxtx", "xxxxxxxxb"], {
        x: border,
        p: item("minecraft:book", "form.mainmenu.button.profile", "§e"),
        m: item("minecraft:gold_ingot", "form.mainmenu.button.sendmoney", "§a"),
        s: item("minecraft:compass", "form.mainmenu.button.setting", "§6"),
        t: item("minecraft:name_tag", "form.mainmenu.button.penname", "§e"),
        b: item("minecraft:barrier", "mc.button.back", "§a"),
    });
    form.show(player).then((rs) => {
        if (rs.canceled) return playerMainMenuTownyForm(player);
        if (rs.selection === 10) return showProfileDefaultForm(player);
        if (rs.selection === 12) return sendMoneyDefaultForm(player);
        if (rs.selection === 14) return playerSettingDefaultForm(player);
        if (rs.selection === 16 && config.pennameEnable) { if (!callHook("life.openPenName", player)) player.sendMessage({ translate: "makecountry.module.missing", with: { rawtext: [{ translate: "makecountry.module.life" }] } }); return; }
        if (rs.selection === 26) return playerMainMenuTownyForm(player);
    });
}

/** TownyMenus の Town 画面と同じ主要スロットを使う6段の国管理ハブ。 */
export function settingCountryTownyForm(player: Player) {
    const form = new ChestFormData("large");
    const canDelete = !CheckPermission(player, "owner");
    form.setTitle([{ text: "§2§lTown §8- " }, { translate: "form.setting.title" }]);
    form.setPattern([0, 0], [
        "xxxxxxxxx",
        "xixxoxxrx",
        "xxxxxxxxx",
        "xmx....nx",
        "xxxtxgxxx",
        "dxxxxxxxb",
    ], {
        x: border,
        i: item("minecraft:book", "form.setting.button.info", "§e"),
        n: item("minecraft:nether_star", "national.tier.level", "§d"),
        r: item("minecraft:golden_axe", "form.setting.button.role", "§c"),
        m: item("minecraft:ender_eye", "form.setting.button.members", "§b"),
        t: item("minecraft:emerald_block", "form.setting.button.treasury", "§6"),
        g: item("minecraft:grass", "form.setting.button.plotgroup", HasPermission(player, "plotAdmin") ? "§a" : "§8"),
        o: item("minecraft:writable_book", "form.setting.button.invite", "§a"),
        b: item("textures/ui/arrow_left", "mc.button.back", "§a"),
        d: item("minecraft:barrier", "form.setting.button.delete", canDelete ? "§c" : "§8"),
    });
    form.show(player).then((rs) => {
        if (rs.canceled) return;
        switch (rs.selection) {
            case 10: return inviteMainDefaultForm(player);
            case 13: return settingCountryInfoDefaultForm(player);
            case 16: return settingCountryRoleDefaultForm(player);
            case 28: return settingCountryMembersDefaultForm(player);
            case 34:
                if (!national_tier_level.enabled) return player.sendMessage({ translate: "national.tier.level.novalidity" });
                return nationalTierLevelDefaultForm(player);
            case 39: return treasuryMainDefaultForm(player);
            case 41: return settingCountryPlotGroupDefaultForm(player);
            case 45:
                if (canDelete) return countryDeleteCheckDefaultForm(player);
                return;
            case 53: return playerMainMenuTownyForm(player);
        }
    });
}

export function joinTypeSelectTownyForm(player: Player) {
    const form = new ChestFormData("small");
    form.setTitle([{ text: "§2§lTowny §8- " }, { translate: "form.invite.title" }]);
    form.setPattern([0, 0], ["xxxxxxxxx", "xxixlxxxx", "bxxxxxxxc"], {
        x: border,
        i: item("minecraft:writable_book", "form.invite.check.invite", "§e"),
        l: item("minecraft:grass", "form.invite.list.allowjoin", "§a"),
        b: item("textures/ui/arrow_left", "mc.button.back", "§a"),
        c: item("minecraft:barrier", "mc.button.close", "§c"),
    });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) system.runTimeout(() => joinTypeSelectTownyForm(player), 10);
            else playerMainMenuTownyForm(player);
            return;
        }
        if (rs.selection === 11) return countryInvitesListDefaultForm(player);
        if (rs.selection === 13) return allowJoinCountriesListDefaultForm(player);
        if (rs.selection === 18) return playerMainMenuTownyForm(player);
    });
}
