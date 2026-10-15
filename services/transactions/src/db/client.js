import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

//max 10
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
//fronta - FIFO First In first out



export const db = drizzle(pool);
