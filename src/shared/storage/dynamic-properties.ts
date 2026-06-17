import { world } from "@minecraft/server";
import {
    LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE,
    legacyCollectionEntryKey,
    legacyCollectionIdsKey,
    legacyDynamicPropertyChunkKey,
    legacyDynamicPropertyMetaKey,
} from "@/shared/storage/legacy-schema.js";

export class DynamicProperties {
    name: any;
    /**
     * @param {string} name
     */
    constructor(name: any) {
        this.name = name;
    }

    /**
     * @type {Array<string>}
     */
    get idList() {
        const keys = getDynamicProperty(legacyCollectionIdsKey(this.name));
        return keys ? JSON.parse(keys) : [];
    }

    /**
     * 
     * @param {string} key
     * @returns {string|undefined} 
     */
    get(key: any) {
        return getDynamicProperty(legacyCollectionEntryKey(this.name, `${key}`));
    }

    /**
     * 
     * @param {string} key
     * @param {string} value
     */
    set(key: any, value: any) {
        setDynamicProperty(legacyCollectionEntryKey(this.name, `${key}`), typeof value == 'string' ? value : JSON.stringify(value));
        const ids = this.idList;
        if (ids.includes(key)) return this;
        setDynamicProperty(legacyCollectionIdsKey(this.name), JSON.stringify([...ids, key]));
        return this;
    }

    /**
     * @param {string} key
     */
    has(key: any) {
        return this.idList.includes(key);
    }

    /**
     * 
     * @param {string} key
     */
    delete(key: any) {
        deleteDynamicProperty(legacyCollectionEntryKey(this.name, `${key}`));
        const ids = this.idList;
        setDynamicProperty(legacyCollectionIdsKey(this.name), JSON.stringify(ids.filter((id: any) => id != key)));
    }

    clear() {
        const ids = this.idList;
        for (const id of ids) {
            deleteDynamicProperty(legacyCollectionEntryKey(this.name, `${id}`));
        }
        setDynamicProperty(legacyCollectionIdsKey(this.name), "[]");
    }
}

export function describeDynamicPropertyEntry(name: any, key: any) {
    const entryKey = legacyCollectionEntryKey(name, `${key}`);
    return `${entryKey} (chunk0=${legacyDynamicPropertyChunkKey(entryKey, 0)}, meta=${legacyDynamicPropertyMetaKey(entryKey)})`;
}

/**
 * 
 * @param {string} id
 * @param {string} value
 */
export function setDynamicProperty(id: any, value: any) {
    if (typeof value !== "string") {
        throw ReferenceError("Input must be a string");
    }

    const chunks = Math.ceil(value.length / LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE);

    for (let i = 0; i < chunks; i++) {
        world.setDynamicProperty(
            legacyDynamicPropertyChunkKey(id, i),
            value.substring(i * LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE, (i + 1) * LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE)
        );
    }

    for (let i = chunks; ; i++) {
        const key = legacyDynamicPropertyChunkKey(id, i);
        if (!world.getDynamicProperty(key)) break;
        world.setDynamicProperty(key, undefined);
    }

    world.setDynamicProperty(
        legacyDynamicPropertyMetaKey(id),
        JSON.stringify({ chunks })
    );
}

/**
 * @param {string} id
 */
export function deleteDynamicProperty(id: any) {
    const metaRaw = world.getDynamicProperty(legacyDynamicPropertyMetaKey(id));

    const max = metaRaw
        // @ts-ignore
        ? JSON.parse(metaRaw).chunks
        : 10000;

    for (let i = 0; i < max; i++) {
        const key = legacyDynamicPropertyChunkKey(id, i);
        if (!world.getDynamicProperty(key)) break;
        world.setDynamicProperty(key, undefined);
    }

    world.setDynamicProperty(legacyDynamicPropertyMetaKey(id), undefined);
}

/**
 *
 * @param {string} id
 * @returns {string|undefined}
 */
export function getDynamicProperty(id: any) {
    const metaKey = legacyDynamicPropertyMetaKey(id);
    const metaRaw = world.getDynamicProperty(metaKey);

    const chunks = [];
    let count = 0;

    if (metaRaw) {
        // @ts-ignore TS(2345): Argument of type 'string | number | true | Vector3... Remove this comment to see the full error message
        const meta = JSON.parse(metaRaw);
        for (let i = 0; i < meta.chunks; i++) {
            const v = world.getDynamicProperty(legacyDynamicPropertyChunkKey(id, i));
            if (!v) break;
            chunks.push(v);
        }
        return chunks.length ? chunks.join("") : undefined;
    }

    for (let i = 0; i < 10000; i++) {
        const v = world.getDynamicProperty(legacyDynamicPropertyChunkKey(id, i));
        if (!v) break;
        chunks.push(v);
        count++;
    }

    if (count === 0) return undefined;

    world.setDynamicProperty(
        metaKey,
        JSON.stringify({ chunks: count })
    );

    return chunks.join("");
}

/**
 * 
 * @returns {string[]}
 */
export function getDynamicPropertyIds() {
    const inputArray = world.getDynamicPropertyIds();
    const pattern = /^dyp#(.+)#dy\d+$/;
    const result: any = [];

    inputArray.forEach(item => {
        const match = item.match(pattern);
        if (match) result.push(match[1]);
    });

    return result;
}
