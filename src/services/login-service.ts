import db from "../util/pg-connection";
import User from "../models/User";
import Role from "../models/Role";
import { logQuery } from "../util/utils";

export async function logIn(username: string): Promise<User> {
    let query = `SELECT ${User.getColumns()} FROM users WHERE username = $1`;
    logQuery(query, username);

    const result = await db.query(query, [username]);
    return result.rows[0];
}

export async function getRole(id): Promise<Role> {
    console.log(`Retrieving user role...`);
    let query = `SELECT ${Role.getColumns()} FROM roles WHERE id = $1`;
    logQuery(query, id);

    const result = await db.query(query, [id]);
    return result.rows[0];
}