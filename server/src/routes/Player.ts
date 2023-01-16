import express, {Request, Response} from 'express';
import {
    CreatePlayerRequest,
    GetPlayerRequest,
    ListPlayersRequest,
    RemovePlayerRequest, UpdatePlayerRequest
} from "../../../shared/models/Player";
import {addPlayer, getPlayer, listPlayers, removePlayer, updatePlayer} from "../controllers/Player";
import {sendExpressResponse} from "../util/ResponseUtility";

const router = express.Router();

router.post("/Add", add);
router.post( "/Remove", remove);
router.post("/Get", get);
router.post( "/List", list);
router.post( "/Update", update);

async function add(req: Request, res: Response){
    const createPlayerRequest: CreatePlayerRequest = req.body;
    const output = await addPlayer(createPlayerRequest);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function remove(req: Request, res: Response){
    const removePlayerRequest: RemovePlayerRequest = req.body;
    const output = await removePlayer(removePlayerRequest.PlayerID);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function get(req: Request, res: Response){
    const getPlayerRequest: GetPlayerRequest = req.body;
    const output = await getPlayer(getPlayerRequest.PlayerID);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function list(req: Request, res: Response){
    const listPlayersRequest: ListPlayersRequest = req.body;
    const output = await listPlayers();
    return sendExpressResponse(res, output.status, output.data, output.error);
}

async function update(req: Request, res: Response){
    const updatePlayerRequest: UpdatePlayerRequest = req.body;
    const output = await updatePlayer(updatePlayerRequest.PlayerID, updatePlayerRequest.Player);
    return sendExpressResponse(res, output.status, output.data, output.error);
}

export default router;