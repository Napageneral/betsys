
import {onUpdated} from "vue";
import {ToastOptions} from "vuestic-ui";
import axios from "axios";
import {ApiResponse} from "@client/models/api/ApiResponse";
import {Status} from "../../../shared/constants";

function loadDataHelper(runInitially: boolean, runOnUpdate: boolean, store: any, toastInit: (options: string | ToastOptions) => string | null, loadDataFunction: () => Promise<void>) {
    // Set up the function which
    const loadDataWrapper = async function() {
        // Call actions to populate necessary data for this component
        await loadDataFunction();
        // Display and remove all toasts generated from the above actions
        for(const toast of store.getFormattedToasts()) {
            toastInit(toast);
        }
        store.removeAllToasts();
    };

    if(runInitially) {
        // Load data now so the component can render properly
        loadDataWrapper().catch(function (error) {
            console.log("Error loading data or displaying toasts:", error);
        });
    }

    if(runOnUpdate) {
        // Load data when the component needs to render again, in case it was lost (such as refresh)
        onUpdated(loadDataWrapper);
    }

    return loadDataWrapper;
}

export function loadDataOnce(store: any, toastInit: (options: string | ToastOptions) => string | null, loadDataFunction: () => Promise<void>) {
    return loadDataHelper(true, false, store, toastInit, loadDataFunction);
}

export function loadDataOnUpdate(store: any, toastInit: (options: string | ToastOptions) => string | null, loadDataFunction: () => Promise<void>) {
    return loadDataHelper(true, true, store, toastInit, loadDataFunction);
}

export function loadDataOnDemand(store: any, toastInit: (options: string | ToastOptions) => string | null, loadDataFunction: () => Promise<void>) {
    return loadDataHelper(false, false, store, toastInit, loadDataFunction);
}

function getHashHistorySearchParams() {
    const hashHistory = window.location.hash;
    const indexOfSearchParamSentinel = hashHistory.indexOf("?");
    let searchSubstring = "";
    if(indexOfSearchParamSentinel !== -1) {
        searchSubstring = hashHistory.substring(indexOfSearchParamSentinel+1);
    }
    const searchParams = new URLSearchParams(searchSubstring);
    return searchParams;
}

function setHashHistorySearchParams(params: URLSearchParams) {
    // console.log("%csetHashHistorySearchParams", "color: yellow");
    // console.log("%cwith params", "color: yellow", params);
    // for(const param of params) {
    //     console.log("%cparam", "color: yellow", param);
    // }
    const hashHistory = window.location.hash;
    // console.log("%chashHistory", "color: yellow", hashHistory);
    const searchParamsStartIndex = hashHistory.indexOf("?");
    // console.log("%csearchParamsStartIndex", "color: yellow", searchParamsStartIndex);
    if(searchParamsStartIndex === -1) {
        // console.log("%csearchParamsStartIndex does not have params", "color: yellow");
        window.location.hash = window.location.hash + "?" + params.toString();
        // console.log("%cnew hash", "color: yellow", window.location.hash);
    } else {
        // console.log("%csearchParamsStartIndex has params at index", "color: yellow", searchParamsStartIndex);
        window.location.hash = window.location.hash.substring(0, hashHistory.indexOf("?")) + "?" + params.toString();
        // console.log("%cnew hash", "color: yellow", window.location.hash);
    }
}

export function getSearchParam(name: string): string | undefined {
    const searchParams = getHashHistorySearchParams();
    return searchParams.get(name) ?? undefined;
}

export function setSearchParam(name: string, value: string): void {
    // console.log("%csetSearchParam", "color: yellow", "name", name, "value", value);
    const searchParams = getHashHistorySearchParams();
    // console.log("%csearchParams", "color: yellow", searchParams);
    searchParams.set(name, value);
    // console.log("%cmodified searchParams", "color: yellow", searchParams);
    setHashHistorySearchParams(searchParams);
}

// https://stackoverflow.com/questions/44060804/convert-epoch-time-to-human-readable-with-specific-timezone
export function convertEpochToSpecificTimezone(timeEpoch: number, offset: number){
    let d = new Date(timeEpoch);
    let utc = d.getTime() + (d.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
    let nd = new Date(utc + (3600000*offset));
    return nd.toLocaleString();
}

function getSimpleRequestNameFromUrl(url: string): string {
    const skipLen = "https://".length;
    const index = url.indexOf("/", skipLen);
    return url.substring(index);
}

export function handleApiPost(url: string, data: any): Promise<ApiResponse> {
    return axios.post(url, data, {
        // validateStatus: function(status) {
        //     return status === 200;
        // }
    }).then(
        function(response) {
            console.log(response)
            return response.data;
        }
    ).catch(
        function (error) {
            let errorStringList = [];
            let errorToast = "";
            if (error.response) {
                // The request was made and the server responded with an invalid status code as defined in the options

                if(error.response.status === 0) {
                    errorStringList.push("Error " + error.response.status + ": could not reach server");
                    addErrorToast(  errorStringList[0], getSimpleRequestNameFromUrl(url));
                } else {
                    errorStringList.push("Error " + error.response.status + ": Request was made, but response status code indicates the operation was unsuccessful");
                    errorStringList.push("headers: " + error.response.headers);
                    errorStringList.push("data: " + error.response.data);
                    addErrorToast(  errorStringList[0], getSimpleRequestNameFromUrl(url));
                }
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                errorStringList.push("Error: Request was made, but no response was received");
                errorStringList.push("request: " + error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                errorStringList.push("Error: Request was invalid");
                errorStringList.push(" (message: " + error.message);
            }

            errorStringList.push("config: " + JSON.stringify(error.config, null, '\t'));

            let errorString = "";
            errorStringList.forEach(function(str, index) {
                errorString += str;
                if(index != errorStringList.length - 1) {
                    errorString += ", ";
                }
            });

            console.log("Error string:", errorString);
            console.log("Error JSON:", error.toJSON());

            return {
                status: Status.Failure,
                error: [
                    errorString
                ]
            };
        });
}

export function formatDateTime(event: Date) {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'America/Los_Angeles',
        timeZoneName: 'short'
    };
    //@ts-ignore
    const formattedDateTimeString = event.toLocaleDateString(undefined, options);
    return formattedDateTimeString;
}

export function compareDateTimes(first: Date, second: Date) {
    return Math.sign(first.getTime() - second.getTime());
}

let toast: any;
export function setUpGlobalToasts(toastValue: any) {
    toast = toastValue;
    // console.log(toast);
}
export function addMessageToast(value: string, title?: string) {
    addToast(value, false, title);
}
export function addErrorToast(value: string, title?: string) {
    addToast(value, true, title);
}
export function addToast(value: string, error: boolean, title?: string) {
    const color = error? "#fa3a6c" : "#4f98ff";

    toast.init({
        title: title,
        message: value,
        color: color,
        customClass: "toast-style",
        duration: 10000
    });
}

export function convertPathToDotNotation(value: string) {
    if(value.startsWith("#")) {
        value = value.substring(1);
    }
    if(value.startsWith("/")) {
        value = value.substring(1);
    }
    //@ts-ignore
    return value.replaceAll("/", ".");
}