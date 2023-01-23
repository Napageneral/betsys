import {BookEngine} from "./BookEngine";
import {getText, sleep} from "../util/util";
import {Player} from "../../../shared/models/Player";

import { ElementHandle } from "puppeteer";
import {ElementHandleLocator, LocatableElementHandle} from "../models/LocatableElementHandle";
import {Odd} from "../../../shared/models/Odd";


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

    async placeBet(betButtonLocation: LocatableElementHandle, stakeAmount:number): Promise<boolean> {
        if (!this.page){
            return Promise.resolve(false)
        }

        const betButton: ElementHandle | undefined = await betButtonLocation.locateElementHandle(this.browser, 1000)
        if (!betButton){
            return Promise.resolve(false)
        }
        await betButton.click()
        await sleep(1000)

        await this.page.$("default-input--risk").type(stakeAmount)
        //TODO: check for limits or lack of funds
        await this.page.$("place-bets").click()
        //TODO: check for success or failure

        return Promise.resolve(true);
    }

    async scrapeLines(): Promise<Map<Odd, LocatableElementHandle>> {
        if (!this.page) {
            return Promise.resolve(new Map());
        }

        const lines: Map<Odd, LocatableElementHandle> = new Map()
        console.log("about to scrape MMA Lines")
        await this.scrapeMMALines(lines)

        return Promise.resolve(lines);
    }

    async scrapeMMALines(lines: Map<Odd, LocatableElementHandle>){
        const sport = "MMA"
        if (!this.page) {
            return Promise.resolve(new Map());
        }

        await this.page.goto('https://www.bovada.lv/sports/ufc-mma')
        await sleep(2000)
        let match_urls = []
        const mmaEvents : ElementHandle[] = await this.page.$$("div.grouped-events")
        for (const mmaEvent of mmaEvents) {
            const matches: ElementHandle[] = await mmaEvent.$$("sp-coupon")
            for (const match of matches) {
                const match_url_container: ElementHandle | null = await match.$("a")
                if (match_url_container) {
                    const match_url = match_url_container.getProperty('href')
                    match_urls.push(match_url)
                }
            }
        }

        console.log(match_urls)

        for (const match_url of match_urls){
            const locatorStack: ElementHandleLocator[] = []
            await this.page.goto(match_url)
            await sleep(1000)
            console.log(match_url)

            const competitors : ElementHandle[] = await this.page.$$("h4.competitor-name")
            const competitor_one : string = await getText(this.page, competitors[0])
            const competitor_two : string = await getText(this.page, competitors[1])
            const event_name : string = competitor_one + " vs. " + competitor_two

            const s1 = "sp-coupon"
            const market_containers : ElementHandle[] = await this.page.$$(s1)

            locatorStack.push(new ElementHandleLocator(s1, 0))
            await this.scrapeMmaMatchMoneylines(market_containers[0], event_name, competitor_one, competitor_two, locatorStack, lines)
            locatorStack.pop()

            const s2 = "sp-single-market"
            const markets = await market_containers[1].$$(s2)
            locatorStack.push(new ElementHandleLocator(s1, 1))
            for (let i = 0; i < markets.length; i++) {
                const market: ElementHandle = markets[i]
                locatorStack.push(new ElementHandleLocator(s2, i))
                //Need to seek elements and check if they exist before proceeding
                //Also need to check for h3.league-header which is used for Total Rounds Over/Under
                const marketTitle: ElementHandle[] = await market.$$('h3.market-name')
                const marketName : string = await getText(this.page, marketTitle[0])
                if (marketName == "Total Rounds Over/Under"){
                    await this.scrapeTotalRoundsOverUnder(market, event_name, marketName, locatorStack, lines)
                }
                const s3 = 'li'
                const props : ElementHandle[] = await market.$$(s3)
                for (let j = 0; j < props.length; j++) {
                    const prop: ElementHandle = props[j]
                    locatorStack.push(new ElementHandleLocator(s3, j))
                    const outcomes = await prop.$$('span.outcomes')
                    const betName : string = await getText(this.page, outcomes[0])

                    const s4 = 'span.bet-price'
                    const betButtonsContainer: ElementHandle[] = await prop.$$(s4)
                    const betButton: ElementHandle = betButtonsContainer[0]
                    const odds : string = await getText(this.page, betButton)
                    locatorStack.push(new ElementHandleLocator(s4, 0))
                    //lines.set(new Odd(this.BookName, sport, event_name, marketName, betName, odds), new LocatableElementHandle(await this.page.url(), locatorStack))
                    locatorStack.pop()
                    locatorStack.pop()
                }
                locatorStack.pop()
            }
            locatorStack.pop()
        }

        return Promise.resolve(lines);
    }

    async scrapeMmaMatchMoneylines(moneyLineContainer: ElementHandle, event_name: string, competitor_one: string, competitor_two: string, locatorStack: ElementHandleLocator[], lines: Map<Odd, LocatableElementHandle>){
        if (!this.browser) {
            return Promise.resolve(new Map());
        }

        const selector = "span.bet-price"
        const moneyline_odds : ElementHandle[] = await moneyLineContainer.$$(selector)
        const moneyline_odds_competitor_one : string = await getText(this.page, await moneyline_odds[0])
        const moneyline_odds_competitor_two : string = await getText(this.page, await moneyline_odds[1])
        locatorStack.push(new ElementHandleLocator(selector, 0))
        //lines.set(new Odd(this.BookName, "MMA", event_name, "moneyline", competitor_one, moneyline_odds_competitor_one), new LocatableElementHandle(await this.page.url(), locatorStack))
        locatorStack.pop()
        locatorStack.push(new ElementHandleLocator(selector, 1))
        //lines.set(new Odd(this.BookName, "MMA", event_name, "moneyline", competitor_two, moneyline_odds_competitor_two), new LocatableElementHandle(await this.page.url(), locatorStack))
        locatorStack.pop()
    }

    async scrapeTotalRoundsOverUnder(market: ElementHandle, event_name: string, marketName: string, locatorStack: ElementHandleLocator[], lines: Map<Odd, LocatableElementHandle>){
        if (!this.browser) {
            return Promise.resolve(new Map());
        }


        const s1 = 'ul.market-type'
        const over_unders : ElementHandle[] = await market.$$(s1)
        const s2 = 'li'
        const overs : ElementHandle[] = await over_unders[0].$$(s2)
        locatorStack.push(new ElementHandleLocator(s1, 0))
        for (let i = 0; i < 5; i++) {
            locatorStack.push(new ElementHandleLocator(s2, i))
            const betName : string = "Over " + (i+0.5)
            const odds : string = await getText(this.page, overs[i])
            //lines.set(new Odd(this.BookName, "MMA", event_name, marketName, betName, odds), new LocatableElementHandle(await this.page.url(), locatorStack))
            locatorStack.pop()
        }
        locatorStack.pop()
        const unders : ElementHandle[] = await over_unders[1].$$(s2)
        locatorStack.push(new ElementHandleLocator(s1, 1))
        for (let i = 0; i < 5; i++) {
            locatorStack.push(new ElementHandleLocator(s2, i))
            const betName : string = "Under " + (i+0.5)
            const odds : string = await getText(this.page, unders[i])
            //lines.set(new Odd(this.BookName, "MMA", event_name, marketName, betName, odds), new LocatableElementHandle(await this.page.url(), locatorStack))
            locatorStack.pop()
        }
        locatorStack.pop()
    }

}
