import { world } from "@minecraft/server";

const KEY = "copy_done_chunks";

function load() {
    try {
        const v = world.getDynamicProperty(KEY);
        // @ts-ignore TS(2345): Argument of type 'string | number | true | Vector3... Remove this comment to see the full error message
        return v ? new Set(JSON.parse(v)) : new Set();
    } catch {
        return new Set();
    }
}

function save(set: any) {
    world.setDynamicProperty(KEY, JSON.stringify([...set]));
}

export const ChunkState = {
    isDone(cx: any, cz: any) {
        return load().has(`${cx},${cz}`);
    },

    markDone(cx: any, cz: any) {
        const s = load();
        s.add(`${cx},${cz}`);
        save(s);
    },

    clear() {
        save(new Set());
    }
};
