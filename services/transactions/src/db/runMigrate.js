import dotenv from "dotenv";
dotenv.config();

import { migrate } from "./migrate.js";
import { pool } from "./client.js";

migrate()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (err) => {
    console.error("❌ Migrace selhala", err);
    try {
      await pool.end();
    } catch {
      /* ignore */
    }
    process.exit(1);
  });
