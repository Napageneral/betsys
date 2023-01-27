import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {
    AddAnalysisBucketRequest,
    GetAnalysisBucketRequest,
    UpdateAnalysisBucketRequest, RemoveAnalysisBucketRequest, ListAnalysisBucketsRequest, AnalysisBucket
} from "../../../shared/models/AnalysisBucket";


export async function addAnalysisBuckets(newAnalysisBuckets: AnalysisBucket[]) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO AnalysisBuckets (AnalysisID, BucketNumber, tMinus, RangeMin, RangeMax, TotalCount, TrueCount, FalseCount) VALUES ?`;
    return executeSql(query, [newAnalysisBuckets.map(AnalysisBucket => [AnalysisBucket.AnalysisID,
                                                                                    AnalysisBucket.BucketNumber,
                                                                                    AnalysisBucket.tMinus,
                                                                                    AnalysisBucket.RangeMin,
                                                                                    AnalysisBucket.RangeMax,
                                                                                    AnalysisBucket.TotalCount,
                                                                                    AnalysisBucket.TrueCount,
                                                                                    AnalysisBucket.FalseCount])]);
}

export async function addAnalysisBucket(newAnalysisBucket: AddAnalysisBucketRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO AnalysisBuckets (AnalysisID, BucketNumber, tMinus, RangeMin, RangeMax, TotalCount, TrueCount, FalseCount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    return executeSql(query, [newAnalysisBucket.AnalysisID,
                                            newAnalysisBucket.BucketNumber,
                                            newAnalysisBucket.tMinus,
                                            newAnalysisBucket.RangeMin,
                                            newAnalysisBucket.RangeMax,
                                            0,
                                            0,
                                            0]);
}

export async function getAnalysisBucket(AnalysisBucket: GetAnalysisBucketRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM AnalysisBuckets WHERE AnalysisID = ? AND BucketNumber = ? AND tMinus = ?`;
    return executeSqlById(queryString, [AnalysisBucket.AnalysisID, AnalysisBucket.BucketNumber, AnalysisBucket.tMinus]);
}

export function listAnalysisBuckets(listAnalysisBucketRequest: ListAnalysisBucketsRequest) : Promise<ApiResponse<any>>{
    let queryHead = "SELECT * FROM AnalysisBuckets";
    let queryConditions: string[] = [];
    let queryParams: any[] = [];

    if (listAnalysisBucketRequest.AnalysisID) {
        queryConditions.push("AnalysisID");
        queryParams.push(listAnalysisBucketRequest.AnalysisID);
    }
    if (listAnalysisBucketRequest.BucketNumber) {
        queryConditions.push("BucketNumber");
        queryParams.push(listAnalysisBucketRequest.BucketNumber);
    }
    if (listAnalysisBucketRequest.tMinus) {
        queryConditions.push("tMinus");
        queryParams.push(listAnalysisBucketRequest.tMinus);
    }

    let query = queryHead;
    if(queryConditions.length > 0) {
        query += " WHERE ";
        query += queryConditions.map(item => `${item} = ?`).join(" AND ");
    }

    return executeSql(query, queryParams);
}

export async function updateAnalysisBucket(updateAnalysisBucketRequest: UpdateAnalysisBucketRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE AnalysisBuckets SET TotalCount = ?, TrueCount = ?, FalseCount = ? WHERE AnalysisID = ? AND BucketNumber = ? AND tMinus = ?`;
    return executeSqlById(queryString, [updateAnalysisBucketRequest.AnalysisBucket.TotalCount,
                                                    updateAnalysisBucketRequest.AnalysisBucket.TrueCount,
                                                    updateAnalysisBucketRequest.AnalysisBucket.FalseCount,
                                                    updateAnalysisBucketRequest.AnalysisID,
                                                    updateAnalysisBucketRequest.BucketNumber,
                                                    updateAnalysisBucketRequest.tMinus]);
}

export async function removeAnalysisBucket(removeAnalysisBucketRequest: RemoveAnalysisBucketRequest) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM AnalysisBuckets WHERE AnalysisID = ? AND BucketNumber = ? AND tMinus = ?";
    return executeSqlById(query, [removeAnalysisBucketRequest.AnalysisID,
                                                removeAnalysisBucketRequest.BucketNumber,
                                                removeAnalysisBucketRequest.tMinus]);
}

export async function removeAllAnalysisBuckets(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM AnalysisBuckets";
    return executeSql(query, []);
}
