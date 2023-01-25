import {ApiResponse} from "./util/ResponseUtility";
import {Status} from "../../shared/constants";

import mysql from "mysql2";

export function sqlEscape(value: any) {
    if(typeof value === 'number') {
        return value;
    }
    return mysql.escape(value);
}

export async function executeSql(queryString: string, queryParams: Array<Object>): Promise<ApiResponse<any>> {
    return new Promise<ApiResponse<any>>(function(resolve, reject){
        sql.query(queryString, queryParams, function (err:any, res:any) {
            if (err) {
                console.log(err);
                resolve(new ApiResponse(Status.Error, res, err));
            }
            resolve(new ApiResponse(Status.Success, res, err));
        });
    })
}

export async function executeSqlById(queryString: string, queryParams: Array<Object>): Promise<ApiResponse<any>> {
    return new Promise<ApiResponse<any>>(function(resolve, reject){
        sql.query(queryString, queryParams, function (err:any, res:any) {
            if (err) {
                console.log("error: ", err);
                resolve(new ApiResponse(400, res, err));
            }

            if (res.length > 0 || res.affectedRows > 0) {
                resolve(new ApiResponse(200, res, err));
            } else {
                // not found with the id
                // console.log("item not found");
                // console.log("error: ", err);
                resolve(new ApiResponse(404, res, err));
            }
        });
    })
}


export const sql: mysql.Connection = mysql.createConnection({
    host: "swackhammer.cluster-cpwwwrivdbt4.us-east-1.rds.amazonaws.com",
    port: 3306,
    user: "betsys_admin",
    password: "Ollyollyoxenfree!1",
    database: "betting"
});

// export const sql: mysql.Connection = mysql.createConnection({
//     host: "localhost",
//     port: 3306,
//     user: "root",
//     password: "password",
//     database: "betting"
// });