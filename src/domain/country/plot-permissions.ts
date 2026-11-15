export type PlotRelationship = "alliance" | "friendly";

type PermissionEntry = { id: number; permissions?: string[] };

type PlotPermissionData = {
    countries?: PermissionEntry[];
    alliancePermissions?: string[];
    friendlyPermissions?: string[];
};

type PlotCountryData = {
    alliance?: number[];
    friendly?: number[];
};

export const PLOT_RELATIONSHIP_PERMISSION_KEYS: Record<PlotRelationship, "alliancePermissions" | "friendlyPermissions"> = {
    alliance: "alliancePermissions",
    friendly: "friendlyPermissions",
};

/**
 * プロット上で他国に与える権限を解決する。
 * 国ごとの設定を最優先し、個別設定が無い場合だけ現在の外交関係に応じた一括設定を使う。
 */
export function getPlotCountryPermissions(
    plot: PlotPermissionData | undefined,
    plotCountry: PlotCountryData | undefined,
    targetCountryId: number | undefined,
): string[] {
    if (!plot || targetCountryId === undefined) return [];

    const individual = plot.countries?.find((entry) => Number(entry.id) === Number(targetCountryId));
    if (individual) return individual.permissions ?? [];

    if (plotCountry?.alliance?.some((id) => Number(id) === Number(targetCountryId))) {
        return plot.alliancePermissions ?? [];
    }
    if (plotCountry?.friendly?.some((id) => Number(id) === Number(targetCountryId))) {
        return plot.friendlyPermissions ?? [];
    }
    return [];
}
