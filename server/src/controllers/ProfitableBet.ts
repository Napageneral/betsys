import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {AddProfitableBetRequest, ProfitableBet, ListProfitableBetsRequest} from "../../../shared/models/ProfitableBet";
import {sliceIntoChunks} from "../util/util";
const format = require('pg-format');

export async function addProfitableBet(pBet: AddProfitableBetRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "ProfitableBets" ("Percent", "RetrievalTimestamp", "GameID", "StartDate", "EventName",
                                            "Sport", "MutuallyExclusiveGroupID", "Market", "PropIDs", "PropNames",
                                            "OddIDs", "Prices", "BookNames", "Type", "MarketWidth", "FairOdds") 
                                            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`;
    return executeSql(query, [pBet.Percent, pBet.RetrievalTimestamp, pBet.GameID, pBet.StartDate, pBet.EventName,
                                            pBet.Sport, pBet.MutuallyExclusiveGroupID, pBet.Market, pBet.PropIDs,
                                            pBet.PropNames, pBet.OddIDs, pBet.Prices, pBet.BookNames, pBet.Type,
                                            pBet.MarketWidth, pBet.FairOdds]);
}

export async function addAllProfitableBets(ProfitableBets: ProfitableBet[]){
    const ProfitableBetChunks:ProfitableBet[][] = sliceIntoChunks(ProfitableBets, 1000)
    for (const ProfitableBetChunk of ProfitableBetChunks){
        await addProfitableBets(ProfitableBetChunk)
    }
}

export async function addProfitableBets(pBets: ProfitableBet[]) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "ProfitableBets" ("Percent", "RetrievalTimestamp", "GameID", "StartDate", "EventName",
                                                    "Sport", "MutuallyExclusiveGroupID", "Market", "PropIDs", "PropNames",
                                                    "OddIDs", "Prices", "BookNames", "Type", "MarketWidth", "FairOdds") VALUES `
    for (let i = 0; i < pBets.length; i++) {
        const pBet = pBets[i];
        let pBetValue = format(`(%L, %L, %L, %L, %L, %L, %L, %L, ARRAY[%L], ARRAY[%L], ARRAY[%L], '{%s}', ARRAY[%L], %L, %L, '{%s}')`, pBet.Percent, pBet.RetrievalTimestamp, pBet.GameID, pBet.StartDate, pBet.EventName,
            pBet.Sport, pBet.MutuallyExclusiveGroupID, pBet.Market, pBet.PropIDs,
            pBet.PropNames, pBet.OddIDs, pBet.Prices, pBet.BookNames, pBet.Type,
            pBet.MarketWidth, pBet.FairOdds)
        if (i < pBets.length -1){
            pBetValue += " , "
        }
        query += pBetValue
    }
    return executeSql(query, []);
}

export async function getProfitableBet(ProfitableBetID: number) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "ProfitableBets" WHERE ProfitableBetID = $1`;
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
                    "BookName", "RetrievalTimestamp", "Price", "GameID", "PropID", "ProfitableBetID" 
                    order by "RetrievalTimestamp" ASC`
    }

    return executeSql(query, queryParams);
}


export async function removeProfitableBet(ProfitableBetID: string) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM ProfitableBets WHERE "ProfitableBetID" = $1`;
    return executeSqlById(query, [ProfitableBetID]);
}

export async function removeAllProfitableBets(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM ProfitableBets`;
    return executeSql(query, []);
}
