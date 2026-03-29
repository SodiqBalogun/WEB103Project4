import { pool } from '../config/database.js'

function nilInt(v) {
	if (v === '' || v === undefined || v === null) return null
	const n = Number(v)
	return Number.isNaN(n) ? null : n
}

// Exteriors
export async function getAllExteriors() {
	const res = await pool.query('SELECT * FROM exteriors ORDER BY id')
	return res.rows
}

export async function getExteriorById(id) {
	const res = await pool.query('SELECT * FROM exteriors WHERE id = $1', [id])
	return res.rows[0]
}

// Wheels
export async function getAllWheels() {
	const res = await pool.query('SELECT * FROM wheels ORDER BY id')
	return res.rows
}

export async function getWheelById(id) {
	const res = await pool.query('SELECT * FROM wheels WHERE id = $1', [id])
	return res.rows[0]
}

// Roofs
export async function getAllRoofs() {
	const res = await pool.query('SELECT * FROM roofs ORDER BY id')
	return res.rows
}

export async function getRoofById(id) {
	const res = await pool.query('SELECT * FROM roofs WHERE id = $1', [id])
	return res.rows[0]
}

// Interiors
export async function getAllInteriors() {
	const res = await pool.query('SELECT * FROM interiors ORDER BY id')
	return res.rows
}

export async function getInteriorById(id) {
	const res = await pool.query('SELECT * FROM interiors WHERE id = $1', [id])
	return res.rows[0]
}

// Cars (custom items)
export async function getAllCars() {
	const res = await pool.query('SELECT * FROM cars ORDER BY id')
	return res.rows
}

export async function getCarById(id) {
	const res = await pool.query('SELECT * FROM cars WHERE id = $1', [id])
	return res.rows[0]
}

export async function createCar(car) {
	const { name, exterior_id, wheel_id, roof_id, interior_id, notes, price } = car
	const res = await pool.query(
		`INSERT INTO cars (name, exterior_id, wheel_id, roof_id, interior_id, notes, price)
     VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
		[
			name,
			nilInt(exterior_id),
			nilInt(wheel_id),
			nilInt(roof_id),
			nilInt(interior_id),
			notes || null,
			price || 0,
		]
	)
	return res.rows[0]
}

export async function updateCar(id, car) {
	const { name, exterior_id, wheel_id, roof_id, interior_id, notes, price } = car
	const res = await pool.query(
		`UPDATE cars SET name=$1, exterior_id=$2, wheel_id=$3, roof_id=$4, interior_id=$5, notes=$6, price=$7
     WHERE id=$8 RETURNING *`,
		[
			name,
			nilInt(exterior_id),
			nilInt(wheel_id),
			nilInt(roof_id),
			nilInt(interior_id),
			notes || null,
			price || 0,
			id,
		]
	)
	return res.rows[0]
}

export async function deleteCar(id) {
	const res = await pool.query('DELETE FROM cars WHERE id=$1 RETURNING *', [id])
	return res.rows[0]
}
