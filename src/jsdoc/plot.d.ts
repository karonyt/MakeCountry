export interface PlotData {
    group: undefined | number;
    is_selling: boolean;
    name?: undefined | string;
    owner?: undefined | string;
    price: number;
    permissions: Array<CountryPermissionList>;
    roles?: Array<{ id: number, permissions: Array<CountryPermissionList> }>;
    countries: Array<{ id: number, permissions: Array<CountryPermissionList> }>;
    players?: Array<{ id: string, permissions: Array<CountryPermissionList> }>;
    type: PlotTypes;
}

export interface PlotGroupData {
    id: number;
    group: undefined | number;
    is_selling: boolean;
    name?: undefined | string;
    owner?: undefined | string;
    price: number;
    permissions: Array<CountryPermissionList>;
    roles?: Array<{ id: number, permissions: Array<CountryPermissionList> }>;
    countries: Array<{ id: number, permissions: Array<CountryPermissionList> }>;
    players?: Array<{ id: string, permissions: Array<CountryPermissionList> }>;
    type: PlotTypes;
}

export type PlotTypes = 'public' | 'private' | 'embassy';