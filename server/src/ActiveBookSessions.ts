import {BookEngine} from "./bookEngines/BookEngine";

const LOGGED_OUT: string = "loggedOut"

export class ActiveBookSessions{

    playerIdMap: Map<number, string[]>;
    bookNameMap: Map<string, string[]>;
    bookEngineMap: Map<string, BookEngine>;
    loggedOutMap: Map<string, string>

    constructor() {
        this.bookNameMap = new Map();
        this.playerIdMap = new Map();
        this.bookEngineMap = new Map();
        this.loggedOutMap = new Map();
    }

    addLoggedOutBookSession(bookName: string, bookEngine: BookEngine){
        const engineKey = LOGGED_OUT + "_" + bookName;
        if (this.bookEngineMap.has(engineKey)){
            return false
        }
        this.bookEngineMap.set(engineKey, bookEngine)
        this.loggedOutMap.set(bookName, engineKey)

        if (!this.bookNameMap.has(bookName)){
            this.bookNameMap.set(bookName, [])
        }
        this.bookNameMap.get(bookName)?.push(engineKey)

        return true;
    }

    addLoggedInBookSession(playerID: number, bookName: string, bookEngine: BookEngine){
        const engineKey = playerID + "_" + bookName;
        this.bookEngineMap.set(engineKey, bookEngine)

        if (!this.playerIdMap.has(playerID)){
            this.playerIdMap.set(playerID, [])
        }
        this.playerIdMap.get(playerID)?.push(engineKey)

        if (!this.bookNameMap.has(bookName)){
            this.bookNameMap.set(bookName, [])
        }
        this.bookNameMap.get(bookName)?.push(engineKey)
    }

    removeBookSession(bookName: string, playerID?: number){
        let engineKey: string;
        if (playerID){
            engineKey = playerID + "_" + bookName;
            this.playerIdMap.get(playerID)?.filter(function(item) {
                return item !== engineKey
            })
        }else {
            engineKey = LOGGED_OUT + "_" + bookName;
            this.loggedOutMap.delete(bookName)
        }

        this.bookEngineMap.delete(engineKey)
        this.bookNameMap.get(bookName)?.filter(function(item) {
            return item !== engineKey
        })
    }

    getBookSession(bookName: string, playerID?: number): BookEngine| undefined {
        let engineKey;
        if (playerID){
            engineKey = playerID + "_" + bookName;
        }else {
            engineKey = LOGGED_OUT + "_" + bookName;
        }

        if (this.bookEngineMap.has(engineKey)){
            return this.bookEngineMap.get(engineKey)
        }else{
            return undefined
        }
    }

    getBookSessions(playerID?: number, bookName?: string): BookEngine[]{
        if (!playerID && !bookName){
            return [ ...this.bookEngineMap.values()]
        }
        if (playerID && bookName){
            const engineKey = playerID + "_" + bookName;
            if (this.bookEngineMap.has(engineKey)){
                const bookEngine = this.bookEngineMap.get(engineKey)
                if (bookEngine){
                    return [bookEngine]
                }
            }
        }
        const engines: BookEngine[] = []
        if (playerID){
            if (this.playerIdMap.has(playerID)){
                const engineKeys = this.playerIdMap.get(playerID)
                if (engineKeys){
                    for (const engineKey of engineKeys){
                        const bookEngine = this.bookEngineMap.get(engineKey)
                        if (bookEngine){
                            engines.push(bookEngine)
                        }
                    }
                }
            }
        }

        if (bookName){
            if (this.bookNameMap.has(bookName)){
                const engineKeys = this.bookNameMap.get(bookName)
                if (engineKeys){
                    for (const engineKey of engineKeys){
                        const bookEngine = this.bookEngineMap.get(engineKey)
                        if (bookEngine){
                            engines.push(bookEngine)
                        }
                    }
                }
            }
        }

        return engines;
    }


}

