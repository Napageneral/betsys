
export class Odd {
    GameID: string
    PropID: string;
    OddID: string;
    tMinus: number;
    BookName: string;
    Price: number;
    RetrievalTimestamp: Date;

    constructor(GameID: string,
                PropID: string,
                OddID: string,
                tMinus: number,
                BookName: string,
                Price: number,
                RetrievalTimestamp: Date) {
        this.GameID = GameID
        this.PropID = PropID
        this.OddID = OddID;
        this.tMinus = tMinus;
        this.BookName = BookName;
        this.Price = Price
        this.RetrievalTimestamp = RetrievalTimestamp
    }

}

export interface AddOddRequest {
    GameID: string;
    PropID: string;
    OddID: string;
    tMinus: number;
    BookName: string;
    Price: number;
    RetrievalTimestamp: Date;
}

export interface AddOddResponse {
    Odd: Odd;
}

export interface RemoveOddRequest {
    OddID: string
}

export interface RemoveOddResponse {
}

export interface GetOddRequest {
    OddID: string;
}

export interface GetOddResponse {
    Odd: Odd;
}

export interface ListOddsRequest {
    GameID?: string;
    PropID?: string;
    tMinus?: number;
    BookName?: string;
}

export interface ListOddsResponse {
    Odds: Array<Odd>;
}

export interface UpdateOddRequest {
    OddID: string;
    Odd: Odd;
}

export interface UpdateOddResponse {
    Odd: Odd;
}