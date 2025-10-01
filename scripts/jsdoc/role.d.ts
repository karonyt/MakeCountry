import { CountryPermissionList } from "./permission";

export interface RoleData {
    name: string;
    color: string;
    icon: string;
    id: number;
    members: Array<string>;
    permissions: CountryPermissionList;
}
