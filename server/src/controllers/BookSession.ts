import {ApiResponse} from "../util/ResponseUtility";
import {
    CreateAccountRequest,
    EndBookSessionRequest,
    EndBookSessionsRequest,
    GetBookSessionRequest,
    ListBookSessionsRequest,
    PlaceBetRequest,
    ScrapeLinesRequest,
    StartSessionRequest
} from "../../../shared/models/BookSession";
import {BookEngine} from "../bookEngines/BookEngine";
import {ActiveBookSessions} from "../ActiveBookSessions";
import {init} from "../bookEngines/BookEngineFactory";

import {LocatableWebElement} from "../models/LocatableWebElement";
import {addBookAccount} from "../controllers/BookAccount";

const activeBookSessions = new ActiveBookSessions();
export const lineBetButtonMapping = new Map<number, LocatableWebElement>()

export async function startBookSession(bookSessionRequest: StartSessionRequest) : Promise<ApiResponse<any>> {
    const bookEngine: BookEngine = await init(bookSessionRequest.BookName)
    if (bookSessionRequest.LogIn && bookSessionRequest.PlayerID && bookSessionRequest.Password ){
        try {
            const loginResult = await bookEngine?.login(bookSessionRequest.PlayerID,
                                                        bookSessionRequest.Password,
                                                        bookSessionRequest.Username,
                                                        bookSessionRequest.Email);
            activeBookSessions.addLoggedInBookSession(bookSessionRequest.PlayerID, bookSessionRequest.BookName, bookEngine)
            if (loginResult){
                return Promise.resolve(new ApiResponse(200, ["LOGIN SUCCESS"], []))
            } else {
                return Promise.resolve(new ApiResponse(500, ["LOGIN FAILURE"], []))
            }
        } catch (e) {
            return Promise.resolve(new ApiResponse(500, ["LOGIN FAILURE"], [e]))
        }
    } else{
        activeBookSessions.addLoggedOutBookSession(bookSessionRequest.BookName, bookEngine)
        return Promise.resolve(new ApiResponse(200, [], []))
    }
}

export async function getBookSession(getBookSessionRequest: GetBookSessionRequest) : Promise<ApiResponse<any>>{
    const bookEngine = activeBookSessions.getBookSession(getBookSessionRequest.BookName, getBookSessionRequest.PlayerID)
    if (bookEngine){
        return Promise.resolve(new ApiResponse(200, [bookEngine], []))
    }
    return Promise.resolve(new ApiResponse(404, [], []))
}

export function listBookSessions(bookSessionsRequest: ListBookSessionsRequest) : Promise<ApiResponse<any>>{
    if (bookSessionsRequest.PlayerID && bookSessionsRequest.BookName){
        return getBookSession({
            PlayerID:bookSessionsRequest.PlayerID,
            BookName:bookSessionsRequest.BookName
        })
    }

    let bookEngines: BookEngine[] = []
    if (!bookSessionsRequest.PlayerID && !bookSessionsRequest.BookName){
        bookEngines = activeBookSessions.getBookSessions()
    }
    if (bookSessionsRequest.PlayerID){
        bookEngines = activeBookSessions.getBookSessions(bookSessionsRequest.PlayerID)
    }
    if (bookSessionsRequest.BookName){
        bookEngines = activeBookSessions.getBookSessions(undefined, bookSessionsRequest.BookName)
    }

    return Promise.resolve(new ApiResponse(200, bookEngines, []))
}

export async function createBookAccount(createAccountRequest: CreateAccountRequest) : Promise<ApiResponse<any>> {
    const initializedBookEngine: BookEngine = await init(createAccountRequest.BookName)
    try {
        const result = await initializedBookEngine.createAccount(createAccountRequest.Player,
                                                                    createAccountRequest.Username,
                                                                    createAccountRequest.Password,
                                                                    createAccountRequest.Email)
        if (result){
            await addBookAccount({
                PlayerID: createAccountRequest.Player.PlayerID,
                BookName: createAccountRequest.BookName,
                Username: createAccountRequest.Username,
                Password: createAccountRequest.Password,
                Email: createAccountRequest.Email
            })
            await initializedBookEngine.exitDriver()
            return Promise.resolve(new ApiResponse(200, ["ACCOUNT CREATION SUCCESS"], []))
        } else {
            await initializedBookEngine.exitDriver()
            return Promise.resolve(new ApiResponse(500, ["ACCOUNT CREATION FAILURE"], []))
        }
    } catch (e) {
        await initializedBookEngine.exitDriver()
        return Promise.resolve(new ApiResponse(500, ["ACCOUNT CREATION FAILURE"], [e]))
    }
}

