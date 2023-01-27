import { ElementHandle, Page } from "puppeteer";
import {WebDriver, WebElement} from "selenium-webdriver";

export async function scroll_til_element_centered(driver:WebDriver, element:WebElement) : Promise<void>{
    const element_rect : { height: number, width: number, x: number, y: number } = await element.getRect();
    const desired_y : number = (element_rect.height / 2) + element_rect.y;
    const window_h : number = await driver.executeScript('return window.innerHeight');
    const window_y : number = await driver.executeScript('return window.pageYOffset');
    const current_y : number = (window_h / 2) + window_y;
    const scroll_y_by = desired_y - current_y;
    await driver.executeScript("window.scrollBy(0, arguments[0]);", scroll_y_by)
}

export function sleep(ms:number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getText(page: Page,  elementHandle: ElementHandle){
    return await page.evaluate(function (el:any) {
        return el.textContent;
    }, elementHandle)
}

export function sliceIntoChunks(arr: any[], chunkSize: number) {
    const res = [];
    for (let i = 0; i < arr.length; i += chunkSize) {
        const chunk = arr.slice(i, i + chunkSize);
        res.push(chunk);
    }
    return res;
}

export function getHourDiff(timestamp: Date){
    const now = new Date()
    const gameStart = new Date(timestamp)
    const diff = now.getTime() - gameStart.getTime()
    const hourDiff = Math.floor(diff/1000/60/60);
    return hourDiff
}

export function getTimeDiff(timestamp: Date){
    const now = new Date()
    const gameStart = new Date(timestamp)
    return now.getTime() - gameStart.getTime()
}

export function shallowEqual(object1:any, object2:any) {
    const keys1 = Object.keys(object1);
    const keys2 = Object.keys(object2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (let key of keys1) {
        if (object1[key] !== object2[key]) {
            return false;
        }
    }
    return true;
}