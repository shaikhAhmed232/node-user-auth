import pool from "../config";

export const findUser = async <T>(username:string, authenticating:boolean=false):Promise<T | null> => {
    const sql = !authenticating ?
    "SELECT username, first_name, last_name FROM users WHERE username = $1" :
    "SELECT username, password, first_name, last_name FROM users WHERE username = $1" 
    const result = await pool.query(sql, [username])
    if (!result.rows.length) {
        return null;
    }
    return result.rows[0];
}