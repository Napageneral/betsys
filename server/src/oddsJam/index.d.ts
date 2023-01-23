import { Future, FutureOdds, FuturesAPIParams, FuturesOddsAPIParams, Game, GameOdds, GameOddsAPIParams, GamesAPIParams, Leagues, LeaguesAPIParams, Markets, MarketsAPIParams, Score, ScoresAPIParams } from './types';
declare const OddsJamClient: (apiKey: string) => {
    getGames: (params?: GamesAPIParams) => Promise<Game>;
    getLeagues: (params?: LeaguesAPIParams) => Promise<Leagues>;
    getMarkets: (params?: MarketsAPIParams) => Promise<Markets>;
    getGameOdds: (params?: GameOddsAPIParams) => Promise<GameOdds>;
    getFutures: (params?: FuturesAPIParams) => Promise<Future>;
    getFutureOdds: (params?: FuturesOddsAPIParams) => Promise<FutureOdds>;
    getScores: (params?: ScoresAPIParams) => Promise<Score>;
};
export default OddsJamClient;
