import axios from 'axios';
import { createURL } from './constants.js';
import { createUrlWithParams } from './formatParams.js';
import {
    FuturesAPIParams,
    FuturesOddsAPIParams,
    GameOddsAPIParams,
    GamesAPIParams, GraderAPIParams,
    LeaguesAPIParams,
    MarketsAPIParams, ScoresAPIParams
} from "oddsJam/types";
const OddsJamClient = (apiKey:any) => {
    const baseUrl = createURL(apiKey);
    // Grade Bet API Function
    const gradeBet = async (params:GraderAPIParams) => {
        const gradeURL = baseUrl('grader');
        const fullURL = createUrlWithParams(gradeURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Games API Function
    const getGames = async (params:GamesAPIParams) => {
        const gamesURL = baseUrl('games');
        const fullURL = createUrlWithParams(gamesURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Leagues API Function
    const getLeagues = async (params:LeaguesAPIParams) => {
        const leaguesURL = baseUrl('leagues');
        const fullURL = createUrlWithParams(leaguesURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Markets API Function
    const getMarkets = async (params:MarketsAPIParams) => {
        const marketsURL = baseUrl('markets');
        const fullURL = createUrlWithParams(marketsURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Game Odds API Function
    const getGameOdds = async (params:GameOddsAPIParams) => {
        const gameOddsURL = baseUrl('game-odds');
        const fullURL = createUrlWithParams(gameOddsURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Futures API Function
    const getFutures = async (params:FuturesAPIParams) => {
        const futuresURL = baseUrl('futures');
        const fullURL = createUrlWithParams(futuresURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Future Odds API Function
    const getFutureOdds = async (params:FuturesOddsAPIParams) => {
        const futureOddsURL = baseUrl('future-odds');
        const fullURL = createUrlWithParams(futureOddsURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    // Get Scores API Function
    const getScores = async (params:ScoresAPIParams) => {
        const scoresURL = baseUrl('scores');
        const fullURL = createUrlWithParams(scoresURL, params);
        const res = await axios.get(fullURL);
        return res.data;
    };
    return {
        gradeBet,
        getGames,
        getLeagues,
        getMarkets,
        getGameOdds,
        getFutures,
        getFutureOdds,
        getScores,
    };
};
export default OddsJamClient;
//# sourceMappingURL=index.js.map