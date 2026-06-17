import { Player } from "@minecraft/server";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { CountryManager } from "@/domain/country/country-manager.js";
import { ActionFormData } from "@minecraft/server-ui";
import { CheckPermission } from "@/shared/utils/minecraft.js";
import { AllianceListDefaultForm } from "@/features/forms/default/sc/info/ext/al/list/alliance_list.js";
import { addAllianceCountryFromListDefaultForm } from "@/features/forms/default/sc/info/ext/al/list/add/add.js";
import { getFederationMemberIds } from "@/domain/country/relationships/federation.js";
/**@typedef {import("@/types/legacy/player").PlayerData} PlayerData */

/**
 * 新たに同盟国にする国のリスト
 * @param {Player} player 
 */
export function AddAllianceListDefaultForm(player: any) {
    const playerDataBase = new DynamicProperties('player');
    const countryDataBase = new DynamicProperties('country');
    /**
     * @type {PlayerData}
     */
    // @ts-ignore TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    const playerData = JSON.parse(playerDataBase.get(`player_${player.id}`));
    const countryManager = new CountryManager(playerData.country);
    const playerCountryData = countryManager.countryData;
    let hostilityCountryIds = playerCountryData.hostility;
    let allianceCountryIds = playerCountryData.alliance;
    let federationCountryIds = getFederationMemberIds(playerCountryData);
    let friendlyCountryIds = playerCountryData.friendly;
    const form = new ActionFormData();
    form.title({ translate: `form.check.alliance.send.title` });
    let countryIds = countryDataBase.idList.filter((id: any) => id.startsWith(`country_`)).filter((id: any) => id != `country_${playerData.country}`);
    let filtered1 = countryIds.filter((id: any) => !hostilityCountryIds.includes(Number(id.split('_')[1])));
    let filtered2 = filtered1.filter((id: any) => !allianceCountryIds.includes(Number(id.split('_')[1])));
    let filtered3 = filtered2.filter((id: any) => !federationCountryIds.includes(Number(id.split('_')[1])));
    let filtered4 = filtered3.filter((id: any) => !friendlyCountryIds.includes(Number(id.split('_')[1])));
    form.button({ translate: `mc.button.close` });
    let lands: any = [];
    for (const countryId of filtered4) {
        const countryData = new CountryManager(countryId.split('_')[1]).countryData;
        if (!countryData?.id) {
            countryDataBase.delete(countryId);
            continue;
        }
        lands.push(countryData.id);
        form.button(`${countryData.name}\nID: ${countryData.id}`);
    };
    form.show(player).then((rs) => {
        if (CheckPermission(player, `allyAdmin`)) {
            player.sendMessage({ translate: `no.permission` });
            return;
        };
        if (rs.canceled) {
            AllianceListDefaultForm(player);
            return;
        };
        switch (rs.selection) {
            case 0: {
                //閉じる
                break;
            };
            default: {
                // @ts-ignore TS(2532): Object is possibly 'undefined'.
                addAllianceCountryFromListDefaultForm(player, lands[rs.selection - 1]);
                break;
            };
        };
    });
};
