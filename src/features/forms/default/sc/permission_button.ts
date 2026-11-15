import type { RawMessage } from "@minecraft/server";
import { CheckPermission } from "@/shared/utils/minecraft.js";

/**
 * /sc の画面のボタンの文字。権限が無くて押しても断られるものは赤で出す
 * (押してから「権限がありません」と言われる前に、どれが使えるのか分かるように)。
 *
 * allowed に権限名を渡すと CheckPermission で確かめる。CheckPermission は「できない」とき true を
 * 返すので、向きはここで揃える。権限名 1 つで決まらないものは、使えるかどうかを boolean で渡す。
 */
export function permissionButton(player: any, key: string, allowed: string | boolean): RawMessage {
    const ok = typeof allowed === "string" ? !CheckPermission(player, allowed) : allowed;
    return ok ? { translate: key } : { rawtext: [{ text: "§c" }, { translate: key }] };
}
