import {Status} from "../../../shared/constants";
import {ActionType, Api} from "@client/constants/constants";
import {ActionData} from "@client/actions/ActionData";

import {
    BookAccount, AddBookAccountRequest, RemoveBookAccountRequest, GetBookAccountRequest,
    ListBookAccountsRequest, UpdateBookAccountRequest
} from "../../../shared/models/BookAccount";
import {handleApiPost} from "@client/utilities/utilities";
import {Ref, ref} from "vue";
import {LoginInfo} from "@shared/models/LoginInfo";

const BOOKACCOUNT_PATH = Api.Host + Api.Path.BookAccount;

export function listBookAccounts(PlayerID?: number, BookName?: string): ActionData<Array<BookAccount>> {
    const listBookAccountsRequest : ListBookAccountsRequest = {
        PlayerID: PlayerID,
        BookName: BookName
    };
    const BookAccounts = ref();
    const promise = handleApiPost(BOOKACCOUNT_PATH + ActionType.List, listBookAccountsRequest).then((result)=>{
        BookAccounts.value = result.data?.BookAccounts;
        return result;
    });
    console.log("actions",BookAccounts.value)
    return {
        ref: BookAccounts,
        promise: promise
    };
}

export function addBookAccount(playerID: number, bookName: string, username: string, email: string, password: string): ActionData<BookAccount> {

    const addBookAccountInput : AddBookAccountRequest = {
        PlayerID: playerID,
        BookName: bookName,
        Username: username,
        Email: email,
        Password: password
    }
    const BookAccount = ref()
    const promise = handleApiPost(BOOKACCOUNT_PATH + ActionType.Add, addBookAccountInput).then((result)=>{
        if(result.error !== undefined) {
            BookAccount.value = result.data?.BookAccount;
        }
        return result;
    });
    return {
        ref: BookAccount,
        promise: promise
    };
}

export function updateBookAccount(playerID: number, bookName: string, updatedBookAccount: BookAccount): ActionData<BookAccount> {
    const updateBookAccountInput : UpdateBookAccountRequest = {
        PlayerID: playerID,
        BookName: bookName,
        BookAccount: updatedBookAccount
    }
    const BookAccount = ref()
    const promise = handleApiPost(BOOKACCOUNT_PATH + ActionType.Update, updateBookAccountInput).then((result)=>{
        BookAccount.value = result.data?.BookAccount;
        return result;
    });
    return {
        ref: BookAccount,
        promise: promise
    };
}

export function removeBookAccount(playerID: number, bookName: string): Ref<boolean> {
    const deleteBookAccountInput : RemoveBookAccountRequest = {
        PlayerID: playerID,
        BookName: bookName
    }
    const success = ref(false)
    handleApiPost(BOOKACCOUNT_PATH + ActionType.Remove, deleteBookAccountInput).then((result)=>{
        if(result.status == Status.DeleteSuccess) {
            success.value = true;
        }
    });
    return success;
}

export function getBookAccount(playerID: number, bookName: string): Ref<BookAccount> {
    const getBookAccountInput : GetBookAccountRequest = {
        PlayerID: playerID,
        BookName: bookName
    }
    const BookAccount = ref()
    handleApiPost(BOOKACCOUNT_PATH + ActionType.Get, getBookAccountInput).then((result)=>{
        BookAccount.value = result.data.BookAccount;
    });
    return BookAccount;
}