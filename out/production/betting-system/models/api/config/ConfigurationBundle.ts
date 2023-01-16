export class ConfigurationBundle {

    ConfigurationBundleId: number;
    ApplicationName: string;
    ConfigurationProfileName: string;
    Description: string;
    Type: string;
    LocationUri: string;
    RetrievalRoleArn: string;
    Validators: Array<Validator>;
    Regions: string;

    constructor(ConfigurationBundleId: number,
                ApplicationName: string,
                ConfigurationProfileName: string,
                Type: string,
                Regions: string,
                Description: string,
                LocationUri: string,
                RetrievalRoleArn: string,
                Validators: Array<Validator>) {
        this.ConfigurationBundleId = ConfigurationBundleId;
        this.ApplicationName = ApplicationName;
        this.ConfigurationProfileName = ConfigurationProfileName;
        this.Type = Type;
        this.Regions = Regions;
        this.Description = Description;
        this.LocationUri = LocationUri;
        this.RetrievalRoleArn = RetrievalRoleArn;
        this.Validators = Validators;
    }
}

export interface Validator {
    Content: string;
    Type: string;
}

export interface CreateConfigurationBundleRequest {
    ApplicationName: string;
    ConfigurationProfileName: string;
    Description: string;
    LocationUri: string;
    RetrievalRoleArn?: string;
    Type: string;
    Validators?: Array<Validator>;
    Regions?: Array<string>;
}

export interface CreateConfigurationBundleResponse {
    ConfigurationBundle: ConfigurationBundle;
}

export interface DeleteConfigurationBundleRequest {
    ConfigurationBundleId: number;
}

export interface DeleteConfigurationBundleResponse {
}

export interface GetConfigurationBundleRequest {
    ConfigurationBundleId: number;
}

export interface GetConfigurationBundleResponse {
    ConfigurationBundle: ConfigurationBundle;
}

export interface ListConfigurationBundlesRequest {
    ApplicationName?: string;
    ConfigurationProfileName?: string;
}

export interface ListConfigurationBundlesResponse {
    ConfigurationBundles: Array<ConfigurationBundle>;
}

export interface UpdateConfigurationBundleRequest {
    ConfigurationBundle: ConfigurationBundle;
    ConfigurationBundleId: number;
}

export interface UpdateConfigurationBundleResponse {
    ConfigurationBundle: ConfigurationBundle;
}


