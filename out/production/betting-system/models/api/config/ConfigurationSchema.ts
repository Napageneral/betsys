export class ConfigurationSchema {
    ConfigurationBundleId: number;
    SchemaId: number;
    SchemaVersionNumber: number;
    ConfigurationProfileName: string;
    Content: string;
    Author: string;
    CreationTime: Date;
    CommitMessage: string;
    
    constructor(ConfigurationBundleId: number,
                SchemaId: number,
                SchemaVersionNumber: number,
                ConfigurationProfileName: string,
                Content: string,
                Author: string,
                CreationTime: Date,
                CommitMessage: string) {
        this.ConfigurationBundleId = ConfigurationBundleId;
        this.SchemaId = SchemaId;
        this.SchemaVersionNumber = SchemaVersionNumber;
        this.ConfigurationProfileName = ConfigurationProfileName;
        this.Content = Content;
        this.Author = Author;
        this.CreationTime = CreationTime;
        this.CommitMessage = CommitMessage;
    }

}
export interface CreateConfigurationSchemaRequest {
    ConfigurationBundleId: number;
    ConfigurationProfileName: string;
    Content: string;
    Author: string;
    CommitMessage: string;
}

export interface CreateConfigurationSchemaResponse {
    ConfigurationSchema: ConfigurationSchema;
}

export interface DeleteConfigurationSchemaRequest {
    SchemaId: number;
}

export interface DeleteConfigurationSchemaResponse {
}

export interface GetConfigurationSchemaRequest {
    SchemaId: number;
}

export interface GetConfigurationSchemaResponse {
    ConfigurationSchema: ConfigurationSchema;
}

export interface ListConfigurationSchemasRequest {
    ConfigurationBundleId: number;
}

export interface ListConfigurationSchemasResponse {
    ConfigurationSchemas: Array<ConfigurationSchema>
}




