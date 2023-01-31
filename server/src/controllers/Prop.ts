import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../db/postgresql";
import {AddPropRequest, Prop, ListPropsRequest} from "../../../shared/models/Prop";
import {Odd} from "../../../shared/models/Odd";
const format = require('pg-format');

export async function addProp(newProp: AddPropRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT INTO "Props" ("GameID", "PropID", "Market", "PropName", "PropResult", "PropPoints") VALUES ($1, $2, $3, $4, $5, $6)`;
    return executeSql(query, [newProp.GameID, newProp.PropID, newProp.Market, newProp.PropName,
        newProp.PropResult, newProp.PropPoints]);
}

export async function addProps(newProps: Prop[]) : Promise<ApiResponse<any>>{
    let query = format(`INSERT INTO "Props" ("GameID", "PropID", "Market", "PropName", "PropResult", "PropPoints") VALUES %L`,
        newProps.map(Prop => [Prop.GameID, Prop.PropID, Prop.Market, Prop.PropName, Prop.PropResult, Prop.PropPoints]));
    return executeSql(query, []);
}

export async function getProp(PropID: string) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM "Props" WHERE "PropID" = $1`;
    return executeSqlById(queryString, [PropID]);
}

export function listProps(request: ListPropsRequest) : Promise<ApiResponse<any>>{
    let queryHead;
    if (request.IDsOnly) {
        queryHead = `SELECT "PropID" FROM "Props"`;
    } else {
        queryHead = `SELECT * FROM "Props"`;
    }
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

export async function updatePropResults(propIdsAndResults: any[][]) : Promise<ApiResponse<any>> {
    let query = format(`UPDATE "Props" set "PropResult" = nv.propresult FROM (values %L) as nv (propid, propresult) WHERE "Props"."PropID" = nv.propid`, propIdsAndResults)
    return executeSql(query, []);
}

export async function upsertProps(props: Prop[]) : Promise<ApiResponse<any>> {
    let query = format(`INSERT INTO "Props" ("GameID", "PropID", "Market", "PropName", "PropResult", "PropPoints", "PropActor", "OverUnder") VALUES %L`,
        props.map(Prop => [Prop.GameID, Prop.PropID, Prop.Market, Prop.PropName, Prop.PropResult, Prop.PropPoints, Prop.PropActor, Prop.OverUnder]));
    query += `ON CONFLICT ("PropID") DO UPDATE SET "GameID"=EXCLUDED."GameID", "Market"=EXCLUDED."Market",
                                                    "PropName"=EXCLUDED."PropName", "PropPoints"=EXCLUDED."PropPoints",
                                                    "PropActor"=EXCLUDED."PropActor", "OverUnder"=EXCLUDED."OverUnder"`
    return executeSql(query, []);
}

export async function updateProp(PropID: string, updatedProp: Prop) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE "Props" SET GameID = $1, PropID = $2, Market = $3, PropName = $4, PropResult = $5, PropPoints = $6 WHERE PropID = $7`;
    return executeSqlById(queryString, [updatedProp.GameID, updatedProp.PropID, updatedProp.Market,
        updatedProp.PropName, updatedProp.PropResult, updatedProp.PropPoints, PropID]);
}

export async function removeProp(PropID: string) : Promise<ApiResponse<any>>{
    let query = `DELETE FROM "Props" WHERE "PropID" = $1`;
    return executeSqlById(query, [PropID]);
}

export async function removeAllProps(): Promise<ApiResponse<any>>{
    let query = `DELETE FROM "Props"`;
    return executeSql(query, []);
}
