import { GATE_USE_DENIED, isPermissionEnabled } from "./permissions.js";
import { areCountriesInSameFederation, getEffectiveFederationPermissions } from "./relationships/federation.js";

type RecordReader = (key: string) => any;

/** Called after readiness, incident, admin-mode, wilderness and special-area checks. */
export function isGateUseDenied(player: any, chunk: any, read: RecordReader): boolean {
    const country = chunk.countryId ? read(`country_${chunk.countryId}`) : undefined;
    const sameCountry = !!country && country.id === player.country;
    const roles = sameCountry ? (player.roles ?? []).map((id: any) => read(`role_${id}`)).filter(Boolean) : [];
    const administrator = sameCountry && (country.owner === player.id || roles.some((role: any) =>
        role.permissions?.some((permission: string) => ['admin', 'owner', 'plotAdmin'].includes(permission))));

    const personal = !sameCountry && country?.playerPermissions?.find((entry: any) => entry.id === player.id);
    if (personal) return !isPermissionEnabled(personal.permissions, 'gateUse');

    const plot = chunk.plot?.group ? read(`plotgroup_${chunk.plot.group}`) ?? chunk.plot : chunk.plot;
    if (plot?.enable) {
        if (administrator || (plot.type === 'private' && plot.owner === player.id)) return false;
        const personalPlot = plot.players?.find((entry: any) => entry.id === player.id);
        if (personalPlot) return !isPermissionEnabled(personalPlot.permissions, 'gateUse');
        const countryPlot = plot.countries?.find((entry: any) => entry.id === player.country);
        if (countryPlot) return !isPermissionEnabled(countryPlot.permissions, 'gateUse');
        if (sameCountry) {
            const assigned = plot.roles?.filter((entry: any) => player.roles?.includes(entry.id)) ?? [];
            if (assigned.some((entry: any) => entry.permissions?.includes('gateUse'))) return false;
            if (assigned.some((entry: any) => entry.permissions?.includes(GATE_USE_DENIED))) return true;
        }
        return !isPermissionEnabled(plot.permissions, 'gateUse');
    }

    if (!country || administrator) return false;
    if (sameCountry) {
        if (roles.some((role: any) => role.permissions?.includes('gateUse'))) return false;
        return roles.some((role: any) => role.permissions?.includes(GATE_USE_DENIED));
    }
    const playerCountry = read(`country_${player.country}`);
    if (areCountriesInSameFederation(country, playerCountry)) {
        return !isPermissionEnabled(getEffectiveFederationPermissions(country), 'gateUse');
    }
    const relationship = country.alliance?.includes(player.country) ? 'alliance'
        : country.hostility?.includes(player.country) ? 'hostility'
        : country.friendly?.includes(player.country) ? 'friendly' : 'neutrality';
    const individual = country[`${relationship}CountryPermissions`]?.find((entry: any) => entry.id === player.country);
    return !isPermissionEnabled(individual?.permissions ?? country[`${relationship}Permission`], 'gateUse');
}
