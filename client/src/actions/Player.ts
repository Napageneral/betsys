import {Status} from "../../../shared/constants";
import {ActionType, Api} from "@client/constants/constants";
import {ActionData} from "@client/actions/ActionData";

import {
    Player, AddPlayerRequest, RemovePlayerRequest, GetPlayerRequest,
    ListPlayersRequest, UpdatePlayerRequest
} from "../../../shared/models/Player";
import {addErrorToast, handleApiPost} from "@client/utilities/utilities";
import {Ref, ref} from "vue";

const PLAYER_PATH = Api.Host + Api.Path.Player;

export function listPlayers(): ActionData<Array<Player>> {
    const listPlayersRequest : ListPlayersRequest = {

    };
    const Players = ref();
    const promise = handleApiPost(PLAYER_PATH + ActionType.List, listPlayersRequest).then((result)=>{
        Players.value = result.data?.Players;
        return result;
    });
    console.log(Players.value)
    return {
        ref: Players,
        promise: promise
    };
}

export function addPlayer(FirstName: string, LastName: string, SSN: string, HomeAddress: string): ActionData<Player> {

    const addPlayerInput : AddPlayerRequest = {
        FirstName: FirstName,
        LastName: LastName,
        SSN: SSN,
        HomeAddress: HomeAddress
    }
    const Player = ref()
    const promise = handleApiPost(PLAYER_PATH + ActionType.Add, addPlayerInput).then((result)=>{
        if(result.error !== undefined) {
            Player.value = result.data?.Player;
        }
        //addErrorToast("", title?: string)
        return result;
    });
    return {
        ref: Player,
        promise: promise
    };
}

export function updatePlayer(sourcePlayerID: number, updatedPlayer: Player): ActionData<Player> {
    const updatePlayerInput : UpdatePlayerRequest = {
        Player: updatedPlayer,
        PlayerID: sourcePlayerID
    }
    const Player = ref()
    const promise = handleApiPost(PLAYER_PATH + ActionType.Update, updatePlayerInput).then((result)=>{
        Player.value = result.data?.Player;
        return result;
    });
    return {
        ref: Player,
        promise: promise
    };
}

export function removePlayer(PlayerID: number): Ref<boolean> {
    const deletePlayerInput : RemovePlayerRequest = {
        PlayerID: PlayerID
    }
    const success = ref(false)
    handleApiPost(PLAYER_PATH + ActionType.Remove, deletePlayerInput).then((result)=>{
        if(result.status == Status.DeleteSuccess) {
            success.value = true;
        }
    });
    /*this.handleToasting(result.error, "List Players");*/
    return success;
}

export function getPlayer(PlayerID: number): Ref<Player> {
    const getPlayerInput : GetPlayerRequest = {
        PlayerID: PlayerID
    }
    const Player = ref()
    handleApiPost(PLAYER_PATH + ActionType.Get, getPlayerInput).then((result)=>{
        Player.value = result.data.Player;
    });
    /*this.handleToasting(result.error, "List Players");*/
    return Player;
}