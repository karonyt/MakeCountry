import { CountryPermissionList } from "@/types/legacy/permission";

export interface FederationData {
    name: string;
    description: string;
    leader: string;
    subLeaders: Array<string>;
    members: Array<number>;
    capital: number | string;
    treasury: number;
    taxRate: number;
    requests: Array<number>;
    unpaidTaxes: Record<string, number>;
    settings: {
        showInChat: boolean;
        showOnTerritoryEnter: boolean;
        showOnMap: boolean;
    };
}

export interface CountryData {
    id: number;
    lv: number;
    name: string;
    owner: string;
    lore: string;
    treasuryBudgetLog: [];
    resourcePointLog: [];
    currencyUnitId: number;
    days: number;
    banner: string;
    colorcode: string;
    members: Array<string>;
    peaceChangeCooltime: number;
    ownerRole: number;
    adminRole: number;
    peopleRole: number;
    spawn: undefined | {};
    publicSpawn: boolean;
    roles: Array<number>;
    territories: Array<string>;
    resourcePoint: number;
    money: number;
    taxPer: number;
    taxInstitutionIsPer: boolean;
    hideMoney: boolean;
    peace: boolean;
    color: string;
    alliance: Array<number>;
    federation: FederationData;
    hostility: Array<number>;
    friendly: Array<number>;
    neutralityPermission: CountryPermissionList;
    alliancePermission: CountryPermissionList;
    federationPermission: CountryPermissionList;
    hostilityPermission: CountryPermissionList;
    friendlyPermission: CountryPermissionList;
    internationalOrganizations: Array<number>;
    isWarNow: boolean;
    warNowCountries: Array<number>;
    declarationReceive: Array<number>;
    declarationSend: Array<number>;
    allianceRequestReceive: Array<number>;
    allianceRequestSend: Array<number>;
    federationRequestReceive?: Array<number>;
    federationRequestSend?: Array<number>;
    friendlyRequestReceive: Array<number>;
    friendlyRequestSend: Array<number>;
    applicationPeaceRequestReceive: Array<number>;
    applicationPeaceRequestSend: Array<number>;
    invite: boolean;
    plotgroup: Array<number>;
    mergeRequestSend: Array<number>;
    mergeRequestReceive: Array<number>;
}
