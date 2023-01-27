import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {
    AddBookAccountRequest,
    GetBookAccountRequest,
    UpdateBookAccountRequest, RemoveBookAccountRequest, ListBookAccountsRequest
} from "../../../shared/models/BookAccount";

export async function addBookAccount(newBookAccount: AddBookAccountRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "BookAccounts" ("PlayerID", "BookName", "Username", "Password", "Email", "AccountBalance", "MarketLimits") VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    return executeSql(query, [newBookAccount.PlayerID,
                                            newBookAccount.BookName,
                                            newBookAccount.Username,
                                            newBookAccount.Password,
                                            newBookAccount.Email,
                                            0,
                                            "10000"]);
}

export async function getBookAccount(bookAccount: GetBookAccountRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "BookAccounts" WHERE "PlayerID" = $1 AND "BookName" = $2`;
    return executeSqlById(queryString, [bookAccount.PlayerID, bookAccount.BookName]);
}

export function listBookAccounts(listBookAccountRequest: ListBookAccountsRequest) : Promise<ApiResponse<any>>{
    let queryHead = `SELECT * FROM "BookAccounts"`;
    let queryConditions: string[] = [];
    let queryParams: any[] = [];

    if (listBookAccountRequest.BookName) {
        queryConditions.push("BookName");
        queryParams.push(listBookAccountRequest.BookName);
    }
    if (listBookAccountRequest.PlayerID) {
        queryConditions.push("PlayerID");
        queryParams.push(listBookAccountRequest.PlayerID);
    }

    let query = queryHead;

    if(queryConditions.length > 0) {
        query += " WHERE ";
        query += queryConditions.map(item => `"${item}" = $`).join(" AND ");
    }

    return executeSql(query, queryParams);
}

export async function updateBookAccount(updateBookAccountRequest: UpdateBookAccountRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE "BookAccounts" SET "Username" = $1, "Password" = $2, "Email" = $3, "AccountBalance" = $4, "MarketLimits" = $5 WHERE "PlayerID" = $6 AND "BookName" = $7`;
    return executeSqlById(queryString, [updateBookAccountRequest.BookAccount.Username,
                                                    updateBookAccountRequest.BookAccount.Password,
                                                    updateBookAccountRequest.BookAccount.Email,
                                                    updateBookAccountRequest.BookAccount.AccountBalance,
                                                    updateBookAccountRequest.BookAccount.MarketLimits,
                                                    updateBookAccountRequest.PlayerID,
                                                    updateBookAccountRequest.BookName]);
}

export async function removeBookAccount(removeBookAccountRequest: RemoveBookAccountRequest) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM "BookAccounts" WHERE "PlayerID" = $1 AND "BookName" = $2`;
    return executeSqlById(query, [removeBookAccountRequest.PlayerID, removeBookAccountRequest.BookName]);
}

export async function removeAllBookAccounts(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM "BookAccounts"`;
    return executeSql(query, []);
}
