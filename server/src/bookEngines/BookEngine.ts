import {Builder, WebDriver} from "selenium-webdriver";
import {LoginInfo} from "../../../shared/models/LoginInfo";
import {Line} from "../../../shared/models/Line";
import {Player} from "../../../shared/models/Player";
import {LocatableWebElement} from "../models/LocatableWebElement";

let chrome = require("selenium-webdriver/chrome");

export abstract class BookEngine {
    BookName: string;
    PlayerID: number;
    loggedIn: boolean = false;
    loginInfo?: LoginInfo;
    driver?: WebDriver;

    constructor(BookName: string) {
        this.BookName = BookName;
        this.PlayerID = 0;
    }

    async initializeDriver(): Promise<boolean> {
        try {
            const opts = new chrome.Options()
            opts.addArguments("--window-size=2560,1440")
            this.driver = new Builder().forBrowser("chrome").build();
            return Promise.resolve(true);
        } catch (e:any){
            console.log(e)
            return Promise.resolve(false);
        }
    }

    async exitDriver(): Promise<boolean> {
        this.driver?.quit()
        return Promise.resolve(true);
    }

    abstract createAccount(player: Player, loginInfo: LoginInfo): Promise<boolean>;

    async login(playerID: number, loginInfo: LoginInfo): Promise<boolean>{
        this.PlayerID = playerID;
        this.loginInfo = loginInfo;
        const result: boolean = await this.loginInternal();
        if (result){
            this.loggedIn = true;
        }
        return Promise.resolve(result)
    }
    abstract loginInternal(): Promise<boolean>;

    abstract scrapeLines(sport?:string): Promise<Map<Line, LocatableWebElement>>;
    abstract placeBet(betButton:LocatableWebElement, stakeAmount:number): Promise<boolean>;

}

