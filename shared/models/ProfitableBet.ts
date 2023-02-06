export declare type Type = "Arbitrage" | "PositiveEV";

export class ProfitableBet {
    ProfitableBetID: number
    Percent: number;
    GameID: string;
    StartDate: Date;
    EventName: string;
    Sport: string;
    MutuallyExclusiveGroupID: number;
    Market: string;
    PropIDs: string[];
    PropNames: string[];
    OddIDs: string[];
    Prices: number[];
    BookNames: string[];
    Type: Type;
    RetrievalTimestamp: Date;
    MarketWidth?: number;
    FairOdds?: number[];

    constructor(ProfitableBetID: number,
                GameID: string,
                StartDate: Date,
                EventName: string,
                Sport: string,
                MutuallyExclusiveGroupID: number,
                Market: string,
                PropIDs: string[],
                PropNames: string[],
                OddIDs: string[],
                Prices: number[],
                BookNames: string[],
                Percent: number,
                Type: Type,
                RetrievalTimestamp: Date,
                MarketWidth?: number,
                FairOdds?: number[]) {
        this.ProfitableBetID = ProfitableBetID;
        this.GameID = GameID;
        this.StartDate = StartDate;
        this.EventName = EventName;
        this.Sport = Sport;
        this.MutuallyExclusiveGroupID = MutuallyExclusiveGroupID;
        this.Market = Market;
        this.PropIDs = PropIDs;
        this.PropNames = PropNames;
        this.OddIDs = OddIDs;
        this.Prices = Prices;
        this.BookNames = BookNames;
        this.Percent = Percent;
        this.Type = Type;
        this.RetrievalTimestamp = RetrievalTimestamp;
        this.MarketWidth = MarketWidth;
        this.FairOdds = FairOdds;
    }

}

export interface AddProfitableBetRequest {
    GameID: string;
    StartDate: Date;
    EventName: string;
    Sport: string;
    MutuallyExclusiveGroupID: number;
    Market: string;
    PropIDs: string[];
    PropNames: string[];
    OddIDs: string[];
    Prices: number[];
    BookNames: string[];
    Percent: number;
    Type: Type;
    RetrievalTimestamp: Date;
    MarketWidth: number;
    FairOdds: number[];
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
    BookName?: string
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