export const LEGACY_DYNAMIC_PROPERTY_CHUNK_SIZE = 20000;

export function legacyCollectionIdsKey(name: string) {
    return `${name}ids`;
}

export function legacyCollectionEntryKey(name: string, key: string) {
    return `${name}#${key}`;
}

export function legacyDynamicPropertyChunkKey(id: string, index: number) {
    return `dyp#${id}#dy${index}`;
}

export function legacyDynamicPropertyMetaKey(id: string) {
    return `dyp#${id}#meta`;
}
