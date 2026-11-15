export const landPermissions = [
    'place',
    'break',
    'openContainer',
    'pistonPlace',
    'setHome',
    'blockUse',
    'anvilUse',
    'doorUse',
    'switchUse',
    'signEdit',
    'entityUse',
    'gateUse',
    'itemUse',
    'lavaUse',
    'flightItemUse',
    'projectileUse',
    'entityAttack',
    'playerAttack',
    'shopBuy',
    'shopSell',
    'noTarget',
    'publicHomeUse',
];

export const rolePermissions = [
    'editCountryName',
    'editCountryLore',
    'peaceChange',
    'inviteChange',
    'invite',
    'place',
    'break',
    'pistonPlace',
    'setHome',
    'kick',
    'openContainer',
    'blockUse',
    'anvilUse',
    'doorUse',
    'switchUse',
    'signEdit',
    'entityUse',
    'gateUse',
    'itemUse',
    'lavaUse',
    'flightItemUse',
    'projectileUse',
    'entityAttack',
    'playerAttack',
    'shopBuy',
    'shopSell',
    'publicHomeUse',
    'publicHomeAdmin',
    'nationalTierLevelAdmin',
    'noTarget',
    'plotAdmin',
    'buyChunk',
    'sellChunk',
    'taxAdmin',
    'allyAdmin',
    'federationAdmin',
    'federationPermission',
    'hostilityAdmin',
    'warAdmin',
    'neutralityPermission',
    'withDrawResourcepoint',
    'withDrawTreasurybudget'
];

export const checkOnlyRole = [
    'invite',
    'editCountryName',
    'editCountryLore',
    'inviteChange',
    'neutralityPermission',
    'nationalTierLevelAdmin',
    'warAdmin',
    'allyAdmin',
    'federationAdmin',
    'federationPermission',
    'hostilityAdmin',
    'taxAdmin',
    'peaceChange',
    'kick',
    'owner',
    'admin',
    'withDrawResourcepoint',
    'withDrawTreasurybudget',
    'publicHomeAdmin',
    'sellChunk',
    'buyChunk'
];

// Older permission arrays have no gate setting. Store an explicit denial so
// those records remain allowed without a destructive bulk migration.
export const GATE_USE_DENIED = 'gateUseDenied';

export function isPermissionEnabled(permissions: readonly string[] | undefined, permission: string): boolean {
    return permission === 'gateUse'
        ? !permissions?.includes(GATE_USE_DENIED)
        : permissions?.includes(permission) ?? false;
}

export function permissionToggleValue(permission: string, enabled: unknown): string | undefined {
    return enabled ? permission : permission === 'gateUse' ? GATE_USE_DENIED : undefined;
}

export function permissionsFromToggles(permissions: readonly string[], values: readonly unknown[] = [], offset = 0): string[] {
    return permissions.flatMap((permission, index) => {
        const value = permissionToggleValue(permission, values[index + offset]);
        return value ? [value] : [];
    });
}
