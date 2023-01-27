
export class AnalysisBucket {
    AnalysisID: number;
    BucketNumber: number;
    tMinus: number;
    RangeMin: number;
    RangeMax: number;
    TotalCount: number;
    TrueCount: number;
    FalseCount: number;

    constructor(AnalysisID: number,
                BucketNumber: number,
                tMinus: number,
                RangeMin: number,
                RangeMax: number,
                TotalCount: number,
                TrueCount: number,
                FalseCount: number) {
        this.AnalysisID = AnalysisID
        this.BucketNumber = BucketNumber;
        this.tMinus = tMinus;
        this.RangeMin = RangeMin;
        this.RangeMax = RangeMax;
        this.TotalCount = TotalCount;
        this.TrueCount = TrueCount;
        this.FalseCount = FalseCount;
    }

}

export interface AddAnalysisBucketRequest {
    AnalysisID: number;
    BucketNumber: number;
    tMinus: number;
    RangeMin: number;
    RangeMax: number;
}

export interface AddAnalysisBucketResponse {
    AnalysisBucket: AnalysisBucket;
}

export interface RemoveAnalysisBucketRequest {
    AnalysisID: number;
    BucketNumber: number;
    tMinus: number;
}

export interface RemoveAnalysisBucketResponse {
}

export interface GetAnalysisBucketRequest {
    AnalysisID: number;
    BucketNumber: number;
    tMinus: number;
}

export interface GetAnalysisBucketResponse {
    AnalysisBucket: AnalysisBucket;
}

export interface ListAnalysisBucketsRequest {
    AnalysisID?: number;
    BucketNumber?: number;
    tMinus?: number;
}

export interface ListAnalysisBucketsResponse {
    AnalysisBuckets: Array<AnalysisBucket>;
}

export interface UpdateAnalysisBucketRequest {
    AnalysisID: number;
    BucketNumber: number;
    tMinus: number;
    AnalysisBucket: AnalysisBucket;
}

export interface UpdateAnalysisBucketResponse {
    AnalysisBucket: AnalysisBucket;
}