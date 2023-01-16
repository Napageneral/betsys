export class LocatableWebElement {
    pageUrl: string;
    xPath: string;

    constructor(pageUrl: string, xPath:string) {
        this.pageUrl = pageUrl;
        this.xPath = xPath;
    }
}