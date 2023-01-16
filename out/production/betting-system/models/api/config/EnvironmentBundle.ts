export class EnvironmentBundle {
    ApplicationName: number;
    EnvironmentBundleId: number;
    Monitors: string;
    EnvironmentName: string;
    Description: string;
    State: string;

    constructor(ApplicationName: number,
                EnvironmentBundleId: number,
                Monitors: string,
                EnvironmentName: string,
                Description: string,
                State: string) {
        this.ApplicationName = ApplicationName;
        this.EnvironmentBundleId = EnvironmentBundleId;
        this.Monitors = Monitors;
        this.EnvironmentName = EnvironmentName;
        this.Description = Description;
        this.State = State;
    }
}

export interface Monitor {
    AlarmArn: string;
    AlarmRoleArn: string;
}

export interface CreateEnvironmentBundleRequest {
    ApplicationName: string;
    EnvironmentName: string;
    Description: string;
    Monitors?: Array<Monitor>;
    Regions?: Array<string>;
}


export interface CreateEnvironmentBundleResponse {
    EnvironmentBundle: EnvironmentBundle;
}

export interface DeleteEnvironmentBundleRequest {
    EnvironmentName: string;
    ApplicationName: string;
}

export interface DeleteEnvironmentBundleResponse {
}

export interface GetEnvironmentBundleRequest {
    EnvironmentName: string;
    ApplicationName: string;
}

export interface GetEnvironmentBundleResponse {
    EnvironmentBundle: EnvironmentBundle;
}

export interface ListEnvironmentBundlesRequest {
    ApplicationName: string;
}

export interface ListEnvironmentBundlesResponse {
    Environments: Array<EnvironmentBundle>;
}

export interface UpdateEnvironmentBundleRequest {
    EnvironmentBundle: EnvironmentBundle;
    EnvironmentName: string;
}

export interface UpdateEnvironmentBundleResponse {
    EnvironmentBundle: EnvironmentBundle;
}


