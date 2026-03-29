import { pool } from './database.js'
import { fileURLToPath } from 'url'
import path from 'path'

async function ensureColumn(table, definition) {
	await pool.query(`ALTER TABLE ${table} ADD COLUMN IF NOT EXISTS ${definition}`)
}

async function seedOptionIfMissing(table, name, price, imageUrl) {
	await pool.query(
		`INSERT INTO ${table} (name, price, image_url)
     SELECT $1::text, $2::numeric, $3::text
     WHERE NOT EXISTS (SELECT 1 FROM ${table} WHERE name = $1)`,
		[name, price, imageUrl]
	)
}

async function reset() {
	try {
		await pool.query(`
			CREATE TABLE IF NOT EXISTS exteriors (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				price NUMERIC DEFAULT 0,
				image_url TEXT
			)`)
		await pool.query(`
			CREATE TABLE IF NOT EXISTS wheels (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				price NUMERIC DEFAULT 0,
				image_url TEXT
			)`)
		await pool.query(`
			CREATE TABLE IF NOT EXISTS roofs (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				price NUMERIC DEFAULT 0,
				image_url TEXT
			)`)
		await pool.query(`
			CREATE TABLE IF NOT EXISTS interiors (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				price NUMERIC DEFAULT 0,
				image_url TEXT
			)`)
		await pool.query(`
			CREATE TABLE IF NOT EXISTS cars (
				id SERIAL PRIMARY KEY,
				name TEXT NOT NULL,
				exterior_id INTEGER REFERENCES exteriors(id) ON DELETE SET NULL,
				wheel_id INTEGER REFERENCES wheels(id) ON DELETE SET NULL,
				roof_id INTEGER REFERENCES roofs(id) ON DELETE SET NULL,
				interior_id INTEGER REFERENCES interiors(id) ON DELETE SET NULL,
				notes TEXT,
				price NUMERIC DEFAULT 0,
				created_at TIMESTAMP DEFAULT now()
			)`)

		await ensureColumn('cars', 'roof_id INTEGER REFERENCES roofs(id) ON DELETE SET NULL')
		await ensureColumn('cars', 'interior_id INTEGER REFERENCES interiors(id) ON DELETE SET NULL')

		for (const [name, price, url] of [
			['Red', 500, '/exteriors/red.png'],
			['Blue', 400, '/exteriors/blue.png'],
			['Black', 0, '/exteriors/black.png'],
			['White', 300, '/exteriors/white.png'],
			['Silver', 350, '/exteriors/silver.png'],
		]) {
			await seedOptionIfMissing('exteriors', name, price, url)
		}

		for (const [name, price, url] of [
			['Standard', 0, '/wheels/standard.png'],
			['Sport', 800, '/wheels/sport.png'],
			['Offroad', 700, '/wheels/offroad.png'],
			['Racing', 1200, '/wheels/racing.png'],
			['Chrome', 950, '/wheels/chrome.png'],
		]) {
			await seedOptionIfMissing('wheels', name, price, url)
		}

		for (const [name, price, url] of [
			['Body-color', 0, '/roofs/body.png'],
			['Panoramic glass', 1200, '/roofs/panoramic.png'],
			['Carbon fiber', 2500, '/roofs/carbon.png'],
			['Soft top', 1800, '/roofs/softtop.png'],
			['Contrasting black', 400, '/roofs/black.png'],
		]) {
			await seedOptionIfMissing('roofs', name, price, url)
		}

		for (const [name, price, url] of [
			['Black cloth', 0, '/interiors/black-cloth.png'],
			['Tan leather', 800, '/interiors/tan-leather.png'],
			['Red accent', 600, '/interiors/red-accent.png'],
			['Premium white', 1100, '/interiors/premium-white.png'],
			['Sport alcantara', 950, '/interiors/alcantara.png'],
		]) {
			await seedOptionIfMissing('interiors', name, price, url)
		}

		console.log('Database reset complete')
		process.exit(0)
	} catch (err) {
		console.error('Reset error', err)
		process.exit(1)
	}
}

const __filename = fileURLToPath(import.meta.url)
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
	reset()
}

export default reset
