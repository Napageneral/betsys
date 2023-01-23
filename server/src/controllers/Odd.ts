import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../MySQLConnection";
import {AddOddRequest, Odd, ListOddsRequest} from "../../../shared/models/Odd";

export async function addOdd(newOdd: AddOddRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO Odds (GameID, PropID, OddID, BookName, Price, RetrievalTimestamp) VALUES (?, ?, ?, ?, ?, ?)`;
    return executeSql(query, [newOdd.GameID, newOdd.PropID, newOdd.OddID, newOdd.BookName,
        newOdd.Price, newOdd.RetrievalTimestamp]);
}

export async function getOdd(OddID: string) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM Odds WHERE OddID = ?`;
    return executeSqlById(queryString, [OddID]);
}

export function listOdds(request: ListOddsRequest) : Promise<ApiResponse<any>>{
    let queryHead = "SELECT * FROM Odds";
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

    if(queryConditions.length > 0) {
        query += " WHERE ";
        query += queryConditions.map(item => `${item} = ?`).join(" AND ");
    }

    return executeSql(query, queryParams);
}

export async function updateOdd(OddID: string, updatedOdd: Odd) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE Odds SET GameID = ?, PropID = ?, OddID = ?, BookName = ?, Price = ?, RetrievalTimestamp = ? WHERE OddID = ?`;
    return executeSqlById(queryString, [updatedOdd.GameID, updatedOdd.PropID, updatedOdd.OddID,
                                                    updatedOdd.BookName, updatedOdd.Price, updatedOdd.RetrievalTimestamp,
                                                    OddID]);
}

export async function removeOdd(OddID: string) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM Odds WHERE OddID = ?";
    return executeSqlById(query, [OddID]);
}

export async function removeAllOdds(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM Odds";
    return executeSql(query, []);
}
