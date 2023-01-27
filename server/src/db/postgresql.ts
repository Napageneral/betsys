import {ApiResponse} from "../util/ResponseUtility";
import {Status} from "../../../shared/constants";
const { Pool } = require('pg')
import mysql from "mysql2";

export function sqlEscape(value: any) {
    if(typeof value === 'number') {
        return value;
    }
    return mysql.escape(value);
}

export async function executeSql(queryString: string, queryParams: Array<Object>): Promise<ApiResponse<any>> {
    return new Promise<ApiResponse<any>>(function(resolve, reject){
        pool.query(queryString, queryParams, function (err:any, res:any) {
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
        pool.query(queryString, queryParams, function (err:any, res:any) {
            if (err) {
                console.log("error: ", err);
                resolve(new ApiResponse(400, res, err));
            }

            if (res.rows.length > 0 || res.rowCount > 0) {
                resolve(new ApiResponse(200, res.rows, err));
            } else {
                // not found with the id
                // console.log("item not found");
                // console.log("error: ", err);
                resolve(new ApiResponse(404, res, err));
            }
        });
    })
}

// export const pool = new Pool({
//     user: 'tylerbrandt',
//     host: 'localhost',
//     database: 'betsys',
//     password: 'Ollyollyoxenfree!1',
//     port: 5432,
// });

export const pool = new Pool({
    user: 'betsys_admin',
    host: 'betsys-instance-1.cpwwwrivdbt4.us-east-1.rds.amazonaws.com',
    database: 'betsys',
    password: 'Ollyollyoxenfree!1',
    port: 5432,
});


