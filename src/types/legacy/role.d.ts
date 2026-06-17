import { CountryPermissionList } from "@/types/legacy/permission";

export interface RoleData {
    name: string;
    color: string;
    icon: string;
    id: number;
    members: Array<string>;
    permissions: CountryPermissionList;
    taxOverride?: {
        enabled: boolean;
        taxPer: number;
        taxInstitutionIsPer: boolean;
    };
}
