const API_BASE = import.meta.env.VITE_API_URL || ''

async function handleRes(res) {
  const json = await res.json().catch(() => null)
  if (!res.ok) throw new Error((json && json.error) || res.statusText || 'API error')
  return json
}

export async function getExteriors() {
  const res = await fetch(`${API_BASE}/api/exteriors`)
  return handleRes(res)
}

export async function getWheels() {
  const res = await fetch(`${API_BASE}/api/wheels`)
  return handleRes(res)
}

export async function getRoofs() {
  const res = await fetch(`${API_BASE}/api/roofs`)
  return handleRes(res)
}

export async function getInteriors() {
  const res = await fetch(`${API_BASE}/api/interiors`)
  return handleRes(res)
}

export async function getAllCars() {
  const res = await fetch(`${API_BASE}/api/cars`)
  return handleRes(res)
}

export async function getCar(id) {
  const res = await fetch(`${API_BASE}/api/cars/${id}`)
  return handleRes(res)
}

export async function createCar(payload) {
  const res = await fetch(`${API_BASE}/api/cars`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return handleRes(res)
}

export async function updateCar(id, payload) {
  const res = await fetch(`${API_BASE}/api/cars/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  return handleRes(res)
}

export async function deleteCar(id) {
  const res = await fetch(`${API_BASE}/api/cars/${id}`, { method: 'DELETE' })
  return handleRes(res)
}
