import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../MySQLConnection";
import {
    CreateBookAccountRequest,
    GetBookAccountRequest,
    UpdateBookAccountRequest, RemoveBookAccountRequest, ListBookAccountsRequest
} from "../../../shared/models/BookAccount";

export async function addBookAccount(newBookAccount: CreateBookAccountRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO BookAccounts (PlayerID, BookName, LoginInfo) VALUES (?, ?, ?)`;
    return executeSql(query, [newBookAccount.PlayerID, newBookAccount.BookName, JSON.stringify(newBookAccount.LoginInfo)]);
}

export async function getBookAccount(bookAccount: GetBookAccountRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM BookAccounts WHERE PlayerID = ? AND BookName = ?`;
    return executeSqlById(queryString, [bookAccount.PlayerID, bookAccount.BookName]);
}

export function listBookAccounts(listBookAccountRequest: ListBookAccountsRequest) : Promise<ApiResponse<any>>{
    let queryHead = "SELECT * FROM BookAccounts";
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
        query += queryConditions.map(item => `${item} = ?`).join(" AND ");
    }

    return executeSql(query, []);
}

export async function updateBookAccount(updateBookAccountRequest: UpdateBookAccountRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE BookAccounts SET LoginInfo = ?, AccountBalance = ?, MarketLimits = ? WHERE PlayerID = ? AND BookName = ?`;
    return executeSqlById(queryString, [JSON.stringify(updateBookAccountRequest.BookAccount.LoginInfo), updateBookAccountRequest.BookAccount.AccountBalance, updateBookAccountRequest.BookAccount.MarketLimits, updateBookAccountRequest.PlayerID, updateBookAccountRequest.BookName]);
}

export async function removeBookAccount(removeBookAccountRequest: RemoveBookAccountRequest) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM BookAccounts WHERE PlayerID = ? AND BookName = ?";
    return executeSqlById(query, [removeBookAccountRequest.PlayerID, removeBookAccountRequest.BookName]);
}

export async function removeAllBookAccounts(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM BookAccounts";
    return executeSql(query, []);
}
