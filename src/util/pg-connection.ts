import { roles } from "../models/Role";
import { Pool } from 'pg';

const db = new Pool({
    host: 'localhost',
    database: 'postgres',
    user: process.env.PROJECT_NAME,
    password: process.env.PROJECT_PASSWORD,
    port: 5432,
});

process.on('SIGINT', () => {
    console.log('Closing pool...');
    db.end();
    console.log('Pool closed successfully.');
    process.exit();
});

export default db; 
