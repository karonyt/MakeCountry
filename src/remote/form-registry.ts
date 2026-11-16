/**
 * 機能パック用のメニュー呼び出し。メニューは Lite が持っているので、Lite に開いてもらう。
 * (機能パックの画面の「戻る」などから使われる)
 */
import { callHook } from "@/shared/hooks.js";

function openMainMenu(player: any) {
    callHook("lite.openMainMenu", player);
}
export const callPlayerMainMenuForm = openMainMenu;
export const callSettingCountryForm = openMainMenu;
export const callCountryListForm = (player: any, _al = false) => openMainMenu(player);
export const callMakeCountryForm = openMainMenu;
export const callJoinTypeSelectForm = openMainMenu;
