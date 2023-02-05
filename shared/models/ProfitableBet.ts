export declare type Type = "Arbitrage" | "PositiveEV";

export class ProfitableBet {
    ProfitableBetID: number;
    GameID: string;
    MutuallyExclusiveGroupID: number;
    OddIDs: string[];
    Percent: number;
    Type: Type;
    Timestamp: Date;

    constructor(ProfitableBetID: number,
                GameID: string,
                MutuallyExclusiveGroupID: number,
                OddIDs: string[],
                Percent: number,
                Type: Type,
                Timestamp: Date) {
        this.ProfitableBetID = ProfitableBetID;
        this.GameID = GameID;
        this.MutuallyExclusiveGroupID = MutuallyExclusiveGroupID;
        this.OddIDs = OddIDs;
        this.Percent = Percent;
        this.Type = Type;
        this.Timestamp = Timestamp;
    }

}

export interface AddProfitableBetRequest {
    GameID: string;
    MutuallyExclusiveGroupID: number;
    OddIDs: string[];
    Percent: number;
    Type: Type;
    Timestamp: Date;
}

export interface AddProfitableBetResponse {
    ProfitableBet: ProfitableBet;
}

export interface RemoveProfitableBetRequest {
    ProfitableBetID: number
}

export interface RemoveProfitableBetResponse {
}

export interface GetProfitableBetRequest {
    ProfitableBetID: number;
}

export interface GetProfitableBetResponse {
    ProfitableBet: ProfitableBet;
}

export interface ListProfitableBetsRequest {
    TimeInterval?: string;
    GameID?: string;
    PropID?: string;
    Sport?: string;
    Market?: string;
    MinPercent?: number
}

export interface ListProfitableBetsResponse {
    ProfitableBets: Array<ProfitableBet>;
}

export interface UpdateProfitableBetRequest {
    ProfitableBetID: number;
    ProfitableBet: ProfitableBet;
}

export interface UpdateProfitableBetResponse {
    ProfitableBet: ProfitableBet;
}