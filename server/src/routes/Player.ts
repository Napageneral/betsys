import express, {Request, Response} from 'express';
import {
    AddPlayerRequest, AddPlayerResponse,
    GetPlayerRequest, GetPlayerResponse,
    ListPlayersRequest, ListPlayersResponse,
    RemovePlayerRequest, RemovePlayerResponse, UpdatePlayerRequest, UpdatePlayerResponse
} from "../../../shared/models/Player";
import {addPlayer, getPlayer, listPlayers, removePlayer, updatePlayer} from "../controllers/Player";
import {sendExpressResponseFromApiResponses} from "../util/ResponseUtility";

const router = express.Router();

router.post("/Add", add);
router.post( "/Remove", remove);
router.post("/Get", get);
router.post( "/List", list);
router.post( "/Update", update);

async function add(req: Request, res: Response){
    const createPlayerRequest: AddPlayerRequest = req.body;
    const output = await addPlayer(createPlayerRequest);
    const response : AddPlayerResponse = {
        Player: {
            PlayerID: output.data.rows[0].PlayerID,
            FirstName: createPlayerRequest.FirstName,
            LastName: createPlayerRequest.LastName,
            HomeAddress: createPlayerRequest.HomeAddress,
            SSN: createPlayerRequest.SSN
        }
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function remove(req: Request, res: Response){
    const removePlayerRequest: RemovePlayerRequest = req.body;
    const output = await removePlayer(removePlayerRequest.PlayerID);
    const response : RemovePlayerResponse = {
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function get(req: Request, res: Response){
    const getPlayerRequest: GetPlayerRequest = req.body;
    const output = await getPlayer(getPlayerRequest.PlayerID);
    const response : GetPlayerResponse = {
        Player: output.data[0]
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function list(req: Request, res: Response){
    const listPlayersRequest: ListPlayersRequest = req.body;
    const output = await listPlayers();
    const response : ListPlayersResponse = {
        Players: output.data.rows
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

async function update(req: Request, res: Response){
    const updatePlayerRequest: UpdatePlayerRequest = req.body;
    const output = await updatePlayer(updatePlayerRequest.PlayerID, updatePlayerRequest.Player);

    const response : UpdatePlayerResponse = {
        Player: updatePlayerRequest.Player
    }
    return sendExpressResponseFromApiResponses(res, [output], response);
}

export default router;