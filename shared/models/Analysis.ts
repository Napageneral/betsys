
export class Analysis {
    AnalysisID: string;
    Sport: string;
    League: string;
    StartDate: Date;
    HomeTeam: string;
    AwayTeam: string;
    Status: string;
    Tournament: string;

    constructor(AnalysisID: string,
                Sport: string,
                League: string,
                StartDate: Date,
                HomeTeam: string,
                AwayTeam: string,
                Status: string,
                Tournament: string) {
        this.AnalysisID = AnalysisID
        this.Sport = Sport;
        this.League = League;
        this.StartDate = StartDate;
        this.HomeTeam = HomeTeam;
        this.AwayTeam = AwayTeam;
        this.Status = Status;
        this.Tournament = Tournament;
    }

}

export interface AddAnalysisRequest {
    AnalysisID: string;
    Sport: string;
    League: string;
    StartDate: Date;
    HomeTeam: string;
    AwayTeam: string;
    Status: string;
    Tournament: string;
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

export interface ListAnalysissRequest {
    Sport?: string;
    League?: string;
    Status?: string;
    Tournament?: string;
}

export interface ListAnalysissResponse {
    Analysiss: Array<Analysis>;
}

export interface UpdateAnalysisRequest {
    AnalysisID: string;
    Analysis: Analysis;
}

export interface UpdateAnalysisResponse {
    Analysis: Analysis;
}