export class DeploymentStrategy {
    DeploymentStrategyName: string;
    Description: string;
    GrowthFactor: number;
    GrowthType: string;
    DeploymentDurationInMinutes: number;
    FinalBakeTimeInMinutes: number;
    ReplicateTo: string;

    constructor(DeploymentStrategyName: string,
                Description: string,
                GrowthFactor: number,
                GrowthType: string,
                DeploymentDurationInMinutes: number,
                FinalBakeTimeInMinutes: number,
                ReplicateTo: string) {
        this.DeploymentStrategyName = DeploymentStrategyName;
        this.Description = Description;
        this.GrowthFactor = GrowthFactor;
        this.GrowthType = GrowthType;
        this.DeploymentDurationInMinutes = DeploymentDurationInMinutes;
        this.FinalBakeTimeInMinutes = FinalBakeTimeInMinutes;
        this.ReplicateTo = ReplicateTo;
    }
}

export interface CreateDeploymentStrategyRequest {
    DeploymentStrategyName: string;
    Description: string;
    GrowthFactor: number;
    GrowthType: string;
    DeploymentDurationInMinutes: number;
    FinalBakeTimeInMinutes: number;
    ReplicateTo: string;
    Regions?: Array<string>;
}

export interface CreateDeploymentStrategyResponse {
    DeploymentStrategy: DeploymentStrategy;
}

export interface DeleteDeploymentStrategyRequest {
    DeploymentStrategyName: string;
}

export interface DeleteDeploymentStrategyResponse {
}

export interface GetDeploymentStrategyRequest {
    DeploymentStrategyName: string;
}

export interface GetDeploymentStrategyResponse {
    DeploymentStrategy: DeploymentStrategy;
}

export interface ListDeploymentStrategiesRequest {
}

export interface ListDeploymentStrategiesResponse {
    DeploymentStrategies: Array<DeploymentStrategy>;
}

export interface UpdateDeploymentStrategyRequest {
    DeploymentStrategy: DeploymentStrategy;
    DeploymentStrategyName: string;
}

export interface UpdateDeploymentStrategyResponse {
    DeploymentStrategy: DeploymentStrategy;
}


