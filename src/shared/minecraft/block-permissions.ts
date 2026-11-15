import { BlockTypes } from "@minecraft/server";

let identifiersByPath: Map<string, string[]> | undefined;

/** Native permission getters can return custom block names without their namespace. */
export function canonicalBlockPermissionIds(identifiers: readonly string[]): string[] {
    if (!identifiers.length) return [];
    if (!identifiersByPath) {
        identifiersByPath = new Map();
        for (const block of BlockTypes.getAll()) {
            const path = block.id.slice(block.id.indexOf(":") + 1);
            const matches = identifiersByPath.get(path) ?? [];
            matches.push(block.id);
            identifiersByPath.set(path, matches);
        }
    }
    return [...new Set(identifiers.map(id => {
        if (id.includes(":")) return id;
        const matches = identifiersByPath!.get(id);
        if (!matches?.length) throw Error(`unknown_block_permission:${id}`);
        if (matches.length !== 1) throw Error(`ambiguous_block_permission:${id}`);
        return matches[0]!;
    }))];
}
