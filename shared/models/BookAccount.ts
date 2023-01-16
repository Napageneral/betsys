import {LoginInfo} from "./LoginInfo";

export class BookAccount {
    PlayerID: number;
    BookName: string;
    LoginInfo: LoginInfo;
    AccountBalance?: any;
    MarketLimits?: any;

    constructor(PlayerID: number,
                BookName: string,
                LoginInfo: LoginInfo,
                AccountBalance: any,
                MarketLimits?: any) {
        this.PlayerID = PlayerID;
        this.BookName = BookName;
        this.LoginInfo = LoginInfo;
        this.AccountBalance = AccountBalance;
        this.MarketLimits = MarketLimits;
    }
}

export interface CreateBookAccountRequest {
    PlayerID: number;
    BookName: string;
    LoginInfo: LoginInfo;
}

export interface CreateBookAccountResponse {
    BookAccount: BookAccount;
}

export interface RemoveBookAccountRequest {
    PlayerID: number;
    BookName: string;
}

export interface RemoveBookAccountResponse {
}

export interface GetBookAccountRequest {
    PlayerID: number;
    BookName: string;
}

export interface GetBookAccountResponse {
    BookAccount: BookAccount;
}

export interface ListBookAccountsRequest {
    PlayerID?: number;
    BookName?: string;
}

export interface ListBookAccountsResponse {
    BookAccounts: Array<BookAccount>;
}

export interface UpdateBookAccountRequest {
    PlayerID: number;
    BookName: string;
    BookAccount: BookAccount;
}

export interface UpdateBookAccountResponse {
    BookAccount: BookAccount;
}