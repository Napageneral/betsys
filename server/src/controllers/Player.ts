import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {AddPlayerRequest, Player} from "../../../shared/models/Player";

export async function addPlayer(newPlayer: AddPlayerRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "Players" ("FirstName", "LastName", "SSN", "HomeAddress") VALUES ($1, $2, $3, $4) RETURNING "PlayerID"`;
    return executeSql(query, [newPlayer.FirstName, newPlayer.LastName, newPlayer.SSN, newPlayer.HomeAddress]);
}

export async function getPlayer(playerID: number) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "Players" WHERE "PlayerID" = $1`;
    return executeSqlById(queryString, [playerID]);
}

export function listPlayers() : Promise<ApiResponse<any>>{
    let query = `SELECT * FROM "Players"`;
    return executeSql(query, []);
}

export async function updatePlayer(playerID: number, updatedPlayer : Player) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE "Players" SET "FirstName" = $1, "LastName" = $2, "SSN" = $3, "HomeAddress" = $4, "SecurityQuestions" = $5 WHERE "PlayerID" = $6`;
    return executeSqlById(queryString, [updatedPlayer.FirstName, updatedPlayer.LastName, updatedPlayer.SSN, updatedPlayer.HomeAddress, updatedPlayer.SecurityQuestions, playerID]);
}

export async function removePlayer(playerID: number) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM "Players" WHERE "PlayerID" = $1`;
    return executeSqlById(query, [playerID]);
}

export async function removeAllPlayers(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM "Players"`;
    return executeSql(query, []);
}
