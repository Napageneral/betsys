import {ProfitableBet} from "../../../shared/models/ProfitableBet";

export declare type ComputedMeg = {
    ArbitrageBets: ProfitableBet[],
    PositiveEVBets: ProfitableBet[],
    MeanMarketWidth: number,
    MeanNoVigOdds: { NoVigPrice1:number, NoVigPrice2:number},
    PinnacleMarketWidth?: number,
    PinnacleNoVigOdds?: { NoVigPrice1:number, NoVigPrice2:number}
};