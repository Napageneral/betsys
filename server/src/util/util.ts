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
