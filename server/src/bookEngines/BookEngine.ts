import {Builder, WebDriver} from "selenium-webdriver";
import {LoginInfo} from "../../../shared/models/LoginInfo";
import {Line} from "../../../shared/models/Line";
import {Player} from "../../../shared/models/Player";
import {LocatableWebElement} from "../models/LocatableWebElement";
import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

let chrome = require("selenium-webdriver/chrome");

export abstract class BookEngine {
    BookName: string;
    PlayerID: number;
    loggedIn: boolean = false;
    username?: string;
    password?: string;
    email?: string;
    driver?: WebDriver;
    browser?: any;
    page?: any;

    constructor(BookName: string) {
        this.BookName = BookName;
        this.PlayerID = 0;
    }

    async launchPuppeteer(headless: boolean){
        try {
            this.browser = await puppeteer
                .use(StealthPlugin())
                .launch({ headless: headless })
            return Promise.resolve(true);
        } catch (e:any){
            console.log(e)
            return Promise.resolve(false);
        }
    }

    async closePuppeteer(): Promise<boolean> {
        this.browser?.close()
        return Promise.resolve(true);
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

    abstract createAccount(player: Player, username: string, password: string, email: string): Promise<boolean>;

    async login(playerID: number, password: string, username?: string, email?: string): Promise<boolean>{
        this.PlayerID = playerID;
        this.username = username;
        this.password = password;
        this.email = email;
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

