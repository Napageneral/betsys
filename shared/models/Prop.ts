
export class Prop {
    GameID: string;
    PropID: string;
    Market: string;
    PropName: string;
    PropResult: string;
    PropPoints: number;

    constructor(GameID: string,
                PropID: string,
                Market: string,
                PropName: string,
                PropResult: string,
                PropPoints: number) {
        this.GameID = GameID
        this.PropID = PropID;
        this.Market = Market;
        this.PropName = PropName
        this.PropResult = PropResult
        this.PropPoints = PropPoints
    }

}

export interface AddPropRequest {
    GameID: string;
    PropID: string;
    Market: string;
    PropName: string;
    PropResult: string;
    PropPoints: number
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