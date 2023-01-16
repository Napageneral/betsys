import {Status} from "@client/constants/shared";
import {ApiResponse} from "@client/models/api/ApiResponse";

export class ActionResponse<T> {
    status: number;
    message?: string;
    data?: T;

    constructor(status: number, message?: string, data?: T) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

export function generateActionResponse<T>(actionName: string, apiResponse: ApiResponse, data?: T): ActionResponse<T> {
    if(apiResponse.status === Status.Success) {
        return new ActionResponse(apiResponse.status, `${actionName} succeeded!`, data);
    } else {
        return new ActionResponse(apiResponse.status, `${actionName} failed: ${apiResponse.error}`);
    }
}