import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {
    AddMutuallyExclusiveGroupRequest,
    MutuallyExclusiveGroup,
    ListMutuallyExclusiveGroupsRequest,
    GetMutuallyExclusiveGroupRequest, buildMegKey
} from "../../../shared/models/MutuallyExclusiveGroup";
import {sliceIntoChunks} from "../util/util";
const format = require('pg-format');

export async function addMutuallyExclusiveGroup(newMutuallyExclusiveGroup: AddMutuallyExclusiveGroupRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "MutuallyExclusiveGroups" ("GameID", "Market", "BetType", "PropActor", "PropPoints") VALUES ($1, $2, $3, $4, $5) RETURNING "MutuallyExclusiveGroupID"`;
    return executeSql(query, [newMutuallyExclusiveGroup.GameID, newMutuallyExclusiveGroup.Market,
        newMutuallyExclusiveGroup.BetType, newMutuallyExclusiveGroup.PropActor, newMutuallyExclusiveGroup.PropPoints]);
}

export async function addAllMegs(Megs: MutuallyExclusiveGroup[]){
    const MegChunks:MutuallyExclusiveGroup[][] = sliceIntoChunks(Megs, 1000)
    for (const MegChunk of MegChunks){
        await addMutuallyExclusiveGroups(MegChunk)
    }
}

export async function addMutuallyExclusiveGroups(newMutuallyExclusiveGroups: MutuallyExclusiveGroup[]) : Promise<ApiResponse<any>>{
    let query = format(`INSERT INTO "MutuallyExclusiveGroups" ("GameID", "Market", "BetType", "PropActor", "PropPoints") VALUES %L`,
        newMutuallyExclusiveGroups.map(MutuallyExclusiveGroup => [MutuallyExclusiveGroup.GameID, MutuallyExclusiveGroup.Market, MutuallyExclusiveGroup.BetType,
            MutuallyExclusiveGroup.PropActor, MutuallyExclusiveGroup.PropPoints]));
    return executeSql(query, []);
}

export async function getNextMegID(){
    const nextMegIdResponse = await getNextID()
    if (nextMegIdResponse.data){
        return nextMegIdResponse.data.rows[0].max
    }
    return 1
}

export async function getNextID(){
    let query = `SELECT MAX("MutuallyExclusiveGroupID") from "MutuallyExclusiveGroups"`;
    return executeSql(query, []);
}

export async function getMutuallyExclusiveGroup(request: GetMutuallyExclusiveGroupRequest) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "MutuallyExclusiveGroups" WHERE "MutuallyExclusiveGroupID" = $1`;
    return executeSqlById(queryString, [request.MutuallyExclusiveGroupID]);
}

export async function getStoredMegs(gameIDs: string[]){
    const storedMegs = await listMutuallyExclusiveGroups({
        GameIDs: gameIDs
    })
    const megMap = new Map<string, MutuallyExclusiveGroup>();
    for (const storedMeg of storedMegs.data.rows as MutuallyExclusiveGroup[]) {
        let megKey: string = buildMegKey(storedMeg.GameID, storedMeg.Market, storedMeg.BetType, storedMeg.PropPoints, storedMeg.PropActor)
        megMap.set(megKey, storedMeg)
    }
    return megMap
}

export function listMutuallyExclusiveGroups(request: ListMutuallyExclusiveGroupsRequest) : Promise<ApiResponse<any>>{
    let queryHead = `SELECT * FROM "MutuallyExclusiveGroups"`;
    let queryConditions: string[] = [];
    let queryParams: any[] = [];

    if (request.GameID) {
        queryConditions.push("GameID");
        queryParams.push(request.GameID);
    }
    if (request.Market) {
        queryConditions.push("Market");
        queryParams.push(request.Market);
    }

    let query = queryHead;
    for (let i = 1; i < queryConditions.length+1; i++) {
        query += " WHERE ";
        query += queryConditions.map(item => `"${item}" = $${i}`).join(" AND ");
    }
    if(request.GameIDs) {
        const gameIds = request.GameIDs.map((i) => `'${i}'`);
        query += ` WHERE "GameID" IN (`;
        query += gameIds.join(",");
        query += " )";
    }

    return executeSql(query, queryParams);
}

// export async function upsertMutuallyExclusiveGroups(MutuallyExclusiveGroups: MutuallyExclusiveGroup[]) : Promise<ApiResponse<any>> {
//     let query = format(`INSERT INTO "MutuallyExclusiveGroups" ("GameID", "MutuallyExclusiveGroupID", "Market", "MutuallyExclusiveGroupName", "MutuallyExclusiveGroupResult", "MutuallyExclusiveGroupPoints", "MutuallyExclusiveGroupActor", "OverUnder") VALUES %L`,
//         MutuallyExclusiveGroups.map(MutuallyExclusiveGroup => [MutuallyExclusiveGroup.GameID, MutuallyExclusiveGroup.MutuallyExclusiveGroupID, MutuallyExclusiveGroup.Market, MutuallyExclusiveGroup.MutuallyExclusiveGroupName, MutuallyExclusiveGroup.MutuallyExclusiveGroupResult, MutuallyExclusiveGroup.MutuallyExclusiveGroupPoints, MutuallyExclusiveGroup.MutuallyExclusiveGroupActor, MutuallyExclusiveGroup.OverUnder]));
//     query += `ON CONFLICT ("MutuallyExclusiveGroupID") DO UPDATE SET "GameID"=EXCLUDED."GameID", "Market"=EXCLUDED."Market",
//                                                     "MutuallyExclusiveGroupName"=EXCLUDED."MutuallyExclusiveGroupName", "MutuallyExclusiveGroupPoints"=EXCLUDED."MutuallyExclusiveGroupPoints"
//                                                     "MutuallyExclusiveGroupActor"=EXCLUDED."MutuallyExclusiveGroupActor", "OverUnder"=EXCLUDED."OverUnder`
//     return executeSql(query, []);
// }

// export async function removeMutuallyExclusiveGroup(MutuallyExclusiveGroupID: string) : Promise<ApiResponse<any>>{
//     let query = `DELETE FROM "MutuallyExclusiveGroups" WHERE "MutuallyExclusiveGroupID" = $1`;
//     return executeSqlById(query, [MutuallyExclusiveGroupID]);
// }

export async function removeAllMutuallyExclusiveGroups(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM "MutuallyExclusiveGroups"`;
    return executeSql(query, []);
}
