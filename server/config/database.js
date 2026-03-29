import pg from 'pg'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// .env lives in server/; reset.js runs with cwd server/config, so default dotenv would miss it
dotenv.config({ path: path.resolve(__dirname, '../.env') })

// Determine whether to use SSL. Render Postgres requires SSL; local DBs usually do not.
const useSSL = (process.env.PGSSL === 'true') || (process.env.PGSSLMODE === 'require') || ((process.env.PGHOST || '').endsWith('.render.com'))

const config = {
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  port: process.env.PGPORT,
  database: process.env.PGDATABASE,
  ssl: useSSL ? { rejectUnauthorized: false } : false
}

export const pool = new pg.Pool(config)