export async function scrapeLines(bookSessionRequest: ScrapeLinesRequest) : Promise<ApiResponse<any>> {
    let bookEngine = await activeBookSessions.getBookSession(bookSessionRequest.BookName)
    if (!bookEngine){
        await startBookSession({
            BookName: bookSessionRequest.BookName,
            LogIn: false
        })
    }
    bookEngine = await activeBookSessions.getBookSession(bookSessionRequest.BookName)
    if (bookEngine){
        try {
            const result = await bookEngine.scrapeLines(bookSessionRequest.Sport);
            if (result){
                return Promise.resolve(new ApiResponse(200, ["SCRAPE LINES SUCCESS"], []))
            } else {
                return Promise.resolve(new ApiResponse(500, ["SCRAPE LINES FAILURE"], []))
            }
        } catch (e) {
            console.log(e)
            return Promise.resolve(new ApiResponse(500, ["SCRAPE LINES FAILURE"], [e]))
        }
    }
    return Promise.resolve(new ApiResponse(404, ["bookSession not found"], []))
}

export async function placeBet(bookSessionRequest: PlaceBetRequest) : Promise<ApiResponse<any>> {
    const bookEngine = activeBookSessions.getBookSession(bookSessionRequest.BookName, bookSessionRequest.PlayerID)
    if (bookEngine){
        try {
            const betButton = lineBetButtonMapping.get(bookSessionRequest.Line.LineID)
            if (betButton){
                const result = await bookEngine?.placeBet(betButton, bookSessionRequest.StakeAmount);
                if (result){
                    return Promise.resolve(new ApiResponse(200, ["PLACE BET SUCCESS"], []))
                } else {
                    return Promise.resolve(new ApiResponse(500, ["PLACE BET FAILURE"], []))
                }
            }
            return Promise.resolve(new ApiResponse(404, ["betbutton not found"], []))
        } catch (e) {
            return Promise.resolve(new ApiResponse(500, ["PLACE BET FAILURE"], [e]))
        }
    }
    return Promise.resolve(new ApiResponse(404, ["bookSession not found"], []))
}

export async function endBookSession(bookSessionRequest: EndBookSessionRequest) : Promise<ApiResponse<any>> {
    const bookEngine = activeBookSessions.getBookSession(bookSessionRequest.BookName, bookSessionRequest.PlayerID)
    bookEngine?.exitDriver();
    activeBookSessions.removeBookSession(bookSessionRequest.BookName, bookSessionRequest.PlayerID)
    return Promise.resolve(new ApiResponse(200, [true], []))
}

export async function endBookSessions(bookSessionRequest: EndBookSessionsRequest) : Promise<ApiResponse<any>> {
    if (bookSessionRequest.PlayerID && bookSessionRequest.BookName){
        return endBookSession({
            PlayerID:bookSessionRequest.PlayerID,
            BookName:bookSessionRequest.BookName
        })
    }

    let engines: BookEngine[] = []
    if (!bookSessionRequest.PlayerID && !bookSessionRequest.BookName){
        engines = activeBookSessions.getBookSessions()
    }
    if (bookSessionRequest.PlayerID){
        engines = activeBookSessions.getBookSessions(bookSessionRequest.PlayerID)
    }
    if (bookSessionRequest.BookName){
        engines = activeBookSessions.getBookSessions(undefined, bookSessionRequest.BookName)
    }

    for (const engine of engines){
        engine.exitDriver()
        activeBookSessions.removeBookSession(engine.BookName, engine.PlayerID)
    }
    return Promise.resolve(new ApiResponse(200, [true], []))
}



