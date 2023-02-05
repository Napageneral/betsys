import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {AddOddRequest, Odd, ListOddsRequest} from "../../../shared/models/Odd";
import {sliceIntoChunks} from "../util/util";
const format = require('pg-format');

export async function addOdd(newOdd: AddOddRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO odds ("GameID", "PropID", "OddID", "BookName", "Price", "RetrievalTimestamp") VALUES ($1, $2, $3, $4, $5, $6)`;
    return executeSql(query, [newOdd.GameID, newOdd.PropID, newOdd.OddID, newOdd.BookName,
        newOdd.Price, newOdd.RetrievalTimestamp]);
}

export async function addAllOdds(Odds: Odd[]){
    const OddChunks:Odd[][] = sliceIntoChunks(Odds, 1000)
    for (const OddChunk of OddChunks){
        await addOdds(OddChunk)
    }
}

export async function addOdds(newOdds: Odd[]) : Promise<ApiResponse<any>>{
    let query = format(`INSERT INTO odds ("GameID", "PropID", "OddID", "BookName", "Price", "RetrievalTimestamp") VALUES %L ON CONFLICT ("PropID", "BookName", "RetrievalTimestamp") DO NOTHING`,
        newOdds.map(Odd => [Odd.GameID, Odd.PropID, Odd.OddID, Odd.BookName, Odd.Price, Odd.RetrievalTimestamp]));
    return executeSql(query, []);
}

export async function getOdd(OddID: string) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM Odds WHERE OddID = $1`;
    return executeSqlById(queryString, [OddID]);
}

export function listOdds(request: ListOddsRequest) : Promise<ApiResponse<any>>{
    let queryHead = `SELECT * FROM odds`;
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
    if (request.BookName) {
        queryConditions.push("BookName");
        queryParams.push(request.BookName);
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
                    "BookName", "RetrievalTimestamp", "Price", "GameID", "PropID", "OddID" 
                    order by "RetrievalTimestamp" ASC`
    }

    return executeSql(query, queryParams);
}

export async function updateOdd(OddID: string, updatedOdd: Odd) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE odds SET "GameID" = $1, "PropID" = $2, "OddID" = $3, "BookName" = $4, "Price" = $5, "RetrievalTimestamp" = $6 WHERE "OddID" = $7`;
    return executeSqlById(queryString, [updatedOdd.GameID, updatedOdd.PropID, updatedOdd.OddID,
                                                    updatedOdd.BookName, updatedOdd.Price, updatedOdd.RetrievalTimestamp,
                                                    OddID]);
}

export async function removeOdd(OddID: string) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM odds WHERE "OddID" = $1`;
    return executeSqlById(query, [OddID]);
}

export async function removeAllOdds(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM odds`;
    return executeSql(query, []);
}
