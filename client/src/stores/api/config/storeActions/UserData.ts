import axios from "axios";
import {Api} from "@client/constants/constants";
const USER_DATA_PATH = Api.Host + "/api/user";

export async function fetchUserData(this: any) {
    //Make API Call
    const result = await getUserDataCall(USER_DATA_PATH);
    //Unpack API Response into Store Data Model, patch into store
    this.userData = result.user;
}

async function getUserDataCall(url:string) {
    return (await axios.get(url)).data;
} 