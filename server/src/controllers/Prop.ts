import {ApiResponse} from "../util/ResponseUtility";
import {executeSql, executeSqlById} from "../MySQLConnection";
import {AddPropRequest, Prop, ListPropsRequest} from "../../../shared/models/Prop";

export async function addProp(newProp: AddPropRequest) : Promise<ApiResponse<any>>{
    let query = `INSERT IGNORE INTO Props (GameID, PropID, Market, PropName, PropResult, PropPoints) VALUES (?, ?, ?, ?, ?, ?)`;
    return executeSql(query, [newProp.GameID, newProp.PropID, newProp.Market, newProp.PropName,
        newProp.PropResult, newProp.PropPoints]);
}

export async function addProps(newProps: Prop[]) : Promise<ApiResponse<any>>{
    let query = `INSERT IGNORE INTO Props (GameID, PropID, Market, PropName, PropResult, PropPoints) VALUES ?`;
    return executeSql(query, [newProps.map(prop => [prop.GameID, prop.PropID, prop.Market, prop.PropName, prop.PropResult, prop.PropPoints])]);
}

export async function getProp(PropID: string) : Promise<ApiResponse<any>> {
    const queryString: string = `SELECT * FROM Props WHERE PropID = ?`;
    return executeSqlById(queryString, [PropID]);
}

export function listProps(request: ListPropsRequest) : Promise<ApiResponse<any>>{
    let queryHead;
    if (request.IDsOnly) {
        queryHead = "SELECT PropID FROM Props";
    } else {
        queryHead = "SELECT * FROM Props";
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

    if(queryConditions.length > 0) {
        query += " WHERE ";
        query += queryConditions.map(item => `${item} = ?`).join(" AND ");
    }
    if(request.GameIDs) {
        query += " WHERE GameID IN (";
        query += request.GameIDs.join(",");
        query += " )";
    }

    return executeSql(query, queryParams);
}

export async function updateProp(PropID: string, updatedProp: Prop) : Promise<ApiResponse<any>> {
    const queryString: string = `UPDATE Props SET GameID = ?, PropID = ?, Market = ?, PropName = ?, PropResult = ?, PropPoints = ? WHERE PropID = ?`;
    return executeSqlById(queryString, [updatedProp.GameID, updatedProp.PropID, updatedProp.Market,
        updatedProp.PropName, updatedProp.PropResult, updatedProp.PropPoints, PropID]);
}

export async function removeProp(PropID: string) : Promise<ApiResponse<any>>{
    let query = "DELETE FROM Props WHERE PropID = ?";
    return executeSqlById(query, [PropID]);
}

export async function removeAllProps(): Promise<ApiResponse<any>>{
    let query = "DELETE FROM Props";
    return executeSql(query, []);
}
