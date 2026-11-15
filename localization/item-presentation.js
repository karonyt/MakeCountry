// Comparison-only canonicalization. Saved trade records and item stats are untouched.
import entries from './catalog/all.js';
import { createLocalizer } from './runtime.js';
const ui=createLocalizer(entries);
// 配布版: ハンター系アイテム(ルーン・武器スキル本)の判定は除外し、説明文の原文化のみ行う
export function normalizeTradePresentation(item) {
    const name=item.name||undefined;
    const lore=(item.lore??[]).map(line=>ui.original(line)??line);
    return {name,lore};
}
const stockEquipment=/^(?:§7(?:識別: |精錬: |強化: |魔導精錬: |鍛冶品質: )|§c攻撃 \+|§b防御 \+|§a生命 \+|§8武器スキル識別: |§d武器スキル: |§7武器スキル操作: )/;
// Native getRawLore() wraps old plain strings in {text:...}; translated entries
// must stay untouched so an inventory-change event cannot queue another rewrite.
function plainLore(line) {
    if(typeof line==='string')return line;
    return line && typeof line==='object' && Object.keys(line).length===1 && typeof line.text==='string' ? line.text : undefined;
}
export function localizeLegacyEquipmentLore(typeId,lines) {
    if(!/^mc:sl_gear_\d{4}$/.test(typeId) || !lines.some(line=>{const source=plainLore(line);return source!==undefined&&stockEquipment.test(source);}))return undefined;
    return lines.map(line=>{
        const source=plainLore(line);
        if(source!==undefined&&stockEquipment.test(source))return ui.raw(source);
        return typeof line==='string'?{text:line}:line;
    });
}
