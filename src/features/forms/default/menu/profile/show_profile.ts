import { callHook, readValue } from "@/shared/hooks.js";
import { SocialActionForm as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { callPlayerMainMenuForm } from "@/features/forms/form-registry.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData*/

/**
 * Show profile.
 * @param {Player} player
 */
export function showProfileDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties("player");
    /**
     * @type {PlayerData}
     */
    // @ts-ignore
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));

    const showProfile = [
        { translate: "msg.name" }, { text: `${playerData?.name}\n` },
        { translate: "msg.lv" }, { text: `${player.level}\n` },
        { translate: "msg.havemoney" }, { text: `${playerData?.money}\n` },
        { translate: "msg.days" }, { text: `${playerData?.days}\n` },
        { translate: "msg.country" }, playerData?.country ? { text: `${playerData.country}` } : { translate: "none" }, { text: "\n" },
        { translate: "msg.marriage" }, readValue<string | undefined>("life.spouseName", player.id, undefined) ? { text: readValue("life.spouseName", player.id, "") } : { translate: "none" }, { text: "\n" },
        { translate: "msg.invite" }, typeof playerData?.invite?.length === "number" ? { text: `${playerData.invite.length}` } : { translate: "none" }, { text: "\n" },
        { translate: "msg.havechunks" }, { text: `${playerData?.chunks.length}` }
    ];

    const form = new ActionFormData();
    form.title({ translate: "form.profile.title" });
    form.body({ rawtext: showProfile });
    form.button({ translate: "marriage.title" });
    form.button({ translate: "mc.button.back" });
    form.button({ translate: "mc.button.close" });
    form.show(player).then((rs: any) => {
        if (rs.canceled) {
            callPlayerMainMenuForm(player);
            return;
        }
        switch (rs.selection) {
            case 0: {
                if (!callHook("life.openMarriage", player)) player.sendMessage({ translate: "makecountry.module.missing", with: { rawtext: [{ translate: "makecountry.module.life" }] } });
                break;
            }
            case 1: {
                callPlayerMainMenuForm(player);
                break;
            }
            case 2: {
                break;
            }
        }
    });
}
