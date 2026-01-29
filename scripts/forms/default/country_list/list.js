import { Player, system } from "@minecraft/server";
import { ActionFormData, FormCancelationReason, ModalFormData } from "@minecraft/server-ui";
import { DynamicProperties } from "../../../api/dyp";
import { CountryManager } from "../../../api/country/country";
import { showCountryInfoDefaultForm } from "./show";
/**@typedef {import("../../../jsdoc/player").PlayerData} PlayerData*/
/**@typedef {import("../../../jsdoc/country").CountryData} CountryData*/

const PAGE_SIZE = 20;

/**
 * @param {Player} player
 * @param {string|undefined} type
 * @param {string} query
 * @param {number} page
 */
export function countryListDefaultForm(
    player,
    type = undefined,
    query = "",
    page = 0
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
        countryIds = pcd?.alliance.map(id => `country_${id}`) ?? [];
    } else if (type === 'fl') {
        countryIds = pcd?.friendly.map(id => `country_${id}`) ?? [];
    }

    // 取得 & 検索
    let countries = countryIds
        .map(id => {
            const raw = countryDB.get(id);
            return raw ? JSON.parse(raw) : null;
        })
        .filter(Boolean)
        .filter(c =>
            !query ||
            c.name.includes(query) ||
            String(c.id).includes(query)
        );

    const maxPage = Math.max(0, Math.ceil(countries.length / PAGE_SIZE) - 1);
    page = Math.min(Math.max(page, 0), maxPage);

    const pageCountries = countries.slice(
        page * PAGE_SIZE,
        page * PAGE_SIZE + PAGE_SIZE
    );

    if (pageCountries.length === 0) {
        form.body({ translate: `no.countries.world` });
    } else {
        form.body({ rawtext: [{ translate: 'mc.button.serch' }, { text: `${query || "None"}\n${page + 1} / ${maxPage + 1}` }] });
        for (const c of pageCountries) {
            form.button(`${c.name}\n§rID:${c.id} Lv:${c.lv ?? 0}`);
        }
    }

    // ナビゲーション
    form.button({ translate: 'mc.button.serch' });
    if (page > 0) form.button("<--");
    if (page < maxPage) form.button("-->");
    form.button({ translate: `mc.button.close` });

    form.show(player).then(rs => {
        if (rs.canceled) return;

        let index = rs.selection;
        const navOffset = pageCountries.length;

        // 国選択
        if (index < pageCountries.length) {
            showCountryInfoDefaultForm(player, pageCountries[index], type);
            return;
        }

        index -= navOffset;

        // 検索
        if (index === 0) {
            return showCountrySearchForm(player, type);
        }

        index--;

        // 前へ
        if (page > 0) {
            if (index === 0) {
                return countryListDefaultForm(player, type, query, page - 1);
            }
            index--;
        }

        // 次へ
        if (page < maxPage && index === 0) {
            return countryListDefaultForm(player, type, query, page + 1);
        }
    });
}

/**
 * 検索入力フォーム
 */
function showCountrySearchForm(player, type) {
    const form = new ModalFormData();
    form.title({ translate: 'mc.button.serch' });
    form.textField({ translate: 'form.serchinvite.word.label' }, { translate: 'form.makecountry.name.input' });

    form.show(player).then(rs => {
        if (rs.canceled) return;
        const query = rs.formValues[0] ?? "";
        countryListDefaultForm(player, type, query, 0);
    });
}
