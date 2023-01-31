export declare type BetType = "Moneyline" | "Spread" | "OverUnder";

export class MutuallyExclusiveGroup {
    MutuallyExclusiveGroupID: number;
    GameID: string;
    Market: string;
    BetType: BetType
    PropActor: string;
    PropPoints: number;

    constructor(MutuallyExclusiveGroupID: number,
                GameID: string,
                Market: string,
                BetType: BetType,
                PropActor: string,
                PropPoints: number) {
        this.MutuallyExclusiveGroupID = MutuallyExclusiveGroupID;
        this.GameID = GameID;
        this.Market = Market;
        this.BetType = BetType;
        this.PropActor = PropActor;
        this.PropPoints = PropPoints;
    }

}

export interface AddMutuallyExclusiveGroupRequest {
    GameID: string;
    Market: string;
    BetType: BetType;
    PropActor: string;
    PropPoints: number;
}

export interface AddMutuallyExclusiveGroupResponse {
    MutuallyExclusiveGroup: MutuallyExclusiveGroup;
}

export interface RemoveMutuallyExclusiveGroupRequest {
    MutuallyExclusiveGroupID: number
}

export interface RemoveMutuallyExclusiveGroupResponse {
}

export interface GetMutuallyExclusiveGroupRequest {
    MutuallyExclusiveGroupID: number;
}

export interface GetMutuallyExclusiveGroupResponse {
    MutuallyExclusiveGroup: MutuallyExclusiveGroup;
}

export interface ListMutuallyExclusiveGroupsRequest {
    GameIDs?: string[];
    GameID?: string;
    Market?: string;
    BetType?: BetType;
}

export interface ListMutuallyExclusiveGroupsResponse {
    MutuallyExclusiveGroups: Array<MutuallyExclusiveGroup>;
}

export interface UpdateMutuallyExclusiveGroupRequest {
    MutuallyExclusiveGroupID: number;
    MutuallyExclusiveGroup: MutuallyExclusiveGroup;
}

export interface UpdateMutuallyExclusiveGroupResponse {
    MutuallyExclusiveGroup: MutuallyExclusiveGroup;
}