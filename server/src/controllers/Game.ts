import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../MySQLConnection";
import {AddGameRequest, Game, ListGamesRequest} from "../../../shared/models/Game";

export async function addGame(newGame: AddGameRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO Games (GameID, Sport, League, StartDate, HomeTeam, AwayTeam, Status, Tournament) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return executeSql(query, [newGame.GameID, newGame.Sport, newGame.League, newGame.StartDate,
                                            newGame.HomeTeam, newGame.AwayTeam, newGame.Status, newGame.Tournament]);
}

export async function addGames(newGames: Game[]) : Promise<ApiResponse<any>>{
    let query = `INSERT IGNORE INTO Games (GameID, Sport, League, StartDate, HomeTeam, AwayTeam, Status, Tournament) VALUES ?`;
    return executeSql(query, [newGames.map(newGame => [newGame.GameID, newGame.Sport, newGame.League, newGame.StartDate,
                            newGame.HomeTeam, newGame.AwayTeam, newGame.Status, newGame.Tournament])]);
}

export async function getGame(GameID: string) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM Games WHERE GameID = ?`;
    return executeSqlById(queryString, [GameID]);
}

export function listGames(request: ListGamesRequest) : Promise<ApiResponse<any>>{
    let queryHead;
    if (request.IDsOnly) {
        queryHead = "SELECT GameID FROM Games";
    } else {
        queryHead = "SELECT * FROM Games";
    }
    let queryConditions: string[] = [];
    let queryParams: any[] = [];

    if (request.Sport) {
        queryConditions.push("Sport");
        queryParams.push(request.Sport);
    }
    if (request.League) {
        queryConditions.push("League");
        queryParams.push(request.League);
    }
    if (request.Status) {
        queryConditions.push("Status");
        queryParams.push(request.Status);
    }
    if (request.Tournament) {
        queryConditions.push("Tournament");
        queryParams.push(request.Tournament);
    }

    let query = queryHead;

    if(queryConditions.length > 0) {
        query += " WHERE ";
        query += queryConditions.map(item => `${item} = ?`).join(" AND ");
    }

    return executeSql(query, queryParams);
}

export async function updateGame(GameID: string, updatedGame : Game) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE Games SET Sport = ?, League = ?, StartDate = ?, HomeTeam = ?, AwayTeam = ?, Status = ?, Tournament = ? WHERE GameID = ?`;
    return executeSqlById(queryString, [updatedGame.Sport, updatedGame.League, updatedGame.StartDate,
        updatedGame.HomeTeam, updatedGame.AwayTeam, updatedGame.Status, updatedGame.Tournament, GameID]);
}

export async function removeGame(GameID: string) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM Games WHERE GameID = ?";
    return executeSqlById(query, [GameID]);
}

export async function removeAllGames(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM Games";
    return executeSql(query, []);
}
