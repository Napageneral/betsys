
export class Analysis {
    AnalysisID: string;
    Name: string;
    BucketCount: number;
    Sportsbook: string;
    Sport: string;

    constructor(AnalysisID: string,
                Name: string,
                BucketCount: number,
                Sportsbook: string,
                Sport: string) {
        this.AnalysisID = AnalysisID
        this.Name = Name;
        this.BucketCount = BucketCount;
        this.Sportsbook = Sportsbook;
        this.Sport = Sport;
    }

}

export interface AddAnalysisRequest {
    Name: string;
    BucketCount: number;
    Sportsbook: string;
    Sport: string;
}

export interface AddAnalysisResponse {
    Analysis: Analysis;
}

export interface RemoveAnalysisRequest {
    AnalysisID: number
}

export interface RemoveAnalysisResponse {
}

export interface GetAnalysisRequest {
    AnalysisID: number;
}

export interface GetAnalysisResponse {
    Analysis: Analysis;
}

export interface ListAnalysesRequest {
    Sportsbook?: string;
    Sport?: string;
}

export interface ListAnalysesResponse {
    Analyses: Array<Analysis>;
}

export interface UpdateAnalysisRequest {
    AnalysisID: string;
    Analysis: Analysis;
}

export interface UpdateAnalysisResponse {
    Analysis: Analysis;
}