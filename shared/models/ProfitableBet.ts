
export class ProfitableBet {
    ProfitableBetID: number;
    GameID: string;
    PropID: string;
    Sport: string;
    Market: string;
    Percent: number
    BetNames: string[];
    BookNames: string[];
    Prices: number[];
    Timestamp: Date;

    constructor(ProfitableBetID: number,
                GameID: string,
                PropID: string,
                Sport: string,
                Market: string,
                Percent: number,
                BetNames: string[],
                BookNames: string[],
                Prices: number[],
                Timestamp: Date) {
        this.ProfitableBetID = ProfitableBetID;
        this.GameID = GameID;
        this.PropID = PropID;
        this.Sport = Sport;
        this.Market = Market;
        this.Percent = Percent;
        this.BetNames = BetNames;
        this.BookNames = BookNames;
        this.Prices = Prices;
        this.Timestamp = Timestamp;
    }

}

export interface AddProfitableBetRequest {
    GameID: string;
    PropID: string;
    Sport: string;
    Market: string;
    Percent: number
    BetNames: string[];
    BookNames: string[];
    Prices: number[];
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