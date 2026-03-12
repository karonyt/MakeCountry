import { Player } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../api/dyp.js";
import { CountryManager } from "../../../api/country/country.js";
import { showCountryInfoDefaultForm } from "./show.js";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../jsdoc/country").CountryData} CountryData*/

const PAGE_SIZE = 20;
const COUNTRY_FILTER_OPTIONS = [
    "all",
    "non_peace",
    "peace",
    "not_invite",
    "invite",
    "public_spawn",
] as const;

const COUNTRY_FILTER_LABEL_KEYS = [
    "form.countrylist.filter.all",
    "form.countrylist.filter.non_peace",
    "form.countrylist.filter.peace",
    "form.countrylist.filter.not_invite",
    "form.countrylist.filter.invite",
    "form.countrylist.filter.public_spawn",
];

function getFilterTranslateKey(filterMode: any) {
    return `form.countrylist.filter.${filterMode}`;
}

function stripFormat(text: any) {
    return `${text ?? ""}`.replace(/[§\u00A7]./g, "").toLowerCase();
}

function matchesCountryFilter(countryData: any, filterMode: any) {
    switch (filterMode) {
        case "non_peace":
            return !countryData.peace;
        case "peace":
            return !!countryData.peace;
        case "not_invite":
            return !countryData.invite;
        case "invite":
            return !!countryData.invite;
        case "public_spawn":
            return !!countryData.publicSpawn;
        default:
            return true;
    }
}

/**
 * @param {Player} player
 * @param {string|undefined} type
 * @param {string} query
 * @param {number} page
 * @param {string} filterMode
 */
export function countryListDefaultForm(
    player: any,
    type = undefined,
    query = "",
    page = 0,
    filterMode = "all"
) {
    const form = new ActionFormData();
    form.title({ translate: `form.countrylist.title` });

    const countryDB = new DynamicProperties('country');
    const playerDB = new DynamicProperties('player');

    const playerData = JSON.parse(playerDB.get(`player_${player.id}`) ?? "null");
    const pcm = playerData?.country ? new CountryManager(playerData.country) : undefined;
    const pcd = pcm?.countryData;

    let countryIds = [];
    if (!type) {
        countryIds = countryDB.idList;
    } else if (type === 'al') {
        countryIds = pcd?.alliance.map((id: any) => `country_${id}`) ?? [];
    } else if (type === 'fl') {
        countryIds = pcd?.friendly.map((id: any) => `country_${id}`) ?? [];
    }

    const normalizedQuery = stripFormat(query);
    const countries = countryIds
        .map((id: any) => {
            const raw = countryDB.get(id);
            return raw ? JSON.parse(raw) : null;
        })
        .filter(Boolean)
        .filter((c: any) => matchesCountryFilter(c, filterMode))
        .filter((c: any) => !normalizedQuery
            || stripFormat(c.name).includes(normalizedQuery)
            || String(c.id).includes(normalizedQuery)
        );

    const maxPage = Math.max(0, Math.ceil(countries.length / PAGE_SIZE) - 1);
    page = Math.min(Math.max(page, 0), maxPage);

    const pageCountries = countries.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE
    );

    if (pageCountries.length === 0) {
        form.body({
            rawtext: [
                { translate: 'mc.button.serch' },
                { text: ': ' },
                query ? { text: `${query}\n` } : { translate: 'none' },
                { translate: 'form.countrylist.filter.label' },
                { text: ': ' },
                { translate: getFilterTranslateKey(filterMode) },
                { text: '\n' },
                { translate: `no.countries.world` }
            ]
        });
    } else {
        form.body({
            rawtext: [
                { translate: 'mc.button.serch' },
                { text: ': ' },
                query ? { text: `${query}\n` } : { translate: 'none' },
                { translate: 'form.countrylist.filter.label' },
                { text: ': ' },
                { translate: getFilterTranslateKey(filterMode) },
                { text: `\n${page + 1} / ${maxPage + 1}` }
            ]
        });
        for (const c of pageCountries) {
            form.button(`${c.name}\n§rID:${c.id} Lv:${c.lv ?? 0}`);
        }
    }

    form.button({ translate: 'mc.button.serch' });
    if (page > 0) form.button("<--");
    if (page < maxPage) form.button("-->");
    form.button({ translate: `mc.button.close` });

    form.show(player).then(rs => {
        if (rs.canceled) return;

        let index = rs.selection;
        const navOffset = pageCountries.length;

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        if (index < pageCountries.length) {
            // @ts-ignore TS(2538): Type 'undefined' cannot be used as an index type.
            showCountryInfoDefaultForm(player, pageCountries[index], type, query, page, filterMode);
            return;
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        index -= navOffset;

        if (index === 0) {
            return showCountrySearchForm(player, type, query, filterMode);
        }

        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        index--;

        if (page > 0) {
            if (index === 0) {
                return countryListDefaultForm(player, type, query, page - 1, filterMode);
            }
            // @ts-ignore TS(2532): Object is possibly 'undefined'.
            index--;
        }

        if (page < maxPage && index === 0) {
            return countryListDefaultForm(player, type, query, page + 1, filterMode);
        }
    });
}

function showCountrySearchForm(player: any, type: any, query = "", filterMode = "all") {
    const form = new ModalFormData();
    form.title({ translate: 'mc.button.serch' });
    form.textField(
        { translate: 'form.serchinvite.word.label' },
        { translate: 'form.makecountry.name.input' },
        { defaultValue: query }
    );
    form.dropdown({ translate: "form.countrylist.filter.label" }, COUNTRY_FILTER_LABEL_KEYS.map((key) => ({ translate: key })), {
        defaultValueIndex: Math.max(0, COUNTRY_FILTER_OPTIONS.indexOf(filterMode as any))
    });

    form.show(player).then(rs => {
        if (rs.canceled) return;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const nextQuery = `${rs.formValues[0] ?? ""}`;
        // @ts-ignore TS(2532): Object is possibly 'undefined'.
        const filterIndex = Number(rs.formValues[1] ?? 0);
        const nextFilterMode = COUNTRY_FILTER_OPTIONS[filterIndex] ?? "all";
        countryListDefaultForm(player, type, nextQuery, 0, nextFilterMode);
    });
}
