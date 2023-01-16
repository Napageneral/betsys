import express, {Request, Response} from 'express';

import {sendExpressResponse} from "../util/ResponseUtility";
import {
    CreateAccountRequest,
    EndBookSessionRequest,
    EndBookSessionsRequest,
    GetBookSessionRequest,

    ListBookSessionsRequest, PlaceBetRequest, ScrapeLinesRequest,

    StartSessionRequest
} from "../../../shared/models/BookSession";
import {
    createBookAccount,
    endBookSession,
    endBookSessions,
    getBookSession,
    listBookSessions,
    placeBet,
    scrapeLines,
    startBookSession,
} from "../controllers/BookSession";

const router = express.Router();

router.post("/StartSession", startSession);
router.post( "/GetSession", getSession);
router.post( "/ListSessions", listSessions);
router.post('/CreateAccount', createAccount);
router.post('/ScrapeLines', scrape);
router.post('/PlaceBet', bet);
router.post( "/EndSession", endSession);
router.post("/EndSessions", endSessions);

async function startSession(req: Request, res: Response){
    const bookSessionRequest: StartSessionRequest = req.body;
    const output = await startBookSession(bookSessionRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function getSession(req: Request, res: Response){
    const bookSessionRequest: GetBookSessionRequest = req.body;
    const output = await getBookSession(bookSessionRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function listSessions(req: Request, res: Response){
    const bookSessionRequest: ListBookSessionsRequest = req.body;
    const output = await listBookSessions(bookSessionRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function scrape(req: Request, res: Response){
    const getBookEngineRequest: ScrapeLinesRequest = req.body;
    const output = await scrapeLines(getBookEngineRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function bet(req: Request, res: Response){
    const listBookEnginesRequest: PlaceBetRequest = req.body;
    const output = await placeBet(listBookEnginesRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function createAccount(req: Request, res: Response){
    const updateBookEngineRequest: CreateAccountRequest = req.body;
    const output = await createBookAccount(updateBookEngineRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function endSession(req: Request, res: Response){
    const bookSessionRequest: EndBookSessionRequest = req.body;
    const output = await endBookSession(bookSessionRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function endSessions(req: Request, res: Response){
    const bookSessionRequest: EndBookSessionsRequest = req.body;
    const output = await endBookSessions(bookSessionRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

export default router;