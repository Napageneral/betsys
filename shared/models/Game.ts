
export class Game {
    GameID: string;
    Sport: string;
    League: string;
    StartDate: Date;
    HomeTeam: string;
    AwayTeam: string;
    Status: string;
    Tournament: string;

    constructor(GameID: string,
                Sport: string,
                League: string,
                StartDate: Date,
                HomeTeam: string,
                AwayTeam: string,
                Status: string,
                Tournament: string) {
        this.GameID = GameID
        this.Sport = Sport;
        this.League = League;
        this.StartDate = StartDate;
        this.HomeTeam = HomeTeam;
        this.AwayTeam = AwayTeam;
        this.Status = Status;
        this.Tournament = Tournament;
    }

}

export interface AddGameRequest {
    GameID: string;
    Sport: string;
    League: string;
    StartDate: Date;
    HomeTeam: string;
    AwayTeam: string;
    Status: string;
    Tournament: string;
}

export interface AddGameResponse {
    Game: Game;
}

export interface RemoveGameRequest {
    GameID: string
}

export interface RemoveGameResponse {
}

export interface GetGameRequest {
    GameID: string;
}

export interface GetGameResponse {
    Game: Game;
}

export interface ListGamesRequest {
    Incomplete?: boolean;
    IDsOnly?: boolean;
    Sport?: string;
    League?: string;
    Status?: string;
    Tournament?: string;
}

export interface ListGamesResponse {
    Games: Array<Game>;
}

export interface UpdateGameRequest {
    GameID: string;
    Game: Game;
}

export interface UpdateGameResponse {
    Game: Game;
}