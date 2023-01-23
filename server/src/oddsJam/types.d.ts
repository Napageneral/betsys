export declare type isLiveOptions = true | 'yes' | 't' | 1;
export declare type Sports = 'football' | 'basketball' | 'baseball' | 'mma' | 'boxing' | 'hockey' | 'soccer' | 'tennis' | 'golf' | 'motorsports' | 'esports';
export declare type SportsBooks = 'Pinnacle' | '5Dimes' | 'DraftKings' | 'BetMGM' | 'WynnBET' | 'theScore' | 'Bally Bet' | 'Elite Sportsbook' | 'FOX Bet' | 'FanDuel' | 'Points Bet' | 'Caesars' | 'Barstool' | 'Borgota' | 'Unibet' | 'BetRivers' | 'Wind Creek' | 'BetAnySports' | 'BookMaker' | 'SugarHouse' | 'TwinSpires' | 'BetUS' | 'bwin' | 'Betfred' | 'Betfair' | 'BetOnline' | 'Betway' | 'Bovada' | 'Bodog' | 'Casumo' | '10Bet' | '888 sport (Canada)' | 'MyBookie' | 'Betcris' | 'OddsJam';
export declare type Game = {
    id: number;
    sport: Sports;
    league: string;
    start_date: string;
    away_team: string;
    home_team: string;
    is_live: boolean;
};
export declare type Leagues = string[];
export declare type Markets = {
    game: Game;
    name: string;
};
export declare type GameOdds = {
    game: Game;
    market_name: string;
    sports_book: {
        name: SportsBooks;
    };
    name: string;
    price: number;
    is_main: boolean;
    is_live: boolean;
    deep_link_url?: string;
    checked_date: string;
    changed_date: string;
};
export declare type Future = {
    id: number;
    sport: Sports;
    league: string;
    name: string;
};
export declare type FutureOdds = {
    future: Future;
    sports_book: {
        name: SportsBooks;
    };
    name: string;
    price: number;
    checked_date: string;
    changed_date: string;
};
export declare type Score = {
    game: Game;
    period_scores: [{
        period_number: number;
        team: string;
        score: number;
    }];
    season_type: string;
    season_year: string;
    season_week: string;
    description: string;
    venue_name: string;
    venue_location: string;
    status: string;
    period: null | string;
    clock: null | string;
    last_play: null | string;
    home_final_score: number;
    away_final_score: number;
    checked_date: string;
    changed_date: string;
};
export declare type GamesAPIParams = {
    page?: number;
    sport?: Sports | Sports[];
    league?: string | string[];
    isLive?: isLiveOptions;
    startDateBefore?: string;
    startDateAfter?: string;
};
export declare type LeaguesAPIParams = {
    sport?: Sports | Sports[];
    isLive?: isLiveOptions;
};
export declare type MarketsAPIParams = {
    page?: number;
    gameId?: string | string[];
    isLive: isLiveOptions;
};
export declare type GameOddsAPIParams = {
    page?: number;
    sportsbook?: SportsBooks | SportsBooks[];
    marketName?: string | string[];
    sport?: Sports | Sports[];
    league?: string | string[];
    gameId?: string | string[];
    isLive: isLiveOptions;
    startDateBefore: string;
    startDateAfter: string;
};
export declare type FuturesAPIParams = {
    page?: number;
    sport?: Sports | Sports[];
    league?: string | string[];
};
export declare type FuturesOddsAPIParams = {
    page?: number;
    sportsbook: SportsBooks | SportsBooks[];
    futureName: string | string[];
    sport: Sports | Sports[];
    league: string | string[];
    futureId: string | string[];
};
export declare type ScoresAPIParams = {
    page?: number;
    gameId: string | string[];
    sport: Sports | Sports[];
    league: string | string[];
};
