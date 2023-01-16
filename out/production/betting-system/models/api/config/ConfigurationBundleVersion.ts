import {ConfigurationSchema} from "./ConfigurationSchema";

export class ConfigurationBundleVersion {
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
    ConfigurationProfileName: string;
    SchemaId: number;
    Content: string;
    Author: string;
    CreationTime: Date;
    CommitMessage: string;
    VersionBundleId: number;
    ConfigurationSchema?: ConfigurationSchema;


    constructor(ConfigurationBundleId: number,
                BundleVersionNumber: number,
                ConfigurationProfileName: string,
                SchemaId: number,
                Content: string,
                Author: string,
                CreationTime: Date,
                CommitMessage: string,
                VersionBundleId: number) {
        this.ConfigurationBundleId = ConfigurationBundleId;
        this.ConfigurationProfileName = ConfigurationProfileName;
        this.BundleVersionNumber = BundleVersionNumber;
        this.SchemaId = SchemaId;
        this.Content = Content;
        this.Author = Author;
        this.CreationTime = CreationTime;
        this.CommitMessage = CommitMessage;
        this.VersionBundleId = VersionBundleId;
    }

}
export interface CreateConfigurationBundleVersionRequest {
    ApplicationName: string
    ConfigurationBundleId: number
    SchemaId?: number
    Content: string
    Author: string
    CommitMessage: string
    ConfigurationProfileName: string
    ContentType: string
}

export interface CreateConfigurationBundleVersionResponse {
    ConfigurationBundleVersion: ConfigurationBundleVersion;
}

export interface DeleteConfigurationBundleVersionRequest {
    ApplicationName: string;
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
}

export interface DeleteConfigurationBundleVersionResponse {
}

export interface GetConfigurationBundleVersionRequest {
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
}

export interface GetConfigurationBundleVersionResponse {
    ConfigurationBundleVersion: ConfigurationBundleVersion;
}

export interface ListConfigurationBundleVersionsRequest {
    ConfigurationBundleId: number;
}

export interface ListConfigurationBundleVersionsResponse {
    ConfigurationBundleVersions: Array<ConfigurationBundleVersion>
}




