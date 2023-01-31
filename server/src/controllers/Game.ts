import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {AddGameRequest, Game, ListGamesRequest} from "../../../shared/models/Game";
const format = require('pg-format');

export async function addGame(newGame: AddGameRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "Games" ("GameID", "Sport", "League", "StartDate", "HomeTeam", "AwayTeam", "Status", "Tournament") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    return executeSql(query, [newGame.GameID, newGame.Sport, newGame.League, newGame.StartDate,
                                            newGame.HomeTeam, newGame.AwayTeam, newGame.Status, newGame.Tournament]);
}

export async function addGames(newGames: Game[]) : Promise<ApiResponse<any>>{
    let query = format(`INSERT INTO "Games" ("GameID", "Sport", "League", "StartDate", "HomeTeam", "AwayTeam", "Status", "Tournament") VALUES %L`,
        newGames.map(Game => [Game.GameID, Game.Sport, Game.League, Game.StartDate, Game.HomeTeam, Game.AwayTeam, Game.Status, Game.Tournament]));
    return executeSql(query, []);
}

export async function getGame(GameID: string) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "Games" WHERE "GameID" = $1`;
    return executeSqlById(queryString, [GameID]);
}

export function listGames(request: ListGamesRequest) : Promise<ApiResponse<any>>{
    let queryHead;
    if (request.IDsOnly) {
        queryHead = `SELECT "GameID" FROM "Games"`;
    } else {
        queryHead = `SELECT * FROM "Games"`;
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
    for (let i = 1; i < queryConditions.length+1; i++) {
        query += " WHERE ";
        query += queryConditions.map(item => `"${item}" = $${i}`).join(" AND ");
    }

    if(request.Incomplete) {
        query += ` WHERE "Status" IN ('scheduled', 'live')`;
    }
    return executeSql(query, queryParams);
}

export async function updateGame(GameID: string, updatedGame : Game) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE "Games" SET "Sport" = $1, "League" = $2, "StartDate" = $3, "HomeTeam" = $4, "AwayTeam" = $5, "Status" = $6, "Tournament" = $7 WHERE "GameID" = $8`;
    return executeSqlById(queryString, [updatedGame.Sport, updatedGame.League, updatedGame.StartDate,
        updatedGame.HomeTeam, updatedGame.AwayTeam, updatedGame.Status, updatedGame.Tournament, GameID]);
}

export async function removeGame(GameID: string) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM "Games" WHERE "GameID" = $1`;
    return executeSqlById(query, [GameID]);
}

export async function removeAllGames(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM "Games"`;
    return executeSql(query, []);
}
