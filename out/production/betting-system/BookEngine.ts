import {Builder, WebDriver, WebElement} from "selenium-webdriver";
import {LoginInfo} from "../models/LoginInfo";
import {Line} from "../models/Line";
var chrome = require("selenium-webdriver/chrome");

export abstract class BookEngine {
    playerName: string;
    bookieName: string;
    loginInfo: LoginInfo;
    driver?: WebDriver;

    constructor(playerName: string, bookieName: string, loginInfo: LoginInfo) {
        this.playerName = playerName;
        this.bookieName = bookieName;
        this.loginInfo = loginInfo
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

    abstract login(): Promise<boolean>;
    abstract getBetButton(sport:string, eventName:string, marketName:string, betName:string): Promise<WebElement | undefined>;
    abstract placeBet(betButton:WebElement, stakeAmount:number): Promise<boolean>;
    abstract scrapeLines(): Promise<Line[]>;
}

