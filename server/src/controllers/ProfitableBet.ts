import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {AddProfitableBetRequest, ProfitableBet, ListProfitableBetsRequest} from "../../../shared/models/ProfitableBet";
const format = require('pg-format');

export async function addProfitableBet(newProfitableBet: AddProfitableBetRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "ProfitableBets" ("GameID", "PropID", "Sport", "Market", "Timestamp",
                            "Percent", "Prices", "BookNames", "BetNames") 
                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`;
    return executeSql(query, [newProfitableBet.GameID, newProfitableBet.PropID, newProfitableBet.Sport,
        newProfitableBet.Market, newProfitableBet.Timestamp, newProfitableBet.Percent,
    newProfitableBet.Prices, newProfitableBet.BookNames, newProfitableBet.BetNames]);
}

// export async function addProfitableBets(newProfitableBets: ProfitableBet[]) : Promise<ApiResponse<any>>{
//     let query = format(`INSERT INTO ProfitableBets ("GameID", "PropID", "ProfitableBetID", "BookName", "Price", "RetrievalTimestamp") VALUES %L ON CONFLICT ("PropID", "BookName", "RetrievalTimestamp") DO NOTHING`,
//         newProfitableBets.map(ProfitableBet => [ProfitableBet.GameID, ProfitableBet.PropID, ProfitableBet.ProfitableBetID, ProfitableBet.BookName, ProfitableBet.Price, ProfitableBet.RetrievalTimestamp]));
//     return executeSql(query, []);
// }

export async function getProfitableBet(ProfitableBetID: number) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "ProfitableBets" WHERE "ProfitableBetID" = $1`;
    return executeSqlById(queryString, [ProfitableBetID]);
}

export function listProfitableBets(request: ListProfitableBetsRequest) : Promise<ApiResponse<any>>{
    let queryHead = `SELECT * FROM "ProfitableBets"`;
    let queryConditions: string[] = [];
    let queryParams: any[] = [];

    if (request.GameID) {
        queryConditions.push("GameID");
        queryParams.push(request.GameID);
    }
    if (request.PropID) {
        queryConditions.push("PropID");
        queryParams.push(request.PropID);
    }

    let query = queryHead;
    for (let i = 1; i < queryConditions.length+1; i++) {
        query += " WHERE ";
        query += queryConditions.map(item => `"${item}" = $${i}`).join(" AND ");
    }

    if (request.TimeInterval){
        query += ` AND `
        query += `"RetrievalTimestamp" >= NOW() - INTERVAL '${request.TimeInterval}' `
        query += `GROUP BY 
                    "BookName", "RetrievalTimestamp", "Price", "GameID", "PropID", "ProfitableBetID" 
                    order by "RetrievalTimestamp" ASC`
    }

    return executeSql(query, queryParams);
}

export async function updateProfitableBet(ProfitableBetID: string, updatedProfitableBet: ProfitableBet) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE "ProfitableBets" SET "GameID" = $1, "PropID" = $2, "Sport" = $3,
                            "Market" = $4, "Timestamp" = $5, "Percent" = $6, "Prices" = $7,
                            "BookNames" = $8, "BetNames" = $9
                            WHERE "ProfitableBetID" = $10`;
    return executeSqlById(queryString, [
        updatedProfitableBet.GameID, updatedProfitableBet.PropID, updatedProfitableBet.Sport,
        updatedProfitableBet.Market, updatedProfitableBet.Timestamp,
        updatedProfitableBet.Percent, updatedProfitableBet.Prices,
        updatedProfitableBet.BookNames, updatedProfitableBet.BetNames,
        ProfitableBetID]);
}

export async function removeProfitableBet(ProfitableBetID: string) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM "ProfitableBets" WHERE "ProfitableBetID" = $1`;
    return executeSqlById(query, [ProfitableBetID]);
}

export async function removeAllProfitableBets(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM "ProfitableBets"`;
    return executeSql(query, []);
}
