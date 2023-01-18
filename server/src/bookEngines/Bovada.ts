import {BookEngine} from "./BookEngine";
import {scroll_til_element_centered, sleep} from "../util/util";
import {LoginInfo} from "../../../shared/models/LoginInfo";
import {Line} from "../../../shared/models/Line";
import {Player} from "../../../shared/models/Player";
import {LocatableWebElement, WebElementLocator} from "../models/LocatableWebElement";
import { WebElement } from "selenium-webdriver";


export class Bovada extends BookEngine {

    constructor() {
        super("Bovada");
    }

    async createAccount(player: Player, username: string, password: string, email: string): Promise<boolean>{
        return Promise.resolve(false);
    }

    async loginInternal(): Promise<boolean> {
        if (!this.browser || this.PlayerID == 0) {
            return Promise.resolve(false);
        }

        const page = await this.browser.newPage();
        await page.goto('https://www.bovada.lv/?overlay=login')
        await page.$("input#email").type(this.email)
        await page.$("input#login-password").type(this.password)
        await page.$("button#login-submit").click()
        await sleep(2000)

        this.page = page;
        return Promise.resolve(true);
    }

    async placeBet(betButtonLocation: LocatableWebElement, stakeAmount:number): Promise<boolean> {
        if (!this.page){
            return Promise.resolve(false)
        }

        const betButton: WebElement | undefined = await betButtonLocation.locateWebElement(this.browser, 1000)
        if (!betButton){
            return Promise.resolve(false)
        }
        await scroll_til_element_centered(this.browser, betButton)
        await betButton.click()
        await sleep(1000)

        await this.page.$("default-input--risk").type(stakeAmount)
        //TODO: check for limits or lack of funds
        await this.page.$("place-bets").click()
        //TODO: check for success or failure

        return Promise.resolve(true);
    }

    async scrapeLines(): Promise<Map<Line, LocatableWebElement>> {
        if (!this.browser) {
            return Promise.resolve(new Map());
        }

        const lines: Map<Line, LocatableWebElement> = new Map()
        console.log("about to scrape MMA Lines")
        await this.scrapeMMALines(lines)

        return Promise.resolve(lines);
    }

    async scrapeMMALines(lines: Map<Line, LocatableWebElement>){
        const sport = "MMA"
        if (!this.browser) {
            return Promise.resolve(new Map());
        }

        await this.browser.get('https://www.bovada.lv/sports/ufc-mma')
        await sleep(2000)
        let match_urls = []
        const mmaEvents : WebElement[] = await this.browser.$$("div.grouped-events")
        for (const mmaEvent of mmaEvents) {
            const matches: WebElement[] = await mmaEvent.$$("sp-coupon")
            for (const match of matches) {
                const match_url = await match.$("a").getAttribute('href')
                match_urls.push(match_url)
            }
        }

        console.log(match_urls)

        for (const match_url of match_urls){
            const locatorStack: WebElementLocator[] = []
            await this.browser.get(match_url)
            await sleep(1000)
            console.log(match_url)

            const competitors : WebElement[] = await this.browser.findElements(By.css("h4.competitor-name"))
            const competitor_one : string = await competitors[0].getText()
            const competitor_two : string = await competitors[1].getText()
            const event_name : string = competitor_one + " vs. " + competitor_two

            const by1: By = By.css("sp-coupon")
            const market_containers : WebElement[] = await this.browser.findElements(by1)

            locatorStack.push(new WebElementLocator(by1, 0))
            await this.scrapeMmaMatchMoneylines(market_containers[0], event_name, competitor_one, competitor_two, locatorStack, lines)
            locatorStack.pop()

            const by2: By = By.css("sp-single-market")
            const markets = await market_containers[1].findElements(by2)
            locatorStack.push(new WebElementLocator(by1, 1))
            for (let i = 0; i < markets.length; i++) {
                const market: WebElement = markets[i]
                locatorStack.push(new WebElementLocator(by2, i))
                //Need to seek elements and check if they exist before proceeding
                //Also need to check for h3.league-header which is used for Total Rounds Over/Under
                const marketName : string = await market.findElement(By.css("h3.market-name")).getText()
                if (marketName == "Total Rounds Over/Under"){
                    await this.scrapeTotalRoundsOverUnder(market, event_name, marketName, locatorStack, lines)
                }
                const by3: By = By.css("li")
                const props : WebElement[] = await market.findElements(by3)
                for (let j = 0; j < props.length; j++) {
                    const prop: WebElement = props[j]
                    locatorStack.push(new WebElementLocator(by3, j))
                    const betName : string = await prop.findElement(By.css("span.outcomes")).getText()

                    const by4: By = By.css("span.bet-price")
                    const betButton: WebElement = await prop.findElement(by4)
                    const odds : string = await betButton.getText()
                    locatorStack.push(new WebElementLocator(by4, 0))
                    lines.set(new Line(this.BookName, sport, event_name, marketName, betName, odds), new LocatableWebElement(await this.browser.getCurrentUrl(), locatorStack))
                    locatorStack.pop()
                    locatorStack.pop()
                }
                locatorStack.pop()
            }
            locatorStack.pop()
        }

        return Promise.resolve(lines);
    }

