import {ElementHandle, Page } from "puppeteer";
import {sleep} from "../util/util";

export class LocatableElementHandle {
    pageUrl: string;
    locators: ElementHandleLocator[];

    constructor(pageUrl: string, locators?: ElementHandleLocator[]) {
        this.pageUrl = pageUrl;

        this.locators = []
        if (locators){
            this.locators = locators;
        }
    }

    async locateElementHandle(driver: Page, sleepTime: number): Promise<ElementHandle | undefined> {
        await driver.goto(this.pageUrl)
        await sleep(sleepTime)
        let element: ElementHandle | undefined = undefined
        for (const locator of this.locators){
            let elements: ElementHandle[]
            if (!element){
                elements = await driver.$$(locator.selector)
            } else{
                elements = await element.$$(locator.selector)
            }
            element = elements[locator.index]
        }
        return element
    }
}

export class ElementHandleLocator{
    selector: string;
    index: number;

    constructor(selector: string, index: number) {
        this.selector = selector
        this.index = index
    }
}