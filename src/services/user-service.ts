import User from "../models/User";
import db from "../util/pg-connection";
import { logQuery } from "../util/utils";

const bcrypt = require('bcrypt');
const saltRounds: number = 12;

// TODO: implement
// For now the users are pre-existing, one for each unique role
export async function createUser(user: User): Promise<User> { return user; }

// Get all users
export async function getAllUsers(): Promise<User[]> {
    let query = `SELECT ${User.getColumns()} FROM users ORDER BY id`;
    logQuery(query);

    const result = await db.query(query);
    return result.rows;
}

// Get user by ID
export async function getUserById(id: number): Promise<User> {
    let query = `SELECT ${User.getColumns()} FROM users WHERE id = $1`;
    logQuery(query, id);

    const result = await db.query(query, [id]);
    return result.rows[0];
}

// Update user
export async function updateUser(user: User): Promise<User> {
    let id: number = user.id;
    delete user.id;

    // Gather all properties and values 
    // into a SQL query. Fun
    const values: any[] = [];
    let columns: string = '';
    let count: number = 1;
    for (let a in user) {
        if (user[a] === undefined || user[a] === null) continue;
        switch (a) {
            case 'firstName':
                columns += `first_name = $${count++}, `;
                break;
            case 'lastName':
                columns += `last_name = $${count++}, `;
                break;
            case 'password':
                columns += `${a} = $${count++}, `;
                user[a] = await bcrypt.hash(user[a], saltRounds);
                break;
            default:
                columns += `${a} = $${count++}, `;
        }
        values.push(user[a]);
    }
    columns = columns.slice(0, -2);
    values.push(id);

    let query = `UPDATE users SET ${columns} WHERE id = $${count} RETURNING ${User.getColumns()}`;
    logQuery(query, values);

    const result = await db.query(query, values);
    return result.rows[0];
}


