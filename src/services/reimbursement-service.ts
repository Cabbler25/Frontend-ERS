import Reimbursement from "../models/Reimbursement";
import db from "../util/pg-connection";
import { logQuery } from "../util/utils";

// Get by reimbursement ID
export async function getReimbursementById(id: number): Promise<Reimbursement> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE id = $1`;
    logQuery(query, id);

    const result = await db.query(query, [id]);
    return result.rows[0];
}

// Get by reimbursement status ID
export async function getReimbursementByStatus(id: number): Promise<Reimbursement[]> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE status = $1 ORDER BY date_submitted ASC`;
    logQuery(query, id);

    const result = await db.query(query, [id]);
    return result.rows;
}

// Get by reimbursement user ID
export async function getReimbursementByUser(id: number): Promise<Reimbursement[]> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE author = $1 ORDER BY date_submitted ASC`;
    logQuery(query, id);

    const result = await db.query(query, [id]);
    return result.rows;
}

// Patch reimbursement
export async function updateReimbursement(rmbmnt: Reimbursement): Promise<Reimbursement> {
    let id: number = rmbmnt.id;

    if (rmbmnt.status > 1) {
        rmbmnt.dateResolved = Date.now();
    }

    // Remove properties that should never be updated
    delete rmbmnt.id; delete rmbmnt.dateSubmitted;
    // delete rmbmnt.resolver; not sure if resolver to be set programmatically
    // delete rmbmnt.author; this too

    // Gather all properties and values 
    // into a SQL query. Fun
    const values: any[] = [];
    let columns: string = '';
    let count: number = 1;
    for (let a in rmbmnt) {
        // Exclude undefined/null properties
        if (rmbmnt[a] === undefined || rmbmnt[a] === null) continue;

        if (a == 'dateResolved') {
            columns += `date_resolved = $${count++}, `;
        } else {
            columns += `${a} = $${count++}, `;
        }

        values.push(rmbmnt[a]);
    }
    columns = columns.slice(0, -2);
    values.push(id);

    let query = `UPDATE reimbursements SET ${columns} WHERE id = $${count} RETURNING ${Reimbursement.getColumns()}`;
    logQuery(query, values);

    const result = await db.query(query, values);
    return result.rows[0];
}

// Submit reimbursement
export async function submitReimbursement(rmbmnt: Reimbursement, id: number): Promise<Reimbursement> {
    // Remove properties that are auto-generated
    delete rmbmnt.id;
    delete rmbmnt.dateResolved;
    rmbmnt.author = id;
    rmbmnt.dateSubmitted = Date.now();
    rmbmnt.status = 1;

    // Gather all properties and values 
    // into a SQL query. Fun
    const values: any[] = [];
    let columns: string = '';
    let placeHolders: string = '';
    let count: number = 1;
    for (let a in rmbmnt) {
        if (rmbmnt[a] === undefined || rmbmnt[a] === null) {
            // Handle columns that can be null
            // Only one so far is resolver
            if (a == 'resolver') continue;
            console.log(`Missing field: ${a}`);
            return; // otherwise invalid, lacks required properties
        }
        // Convert var names to db column names
        a == 'dateSubmitted' ? columns += `date_submitted, ` : columns += `${a}, `;

        placeHolders += `$${count++}, `;
        values.push(rmbmnt[a]);
    }
    columns = columns.slice(0, -2);
    placeHolders = placeHolders.slice(0, -2);

    let query = `INSERT INTO reimbursements (${columns}) VALUES (${placeHolders}) RETURNING ${Reimbursement.getColumns()}`;
    logQuery(query, values);

    const result = await db.query(query, values);
    return result.rows[0];
}