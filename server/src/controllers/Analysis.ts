import {ApiResponse, sendExpressResponseFromApiResponses} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {
    AddAnalysisRequest,
    GetAnalysisRequest,
    UpdateAnalysisRequest, RemoveAnalysisRequest, ListAnalysesRequest, Analysis
} from "../../../shared/models/Analysis";
import {addAnalysisBucket, addAnalysisBuckets} from "./AnalysisBucket";
import {AnalysisBucket} from "../../../shared/models/AnalysisBucket";


export async function createAnalysis(newAnalysis: AddAnalysisRequest) : Promise<ApiResponse<any>>{
    const addAnalysisResponse = await addAnalysis(newAnalysis)
    const analysisID: number = addAnalysisResponse.data.insertId

    const analysisBuckets: AnalysisBucket[] = []
    for (let i = 0; i < newAnalysis.BucketCount; i++) {
        for (let j = 0; j < 720; j++) {

            const rangeMin = i * (100/newAnalysis.BucketCount)
            const rangeMax = ((i+1) * (100/newAnalysis.BucketCount))-0.001
            const ab = new AnalysisBucket(analysisID, i, -j, rangeMin, rangeMax, 0, 0, 0)
            analysisBuckets.push(ab)
        }
    }
    return await addAnalysisBuckets(analysisBuckets)
}

export async function addAnalysis(newAnalysis: AddAnalysisRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO Analyses (Name, BucketCount, Sportsbook, Sport) VALUES (?, ?, ?, ?)`;
    return executeSql(query, [newAnalysis.Name,
                                            newAnalysis.BucketCount,
                                            newAnalysis.Sportsbook,
                                            newAnalysis.Sport]);
}

export async function getAnalysis(Analysis: GetAnalysisRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM Analyses WHERE AnalysisID = ?`;
    return executeSqlById(queryString, [Analysis.AnalysisID]);
}

export function listAnalyses(listAnalysisRequest: ListAnalysesRequest) : Promise<ApiResponse<any>>{
    let queryHead = "SELECT * FROM Analyses";
    let queryConditions: string[] = [];
    let queryParams: any[] = [];

    if (listAnalysisRequest.Sport) {
        queryConditions.push("Sport");
        queryParams.push(listAnalysisRequest.Sport);
    }
    if (listAnalysisRequest.Sportsbook) {
        queryConditions.push("Sportsbook");
        queryParams.push(listAnalysisRequest.Sportsbook);
    }

    let query = queryHead;
    if(queryConditions.length > 0) {
        query += " WHERE ";
        query += queryConditions.map(item => `${item} = ?`).join(" AND ");
    }

    return executeSql(query, queryParams);
}

export async function updateAnalysis(updateAnalysisRequest: UpdateAnalysisRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE Analyses SET Name = ?, BucketCount = ?, Sportsbook = ?, Sport = ? WHERE AnalysisID = ?`;
    return executeSqlById(queryString, [updateAnalysisRequest.Analysis.Name,
                                                    updateAnalysisRequest.Analysis.BucketCount,
                                                    updateAnalysisRequest.Analysis.Sportsbook,
                                                    updateAnalysisRequest.Analysis.Sport,
                                                    updateAnalysisRequest.AnalysisID]);
}

export async function removeAnalysis(removeAnalysisRequest: RemoveAnalysisRequest) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM Analyses WHERE AnalysisID = ?";
    return executeSqlById(query, [removeAnalysisRequest.AnalysisID]);
}

export async function removeAllAnalyses(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM Analyses";
    return executeSql(query, []);
}
