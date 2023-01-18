import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../MySQLConnection";
import {AddPlayerRequest, Player} from "../../../shared/models/Player";

export async function addPlayer(newPlayer: AddPlayerRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO Players (FirstName, LastName, SSN, HomeAddress) VALUES (?, ?, ?, ?)`;
    return executeSql(query, [newPlayer.FirstName, newPlayer.LastName, newPlayer.SSN, newPlayer.HomeAddress]);
}

export async function getPlayer(playerID: number) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM Players WHERE PlayerID = ?`;
    return executeSqlById(queryString, [playerID]);
}

export function listPlayers() : Promise<ApiResponse<any>>{
    let query = "SELECT * FROM Players";
    return executeSql(query, []);
}

export async function updatePlayer(playerID: number, updatedPlayer : Player) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE Players SET FirstName = ?, LastName = ?, SSN = ?, HomeAddress = ?, SecurityQuestions = ? WHERE PlayerID = ?`;
    return executeSqlById(queryString, [updatedPlayer.FirstName, updatedPlayer.LastName, updatedPlayer.SSN, updatedPlayer.HomeAddress, updatedPlayer.SecurityQuestions, playerID]);
}

export async function removePlayer(playerID: number) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM Players WHERE PlayerID = ?";
    return executeSqlById(query, [playerID]);
}

export async function removeAllPlayers(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM Players";
    return executeSql(query, []);
}
