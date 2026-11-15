import type { Dimension, Player, PrimitiveShapesManager, RawMessage, TextPrimitive, Vector3 } from '@minecraft/server';
export function getPrimitiveLocale(player: Player): string;
export function groupPrimitiveViewers(viewers: Player[]): Array<{locale: string; viewers: Player[]}>;
export function renderPrimitiveText(message: RawMessage | string, locale: string, fallback?: string): string;
export function createPrimitiveText(TextClass: typeof TextPrimitive, position: Vector3, message: RawMessage | string, locale: string, fallback?: string): TextPrimitive;
export function primitiveTextCacheSize(): number;
export function fitPrimitiveText(value: string): string;
export function hasPrimitiveTranslation(message: RawMessage | string): boolean;
export class LocalizedTextGroup {
    constructor(TextClass: typeof TextPrimitive, manager: PrimitiveShapesManager);
    readonly size: number;
    readonly created: number;
    remove(locale: string): void;
    clear(): void;
    update(options: {position: Vector3; dimension: Dimension; viewers: Player[]; message: RawMessage | string; fallback?: string; style?: Partial<TextPrimitive>; timeLeft?: number}): void;
    snapshot(): Array<{locale: string; text: string; viewers: number}>;
}
