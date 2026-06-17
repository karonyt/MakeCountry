export interface PlayerSetting {
    inviteReceiveMessage: boolean;
}

export interface MarriageData {
    spouseId?: string;
    since?: number;
    requests: Array<string>;
}

export interface OwnedGroupChatData {
    name: string;
    memberIds: Array<string>;
    createdAt: number;
}

export interface GroupChatData {
    currentOwnerId?: string;
    ownedGroup?: OwnedGroupChatData;
}

export interface PlayerData {
    id: string;
    name: string;
    country: number | undefined;
    money: number;
    bountyLastSetAt?: number;
    bountyDailySetDate?: string;
    bountyDailySetCount?: number;
    days: number;
    roles: Array<number>;
    chunks: Array<string>;
    invite: Array<number>;
    settings: PlayerSetting;
    marriage: MarriageData;
    groupChat: GroupChatData;
}
