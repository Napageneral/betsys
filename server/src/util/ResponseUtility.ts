import {Request, Response} from "express";
import {Status} from "../../../shared/constants";


export function sendExpressResponse<T>(expressResponse: Response, status: number, data: T | undefined, error: any | undefined) : Response {

    return expressResponse.status(status).json({
        status: status,
        data: data,
        error: error
    });
}

export function sendExpressResponseFromApiResponses<T>(res: Response, apiResponses : Array<ApiResponse<any>>, returnData: T) : Response {
    if (apiResponses){
        let responseData = []
        let responseStatuses = []
        let responseErrors = []
        let hasErrors = false;
        let notFound = false;
        for(let i = 0; i < apiResponses.length; i++){
            const apiResponse : ApiResponse<any> = apiResponses[i];
            responseData.push(apiResponse?.data);
            responseStatuses.push(apiResponse?.status);

            if (apiResponse?.error /*&& (Object.keys(apiResponse.error).length > 0 || apiResponse.error.length > 0)*/){
                console.log("error:", apiResponse.error)
                responseErrors.push(apiResponse.error);
                hasErrors = true;
            }
            if (apiResponse?.status == 404){
                console.log("status:", apiResponse.status)
                responseErrors.push("404 Resource Not Found");
                notFound = true;
            }
        }
        if (hasErrors) {
            console.log(`failure: ${JSON.stringify(responseErrors, null, '\t')}`);
            return sendExpressResponse(res, Status.Failure, responseData, responseErrors);
        }
        if (notFound) {
            return sendExpressResponse(res, Status.NotFound, responseData, responseErrors);
        }
        return sendExpressResponse(res, Status.Success, returnData, undefined);
    }
    return sendExpressResponse(res, Status.Failure, undefined, undefined);
}

type ControllerFunction = (req: Request, res: Response, next: any) => Promise<any>;

export function errorWrapper(controllerFunction: ControllerFunction): ControllerFunction {
    return async function(req: Request, res: Response, next:any) {
        try {
            await controllerFunction(req, res, next);
        }catch(err) {
            next(err);
        }
    }
}

export function postSafely(router: any, path: any, func: ControllerFunction): void {
    router.post(path, errorWrapper(func));
}


export class ApiResponse<T>{
    status: any;
    data: T | undefined;
    error: any;

    constructor(status: any, data: T | undefined, error: any) {
        this.status = status;
        this.data = data;
        this.error = error
    }
}

export function createErrorResponse(message: string): ApiResponse<undefined> {
    return new ApiResponse(Status.Failure, undefined, message);
}
