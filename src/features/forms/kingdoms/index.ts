import { callHook, readValue } from "@/shared/hooks.js";
import { Player, system } from "@minecraft/server";
import { FormCancelationReason } from "@minecraft/server-ui";
import config from "@/config/server.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { ChestFormData } from "@/shared/ui/chest-form.js";
import { getChestIconPath } from "@/shared/minecraft/item-presentation.js";
import { TimeManager } from "@/domain/time/time.js";
import { showProfileDefaultForm } from "@/features/forms/default/menu/profile/show_profile.js";
import { sendMoneyDefaultForm } from "@/features/forms/default/menu/send_money/send_money.js";
import { joinTypeSelectKingdomsForm } from "@/features/forms/kingdoms/join.js";
import { playerSettingDefaultForm } from "@/features/forms/default/menu/setting/setting.js";
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

const blackGlass = {
    iconPath: "textures/blocks/glass_black",
    name: "",
    lore: [],
    editedName: true,
};
const redGlass = {
    iconPath: "textures/blocks/glass_red",
    name: "",
    lore: [],
    editedName: true,
};

function translatedItem(iconPath: string, translate: string, color = "§6", lore: any[] = []) {
    return {
        // テクスチャパスを直接渡し、現行クライアントで透明になる旧数値ID rendererを避ける。
        iconPath: getChestIconPath(iconPath),
        name: [{ text: color }, { translate }],
        lore,
        editedName: true,
    };
}

function buildMainMenuLore() {
    
    const buffs = readValue<Record<string, any[]>>("jobs.buffs", "", {});
    const activeBuffs = Object.values(buffs).reduce((count: number, entries: any) => count + entries.length, 0);
    const date = new TimeManager(1000).getCalendar();
    return [
        { text: `§7${date.year}/${date.month}/${date.day} ${date.hours}:${date.minutes < 10 ? "0" : ""}${date.minutes}` },
        { text: `§7\nActive buffs: §b${activeBuffs}` },
    ];
}

/** KingdomsX の Nexus を参考にした、装飾枠つきの6段メニュー。 */
export function playerMainMenuKingdomsForm(player: Player) {
    const form = new ChestFormData("large");
    form.setTitle([{ text: "§6§lNexus §8- " }, { translate: "form.mainmenu.title" }]);
    form.setPattern([0, 0], [
        "brbbrbbrb",
        "rr..u..rr",
        "b..sp.m.b",
        "b...t...b",
        "rr.f.n.rr",
        "brbbrbbrc",
    ], {
        b: blackGlass,
        r: redGlass,
        p: translatedItem("minecraft:book", "form.mainmenu.button.profile", "§e", buildMainMenuLore()),
        m: translatedItem("minecraft:chest", "form.mainmenu.button.sendmoney", "§a"),
        f: translatedItem("minecraft:cod", "form.mainmenu.button.fish_encyclopedia", "§b"),
        u: translatedItem("minecraft:compass", "form.mainmenu.button.setting", "§d"),
        n: translatedItem("minecraft:bookshelf", "form.mainmenu.button.penname", "§e"),
        s: translatedItem("minecraft:redstone_lamp", "form.setting.title", "§6"),
        t: translatedItem("minecraft:writable_book", "form.mainmenu.button.join", "§a"),
        c: translatedItem("minecraft:barrier", "mc.button.close", "§c"),
    });

    form.show(player).then((rs) => {
        if (rs.canceled) {
            if (rs.cancelationReason === FormCancelationReason.UserBusy) {
                system.runTimeout(() => playerMainMenuKingdomsForm(player), 10);
            }
            return;
        }
        switch (rs.selection) {
            case 13: return playerSettingDefaultForm(player);
            case 21: {
                const raw = new DynamicProperties("player").get(`player_${player.id}`);
                const playerData = raw ? JSON.parse(raw) : undefined;
                return playerData?.country ? settingCountryKingdomsForm(player) : joinTypeSelectKingdomsForm(player);
            }
            case 22: return showProfileDefaultForm(player);
            case 24: return sendMoneyDefaultForm(player);
            case 31: return joinTypeSelectKingdomsForm(player);
            case 39: { if (!callHook("fishing.openEncyclopedia", player)) player.sendMessage({ translate: "makecountry.module.missing", with: { rawtext: [{ translate: "makecountry.module.fishing" }] } }); return; }
            case 41:
                if (config.pennameEnable) { if (!callHook("life.openPenName", player)) player.sendMessage({ translate: "makecountry.module.missing", with: { rawtext: [{ translate: "makecountry.module.life" }] } }); return; }
                return;
        }
    });
}

/** KingdomsX の Nexus/Kingdom Settings 構成を参考にした国管理ハブ。 */
export function settingCountryKingdomsForm(player: Player) {
    const form = new ChestFormData("large");
    const canDelete = !CheckPermission(player, "owner");
    form.setTitle([{ text: "§6§lNexus §8- " }, { translate: "form.setting.title" }]);
    form.setPattern([0, 0], [
        "brbbrbbrb",
        "RR..i..RR",
        "b..pa.mqb",
        "b...l...b",
        "RR.t.g.RR",
        "bRbbRbbRd",
    ], {
        b: blackGlass,
        R: redGlass,
        i: translatedItem("minecraft:book", "form.setting.button.info", "§e"),
        l: translatedItem("minecraft:nether_star", "national.tier.level", "§d", [],),
        q: translatedItem("minecraft:writable_book", "form.setting.button.invite", "§a"),
        m: translatedItem("minecraft:name_tag", "form.setting.button.members", "§b"),
        a: translatedItem("minecraft:bookshelf", "form.setting.button.role", "§c"),
        p: translatedItem("minecraft:redstone_lamp", "form.setting.button.plotgroup", HasPermission(player, "plotAdmin") ? "§a" : "§8"),
        g: translatedItem("minecraft:barrier", "form.setting.button.delete", canDelete ? "§c" : "§8"),
        t: translatedItem("minecraft:hay_block", "form.setting.button.treasury", "§e"),
        d: translatedItem("minecraft:barrier", "mc.button.close", "§c"),
    });

    form.show(player).then((rs) => {
        if (rs.canceled) return;
        switch (rs.selection) {
            case 13: return settingCountryInfoDefaultForm(player);
            case 21: return settingCountryPlotGroupDefaultForm(player);
            case 22: return settingCountryRoleDefaultForm(player);
            case 24: return settingCountryMembersDefaultForm(player);
            case 25: return inviteMainDefaultForm(player);
            case 31:
                if (!national_tier_level.enabled) return player.sendMessage({ translate: "national.tier.level.novalidity" });
                return nationalTierLevelDefaultForm(player);
            case 39: return treasuryMainDefaultForm(player);
            case 41:
                if (canDelete) return countryDeleteCheckDefaultForm(player);
                return;
            case 53: return playerMainMenuKingdomsForm(player);
        }
    });
}

