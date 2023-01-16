import {BookEngine} from "./BookEngine";
import {By, WebElement} from "selenium-webdriver";
import {sleep} from "../util";
import {LoginInfo} from "../models/LoginInfo";
import {Line} from "../models/Line";

export class Bovada extends BookEngine {

    constructor(playerName: string, loginInfo: LoginInfo) {
        super(playerName, "Bovada", loginInfo);
    }

    async getBetButton(sport: string, eventName: string, marketName: string, betName: string): Promise<WebElement | undefined> {
        return Promise.resolve(undefined);
    }

    async login(): Promise<boolean> {
        if (!this.driver) {
            return Promise.resolve(false);
        }

        await this.driver.get('https://www.bovada.lv/?overlay=login')
        await this.driver.findElement(By.css("input#email")).sendKeys(this.loginInfo.email)
        await this.driver.findElement(By.css("input#login-password")).sendKeys(this.loginInfo.password)
        await this.driver.findElement(By.css("button#login-submit")).click()
        await sleep(2000)
        return Promise.resolve(true);

    }

    async placeBet(betButton:WebElement, stakeAmount:number): Promise<boolean> {
        if (!this.driver) {
            return Promise.resolve(false);
        }

        await betButton.click()
        await sleep(1000)

        await this.driver.findElement(By.css("default-input--risk")).sendKeys(stakeAmount)
        //TODO: check for limits or lack of funds
        await this.driver.findElement(By.css( "place-bets")).click()
        //TODO: check for success or failure

        return Promise.resolve(true);
    }

    async scrapeLines(): Promise<Line[]> {
        if (!this.driver) {
            return Promise.resolve([]);
        }

        let lines: Line[] = []
        lines.push(... await this.scrapeMMALines())

        return Promise.resolve(lines);
    }

    async scrapeMMALines(): Promise<Line[]>{
        const sport = "MMA"
        if (!this.driver) {
            return Promise.resolve([]);
        }

        let lines = []
        await this.driver.get('https://www.bovada.lv/sports/ufc-mma')
        await sleep(1)
        let match_urls = []
        const mmaEvents : WebElement[] = await this.driver.findElements(By.css("div.grouped-events"))
        for (const mmaEvent of mmaEvents) {
            const matches: WebElement[] = await mmaEvent.findElements(By.css("sp-coupon"))
            for (const match of matches) {
                const match_url = await match.findElement(By.css("a")).getAttribute('href')
                match_urls.push(match_url)
            }
        }

        for (const match_url of match_urls){
            await this.driver.get(match_url)
            await sleep(1)

            const competitors : WebElement[] = await this.driver.findElements(By.css("h4.competitor-name"))
            const competitor_one : string = await competitors[0].getText()
            const competitor_two : string = await competitors[1].getText()
            const event_name : string = competitor_one + " vs. " + competitor_two

            const market_containers : WebElement[] = await this.driver.findElements(By.css("sp-coupon"))

            await this.scrapeMmaMatchMoneylines(market_containers[0], event_name, competitor_one, competitor_two, lines)

            const markets = await market_containers[1].findElements(By.css("sp-single-market"))
            for (const market of markets){
                const marketName : string = await market.findElement(By.css("h3.market-name")).getText()
                if (marketName == "Total Rounds Over/Under"){
                    await this.scrapeTotalRoundsOverUnder(market, event_name, marketName, lines)
                }
                const props : WebElement[] = await market.findElements(By.css("li"))
                for (const prop of props){
                    const betName : string = await prop.findElement(By.css("span.outcomes")).getText()
                    const odds : string = await prop.findElement(By.css("span.bet-price")).getText()
                    lines.push(new Line(this.playerName, this.bookieName, sport, event_name, marketName, betName, odds))
                }
            }
        }

        return Promise.resolve(lines);
    }

    async scrapeMmaMatchMoneylines(moneyLineContainer: WebElement, event_name: string, competitor_one: string, competitor_two: string, lines: Line[]){
        const moneyline_odds : WebElement[] = await moneyLineContainer.findElements(By.css("span.bet-price"))
        const moneyline_odds_competitor_one : string = await moneyline_odds[0].getText()
        const moneyline_odds_competitor_two : string = await moneyline_odds[1].getText()
        lines.push(new Line(this.playerName, this.bookieName, "MMA", event_name, "moneyline", competitor_one, moneyline_odds_competitor_one))
        lines.push(new Line(this.playerName, this.bookieName, "MMA", event_name, "moneyline", competitor_two, moneyline_odds_competitor_two))
    }

    async scrapeTotalRoundsOverUnder(market: WebElement, event_name: string, marketName: string, lines: Line[]){
        const over_unders : WebElement[] = await market.findElements(By.css("ul.market-type"))
        const overs : WebElement[] = await over_unders[0].findElements(By.css("li"))
        for (let i = 0; i < 5; i++) {
            const betName : string = "Over " + (i+0.5)
            const odds : string = await overs[i].getText()
            lines.push(new Line(this.playerName, this.bookieName, "MMA", event_name, marketName, betName, odds))
        }
        const unders : WebElement[] = await over_unders[1].findElements(By.css("li"))
        for (let i = 0; i < 5; i++) {
            const betName : string = "Under " + (i+0.5)
            const odds : string = await unders[i].getText()
            lines.push(new Line(this.playerName, this.bookieName, "MMA", event_name, marketName, betName, odds))
        }
    }

}
