/**
 * プレイヤーに全レシピを解放する。
 *
 * 第2引数は、国家レベルを渡している既存の呼び出し元との互換性のために残す。
 */
export function updateRecipe(player: any, _lv?: number) {
    player.runCommand(`recipe give @s *`);
}
