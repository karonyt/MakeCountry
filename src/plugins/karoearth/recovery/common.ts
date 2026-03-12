import { system } from "@minecraft/server";

export function waitTicks(ticks: any) {
    return new Promise(resolve => {
        // @ts-ignore TS(2345): Argument of type '(value: unknown) => void' is not... Remove this comment to see the full error message
        system.runTimeout(resolve, ticks);
    });
}

export function encodeBlock(block: any) {
    if (!block) return "minecraft:air";
    // @ts-ignore TS(2367): This condition will always return 'false' since th... Remove this comment to see the full error message
    if (!block.typeId == "minecraft:air") return "minecraft:air"
    const states = block.permutation.getAllStates();
    const s = Object.keys(states).length
        ? "[" + Object.entries(states).map(([k, v]) => `${k}=${v}`).join(",") + "]"
        : "";
    return block.typeId + s;
}

export function decodeBlock(str: any) {
    const m = str.match(/^([^\[]+)(?:\[(.+)\])?$/);
    if (!m) return { id: "minecraft:air", states: {} };

    const id = m[1];
    const states = {};

    if (m[2]) {
        for (const kv of m[2].split(",")) {
            const [k, raw] = kv.split("=");

            if (raw === "true") {
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                states[k] = true;
            } else if (raw === "false") {
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                states[k] = false;
            } else if (!isNaN(raw)) {
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                states[k] = Number(raw);
            } else {
                // @ts-ignore TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                states[k] = raw;
            }
        }
    }

    return { id, states };
}
