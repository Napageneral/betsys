export class DeploymentRequest {
    DeploymentRequestId: number;
    Author: string;
    CreationTime: Date;
    ReasonForChangeDescription: string;
    TestingDescription: string;
    ExpectedStateDescription: string;
    WorstCaseDescription: string;
    ValidationDescription: string;
    RollbackCriteriaDescription: string;
    DeploymentStrategyName: string;
    Status: string;
    ApplicationName: string;
    EnvironmentName: string;
    ConfigurationProfileName: string;
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
    VersionBundleId: number;
    RequiredApprovals: string;
    ObtainedApprovals: string;
    Regions: string;

    constructor(DeploymentRequestId: number,
                Author: string,
                CreationTime: Date,
                ReasonForChangeDescription: string,
                TestingDescription: string,
                ExpectedStateDescription: string,
                WorstCaseDescription: string,
                ValidationDescription: string,
                RollbackCriteriaDescription: string,
                DeploymentStrategyName: string,
                ApplicationName: string,
                EnvironmentName: string,
                ConfigurationProfileName: string,
                ConfigurationBundleId: number,
                BundleVersionNumber: number,
                VersionBundleId: number,
                RequiredApprovals: string,
                Regions: string) {
        this.DeploymentRequestId = DeploymentRequestId;
        this.Author = Author;
        this.CreationTime = CreationTime;
        this.ReasonForChangeDescription = ReasonForChangeDescription;
        this.TestingDescription = TestingDescription;
        this.ExpectedStateDescription = ExpectedStateDescription;
        this.WorstCaseDescription = WorstCaseDescription;
        this.ValidationDescription = ValidationDescription;
        this.RollbackCriteriaDescription = RollbackCriteriaDescription;
        this.DeploymentRequestId = DeploymentRequestId;
        this.DeploymentStrategyName = DeploymentStrategyName;
        this.Status = "Pending Approval";
        this.ApplicationName = ApplicationName;
        this.EnvironmentName = EnvironmentName;
        this.ConfigurationProfileName = ConfigurationProfileName;
        this.ConfigurationBundleId = ConfigurationBundleId;
        this.BundleVersionNumber = BundleVersionNumber;
        this.VersionBundleId = VersionBundleId;
        this.RequiredApprovals = RequiredApprovals;
        this.ObtainedApprovals = "[]";
        this.Regions = Regions;
    }
}

export interface RegionalDeployment {
    ApplicationId: string;
    AppliedExtensions: [
        {
            ExtensionAssociationId: string;
            ExtensionId: string;
            Parameters: {
                string : string;
            };
            VersionNumber: number
        }
    ];
    CompletedAt: number;
    ConfigurationLocationUri: string;
    ConfigurationName: string;
    ConfigurationProfileId: string;
    ConfigurationVersion: string;
    DeploymentDurationInMinutes: number;
    DeploymentNumber: number;
    DeploymentStrategyId: string;
    Description: string;
    EnvironmentId: string;
    EventLog: Event[];
    FinalBakeTimeInMinutes: number;
    GrowthFactor: number;
    GrowthType: string;
    PercentageComplete: number;
    StartedAt: number;
    State: string;
}

export interface Event{
    ActionInvocations: ActionInvocation[];
    Description: string;
    EventType: string;
    OccurredAt: number;
    TriggeredBy: string;
}

export interface ActionInvocation{
    ActionName: string;
    ErrorCode: string;
    ErrorMessage: string;
    ExtensionIdentifier: string;
    InvocationId: string;
    RoleArn: string;
    Uri: string;
}

export interface CreateDeploymentRequestRequest {
    Author: string;
    ReasonForChangeDescription: string;
    TestingDescription: string;
    ExpectedStateDescription: string;
    WorstCaseDescription: string;
    ValidationDescription: string;
    RollbackCriteriaDescription: string;
    DeploymentStrategyName: string;
    ApplicationName: string;
    EnvironmentName: string;
    ConfigurationBundleId: number;
    BundleVersionNumber: number;
    RequiredApprovals: Array<string>;
    ConfigurationProfileName: string;
    VersionBundleId: number;
    Regions: Array<string>;
}

export interface CreateDeploymentRequestResponse {
    DeploymentRequest: DeploymentRequest;
}

export interface StartDeploymentRequest {
    DeploymentRequestId: number;
    Region: string;
}

export interface StartDeploymentResponse {
    DeploymentRequest: DeploymentRequest;
}

export interface StopDeploymentRequest {
    DeploymentRequestId: number;
    Region: string;
}

export interface StopDeploymentResponse {
    DeploymentRequest: DeploymentRequest;
}

export interface GetDeploymentRequestRequest {
    DeploymentRequestId: number;
}

export interface GetDeploymentRequestResponse {
    DeploymentRequest: DeploymentRequest;
}

export interface GetRegionalDeploymentsRequest {
    DeploymentRequestId: number;
}

export interface GetRegionalDeploymentsResponse {
    RegionalDeployments: Map<string, RegionalDeployment>;
}

export interface ListDeploymentsRequest {
    ApplicationName?: string;
    EnvironmentName?: string;
    ConfigurationProfileName?: string;
    ConfigurationBundleId?: number;
}

export interface ListDeploymentRequestsResponse {
    DeploymentRequests: Array<DeploymentRequest>
}

export interface UpdateDeploymentRequestRequest {
    DeploymentRequest: DeploymentRequest;
    DeploymentRequestId: number;
}

export interface UpdateDeploymentRequestResponse {
    DeploymentRequest: DeploymentRequest;
}




