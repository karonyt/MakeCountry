import { SocialActionForm as ActionFormData } from "@/shared/ui/purpose-forms.js";
import { Player } from "@minecraft/server";
import config from "@/config/server.js";
import { callPlayerMainMenuForm } from "@/features/forms/form-registry.js";
import { penNameBeforeDefaultForm } from "@/features/forms/default/menu/pen_name/before.js";
import { penNameAfterDefaultForm } from "@/features/forms/default/menu/pen_name/after.js";

/**
 * 二つ名メインフォーム
 * @param {Player} player 
 */
export function penNameMainDefaultForm(player: any) {
    const form = new ActionFormData();
    let penNameBefore = player.getDynamicProperty(`pennameBefore`) || config.initialPennameBefore;
    let penNameAfter = player.getDynamicProperty(`pennameAfter`) || config.initialPennameAfter;
    form.body(`${penNameBefore}${penNameAfter}`);
    form.button({ rawtext: [{ translate: `form.penname.button.before` }, { text: `\n${penNameBefore}` }] });
    form.button({ rawtext: [{ translate: `form.penname.button.after` }, { text: `\n${penNameAfter}` }] });
    form.show(player).then((rs) => {
        if (rs.canceled) {
            callPlayerMainMenuForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                penNameBeforeDefaultForm(player);
                break;
            };
            case 1: {
                penNameAfterDefaultForm(player);
                break;
            };
        };
    });
};
