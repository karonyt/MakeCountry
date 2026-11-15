/** Mark server text that has already been selected for this viewer. */
export function literal(value: string): { text: string };

export function raw(value: string): import("@minecraft/server").RawMessage | string;
