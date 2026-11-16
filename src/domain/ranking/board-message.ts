import type { RawMessage } from "@minecraft/server";

export type BoardRow = { name: string; value: RawMessage };

/** ランキング看板の表示内容 (タイトル・合計・順位の行) を作る。 */
export function boardMessage(title: RawMessage, rows: BoardRow[], total?: RawMessage): RawMessage {
    const rawtext: RawMessage[] = [title];
    if (total) {
        rawtext.push({ text: "\n" }, { translate: "game.ui.ranking.total", with: { rawtext: [total] } });
    }
    for (const [index, row] of rows.entries()) {
        rawtext.push({ text: "\n" }, {
            translate: "game.ui.ranking.row",
            with: { rawtext: [{ text: String(index + 1) }, { text: row.name }, row.value] },
        });
    }
    return { rawtext };
}
