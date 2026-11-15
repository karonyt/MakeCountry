import { CountryPermission } from "@/types/legacy/permission";

export type PlotPermission = CountryPermission | string;

export interface PlotData {
    group: undefined | number;
    is_selling: boolean;
    name?: undefined | string;
    owner?: undefined | string | null;
    price: number;
    permissions: PlotPermission[];
    roles: Array<{ id: number, permissions: PlotPermission[] }>;
    countries: Array<{ id: number, permissions: PlotPermission[] }>;
    alliancePermissions: PlotPermission[];
    friendlyPermissions: PlotPermission[];
    players: Array<{ id: string, permissions: PlotPermission[] }>;
    type: PlotTypes;
    enable?: boolean;
}

export interface PlotGroupData {
    /** Webマップの色。未指定なら本国の色。 */
    mapColor?: string;
    mapPattern?: 'diagonal' | 'vertical' | 'horizontal' | 'crosshatch' | 'grid' | 'dots';
    id: number;
    group: undefined | number;
    is_selling: boolean;
    name?: undefined | string;
    owner?: undefined | string | null;
    price: number;
    permissions: PlotPermission[];
    roles: Array<{ id: number, permissions: PlotPermission[] }>;
    countries: Array<{ id: number, permissions: PlotPermission[] }>;
    alliancePermissions: PlotPermission[];
    friendlyPermissions: PlotPermission[];
    players: Array<{ id: string, permissions: PlotPermission[] }>;
    type: PlotTypes;
    enable?: boolean;
}

export type PlotTypes = 'public' | 'private' | 'embassy';
