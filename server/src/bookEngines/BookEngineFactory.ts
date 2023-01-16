import {Bovada} from "./Bovada";
import {BookEngine} from "./BookEngine";


export async function init(BookName: string) {
    let bookEngine : BookEngine;
    switch (BookName) {
        case "Bovada":
            bookEngine = new Bovada()
            break;
        default:
            throw new Error("Unrecognized BookName: " + BookName)
    }

    await bookEngine.initializeDriver()
    return bookEngine
}

