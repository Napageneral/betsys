export class ActiveConfigVersion {
    ApplicationName: string;
    EnvironmentName: string;
    ConfigurationProfileName: string;
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
    Region: string;
    ActivationTime: Date;
    DeploymentRequestId: number;
    State: string;

    
    constructor(ApplicationName: string,
                EnvironmentName: string,
                ConfigurationProfileName: string,
                ConfigurationBundleId: number,
                BundleVersionNumber: number,
                Region: string,
                DeploymentRequestId: number,
                State: string) {
        this.ApplicationName = ApplicationName;
        this.EnvironmentName = EnvironmentName;
        this.ConfigurationProfileName = ConfigurationProfileName;
        this.ConfigurationBundleId = ConfigurationBundleId;
        this.BundleVersionNumber = BundleVersionNumber;
        this.Region = Region;
        this.ActivationTime = new Date();
        this.DeploymentRequestId = DeploymentRequestId;
        this.State = State;
    }

}
export interface CreateActiveConfigVersionRequest {
    ApplicationName: string;
    EnvironmentName: string;
    ConfigurationProfileName: string;
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
    Region: string;
    DeploymentRequestId: number;
}

export interface CreateActiveConfigVersionResponse {
    ActiveConfigVersion: ActiveConfigVersion;
}

export interface DeleteActiveConfigVersionRequest {
    ActiveConfigVersion: ActiveConfigVersion;
}

export interface DeleteActiveConfigVersionResponse {
}

export interface GetActiveConfigVersionRequest {
    DeploymentRequestId: number;
}

export interface GetActiveConfigVersionResponse {
    ActiveConfigVersion: ActiveConfigVersion
}

export interface GetActiveConfigVersionsRequest {
    ApplicationName: string;
    EnvironmentName: string;
    ConfigurationProfileName: string;
    ConfigurationBundleId: number;
}

export interface GetActiveConfigVersionsResponse {
    ActiveConfigVersions: Array<ActiveConfigVersion>
}

export interface ListActiveConfigVersionsRequest {
    ApplicationName: string;
    EnvironmentName: string;
    ConfigurationProfileName?: string;
    ConfigurationBundleId?: number;
    BundleVersionNumber?: number;
    Region?: string;
    DeploymentRequestId?: number;
}

export interface ListActiveConfigVersionsResponse {
    ActiveConfigVersions: Array<ActiveConfigVersion>
}




