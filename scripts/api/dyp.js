import { world } from "@minecraft/server";

export class DynamicProperties {
    /**
     * @param {string} name
     */
    constructor(name) {
        this.name = name;
    }

    /**
     * @type {Array<string>}
     */
    get idList() {
        const keys = getDynamicProperty(`${this.name}ids`);
        return keys ? JSON.parse(keys) : [];
    }

    /**
     * 
     * @param {string} key
     * @returns {string|undefined} 
     */
    get(key) {
        return getDynamicProperty(`${this.name}#${key}`);
    }

    /**
     * 
     * @param {string} key
     * @param {string} value
     */
    set(key, value) {
        setDynamicProperty(`${this.name}#${key}`, typeof value == 'string' ? value : JSON.stringify(value));
        if (this.idList.includes(key)) return this;
        setDynamicProperty(`${this.name}ids`, JSON.stringify([...this.idList, key]));
        return this;
    }

    /**
     * @param {string} key
     */
    has(key) {
        return this.idList.includes(key);
    }

    /**
     * 
     * @param {string} key
     */
    delete(key) {
        deleteDynamicProperty(`${this.name}#${key}`);
        setDynamicProperty(`${this.name}ids`, JSON.stringify(this.idList.filter(id => id != key)));
    }

    clear() {
        for (const id of this.idList) {
            this.delete(id);
        }
        setDynamicProperty(`${this.name}ids`, "[]");
    }
}

/**
 * 
 * @param {string} id
 * @param {string} value
 */
export function setDynamicProperty(id, value) {
    if (typeof value !== "string") {
        throw ReferenceError("Input must be a string");
    }

    const pattern = `dyp#${id}#dy`;
    const chunkSize = 20000;
    const chunks = Math.ceil(value.length / chunkSize);

    for (let i = 0; i < chunks; i++) {
        world.setDynamicProperty(
            `${pattern}${i}`,
            value.substring(i * chunkSize, (i + 1) * chunkSize)
        );
    }

    for (let i = chunks; ; i++) {
        const key = `${pattern}${i}`;
        if (!world.getDynamicProperty(key)) break;
        world.setDynamicProperty(key, undefined);
    }

    world.setDynamicProperty(
        `dyp#${id}#meta`,
        JSON.stringify({ chunks })
    );
}

/**
 * @param {string} id
 */
export function deleteDynamicProperty(id) {
    const pattern = `dyp#${id}#dy`;
    const metaRaw = world.getDynamicProperty(`dyp#${id}#meta`);

    const max = metaRaw
        ? JSON.parse(metaRaw).chunks
        : 10000;

    for (let i = 0; i < max; i++) {
        const key = `${pattern}${i}`;
        if (!world.getDynamicProperty(key)) break;
        world.setDynamicProperty(key, undefined);
    }

    world.setDynamicProperty(`dyp#${id}#meta`, undefined);
}

/**
 *
 * @param {string} id
 * @returns {string|undefined}
 */
export function getDynamicProperty(id) {
    const pattern = `dyp#${id}#dy`;
    const metaKey = `dyp#${id}#meta`;
    const metaRaw = world.getDynamicProperty(metaKey);

    const chunks = [];
    let count = 0;

    if (metaRaw) {
        const meta = JSON.parse(metaRaw);
        for (let i = 0; i < meta.chunks; i++) {
            const v = world.getDynamicProperty(`${pattern}${i}`);
            if (!v) break;
            chunks.push(v);
        }
        return chunks.length ? chunks.join("") : undefined;
    }

    for (let i = 0; i < 10000; i++) {
        const v = world.getDynamicProperty(`${pattern}${i}`);
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
    const result = [];

    inputArray.forEach(item => {
        const match = item.match(pattern);
        if (match) result.push(match[1]);
    });

    return result;
}
