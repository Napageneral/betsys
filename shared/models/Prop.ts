import {BetType} from "./MutuallyExclusiveGroup";

export class Prop {
    GameID: string;
    PropID: string;
    MutuallyExclusiveGroupID: number;
    Market: string;
    PropName: string;
    PropResult: string;
    BetType: BetType;
    OverUnder: string;
    PropActor: string;
    PropPoints: number;

    constructor(GameID: string,
                PropID: string,
                MutuallyExclusiveGroupID: number,
                Market: string,
                PropName: string,
                PropResult: string,
                BetType: BetType,
                PropPoints: number,
                OverUnder: string,
                PropActor: string) {
        this.GameID = GameID;
        this.PropID = PropID;
        this.MutuallyExclusiveGroupID = MutuallyExclusiveGroupID;
        this.Market = Market;
        this.PropName = PropName;
        this.PropResult = PropResult;
        this.BetType = BetType;
        this.PropPoints = PropPoints;
        this.OverUnder = OverUnder;
        this.PropActor = PropActor;
    }

}

export interface AddPropRequest {
    GameID: string;
    PropID: string;
    Market: string;
    PropName: string;
    PropResult: string;
    BetType: BetType;
    PropPoints: number;
    OverUnder: string;
    PropActor: string;
}

export interface AddPropResponse {
    Prop: Prop;
}

export interface RemovePropRequest {
    PropID: string
}

export interface RemovePropResponse {
}

export interface GetPropRequest {
    PropID: string;
}

export interface GetPropResponse {
    Prop: Prop;
}

export interface ListPropsRequest {
    GameIDs?: string[];
    IDsOnly?: boolean;
    GameID?: string;
    Market?: string;
    BetType?: BetType;
    MutuallyExclusiveGroupID?: number;
}

export interface ListPropsResponse {
    Props: Array<Prop>;
}

export interface UpdatePropRequest {
    PropID: string;
    Prop: Prop;
}

export interface UpdatePropResponse {
    Prop: Prop;
}