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
    const pattern = `dyp#${id}#dy`;
    if (typeof value !== 'string') {
        throw ReferenceError("Input must be a string");
    }

    const existingKeys = [];
    for (let i = 0; i < 10000; i++) {
        const test = world.getDynamicProperty(`${pattern}${i}`);
        if (!test) break;
        existingKeys.push(i);
    }

    const chunkSize = 20000;

    const newValueLength = Math.ceil(value.length / chunkSize);
    for (let i = 0; i < Math.max(existingKeys.length, newValueLength); i++) {
        if (i <= newValueLength) {
            world.setDynamicProperty(`${pattern}${i}`, value.substring(i * chunkSize, (i + 1) * chunkSize));
            continue;
        }
        world.setDynamicProperty(`${pattern}${i}`, undefined);
    }
}

/**
 * @param {string} id
 */
export function deleteDynamicProperty(id) {
    const pattern = `dyp#${id}#dy`;

    const existingKeys = [];
    for (let i = 0; i < 10000; i++) {
        const test = world.getDynamicProperty(`${pattern}${i}`);
        if (!test) break;
        existingKeys.push(i);
    }

    for (let i = 0; i < existingKeys.length; i++) {
        world.setDynamicProperty(`${pattern}${i}`, undefined);
    }
}

/**
 *
 * @param {string} id
 * @returns {string|undefined}
 */
export function getDynamicProperty(id) {
    const matches = [];
    const pattern = `dyp#${id}#dy`;
    for (let i = 0; i < 10000; i++) {
        const test = world.getDynamicProperty(`${pattern}${i}`);
        if (!test) break;
        matches.push(test);
    }
    return matches.length > 0 ? matches.join('') : undefined;
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