    async scrapeMmaMatchMoneylines(moneyLineContainer: WebElement, event_name: string, competitor_one: string, competitor_two: string, locatorStack: WebElementLocator[], lines: Map<Line, LocatableWebElement>){
        if (!this.browser) {
            return Promise.resolve(new Map());
        }

        const by: By = By.css("span.bet-price")
        const moneyline_odds : WebElement[] = await moneyLineContainer.findElements(by)
        const moneyline_odds_competitor_one : string = await moneyline_odds[0].getText()
        const moneyline_odds_competitor_two : string = await moneyline_odds[1].getText()
        locatorStack.push(new WebElementLocator(by, 0))
        lines.set(new Line(this.BookName, "MMA", event_name, "moneyline", competitor_one, moneyline_odds_competitor_one), new LocatableWebElement(await this.browser.getCurrentUrl(), locatorStack))
        locatorStack.pop()
        locatorStack.push(new WebElementLocator(by, 1))
        lines.set(new Line(this.BookName, "MMA", event_name, "moneyline", competitor_two, moneyline_odds_competitor_two), new LocatableWebElement(await this.browser.getCurrentUrl(), locatorStack))
        locatorStack.pop()
    }

    async scrapeTotalRoundsOverUnder(market: WebElement, event_name: string, marketName: string, locatorStack: WebElementLocator[], lines: Map<Line, LocatableWebElement>){
        if (!this.browser) {
            return Promise.resolve(new Map());
        }

        const by1: By = By.css("ul.market-type")
        const over_unders : WebElement[] = await market.findElements(by1)
        const by2: By = By.css("li")
        const overs : WebElement[] = await over_unders[0].findElements(by2)
        locatorStack.push(new WebElementLocator(by1, 0))
        for (let i = 0; i < 5; i++) {
            locatorStack.push(new WebElementLocator(by2, i))
            const betName : string = "Over " + (i+0.5)
            const odds : string = await overs[i].getText()
            lines.set(new Line(this.BookName, "MMA", event_name, marketName, betName, odds), new LocatableWebElement(await this.browser.getCurrentUrl(), locatorStack))
            locatorStack.pop()
        }
        locatorStack.pop()
        const unders : WebElement[] = await over_unders[1].findElements(by2)
        locatorStack.push(new WebElementLocator(by1, 1))
        for (let i = 0; i < 5; i++) {
            locatorStack.push(new WebElementLocator(by2, i))
            const betName : string = "Under " + (i+0.5)
            const odds : string = await unders[i].getText()
            lines.set(new Line(this.BookName, "MMA", event_name, marketName, betName, odds), new LocatableWebElement(await this.browser.getCurrentUrl(), locatorStack))
            locatorStack.pop()
        }
        locatorStack.pop()
    }

}
