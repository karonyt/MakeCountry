export interface PlayerSetting {
    inviteReceiveMessage: boolean;
}

export interface PlayerData {
    id: string;
    name: string;
    country: number | undefined;
    money: number;
    days: number;
    roles: Array<number>;
    chunks: Array<string>;
    invite: Array<number>;
    settings: PlayerSetting;
}
