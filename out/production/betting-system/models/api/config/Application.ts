export class Application {
    ApplicationName: string;
    Description: string;

    constructor(ApplicationName: string,
                Description: string) {
        this.ApplicationName = ApplicationName;
        this.Description = Description;
    }
}
export interface CreateApplicationRequest {
    Regions?: Array<string>;
    Description: string;
    ApplicationName: string;
}

export interface CreateApplicationResponse {
    Application: Application;
}

export interface DeleteApplicationRequest {
    ApplicationName: string;
}

export interface DeleteApplicationResponse {
}

export interface GetApplicationRequest {
    ApplicationName: string;
}

export interface GetApplicationResponse {
    Application: Application;
}

export interface ListApplicationsRequest {
}

export interface ListApplicationsResponse {
    Applications: Array<Application>;
}

export interface UpdateApplicationRequest {
    ApplicationName: string;
    Application: Application;
}

export interface UpdateApplicationResponse {
    Application: Application;
}


