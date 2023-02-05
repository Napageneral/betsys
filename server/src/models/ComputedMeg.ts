import {Odd} from "../../../shared/models/Odd";

export declare type ComputedMeg = {
    ArbitrageBets: any[],
    PositiveEVBets: Odd[],
    MeanMarketWidth: number,
    MeanNoVigOdds: { NoVigPrice1:number, NoVigPrice2:number},
    PinnacleMarketWidth?: number,
    PinnacleNoVigOdds?: { NoVigPrice1:number, NoVigPrice2:number}
};