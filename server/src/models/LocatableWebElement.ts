import {WebDriver, WebElement, By} from "selenium-webdriver";
import {sleep} from "../util/util";

export class LocatableWebElement {
    pageUrl: string;
    locators: WebElementLocator[];

    constructor(pageUrl: string, locators?: WebElementLocator[]) {
        this.pageUrl = pageUrl;

        this.locators = []
        if (locators){
            this.locators = locators;
        }
    }

    async locateWebElement(driver: WebDriver, sleepTime: number): Promise<WebElement | undefined> {
        driver.get(this.pageUrl)
        await sleep(sleepTime)
        let element: WebElement | undefined = undefined
        for (const locator of this.locators){
            const elements: WebElement[] = await driver.findElements(locator.by)
            element = elements[locator.index]
        }
        return element
    }
}

export class WebElementLocator{
    by: By;
    index: number;

    constructor(by: By, index: number) {
        this.by = by
        this.index = index
    }
}