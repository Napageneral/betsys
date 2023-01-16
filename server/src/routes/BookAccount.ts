import express, {Request, Response} from 'express';
import {
    CreateBookAccountRequest,
    GetBookAccountRequest,
    ListBookAccountsRequest,
    RemoveBookAccountRequest, UpdateBookAccountRequest
} from "../../../shared/models/BookAccount";
import {addBookAccount, getBookAccount, listBookAccounts, removeBookAccount, updateBookAccount} from "../controllers/BookAccount";
import {sendExpressResponse} from "../util/ResponseUtility";


const router = express.Router();

router.post("/Add", add);
router.post( "/Remove", remove);
router.post("/Get", get);
router.post( "/List", list);
router.post( "/Update", update);


async function add(req: Request, res: Response){
    const createBookAccountRequest: CreateBookAccountRequest = req.body;
    const output = await addBookAccount(createBookAccountRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function remove(req: Request, res: Response){
    const removeBookAccountRequest: RemoveBookAccountRequest = req.body;
    const output = await removeBookAccount(removeBookAccountRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function get(req: Request, res: Response){
    const getBookAccountRequest: GetBookAccountRequest = req.body;
    const output = await getBookAccount(getBookAccountRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function list(req: Request, res: Response){
    const listBookAccountsRequest: ListBookAccountsRequest = req.body;
    const output = await listBookAccounts(listBookAccountsRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function update(req: Request, res: Response){
    const updateBookAccountRequest: UpdateBookAccountRequest = req.body;
    const output = await updateBookAccount(updateBookAccountRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

export default router;