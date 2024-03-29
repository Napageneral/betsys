import {Prop} from "./Prop";

export declare type BetType = "Moneyline" | "Spread" | "OverUnder";

export class MutuallyExclusiveGroup {
    MutuallyExclusiveGroupID: number;
    GameID: string;
    Market: string;
    BetType: BetType
    PropActor: string;
    PropPoints: number;
    Props?: Map<string, Prop>

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

    getMegKey(){
        return buildMegKey(this.GameID, this.Market, this.BetType, this.PropPoints, this.PropActor)
    }

}

export function buildMegKey(gameID: string, market: string, betType: BetType, propPoints?: number, propActor?: string){
    let megKey: string = gameID + "_" + market + "_" + betType;
    switch (betType) {
        case "Moneyline":
            break;
        case "OverUnder":
            if (propActor){
                megKey += "_" + propActor
            }
            megKey += "_" + propPoints
            break;
        case "Spread":
            if (propActor){
                megKey += "_" + propActor
            }
            if (!propPoints) break
            megKey += "_" + Math.abs(Number(propPoints))
            break;
    }

    return megKey;
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