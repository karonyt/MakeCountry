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
    players: Array<{ id: string, permissions: PlotPermission[] }>;
    type: PlotTypes;
    enable?: boolean;
}

export interface PlotGroupData {
    id: number;
    group: undefined | number;
    is_selling: boolean;
    name?: undefined | string;
    owner?: undefined | string | null;
    price: number;
    permissions: PlotPermission[];
    roles: Array<{ id: number, permissions: PlotPermission[] }>;
    countries: Array<{ id: number, permissions: PlotPermission[] }>;
    players: Array<{ id: string, permissions: PlotPermission[] }>;
    type: PlotTypes;
    enable?: boolean;
}

export type PlotTypes = 'public' | 'private' | 'embassy';
