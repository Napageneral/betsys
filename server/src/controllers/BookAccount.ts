import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../MySQLConnection";
import {
    AddBookAccountRequest,
    GetBookAccountRequest,
    UpdateBookAccountRequest, RemoveBookAccountRequest, ListBookAccountsRequest
} from "../../../shared/models/BookAccount";

export async function addBookAccount(newBookAccount: AddBookAccountRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO BookAccounts (PlayerID, BookName, Username, Password, Email, AccountBalance, MarketLimits) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    return executeSql(query, [newBookAccount.PlayerID,
                                            newBookAccount.BookName,
                                            newBookAccount.Username,
                                            newBookAccount.Password,
                                            newBookAccount.Email,
                                            0,
                                            "10000"]);
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

    return executeSql(query, queryParams);
}

export async function updateBookAccount(updateBookAccountRequest: UpdateBookAccountRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE BookAccounts SET Username = ?, Password = ?, Email = ?, AccountBalance = ?, MarketLimits = ? WHERE PlayerID = ? AND BookName = ?`;
    return executeSqlById(queryString, [updateBookAccountRequest.BookAccount.Username,
                                                    updateBookAccountRequest.BookAccount.Password,
                                                    updateBookAccountRequest.BookAccount.Email,
                                                    updateBookAccountRequest.BookAccount.AccountBalance,
                                                    updateBookAccountRequest.BookAccount.MarketLimits,
                                                    updateBookAccountRequest.PlayerID,
                                                    updateBookAccountRequest.BookName]);
}

export async function removeBookAccount(removeBookAccountRequest: RemoveBookAccountRequest) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM BookAccounts WHERE PlayerID = ? AND BookName = ?";
    return executeSqlById(query, [removeBookAccountRequest.PlayerID, removeBookAccountRequest.BookName]);
}

export async function removeAllBookAccounts(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM BookAccounts";
    return executeSql(query, []);
}
