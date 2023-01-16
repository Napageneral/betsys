
export class Line {
    LineID: number;
    BookName: string;
    Sport: string;
    Event: string;
    Market: string;
    Bet: string;
    Odds: string;
    CreationTime: Date;

    constructor(BookName: string,
                Sport: string,
                Event: string,
                Market: string,
                Bet: string,
                Odds: string) {
        this.LineID = -1;
        this.BookName = BookName;
        this.Sport = Sport;
        this.Event = Event;
        this.Market = Market;
        this.Bet = Bet;
        this.Odds = Odds;
        this.CreationTime = new Date()
    }

}

export interface CreateLineRequest {
    BookName:string;
    Sport:string;
    Event:string;
    Market:string;
    Bet:string;
    Odds:string;
    CreationTime: Date;
}

export interface CreateLineResponse {
    Line: Line;
}

export interface RemoveLineRequest {
    LineID: number
}

export interface RemoveLineResponse {
}

export interface GetLineRequest {
    LineID: number;
}

export interface GetLineResponse {
    Line: Line;
}

export interface ListLinesRequest {
    BookName?: string;
    Sport?: string;
    Event?: string;
    Market?: string;
}

export interface ListLinesResponse {
    Lines: Array<Line>;
}

export interface UpdateLineRequest {
    LineID: string;
    Line: Line;
}

export interface UpdateLineResponse {
    Line: Line;
}