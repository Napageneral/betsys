import {LoginInfo} from "./LoginInfo";

export class BookieAccount {
    PlayerID: string;
    BookieAccountID: string;
    BookieName: string;
    LoginInfo: LoginInfo;
    AccountBalance?: any;
    MarketLimits?: any;

    constructor(PlayerID: string,
                BookieAccountID: string,
                BookieName: string,
                LoginInfo: LoginInfo,
                AccountBalance: any,
                MarketLimits?: any) {
        this.PlayerID = PlayerID;
        this.BookieAccountID = BookieAccountID;
        this.BookieName = BookieName;
        this.LoginInfo = LoginInfo;
        this.AccountBalance = AccountBalance;
        this.MarketLimits = MarketLimits;
    }
}