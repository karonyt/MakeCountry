import { ActionFormData } from "@minecraft/server-ui";
import { CountryManager } from "@/domain/country/country-manager.js";
import { AddFederationListDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/add/add_list.js";
import { Player } from "@minecraft/server";
import { checkAddFederationDefaultForm } from "@/features/forms/default/sc/info/ext/fd/list/add/check.js";
import { DynamicProperties } from "@/shared/storage/dynamic-properties.js";
import { normalizeFederationData } from "@/domain/country/relationships/federation.js";

/**
 * 連邦政府候補一覧から選んだ連邦
 * @param {Player} player
 * @param {number} countryId
 */
export function addFederationCountryFromListDefaultForm(player: any, countryId: any) {
    try {
        const countryDataBase = new DynamicProperties("country");
        const countryManager = new CountryManager(countryId);
        const countryData = countryManager.countryData;
        const federation = normalizeFederationData(countryData);
        const capitalRaw = federation.capital ? countryDataBase.get(`country_${federation.capital}`) : undefined;
        const capitalData = capitalRaw ? JSON.parse(capitalRaw) : undefined;

        const form = new ActionFormData();
        form.title(federation.name);
        form.body({
            rawtext: [
                { translate: `federation.government.name` }, { text: `: ${federation.name}\n` },
                { translate: `federation.government.capital` }, { text: `: ${capitalData?.name ?? "None"}\n` },
                { translate: `federation.government.members` }, { text: `: ${federation.members.length}` }
            ]
        });
        form.button({ translate: `mc.button.close` });
        form.button({ translate: `mc.button.send` });
        form.show(player).then(rs => {
            if (rs.canceled) {
                AddFederationListDefaultForm(player);
                return;
            }
            switch (rs.selection) {
                case 0: {
                    AddFederationListDefaultForm(player);
                    return;
                }
                case 1: {
                    checkAddFederationDefaultForm(player, countryData.id);
                    return;
                }
            }
        });
    } catch (error) {
        console.warn(error);
    }
}
