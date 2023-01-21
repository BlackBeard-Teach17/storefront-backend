import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
    POSTGRES_HOST,
    POSTGRES_PORT,
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_DB,
    ENV
} = process.env;

let client;

if (ENV == 'Dev'){
    client = new Pool({
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB
    });
}

if (ENV == 'Test'){
    client = new Pool ({
        host: POSTGRES_HOST,
        port: Number(POSTGRES_PORT),
        user: POSTGRES_USER,
        password: POSTGRES_PASSWORD,
        database: POSTGRES_DB
    });
}

export default client;