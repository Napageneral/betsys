import express, {Request, Response} from 'express';
import {
    AddBookAccountRequest, AddBookAccountResponse,
    GetBookAccountRequest, GetBookAccountResponse,
    ListBookAccountsRequest, ListBookAccountsResponse,
    RemoveBookAccountRequest, RemoveBookAccountResponse, UpdateBookAccountRequest, UpdateBookAccountResponse
} from "../../../shared/models/BookAccount";
import {addBookAccount, getBookAccount, listBookAccounts, removeBookAccount, updateBookAccount} from "../controllers/BookAccount";
import {sendExpressResponseFromApiResponses} from "../util/ResponseUtility";


const router = express.Router();

router.post("/Add", add);
router.post( "/Remove", remove);
router.post("/Get", get);
router.post( "/List", list);
router.post( "/Update", update);


async function add(req: Request, res: Response){
    const createBookAccountRequest: AddBookAccountRequest = req.body;
    const output = await addBookAccount(createBookAccountRequest);
    const response : AddBookAccountResponse = {
        BookAccount: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function remove(req: Request, res: Response){
    const removeBookAccountRequest: RemoveBookAccountRequest = req.body;
    const output = await removeBookAccount(removeBookAccountRequest);
    const response : RemoveBookAccountResponse = {
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function get(req: Request, res: Response){
    const getBookAccountRequest: GetBookAccountRequest = req.body;
    const output = await getBookAccount(getBookAccountRequest);
    const response : GetBookAccountResponse = {
        BookAccount: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function list(req: Request, res: Response){
    const listBookAccountsRequest: ListBookAccountsRequest = req.body;
    const output = await listBookAccounts(listBookAccountsRequest);
    const response : ListBookAccountsResponse = {
        BookAccounts: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function update(req: Request, res: Response){
    const updateBookAccountRequest: UpdateBookAccountRequest = req.body;
    const output = await updateBookAccount(updateBookAccountRequest);
    const response : UpdateBookAccountResponse = {
        BookAccount: output.data
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

export default router;