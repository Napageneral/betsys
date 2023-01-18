export class BookAccount {
    PlayerID: number;
    BookName: string;
    Username: string;
    Email: string;
    Password: string;
    AccountBalance?: any;
    MarketLimits?: any;

    constructor(PlayerID: number,
                BookName: string,
                Username: string,
                Email: string,
                Password: string,
                AccountBalance: any,
                MarketLimits?: any) {
        this.PlayerID = PlayerID;
        this.BookName = BookName;
        this.Username = Username;
        this.Email = Email;
        this.Password = Password;
        this.AccountBalance = AccountBalance;
        this.MarketLimits = MarketLimits;
    }
}

export interface AddBookAccountRequest {
    PlayerID: number;
    BookName: string;
    Username: string;
    Email: string;
    Password: string;
}

export interface AddBookAccountResponse {
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